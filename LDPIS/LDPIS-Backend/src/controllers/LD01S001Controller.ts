import { Request, Response } from "express";
import moment from "moment";
import LD01S001 from "../models/LD01S001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD01S001.prototype.getRmList(status);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const getorderwiseProdData = async (req: Request, res: Response) => {
//   try {
//     let RM_BATCH = req.body.RM_BATCH;
//     const results: any = await LD01S001.prototype.getorderwiseProdData(RM_BATCH);
//     console.log(results);
//     console.log(await ResponceData(results));
//     return res.status(200).json(await ResponceData(results));
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// export const LD01S001HoldReason = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LD01S001.prototype.LD01S001HoldReason();
//     console.log(results);
//     console.log(await ResponceData(results));
//     return res.status(200).json(await ResponceData(results));
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getorderwiseProdData = async (req: Request, res: Response) => {
  try {
    let RM_BATCH = req.body.RM_BATCH;

    // Fetch orderwise production data
    const orderwiseResults: any = await LD01S001.prototype.getorderwiseProdData(
      RM_BATCH
    );
    const processedOrderwiseResults = await ResponceData(orderwiseResults);

    // Fetch hold reason data
    const holdReasonResults: any =
      await LD01S001.prototype.LD01S001HoldReason();
    const processedHoldReasonResults = await ResponceData(holdReasonResults);

    // Combine both results into an array
    const combinedResults = {
      orderwiseData: processedOrderwiseResults,
      holdReasonData: processedHoldReasonResults,
    };

    console.log(combinedResults);
    return res.status(200).json(combinedResults);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getScrapProductionTable = async (req: Request, res: Response) => {
  try {
    let results = await LD01S001.prototype.getScrapProductionTable(req?.body);

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTataDate = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let { prodEndDt } = req.body;
    console.log(prodEndDt);
    const results: any = await LD01S001.prototype.getTataDate(prodEndDt);
    console.log(results.rows);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getPipeId = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S001.prototype.getPipeId(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    // let id = req.body.adid;
    const results: any = await LD01S001.prototype.getSchedules(req?.body);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeWeight = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S001.prototype.getPipeWeight(req.body);
    // console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertCoilDetails = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
    var uom = "";
    var errorData = "";

    var {
      newDataPrime,
      newDataSched,
      newDataScrap,
      prdPStartDt,
      prdPEndDt,
      matNo,
    } = req.body;

    // Parse the start and end dates properly from the newData array
    const formatDate = (date: Date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}/${m}/${y} ${h}:${min}`;
    };
    // console.log(prdPStartDt, prdPEndDt);
    let startDate = new Date(prdPStartDt);
    let endDate = new Date(prdPEndDt);

    // Calculate total duration and interval duration
    const totalDuration = endDate.getTime() - startDate.getTime();
    const intervalDuration = totalDuration / newDataPrime.length;

    let currentStart = startDate;
    var durResult: any = await LD01S001.prototype.LD01S001Duration("Hello");
    // console.log("duration allowed", durResult, durResult.rows[0][0]);
    const maxDuration = durResult.rows[0][0];
    for (let i = 0; i < newDataPrime.length; i++) {
      // Set start and end times
      newDataPrime[i].prdPStartDt = formatDate(currentStart);
      const currentEnd = new Date(currentStart.getTime() + intervalDuration);
      newDataPrime[i].prdPEndDt = formatDate(currentEnd);

      // Calculate the duration for the current record
      const duration = currentEnd.getTime() - currentStart.getTime();
      const resultInMinutes = Math.round(duration / 60000);
      // console.log(resultInMinutes);

      // Validation checks
      if (resultInMinutes > maxDuration) {
        errorString = `N-Maximum activity duration should not exceed ${maxDuration} minutes.`;
        console.log("Hello exceed");
        return res.status(200).json({ errorString });
      }
      // Update currentStart for next iteration
      currentStart = currentEnd;
      // Update currentStart for next iteration
      currentStart = currentEnd;
    }
    // console.log(newDataPrime);
    // deleteion of temp buffer for given process and Mother Batch
    var resDel: any = await LD01S001.prototype.delete_tempprod(newDataPrime);
    for (var i = 0; i < newDataPrime.length; i++) {
      var fg = "FG";
      var results: any = await LD01S001.prototype.LD01S001_TEMP_Insert(
        newDataPrime[i],
        newDataScrap[0],
        "PRIME",
        matNo
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          "N-Error for batch Prime " +
          newDataPrime[i].PIPEID +
          " -- " +
          flag.toString().replace("N-", "");
      }
    }
    for (var i = 0; i < newDataScrap.length; i++) {
      var scrap = "SCRAP";

      var results: any = await LD01S001.prototype.LD01S001_TEMP_Insert(
        newDataPrime[0],
        newDataScrap[i],
        "SCRP",
        matNo
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          " Error for batch Scrap" +
          newDataScrap[i].SCRAP_BATCH_ID +
          " -- " +
          flag.toString().replace("N-", "");
      }
    }

    if (!error) {
      var ins_khapoli: any = await LD01S001.prototype.insertCoilDetails(
        newDataPrime?.[0]
      );
      errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
    }
    console.log(errorString);
    return res.status(200).json({ errorString });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const validateData = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S001.prototype.validateData(req.body);
    console.log("results cont: ", results);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
