import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any, mill: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= '${status}'
        and LOM_CD_EPA='0780'
        AND LOM_CD_QLTY_ACTL<>'SCRP'`;

    if (mill !== "") {
      sql += ` AND LOM_MILL_NO = '${mill}'`;
    }

    // let binds = {
    //   status: status,
    // };
    //
    //
    // console.log("sql    RM----->", sql);
    // console.log("mill   RM----->", mill);
    // console.log("status RM----->", status);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any, mill: any) => {
  try {
    let sql = `select DISTINCT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO,LOM_MILL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' 
        AND LOM_CD_QLTY_ACTL<>'SCRP' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }

    if (mill !== "") {
      sql += ` AND LOM_MILL_NO = '${mill}'`;
    }

    sql += ` order by 1`;
    // console.log("sql getPipeNoList----->", sql);
    // console.log("mill getPipeNoList----->", mill);
    // console.log("rmBatch getPipeNoList----->", rmBatch);
    // console.log("status getPipeNoList----->", status);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatNo = async (rmBatch: any, pipeno: any) => {
  try {
    let sql = `select LOM_NO_MATNR from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;
    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPono = async (rmBatch: any, pipeno: any) => {
  try {
    let sql = ` select LOM_ID_ORDER_CUS from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;

    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
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
        TBP_PIPE_OD_10,
        TBP_PIPE_THK_10,
        TBP_PIPE_LNG_10,
        TBP_ANGLE_20,
        TBP_HOLD_RSN)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,:SHIFT,
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ORDER_NO,:ITEM_NO,
               :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
                TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),
               :RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_OD_10,:PIPE_THK_10,:PIPE_LNG_10,:ANGLE,:HOLD_RSN) `;
    let binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CD_PROC: data.CD_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      WEIGHT: data.WEIGHT,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ORDER_NO: data.ID_ORDER_NO,
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
      PIPE_OD_10: data.PIPE_OD_10,
      PIPE_THK_10: data.PIPE_THK_10,
      PIPE_LNG_10: data.PIPE_LNG_10,
      ANGLE: data.ANGLE,
      HOLD_RSN: data.HOLD_RSN,
    };
    console.log('insertTempData 20',sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("insertquery: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc20 = async (data: any) => {
  try {
    let resData = [];
    const sql = `call LDPDBA.LD02B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.CD_PROC ? data.CD_PROC : "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    console.log('callproc20 ',sql, binds);
    const result = await query.executeQuery(sql, binds);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log("procedure error: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    let sql = ` Delete V_BARE_PDO_TEMP 
                    where tbp_batch_no= :Batchno 
                    and  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.BATCH_NO ? data.BATCH_NO : "",
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };
console.log('deleteTempData 20',sql, binds);
    let delRes = await query.executeQuery(sql, binds);
    return delRes;
  } catch (error) {
    console.log("delete error: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getorderwiseProdData = async (RM_BATCH: any) => {
  try {
    let sql = `select EWI_ID_ORDER_CUS,EWI_ID_ORD_ITEM_CUS,EOM_MS_PIECE_ACTL,EWI_MS_PIECE_ACTL,EWI_SEC1,EWI_SEC2,0 EWI_LENGTH,0 TUBE_COUNT
        from V_WORK_INST,V_LDP_PRODN
        WHERE  LOM_CD_EPA=ewi_cd_epa and LOM_ID_BATCH=ewi_id_batch AND LOM_ID_PAR_COIL_NO=:RM_BATCH`;
    let binds = {
      RM_BATCH: RM_BATCH,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, pipeno: any, status: any) => {
  try {
    console.log("==> ", rmBatch, pipeno, status);
    // let sql = `SELECT TBP_BATCH_NO, TBP_PIPE_OD_10, TBP_PIPE_THK_10, TBP_PIPE_LNG_10,
    //    TBP_NO_MATNR, TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
    //    (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC
    //       FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
    //      WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
    //        AND TBP_ITEM_NO = ENC_NO_ITEM
    //        AND TBP_BATCH_NO = LOM_ID_BATCH
    //        AND TBP_PLANT_CD = LOM_CD_EPA
    //        AND LOM_CD_EPA = ENC_CD_EPA
    //        AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
    //        AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
    //        AND TBP_PAR_COIL_NO = '${rmBatch}' `;


        let sql = ` select lom_id_batch TBP_BATCH_NO, lom_sec2 TBP_PIPE_OD_10, lom_sec1 TBP_PIPE_THK_10, lom_length TBP_PIPE_LNG_10, lom_no_matnr TBP_NO_MATNR,
          enc_id_order ORDER_NO, enc_no_item ITEM, enc_cust_name CUST_NAME, lom_planned_proc PLAN_PROC, LOM_ID_PAR_COIL_NO TBP_PAR_COIL_NO,
           (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC
           from v_ldp_prodn, v_end_cust_ord_epa
           where lom_id_order_cus = enc_id_order(+)
           and lom_id_ord_item_cus = enc_no_item(+)
           and lom_cd_status = '${status}' `;

    // let sql = ` select lom_id_batch TBP_BATCH_NO, lom_sec2 TBP_PIPE_OD_10, lom_sec1 TBP_PIPE_THK_10, lom_length TBP_PIPE_LNG_10, lom_no_matnr TBP_NO_MATNR,
    //       enc_id_order ORDER_NO, enc_no_item ITEM, enc_cust_name CUST_NAME, lom_planned_proc PLAN_PROC,
    //        (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC
    //        from v_ldp_prodn, v_end_cust_ord_epa
    //        where lom_id_order_cus = enc_id_order(+)
    //        and lom_id_ord_item_cus = enc_no_item(+)
    //        and lom_id_par_coil_no = '${rmBatch}'
    //        and lom_cd_status = '${status}' `;

    // let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR from v_bare_pdo
    //            where TBP_PAR_COIL_NO = '${rmBatch}'`;

    if (rmBatch != 'XX'){
    if (rmBatch != "" || rmBatch != null || rmBatch != undefined) {
      sql += `and lom_id_par_coil_no = '${rmBatch}'`;
    }
    }

    if (pipeno != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`;
      sql += `and lom_id_batch = '${pipeno}'`;
    }
    // else {
    //   sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
    //                  AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`;
    // }
    console.log("sql: ", sql);

    let results = await query.executeQuery(sql);
    console.log("results: ", results);
    return results;
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

export const getOrderDetails = async (pipeno: any) => {
  try {
    let sql = ` SELECT LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,ENC_CUST_NAME FROM v_ldp_prodn,V_END_CUST_ORD_EPA
                    WHERE LOM_ID_ORDER_CUS = ENC_ID_ORDER and LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM 
                    
                    and LOM_ID_BATCH = '${pipeno}' `;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHoldRsn = async () => {
  try {
    let sql: any = `select CD_VALUE,CD_DESC from V_CODES
                            WHERE CD_TYPE='LDP101'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
