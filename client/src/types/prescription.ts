export interface PrescriptionMedicine {
  id: string;
  medicineName: string;
  name?: string; // alias for compatibility
  dosage: string;
  frequency: string;
  duration: string;
  foodInstruction?: string;
  food?: string; // alias for compatibility
  instructions?: string;
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
