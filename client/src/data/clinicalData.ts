import type { Bill, PatientDocument } from "@/types/patient";
export { initialPrescriptions } from "@/data/prescriptions";

export const initialDocuments: PatientDocument[] = [
  { id: "DOC-001", patientId: "PAT-2026-1001", name: "Blood Test Report", type: "Lab report", uploadedAt: "2026-08-25", size: "1.2 MB" },
  { id: "DOC-002", patientId: "PAT-2026-1003", name: "Previous Prescription", type: "Prescription", uploadedAt: "2026-08-18", size: "420 KB" },
  { id: "DOC-003", patientId: "PAT-2026-1004", name: "HbA1c Report", type: "Lab report", uploadedAt: "2026-08-12", size: "860 KB" },
  { id: "DOC-004", patientId: "PAT-2026-1009", name: "Spirometry Report", type: "Lab report", uploadedAt: "2026-07-06", size: "540 KB" },
];

export const initialBills: Bill[] = [
  { id: "BILL-001", patientId: "PAT-2026-1001", date: "2026-08-25", description: "Consultation fee", amount: 600, paymentMethod: "UPI", status: "Paid", paidAmount: 600 },
  { id: "BILL-002", patientId: "PAT-2026-1001", date: "2026-08-25", description: "Lab tests", amount: 850, paymentMethod: "Cash", status: "Partial", paidAmount: 500 },
  { id: "BILL-003", patientId: "PAT-2026-1002", date: "2026-08-22", description: "Consultation fee", amount: 600, paymentMethod: "Card", status: "Paid", paidAmount: 600 },
  { id: "BILL-004", patientId: "PAT-2026-1003", date: "2026-08-18", description: "Consultation fee", amount: 600, paymentMethod: "Cash", status: "Pending", paidAmount: 0 },
  { id: "BILL-005", patientId: "PAT-2026-1004", date: "2026-08-12", description: "Consultation fee", amount: 600, paymentMethod: "UPI", status: "Paid", paidAmount: 600 },
];
