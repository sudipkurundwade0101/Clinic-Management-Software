import { Request, Response, NextFunction } from "express";
import { Bill } from "../models/Bill.js";

export const getBills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId, status } = req.query;
    const query: Record<string, any> = {};

    if (patientId && typeof patientId === "string") {
      query.patientId = patientId;
    }
    if (status && typeof status === "string") {
      query.status = status;
    }

    const bills = await Bill.find(query).sort({ date: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    next(error);
  }
};

export const getBillById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const bill = await Bill.findOne({ id });

    if (!bill) {
      res.status(404).json({
        success: false,
        error: `Invoice with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

export const createBill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;

    if (!body.id) {
      body.id = `BILL-${Date.now()}`;
    }

    const bill = await Bill.create(body);
    res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const bill = await Bill.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    });

    if (!bill) {
      res.status(404).json({
        success: false,
        error: `Invoice with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const bill = await Bill.findOneAndDelete({ id });

    if (!bill) {
      res.status(404).json({
        success: false,
        error: `Invoice with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Invoice ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
