/* ── cursor.js — shared cursor logic ── */
(function () {
  if (matchMedia('(pointer:coarse)').matches) return;

  const ring = document.getElementById('cur-ring');
  const dot  = document.getElementById('cur-dot');
  if (!ring || !dot) return;

  let mx = innerWidth  / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  /* dot follows mouse instantly */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });

  /* ring lags behind */
  (function lag() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(lag);
  })();

  /* expand on hover — page scripts can call cursorHover(selector) to add more targets */
  function bindHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '74px';
        ring.style.height = '74px';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '48px';
        ring.style.height = '48px';
      });
    });
  }

  /* default: all links & buttons */
  document.addEventListener('DOMContentLoaded', () => bindHover('a, button'));

  /* expose helper for page-level extras */
  window.cursorHover = bindHover;
})();
