/**
 * Dr. Reshmi Verma — Master UI/UX & Interactive Logic
 * Features:
 * - Ask Eva AI Assistant Widget (Medical, Nutrition & Breathwork knowledge)
 * - Navigation Scroll Dynamics & Mobile Drawer
 * - Interactive Accordions & Modals
 */

(function () {
  'use strict';

  // 1. Navigation Scroll Effect
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Menu Toggle
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Close menu when clicking outside or on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '&#9776;';
      });
    });
  }

  // 3. Ask Eva AI Assistant
  function initEvaAssistant() {
    const trigger = document.getElementById('eva-trigger');
    const drawer = document.getElementById('eva-drawer');
    const closeBtn = document.getElementById('eva-close');
    const sendBtn = document.getElementById('eva-send');
    const input = document.getElementById('eva-input');
    const chatBody = document.getElementById('eva-body');
    const chips = document.querySelectorAll('.quick-chip');

    if (!trigger || !drawer) return;

    trigger.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    const knowledgeBase = [
      {
        triggers: ['bolt', 'oxygen', 'hold', 'test', 'breath hold'],
        reply: "The BOLT (Body Oxygen Level Test) measures your body's tolerance to carbon dioxide and reveals how efficiently oxygen reaches your cells via the Bohr Effect. A score under 20s suggests over-breathing and airway stress, while 30s+ indicates superior aerobic resilience."
      },
      {
        triggers: ['gut', 'bloat', 'acid', 'reflux', 'digestion', 'ibs', 'microbiome'],
        reply: "Dr. Reshmi Verma's gut mucosal protocol treats the intestinal barrier as a dynamic ecosystem. We address leaky gut, dysbiosis, and the gut-brain axis using targeted phyto-botanicals, polyphenols, and vagus nerve stimulation."
      },
      {
        triggers: ['reshmi', 'doctor', 'bio', 'who', 'qualification'],
        reply: "Dr. Reshmi Verma is a Biotechnologist, Functional Nutritionist, Certified Oxygen Advantage Coach, and Director of Rainbow Medinova Diagnostic Services with 20+ years in healthcare diagnostics. Having personally transformed her health and lost 38+ kg, she bridges hard science with deep empathy."
      },
      {
        triggers: ['samya', 'framework', 'approach', 'process'],
        reply: "SAMYA is Dr. Reshmi's signature framework: 1. See the signs, 2. Ask the right questions, 3. Map the patterns across gut, breath, hormones & sleep, 4. Your customized solution, and 5. Achieve lasting wellness."
      },
      {
        triggers: ['consult', 'book', 'appointment', 'fee', 'price', 'session'],
        reply: "You can book an Initial Discovery Call (20 min) or a Comprehensive Clinical Consultation (60 min). Simply click the 'Book Consultation' button on this page to pick a date and share your health priorities."
      },
      {
        triggers: ['478', 'box', 'breathwork', 'technique', 'vagal'],
        reply: "Breathwork acts as direct neuromodulation. For example, 4-7-8 breathing extends exhalations to stimulate vagal efferent fibers, lowering heart rate within seconds, while 5-5 Coherent Breathing optimizes Heart Rate Variability (HRV)."
      }
    ];

    function appendMessage(sender, text) {
      if (!chatBody) return;
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = text;
      chatBody.appendChild(bubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleUserInput(query) {
      if (!query.trim()) return;
      appendMessage('user', query);
      if (input) input.value = '';

      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'chat-bubble bot';
      typing.innerHTML = '<em>Thinking...</em>';
      chatBody.appendChild(typing);
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const lower = query.toLowerCase();
        let matchedReply = null;

        for (const item of knowledgeBase) {
          if (item.triggers.some(t => lower.includes(t))) {
            matchedReply = item.reply;
            break;
          }
        }

        if (!matchedReply) {
          matchedReply = "I understand. Nutrition, breathwork, and metabolic health are deeply connected. You can explore our interactive BOLT test or schedule a 1-on-1 Health Clarity Session with Dr. Reshmi Verma for an individualized roadmap.";
        }

        appendMessage('bot', matchedReply);
      }, 600);
    }

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => handleUserInput(input.value));
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput(input.value);
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.textContent;
        handleUserInput(text);
      });
    });
  }

  // 4. FAQ Accordion Logic
  function initAccordions() {
    const accordions = document.querySelectorAll('.faq-item');
    accordions.forEach(item => {
      const header = item.querySelector('.faq-question');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          accordions.forEach(i => i.classList.remove('active'));
          if (!isOpen) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initEvaAssistant();
    initAccordions();
  });
})();
