import { Router } from "express";
import {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/billingController.js";

const router = Router();

router.route("/").get(getBills).post(createBill);
router.route("/:id").get(getBillById).put(updateBill).delete(deleteBill);

export default router;
