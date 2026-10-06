import { Request, Response } from "express";
import LDLTS006 from "../models/LDLTS007Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";
import { dltTempData } from "../repository/LDLTS007Query";

export const getTab1Data = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LDLTS006.prototype.getTab1Data(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const fetchTagData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LDLTS006.prototype.fetchTagData(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveData = async (req: Request, res: Response) => {
  try {
    await LDLTS006.prototype.dltTempData();
    let pipeIdNewTagBatchLs = req?.body?.pipeIdNewTagBatchLs;
    let countSucc = 0;
    for (let i = 0; i < pipeIdNewTagBatchLs?.length; i++) {
      let data = {
        pipeId: req?.body?.pipeIdNewTagBatchLs?.[i]?.pipeId,
        oldTagBatch: req?.body?.oldTagBatch,
        newTagBatch: req?.body?.pipeIdNewTagBatchLs?.[i]?.newTagBatch,
        user: req?.body?.user,
      };
      let insertRes = await LDLTS006.prototype.insertDataTemp(data);
      if (insertRes?.rowsAffected === 1) countSucc++;
    }
    let results;
    if (countSucc === pipeIdNewTagBatchLs.length) {
      results = await LDLTS006.prototype.saveData(req?.body?.oldTagBatch);
    } else {
      results = "N-Error";
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
