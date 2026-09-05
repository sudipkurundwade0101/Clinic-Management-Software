import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`
🚀 ─────────────────────────────────────────────────────────────
🩺 Clinic Management Backend API Server Started
🌐 URL: http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
📦 Environment: ${process.env.NODE_ENV || "development"}
─────────────────────────────────────────────────────────────
    `);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log("\n🛑 Gracefully shutting down server...");
    server.close(() => {
      console.log("🔒 Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
