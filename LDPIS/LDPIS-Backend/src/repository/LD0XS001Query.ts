import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import moment from "moment";

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
    let sql = `select DISTINCT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO from V_LDP_PRODN
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

export const getPipeId = async (req: any) => {
  try {
    console.log("inside pipeid");
    console.log(req);
    let mill;
    let bindsMill = {
      mBatch: req.RM_BATCH,
    };
    console.log("bindsmill", bindsMill);
    let qryMillCode = `SELECT SUBSTR(EWI_WRK_CENTER_NO,5,1) FROM V_WORK_INST
        WHERE EWI_CD_ePA= '0780' 
        AND EWI_ID_BATCH =:mBatch
        AND ROWNUM=1`;

    let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

    mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : "1";
    console.log("mill", mill);
    const sql = `SELECT f_LDB010_pipeid(:plant,:mbatch,substr(F_Tatadate(sysdate),2),:process,'1',substr(F_Tatadate(sysdate),1,1)) as PIPEID FROM dual`;

    let binds = {
      plant: "0780",
      mbatch: req.RM_BATCH,
      process: "R",
      mill: mill,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeInfo = async (data: any) => {
  try {
    console.log("rmBatch: ", data?.RM_BATCH);
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO,LOM_MS_PIECE_ACTL, 
    LOM_SEC1, LOM_SEC2,LOM_LENGTH,LOM_ID_ORDER_CUS,
    LOM_ID_ORD_ITEM_CUS,LOM_NO_MATNR,TBP_REMARK,LOM_SEC1 WALL_THICK_END,
                 TBP_DEPTH_10 DEPTH_MM, TBP_WIDTHS_10 WIDTH_MM,LOM_CD_CURR_PROC CURR_PROC,
                 (SELECT GEOMETRY
                    FROM V_YMPCT_TUB_MATL
                   WHERE MANDT = '600' AND MATNR = LOM_NO_MATNR) GEO
                  FROM V_LDP_PRODN , V_BARE_PDO t
                  WHERE LOM_ID_BATCH = t.TBP_BATCH_NO
                  AND LOM_CD_EPA ='0780'
                  AND LOM_CD_STATUS = 'XC'
                  AND t.TBP_CREATE_DATE = (
                  SELECT MAX(TBP_CREATE_DATE)
                  FROM V_BARE_PDO X
                  WHERE X.TBP_BATCH_NO = t.TBP_BATCH_NO
                  )
                  `;
    // Priority 1 : PIPE_NO
    if (data?.RM_BATCH && data?.RM_BATCH !== "") {
      sql += ` AND LOM_ID_BATCH = '${data.RM_BATCH}'`;
    }

    // // Priority 2 : RM_BATCH
    // else if (data.RM_BATCH && data.RM_BATCH !== "") {
    // sql += ` AND LOM_ID_PAR_COIL_NO = '${data.RM_BATCH}'`;
    // }

    // Priority 3 : ORDER + ITEM
    else if (
      data.ORDNO &&
      data.ORDNO !== "" &&
      data.ORDITEM &&
      data.ORDITEM !== ""
    ) {
      sql += `
                  AND LOM_ID_ORDER_CUS = '${data.ORDNO}'
                  AND LOM_ID_ORD_ITEM_CUS = '${data.ORDITEM}'
                  `;
    }
    // No filter
    else {
      sql += ` AND 1 = 0`;
    }
    console.log("getPipeInfo qry", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, status: any, pipeid: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
    // Step 1: First, get the CD_VALUE from V_CODES
    const cdValueQuery = `SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'LDP110'`;
    const cdValueResults = await query.executeQuery(cdValueQuery);
    console.log(cdValueResults);
    // Step 2: Construct a list of columns based on CD_VALUE
    const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
    const additionalColumns = cdValues.join(", "); // Join the values into a string

    // Step 3: Construct the main SQL query
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2, 
                  LOM_LENGTH,LOM_ID_ORD_ITEM_CUS,LOM_ID_ORDER_CUS,LOM_NO_MATNR, TBP_WALL_THK_END_10 WALL_THICK_END,
                 TBP_DEPTH_10 DEPTH_MM, TBP_WIDTHS_10 WIDTH_MM,LOM_CD_CURR_PROC CURR_PROC,
                 (SELECT GEOMETRY
                    FROM V_YMPCT_TUB_MATL
                   WHERE MANDT = '600' AND MATNR = LOM_NO_MATNR) GEO,TBP_REMARK ${additionalColumns} 
                  FROM V_LDP_PRODN , V_BARE_PDO
                  WHERE LOM_ID_BATCH = TBP_BATCH_NO
                  AND LOM_CD_STATUS = '${status}'
                  AND LOM_CD_EPA ='0780'`;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    if (pipeid !== "") {
      sql += ` AND LOM_ID_Batch = '${pipeid}'`;
    }
    console.log("pipeno", sql);
    // console.log("bindspipe",binds)
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

export const tempInsert = async (newReworkData: any) => {
  try {
    const sql = `call LDPDBA.LD0RB005(
      P_PLANT_CD => :P_PLANT_CD,
      P_PIPE_ID => :P_PIPE_ID,
      P_RESULT => :P_RESULT,
      P_REMARK => :P_REMARK,
      P_INSPECTOR => :P_INSPECTOR,
      P_DECISION => :P_DECISION,
      P_PRD_STATION => :P_PRD_STATION,
      P_LENGTH => :P_LENGTH,
      P_WEIGHT => :P_WEIGHT,
      ls_out_flag => :ls_out_flag
      )`;

    let binds = {
      P_PLANT_CD: "0780",
      P_PIPE_ID: newReworkData?.pipeId,
      P_RESULT: "OK", // Its set as OK in procedure
      P_REMARK: newReworkData?.remark ?? "",
      P_INSPECTOR: newReworkData?.inspector ?? "",
      P_DECISION: newReworkData?.decision ?? "",
      P_PRD_STATION: newReworkData?.nextStation ?? "",
      P_LENGTH: newReworkData?.LENGTH ?? "",
      P_WEIGHT: newReworkData?.PIPE_WEIGHT ?? "",
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("bindsTemp: ", binds);
    console.log("sqlTemp: ", sql);

    let result = await query.executeQuery(sql, binds);
    console.log("resultTemp: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertPipeDetails = async (newReworkData: any) => {
  try {
    const sql = `call LD0RB006(
      P_PLANT_CD => :P_PLANT_CD,
      P_MOTHER_PIPE => :P_MOTHER_PIPE,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {
      P_PLANT_CD: "0780",
      P_MOTHER_PIPE: newReworkData?.pipeId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("bindsFin: ", binds);
    console.log("sqlFin: ", sql);

    // return await query.executeQuery(sql, binds);
    let result = await query.executeQuery(sql, binds);
    console.log("resultFin: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// Insert scrap record into V_BARE_PDO_TEMP for LD0XS001
export const insertScrapTempData = async (data: any) => {
  try {
    // Only insert when OLD_WEIGHT and PIPE_WEIGHT differ and result > 0
    const oldWt = data?.OLD_WEIGHT !== undefined ? Number(data.OLD_WEIGHT) : 0;
    const pipeWt =
      data?.PIPE_WEIGHT !== undefined ? Number(data.PIPE_WEIGHT) : 0;
    const scrapWt = oldWt - pipeWt;
    if (isNaN(scrapWt) || scrapWt <= 0) {
      // nothing to insert
      return { inserted: false, message: "No scrap weight to insert" };
    }

    const sql = `INSERT INTO V_BARE_PDO_TEMP (
TBP_PLANT_CD,
TBP_BATCH_NO,
TBP_CD_PROC,
TBP_NEXT_PROC,
TBP_BATCH_PROC_NO,
TBP_PROD_DATE,
TBP_SHIFT,
TBP_WEIGHT,
TBP_CD_STATUS,
TBP_PAR_COIL_NO,
TBP_ID_FIRST_PAR,
TBP_ID_ORDER_NO,
TBP_ITEM_NO,
TBP_QUALITY_CD,
TBP_NO_MATNR,
TBP_CD_FLAG,
TBP_PROD_START_DT,
TBP_PROD_END_DT,
TBP_RESULT,
TBP_REMARK,
TBP_HEAT_NO,
TBP_INSP_NAME,
TBP_PIPE_OD_10,
TBP_PIPE_THK_10,
TBP_PIPE_LNG_10
)
SELECT
:p_plant,
LDPDBA.f_LDB010_scrapid(
:p_plant,
:p_mbatch,
TO_DATE(:p_prodn_dt,'YYYY-MM-DD HH24:MI'),
:p_proc
),
:p_proc,
:p_next_proc,
1,
TO_DATE(:p_prodn_dt,'YYYY-MM-DD HH24:MI'),
:SHIFT,
:WEIGHT,
:p_status,
:p_mbatch,
:ID_FIRST_PAR,
'SC88888888',
0,
'SCRP',
SUBSTR(r.cd_desc,1,18),
'1',
TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),
'OK',
:REMARK,
NULL,
:INSP_NAME,
NULL,
NULL,
NULL
FROM (
SELECT cd_desc
FROM v_codes
WHERE cd_type = 'TB045'
AND SUBSTR(cd_value,1,4) = :p_plant
AND SUBSTR(cd_value,6,1) = '8'
) r
`;

    const binds = {
      p_plant: "0780",
      ID_FIRST_PAR: data?.rmBatch ?? "",
      p_proc: "X",
      p_next_proc: data?.nextStation ?? data?.NEXT_STATION ?? "",
      p_prodn_dt:
        data?.prodDate ?? data?.PROD_DATE ?? moment().format("YYYY-MM-DD"),
      SHIFT: data?.SHIFT ?? "",
      WEIGHT: scrapWt.toFixed(3),
      p_status: "XC",
      p_mbatch: data?.pipeId ?? data?.PIPEID ?? "",
      START_DT: data?.startDt ?? moment().format("DD/MM/YYYY HH:mm"),
      END_DT: data?.endDt ?? moment().format("DD/MM/YYYY HH:mm"),
      REMARK: data?.remark ?? "",
      INSP_NAME: data?.inspector ?? data?.INSP_NAME ?? "",
    };

    console.log("insertScrapTempData binds:", binds);
    const result = await query.executeQuery(sql, binds);
    console.log("insertScrapTempData result:", result);
    // If the query executed but inserted 0 rows, treat as failure so caller can abort further processing
    const rowsAffected =
      typeof result?.rowsAffected === "number"
        ? result.rowsAffected
        : undefined;
    if (typeof rowsAffected === "number" && rowsAffected <= 0) {
      return { inserted: false, message: "No rows inserted", result };
    }
    return { inserted: true, result };
  } catch (error) {
    console.log("LD0XS001-insertScrapTempData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
