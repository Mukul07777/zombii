// Render a shareable "leak card" as a PNG and download it. No dependencies.
export function downloadLeakCard(summary, name = "You") {
  const W = 1080, H = 1080;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");

  // background
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#141518"); g.addColorStop(1, "#221410");
  x.fillStyle = g; x.fillRect(0, 0, W, H);

  // glow
  const rg = x.createRadialGradient(W * 0.8, 120, 40, W * 0.8, 120, 620);
  rg.addColorStop(0, "rgba(247,148,29,0.28)"); rg.addColorStop(1, "rgba(247,148,29,0)");
  x.fillStyle = rg; x.fillRect(0, 0, W, H);

  x.textBaseline = "top";
  // brand
  x.fillStyle = "#f7941d";
  x.font = "800 46px Poppins, sans-serif";
  x.fillText("🧟 Zombii", 80, 90);

  // label
  x.fillStyle = "#93949c";
  x.font = "500 34px Inter, sans-serif";
  x.fillText(`${name} is quietly leaking`, 80, 300);

  // big number
  const grad = x.createLinearGradient(80, 0, 900, 0);
  grad.addColorStop(0, "#f9a825"); grad.addColorStop(1, "#e23e2e");
  x.fillStyle = grad;
  x.font = "800 180px Poppins, sans-serif";
  x.fillText(`₹${summary.totalLeak.toLocaleString("en-IN")}`, 76, 360);

  x.fillStyle = "#f6f6f8";
  x.font = "600 44px Poppins, sans-serif";
  x.fillText("every single year.", 80, 580);

  // stats row
  const stats = [
    [summary.count, "subscriptions"],
    [summary.zombies, "zombies 🧟"],
    [summary.hikes, "silent hikes"],
  ];
  stats.forEach(([n, t], i) => {
    const bx = 80 + i * 320;
    x.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(x, bx, 720, 290, 180, 24); x.fill();
    x.fillStyle = "#f7941d";
    x.font = "800 70px Poppins, sans-serif";
    x.fillText(String(n), bx + 30, 748);
    x.fillStyle = "#93949c";
    x.font = "500 28px Inter, sans-serif";
    x.fillText(t, bx + 30, 838);
  });

  x.fillStyle = "#6b6c74";
  x.font = "500 28px Inter, sans-serif";
  x.fillText("Find what's draining your account → zombii.app", 80, 970);

  const link = document.createElement("a");
  link.download = "my-zombii-leak.png";
  link.href = c.toDataURL("image/png");
  link.click();
}

function roundRect(x, X, Y, w, h, r) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + w, Y, X + w, Y + h, r);
  x.arcTo(X + w, Y + h, X, Y + h, r);
  x.arcTo(X, Y + h, X, Y, r);
  x.arcTo(X, Y, X + w, Y, r);
  x.closePath();
}
