import { Request, Response } from "express";
import LD09S002 from "../models/LD09S002Model";

export const getCoils = async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const results: any = await LD09S002.prototype.getCoils(data);

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
      results = await LD09S002.prototype.saveData(batchId, plant);
      console.log(results);
      // let res1 = results?.outBinds?.LS_OUT_FLAG?.substr(0, 1);
      // console.log("res1: ", res1);
      return results?.rowsAffected > 0;
    });

    const resultsArray = await Promise.all(promises); // Wait for all saveData calls to complete
    // Counting no of success
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


export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    const result: any = await LD09S002.prototype.getPipeNoList(req.body?.plant);
    return res.status(200).json(result.rows.map((row: any[]) => ({
      value: row[0], label: row[0], orderNo: row[1], orderItem: row[2],
    })));
  } catch (error) {
    return res.status(400).json(error);
  }
};
