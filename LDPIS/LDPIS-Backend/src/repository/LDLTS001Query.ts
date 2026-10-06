import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import { ResponceData } from "../utils";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB041' )
        and LOM_CD_EPA='0780'`;

    if (status !== "") {
      sql += ` AND LOM_NO_CAST = '${status}'`;
    }

    // console.log("rmlist", sql);
    //console.log(binds);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTestResults = async (req: any) => {
  try {
    // console.log("req: ", req);
    if (req.REPORT_TYPE === "IP") {
      // console.log('1111111111111111111111111111111111111111111111111111111');
      let sql = `select FPT_CD_EPA,FPT_ID_PIPE,FPT_INSPEC_NM,FPT_CRT_DT,FPT_NO_CAST,FPT_TEST_CD,FPT_CD_LOC,FPT_CD_SEQ,FPT_TEST_PARA,FPT_TEST_PARA_VAL, FPT_TEST_PARA_RESULT, FTP_TEST_REMARK
        from V_FG_PIPE_TEST_RSLT
       WHERE FPT_ID_PIPE=:BATCH_ID
       AND FPT_TEST_CD=:REPORT_TYPE
       --AND FPT_CD_LOC=1
       AND FPT_CD_SEQ=1`;
      let binds = {
        BATCH_ID: req?.BATCH_ID,
        REPORT_TYPE: req?.REPORT_TYPE,
      };
      // console.log("getTestResults",sql,binds);
      let resIp = await query.executeQuery(sql, binds);
      // console.log("resIp: ", resIp);
      return resIp;
    } else {
      // console.log("Inside TP");
      // console.log('22222222222222222222222222222222222222222222222222');
      let sql = `select FPT_CD_EPA,FPT_ID_PIPE,FPT_NO_CAST,FPT_INSPEC_NM,FPT_CRT_DT,FPT_TEST_CD,FPT_CD_LOC,FPT_CD_SEQ,FPT_TEST_PARA,FPT_TEST_PARA_VAL, FPT_TEST_PARA_REM, FPT_TEST_PARA_RESULT, FTP_TEST_REMARK
        from V_FG_PIPE_TEST_RSLT
       WHERE FPT_ID_PIPE=:BATCH_ID
       AND FPT_TEST_CD=:REPORT_TYPE
       --AND FPT_CD_LOC=1
       AND FPT_CD_SEQ=1`;
      let binds = {
        BATCH_ID: req?.BATCH_ID,
        REPORT_TYPE: req?.REPORT_TYPE,
      };
      // console.log("sql: ", sql);
      // console.log("binds: ", binds);
      let result = await query.executeQuery(sql, binds);
      // console.log("result: ", result);
      return result;
    }
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHeatList = async (status: any) => {
  try {
    let sql = `select DISTINCT LOM_NO_CAST from V_LDP_PRODN
        WHERE LOM_CD_STATUS in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB041' )
        and LOM_CD_EPA='0780'`;

    // console.log("rmlist", sql);
    //console.log(binds);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const checkStatusInsert = async (batch: any) => {
  try {
    const checkStatus = `
    select COUNT(*) AS COUNT FROM V_CODES WHERE
      CD_VALUE IN (SELECT LOM_CD_STATUS FROM V_LDP_PRODN WHERE LOM_ID_BATCH='${batch}')
      AND CD_TYPE='TB041'
      AND CD_DESC='EDITABLE'`;
    console.log(checkStatus);
    const resultCheck = await ResponceData(
      await query.executeQuery(checkStatus)
    );
    console.log(resultCheck, resultCheck?.[0]?.COUNT);
    if (resultCheck?.[0]?.COUNT === 0) {
      return "N";
    }
    return "Y";
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTestResults = async (
  newTableData: any[],
  reportType: string,
  shiftDate: string,
  inspector: string,
  action: string,
  resultrm: string
) => {
  try {
    // Ensure newTableData is an array
    if (!Array.isArray(newTableData)) {
      console.warn("newTableData is not an array; converting to array.");
      newTableData = [newTableData];
    }
    console.log("newdatatable at start", newTableData);
    // console.log(
    //   "newTableData:",
    //   newTableData,
    //   "reportType:",
    //   reportType,
    //   "shiftDate:",
    //   shiftDate,
    //   "inspector:",
    //   inspector,
    //   "action:",
    //   action
    // );

    // Define the type for inserts
    type InsertData = {
      FPT_CD_EPA: string;
      FPT_NO_CAST: string;
      FPT_ID_PIPE: string;
      FPT_CD_LOC: string;
      FPT_TEST_PARA_REM: string;
      FPT_CD_SEQ: number;
      FPT_TEST_CD: string;
      FPT_TEST_PARA: string;
      FPT_TEST_PARA_VAL: number;
      FTP_TEST_REMARK: string;
    };

    // Initialize the array for inserts
    const inserts: InsertData[] = [];

    newTableData.forEach((row: any) => {
      // Ensure valid row format and remove 'undefined' keys
      const validRow = Object.keys(row).reduce((acc: any, key) => {
        if (key !== "undefined") {
          if (key === "FPT_TEST_PARA_RESULT") {
            if (reportType === "TP") {
              acc["F_MECH_RESULT"] = row[key];
            } else if (reportType === "CP") {
              acc["F_CHEM_RESULT"] = row[key];
            } else if (reportType === "HT") {
              acc["F_HARD_RESULT"] = row[key];
            } else if (reportType === "IP") {
              acc["F_IMP_RESULT"] = row[key];
            } else if (reportType === "DWTT") {
              acc["F_DWTT_RESULT"] = row[key];
            }
          } else {
            acc[key] = row[key];
          }
        }
        return acc;
      }, {});

      const {
        PLANT,
        HEAT_NO,
        BATCH,
        FPT_CD_LOC,
        FPT_TEST_PARA_REM,
        REPORT_TYPE,
        FTP_TEST_REMARK,
        ...testParameters
      } = validRow;

      // Define common values shared across test parameters
      const commonValues: Omit<
        InsertData,
        "FPT_TEST_PARA" | "FPT_TEST_PARA_VAL"
      > = {
        FPT_CD_EPA: PLANT,
        FPT_NO_CAST: HEAT_NO,
        FPT_ID_PIPE: BATCH,
        FPT_TEST_CD: REPORT_TYPE,
        FTP_TEST_REMARK: FTP_TEST_REMARK,
        FPT_CD_LOC: FPT_CD_LOC ?? "1", // Example hardcoded value, adjust as needed
        FPT_TEST_PARA_REM: FPT_TEST_PARA_REM,
        FPT_CD_SEQ: 1, // Example sequential value, adjust as needed
      };

      Object.keys(testParameters).forEach((key) => {
        let parameterValue = parseFloat(testParameters[key]) || 0; // Parse the parameter value initially

        // --- Start of new rounding logic ---
        switch (reportType) {
          case "TP":
            const tpIntegerParams = [
              "AREA_B",
              "AREA_W",
              "YS_B",
              "YS_W",
              "UTS_B",
              "UTS_W",
              "MGL",
            ];
            if (tpIntegerParams.includes(key)) {
              parameterValue = Math.round(parameterValue); // Round to integer
            } else {
              parameterValue = parseFloat(parameterValue.toFixed(2)); // Round to 2 decimal places
            }
            break;
          case "IP":
            parameterValue = Math.round(parameterValue); // Round to integer
            break;
          case "HT":
            if (key === "GRN_SIZE") {
              parameterValue = parseFloat(parameterValue.toFixed(1)); // Round to 1 decimal place
            } else {
              parameterValue = Math.round(parameterValue); // Round to integer
            }
            break;
          case "CP":
            parameterValue = parseFloat(parameterValue.toFixed(4)); // Round to 4 decimal places
            break;
          case "DWTT":
            const dwttTwoDecimalParams = ["THICK1", "THICK2"];
            if (dwttTwoDecimalParams.includes(key)) {
              parameterValue = parseFloat(parameterValue.toFixed(2)); // Round to 2 decimal places
            } else {
              parameterValue = Math.round(parameterValue); // Round to integer
            }
            break;
          default:
            // No specific rounding if reportType doesn't match
            break;
        }
        // --- End of new rounding logic ---

        inserts.push({
          ...commonValues,
          FPT_TEST_PARA: key,
          FPT_TEST_PARA_VAL: parameterValue,
        });
      });
    });

    // console.log("Prepared inserts:", inserts);

    let totalRowsAffected = 0;

    // Define insertSQL once, as it's used in both CR and CH (for inserts)
    const insertSQL = `INSERT INTO LDPDBA.T_FG_PIPE_TEST_RSLT (
      FPT_CD_EPA,
      FPT_NO_CAST,
      FPT_ID_PIPE,
      FPT_CD_LOC,
      FPT_CD_SEQ,
      FPT_TEST_CD,
      FPT_TEST_PARA,
      FPT_TEST_PARA_VAL,
      FPT_TEST_PARA_REM,
      FPT_CRT_DT,
      FPT_CRT_BY,
      FPT_TEST_PARA_RESULT,
      FTP_TEST_REMARK,
      FPT_INSPEC_NM
    ) VALUES (
      :FPT_CD_EPA,
      :FPT_NO_CAST,
      :FPT_ID_PIPE,
      :FPT_CD_LOC,
      :FPT_CD_SEQ,
      :FPT_TEST_CD,
      :FPT_TEST_PARA,
      :FPT_TEST_PARA_VAL,
      :FPT_TEST_PARA_REM,
      :FPT_CRT_DT,
      user,
      :FPT_TEST_PARA_RESULT,
      :FTP_TEST_REMARK,
      :FPT_INSPEC_NM
    )`;

    if (action === "CR") {
      for (let insertData of inserts) {
        const newinsertData = {
          ...insertData,
          FPT_CRT_DT: new Date(shiftDate),
          FPT_TEST_PARA_RESULT: resultrm,
          FPT_INSPEC_NM: inspector,
        };
        const result: any = await query.executeQuery(insertSQL, newinsertData);
        if (result?.rowsAffected) {
          totalRowsAffected += result.rowsAffected;
        }
      }
    } else if (action === "CH") {
      for (let insertData of inserts) {
        console.log("PARA UPDATE", insertData.FPT_TEST_PARA);
        // --- NEW LOGIC ADDED HERE ---
        // Skip update/insert if FPT_TEST_PARA is FPT_CD_SEQ or FPT_INSPEC_NM
        if (
          insertData.FPT_TEST_PARA === "FPT_CD_SEQ" ||
          insertData.FPT_TEST_PARA === "FPT_INSPEC_NM" ||
          insertData.FPT_TEST_PARA === "FPT_CRT_DT"
        ) {
          console.log(
            `Skipping processing for FPT_TEST_PARA: ${insertData.FPT_TEST_PARA} as it's not allowed for update.`
          );
          continue; // Skip to the next iteration of the loop
        }
        // --- END NEW LOGIC ---

        const checkExistenceBindings = {
          FPT_CD_EPA: insertData.FPT_CD_EPA,
          FPT_NO_CAST: insertData.FPT_NO_CAST,
          FPT_ID_PIPE: insertData.FPT_ID_PIPE,
          FPT_TEST_CD: insertData.FPT_TEST_CD,
          FPT_TEST_PARA: insertData.FPT_TEST_PARA,
          FPT_CD_LOC: insertData.FPT_CD_LOC,
          FPT_CD_SEQ: insertData.FPT_CD_SEQ,
        };

        const checkExistenceSQL = `SELECT COUNT(*) AS count FROM LDPDBA.T_FG_PIPE_TEST_RSLT WHERE
          FPT_CD_EPA = :FPT_CD_EPA AND
          FPT_NO_CAST = :FPT_NO_CAST AND
          FPT_ID_PIPE = :FPT_ID_PIPE AND
          FPT_TEST_CD = :FPT_TEST_CD AND
          FPT_TEST_PARA = :FPT_TEST_PARA AND
          FPT_CD_LOC = :FPT_CD_LOC AND
          FPT_CD_SEQ = :FPT_CD_SEQ`;

        const existingRows: any = await query.executeQuery(
          checkExistenceSQL,
          checkExistenceBindings
        );
        const rowExists = existingRows?.rows?.[0]?.[0] > 0;
        console.log(rowExists);
        let result: any;
        if (rowExists) {
          const updateBindings = {
            FPT_TEST_PARA_VAL: insertData.FPT_TEST_PARA_VAL,
            FPT_TEST_PARA_RESULT: resultrm,
            FPT_TEST_PARA_REM: insertData.FPT_TEST_PARA_REM,
            FTP_TEST_REMARK: insertData.FTP_TEST_REMARK,
            ...checkExistenceBindings,
          };
          const updateSQL = `UPDATE LDPDBA.T_FG_PIPE_TEST_RSLT SET
            FPT_TEST_PARA_VAL = :FPT_TEST_PARA_VAL,
            FPT_UPD_DT = sysdate,
            FPT_UPD_BY = user,
            FPT_TEST_PARA_RESULT = :FPT_TEST_PARA_RESULT,
            FPT_TEST_PARA_REM = :FPT_TEST_PARA_REM,
            FTP_TEST_REMARK = :FTP_TEST_REMARK
          WHERE
            FPT_CD_EPA = :FPT_CD_EPA AND
            FPT_NO_CAST = :FPT_NO_CAST AND
            FPT_ID_PIPE = :FPT_ID_PIPE AND
            FPT_TEST_CD = :FPT_TEST_CD AND
            FPT_TEST_PARA = :FPT_TEST_PARA AND
            FPT_CD_LOC = :FPT_CD_LOC AND
            FPT_CD_SEQ = :FPT_CD_SEQ`;
          result = await query.executeQuery(updateSQL, updateBindings);
        } else {
          console.log("not found binds", checkExistenceBindings);
          const newinsertData = {
            ...insertData,
            FPT_CRT_DT: new Date(shiftDate),
            FPT_TEST_PARA_RESULT: resultrm,
            FPT_INSPEC_NM: inspector,
          };
          console.log("upsert insert ", newinsertData);
          result = await query.executeQuery(insertSQL, newinsertData);
        }

        if (result?.rowsAffected) {
          totalRowsAffected += result.rowsAffected;
        }
      }
    }

    return totalRowsAffected;
  } catch (error) {
    console.error("Error in insertTestResults:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHeatData = async (req: any) => {
  try {
    const sql = `SELECT LOM_NO_CAST FROM V_LDP_PRODN WHERE LOM_ID_BATCH=:pipeid AND LOM_CD_EPA='0780'`;

    let binds = {
      pipeid: req.pipeid,
    };
    // console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    // console.log("rmBatch: ", rmBatch);
    // console.log("status: ", status);
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
    WHERE LOM_CD_STATUS in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB041' )
        and LOM_CD_EPA ='0780' and LOM_SAMPL_TAG = 'Y' `;

    if (status !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${status}'`;
    }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    // console.log("pipeno", sql);
    // console.log("bindspipe",binds)
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, status: any, pipeid: any) => {
  try {
    // console.log("rmBatch: ", rmBatch);
    // console.log("status: ", status);

    // Step 1: First, get the CD_VALUE from V_CODES
    const cdValueQuery = `SELECT CD_DESC FROM V_CODES WHERE CD_TYPE = 'LDP110' AND CD_VALUE=substr('${status}',1,1)`;
    const cdValueResults = await query.executeQuery(cdValueQuery);
    // console.log(cdValueResults);

    // Step 2: Construct a list of columns based on CD_VALUE
    const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
    const additionalColumns = cdValues.length > 0 ? cdValues.join(", ") : ""; // Join the values into a string only if they exist

    // Step 3: Construct the main SQL query
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2, 
                  LOM_LENGTH, TBP_REMARK ${
                    additionalColumns ? ", " + additionalColumns : ""
                  } 
                  FROM V_LDP_PRODN, V_BARE_PDO
                  WHERE LOM_ID_BATCH = TBP_BATCH_NO
                  AND LOM_CD_CURR_PROC=TBP_CD_PROC
                  AND LOM_CD_STATUS = '${status}'
                  AND LOM_CD_EPA ='0780'`;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    if (pipeid !== "") {
      sql += ` AND LOM_ID_Batch = '${pipeid}'`;
    }

    // console.log("pipeno", sql);
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

    // Step 1: Prepare the SQL update statement for the V_BARE_PDO table
    const updateColumns = Object.keys(holdData)
      .filter((col) => col.startsWith("TBP")) // Get all columns starting with TBP
      .map((col) => `${col} = :${col}`);

    // Create the full update SQL statement
    const updateSql = `
      UPDATE V_BARE_PDO
      SET ${updateColumns.join(", ")}
      WHERE 
      TBP_BATCH_NO = :LOM_ID_BATCH
      AND TBP_CD_PROC = substr(:process,1,1)
      AND TBP_BATCH_PROC_NO = (SELECT MAX(TBP_BATCH_PROC_NO)
                                FROM V_BARE_PDO
                                WHERE TBP_BATCH_NO = :LOM_ID_BATCH
                                AND TBP_CD_PROC = substr(:process,1,1))`; // Assuming this is the correct condition

    // Prepare the bind variables for the update based only on what we need
    const updateBinds = {
      LOM_ID_BATCH: holdData.LOM_ID_BATCH,
      process: process,
    };

    // Include only TBP columns in updateBinds
    updateColumns.forEach((col) => {
      const columnName = col.split(" = ")[0]; // Extract the column name from the assignment
      updateBinds[columnName] = holdData[columnName]; // Assign the value from holdData
    });
    // console.log(updateSql, updateBinds);
    // Step 2: Execute the update query
    await query.executeQuery(updateSql, updateBinds);

    // Step 3: Prepare the call for the LD01B004 procedure
    let sql = `CALL LD01B004(
        P_PIPEID   => :P_PIPEID,
        P_PROCESS => :P_PROCESS,
        P_RESULT  => :P_RESULT,
        P_REMARKS  => :P_REMARKS,
        P_INSPECTOR  => :P_INSPECTOR,
        LS_OUT_FLAG  => :LS_OUT_FLAG
      )`;

    // Prepare bind variables for the procedure call
    let procedureBinds = {
      P_PIPEID: holdData?.LOM_ID_BATCH,
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

    // Execute the stored procedure
    return await query.executeQuery(sql, procedureBinds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
