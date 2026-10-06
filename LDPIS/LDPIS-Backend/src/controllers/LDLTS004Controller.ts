import { Request, Response } from "express";
import LDLTS004 from "../models/LDLTS004Model";
import { ResponceData } from "../utils";

export const getOrderid = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrderid(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getItemNo = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getItemNo(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailLD = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrdDetailLD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailID = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrdDetailID(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailMD = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrdDetailMD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailSD = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrdDetailSD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailGD = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS004.prototype.getOrdDetailGD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
