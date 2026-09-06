import { Router } from "express";
import patientRoutes from "./patientRoutes.js";
import consultationRoutes from "./consultationRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import billingRoutes from "./billingRoutes.js";
import statsRoutes from "./statsRoutes.js";
import calendarRoutes from "./googleCalendar.js";

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
router.use("/patients", patientRoutes);
router.use("/consultations", consultationRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/billing", billingRoutes);
router.use("/stats", statsRoutes);
router.use("/calendar", calendarRoutes);

export default router;
