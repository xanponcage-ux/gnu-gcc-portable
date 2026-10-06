import { Request, Response } from "express";
import LDLTS010 from "../models/LDLTS010Model";
import { ResponceData } from "./LDSM016Controller";

export const getCoils = async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const results: any = await LDLTS010.prototype.getCoils(data);

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
    var checkPass = "Y-Success for: ";
    console.log(selectedData);
    for (var i = 0; i < selectedData.length; i++) {
      var results: any = await LDLTS010.prototype.saveData(selectedData?.[i]);
      console.log(results, selectedData?.[i]?.batchId);
      var outBinds = results.outBinds.ls_out_flag;
      if (outBinds.toString().startsWith("N-")) {
        checkPass =
          "N-Failed for Batch: " +
          selectedData?.[i]?.batchId.toString() +
          " " +
          outBinds?.toString() +
          checkPass;
        break;
      }
      checkPass = checkPass + selectedData?.[i]?.batchId + ",";
    }
    console.log(checkPass);
    return res.status(200).json(checkPass);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getDownMatl = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    let results = await ResponceData(
      await LDLTS010.prototype.getDownMatl(data)
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
      await LDLTS010.prototype.getScrapMatl(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
