import { Request, Response } from "express";
import LD09S001 from "../models/LD09S001Model";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD09S001.prototype.getRmList(status);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LD09S001.prototype.getPipeNoList(
      rmBatch,
      status
    );
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertTempData = async (req: Request, res: Response) => {
  try {
    const selectedData = req.body?.selectedRowsData;
    let totalRowsAffected = 0;

    console.log("selectedData: ", selectedData);

    for (const data of selectedData) {
      console.log("deleteTempData");
      let result = await LD09S001.prototype.deleteTempData(data);
      console.log("del", result);
      console.log("insertTempData");
      let result1 = await LD09S001.prototype.insertTempData(data);
      if (result1?.rowsAffected) {
        totalRowsAffected += result1.rowsAffected;
      }
      var result2: any;
      if (totalRowsAffected >= 1) {
        result2 = await LD09S001.prototype.callproc90(data);
        //console.log("procedure",result2)
      }
      if (result2[0][0] == "Y") {
        let result3 = await LD09S001.prototype.deleteTempData(data);
        console.log("delete3", result3);
      }
    }

    return res.status(200).json(result2);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getTataDate = async (req: Request, res: Response) => {
  try {
    let { prodEndDt } = req.body;
    const results: any = await LD09S001.prototype.getTataDate(prodEndDt);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    // Accept request body as a single data object and forward to model
    const results: any = await LD09S001.prototype.getFillData(req.body);
    const table: any = [];
    const header: any = [];
    const columns: any = [];
    //const fullData: any = [];

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

export const getPono = async (req: Request, res: Response) => {
  try {
    let rmBatch = req.body.RM_BATCH;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD09S001.prototype.getPono(rmBatch, pipeno);

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMatNo = async (req: Request, res: Response) => {
  try {
    let rmBatch = req.body.RM_BATCH;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD09S001.prototype.getMatNo(rmBatch, pipeno);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getnxtproc = async (req: Request, res: Response) => {
  try {
    let currproc = req.body.CURR_PROC;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD09S001.prototype.getnxtproc(pipeno);
    console.log("nxtproc result", results?.rows[0][0]);
    let Planned_proc = results?.rows[0][0];
    let Passed_proc = results?.rows[0][1];
    const result2 = await LD09S001.prototype.callfunction(
      Planned_proc,
      Passed_proc,
      currproc
    );

    return res.status(200).json(await ResponceData(result2));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD09S001.prototype.getOrderDetails(pipeno);

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};
