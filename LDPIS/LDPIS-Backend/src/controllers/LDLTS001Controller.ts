import { Request, Response } from "express";
import moment from "moment";
import LDLTS001 from "../models/LDLTS001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LDLTS001.prototype.getRmList(status);
    // console.log(results);
    // console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getHeatList = async (req: Request, res: Response) => {
  try {
    let status = " ";
    const results: any = await LDLTS001.prototype.getHeatList(status);
    // console.log(results);
    // console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LDLTS001.prototype.getPipeNoList(
      rmBatch,
      status
    );
    // console.log(results);
    // console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getHeatData = async (req: Request, res: Response) => {
  try {
    const results: any = await LDLTS001.prototype.getHeatData(req.body);
    // console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTestResults = async (req: Request, res: Response) => {
  try {
    // console.log("INSIDE");
    const results: any = await ResponceData(
      await LDLTS001.prototype.getTestResults(req?.body)
    );
    console.log("results: ", results);

    // Create a map to handle aggregation of results
    const pivotMap: { [key: string]: any } = {};

    // Transform the results
    results.forEach((curr: any) => {
      // Create a unique key based on the essential properties
      const key = `${curr.FPT_CD_EPA}-${curr.FPT_ID_PIPE}-${curr.FPT_NO_CAST}-${curr.FPT_TEST_CD}-${curr.FPT_CD_LOC}`; //-${curr.FTP_TEST_REMARK}-${curr.FPT_INSPEC_NM}-${curr.FPT_CRT_DT}

      // If the key doesn't exist in the pivotMap, create a new entry
      if (!pivotMap[key]) {
        pivotMap[key] = {
          PLANT: curr.FPT_CD_EPA,
          BATCH: curr.FPT_ID_PIPE,
          HEAT_NO: curr.FPT_NO_CAST,
          REPORT_TYPE: curr.FPT_TEST_CD,
          FPT_CD_LOC: curr.FPT_CD_LOC,
          FPT_CD_SEQ: curr.FPT_CD_SEQ,
          FTP_TEST_REMARK: curr.FTP_TEST_REMARK,
          FPT_TEST_PARA_RESULT: curr.FPT_TEST_PARA_RESULT,
          FPT_TEST_PARA_REM: curr.FPT_TEST_PARA_REM,
          FPT_INSPEC_NM: curr.FPT_INSPEC_NM,
          FPT_CRT_DT: curr.FPT_CRT_DT,
        };
      } else {
        // Aggregate the result if it already exists
        if (curr.FPT_TEST_PARA_RESULT) {
          pivotMap[key].FPT_TEST_PARA_RESULT = curr.FPT_TEST_PARA_RESULT; // Ensure we capture the value
        }
      }
      // console.log("API Response: ", results);

      // Add the dynamic property based on FPT_TEST_PARA
      pivotMap[key][curr.FPT_TEST_PARA] = curr.FPT_TEST_PARA_VAL;
    });

    // Convert the pivotMap object into an array
    const pivotData = Object.values(pivotMap);

    console.log("pivotData: ", pivotData);
    return res.status(200).json(pivotData); // Return the array of pivoted data
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// export const getTestResults = async (req: Request, res: Response) => {
//   try {
//     console.log("INSIDE")
//     const results: any = await ResponceData(
//       await LDLTS001.prototype.getTestResults(req?.body)
//     );
//     console.log("results: ", results);
//     // Pivot transformation logic
//     const pivotData = results.reduce((acc: any, curr: any) => {
//       // Initialize the base structure if not already done
//       if (!acc.FPT_CD_EPA) {
//         acc.PLANT = curr.FPT_CD_EPA;
//         acc.BATCH = curr.FPT_ID_PIPE;
//         acc.HEAT_NO = curr.FPT_NO_CAST;
//         acc.REPORT_TYPE = curr.FPT_TEST_CD;
//         acc.FPT_CD_LOC = curr.FPT_CD_LOC;
//         acc.FPT_CD_SEQ = curr.FPT_CD_SEQ;
//         acc.FPT_TEST_PARA_RESULT = curr.FPT_TEST_PARA_RESULT;
//         acc.FPT_TEST_PARA_REM = curr.FPT_TEST_PARA_REM;
//       }
//       // Add the dynamic property based on FPT_TEST_PARA
//       acc[curr.FPT_TEST_PARA] = curr.FPT_TEST_PARA_VAL;
//       return acc;
//     }, {});

//     console.log("pivotData: ", pivotData)
//     // console.log(await ResponceData([pivotData]), pivotData, [pivotData]); // Wrap the transformed data in an array for consistency
//     return res.status(200).json([pivotData]);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error);
//   }
// };

export const getFillData = async (req: Request, res: Response) => {
  try {
    let status = req?.body?.status;
    let rmBatch = req?.body?.RM_BATCH;
    let pipeid = req?.body?.PIPE_NO;
    const results: any = await LDLTS001.prototype.getFillData(
      rmBatch,
      status,
      pipeid
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
    console.log(error);
    return res.status(400).json(error);
  }
};

export const inserttestdetails = async (req: Request, res: Response) => {
  try {
    // console.log("Controlletr1",req.body);
    let recvData = {
      newTableData: req?.body?.newTableData,
      reportType: req?.body?.reportType,
      inspector: req?.body?.inspector,
      shiftDate: req?.body?.shiftDate,
      action: req?.body?.action,
      resultrm: req?.body?.resultrm, // Capture RESULT field
    };
    // console.log("controller2",recvData);
    //let dt=req.body;
    var resultCheck: any = await LDLTS001.prototype.checkStatusInsert(
      recvData?.newTableData?.[0]?.BATCH
    );
    console.log(
      resultCheck,
      recvData?.newTableData?.[0]?.BATCH,
      recvData?.newTableData?.[0]
    );
    if (resultCheck === "N") {
      return res.status(200).json("N-Cannot update/insert in current status");
    }
    var checkPass = "Y";
    // console.log();
    for (var i = 0; i < recvData?.newTableData.length; i++) {
      //initalize variables
      let totalRowsAffected = 0;
      var result: any = await LDLTS001.prototype.insertTestResults(
        recvData?.newTableData?.[i],
        recvData?.reportType,
        recvData?.shiftDate,
        recvData?.inspector,
        recvData?.action,
        recvData?.resultrm[i] // Pass RESULT for each entry
      );
      if (result) {
        totalRowsAffected += result;
      }
      var result2: any;
      if (totalRowsAffected >= 1) {
        result2 = "Y";
      } else {
        result2 = "N";
      }
    }
    // console.log(result, result2);
    return res.status(200).json(result2);
    //return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
