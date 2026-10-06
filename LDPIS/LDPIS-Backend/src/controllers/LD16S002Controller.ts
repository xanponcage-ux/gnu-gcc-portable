import { Request, Response } from "express";
import LD16S002 from "../models/LD16S002Model";

export const getCoils = async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const results: any = await LD16S002.prototype.getCoils(data);

    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveData = async (req: Request, res: Response) => {
  try {
    let results: any = {};
    let selectedData = req?.body?.selectedData;
    let plant = req?.body?.plantCd;

    const promises = selectedData.map(async (element: any) => {
      let batchId = element?.BATCH_ID;
      results = await LD16S002.prototype.saveData(batchId, plant);
      console.log(results);
      return results?.rowsAffected > 0;
    });

    const resultsArray = await Promise.all(promises);
    const count = resultsArray.filter((result) => result).length;

    console.log("count: ", count);
    if (selectedData?.length === count) {
      return res.status(200).json("Y-Successfully Status Updated");
    }

    return res.status(200).json("N-Update not success");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
