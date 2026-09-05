import { Request, Response, NextFunction } from "express";
import { Prescription } from "../models/Prescription.js";
import { Consultation } from "../models/Consultation.js";

export const getPrescriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId, consultationId } = req.query;
    const query: Record<string, any> = {};

    if (patientId && typeof patientId === "string") {
      query.patientId = patientId;
    }
    if (consultationId && typeof consultationId === "string") {
      query.consultationId = consultationId;
    }

    const prescriptions = await Prescription.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findOne({ id });

    if (!prescription) {
      res.status(404).json({
        success: false,
        error: `Prescription with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

export const createPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    if (!body.id) {
      body.id = `RX-${Date.now()}`;
    }

    const prescription = await Prescription.create(body);

    // Link prescriptionId to consultation if consultationId was supplied
    if (body.consultationId) {
      await Consultation.findOneAndUpdate(
        { id: body.consultationId },
        { prescriptionId: prescription.id }
      );
    }

    res.status(201).json({
      success: true,
      message: "Prescription issued successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const prescription = await Prescription.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    });

    if (!prescription) {
      res.status(404).json({
        success: false,
        error: `Prescription with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findOneAndDelete({ id });

    if (!prescription) {
      res.status(404).json({
        success: false,
        error: `Prescription with ID ${id} not found`,
      });
      return;
    }

    // Remove reference from consultation
    if (prescription.consultationId) {
      await Consultation.findOneAndUpdate(
        { id: prescription.consultationId },
        { $unset: { prescriptionId: 1 } }
      );
    }

    res.status(200).json({
      success: true,
      message: `Prescription ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
