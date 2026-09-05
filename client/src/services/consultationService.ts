import { initialConsultations } from "@/data/consultations";
import type { Consultation } from "@/types/patient";

const STORAGE_KEY = "clinic-consultations";

/** Read from localStorage; fall back to seed data on first run */
const read = (): Consultation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Consultation[]) : initialConsultations;
  } catch {
    return initialConsultations;
  }
};

const write = (items: Consultation[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const consultationService = {
  /** Return all consultations */
  getAll: (): Consultation[] => read(),

  /** Return consultations for a specific patient, newest first */
  getConsultationsByPatientId: (patientId: string): Consultation[] =>
    read()
      .filter((c) => c.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date)),

  /** Return a single consultation by ID */
  getConsultationById: (id: string): Consultation | undefined =>
    read().find((c) => c.id === id),

  /** Add a new consultation; returns the saved record */
  createConsultation: (data: Consultation): Consultation => {
    const next = [data, ...read()];
    write(next);
    return data;
  },

  /** Replace an existing consultation by ID; returns the updated record */
  updateConsultation: (id: string, data: Consultation): Consultation => {
    const now = new Date().toISOString();
    const updated: Consultation = { ...data, updatedAt: now };
    write(read().map((c) => (c.id === id ? updated : c)));
    return updated;
  },

  /** Remove a consultation by ID */
  deleteConsultation: (id: string): void =>
    write(read().filter((c) => c.id !== id)),

  /**
   * Reset localStorage to the seeded mock data.
   * Useful for development/testing.
   */
  resetToMockData: (): void => write(initialConsultations),
};
