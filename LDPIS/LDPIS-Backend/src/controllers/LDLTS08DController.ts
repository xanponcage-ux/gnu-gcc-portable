import { query, Request, Response } from "express";
import moment from "moment";
import { LDLTS08D } from "../models/LDLTS08DModel";

interface KeyValue {
  [key: string]: any;
}

interface Column {
  name: string;
}

interface Tables {
  metaData: Array<Column>;

  rows: Array<Array<any>>;
}


//Delay Data
export const getData = async (req: Request, res: Response) => {
  try {
    const {
      shift,
      plantCode,
      fromDate,
      toDate,
      processLine,
      subequipCode,
      previousMonth,
      nullrem ,
      DA,
      resouceCode,} = req.body;
    const results = await LDLTS08D.displayDelayData(
      shift,
      plantCode,
      fromDate,
      toDate,
      processLine,
      // resouceCode,
      subequipCode,
      previousMonth,
      nullrem,
      DA,
      Array.isArray(resouceCode) ? resouceCode : [resouceCode] // Make sure to pass an array
    )

    const table: any = [];
    const header: any = [];
    // console.log(subequipCode);
    if (results?.metaData?.length && results?.rows?.length) {
      for (let i = 0; i < results.metaData?.length; i++) {
        header.push((results.metaData[i].name as string).replace(/ /g, ''))
      }

      for (let i = 0; i < results.rows.length; i++) {
        const arr = results.rows[i];
        var jsonObj: any = {};
        header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
        await table.push(jsonObj)
      }
    }
    return res.status(200).json(table);
    // const { rows: eqpRow }: any = await LDLTS08D.eqpMast(
    //   plantCode,
    //   processLine
    // );

    // const eqpData: any = [];

    // eqpRow.map(function (x: any) {
    //   eqpData.push(x[0] + ":" + x[1]);
    // });

    // // //Facility Code
    // const { metaData: facCol, rows: facRow }: any = await LDLTS08D.facCode(
    //   plantCode,
    //   compCode,
    // );

    // const facColumn = facCol.map((column: Column) => ({
    //   title: column.name,
    //   field: column.name.replace(/ |-|-/g, ""),
    // }));

    // const facColm = facCol.map((column: Column) =>
    //   column.name.replace(/ |-/g, "")
    // );
    // const facData = facRow.map((values: any, row: number) => {
    //   const result: KeyValue = {};
    //   facColm.forEach((key: string, i: any) => (result[key] = values[i]));
    //   return result;
    // });

    // //Delay Data
    // const {
    //   dateFrom,
    //   dateTo,
    //   EqpCD,
    //   FaqCD,
    //   selectShift,
    //   resouceCode,
    //   unbookCheck,
    // } = req.body;
    // if (unbookCheck) {
    //   var { metaData: delayCol, rows: delayRow }: any =
    //     await LDLTS08D.delayCheck(
    //       dateFrom,
    //       dateTo,
    //       processLine,
    //       selectShift,
    //       resouceCode,
    //       // plantCd,
    //       EqpCD,
    //       FaqCD,
    //       plantCode,
    //       compCode
    //     );
    // } else {
    //   var { metaData: delayCol, rows: delayRow }: any = await LDLTS08D.delay(
    //     dateFrom,
    //     dateTo,
    //     processLine,
    //     selectShift,
    //     resouceCode,
    //     // plant,
    //     EqpCD,
    //     FaqCD,
    //     plantCode,
    //     compCode
    //   );
    // }

    // const delayColumn = delayCol.map((column: Column) => ({
    //   title: column.name,
    //   field: column.name.replace(/ |-|-/g, ""),
    // }));

    // let totalDelay = 0,
    //   totalRows,
    //   noOfDays,
    //   cnt = 0,
    //   mtbf = 0,
    //   ts = 0,
    //   mttr = 0;     
    // var spnMtbf = 0,
    //   spnMttr,
    //   delay = 0,
    //   workHrs,
    //   delay_count = 0,
    //   date_diff = 0;

    // const delayColm = delayCol.map((column: Column) =>
    //   column.name.replace(/ |-/g, "")
    // );

    // const delayData = delayRow.map((values: any, row: number) => {
    //   const result: KeyValue = {};

    //   delayColm.forEach((key: string, i: any) => (result[key] = values[i]));
    //   {
    //     totalDelay += result?.DURATION ?? 0;
    //     if (
    //       parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //       parseInt(result.FAO_CD_TRBL_TYP) == 6
    //     )
    //       cnt = cnt + result?.DURATION;

    //     //if (parseInt(result.FAO_CD_TRBL_TYP) > 1 && parseInt(result.FAO_CD_TRBL_TYP) < 6)
    //     //                delay_count;

    //     if (
    //       parseInt(result.FAO_CD_TRBL_TYP) !== 1 &&
    //       parseInt(result.FAO_CD_TRBL_TYP) !== 6
    //     )
    //       delay_count++;

    //     if (cnt > 0) {
    //       if (
    //         parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //         parseInt(result.FAO_CD_TRBL_TYP) == 6
    //       ) {
    //         mtbf += result.DURATION;
    //       }
    //     }

    //     if ((dateTo || dateFrom) != "" && result.FAO_CD_SH_OUTAGE !== "All") {
    //       // ts = moment(dateTo).diff(moment(dateFrom), "days");
    //       var newdateto = new Date(dateTo);
    //       var newdatefrom = new Date(dateFrom);
    //       var get_diff = moment.duration(
    //         moment(newdateto, "MM/DD/YYYY").diff(
    //           moment(newdatefrom, "MM/DD/YYYY")
    //         )
    //       );
    //       ts = get_diff.asDays();
    //       date_diff = ts * 24;
    //       spnMtbf = (date_diff - mtbf) / delay_count;
    //     } else if (
    //       (dateTo || dateFrom) != "" &&
    //       result.FAO_CD_SH_OUTAGE === "All"
    //     ) {
    //       spnMtbf = (8.0 - mtbf) / delay_count;
    //     }

    //     //mttr result
    //     if (result?.DURATION !== 0) delay += result?.DURATION;

    //     if (cnt > 0)
    //       if (
    //         parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //         parseInt(result.FAO_CD_TRBL_TYP) == 6
    //       )
    //         mttr += result.DURATION;

    //     spnMttr = ((delay - mttr) / delay_count).toFixed(2);
    //     return result;
    //   }
    // });
    // totalRows = delayRow.length;
    // interface IObjectKeys {
    //   [key: string]: string | number;
    // }
    // var newdateto = new Date(dateTo);
    // var newdatefrom = new Date(dateFrom);
    // var get_diff = moment.duration(
    //   moment(newdateto, "MM/DD/YYYY").diff(moment(newdatefrom, "MM/DD/YYYY"))
    // );
    // noOfDays = get_diff.asDays() + 1;
    // // noOfDays = moment(dateTo).diff(moment(dateFrom), "days") + 1;
    // workHrs = parseFloat((noOfDays * 24 - totalDelay).toFixed(2));
    // let milUtility = (workHrs / (noOfDays * 24)) * 100;

    // //Reason Data

    // const { rows }: any = await LDLTS08D.reason(locationPlant, compCode);
    // const reasonData: any = [];
    // var option = "OTHERS:DUE TO OTHER REASON"
    // rows.map(function (x: any) {
    //   reasonData.push(x[0] + ":" + x[1]);
    // });
    // reasonData.push(option)
    // return res.status(200).json({
    //   eqpData,
    //   // eqpColumn,
    //   facData,
    //   facColumn,
    //   delayData,
    //   delayColumn,
    //   totalDelay,
    //   totalRows,
    //   noOfDays,
    //   workHrs,
    //   spnMtbf,
    //   spnMttr,
    //   milUtility,
    //   reasonData,
    // });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getDatanotification = async (req: Request, res: Response) => {
  try {
    const {
      shift,
      plantCode,
      fromDate,
      toDate,
      processLine,
      subequipCode,
      previousMonth,
      nullrem ,
      DA,
      resouceCode,} = req.body;
    const results = await LDLTS08D.getDatanotification(
      shift,
      plantCode,
      fromDate,
      toDate,
      processLine,
      // resouceCode,
      subequipCode,
      previousMonth,
      nullrem,
      DA,
      Array.isArray(resouceCode) ? resouceCode : [resouceCode] // Make sure to pass an array
    )

    const table: any = [];
    const header: any = [];
    // console.log(subequipCode);
    if (results?.metaData?.length && results?.rows?.length) {
      for (let i = 0; i < results.metaData?.length; i++) {
        header.push((results.metaData[i].name as string).replace(/ /g, ''))
      }

      for (let i = 0; i < results.rows.length; i++) {
        const arr = results.rows[i];
        var jsonObj: any = {};
        header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
        await table.push(jsonObj)
      }
    }
    return res.status(200).json(table);
    // const { rows: eqpRow }: any = await LDLTS08D.eqpMast(
    //   plantCode,
    //   processLine
    // );

    // const eqpData: any = [];

    // eqpRow.map(function (x: any) {
    //   eqpData.push(x[0] + ":" + x[1]);
    // });

    // // //Facility Code
    // const { metaData: facCol, rows: facRow }: any = await LDLTS08D.facCode(
    //   plantCode,
    //   compCode,
    // );

    // const facColumn = facCol.map((column: Column) => ({
    //   title: column.name,
    //   field: column.name.replace(/ |-|-/g, ""),
    // }));

    // const facColm = facCol.map((column: Column) =>
    //   column.name.replace(/ |-/g, "")
    // );
    // const facData = facRow.map((values: any, row: number) => {
    //   const result: KeyValue = {};
    //   facColm.forEach((key: string, i: any) => (result[key] = values[i]));
    //   return result;
    // });

    // //Delay Data
    // const {
    //   dateFrom,
    //   dateTo,
    //   EqpCD,
    //   FaqCD,
    //   selectShift,
    //   resouceCode,
    //   unbookCheck,
    // } = req.body;
    // if (unbookCheck) {
    //   var { metaData: delayCol, rows: delayRow }: any =
    //     await LDLTS08D.delayCheck(
    //       dateFrom,
    //       dateTo,
    //       processLine,
    //       selectShift,
    //       resouceCode,
    //       // plantCd,
    //       EqpCD,
    //       FaqCD,
    //       plantCode,
    //       compCode
    //     );
    // } else {
    //   var { metaData: delayCol, rows: delayRow }: any = await LDLTS08D.delay(
    //     dateFrom,
    //     dateTo,
    //     processLine,
    //     selectShift,
    //     resouceCode,
    //     // plant,
    //     EqpCD,
    //     FaqCD,
    //     plantCode,
    //     compCode
    //   );
    // }

    // const delayColumn = delayCol.map((column: Column) => ({
    //   title: column.name,
    //   field: column.name.replace(/ |-|-/g, ""),
    // }));

    // let totalDelay = 0,
    //   totalRows,
    //   noOfDays,
    //   cnt = 0,
    //   mtbf = 0,
    //   ts = 0,
    //   mttr = 0;     
    // var spnMtbf = 0,
    //   spnMttr,
    //   delay = 0,
    //   workHrs,
    //   delay_count = 0,
    //   date_diff = 0;

    // const delayColm = delayCol.map((column: Column) =>
    //   column.name.replace(/ |-/g, "")
    // );

    // const delayData = delayRow.map((values: any, row: number) => {
    //   const result: KeyValue = {};

    //   delayColm.forEach((key: string, i: any) => (result[key] = values[i]));
    //   {
    //     totalDelay += result?.DURATION ?? 0;
    //     if (
    //       parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //       parseInt(result.FAO_CD_TRBL_TYP) == 6
    //     )
    //       cnt = cnt + result?.DURATION;

    //     //if (parseInt(result.FAO_CD_TRBL_TYP) > 1 && parseInt(result.FAO_CD_TRBL_TYP) < 6)
    //     //                delay_count;

    //     if (
    //       parseInt(result.FAO_CD_TRBL_TYP) !== 1 &&
    //       parseInt(result.FAO_CD_TRBL_TYP) !== 6
    //     )
    //       delay_count++;

    //     if (cnt > 0) {
    //       if (
    //         parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //         parseInt(result.FAO_CD_TRBL_TYP) == 6
    //       ) {
    //         mtbf += result.DURATION;
    //       }
    //     }

    //     if ((dateTo || dateFrom) != "" && result.FAO_CD_SH_OUTAGE !== "All") {
    //       // ts = moment(dateTo).diff(moment(dateFrom), "days");
    //       var newdateto = new Date(dateTo);
    //       var newdatefrom = new Date(dateFrom);
    //       var get_diff = moment.duration(
    //         moment(newdateto, "MM/DD/YYYY").diff(
    //           moment(newdatefrom, "MM/DD/YYYY")
    //         )
    //       );
    //       ts = get_diff.asDays();
    //       date_diff = ts * 24;
    //       spnMtbf = (date_diff - mtbf) / delay_count;
    //     } else if (
    //       (dateTo || dateFrom) != "" &&
    //       result.FAO_CD_SH_OUTAGE === "All"
    //     ) {
    //       spnMtbf = (8.0 - mtbf) / delay_count;
    //     }

    //     //mttr result
    //     if (result?.DURATION !== 0) delay += result?.DURATION;

    //     if (cnt > 0)
    //       if (
    //         parseInt(result.FAO_CD_TRBL_TYP) == 1 &&
    //         parseInt(result.FAO_CD_TRBL_TYP) == 6
    //       )
    //         mttr += result.DURATION;

    //     spnMttr = ((delay - mttr) / delay_count).toFixed(2);
    //     return result;
    //   }
    // });
    // totalRows = delayRow.length;
    // interface IObjectKeys {
    //   [key: string]: string | number;
    // }
    // var newdateto = new Date(dateTo);
    // var newdatefrom = new Date(dateFrom);
    // var get_diff = moment.duration(
    //   moment(newdateto, "MM/DD/YYYY").diff(moment(newdatefrom, "MM/DD/YYYY"))
    // );
    // noOfDays = get_diff.asDays() + 1;
    // // noOfDays = moment(dateTo).diff(moment(dateFrom), "days") + 1;
    // workHrs = parseFloat((noOfDays * 24 - totalDelay).toFixed(2));
    // let milUtility = (workHrs / (noOfDays * 24)) * 100;

    // //Reason Data

    // const { rows }: any = await LDLTS08D.reason(locationPlant, compCode);
    // const reasonData: any = [];
    // var option = "OTHERS:DUE TO OTHER REASON"
    // rows.map(function (x: any) {
    //   reasonData.push(x[0] + ":" + x[1]);
    // });
    // reasonData.push(option)
    // return res.status(200).json({
    //   eqpData,
    //   // eqpColumn,
    //   facData,
    //   facColumn,
    //   delayData,
    //   delayColumn,
    //   totalDelay,
    //   totalRows,
    //   noOfDays,
    //   workHrs,
    //   spnMtbf,
    //   spnMttr,
    //   milUtility,
    //   reasonData,
    // });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Delete
export const deleteDetails = async (req: Request, res: Response) => {
  try {
    // var stDate = moment(req.body.cellData.FAO_TM_STOP_ST).format("DD-MM-YYYY HH:mm:ss");
    // var outageDt = req.body.cellData.OUTAGE_DT;
    // var eqpMast = req.body.cellData.FAO_CD_EQP_MAST;
    // var faqMast = req.body.cellData.FAO_CD_FAC_MAST;
    const { stDate, enDate, p_line, eqpMast, faqMast, plantCode, compCode } =
      req.body;
    //Delete
    const del: any = await LDLTS08D.deletebrk(
      stDate,
      enDate,
      p_line,
      eqpMast,
      faqMast,
      plantCode,
      compCode
    );
    return res.status(200).json(del.rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Update Delay Details
export const updateDetails = async (req: Request, res: Response) => {
  try {
    const {
      remarks,
      reason,
      stDate,
      enDate,
      p_line,
      eqpMast,
      modify_user,
      plantCode,
      compCode,
      delayAgent,
      delayCode,
      outageDt,
      processCd,
      faqMast,
      resource,
      subequip,
      isDelete
    } = req.body;
    //Delete
    const updRsn: any = await LDLTS08D.updRsn(
      remarks,
      reason,
      stDate,
      enDate,
      p_line,
      eqpMast,
      modify_user,
      plantCode,
      compCode,
      delayAgent,
      delayCode,
      outageDt,
      processCd,
      faqMast,
      resource,
      subequip,
      isDelete
    );

    return res.status(200).json(updRsn.rowsAffected);
  } catch (error:any) {
    return res.status(400).json(error?.toString());
  }
};

//Break Reason Data
export const getBreakReasonData = async (req: Request, res: Response) => {
  try {
    //Reason Data
    const { locationPlant, compCode } = req.body;
    const { rows }: any = await LDLTS08D.reason(locationPlant, compCode);

    const reasonData: any = [];
    var option = "OTHERS:DUE TO OTHER REASON"
    rows.map(function (x: any) {
      reasonData.push(x[0] + ":" + x[1]);
    });
    reasonData.push(option)

    return res.status(200).json({ reasonData });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Save Table Data
export const getSaveTableDetails = async (req: Request, res: Response) => {
  try {
    //Equip Fac
    const { reason, Reason, plantCode, compCode } = req.body;
    const { metaData: eqpFacCol, rows: eqpFacRow }: any =
      await LDLTS08D.eqpFac(reason, Reason, plantCode, compCode);

    const eqpFacColumn = eqpFacCol.map((column: Column) => ({
      title: column.name,
      field: column.name.replace(/ |-|-/g, ""),
    }));

    const eqpFacColm = eqpFacCol.map((column: Column) =>
      column.name.replace(/ |-/g, "")
    );
    const eqpFacData = eqpFacRow.map((values: any, row: number) => {
      const result: KeyValue = {};
      eqpFacColm.forEach((key: string, i: any) => (result[key] = values[i]));
      return result;
    });

    //Update Break
    const {
      endDate,
      remarks,
      Remarks,
      EquipCD,
      OutageRsnDesc,
      p_line,
      startDate,
      Shift,
      PersonalNo,
      delayAgent,
      delayCode,
      isDelete
    } = req.body;
    const updateData: any = await LDLTS08D.updbrk(
      endDate,
      reason,
      Reason,
      remarks,
      Remarks,
      EquipCD,
      OutageRsnDesc,
      p_line,
      startDate,
      Shift,
      PersonalNo,
      plantCode,
      compCode,
      delayAgent,
      delayCode,
      isDelete
    );
    return res.status(200).json({ eqpFacColumn, eqpFacData, updateData });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Insert Modal Data
export const insertModalDetails = async (req: Request, res: Response) => {
  try {
    //Insert Break
    const {
      endDate,
      reason,
      Reason,
      remarks,
      Remarks,
      coilNo,
      EquipCD,
      OutageRsnDesc,
      p_line,
      outDt,
      startDate,
      Shift,
      operator,
      plant,
      company,
      delayAgent,
      delayCode,
      resouceCode,
    } = req.body;

    const results: any = await LDLTS08D.insertbrk(
      endDate,
      reason,
      Reason,
      remarks,
      Remarks,
      coilNo,
      EquipCD,
      OutageRsnDesc,
      p_line,
      operator,
      outDt,
      startDate,
      Shift,
      plant,
      company,
      delayAgent,
      delayCode,
      resouceCode
    );

    var rowsAffected = results.rowsAffected;
    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Equipment Data
export const equipData = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var p_line = req.body.p_line;
    //execute query
    const results: any = await LDLTS08D.equipData(
      plantCode,
      compCode,
      p_line
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Add Reason Data
export const addReasonData = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.locationPlant;
    var compCode = req.body.compCode;
    //execute query
    const results: any = await LDLTS08D.addReasonData(plantCode, compCode);
    const list: any = [];
    var option = "OTHERS:DUE TO OTHER REASON"
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    list.push(option);
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//InsertDelay Data
export const insertDelayData = async (req: Request, res: Response) => {
  try {
    var shift = req.body.shift;
    var reason = req.body.reason;
    var remark = req.body.remark;
    // var coilNo = req.body.coilNo;
    var equipCode = req.body.equipCode;
    // var facilityCode=req.body.facilityCode;
    var createdUser = req.body.createdUser;
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var delayCode = req.body.delayCode;
    var delayAgent = req.body.delayAgent;
    var processLine = req.body.processLine;
    var resouceCode = req.body.resouceCode;
    var subequipcd = req.body.subequipcd;
    var results: any = await LDLTS08D.insertDelayData(
      shift,
      reason,
      remark,
      // coilNo,
      equipCode,
      createdUser,
      plantCode,
      compCode,
      fromDate,
      toDate,
      delayCode,
      delayAgent,
      processLine,
      resouceCode,
      subequipcd
    );
    return res.status(200).json(results);
  } catch (error:any) {
    return res.status(400).json(error?.toString());
  }
};

//Delay Agnet
export const delayAgent = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    //execute query
    const results: any = await LDLTS08D.delayAgent(plantCode, compCode);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[1] + ":" + x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const delayAgency = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var line = req.body.line;
    //execute query
    const results: any = await LDLTS08D.delayAgency(plantCode, line);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[1] + ":" + x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Delay Code
export const delayCode = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var agency = req.body.agency;
    let process = req.body.p_line;
    let DA = req.body.DA;


    //execute query
    // console.log('DA CONTROLLER',DA);
    const results: any = await LDLTS08D.delayCode(
      compCode,
      agency,
      plantCode,
      process,
      DA
      // p_line
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[1] + ":" + x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const delayCodeft = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var agency = req.body.agency;
    let process = req.body.p_line;
    let DA = req.body.DA;


    //execute query
    // console.log('DA CONTROLLER',DA);
    const results: any = await LDLTS08D.delayCodeft(
      compCode,
      agency,
      plantCode,
      process,
      DA
      // p_line
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[1] + ":" + x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const delayCodedisplay = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var agency = req.body.agency;
    let process = req.body.p_line;
    // let DA = req.body.DA;


    //execute query
    // console.log('DA CONTROLLER',DA);
    const results: any = await LDLTS08D.delayCodedisplay(
      compCode,
      agency,
      plantCode,
      process,
      // DA
      // p_line
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[1] + ":" + x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Process Line
export const processLine = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    //execute query
    const results: any = await LDLTS08D.processLine(plantCode);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//Plant List
export const plantList = async (req: Request, res: Response) => {
  try {
    var ad = req.body.adid;
    //execute query
    const results: any = await LDLTS08D.plantList(ad);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Resource
export const resourceData = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var stageCd = req.body.stageCd;
    var plmStatus = req.body.shiftCode;
    //execute query
    const results: any = await LDLTS08D.resourceData(plantCode, compCode, plmStatus, stageCd);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const resourceDataall = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var stageCd = req.body.stageCd;
    var plmStatus = req.body.shiftCode;
    //execute query
    const results: any = await LDLTS08D.resourceDataall(plantCode, compCode, plmStatus, stageCd);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const subequipmentData = async (req: Request, res: Response) => {
  try {
    var plantCode = req.body.plantCode;
    var compCode = req.body.compCode;
    var processValue = req.body.processValue;
    var eqicd = req.body.eqicd;
    var cda = req.body.cda;
    // console.log("CONTROLLER ",plantCode, compCode, processValue,eqicd,cda);
    //execute query
    const results: any = await LDLTS08D.subequipmentData(plantCode, compCode, processValue,eqicd,cda);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    //return results
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const subequipmentdisplay = async (req: Request, res: Response) => {
  try {
    // var plantCode = req.body.plantCode;
    // var compCode = req.body.compCode;
    // var processValue = req.body.processValue;
    // // var eqicd = req.body.eqicd;
    // var resouceCode = req.body.resouceCode;

    const { plantCode, compCode, processValue, eqicd , resouceCode } = req.body;

    // console.log(" subequipmentdisplay CONTROLLER 1",plantCode);
    // console.log(" subequipmentdisplay CONTROLLER 2", compCode);
    // console.log(" subequipmentdisplay CONTROLLER 3", processValue);
    // console.log(" subequipmentdisplay CONTROLLER 3", eqicd);
    // console.log(" subequipmentdisplay CONTROLLER 4",resouceCode);

    //execute query

    const resourceCodesArray = Array.isArray(resouceCode) ? resouceCode : [resouceCode];
    
    const results: any = await LDLTS08D.subequipmentdisplay(plantCode, compCode, processValue, eqicd,resourceCodesArray);

    return res.status(200).json(results.rows.map((x: any) => x[0]));
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const descEditID = async (req: Request, res: Response) => {
  try {
      const results: any = await LDLTS08D.descEditID(req);
      // console.log("---RESULTS descEditID--->",results);
      return res.status(200).json(results);
  } catch (error) {
      return res.status(400).json(error);
  }
};

export const notification = async (req: Request, res: Response) => {
  try {
      const results: any = await LDLTS08D.notification(req);
      // console.log("---RESULTS notification--->",results);
      return res.status(200).json(results);
  } catch (error) {
      return res.status(400).json(error);
  }
};

export const getRunnHrs = async (req: Request, res: Response) => {
  try {
      const results: any = await LDLTS08D.getRunnHrs(req);
      // console.log("---RESULTS getRunnHrs--->",results);
      return res.status(200).json(results);
  } catch (error) {
      return res.status(400).json(error);
  }
};

export const getMasterID = async (req: Request, res: Response) => {
  try {
      const results: any = await LDLTS08D.getMasterID(req);
      // console.log("---RESULTS --->",results);
      return res.status(200).json(results);
  } catch (error) {
      return res.status(400).json(error);
  }
};
