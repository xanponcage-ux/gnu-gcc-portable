import { Request, Response } from "express";
import moment from "moment";
import LDSC003 from "../models/LDSC003Model";
import { Post } from "../typed/typed";

export const getBOMData = async (req: Request, res: Response) => {
  try {
    console.log("incontroller");
    // let plant = req.body.plant;

    const results: any = await LDSC003.prototype.getBOMData(req.body);
    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
