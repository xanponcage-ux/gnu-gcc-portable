import { Request, Response } from "express";
import moment from "moment";
import LDSC012 from "../models/LDSC012Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils/response";

export const getTabDisplayData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LDSC012.prototype.getTabDisplayData(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const InsertData = async (req: Request, res: Response) => {
  try {
    const selectedData = req?.body?.rowData;
    const adid = req?.body?.adid;
    const tabValue = req?.body?.tabValue;
    let totalRowsAffected = 0;
    console.log("controller", selectedData);

    for (const data of selectedData) {
      var result1 = await LDSC012.prototype.InsertData(data, adid, tabValue);
      if (result1?.rowsAffected) {
        totalRowsAffected += result1.rowsAffected;
      }
    }

    return res.status(200).json(result1);
  } catch (error: any) {
    console.log("insert_cont", error);
    return res.status(400).json(error);
  }
};

export const DeleteData = async (req: Request, res: Response) => {
  try {
    const selectedData = req?.body?.rowData;
    const adid = req?.body?.adid;
    let results: any[] = [];

    for (const data of selectedData) {
      const result = await LDSC012.prototype.DeleteData(data, adid);
      results.push(result);
    }

    return res.status(200).json(results);
  } catch (error: any) {
    console.log("delete_cont", error);
    return res.status(400).json(error);
  }
};
