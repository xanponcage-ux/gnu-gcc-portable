import { Request, Response } from "express";
import LDLTS005 from "../models/LDLTS005Model";
import { ResponceData } from "../utils";

export const getOrderid = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS005.prototype.getOrderid(data)
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
      await LDLTS005.prototype.getItemNo(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getdateandshift = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS005.prototype.getdateandshift(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCommonTests = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS005.prototype.getCommonTests(data)
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
      await LDLTS005.prototype.getOrdDetailLD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertTempData = async (req: Request, res: Response) => {
  try {
    let result1 = await LDLTS005.prototype.insertTempData(req?.body);
    // console.log(result1);

    return res.status(200).json(result1);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getOrdDetailID = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS005.prototype.getOrdDetailID(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getcountcheck = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await ResponceData(
      await LDLTS005.prototype.getcountcheck(data)
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
      await LDLTS005.prototype.getOrdDetailMD(data)
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
      await LDLTS005.prototype.getOrdDetailSD(data)
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
      await LDLTS005.prototype.getOrdDetailGD(data)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
