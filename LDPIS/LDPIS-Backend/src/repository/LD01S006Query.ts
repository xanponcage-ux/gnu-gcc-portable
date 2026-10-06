import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getPalletData = async (data: any) => {
  try {
    console.log("data: ", data);

    // If action is 'U' (or 'u'), run the dedicated query against v_random_dtls
    if (data?.action && String(data.action).toUpperCase() === "U") {
      let sql = `SELECT DISTINCT erd_id_new_batch, erd_cd_epa, LOM_CD_STATUS erd_cd_status, LOM_MS_PIECE_ACTL erd_batch_qty,
                erd_new_batch_qty, erd_no_matnr, erd_flg_maxwt,
                erd_flg_send_sap,
                TO_CHAR(erd_rec_crt_dt, 'DD-MON-YYYY HH:MI:SS') erd_rec_crt_dt,
                erd_rec_crt_uid
           FROM v_random_dtls,V_LDP_PRODN
          WHERE erd_id_new_batch=LOM_ID_BATCH 
            and erd_prog_id = 'LDMRG002'
            AND erd_mov_ind = 'B'
            AND erd_rec_status = 'A' `;
      if (data?.status) {
        sql += ` AND LOM_CD_STATUS = '${data?.status}' `;
      }
      console.log("sql (action U): ", sql);
      return await query.executeQuery(sql);
    }

    let sql = `  SELECT LOM_ID_BATCH AS ID_BATCH,  
      LOM_CD_CURR_PROC AS CURR_PROC,
       LOM_CD_NEXT_PROC AS NEXT_PROC, LOM_CD_PREV_PROC AS PREV_PROC,
       LOM_CD_QLTY_ACTL AS QLTY_ACTL, LOM_CD_QLTY_AIM AS QLTY_AIM,
       LOM_CD_STATUS AS STATUS, LOM_CD_YRD AS YARD,
       TO_CHAR(LOM_TS_CREATION, 'DD-MON-YYYY HH:MI:SS') AS CREATION_TS, LOM_FL_HOLD AS FL_HOLD,
       LOM_IDIA AS IDIA, LOM_NO_CAST AS CAST_NO, LOM_LENGTH AS LENGTH,
       TO_CHAR(LOM_MS_GROSS_ACTL, 'FM999999990.000') AS GROSS_ACTL, TO_CHAR(LOM_MS_GROSS_CAL, 'FM999999990.000') AS GROSS_CAL,
       TO_CHAR(LOM_MS_PIECE_ACTL, 'FM999999990.000') AS PIECE_ACTL,  TO_CHAR(LOM_MS_PIECE_CAL, 'FM999999990.000') AS PIECE_CAL,
       LOM_ODIA AS ODIA, LOM_CD_PROD AS PROD_CD, TO_CHAR(LOM_SEC1, 'FM999999990.000') AS THICK,
       TO_CHAR(LOM_SEC2, 'FM999999990.000') AS WIDTH, LOM_ID_ORDER_CUS AS ORDER_ID,
       LOM_ID_ORD_ITEM_CUS AS ITEM, LOM_CD_SHIFT AS SHIFT_CODE,
       LOM_ID_PAR_COIL_NO AS PAR_COIL_NO, LOM_ID_FIRST_PAR AS FIRST_PAR_ID,
       LOM_PASSED_PROC AS PASSED_PROC, TO_CHAR(LOM_TS_COIL_CREATE, 'DD-MON-YYYY HH:MI:SS') AS COIL_CREATE_TS,
       TO_CHAR(LOM_TS_REC_CREATE, 'DD-MON-YYYY HH:MI:SS') AS REC_CREATE_TS, LOM_TDC_AIM AS TDC_AIM,
       LOM_TDC_ACTL AS TDC_ACTL, LOM_OIL_TYPE AS OIL_TYPE,
       LOM_NO_PIECES AS NO_PIECES, LOM_CD_EPA AS EPA_CODE,
       LOM_PLANNED_PROC AS PLANNED_PROC, LOM_CD_PACK AS PACK_CODE,
       LOM_NO_MATNR AS MAT_NO, LOM_MERGE_BATCH AS MERGE_BATCH,
       LOM_REMARKS AS REMARKS, LOM_MILL_NO AS MILL_NO,(select LPP_PRODUCT from V_LDP_PROC_PATH
        WHERE LOM_PLANNED_PROC = LPP_CD_PROC_PATH and rownum=1) PROD_TYPE
        ,
       NVL((select Q.TBP_VDI_FINAL_RMK_1_80 from V_BARE_PDO Q where Q.tbp_batch_no = LOM_ID_BATCH and  Q.tbp_cd_proc='8'
         and Q.TBP_BATCH_PROC_NO = ( SELECT MAX(TBP_BATCH_PROC_NO) FROM v_bare_pdo t1
        where Q.tbp_batch_no = t1.tbp_batch_no
        and T1.TBP_CD_PROC = '8')),' ')FINAL_RMK_1_80,
       NVL((select Q.TBP_VDI_FINAL_RMK_2_80 from V_BARE_PDO Q where Q.tbp_batch_no = LOM_ID_BATCH and  Q.tbp_cd_proc='8'
         and Q.TBP_BATCH_PROC_NO = ( SELECT MAX(TBP_BATCH_PROC_NO) FROM v_bare_pdo t1
        where Q.tbp_batch_no = t1.tbp_batch_no
        and T1.TBP_CD_PROC = '8')),' ')FINAL_RMK_2_80
        FROM V_LDP_PRODN
        where
        LOM_CD_EPA = '${data?.plant}'
        AND LOM_ID_BATCH NOT LIKE (SELECT CD_VALUE || '%'FROM V_CODES
        WHERE CD_TYPE = 'TB063')
        `; //F_MERGE_ID

    if (data?.status) {
      sql += ` AND LOM_CD_STATUS = '${data?.status}' `;
    }
    if (data?.prodType) {
      sql += ` AND LOM_PLANNED_PROC IN (SELECT LPP_CD_PROC_PATH from V_LDP_PROC_PATH where  LPP_PRODUCT  LIKE '%${data?.prodType}%') `;
    }

    sql += ` ORDER BY LOM_TS_CREATION `;
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deletePalletTemp = async (user: any) => {
  try {
    console.log("user: ", user);
    let sql = `delete from V_RANDOM_DTLS_TEMP`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMergingStatus = async (plant: any) => {
  try {
    const sql = `select CD_VALUE from V_CODES WHERE CD_TYPE='LD01S006'     `;
    //let binds = { plant: plant };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const savePalletUnmerge = async (data: any) => {
  try {
    console.log("dataQryTemp: ", data);
    var sql = `call LDPDBA.LDMRG003(
      LS_MERGE_BATCH => :LS_BATCH,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    let binds = {
      LS_BATCH: data?.batchId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("sqlTemp: ", sql);
    console.log("bindsTemp: ", binds);
    let resTemp = await query.executeQuery(sql, binds);
    console.log("resTemp: ", resTemp);
    return resTemp;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const savePalletDataTemp = async (data: any, mergeId: any) => {
  try {
    console.log("dataQryTemp: ", data);
    var sql = `call LDMRG001(
      LS_BATCH => :LS_BATCH,
      LS_MERGE_BATCH => :LS_MERGE_BATCH,
      LS_QNTY => :LS_QNTY,
      LS_MATNR => :LS_MATNR,
      PROD_TYPE => :PROD_TYPE,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    let binds = {
      LS_BATCH: data?.batchId ?? "",
      LS_MERGE_BATCH: mergeId ?? "",
      LS_QNTY: data?.netWt ?? "",
      LS_MATNR: data?.matNo ?? "",
      PROD_TYPE: data?.prodType ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("sqlTemp: ", sql);
    console.log("bindsTemp: ", binds);
    let resTemp = await query.executeQuery(sql, binds);
    console.log("resTemp: ", resTemp);
    return resTemp;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const savePalletData = async (mergeId: any) => {
  try {
    var sql = `call LDMRG002(
        LS_MERGE_BATCH => :LS_MERGE_BATCH,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {
      LS_MERGE_BATCH: mergeId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    console.log("sql: ", sql);
    console.log("binds: ", binds);
    let result = await query.executeQuery(sql, binds);
    console.log("result: ", result);
    return result;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergeID = async () => {
  try {
    const sql = `SELECT F_MERGE_ID('PALLET') MERGE_ID FROM DUAL`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPalletInvData = async (data: any) => {
  try {
    console.log("data: ", data);
    let sql = `SELECT
              ERD_CD_EPA PLANT,
              ERD_ID_BATCH BATCH_ID,
              ERD_ID_NEW_BATCH PALLET_BATCH_ID,
              ERD_CD_STATUS STATUS,
              ERD_BATCH_QTY BATCH_QTY,
              ERD_NEW_BATCH_QTY PALLET_BATCH_QTY,
              ERD_NO_MATNR MAT_NO,
              ERD_FLG_MAXWT MAXWT,
              ERD_FLG_SEND_SAP SEND_SAP,
              TO_CHAR(ERD_REC_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') REC_CRT_DT,
              ERD_REC_CRT_UID REC_CRT_ID,
              ERD_NO_PCS NO_PCS,
              ERD_NEW_MATNR NEW_MAT_NO,
              ERD_MOV_IND MOV_IND,
              ERD_NO_INV NO_INV,
              ERD_NO_DELIVERY NO_DELV,
              ERD_DELV_ITEM DELV_ITEM,
              ERD_PROG_ID PROG_ID,
              ERD_REC_STATUS REC_STATUS,
              TO_CHAR(ERD_UPD_DT, 'DD-MM-YYYY HH24:MI:SS') UPD_DT,
              ERD_UPD_BY UPD_BY
              FROM V_RANDOM_DTLS `;

    let whereClauses = [];

    if (data?.plant) {
      whereClauses.push(`ERD_CD_EPA = '${data?.plant}'`);
    }
    if (data?.status) {
      whereClauses.push(`ERD_CD_STATUS = '${data?.status}'`);
    }
    // Add date range filter
    if (data?.fromDate && data?.toDate) {
      whereClauses.push(`ERD_REC_CRT_DT BETWEEN TO_DATE('${data.fromDate}', 'DD-MM-YYYY') AND TO_DATE('${data.toDate}', 'DD-MM-YYYY')`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(` AND `);
    }

    sql += `  AND ERD_REC_STATUS = 'A' ORDER BY ERD_REC_CRT_DT `;
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getcheckMergebatch = async (data: any) => {
  try {
    console.log("data: ", data);
    let sql = `Select COUNT(*) CNT from V_LDP_PRODN `;

    if (data?.plant) {
      sql += ` WHERE LOM_CD_EPA = '${data?.plant}' `;
    }
    if (data?.PELLETID) {
      sql += ` AND LOM_ID_BATCH = '${data?.PELLETID}' `;
    }

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getInitialpalletID = async () => {
  try {
    const sql = `SELECT CD_VALUE FROM V_CODES
WHERE CD_TYPE = 'TB063' `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
