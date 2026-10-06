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
    // console.log("rmlist", sql);
    // console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_NO_MATNR from V_LDP_PRODN
        WHERE LOM_CD_STATUS= 'RC'
        and LOM_CD_EPA='0780'`;
    // let binds = {
    //   status: status,
    // };
    // console.log("rmlist", sql);
    // console.log(binds);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any, mill: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
    console.log("MILL: ", mill);
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (mill !== "") {
      sql += ` AND LOM_MILL_NO = '${mill}'`;
    }

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
    let dynamicWhereClause = "";
    let binds: any = {};

    // Determine the main WHERE condition based on available parameters
    if (req.PIPE_ID && req.PIPE_ID.trim() !== "") {
      dynamicWhereClause = ` AND LOM_ID_BATCH = :pipeId`;
      binds.pipeId = req.PIPE_ID;
    } else if (req.material && req.material.trim() !== "") {
      dynamicWhereClause = ` AND LOM_NO_MATNR = :materialParam`;
      binds.materialParam = req.material;
    } else {
      // Fallback if neither PIPE_ID nor material are present
      dynamicWhereClause = ` AND LOM_ID_PAR_COIL_NO = :rmBatchParam`;
      binds.rmBatchParam = req.RM_BATCH; // Ensure RM_BATCH is always available for this fallback
    }

    let sql = ` SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_MS_PIECE_ACTL, LOM_SEC1,
                 LOM_SEC2, LOM_LENGTH AS LENGTH, LOM_ID_ORDER_CUS, LOM_ID_ORD_ITEM_CUS,
                 LOM_NO_MATNR, TBP_WALL_THK_END_10 WALL_THICK_END,
                 TBP_DEPTH_10 DEPTH_MM, TBP_WIDTHS_10 WIDTH_MM,
                 (SELECT GEOMETRY
                    FROM V_YMPCT_TUB_MATL
                   WHERE MANDT = '600' AND MATNR = LOM_NO_MATNR) GEO,
                 (SELECT TBP_REMARK FROM V_BARE_PDO WHERE LOM_ID_BATCH = TBP_BATCH_NO 
                AND TBP_CD_PROC = SUBSTR(LOM_PASSED_PROC, -1) AND ROWNUM = 1) REMARKS
                FROM V_LDP_PRODN, V_BARE_PDO
                WHERE (lom_id_batch = tbp_batch_no OR LOM_ID_PAR_COIL_NO=TBP_BATCH_NO)
                 AND LOM_CD_EPA = TBP_PLANT_CD
                 AND LOM_CD_STATUS ='RC'
                 AND TBP_CD_PROC = '1'
                 ${dynamicWhereClause}`; // Appending the dynamically determined WHERE condition

    console.log("Generated SQL: ", sql);
    console.log("Binds: ", binds);
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

export const LRS001_TEMP_INSERT = async (newReworkData: any, parting: any) => {
  try {
    const sql = `call LDPDBA.LD0RB001(
      P_PLANT_CD   => :P_PLANT_CD,
      P_PARTED_PIPE   => :P_PARTED_PIPE,
      P_MOTHER_PIPE   => :P_MOTHER_PIPE,
      P_WEIGHT_PARTED   => :P_WEIGHT_PARTED,
      P_LENGTH_PARTED   => :P_LENGTH_PARTED,
      P_PART_COUNT   => :P_PART_COUNT,
      P_RESULT   => :P_RESULT,
      P_REMARK   => :P_REMARK,
      P_INSPECTOR   => :P_INSPECTOR,
      P_PARTING_FLAG   => :P_PARTING_FLAG,
      P_DECISION => :P_DECISION,
      P_MATERIAL => :P_MATERIAL,
      LS_OUT_FLAG   => :LS_OUT_FLAG
      )`;

    let binds = {};
    binds = {
      P_PLANT_CD: "0780",
      P_PARTED_PIPE: newReworkData?.PIPEID,
      P_MOTHER_PIPE: newReworkData?.RM_BATCH,
      P_WEIGHT_PARTED: newReworkData?.PIPE_WEIGHT,
      P_LENGTH_PARTED: newReworkData?.LENGTH,
      P_PART_COUNT: newReworkData?.PARTNO,
      P_RESULT: newReworkData?.RESULT ? newReworkData?.RESULT : "OK",
      P_REMARK: newReworkData?.REMARK,
      P_INSPECTOR: newReworkData?.INSPECTOR,
      P_PARTING_FLAG: parting,
      P_DECISION: newReworkData?.txtDecision?.substr(0, 1) ?? "",
      P_MATERIAL: newReworkData?.txtMatNo ?? "",
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

export const insertPipeDetails = async (newReworkData: any, parting: any) => {
  try {
    const sql = `call LDPDBA.LD0RB002(
      P_PLANT_CD => :P_PLANT_CD,
      P_MOTHER_PIPE => :P_MOTHER_PIPE,
      P_PART_COUNT => :P_PART_COUNT,
      P_PARTING_FLAG => :P_PARTING_FLAG,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {};
    binds = {
      P_PLANT_CD: "0780",
      P_MOTHER_PIPE: newReworkData?.[0]?.RM_BATCH,
      P_PART_COUNT: newReworkData?.[0]?.PARTNO,
      P_PARTING_FLAG: parting,
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

export const getMaterialNo = async (data: any) => {
  try {
    let sql = "";
    console.log(data);
    if (data?.type === "SCRAP") {
      sql = ` select CD_VALUE MAT_NO,CD_DESC MAT_DESC from V_CODES WHERE CD_TYPE='TB042'`;
    } else if (data?.type === "DOWNGRADE") {
      if (data?.pipeid) {
        sql = `select Distinct TDM_DWN_MATNR_NO AS MAT_NO,( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = TDM_DWN_MATNR_NO AND ROWNUM = 1 ) MAT_DESC from  V_DOWNGRADE_MATL,V_LDP_PRODN
      WHERE TDM_CD_PLANT='0780' 
      AND TDM_MATNR_NO=LOM_NO_MATNR
      AND LOM_ID_BATCH='${data?.pipeid}'
      AND TDM_CATEGORY='SFG_MAT'`;
      } else {
        sql = `select Distinct TDM_DWN_MATNR_NO AS MAT_NO,( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = TDM_DWN_MATNR_NO AND ROWNUM = 1 ) MAT_DESC from  V_DOWNGRADE_MATL,V_LDP_PRODN
        WHERE TDM_CD_PLANT='0780' 
        AND TDM_MATNR_NO=LOM_NO_MATNR
        AND LOM_NO_MATNR='${data?.material}'
        AND TDM_CATEGORY='SFG_MAT'`;
      }
    }

    console.log("MATNO: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeWeight = async (data: any) => {
  try {
    const sql = `SELECT f_get_piece_actl(
            :p_plant ,
            :p_batch_id ,
            :p_no_pcs ,
            :p_length ,
            :p_od,
            :p_id,
            :p_thickness,
            :p_depth,
            :p_width,
            :p_geo
        ) as WEIGHT FROM dual`;

    let binds = {
      p_plant: data?.p_plant ?? "",
      p_batch_id: data?.p_batch_id ?? "",
      p_no_pcs: "1",
      p_length: data?.p_length ?? "",
      p_od: data?.p_od ?? "",
      p_id: "0",
      p_thickness: data.p_thickness ?? "",
      p_depth: data?.p_depth ?? "",
      p_width: data?.p_width ?? "",
      p_geo: data?.p_geo ?? "",
    };
    // console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGeometry = async (data: any) => {
  try {
    let sql = `select geometry from v_ympct_tub_matl 
    where mandt='600' and matnr='${data?.matNo}'`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
