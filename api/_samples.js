// Three demo personas — each generates a realistic multi-month statement
// with planted zombies + silent hikes so the detector has something to find.

function charges(desc, amount, { from = 1, to = 7, day = 10, hikeFrom, hikeAmount }) {
  const rows = [];
  for (let m = from; m <= to; m++) {
    const amt = hikeFrom && m >= hikeFrom ? hikeAmount : amount;
    rows.push(`2026-0${m}-${day},${desc},-${amt}`);
  }
  return rows;
}

function build(subs, noise = []) {
  const rows = ["date,description,amount"];
  subs.forEach((s) => rows.push(...charges(s.desc, s.amt, s)));
  noise.forEach((n) => rows.push(n));
  return rows.join("\n");
}

const professional = build(
  [
    { desc: "UPI-NETFLIX ENTERTAINMENT", amt: 499, day: "06", hikeFrom: 3, hikeAmount: 649 },
    { desc: "UPI-SPOTIFY INDIA", amt: 119, day: "11" },
    { desc: "AUTOPAY-CULT FIT GYM MANDATE", amt: 1499, day: "12", from: 1, to: 3 }, // zombie
    { desc: "UPI-ADOBE SYSTEMS SOFTWARE", amt: 1299, day: "15", hikeFrom: 3, hikeAmount: 1699 },
    { desc: "MANDATE-ICLOUD APPLE STORAGE", amt: 219, day: "20" },
    { desc: "UPI-CHATGPT PLUS TRIAL", amt: 1999, day: "18", from: 7, to: 7 }, // trial about to recur
  ],
  ["2026-01-05,SALARY CREDIT ACME CORP,85000", "2026-03-24,POS-MYNTRA SHOPPING,-3200", "2026-05-18,POS-SWIGGY ORDER,-560"]
);

const student = build(
  [
    { desc: "UPI-SPOTIFY STUDENT", amt: 59, day: "08" },
    { desc: "UPI-NETFLIX MOBILE", amt: 199, day: "10" },
    { desc: "UPI-YOUTUBE PREMIUM", amt: 129, day: "12", hikeFrom: 4, hikeAmount: 149 },
    { desc: "UPI-LEETCODE PREMIUM", amt: 299, day: "14", from: 1, to: 2 }, // zombie
    { desc: "UPI-CANVA PRO", amt: 499, day: "18" },
    { desc: "UPI-CHEGG STUDY TRIAL", amt: 499, day: "16", from: 7, to: 7 }, // trial about to recur
  ],
  ["2026-01-03,UPI-POCKET MONEY FROM DAD,5000", "2026-04-22,POS-CAMPUS CANTEEN,-240"]
);

const family = build(
  [
    { desc: "UPI-NETFLIX PREMIUM", amt: 649, day: "05" },
    { desc: "UPI-HOTSTAR SUBSCRIPTION", amt: 299, day: "07" },
    { desc: "UPI-AMAZON PRIME", amt: 299, day: "09" },
    { desc: "UPI-YOUTUBE PREMIUM FAMILY", amt: 189, day: "11" },
    { desc: "MANDATE-ICLOUD APPLE STORAGE", amt: 219, day: "13" },
    { desc: "UPI-GOOGLE ONE STORAGE", amt: 130, day: "15", hikeFrom: 4, hikeAmount: 210 },
    { desc: "AUTOPAY-CULT FIT GYM MANDATE", amt: 1499, day: "16", from: 1, to: 2 }, // zombie
    { desc: "UPI-AUDIBLE MEMBERSHIP", amt: 199, day: "19" },
    { desc: "UPI-TIMES PRIME", amt: 133, day: "22" },
    { desc: "UPI-DISNEY PLUS TRIAL", amt: 299, day: "15", from: 7, to: 7 }, // trial about to recur
  ],
  ["2026-01-05,SALARY CREDIT,145000", "2026-02-14,POS-BIGBASKET,-4200"]
);

export const SAMPLES = {
  professional: { label: "Working Professional", desc: "SaaS + OTT heavy · Netflix, Adobe, gym", csv: professional, unused: ["cult fit", "cult"] },
  student:      { label: "College Student", desc: "Tight budget, shared plans, a dead coding sub", csv: student, unused: [] },
  family:       { label: "Family Plan", desc: "Many OTTs + storage, an abandoned gym", csv: family, unused: ["cult fit", "cult"] },
};

export const SAMPLE_LIST = Object.entries(SAMPLES).map(([id, s]) => ({ id, label: s.label, desc: s.desc }));
