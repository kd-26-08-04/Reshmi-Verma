/**
 * Reshmi Verma — Functional Nutrition & Consultation Intake Engine
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('consultation-booking-form');
    const tierCards = document.querySelectorAll('.tier-card');
    const selectedServiceInput = document.getElementById('selected-service-input');
    const bookingSuccessModal = document.getElementById('booking-success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Service tier selection
    tierCards.forEach(card => {
      const selectBtn = card.querySelector('.btn-select-tier');
      if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const serviceName = card.getAttribute('data-service-name') || 'Comprehensive Consultation';
          if (selectedServiceInput) {
            selectedServiceInput.value = serviceName;
          }
          // Highlight selected card
          tierCards.forEach(c => c.classList.remove('selected-plan'));
          card.classList.add('selected-plan');

          // Scroll to form smoothly
          const formAnchor = document.getElementById('intake-booking-section');
          if (formAnchor) {
            formAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
              document.getElementById('client-name-input')?.focus();
            }, 500);
          }
        });
      }
    });

    // Preload assessment data if available in localStorage
    const savedAssessment = localStorage.getItem('reshmi_assessment_results');
    const notesField = document.getElementById('client-notes-input');
    const savedBolt = localStorage.getItem('reshmi_bolt_score');

    if (notesField && (savedAssessment || savedBolt)) {
      let prefilledText = [];
      if (savedBolt) {
        prefilledText.push(`[My BOLT Score: ${savedBolt}s]`);
      }
      if (savedAssessment) {
        try {
          const parsed = JSON.parse(savedAssessment);
          prefilledText.push(`[Primary Focus: ${parsed.goal || 'General Health'}] (Resilience: ${parsed.averageResilience}%)`);
        } catch (e) {}
      }
      if (prefilledText.length > 0 && !notesField.value) {
        notesField.value = `${prefilledText.join(' ')} - `;
      }
    }

    // Date picker minimum today
    const dateInput = document.getElementById('booking-date-picker');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    // Form submission
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name-input')?.value || 'Guest Client';
        const email = document.getElementById('client-email-input')?.value || '';
        const phone = document.getElementById('client-phone-input')?.value || '';
        const service = selectedServiceInput?.value || 'Comprehensive Consultation';
        const date = dateInput?.value || 'Next Available Slot';
        const time = document.getElementById('booking-time-picker')?.value || '10:00 AM';
        const notes = notesField?.value || 'General consultation request';

        // Update modal details
        const confirmName = document.getElementById('confirm-client-name');
        const confirmService = document.getElementById('confirm-service-name');
        const confirmDate = document.getElementById('confirm-date-time');
        const whatsappBtn = document.getElementById('whatsapp-confirm-link');

        if (confirmName) confirmName.textContent = name;
        if (confirmService) confirmService.textContent = service;
        if (confirmDate) confirmDate.textContent = `${date} at ${time}`;

        // Create WhatsApp prefilled link
        if (whatsappBtn) {
          const cleanPhone = phone.replace(/[^0-9]/g, '');
          const message = encodeURIComponent(
            `Hello Reshmi Verma,\n\nI have requested a ${service} on ${date} at ${time}.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nNotes/BOLT: ${notes}`
          );
          // WhatsApp API link (Direct clinic contact)
          whatsappBtn.href = `https://wa.me/?text=${message}`;
        }

        // Show success modal
        if (bookingSuccessModal) {
          bookingSuccessModal.style.display = 'flex';
        }
      });
    }

    if (modalCloseBtn && bookingSuccessModal) {
      modalCloseBtn.addEventListener('click', () => {
        bookingSuccessModal.style.display = 'none';
        bookingForm?.reset();
      });
    }
  });
})();
