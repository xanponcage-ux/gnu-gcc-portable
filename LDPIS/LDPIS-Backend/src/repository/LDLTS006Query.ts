import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getCoils = async (data: any) => {
  try {
    let sql = `SELECT LOM_ID_BATCH BATCH_ID, LOM_CD_CURR_PROC CURR_PROC,
       LOM_CD_PREV_PROC PREV_PROC, LOM_CD_NEXT_PROC NEXT_PROC,
       LOM_CD_QLTY_ACTL QLTY_CD, LOM_CD_STATUS STATUS, LOM_CD_YRD YARD,
       TO_CHAR(LOM_TS_CREATION, 'DD-MM-YY HH24:MI:SS') PROD_DT, LOM_FL_HOLD HOLD_FL, LOM_IDIA IDIA,
       LOM_ODIA ODIA, LOM_NO_CAST CAST_NO, LOM_LENGTH LEN,
       LOM_MS_GROSS_ACTL GROSS_WT, LOM_MS_PIECE_ACTL NET_WT,
       LOM_CD_PROD PROD_CD, LOM_SEC1 THICK, LOM_SEC2 WIDTH,
       LOM_ID_ORDER_CUS CUST_ORDER, LOM_ID_ORD_ITEM_CUS CUST_ITEM,
       LOM_ID_PAR_COIL_NO PARENT_BATCH, LOM_ID_FIRST_PAR MOTHER_BATCH,
       LOM_TDC_ACTL TDC, LOM_CD_EPA PLANT, LOM_NO_MATNR MAT_NO,
       LOM_PLANNED_PROC PLAN_PROC, LOM_PASSED_PROC PASS_PROC, LOM_SAMPL_TAG SAMPLE_TAG,
       LOM_TAGGED_BATCH TAGGED_BATCH
       FROM V_LDP_PRODN`;

    if (data.plant) {
      sql += ` where lom_cd_epa = '${data?.plant}'`;
    }
    if (data.batchId) {
      sql += ` And LOM_ID_BATCH = '${data?.batchId}'`;
    }
    if (data.mBatch) {
      sql += ` and LOM_ID_FIRST_PAR = '${data?.mBatch}'`;
    }

    sql += ` and lom_cd_status = 'EQ'`; //EQ
    sql += ` order by LOM_TS_CREATION desc, LOM_ID_PAR_COIL_NO, LOM_ID_BATCH `;

    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (data: any) => {
  try {
    // console.log("data: ", data);

    var sql = `call LDPDBA.LDLTB005(
      ls_batch         => :ls_batch,
      ls_decision      => :ls_decision,
      ls_out_flag      => :ls_out_flag
    )`;
    const binds = {
      ls_batch: data?.batchId,
      ls_decision: data?.decision,
      // ls_dwg_mat: data?.downMatl,
      // ls_scrap_mat: data?.scrapMatl,
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("bindsProc: ", binds);
    let result = await query.executeQuery(sql, binds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDownMatl = async (data: any) => {
  try {
    let sql = `SELECT TDM_DWN_MATNR_NO DOWN_MATL
    FROM V_DOWNGRADE_MATL
    WHERE TDM_CD_PLANT='${data?.plant}'
    AND TDM_CATEGORY='FG_MAT'
    AND TDM_MATNR_NO= '${data?.batchMatl}'`;

    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapMatl = async (data: any) => {
  try {
    let sql = `SELECT CD_VALUE SCRAP_MATL FROM V_CODES WHERE CD_TYPE = 'TB042'`;

    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
