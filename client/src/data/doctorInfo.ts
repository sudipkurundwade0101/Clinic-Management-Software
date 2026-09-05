export interface DoctorInfo {
  name: string;
  qualification: string;
  specialization: string;
  registrationNumber: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
}

export const defaultDoctorInfo: DoctorInfo = {
  name: "Dr. Sudip Mukherjee",
  qualification: "MBBS, MD (General Medicine)",
  specialization: "Consultant Physician",
  registrationNumber: "WBMC-74892",
  clinicName: "MediCare Health Clinic",
  clinicAddress: "12/A Park Circus, Kolkata - 700017",
  phone: "+91 98765 43210",
  email: "dr.sudip@medicareclinic.in",
};
