// ── CONFIG ── 將 Google Apps Script 部署後的 URL 貼在這裡
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

// ── STATS ──────────────────────────────────────────────────
async function fetchStats() {
  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') return;

  try {
    const res  = await fetch(APPS_SCRIPT_URL, { cache: 'no-store' });
    const data = await res.json();

    const totalEl = document.getElementById('stat-total');
    if (totalEl) {
      totalEl.innerHTML = '';
      animateCount(totalEl, data.total ?? 0);
    }

    const updEl = document.getElementById('stat-updated');
    if (updEl && data.updatedAt) updEl.textContent = data.updatedAt;

  } catch (_) {
    const updEl = document.getElementById('stat-updated');
    if (updEl) updEl.textContent = '無法讀取';
  }
}

function animateCount(el, target) {
  const duration = 800;
  const start    = performance.now();
  (function step(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * ease);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

fetchStats();

// ── CURSOR ──
const curRing = document.getElementById('cur-ring');
const curDot  = document.getElementById('cur-dot');
if (curRing && curDot) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    rx += (mx - rx) * .15;
    ry += (my - ry) * .15;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    curDot.style.left  = mx + 'px';
    curDot.style.top   = my + 'px';
    requestAnimationFrame(tick);
  })();
}

// ── FORM ──
const form        = document.getElementById('reg-form');
const submitBtn   = document.getElementById('submit-btn');
const errorBanner = document.getElementById('error-banner');
const successScr  = document.getElementById('success-screen');

const REQUIRED_FIELDS = ['name', 'phone', 'email', 'count'];

function getVal(name) {
  const el = form.elements[name];
  if (!el) return '';
  return el.value.trim();
}

function validate() {
  let ok = true;
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());

  REQUIRED_FIELDS.forEach(name => {
    if (!getVal(name)) {
      ok = false;
      markError(name);
    }
  });

  const emailVal = getVal('email');
  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    ok = false;
    markError('email', 'Email 格式不正確');
  }

  return ok;
}

function markError(name, msg) {
  const el = form.elements[name];
  if (!el) return;
  el.classList.add('error');
  const span = document.createElement('span');
  span.className = 'field-error';
  span.textContent = msg || '此欄位為必填';
  if (!el.parentNode.querySelector('.field-error')) {
    el.parentNode.appendChild(span);
  }
}

function collectData() {
  return {
    timestamp: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    name:      getVal('name'),
    phone:     getVal('phone'),
    email:     getVal('email'),
    count:     getVal('count'),
    notes:     getVal('notes'),
  };
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorBanner.classList.remove('show');

  if (!validate()) {
    errorBanner.classList.add('show');
    window.scrollTo({ top: errorBanner.offsetTop - 80, behavior: 'smooth' });
    return;
  }

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
    alert('請先在 js/register.js 設定 APPS_SCRIPT_URL');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  const data = collectData();

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify(data),
    });

    // no-cors returns opaque response — assume success if no network error
    form.style.display = 'none';
    successScr.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    errorBanner.textContent = '送出失敗，請稍後再試，或直接聯繫我們。';
    errorBanner.classList.add('show');
  }
});

form.addEventListener('input', e => {
  e.target.classList.remove('error');
  const fe = e.target.parentNode.querySelector('.field-error');
  if (fe) fe.remove();
  errorBanner.classList.remove('show');
});
form.addEventListener('change', e => {
  e.target.classList.remove('error');
});
