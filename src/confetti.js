// Lightweight canvas confetti burst — no dependencies.
export function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const colors = ["#7c3aed", "#db2777", "#4f46e5", "#f59e0b", "#10b981", "#f43f5e"];
  const N = 140;
  const parts = Array.from({ length: N }, () => ({
    x: canvas.width / 2,
    y: canvas.height * 0.42,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -15 - 4,
    size: Math.random() * 7 + 4,
    color: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));

  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => {
      p.vy += 0.4; // gravity
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      p.life -= 0.011;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    frame++;
    if (frame < 150) requestAnimationFrame(tick);
    else canvas.remove();
  })();
}
