import { Request, Response } from "express";
import moment from "moment";
import LD12S001 from "../models/LD12S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD12S001.prototype.getRmList(status);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getLabTestList = async (req: Request, res: Response) => {
  try {
    // let status = req.body.;
    const results: any = await LD12S001.prototype.getLabTestList(req?.body);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFieldTestList = async (req: Request, res: Response) => {
  try {
    // let status = req.body.status;
    const results: any = await LD12S001.prototype.getFieldTestList(req?.body);
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

    const results: any = await LD12S001.prototype.getPipeNoList(
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

    // Track successful and failed batches
    const successBatches: string[] = [];
    const failedBatches: string[] = [];

    let totalRowsAffected = 0;
    let totalRowsAffectedLab = 0;
    let totalRowsAffectedField = 0;

    let labTestCount = 0;
    let fieldTestCount = 0;

    let procedureFailureMessage = "";

    console.log("req.body =>", req.body);

    // Validate request data
    if (!Array.isArray(selectedData) || selectedData.length === 0) {
      return res.status(200).json({
        message: "No selected row data was received.",
        successCount: 0,
        failedCount: 0,
      });
    }

    const parseCsvValues = (value: string | null | undefined): string[] => {
      if (!value) {
        return [];
      }

      return String(value)
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
    };

    for (const data of selectedData) {
      const currentBatch = String(data?.BATCH_NO || "").trim();

      console.log("Processing Batch =>", currentBatch);

      /*
       * STEP 1:
       * Pass the complete current row to the model function.
       *
       * The model function must return:
       * "YES" when repetition exists.
       * "NO" when repetition does not exist.
       */
      const verificationResult =
        await LD12S001.prototype.verifyProdDateRepetition(data);

      console.log("verifyProdDateRepetition =>", verificationResult);

      const repetitionStatus = String(verificationResult || "")
        .trim()
        .toUpperCase();

      /*
       * If production-date repetition is found,
       * stop processing immediately and return the
       * response in the original API format.
       */
      if (repetitionStatus === "YES") {
        failedBatches.push(currentBatch);

        const repetitionMessage =
          `For current Batch ${currentBatch}, ` +
          `record for 120 already exists with the given Production Date.`;

        const successCount = successBatches.length;
        const failedCount = failedBatches.length;

        const finalOutput = `
          ${repetitionMessage}
          Successful Batches (${successCount}): ${successBatches.join(", ")}
          Failed Batches (${failedCount}): ${failedBatches.join(", ")}
        `.trim();

        console.log("Production Date repetition found =>", finalOutput);

        return res.status(200).json({
          message: finalOutput,
          successCount,
          failedCount,
        });
      }

      /*
       * Optional safeguard:
       * Do not continue if the model returns anything
       * other than YES or NO.
       */
      if (repetitionStatus !== "NO") {
        failedBatches.push(currentBatch);

        const verificationFailureMessage =
          `Unable to verify Production Date repetition ` +
          `for Batch ${currentBatch}. ` +
          `verifyProdDateRepetition returned: ` +
          `${JSON.stringify(verificationResult)}`;

        const successCount = successBatches.length;
        const failedCount = failedBatches.length;

        const finalOutput = `
          ${verificationFailureMessage}
          Successful Batches (${successCount}): ${successBatches.join(", ")}
          Failed Batches (${failedCount}): ${failedBatches.join(", ")}
        `.trim();

        console.log("Invalid verification response =>", finalOutput);

        return res.status(200).json({
          message: finalOutput,
          successCount,
          failedCount,
        });
      }

      /*
       * STEP 2:
       * No repetition found. Delete temporary data.
       */
      const deleteResult = await LD12S001.prototype.deleteTempData(data);

      console.log("delete temp =>", deleteResult);

      /*
       * STEP 3:
       * Insert temporary data.
       */
      const tempInsertResult = await LD12S001.prototype.insertTempData(data);

      console.log("insert temp =>", tempInsertResult);

      const currentTempRowsAffected = Number(
        tempInsertResult?.rowsAffected || 0
      );

      if (currentTempRowsAffected > 0) {
        totalRowsAffected += currentTempRowsAffected;
      }

      console.log(
        "after insert temp =>",
        totalRowsAffected,
        "Batch Scrap Weight:",
        data?.BATCH_SCRAP_WEIGHT
      );

      /*
       * If the current row was not inserted into the
       * temporary table, do not call the procedure.
       */
      if (currentTempRowsAffected < 1) {
        failedBatches.push(currentBatch);

        procedureFailureMessage =
          `Temporary data could not be inserted ` +
          `for Batch ${currentBatch}.`;

        break;
      }

      /*
       * STEP 4:
       * Call callproc120 before inserting Lab or Field tests.
       */
      const procedureResult = await LD12S001.prototype.callproc120(data);

      console.log("procedure =>", procedureResult);

      /*
       * Original procedure success condition:
       * result[0][0] must be Y.
       */
      const procedureStatus = String(procedureResult?.[0]?.[0] || "")
        .trim()
        .toUpperCase();

      if (procedureStatus !== "Y") {
        procedureFailureMessage = `Procedure Failure Details: ${JSON.stringify(
          procedureResult?.[0]
        )}`;

        failedBatches.push(currentBatch);

        /*
         * Stop further processing.
         * Lab and Field tests will not be inserted.
         */
        break;
      }

      /*
       * STEP 5:
       * callproc120 succeeded.
       * Only now insert Lab tests.
       */
      const labTests = parseCsvValues(data?.LAB_TST);

      let currentBatchLabFailed = false;

      for (const labTest of labTests) {
        console.log("LAB TEST =>", currentBatch, labTest);

        const resultLab = await LD12S001.prototype.insertLAB(
          data.BATCH_NO,
          data.PROD_DATE,
          data.SHIFT,
          labTest
        );

        console.log("insert LAB result =>", resultLab);

        labTestCount += 1;

        const labRowsAffected = Number(resultLab?.rowsAffected || 0);

        if (labRowsAffected > 0) {
          totalRowsAffectedLab += labRowsAffected;
        } else {
          procedureFailureMessage =
            `Lab Test ${labTest} could not be inserted ` +
            `for Batch ${currentBatch}.`;

          failedBatches.push(currentBatch);
          currentBatchLabFailed = true;
          break;
        }
      }

      /*
       * Stop the main loop when a Lab Test insert fails.
       * Field Test insertion will not happen for this batch.
       */
      if (currentBatchLabFailed) {
        break;
      }

      /*
       * STEP 6:
       * Procedure succeeded and all Lab inserts succeeded.
       * Now insert Field tests.
       */
      const fieldTests = parseCsvValues(data?.FLD_TEST);

      let currentBatchFieldFailed = false;

      for (const fieldTest of fieldTests) {
        console.log("FIELD TEST =>", currentBatch, fieldTest);

        const resultField = await LD12S001.prototype.insertField(
          data.BATCH_NO,
          data.PROD_DATE,
          data.SHIFT,
          fieldTest
        );

        console.log("insert FIELD result =>", resultField);

        fieldTestCount += 1;

        const fieldRowsAffected = Number(resultField?.rowsAffected || 0);

        if (fieldRowsAffected > 0) {
          totalRowsAffectedField += fieldRowsAffected;
        } else {
          procedureFailureMessage =
            `Field Test ${fieldTest} could not be inserted ` +
            `for Batch ${currentBatch}.`;

          failedBatches.push(currentBatch);
          currentBatchFieldFailed = true;
          break;
        }
      }

      /*
       * Stop the main loop when a Field Test insert fails.
       */
      if (currentBatchFieldFailed) {
        break;
      }

      /*
       * STEP 7:
       * Current batch completed successfully.
       *
       * This happens only after:
       * 1. verifyProdDateRepetition returned NO.
       * 2. Temp data was inserted.
       * 3. callproc120 returned Y.
       * 4. All Lab tests were inserted.
       * 5. All Field tests were inserted.
       */
      successBatches.push(currentBatch);

      console.log("Batch successfully completed =>", currentBatch);

      // Optional cleanup after complete success:
      //
      // const deleteAfterProc =
      //   await LD12S001.prototype.deleteTempData(data);
      //
      // console.log(
      //   "delete after proc =>",
      //   deleteAfterProc
      // );
    }

    /*
     * STEP 8:
     * Prepare response in the original format.
     */
    const successCount = successBatches.length;
    const failedCount = failedBatches.length;

    const finalOutput = `
      ${procedureFailureMessage}
      Successful Batches (${successCount}): ${successBatches.join(", ")}
      Failed Batches (${failedCount}): ${failedBatches.join(", ")}
    `.trim();

    console.log("Final Output:", finalOutput);

    console.log("Temp rows affected =>", totalRowsAffected);

    console.log("Lab Test Count =>", labTestCount);

    console.log("Lab rows affected =>", totalRowsAffectedLab);

    console.log("Field Test Count =>", fieldTestCount);

    console.log("Field rows affected =>", totalRowsAffectedField);

    return res.status(200).json({
      message: finalOutput,
      successCount,
      failedCount,
    });
  } catch (error: any) {
    console.error("insertTempData error =>", error);

    return res.status(400).json({
      message: `Error: ${error?.message || error}`,
      successCount: 0,
      failedCount: 0,
    });
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    let data: any = req.body;
    data.PLANT = data.PLANT || "0780";
    const results: any = await LD12S001.prototype.getFillData(data);
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
    const results: any = await LD12S001.prototype.getTataDate(prodEndDt);
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

    const results: any = await LD12S001.prototype.getCoatWt(
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
