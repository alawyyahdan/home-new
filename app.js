'use strict';

/* ═══════════════════════ THEME TOGGLE ═══════════════════════ */
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();


/* ═══════════════════════ PDF DOCUMENTS ═══════════════════════ */
const MY_PDFS = [
  {
    name: 'Final Project Machine Learning Theory',
    desc: 'Machine Learning Theory — Final Assignment · 2025',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%205/ML%20Teo/MLT_Akhir_5.docx.pdf'
  },
  {
    name: 'Final Project Computer Vision',
    desc: 'Computer Vision Final Project Report · 2024',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%205/Comvis/Project%20Akhir%20Computer%20Vision%20Kelompok%208.pdf'
  },
  {
    name: 'Implementation of A-Star Algorithm for Shortest Path',
    desc: 'AI Final Assignment — Logistics Problem · 2024',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%204/AI/AI%20TUGAS%20AKHIR/Implementation%20of%20A-Star%20Algorithm%20for%20Shortest%20Path%20Logistic%20Problem.pdf'
  },
  {
    name: 'Eksbot Final Project',
    desc: 'Embedded Systems & Robotics Final Report · 2024',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%204/EksBot/Eksbot%20Final%20Project.pdf'
  },
  {
    name: 'Final Project IoT',
    desc: 'Internet of Things Final Project · 2024',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%204/IoT/Final%20Project%20IoT.pdf'
  },
  {
    name: 'Final Project Sensor',
    desc: 'Sensor Systems Paper · 2024',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%204/Sensor/Tugas%20Makalah.pdf'
  },
  {
    name: 'Final Project Control Systems',
    desc: 'Control Systems Final Report · 2024',
    url: 'https://drive.bica.ca/coolyeah/SMT%204/SisKon/Laporan%20Akhir%20Siskon_163231048_163231092_163221023_163231053.pdf'
  },
  {
    name: 'Final Project Linear Systems',
    desc: 'Linear Systems Final Project · 2023',
    url: 'https://drive.bica.ca/api/raw?path=/coolyeah/SMT%203/SisLin/tugas%20akhir/FINAL%20PROJECT%20REPORT%20PART%202.pdf'
  },
];

(function renderDocs() {
  const list = document.getElementById('docs-list');
  if (!list) return;
  MY_PDFS.forEach((pdf, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><button class="doc-btn" data-idx="${idx}">${pdf.name}</button><span class="doc-desc">${pdf.desc}</span></div>`;
    list.appendChild(li);
  });
  list.addEventListener('click', e => {
    const btn = e.target.closest('.doc-btn');
    if (btn) openPdf(+btn.dataset.idx);
  });
})();


/* ═══════════════════════ PDF MODAL ═══════════════════════ */
const pdfOverlay = document.getElementById('pdf-overlay');
const pdfIframe = document.getElementById('pdf-iframe');
const pdfTitle = document.getElementById('pdf-title');
const pdfLoader = document.getElementById('pdf-loader');

function openPdf(idx) {
  const pdf = MY_PDFS[idx];
  if (!pdf || !pdfOverlay) return;
  const url = `https://docs.google.com/viewer?url=${encodeURIComponent(pdf.url)}&embedded=true`;
  pdfTitle.textContent = pdf.name;
  pdfLoader.style.display = 'block';
  pdfIframe.src = '';
  pdfOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { pdfIframe.src = url; });
  pdfIframe.onload = () => { pdfLoader.style.display = 'none'; };
  setTimeout(() => { pdfLoader.style.display = 'none'; }, 9000);
}

function closePdf() {
  if (!pdfOverlay) return;
  pdfOverlay.classList.add('hidden');
  pdfIframe.src = '';
  document.body.style.overflow = '';
}

document.getElementById('pdf-close')?.addEventListener('click', closePdf);
pdfOverlay?.addEventListener('click', e => { if (e.target === pdfOverlay) closePdf(); });


/* ═══════════════════════ DONATE MODAL ═══════════════════════ */
const donateOverlay = document.getElementById('donate-overlay');
const step1 = document.getElementById('donate-step1');
const step2 = document.getElementById('donate-step2');
const QRIS_URL = 'https://apiqris.bica.ca';

window.currentTransactionId = null;
window.pollInterval = null;

function openDonate() {
  if (!donateOverlay) return;
  showStep(1);
  donateOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDonate() {
  if (!donateOverlay) return;
  donateOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  if (window.pollInterval) { clearInterval(window.pollInterval); window.pollInterval = null; }
}

function showStep(n) {
  step1?.classList.toggle('hidden', n !== 1);
  step2?.classList.toggle('hidden', n !== 2);
}

// Open triggers
document.getElementById('donate-link')?.addEventListener('click', e => { e.preventDefault(); openDonate(); });
document.getElementById('donate-footer-link')?.addEventListener('click', e => { e.preventDefault(); openDonate(); });

// Close
document.getElementById('donate-close')?.addEventListener('click', closeDonate);
donateOverlay?.addEventListener('click', e => { if (e.target === donateOverlay) closeDonate(); });

// Back button (step 2 → step 1)
document.getElementById('btn-back-qris')?.addEventListener('click', () => {
  if (window.pollInterval) { clearInterval(window.pollInterval); window.pollInterval = null; }
  showStep(1);
  document.getElementById('qris-image-container')?.classList.add('hidden');
  const lt = document.getElementById('qris-loading-text');
  if (lt) { lt.textContent = 'Generating QRIS code…'; lt.classList.remove('hidden'); }
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const inp = document.getElementById('donate-amount');
    if (inp) inp.value = btn.dataset.val;
  });
});

// Step 1 → Step 2: validate → generate QRIS
document.getElementById('btn-go-qris')?.addEventListener('click', async () => {
  const amount = +document.getElementById('donate-amount')?.value;
  const username = document.getElementById('donate-username')?.value?.trim() || 'AnonymousVisitor';

  if (!amount || amount < 10000) {
    showNotification('Minimum donation is Rp 10.000 😊');
    return;
  }

  // Move to step 2
  showStep(2);

  const loadingText = document.getElementById('qris-loading-text');
  const qrisContainer = document.getElementById('qris-image-container');
  const qrisStatusCheck = document.getElementById('qris-status-check');

  loadingText.textContent = 'Generating QRIS code…';
  loadingText.classList.remove('hidden');
  qrisContainer.classList.add('hidden');

  try {
    const res = await fetch(`${QRIS_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, player_username: username }),
    });
    const data = await res.json();

    if (data.success && data.data) {
      window.currentTransactionId = data.data.transaction_id;
      loadingText.classList.add('hidden');

      const img = document.getElementById('qris-image');
      img.src = data.data.qris_image;
      qrisContainer.classList.remove('hidden');

      // Start polling
      if (window.pollInterval) clearInterval(window.pollInterval);
      window.pollInterval = setInterval(() => checkQRISStatus(window.currentTransactionId), 5000);

    } else {
      throw new Error(data.message || 'Generation failed');
    }

  } catch (err) {
    console.error(err);
    loadingText.textContent = 'API offline — scan static QRIS below.';
    setTimeout(() => {
      loadingText.classList.add('hidden');
      const img = document.getElementById('qris-image');
      img.src = '../icons/qris.jpg';
      qrisContainer.classList.remove('hidden');
      if (qrisStatusCheck) qrisStatusCheck.classList.add('hidden');
    }, 1800);
  }
});

async function checkQRISStatus(trx_id) {
  if (!trx_id) return;
  try {
    const res = await fetch(`${QRIS_URL}/api/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: trx_id }),
    });
    const data = await res.json();
    if (data.success && data.data?.status === 'success') {
      clearInterval(window.pollInterval);
      window.pollInterval = null;
      triggerPaymentSuccess();
    }
  } catch (e) { console.error('Poll error', e); }
}

function triggerPaymentSuccess() {
  closeDonate();
  showStep(1);

  showNotification('Payment confirmed — thank you! 🎉');

  const party = document.getElementById('party-overlay');
  party?.classList.remove('hidden');

  let count = 0;
  const spawn = setInterval(() => {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#fb923c'][Math.floor(Math.random() * 6)];
    party?.appendChild(el);
    setTimeout(() => el.remove(), 2800);
    if (++count > 70) clearInterval(spawn);
  }, 50);

  setTimeout(() => {
    party?.classList.add('hidden');
    if (party) party.innerHTML = `<div class="party-text">Thank you for your support!<br><span>You're awesome 🎉</span></div>`;
  }, 5500);
}


/* ═══════════════════════ NOTIFICATION ═══════════════════════ */
let notifTimer = null;
function showNotification(msg) {
  const el = document.getElementById('notification');
  const txt = document.getElementById('notif-text');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.remove('hidden');
  if (notifTimer) clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.add('hidden'), 4500);
}


/* ═══════════════════════ KEYBOARD ═══════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { 
    closePdf(); 
    closeDonate(); 
    document.getElementById('mqtt-overlay')?.classList.add('hidden');
  }
});

/* ═══════════════════════ MQTT MODAL ═══════════════════════ */
const mqttOverlay = document.getElementById('mqtt-overlay');
const btnMqtt = document.getElementById('btn-mqtt');
const btnCloseMqtt = document.getElementById('btn-close-mqtt');

if (btnMqtt) {
  btnMqtt.addEventListener('click', e => {
    e.preventDefault();
    if (mqttOverlay) {
      mqttOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  });
}

if (btnCloseMqtt) {
  btnCloseMqtt.addEventListener('click', () => {
    if (mqttOverlay) {
      mqttOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

if (mqttOverlay) {
  mqttOverlay.addEventListener('click', e => {
    if (e.target === mqttOverlay) {
      mqttOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}
