import { Request, Response } from "express";
import moment from "moment";
import LDCR004 from "../models/LDCR004Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const GetreportTyp = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    console.log("Controller", plant);
    const results: any = await LDCR004.prototype.GetreportTyp(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getinternaldata = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getinternaldata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const getpanelTest = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getpanelTest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const getporositytest = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getporositytest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const getsgtest = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getsgtest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const getmixpaint = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getmixpaint(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const getpulltest = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.getpulltest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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

export const gettaber = async (req: Request, res: Response) => {
  try {
    var {
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
      // rmno
    } = req.body;

    const results: any = await LDCR004.prototype.gettaber(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // rmno
    );
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
