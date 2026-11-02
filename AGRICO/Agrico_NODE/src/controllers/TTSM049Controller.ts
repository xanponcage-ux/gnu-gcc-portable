import { Request, Response } from "express";
import TTSM049 from "../models/TTSM049Model";

export const getCampaignDashBoardData = async (req: Request, res: Response) => {
  try {
    var Plant = req.body.Plant;
      const results = await TTSM049.prototype.getCampaignDashBoardData(Plant);
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
