import { Request, Response } from "express";
import moment from "moment";
import LD11S001 from "../models/LD11S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD11S001.prototype.getRmList(status);
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

    const results: any = await LD11S001.prototype.getPipeNoList(
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
  const selectedData = req.body?.selectedRowsData;
  if (!Array.isArray(selectedData) || selectedData.length === 0) {
    return res.status(400).json({ message: "Please select pipes to save.", successCount: 0, failedCount: 0 });
  }
  const successfulPipes: string[] = [];
  const failedPipes: string[] = [];
  let failureMessage = "";
  for (const data of selectedData) {
    const pipe = String(data?.BATCH_NO ?? data?.PIPE_NO ?? "");
    try {
      await LD11S001.prototype.deleteTempData(data);
      const inserted = await LD11S001.prototype.insertTempData(data);
      if (!inserted?.rowsAffected) {
        failedPipes.push(pipe);
        failureMessage = `Temporary data could not be inserted for Pipe ${pipe}.`;
        break;
      }
      const result = await LD11S001.prototype.callproc110(data);
      const flag = String(result?.[0] ?? "").trim();
      if (flag.charAt(0).toUpperCase() === "Y") {
        successfulPipes.push(pipe);
        try { await LD11S001.prototype.deleteTempData(data); }
        catch (cleanupError) { console.error("Saved pipe; temporary cleanup failed", cleanupError); }
      } else {
        failedPipes.push(pipe);
        failureMessage = `Pipe ${pipe}: ${flag || "Procedure did not return a success flag."}`;
        break;
      }
    } catch (error: any) {
      failedPipes.push(pipe);
      failureMessage = `Pipe ${pipe}: ${error?.message || "Save failed."}`;
      break;
    }
  }
  const successCount = successfulPipes.length;
  const failedCount = failedPipes.length;
  const pendingCount = selectedData.length - successCount - failedCount;
  const message = failedCount
    ? `Successfully saved ${successCount} pipe(s). Failed: ${failedCount}. Not processed: ${pendingCount}. ${failureMessage}`
    : `Successfully saved ${successCount} pipe(s).`;
  return res.status(200).json({ message, successCount, failedCount, pendingCount, successfulPipes, failedPipes });
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    // accept whole request body as data object to match LD08 pattern
    let data = req.body;
    console.log("hi");
    const results: any = await LD11S001.prototype.getFillData(data);
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

export const getTataDate = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let { prodEndDt } = req.body;
    console.log(prodEndDt);
    const results: any = await LD11S001.prototype.getTataDate(prodEndDt);
    console.log(results.rows);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

