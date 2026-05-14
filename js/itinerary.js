/* ── itinerary.js — scroll parallax + reveal ── */

/* Extra cursor hover targets (beyond default a/button from cursor.js) */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.cursorHover === 'function') {
    window.cursorHover('.stay-card, .day-media, .incl-item');
  }
});

/* Hero parallax on scroll */
const heroBg = document.getElementById('heroBg');
let lastY = 0, ticking = false;
window.addEventListener('scroll', () => {
  lastY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      if (lastY < innerHeight) {
        heroBg.style.transform = `translateY(${lastY * 0.4}px) scale(${1 + lastY * 0.0003})`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

/* Scroll reveal via IntersectionObserver */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.day, .stay-card, .incl-item').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
  io.observe(el);
});
