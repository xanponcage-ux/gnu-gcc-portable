import { Request, Response } from "express";
import TTSC012 from "../models/TTSC012Model";

export const getPlant = async (req: Request, res: Response) => {
  try {
    // let id = req.body.adid;
    const results: any = await TTSC012.prototype.getPlant();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPlanData = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let MonthYear = req.body.MonthYear;

    const results = await TTSC012.prototype.getPlanData(Plant, MonthYear);
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

export const savePlanData = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let UpdatedBy = req.body.UpdatedBy;
    let Rows = req.body.Rows;
    let user = req.body.UpdatedBy;
    let succCount=0;
    for (let i = 0; i < Rows.length ; i++){
        let plant = Rows[i].PLANT_CD;
        let  yearmon = Rows[i].YEARMON;
        let catId = Rows[i].CATEGORY_CODE;
        let  abp =Rows[i].ABP_VALUE;
        let osp = Rows[i].OSP_VALUE;
        let abpFrequency = Rows[i].ABP_FREQUENCY;
        let ospFrequency = Rows[i].OSP_FREQUENCY;
      const results: any = await TTSC012.prototype.savePlan(plant, yearmon, catId, abp, osp, abpFrequency, ospFrequency, user);
      console.log('results->',results);
      if (results.rowsAffected ===1){
        succCount++;
      };
    }
    if (succCount === Rows.length) return res.status(200).json({mesg:'Y- All record saved Succesfully',succCount:succCount})
    } catch (error) {
        return res.status(400).json(error);
    }
};
