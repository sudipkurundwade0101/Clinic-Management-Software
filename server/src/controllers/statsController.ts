import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/Patient.js";
import { Consultation } from "../models/Consultation.js";
import { Prescription } from "../models/Prescription.js";
import { Bill } from "../models/Bill.js";

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [
      totalPatients,
      todayConsultations,
      totalPrescriptions,
      bills,
      recentConsultations,
    ] = await Promise.all([
      Patient.countDocuments(),
      Consultation.countDocuments({ date: today }),
      Prescription.countDocuments(),
      Bill.find(),
      Consultation.find().sort({ date: -1, createdAt: -1 }).limit(5),
    ]);

    const totalRevenue = bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const outstanding = bills.reduce(
      (sum, b) => sum + (b.amount - (b.paidAmount || 0)),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        todayConsultations,
        totalPrescriptions,
        revenue: {
          totalCollected: totalRevenue,
          outstanding,
          totalBilled: totalRevenue + outstanding,
        },
        recentConsultations,
      },
    });
  } catch (error) {
    next(error);
  }
};
