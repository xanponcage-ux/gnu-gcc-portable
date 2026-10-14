import { Request, Response } from "express";
import moment from "moment";
import LD16S001 from "../models/LD16S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD16S001.prototype.getRmList(status);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getLabTestList = async (req: Request, res: Response) => {
  try {
    const results: any = await LD16S001.prototype.getLabTestList(req?.body);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFieldTestList = async (req: Request, res: Response) => {
  try {
    const results: any = await LD16S001.prototype.getFieldTestList(req?.body);
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

    const results: any = await LD16S001.prototype.getPipeNoList(
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
    return res.status(400).json({
      message: "Please select pipes to save.", successCount: 0, failedCount: 0,
      pendingCount: 0, successfulPipes: [], failedPipes: [],
    });
  }
  // Reject all selected rows before the first write if any internal field number is blank.
  const invalidRow = selectedData.find((data: any) => !String(data?.TBP_FIELDNO_INT_160 ?? "").trim());
  if (invalidRow) {
    return res.status(400).json({
      message: `Internal Field No is required for Pipe No: ${invalidRow.BATCH_NO}.`,
      successCount: 0, failedCount: 0, pendingCount: selectedData.length,
      successfulPipes: [], failedPipes: [],
    });
  }
  selectedData.forEach((data: any) => {
    data.TBP_FIELDNO_INT_160 = String(data.TBP_FIELDNO_INT_160).trim();
  });
  const successfulPipes: string[] = [];
  const failedPipes: string[] = [];
  let failureMessage = "";
  for (const data of selectedData) {
    const pipe = String(data?.BATCH_NO ?? "");
    try {
      await LD16S001.prototype.deleteTempData(data);
      const inserted = await LD16S001.prototype.insertTempData(data);
      if (!inserted?.rowsAffected) {
        failedPipes.push(pipe);
        failureMessage = `Temporary data could not be inserted for Pipe ${pipe}.`;
        break;
      }
      // Preserve the existing scrap/lab/field-before-procedure order, checking THIS pipe only.
      if (Number(data.BATCH_SCRAP_WEIGHT || 0) > 0) {
        const scrap = await LD16S001.prototype.insertScrapTempData(data);
        if (!scrap?.rowsAffected) {
          failedPipes.push(pipe);
          failureMessage = `Scrap data could not be inserted for Pipe ${pipe}.`;
          break;
        }
      }
      const parseTests = (value: any): string[] => String(value ?? "").split(",").map(v => v.trim()).filter(Boolean);
      let testFailure = "";
      for (const test of parseTests(data.LAB_TST)) {
        const result = await LD16S001.prototype.insertLAB(data.BATCH_NO, data.PROD_DATE, data.SHIFT, test);
        if (!result?.rowsAffected) { testFailure = `Lab test ${test}`; break; }
      }
      if (!testFailure) {
        for (const test of parseTests(data.FLD_TEST)) {
          const result = await LD16S001.prototype.insertField(data.BATCH_NO, data.PROD_DATE, data.SHIFT, test);
          if (!result?.rowsAffected) { testFailure = `Field test ${test}`; break; }
        }
      }
      if (testFailure) {
        failedPipes.push(pipe);
        failureMessage = `${testFailure} could not be inserted for Pipe ${pipe}.`;
        break;
      }
      const result = await LD16S001.prototype.callproc120(data);
      const flag = String(result?.[0] ?? "").trim();
      if (flag.charAt(0).toUpperCase() === "Y") {
        successfulPipes.push(pipe);
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
    const data = req.body || {};
    // ensure defaults used by repository
    data.PLANT = data.PLANT ? data.PLANT : "0780";

    console.log("hi");
    const results: any = await LD16S001.prototype.getFillData(data);

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
    const results: any = await LD16S001.prototype.getTataDate(prodEndDt);
    console.log(results.rows);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getCoatWt = async (req: Request, res: Response) => {
  try {
    let W1 = req.body.W1;
    let W2 = req.body.W2;
    let W3 = req.body.W3;
    let W4 = req.body.W4;
    let W5 = req.body.W5;
    let W6 = req.body.W6;
    let W7 = req.body.W7;
    let W8 = req.body.W8;
    let W9 = req.body.W9;
    let W10 = req.body.W10;
    let W11 = req.body.W11;
    let W12 = req.body.W12;

    let OD = req.body.OD;
    let LENGTH = req.body.LENGTH;

    const results: any = await LD16S001.prototype.getCoatWt(
      W1,
      W2,
      W3,
      W4,
      W5,
      W6,
      W7,
      W8,
      W9,
      W10,
      W11,
      W12,
      LENGTH,
      OD
    );
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};
