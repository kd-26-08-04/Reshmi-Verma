/**
 * Dr. Reshmi Verma — Health Resilience Assessment Engine
 * Multi-domain clinical evaluation covering:
 * - Gut & Intestinal Mucosal Barrier
 * - Autonomic Breath & Vagus Nerve Resilience
 * - Hormonal, Thyroid & Metabolic Vitality
 * - Sleep Architecture & Nocturnal Airway Resilience
 */

(function () {
  'use strict';

  const questions = [
    {
      id: 1,
      domain: 'challenge',
      title: 'What health challenge are you currently facing?',
      subtitle: 'Select the one that resonates most with your day-to-day feeling.',
      options: [
        { label: 'Gut issues: Bloating, acid reflux, IBS, food sensitivities, or sluggish motility', scores: { gut: 40, breath: 65, hormones: 55, sleep: 60 } },
        { label: 'Respiratory & stress: Shallow chest breathing, anxiety surges, or low stamina', scores: { gut: 60, breath: 40, hormones: 50, sleep: 55 } },
        { label: 'Metabolism & fatigue: Stubborn weight retention, thyroid drag, or afternoon crashes', scores: { gut: 55, breath: 60, hormones: 40, sleep: 50 } },
        { label: 'Sleep & airway: Fragmented sleep, snoring, mouth breathing, or morning exhaustion', scores: { gut: 65, breath: 50, hormones: 55, sleep: 35 } },
        { label: 'Longevity & prevention: Want to optimize cellular biomarkers and biohack vitality', scores: { gut: 75, breath: 80, hormones: 75, sleep: 75 } }
      ]
    },
    {
      id: 2,
      domain: 'duration',
      title: 'How long have you been experiencing this?',
      subtitle: "There's no wrong answer — we just want to understand your timeline.",
      options: [
        { label: 'Less than 6 months (Acute / recent onset)', multiplier: 1.1 },
        { label: '6 months to 2 years (Establishing pattern)', multiplier: 0.95 },
        { label: '2 to 5 years (Chronic systemic compensation)', multiplier: 0.85 },
        { label: 'More than 5 years (Deeply ingrained cellular dysfunction)', multiplier: 0.75 }
      ]
    },
    {
      id: 3,
      domain: 'history',
      title: 'Have you tried any treatments or coaching before?',
      subtitle: 'It is okay if you have — this helps Dr. Reshmi understand your clinical background.',
      options: [
        { label: 'Conventional medications, PPIs, or pharmaceutical pills from doctors', tag: 'conventional' },
        { label: 'Standard diet plans, calorie counting, or generic fitness programs', tag: 'diets' },
        { label: 'Alternative therapies, ayurveda, or sporadic supplements', tag: 'holistic' },
        { label: 'No, this is my first time seeking root-cause functional guidance', tag: 'first-time' }
      ]
    },
    {
      id: 4,
      domain: 'goals',
      title: 'What is your primary goal for the next 90 days?',
      subtitle: 'What would genuine transformation look like in your life?',
      options: [
        { label: 'Heal gut lining, abolish bloating, and digest meals with complete ease', focus: 'gut' },
        { label: 'Master autonomic breathwork to silence anxiety and boost aerobic stamina', focus: 'breath' },
        { label: 'Rebalance hormones, achieve effortless fat loss, and sustain all-day energy', focus: 'metabolism' },
        { label: 'Restore uninterrupted deep REM sleep and wake up feeling truly energized', focus: 'sleep' },
        { label: 'Comprehensive 360° functional overhaul: Gut, breath, and cellular longevity', focus: 'all' }
      ]
    },
    {
      id: 5,
      domain: 'readiness',
      title: 'How ready are you to start your healing journey?',
      subtitle: "Be honest — there's no pressure. Just absolute clarity.",
      options: [
        { label: '100% Committed — Ready to follow a personalized clinical roadmap', readiness: 'high' },
        { label: 'Interested & motivated — Want to consult with Dr. Reshmi first', readiness: 'medium' },
        { label: 'Gathering information — Curious to see my baseline health report', readiness: 'exploring' }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  const userAnswers = [];

  const elements = {
    card: document.getElementById('assessment-quiz-container'),
    progressBar: document.getElementById('assessment-progress-fill'),
    stepIndicator: document.getElementById('assessment-step-num'),
    title: document.getElementById('assessment-q-title'),
    subtitle: document.getElementById('assessment-q-subtitle'),
    optionsBox: document.getElementById('assessment-options-box'),
    resultsBox: document.getElementById('assessment-results-box'),
    prevBtn: document.getElementById('assessment-prev-btn')
  };

  function renderQuestion() {
    if (!elements.card || !elements.title) return;

    const q = questions[currentQuestionIndex];
    const total = questions.length;
    const progressPercent = ((currentQuestionIndex + 1) / total) * 100;

    if (elements.progressBar) elements.progressBar.style.width = `${progressPercent}%`;
    if (elements.stepIndicator) elements.stepIndicator.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
    elements.title.textContent = q.title;
    elements.subtitle.textContent = q.subtitle;

    if (elements.prevBtn) {
      elements.prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-flex' : 'none';
    }

    elements.optionsBox.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-button';
      btn.innerHTML = `
        <span>${opt.label}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      `;
      btn.addEventListener('click', () => selectAnswer(idx));
      elements.optionsBox.appendChild(btn);
    });
  }

  function selectAnswer(index) {
    const q = questions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = q.options[index];

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      calculateAndShowResults();
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    }
  }

  function calculateAndShowResults() {
    // Base scores
    let gutScore = 60;
    let breathScore = 60;
    let hormoneScore = 60;
    let sleepScore = 60;

    if (userAnswers[0]?.scores) {
      gutScore = userAnswers[0].scores.gut;
      breathScore = userAnswers[0].scores.breath;
      hormoneScore = userAnswers[0].scores.hormones;
      sleepScore = userAnswers[0].scores.sleep;
    }

    const multiplier = userAnswers[1]?.multiplier || 1.0;
    gutScore = Math.min(95, Math.max(30, Math.round(gutScore * multiplier)));
    breathScore = Math.min(95, Math.max(30, Math.round(breathScore * multiplier)));
    hormoneScore = Math.min(95, Math.max(30, Math.round(hormoneScore * multiplier)));
    sleepScore = Math.min(95, Math.max(30, Math.round(sleepScore * multiplier)));

    const averageResilience = Math.round((gutScore + breathScore + hormoneScore + sleepScore) / 4);

    if (elements.card) {
      const quizActiveView = document.getElementById('quiz-active-view');
      if (quizActiveView) quizActiveView.style.display = 'none';
      if (elements.resultsBox) elements.resultsBox.style.display = 'block';

      // Update Result Elements
      const overallElem = document.getElementById('result-overall-score');
      const gutElem = document.getElementById('score-gut-val');
      const gutBar = document.getElementById('bar-gut-fill');
      const breathElem = document.getElementById('score-breath-val');
      const breathBar = document.getElementById('bar-breath-fill');
      const hormoneElem = document.getElementById('score-hormone-val');
      const hormoneBar = document.getElementById('bar-hormone-fill');
      const sleepElem = document.getElementById('score-sleep-val');
      const sleepBar = document.getElementById('bar-sleep-fill');
      const summaryText = document.getElementById('result-clinical-summary');
      const primaryGoalText = document.getElementById('result-primary-focus');

      if (overallElem) overallElem.textContent = `${averageResilience}%`;
      if (gutElem) gutElem.textContent = `${gutScore}/100`;
      if (gutBar) gutBar.style.width = `${gutScore}%`;
      if (breathElem) breathElem.textContent = `${breathScore}/100`;
      if (breathBar) breathBar.style.width = `${breathScore}%`;
      if (hormoneElem) hormoneElem.textContent = `${hormoneScore}/100`;
      if (hormoneBar) hormoneBar.style.width = `${hormoneScore}%`;
      if (sleepElem) sleepElem.textContent = `${sleepScore}/100`;
      if (sleepBar) sleepBar.style.width = `${sleepScore}%`;

      if (primaryGoalText) {
        primaryGoalText.textContent = userAnswers[3]?.label || 'Comprehensive cellular metabolic reset';
      }

      if (summaryText) {
        summaryText.innerHTML = `
          Based on your answers, your baseline biological resilience is at <strong>${averageResilience}%</strong>. 
          Your answers indicate that energy, digestion, autonomic breathing, and sleep are interconnected signals rather than isolated symptoms.
          In a 1-on-1 <strong>Health Clarity Session</strong>, Dr. Reshmi Verma decodes these exact patterns using the SAMYA framework to create your individualized protocol.
        `;
      }

      // Save to localStorage
      try {
        localStorage.setItem('reshmi_assessment_results', JSON.stringify({
          averageResilience,
          gutScore,
          breathScore,
          hormoneScore,
          sleepScore,
          goal: userAnswers[3]?.label,
          readiness: userAnswers[4]?.readiness
        }));
      } catch (e) {}

      // Scroll to results
      elements.resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function restartAssessment() {
    currentQuestionIndex = 0;
    userAnswers.length = 0;
    const quizActiveView = document.getElementById('quiz-active-view');
    if (quizActiveView) quizActiveView.style.display = 'block';
    if (elements.resultsBox) elements.resultsBox.style.display = 'none';
    renderQuestion();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (elements.card) {
      renderQuestion();
    }
    if (elements.prevBtn) {
      elements.prevBtn.addEventListener('click', previousQuestion);
    }
    const restartBtn = document.getElementById('assessment-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', restartAssessment);
    }
  });

  window.AssessmentEngine = {
    renderQuestion,
    selectAnswer,
    restartAssessment
  };
})();
