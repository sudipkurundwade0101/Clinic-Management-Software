export type Gender = "Male" | "Female" | "Other";
export type PatientStatus = "Active" | "Inactive";

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  age: number;
  gender: Gender;
  phone: string;
  address?: string;
  bloodGroup?: string;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
  emergencyContact?: string;
  previousMedicalHistory?: string;
  status: PatientStatus;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  temperature?: string;
  bloodPressure?: string;
  pulse?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  bmi?: string;
}

export interface PrescriptionMedicine {
  id: string;
  medicineName: string;
  name?: string;
  dosage: string;
  frequency: string;
  duration: string;
  foodInstruction?: string;
  food?: string;
  instructions?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: VitalSigns;
  /** Stored as a single display string (comma-joined from the diagnoses array on save) */
  diagnosis: string;
  doctorNotes: string;
  followUpInstructions: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  consultationId: string;
  date: string;
  diagnosis: string[];
  doctorName: string;
  medicines: PrescriptionMedicine[];
  generalInstructions?: string;
  followUpInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface Bill {
  id: string;
  patientId: string;
  date: string;
  description: string;
  amount: number;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  status: "Paid" | "Pending" | "Partial";
  paidAmount: number;
}
