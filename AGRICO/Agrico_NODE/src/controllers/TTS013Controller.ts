import { Request, Response } from "express";
import TTSC013 from "../models/TTSC013Model";

// export const getPlant = async (req: Request, res: Response) => {
//   try {
//     // let id = req.body.adid;
//     const results: any = await TTSC013.prototype.getPlant();
//     return res.status(200).json(results.rows);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getFgProdData = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate ;

      const results = await TTSC013.prototype.getFgProdData(Plant, fromDate ,toDate);
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

export const updateRemarks = async (req: Request, res: Response) => {
  try {
    let selectedRows= req.body.selectedRows;
    if (!selectedRows || !Array.isArray(selectedRows) || selectedRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rows selected."
      });
    }
    const results = [];

    for (const row of selectedRows) {
      const Plant = row.MR_PLANT;
      const REMARKS = row.MR_REMARKS;
      const OSP = row.MR_OSP;
      const result: any = await TTSC013.prototype.updateRemarks(Plant, REMARKS,OSP);
      console.log('results->',results);
      results.push(result);  
    }
    return res.status(200).json({
      success: true,
      message: "Y- Record saved Succesfully.",
      count: results.length,
      data: results
    });
    } catch (error) {
      console.error("updateRemarks Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save records.",
        error
      });
    }
};
