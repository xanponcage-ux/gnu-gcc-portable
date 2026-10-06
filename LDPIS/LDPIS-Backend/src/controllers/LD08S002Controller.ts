import { Request, Response } from "express";
import moment from "moment";
import LD08S002 from "../models/LD08S002Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD08S002.prototype.getRmList(status);
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

    const results: any = await LD08S002.prototype.getPipeNoList(
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

// export const getPipeId = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LD08S002.prototype.getPipeId(req.body);
//     console.log(results);
//     return res.status(200).json(await ResponceData(results));
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD08S002.prototype.getPipeInfo(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const getFillData = async (req: Request, res: Response) => {
//   try {
//     let status = req?.body?.status;
//     let rmBatch = req?.body?.RM_BATCH;
//     let pipeid = req?.body?.PIPE_NO;
//     const results: any = await LD08S002.prototype.getFillData(
//       rmBatch,
//       status,
//       pipeid
//     );
//     const table: any = [];
//     const header: any = [];
//     const columns: any = [];
//     const fullData: any = [];

//     for (let i = 0; i < results.metaData.length; i++) {
//       header.push((results.metaData[i].name as string).replace(/ /g, ""));
//     }

//     for (let i = 0; i < results.metaData.length; i++) {
//       var obj: any = {};
//       obj.title = results.metaData[i].name as string;
//       obj.field = header[i];
//       columns.push(obj);
//     }

//     for (let i = 0; i < results.rows.length; i++) {
//       const arr = results.rows[i];
//       var jsonObj: any = {};
//       header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
//       table.push(jsonObj);
//     }

//     fullData.push(columns);
//     fullData.push(table);
//     return res.status(200).json(fullData);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error);
//   }
// };

export const insertpipedetails = async (req: Request, res: Response) => {
  try {
    var { newReworkData, status } = req.body;
    var checkPass = "Y-Success for: ";
    console.log(newReworkData);
    // deleteion of temp buffer for given process and Mother Batch
    for (var i = 0; i < newReworkData.length; i++) {
      var results: any = await LD08S002.prototype.LD08B003(
        newReworkData?.[i],
        status
      );
      console.log(results, newReworkData?.[i]?.LOM_ID_BATCH);
      var outBinds = results.outBinds.LS_OUT_FLAG;
      if (outBinds.toString().startsWith("N-")) {
        checkPass =
          "N-Failed for Batch: " +
          newReworkData?.[i]?.LOM_ID_BATCH.toString() +
          " " + // Adding a space for better readability
          outBinds?.toString() +
          checkPass; // This part might not be necessary depending on your requirements
        break;
      }
      checkPass = checkPass + newReworkData?.[i]?.LOM_ID_BATCH + ",";
    }
    console.log(checkPass);
    return res.status(200).json(checkPass);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getMaterialNo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD08S002.prototype.getMaterialNo(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};
