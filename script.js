/**
 * Pasticceria Fumagalli — Landing Page
 * Main script: cookie consent, conditional GA4 loading, CTA scroll,
 * form validation, analytics events
 *
 * Stack:   Vanilla ES6 JavaScript — no frameworks, no build step
 * Privacy: GA4 loads only after explicit user consent (GDPR / DPDPA)
 *          No email is stored, logged, or sent anywhere (PRD AC-19, Section 4.2)
 * Safety:  All gtag calls are wrapped in try/catch; the CTA flow works even if
 *          GA4 is blocked by an ad blocker or user has declined consent (PRD AC-33)
 */

// ── Cookie Consent & Conditional GA4 Loading ──────────────────────────────
// Must run before the main IIFE — sets up GA4 state before any event fires.
(function () {
  'use strict';

  var GA4_ID = 'G-XXXXXXXXXX'; // BEFORE LAUNCH: replace with real GA4 Measurement ID

  // Tracks the element that triggered openModal(), so focus can be restored on close
  var _modalTrigger = null;

  // Holds the cleanup function returned by trapFocus(); called in closeModal()
  var _trapCleanup = null;

  // Inject GA4 script dynamically — called only on consent or prior acceptance
  function loadGA4() {
    if (window.__ga4Loaded) return; // Guard: load only once
    window.__ga4Loaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  // Read consent state from cookie
  function getConsent() {
    try {
      var match = document.cookie.match(/(?:^|;\s*)cookieConsent=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch (e) { return null; }
  }

  // Persist consent state as a first-party cookie (365-day expiry, SameSite=Lax)
  // This is a strictly necessary functional cookie — exempt from consent under GDPR/ePrivacy.
  function setConsent(val) {
    try {
      var expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = 'cookieConsent=' + encodeURIComponent(val) +
        '; expires=' + expires.toUTCString() +
        '; path=/' +
        '; SameSite=Lax';
    } catch (e) {}
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.style.display = 'none';
  }

  function showBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.style.display = '';
  }

  // Trap keyboard focus inside modalEl while it is open.
  // triggerEl is stored for context but not used inside the listener directly.
  // Returns a cleanup function that removes the keydown listener.
  function trapFocus(modalEl) {
    var focusable = modalEl.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    function onKeyDown(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        // Shift+Tab on first element → wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab on last element → wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    modalEl.addEventListener('keydown', onKeyDown);

    return function () {
      modalEl.removeEventListener('keydown', onKeyDown);
    };
  }

  function openModal() {
    var m = document.getElementById('cookie-modal');
    if (m) {
      _modalTrigger = document.activeElement;
      m.style.display = '';
      // Move focus to close button for keyboard users
      var closeBtn = document.getElementById('cookie-modal-close');
      if (closeBtn) {
        setTimeout(function () {
          closeBtn.focus();
          _trapCleanup = trapFocus(m);
        }, 50);
      }
    }
  }

  function closeModal() {
    var m = document.getElementById('cookie-modal');
    if (m) m.style.display = 'none';
    if (_trapCleanup) { _trapCleanup(); _trapCleanup = null; }
    if (_modalTrigger) { _modalTrigger.focus(); _modalTrigger = null; }
  }

  // On load: check stored consent and act immediately
  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();

    if (consent === 'accepted') {
      loadGA4(); // Prior acceptance: load GA4 without showing banner
    } else if (consent === null) {
      showBanner(); // First visit: show banner
    }
    // consent === 'rejected': GA4 stays off, banner stays hidden

    // Accept
    var acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('accepted');
        loadGA4();
        hideBanner();
      });
    }

    // Decline
    var declineBtn = document.getElementById('cookie-decline');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        setConsent('rejected');
        hideBanner();
      });
    }

    // Learn more (banner) → open modal
    var learnMore = document.getElementById('cookie-learn-more');
    if (learnMore) {
      learnMore.addEventListener('click', openModal);
    }

    // Footer cookies link → open modal
    var footerLink = document.getElementById('footer-cookies-link');
    if (footerLink) {
      footerLink.addEventListener('click', openModal);
    }

    // Modal close button
    var modalClose = document.getElementById('cookie-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    // Modal backdrop click closes modal
    var backdrop = document.querySelector('.cookie-modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); }
    });
  });

})();


// ── Main page logic: CTA scroll, form validation, analytics events ─────────
(function () {
  'use strict';

  // ── Safe gtag wrapper ──────────────────────────────────────────────────────
  // Guards against:
  // 1. GA4 not loaded (user declined consent or ad blocker)
  // 2. GA4 script failed to load from network
  // Events fire silently if gtag is unavailable — user flow is never interrupted.
  function fireEvent(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
    } catch (e) {
      // Fail silently — never interrupt the CTA flow
    }
  }

  // ── Email validation ───────────────────────────────────────────────────────
  // Regex from PRD Section 3.4 / AC-10 / AC-11
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // ── DOMContentLoaded guard ─────────────────────────────────────────────────
  function init() {

    // ── Hero CTA click → smooth scroll to waitlist ─────────────────────────
    var heroCta = document.getElementById('hero-cta');
    if (heroCta) {
      heroCta.addEventListener('click', function (e) {
        e.preventDefault();

        // Fire analytics event — no PII included
        fireEvent('cta_click', {
          event_category: 'engagement',
          event_label: 'hero_cta'
        });

        // Smooth scroll to waitlist section
        var target = document.getElementById('waitlist');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Move focus to section heading for keyboard / screen reader users
          var heading = document.getElementById('waitlist-heading');
          if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
          }
        }
      });
    }

    // ── Waitlist form ──────────────────────────────────────────────────────
    var form         = document.getElementById('waitlist-form');
    var formWrap     = document.getElementById('waitlist-form-wrap');
    var confirmation = document.getElementById('waitlist-confirmation');
    var emailInput   = document.getElementById('email-input');
    var emailError   = document.getElementById('email-error');

    if (form && emailInput && emailError && formWrap && confirmation) {

      function showError() {
        emailInput.classList.add('input-error');
        emailInput.setAttribute('aria-invalid', 'true');
        emailError.classList.add('visible');
      }

      function clearError() {
        emailInput.classList.remove('input-error');
        emailInput.setAttribute('aria-invalid', 'false');
        emailError.classList.remove('visible');
      }

      // Live inline feedback: clear error as soon as value becomes valid
      emailInput.addEventListener('input', function () {
        if (emailInput.classList.contains('input-error')) {
          if (isValidEmail(emailInput.value)) {
            clearError();
          }
        }
      });

      // Form submit handler
      form.addEventListener('submit', function (e) {
        // Always prevent default — no server submission (PRD Section 3.4, AC-29)
        e.preventDefault();

        var emailValue = emailInput.value;

        if (!isValidEmail(emailValue)) {
          showError();
          emailInput.focus();
          return;
        }

        clearError();

        // Fire analytics event
        // IMPORTANT: email address is intentionally NOT included in any parameter
        // PRD AC-19, Section 6.5 hard constraint
        fireEvent('signup_attempted', {
          event_category: 'conversion',
          event_label: 'waitlist_form'
          // email intentionally excluded — PRD AC-19 / Section 6.5
        });

        // Hide the form
        formWrap.style.display = 'none';

        // Show inline confirmation
        confirmation.removeAttribute('hidden');
        confirmation.classList.add('visible');

        // Scroll confirmation into view on mobile
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

  } // end init()

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); // end main IIFE
