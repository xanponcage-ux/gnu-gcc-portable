import { Request, Response } from "express";
import moment from "moment";
import LD01S004 from "../models/LD01S004Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getGroupPlant = async (req: Request, res: Response) => {
  try {
    let id = req.body.adid;
    const results: any = await LD01S004.prototype.getGroupPlant(id);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD01S004.prototype.getSchedules(status);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteCoil = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
    var newData = req.body;
    for (var i = 0; i < newData.length; i++) {
      var ele = newData[i];
      console.log(ele);
      let binds = {
        BATCH_ID: newData[i].EWI_ID_BATCH,
        EWI_ID_SCHEDULE: newData[i].SCHEDULE_ID,
        COIL_COUNT: newData?.length,
      };

      var results: any = await LD01S004.prototype.deleteCoil(binds);
      var flag = results.outBinds.LS_OUT_FLAG;
      var errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          "N-Error for batch Prime " +
          ele.EWI_ID_BATCH +
          " -- " +
          flag.toString();
        break;
      }
    }
    if (!error) {
      errorString = "successfully recorded !";
    }
    return res.status(200).json({ errorString });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const generateScheduleId = async (req: Request, res: Response) => {
  try {
    //const selectedData = req.body?.selectedRowsData;
    let totalRowsAffected = 0;

    let result = await LD01S004.prototype.generateScheduleId(req?.body);
    if (result?.rowsAffected) {
      totalRowsAffected += result.rowsAffected;
    }
    var result2: any;
    if (totalRowsAffected >= 1) {
      result2 = "Y";
    } else {
      result2 = "N";
    }

    return res.status(200).json(result2);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const getCoils = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S004.prototype.getCoils(req);
    const table: any = [];
    const header: any = [];
    const columns: any = [];
    const fullData: any = [];

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

    fullData.push(columns);
    fullData.push(table);
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const transferSchedule = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
    let recvData = {
      rowData: req.body.rowData,
      scheduleID: req.body.scheduleID,
    };

    for (var i = 0; i < recvData?.rowData.length; i++) {
      //initalize variables
      console.log(recvData?.rowData?.[i], recvData?.rowData);
      let data = {
        BATCH: recvData?.rowData?.[i].EWI_ID_BATCH,
        EWI_ID_SCHEDULE: recvData?.scheduleID,
      };

      var results: any = await LD01S004.prototype.transferSchedule(data);
      var flag = results.outBinds.LS_OUT_FLAG;

      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          "N-Error for batch Prime " +
          recvData?.rowData?.[i].EWI_BATCH_ID +
          " -- " +
          flag.toString();
        break;
      }
    }
    if (!error) {
      errorString = "successfully recorded !";
    }
    return res.status(200).json({ errorString });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let recvData = {
      rowData: req.body.rowData,
      scheduleID: req.body.scheduleID,
      count: req.body.count,
      action: req.body.action,
    };

    if (recvData?.action === "REARRANGE") {
      //let dt=req.body;
      var checkPass = "Y";
      var totalRowsAffected = 0;
      for (var i = 0; i < recvData?.rowData.length; i++) {
        //initalize variables
        console.log(recvData?.rowData?.[i], recvData?.rowData);
        let data = {
          BATCH: recvData?.rowData?.[i].EWI_BATCH_ID,
          PRIORITY: recvData?.rowData?.[i].priority,
        };
        console.log(data);
        var result: any = await LD01S004.prototype.confirm(data);
        console.log(result);
        if (result?.rowsAffected) {
          totalRowsAffected += result.rowsAffected;
        }
      }
      if (totalRowsAffected >= recvData?.rowData.length) {
        checkPass = "Y-UPDATE of schedule priority succeeded";
      } else {
        checkPass = "N-UPDATE of schedule priority failed";
      }
    } else {
      var checkPass = "Y";
      var totalRowsAffected = 0;
      for (var i = 0; i < recvData?.rowData.length; i++) {
        //initalize variables
        console.log(recvData?.rowData?.[i], recvData?.rowData);
        let data = {
          BATCH: recvData?.rowData?.[i].EWI_BATCH_ID,
          PRIORITY: recvData?.rowData?.[i].priority,
        };
        console.log(data);
        var result: any = await LD01S004.prototype.confirm(data);
        console.log(result);
        if (result?.rowsAffected) {
          totalRowsAffected += result.rowsAffected;
        }
      }
      if (totalRowsAffected >= recvData?.rowData.length) {
        var result1: any = await LD01S004.prototype.updateSchedule(
          recvData?.scheduleID
        );
        console.log(result1);
        var outBinds = result1.outBinds.LS_OUT_FLAG;
        checkPass = outBinds.toString();
      } else {
        checkPass = "N-UPDATE of schedule priority failed";
      }
    }

    return res.status(200).json(checkPass);
    //return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
