import { Request, Response } from "express";
import moment from "moment";
import LD01S010 from "../models/LD01S010Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getList = async (req: Request, res: Response) => {
  try {
    let props = req.body;
    const results: any = await ResponceData(
      await LD01S010.prototype.getList(props)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getRM = async (req: Request, res: Response) => {
  try {
    let props = req.body;
    const results: any = await LD01S010.prototype.getRM(props);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const populateForecast = async (req: Request, res: Response) => {
  try {
    const result: any = await LD01S010.prototype.populateForecast();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
};
