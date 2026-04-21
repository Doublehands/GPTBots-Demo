/**
 * 主页：视差微动效与卡片入场（尊重 prefers-reduced-motion）
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const orbs = document.querySelectorAll(".hub-orb");
  let tx = 0;
  let ty = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tx = (e.clientX - cx) / cx;
      ty = (e.clientY - cy) / cy;
    },
    { passive: true }
  );

  function tick() {
    orbs.forEach((el, i) => {
      const f = (i + 1) * 6;
      el.style.transform = `translate(${tx * f}px, ${ty * f}px)`;
    });
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  const cards = document.querySelectorAll(".hub-card");
  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 80 + i * 90);
    });
  });
})();
