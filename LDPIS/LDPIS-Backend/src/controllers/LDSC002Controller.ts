import { Request, Response } from "express";
import moment from "moment";
import LDSC002 from "../models/LDSC002Model";
import { Post } from "../typed/typed";

export const getTDC = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC002.prototype.getTDC();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getParam = async (req: Request, res: Response) => {
  try {
    let tdc = req.body.tdc;
    const results: any = await LDSC002.prototype.getParam(tdc);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCastNo = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC002.prototype.getCastNo();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBatchNo = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC002.prototype.getBatchNo();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCustNoByBatch = async (req: Request, res: Response) => {
  try {
    let batchno = req.body.batchno;
    const results: any = await LDSC002.prototype.getCustNoByBatch(batchno);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getIP = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC002.prototype.getIP();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getSpecByIp = async (req: Request, res: Response) => {
  try {
    let ip = req.body.tdc;
    const results: any = await LDSC002.prototype.getSpecByIp(ip);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getInspPlan = async (req: Request, res: Response) => {
  try {
    var { ip, spec } = req.body;

    const results: any = await LDSC002.prototype.getInspPlan(ip, spec);
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

export const getSpecLimit = async (req: Request, res: Response) => {
  try {
    var { tdc, param } = req.body;

    const results: any = await LDSC002.prototype.getSpecLimit(tdc, param);
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

export const getCastTest = async (req: Request, res: Response) => {
  try {
    let castNo = req.body.castNo;

    const results: any = await LDSC002.prototype.getCastTest(castNo);
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

export const getCoilTest = async (req: Request, res: Response) => {
  try {
    var { castNo, batchNo } = req.body;

    const results: any = await LDSC002.prototype.getCoilTest(castNo, batchNo);
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

export const getBatchTest = async (req: Request, res: Response) => {
  try {
    var { castNo, batchNo } = req.body;

    const results: any = await LDSC002.prototype.getBatchTest(castNo, batchNo);
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
