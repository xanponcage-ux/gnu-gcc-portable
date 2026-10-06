import { Request, Response } from "express";
import LDLTS009 from "../models/LDLTS009Model";
import { ResponceData } from "../utils"; 

export const getOrderid = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS009.prototype.getOrderid(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const results: any = await ResponceData(
      await LDLTS009.prototype.getDetails(data)
    );
    return res.status(200).json(results);
  } catch (error: any) {
    console.error("Error in LDLTS009Controller.getDetails:", error);
    return res.status(400).json({ msg: error.message || "Failed to fetch details." });
  }
};

export const insertUpdateDetails = async (req: Request, res: Response) => {
  try {
    const result: any = await LDLTS009.prototype.insertUpdateDetails(req.body);
    
    if (result && result.msg) {
      return res.status(200).json(result); 
    }
    return res.status(200).json({ msg: "Y-Data saved succesfully" });
  } catch (error: any) {
    console.error("Error in LDLTS009Controller.insertUpdateDetails:", error);
    return res.status(400).json({ msg: error.message || "Failed to save/update details." });
  }
};
