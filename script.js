// ════════════════════════════════════════════════════════
// SCRIPT.JS — Shobhit Studio — Main JavaScript
// ════════════════════════════════════════════════════════
//
// HOW TO SETUP EMAILJS (free — 200 emails/month):
// 1. Go to: https://www.emailjs.com → Sign Up
// 2. Add Email Service → connect Gmail → copy SERVICE ID
// 3. Email Templates → Create Template
//    Add these variables in your template:
//    {{from_name}}  {{from_email}}  {{phone}}  {{interest}}
//    Copy TEMPLATE ID
// 4. Account → General → copy PUBLIC KEY
// 5. Replace the 3 values below:
  //
  const EMAILJS_SERVICE_ID  = "service_ojmjd52";   // ← paste here
  const EMAILJS_TEMPLATE_ID = "template_6c8jrn5";  // ← paste here
  const EMAILJS_PUBLIC_KEY  = "IWsULadnDYP2rIaoV";   // ← paste here

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);


// ════════════════════════
// 1. NAVBAR SCROLL EFFECT
// ════════════════════════
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});

// Mobile menu open/close
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});
function closeMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
}


// ════════════════════════
// 2. FADE IN ON SCROLL
// ════════════════════════
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => fadeObserver.observe(el));


// ════════════════════════
// 3. ANIMATED COUNTERS
// ════════════════════════
let countersDone = false;
const counterSection = document.getElementById('counters');

if (counterSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.cn').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = target / 120; // 120 frames ≈ 2 seconds
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, 16);
      });
    }
  }, { threshold: 0.3 }).observe(counterSection);
}


// ════════════════════════
// 4. VIDEO PLAY
// ════════════════════════
function playVid() {
  document.getElementById('videoPh')?.classList.add('hidden');
  document.getElementById('videoFrame')?.classList.remove('hidden');
}


// ════════════════════════
// 5. BOOKING FORM SUBMIT
//    → Saves to Firestore
//    → Sends email via EmailJS
// ════════════════════════
async function submitForm() {
  const name     = document.getElementById('fname')?.value.trim();
  const email    = document.getElementById('femail')?.value.trim();
  const phone    = document.getElementById('fphone')?.value.trim();
  const interest = document.getElementById('ftype')?.value;

  // Validate all fields
  if (!name || !email || !phone || !interest) {
    alert('Please fill in all fields!');
    return;
  }

  try {
    await window.db.collection('registrations').add({
      name,
      email,
      phone,
      interest,
      createdAt: new Date()
    });

    // 🔥 POPUP MESSAGE
    alert("Thank you for submitting your request! We will catch you shortly 🚀");

    // Success UI
    document.getElementById('formBody')?.classList.add('hidden');
    document.getElementById('formSuccess')?.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert("Please Try on whatsup chat !");
  }
}

function resetForm() {
  ['fname','femail','fphone','ftype'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('formBody')?.classList.remove('hidden');
  document.getElementById('formSuccess')?.classList.add('hidden');
}


// ════════════════════════
// 6. LEAD POPUP (5 seconds)
// ════════════════════════
setTimeout(() => {
  if (!sessionStorage.getItem('popup_shown')) {
    document.getElementById('pOverlay')?.classList.remove('hidden');
    document.getElementById('leadPopup')?.classList.remove('hidden');
    sessionStorage.setItem('popup_shown', 'true');
  }
}, 5000);

function closePopup() {
  document.getElementById('pOverlay')?.classList.add('hidden');
  document.getElementById('leadPopup')?.classList.add('hidden');
}


// ════════════════════════
// 7. ROBOT CHAT BOX
//    5 sawaal → contact details
// ════════════════════════

// Chat questions — 5 total
// {name} and {event} get replaced with user's previous answers
const Q = [
  "Namaste! 🙏 Main Shobhit ka AI assistant hoon.\n\nAapka naam kya hai?",
  "Nice to meet you, {name}! 😊\n\nAapko kis cheez mein help chahiye?\n\n🎤 Event Anchor chahiye\n🌐 Website banwani hai\n📞 Dono ke baare mein poochna hai",
  "Great! {interest} ke liye main help kar sakta hoon. 🎉\n\nAapke event/project ki date ya timeline kya hai?",
  "Perfect! Aur aapka location kya hai? (City)",
  "Last sawaal! 📞\nAapka WhatsApp number kya hai taaki Shobhit ji seedha contact kar sakein?"
];

let cStep    = 0;
let cAnswers = {};
let cTyping  = false;
const cKeys  = ['name', 'interest', 'timeline', 'location', 'whatsapp'];

function toggleChat() {
  const box = document.getElementById('chatBox');
  if (!box) return;
  box.classList.toggle('hidden');
  // Show first question when chat opens for first time
  if (!box.classList.contains('hidden') && cStep === 0 && !document.querySelector('.msg')) {
    setTimeout(() => botMsg(Q[0]), 400);
  }
}

function botMsg(text, delay = 900) {
  cTyping = true;
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;

  // Show typing dots
  const dots = document.createElement('div');
  dots.className = 'typing';
  dots.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(dots);
  scrollChat();

  setTimeout(() => {
    dots.remove();
    const m = document.createElement('div');
    m.className = 'msg bot';
    m.textContent = text;
    msgs.appendChild(m);
    cTyping = false;
    scrollChat();
  }, delay);
}

function userMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const m = document.createElement('div');
  m.className = 'msg user';
  m.textContent = text;
  msgs.appendChild(m);
  scrollChat();
}

function scrollChat() {
  const msgs = document.getElementById('chatMsgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function sendMsg() {
  if (cTyping) return;
  const input = document.getElementById('chatTxt');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  userMsg(val);
  input.value = '';

  cAnswers[cKeys[cStep]] = val;
  const next = cStep + 1;

  if (next < Q.length) {
    cStep = next;
    const q = Q[cStep]
      .replace('{name}',     cAnswers.name     || val)
      .replace('{interest}', cAnswers.interest || val);
    botMsg(q);
  } else {
    // All questions answered
    cStep = next;
    botMsg(
      `Thank you ${cAnswers.name}! 🎉\n\nShobhit ji aapko jald contact karenge.\n\nYa aap abhi inhe call/WhatsApp kar sakte hain:\n📞 7376806654\n\nAgar website chahiye ya anchor chahiye — dono ke liye same number! 😊`
    );
    // Save chat lead to Firestore
    if (window.db) {
      window.db.collection('chat_leads').add({
        ...cAnswers,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(console.error);
    }
    setTimeout(() => {
      document.getElementById('chatIn')?.classList.add('hidden');
      document.getElementById('chatDone')?.classList.remove('hidden');
    }, 1200);
  }
}

function resetChat() {
  cStep = 0; cAnswers = {}; cTyping = false;
  const msgs = document.getElementById('chatMsgs');
  if (msgs) msgs.innerHTML = '';
  document.getElementById('chatIn')?.classList.remove('hidden');
  document.getElementById('chatDone')?.classList.add('hidden');
  setTimeout(() => botMsg(Q[0]), 300);
}


// ════════════════════════
// 8. SMOOTH SCROLL
// ════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

