import { Request, Response } from "express";
import LDLTS008 from "../models/LDLTS008Model";
import { ResponceData } from "../utils";

// Exact copy endpoints (LDLTS003 -> LDLTS008)
export const getOrderid = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS008.prototype.getOrderid(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getItemNo = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS008.prototype.getItemNo(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Like getOrdDetailLD (process sheet detail)
export const getProcessSheetData = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS008.prototype.getProcessSheetData(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Exact copy of DeleteProcesssheet
export const DeleteProcesssheet = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS008.prototype.DeleteProcesssheet(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
