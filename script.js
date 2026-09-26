/* ============================================================
   Marina's Clinic clone — interactivity
   ============================================================ */

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ---------- Symptom self-check counter ----------
const checks = document.querySelectorAll('.symptom-check');
const scoreCount = document.getElementById('scoreCount');
const scoreHint = document.getElementById('scoreHint');

function updateScore() {
  const n = [...checks].filter(c => c.checked).length;
  scoreCount.textContent = n;
  if (n === 0) {
    scoreHint.textContent = 'Tick what applies above to see whether an assessment is worth your time.';
  } else if (n <= 2) {
    scoreHint.textContent = 'Even one persistent symptom is worth a proper explanation.';
  } else {
    scoreHint.textContent = 'Several symptoms together — a focused consultation is strongly worth booking.';
  }
}
checks.forEach(c => c.addEventListener('change', updateScore));
updateScore();

// ---------- Marquee: duplicate items for seamless loop ----------
const track = document.getElementById('marqueeTrack');
if (track) track.innerHTML += track.innerHTML;

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Countdown urgency timer ----------
let secs = 11 * 60 + 52;
const cd = document.getElementById('countdown');
setInterval(() => {
  secs = secs > 0 ? secs - 1 : 11 * 60 + 52;
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  if (cd) cd.textContent = m + ':' + s;
}, 1000);

// ---------- Booking form -> Google Sheet (Apps Script web app) ----------
// Paste your deployed Web app URL here (see apps-script/Code.gs)
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxgVjQ2qaPP7m-moGnb9eQfztKJoxe0qn0oSpDwFA5zTq6BR9e5g9rDBp8-6-A5j8k/exec';
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const condition = form.condition.value;

    if (!name || !phone || !condition) {
      alert('Please fill your name, phone number and condition so the team can call you.');
      return;
    }
    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // no-cors: the Apps Script web app can't send CORS headers, so the response is opaque
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name,
        phone,
        condition,
        time: form.time.value,
        page: location.href
      })
    })
      .then(() => {
        document.getElementById('formSuccess').hidden = false;
        form.reset();
      })
      .catch(() => alert('Could not send your request. Please call us instead.'))
      .finally(() => {
        btn.disabled = false;
        btn.textContent = label;
      });
  });
}

// ---------- Treatment image topic buttons ----------
const topicImage = document.getElementById('topicImage');
document.querySelectorAll('.topic').forEach(topic => {
  topic.addEventListener('click', () => {
    document.querySelectorAll('.topic').forEach(t => t.classList.remove('active'));
    topic.classList.add('active');
    topicImage.src = topic.dataset.image;
    topicImage.alt = topic.dataset.alt;
  });
});

