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

export const insertTempData = async (data: any) => {
  try {
    //console.log("insertdata20",data)
    const sql = ` INSERT INTO V_BARE_PDO_TEMP(
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
        TBP_HEAT_NO,
        TBP_INSP_NAME,
        TBP_PIPE_LNG_10,
        TBP_CB_FEND_130,
        TBP_CB_TEND_130,
        TBP_EP_FEND_130,
        TBP_EP_TEND_130,
        TBP_CA_FEND_130,
        TBP_CA_TEND_130,
        TBP_HOLIDAT_130,
        TBP_RESUMG_1_130,
        TBP_RESUMG_2_130,
        TBP_RESUMG_3_130,
        TBP_RESUMG_4_130,
        TBP_FSTATION_130,
        TBP_FLD_NO_130,
        TBP_HOLD_RSN,
        TBP_SHIFT_DN)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,substr(F_Tatadate(TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')),1,1),
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ID_ORDER_NO,:ITEM_NO,
               :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_LNG_10,:CB_FEND_130,:CB_TEND_130,:EP_FEND_130,:EP_TEND_130,:CA_FEND_130,:CA_TEND_130,:HOLIDAT_130,
               :RESUMG_1_130,:RESUMG_2_130,:RESUMG_3_130,:RESUMG_4_130,:FSTATION_130, :FIELD_NO,
               :HOLD_RSN,:SHIFT) `;
    let binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CD_PROC: data.C_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      WEIGHT: data.WEIGHT,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ID_ORDER_NO: data.ID_ORDER_NO,
      ITEM_NO: data.ITEM_NO,
      QUALITY_CD: data.QUALITY_CD,
      MATNR: data.MATNR,
      FLAG: data.FLAG,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      RESULT: data.RESULT,
      REMARK: data.REMARK,
      HEAT_NO: data.HEAT_NO,
      INSP_NAME: data.INSP_NAME,
      PIPE_LNG_10: data.PIPE_LNG_10,
      CB_FEND_130: data.CB_FEND_130,
      CB_TEND_130: data.CB_TEND_130,
      EP_FEND_130: data.EP_FEND_130,
      EP_TEND_130: data.EP_TEND_130,
      CA_FEND_130: data.CA_FEND_130,
      CA_TEND_130: data.CA_TEND_130,
      HOLIDAT_130: data.HOLIDAT_130,
      RESUMG_1_130: data.RESUMG_1_130,
      RESUMG_2_130: data.RESUMG_2_130,
      RESUMG_3_130: data.RESUMG_3_130,
      RESUMG_4_130: data.RESUMG_4_130,
      FSTATION_130: data.FSTATION_130,
      FIELD_NO: data.FIELD_NO,
      HOLD_RSN: data.HOLD_RSN,
    };
    // console.log("insert130: ", sql);
    // console.log("binds130: ", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc130 = async (data: any) => {
  try {
    //console.log("20querydata",data)
    let resData = [];
    const sql = `call LDPDBA.LD13B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.C_PROC ? data.C_PROC : "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("binds: ", binds);
    // console.log("query: ", sql);
    const result = await query.executeQuery(sql, binds);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    // console.log("dataDlt: ", data);
    let sql = ` Delete V_BARE_PDO_TEMP
                    where tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      curproc: data.C_PROC ? data.C_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };
    // console.log("bindsDlt: ", binds);
    // console.log("sqlDlt: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delete error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (data: any) => {
  try {
    let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,LOM_LENGTH TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO,
              TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC, LOM_MS_PIECE_ACTL WEIGHT,
             (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, 'E') as nxtproc from dual) NEXT_PROC,
             (select E.TBP_ASL_NO_80 FROM V_BARE_PDO E
                    where E.TBP_BATCH_NO = LOM_ID_BATCH
                      and E.TBP_CD_PROC = '8'
                      and E.TBP_BATCH_PROC_NO = (
                        SELECT MAX(t5.TBP_BATCH_PROC_NO) FROM V_BARE_PDO t5
                        WHERE E.TBP_BATCH_NO = t5.TBP_BATCH_NO
                          AND t5.TBP_CD_PROC = '8'
                      )
                    and rownum = 1) ASL_NO,
             (select CASE WHEN REGEXP_LIKE(A.TBP_DIA_END_10, '^[0-9]+$') THEN TO_NUMBER(A.TBP_DIA_END_10) ELSE NULL END FROM V_BARE_PDO A
                    where A.TBP_BATCH_NO = LOM_ID_BATCH
                      and A.TBP_CD_PROC = 'A'
                      and A.TBP_BATCH_PROC_NO = (
                        SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                        WHERE A.TBP_BATCH_NO = x.TBP_BATCH_NO
                          AND x.TBP_CD_PROC = 'A'
                      )
                    and rownum = 1) TBP_DIA_END_10,
                           (select X.TBP_COT_WT_VS_120 FROM V_BARE_PDO X
                    where X.TBP_BATCH_NO = LOM_ID_BATCH
                      and X.TBP_CD_PROC = 'D'
                      and X.TBP_BATCH_PROC_NO = (
                        SELECT MAX(Y.TBP_BATCH_PROC_NO) FROM V_BARE_PDO Y
                        WHERE X.TBP_BATCH_NO = Y.TBP_BATCH_NO
                          AND Y.TBP_CD_PROC = 'D'
                      )
                    and rownum = 1) COAT_WT,
                           (select Z.TBP_FLD_TEST_120 FROM V_BARE_PDO Z
                    where Z.TBP_BATCH_NO = LOM_ID_BATCH
                      and Z.TBP_CD_PROC = 'D'
                      and Z.TBP_BATCH_PROC_NO = (
                        SELECT MAX(W.TBP_BATCH_PROC_NO) FROM V_BARE_PDO W
                        WHERE Z.TBP_BATCH_NO = W.TBP_BATCH_NO
                          AND W.TBP_CD_PROC = 'D'
                      )
                    and rownum = 1) FIELD_TEST, LOM_ID_PAR_COIL_NO
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

    // Apply filters: prefer PIPE_NO, then RM_BATCH, then ORDER/ITEM (LD08 behaviour)
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
      sql += ` AND TBP_ID_ORDER_NO = '${data.ORDNO}' AND TBP_ITEM_NO = '${data.ORDITEM}' AND TBP_CD_PROC = '1'`;
    }

    sql += ` order by tbp_dia_end_10 `;
    console.log("filldataqry130", sql);
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
