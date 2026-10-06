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
        TBP_PIPTMP_BECRM_110,
        TBP_CHRM_VISUAL_110,
        TBP_CHRM_TMP_110,
        TBP_PIPTMP_AFCRM_110,
        TBP_PIPTMP_BEFBE_110,
        TBP_TMP_ADHEF_FIL_110,
        TBP_TMP_PEFILM_110,
        TBP_QUN_WA_BETMP_110,
        TBP_QUN_WA_AFTMP_110,
        TBP_EPGUN_1_110,
        TBP_EPGUN_2_110,
        TBP_EPGUN_3_110,
        TBP_EPGUN_4_110,
        TBP_EPGUN_5_110,
        TBP_EPGUN_6_110,
        TBP_EPGUN_7_110,
        TBP_EPGUN_8_110,
        TBP_EPGUN_9_110,
        TBP_EPGUN_10_110,
        TBP_EPGUN_11_110,
        TBP_EPGUN_12_110,
        TBP_EPGUN_13_110,
        TBP_EPGUN_14_110,
        TBP_EPGUN_15_110,
        TBP_EPGUN_16_110,
        TBP_EPGUN_17_110,
        TBP_EPGUN_18_110,
        TBP_EPGUN_19_110,
        TBP_EPGUN_20_110,
        TBP_EPGUN_21_110,
        TBP_EPGUN_22_110,
        TBP_EPGUN_23_110,
        TBP_EPGUN_24_110,
        TBP_AIRPRESS_1_110,
        TBP_AIRPRESS_2_110,
        TBP_AIRPRESS_3_110,
        TBP_AIRPRESS_4_110,
        TBP_AIRPRESS_5_110,
        TBP_AIRPRESS_6_110,
        TBP_AIRPRESS_7_110,
        TBP_AIRPRESS_8_110,
        TBP_AIRPRESS_9_110,
        TBP_AIRPRESS_10_110,
        TBP_AIRPRESS_11_110,
        TBP_AIRPRESS_12_110,
        TBP_AIRPRESS_13_110,
        TBP_AIRPRESS_14_110,
        TBP_AIRPRESS_15_110,
        TBP_AIRPRESS_16_110,
        TBP_AIRPRESS_17_110,
        TBP_AIRPRESS_18_110,
        TBP_AIRPRESS_19_110,
        TBP_AIRPRESS_20_110,
        TBP_AIRPRESS_21_110,
        TBP_AIRPRESS_22_110,
        TBP_AIRPRESS_23_110,
        TBP_AIRPRESS_24_110,
        TBP_FLWRATE_1_110,
        TBP_FLWRATE_2_110,
        TBP_FLWRATE_3_110,
        TBP_FLWRATE_4_110,
        TBP_FLWRATE_5_110,
        TBP_FLWRATE_6_110,
        TBP_FLWRATE_7_110,
        TBP_FLWRATE_8_110,
        TBP_FLWRATE_9_110,
        TBP_FLWRATE_10_110,
        TBP_FLWRATE_11_110,
        TBP_FLWRATE_12_110,
        TBP_FLWRATE_13_110,
        TBP_FLWRATE_14_110,
        TBP_FLWRATE_15_110,
        TBP_FLWRATE_16_110,
        TBP_FLWRATE_17_110,
        TBP_FLWRATE_18_110,
        TBP_FLWRATE_19_110,
        TBP_FLWRATE_20_110,
        TBP_FLWRATE_21_110,
        TBP_FLWRATE_22_110,
        TBP_FLWRATE_23_110,
        TBP_FLWRATE_24_110,
        TBP_RM_1_110,
        TBP_RM_2_110,
        TBP_RM_3_110,
        TBP_RM_4_110,
        TBP_MANFACT_1_110,
        TBP_MANFACT_2_110,
        TBP_MANFACT_3_110,
        TBP_MANFACT_4_110,
        TBP_CHRM_GR_110,
        TBP_EPOXY_GR_110,
        TBP_ADHA_GR_110,
        TBP_PEPP_GR_110,
        TBP_CHROM_BH_110,
        TBP_EPXY_BH_110,
        TBP_ADHA_BH_110,
        TBP_PEPP_BH_110,
        TBP_LINES_SPED_110,
        TBP_EPXY_DWPT_110,
        TBP_NO_EPGUN_110,
        TBP_HDPE_RPM01_110,
        TBP_HDPE_RPM02_110,
        TBP_ADHE_RPM_110,
        TBP_HOLD_RSN,TBP_SHIFT_DN)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,substr(F_Tatadate(TO_DATE(:END_DT, 'DD/MM/YYYY HH24:MI')),1,1),
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ORDER_NO,:ITEM,
               :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_LNG_10,:PIPTMP_BECRM_110,
               :CHRM_VISUAL_110,:CHRM_TMP_110,:PIPTMP_AFCRM_110,:PIPTMP_BEFBE_110,:TMP_ADHEF_FIL_110,:TMP_PEFILM_110,:QUN_WA_BETMP_110,
               :QUN_WA_AFTMP_110,:EPGUN_1_110,:EPGUN_2_110,:EPGUN_3_110,:EPGUN_4_110,:EPGUN_5_110,:EPGUN_6_110,:EPGUN_7_110,:EPGUN_8_110,
               :EPGUN_9_110,:EPGUN_10_110,:EPGUN_11_110,:EPGUN_12_110,:EPGUN_13_110,:EPGUN_14_110,:EPGUN_15_110,:EPGUN_16_110,:EPGUN_17_110,
               :EPGUN_18_110,:EPGUN_19_110,:EPGUN_20_110,:EPGUN_21_110,:EPGUN_22_110,:EPGUN_23_110,:EPGUN_24_110,:AIRPRESS_1_110,:AIRPRESS_2_110,
               :AIRPRESS_3_110,:AIRPRESS_4_110,:AIRPRESS_5_110,:AIRPRESS_6_110,:AIRPRESS_7_110,:AIRPRESS_8_110,:AIRPRESS_9_110,:AIRPRESS_10_110,
               :AIRPRESS_11_110,:AIRPRESS_12_110,:AIRPRESS_13_110,:AIRPRESS_14_110,:AIRPRESS_15_110,:AIRPRESS_16_110,:AIRPRESS_17_110,:AIRPRESS_18_110,
               :AIRPRESS_19_110,:AIRPRESS_20_110,:AIRPRESS_21_110,:AIRPRESS_22_110,:AIRPRESS_23_110,:AIRPRESS_24_110,:FLWRATE_1_110,:FLWRATE_2_110,
               :FLWRATE_3_110,:FLWRATE_4_110,:FLWRATE_5_110,:FLWRATE_6_110,:FLWRATE_7_110,:FLWRATE_8_110,:FLWRATE_9_110,:FLWRATE_10_110,:FLWRATE_11_110,
               :FLWRATE_12_110,:FLWRATE_13_110,:FLWRATE_14_110,:FLWRATE_15_110,:FLWRATE_16_110,:FLWRATE_17_110,:FLWRATE_18_110,:FLWRATE_19_110,
               :FLWRATE_20_110,:FLWRATE_21_110,:FLWRATE_22_110,:FLWRATE_23_110,:FLWRATE_24_110,:RM_1_110,:RM_2_110,:RM_3_110,:RM_4_110,:MANFACT_1_110,
               :MANFACT_2_110,:MANFACT_3_110,:MANFACT_4_110,:CHRM_GR_110,:EPOXY_GR_110,:ADHA_GR_110,:PEPP_GR_110,:CHROM_BH_110,:EPXY_BH_110,:ADHA_BH_110,:PEPP_BH_110,:LINES_SPED_110,
               :EPXY_DWPT_110,:NO_EPGUN_110,:HDPE_RPM01_110,:HDPE_RPM02_110,:ADHE_RPM_110,:HOLD_RSN ,:SHIFT) `;
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
      ORDER_NO: data.ORDER_NO,
      ITEM: data.ITEM,
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
      PIPTMP_BECRM_110: data.PIPTMP_BECRM_110,
      CHRM_VISUAL_110: data.CHRM_VISUAL_110,
      CHRM_TMP_110: data.CHRM_TMP_110,
      PIPTMP_AFCRM_110: data.PIPTMP_AFCRM_110,
      PIPTMP_BEFBE_110: data.PIPTMP_BEFBE_110,
      TMP_ADHEF_FIL_110: data.TMP_ADHEF_FIL_110,
      TMP_PEFILM_110: data.TMP_PEFILM_110,
      QUN_WA_BETMP_110: data.QUN_WA_BETMP_110,
      QUN_WA_AFTMP_110: data.QUN_WA_AFTMP_110,
      EPGUN_1_110: data.EPGUN_1_110,
      EPGUN_2_110: data.EPGUN_2_110,
      EPGUN_3_110: data.EPGUN_3_110,
      EPGUN_4_110: data.EPGUN_4_110,
      EPGUN_5_110: data.EPGUN_5_110,
      EPGUN_6_110: data.EPGUN_6_110,
      EPGUN_7_110: data.EPGUN_7_110,
      EPGUN_8_110: data.EPGUN_8_110,
      EPGUN_9_110: data.EPGUN_9_110,
      EPGUN_10_110: data.EPGUN_10_110,
      EPGUN_11_110: data.EPGUN_11_110,
      EPGUN_12_110: data.EPGUN_12_110,
      EPGUN_13_110: data.EPGUN_13_110,
      EPGUN_14_110: data.EPGUN_14_110,
      EPGUN_15_110: data.EPGUN_15_110,
      EPGUN_16_110: data.EPGUN_16_110,
      EPGUN_17_110: data.EPGUN_17_110,
      EPGUN_18_110: data.EPGUN_18_110,
      EPGUN_19_110: data.EPGUN_19_110,
      EPGUN_20_110: data.EPGUN_20_110,
      EPGUN_21_110: data.EPGUN_21_110,
      EPGUN_22_110: data.EPGUN_22_110,
      EPGUN_23_110: data.EPGUN_23_110,
      EPGUN_24_110: data.EPGUN_24_110,
      AIRPRESS_1_110: data.AIRPRESS_1_110,
      AIRPRESS_2_110: data.AIRPRESS_2_110,
      AIRPRESS_3_110: data.AIRPRESS_3_110,
      AIRPRESS_4_110: data.AIRPRESS_4_110,
      AIRPRESS_5_110: data.AIRPRESS_5_110,
      AIRPRESS_6_110: data.AIRPRESS_6_110,
      AIRPRESS_7_110: data.AIRPRESS_7_110,
      AIRPRESS_8_110: data.AIRPRESS_8_110,
      AIRPRESS_9_110: data.AIRPRESS_9_110,
      AIRPRESS_10_110: data.AIRPRESS_10_110,
      AIRPRESS_11_110: data.AIRPRESS_11_110,
      AIRPRESS_12_110: data.AIRPRESS_12_110,
      AIRPRESS_13_110: data.AIRPRESS_13_110,
      AIRPRESS_14_110: data.AIRPRESS_14_110,
      AIRPRESS_15_110: data.AIRPRESS_15_110,
      AIRPRESS_16_110: data.AIRPRESS_16_110,
      AIRPRESS_17_110: data.AIRPRESS_17_110,
      AIRPRESS_18_110: data.AIRPRESS_18_110,
      AIRPRESS_19_110: data.AIRPRESS_19_110,
      AIRPRESS_20_110: data.AIRPRESS_20_110,
      AIRPRESS_21_110: data.AIRPRESS_21_110,
      AIRPRESS_22_110: data.AIRPRESS_22_110,
      AIRPRESS_23_110: data.AIRPRESS_23_110,
      AIRPRESS_24_110: data.AIRPRESS_24_110,
      FLWRATE_1_110: data.FLWRATE_1_110,
      FLWRATE_2_110: data.FLWRATE_2_110,
      FLWRATE_3_110: data.FLWRATE_3_110,
      FLWRATE_4_110: data.FLWRATE_4_110,
      FLWRATE_5_110: data.FLWRATE_5_110,
      FLWRATE_6_110: data.FLWRATE_6_110,
      FLWRATE_7_110: data.FLWRATE_7_110,
      FLWRATE_8_110: data.FLWRATE_8_110,
      FLWRATE_9_110: data.FLWRATE_9_110,
      FLWRATE_10_110: data.FLWRATE_10_110,
      FLWRATE_11_110: data.FLWRATE_11_110,
      FLWRATE_12_110: data.FLWRATE_12_110,
      FLWRATE_13_110: data.FLWRATE_13_110,
      FLWRATE_14_110: data.FLWRATE_14_110,
      FLWRATE_15_110: data.FLWRATE_15_110,
      FLWRATE_16_110: data.FLWRATE_16_110,
      FLWRATE_17_110: data.FLWRATE_17_110,
      FLWRATE_18_110: data.FLWRATE_18_110,
      FLWRATE_19_110: data.FLWRATE_19_110,
      FLWRATE_20_110: data.FLWRATE_20_110,
      FLWRATE_21_110: data.FLWRATE_21_110,
      FLWRATE_22_110: data.FLWRATE_22_110,
      FLWRATE_23_110: data.FLWRATE_23_110,
      FLWRATE_24_110: data.FLWRATE_24_110,
      RM_1_110: data.RM_1_110,
      RM_2_110: data.RM_2_110,
      RM_3_110: data.RM_3_110,
      RM_4_110: data.RM_4_110,
      MANFACT_1_110: data.MANFACT_1_110,
      MANFACT_2_110: data.MANFACT_2_110,
      MANFACT_3_110: data.MANFACT_3_110,
      MANFACT_4_110: data.MANFACT_4_110,
      CHRM_GR_110: data.CHRM_GR_110,
      EPOXY_GR_110: data.EPOXY_GR_110,
      ADHA_GR_110: data.ADHA_GR_110,
      PEPP_GR_110: data.PEPP_GR_110,
      CHROM_BH_110: data.CHROM_BH_110,
      EPXY_BH_110: data.EPXY_BH_110,
      ADHA_BH_110: data.ADHA_BH_110,
      PEPP_BH_110: data.PEPP_BH_110,
      LINES_SPED_110: data.LINES_SPED_110,
      EPXY_DWPT_110: data.EPXY_DWPT_110,
      NO_EPGUN_110: data.NO_EPGUN_110,
      HDPE_RPM01_110: data.HDPE_RPM01_110,
      HDPE_RPM02_110: data.HDPE_RPM02_110,
      ADHE_RPM_110: data.ADHE_RPM_110,
      HOLD_RSN: data.HOLD_RSN,
    };
    console.log("110insert", sql);
    console.log("binds110", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    //console.log(error);
    console.log("error110", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc110 = async (data: any) => {
  try {
    let resData = [];
    const sql = `call LDPDBA.LD11B001(
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

    const result = await query.executeQuery(sql, binds);
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
                    where tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delete error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getFillData = async (rmBatch: any,pipeno: any,status: any) => {
//     try {

//         let sql = ` SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO from v_bare_pdo
//         where TBP_PAR_COIL_NO = '${rmBatch}' `;

//         // let sql = ` SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO,TBP_ASL_NO_80,
//         // TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM,ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
//         // (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC
//         // FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
//         // WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
//         //   AND TBP_ITEM_NO = ENC_NO_ITEM
//         //   AND TBP_BATCH_NO = LOM_ID_BATCH
//         //   AND TBP_PLANT_CD = LOM_CD_EPA
//         //   AND LOM_CD_EPA = ENC_CD_EPA
//         //   AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
//         //   AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
//         // AND TBP_PAR_COIL_NO = '${rmBatch}' `;

//         if(pipeno != ''){

//             sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`

//         }
//         else{

//             sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
//                      AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`
//         }

//         console.log("filldataqry110",sql);
//         return await query.executeQuery(sql);
//     } catch (error) {
//         console.log(error);
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const getFillData = async (data: any) => {
  try {
    let sql = `SELECT TBP_BATCH_NO, TBP_PIPE_OD_10, TBP_PIPE_THK_10, TBP_PIPE_LNG_10, TBP_WEIGHT,TBP_ASL_NO_80,
         TBP_NO_MATNR,TBP_HEAT_NO, TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
         (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, 'C') as nxtproc from dual) NEXT_PROC,
         (select CASE WHEN REGEXP_LIKE(A.TBP_DIA_END_10, '^[0-9]+$') THEN TO_NUMBER(A.TBP_DIA_END_10) ELSE NULL END FROM V_BARE_PDO A
                where A.TBP_BATCH_NO = LOM_ID_BATCH
                  and A.TBP_CD_PROC = 'A'
                  and A.TBP_BATCH_PROC_NO = (
                    SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                    WHERE A.TBP_BATCH_NO = x.TBP_BATCH_NO
                      AND x.TBP_CD_PROC = 'A'
                  )
                and rownum = 1) TBP_DIA_END_10, LOM_ID_PAR_COIL_NO
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
               SELECT MAX(t2.TBP_BATCH_PROC_NO) FROM V_BARE_PDO t2
               WHERE TBP_BATCH_NO = t2.TBP_BATCH_NO
                 AND t2.TBP_CD_PROC = '1'
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

    sql += ` order by tbp_dia_end_10 `;

    console.log("filldataqry110: ", sql);
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
