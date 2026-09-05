import { initialPrescriptions } from "@/data/prescriptions";
import type { Prescription } from "@/types/prescription";

const STORAGE_KEY = "clinic-prescriptions";

/** Read from localStorage with fallback to seeded mock data */
const read = (): Prescription[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Prescription[]) : initialPrescriptions;
  } catch {
    return initialPrescriptions;
  }
};

const write = (items: Prescription[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const prescriptionService = {
  /** Return all prescriptions */
  getAll: (): Prescription[] => read(),

  /** Return prescriptions for a specific patient, newest first */
  getPrescriptionsByPatientId: (patientId: string): Prescription[] =>
    read()
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date)),

  /** Return a single prescription by ID */
  getPrescriptionById: (id: string): Prescription | undefined =>
    read().find((p) => p.id === id),

  /** Return prescription by consultation ID (1-to-1 linkage) */
  getPrescriptionByConsultationId: (consultationId: string): Prescription | undefined =>
    read().find((p) => p.consultationId === consultationId),

  /** Create a new prescription; returns the saved record */
  createPrescription: (data: Prescription): Prescription => {
    const next = [data, ...read().filter((p) => p.id !== data.id)];
    write(next);
    return data;
  },

  /** Update an existing prescription by ID; returns updated record */
  updatePrescription: (id: string, data: Prescription): Prescription => {
    const now = new Date().toISOString();
    const updated: Prescription = { ...data, updatedAt: now };
    write(read().map((p) => (p.id === id ? updated : p)));
    return updated;
  },

  /** Delete a prescription by ID */
  deletePrescription: (id: string): void => {
    write(read().filter((p) => p.id !== id));
  },

  /** Reset localStorage to initial mock data */
  resetToMockData: (): void => write(initialPrescriptions),
};
