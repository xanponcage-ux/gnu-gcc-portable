import { Request, Response } from "express";
import TTSM050 from "../models/TTSM050Model";
import axios from "axios";

export const getCampaignData = async (req: Request, res: Response) => {
  try {
    var Plant = req.body.Plant;
    var Mill = req.body.Mill;
    var Segment = req.body.Segment;
    var Zone = req.body.Zone;
    var TType = req.body.TType;
      const results = await TTSM050.prototype.getCampaignData(Plant, Mill,Segment,Zone,TType);
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

export const getCampaignDataByPOD = async (req: Request, res: Response) => {
  try {
    var Plant = req.body.Plant;
    var Mill = req.body.Mill;
    var Segment = req.body.Segment;
    var Zone = req.body.Zone;
    var TType = req.body.TType;
    const results = await TTSM050.prototype.getCampaignDataByPOD(Plant, Mill, Segment, Zone, TType);
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
export const getCampaignDataByOD = async (req: Request, res: Response) => {
  try {
     var Plant = req.body.Plant;
     var Mill = req.body.Mill;
     var Segment = req.body.Segment;
     var Zone= req.body.Zone;
     var TType= req.body.TType;
    const results = await TTSM050.prototype.getCampaignDataByPOD(Plant, Mill, Segment, Zone, TType);
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

export const runModel = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://mmwddev.corp.tatasteel.com:8408/Tubes_camp_data_processing");
    res.status(200).json({
      message: "API called successfully",
      data: response.data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error calling API",
    });
  }
};