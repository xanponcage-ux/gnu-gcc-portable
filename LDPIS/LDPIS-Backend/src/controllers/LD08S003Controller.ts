import { Request, Response } from "express";
import LD08S003 from "../models/LD08S003Model";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let mill = req.body.mill;
    const results: any = await LD08S003.prototype.getRmList('', mill);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;
    let mill = req.body.mill;

    const results: any = await LD08S003.prototype.getPipeNoList(
      rmBatch,
      status,
      mill
    );
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertTempData = async (req: Request, res: Response) => {
  try {
    const selectedData = req.body?.selectedRowsData;
    let scrapCount = 0;
    //console.log("selectedData: ", selectedData);

    for (const data of selectedData) {
      let varData = { ...data, TBP_UPDATED_BY: req.user };
      const vdata = await LD08S003.prototype.deleteTempData(varData);
      let varUpdate = true;
      let varMsg: any = ''
      let resultScrap: any;
      try {
        if (data?.BATCH_SCRAP_WEIGHT > 0) {
          scrapCount += 1;
          resultScrap = await LD08S003.prototype.insertScrapTempData(varData);
          if (resultScrap?.outBinds?.ls_out_flag?.substr(0, 1) === "Y") {
            varUpdate = true;
          } else {
            varUpdate = false;
            varMsg = resultScrap?.outBinds?.ls_out_flag
          }
        }
      } catch (e: any) {
        varUpdate = false;
        varMsg = e?.toString();
      }
      if (varUpdate) {
        let result1 = await LD08S003.prototype.insertTempData(varData);
        return res.status(200).json({ message: result1?.rowsAffected ? 'Updated!' : 'Not Updated!' });
      } else {
        return res.status(400).json({ message: varMsg?.length > 0 ? varMsg : 'error' })
      }
    }
  } catch (error: any) {
    console.log('error'+ error?.toString())
    return res.status(400).json(error?.toString());
  }
};

// export const insertTempData = async (req: Request, res: Response) => {
//   try {
//     console.log("Helloooooo 74");
//     const selectedData = req.body?.selectedRowsData;

//     // Initialize variables for tracking success and failure batches
//     let successBatches: string[] = [];
//     let failedBatches: string[] = [];
//     let totalRowsAffected = 0;
//     let totalRowsAffectedScrap = 0;
//     let scrapCount = 0;
//     let procedureFailureMessage = "";

//     for (const data of selectedData) {
//       // Step 1: Delete temporary data

//       // Step 2: Insert temporary data
//       let varData = {...data, TBP_UPDATED_BY: req.user}; 
//       let result1 = await LD08S003.prototype.insertTempData(varData);
//       if (result1?.rowsAffected) {
//         successBatches.push(data.TBP_BATCH_NO);
//         totalRowsAffected += result1.rowsAffected;
//       } else {
//         failedBatches.push(data.TBP_BATCH_NO);
//       }
//     }
//     // Step 6: Prepare final response variables
//     const successCount = successBatches.length;
//     const failedCount = failedBatches.length;
//     const finalOutput = `
//       ${procedureFailureMessage}
//       Successful Batches (${successCount}): ${successBatches.join(", ")}
//       Failed Batches (${failedCount}): ${failedBatches.join(", ")}
//     `.trim();

//     // //DUMMY FOR CHECK
//     // const dummyOutput =
//     //   `Procedure Failure Details: {"errorCode": "LD08-PRO-001", "message": "Constraint violation on material type. Transaction rolled back."}
//     //   Successful Batches (3): BATCH001, BATCH003, BATCH005
//     //   Failed Batches (3): BATCH002, BATCH004, BATCH006
//     //   `.trim();
//     // return res.status(200).json({
//     //   message: dummyOutput,
//     //   successCount: 3,
//     //   failedCount: 3,
//     // });
//     // Response object containing both string and counts
//     return res.status(200).json({
//       message: finalOutput,
//       successCount,
//       failedCount,
//     });
//   } catch (error: any) {
//     console.error("Error:", error);
//     return res.status(400).json({
//       message: `Error: ${error.message || error}`,
//       successCount: 0,
//       failedCount: 0,
//     });
//   }
// };

export const getTataDate = async (req: Request, res: Response) => {
  try {
    let { prodEndDt } = req.body;
    const results: any = await LD08S003.prototype.getTataDate(prodEndDt);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const execQueryScreenAccess = async (req: Request, res: Response) => {
  try {
    const results: any = await LD08S003.prototype.execQueryScreenAccess(req.user);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    // let rmBatch = req.body.RM_BATCH;
    // let pipeno = req.body.PIPE_NO;
    // let status = req.body.STATUS;
    // let ORDNO = req.body.ORDNO;
    // let ORDITEM = req.body.ORDITEM;

    const results: any = await LD08S003.prototype.getFillData(req.body, req.user);
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
    const results: any = await LD08S003.prototype.getPono(rmBatch, pipeno);

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMatNo = async (req: Request, res: Response) => {
  try {
    let rmBatch = req.body.RM_BATCH;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD08S003.prototype.getMatNo(rmBatch, pipeno);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getnxtproc = async (req: Request, res: Response) => {
  try {
    let currproc = req.body.CURR_PROC;
    let pipeno = req.body.PIPE_NO;
    const results: any = await LD08S003.prototype.getnxtproc(pipeno);
    console.log("nxtproc result", results?.rows[0][0]);
    let Planned_proc = results?.rows[0][0];
    let Passed_proc = results?.rows[0][1];
    const result2 = await LD08S003.prototype.callfunction(
      Planned_proc,
      Passed_proc,
      currproc
    );

    return res.status(200).json(await ResponceData(result2));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const validateDataMill80 = async (req: Request, res: Response) => {
  try {
    const results: any = await LD08S003.prototype.validateDataMill80(req.body);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
