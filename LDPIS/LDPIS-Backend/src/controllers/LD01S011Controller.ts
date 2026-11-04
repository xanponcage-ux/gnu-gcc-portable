import { Request, Response } from "express";
import LD01S011 from "../models/LD01S011Model";
export const getBatches = async (req: Request, res: Response) => {
  try {
    const result = await LD01S011.prototype.getBatches(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Order swap failed." });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const result = await LD01S011.prototype.getOrder(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Order swap failed." });
  }
};

export const swap = async (req: Request, res: Response) => {
  try {
    const result = await LD01S011.prototype.swap(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Order swap failed." });
  }
};
