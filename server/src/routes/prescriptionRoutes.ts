import { Router } from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";

const router = Router();

router.route("/").get(getPrescriptions).post(createPrescription);
router
  .route("/:id")
  .get(getPrescriptionById)
  .put(updatePrescription)
  .delete(deletePrescription);

export default router;
