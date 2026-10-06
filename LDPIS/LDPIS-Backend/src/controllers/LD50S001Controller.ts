import { Request, Response } from "express";
import { LD50S001Modal } from "../models/LD50S001";

export const LD50S001Api = (req: Request, res: Response) => {
  try {
    LD50S001Modal(req, res);
  } catch (error: any) {
    console.log("error:", error);
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};

export const SaveProcedure003 = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let results: any = {};
    for (let i in data) {
      let singleData = data[i];
      let result1: any = await LD50S001Modal.prototype.SaveProcedure003(
        singleData
      );
      let outBinds = result1.outBinds.ls_message;

      results = outBinds;
    }

    return res.status(200).json(results);
  } catch (error: any) {
    console.log("error", error);
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};

import LD50S001Model from "../models/LD50S001Model";

export const LD50S001SaveLDS003 = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("Controller");
    var checkPass = "Y";
    let results: any = {};
    for (let i in data) {
      let singleData = data[i];
      let result1: any = await LD50S001Model.prototype.LD50S001SaveLDS003(
        singleData
      );
      console.log(result1);
      //   let outBinds = result1.outBinds.ls_message;

      //   results = outBinds;
      var outBinds = result1.outBinds.LS_OUT_FLAG;
      if (outBinds.toString().startsWith("N-")) {
        checkPass = outBinds.toString();
        break;
      }
    }
    console.log(checkPass);
    return res.status(200).json(checkPass);
  } catch (error: any) {
    console.log("error", error);
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};


export const getRawMaterialData = async (req: Request, res: Response) => {
  try {

     console.log("controllerraw",req.body)
      let batchId = req.body.batchId;
      let tdc = req.body.tdc;
      let widthFrm = req.body.widthFrm;
      let widthTo = req.body.widthTo;
      let thkFrm = req.body.thkFrm;
      let thkTo = req.body.thkTo;
      let Status = req.body.Status;
      let Plant = req.body.Plant;
      //console.log("hi")
      const results: any = await LD50S001Model.prototype.getRawMaterialData(batchId,tdc,widthFrm,widthTo,thkFrm,thkTo,Status,Plant);      
      const table: any = [];
      const header: any = [];
      const columns: any = [];
      //const fullData: any = [];

      for (let i = 0; i < results.metaData.length; i++) {
          header.push((results.metaData[i].name as string).replace(/ /g, ''))
      }
      for (let i = 0; i < results.metaData.length; i++) {
          var obj: any = {};
          obj.title = (results.metaData[i].name as string);
          obj.field = header[i];
          columns.push(obj)
      }
      for (let i = 0; i < results.rows.length; i++) {
          const arr = results.rows[i];
          var jsonObj: any = {};
          header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
          table.push(jsonObj)
      }
      return res.status(200).json(table);
  } catch (error) {
      return res.status(400).json(error);
  }
};
