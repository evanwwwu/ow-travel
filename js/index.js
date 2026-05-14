/* ── index.js — kinetic typography + parallax ── */
const isTouch   = matchMedia('(pointer:coarse)').matches;
const textLayer = document.getElementById('text-layer');
const photo     = document.getElementById('photo');
let pnx = 0, pny = 0;

if (!isTouch) {
  document.addEventListener('mousemove', e => {
    pnx = e.clientX / innerWidth  - 0.5;
    pny = e.clientY / innerHeight - 0.5;
  });
  (function pl() {
    textLayer.style.transform = `translate(${pnx * -18}px,${pny * -12}px)`;
    photo.style.transform     = `translate(${pnx * 12}px,${pny * 8}px) scale(1.06)`;
    requestAnimationFrame(pl);
  })();
}

/* ── Build per-character spans ── */
document.querySelectorAll('.word[data-word]').forEach(word => {
  [...word.dataset.word].forEach(ch => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = ch;
    word.appendChild(s);
  });
});

/* ── Animation constants ── */
const ROW_ORDER       = ['.w-course', '.w-2026', '.w-water', '.w-deeper', '.w-dive', '.w-open'];
const CHAIN_DELAY     = 70;
const GATHER_LEADER   = 550;
const GATHER_FOLLOWER = 800;
const RETURN_LEADER   = 450;
const RETURN_FOLLOWER = 650;
const ROW_DELAY       = 100;
const HOLD_MS         = 5000;
const EASE_LEADER     = 'cubic-bezier(0.5, 0, 0, 1)';
const EASE_FOLLOWER   = 'cubic-bezier(0.4, 0, 0.2, 1)';
const EASE_RETURN     = 'cubic-bezier(0.16, 1, 0.3, 1)';

function getOffset(wordEl) {
  const rect = wordEl.getBoundingClientRect();
  const cls  = wordEl.classList;
  const s    = Math.min(innerWidth / 1440, 1);
  if (cls.contains('w-open'))  return (innerWidth / 2) - rect.right - 45 * s;
  if (cls.contains('w-water')) return (innerWidth / 2) - rect.left  - 20 * s;
  return innerWidth / 2 - (rect.left + rect.width / 2);
}

function chainLogic(wordEl, startMs, isReturning = false) {
  const letters = Array.from(wordEl.querySelectorAll('.ch'));
  const side    = wordEl.dataset.side;
  const offset  = isReturning ? 0 : getOffset(wordEl);

  const ordered = isReturning
    ? (side === 'right' ? [...letters].reverse() : letters)
    : (side === 'right' ? letters : [...letters].reverse());

  let maxFinish = startMs;
  ordered.forEach((ch, i) => {
    const isLeader = (i === 0);
    const delay    = startMs + i * CHAIN_DELAY;
    const dur      = isReturning
      ? (isLeader ? RETURN_LEADER : RETURN_FOLLOWER)
      : (isLeader ? GATHER_LEADER : GATHER_FOLLOWER);
    const ease     = isReturning ? EASE_RETURN : (isLeader ? EASE_LEADER : EASE_FOLLOWER);

    if (delay + dur > maxFinish) maxFinish = delay + dur;
    setTimeout(() => {
      ch.style.transition = `transform ${dur}ms ${ease}`;
      ch.style.transform  = `translateX(${offset}px)`;
    }, delay);
  });
  return maxFinish;
}

let uiShown = false;
function runCycle() {
  let currentTime  = 0;
  let latestGather = 0;

  ROW_ORDER.forEach(sel => {
    const wordEl = document.querySelector(sel);
    const finish = chainLogic(wordEl, currentTime, false);
    if (finish > latestGather) latestGather = finish;
    currentTime += ROW_DELAY;
  });

  if (!uiShown) {
    setTimeout(() => {
      document.querySelectorAll('.micro, #ui-start, #ui-badges, #ui-cta').forEach(el => el.style.opacity = '1');
      uiShown = true;
    }, latestGather - 500);
  }

  setTimeout(() => {
    let returnCursor = 0;
    let latestReturn = 0;
    ROW_ORDER.forEach(sel => {
      const wordEl = document.querySelector(sel);
      const finish = chainLogic(wordEl, returnCursor, true);
      if (finish > latestReturn) latestReturn = finish;
      returnCursor += ROW_DELAY;
    });
    setTimeout(runCycle, latestReturn + 1000);
  }, latestGather + HOLD_MS);
}

document.fonts.ready.then(() => runCycle());

/* ── Canvas background (reserved) ── */
const canvas = document.getElementById('geo');
const ctx    = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);
(function drawGeo() { ctx.clearRect(0, 0, W, H); requestAnimationFrame(drawGeo); })();
