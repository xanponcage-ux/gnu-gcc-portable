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
    console.log("rmlist", sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
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
    console.log("pipeno", sql);
    // console.log("bindspipe",binds)
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getPipeId = async (req: any) => {
//   try {
//     console.log("inside pipeid");
//     console.log(req);
//     let mill;
//     let bindsMill = {
//       mBatch: req.RM_BATCH,
//     };
//     console.log("bindsmill", bindsMill);
//     let qryMillCode = `SELECT SUBSTR(EWI_WRK_CENTER_NO,5,1) FROM V_WORK_INST
//         WHERE EWI_CD_ePA= '0780'
//         AND EWI_ID_BATCH =:mBatch
//         AND ROWNUM=1`;

//     let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

//     mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : "1";
//     console.log("mill", mill);
//     const sql = `SELECT f_LDB010_pipeid(:plant,:mbatch,substr(F_Tatadate(sysdate),2),:process,'1',substr(F_Tatadate(sysdate),1,1)) as PIPEID FROM dual`;

//     let binds = {
//       plant: "0780",
//       mbatch: req.RM_BATCH,
//       process: "R",
//       mill: mill,
//     };
//     console.log(binds);
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getPipeInfo = async (req: any) => {
  try {
    console.log("rmBatch: ", req?.RM_BATCH);
    // Step 3: Construct the main SQL query
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO,LOM_MS_PIECE_ACTL, LOM_SEC1, LOM_SEC2,LOM_LENGTH AS LENGTH,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_NO_MATNR, (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = lom_no_matnr
                  AND ROWNUM = 1
          ) MATNR_DESC,
          LOM_TDC_ACTL
                  FROM V_LDP_PRODN 
                  WHERE LOM_CD_STATUS =:status
                  AND LOM_CD_EPA ='0780'`;
    if (req?.PIPE_NO != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND TBP_CD_PROC = '1'`;
      sql += `and lom_id_batch = '${req?.PIPE_NO}'`;
    }
    if (req?.RM_BATCH != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND TBP_CD_PROC = '1'`;
      sql += `AND LOM_ID_PAR_COIL_NO = '${req?.RM_BATCH}' `;
    }
    let binds = {
      status: req?.STATUS,
    };
    console.log(sql, binds);
    return await query.executeQuery(sql, binds);
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
//     const cdValueQuery = `SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'LDP110'`;
//     const cdValueResults = await query.executeQuery(cdValueQuery);
//     console.log(cdValueResults);
//     // Step 2: Construct a list of columns based on CD_VALUE
//     const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
//     const additionalColumns = cdValues.join(", "); // Join the values into a string

//     // Step 3: Construct the main SQL query
//     let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2,
//                   LOM_LENGTH,LOM_ID_ORD_ITEM_CUS,LOM_ID_ORDER_CUS,TBP_REMARK ${additionalColumns}
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

export const LD08B003 = async (newReworkData: any, status: any) => {
  try {
    const sql = `call LDPDBA.LD08B003(
      P_PLANT => :P_PLANT,
      P_PIPE_ID => :P_PIPE_ID,
      P_DECISION => :P_DECISION,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {};
    binds = {
      P_PLANT: "0780",
      P_PIPE_ID: newReworkData?.LOM_ID_BATCH, //LOM_ID_BATCH
      P_DECISION: "Release With Order",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds, "binds");

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const insertPipeDetails = async (newReworkData: any, parting: any) => {
//   try {
//     const sql = `call LDPDBA.LD0RB002(
//       P_PLANT_CD => :P_PLANT_CD,
//       P_MOTHER_PIPE => :P_MOTHER_PIPE,
//       P_PART_COUNT => :P_PART_COUNT,
//       P_PARTING_FLAG => :P_PARTING_FLAG,
//       LS_OUT_FLAG => :LS_OUT_FLAG
//       )`;

//     let binds = {};
//     binds = {
//       P_PLANT_CD: "0780",
//       P_MOTHER_PIPE: newReworkData?.[0]?.RM_BATCH,
//       P_PART_COUNT: newReworkData?.[0]?.PARTNO,
//       P_PARTING_FLAG: parting,
//       LS_OUT_FLAG: {
//         type: oracledb.STRING,
//         dir: oracledb.BIND_OUT,
//         maxSize: 500,
//       },
//     };
//     console.log(binds, "binds");

//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getMaterialNo = async (data: any) => {
  try {
    let sql = "";
    console.log(data);
    if (data?.type === "SCRAP") {
      sql = ` select CD_VALUE MAT_NO, CD_VALUE ||' - '|| CD_DESC MAT_DESC from V_CODES WHERE CD_TYPE='TB042'`;
    } else if (data?.type === "DOWNGRADE") {
      sql = `select TDM_DWN_MATNR_NO from  V_DOWNGRADE_MATL,V_LDP_PRODN
      WHERE TDM_CD_PLANT='0780' 
      AND TDM_MATNR_NO=LOM_NO_MATNR
      AND LOM_ID_BATCH=:pipeid
      AND TDM_CATEGORY='SFG_MAT'`;
    }
    console.log("MATNO: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
