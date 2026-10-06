import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= :status
        and LOM_CD_EPA='0780'
        AND LOM_CD_QLTY_ACTL<>'SCRP'`;
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

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    console.log("pipeno", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    // Extended INSERT to include full TBP_* columns required by LD15
    const sql = `INSERT INTO V_BARE_PDO_TEMP (
      TBP_PLANT_CD,
      TBP_BATCH_NO,
      TBP_CD_PROC,
      TBP_BATCH_PROC_NO,
      TBP_NEXT_PROC,
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
      TBP_INSP_NAME,
      TBP_SAMPLE_10,
      TBP_ASL_NO_80,
      TBP_VISUAL_INSP_80,
      TBP_FLD_NO_130,
      TBP_AMBT_TMP_100,
      TBP_RH_100,
      TBP_DEW_TMP_100,
      TBP_WFT_F1_150,
      TBP_WFT_F2_150,
      TBP_WFT_F3_150,
      TBP_WFT_F4_150,
      TBP_WFT_T1_150,
      TBP_WFT_T2_150,
      TBP_WFT_T3_150,
      TBP_WFT_T4_150,
      TBP_COT_WT_IN_150,
      TBP_ME_FEND_150,
      TBP_UME_TEND_150,
      TBP_RMUSE1_150,
      TBP_RMUSE2_150,
      TBP_RMUSE3_150,
      TBP_RMUSE4_150,
      TBP_RMUSE5_150,
      TBP_BATCH1_150,
      TBP_BATCH2_150,
      TBP_BATCH3_150,
      TBP_BATCH4_150,
      TBP_BATCH5_150,
      TBP_LINES_SPED_150,
      TBP_MIXPAINT_RATIO_150,
      TBP_QUANTITY_150,
      TBP_SAMPL_TAG,
      TBP_WORK_CENTER,
      TBP_SHIFT_DN
    ) VALUES (
      :PLANT,
      :BATCH_NO,
      :CD_PROC,
      :BATCH_PROC_NO,
      :NEXT_PROC,
      :PROD_DATE,
      substr(F_Tatadate(TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')),1,1),
      :TBP_WEIGHT,
      :STATUS,
      :PAR_COIL_NO,
      :TBP_ID_FIRST_PAR,
      :ID_ORDER_NO,
      :ITEM_NO,
      :TBP_QUALITY_CD,
      :NO_MATNR,
      :TBP_CD_FLAG,
      TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
      TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),
      :RESULT,
      :TBP_REMARK,
      :TBP_INSP_NAME,
      :TBP_SAMPLE_10,
      :TBP_ASL_NO_80,
      :TBP_VISUAL_INSP_80,
      :TBP_FLD_NO_130,
      :TBP_AMBT_TMP_100,
      :TBP_RH_100,
      :TBP_DEW_TMP_100,
      :TBP_WFT_F1_150,
      :TBP_WFT_F2_150,
      :TBP_WFT_F3_150,
      :TBP_WFT_F4_150,
      :TBP_WFT_T1_150,
      :TBP_WFT_T2_150,
      :TBP_WFT_T3_150,
      :TBP_WFT_T4_150,
      :TBP_COT_WT_IN_150,
      :TBP_ME_FEND_150,
      :TBP_UME_TEND_150,
      :TBP_RMUSE1_150,
      :TBP_RMUSE2_150,
      :TBP_RMUSE3_150,
      :TBP_RMUSE4_150,
      :TBP_RMUSE5_150,
      :TBP_BATCH1_150,
      :TBP_BATCH2_150,
      :TBP_BATCH3_150,
      :TBP_BATCH4_150,
      :TBP_BATCH5_150,
      :TBP_LINES_SPED_150,
      :TBP_MIXPAINT_RATIO,
      :TBP_QUANTITY_150,
      :TBP_SAMPL_TAG,
      :TBP_WORK_CENTER,
      :TBP_SHIFT_DN
    )`;

    // Accept either CD_PROC (new) or C_PRC (frontend legacy) for compatibility
    const binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,

      CD_PROC: data.CD_PROC || data.C_PRC || null,

      BATCH_PROC_NO: data.BATCH_PROC_NO || 0,

      NEXT_PROC: data.NEXT_PROC || null,

      PROD_DATE: data.PROD_DATE || null,

      TBP_WEIGHT: data.TBP_WEIGHT || null,

      STATUS: data.STATUS || null,

      PAR_COIL_NO: data.PAR_COIL_NO || null,

      TBP_ID_FIRST_PAR: data.TBP_ID_FIRST_PAR || null,

      ID_ORDER_NO: data.ID_ORDER_NO || null,

      ITEM_NO: data.ITEM_NO || null,

      TBP_QUALITY_CD: data.TBP_QUALITY_CD || null,

      NO_MATNR: data.NO_MATNR || data.TBP_NO_MATNR || null,

      TBP_CD_FLAG: data.TBP_CD_FLAG || null,

      START_DT: data.START_DT || null,

      END_DT: data.END_DT || null,

      RESULT: data.RESULT || null,

      TBP_REMARK: data.TBP_REMARK || data.HOLD_RSN || null,

      TBP_INSP_NAME: data.TBP_INSP_NAME || data.INSP_NAME || null,

      TBP_SAMPLE_10:
        String(data.TBP_SAMPLE_10 || "NO").toUpperCase() === "YES"
          ? "YES"
          : "NO",

      TBP_ASL_NO_80: data.TBP_ASL_NO_80 || null,

      TBP_VISUAL_INSP_80: data.TBP_VISUAL_INSP_80 || null,

      TBP_FLD_NO_130: data.TBP_FLD_NO_130 || null,

      TBP_AMBT_TMP_100: data.TBP_AMBT_TMP_100 || null,

      TBP_RH_100: data.TBP_RH_100 || null,

      TBP_DEW_TMP_100: data.TBP_DEW_TEMP_100 || data.TBP_DEW_TMP_100 || null,

      TBP_WFT_F1_150: data.TBP_WFT_F1_150 || null,

      TBP_WFT_F2_150: data.TBP_WFT_F2_150 || null,

      TBP_WFT_F3_150: data.TBP_WFT_F3_150 || null,

      TBP_WFT_F4_150: data.TBP_WFT_F4_150 || null,

      TBP_WFT_T1_150: data.TBP_WFT_T1_150 || null,

      TBP_WFT_T2_150: data.TBP_WFT_T2_150 || null,

      TBP_WFT_T3_150: data.TBP_WFT_T3_150 || null,

      TBP_WFT_T4_150: data.TBP_WFT_T4_150 || null,

      TBP_COT_WT_IN_150: data.TBP_COT_WT_IN_150 || null,

      TBP_ME_FEND_150: data.TBP_ME_FEND_150 || null,

      TBP_UME_TEND_150: data.TBP_UME_TEND_150 || null,

      TBP_RMUSE1_150: data.TBP_RMUSE1_150 || null,

      TBP_RMUSE2_150: data.TBP_RMUSE2_150 || null,

      TBP_RMUSE3_150: data.TBP_RMUSE3_150 || null,

      TBP_RMUSE4_150: data.TBP_RMUSE4_150 || null,

      TBP_RMUSE5_150: data.TBP_RMUSE5_150 || null,

      TBP_BATCH1_150: data.TBP_BATCH1_150 || null,

      TBP_BATCH2_150: data.TBP_BATCH2_150 || null,

      TBP_BATCH3_150: data.TBP_BATCH3_150 || null,

      TBP_BATCH4_150: data.TBP_BATCH4_150 || null,

      TBP_BATCH5_150: data.TBP_BATCH5_150 || null,

      TBP_LINES_SPED_150: data.TBP_LINES_SPED_150 || null,

      TBP_MIXPAINT_RATIO: data.TBP_MIXPAINT_RATIO || null,

      TBP_QUANTITY_150: data.TBP_QUANTITY_150 || null,

      TBP_SAMPL_TAG: data.TBP_SAMPL_TAG || null,

      TBP_WORK_CENTER: data.TBP_WORK_CENTER || null,

      TBP_SHIFT_DN: data.TBP_SHIFT_DN || data.SHIFT || null,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc150 = async (data: any) => {
  try {
    let resData = [];
    const sql = `call LDPDBA.LD15B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.CD_PROC || data.C_PRC || "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    const result = await query.executeQuery(sql, binds);
    console.log("proflag150", result);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log("procedure error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    console.log("deletedata", data);
    let sql = ` Delete V_BARE_PDO_TEMP 
                    where tbp_batch_no= :Batchno 
                    and  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.BATCH_NO ? data.BATCH_NO : "",
      curproc: data.CD_PROC || data.C_PRC || "",
      plant: data.PLANT ? data.PLANT : "",
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delete error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (data: any) => {
  try {
    let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR ,
        TBP_VISUAL_INSP_80,
    TBP_AMBT_TMP_100,
    TBP_RH_100,
    --TBP_DEW_TEMP_100,
    TBP_WFT_F1_150,
    TBP_WFT_F2_150,
    TBP_WFT_F3_150,
    TBP_WFT_F4_150,
    TBP_WFT_T1_150,
    TBP_WFT_T2_150,
    TBP_WFT_T3_150,
    TBP_WFT_T4_150,
    TBP_ME_FEND_150,
    TBP_UME_TEND_150,
    TBP_RMUSE1_150,
    TBP_RMUSE2_150,
    TBP_RMUSE3_150,
    TBP_RMUSE4_150,
    TBP_RMUSE5_150,
    TBP_BATCH1_150,
    TBP_BATCH2_150,
    TBP_BATCH3_150,
    TBP_BATCH4_150,
    TBP_BATCH5_150,
    TBP_LINES_SPED_150,
    --TBP_MIXPAINT_RATIO,
    TBP_QUANTITY_150,
    (select A.TBP_DIA_END_10 FROM V_BARE_PDO A
        where A.TBP_BATCH_NO = TBP_BATCH_NO
          and A.TBP_CD_PROC = 'A'
          and A.TBP_BATCH_PROC_NO = (
            SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
            WHERE A.TBP_BATCH_NO = x.TBP_BATCH_NO
              AND x.TBP_CD_PROC = 'A'
          )
        and rownum = 1) TBP_DIA_END_10
        FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
                       WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
                         AND TBP_ITEM_NO = ENC_NO_ITEM
                         AND TBP_BATCH_NO = LOM_ID_BATCH
                         AND TBP_PLANT_CD = LOM_CD_EPA
                         AND LOM_CD_EPA = ENC_CD_EPA
                         AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
                         AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
                         AND LOM_CD_STATUS = '${data.STATUS}'
                         AND TBP_BATCH_PROC_NO = (
                           SELECT MAX(t1.TBP_BATCH_PROC_NO) FROM V_BARE_PDO t1
                           WHERE TBP_BATCH_NO = t1.TBP_BATCH_NO
                             AND t1.TBP_CD_PROC = '1'
                         )`;

    if (data.PIPE_NO && data.PIPE_NO !== "") {
      sql += ` AND TBP_BATCH_NO = '${data.PIPE_NO}' AND  TBP_CD_PROC = '1'`;
    } else if (data.RM_BATCH && data.RM_BATCH !== "") {
      sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${data.STATUS}'
                     AND t.lom_id_par_coil_no = '${data.RM_BATCH}') AND TBP_CD_PROC = '1'`;
    } else if (
      data.ORDNO &&
      data.ORDNO !== "" &&
      data.ORDITEM &&
      data.ORDITEM !== ""
    ) {
      sql += ` AND TBP_ID_ORDER_NO = '${data.ORDNO}' AND TBP_ITEM_NO = '${data.ORDITEM}' AND TBP_CD_PROC = '1' AND TBP_CD_PROC = '1'`;
    } else {
      sql += ` AND 1=0`;
    }

    console.log("filldataqry150", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTataDate = async (prodEndDt: any) => {
  try {
    const sql = `select substr(F_Tatadate(
              TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),1,1)
               shift,substr(F_Tatadate(TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),2) prod_dt from dual`;
    const binds = {
      prodEndDt: prodEndDt,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
