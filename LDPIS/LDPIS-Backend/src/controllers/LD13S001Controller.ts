import { Request, Response } from "express";
import moment from "moment";
import LD13S001 from "../models/LD13S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD13S001.prototype.getRmList(status);
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

    const results: any = await LD13S001.prototype.getPipeNoList(
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
    if (!Array.isArray(selectedData) || selectedData.length === 0) {
      return res.status(400).json({ message: "Please select pipes to save." });
    }
    // Validate every pipe before any database write.
    const missingFieldNo = selectedData.find((data: any) => !String(data?.FIELD_NO ?? "").trim());
    if (missingFieldNo) {
      return res.status(400).json({ message: `Field No is required for Pipe No: ${missingFieldNo.BATCH_NO}.` });
    }
    selectedData.forEach((data: any) => { data.FIELD_NO = String(data.FIELD_NO).trim(); });
    let totalRowsAffected = 0;

    for (const data of selectedData) {
      let result = await LD13S001.prototype.deleteTempData(data);
      console.log("del", result);
      let result1 = await LD13S001.prototype.insertTempData(data);
      if (result1?.rowsAffected) {
        totalRowsAffected += result1.rowsAffected;
      }
      var result2: any;
      if (totalRowsAffected >= 1) {
        result2 = await LD13S001.prototype.callproc130(data);
        console.log("procedure", result2);
      }
      if (result2[0][0] == "Y") {
        let result3 = await LD13S001.prototype.deleteTempData(data);
        console.log("delete3", result3);
      }
    }
    console.log("rowsaffected130", totalRowsAffected);
    return res.status(200).json(result2);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    let data: any = req.body;
    data.PLANT = data.PLANT || "0780";
    console.log("hi");
    const results: any = await LD13S001.prototype.getFillData(data);
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

export const getTataDate = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let { prodEndDt } = req.body;
    console.log(prodEndDt);
    const results: any = await LD13S001.prototype.getTataDate(prodEndDt);
    console.log(results.rows);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

