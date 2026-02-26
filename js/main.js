/**
 * Sebana Servizi - Main JavaScript
 * Progressive enhancement for interactive features
 */

(function() {
  'use strict';

  // Smooth scrolling for navigation links
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
          
          // Close mobile menu if open
          const nav = document.querySelector('.main-nav');
          if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    });
  }

  // Mobile menu toggle
  function initMobileMenu() {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.main-nav');
    
    if (!header || !nav) return;
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span class="menu-icon"></span>';
    
    // Insert toggle button before nav
    nav.parentNode.insertBefore(menuToggle, nav);
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      nav.classList.toggle('active');
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // Add active state to navigation based on scroll position
  function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveLink() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
          link.classList.add('active');
        }
      });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    updateActiveLink();
  }

  // Initialize all features when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    initSmoothScrolling();
    initMobileMenu();
    initScrollSpy();
    initContactForm();
  }

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const statusDiv = form.querySelector('.form-status');
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable submit button during submission
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Invio in corso...';
      
      // Clear previous status
      statusDiv.textContent = '';
      statusDiv.className = 'form-status';
      
      // Validate form
      if (!validateForm(form)) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showStatus('error', 'Per favore, compila tutti i campi obbligatori.');
        return;
      }
      
      try {
        // Get form data
        const formData = new FormData(form);
        
        // Submit to Formspree
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showStatus('success', 'Grazie per averci contattato! Ti risponderemo al più presto.');
          form.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            showStatus('error', 'Si è verificato un errore. Per favore riprova.');
          } else {
            showStatus('error', 'Si è verificato un errore. Per favore riprova.');
          }
        }
      } catch (error) {
        showStatus('error', 'Si è verificato un errore di connessione. Per favore riprova.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
    
    function validateForm(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            isValid = false;
            field.parentElement.classList.add('error');
          } else {
            field.parentElement.classList.remove('error');
          }
        } else {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        }
      });
      
      // Validate email format
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          emailField.classList.add('error');
        }
      }
      
      return isValid;
    }
    
    function showStatus(type, message) {
      statusDiv.textContent = message;
      statusDiv.className = 'form-status ' + type;
      
      // Scroll to status message
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required')) {
          if (this.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
              this.classList.add('error');
            } else if (this.value) {
              this.classList.remove('error');
            }
          } else if (!this.value.trim()) {
            this.classList.add('error');
          } else {
            this.classList.remove('error');
          }
        }
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim()) {
          this.classList.remove('error');
        }
      });
    });
  }
})();

/**
 * Counter Animation for Statistics
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  
  if (counters.length === 0) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };
    
    updateCounter();
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.service-card, .value-card, .team-member, .service-item');
  
  if (revealElements.length === 0) return;
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
  });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Parallax Effect for Hero Section
 */
function initParallax() {
  const hero = document.querySelector('.hero-section');
  
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

/**
 * Lazy Loading Images Enhancement
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Add Ripple Effect to Buttons
 */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Initialize all enhanced features
 */
(function() {
  'use strict';
  
  function initEnhancedFeatures() {
    initCounterAnimation();
    initScrollReveal();
    initHeaderScroll();
    initParallax();
    initLazyLoading();
    initRippleEffect();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancedFeatures);
  } else {
    initEnhancedFeatures();
  }
})();
