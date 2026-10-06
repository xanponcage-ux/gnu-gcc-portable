import { Request, Response } from "express";
import moment from "moment";
import LD0RS001 from "../models/LD0RS001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD0RS001.prototype.getRmList(status);
    // console.log(results);
    // console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMatList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD0RS001.prototype.getMatList(status);
    // console.log(results);
    // console.log(await ResponceData(results));
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

    const results: any = await LD0RS001.prototype.getPipeNoList(
      rmBatch,
      status,
      mill
    );
    // console.log(results);
    // console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const getPipeId = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LD0RS001.prototype.getPipeId(req.body);
//     console.log(results);
//     return res.status(200).json(await ResponceData(results));
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS001.prototype.getPipeInfo(req.body);
    // console.log(results);
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
//     const results: any = await LD0RS001.prototype.getFillData(
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
    var errorString = "";
    var error = false;
    var errorData = "";

    var { newReworkData, parting } = req.body;

    // deleteion of temp buffer for given process and Mother Batch
    for (var i = 0; i < newReworkData.length; i++) {
      var results: any = await LD0RS001.prototype.LRS001_TEMP_INSERT(
        newReworkData?.[i],
        parting
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      // console.log(errorData);
      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          "N-Error for batch Prime " +
          newReworkData[i].PIPEID +
          " -- " +
          flag.toString().replace("N-", "");
      }
    }

    if (!error) {
      var ins_khapoli: any = await LD0RS001.prototype.insertPipeDetails(
        newReworkData,
        parting
      );
      errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
    }
    // console.log(errorString);
    return res.status(200).json({ errorString });
  } catch (error) {
    // console.log(error);
    return res.status(400).json(error);
  }
};

export const getMaterialNo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS001.prototype.getMaterialNo(req.body);
    // console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeWeight = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LD0RS001.prototype.getPipeWeight(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getGeometry = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LD0RS001.prototype.getGeometry(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};
