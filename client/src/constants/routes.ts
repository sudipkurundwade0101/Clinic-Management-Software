export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  APPOINTMENTS: '/appointments',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  MEDICAL_RECORDS: '/records',
  BILLING: '/billing',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Build patient-specific consultation routes */
export const consultationRoutes = {
  newConsultation: (patientId: string) => `/patients/${patientId}/consultation/new`,
  editConsultation: (patientId: string, consultationId: string) =>
    `/patients/${patientId}/consultation/${consultationId}/edit`,
};

/** Build patient-specific prescription routes */
export const prescriptionRoutes = {
  newPrescription: (patientId: string, consultationId?: string) =>
    consultationId
      ? `/patients/${patientId}/prescriptions/new?consultationId=${consultationId}`
      : `/patients/${patientId}/prescriptions/new`,
  editPrescription: (patientId: string, prescriptionId: string) =>
    `/patients/${patientId}/prescriptions/${prescriptionId}/edit`,
};
