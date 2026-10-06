import { Request, Response } from "express";
import moment from "moment";
import LD01S002 from "../models/LD01S002Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getGroupPlant = async (req: Request, res: Response) => {
  try {
    let id = req.body.adid;
    const results: any = await LD01S002.prototype.getGroupPlant(id);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    // let id = req.body.adid;
    const results: any = await LD01S002.prototype.getSchedules(req?.body);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const generateScheduleId = async (req: Request, res: Response) => {
  try {
    //const selectedData = req.body?.selectedRowsData;
    let totalRowsAffected = 0;

    let result = await LD01S002.prototype.generateScheduleId(req?.body);
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

export const getProcessList = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await LD01S002.prototype.getProcessList(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    let process = req.body.process;
    const results: any = await LD01S002.prototype.getStatus(process);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getResqtyval = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    const results: any = await LD01S002.prototype.getResqtyval(Plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getScheduleData = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let status = req.body.status;
    const results: any = await LD01S002.prototype.getScheduleData(
      plant,
      status
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

export const getCoils = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getCoils(req);
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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getOrders(req);

    // Check if results are empty or null
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    console.error(error); // Log the error for debugging

    if (error instanceof Error) {
      // Check if error is an instance of Error
      return res.status(500).json({
        message: "An error occurred while fetching orders.",
        error: error.message,
      });
    } else {
      return res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const getOrdersNonBOM = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getOrdersNonBOM(req);

    // Check if results are empty or null
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }
    // console.log(await results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    console.error(error); // Log the error for debugging

    if (error instanceof Error) {
      // Check if error is an instance of Error
      return res.status(500).json({
        message: "An error occurred while fetching orders.",
        error: error.message,
      });
    } else {
      return res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const compute = async (req: Request, res: Response) => {
  try {
    //    var resDt: any = await LD01S002.prototype.chemChkSlt(req);
    //     let results: any  = [];
    //     results.push(resDt.rows);
    //     if (results.toString().startsWith("N-")) {
    //         return res.status(200).json(results);
    //     }
    //     else
    //     {
    //     var resCompute = await LD01S002.prototype.compute(req);
    //         return res.status(200).json(resCompute)
    //     }

    const results: any = await LD01S002.prototype.compute(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// export const confirm = async (req: Request, res: Response) => {
//   try {
//     console.log(req.body);
//     let recvData = {
//       newDataRm: req.body.newDataRm,
//       newDataOrd: req.body.newDataOrd,
//       newDataSched: req.body.newDataSched,
//       scheduleId: req.body.scheduleId,
//       schedulePriority: req.body.schedulePriority,
//     };

//     // Calculate counts for each unique txtSchBatch
//     const batchCounts: { [key: string]: number } = {};
//     if (recvData?.newDataSched) {
//       recvData.newDataSched.forEach((scheduleItem: any) => {
//         const batch = scheduleItem.txtSchBatch;
//         batchCounts[batch] = (batchCounts[batch] || 0) + 1;
//       });
//     }

//     var checkPass = "Y";
//     await LD01S002.prototype.delete_tempsched(
//       recvData?.newDataSched[0]?.txtSchBatch
//     );

//     // Loop through each scheduled data
//     for (var i = 0; i < recvData?.newDataSched.length; i++) {
//       const currentSchedule = recvData.newDataSched[i];

//       // Find the matching order in newDataOrd
//       const matchingOrder = recvData.newDataOrd.find(
//         (order: any) =>
//           order.ENC_ID_ORDER === currentSchedule.txtSchOrder &&
//           order.ENC_NO_ITEM === currentSchedule.txtSchItem
//       );

//       // Store corresponding TMM_FG_MAT and TMM_SFG_MAT or set to null if not found
//       const TMM_FG_MAT = matchingOrder ? matchingOrder.FG_MATERIAL : null;
//       const TMM_SFG_MAT = matchingOrder ? matchingOrder.TMM_SFG_MAT : null;
//       var BOM_FLAG = "BOM";
//       if (matchingOrder?.TMM_RM_MAT === "NONBOM") {
//         BOM_FLAG = "NON_BOM";
//       }
//       console.log(TMM_FG_MAT, TMM_SFG_MAT);
//       // Prepare the data object with the new fields
//       let data = {
//         CHK_COIL: "Y",
//         PPH_CD_PROC_PATH: "",
//         NBT_EPL_CD_EPA: "0780",
//         NBT_PROC_LINE: "1",
//         CHK_ORDER: recvData?.schedulePriority,
//         NBT_CUS_ORD: currentSchedule.txtSchOrder,
//         NBT_ITEM: currentSchedule.txtSchItem,
//         NBT_ORD_QTY: currentSchedule.txtSchRmwt,
//         NBT_MATNR: TMM_FG_MAT, // Using TMM_FG_MAT
//         NBT_ROLLCHAIN: "MILL1",
//         NBT_MOTHER_BATCH: currentSchedule.txtSchBatch,
//         NBT_CL_MATNR: recvData?.newDataRm[0]?.MATERIL_NO,
//         NBT_FG_WT: currentSchedule.txtSchPlantwt,
//         P_SFG_MATNR: TMM_SFG_MAT, // Using TMM_SFG_MAT
//         P_SCHED_COUNT: batchCounts[currentSchedule.txtSchBatch] || 0,
//         P_PLNG_REMARKS: currentSchedule.txtSchRemarks,
//         scheduleId: recvData?.scheduleId,
//         BOM_FLAG: BOM_FLAG,
//       };

//       console.log(data);
//       //return res.status(200).json("N-schedule gaya");
//       var results: any = await LD01S002.prototype.confirm(data);
//       console.log(results);
//       var outBinds = results.outBinds.LS_OUT_FLAG;

//       if (outBinds.toString().startsWith("N-")) {
//         checkPass = outBinds.toString();
//         console.log("hello");
//         return res.status(400).json(checkPass);
//       }
//     }

//     if (checkPass === "Y") {
//       const results2: any = await LD01S002.prototype.confirmMain(
//         recvData?.newDataSched[0]?.txtSchBatch
//       );
//       checkPass = results2.outBinds.LS_OUT_FLAG;
//     }

//     return res.status(200).json(checkPass);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

export const confirm = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    let recvData = {
      newDataRm: req.body.newDataRm,
      newDataOrd: req.body.newDataOrd,
      newDataSched: req.body.newDataSched,
      scheduleId: req.body.scheduleId,
      schedulePriority: req.body.schedulePriority,
    };

    // Calculate counts for each unique txtSchBatch
    const batchCounts: { [key: string]: number } = {};
    const distinctBatches: string[] = []; // Using an array to store unique txtSchBatch values

    if (recvData?.newDataSched) {
      recvData.newDataSched.forEach((scheduleItem: any) => {
        const batch = scheduleItem.txtSchBatch;
        batchCounts[batch] = (batchCounts[batch] || 0) + 1;

        // Add batch to distinctBatches array only if it's not already present
        if (!distinctBatches.includes(batch)) {
          distinctBatches.push(batch);
        }
      });
    }

    var checkPass = "Y";

    // --- REVISED LOGIC: Call delete_tempsched for EACH distinct batch, but ignore its direct result ---
    if (distinctBatches.length > 0) {
      for (const batch of distinctBatches) {
        try {
          await LD01S002.prototype.delete_tempsched(batch);
          // console.log(`Temp schedule deleted successfully for batch: ${batch}`); // Optional: log success
        } catch (deleteError) {
          console.error(
            `Error deleting temp schedule for batch ${batch}:`,
            deleteError
          );
          // Errors are logged, but `checkPass` is NOT affected, and no error message is returned for this step.
        }
      }
    }
    // --- NEW: specCheck validation before confirm loop ---
    for (var i = 0; i < recvData.newDataSched.length; i++) {
      const currentSchedule = recvData.newDataSched[i];

      try {
        const specResult: any = await LD01S002.prototype.specCheck(
          currentSchedule.txtSchBatch,
          currentSchedule.txtSchOrder,
          currentSchedule.txtSchItem
        );

        const specFlag = specResult.outBinds.LS_OUT_FLAG;

        console.log("specCheck result:", specFlag);

        // If result does NOT start with 'Y', stop processing immediately
        if (!specFlag.toString().startsWith("Y")) {
          return res.status(200).json(specFlag);
        }
      } catch (specError) {
        console.error(
          `Error during specCheck for batch ${currentSchedule.txtSchBatch}:`,
          specError
        );
        return res.status(200).json("N-Error during specCheck validation.");
      }
    }

    // Loop through each scheduled data for initial confirmation calls
    for (var i = 0; i < recvData.newDataSched.length; i++) {
      const currentSchedule = recvData.newDataSched[i];

      // Find the matching order in newDataOrd
      const matchingOrder = recvData.newDataOrd.find(
        (order: any) =>
          order.ENC_ID_ORDER === currentSchedule.txtSchOrder &&
          order.ENC_NO_ITEM === currentSchedule.txtSchItem
      );

      // Store corresponding TMM_FG_MAT and TMM_SFG_MAT or set to null if not found
      const TMM_FG_MAT = matchingOrder ? matchingOrder.FG_MATERIAL : null;
      const TMM_SFG_MAT = matchingOrder ? matchingOrder.TMM_SFG_MAT : null;
      var BOM_FLAG = "BOM";
      if (matchingOrder?.TMM_RM_MAT === "NONBOM") {
        BOM_FLAG = "NON_BOM";
      }
      console.log(TMM_FG_MAT, TMM_SFG_MAT);
      // Prepare the data object with the new fields
      let data = {
        CHK_COIL: "Y",
        PPH_CD_PROC_PATH: "",
        NBT_EPL_CD_EPA: "0780",
        NBT_PROC_LINE: "1",
        CHK_ORDER: recvData?.schedulePriority,
        NBT_CUS_ORD: currentSchedule.txtSchOrder,
        NBT_ITEM: currentSchedule.txtSchItem,
        NBT_ORD_QTY: currentSchedule.txtSchRmwt,
        NBT_MATNR: TMM_FG_MAT, // Using TMM_FG_MAT
        NBT_ROLLCHAIN: "MILL1",
        NBT_MOTHER_BATCH: currentSchedule.txtSchBatch,
        NBT_CL_MATNR: recvData?.newDataRm[0]?.MATERIL_NO,
        NBT_FG_WT: currentSchedule.txtSchPlantwt,
        P_SFG_MATNR: TMM_SFG_MAT, // Using TMM_SFG_MAT
        P_SCHED_COUNT: batchCounts[currentSchedule.txtSchBatch] || 0,
        P_PLNG_REMARKS: currentSchedule.txtSchRemarks,
        scheduleId: recvData?.scheduleId,
        BOM_FLAG: BOM_FLAG,
        NBT_NO_OF_TUBES: currentSchedule?.txtSchNoTubes,
      };

      console.log(data);
      var results: any = await LD01S002.prototype.confirm(data);
      console.log(results);
      var outBinds = results.outBinds.LS_OUT_FLAG;

      if (outBinds.toString().startsWith("N-")) {
        checkPass = outBinds.toString();
        console.log("An individual confirm call failed:", checkPass);
        return res.status(200).json(checkPass); // Return error immediately if any individual confirm fails
      }
    }

    // --- Logic for Calling confirmMain for each distinct batch ---
    const confirmMainResults: string[] = []; // Array to collect results from confirmMain calls
    let hasConfirmMainErrors = false;

    if (checkPass === "Y") {
      // Only proceed with confirmMain calls if all individual confirms passed
      for (const batch of distinctBatches) {
        // Iterate over the array of unique batches
        try {
          const results2: any = await LD01S002.prototype.confirmMain(batch);
          const mainOutFlag = results2.outBinds.LS_OUT_FLAG;
          confirmMainResults.push(`Batch ${batch}: ${mainOutFlag}`); // Store result for each batch
          if (mainOutFlag.toString().startsWith("N-")) {
            hasConfirmMainErrors = true;
          }
        } catch (confirmMainError) {
          console.error(
            `Error calling confirmMain for batch ${batch}:`,
            confirmMainError
          );
          confirmMainResults.push(`Batch ${batch}: N-Error during confirmMain`);
          hasConfirmMainErrors = true;
        }
      }
    }

    // Final response logic, only based on individual confirm calls and confirmMain results
    if (checkPass.startsWith("N-") || hasConfirmMainErrors) {
      // If any individual confirm call failed, or any confirmMain call failed
      return res.status(200).json(confirmMainResults.join("\n"));
    } else if (confirmMainResults.length > 0) {
      // All succeeded, return all confirmMain results
      return res.status(200).json(confirmMainResults.join("\n"));
    } else {
      // No batches to confirmMain for (e.g., newDataSched was empty)
      return res
        .status(200)
        .json(
          "Y-Operation completed successfully (no batches to confirmMain for)."
        );
    }
  } catch (error) {
    // It's good practice to log the actual error on the server side
    console.error("An unhandled error occurred in confirm function:", error);
    // And send a more generic, safe error message to the client
    return res
      .status(400)
      .json("An unexpected error occurred during schedule processing.");
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

    const results: any = await LD01S002.prototype.GetOrdFilter(
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

export const getOrdTyp = async (req: Request, res: Response) => {
  try {
    // var
    const results: any = await LD01S002.prototype.getOrdTyp();
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
    let { Plant, Batch, ProcLine, workcenter } = req.body;
    const results: any = await LD01S002.prototype.GetBatchDtl(
      Plant,
      Batch,
      ProcLine,
      workcenter
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
    const results: any = await LD01S002.prototype.GetPdiDtl(
      Plant,
      Batch,
      Process,
      ProdDate,
      MBatch,
      BusUnit,
      Odia,
      status
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
    let workCenter = req.body.workCenter;
    const results: any = await LD01S002.prototype.GetMCoilList(
      Plant,
      Process,
      workCenter
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetODIA = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    let Process = req.body.Process;
    const results: any = await LD01S002.prototype.GetODIA(Plant, Process);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getShiftStatus = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getShiftStatus(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getProductionType = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getProductionType(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBatchCount = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getBatchCount(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getWorkCenterList = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getWorkCenterList(req);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getScrapProductionTable = async (req: Request, res: Response) => {
  try {
    let results = await LD01S002.prototype.getScrapProductionTable(req);
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
    var results = await LD01S002.prototype.GetBatchDtlforLP_daughter(
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
    const results: any = await LD01S002.prototype.getHoldRsnDetails(req);
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
    var resDt: any = await LD01S002.prototype.GetPdiDtlMultiLot(
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
export const CRTScheduleMerge = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.CRTScheduleMerge(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const InsertSlitProd = async (req: Request, res: Response) => {
  try {
    var errorString = "";
    var error = false;
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
    } = req.body;
    //delete temp
    var resDel: any = await LD01S002.prototype.delete_tempprod(
      Plant,
      Batch,
      user
    );

    for (var i = 0; i < newData.length; i++) {
      var ele = newData[i];
      uom = newData[0].EWI_UOM;
      var fg = "FG";
      console.log(ele.prdPStartDt);
      var results: any = await LD01S002.prototype.SPCB004_TEMP_Insert(
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
        fg
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        error = true;
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

      var results: any = await LD01S002.prototype.SPCB004_TEMP_Insert(
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
        scrap
      );
      var flag = results.outBinds.LS_OUT_FLAG;
      errorData = results.outBinds.LS_OUT_FLAG;
      if (flag.toString().startsWith("N-")) {
        error = true;
        errorString +=
          " Error for batch Scrap" +
          scrapData[i].SCRAP_BATCH_ID +
          " -- " +
          flag.toString().replace("N-", "");
      }
    }

    if (!error) {
      var ins_khapoli: any = await LD01S002.prototype.Insert_Khapoli(
        Plant,
        Batch,
        Process,
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
    return res.status(400).json(error);
  }
};
export const getBatchId = async (req: Request, res: Response) => {
  try {
    let Plant = req.body.Plant;
    const results: any = await LD01S002.prototype.getBatchId(Plant);
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

    const results: any = await LD01S002.prototype.GetInqDetl(
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
      var results: any = await LD01S002.prototype.ScheduleDel(Plant, ele);
      resDt = results;
    }
    return res.status(200).json(resDt);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const ScheduleDelMerge = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.ScheduleDelMerge(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getWorkCenter = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getWorkCenter(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMergeBatchDetails = async (req: Request, res: Response) => {
  try {
    const results: any = await LD01S002.prototype.getMergeBatchDetails(req);
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
