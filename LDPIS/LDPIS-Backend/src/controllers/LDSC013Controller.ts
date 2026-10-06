import { Request, Response } from "express";
import moment from "moment";
import LDSC013 from "../models/LDSC013Model";
import { ResponceData } from "./LDSM016Controller";
// const buildTableFromOracleResult = (results: any) => {
//   const table: any[] = [];
//   const header: any[] = [];
//   const columns: any[] = [];

//   for (let i = 0; i < results.metaData.length; i++) {
//     header.push((results.metaData[i].name as string).replace(/ /g, ""));
//   }

//   for (let i = 0; i < results.metaData.length; i++) {
//     const obj: any = {};
//     obj.title = results.metaData[i].name as string;
//     obj.field = header[i];
//     columns.push(obj);
//   }

//   for (let i = 0; i < results.rows.length; i++) {
//     const arr = results.rows[i];
//     const jsonObj: any = {};
//     header.forEach((key: any, j: any) => (jsonObj[key] = arr[j]));
//     table.push(jsonObj);
//   }

//   return [columns, table];
// };

export const getSpecList = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC013.prototype.getSpecList(req.body);
    // console.log(results, await ResponceData(results));
    if (!results?.metaData?.length) return res.status(200).json([]);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getParameters = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC013.prototype.getParameters(req.body);
    // console.log(results);
    if (!results?.metaData?.length) return res.status(200).json([]);
    // console.log(results, ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const writeAccess = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC013.prototype.writeAccess(req.body);
    // console.log(results);
    if (!results?.metaData?.length) return res.status(200).json([]);
    // console.log(results, ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getData = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSC013.prototype.getData(req.body);
    if (!results?.metaData?.length) return res.status(200).json([]);
    // console.log(ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteRow = async (req: Request, res: Response) => {
  try {
    console.log(req?.body);
    const data = req?.body?.data;
    console.log(data);
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Invalid payload. Expected non-empty array in 'data'",
      });
    }
    console.log("Hello");
    const results: any = await LDSC013.prototype.deleteRow(data);

    return res.status(200).json({
      message: "Delete successful",
      results,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      message: "Error during Delete",
      error,
    });
  }
};

export const upsert = async (req: Request, res: Response) => {
  try {
    console.log(req?.body);
    const data = req?.body?.data;
    console.log(data);
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Invalid payload. Expected non-empty array in 'data'",
      });
    }
    console.log("Hello");
    const results: any = await LDSC013.prototype.upsert(data);

    return res.status(200).json({
      message: "Upsert successful",
      results,
    });
  } catch (error) {
    console.error("UPSERT ERROR:", error);
    return res.status(500).json({
      message: "Error during upsert",
      error,
    });
  }
};
