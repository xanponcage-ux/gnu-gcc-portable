import { Request, Response } from "express";
import LDLTS002 from "../models/LDLTS002Model";
import { ResponceData } from "./LDSM016Controller";

export const getCoils = async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const results: any = await LDLTS002.prototype.getCoils(data);

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
    let selectedData = req?.body?.selectedData;
    let results: any = {};

    let noBatches = selectedData.length;
    // console.log(noBatches);//
    let pass: any = [],
      fail: any = [];

    let finRes = "";

    for (let i in selectedData) {
      results = await LDLTS002.prototype.saveData(selectedData[i]);
      // console.log('results',results);
      // console.log('results?.outBinds?.LS_OUT_FLAG',results.outBinds?.ls_out_flag);
      let tempAns = results?.outBinds?.ls_out_flag;
      if (noBatches === 1) {
        finRes = tempAns;
      }

      if (tempAns?.startsWith("Y")) {
        pass.push(selectedData[i]?.batchId);
      }
      if (tempAns?.startsWith("N")) {
        fail.push(selectedData[i]?.batchId);
      }
    }

    if (noBatches > 1) {
      if (noBatches === pass.length) {
        finRes = "Y - Success for All batches";
      } else if (noBatches === fail.length) {
        finRes = "N - Failed for All batches";
      } else {
        finRes = "Success for all batches except " + fail;
      }
    }

    // results = await LDLTS002.prototype.saveData(data);
    // let finRes = results?.outBinds?.LS_OUT_FLAG;
    return res.status(200).json({ finRes, pass, fail });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getDownMatl = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    let results = await ResponceData(
      await LDLTS002.prototype.getDownMatl(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getScrapMatl = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    let results = await ResponceData(
      await LDLTS002.prototype.getScrapMatl(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
