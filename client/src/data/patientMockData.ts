export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalConditions: string[];
  allergies: string[];
  lastVisit: string;
  attendingDoctor: string;
  department: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  status: 'Active' | 'Inpatient' | 'Outpatient' | 'Discharged';
  avatarInitials: string;
}

// Temporary Sample Patient Data
export const samplePatient: Patient = {
  id: "PAT-2026-0042",
  name: "Eleanor Vance",
  age: 34,
  gender: "Female",
  bloodGroup: "O+",
  phone: "+1 (555) 234-5678",
  email: "eleanor.vance@example.com",
  address: "742 Evergreen Terrace, Springfield, IL 62704",
  emergencyContact: {
    name: "Thomas Vance",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  medicalConditions: ["Mild Asthma", "Hypertension"],
  allergies: ["Penicillin", "Peanuts"],
  lastVisit: "2026-08-24",
  attendingDoctor: "Dr. Alex Rivera",
  department: "Cardiology",
  insuranceProvider: "Blue Cross Health Shield",
  insurancePolicyNumber: "POL-BC-99823104",
  status: "Outpatient",
  avatarInitials: "EV",
};

export const samplePatientList: Patient[] = [
  samplePatient,
  {
    id: "PAT-2026-0043",
    name: "Marcus Brody",
    age: 52,
    gender: "Male",
    bloodGroup: "A-",
    phone: "+1 (555) 876-5432",
    email: "marcus.brody@example.com",
    address: "100 Skyline Blvd, Suite 400, Chicago, IL",
    emergencyContact: {
      name: "Sarah Brody",
      relationship: "Daughter",
      phone: "+1 (555) 345-6789",
    },
    medicalConditions: ["Type 2 Diabetes"],
    allergies: ["Sulfa Drugs"],
    lastVisit: "2026-08-22",
    attendingDoctor: "Dr. Emily Wong",
    department: "Endocrinology",
    insuranceProvider: "Aetna Healthcare",
    insurancePolicyNumber: "POL-AE-44321908",
    status: "Active",
    avatarInitials: "MB",
  },
];
