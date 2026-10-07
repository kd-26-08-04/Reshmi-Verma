/**
 * Reshmi Verma — Clinical Contact Us Engine (EmailJS Integration)
 * 
 * Security Features:
 * - Environment variable credential isolation via import.meta.env
 * - Honeypot anti-spam protection (catches automated spambots)
 * - XSS input sanitization (strips malicious script/HTML injection)
 * - Rate limiting / submission cooldown
 * - Graceful fallback to direct clinic mailto/WhatsApp
 */

import emailjs from '@emailjs/browser';

(function () {
  'use strict';

  // Environment credentials
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  // Initialize EmailJS if public key is present and not a placeholder
  const isKeyConfigured = PUBLIC_KEY && !PUBLIC_KEY.includes('YOUR_EMAILJS_PUBLIC_KEY') && !PUBLIC_KEY.includes('placeholder');
  if (isKeyConfigured) {
    try {
      emailjs.init({ publicKey: PUBLIC_KEY });
    } catch (err) {
      console.warn('EmailJS initialization warning:', err);
    }
  }

  // HTML sanitization helper to block Stored XSS / script injections
  function sanitizeInput(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim();
  }

  // Email regex validation
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('clinical-contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = document.getElementById('contact-btn-text');
    const btnIcon = document.getElementById('contact-btn-icon');
    const statusAlert = document.getElementById('contact-status-alert');
    const statusIcon = document.getElementById('contact-status-icon');
    const statusMessage = document.getElementById('contact-status-message');
    const hpField = document.getElementById('contact-hp-field');

    if (!form) return;

    let lastSubmissionTime = 0;
    const COOLDOWN_MS = 15000; // 15 seconds rate-limiting cooldown

    function setAlert(type, message, icon) {
      if (!statusAlert) return;
      statusAlert.className = `form-status-alert active ${type}`;
      if (statusIcon) statusIcon.innerHTML = icon || (type === 'success' ? '✓' : 'ℹ');
      if (statusMessage) statusMessage.innerHTML = message;
      statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
      if (statusAlert) statusAlert.className = 'form-status-alert';
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      if (isLoading) {
        if (btnText) btnText.textContent = 'Transmitting Clinical Inquiry...';
        if (btnIcon) btnIcon.outerHTML = '<span id="contact-btn-icon" class="btn-spinner"></span>';
      } else {
        if (btnText) btnText.textContent = 'Send Message to Reshmi Verma';
        const currentIcon = document.getElementById('contact-btn-icon');
        if (currentIcon) {
          currentIcon.outerHTML = '<svg id="contact-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      // 1. Anti-spam Honeypot Check (Bot trap)
      if (hpField && hpField.value) {
        console.warn('Bot detected via honeypot trap.');
        // Fake success for bots to prevent retries
        setAlert('success', 'Thank you! Your inquiry has been dispatched.', '✓');
        form.reset();
        return;
      }

      // 2. Rate-Limiting Cooldown Check
      const now = Date.now();
      if (now - lastSubmissionTime < COOLDOWN_MS) {
        const remaining = Math.ceil((COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
        setAlert('info', `Please wait ${remaining} seconds before submitting another inquiry.`, '⏳');
        return;
      }

      // 3. Extract and Sanitize Inputs
      const rawName = document.getElementById('contact-name')?.value || '';
      const rawEmail = document.getElementById('contact-email')?.value || '';
      const rawPhone = document.getElementById('contact-phone')?.value || '';
      const rawSubject = document.getElementById('contact-subject')?.value || 'General Health Inquiry';
      const rawMessage = document.getElementById('contact-message')?.value || '';

      const name = sanitizeInput(rawName);
      const email = sanitizeInput(rawEmail);
      const phone = sanitizeInput(rawPhone);
      const subject = sanitizeInput(rawSubject);
      const message = sanitizeInput(rawMessage);

      // 4. Strict Validation
      if (!name || name.length < 2) {
        setAlert('error', 'Please provide your full name (minimum 2 characters).', '⚠️');
        document.getElementById('contact-name')?.focus();
        return;
      }

      if (!email || !isValidEmail(email)) {
        setAlert('error', 'Please provide a valid email address so we can reply to you.', '⚠️');
        document.getElementById('contact-email')?.focus();
        return;
      }

      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone || digitsOnly.length < 8) {
        setAlert('error', 'Please provide a valid contact number (at least 8 digits).', '⚠️');
        document.getElementById('contact-phone')?.focus();
        return;
      }

      if (!message || message.length < 10) {
        setAlert('error', 'Please provide a brief message or symptom description (at least 10 characters).', '⚠️');
        document.getElementById('contact-message')?.focus();
        return;
      }

      // 5. Submit through EmailJS or graceful Fallback
      setLoading(true);

      const templateParams = {
        from_name: name,
        from_email: email,
        reply_to: email,
        phone_number: phone,
        inquiry_subject: subject,
        message: message,
        submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        clinic_destination: 'Rainbow Medinova Diagnostics - Reshmi Verma'
      };

      try {
        if (isKeyConfigured && SERVICE_ID && TEMPLATE_ID && !SERVICE_ID.includes('placeholder')) {
          // Send via official EmailJS SDK
          const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
          console.log('EmailJS response:', response.status, response.text);

          lastSubmissionTime = Date.now();
          setAlert(
            'success',
            `<strong>Inquiry Received!</strong> Thank you ${name}. Your message regarding <em>${subject}</em> has been securely delivered to Reshmi Verma's clinical team. We will respond within 12–24 business hours to <strong>${email}</strong>.`,
            '✓'
          );
          form.reset();
        } else {
          // Simulation / Developer Mode fallback
          lastSubmissionTime = Date.now();
          console.info('EmailJS Simulation (Set real credentials in .env for production dispatch):', templateParams);
          
          setAlert(
            'success',
            `<strong>Inquiry Recorded (Sandbox Mode):</strong> Thank you ${name}. Your message has been prepared for Reshmi Verma. To activate live email dispatch, please enter your EmailJS credentials in the <code>.env</code> file.<br><br>
            <div style="margin-top: 8px;">
              <a href="https://wa.me/?text=${encodeURIComponent(`Hello Reshmi Verma, my name is ${name}. I have an inquiry regarding: ${subject}.\n\nMessage: ${message}`)}" target="_blank" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.82rem; margin-right: 8px;">
                <span>💬 Send via WhatsApp</span>
              </a>
              <a href="mailto:consult@reshmiverma.com?subject=${encodeURIComponent(`Inquiry: ${subject} - ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`)}" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.82rem;">
                <span>✉️ Open Default Mail</span>
              </a>
            </div>`,
            '✓'
          );
          form.reset();
        }
      } catch (sendError) {
        console.error('EmailJS transmission failed:', sendError);
        setAlert(
          'error',
          `Could not send your message automatically via EmailJS (${sendError.text || sendError.message || 'Network error'}). You can contact Reshmi Verma directly at <a href="mailto:consult@reshmiverma.com" style="color: #991B1B; font-weight: 700; text-decoration: underline;">consult@reshmiverma.com</a> or via WhatsApp.`,
          '⚠️'
        );
      } finally {
        setLoading(false);
      }
    });
  });
})();
