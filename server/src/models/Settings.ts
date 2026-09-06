import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  id: string;
  googleCalendarTokens?: {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: "default_settings"
    },
    googleCalendarTokens: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);
