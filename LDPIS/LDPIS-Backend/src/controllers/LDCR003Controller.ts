import { Request, Response } from "express";
import moment from "moment";
import LDCR003 from "../models/LDCR003Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const GetreportTyp = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    console.log("Controller", plant);
    const results: any = await LDCR003.prototype.GetreportTyp(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const get24or48HrsCDtest = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.get24or48HrsCDtest(
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

export const get28or30DaysCDTestReport = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.get28or30DaysCDTestReport(
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

export const getCROSSSECTIONINTERFACEPOROSITY = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getCROSSSECTIONINTERFACEPOROSITY(
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

export const getdegreeofcure = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getdegreeofcure(
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

export const getelongationrep = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getelongationrep(
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

export const getFLEXIBILITYTEST3LPE = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getFLEXIBILITYTEST3LPE(
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

export const getFLEXIBILITYTESTREPORTFBE = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getFLEXIBILITYTESTREPORTFBE(
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

export const getHARDNESSTEST = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getHARDNESSTEST(
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

export const getHOTWATERADHESIONTEST24HRS = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getHOTWATERADHESIONTEST24HRS(
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

export const getproductstablilty = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getproductstablilty(
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

export const getINDENTATIONTEST = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getINDENTATIONTEST(
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

export const getHOTWATERIMMERSION48 = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.getHOTWATERIMMERSION48(
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

export const gettensile = async (req: Request, res: Response) => {
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

    const results: any = await LDCR003.prototype.gettensile(
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