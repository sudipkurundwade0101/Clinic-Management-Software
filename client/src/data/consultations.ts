import type { Consultation } from "@/types/patient";

// 10+ realistic mock consultations distributed across patients
// PAT-2026-1001 (Aarav Sharma) — 3 consultations
// PAT-2026-1002 (Ananya Iyer) — 2 consultations
// PAT-2026-1003 (Rohan Verma) — 2 consultations
// PAT-2026-1004 (Priya Nair) — 1 consultation
// PAT-2026-1005 (Vikram Singh) — 1 consultation
// PAT-2026-1006 (Kavya Reddy) — 1 consultation
// PAT-2026-1007 (Sanjay Patel) — 0 consultations (test empty state)
// PAT-2026-1008 (Meera Joshi) — 0 consultations (test empty state)
// PAT-2026-1009 (Arjun Das) — 1 consultation
// PAT-2026-1010 (Ishita Kapoor) — 0 consultations (test empty state)

export const initialConsultations: Consultation[] = [
  // ── Aarav Sharma ── 3 consultations
  {
    id: "CON-001",
    patientId: "PAT-2026-1001",
    date: "2026-08-25",
    chiefComplaint: "Fever and severe headache since two days",
    symptoms: ["Fever", "Headache", "Body ache", "Chills"],
    vitals: {
      temperature: "101.4",
      bloodPressure: "120/80",
      pulse: "92",
      spo2: "98",
      weight: "72",
      height: "174",
      bmi: "23.8",
    },
    diagnosis: "Viral Fever",
    doctorNotes:
      "Clinical examination reassuring. No signs of bacterial infection. Encouraged adequate hydration and rest. Patient advised to return if fever does not subside within 3 days.",
    followUpInstructions: "Return if fever persists beyond 3 days or if new symptoms appear.",
    prescriptionId: "RX-001",
    createdAt: "2026-08-25T10:30:00",
    updatedAt: "2026-08-25T10:30:00",
  },
  {
    id: "CON-002",
    patientId: "PAT-2026-1001",
    date: "2026-07-10",
    chiefComplaint: "Recurring migraine attack with visual aura",
    symptoms: ["Migraine", "Photophobia", "Nausea", "Visual disturbance"],
    vitals: {
      bloodPressure: "118/76",
      pulse: "76",
      spo2: "99",
    },
    diagnosis: "Migraine with aura",
    doctorNotes:
      "Patient describes classic visual aura preceding headache. Discussed trigger avoidance — screen time, sleep deprivation. Sumatriptan prescribed for acute attacks.",
    followUpInstructions: "Maintain a migraine diary. Return if attacks become more frequent.",
    prescriptionId: "RX-003",
    createdAt: "2026-07-10T11:00:00",
    updatedAt: "2026-07-10T11:00:00",
  },
  {
    id: "CON-003",
    patientId: "PAT-2026-1001",
    date: "2026-05-18",
    chiefComplaint: "Seasonal allergy — sneezing and runny nose",
    symptoms: ["Sneezing", "Runny nose", "Watery eyes", "Nasal congestion"],
    vitals: {
      temperature: "98.6",
      pulse: "72",
      spo2: "99",
    },
    diagnosis: "Allergic rhinitis",
    doctorNotes:
      "Seasonal pattern. Pollen allergy confirmed in history. Prescribed cetirizine for symptom relief. Nasal spray recommended for congestion.",
    followUpInstructions: "Avoid outdoor exposure during peak pollen hours. Use mask outdoors.",
    createdAt: "2026-05-18T09:15:00",
    updatedAt: "2026-05-18T09:15:00",
  },

  // ── Ananya Iyer ── 2 consultations
  {
    id: "CON-004",
    patientId: "PAT-2026-1002",
    date: "2026-08-22",
    chiefComplaint: "Fatigue, weight gain, and feeling constantly cold",
    symptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Hair thinning"],
    vitals: {
      bloodPressure: "110/70",
      pulse: "64",
      spo2: "99",
      weight: "58",
      height: "162",
      bmi: "22.1",
    },
    diagnosis: "Hypothyroidism follow-up",
    doctorNotes:
      "Patient on Levothyroxine 50 mcg. Symptoms suggest under-treatment. TSH was elevated at last test. Dose to be revised pending current thyroid panel.",
    followUpInstructions: "Repeat TSH, T3, T4 after 8 weeks. Do not miss morning dose.",
    prescriptionId: "RX-002",
    createdAt: "2026-08-22T09:00:00",
    updatedAt: "2026-08-22T09:00:00",
  },
  {
    id: "CON-005",
    patientId: "PAT-2026-1002",
    date: "2026-06-05",
    chiefComplaint: "Throat pain and difficulty swallowing since three days",
    symptoms: ["Sore throat", "Difficulty swallowing", "Mild fever", "Hoarseness"],
    vitals: {
      temperature: "99.8",
      pulse: "80",
      spo2: "98",
    },
    diagnosis: "Pharyngitis",
    doctorNotes:
      "Throat erythematous. No tonsillar exudate. Likely viral origin. Saline gargles and rest advised. Avoided antibiotics given probable viral cause.",
    followUpInstructions: "Warm saline gargles 4 times/day. Plenty of warm fluids. Return if symptoms worsen.",
    createdAt: "2026-06-05T14:30:00",
    updatedAt: "2026-06-05T14:30:00",
  },

  // ── Rohan Verma ── 2 consultations
  {
    id: "CON-006",
    patientId: "PAT-2026-1003",
    date: "2026-08-18",
    chiefComplaint: "Elevated home blood pressure readings — consistently above 140/90",
    symptoms: ["Mild dizziness", "Occasional headache"],
    vitals: {
      bloodPressure: "148/92",
      pulse: "78",
      spo2: "98",
      weight: "84",
      height: "176",
      bmi: "27.1",
    },
    diagnosis: "Essential hypertension — inadequate control",
    doctorNotes:
      "Patient admits irregular medication. Discussed importance of adherence. Lifestyle changes advised: reduced salt, daily 30-minute walk. Medication dose may be revised at next visit.",
    followUpInstructions: "Monitor BP twice daily at home. Record readings. Review in 4 weeks.",
    createdAt: "2026-08-18T10:00:00",
    updatedAt: "2026-08-18T10:00:00",
  },
  {
    id: "CON-007",
    patientId: "PAT-2026-1003",
    date: "2026-06-20",
    chiefComplaint: "Lower back pain radiating to left leg",
    symptoms: ["Lower back pain", "Leg pain", "Numbness in left foot"],
    vitals: {
      bloodPressure: "138/86",
      pulse: "74",
      spo2: "99",
    },
    diagnosis: "Lumbar disc prolapse (L4-L5) — suspected",
    doctorNotes:
      "Straight leg raise positive on left side. Referred for MRI lumbosacral spine. Pain management with NSAIDs. Physiotherapy recommended.",
    followUpInstructions: "MRI lumbosacral spine. Avoid heavy lifting. Hot compress for pain relief.",
    createdAt: "2026-06-20T11:30:00",
    updatedAt: "2026-06-20T11:30:00",
  },

  // ── Priya Nair ── 1 consultation
  {
    id: "CON-008",
    patientId: "PAT-2026-1004",
    date: "2026-08-12",
    chiefComplaint: "Increased thirst, frequent urination, and blurred vision",
    symptoms: ["Polydipsia", "Polyuria", "Blurred vision", "Fatigue"],
    vitals: {
      bloodPressure: "122/78",
      pulse: "82",
      spo2: "98",
      weight: "68",
      height: "158",
      bmi: "27.2",
    },
    diagnosis: "Type 2 Diabetes — poor glycaemic control",
    doctorNotes:
      "HbA1c of 8.4% at last check. Dietary counselling provided. Metformin dose reviewed. Patient counselled on eye care and foot care.",
    followUpInstructions: "HbA1c in 3 months. Fasting glucose weekly. Diabetic diet chart provided.",
    createdAt: "2026-08-12T09:30:00",
    updatedAt: "2026-08-12T09:30:00",
  },

  // ── Vikram Singh ── 1 consultation
  {
    id: "CON-009",
    patientId: "PAT-2026-1005",
    date: "2026-08-05",
    chiefComplaint: "Routine lipid profile check — asymptomatic",
    symptoms: [],
    vitals: {
      bloodPressure: "128/84",
      pulse: "68",
      spo2: "99",
      weight: "90",
      height: "178",
      bmi: "28.4",
    },
    diagnosis: "Hypercholesterolaemia — on treatment",
    doctorNotes:
      "Lipid profile within acceptable range on Rosuvastatin. Continue current dose. Encouraged weight reduction through diet and exercise.",
    followUpInstructions: "Lipid panel in 6 months. Low-fat diet. 40-minute brisk walk 5 days/week.",
    createdAt: "2026-08-05T08:00:00",
    updatedAt: "2026-08-05T08:00:00",
  },

  // ── Kavya Reddy ── 1 consultation
  {
    id: "CON-010",
    patientId: "PAT-2026-1006",
    date: "2026-07-29",
    chiefComplaint: "Ankle sprain after fall during morning jog",
    symptoms: ["Ankle pain", "Swelling", "Difficulty walking"],
    vitals: {
      pulse: "74",
      spo2: "99",
    },
    diagnosis: "Grade II lateral ankle sprain",
    doctorNotes:
      "Moderate swelling and tenderness over anterior talofibular ligament area. No bony tenderness; Ottawa rules negative — X-ray not needed. RICE protocol advised.",
    followUpInstructions: "RICE — Rest, Ice, Compression, Elevation for 48 hours. No strenuous activity for 2 weeks.",
    createdAt: "2026-07-29T15:00:00",
    updatedAt: "2026-07-29T15:00:00",
  },

  // ── Arjun Das ── 1 consultation
  {
    id: "CON-011",
    patientId: "PAT-2026-1009",
    date: "2026-07-06",
    chiefComplaint: "Shortness of breath and wheezing on exertion",
    symptoms: ["Breathlessness", "Wheeze", "Chest tightness", "Dry cough"],
    vitals: {
      temperature: "98.4",
      bloodPressure: "124/80",
      pulse: "88",
      spo2: "95",
      weight: "78",
      height: "170",
      bmi: "27.0",
    },
    diagnosis: "Bronchial asthma — acute mild exacerbation",
    doctorNotes:
      "SpO2 95% on room air at rest. Wheeze audible bilaterally. Salbutamol nebulisation given with good response. Inhaler technique reviewed and corrected.",
    followUpInstructions: "Continue salbutamol inhaler as needed. Avoid cold air and dust. Return if SpO2 drops or dyspnoea worsens.",
    createdAt: "2026-07-06T12:00:00",
    updatedAt: "2026-07-06T12:00:00",
  },
];

export { initialConsultations as consultationMockData };
