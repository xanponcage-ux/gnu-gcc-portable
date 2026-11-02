import { Request, Response } from "express";
import TTSM054 from "../models/TTSM054Model";

export const getDispatchData = async (req: Request, res: Response) => {
  try {
    const Plant = req.body.Plant;
    const FrDate= req.body.FrDate;
    const ToDate= req.body.ToDate;
    const matno = req.body.matno;
    const OrderId = req.body.OrderId;
    const OrderItem = req.body.OrderItem;
    const division = req.body.division;
    const results = await TTSM054.prototype.getDispatchData(Plant, FrDate, ToDate, matno, OrderId, OrderItem, division);
    const rows = results.rows ?? [];
    const columnname = results.metaData ?? [];

    const colNames: string[] = columnname.map((m: any) => m.name);
    // create array of objects
    const data = rows.map((row: any[]) =>
      Object.fromEntries(row.map((val: any, idx: number) => [colNames[idx], val]))
    );
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
};

export const getPlanningData = async (req: Request, res: Response) => {
  try {
    const Plant = req.body.Plant;
    const FrDate= req.body.FrDate;
    const ToDate= req.body.ToDate;
    const OrderId = req.body.OrderId;
    const OrderItem= req.body.OrderItem;
    const division=req.body.division;
    const results = await TTSM054.prototype.getPlanningData(Plant, FrDate, ToDate, OrderId, OrderItem, division);
    const rows = results.rows ?? [];
    const columnname = results.metaData ?? [];

    const colNames: string[] = columnname.map((m: any) => m.name);
    // create array of objects
    const data = rows.map((row: any[]) =>
      Object.fromEntries(row.map((val: any, idx: number) => [colNames[idx], val]))
    );
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
};

export const getFGMAT = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.plant;
    const results: any = await TTSM054.prototype.getFGMAT(Plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};