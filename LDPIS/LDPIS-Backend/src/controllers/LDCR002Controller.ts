import { Request, Response } from "express";
import moment from "moment";
import LDCR002 from "../models/LDCR002Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const getautomaticweld = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getautomaticweld(
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

export const getautomaticweldbody = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getautomaticweldbody(
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

export const getchemdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getchemdata(
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

export const getVdidata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getVdidata(
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

export const gethardnessdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.gethardnessdata(
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

export const getFRBTdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getFRBTdata(
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

export const getVdirdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getVdirdata(
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

export const getVdirSdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getVdirSdata(
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

export const getAirdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getAirdata(
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

export const getCrossdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getCrossdata(
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

export const getREPAIRdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getREPAIRdata(
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

export const getdustdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getdustdata(
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

export const getepoxydata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getepoxydata(
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

export const getimpactdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getimpactdata(
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

export const getpeeldata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getpeeldata(
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

export const gettrialdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.gettrialdata(
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

export const getapplicationdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getapplicationdata(
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

export const getthickness = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getthickness(
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

export const getfinalinspection = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getfinalinspection(
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

export const getDROPdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getDROPdata(
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

export const getmechanicaldata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getmechanicaldata(
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
    console.log("Controller MECH");

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

export const getMGERdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getMGERdata(
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

export const getMGNdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getMGNdata(
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

export const getHYSdata = async (req: Request, res: Response) => {
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

    const results: any = await LDCR002.prototype.getHYSdata(
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

export const getInventoryData = async (req: Request, res: Response) => {
  try {
    var {
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType,
    } = req.body;

    const results: any = await LDCR002.prototype.getInventoryData(
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType
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
    //  fullData.push(columns);
    //  fullData.push(table);

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetreportTyp = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    console.log("Controller", plant);
    const results: any = await LDCR002.prototype.GetreportTyp(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMergedInv = async (req: Request, res: Response) => {
  try {
    var { fromDt, mergedType, plant, toDt, batchMerg, mergedBatchMerg } =
      req.body;

    const results: any = await LDCR002.prototype.getMergedInv(
      fromDt,
      mergedType,
      plant,
      toDt,
      batchMerg,
      mergedBatchMerg
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
    //  fullData.push(columns);
    //  fullData.push(table);

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOdiaFrm = async (req: Request, res: Response) => {
  try {
    var plant = req.body.plant;

    const results: any = await LDCR002.prototype.getOdiaFrm(plant);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });

    //response
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOdiaTo = async (req: Request, res: Response) => {
  try {
    var plant = req.body.plant;

    const results: any = await LDCR002.prototype.getOdiaTo(plant);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });

    //response
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getReversedBatchInfo = async (req: Request, res: Response) => {
  try {
    var { plant, batchId, mergeBatch } = req.body;

    const results: any = await LDCR002.prototype.getReversedBatchInfo(
      plant,
      batchId,
      mergeBatch
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

export const getInletData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LDCR002.prototype.getInletData(req.body)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBlastingData = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LDCR002.prototype.getBlastingData(req.body)
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
