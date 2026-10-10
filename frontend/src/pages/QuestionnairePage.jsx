import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Built-in clinical questionnaire specification (Sections A through F)
const CLINICAL_SECTIONS = [
  {
    id: 'section_a',
    badge: 'A',
    title: 'Section A — Personal & Demographic Information',
    subtitle: 'Confidential patient profile for clinical record keeping and consult scheduling.',
    questions: [
      { id: 'fullName', qNum: 'Q1', text: 'Full Legal Name', type: 'text', required: true, placeholder: 'e.g. Ananya Sharma', grid: 'col-2' },
      { id: 'email', qNum: 'Q2', text: 'Email Address', type: 'email', required: true, placeholder: 'e.g. ananya@example.com', grid: 'col-2' },
      { id: 'phone', qNum: 'Q3', text: 'Contact / WhatsApp Number', type: 'tel', required: true, placeholder: 'e.g. +91 98765 43210', grid: 'col-2' },
      { id: 'age', qNum: 'Q4', text: 'Age (Years)', type: 'number', required: false, placeholder: 'e.g. 34', grid: 'col-4' },
      {
        id: 'gender',
        qNum: 'Q5',
        text: 'Biological Gender',
        type: 'select',
        required: false,
        grid: 'col-4',
        options: ['Female', 'Male', 'Prefer not to say', 'Other']
      },
      { id: 'city', qNum: 'Q6', text: 'City & Country', type: 'text', required: false, placeholder: 'e.g. Mumbai, India', grid: 'col-2' },
      { id: 'occupation', qNum: 'Q7', text: 'Occupation / Work Style', type: 'text', required: false, placeholder: 'e.g. Corporate Tech / Hybrid desk work', grid: 'full' }
    ]
  },
  {
    id: 'section_b',
    badge: 'B',
    title: 'Section B — Your Main Health Concern',
    subtitle: 'Help us decode your primary health complaints, duration, and root-cause trajectory.',
    questions: [
      {
        id: 'q10_primary_concern',
        qNum: 'Q10',
        text: 'What is your primary health concern?',
        type: 'select',
        required: true,
        grid: 'full',
        options: [
          'Gut and digestive health (Bloating, IBS, SIBO, Reflux)',
          'PCOS / Hormonal balance & irregular cycles',
          'Thyroid-related metabolic dysfunction',
          'Weight plateau & stubborn fat retention',
          'Diabetes / Insulin resistance & blood sugar crashes',
          'Chronic fatigue & cellular energy depletion',
          'Respiratory pacing / Anxiety surges / Sleep apnea',
          'Skin, hair loss, and inflammatory flare-ups',
          'Sports aerobic performance & VO₂ max biohacking',
          'General cellular longevity & preventive optimization',
          'Other'
        ]
      },
      {
        id: 'q11_concern_description',
        qNum: 'Q11',
        text: 'Please describe your main concern in your own words.',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your symptoms, daily frequency, what triggers them, and how you feel...',
        grid: 'full'
      },
      {
        id: 'q12_concern_duration',
        qNum: 'Q12',
        text: 'How long have you been experiencing this concern?',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: [
          'Less than 1 month (Acute onset)',
          '1 to 6 months (Developing pattern)',
          '6 to 12 months (Persistent issue)',
          'More than 1 year (Chronic compensation)'
        ]
      },
      {
        id: 'q13_daily_life_impact',
        qNum: 'Q13',
        text: 'How much does this concern affect your daily life and productivity?',
        type: 'text',
        required: false,
        placeholder: 'e.g. Hampers work concentration, energy dips by 3 PM, social anxiety...',
        grid: 'col-2'
      },
      {
        id: 'q14_consulted_professional',
        qNum: 'Q14',
        text: 'Have you consulted a doctor or healthcare professional about this?',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: ['Yes', 'No']
      },
      {
        id: 'q15_tried_so_far',
        qNum: 'Q15',
        text: 'What treatments, diets, or therapies have you tried so far, and what were the outcomes?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Antacids (temporary relief), generic low-calorie diet (fatigue returned), supplements...',
        grid: 'full'
      }
    ]
  },
  {
    id: 'section_c',
    badge: 'C',
    title: 'Section C — Health & Medical History',
    subtitle: 'Medical diagnoses, prescription medications, surgeries, and biological history.',
    questions: [
      {
        id: 'q16_medical_condition',
        qNum: 'Q16',
        text: 'Have you been diagnosed with any clinical medical condition?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Hypothyroidism, Hashimoto’s, Fatty Liver Grade 1, GERD, Hypertension, None...',
        grid: 'full'
      },
      {
        id: 'q17_medicines_supplements',
        qNum: 'Q17',
        text: 'Are you currently taking any medicines, vitamins, or supplements? List names & dosages.',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Thyronorm 50mcg, Pantocid 40mg (morning), Vitamin D3, B-Complex, None...',
        grid: 'full'
      },
      {
        id: 'q18_food_allergies',
        qNum: 'Q18',
        text: 'Do you have any known food allergies, sensitivities, or intolerances?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Lactose/Cow’s milk, Gluten/Wheat, Peanuts, Histamine-rich foods, None...',
        grid: 'col-2'
      },
      {
        id: 'q19_surgeries_medical_events',
        qNum: 'Q19',
        text: 'Have you had any surgeries or significant medical events relevant to your health?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Gallbladder removal (cholecystectomy), C-section, Appendectomy, None...',
        grid: 'col-2'
      },
      {
        id: 'q20_laboratory_reports',
        qNum: 'Q20',
        text: 'Recent Laboratory Reports (CBC, Thyroid, Lipids, HbA1c, Vitamin D)',
        type: 'file_upload',
        required: false,
        placeholder: 'Upload PDF report or paste a secure cloud link / clinical notes...',
        grid: 'full'
      },
      {
        id: 'q21_other_health_info',
        qNum: 'Q21',
        text: 'Any additional medical context, family history, or notes Reshmi Verma should know?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Family history of auto-immunity or diabetes, high stress job...',
        grid: 'full'
      }
    ]
  },
  {
    id: 'section_d',
    badge: 'D',
    title: 'Section D — Body & Lifestyle Profile',
    subtitle: 'Physical measurements, movement metrics, sleep architecture, and nervous system pacing.',
    questions: [
      { id: 'q22_height_cm', qNum: 'Q22', text: 'Height (cm)', type: 'number', required: false, placeholder: 'e.g. 168', grid: 'col-3' },
      { id: 'q23_weight_kg', qNum: 'Q23', text: 'Current Weight (kg)', type: 'number', required: false, placeholder: 'e.g. 68', grid: 'col-3' },
      { id: 'q24_weight_changes', qNum: 'Q24', text: 'Weight changes in the last 3–6 months?', type: 'text', required: false, placeholder: 'e.g. Gained 4 kg, Stable, Lost weight', grid: 'col-3' },
      {
        id: 'q25_physical_activity',
        qNum: 'Q25',
        text: 'Physical Activity Level',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: [
          'Sedentary (Mostly sitting, < 4,000 steps/day)',
          'Lightly Active (Occasional walks, 5,000–7,000 steps)',
          'Moderately Active (Gym/Yoga 3–4 days/week)',
          'Very Active (Athletic training 5+ days/week)'
        ]
      },
      {
        id: 'q27_stress_level',
        qNum: 'Q27',
        text: 'Perceived Daily Stress Level',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: [
          'Low — Generally calm and regulated',
          'Moderate — Work pressure but manageable',
          'High — Constant deadlines, mental anxiety, burnout feeling'
        ]
      },
      {
        id: 'q26_sleep_hours',
        qNum: 'Q26',
        text: 'Average Sleep Duration & Nighttime Breathing Patterns',
        type: 'text',
        required: false,
        placeholder: 'e.g. 6–7 hours, wake up at 3 AM, mouth breathing / snoring, wake up tired...',
        grid: 'full'
      },
      {
        id: 'q28_substance_use',
        qNum: 'Q28',
        text: 'Alcohol, smoking, or caffeine intake? (Confidential clinical record)',
        type: 'text',
        required: false,
        placeholder: 'e.g. 2 cups coffee daily, occasional social wine on weekends, non-smoker...',
        grid: 'full'
      }
    ]
  },
  {
    id: 'section_e',
    badge: 'E',
    title: 'Section E — Food, Nutrition & Digestive Habits',
    subtitle: 'Dietary structure, meal timings, gastrointestinal motility, and digestive symptoms.',
    questions: [
      {
        id: 'q29_dietary_preference',
        qNum: 'Q29',
        text: 'Dietary Preference Framework',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: ['Vegetarian', 'Vegan / Plant-based', 'Eggetarian', 'Non-Vegetarian / Omnivore', 'Jain Vegetarian', 'Other']
      },
      {
        id: 'q30_meal_timings',
        qNum: 'Q30',
        text: 'Typical Daily Meal Timings',
        type: 'text',
        required: false,
        placeholder: 'e.g. Breakfast: 9:30 AM, Lunch: 1:30 PM, Dinner: 9:00 PM',
        grid: 'col-2'
      },
      {
        id: 'q31_typical_day_meals',
        qNum: 'Q31',
        text: 'Describe a typical day of meals, snacks, and beverages (from waking to sleeping).',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Morning chai + biscuits, lunch roti sabzi dal, evening snacking, dinner rice & curry...',
        grid: 'full'
      },
      {
        id: 'q32_water_intake',
        qNum: 'Q32',
        text: 'Average Daily Water Intake',
        type: 'text',
        required: false,
        placeholder: 'e.g. 2 to 2.5 Litres per day',
        grid: 'col-2'
      },
      {
        id: 'q35_eating_outside_frequency',
        qNum: 'Q35',
        text: 'How often do you dine out or order takeout/delivery?',
        type: 'text',
        required: false,
        placeholder: 'e.g. 2–3 times a week, weekends only, rarely...',
        grid: 'col-2'
      },
      {
        id: 'q33_digestive_symptoms',
        qNum: 'Q33',
        text: 'Do you regularly experience bloating, acidity, gas, constipation, or loose stools? Describe in detail.',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Belly distension 30 mins after meals, morning heartburn, incomplete bowel evacuation...',
        grid: 'full'
      },
      {
        id: 'q34_foods_avoided',
        qNum: 'Q34',
        text: 'Are there any specific foods you avoid or dislike?',
        type: 'text',
        required: false,
        placeholder: 'e.g. Raw salads, deep fried food, excess dairy, onion/garlic...',
        grid: 'col-2'
      },
      {
        id: 'q36_habits_difficulty',
        qNum: 'Q36',
        text: 'What makes maintaining healthy eating habits difficult for you currently?',
        type: 'text',
        required: false,
        placeholder: 'e.g. Lack of meal prep time, frequent travel, late night sugar cravings...',
        grid: 'col-2'
      }
    ]
  },
  {
    id: 'section_f',
    badge: 'F',
    title: 'Section F — Goals, Expectations & Dedication',
    subtitle: 'Define your desired outcomes so Reshmi Verma can engineer your targeted clinical protocol.',
    questions: [
      {
        id: 'q37_primary_consultation_goal',
        qNum: 'Q37',
        text: 'What is your #1 primary outcome from this consultation?',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Permanently heal gut lining, eliminate bloating, regain sustained energy, and master breath pacing...',
        grid: 'full'
      },
      {
        id: 'q38_meaningful_improvement',
        qNum: 'Q38',
        text: 'What would genuine, meaningful transformation look like in 90 days?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Waking up refreshed without an alarm, flat stomach after meals, healthy menstrual cycle...',
        grid: 'full'
      },
      {
        id: 'q39_past_nutrition_plans',
        qNum: 'Q39',
        text: 'Have you followed strict diet plans before? What worked or failed?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Keto was too restrictive, generic calorie deficit crashed thyroid, intermittent fasting gave acidity...',
        grid: 'full'
      },
      {
        id: 'q40_support_type',
        qNum: 'Q40',
        text: 'What style of guidance helps you succeed most?',
        type: 'select',
        required: false,
        grid: 'col-2',
        options: [
          'Personalized step-by-step root-cause nutrition plan',
          'Autonomic breathwork & respiratory retraining routines',
          'Continuous biometric feedback & progress check-ins',
          'Lifestyle habit habituation & biohacking tools',
          'Comprehensive 360° holistic integration'
        ]
      },
      {
        id: 'q41_time_dedication',
        qNum: 'Q41',
        text: 'How much time can you realistically dedicate daily for cooking/breathwork?',
        type: 'text',
        required: false,
        placeholder: 'e.g. 20–30 minutes daily for breath drills & easy meal prep',
        grid: 'col-2'
      },
      {
        id: 'q42_additional_discussion',
        qNum: 'Q42',
        text: 'Any specific questions or concerns you would like to ask Reshmi Verma during the consultation?',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Want to understand how breathing affects my gut, or best sequence of supplements...',
        grid: 'full'
      }
    ]
  }
];

export default function QuestionnairePage() {
  const [searchParams] = useSearchParams();
  const bookingIdFromUrl = searchParams.get('bookingId') || '';
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // File Upload State & Refs
  const fileInputRef = useRef(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Navigation State
  const [activeStep, setActiveStep] = useState(0); // 0 to 5
  const [viewMode, setViewMode] = useState('stepper'); // 'stepper' or 'all'
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState(() => {
    // Attempt draft restore from localStorage
    try {
      const saved = localStorage.getItem('reshmi_questionnaire_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            bookingId: bookingIdFromUrl || parsed.bookingId || '',
            ...parsed
          };
        }
      }
    } catch (e) {}

    return {
      bookingId: bookingIdFromUrl,
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: '',
      gender: 'Female',
      city: '',
      occupation: '',
      q10_primary_concern: 'Gut and digestive health (Bloating, IBS, SIBO, Reflux)',
      q11_concern_description: '',
      q12_concern_duration: '6 to 12 months (Persistent issue)',
      q13_daily_life_impact: '',
      q14_consulted_professional: 'Yes',
      q15_tried_so_far: '',
      q16_medical_condition: '',
      q17_medicines_supplements: '',
      q18_food_allergies: '',
      q19_surgeries_medical_events: '',
      q20_laboratory_reports: '',
      labReportFileUrl: '',
      labReportFileName: '',
      labReportFileSize: '',
      q21_other_health_info: '',
      q22_height_cm: '',
      q23_weight_kg: '',
      q24_weight_changes: '',
      q25_physical_activity: 'Moderately Active (Gym/Yoga 3–4 days/week)',
      q26_sleep_hours: '',
      q27_stress_level: 'Moderate — Work pressure but manageable',
      q28_substance_use: '',
      q29_dietary_preference: 'Vegetarian',
      q30_meal_timings: '',
      q31_typical_day_meals: '',
      q32_water_intake: '2 to 2.5 Litres per day',
      q33_digestive_symptoms: '',
      q34_foods_avoided: '',
      q35_eating_outside_frequency: '1–2 times a week',
      q36_habits_difficulty: '',
      q37_primary_consultation_goal: '',
      q38_meaningful_improvement: '',
      q39_past_nutrition_plans: '',
      q40_support_type: 'Personalized step-by-step root-cause nutrition plan',
      q41_time_dedication: '',
      q42_additional_discussion: ''
    };
  });

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Sync booking ID if present in URL
  useEffect(() => {
    if (bookingIdFromUrl) {
      setFormData(prev => ({ ...prev, bookingId: bookingIdFromUrl }));
    }
  }, [bookingIdFromUrl]);

  // Handle field change and auto-save draft
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      try {
        localStorage.setItem('reshmi_questionnaire_draft', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  // PDF Upload Handlers
  const handlePdfFile = async (file) => {
    if (!file) return;
    setPdfUploadError('');

    // Check size limit: 25MB
    if (file.size > 25 * 1024 * 1024) {
      setPdfUploadError('File size exceeds the 25MB limit. Please upload a smaller PDF.');
      return;
    }

    setUploadingPdf(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;

        const res = await fetch('/api/upload-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
            fileType: file.type || 'application/pdf'
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to upload PDF report.');
        }

        const formattedSize = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

        setFormData(prev => {
          const updated = {
            ...prev,
            labReportFileUrl: data.fileUrl,
            labReportFileName: file.name,
            labReportFileSize: formattedSize,
            q20_laboratory_reports: prev.q20_laboratory_reports
              ? prev.q20_laboratory_reports
              : `[Attached PDF: ${file.name}]`
          };
          try {
            localStorage.setItem('reshmi_questionnaire_draft', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });

        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2500);
        setUploadingPdf(false);
      };

      reader.onerror = () => {
        setPdfUploadError('Error reading file. Please try again.');
        setUploadingPdf(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('PDF Upload Error:', err);
      setPdfUploadError(err.message || 'Error uploading file.');
      setUploadingPdf(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePdfFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePdfFile(file);
    }
  };

  const removeUploadedPdf = () => {
    setFormData(prev => {
      const updated = {
        ...prev,
        labReportFileUrl: '',
        labReportFileName: '',
        labReportFileSize: ''
      };
      try {
        localStorage.setItem('reshmi_questionnaire_draft', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.email) {
      setErrorMsg('Please ensure your Full Name and Email Address in Section A are filled.');
      setActiveStep(0);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    if (!formData.q10_primary_concern || !formData.q11_concern_description) {
      setErrorMsg('Please describe your main health concern in Section B.');
      setActiveStep(1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          bookingId: formData.bookingId || '',
          email: formData.email,
          formData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit clinical questionnaire.');
      }

      // Clear draft on success
      try {
        localStorage.removeItem('reshmi_questionnaire_draft');
      } catch (e) {}

      setSubmitted(true);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err) {
      console.error('Questionnaire error:', err);
      setErrorMsg(err.message || 'Error submitting questionnaire. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (activeStep < CLINICAL_SECTIONS.length - 1) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  // Render question field helper
  const renderQuestionField = (q) => {
    const colSpan = q.grid === 'col-4' ? 3 : q.grid === 'col-3' ? 4 : q.grid === 'col-2' ? 6 : 12;

    // Special renderer for PDF / Lab reports upload (Q20)
    if (q.type === 'file_upload') {
      return (
        <div key={q.id} style={{ gridColumn: `span ${colSpan}` }} className="q-form-group">
          <label className="q-label" htmlFor={q.id}>
            <span className="q-qnum-tag">{q.qNum}</span>
            <span>{q.text}</span>
          </label>
          <p className="q-hint">
            Upload your blood test reports (CBC, Thyroid, Lipids, HbA1c, Vitamin D/B12, Gut tests) so Reshmi Verma can analyze biomarkers before your consultation.
          </p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
            style={{ display: 'none' }}
          />

          {/* Upload Dropzone */}
          {!formData.labReportFileUrl && (
            <div
              className={`q-upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="q-upload-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>

              {uploadingPdf ? (
                <div>
                  <div className="q-upload-title" style={{ color: 'var(--emerald-primary)' }}>
                    Uploading & Encrypting Lab Report...
                  </div>
                  <div className="q-upload-subtitle">Please wait a moment while your PDF is saved securely.</div>
                </div>
              ) : (
                <div>
                  <div className="q-upload-title">
                    <span>Click to Upload PDF</span> or Drag & Drop here
                  </div>
                  <div className="q-upload-subtitle">
                    Supports PDF, PNG, JPG (Max 25MB) &bull; Confidential & Encrypted for Dr. Reshmi Verma
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attached File Preview Card */}
          {formData.labReportFileUrl && (
            <div className="q-attached-file-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="q-pdf-badge">PDF</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-deep)', fontSize: '0.94rem' }}>
                    {formData.labReportFileName || 'Patient_Lab_Report.pdf'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                    ✓ {formData.labReportFileSize || 'Attached'} &bull; Encrypted for Dr. Reshmi Verma
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={formData.labReportFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', textDecoration: 'none' }}
                >
                  📄 View PDF
                </a>
                <button
                  type="button"
                  onClick={removeUploadedPdf}
                  style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          )}

          {pdfUploadError && (
            <div style={{ color: '#DC2626', fontSize: '0.84rem', marginTop: '6px', fontWeight: 600 }}>
              ⚠ {pdfUploadError}
            </div>
          )}

          {/* Optional Text input for Drive Links or Notes */}
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Or paste Google Drive / Dropbox link or leave a note:
            </label>
            <input
              type="text"
              name="q20_laboratory_reports"
              className="q-input"
              placeholder="e.g. Google Drive link or 'Will show on Google Meet screen share during consult'"
              value={formData.q20_laboratory_reports || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      );
    }

    // Standard Question Renderers
    return (
      <div key={q.id} style={{ gridColumn: `span ${colSpan}` }} className="q-form-group">
        <label className="q-label" htmlFor={q.id}>
          <span className="q-qnum-tag">{q.qNum}</span>
          <span>{q.text} {q.required && <span style={{ color: '#C2410C' }}>*</span>}</span>
        </label>

        {q.type === 'select' ? (
          <select
            id={q.id}
            name={q.id}
            className="q-select"
            value={formData[q.id] || ''}
            onChange={handleChange}
            required={q.required}
          >
            <option value="">Select option...</option>
            {q.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : q.type === 'textarea' ? (
          <textarea
            id={q.id}
            name={q.id}
            rows={3}
            className="q-textarea"
            placeholder={q.placeholder || ''}
            value={formData[q.id] || ''}
            onChange={handleChange}
            required={q.required}
          />
        ) : (
          <input
            type={q.type || 'text'}
            id={q.id}
            name={q.id}
            className="q-input"
            placeholder={q.placeholder || ''}
            value={formData[q.id] || ''}
            onChange={handleChange}
            required={q.required}
          />
        )}
      </div>
    );
  };

  const currentSection = CLINICAL_SECTIONS[activeStep];

  return (
    <main className="section" style={{ minHeight: 'calc(100vh - 120px)', padding: '40px 0 90px', background: 'linear-gradient(180deg, #F9F7F2 0%, #FFFFFF 100%)' }}>
      <div className="container questionnaire-portal-wrap">
        
        {!submitted ? (
          <>
            {/* Header / Hero */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div className="q-badge-clinical">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Confidential Pre-Consultation Diagnostic Dossier</span>
              </div>
              <h1 style={{ fontSize: '2.5rem', margin: '4px 0 12px', color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                360° Health & Nutrition Clinical Questionnaire
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '780px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                Every answer directly informs your upcoming consultation. Reshmi Verma reviews your medical timeline, gut permeability markers, and breathing mechanics in advance to formulate your root-cause protocol.
              </p>

              {/* Booking Reference banner if linked */}
              {formData.bookingId ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid #BBF7D0', fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Linked to Booking ID: <strong>{formData.bookingId}</strong></span>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid #FDE68A', fontSize: '0.85rem', color: '#92400E', fontWeight: 500 }}>
                  <span>Pre-intake mode: Your clinical dossier will automatically sync to your consultation booking.</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ padding: '16px 20px', background: '#FFF1F2', color: '#BE123C', borderRadius: '16px', border: '1.5px solid rgba(225,29,72,0.3)', marginBottom: '24px', fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Stepper Tabs Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Step {activeStep + 1} of {CLINICAL_SECTIONS.length} &bull; <span style={{ color: 'var(--emerald-deep)' }}>{currentSection.title.split('—')[0]}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {draftSaved && (
                  <span className="q-autosave-status">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Draft Saved
                  </span>
                )}
                <div style={{ display: 'flex', background: '#E2E8F0', padding: '3px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('stepper')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'stepper' ? 'white' : 'transparent',
                      color: viewMode === 'stepper' ? 'var(--emerald-deep)' : '#64748B',
                      boxShadow: viewMode === 'stepper' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      fontWeight: 600
                    }}
                  >
                    Guided Stepper
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('all')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'all' ? 'white' : 'transparent',
                      color: viewMode === 'all' ? 'var(--emerald-deep)' : '#64748B',
                      boxShadow: viewMode === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      fontWeight: 600
                    }}
                  >
                    View All Sections
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper Navigation Pills */}
            <div className="q-stepper-bar">
              {CLINICAL_SECTIONS.map((sec, idx) => {
                const isActive = activeStep === idx;
                const isCompleted = activeStep > idx;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    className={`q-stepper-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      setActiveStep(idx);
                      if (viewMode === 'all') {
                        const elem = document.getElementById(sec.id);
                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span className="q-step-circle">
                      {isCompleted ? '✓' : sec.badge}
                    </span>
                    <span>{sec.title.split('—')[1]?.trim() || sec.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit}>
              {viewMode === 'stepper' ? (
                /* SINGLE STEP VIEW */
                <div className="q-card-clinical">
                  <div className="q-card-header">
                    <div>
                      <div className="q-section-badge-pill">
                        Section {currentSection.badge}
                      </div>
                      <h2 className="q-card-title">{currentSection.title}</h2>
                      <p className="q-card-subtitle">{currentSection.subtitle}</p>
                    </div>
                  </div>

                  {/* Render Fields for this Section */}
                  <div className="q-fields-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px 20px' }}>
                    {currentSection.questions.map(renderQuestionField)}
                  </div>

                  {/* Navigation Actions */}
                  <div className="q-footer-nav">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePrevStep}
                      disabled={activeStep === 0}
                      style={{ opacity: activeStep === 0 ? 0.4 : 1, cursor: activeStep === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      &larr; Previous Section
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {activeStep < CLINICAL_SECTIONS.length - 1 ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleNextStep}
                        >
                          <span>Save & Continue to Section {CLINICAL_SECTIONS[activeStep + 1].badge} &rarr;</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                          style={{ padding: '14px 28px', background: 'linear-gradient(135deg, var(--emerald-deep) 0%, var(--emerald-primary) 100%)' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          <span>{loading ? 'Submitting to Clinical Records...' : 'Submit Confidential Clinical Dossier'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ALL SECTIONS IN ONE VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {CLINICAL_SECTIONS.map((sec) => (
                    <div key={sec.id} id={sec.id} className="q-card-clinical">
                      <div className="q-card-header">
                        <div>
                          <div className="q-section-badge-pill">Section {sec.badge}</div>
                          <h2 className="q-card-title">{sec.title}</h2>
                          <p className="q-card-subtitle">{sec.subtitle}</p>
                        </div>
                      </div>

                      <div className="q-fields-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px 20px' }}>
                        {sec.questions.map(renderQuestionField)}
                      </div>
                    </div>
                  ))}

                  {/* Full Page Submit Bar */}
                  <div style={{ background: 'white', borderRadius: '20px', padding: '24px 32px', border: '1.5px solid rgba(27, 77, 54, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--emerald-deep)', fontSize: '1.1rem' }}>Ready to submit your complete 360° intake?</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Reshmi Verma will formulate your biohacking protocol before your scheduled call.</div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                      style={{ padding: '16px 36px', background: 'linear-gradient(135deg, var(--emerald-deep) 0%, var(--emerald-primary) 100%)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      <span>{loading ? 'Submitting to Clinical Records...' : 'Submit Complete Clinical Dossier'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          /* SUCCESS STATE */
          <div style={{ background: 'white', borderRadius: '32px', padding: '60px 44px', border: '1.5px solid rgba(27, 77, 54, 0.15)', boxShadow: '0 24px 60px -12px rgba(27, 77, 54, 0.12)', textAlign: 'center', maxWidth: '720px', margin: '20px auto' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#F0FDF4', color: '#166534', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem', marginBottom: '22px', border: '2px solid #BBF7D0' }}>
              ✓
            </div>
            <span style={{ textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--emerald-primary)' }}>
              Intake Dossier Confirmed
            </span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--emerald-deep)', margin: '10px 0 14px', fontFamily: 'var(--font-serif)' }}>
              Clinical Questionnaire Received!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '28px' }}>
              Thank you, <strong>{formData.fullName}</strong>. Your full diagnostic answers across Sections B through F {formData.labReportFileName ? 'along with your attached PDF lab report' : ''} have been encrypted and saved to your confidential medical records.
            </p>

            {formData.labReportFileName && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '10px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <span className="q-pdf-badge">PDF Attached</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald-deep)', fontSize: '0.9rem' }}>{formData.labReportFileName}</span>
              </div>
            )}

            <div style={{ background: '#FAF8F5', borderRadius: '18px', padding: '24px', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ fontWeight: 700, color: 'var(--emerald-deep)', fontSize: '0.98rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                <span>What Happens Next?</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.92rem', lineHeight: 1.8 }}>
                <li>Reshmi Verma decodes your symptom chronology, metabolic markers, and uploaded reports.</li>
                <li>Your personalized Google Meet consultation link is confirmed.</li>
                <li>Have recent bloodwork handy if you would like Reshmi to review it during the call.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <span>View in Client Portal</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg">
                Back to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
