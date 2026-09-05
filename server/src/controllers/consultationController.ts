import { Request, Response, NextFunction } from "express";
import { Consultation } from "../models/Consultation.js";
import { Patient } from "../models/Patient.js";

export const getConsultations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.query;
    const query: Record<string, any> = {};

    if (patientId && typeof patientId === "string") {
      query.patientId = patientId;
    }

    const consultations = await Consultation.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findOne({ id });

    if (!consultation) {
      res.status(404).json({
        success: false,
        error: `Consultation with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const createConsultation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    if (!body.id) {
      body.id = `CON-${Date.now()}`;
    }

    const consultation = await Consultation.create(body);

    // Update the patient's lastVisit date automatically
    if (body.patientId && body.date) {
      await Patient.findOneAndUpdate(
        { id: body.patientId },
        { lastVisit: body.date }
      );
    }

    res.status(201).json({
      success: true,
      message: "Consultation recorded successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConsultation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const consultation = await Consultation.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    });

    if (!consultation) {
      res.status(404).json({
        success: false,
        error: `Consultation with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConsultation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findOneAndDelete({ id });

    if (!consultation) {
      res.status(404).json({
        success: false,
        error: `Consultation with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Consultation ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
