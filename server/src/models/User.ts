import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
