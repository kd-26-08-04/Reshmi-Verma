import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 755, "HealthwithReshmi™ — Comprehensive Clinical Health Assessment Questions")
            self.drawRightString(572, 755, "Reshmi Verma | Functional Nutritionist")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(40, 747, 572, 747)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 42, 572, 42)
        
        self.drawString(40, 30, "Confidential Clinical Diagnostic Record • Strictly for Patient Intake & Assessment")
        self.drawRightString(572, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Palette
    c_primary = colors.HexColor("#0F172A")    # Obsidian Slate
    c_terracotta = colors.HexColor("#C2410C") # Terracotta Warm
    c_gold = colors.HexColor("#D97706")       # Burnished Gold
    c_slate = colors.HexColor("#334155")      # Text Dark
    c_muted = colors.HexColor("#64748B")      # Text Muted
    c_card_bg = colors.HexColor("#FAF8F5")    # Soft Sand
    c_border = colors.HexColor("#E2E8F0")     # Light Border
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_primary,
        alignment=0,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_terracotta,
        spaceAfter=14
    )

    sec_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.white
    )
    
    sec_desc_style = ParagraphStyle(
        'SectionDesc',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=c_muted,
        spaceAfter=10
    )

    q_title_style = ParagraphStyle(
        'QuestionTitle',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_primary,
        spaceAfter=2
    )

    q_sub_style = ParagraphStyle(
        'QuestionSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=c_muted,
        spaceAfter=6
    )

    opt_label_style = ParagraphStyle(
        'OptionLabel',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_slate
    )

    opt_tag_style = ParagraphStyle(
        'OptionTag',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=c_terracotta
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_slate
    )

    story = []

    # =========================================================================
    # COVER / HEADER BANNER
    # =========================================================================
    header_data = [
        [
            Paragraph("HealthwithReshmi™", ParagraphStyle('BName', fontName='Helvetica-Bold', fontSize=16, textColor=c_primary, leading=18)),
            Paragraph("CLINICAL INTAKE COMPENDIUM", ParagraphStyle('BBadge', fontName='Helvetica-Bold', fontSize=9, textColor=c_terracotta, alignment=2, leading=11))
        ],
        [
            Paragraph("Reshmi Verma — Functional Nutritionist &bull; Breathwork Facilitator &bull; Certified Biohacker &bull; #13 Oxygen Advantage Coach India", ParagraphStyle('BSub', fontName='Helvetica', fontSize=9, textColor=c_muted, leading=13)),
            ""
        ]
    ]
    t_header = Table(header_data, colWidths=[380, 152])
    t_header.setStyle(TableStyle([
        ('SPAN', (0, 1), (1, 1)),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=c_terracotta, spaceBefore=4, spaceAfter=14))

    story.append(Paragraph("Comprehensive Clinical Health Assessment Questions", title_style))
    story.append(Paragraph("18 Years Diagnostics Industry Perspective &bull; 3R Methodology (Restoration, Regulation, Resilience)", subtitle_style))
    
    intro_p = Paragraph(
        "This official document provides the complete diagnostic architecture and question bank utilized across the "
        "<strong>HealthwithReshmi™ Functional Health Portal</strong>. It includes both the <strong>Interactive Health Assessment (Part 1)</strong> "
        "— designed to decode gut permeability, CO₂ tolerance, and metabolic rhythms — and the <strong>Pre-Consultation Clinical Intake Questionnaire (Part 2)</strong> "
        "— used by Reshmi Verma to formulate tailored, root-cause recovery protocols.",
        body_style
    )
    story.append(intro_p)
    story.append(Spacer(1, 14))

    # =========================================================================
    # PART 1: INTERACTIVE FUNCTIONAL HEALTH ASSESSMENT (9 QUESTIONS)
    # =========================================================================
    part1_banner = [
        [Paragraph("PART 1: INTERACTIVE FUNCTIONAL HEALTH ASSESSMENT (9 CLINICAL DOMAINS)", ParagraphStyle('P1H', fontName='Helvetica-Bold', fontSize=11, textColor=colors.white, leading=14))]
    ]
    t_p1 = Table(part1_banner, colWidths=[532])
    t_p1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_primary),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_p1)
    story.append(Spacer(1, 12))

    # Sections of Part 1
    sections_part1 = [
        {
            "num": "1",
            "name": "Section 1 — Gut Mucosal & Digestive Health",
            "desc": "Decoding intestinal permeability (leaky gut), microbiome dysbiosis, and stomach acid kinetics.",
            "questions": [
                {
                    "num": "Q1",
                    "title": "When do you typically experience bloating, gas, or distension?",
                    "sub": "Clinical Significance: Timing of post-meal bloating reveals the struggling anatomical section.",
                    "options": [
                        ("Severe distension within 30–45 mins of eating", "Hypochlorhydria / Low Stomach Acid", "35 / 100"),
                        ("Lower abdominal bloating late evening or 2–3 hours after meals", "Microbiome Fermentation / SIBO", "45 / 100"),
                        ("Frequent acid reflux, heartburn, or persistent chest heaviness after meals", "Gastroesophageal Reflux / LES Laxity", "40 / 100"),
                        ("No visible distension, but chronic post-meal sluggishness and slow digestion", "Sluggish Motility / Bile Stasis", "65 / 100"),
                        ("Flat stomach, effortless digestion with zero post-meal discomfort", "Optimal Digestive Ease", "95 / 100")
                    ]
                },
                {
                    "num": "Q2",
                    "title": "How would you classify your bowel motility & stool consistency?",
                    "sub": "Clinical Significance: Elimination is the primary exit pathway for metabolized hormones and cellular toxins.",
                    "options": [
                        ("Hard, pellet-like stools or skipping bowel movements for 1–2 days", "Constipation & Toxin Reabsorption", "35 / 100"),
                        ("Urgent, loose, or undigested food particles in stool", "Rapid Transit / Malabsorption", "40 / 100"),
                        ("Alternating between constipation and loose stools", "Enteric Nervous Irritability (IBS-M)", "45 / 100"),
                        ("Daily smooth, well-formed, effortless bowel movement (Bristol Type 4)", "Balanced Intestinal Motility", "95 / 100")
                    ]
                },
                {
                    "num": "Q3",
                    "title": "Do you experience food sensitivities or inflammatory reactions?",
                    "sub": "Clinical Significance: Intestinal permeability (Leaky Gut) allows macromolecular antigens into systemic circulation.",
                    "options": [
                        ("React strongly to gluten, dairy, high-FODMAPs, or oily restaurant meals", "Severe Leaky Gut / Endotoxemia", "30 / 100"),
                        ("Brain fog, joint aches, or skin flare-ups/acne within 24 hours of certain foods", "Immune Complex Flare", "45 / 100"),
                        ("Mild occasional discomfort, but can generally tolerate most whole foods", "Moderate Tolerance", "70 / 100"),
                        ("Can digest diverse whole, fermented, and fibrous foods with zero systemic flare-ups", "High Immunological Tolerance", "95 / 100")
                    ]
                }
            ]
        },
        {
            "num": "2",
            "name": "Section 2 — Autonomic Breath & Vagal Tone",
            "desc": "Measuring CO₂ tolerance, diaphragmatic mechanics, and parasympathetic vagal recovery.",
            "questions": [
                {
                    "num": "Q4",
                    "title": "What is your involuntary daytime breathing pattern?",
                    "sub": "Clinical Significance: Over-breathing depletes CO₂, suppressing Bohr Effect oxygen diffusion to tissues.",
                    "options": [
                        ("Frequent upper-chest breathing, sighing, yawning, or feeling of 'air hunger'", "Chronic Hyperventilation", "35 / 100"),
                        ("Mouth breathing during focused desk work, speech, or light physical exertion", "Airway Collapse & Mouth Breathing", "45 / 100"),
                        ("Nasal breathing mostly, but chest moves instead of diaphragm when stressed", "Dysfunctional Biomechanics", "65 / 100"),
                        ("Silent, calm, diaphragmatic nasal breathing (Inhale & exhale through nose 24/7)", "Optimal Respiration Mechanics", "95 / 100")
                    ]
                },
                {
                    "num": "Q5",
                    "title": "How does your nervous system respond to acute daily stress?",
                    "sub": "Clinical Significance: The vagus nerve modulates heart rate variability (HRV), bile flow, and somatic calmness.",
                    "options": [
                        ("Constant sympathetic overdrive: Racing heart, muscle tightness, anxiety surges", "Low Vagal Tone / Sympathetic Overdrive", "30 / 100"),
                        ("Afternoon energy slump paired with agitation, irritability, or brain fog", "HPA-Axis Instability", "50 / 100"),
                        ("Experience work stress, but can unwind after a few hours with conscious effort", "Moderate Nervous Regulation", "70 / 100"),
                        ("Resilient vagal brake: Quick emotional reset, calm pulse, high somatic composure", "Elite Vagal Tone", "95 / 100")
                    ]
                },
                {
                    "num": "Q6",
                    "title": "How is your physical stamina and aerobic breath-hold capacity?",
                    "sub": "Clinical Significance: Tolerance to carbon dioxide (BOLT score) is the physiological bottleneck of aerobic energy.",
                    "options": [
                        ("Get breathless climbing 1–2 flights of stairs; breath-hold capacity under 15s", "Low CO₂ Tolerance", "35 / 100"),
                        ("Moderate stamina, but experience intense physical exhaustion after normal workout", "Mitochondrial Aerobic Deficit", "55 / 100"),
                        ("Decent stamina during exercise, but recovery takes 24–48 hours", "Moderate Aerobic Buffer", "70 / 100"),
                        ("High aerobic stamina, easy nasal workouts, effortless recovery, BOLT score 30s+", "Optimal Cellular Respiration", "95 / 100")
                    ]
                }
            ]
        },
        {
            "num": "3",
            "name": "Section 3 — Circadian Rhythm, Hormones & Cellular Energy",
            "desc": "Analyzing cortisol rhythms, thyroid/insulin sensitivity, and deep restorative sleep architecture.",
            "questions": [
                {
                    "num": "Q7",
                    "title": "How is your nighttime sleep architecture and morning wakefulness?",
                    "sub": "Clinical Significance: Fragmented sleep spikes morning fasting insulin and suppresses glymphatic brain detox.",
                    "options": [
                        ("Fragmented sleep, frequent waking around 2–4 AM, or waking up with dry mouth", "Circadian Disruption / Airway Instability", "30 / 100"),
                        ("Take over 45 minutes to fall asleep due to racing thoughts; dependent on screens", "Delayed Melatonin Phase", "45 / 100"),
                        ("Sleep 7–8 hours, but wake up feeling heavy, sluggish, and unrefreshed without caffeine", "Mitochondrial Sleep Deficit", "60 / 100"),
                        ("Deep, restorative, uninterrupted sleep; wake up refreshed before alarm", "Synchronized Circadian Rhythm", "95 / 100")
                    ]
                },
                {
                    "num": "Q8",
                    "title": "Which metabolic or hormonal pattern resonates most with you?",
                    "sub": "Clinical Significance: Insulin, cortisol, and thyroid dictate cellular energy partition and fat storage.",
                    "options": [
                        ("Stubborn belly fat, intense post-meal sweet cravings, or shaky if meals delayed", "Insulin Resistance / Hypoglycemia", "35 / 100"),
                        ("Cold hands/feet, hair thinning, sluggish metabolism, or irregular cycles / PCOS", "Thyroid & Endocrine Imbalance", "40 / 100"),
                        ("Energy drops drastically between 3 PM – 5 PM, but otherwise manageable", "Cortisol Rhythm Dip", "65 / 100"),
                        ("Stable all-day cellular energy, balanced body composition, zero urgent sugar cravings", "High Metabolic Plasticity", "95 / 100")
                    ]
                },
                {
                    "num": "Q9",
                    "title": "How long have you been navigating these health roadblocks?",
                    "sub": "Clinical Significance: Calibrates the duration required for therapeutic cellular repair and habit stack integration.",
                    "options": [
                        ("Less than 6 months (Acute onset)", "Acute Phase Response", "90 / 100"),
                        ("6 months to 2 years (Establishing multi-system compensation pattern)", "Sub-Chronic Phase", "70 / 100"),
                        ("2 to 5 years (Deeply ingrained cellular dysfunction and systemic adaptation)", "Chronic Phase", "50 / 100"),
                        ("More than 5 years (Multi-decade metabolic burnout — requires phased roadmap)", "Deep Chronic Adaptation", "35 / 100")
                    ]
                }
            ]
        }
    ]

    for sec in sections_part1:
        # Section Header Banner
        sec_table = Table([[Paragraph(f"<b>{sec['name'].upper()}</b>", sec_header_style)]], colWidths=[532])
        sec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_terracotta),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(sec_table)
        story.append(Spacer(1, 4))
        story.append(Paragraph(sec['desc'], sec_desc_style))
        story.append(Spacer(1, 4))

        for q in sec['questions']:
            q_elements = []
            q_elements.append(Paragraph(f"<b>{q['num']}. {q['title']}</b>", q_title_style))
            q_elements.append(Paragraph(q['sub'], q_sub_style))

            # Options Table
            opt_rows = [
                [
                    Paragraph("<b>Diagnostic Response Option</b>", ParagraphStyle('TH1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
                    Paragraph("<b>Biomarker Signal / Diagnostic Marker</b>", ParagraphStyle('TH2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
                    Paragraph("<b>Score</b>", ParagraphStyle('TH3', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white, alignment=1))
                ]
            ]
            for label, tag, score in q['options']:
                opt_rows.append([
                    Paragraph(f"&bull; {label}", opt_label_style),
                    Paragraph(f"<b>{tag}</b>", opt_tag_style),
                    Paragraph(score, ParagraphStyle('OptScore', fontName='Helvetica-Bold', fontSize=8, textColor=c_primary, alignment=1))
                ])

            opt_table = Table(opt_rows, colWidths=[310, 160, 62])
            opt_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), c_slate),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, c_border),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_card_bg])
            ]))
            q_elements.append(opt_table)
            q_elements.append(Spacer(1, 10))

            story.append(KeepTogether(q_elements))

    story.append(Spacer(1, 10))
    story.append(PageBreak())

    # =========================================================================
    # PART 2: CLINICAL PRE-CONSULTATION INTAKE QUESTIONNAIRE (SECTIONS A-F)
    # =========================================================================
    part2_banner = [
        [Paragraph("PART 2: CLINICAL PRE-CONSULTATION INTAKE QUESTIONNAIRE (SECTIONS A TO F)", ParagraphStyle('P2H', fontName='Helvetica-Bold', fontSize=11, textColor=colors.white, leading=14))]
    ]
    t_p2 = Table(part2_banner, colWidths=[532])
    t_p2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_primary),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_p2)
    story.append(Spacer(1, 10))

    intake_sections = [
        {
            "badge": "A",
            "name": "Section A — Personal & Demographic Information",
            "desc": "Confidential patient profile for clinical record keeping and consult scheduling.",
            "items": [
                ("Q1", "Full Legal Name", "Text input (e.g. Patient Full Name)", "Mandatory identity verification"),
                ("Q2", "Email Address", "Email input", "Secure telehealth link & report delivery"),
                ("Q3", "Contact / WhatsApp Number", "Phone with country code", "Direct clinical coordinator channel"),
                ("Q4", "Age (Years)", "Numeric", "Metabolic baseline calibration"),
                ("Q5", "Biological Gender", "Female / Male / Other", "Endocrine and cycle reference metrics"),
                ("Q6", "City & Country", "Text input", "Timezone scheduling & food availability"),
                ("Q7", "Occupation / Work Style", "Text input", "Ergonomic, screen-time & stress exposure")
            ]
        },
        {
            "badge": "B",
            "name": "Section B — Your Main Health Concern",
            "desc": "Help us decode your primary health complaints, duration, and root-cause trajectory.",
            "items": [
                ("Q10", "Primary Health Concern", "Select: Gut/IBS/SIBO, PCOS/Hormones, Thyroid, Weight Plateau, Insulin/Diabetes, Chronic Fatigue, Breathing/Sleep, Skin/Inflammation, Athletic VO2 Max, Longevity", "Guides diagnostic panel selection"),
                ("Q11", "Concern Description", "Detailed narrative in patient's words", "Symptom triggers, daily frequency & sensations"),
                ("Q12", "Concern Duration", "Less than 1 mo / 1–6 mos / 6–12 mos / > 1 year", "Differentiates acute vs chronic compensation"),
                ("Q13", "Daily Life Impact", "Open response", "Evaluates functional disability & productivity cost"),
                ("Q14", "Consulted Medical Professional?", "Yes / No", "Identifies prior clinical workups"),
                ("Q15", "Prior Treatments & Outcomes", "Open response (diets, therapies, meds tried)", "Prevents repeating failed therapeutic strategies")
            ]
        },
        {
            "badge": "C",
            "name": "Section C — Health & Medical History",
            "desc": "Medical diagnoses, prescription medications, surgeries, and biological history.",
            "items": [
                ("Q16", "Diagnosed Medical Conditions", "Open response (Thyroid, Fatty Liver, GERD, etc.)", "Screens for underlying systemic pathologies"),
                ("Q17", "Current Medications & Supplements", "List names, dosages & frequencies", "Checks drug-nutrient depletions & interactions"),
                ("Q18", "Known Food Allergies & Intolerances", "Open response (Dairy, Gluten, Nuts, Histamines)", "Informs elimination & gut mucosal rebuild protocols"),
                ("Q19", "Surgeries & Medical Events", "Open response (Gallbladder, C-section, Appendectomy)", "Assesses organ function & enteric nerve integrity"),
                ("Q20", "Laboratory Blood Reports", "File upload (CBC, Thyroid, Lipids, HbA1c, Vit D)", "Objective biomarker validation (We measure, never guess)"),
                ("Q21", "Additional Medical Context", "Family history, genetic predisposition, notes", "Full biological pedigree mapping")
            ]
        },
        {
            "badge": "D",
            "name": "Section D — Body & Lifestyle Profile",
            "desc": "Physical measurements, movement metrics, sleep architecture, and nervous system pacing.",
            "items": [
                ("Q22", "Height (cm)", "Numeric", "BMI, visceral adiposity & BMR calculation"),
                ("Q23", "Current Weight (kg)", "Numeric", "Metabolic baseline"),
                ("Q24", "Weight Changes (Last 3–6 Months)", "Gained / Stable / Lost", "Detects metabolic slowdown or catabolism"),
                ("Q25", "Physical Activity Level", "Sedentary / Lightly Active / Moderate / Very Active", "Mitochondrial turnover & carb threshold"),
                ("Q26", "Sleep Duration & Breathing Patterns", "Hours, night waking, snoring, mouth breathing", "Airway stability & circadian synchronization"),
                ("Q27", "Perceived Daily Stress Level", "Low / Moderate / High Burnout", "Sympathetic autonomic tone calibration"),
                ("Q28", "Alcohol, Smoking & Caffeine Intake", "Confidential clinical record", "Liver phase 1/2 detox & adrenal burden")
            ]
        },
        {
            "badge": "E",
            "name": "Section E — Food, Nutrition & Digestive Habits",
            "desc": "Dietary structure, meal timings, gastrointestinal motility, and digestive symptoms.",
            "items": [
                ("Q29", "Dietary Preference Framework", "Vegetarian / Vegan / Eggetarian / Non-Veg / Jain", "Aligns root-cause food swaps to client values"),
                ("Q30", "Typical Daily Meal Timings", "Breakfast, Lunch, Dinner timestamps", "Assesses circadian fasting & insulin windows"),
                ("Q31", "Typical Day of Meals & Beverages", "Full food log from morning to night", "Evaluates macronutrient ratios & inflammatory triggers"),
                ("Q32", "Average Daily Water Intake", "Litres per day", "Hydration, kidney clearance & mucosal hydration"),
                ("Q33", "Digestive Symptoms in Detail", "Bloating, gas, reflux, acidity, bowel frequency", "Pinpoints upper vs lower GI dysbiosis"),
                ("Q34", "Foods Avoided or Disliked", "Open response", "Customizes palatable compliant meal plans"),
                ("Q35", "Eating Out / Delivery Frequency", "Times per week", "Industrial seed oil & sodium exposure assessment"),
                ("Q36", "Habit Obstacles & Difficulties", "Time crunch, travel, cravings, family meals", "Ensures sustainable realistic protocol adherence")
            ]
        },
        {
            "badge": "F",
            "name": "Section F — Goals, Expectations & Dedication",
            "desc": "Define your desired outcomes so Reshmi Verma can engineer your targeted clinical protocol.",
            "items": [
                ("Q37", "Primary Outcome From Consultation", "Open response", "Anchor milestone for 1-on-1 healthcare roadmap"),
                ("Q38", "90-Day Transformation Vision", "What meaningful success looks like", "Defines tangible quality-of-life biomarkers"),
                ("Q39", "Past Nutrition Plans (What Worked/Failed)", "Open response", "Eliminates ineffective restrictive dieting habits"),
                ("Q40", "Preferred Style of Guidance", "Step-by-step plan / Breathwork routines / Biometrics", "Calibrates practitioner coaching delivery style"),
                ("Q41", "Daily Time Dedication Available", "Realistic minutes/day for breathwork & cooking", "Structures feasible non-overwhelming habit stacks"),
                ("Q42", "Specific Questions for Reshmi Verma", "Open response", "Prioritized agenda for clinical consultation call")
            ]
        }
    ]

    for sec in intake_sections:
        sec_table = Table([[Paragraph(f"<b>{sec['name'].upper()}</b>", sec_header_style)]], colWidths=[532])
        sec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_terracotta),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(sec_table)
        story.append(Spacer(1, 3))
        story.append(Paragraph(sec['desc'], sec_desc_style))
        story.append(Spacer(1, 3))

        intake_rows = [
            [
                Paragraph("<b>Q#</b>", ParagraphStyle('IH0', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white, alignment=1)),
                Paragraph("<b>Clinical Field / Question</b>", ParagraphStyle('IH1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
                Paragraph("<b>Format / Options</b>", ParagraphStyle('IH2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)),
                Paragraph("<b>Clinical Objective</b>", ParagraphStyle('IH3', fontName='Helvetica-Bold', fontSize=8, textColor=colors.white))
            ]
        ]

        for q_id, q_text, q_fmt, q_obj in sec['items']:
            intake_rows.append([
                Paragraph(f"<b>{q_id}</b>", ParagraphStyle('IQNum', fontName='Helvetica-Bold', fontSize=8, textColor=c_terracotta, alignment=1)),
                Paragraph(f"<b>{q_text}</b>", ParagraphStyle('IQText', fontName='Helvetica-Bold', fontSize=8.5, textColor=c_primary)),
                Paragraph(q_fmt, ParagraphStyle('IQFmt', fontName='Helvetica', fontSize=8, textColor=c_slate)),
                Paragraph(q_obj, ParagraphStyle('IQObj', fontName='Helvetica-Oblique', fontSize=7.5, textColor=c_muted))
            ])

        t_intake = Table(intake_rows, colWidths=[36, 170, 166, 160])
        t_intake.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), c_slate),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, c_border),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_card_bg])
        ]))

        story.append(KeepTogether([t_intake, Spacer(1, 10)]))

    # =========================================================================
    # CLOSING CLINICAL STATEMENT
    # =========================================================================
    closing_card = [
        [
            Paragraph(
                "<b>Reshmi Verma Clinical Philosophy:</b><br/>"
                "<i>“Resilience is not about pushing harder, but about creating the right foundation for the body to adapt, regulate, and recover.”</i><br/><br/>"
                "Every assessment submitted through <b>healthwithreshmi.com</b> is reviewed with 18 years of diagnostic industry precision, integrating functional nutrition, Patrick McKeown's Oxygen Advantage respiratory biomechanics, and personalized 3R protocols.<br/><br/>"
                "<b>Official Website:</b> healthwithreshmi.com &bull; <b>Direct Clinical Desk:</b> support.reshmiverma@gmail.com",
                ParagraphStyle('CloseStyle', fontName='Helvetica', fontSize=8.5, leading=13, textColor=c_slate)
            )
        ]
    ]
    t_close = Table(closing_card, colWidths=[532])
    t_close.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('BOX', (0, 0), (-1, -1), 1, c_terracotta),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(Spacer(1, 12))
    story.append(t_close)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built: {filename}")

if __name__ == '__main__':
    target1 = r"f:\Android Project\Reshmi Mam Website\HealthwithReshmi_Complete_Health_Assessment_Questions.pdf"
    target2 = r"f:\Android Project\Reshmi Mam Website\frontend\public\HealthwithReshmi_Complete_Health_Assessment_Questions.pdf"
    build_pdf(target1)
    build_pdf(target2)
