/**
 * JAWAD - Premium Personal Brand Website
 * Interactions & Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initCustomCursor();
  initScrollAnimations();
  initNumberCounters();
  initProcessTimeline();
  initContactForm();
  initPageLoadSequence();
  initHeroParallax();
});

/* --------------------------------------------------------------------------
   STICKY HEADER
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !overlay) return;

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  toggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   CUSTOM CURSOR (Desktop only)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Disable cursor on touch or mobile
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) {
    return;
  }

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!hasMoved) {
      document.body.classList.add('cursor-active');
      followerX = mouseX;
      followerY = mouseY;
      hasMoved = true;
    }

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  const render = () => {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // Hover state triggers
  const hoverTargets = 'a, button, input, textarea, .card-service, .feature-card, .chip-label, .site-logo';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   PAGE LOAD SEQUENCE
   -------------------------------------------------------------------------- */
function initPageLoadSequence() {
  // Trigger line reveals and hero entry smoothly
  setTimeout(() => {
    document.querySelectorAll('.line-reveal-wrap').forEach((el, index) => {
      setTimeout(() => el.classList.add('revealed'), index * 120);
    });
  }, 100);
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-init, .reveal-scale');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   NUMBER COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initNumberCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = target * ease;

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   PROCESS TIMELINE PROGRESSION
   -------------------------------------------------------------------------- */
function initProcessTimeline() {
  const timeline = document.querySelector('.process-timeline');
  const line = document.querySelector('.process-timeline-line');
  const steps = document.querySelectorAll('.process-step');

  if (!timeline || !line || !steps.length) return;

  const updateProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top < windowH * 0.75 && rect.bottom > 0) {
      const scrolled = (windowH * 0.75 - rect.top) / rect.height;
      const progress = Math.min(Math.max(scrolled, 0), 1);
      line.style.width = `${progress * 100}%`;

      steps.forEach((step, index) => {
        const threshold = (index + 0.3) / steps.length;
        if (progress >= threshold) {
          step.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   CONTACT FORM SUBMISSION SIMULATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Sending...</span>
    `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origText;
      form.reset();

      // Show toast
      showToast('Thank you! Your message has been received. Jawad will connect with you within 24 hours.');
    }, 1200);
  });
}

function showToast(message) {
  let toast = document.querySelector('.form-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'form-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 5000);
}

/* --------------------------------------------------------------------------
   HERO PORTRAIT PARALLAX (Desktop only, respects prefers-reduced-motion)
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 992) return;

  const portrait = document.querySelector('.hero-portrait-img');
  const backdrop = document.querySelector('.hero-portrait-backdrop');
  if (!portrait) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < 900) {
          portrait.style.transform = `translate3d(0, ${scrolled * 0.07}px, 0)`;
          if (backdrop) {
            backdrop.style.transform = `translate3d(0, ${-scrolled * 0.04}px, 0)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
