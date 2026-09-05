import dotenv from "dotenv";
import mongoose from "mongoose";
import { Patient } from "../models/Patient.js";
import { Consultation } from "../models/Consultation.js";
import { Prescription } from "../models/Prescription.js";
import { Bill } from "../models/Bill.js";
import {
  seedPatients,
  seedConsultations,
  seedPrescriptions,
  seedBills,
} from "../seed/seedData.js";

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clinic_management";

  try {
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(uri);
    console.log("✅ Connected. Clearing existing collections...");

    await Promise.all([
      Patient.deleteMany({}),
      Consultation.deleteMany({}),
      Prescription.deleteMany({}),
      Bill.deleteMany({}),
    ]);

    console.log("📦 Inserting seed data...");
    await Promise.all([
      Patient.insertMany(seedPatients),
      Consultation.insertMany(seedConsultations),
      Prescription.insertMany(seedPrescriptions),
      Bill.insertMany(seedBills),
    ]);

    console.log(`✅ Seeding Complete!`);
    console.log(`   - Patients: ${seedPatients.length}`);
    console.log(`   - Consultations: ${seedConsultations.length}`);
    console.log(`   - Prescriptions: ${seedPrescriptions.length}`);
    console.log(`   - Bills: ${seedBills.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
