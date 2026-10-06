import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const insertTempData = async (data: any) => {
  try {
    console.log("insertdata30", data);
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
        TBP_GAUGE_ID_30,
        TBP_GAUGE_ID_1_30,
        TBP_CALIB_DATE_30,
        TBP_CALIB_DUE_DT_30,
        TBP_GAUGE_RANGE_30,
        TBP_HOLD_RSN)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,:SHIFT,
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ID_ORDER_NO,:ITEM_NO,
               :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
               TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_OD_10,:PIPE_THK_10,:PIPE_LNG_10,:GAUGE_ID, :GAUGE_ID_2, :CALIB_DATE,:CALIB_DUE_DT,:GAUGE_RANGE,:HOLD_RSN) `;

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
      PIPE_OD_10: data.PIPE_OD_10,
      PIPE_THK_10: data.PIPE_THK_10,
      PIPE_LNG_10: data.PIPE_LNG_10,
      GAUGE_ID: data.GAUGE_ID,
      GAUGE_ID_2: data.GAUGE_ID_2,
      CALIB_DATE: data.CALIB_DT,
      CALIB_DUE_DT: data.CALIB_DUE_DT,
      GAUGE_RANGE: data.GAUGE_RANGE,
      HOLD_RSN: data.HOLD_RSN,
    };
    console.log("30insert", sql);
    console.log("binds", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc30 = async (data: any) => {
  try {
    //console.log("30querydata",data)
    let resData = [];
    const sql = `call LDPDBA.LD03B001(
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
    //console.log("binds",binds)
    //console.log("query",sql)
    const result = await query.executeQuery(sql, binds);
    console.log("proflag", result);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    console.log("resData: ", resData);
    return resData;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    //console.log("deletedata",data)
    let sql = ` Delete V_BARE_PDO_TEMP 
                    where tbp_batch_no= :Batchno 
                    and  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.BATCH_NO ? data.BATCH_NO : "",
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };

    console.log("deletebind", binds);
    return await query.executeQuery(sql, binds);
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
    //console.log("rmBatch: ", rmBatch);

    let sql = ` select LOM_ID_ORDER_CUS from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;

    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }

    //console.log("pON0s30",sql)
    return await query.executeQuery(sql);
  } catch (error) {
    //console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, pipeno: any, status: any) => {
  try {
    // let sql = `SELECT TBP_BATCH_NO, TBP_PIPE_OD_10, TBP_PIPE_THK_10, TBP_PIPE_LNG_10,
    //    TBP_NO_MATNR, TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
    //    (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '3') as nxtproc from dual) NEXT_PROC
    //       FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
    //      WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
    //        AND TBP_ITEM_NO = ENC_NO_ITEM
    //        AND TBP_BATCH_NO = LOM_ID_BATCH
    //        AND TBP_PLANT_CD = LOM_CD_EPA
    //        AND LOM_CD_EPA = ENC_CD_EPA
    //        AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
    //        AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
    //        AND TBP_PAR_COIL_NO = '${rmBatch}' `;

    // let sql = ` select lom_id_batch TBP_BATCH_NO, lom_sec2 TBP_PIPE_OD_10, lom_sec1 TBP_PIPE_THK_10, 
    // lom_length TBP_PIPE_LNG_10, lom_no_matnr TBP_NO_MATNR,
    //       enc_id_order ORDER_NO, enc_no_item ITEM, enc_cust_name CUST_NAME, lom_planned_proc PLAN_PROC,
    //        (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '3') as nxtproc from dual) NEXT_PROC
    //        from v_ldp_prodn, v_end_cust_ord_epa
    //        where lom_id_order_cus = enc_id_order(+)
    //        and lom_id_ord_item_cus = enc_no_item(+)
    //        and lom_id_par_coil_no = '${rmBatch}'
    //        and lom_cd_status = '${status}' `;

        let sql = ` select lom_id_batch TBP_BATCH_NO, lom_sec2 TBP_PIPE_OD_10, lom_sec1 TBP_PIPE_THK_10, 
    lom_length TBP_PIPE_LNG_10, lom_no_matnr TBP_NO_MATNR,
          enc_id_order ORDER_NO, enc_no_item ITEM, enc_cust_name CUST_NAME, lom_planned_proc PLAN_PROC,
           (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '3') as nxtproc from dual) NEXT_PROC , LOM_ID_PAR_COIL_NO TBP_PAR_COIL_NO
           from v_ldp_prodn, v_end_cust_ord_epa
           where lom_id_order_cus = enc_id_order(+)
           and lom_id_ord_item_cus = enc_no_item(+)
           and lom_cd_status = '${status}' `;

           if (rmBatch != 'XX'){
    if (rmBatch != "" || rmBatch != null || rmBatch != undefined) {
      sql += `and lom_id_par_coil_no = '${rmBatch}'`;
    }
    }

    // let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR from v_bare_pdo
    //            where TBP_PAR_COIL_NO = '${rmBatch}' `;

    if (pipeno != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND TBP_CD_PROC = '1'`;
      sql += `and lom_id_batch = '${pipeno}'`;
    }
    // else {
    //   sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
    //                  AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`;
    // }

    console.log("filldataqry30", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getnxtproc = async (pipeno: any) => {
  try {
    //console.log("rmBatch: ", rmBatch);

    let sql = ` select LOM_PLANNED_PROC PLANNED_PROC,LOM_PASSED_PROC PASSED_PROC from V_LDP_PRODN 
                   WHERE LOM_ID_BATCH= '${pipeno}' `;

    console.log("nxtproc", sql);

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callfunction = async (
  Planned_proc: any,
  Passed_proc: any,
  currproc: any
) => {
  try {
    let sql = ` select F_GET_NEXTPROC(:planned_proc,:passed_proc ,:curr_proc ) as nxtproc from dual `;

    let binds = {
      planned_proc: Planned_proc,
      passed_proc: Passed_proc,
      curr_proc: currproc,
    };
    console.log("nxtproc", sql);

    return await query.executeQuery(sql, binds);
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
