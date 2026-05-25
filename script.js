/* ============================================================
   FAB-O-MECH ENGINEERS — Main JavaScript
   Updated for:
   - New 2-row navbar (nav-top + nav-bottom)
   - Logo image fallback logic
   - Formspree form submission with real email delivery
   ============================================================ */
 
document.addEventListener('DOMContentLoaded', function () {
 
  // ── 1. NAVBAR SCROLL EFFECT ───────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
 
  // ── 2. LOGO IMAGE FALLBACK ────────────────────────────────
  // If logo.png loads successfully, hide the "F" icon fallback
  // If logo.png fails to load, hide the image and show the "F" icon
  const logoImg      = document.querySelector('.nav-logo-img');
  const logoFallback = document.querySelector('#logo-fallback');
  if (logoImg && logoFallback) {
    logoImg.addEventListener('load', () => {
      // Image loaded fine — hide the "F" icon
      logoFallback.style.display = 'none';
    });
    logoImg.addEventListener('error', () => {
      // Image failed (file not found) — hide image, show "F" icon
      logoImg.style.display    = 'none';
      logoFallback.style.display = 'flex';
    });
    // If image already cached and loaded before listener attached
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      logoFallback.style.display = 'none';
    } else if (logoImg.complete && logoImg.naturalWidth === 0) {
      logoImg.style.display      = 'none';
      logoFallback.style.display = 'flex';
    }
  }
 
  // ── 3. MOBILE NAV TOGGLE ─────────────────────────────────
  // The toggle button is in nav-top (Row 1)
  // The nav-links list is in nav-bottom (Row 2)
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
 
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        // Animate hamburger → X
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        // Also change toggle bar colors to navy (visible on white bg)
        spans.forEach(s => s.style.background = 'var(--navy)');
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
        spans.forEach(s => s.style.background = '');
      }
    });
 
    // Close mobile menu when any nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
          s.style.background = '';
        });
      });
    });
  }
 
  // ── 4. ACTIVE NAV LINK ────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
 
  // ── 5. SCROLL REVEAL ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length > 0) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }
 
  // ── 6. COUNTER ANIMATION ─────────────────────────────────
  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''));
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start    = performance.now();
 
    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current  = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
 
  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length > 0) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }
 
  // ── 7. PRODUCT FILTER (products page) ────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');
 
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
 
        productCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity   = '1';
              card.style.transform = '';
            }, 10);
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }
 
  // ── 8. GALLERY THUMBNAILS (product detail page) ───────────
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainGalleryImg = document.querySelector('.gallery-main-img');
 
  if (thumbs.length > 0) {
    // Set first as active on load
    thumbs[0].classList.add('active');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainGalleryImg) {
          const src = thumb.getAttribute('data-src');
          if (src) mainGalleryImg.src = src;
        }
      });
    });
  }
 
  // ── 9. CONTACT FORM — FORMSPREE BACKEND ──────────────────
  /*
    HOW IT WORKS:
    - When user submits the form, we send data to Formspree
    - Formspree emails the submission directly to your inbox
    - No server, no PHP, no Node.js needed
    - Setup: Go to formspree.io, sign up free, create a form,
      paste your endpoint URL into contact.html form action=""
  */
  const contactForm = document.querySelector('#inquiry-form');
  if (contactForm) {
 
    // Mirror email field to hidden _replyto field (lets you reply directly)
    const emailInput   = contactForm.querySelector('#email');
    const replyToField = contactForm.querySelector('#replyto-field');
    if (emailInput && replyToField) {
      emailInput.addEventListener('input', () => {
        replyToField.value = emailInput.value;
      });
    }
 
    const submitBtn     = contactForm.querySelector('#submit-btn');
    const successMsg    = document.querySelector('#form-success');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Inquiry →';
 
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
 
      // Basic validation
      const name    = contactForm.querySelector('#name');
      const company = contactForm.querySelector('#company');
      const email   = contactForm.querySelector('#email');
      const phone   = contactForm.querySelector('#phone');
 
      if (!name.value.trim() || !company.value.trim() || !email.value.trim() || !phone.value.trim()) {
        alert('Please fill in all required fields (Name, Company, Email, Phone).');
        return;
      }
 
      // Show loading state
      if (submitBtn) {
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled    = true;
        submitBtn.style.opacity = '0.7';
      }
 
      try {
        const formData = new FormData(contactForm);
        const action   = contactForm.getAttribute('action');
 
        // Check if Formspree ID has been set
        if (!action || action.includes('YOUR_FORMSPREE_ID')) {
          // Demo mode — Formspree not configured yet
          // Still shows success so you can test the UI
          throw new Error('DEMO_MODE');
        }
 
        const response = await fetch(action, {
          method:  'POST',
          body:    formData,
          headers: { 'Accept': 'application/json' }
        });
 
        if (response.ok) {
          // ✅ Real success — Formspree sent email to owner
          showSuccess();
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Server error');
        }
 
      } catch (err) {
        if (err.message === 'DEMO_MODE') {
          // Show demo success (form not configured yet)
          showSuccess(true);
        } else {
          // Real error
          if (submitBtn) {
            submitBtn.textContent   = '✗ Submission Failed — Try Again';
            submitBtn.disabled      = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background   = '#e74c3c';
            submitBtn.style.borderColor  = '#e74c3c';
            setTimeout(() => {
              submitBtn.textContent      = originalBtnText;
              submitBtn.style.background = '';
              submitBtn.style.borderColor= '';
            }, 4000);
          }
        }
      }
    });
 
    function showSuccess(demoMode = false) {
      // Show green success message
      if (successMsg) {
        successMsg.classList.add('visible');
        if (demoMode) {
          successMsg.textContent = '✓ Demo: Form works! Add your Formspree ID to enable real email delivery.';
        }
        // Scroll to it
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Update button
      if (submitBtn) {
        submitBtn.textContent        = '✓ Inquiry Submitted!';
        submitBtn.style.background   = '#27ae60';
        submitBtn.style.borderColor  = '#27ae60';
        submitBtn.style.opacity      = '1';
        submitBtn.disabled           = false;
      }
      // Reset form and button after 5 seconds
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.textContent       = originalBtnText;
          submitBtn.style.background  = '';
          submitBtn.style.borderColor = '';
        }
        if (successMsg) successMsg.classList.remove('visible');
      }, 5000);
    }
  }
 
  // ── 10. SMOOTH ANCHOR SCROLL ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
 
  // ── 11. TICKER / MARQUEE ──────────────────────────────────
  // The ticker in index.html already has duplicated content in HTML
  // This ensures seamless looping even if it wasn't pre-duplicated
  const ticker = document.querySelector('.ticker-inner');
  if (ticker && ticker.children.length < 8) {
    // Only duplicate if content isn't already duplicated in HTML
    ticker.innerHTML = ticker.innerHTML + ticker.innerHTML;
  }
 
});
 