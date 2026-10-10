/**
 * Database Layer for HealthwithReshmi™
 * 
 * Supports:
 * 1. MongoDB Atlas (when MONGODB_URI or MONGO_URI is set in process.env)
 * 2. Automated persistent JSON store fallback (when MongoDB is not yet configured),
 *    ensuring seamless local dev and preview without breaking.
 */

import fs from 'fs';
import path from 'path';

let mongoClient = null;
let mongoDb = null;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure local fallback storage directory and initial schema exist
function ensureLocalDb() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 'admin_reshmi_01',
          name: 'Reshmi Verma',
          email: 'support.reshmiverma@gmail.com',
          phone: '+919876543210',
          role: 'admin',
          // Default password for admin demo: Reshmi@2026
          passwordHash: '$2b$10$wLdfO9afl83VMk8n8eJTBu0VddhCyResAhkK0Uvxka9Wf37akK6nC',
          createdAt: new Date().toISOString()
        }
      ],
      bookings: []
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {}
  }
}

function readLocalDb() {
  ensureLocalDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { users: [], bookings: [] };
  }
}

function writeLocalDb(data) {
  ensureLocalDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local DB:', e);
  }
}

async function ensureMongoSeed(mdb) {
  try {
    // 1. Ensure indexes
    await mdb.collection('users').createIndex({ email: 1 }, { unique: true });
    await mdb.collection('bookings').createIndex({ id: 1 }, { unique: true });
    await mdb.collection('configs').createIndex({ key: 1 }, { unique: true });

    // 2. Ensure default Clinic Admin exists in MongoDB
    const adminExists = await mdb.collection('users').findOne({ email: 'support.reshmiverma@gmail.com' });
    if (!adminExists) {
      await mdb.collection('users').insertOne({
        id: 'admin_reshmi_01',
        name: 'Reshmi Verma',
        email: 'support.reshmiverma@gmail.com',
        phone: '+919876543210',
        role: 'admin',
        passwordHash: '$2b$10$wLdfO9afl83VMk8n8eJTBu0VddhCyResAhkK0Uvxka9Wf37akK6nC',
        createdAt: new Date().toISOString()
      });
      console.log('✅ Default Clinic Admin seeded into MongoDB.');
    }

    // 3. Ensure default Health Questionnaire Template exists in MongoDB
    const tplExists = await mdb.collection('configs').findOne({ key: 'questionnaire_template' });
    if (!tplExists) {
      await mdb.collection('configs').insertOne({
        key: 'questionnaire_template',
        template: getDefaultQuestionnaireTemplate(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Default Questionnaire Template seeded into MongoDB.');
    }
  } catch (err) {
    console.warn('MongoDB schema initialization notice:', err.message);
  }
}

function resolveMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  try {
    const envFile = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envFile)) {
      const txt = fs.readFileSync(envFile, 'utf-8');
      const m = txt.match(/^MONGODB_URI=(.*)$/m);
      if (m && m[1]) return m[1].trim();
    }
  } catch (e) {}
  return null;
}

let connectingPromise = null;

async function getMongo() {
  const uri = resolveMongoUri();
  if (!uri || uri.includes('YOUR_MONGODB_URI')) {
    return null;
  }
  if (mongoDb) return mongoDb;
  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    try {
      const { MongoClient } = await import('mongodb');
      mongoClient = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 3500,
        connectTimeoutMS: 3500,
        socketTimeoutMS: 15000
      });
      await mongoClient.connect();
      const dbName = process.env.MONGODB_DB || 'reshmi_wellness';
      mongoDb = mongoClient.db(dbName);
      await ensureMongoSeed(mongoDb);
      console.log(`✅ Connected directly to MongoDB Atlas: ${dbName}`);
      return mongoDb;
    } catch (err) {
      console.warn('MongoDB connection notice (using persistent local DB store):', err.message);
      connectingPromise = null;
      return null;
    }
  })();

  return connectingPromise;
}

export const db = {
  // --- USERS ---
  async findUserByEmail(email) {
    const normalized = (email || '').toLowerCase().trim();
    try {
      const mdb = await getMongo();
      if (mdb) {
        return await mdb.collection('users').findOne({ email: normalized });
      }
    } catch (e) {}
    const data = readLocalDb();
    return data.users.find(u => (u.email || '').toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    try {
      const mdb = await getMongo();
      if (mdb) {
        const { ObjectId } = await import('mongodb');
        try {
          return await mdb.collection('users').findOne({ $or: [{ _id: new ObjectId(id) }, { id }] });
        } catch (e) {
          return await mdb.collection('users').findOne({ id });
        }
      }
    } catch (e) {}
    const data = readLocalDb();
    return data.users.find(u => u.id === id || u._id === id) || null;
  },

  async createUser(userData) {
    const doc = {
      ...userData,
      id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: (userData.email || '').toLowerCase().trim(),
      createdAt: new Date().toISOString()
    };

    // Save locally
    const data = readLocalDb();
    data.users.push(doc);
    writeLocalDb(data);

    try {
      const mdb = await getMongo();
      if (mdb) {
        const res = await mdb.collection('users').insertOne(doc);
        return { ...doc, _id: res.insertedId };
      }
    } catch (e) {
      console.warn('MongoDB user insert notice:', e.message);
    }

    return doc;
  },

  // --- BOOKINGS ---
  async createBooking(bookingData) {
    const doc = {
      ...bookingData,
      id: bookingData.id || `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: bookingData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Always persist to local DB immediately
    try {
      const data = readLocalDb();
      data.bookings = data.bookings || [];
      const existingIdx = data.bookings.findIndex(b => b.id === doc.id);
      if (existingIdx >= 0) {
        data.bookings[existingIdx] = { ...data.bookings[existingIdx], ...doc };
      } else {
        data.bookings.unshift(doc);
      }
      writeLocalDb(data);
    } catch (e) {
      console.error('Error writing to persistent local database:', e);
    }

    // 2. Sync to MongoDB Atlas if available
    try {
      const mdb = await getMongo();
      if (mdb) {
        const res = await mdb.collection('bookings').insertOne({ ...doc });
        return { ...doc, _id: res.insertedId };
      }
    } catch (err) {
      console.warn('MongoDB sync notice (booking safely persisted locally):', err.message);
    }

    return doc;
  },

  async getBookingById(id) {
    try {
      const mdb = await getMongo();
      if (mdb) {
        const { ObjectId } = await import('mongodb');
        let filter = { id };
        try {
          if (ObjectId.isValid(id)) filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
        } catch (e) {}
        const doc = await mdb.collection('bookings').findOne(filter);
        if (doc) return doc;
      }
    } catch (e) {}
    const data = readLocalDb();
    return data.bookings.find(b => b.id === id || b._id === id) || null;
  },

  async getBookingsByUser(userEmailOrId, secondEmailOrId = '') {
    const normalized1 = (userEmailOrId || '').toLowerCase().trim();
    const normalized2 = (secondEmailOrId || '').toLowerCase().trim();
    try {
      const mdb = await getMongo();
      if (mdb) {
        return await mdb.collection('bookings')
          .find({
            $or: [
              { userId: userEmailOrId },
              { userId: secondEmailOrId },
              { clientEmail: normalized1 },
              { clientEmail: normalized2 },
              { email: normalized1 },
              { email: normalized2 }
            ]
          })
          .sort({ createdAt: -1 })
          .toArray();
      }
    } catch (e) {}
    const data = readLocalDb();
    return (data.bookings || [])
      .filter(b => {
        const bEmail = (b.clientEmail || b.email || '').toLowerCase().trim();
        const bUserId = b.userId || '';
        return (
          (normalized1 && (bEmail === normalized1 || bUserId === userEmailOrId)) ||
          (normalized2 && (bEmail === normalized2 || bUserId === secondEmailOrId))
        );
      })
      .reverse();
  },

  async getAllBookings() {
    try {
      const mdb = await getMongo();
      if (mdb) {
        return await mdb.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
      }
    } catch (e) {}
    const data = readLocalDb();
    return [...(data.bookings || [])].reverse();
  },

  async updateBooking(id, updates) {
    const patch = { ...updates, updatedAt: new Date().toISOString() };
    let updatedLocalDoc = null;

    try {
      const data = readLocalDb();
      const idx = data.bookings.findIndex(b => b.id === id || b._id === id);
      if (idx !== -1) {
        data.bookings[idx] = { ...data.bookings[idx], ...patch };
        writeLocalDb(data);
        updatedLocalDoc = data.bookings[idx];
      }
    } catch (e) {}

    try {
      const mdb = await getMongo();
      if (mdb) {
        const { ObjectId } = await import('mongodb');
        let filter = { id };
        try {
          if (ObjectId.isValid(id)) filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
        } catch (e) {}
        await mdb.collection('bookings').updateOne(filter, { $set: patch });
      }
    } catch (e) {}

    return updatedLocalDoc || { id, ...updates };
  },

  // --- QUESTIONNAIRE TEMPLATE (ADMIN EDITABLE) ---
  async getQuestionnaireTemplate() {
    const mdb = await getMongo();
    if (mdb) {
      const doc = await mdb.collection('configs').findOne({ key: 'questionnaire_template' });
      if (doc && doc.template) return doc.template;
    }
    const data = readLocalDb();
    if (data.questionnaireTemplate) {
      return data.questionnaireTemplate;
    }
    // Return default template and persist it
    const defaultTpl = getDefaultQuestionnaireTemplate();
    data.questionnaireTemplate = defaultTpl;
    writeLocalDb(data);
    return defaultTpl;
  },

  async updateQuestionnaireTemplate(updatedTemplate) {
    const patch = {
      ...updatedTemplate,
      updatedAt: new Date().toISOString()
    };
    const mdb = await getMongo();
    if (mdb) {
      await mdb.collection('configs').updateOne(
        { key: 'questionnaire_template' },
        { $set: { key: 'questionnaire_template', template: patch, updatedAt: patch.updatedAt } },
        { upsert: true }
      );
      return patch;
    }
    const data = readLocalDb();
    data.questionnaireTemplate = patch;
    writeLocalDb(data);
    return patch;
  },

  // --- PRICING TIERS & SESSION FEES (ADMIN EDITABLE) ---
  async getPricingTiers() {
    const mdb = await getMongo();
    if (mdb) {
      const doc = await mdb.collection('configs').findOne({ key: 'pricing_tiers' });
      if (doc && doc.tiers && Array.isArray(doc.tiers) && doc.tiers.length > 0) return doc.tiers;
    }
    const data = readLocalDb();
    if (data.pricingTiers && Array.isArray(data.pricingTiers) && data.pricingTiers.length > 0) {
      return data.pricingTiers;
    }
    const defaultTiers = getDefaultPricingTiers();
    data.pricingTiers = defaultTiers;
    writeLocalDb(data);
    return defaultTiers;
  },

  async updatePricingTiers(tiers) {
    const patch = {
      tiers,
      updatedAt: new Date().toISOString()
    };
    const mdb = await getMongo();
    if (mdb) {
      await mdb.collection('configs').updateOne(
        { key: 'pricing_tiers' },
        { $set: { key: 'pricing_tiers', tiers, updatedAt: patch.updatedAt } },
        { upsert: true }
      );
      return tiers;
    }
    const data = readLocalDb();
    data.pricingTiers = tiers;
    writeLocalDb(data);
    return tiers;
  },

  // --- INSTAGRAM REELS (ADMIN EDITABLE) ---
  async getReels() {
    const mdb = await getMongo();
    if (mdb) {
      const doc = await mdb.collection('configs').findOne({ key: 'reels' });
      if (doc && doc.reels && Array.isArray(doc.reels) && doc.reels.length > 0) return doc.reels;
    }
    const data = readLocalDb();
    if (data.reels && Array.isArray(data.reels) && data.reels.length > 0) {
      return data.reels;
    }
    const defaultReels = getDefaultReels();
    data.reels = defaultReels;
    writeLocalDb(data);
    return defaultReels;
  },

  async updateReels(reels) {
    const patch = {
      reels,
      updatedAt: new Date().toISOString()
    };
    const mdb = await getMongo();
    if (mdb) {
      await mdb.collection('configs').updateOne(
        { key: 'reels' },
        { $set: { key: 'reels', reels, updatedAt: patch.updatedAt } },
        { upsert: true }
      );
      return reels;
    }
    const data = readLocalDb();
    data.reels = reels;
    writeLocalDb(data);
    return reels;
  }
};

export function getDefaultPricingTiers() {
  return [
    {
      id: 'discovery',
      name: 'Initial Discovery Call (20 min)',
      badge: 'Discovery Call',
      title: 'Initial Discovery Call',
      duration: '20 Minutes • Exploratory Session',
      price: 999,
      desc: 'A quick chat to discuss your health story, current roadblocks, and determine if our SAMYA functional method aligns with your goals.',
      features: [
        'Review your primary symptoms',
        'Evaluate your BOLT & breath baseline',
        'Identify the right next clinical step'
      ],
      buttonText: 'Select Discovery Call (₹999)',
      featured: false,
      active: true
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Consultation (60 min)',
      badge: 'Comprehensive Consultation',
      title: 'Comprehensive Consultation',
      duration: '60 Minutes • Full Root-Cause Roadmap',
      price: 2999,
      desc: 'Deep dive into your blood diagnostics, gut health timeline, circadian sleep mapping, and custom metabolic architecture.',
      features: [
        'Full blood chemistry & biomarker review',
        'Customized gut mucosal healing protocol',
        'Individualized Oxygen Advantage breath prescription',
        'Written clinical action plan & supplement guide'
      ],
      buttonText: 'Select Comprehensive Plan (₹2,999)',
      featured: true,
      active: true
    },
    {
      id: 'followup',
      name: 'Follow-Up Check-in (30 min)',
      badge: 'Follow-Up Session',
      title: 'Follow-Up Check-in',
      duration: '30 Minutes • Active Clients Only',
      price: 1499,
      desc: 'For existing clients to review progress, track repeat BOLT scores, review updated labs, and adjust protocols.',
      features: [
        'Biomarker progression audit',
        'Titrate nutraceuticals & botanical doses',
        'Advanced breathwork progression'
      ],
      buttonText: 'Select Follow-Up (₹1,499)',
      featured: false,
      active: true
    }
  ];
}

export function getDefaultReels() {
  return [
    {
      id: "reel-1",
      title: "Why Morning Coffee On An Empty Stomach Causes Gut Dysbiosis & Acidity",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/founder.jpeg",
      views: "48.2K",
      duration: "0:58",
      topic: "Gut Acidity & Coffee"
    },
    {
      id: "reel-2",
      title: "Breathe Light To Breathe Right — The Bohr Effect In 45 Seconds",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/founder.jpg",
      views: "62.4K",
      duration: "0:45",
      topic: "Oxygen Advantage #13"
    },
    {
      id: "reel-3",
      title: "Stop Counting Calories: 3 Real Food Swaps For Fatty Liver & Insulin Resistance",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/reel-3-food-swaps.jpg",
      views: "39.1K",
      duration: "1:15",
      topic: "Metabolic Healing"
    },
    {
      id: "reel-4",
      title: "Bloating After Every Meal? Here Is How To Heal Your Gut Mucosa",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/reel-4-gut-mucosa.jpg",
      views: "71.8K",
      duration: "1:02",
      topic: "Gut Barrier Repair"
    },
    {
      id: "reel-5",
      title: "Why Mouth Breathing Ruins Deep REM Sleep & Causes Brain Fog",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/founder.jpeg",
      views: "54.6K",
      duration: "0:52",
      topic: "Nasal Breathing Biohack"
    },
    {
      id: "reel-6",
      title: "From 98kg to Resilient Vitality: My Real -38kg Transformation Story",
      url: "https://www.instagram.com/reel/DEvM_3Yvx4D/?utm_source=ig_web_copy_link",
      image: "/assets/images/founder.jpg",
      views: "94.3K",
      duration: "1:30",
      topic: "Real Transformation"
    }
  ];
}

export function getDefaultQuestionnaireTemplate() {
  return {
    title: "HEALTHWITHRESHMI — Pre-Consultation Health & Nutrition Questionnaire",
    subtitle: "Section B through Section F (Flexible Clinical History & Biomarkers)",
    notice: "After payment, please fill this questionnaire to give Reshmi Verma a comprehensive clinical picture. It is not mandatory to answer every question — answer what is most relevant to your goals.",
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: "section_b",
        badge: "B",
        title: "Section B — Your Main Health Concern",
        description: "Help us understand your primary health focus and how long it has persisted.",
        questions: [
          {
            id: "q10_primary_concern",
            number: 10,
            text: "What is your primary health concern?",
            type: "select",
            options: [
              "Weight management",
              "Gut and digestive health",
              "PCOS / hormonal health",
              "Thyroid-related nutrition",
              "Diabetes / blood sugar management",
              "Fatigue / low energy",
              "Skin and hair nutrition",
              "Sports nutrition",
              "General wellness",
              "Other"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q11_concern_description",
            number: 11,
            text: "Please describe your main concern in your own words.",
            type: "textarea",
            placeholder: "Describe the symptoms, frequency, and when they started...",
            required: false,
            enabled: true
          },
          {
            id: "q12_concern_duration",
            number: 12,
            text: "How long have you been experiencing this concern?",
            type: "select",
            options: [
              "Less than one month",
              "1–6 months",
              "6–12 months",
              "More than one year"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q13_daily_life_impact",
            number: 13,
            text: "How much does this concern affect your daily life?",
            type: "text",
            placeholder: "e.g., Affects work focus, daily energy, mood, sleep...",
            required: false,
            enabled: true
          },
          {
            id: "q14_consulted_professional",
            number: 14,
            text: "Have you consulted a healthcare professional about this concern?",
            type: "select",
            options: [
              "Yes",
              "No"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q15_tried_so_far",
            number: 15,
            text: "What have you tried so far, and what results did you experience?",
            type: "textarea",
            placeholder: "Medications, home remedies, diets, supplements, therapies...",
            required: false,
            enabled: true
          }
        ]
      },
      {
        id: "section_c",
        badge: "C",
        title: "Section C — Health History",
        description: "Medical diagnoses, surgeries, medications, and laboratory data.",
        questions: [
          {
            id: "q16_medical_condition",
            number: 16,
            text: "Have you been diagnosed with any medical condition? If yes, please specify.",
            type: "textarea",
            placeholder: "e.g., Hypothyroidism, Fatty Liver, IBS, Hypertension, None...",
            required: false,
            enabled: true
          },
          {
            id: "q17_medicines_supplements",
            number: 17,
            text: "Are you currently taking any medicines or supplements? Please list their names, if known.",
            type: "textarea",
            placeholder: "e.g., Thyronorm 25mcg, Pantoprazole 40mg, Vitamin D3, B12, None...",
            required: false,
            enabled: true
          },
          {
            id: "q18_food_allergies",
            number: 18,
            text: "Do you have any known food allergies or intolerances?",
            type: "textarea",
            placeholder: "e.g., Lactose/Dairy, Gluten, Nuts, Shellfish, Soy, None...",
            required: false,
            enabled: true
          },
          {
            id: "q19_surgeries_medical_events",
            number: 19,
            text: "Have you undergone any surgery or had a significant medical event relevant to your nutrition?",
            type: "textarea",
            placeholder: "e.g., Gallbladder removal, C-section, Appendectomy, None...",
            required: false,
            enabled: true
          },
          {
            id: "q20_laboratory_reports",
            number: 20,
            text: "Do you have recent laboratory reports that you would like the nutritionist to review? (Optional secure note/link)",
            type: "text",
            placeholder: "e.g., CBC, Lipid Profile, Thyroid Panel (can share on Google Meet or paste link)...",
            required: false,
            enabled: true
          },
          {
            id: "q21_other_health_info",
            number: 21,
            text: "Is there any other health information the nutritionist should know before your consultation?",
            type: "textarea",
            placeholder: "Family history, genetic predispositions, or specific concerns...",
            required: false,
            enabled: true
          }
        ]
      },
      {
        id: "section_d",
        badge: "D",
        title: "Section D — Body & Lifestyle Profile",
        description: "Physical measurements, movement, sleep patterns, and stress profile.",
        questions: [
          {
            id: "q22_height_cm",
            number: 22,
            text: "Height (cm)",
            type: "number",
            placeholder: "e.g., 165",
            required: false,
            enabled: true
          },
          {
            id: "q23_weight_kg",
            number: 23,
            text: "Current weight (kg), if comfortable sharing",
            type: "number",
            placeholder: "e.g., 68",
            required: false,
            enabled: true
          },
          {
            id: "q24_weight_changes",
            number: 24,
            text: "Has your weight changed significantly in the last 3–6 months? If yes, describe the change.",
            type: "text",
            placeholder: "e.g., Gained 3 kg, Lost 5 kg unintentionally, Stable...",
            required: false,
            enabled: true
          },
          {
            id: "q25_physical_activity",
            number: 25,
            text: "How physically active are you?",
            type: "select",
            options: [
              "Mostly sitting",
              "Lightly active",
              "Moderately active",
              "Very active"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q26_sleep_hours",
            number: 26,
            text: "On average, how many hours do you sleep each night?",
            type: "text",
            placeholder: "e.g., 6–7 hours, fragmented, mouth breathing at night...",
            required: false,
            enabled: true
          },
          {
            id: "q27_stress_level",
            number: 27,
            text: "How would you describe your current stress level?",
            type: "select",
            options: [
              "Low",
              "Moderate",
              "High"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q28_substance_use",
            number: 28,
            text: "Do you smoke, consume alcohol, or use other substances that may be relevant to your health? (Optional and confidential)",
            type: "text",
            placeholder: "Strictly confidential medical note (e.g. Occasional social drinks, Non-smoker)...",
            required: false,
            enabled: true
          }
        ]
      },
      {
        id: "section_e",
        badge: "E",
        title: "Section E — Food & Nutrition Habits",
        description: "Dietary preferences, meal timings, digestion, and hydration.",
        questions: [
          {
            id: "q29_dietary_preference",
            number: 29,
            text: "Which best describes your dietary preference?",
            type: "select",
            options: [
              "Vegetarian",
              "Vegan",
              "Eggetarian",
              "Non-vegetarian",
              "Other"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q30_meal_timings",
            number: 30,
            text: "What time do you usually eat breakfast, lunch and dinner?",
            type: "text",
            placeholder: "e.g., Breakfast: 9:00 AM, Lunch: 1:30 PM, Dinner: 9:00 PM",
            required: false,
            enabled: true
          },
          {
            id: "q31_typical_day_meals",
            number: 31,
            text: "Please describe a typical day's meals and snacks.",
            type: "textarea",
            placeholder: "Morning tea/coffee, breakfast items, afternoon lunch, evening snack, dinner...",
            required: false,
            enabled: true
          },
          {
            id: "q32_water_intake",
            number: 32,
            text: "Approximately how much water do you drink daily?",
            type: "text",
            placeholder: "e.g., 2–3 litres, 4–5 glasses...",
            required: false,
            enabled: true
          },
          {
            id: "q33_digestive_symptoms",
            number: 33,
            text: "Do you regularly experience bloating, acidity, constipation, diarrhoea or other digestive symptoms? If yes, describe them.",
            type: "textarea",
            placeholder: "e.g., Bloating 30 mins after meals, acidity in morning, sluggish bowels...",
            required: false,
            enabled: true
          },
          {
            id: "q34_foods_avoided",
            number: 34,
            text: "Are there any foods you avoid due to preference, culture, allergy or intolerance?",
            type: "textarea",
            placeholder: "e.g., Avoid dairy, avoid onion/garlic, avoid red meat...",
            required: false,
            enabled: true
          },
          {
            id: "q35_eating_outside_frequency",
            number: 35,
            text: "How often do you eat outside or order food?",
            type: "text",
            placeholder: "e.g., 2–3 times a week, weekends only, rarely...",
            required: false,
            enabled: true
          },
          {
            id: "q36_habits_difficulty",
            number: 36,
            text: "What makes it difficult for you to maintain your desired eating habits?",
            type: "textarea",
            placeholder: "e.g., Busy work schedule, travel, sugar cravings, lack of meal prep time...",
            required: false,
            enabled: true
          }
        ]
      },
      {
        id: "section_f",
        badge: "F",
        title: "Section F — Your Goals & Expectations",
        description: "Your primary aspirations, realistic time dedication, and expectations.",
        questions: [
          {
            id: "q37_primary_consultation_goal",
            number: 37,
            text: "What is your primary goal from this consultation?",
            type: "textarea",
            placeholder: "e.g., Eliminate acid reflux permanently, boost daytime energy, optimize gut microbiome...",
            required: false,
            enabled: true
          },
          {
            id: "q38_meaningful_improvement",
            number: 38,
            text: "What would meaningful improvement look like to you?",
            type: "textarea",
            placeholder: "e.g., Feeling light after meals, waking up refreshed, clear skin...",
            required: false,
            enabled: true
          },
          {
            id: "q39_past_nutrition_plans",
            number: 39,
            text: "Have you previously followed a nutrition or diet plan? What worked or did not work?",
            type: "textarea",
            placeholder: "e.g., Tried keto (too restrictive), tried intermittent fasting (gave acidity)...",
            required: false,
            enabled: true
          },
          {
            id: "q40_support_type",
            number: 40,
            text: "What kind of support would help you most?",
            type: "select",
            options: [
              "Personalized nutrition plan",
              "Understanding food and eating habits",
              "Ongoing progress monitoring",
              "Lifestyle and habit support",
              "Follow-up consultations"
            ],
            required: false,
            enabled: true
          },
          {
            id: "q41_time_dedication",
            number: 41,
            text: "How much time can you realistically dedicate to making changes?",
            type: "text",
            placeholder: "e.g., 20–30 minutes daily for cooking/breathing, gradual step-by-step changes...",
            required: false,
            enabled: true
          },
          {
            id: "q42_additional_discussion",
            number: 42,
            text: "Is there anything else you would like to discuss with the nutritionist?",
            type: "textarea",
            placeholder: "Any other questions or comments for Reshmi Verma...",
            required: false,
            enabled: true
          }
        ]
      }
    ]
  };
}
