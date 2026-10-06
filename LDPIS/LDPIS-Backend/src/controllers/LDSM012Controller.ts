import { Request, Response } from "express";
import moment from "moment";
import LDSM012 from "../models/LDSM012Model";
import { Post } from "../typed/typed";

export const getInventoryData = async (req: Request, res: Response) => {
  try {
    var {
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType,
      millNo,
    } = req.body;

    const results: any = await LDSM012.prototype.getInventoryData(
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType,
      millNo
    );
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
    //  fullData.push(columns);
    //  fullData.push(table);

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMergedInv = async (req: Request, res: Response) => {
  try {
    var { fromDt, mergedType, plant, toDt, batchMerg, mergedBatchMerg } =
      req.body;

    const results: any = await LDSM012.prototype.getMergedInv(
      fromDt,
      mergedType,
      plant,
      toDt,
      batchMerg,
      mergedBatchMerg
    );
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
    //  fullData.push(columns);
    //  fullData.push(table);

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOdiaFrm = async (req: Request, res: Response) => {
  try {
    var plant = req.body.plant;

    const results: any = await LDSM012.prototype.getOdiaFrm(plant);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });

    //response
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOdiaTo = async (req: Request, res: Response) => {
  try {
    var plant = req.body.plant;

    const results: any = await LDSM012.prototype.getOdiaTo(plant);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });

    //response
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getReversedBatchInfo = async (req: Request, res: Response) => {
  try {
    var { plant, batchId, mergeBatch } = req.body;

    const results: any = await LDSM012.prototype.getReversedBatchInfo(
      plant,
      batchId,
      mergeBatch
    );
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
