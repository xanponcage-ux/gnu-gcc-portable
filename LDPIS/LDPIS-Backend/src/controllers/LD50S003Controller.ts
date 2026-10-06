import { Request, Response } from "express";
import moment from "moment";
import LDSMS031 from "../models/LD50S003Model";
import { Post } from "../typed/typed";
import { ResponceData } from "../utils";

export const getGroupPlant = async (req: Request, res: Response) => {
  try {
    let id = req.body.adid;
    const results: any = await LDSMS031.prototype.getGroupPlant(id);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getProcessList = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await LDSMS031.prototype.getProcessList(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getStatus = async (req: Request, res: Response) => {
  try {
    let process = req.body.process;
    const results: any = await LDSMS031.prototype.getStatus(process);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getResqtyval = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    const results: any = await LDSMS031.prototype.getResqtyval(Plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const getScheduleData = async (req: Request, res: Response) => {
//   try {
//     let plant = req.body.plant;
//     let status = req.body.status;
//     const results: any = await LDSMS031.prototype.getScheduleData(
//       plant,
//       status
//     );
//     const table: any = [];
//     const header: any = [];
//     const columns: any = [];
//     const fullData: any = [];

//     for (let i = 0; i < results.metaData.length; i++) {
//       header.push((results.metaData[i].name as string).replace(/ /g, ""));
//     }

//     for (let i = 0; i < results.metaData.length; i++) {
//       var obj: any = {};
//       obj.title = results.metaData[i].name as string;
//       obj.field = header[i];
//       columns.push(obj);
//     }

//     for (let i = 0; i < results.rows.length; i++) {
//       const arr = results.rows[i];
//       var jsonObj: any = {};
//       header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
//       table.push(jsonObj);
//     }

//     fullData.push(columns);
//     fullData.push(table);
//     return res.status(200).json(fullData);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getCoils = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getCoils(req);
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

export const compute = async (req: Request, res: Response) => {
  try {
    //    var resDt: any = await LDSMS031.prototype.chemChkSlt(req);
    //     let results: any  = [];
    //     results.push(resDt.rows);
    //     if (results.toString().startsWith("N-")) {
    //         return res.status(200).json(results);
    //     }
    //     else
    //     {
    //     var resCompute = await LDSMS031.prototype.compute(req);
    //         return res.status(200).json(resCompute)
    //     }

    let dataArr = req.body;

    const results: any = await LDSMS031.prototype.compute(dataArr);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.confirm(req.body);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetOrdFilter = async (req: Request, res: Response) => {
  try {
    let plant = req.body.Plant;
    let ordtype = req.body.OrdType;
    let ordid = req.body.OrdId ?? "";
    let orditem = req.body.OrdItem ?? "";
    let ordtdc = req.body.OrdTdc ?? "";
    let ordthick = req.body.OrdThick ?? "";
    let ordwidth = req.body.OrdWidth ?? "";

    const results: any = await LDSMS031.prototype.GetOrdFilter(
      plant,
      ordid,
      orditem,
      ordtdc,
      ordtype,
      ordthick,
      ordwidth
    );
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

export const GetPlanPathWire = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.GetPlanPathWire(req);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getOrdTyp = async (req: Request, res: Response) => {
  try {
    // var
    const results: any = await LDSMS031.prototype.getOrdTyp();
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetBatchDtl = async (req: Request, res: Response) => {
  try {
    let { Plant, Batch, ProcLine } = req.body;
    const results: any = await LDSMS031.prototype.GetBatchDtl(
      Plant,
      Batch,
      ProcLine
    );
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

export const GetPdiDtl = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Batch = req.body.Batch;
    let Process = req.body.Process;
    let ProdDate = req.body.ProdDate;
    let MBatch = req.body.MBatch;
    let BusUnit = req.body.BusUnit;
    let Odia = req.body.Odia;
    let status = req.body.status;
    let prodEndDt = req.body.prodEndDt;
    const results: any = await LDSMS031.prototype.GetPdiDtl(
      Plant,
      Batch,
      Process,
      ProdDate,
      MBatch,
      BusUnit,
      Odia,
      status,
      prodEndDt
    );
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
export const GetMCoilList = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Process = req.body.Process;
    const results: any = await LDSMS031.prototype.GetMCoilList(Plant, Process);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetODIA = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Process = req.body.Process;
    const results: any = await LDSMS031.prototype.GetODIA(Plant, Process);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getShiftStatus = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getShiftStatus(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getProductionType = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getProductionType(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBatchCount = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getBatchCount(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const getWorkCenterList = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LDSMS031.prototype.getWorkCenterList(req);
//     const list: any = [];
//     //create json
//     results.rows.map(function (x: any) {
//       list.push(x[0] + ":" + x[0]);
//     });
//     return res.status(200).json(list);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getScrapProductionTable = async (req: Request, res: Response) => {
  try {
    let results = await LDSMS031.prototype.getScrapProductionTable(req);
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

export const GetBatchDtlforLP = async (req: Request, res: Response) => {
  try {
    let { Plant, MBatch, DBatch } = req.body;
    var results = await LDSMS031.prototype.GetBatchDtlforLP_daughter(
      Plant,
      MBatch,
      DBatch
    );

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
export const getHoldRsnDetails = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getHoldRsnDetails(req);
    const table: any = [];
    const header: any = [];
    const columns: any = [];
    const fullData: any = [];

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);

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
export const GetPdiDtlMultiLot = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Process = req.body.Process;
    let ProdDate = req.body.ProdDate;
    let BusUnit = req.body.BusUnit;
    let Odia = req.body.Odia;
    let status = req.body.status;

    var results: any = [];
    var metaData: any = [];
    var { newData } = req.body;
    var ele = newData[0];
    var MBatch = newData[0].LOM_ID_BATCH;
    var Batch = newData[0].LOM_ID_BATCH;
    var resDt: any = await LDSMS031.prototype.GetPdiDtlMultiLot(
      Plant,
      Batch,
      Process,
      ProdDate,
      MBatch,
      BusUnit,
      Odia,
      status,
      ele
    );
    results.push(resDt.rows);
    metaData.push(resDt.metaData);

    const table: any = [];
    const header: any = [];
    const columns: any = [];
    const fullData: any = [];

    var mdLength = metaData[0] ? metaData[0].length : 0;
    for (let i = 0; i < mdLength; i++) {
      header.push((metaData[0][i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < mdLength; i++) {
      var obj: any = {};
      obj.title = metaData[0][i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.length; i++) {
      const arr = results[i][0];
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
// export const CRTScheduleMerge = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LDSMS031.prototype.CRTScheduleMerge(req);
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };
export const InsertSlitProd = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var err = false;
    var uom = "";
    var errorData = "";

    var {
      newData,
      scrapData,
      Plant,
      Batch,
      Process,
      resWt,
      totalNetWt,
      ProdDate,
      Shift,
      user,
      recordTyp,
      startDt,
      endDt,
      activity,
    } = req.body;
    //delete temp
    var resDel: any = await LDSMS031.prototype.delete_tempprod(
      Plant,
      Batch,
      user
    );

    for (var i = 0; i < newData.length; i++) {
      var ele = newData[i];
      uom = newData[0].EWI_UOM;
      var fg = "FG";
      //   console.log(ele.prdPStartDt);
      var results: any = await LDSMS031.prototype.SPCB004_TEMP_Insert(
        ele,
        Plant,
        Batch,
        Process,
        resWt,
        totalNetWt,
        ProdDate,
        Shift,
        user,
        uom,
        fg,
        startDt,
        endDt
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        err = true;
        errorString +=
          "N-Error for batch Prime" + ele.BATCH_ID + " -- " + flag.toString();
      }
    }

    for (var i = 0; i < scrapData.length; i++) {
      var scrapObj = {
        BATCH_ID: scrapData[i].SCRAP_BATCH_ID,
        EWI_ID_ORDER_CUS: scrapData[i].ORDER_ID,
        EWI_ID_ORD_ITEM_CUS: scrapData[i].ITEM,
        NEXT_PROC: "",
        EWI_CD_PROD: "",
        EWI_CD_QLTY: scrapData[i].QLTY,
        ddlRsnHold: "",
        prdTimeDiff: 0,
        EWI_SEC1: 0,
        EWI_SEC2: 0,
        EWI_LENGTH: 0,
        EWI_MS_PIECE_ACTL: scrapData[i].NET_WT,
        EWI_ID_WRK_INST: null,
        EWI_NO_PIECES: scrapData[i].EWI_NO_PIECES,
        IDIA: 0,
        ODIA: 0,
        EWI_ID_SCHEDULE: null,
        EWI_PLANNED_PROC: null,
        CD_HOLD: "",
        HOLD_OP_REMARKS: "",
        prdPStartDt: "",
        prdPEndDt: "",
        ddlWorkCenter: ele.ddlWorkCenter, //Pass prime work center
        FG_MAT: null,
        SFG_MAT: null,
        P_SCRP_MATNR: scrapData[i].MATERIAL,
        P_ROLLING_LENGTH: null,
      };
      var scrap = "SCRAP";

      var results: any = await LDSMS031.prototype.SPCB004_TEMP_Insert(
        scrapObj,
        Plant,
        Batch,
        Process,
        resWt,
        totalNetWt,
        ProdDate,
        Shift,
        user,
        uom,
        scrap,
        startDt,
        endDt
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        err = true;
        errorString +=
          " Error for batch Scrap" +
          scrapData[i].SCRAP_BATCH_ID +
          " -- " +
          flag.toString().replace("N-", "");
      }
    }

    if (err === false) {
      var ins_khapoli: any = await LDSMS031.prototype.Insert_Khapoli(
        Plant,
        Batch,
        Process,
        activity,
        user
      );
      var d = ins_khapoli.outBinds.LS_OUT_FLAG;
      if (d.toString().startsWith("N-") || d == null) {
        errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
      } else {
        errorString = "Batch successfully recorded !";
      }
    }
    return res.status(200).json({ errorString });
  } catch (error) {
    console.log("error:: ", error);
    return res.status(400).json(error);
  }
};

export const getBatchId = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    const results: any = await LDSMS031.prototype.getBatchId(Plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetInqDetl = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Process = req.body.Process;
    let BatchID = req.body.BatchID;
    let Status = req.body.Status;
    let OrdID = req.body.OrdID;
    let OrdItm = req.body.OrdItm;
    let Prod_DT = req.body.Prod_DT;

    const results: any = await LDSMS031.prototype.GetInqDetl(
      Plant,
      Process,
      BatchID,
      Status,
      OrdID,
      OrdItm,
      Prod_DT
    );
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
export const ScheduleDel = async (req: Request, res: Response) => {
  try {
    var resDt = "";
    const { Plant, dt } = req.body;
    for (var i = 0; i < dt.length; i++) {
      var ele = dt[i];
      var results: any = await LDSMS031.prototype.ScheduleDel(Plant, ele);
      resDt = results;
    }
    return res.status(200).json(resDt);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const ScheduleDelMerge = async (req: Request, res: Response) => {
//   try {
//     const results: any = await LDSMS031.prototype.ScheduleDelMerge(req);
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const getWorkCenter = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getWorkCenter(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMergeBatchDetails = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getMergeBatchDetails(req);
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

export const getActivity = async (req: Request, res: Response) => {
  try {
    const results: any = await LDSMS031.prototype.getActivity(req.body);
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

export const getEquivTdc = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LDSMS031.prototype.getEquivTdc(data);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
