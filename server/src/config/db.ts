import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clinic_management";

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    console.log("ℹ️  The server will continue running. Ensure MongoDB service is started if database operations are required.");
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected.");
});
