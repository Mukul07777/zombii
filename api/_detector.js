// Zombii detection engine (shared by serverless functions)
// Pure logic + embedded demo dataset.

export const SAMPLE_CSV = `date,description,amount
2026-01-05,SALARY CREDIT ACME CORP,85000
2026-01-06,UPI-NETFLIX ENTERTAINMENT REF9921,-499
2026-01-08,POS-BIGBASKET GROCERY,-2340
2026-01-11,UPI-SPOTIFY INDIA,-119
2026-01-12,AUTOPAY-CULT FIT GYM MANDATE,-1499
2026-01-15,UPI-ADOBE SYSTEMS SOFTWARE,-1299
2026-01-18,POS-SWIGGY ORDER,-560
2026-01-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-01-27,POS-SHELL FUEL,-2000
2026-02-05,SALARY CREDIT ACME CORP,85000
2026-02-06,UPI-NETFLIX ENTERTAINMENT REF1122,-499
2026-02-11,UPI-SPOTIFY INDIA,-119
2026-02-12,AUTOPAY-CULT FIT GYM MANDATE,-1499
2026-02-15,UPI-ADOBE SYSTEMS SOFTWARE,-1299
2026-02-19,POS-ZOMATO ORDER,-430
2026-02-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-03-06,UPI-NETFLIX ENTERTAINMENT REF3341,-649
2026-03-11,UPI-SPOTIFY INDIA,-119
2026-03-12,AUTOPAY-CULT FIT GYM MANDATE,-1499
2026-03-15,UPI-ADOBE SYSTEMS SOFTWARE,-1699
2026-03-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-03-24,POS-MYNTRA SHOPPING,-3200
2026-04-06,UPI-NETFLIX ENTERTAINMENT REF5567,-649
2026-04-11,UPI-SPOTIFY INDIA,-119
2026-04-15,UPI-ADOBE SYSTEMS SOFTWARE,-1699
2026-04-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-05-06,UPI-NETFLIX ENTERTAINMENT REF6621,-649
2026-05-11,UPI-SPOTIFY INDIA,-119
2026-05-15,UPI-ADOBE SYSTEMS SOFTWARE,-1699
2026-05-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-06-06,UPI-NETFLIX ENTERTAINMENT REF7734,-649
2026-06-11,UPI-SPOTIFY INDIA,-119
2026-06-15,UPI-ADOBE SYSTEMS SOFTWARE,-1699
2026-06-20,MANDATE-ICLOUD APPLE STORAGE,-219
2026-07-06,UPI-NETFLIX ENTERTAINMENT REF8890,-649
2026-07-11,UPI-SPOTIFY INDIA,-119
2026-07-15,UPI-ADOBE SYSTEMS SOFTWARE,-1699
2026-07-20,MANDATE-ICLOUD APPLE STORAGE,-219`;

export const DEMO_TODAY = "2026-07-25";
export const DEMO_UNUSED = ["cult fit", "cult"];

const KNOWN = {
  netflix:  { cat: "Entertainment", color: "#e50914", icon: "N",  domain: "netflix.com" },
  spotify:  { cat: "Entertainment", color: "#1db954", icon: "S",  domain: "spotify.com" },
  prime:    { cat: "Shopping",      color: "#ff9900", icon: "P",  domain: "primevideo.com" },
  amazon:   { cat: "Shopping",      color: "#ff9900", icon: "A",  domain: "amazon.com" },
  adobe:    { cat: "Productivity",  color: "#ed2224", icon: "Ad", domain: "adobe.com" },
  icloud:   { cat: "Storage",       color: "#3693f3", icon: "☁", domain: "icloud.com" },
  apple:    { cat: "Storage",       color: "#555",    icon: "",   domain: "apple.com" },
  cult:     { cat: "Health",        color: "#f2385a", icon: "C",  domain: "cult.fit" },
  gym:      { cat: "Health",        color: "#f2385a", icon: "G",  domain: "cult.fit" },
  youtube:  { cat: "Entertainment", color: "#ff0000", icon: "Y",  domain: "youtube.com" },
  hotstar:  { cat: "Entertainment", color: "#1f80e0", icon: "H",  domain: "hotstar.com" },
  notion:   { cat: "Productivity",  color: "#111",    icon: "N",  domain: "notion.so" },
  linkedin: { cat: "Productivity",  color: "#0a66c2", icon: "in", domain: "linkedin.com" },
  chatgpt:  { cat: "Productivity",  color: "#10a37f", icon: "AI", domain: "openai.com" },
  disney:   { cat: "Entertainment", color: "#113ccf", icon: "D+", domain: "disneyplus.com" },
  chegg:    { cat: "Productivity",  color: "#ea6100", icon: "Ch", domain: "chegg.com" },
};

const TRIAL_HINT = /premium|plus|pro|trial|subscription|membership|prime/i;

const CADENCE_DAYS = { monthly: 30, weekly: 7, yearly: 365, quarterly: 91 };

export function cleanMerchant(raw) {
  let s = raw.toLowerCase();
  s = s.replace(/\b(upi|pos|neft|imps|ach|mandate|autopay|debit|payment|txn|ref|no|id|inr|rs)\w*/g, " ");
  s = s.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const stop = new Set(["to", "from", "the", "ltd", "pvt", "india", "services", "subscription", "entertainment", "systems", "software", "store", "membership", "ref", "txn"]);
  const words = s.split(" ").filter((w) => w.length > 2 && !stop.has(w));
  return words.slice(0, 2).join(" ") || raw.trim();
}

function metaFor(name) {
  const key = Object.keys(KNOWN).find((k) => name.toLowerCase().includes(k));
  return key ? KNOWN[key] : { cat: "Other", color: "#7c3aed", icon: name.slice(0, 1).toUpperCase(), domain: null };
}

function detectCadence(dates) {
  if (dates.length < 2) return null;
  const gaps = [];
  for (let i = 1; i < dates.length; i++) gaps.push((dates[i] - dates[i - 1]) / 86400000);
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (avg >= 25 && avg <= 35) return { label: "monthly", perYear: 12 };
  if (avg >= 6 && avg <= 8) return { label: "weekly", perYear: 52 };
  if (avg >= 350 && avg <= 380) return { label: "yearly", perYear: 1 };
  if (avg >= 85 && avg <= 95) return { label: "quarterly", perYear: 4 };
  return null;
}

// Detection confidence (0-100): more charges + more regular gaps = higher.
function confidenceOf(dates) {
  if (dates.length < 2) return 0;
  const gaps = [];
  for (let i = 1; i < dates.length; i++) gaps.push((dates[i] - dates[i - 1]) / 86400000);
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length || 1;
  const variance = gaps.reduce((a, g) => a + (g - avg) ** 2, 0) / gaps.length;
  const cv = Math.sqrt(variance) / avg;          // coefficient of variation
  const regularity = Math.max(0, 1 - cv);         // 1 = perfectly regular
  const volume = Math.min(1, (dates.length - 1) / 5); // more charges = surer
  return Math.round(Math.min(99, 55 + (regularity * 0.55 + volume * 0.45) * 44));
}

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function analyze(transactions, opts = {}) {
  const today = opts.today ? new Date(opts.today) : new Date();
  const groups = {};
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const name = cleanMerchant(t.description);
    (groups[name] ||= []).push({ date: new Date(t.date), amount: Math.abs(t.amount) });
  }

  const subscriptions = [];
  for (const [name, txns] of Object.entries(groups)) {
    txns.sort((a, b) => a.date - b.date);
    const dates = txns.map((t) => t.date);
    const cadence = detectCadence(dates);
    if (!cadence || txns.length < 2) continue;

    const meta = metaFor(name);
    const latest = txns[txns.length - 1];
    const first = txns[0];
    const monthly =
      cadence.label === "yearly" ? Math.round(latest.amount / 12)
      : cadence.label === "weekly" ? Math.round(latest.amount * 4.3)
      : cadence.label === "quarterly" ? Math.round(latest.amount / 3)
      : latest.amount;

    const priceRose = latest.amount > first.amount * 1.05;
    const hikePct = Math.round(((latest.amount - first.amount) / first.amount) * 100);
    const daysSinceLast = (today - latest.date) / 86400000;
    const expectedGap = cadence.label === "monthly" ? 31 : cadence.label === "weekly" ? 8 : 366;
    const stale = daysSinceLast > expectedGap * 1.5;
    const ageMonths = Math.round((latest.date - first.date) / (86400000 * 30));
    const zombie = stale || (opts.unused || []).includes(name);

    let score = 0;
    if (zombie) score += 45;
    if (priceRose) score += 30;
    score += Math.min(25, Math.round((monthly / 1500) * 25));
    score = Math.min(100, score);

    let action = "keep", actLabel = "✓ Keep it", save = 0, type = "active";
    if (zombie) {
      action = "cancel"; type = "zombie"; save = monthly * 12;
      actLabel = `✕ Cancel — save ₹${save.toLocaleString("en-IN")}/yr`;
    } else if (priceRose) {
      action = "downgrade"; type = "hike";
      save = Math.round((latest.amount - first.amount) * cadence.perYear);
      actLabel = "↓ Downgrade / renegotiate";
    } else if (monthly > 800) {
      action = "downgrade"; type = "review";
      save = Math.round(monthly * 12 * 0.3);
      actLabel = "↓ Cheaper plan available";
    }

    const flag = zombie
      ? { txt: `Zombie: no charge in ${Math.round(daysSinceLast)} days`, warn: true }
      : priceRose
      ? { txt: `Silent hike: ₹${first.amount} → ₹${latest.amount} (+${hikePct}%)`, warn: true }
      : { txt: `Active · ${cadence.label} · fair price`, warn: false };

    // predicted next charge (from last charge + cadence interval)
    const intervalDays = CADENCE_DAYS[cadence.label] || 30;
    const nextDate = new Date(latest.date.getTime() + intervalDays * 86400000);
    const daysUntil = Math.round((nextDate - today) / 86400000);

    subscriptions.push({
      name: titleCase(name), cat: meta.cat, color: meta.color, icon: meta.icon, domain: meta.domain,
      price: monthly, cadence: cadence.label, annual: monthly * 12,
      score, type, action, actLabel, save, flag, hikePct: priceRose ? hikePct : 0,
      charges: txns.length, ageMonths,
      firstCharge: first.amount, latestCharge: latest.amount,
      nextChargeDate: nextDate.toISOString().slice(0, 10), daysUntil,
      confidence: confidenceOf(dates),
      history: txns.map((t) => ({ date: t.date.toISOString().slice(0, 10), amount: t.amount })),
    });
  }

  // monthly recurring-spend trend (sum of all detected subscription charges per month)
  const trendMap = {};
  subscriptions.forEach((s) =>
    s.history.forEach((h) => {
      const m = h.date.slice(0, 7);
      trendMap[m] = (trendMap[m] || 0) + h.amount;
    })
  );
  const trend = Object.entries(trendMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));

  // overlap / duplicate detection: 2+ subscriptions in the same category
  const catGroups = {};
  subscriptions.forEach((s) => (catGroups[s.cat] ||= []).push(s));
  const overlaps = Object.entries(catGroups)
    .filter(([cat, arr]) => arr.length >= 2 && cat !== "Other")
    .map(([category, arr]) => {
      const total = arr.reduce((a, s) => a + s.price, 0);
      const keep = Math.min(...arr.map((s) => s.price));
      return {
        category, count: arr.length,
        items: arr.map((s) => ({ name: s.name, price: s.price, domain: s.domain, icon: s.icon, color: s.color })),
        monthlyWaste: total - keep, annualWaste: (total - keep) * 12,
      };
    })
    .sort((a, b) => b.annualWaste - a.annualWaste);
  const overlapAnnual = overlaps.reduce((a, o) => a + o.annualWaste, 0);

  // Trial Guardian: recent single-charge subscription-like merchants likely to auto-recur
  const trials = [];
  for (const [name, txns] of Object.entries(groups)) {
    if (txns.length !== 1) continue;
    const t = txns[0];
    const daysAgo = Math.round((today - t.date) / 86400000);
    if (daysAgo < 0 || daysAgo > 45) continue;
    const meta = metaFor(name);
    const known = meta.domain != null;
    if (!known && !(TRIAL_HINT.test(name) && t.amount >= 49 && t.amount <= 2500)) continue;
    const nextDate = new Date(t.date.getTime() + 30 * 86400000);
    trials.push({
      name: titleCase(name), amount: t.amount, date: t.date.toISOString().slice(0, 10),
      daysAgo, domain: meta.domain, icon: meta.icon, color: meta.color,
      projectedAnnual: t.amount * 12,
      nextChargeDate: nextDate.toISOString().slice(0, 10),
      daysUntilNext: Math.round((nextDate - today) / 86400000),
    });
  }
  trials.sort((a, b) => a.daysUntilNext - b.daysUntilNext);

  subscriptions.sort((a, b) => b.score - a.score);
  const totalLeak = subscriptions.reduce((a, s) => a + s.save, 0);
  const monthlyRecurring = subscriptions.reduce((a, s) => a + s.price, 0);
  const overallScore = subscriptions.length
    ? Math.round(subscriptions.reduce((a, s) => a + s.score, 0) / subscriptions.length) : 0;
  const byCat = {};
  subscriptions.forEach((s) => (byCat[s.cat] = (byCat[s.cat] || 0) + s.price));

  return {
    subscriptions,
    summary: {
      totalLeak, monthlyRecurring, annualRecurring: monthlyRecurring * 12,
      count: subscriptions.length,
      zombies: subscriptions.filter((s) => s.type === "zombie").length,
      hikes: subscriptions.filter((s) => s.type === "hike").length,
      overallScore,
      byCategory: Object.entries(byCat).map(([label, value]) => ({ label, value })),
      scannedTxns: transactions.length,
      trend, overlaps, overlapAnnual, trials,
    },
  };
}

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const start = /date/.test(lines[0].toLowerCase()) ? 1 : 0;
  const out = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length < 3) continue;
    const date = parts[0].trim();
    const amount = parseFloat(parts[parts.length - 1].replace(/[^\d.-]/g, ""));
    const description = parts.slice(1, parts.length - 1).join(",").trim();
    if (!date || isNaN(amount)) continue;
    out.push({ date, description, amount });
  }
  return out;
}

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
