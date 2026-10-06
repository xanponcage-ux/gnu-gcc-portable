import { Request, Response } from "express";
import moment from "moment";
import LDSM006 from "../models/LDSM006Model";
import { Post } from "../typed/typed";

export const getProdInqData = async (req: Request, res: Response) => {
  try {
    let Proc = req.body.Proc;
    let Batch = req.body.Batch;
    let PBatch = req.body.PBatch;
    let MBatch = req.body.MBatch;
    let OrdNo = req.body.OrdNo;
    let OrdItem = req.body.OrdItem;
    let Status = req.body.Status;
    let MatnrNo = req.body.MatnrNo;
    let QltyCd = req.body.QltyCd;
    let shift = req.body.shift;
    let ProdDateFrom = req.body.ProdDtFrom;
    let ProdDateTo = req.body.ProdDtTo;
    let millNo = req?.body?.millNo;

    const results: any = await LDSM006.prototype.getProdInqData(
      Proc,
      Batch,
      PBatch,
      MBatch,
      OrdNo,
      OrdItem,
      Status,
      MatnrNo,
      QltyCd,
      ProdDateFrom,
      ProdDateTo,
      shift,
      millNo
    );
    console.log(results);
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
