/* ══════════════════════════════════════════════════════════
   🎨 Marwa Khaled — Portfolio Scripts
   ══════════════════════════════════════════════════════════ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── NAV: solid on scroll ──────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── NAV: mobile toggle ────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── CURSOR ORB (hero) ─────────────────────────────────── */
if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
  const orb = document.querySelector('.cursor-orb');
  const hero = document.querySelector('.hero');

  if (orb && hero) {
    let mouseX = 0, mouseY = 0;
    let orbX = 0, orbY = 0;
    let hasMoved = false;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (!hasMoved) {
        orbX = mouseX;
        orbY = mouseY;
        hasMoved = true;
      }
    });

    const animate = () => {
      orbX += (mouseX - orbX) * 0.08;
      orbY += (mouseY - orbY) * 0.08;
      orb.style.transform = `translate(${orbX - 300}px, ${orbY - 300}px)`;
      requestAnimationFrame(animate);
    };
    animate();
  }
}

/* ── REVEAL ON SCROLL ──────────────────────────────────── */
if (!prefersReduced && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ── SMOOTH SCROLL for anchor links ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
});

/* ── MODAL: lock body scroll when open ────────────────── */
document.querySelectorAll('.modal').forEach(modalEl => {
  modalEl.addEventListener('show.bs.modal', () => {
    document.body.style.overflow = 'hidden';
  });
  modalEl.addEventListener('hidden.bs.modal', () => {
    document.body.style.overflow = '';
  });
});

/* ── IMAGE FALLBACK (media-frame) ──────────────────────── */
document.querySelectorAll('.media-frame img').forEach(img => {
  img.addEventListener('error', function () {
    const frame = this.parentElement;
    if (frame && !frame.classList.contains('is-empty')) {
      frame.classList.add('is-empty');
      const label = this.alt.split('—')[0].trim() || 'Project';
      frame.innerHTML = `
        <div class="media-placeholder">
          <span class="mono">${label}</span>
          <span>Case Study</span>
        </div>
      `;
    }
  });
});

/* ══════════════════════════════════════════════════════════
   🖼️ LIGHTBOX — يفتح أي صورة فيها data-lightbox
   ══════════════════════════════════════════════════════════ */
const lb = document.createElement('div');
lb.className = 'lightbox';
lb.innerHTML = `
  <button class="lb-close" aria-label="Close"><i class="bi bi-x-lg"></i></button>
  <img src="" alt="Preview">
`;
document.body.appendChild(lb);

const lbImg = lb.querySelector('img');

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-lightbox]');
  if (trigger && !trigger.classList.contains('is-empty')) {
    e.preventDefault();
    lbImg.src = trigger.dataset.lightbox;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

const closeLb = () => {
  lb.classList.remove('open');
  document.body.style.overflow = '';
};

lb.addEventListener('click', (e) => {
  if (e.target === lb || e.target.closest('.lb-close')) closeLb();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
});