import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= :status
        and LOM_CD_EPA='0780'`;
    let binds = {
      status: status,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getFillData = async (rmBatch: any, status: any, pipeid: any) => {
//   try {
//     console.log("rmBatch: ", rmBatch);
//     console.log("status: ", status);
//     // Step 1: First, get the CD_VALUE from V_CODES
//     const cdValueQuery = `SELECT CD_DESC FROM V_CODES WHERE CD_TYPE = 'LDP110' AND CD_VALUE=substr('${status}',1,1)`;
//     const cdValueResults = await query.executeQuery(cdValueQuery);
//     console.log(cdValueResults);
//     // Step 2: Construct a list of columns based on CD_VALUE
//     const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
//     const additionalColumns = cdValues.join(", "); // Join the values into a string

//     // Step 3: Construct the main SQL query
//     let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2,
//                   LOM_LENGTH,TBP_REMARK, ${additionalColumns}
//                   FROM V_LDP_PRODN , V_BARE_PDO
//                   WHERE LOM_ID_BATCH = TBP_BATCH_NO
//                   AND LOM_CD_STATUS = '${status}'
//                   AND LOM_CD_EPA ='0780'`;

//     if (rmBatch !== "") {
//       sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
//     }
//     if (pipeid !== "") {
//       sql += ` AND LOM_ID_Batch = '${pipeid}'`;
//     }
//     console.log("pipeno", sql);
//     // console.log("bindspipe",binds)
//     return await query.executeQuery(sql);
//   } catch (error) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };
export const getFillData = async (rmBatch: any, status: any, pipeid: any) => {
  try {
    //Dynamic col fetching not required anymore. Uncomment if required in future.
    // Step 1: First, get the CD_VALUE from V_CODES
    // const cdValueQuery = `SELECT CD_DESC FROM V_CODES WHERE CD_TYPE = 'LDP110' AND CD_VALUE=substr('${status}',1,1)`;
    // const cdValueResults = await query.executeQuery(cdValueQuery);
    // console.log(cdValueResults);

    // Step 2: Construct a list of columns based on CD_VALUE
    // const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
    // const additionalColumns = cdValues.length > 0 ? cdValues.join(", ") : ""; // Join the values into a string only if they exist

    // Step 3: Construct the main SQL query
    // let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2,
    //               LOM_LENGTH,
    //               TBP_REMARK ${
    //                 additionalColumns ? ", " + additionalColumns : ""
    //               }
    //               FROM V_LDP_PRODN, V_BARE_PDO
    //               WHERE LOM_ID_BATCH = TBP_BATCH_NO
    //               AND LOM_CD_CURR_PROC=TBP_CD_PROC
    //               AND LOM_CD_STATUS = '${status}'
    //               AND LOM_CD_EPA ='0780'`;

    let sql = `SELECT LOM_ID_BATCH BATCH_ID, LOM_ID_PAR_COIL_NO PARENT_BATCH,
    LOM_SEC1 THICK, LOM_SEC2 ODIA, 
    LOM_LENGTH LENGTH, TBP_REMARK MILL_REMARKS
    FROM V_LDP_PRODN, V_BARE_PDO
    WHERE LOM_ID_BATCH = TBP_BATCH_NO
    AND LOM_CD_CURR_PROC = TBP_CD_PROC
    AND LOM_CD_STATUS = '${status}'
    AND LOM_CD_EPA ='0780'`;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    if (pipeid !== "") {
      sql += ` AND LOM_ID_Batch = '${pipeid}'`;
    }

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const confirm = async (holdData: any, columns: any) => {
//   try {
//     console.log();

//     let sql = `call SPCB031_CONFIRM_1(
//         P_MANDT => :P_MANDT,
//         P_PLANT => :P_PLANT,
//         P_BATCHID => :P_BATCHID,
//         P_PROC_LINE => :P_PROC_LINE,
//         P_LOOP_CNT => :P_LOOP_CNT,
//         P_TEXT1 => :P_TEXT1,
//         P_TEXT2 => :P_TEXT2,
//         P_TEXT3 => :P_TEXT3,
//         P_TEXT4 => :P_TEXT4,
//         P_TEXT5 => :P_TEXT5,
//         P_TEXT6 => :P_TEXT6,
//         P_TEXT7 => :P_TEXT7,
//         P_TEXT8 => :P_TEXT8,
//         P_TEXT9 => :P_TEXT9,
//         P_TEXT10 => :P_TEXT10,
//         P_YIELDPER => :P_YIELDPER,
//         P_YLDSMETUP => :P_YLDSMETUP,
//         LS_OUT_FLAG => :LS_OUT_FLAG
//       )`;

//     let binds = {
//       P_MANDT: req.body.mandt,
//       P_PLANT: req.body.Plant,
//       P_BATCHID: req.body.BatchId,
//       P_PROC_LINE: req.body.ProcLine,
//       P_LOOP_CNT: req.body.loop_cnt,
//       P_TEXT1: "",
//       P_TEXT2: "",
//       P_TEXT3: "",
//       P_TEXT4: "",
//       P_TEXT5: "",
//       P_TEXT6: "",
//       P_TEXT7: "",
//       P_TEXT8: "",
//       P_TEXT9: "",
//       P_TEXT10: "",
//       P_YIELDPER: null,
//       P_YLDSMETUP: "",
//       LS_OUT_FLAG: {
//         type: oracledb.STRING,
//         dir: oracledb.BIND_OUT,
//         maxSize: 500,
//       },
//     };
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const confirm = async (holdData: any, process: any, inspector: any) => {
  try {
    // console.log("Starting confirmation process...");
    // console.log("holdData: ", holdData);
    // console.log("process: ", process);
    // console.log("inspector: ", inspector);

    // Step 1: Prepare the SQL update statement for the V_BARE_PDO table
    // const updateColumns = Object.keys(holdData)
    //   .filter((col) => col.startsWith("TBP")) // Get all columns starting with TBP
    //   .map((col) => `${col} = :${col}`);

    // Create the full update SQL statement
    // const updateSql = `
    //   UPDATE V_BARE_PDO
    //   SET ${updateColumns.join(", ")}
    //   WHERE
    //   TBP_BATCH_NO = :LOM_ID_BATCH
    //   AND TBP_CD_PROC = substr(:process,1,1)
    //   AND TBP_BATCH_PROC_NO = (SELECT MAX(TBP_BATCH_PROC_NO)
    //                             FROM V_BARE_PDO
    //                             WHERE TBP_BATCH_NO = :LOM_ID_BATCH
    //                             AND TBP_CD_PROC = substr(:process,1,1))`; // Assuming this is the correct condition

    // Prepare the bind variables for the update based only on what we need
    // const updateBinds = {
    //   LOM_ID_BATCH: holdData.LOM_ID_BATCH,
    //   process: process,
    // };

    // Include only TBP columns in updateBinds
    // updateColumns.forEach((col) => {
    //   const columnName = col.split(" = ")[0]; // Extract the column name from the assignment
    //   updateBinds[columnName] = holdData[columnName]; // Assign the value from holdData
    // });
    // console.log(updateSql, updateBinds);
    // Step 2: Execute the update query
    // await query.executeQuery(updateSql, updateBinds);

    // Step 3: Prepare the call for the LD01B004 procedure
    let sql = `CALL LDPDBA.LD01B006(
        P_PIPEID   => :P_PIPEID,
        P_PROCESS => :P_PROCESS,
        P_RESULT  => :P_RESULT,
        P_REMARKS  => :P_REMARKS,
        P_INSPECTOR  => :P_INSPECTOR,
        LS_OUT_FLAG  => :LS_OUT_FLAG
      )`;

    // Prepare bind variables for the procedure call
    let procedureBinds = {
      P_PIPEID: holdData?.BATCH_ID,
      P_RESULT: holdData?.RESULT,
      P_REMARKS: holdData?.REMARK,
      P_INSPECTOR: inspector,
      P_PROCESS: process ? process.charAt(0) : " ",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    // console.log("procedureBinds: ", procedureBinds);

    // Execute the stored procedure
    return await query.executeQuery(sql, procedureBinds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
