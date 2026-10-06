import { Request, Response } from "express";
import moment from "moment";
import LD01S003 from "../models/LD01S003Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD01S003.prototype.getRmList(status);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LD01S003.prototype.getPipeNoList(
      rmBatch,
      status
    );
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
    const results: any = await LD01S003.prototype.getFillData(
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

export const confirm = async (req: Request, res: Response) => {
  try {
    // console.log("Confirm-req.body: ", req.body);
    let recvData = {
      newDataHold: req?.body?.newDataHold,
      process: req?.body?.process,
      inspector: req?.body?.inspector,
    };
    //let dt=req.body;
    var checkPass = "Y";
    for (var i = 0; i < recvData?.newDataHold.length; i++) {
      //initalize variables

      var results: any = await LD01S003.prototype.confirm(
        recvData?.newDataHold?.[i],
        recvData?.process,
        recvData?.inspector
      );
      // console.log("results-confirm: ", results);
      var outBinds = results.outBinds.LS_OUT_FLAG;
      if (outBinds.toString().startsWith("N-")) {
        checkPass = outBinds.toString();
        break;
      }
    }
    return res.status(200).json(checkPass);
    //return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
