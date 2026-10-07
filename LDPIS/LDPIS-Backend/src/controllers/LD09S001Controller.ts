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
      await LD09S001.prototype.deleteTempData(data);
      const inserted = await LD09S001.prototype.insertTempData(data);
      if (!inserted?.rowsAffected) {
        failedPipes.push(pipe);
        failureMessage = `Temporary data could not be inserted for Pipe ${pipe}.`;
        break;
      }
      const result = await LD09S001.prototype.callproc90(data);
      const flag = String(result?.[0] ?? "").trim();
      if (flag.charAt(0).toUpperCase() === "Y") {
        successfulPipes.push(pipe);
        try { await LD09S001.prototype.deleteTempData(data); }
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

