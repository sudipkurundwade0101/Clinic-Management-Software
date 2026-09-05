import mongoose, { Schema, Document } from "mongoose";

export interface IVitalSigns {
  temperature?: string;
  bloodPressure?: string;
  pulse?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  bmi?: string;
}

export interface IConsultation extends Document {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: IVitalSigns;
  diagnosis: string;
  doctorNotes?: string;
  followUpInstructions?: string;
  prescriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VitalSignsSchema = new Schema<IVitalSigns>(
  {
    temperature: { type: String, trim: true },
    bloodPressure: { type: String, trim: true },
    pulse: { type: String, trim: true },
    spo2: { type: String, trim: true },
    weight: { type: String, trim: true },
    height: { type: String, trim: true },
    bmi: { type: String, trim: true },
  },
  { _id: false }
);

const ConsultationSchema = new Schema<IConsultation>(
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
    date: {
      type: String,
      required: true,
      index: true,
    },
    chiefComplaint: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    vitals: {
      type: VitalSignsSchema,
      default: {},
    },
    diagnosis: {
      type: String,
      default: "",
      trim: true,
    },
    doctorNotes: {
      type: String,
      default: "",
      trim: true,
    },
    followUpInstructions: {
      type: String,
      default: "",
      trim: true,
    },
    prescriptionId: {
      type: String,
      index: true,
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

export const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  ConsultationSchema
);
