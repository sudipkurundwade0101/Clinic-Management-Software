import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  dateOfBirth?: string;
  address?: string;
  bloodGroup?: string;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
  emergencyContact?: string;
  previousMedicalHistory?: string;
  status: "Active" | "Inactive";
  lastVisit?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateOfBirth: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    existingConditions: {
      type: [String],
      default: [],
    },
    currentMedications: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    previousMedicalHistory: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    lastVisit: {
      type: String,
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

// Search text index on name, id, phone
PatientSchema.index({ name: "text", id: "text", phone: "text" });

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
