/**
 * The Reath Foundation — Main JavaScript
 * Handles: scroll animations, sticky nav, mobile menu,
 *          parallax, form interactions, smooth anchors
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
   *  UTILITY
   * ───────────────────────────────────────────────────────── */

  /**
   * Run callback when DOM is ready.
   * @param {Function} fn
   */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * Throttle a function to fire at most once per animation frame.
   * @param {Function} fn
   * @returns {Function}
   */
  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }


  /* ─────────────────────────────────────────────────────────
   *  STICKY NAV
   * ───────────────────────────────────────────────────────── */

  function initStickyNav() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const THRESHOLD = 60; // px from top before nav solidifies

    function update() {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', rafThrottle(update), { passive: true });
    update(); // run once on load
  }


  /* ─────────────────────────────────────────────────────────
   *  MOBILE NAV TOGGLE
   * ───────────────────────────────────────────────────────── */

  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close when any nav link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }


  /* ─────────────────────────────────────────────────────────
   *  SCROLL REVEAL (Intersection Observer)
   * ───────────────────────────────────────────────────────── */

  function initScrollReveal() {
    const CLASSES = ['reveal-up', 'reveal-left', 'reveal-right'];
    const selector = CLASSES.map(c => '.' + c).join(', ');

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // once only
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }


  /* ─────────────────────────────────────────────────────────
   *  HERO PARALLAX
   * ───────────────────────────────────────────────────────── */

  function initHeroParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    function onScroll() {
      const scrolled = window.scrollY;
      const parallaxAmount = scrolled * 0.4;
      heroBg.style.transform = `translateY(${parallaxAmount}px)`;
    }

    window.addEventListener('scroll', rafThrottle(onScroll), { passive: true });
  }


  /* ─────────────────────────────────────────────────────────
   *  SMOOTH SCROLL FOR ANCHOR LINKS
   * ───────────────────────────────────────────────────────── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.getElementById('site-header')?.offsetHeight || 72;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });

        // Update URL without triggering scroll
        history.pushState(null, '', targetId);
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
   *  ACTIVE NAV LINK (section in view)
   * ───────────────────────────────────────────────────────── */

  function initActiveNav() {
    const navLinks  = document.querySelectorAll('.nav-link');
    const sections  = document.querySelectorAll('main section[id], main > *[id]');

    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle(
                'nav-link--active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(section => observer.observe(section));
  }


  /* ─────────────────────────────────────────────────────────
   *  CONTACT FORM
   * ───────────────────────────────────────────────────────── */

  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name     = form.querySelector('#name');
      const email    = form.querySelector('#email');
      const interest = form.querySelector('#interest');

      let valid = true;

      [name, email, interest].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e05a4a';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#e05a4a';
        valid = false;
      }

      if (!valid) return;

      // Visual feedback — replace button text
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled  = true;
      submitBtn.textContent = 'Sending…';
      submitBtn.style.opacity = '0.75';

      // Simulate async submission (replace with real fetch/form handler)
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent — Thank you!';
        submitBtn.style.background = 'rgba(0, 182, 155, 0.25)';
        submitBtn.style.borderColor = 'var(--color-teal)';

        // Reset form fields (keep button state)
        form.querySelectorAll('input, select, textarea').forEach(field => {
          field.value = field.tagName === 'SELECT' ? '' : '';
        });

        // Restore button after 5s
        setTimeout(() => {
          submitBtn.disabled  = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '';
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 5000);
      }, 1200);
    });

    // Live validation feedback — clear error on input
    form.querySelectorAll('.form-input').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.style.borderColor = '';
        }
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
   *  GIVING TIER — CLICK TO SCROLL TO FORM
   * ───────────────────────────────────────────────────────── */

  function initTierButtons() {
    document.querySelectorAll('.btn-tier, .tier-card .btn-primary').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const card = this.closest('.tier-card');
        if (!card) return;

        // Visually highlight selected tier
        document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('tier-card--selected'));
        card.classList.add('tier-card--selected');

        // Pre-fill interest in contact form
        const select = document.querySelector('#interest');
        if (select && !select.value) {
          select.value = 'donor';
        }
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
   *  COUNTER ANIMATION (traction stats)
   * ───────────────────────────────────────────────────────── */

  function animateCounter(el, target, prefix, suffix, decimals) {
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = eased * target;

      el.textContent = prefix + (decimals
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString()
      ) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.traction-number');
    if (!counters.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Map text content to numeric targets
    const map = {
      '$120K': { prefix: '$', target: 120, suffix: 'K', decimals: 0 },
      '200+':  { prefix: '',  target: 200, suffix: '+', decimals: 0 },
      '70':    { prefix: '',  target: 70,  suffix: '',  decimals: 0 },
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el  = entry.target;
          const key = el.textContent.trim();
          const cfg = map[key];
          if (cfg) {
            animateCounter(el, cfg.target, cfg.prefix, cfg.suffix, cfg.decimals);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }


  /* ─────────────────────────────────────────────────────────
   *  HERO STAGGER — ensure hero elements animate in on load
   * ───────────────────────────────────────────────────────── */

  function initHeroAnimation() {
    const heroItems = document.querySelectorAll('.hero .reveal-up');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      heroItems.forEach(el => el.classList.add('revealed'));
      return;
    }

    // Small delay to let fonts paint
    setTimeout(() => {
      heroItems.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('revealed');
        }, 200 + i * 120);
      });
    }, 100);
  }


  /* ─────────────────────────────────────────────────────────
   *  INIT
   * ───────────────────────────────────────────────────────── */

  ready(function () {
    initStickyNav();
    initMobileNav();
    initSmoothScroll();
    initHeroAnimation();
    initScrollReveal();
    initHeroParallax();
    initActiveNav();
    initContactForm();
    initTierButtons();
    initCounters();
  });

})();
