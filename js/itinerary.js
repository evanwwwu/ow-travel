/* ── itinerary.js ── */

/* Cursor extras */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.cursorHover === 'function') {
    window.cursorHover('.stay-card, .incl-item, .story-panel');
  }
});

/* ── Hero parallax on scroll ── */
const heroBg = document.getElementById('heroBg');
{
  let tick = false;
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `translateY(${y * 0.38}px) scale(${1 + y * 0.0003})`;
        }
        tick = false;
      });
      tick = true;
    }
  }, { passive: true });
}

/* ── Subtle parallax on right-panel photos while scrolling ── */
{
  const panels = document.querySelectorAll('.photo-panel');
  let tick = false;
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(() => {
        panels.forEach(panel => {
          const rect = panel.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
          const shift = mid * 0.12;
          const img = panel.querySelector('img');
          if (img) img.style.transform = `translateY(${shift}px) scale(1.08)`;
        });
        tick = false;
      });
      tick = true;
    }
  }, { passive: true });
}

/* ── Scroll reveal for cards below story ── */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stay-card, .incl-item').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
  revealIO.observe(el);
});
