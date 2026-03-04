/**
 * Sebana Servizi - Main JavaScript
 * Progressive enhancement for interactive features
 */

(function () {
  'use strict';

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mobile menu toggle
  function initMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');

    if (!nav || !header) return;

    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span class="menu-icon"></span>';

    nav.parentNode.insertBefore(menuToggle, nav);

    function closeMenu() {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('active');
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.getElementById(href.substring(1));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (history.pushState) history.pushState(null, null, href);

        const nav = document.querySelector('.main-nav');
        if (nav?.classList.contains('active')) {
          nav.classList.remove('active');
          document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Consolidated scroll effects (header + parallax + scroll spy) — single rAF-throttled listener
  function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero-section');
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

    let ticking = false;

    function onScroll() {
      const scrollY = window.pageYOffset;

      // Header state
      if (header) header.classList.toggle('scrolled', scrollY > 80);

      // Parallax — only while hero is in view
      if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.4}px)`;
      }

      // Scroll spy
      if (sections.length && navLinks.length) {
        let current = '';
        sections.forEach(s => {
          if (scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { onScroll(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  }

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusDiv = form.querySelector('.form-status');

    function showStatus(type, message) {
      statusDiv.textContent = message;
      statusDiv.className = 'form-status ' + type;
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function validateForm(f) {
      let isValid = true;

      f.querySelectorAll('[required]').forEach(field => {
        if (field.type === 'checkbox') {
          const invalid = !field.checked;
          field.parentElement.classList.toggle('error', invalid);
          if (invalid) isValid = false;
        } else {
          const invalid = !field.value.trim();
          field.classList.toggle('error', invalid);
          if (invalid) isValid = false;
        }
      });

      const emailField = f.querySelector('input[type="email"]');
      if (emailField?.value && !EMAIL_REGEX.test(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
      }

      return isValid;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Invio in corso...';

      statusDiv.textContent = '';
      statusDiv.className = 'form-status';

      if (!validateForm(form)) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        showStatus('error', 'Per favore, compila tutti i campi obbligatori.');
        return;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showStatus('success', 'Grazie per averci contattato! Ti risponderemo al più presto.');
          form.reset();
        } else {
          showStatus('error', 'Si è verificato un errore. Per favore riprova.');
        }
      } catch {
        showStatus('error', 'Si è verificato un errore di connessione. Per favore riprova.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', function () {
        if (!this.hasAttribute('required')) return;

        if (this.type === 'email') {
          this.classList.toggle('error', this.value !== '' && !EMAIL_REGEX.test(this.value));
        } else {
          this.classList.toggle('error', !this.value.trim());
        }
      });

      input.addEventListener('input', function () {
        if (this.classList.contains('error') && this.value.trim()) {
          this.classList.remove('error');
        }
      });
    });
  }

  // Counter animation (IntersectionObserver-based)
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const target = parseInt(entry.target.getAttribute('data-target'));
        const increment = target / (2000 / 16);
        let current = 0;

        const tick = () => {
          current += increment;
          if (current < target) {
            entry.target.textContent = Math.floor(current) + '+';
            requestAnimationFrame(tick);
          } else {
            entry.target.textContent = target + '+';
          }
        };
        tick();
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // Scroll reveal — uses CSS class instead of inline styles
  function initScrollReveal() {
    const elements = document.querySelectorAll('.service-card, .value-card, .team-member, .service-item, .service-card-image');
    if (!elements.length) return;

    elements.forEach(el => el.classList.add('js-reveal'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('js-reveal--visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // Lazy loading enhancement
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => observer.observe(img));
  }

  // Ripple effect on buttons
  function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');

        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  function init() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initCounterAnimation();
    initScrollReveal();
    initLazyLoading();
    initRippleEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
