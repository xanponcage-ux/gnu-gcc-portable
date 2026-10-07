import query from "../infrastructure/database/querys";
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
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
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
    // console.log("sql::: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    const sql = `INSERT INTO V_BARE_PDO_TEMP(
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
            TBP_VISUAL_INSP_80,
            TBP_ASL_NO_80,
            TBP_HOLD_RSN,
            TBP_SHIFT_DN)
            VALUES(:PLANT,:BATCH_NO,:CUR_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,substr(F_Tatadate(TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')),1,1),
                   :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ORDER_NO,:ITEM,
                   :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
                    TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:TBP_HEAT_NO,:INSP_NAME,:PIPE_LNG_10,
                    :TBP_VISUAL_INSP_80,
                    :TBP_ASL_NO_80,
                    :HOLD_RSN,:SHIFT) `;

    let binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CUR_PROC: data.CUR_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      WEIGHT: data.WEIGHT,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ORDER_NO: data.ORDER_NO,
      ITEM: data.ITEM,
      QUALITY_CD: data.QUALITY_CD,
      MATNR: data.MATNR,
      FLAG: data.FLAG,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      RESULT: data.RESULT,
      REMARK: data.REMARK,
      TBP_HEAT_NO: data.TBP_HEAT_NO,
      INSP_NAME: data.INSP_NAME,
      PIPE_LNG_10: data.PIPE_LNG_10,
      // TBP_DIA_END_10: data.TBP_DIA_END_10,
      TBP_VISUAL_INSP_80: data.TBP_VISUAL_INSP_80,
      TBP_ASL_NO_80: data.TBP_ASL_NO_80,
      HOLD_RSN: data.HOLD_RSN,
    };
    console.log("INSERT binds: ", binds); //qq
    console.log("INSERT sql: ", sql); //qq
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("tempinserterror", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc90 = async (data: any) => {
  try {
    let resData = [];
    const sql = `call LDPDBA.LD09B001(
                        LS_BATCH_NO => :LS_BATCH_NO,
                        LS_CD_PROC => :LS_CD_PROC,
                        LS_PLANT_CD => :LS_PLANT_CD,
                        ls_out_flag => :LS_OUT_FLAG
                        )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.CUR_PROC ? data.CUR_PROC : "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("LD09B001 binds: ", binds); //qq
    const result = await query.executeQuery(sql, binds);
    console.log("LD09B001 result: ", result); //qq
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log("procedureerror", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    let sql = ` Delete V_BARE_PDO_TEMP
                        where  tbp_cd_proc= :CUR_PROC
                        and tbp_plant_cd= :plant `;
    let binds = {
      CUR_PROC: data.CUR_PROC ? data.CUR_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };
    console.log("DELETE", sql, binds); //qq
    return await query.executeQuery(sql, binds);
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

export const getnxtproc = async (pipeno: any) => {
  try {
    //console.log("rmBatch: ", rmBatch); //

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

export const getFillData = async (data: any) => {
  try {
    let sql = ` SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,LOM_LENGTH TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO,TBP_WEIGHT,LOM_NO_CAST TBP_HEAT_NO,
      TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM,ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
      (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, 'A') as nxtproc from dual) NEXT_PROC,
      (select A.TBP_ASL_NO_80 FROM V_BARE_PDO A
               where A.TBP_BATCH_NO = LOM_ID_BATCH
                 and A.TBP_CD_PROC = '8'
                 and A.TBP_BATCH_PROC_NO = (
                   select MAX(B.TBP_BATCH_PROC_NO) FROM V_BARE_PDO B
                   where A.TBP_BATCH_NO = B.TBP_BATCH_NO
                     and B.TBP_CD_PROC = '8'
                 )
               and rownum = 1) TBP_ASL_NO_80 , LOM_ID_PAR_COIL_NO
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
      sql += ` AND TBP_BATCH_NO = '${data.PIPE_NO}' AND TBP_CD_PROC = '1'`;
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

    console.log("filldataqry90", sql);
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

export const getOrderDetails = async (pipeno: any) => {
  try {
    //console.log("rmBatch: ", rmBatch);

    let sql = ` SELECT LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,ENC_CUST_NAME FROM v_ldp_prodn,V_END_CUST_ORD_EPA
                  WHERE LOM_ID_ORDER_CUS = ENC_ID_ORDER and LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM 
                  
                  and LOM_ID_BATCH = '${pipeno}' `;

    console.log("orderDetails", sql);

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
