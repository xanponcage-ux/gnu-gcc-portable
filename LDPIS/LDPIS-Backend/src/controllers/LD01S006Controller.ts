import { Request, Response } from "express";
import LD01S006 from "../models/LD01S006Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const getPalletData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S006.prototype.getPalletData(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const savePalletUnmerge = async (req: Request, res: Response) => {
  try {
    console.log("req.body: ", req.body);
    const selectedData = req?.body?.selectedData;
    //const user = req?.body?.user;
    // const mergeId = req?.body?.selectedData[0]?.mergeId;

    const length = selectedData?.length;
    // let deleteQry = await LD01S006.prototype.deletePalletTemp(user);
    // console.log("deleteQry: ", deleteQry);

    // let mergeId = await ResponceData(await LD01S006.prototype.getMergeID());
    // mergeId = mergeId[0]?.MERGE_ID;

    var mergeResult = {
      result: "",
      mergeId: "",
    };

    let countY = 0;
    var finRes;
    var batch_id = "";
    for (const data of selectedData) {
      let result1 = await LD01S006.prototype.savePalletUnmerge(data);
      console.log("unmerge: ", result1?.outBinds?.LS_OUT_FLAG?.substr(0, 1));
      if (result1?.outBinds?.LS_OUT_FLAG?.substr(0, 1) === "Y") {
        finRes = result1?.outBinds?.LS_OUT_FLAG;
        batch_id += "-" + data?.batchId;
        console.log(finRes);
      } else {
        mergeResult = {
          result: result1?.outBinds?.LS_OUT_FLAG,
          mergeId: data?.batchId,
        };
        return res.status(200).json(mergeResult);
      }
    }
    mergeResult = {
      result: finRes,
      mergeId: batch_id,
    };
    return res.status(200).json(mergeResult);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const savePalletData = async (req: Request, res: Response) => {
  try {
    console.log("req.body: ", req.body);
    const selectedData = req?.body?.selectedData;
    const user = req?.body?.user;
    const pelletIdFromFrontend = req?.body?.PELLETID; // NEW: Extract PELLETID from request body
    // const mergeId = req?.body?.selectedData[0]?.mergeId;
    let finRes;

    const length = selectedData?.length;
    let deleteQry = await LD01S006.prototype.deletePalletTemp(user);
    console.log("deleteQry: ", deleteQry);

    // let mergeId = await ResponceData(await LD01S006.prototype.getMergeID());
    // mergeId = mergeId[0]?.MERGE_ID;

    let mergeId;
    if (pelletIdFromFrontend) {
      mergeId = pelletIdFromFrontend;
      console.log("Using PELLETID from frontend as mergeId:", mergeId);
    } else {
      let generatedMergeId = await ResponceData(await LD01S006.prototype.getMergeID());
      mergeId = generatedMergeId[0]?.MERGE_ID;
      console.log("Generated mergeId from backend:", mergeId);
    }

    var mergeResult = {
      result: "",
      mergeId: mergeId,
    };

    let countY = 0;
    for (const data of selectedData) {
      let result1 = await LD01S006.prototype.savePalletDataTemp(data, mergeId);
      if (result1?.outBinds?.LS_OUT_FLAG?.substr(0, 1) === "Y") {
        countY++;
      } else {
        mergeResult = {
          result: result1?.outBinds?.LS_OUT_FLAG,
          mergeId: mergeId,
        };
        return res.status(200).json(mergeResult);
      }
    }
    if (countY === length) {
      finRes = await LD01S006.prototype.savePalletData(mergeId);
    }
    mergeResult = {
      result: finRes?.outBinds?.LS_OUT_FLAG,
      mergeId: mergeId,
    };
    return res.status(200).json(mergeResult);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getPalletInvData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S006.prototype.getPalletInvData(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getcheckMergebatch = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S006.prototype.getcheckMergebatch(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMergingStatus = async (req: Request, res: Response) => {
  try {
    //data retreival
    var { plant } = req.body;
    //execute query
    const results: any = await LD01S006.prototype.GetMergingStatus(plant);
    //response
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getInitialpalletID = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S006.prototype.getInitialpalletID()
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};