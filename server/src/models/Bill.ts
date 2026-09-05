import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  id: string;
  patientId: string;
  date: string;
  description: string;
  amount: number;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
  status: "Paid" | "Pending" | "Partial";
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<IBill>(
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
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Other"],
      default: "UPI",
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Partial"],
      default: "Paid",
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
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

export const Bill = mongoose.model<IBill>("Bill", BillSchema);
