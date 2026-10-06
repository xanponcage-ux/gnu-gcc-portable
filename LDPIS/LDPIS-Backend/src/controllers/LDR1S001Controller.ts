import { Request, Response } from "express";
import moment from "moment";
import LDR1S001 from "../models/LDR1S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LDR1S001.prototype.getRmList(status);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LDR1S001.prototype.getPipeNoList(
      rmBatch,
      status
    );
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertTempData = async (req: Request, res: Response) => {
  try {
    const selectedData = req.body?.selectedRowsData;
    let totalRowsAffected = 0;

    for (const data of selectedData) {
      let result = await LDR1S001.prototype.deleteTempData(data);
      console.log("del", result);
      let result1 = await LDR1S001.prototype.insertTempData(data);
      if (result1?.rowsAffected) {
        totalRowsAffected += result1.rowsAffected;
      }
      var result2: any;
      if (totalRowsAffected >= 1) {
        result2 = await LDR1S001.prototype.callprocR1(data);
        console.log("procedure", result2);
      }
    }

    return res.status(200).json(result2);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getMatNo = async (req: Request, res: Response) => {
  try {
    let rmBatch = req.body.RM_BATCH;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LDR1S001.prototype.getMatNo(rmBatch, pipeno);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPono = async (req: Request, res: Response) => {
  try {
    let rmBatch = req.body.RM_BATCH;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LDR1S001.prototype.getPono(rmBatch, pipeno);

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LDR1S001.prototype.getPipeInfo(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    let status = req?.body?.status;
    let rmBatch = req?.body?.RM_BATCH;
    let pipeid = req?.body?.PIPE_NO;
    const results: any = await LDR1S001.prototype.getFillData(
      rmBatch,
      status,
      pipeid
    );
    const table: any = [];
    const header: any = [];
    const columns: any = [];
    const fullData: any = [];

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

    fullData.push(columns);
    fullData.push(table);
    return res.status(200).json(fullData);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getTataDate = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let { prodEndDt } = req.body;
    console.log(prodEndDt);
    const results: any = await LDR1S001.prototype.getTataDate(prodEndDt);
    console.log(results.rows);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const insertpipedetails = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
    var errorData = "";

    var { newReworkData, parting } = req.body;

    // deleteion of temp buffer for given process and Mother Batch
    for (var i = 0; i < newReworkData.length; i++) {
      var ins_khapoli: any = await LDR1S001.prototype.insertPipeDetails(
        newReworkData,
        parting
      );
      errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
    }
    console.log(errorString);
    return res.status(200).json({ errorString });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
