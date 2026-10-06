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
  try {
    const selectedData = req.body?.selectedRowsData || [];

    let successBatches: string[] = [];
    let failedBatches: string[] = [];
    let totalRowsAffected = 0;
    let totalRowsAffectedScrap = 0;
    let scrapCount = 0;
    let totalRowsAffectedLab = 0;
    let labTestCount = 0;
    let totalRowsAffectedField = 0;
    let fieldTestCount = 0;
    let procedureFailureMessage = "";

    console.log("req.body =>", req.body);

    const parseCsvValues = (value: string | null | undefined): string[] => {
      if (!value) return [];
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
    };

    for (const data of selectedData) {
      const result = await LD16S001.prototype.deleteTempData(data);
      console.log("delete temp =>", result);

      const result1 = await LD16S001.prototype.insertTempData(data);
      console.log("insert temp =>", result1);

      if (result1?.rowsAffected) {
        totalRowsAffected += result1.rowsAffected;
      }

      if (data?.BATCH_SCRAP_WEIGHT > 0) {
        scrapCount += 1;
        let resultScrap = await LD16S001.prototype.insertScrapTempData(data);
        if (resultScrap?.rowsAffected) {
          totalRowsAffectedScrap += resultScrap.rowsAffected;
        }
        console.log("result scrap", resultScrap);
      }

      const labTests = parseCsvValues(data.LAB_TST);
      if (labTests.length > 0) {
        for (const labTest of labTests) {
          const resultLab = await LD16S001.prototype.insertLAB(
            data.BATCH_NO,
            data.PROD_DATE,
            data.SHIFT,
            labTest
          );

          if (resultLab?.rowsAffected) {
            totalRowsAffectedLab += resultLab.rowsAffected;
          }
        }
        labTestCount += labTests.length;
      }

      const fieldTests = parseCsvValues(data.FLD_TEST);
      if (fieldTests.length > 0) {
        for (const fieldTest of fieldTests) {
          const resultField = await LD16S001.prototype.insertField(
            data.BATCH_NO,
            data.PROD_DATE,
            data.SHIFT,
            fieldTest
          );

          if (resultField?.rowsAffected) {
            totalRowsAffectedField += resultField.rowsAffected;
          }
        }
        fieldTestCount += fieldTests.length;
      }

      let result2: any;
      const scrapCondition =
        scrapCount === 0 || scrapCount === totalRowsAffectedScrap;
      const labCondition =
        labTestCount === 0 || labTestCount === totalRowsAffectedLab;
      const fieldCondition =
        fieldTestCount === 0 || fieldTestCount === totalRowsAffectedField;

      if (
        totalRowsAffected >= 1 &&
        scrapCondition &&
        labCondition &&
        fieldCondition
      ) {
        result2 = await LD16S001.prototype.callproc120(data);
        console.log("procedure =>", result2);

        if (result2?.[0]?.[0] !== "Y") {
          procedureFailureMessage = `Procedure Failure Details: ${JSON.stringify(
            result2?.[0]
          )}`;
          failedBatches.push(data.BATCH_NO);
          break;
        }

        successBatches.push(data.BATCH_NO);
      } else {
        failedBatches.push(data.BATCH_NO);
      }
    }

    const successCount = successBatches.length;
    const failedCount = failedBatches.length;
    const finalOutput = `
      ${procedureFailureMessage}
      Successful Batches (${successCount}): ${successBatches.join(", ")}
      Failed Batches (${failedCount}): ${failedBatches.join(", ")}
    `.trim();

    console.log("Final Output:", finalOutput);
    console.log("rowsaffected120 =>", totalRowsAffected);

    return res.status(200).json({
      message: finalOutput,
      successCount,
      failedCount,
    });
  } catch (error: any) {
    console.error("insertTempData error =>", error);
    return res.status(400).json({
      message: `Error: ${error.message || error}`,
      successCount: 0,
      failedCount: 0,
    });
  }
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
