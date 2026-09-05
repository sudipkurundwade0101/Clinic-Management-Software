import type { Patient } from "@/types/patient";

const stamp = "2026-08-26";
export const initialPatients: Patient[] = [
  ["PAT-2026-1001","Aarav Sharma",34,"Male","9876543210","O+","12 Park Street, Kolkata","2026-08-25",["Seasonal pollen"],["Migraine"],["Sumatriptan as needed"],"Meera Sharma · 9876500011"],
  ["PAT-2026-1002","Ananya Iyer",28,"Female","9823456710","B+","Indiranagar, Bengaluru","2026-08-22",[],["Hypothyroidism"],["Levothyroxine 50 mcg"],"Raj Iyer · 9823400012"],
  ["PAT-2026-1003","Rohan Verma",45,"Male","9811122233","A+","Vaishali Nagar, Jaipur","2026-08-18",["Penicillin"],["Hypertension"],["Amlodipine 5 mg"],"Kavita Verma · 9811100013"],
  ["PAT-2026-1004","Priya Nair",39,"Female","9898981234","AB+","Kakkanad, Kochi","2026-08-12",["Shellfish"],["Type 2 Diabetes"],["Metformin 500 mg"],"Arun Nair · 9898900014"],
  ["PAT-2026-1005","Vikram Singh",52,"Male","9765432109","B-","Sector 62, Noida","2026-08-05",[],["High cholesterol"],["Rosuvastatin 10 mg"],"Neha Singh · 9765400015"],
  ["PAT-2026-1006","Kavya Reddy",24,"Female","9900112233","O-","Banjara Hills, Hyderabad","2026-07-29",["Ibuprofen"],[],[],"Suresh Reddy · 9900100016"],
  ["PAT-2026-1007","Sanjay Patel",61,"Male","9988776655","A-","Vastrapur, Ahmedabad","2026-07-21",[],["Arthritis"],["Calcium supplement"],"Bhavna Patel · 9988700017"],
  ["PAT-2026-1008","Meera Joshi",31,"Female","9871204567","B+","Kothrud, Pune","2026-07-14",[],["PCOS"],[],"Akash Joshi · 9871200018"],
  ["PAT-2026-1009","Arjun Das",48,"Male","9830012345","O+","Salt Lake, Kolkata","2026-07-06",["Dust"],["Asthma"],["Salbutamol inhaler"],"Rita Das · 9830000019"],
  ["PAT-2026-1010","Ishita Kapoor",36,"Female","9912345678","AB-","Civil Lines, Delhi","2026-06-28",[],[],[],"Rohit Kapoor · 9912300020"],
].map(([id, name, age, gender, phone, bloodGroup, address, lastVisit, allergies, existingConditions, currentMedications, emergencyContact]) => ({
  id: id as string, name: name as string, age: age as number, gender: gender as Patient["gender"], phone: phone as string, bloodGroup: bloodGroup as string, address: address as string, lastVisit: lastVisit as string, allergies: allergies as string[], existingConditions: existingConditions as string[], currentMedications: currentMedications as string[], emergencyContact: emergencyContact as string, status: "Active" as const, createdAt: stamp, updatedAt: stamp,
}));
