import { Router } from "express";
import patientRoutes from "./patientRoutes.js";
import consultationRoutes from "./consultationRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import billingRoutes from "./billingRoutes.js";
import statsRoutes from "./statsRoutes.js";
import calendarRoutes from "./googleCalendar.js";
import authRoutes from "./authRoutes.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Clinic Management API",
    timestamp: new Date().toISOString(),
  });
});

// Domain routes
router.use("/auth", authRoutes);
router.use("/patients", verifyToken, patientRoutes);
router.use("/consultations", verifyToken, consultationRoutes);
router.use("/prescriptions", verifyToken, prescriptionRoutes);
router.use("/billing", verifyToken, billingRoutes);
router.use("/stats", verifyToken, statsRoutes);
router.use("/calendar", verifyToken, calendarRoutes);

export default router;
