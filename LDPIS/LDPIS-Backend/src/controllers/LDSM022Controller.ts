import { Request, Response } from "express";
import moment from 'moment'
import FGStock from "../models/LDSM022Model";
import { Post } from "../typed/typed";


export const getFGData = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant as String;
    let upType = req.body.upType as String;
    let batch = req.body.batch as String;
    let mBatch = req.body.mBatch as String;
    let status = req.body.status as String;
    let order = req.body.order as String;
    let item = req.body.item as String;
    let Upload_Date_From = req.body.Upload_Date_From;
    let Upload_Date_To = req.body.Upload_Date_To;

    const results: any = await FGStock.prototype.getFGData(plant, upType, batch, mBatch, status, order,
      item, Upload_Date_From, Upload_Date_To)
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
export const updateFGData = async (req: Request, res: Response) => {
  try {

    var {
      selectedData, new_status, userId
    } = req.body;

    var rowsAffected: number = 0;
    for (var i in selectedData) {

      let status = selectedData[i].STATUS;
      let ORDER_ID = selectedData[i].SCO_ORDER_NO;
      let ORER_ITEM = selectedData[i].SCO_ORDER_ITEM;
      let CHARG = selectedData[i].BATCH;
      let TIME_STAMP = selectedData[i].TIME_STAMP;

      // execute query
      var results: any = await FGStock.prototype.updateFGData(status, ORDER_ID, ORER_ITEM, CHARG, TIME_STAMP, new_status);

      if (results && results.rowsAffected)
        rowsAffected += Number(results.rowsAffected);
    }

    return res.status(200).json(rowsAffected);
  }
  catch (error) {

    return res.status(400).json(error);
  }
};

export const getUploadType = async (req: Request, res: Response) => {
  try {
    //execute query
    const results: any = await FGStock.prototype.getUploadType();
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });

    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};