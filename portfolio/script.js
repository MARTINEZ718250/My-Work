/* ============================================================
   OAM PORTFOLIO — 2030 CYBER THEME
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .filter-btn, .card-link, .project-card')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });


/* ============================================================
   2. MATRIX / PARTICLE CANVAS BACKGROUND
   ============================================================ */
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.7 ? '#b14aed' : '#00f5ff';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle   = this.color;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw connections between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.15;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();


/* ============================================================
   3. NAVBAR — SCROLL EFFECT + ACTIVE LINK + PROGRESS BAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const navProgress = document.querySelector('.nav-progress');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled state
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else                      navbar.classList.remove('scrolled');

  // Progress bar
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  navProgress.style.width = progress + '%';

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});


/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
  });
});


/* ============================================================
   5. TYPEWRITER EFFECT
   ============================================================ */
const roles = [
  'Full-Stack Developer',
  'Backend Engineer',
  'System Architect',
  'API Specialist',
  'Django Expert',
  'React Developer',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeWriter() {
  const currentRole = roles[roleIndex];
  const speed = isDeleting ? 60 : 110;

  typedEl.textContent = currentRole.substring(0, charIndex);

  if (!isDeleting && charIndex === currentRole.length) {
    setTimeout(() => { isDeleting = true; }, 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  charIndex += isDeleting ? -1 : 1;
  setTimeout(typeWriter, speed);
}
typeWriter();


/* ============================================================
   6. COUNTER ANIMATION (hero metrics)
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.metric-val[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let current  = 0;
    const step   = Math.ceil(target / 40);

    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 40);
  });
}

// Trigger counters once when hero is in view
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);


/* ============================================================
   7. SKILL BARS ANIMATION
   ============================================================ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const targetW = bar.getAttribute('data-w');
        bar.style.width = targetW + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-panel').forEach(panel => skillObserver.observe(panel));


/* ============================================================
   8. PROJECT FILTER
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      if (filter === 'all' || categories.split(' ').includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ============================================================
   9. SCROLL FADE-IN ANIMATION
   ============================================================ */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Apply fade-up to section children
document.querySelectorAll(
  '.about-terminal, .about-content, .skill-panel, .project-card, ' +
  '.channel-item, .contact-info, .cyber-form, .trait-item, .section-header'
).forEach(el => {
  el.classList.add('fade-up');
  fadeObserver.observe(el);
});


/* ============================================================
   10. CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.className = 'form-status error';
      formStatus.textContent = '// ERROR: All fields are required.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.className = 'form-status error';
      formStatus.textContent = '// ERROR: Invalid email format.';
      return;
    }

    // Simulate transmission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>TRANSMITTING...</span>';

    formStatus.className = 'form-status';
    formStatus.textContent = '';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>TRANSMIT MESSAGE</span>';
      formStatus.className = 'form-status success';
      formStatus.textContent = '// SUCCESS: Message transmitted. Response ETA < 24h.';
      contactForm.reset();
    }, 2000);
  });
}


/* ============================================================
   11. GLITCH FLICKER (random interval)
   ============================================================ */
function triggerGlitch() {
  const glitchEls = document.querySelectorAll('.glitch');
  const rand      = glitchEls[Math.floor(Math.random() * glitchEls.length)];
  if (rand) {
    rand.style.animation = 'none';
    void rand.offsetWidth; // reflow
    rand.style.animation = '';
  }
  setTimeout(triggerGlitch, 3000 + Math.random() * 4000);
}
triggerGlitch();


/* ============================================================
   12. SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
