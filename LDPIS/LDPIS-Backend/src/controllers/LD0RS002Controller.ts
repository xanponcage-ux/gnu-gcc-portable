import { query, Request, Response } from "express";
import moment from "moment";
import LD0RS002 from "../models/LD0RS002Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD0RS002.prototype.getRmList(status);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LD0RS002.prototype.getPipeNoList(
      rmBatch,
      status
    );
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS002.prototype.getPipeInfo(req.body);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertpipedetails = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
    var errorData = "";

    var { newReworkData, parting } = req.body;

    let dltRes = await LD0RS002.prototype.dltTempData(
      newReworkData?.[0]?.RM_BATCH
    );

    for (var i = 0; i < newReworkData.length; i++) {
      var results: any = await LD0RS002.prototype.tempInsert(
        newReworkData?.[i],
        parting
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
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
      var ins_khapoli: any = await LD0RS002.prototype.insertPipeDetails(
        newReworkData,
        parting
      );
      errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
    }
    return res.status(200).json({ errorString });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getMaterialNo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS002.prototype.getMaterialNo(req.body);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeWeight = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LD0RS002.prototype.getPipeWeight(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getGeometry = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LD0RS002.prototype.getGeometry(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Material Tab Apis

export const getMatTabData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD0RS002.prototype.getMatTabData(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const validateData = async (req: Request, res: Response) => {
  try {
    var results: any;
    results = await ResponceData(
      await LD0RS002.prototype.validateData(req.body)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveData = async (req: Request, res: Response) => {
  try {
    let selectedRows = req?.body?.selectedData;
    var results: any;
    for (var i = 0; i < selectedRows?.length; i++) {
      results = await LD0RS002.prototype.saveData(selectedRows[i]);
      console.log("resultsCont: ", results);
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUserAccess = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS002.prototype.getUserAccess();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getDropdown = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0RS002.prototype.getDropdown();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
