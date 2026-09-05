import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/Patient.js";

export const getPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status } = req.query;
    const query: Record<string, any> = {};

    if (status && (status === "Active" || status === "Inactive")) {
      query.status = status;
    }

    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { id: searchRegex },
        { phone: searchRegex },
      ];
    }

    const patients = await Patient.find(query).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ id });

    if (!patient) {
      res.status(404).json({
        success: false,
        error: `Patient with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    // Generate patient ID if not provided: PAT-YYYY-XXXX
    if (!body.id) {
      const year = new Date().getFullYear();
      const count = await Patient.countDocuments();
      body.id = `PAT-${year}-${(1001 + count).toString()}`;
    }

    const existing = await Patient.findOne({ id: body.id });
    if (existing) {
      res.status(400).json({
        success: false,
        error: `Patient ID ${body.id} already exists`,
      });
      return;
    }

    const patient = await Patient.create(body);
    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const patient = await Patient.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        error: `Patient with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOneAndDelete({ id });

    if (!patient) {
      res.status(404).json({
        success: false,
        error: `Patient with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Patient ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
