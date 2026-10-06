import { Request, Response } from "express";
import moment from "moment";
import LDSM041 from "../models/LDSM041Model";
import { Post } from "../typed/typed";

export const getGroupPlant = async (req: Request, res: Response) => {
  try {
    let id = req.body.adid;
    const results: any = await LDSM041.prototype.getGroupPlant(id);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBatchId = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let status = req.body.status;
    const results: any = await LDSM041.prototype.getBatchId(plant, status);

    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const submitDetails = async (req: Request, res: Response) => {
  try {
    const { BatchId, plant, status } = req.body.data;

    const { metaData: gridCol, rows: gridRow }: any =
      await LDSM041.prototype.getSubDetails(BatchId, plant, status);
    const gridColumn = gridCol.map((column: Column) => ({
      title: column.name,
      field: column.name.replace(/ |-|-/g, ""),
    }));
    const gridColmn = gridCol.map((column: Column) => column.name);
    let gridData = gridRow.map((values: any, row: number) => {
      const result: KeyValue = {};

      gridColmn.forEach((key: string, i: any) => (result[key] = values[i]));
      return result;
    });

    return res.status(200).json({ gridData, gridColumn });
  } catch (error) {

    return res.status(400).json(error);
  }
};

export const getSecRsnsDetails = async (req: Request, res: Response) => {
  try {
    // const { BatchId, plant } = req.body.data;

    const { metaData: rsnCol, rows: rsnRow }: any =
      await LDSM041.prototype.getSecRsns();
    const rsnColumn = rsnCol.map((column: Column) => ({
      title: column.name,
      field: column.name.replace(/ |-|-/g, ""),
    }));
    const rsnColmn = rsnCol.map((column: Column) => column.name);
    let rsnData = rsnRow.map((values: any, row: number) => {
      const result: KeyValue = {};

      rsnColmn.forEach((key: string, i: any) => (result[key] = values[i]));
      return result;
    });

    return res.status(200).json({ rsnData, rsnColumn });
  } catch (error) {

    return res.status(400).json(error);
  }
};

export const getBtnHoldDetails = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let batch = req.body.batch;
    let holdRsn = req.body.holdRsn;
    let remarks = req.body.remarks;
    let currProc = req.body.currProc;
    let nextProc = req.body.nextProc;
    let netWt = req.body.netWt;
    let status = req.body.status;
    let pUser = req.body.pUser;
    let flag = req.body.flag;
    const results: any = await LDSM041.prototype.getBtnHold(plant, batch, holdRsn, remarks, currProc, nextProc, netWt, status, pUser, flag);
    if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
      return res.status(200).json(results.outBinds.LS_OUT_FLAG.toString());
    } else {
      return res.status(200).json(results.outBinds.LS_OUT_FLAG.toString());
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const updateOprRemark = async (req: Request, res: Response) => {
  try {

    const results: any = await LDSM041.prototype.updateOprRemark(req);

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};