import { Request, Response } from "express";
import LD01S008 from "../models/LD01S008Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const getBatchDetails = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S008.prototype.getBatchDetails(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const updateStatusBtn = async (req: Request, res: Response) => {
//   try {
//     console.log("req.body: ", req?.body);
//     let selectedBatch = req?.body?.selectedData;
//     let usr = req?.body?.usr;

//     let result1;
//     let pass = [],
//       fail = [];

//     console.log("selectedBatch: ", selectedBatch);

//     for (let i = 0; i < selectedBatch.length; i++) {
//       console.log("i: ", i);
//       result1 = await LD01S008.prototype.updateStatusBtn(
//         selectedBatch[i]?.batchId,
//         usr
//       );
//       console.log("result1: ", result1);
//       if (result1 && result1?.rowsAffected > 0) {
//         pass.push(selectedBatch[i]?.batchId);
//       } else {
//         fail.push(selectedBatch[i]?.batchId);
//       }
//     }
//     return res.status(200).json({ pass, fail });
//   } catch (error) {
//     console.log("errorCont: ", error);
//     return res.status(400).json(error);
//   }
// };

export const updateStatusBtn = async (req: Request, res: Response) => {
  try {
    let selectedData = req?.body?.selectedData;
    let results: any = {};

    let noBatches = selectedData.length;
    let pass: any = [],
      fail: any = [];

    let finRes = "";

    for (let i in selectedData) {
      results = await LD01S008.prototype.updateStatusBtn(selectedData[i]);
      // console.log('results',results);
      // console.log('results?.outBinds?.LS_OUT_FLAG',results.outBinds?.LS_OUT_FLAG);
      let tempAns = results?.outBinds?.LS_OUT_FLAG;
      if (noBatches === 1) {
        finRes = tempAns;
      }

      if (tempAns?.startsWith("Y")) {
        pass.push(selectedData[i]?.batchId);
      }
      if (tempAns?.startsWith("N")) {
        fail.push(selectedData[i]?.batchId);
      }
    }
    if (noBatches > 1) {
      if (noBatches === pass.length) {
        finRes = "Y - Success for All batches";
      } else if (noBatches === fail.length) {
        finRes = "N - Failed for All batches";
      } else {
        finRes = "Success for all batches except " + fail;
      }
    }
    return res.status(200).json({ finRes, pass, fail });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
