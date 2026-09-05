import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    service: "Clinic Management System Backend API",
    status: "healthy",
    docs: "/api/health",
    endpoints: [
      "/api/patients",
      "/api/consultations",
      "/api/prescriptions",
      "/api/billing",
      "/api/stats/dashboard",
    ],
  });
});

// API Routes
app.use("/api", routes);

// 404 Catch-all handler for unknown endpoints
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
