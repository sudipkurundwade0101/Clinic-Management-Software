import { Router } from "express";
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "../controllers/consultationController.js";

const router = Router();

router.route("/").get(getConsultations).post(createConsultation);
router
  .route("/:id")
  .get(getConsultationById)
  .put(updateConsultation)
  .delete(deleteConsultation);

export default router;
