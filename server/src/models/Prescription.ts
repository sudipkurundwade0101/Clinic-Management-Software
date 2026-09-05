import mongoose, { Schema, Document } from "mongoose";

export interface IPrescriptionMedicine {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  foodInstruction?: string;
  instructions?: string;
}

export interface IPrescription extends Document {
  id: string;
  patientId: string;
  consultationId: string;
  date: string;
  diagnosis: string[];
  doctorName: string;
  medicines: IPrescriptionMedicine[];
  generalInstructions?: string;
  followUpInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionMedicineSchema = new Schema<IPrescriptionMedicine>(
  {
    id: { type: String, required: true },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    foodInstruction: { type: String, trim: true },
    instructions: { type: String, trim: true },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    consultationId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    diagnosis: {
      type: [String],
      default: [],
    },
    doctorName: {
      type: String,
      required: true,
      default: "Dr. Sudip Mukherjee",
    },
    medicines: {
      type: [PrescriptionMedicineSchema],
      default: [],
      validate: {
        validator: (v: IPrescriptionMedicine[]) => Array.isArray(v) && v.length > 0,
        message: "Prescription must have at least one medicine",
      },
    },
    generalInstructions: {
      type: String,
      trim: true,
    },
    followUpInstructions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Prescription = mongoose.model<IPrescription>(
  "Prescription",
  PrescriptionSchema
);
