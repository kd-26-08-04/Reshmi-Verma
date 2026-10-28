import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, RAZORPAY_PAYMENT_URL } from '../utils/api';

/**
 * CLINICAL GUT HEALTH ASSESSMENT
 * Theme: Strictly Neon Pink (#FF1493 / #FF007F) Luxury Medical Aesthetics
 * Scored Questions Q1–Q8 (0–4 points, Raw max 32, scaled to 100)
 * Personalisation Questions Q9–Q18
 * EmailJS Direct Client Dispatch with user's exact draft & parameters
 */

// Universal options for Scored Questions Q1 – Q8 (Pure Neon Pink Scale)
const FREQUENCY_OPTIONS = [
  { label: 'Never', points: 0, badgeClass: 'point-badge-0' },
  { label: 'Occasionally', points: 1, badgeClass: 'point-badge-1' },
  { label: 'Some days', points: 2, badgeClass: 'point-badge-2' },
  { label: 'Most days', points: 3, badgeClass: 'point-badge-3' },
  { label: 'Daily or almost daily', points: 4, badgeClass: 'point-badge-4' }
];

const ASSESSMENT_STRUCTURE = [
  {
    id: 'section_scored',
    sectionNumber: 1,
    sectionTitle: 'Digestive Symptom Frequency',
    sectionBadge: 'Part 1 of 4 • Scored Questions',
    sectionDesc: 'Rate the frequency of each symptom. Each response is scored from 0–4 points.',
    questions: [
      {
        id: 'q1',
        qNumber: 'Q1',
        title: 'How often do you experience bloating or abdominal distension?',
        subtitle: 'Feeling swollen, visibly extended, or tightness in the abdomen.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q2',
        qNumber: 'Q2',
        title: 'How often do you experience excessive gas or flatulence?',
        subtitle: 'Frequent intestinal gas, burping, or lower abdominal discomfort.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q3',
        qNumber: 'Q3',
        title: 'How often do you experience constipation or difficulty passing stools?',
        subtitle: 'Infrequent bowel movements, straining, or hard/dry evacuation.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q4',
        qNumber: 'Q4',
        title: 'How often do you experience loose stools or diarrhoea?',
        subtitle: 'Unformed, urgent, or frequent liquid bowel movements.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q5',
        qNumber: 'Q5',
        title: 'How often do you feel that you have not completely emptied your bowels?',
        subtitle: 'Tenesmus or a persistent sensation of incomplete evacuation.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q6',
        qNumber: 'Q6',
        title: 'How often do you experience abdominal discomfort or cramping?',
        subtitle: 'Aching, spasms, or generalized gut pain across different times of day.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q7',
        qNumber: 'Q7',
        title: 'How often do you experience acidity, heartburn or reflux?',
        subtitle: 'Burning sensation in chest/throat, sour regurgitation, or epigastric heat.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      },
      {
        id: 'q8',
        qNumber: 'Q8',
        title: 'How often do you experience uncomfortable fullness or heaviness after meals?',
        subtitle: 'Feeling overly full even after modest portions or sluggish stomach emptying.',
        type: 'scored',
        options: FREQUENCY_OPTIONS
      }
    ]
  },
  {
    id: 'section_habits',
    sectionNumber: 2,
    sectionTitle: 'Bowel Habits & Symptom Patterns',
    sectionBadge: 'Part 2 of 4 • Personalisation',
    sectionDesc: 'These answers identify your unique gut motility, stool profile, and trigger patterns.',
    questions: [
      {
        id: 'q9',
        qNumber: 'Q9',
        title: 'How often do you typically have a bowel movement?',
        subtitle: 'Choose the option that best reflects your usual transit rhythm.',
        type: 'single',
        options: [
          'More than once daily',
          'Once daily',
          'Every other day',
          'Two to three times per week',
          'Less than twice per week',
          'It varies considerably'
        ]
      },
      {
        id: 'q10',
        qNumber: 'Q10',
        title: 'How would you describe your usual stool consistency?',
        subtitle: 'Referencing typical stool appearance over the past 4 weeks.',
        type: 'single',
        options: [
          'Hard, dry or pellet-like',
          'Firm and formed',
          'Soft and formed',
          'Loose or mushy',
          'Watery',
          'Alternates between different types',
          'Unsure'
        ]
      },
      {
        id: 'q11',
        qNumber: 'Q11',
        title: 'When do you typically experience bloating or digestive discomfort?',
        subtitle: 'Select all that apply to pinpoint timing patterns.',
        type: 'multi',
        exclusiveOption: 'I do not experience these symptoms',
        options: [
          'On waking or before eating',
          'During meals',
          'Within 30–60 minutes after meals',
          'A few hours after eating',
          'Mostly in the evening',
          'It varies',
          'I do not experience these symptoms'
        ]
      },
      {
        id: 'q12',
        qNumber: 'Q12',
        title: 'Have you noticed any foods that seem to trigger digestive symptoms?',
        subtitle: 'Select all that apply. (Perceived associations only; not confirmed food intolerances).',
        disclaimer: 'These answers indicate perceived associations only; they must not be presented as confirmed food intolerances.',
        type: 'multi',
        exclusiveOptions: ['No clear triggers', 'Unsure'],
        options: [
          'Milk or dairy products',
          'Wheat or gluten-containing foods',
          'Onion, garlic, beans or certain vegetables',
          'Fried or high-fat meals',
          'Spicy foods',
          'Tea, coffee or other caffeinated drinks',
          'Artificial sweeteners',
          'No clear triggers',
          'Unsure'
        ]
      }
    ]
  },
  {
    id: 'section_lifestyle',
    sectionNumber: 3,
    sectionTitle: 'Lifestyle & Health Context',
    sectionBadge: 'Part 3 of 4 • Broader Factors',
    sectionDesc: 'Understanding stress, circadian sleep, duration, and medical history.',
    questions: [
      {
        id: 'q13',
        qNumber: 'Q13',
        title: 'How would you describe your current stress levels?',
        subtitle: 'Stress directly modulates the enteric nervous system and vagal nerve tone.',
        type: 'single',
        options: ['Low', 'Moderate', 'High', 'Very high']
      },
      {
        id: 'q14',
        qNumber: 'Q14',
        title: 'How well are you sleeping?',
        subtitle: 'Circadian rhythms govern the intestinal mucosal barrier and microbiome repair.',
        type: 'single',
        options: [
          'I sleep well and wake up refreshed',
          'I get enough sleep but do not always feel rested',
          'My sleep is frequently interrupted',
          'I struggle to fall asleep or stay asleep',
          'My sleep schedule is irregular'
        ]
      },
      {
        id: 'q15',
        qNumber: 'Q15',
        title: 'How long have your digestive concerns been affecting you?',
        subtitle: 'Chronicity helps gauge functional adaptations and recovery timeframe.',
        type: 'single',
        options: [
          'Less than one month',
          'One to three months',
          'Three to six months',
          'More than six months',
          'Symptoms come and go'
        ]
      },
      {
        id: 'q16',
        qNumber: 'Q16',
        title: 'Have you been diagnosed with a digestive condition?',
        subtitle: 'Helps contextualize known clinical baseline history.',
        type: 'single',
        options: [
          'Irritable bowel syndrome (IBS)',
          'Gastro-oesophageal reflux disease (GERD)',
          'Coeliac disease',
          'Inflammatory bowel disease',
          'Another digestive condition',
          'No formal diagnosis',
          'Currently being investigated',
          'Prefer not to say'
        ]
      }
    ]
  },
  {
    id: 'section_priorities',
    sectionNumber: 4,
    sectionTitle: 'Your Health Priorities & Notes',
    sectionBadge: 'Part 4 of 4 • Next Steps',
    sectionDesc: 'Identify your main objective to personalize your snapshot result.',
    questions: [
      {
        id: 'q17',
        qNumber: 'Q17',
        title: 'What would you most like to improve first?',
        subtitle: 'Choose one primary concern to anchor your recovery roadmap.',
        type: 'single',
        options: [
          'Reduce bloating and gas',
          'Improve bowel regularity',
          'Understand food-related symptoms',
          'Improve comfort after meals',
          'Address acidity or reflux',
          'Understand my gut health more comprehensively',
          'Support an existing digestive condition',
          'I am unsure where to begin'
        ]
      },
      {
        id: 'q18',
        qNumber: 'Q18',
        title: 'Is there anything else about your digestion or health history you would like to share?',
        subtitle: 'Optional: medication, past surgeries, supplements, or additional context.',
        type: 'textarea',
        placeholder: 'e.g. Any specific medications, triggers, or personal health goals...'
      }
    ]
  }
];

export default function AssessmentPage() {
  const { user } = useAuth();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  // Lead Info State
  const [leadInfo, setLeadInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('reshmi_assessment_lead') || localStorage.getItem('reshmi_user_lead');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null;
  });

  // Pre-Assessment Gate Form state
  const [leadName, setLeadName] = useState(user?.name || '');
  const [leadPhone, setLeadPhone] = useState(user?.phone || '');
  const [leadEmail, setLeadEmail] = useState(user?.email || '');
  const [leadError, setLeadError] = useState('');
  const [leadSaving, setLeadSaving] = useState(false);

  // Email Scorecard Dispatch state
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (leadInfo?.email) {
      setEmailInput(leadInfo.email);
    } else if (user?.email) {
      setEmailInput(user.email);
    }
  }, [leadInfo, user]);

  useEffect(() => {
    if (user && !leadInfo) {
      if (user.name) setLeadName(user.name);
      if (user.phone) setLeadPhone(user.phone);
      if (user.email) setLeadEmail(user.email);
    }
  }, [user, leadInfo]);

  const currentSection = ASSESSMENT_STRUCTURE[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const totalQuestions = ASSESSMENT_STRUCTURE.reduce((acc, sec) => acc + sec.questions.length, 0);
  const currentAbsoluteQuestionIndex =
    ASSESSMENT_STRUCTURE.slice(0, currentSectionIndex).reduce((acc, sec) => acc + sec.questions.length, 0) +
    currentQuestionIndex;
  const progressPercent = Math.round(((currentAbsoluteQuestionIndex + 1) / totalQuestions) * 100);

  const handleStartFromGate = async (e) => {
    e.preventDefault();
    setLeadError('');
    if (!leadName.trim()) {
      setLeadError('Please enter your full name.');
      return;
    }
    if (!leadPhone.trim() || leadPhone.trim().length < 8) {
      setLeadError('Please enter a valid mobile number.');
      return;
    }

    setLeadSaving(true);
    const info = {
      id: `lead_${Date.now()}`,
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim()
    };

    try {
      const payload = {
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim().toLowerCase(),
        source: 'assessment_gate',
        step: 'Started Gut Health Assessment (Q3)',
        status: 'in_progress'
      };

      const res = await fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.lead?.id) info.id = data.lead.id;
      }
    } catch (err) {
      // offline fallback
    } finally {
      setLeadInfo(info);
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(info));
      setLeadSaving(false);
    }
  };

  const advanceToNext = (updatedAnswers) => {
    const currentLead = leadInfo || (function () {
      try {
        const stored = localStorage.getItem('reshmi_assessment_lead');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    })();

    if (currentLead && currentLead.id) {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentLead.id,
          name: currentLead.name,
          phone: currentLead.phone,
          email: currentLead.email,
          step: `${currentQuestion.qNumber}: ${currentQuestion.title}`,
          answers: updatedAnswers,
          status: 'in_progress'
        })
      }).catch(() => { });
    }

    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < ASSESSMENT_STRUCTURE.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      computeGutScorecard(updatedAnswers);
    }
  };

  const handleSelectScored = (option) => {
    const updated = {
      ...answers,
      [currentQuestion.id]: { label: option.label, points: option.points }
    };
    setAnswers(updated);
    advanceToNext(updated);
  };

  const handleSelectSingle = (option) => {
    const updated = {
      ...answers,
      [currentQuestion.id]: option
    };
    setAnswers(updated);
    advanceToNext(updated);
  };

  const handleToggleMulti = (option) => {
    const currentList = Array.isArray(answers[currentQuestion.id]) ? [...answers[currentQuestion.id]] : [];

    const isExclusive =
      currentQuestion.exclusiveOption === option ||
      (currentQuestion.exclusiveOptions && currentQuestion.exclusiveOptions.includes(option));

    let updatedList = [];
    if (isExclusive) {
      updatedList = currentList.includes(option) ? [] : [option];
    } else {
      const filtered = currentList.filter(
        item => item !== currentQuestion.exclusiveOption && !(currentQuestion.exclusiveOptions || []).includes(item)
      );
      if (filtered.includes(option)) {
        updatedList = filtered.filter(item => item !== option);
      } else {
        updatedList = [...filtered, option];
      }
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: updatedList
    }));
  };

  const handleMultiSubmit = () => {
    const currentList = answers[currentQuestion.id] || [];
    const updated = {
      ...answers,
      [currentQuestion.id]: currentList.length > 0 ? currentList : ['None selected']
    };
    setAnswers(updated);
    advanceToNext(updated);
  };

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleFinishAssessment = () => {
    computeGutScorecard(answers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSecIdx = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSecIdx);
      setCurrentQuestionIndex(ASSESSMENT_STRUCTURE[prevSecIdx].questions.length - 1);
    }
  };

  // =========================================================================
  // SCORING LOGIC & RESULT PERSONALISATION (Neon Pink Color Palette)
  // =========================================================================
  const computeGutScorecard = (allAnswers) => {
    const scoredKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

    let rawScore = 0;
    scoredKeys.forEach(k => {
      const pt = allAnswers[k]?.points;
      rawScore += typeof pt === 'number' ? pt : 0;
    });

    const gutSymptomScore = Math.round((rawScore / 32) * 100);

    let category = {};
    if (gutSymptomScore <= 24) {
      category = {
        scoreRange: '0–24',
        label: 'Lower reported symptom frequency',
        interpretation: 'Relatively few or infrequent symptoms reported',
        message:
          "You've reported relatively few or infrequent digestive symptoms. Your answers can help identify any specific concerns you would still like to explore.",
        badgeClass: 'category-badge-0',
        color: '#FF1493',
        bg: '#FFF0F6'
      };
    } else if (gutSymptomScore <= 49) {
      category = {
        scoreRange: '25–49',
        label: 'Some symptoms reported',
        interpretation: 'Symptoms are present and may merit further exploration',
        message:
          'Your answers suggest some digestive symptoms worth paying attention to. Understanding when they occur and what seems to influence them may help guide your next steps.',
        badgeClass: 'category-badge-1',
        color: '#FF1493',
        bg: '#FFF0F6'
      };
    } else if (gutSymptomScore <= 74) {
      category = {
        scoreRange: '50–74',
        label: 'Frequent symptoms reported',
        interpretation: 'Digestive symptoms occur regularly',
        message:
          "You've reported recurring digestive symptoms. A closer look at your symptom patterns, bowel habits, food associations and health history may help you understand what to discuss next.",
        badgeClass: 'category-badge-2',
        color: '#FF1493',
        bg: '#FFF0F6'
      };
    } else {
      category = {
        scoreRange: '75–100',
        label: 'Very frequent symptoms reported',
        interpretation: 'A high frequency of symptoms is reported',
        message:
          "You've reported frequent digestive symptoms. Consider discussing these concerns with a qualified healthcare professional to determine whether further medical evaluation is appropriate.",
        badgeClass: 'category-badge-3',
        color: '#FF1493',
        bg: '#FFF0F6'
      };
    }

    const q17Val = allAnswers['q17'] || '';
    let primaryConcern = 'Your Gut Health Priorities';
    if (q17Val.includes('bloating and gas')) primaryConcern = 'Bloating & Gas';
    else if (q17Val.includes('bowel regularity')) primaryConcern = 'Bowel Regularity';
    else if (q17Val.includes('food-related symptoms')) primaryConcern = 'Food-Related Symptoms';
    else if (q17Val.includes('comfort after meals')) primaryConcern = 'Upper Digestive Comfort';
    else if (q17Val.includes('acidity or reflux')) primaryConcern = 'Acidity & Reflux';
    else if (q17Val.includes('comprehensively')) primaryConcern = 'Overall Gut Health';
    else if (q17Val.includes('existing digestive condition')) primaryConcern = 'Existing Digestive Condition';
    else primaryConcern = 'Your Gut Health Priorities';

    const scoredQuestions = ASSESSMENT_STRUCTURE[0].questions;
    const reportedHighSymptoms = scoredQuestions
      .filter(q => (allAnswers[q.id]?.points ?? 0) >= 2)
      .map(q => ({
        qNumber: q.qNumber,
        title: q.title,
        response: allAnswers[q.id]?.label || '',
        points: allAnswers[q.id]?.points || 0
      }));

    const computed = {
      rawScore,
      gutSymptomScore,
      category,
      primaryConcern,
      reportedHighSymptoms,
      timingAssociations: allAnswers['q11'] || [],
      foodAssociations: allAnswers['q12'] || [],
      bowelFrequency: allAnswers['q9'] || 'Not specified',
      stoolConsistency: allAnswers['q10'] || 'Not specified',
      stressLevel: allAnswers['q13'] || 'Not specified',
      sleepQuality: allAnswers['q14'] || 'Not specified',
      duration: allAnswers['q15'] || 'Not specified',
      diagnosis: allAnswers['q16'] || 'None reported',
      notes: allAnswers['q18'] || ''
    };

    setResults(computed);

    try {
      localStorage.setItem('reshmi_gut_scorecard', JSON.stringify(computed));
    } catch (e) { }

    const currentLead = leadInfo || (function () {
      try {
        const stored = localStorage.getItem('reshmi_assessment_lead');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    })();

    if (currentLead && currentLead.id) {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentLead.id,
          name: currentLead.name,
          phone: currentLead.phone,
          email: currentLead.email,
          step: 'Completed Gut Health Assessment (Scorecard Ready)',
          answers: allAnswers,
          scores: {
            rawScore,
            gutScore: gutSymptomScore,
            gutSymptomScore,
            category: category.label,
            interpretation: category.interpretation,
            primaryConcern
          },
          status: 'completed_not_booked'
        })
      }).catch(() => { });
    }
  };

  // =========================================================================
  // EMAILJS SCORECARD DISPATCH INFRASTRUCTURE WITH USER'S EXACT DRAFT
  // =========================================================================
  const handleSendScorecardEmail = async (e) => {
    if (e) e.preventDefault();
    setEmailError('');

    const targetEmail = (emailInput || leadInfo?.email || user?.email || '').trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setEmailError('Please enter a valid email address to receive your scorecard.');
      return;
    }

    setEmailStatus('sending');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_znsc9db';
      const templateId =
        import.meta.env.VITE_EMAILJS_SCORECARD_TEMPLATE_ID ||
        'template_31l839e';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5XBYa7sia2W-qDbgm';

      const clientName = leadInfo?.name || user?.name || 'Valued Client';
      const firstName = clientName.split(' ')[0] || clientName;
      const clientPhone = leadInfo?.phone || user?.phone || 'Not provided';
      const consultationBookingLink = 'https://rzp.io/rzp/healthwithreshmi';
      const websiteUrl = 'https://healthwithreshmi.com';
      const logoUrl = 'https://healthwithreshmi.com/assets/images/Reshmi_Logo.png';

      // Exact email draft specified by user
      const exactDraftText = `Hi ${firstName},

I’m Sakshi from Team Health with Reshmi. Thank you for taking the time to complete our Gut Health Assessment.

Based on your responses, your Gut Symptom Score is ${results.gutSymptomScore}/100, indicating ${results.category.label}.

${results.category.message}

Your assessment is a useful starting point, but understanding your gut health often means looking beyond individual symptoms. Your digestive patterns, food responses, health history, stress and lifestyle may all be relevant to the bigger picture.

The next step is an opportunity to discuss your concerns personally with Reshmi.

When you book a Health Clarity Session, you’ll have the opportunity to speak directly with Reshmi Verma herself. She will help you explore your health priorities, discuss your concerns in greater detail and understand what a personalised approach could look like for you.

This one-to-one conversation gives you dedicated time with Reshmi to gain clarity on your concerns and consider the next steps best suited to your needs.

Ready to take the next step?

👉 Book Your Health Clarity Session with Reshmi:
${consultationBookingLink}

We look forward to helping you take a more informed and personalised approach to your health.

If you have any questions about booking, simply reply to this email. I’ll be happy to assist you.

Warm regards,
Sakshi
Team Health with Reshmi
${websiteUrl}`;

      const templateParams = {
        // Exact variables for the user's template
        'First Name': firstName,
        first_name: firstName,
        Score: `${results.gutSymptomScore}`,
        score: `${results.gutSymptomScore}`,
        'Score Category': results.category.label,
        score_category: results.category.label,
        'Personalised Result Paragraph': results.category.message,
        personalized_result_paragraph: results.category.message,
        'Consultation Booking Link': consultationBookingLink,
        consultation_booking_link: consultationBookingLink,
        'Website URL': websiteUrl,
        website_url: websiteUrl,
        logo_url: logoUrl,

        // Universal Recipient fields for EmailJS (resolves {{email}}, {{to_email}}, {{user_email}}, etc.)
        email: targetEmail,
        to_email: targetEmail,
        client_email: targetEmail,
        user_email: targetEmail,
        recipient_email: targetEmail,
        recipient: targetEmail,
        to: targetEmail,
        target_email: targetEmail,
        reply_to: 'support.reshmiverma@gmail.com',

        // Standard EmailJS recipient/client info
        to_name: clientName,
        name: clientName,
        client_name: clientName,
        client_phone: clientPhone,
        phone: clientPhone,
        subject: `Your Gut Health Assessment Results (${results.gutSymptomScore}/100) — Health with Reshmi`,
        message: exactDraftText
      };

      if (publicKey && !publicKey.includes('YOUR_')) {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
      }

      setEmailStatus('success');

      if (leadInfo?.id) {
        fetch(getApiUrl('/api/assessment-lead'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: leadInfo.id,
            email: targetEmail,
            step: `Scorecard Emailed to ${targetEmail}`
          })
        }).catch(() => { });
      }
    } catch (err) {
      console.error('Email dispatch error:', err);
      setEmailStatus('error');
      setEmailError(err?.text || err?.message || 'Could not send email directly. Please check connection.');
    }
  };

  const handleDownloadScorecard = () => {
    if (!results) return;

    const clientName = leadInfo?.name || user?.name || 'Valued Client';
    const clientPhone = leadInfo?.phone || user?.phone || 'Not provided';
    const clientEmail = emailInput || leadInfo?.email || user?.email || 'Not provided';
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const highSymptomsList = (results.reportedHighSymptoms || [])
      .map(s => `<li><strong>${s.title}:</strong> ${s.response} (${s.points} pts)</li>`)
      .join('') || '<li>No high-frequency symptoms reported.</li>';

    const timingList = Array.isArray(results.timingAssociations) && results.timingAssociations.length > 0
      ? results.timingAssociations.join(', ')
      : 'None highlighted';

    const foodList = Array.isArray(results.foodAssociations) && results.foodAssociations.length > 0
      ? results.foodAssociations.join(', ')
      : 'None highlighted';

    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gut Health Snapshot — ${clientName} | Health with Reshmi</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #FAF9F6;
      color: #121214;
      line-height: 1.6;
      padding: 30px 20px;
    }
    .report-card {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 18px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .report-header {
      background: linear-gradient(135deg, #121214 0%, #1F1B24 100%);
      color: #FFFFFF;
      padding: 36px 32px;
      border-bottom: 4px solid #FF1493;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .brand-script {
      color: #FF1493;
      font-family: 'Brush Script MT', cursive, sans-serif;
      font-size: 28px;
    }
    .report-badge {
      display: inline-block;
      background: rgba(255, 20, 147, 0.2);
      color: #FF66B2;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .client-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      background: rgba(255, 255, 255, 0.08);
      padding: 16px;
      border-radius: 12px;
      margin-top: 20px;
      font-size: 13px;
    }
    .client-meta div strong { color: #FF66B2; display: block; font-size: 11px; text-transform: uppercase; }
    .report-body { padding: 36px 32px; }
    .score-banner {
      background: #FFF0F6;
      border: 1.5px solid #FF1493;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 30px;
    }
    .score-value {
      font-size: 54px;
      font-weight: 800;
      color: #FF1493;
      line-height: 1;
      margin: 8px 0;
    }
    .score-tier {
      font-size: 20px;
      font-weight: 700;
      color: #121214;
    }
    .section-title {
      font-size: 17px;
      font-weight: 700;
      color: #121214;
      border-bottom: 2px solid #F1F5F9;
      padding-bottom: 8px;
      margin: 28px 0 16px;
    }
    .symptom-list {
      padding-left: 20px;
      color: #334155;
      font-size: 14px;
    }
    .symptom-list li { margin-bottom: 8px; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }
    .info-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 14px;
      border-radius: 10px;
      font-size: 13px;
    }
    .info-box strong { display: block; color: #475569; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
    .next-steps {
      background: #F0FDF4;
      border: 1px solid #86EFAC;
      border-radius: 14px;
      padding: 20px;
      margin-top: 30px;
    }
    .next-steps h4 { color: #166534; font-size: 16px; margin-bottom: 6px; }
    .next-steps p { color: #14532D; font-size: 13px; }
    .report-footer {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
    }
    .btn-booking {
      display: inline-block;
      margin-top: 14px;
      background: #FF1493;
      color: white !important;
      text-decoration: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="report-header">
      <div class="report-badge">Diagnostic Assessment Summary</div>
      <div class="brand-title">Healthwith<span class="brand-script">Reshmi</span></div>
      <div style="font-size: 13px; opacity: 0.85;">Reshmi Verma &bull; Functional Nutritionist &bull; Certified Biohacker</div>
      
      <div class="client-meta">
        <div><strong>Patient Name</strong>${clientName}</div>
        <div><strong>Date Generated</strong>${currentDate}</div>
        <div><strong>Primary Concern</strong>${results.primaryConcern || 'General Gut Health'}</div>
        <div><strong>Contact</strong>${clientPhone}</div>
      </div>
    </div>

    <div class="report-body">
      <div class="score-banner">
        <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Gut Symptom Score</div>
        <div class="score-value">${results.gutSymptomScore} <span style="font-size: 24px; color: #64748B; font-weight: 500;">/ 100</span></div>
        <div class="score-tier">${results.category?.label || 'Assessment Completed'}</div>
        <p style="font-size: 13px; color: #475569; margin-top: 8px; max-width: 580px; margin-left: auto; margin-right: auto;">
          ${results.category?.message || ''}
        </p>
      </div>

      <div class="section-title">Priority High-Frequency Symptoms</div>
      <ul class="symptom-list">
        ${highSymptomsList}
      </ul>

      <div class="section-title">Clinical Correlates &amp; Lifestyle Triggers</div>
      <div class="info-grid">
        <div class="info-box">
          <strong>Bowel Frequency</strong>
          ${results.bowelFrequency}
        </div>
        <div class="info-box">
          <strong>Stool Consistency</strong>
          ${results.stoolConsistency}
        </div>
        <div class="info-box">
          <strong>Symptom Timing</strong>
          ${timingList}
        </div>
        <div class="info-box">
          <strong>Food Sensitivity Triggers</strong>
          ${foodList}
        </div>
        <div class="info-box">
          <strong>Stress Level</strong>
          ${results.stressLevel}
        </div>
        <div class="info-box">
          <strong>Sleep Quality</strong>
          ${results.sleepQuality}
        </div>
      </div>

      <div class="next-steps">
        <h4>Clinical Next Step: 1-on-1 Consultation</h4>
        <p>
          Discuss this diagnostic snapshot directly with Reshmi Verma (18+ years experience in laboratory diagnostics, Functional Nutritionist, Certified Oxygen Advantage Coach). She will evaluate your symptom patterns alongside routine bloodwork to formulate your personalized root-cause protocol.
        </p>
        <a href="https://rzp.io/rzp/healthwithreshmi" class="btn-booking" target="_blank">
          Book Health Clarity Session with Reshmi Verma &rarr;
        </a>
      </div>
    </div>

    <div class="report-footer">
      <strong>HealthwithReshmi™ &bull; Rainbow Medinova Diagnostic Services, Nagpur</strong><br>
      This digital report is confidential and generated for functional health evaluation.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedName = (leadInfo?.name || 'Client').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `Reshmi_Verma_Gut_Health_Snapshot_${sanitizedName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restartAssessment = () => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setEmailStatus('idle');
  };

  return (
    <>
      <section className="assessment-page-layout">
        <div className="container assessment-widescreen-container">

          {/* ============================================================== */}
          {/* STEP 0: CONTACT REGISTRATION GATE (IF ARRIVED DIRECTLY)         */}
          {/* ============================================================== */}
          {!results && !leadInfo ? (
            <div className="glass-assessment-card" style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '40px 32px', borderColor: 'rgba(255, 20, 147, 0.25)' }}>

              <h1 style={{ fontSize: '1.85rem', color: '#121214', margin: '0 0 10px 0', fontFamily: 'var(--font-serif)' }}>
                Your Gut Health Snapshot
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Explore your digestive symptoms and broader health patterns. Rate symptom frequency from 0–4 points and identify your personalized gut priorities.
              </p>

              {leadError && (
                <div style={{ background: '#FFF0F6', border: '1px solid #FF1493', color: '#D8006C', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', textAlign: 'left' }}>
                  ⚠️ {leadError}
                </div>
              )}

              <form onSubmit={handleStartFromGate} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#FF1493' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(255, 20, 147, 0.25)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Mobile Number <span style={{ color: '#FF1493' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(255, 20, 147, 0.25)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Email Address <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(To receive your scorecard directly)</span>
                  </label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(255, 20, 147, 0.25)', fontSize: '0.95rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={leadSaving}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px', background: 'linear-gradient(135deg, #FF1493 0%, #FF007F 100%)', borderColor: '#FF1493', boxShadow: '0 8px 24px rgba(255, 20, 147, 0.35)' }}
                >
                  <span>{leadSaving ? 'Preparing Questionnaire...' : 'Begin Gut Health Assessment →'}</span>
                </button>
              </form>
              <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                🔒 Educational self-awareness tool • Confidential • Not a medical diagnosis
              </div>
            </div>
          ) : !results ? (
            /* ============================================================== */
            /* ACTIVE QUESTIONNAIRE VIEW (Q3 TO Q20) — NEON PINK THEME       */
            /* ============================================================== */
            <div className="glass-assessment-card" id="assessment-quiz-container" style={{ borderColor: 'rgba(255, 20, 147, 0.25)' }}>

              {/* Header Bar: Navigation + Progress */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  {currentAbsoluteQuestionIndex > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 14px', fontSize: '0.82rem', background: '#FFFFFF', border: '1px solid rgba(255, 20, 147, 0.25)', color: '#FF1493' }}
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <div style={{ width: '60px' }}></div>
                  )}

                  <span
                    style={{
                      background: '#FFF0F6',
                      color: '#FF1493',
                      border: '1px solid #FF66B2',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {currentSection.sectionBadge}
                  </span>

                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                    {currentQuestion.qNumber} &bull; {currentAbsoluteQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Smooth Neon Pink Progress Bar */}
                <div style={{ height: '7px', background: 'rgba(255, 228, 240, 0.85)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #FF66B2 0%, #FF1493 50%, #FF007F 100%)',
                      boxShadow: '0 0 12px rgba(255, 20, 147, 0.45)',
                      transition: 'width 0.35s ease'
                    }}
                  ></div>
                </div>
              </div>

              {/* Section Context Strip */}
              <div
                style={{
                  background: 'rgba(241, 245, 249, 0.95)',
                  borderLeft: '4px solid rgba(255, 20, 147, 0.35)',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  marginBottom: '22px'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {currentSection.sectionTitle}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                  {currentSection.sectionDesc}
                </div>
              </div>

              {/* Question Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.45rem', color: '#0F172A', marginBottom: '8px', lineHeight: 1.35, fontWeight: 700 }}>
                  {currentQuestion.qNumber}. {currentQuestion.title}
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0 auto', maxWidth: '620px', lineHeight: 1.5 }}>
                  {currentQuestion.subtitle}
                </p>
                {currentQuestion.disclaimer && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#D8006C', fontStyle: 'italic' }}>
                    ⚠️ {currentQuestion.disclaimer}
                  </div>
                )}
              </div>

              {/* Type 1: Scored 0–4 (Q3 to Q10) */}
              {currentQuestion.type === 'scored' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = answers[currentQuestion.id]?.label === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectScored(opt)}
                        className={`gut-option-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: isSelected ? 600 : 500, color: '#1E293B' }}>
                            {opt.label}
                          </span>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#FF1493', flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 2: Single Choice Non-Scored (Q11, Q12, Q15, Q16, Q17, Q18, Q19) */}
              {currentQuestion.type === 'single' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQuestion.options.map((optText, idx) => {
                    const isSelected = answers[currentQuestion.id] === optText;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSingle(optText)}
                        className={`gut-option-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? '5px solid #FF1493' : '2px solid rgba(255, 20, 147, 0.3)',
                              background: 'white',
                              flexShrink: 0
                            }}
                          ></div>
                          <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 500, color: '#1E293B' }}>
                            {optText}
                          </span>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#FF1493', flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 3: Multi-Select (Q13, Q14) */}
              {currentQuestion.type === 'multi' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {currentQuestion.options.map((optText, idx) => {
                      const selectedList = answers[currentQuestion.id] || [];
                      const isActive = selectedList.includes(optText);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleMulti(optText)}
                          className={`multi-chip ${isActive ? 'active' : ''}`}
                        >
                          <div className="multi-chip-checkbox">
                            {isActive && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          <span>{optText}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleMultiSubmit}
                      className="btn btn-primary"
                      style={{ background: 'linear-gradient(135deg, #FF1493 0%, #FF007F 100%)', borderColor: '#FF1493', padding: '12px 28px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(255, 20, 147, 0.3)' }}
                    >
                      <span>Continue →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Type 4: Textarea (Q20 - Final question) */}
              {currentQuestion.type === 'textarea' && (
                <div>
                  <textarea
                    rows={5}
                    value={answers[currentQuestion.id] || ''}
                    onChange={handleTextareaChange}
                    placeholder={currentQuestion.placeholder}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(255, 20, 147, 0.3)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      (Optional field — you can generate snapshot directly)
                    </span>
                    <button
                      type="button"
                      onClick={handleFinishAssessment}
                      className="btn btn-primary btn-lg"
                      style={{ background: 'linear-gradient(135deg, #FF1493 0%, #FF007F 100%)', borderColor: '#FF1493', padding: '14px 32px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(255, 20, 147, 0.35)' }}
                    >
                      <span>Generate My Gut Health Snapshot →</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ============================================================== */
            /* RESULTS SCORECARD: STRICTLY NEON PINK THEME & EMAIL DISPATCH    */
            /* ============================================================== */
            <div id="assessment-results-box" className="glass-assessment-card" style={{ padding: '36px 28px', borderColor: 'rgba(255, 20, 147, 0.35)' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="badge-pill" style={{ marginBottom: '8px', background: '#FFF0F6', borderColor: '#FF1493', color: '#FF1493' }}>
                  <span className="pulse-dot" style={{ background: '#FF1493' }}></span>
                  <span>Assessment Complete</span>
                </span>
                <h1 style={{ fontSize: '2.2rem', color: '#121214', margin: '4px 0 6px', fontFamily: 'var(--font-serif)' }}>
                  Your Gut Health Snapshot
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.94rem', margin: '0 auto', maxWidth: '580px' }}>
                  A clinical snapshot of your reported digestive symptom frequency and gut health priorities.
                </p>
              </div>

              {/* ========================================================== */}
              {/* PROMINENT SCORE DISPLAY CARD — NEON PINK THEME            */}
              {/* ========================================================== */}
              <div className="scorecard-banner-box" style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.82rem', color: '#FF1493', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                  Symptom Frequency Metric
                </span>

                <div style={{ margin: '8px 0 12px' }}>
                  <div style={{ fontSize: 'clamp(1.05rem, 3.2vw, 1.35rem)', color: '#334155', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '4px' }}>
                    Your Gut Symptom Score
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 3.6rem)', fontWeight: 700, color: '#121214', lineHeight: 1 }}>
                    <span style={{ color: '#FF1493', textShadow: '0 0 20px rgba(255, 20, 147, 0.35)' }}>{results.gutSymptomScore}</span>
                    <span style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', color: '#64748B', fontWeight: 500, marginLeft: '4px' }}>/100</span>
                  </div>
                </div>

                <div style={{ display: 'inline-block', margin: '6px 0 12px' }}>
                  <span
                    className={results.category.badgeClass}
                    style={{
                      padding: '6px 18px',
                      borderRadius: '24px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>●</span>
                    <span>{results.category.label}</span>
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 600, marginBottom: '14px' }}>
                  Interpretation: {results.category.interpretation} (Raw Score: {results.rawScore}/32)
                </div>

                {/* Dynamic Introductory Message from Website Copy */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid rgba(255, 20, 147, 0.35)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    color: '#1E293B',
                    fontSize: '0.96rem',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    maxWidth: '640px',
                    margin: '0 auto'
                  }}
                >
                  “{results.category.message}”
                </div>
              </div>

              {/* ========================================================== */}
              {/* PRIMARY CONCERN & PERSONALISATION CARD                     */}
              {/* ========================================================== */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFF0F6 0%, #FFFFFF 100%)',
                  border: '1.5px solid #FF66B2',
                  borderRadius: '16px',
                  padding: '20px 22px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FF1493', fontWeight: 700 }}>
                    Primary Stated Goal (Q17)
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#121214', fontFamily: 'var(--font-serif)', marginTop: '2px' }}>
                    {results.primaryConcern}
                  </div>
                </div>
                <div style={{ background: '#FF1493', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 2px 10px rgba(255, 20, 147, 0.3)' }}>
                  Personalised Clinical Focus
                </div>
              </div>

              {/* ========================================================== */}
              {/* REPORTED SYMPTOM BREAKDOWN & PATTERNS                      */}
              {/* ========================================================== */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

                {/* 1. Scored High Frequency Symptoms */}
                <div className="scorecard-breakdown-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                    <strong style={{ fontSize: '1.02rem', color: '#1E293B' }}>Reported Symptom Frequency (Q1 – Q8)</strong>
                  </div>
                  {results.reportedHighSymptoms.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {results.reportedHighSymptoms.map((sym, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: '#FFF0F6',
                            border: '1px solid #FFCCE1',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}
                        >
                          <span style={{ color: '#334155' }}>
                            <strong>{sym.qNumber}:</strong> {sym.title}
                          </span>
                          <span
                            className={FREQUENCY_OPTIONS.find(o => o.points === sym.points)?.badgeClass || 'point-badge-2'}
                            style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700 }}
                          >
                            {sym.response} ({sym.points} pts)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#FF1493', fontSize: '0.9rem', margin: 0 }}>
                      ✅ You reported <strong>Never</strong> or <strong>Occasionally</strong> across all 8 symptom questions.
                    </p>
                  )}
                </div>

                {/* 2. Timing & Food Associations */}
                <div className="scorecard-breakdown-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🕒</span>
                    <strong style={{ fontSize: '1.02rem', color: '#1E293B' }}>Timing &amp; Perceived Food Associations</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>
                        Discomfort Timing (Q11):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(results.timingAssociations || []).map((t, idx) => (
                          <span key={idx} style={{ background: '#FFF0F6', color: '#D8006C', border: '1px solid #FFCCE1', padding: '3px 10px', borderRadius: '8px', fontSize: '0.82rem' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>
                        Perceived Food Associations (Q12):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(results.foodAssociations || []).map((f, idx) => (
                          <span key={idx} style={{ background: '#FFF0F6', color: '#D8006C', border: '1px solid #FFCCE1', padding: '3px 10px', borderRadius: '8px', fontSize: '0.82rem' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic', borderTop: '1px dashed rgba(255, 20, 147, 0.25)', paddingTop: '8px' }}>
                    Note: Food associations indicate perceived triggers only; they must not be interpreted as confirmed food intolerances.
                  </div>
                </div>

              </div>


              {/* ========================================================== */}
              {/* DIRECT CLIENT EMAIL DISPATCH INFRASTRUCTURE               */}
              {/* ========================================================== */}
              <div className="email-dispatch-card non-printable" style={{ marginBottom: '26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📧</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#D8006C', margin: 0, fontWeight: 700 }}>
                      Send Scorecard Directly To Your Email
                    </h3>
                    <p style={{ margin: '2px 0 0', color: '#475569', fontSize: '0.84rem' }}>
                      Receive a copy of your score, symptom patterns, and focus priority directly in your inbox.
                    </p>
                  </div>
                </div>

                {emailStatus === 'success' && (
                  <div
                    style={{
                      background: '#FFF0F6',
                      border: '1px solid #FF1493',
                      color: '#D8006C',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>✅</span>
                    <span>Scorecard successfully dispatched to <strong>{emailInput}</strong>! Please check your inbox (and spam/promotions folder).</span>
                  </div>
                )}

                {emailStatus === 'error' && (
                  <div
                    style={{
                      background: '#FFF0F6',
                      border: '1px solid #FF1493',
                      color: '#D8006C',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      marginBottom: '14px'
                    }}
                  >
                    ⚠️ {emailError || 'Failed to dispatch email. Please check your address or download PDF below.'}
                  </div>
                )}

                <form onSubmit={handleSendScorecardEmail} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                      flex: '1 1 240px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(255, 20, 147, 0.35)',
                      fontSize: '0.94rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending'}
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #FF1493 0%, #FF007F 100%)', borderColor: '#FF1493', padding: '12px 22px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(255, 20, 147, 0.3)' }}
                  >
                    <span>{emailStatus === 'sending' ? 'Sending Scorecard...' : emailStatus === 'success' ? 'Resend Scorecard' : 'Email My Scorecard →'}</span>
                  </button>
                </form>

                <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleDownloadScorecard}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#FFF0F6', border: '1.5px solid rgba(255, 20, 147, 0.4)', color: '#FF1493', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <span>📥</span>
                    <span>Direct Download Scorecard</span>
                  </button>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Instant offline report file &bull; No print dialog
                  </span>
                </div>
              </div>

              {/* ========================================================== */}
              {/* CONSULTATION CALLOUT WITH PREFILLED SCORES                 */}
              {/* ========================================================== */}
              <div
                className="non-printable"
                style={{
                  background: 'linear-gradient(135deg, #121214 0%, #200D18 100%)',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(255, 20, 147, 0.35)',
                  padding: '28px 24px',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 12px 30px rgba(255, 20, 147, 0.15)',
                  marginBottom: '22px'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255, 20, 147, 0.22)',
                    color: '#FF66B2',
                    padding: '3px 12px',
                    borderRadius: '16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '10px'
                  }}
                >
                  Clinical Next Step
                </div>
                <h3 style={{ color: '#FFE4F0', fontSize: '1.45rem', margin: '0 0 8px', fontFamily: 'var(--font-serif)' }}>
                  Discuss Your Gut Snapshot with Reshmi Verma
                </h3>
                <p style={{ color: '#E2E8F0', maxWidth: '580px', margin: '0 auto 20px', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Reshmi Verma (MSc Clinical Nutrition, Functional Health &amp; Oxygen Advantage Coach) translates your symptom frequency into a structured, phased dietary &amp; lifestyle protocol.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={RAZORPAY_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #FF1493 0%, #FF007F 100%)', color: 'white', fontWeight: 700, padding: '14px 28px', fontSize: '1rem', borderRadius: '14px', border: 'none', boxShadow: '0 8px 25px rgba(255, 20, 147, 0.4)' }}
                  >
                    <span>Book 1-on-1 Consultation With This Snapshot →</span>
                  </a>
                </div>
              </div>

              {/* Retake */}
              <div style={{ textAlign: 'center' }} className="non-printable">
                <button
                  type="button"
                  onClick={restartAssessment}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 16px', fontSize: '0.8rem', background: '#FFF0F6', border: '1px solid rgba(255, 20, 147, 0.3)', color: '#FF1493' }}
                >
                  &larr; Retake Assessment
                </button>
              </div>

            </div>
          )}

        </div>
      </section>
    </>
  );
}
