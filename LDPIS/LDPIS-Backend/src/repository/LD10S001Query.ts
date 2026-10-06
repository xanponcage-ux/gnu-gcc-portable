import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

// export const insertTempData = async (data: any) => {
//   try {
//     //console.log("insertdata30",data)
//     const sql = ` INSERT INTO V_BARE_PDO_TEMP(
//         TBP_PLANT_CD,
//         TBP_BATCH_NO,
//         TBP_CD_PROC,
//         TBP_BATCH_PROC_NO,
//         TBP_NEXT_PROC,
//         TBP_PROD_DATE,
//         TBP_SHIFT,
//         TBP_WEIGHT,
//         TBP_CD_STATUS,
//         TBP_PAR_COIL_NO,
//         TBP_ID_FIRST_PAR,
//         TBP_ID_ORDER_NO,
//         TBP_ITEM_NO,
//         TBP_QUALITY_CD,
//         TBP_NO_MATNR,
//         TBP_CD_FLAG,
//         TBP_PROD_START_DT,
//         TBP_PROD_END_DT,
//         TBP_RESULT,
//         TBP_REMARK,
//         TBP_HEAT_NO,
//         TBP_INSP_NAME,
//         TBP_PIPTMP_BEBLST_100,
//         TBP_PIPTMP_BEACID_100,
//         TBP_PH_BEACID_100,
//         TBP_PH_AFACID_100,
//         TBP_DWELLTM_100,
//         TBP_PREDM_WA_100,
//         TBP_DMWA_FRA_1_100,
//         TBP_DMWA_FRA_2_100,
//         TBP_DMWA_FRA_3_100,
//         TBP_AIRTEM_AFTWA_100,
//         TBP_RH_100,
//         TBP_AMBT_TMP_100,
//         TBP_DEW_TMP_100,
//         TBP_PIPSUR_TEMP_100,
//         TBP_DEG_CLEAN_100,
//         TBP_ROUGH_100,
//         TBP_DUST_LVLRA_100,
//         TBP_DUST_LVLCL_100,
//         TBP_SALT_CONTA_100,
//         TBP_PHOSACID_M_100,
//         TBP_PHOSACID_GR_100,
//         TBP_PHOSACID_BH_100,
//         TBP_HOLD_RSN
//         )
//         VALUES(:PLANT,:PIPE_NO,:PLAN_PROC,:BATCH_PROC_NO,:N_PRC,:PROCESS_DT,:SHIFT,
//                :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ID_ORDER_NO,:ITEM_NO,
//                :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
//                :PTEMP_BEFORE_BLAST,:PTEMP_BEFORE_ACID_WASH,:PH_BEFORE_ACID_WASH,:PH_AFTER_ACID_WASH,
//                :DWELL_TIME,:PRESS_DM_WASH,:DM_WATER_FLOW_RATE1,:DM_WATER_FLOW_RATE2,
//                :DM_WATER_FLOW_RATE3,:PRE_HEAT_AIR_AFTER_WATER_WASH,:REL_HUMID,:AMB_TEMP,
//                :DEW_POINT_TEMP,:PIPE_SURFACE_TEMP,:DEGREE_CLEANLINESS,:ROUGHNESS,:DUST_LEVEL_RATING,
//                :DUST_LEVEL_CLASS,:SALT_CONTAMIN,:PHOS_ACID_MATERIAL,:PHOS_ACID_GRADE,:PHOS_ACID_BATCH,:HOLD_REASON) `;

//     let binds = {
//       PLANT: data.PLANT,
//       PIPE_NO: data.PIPE_NO,
//       C_PRC: data.C_PRC,
//       BATCH_PROC_NO: data.BATCH_PROC_NO,
//       N_PRC: data.N_PRC,
//       PROCESS_DT: data.PROCESS_DT,
//       SHIFT: data.SHIFT,
//       WEIGHT: data.WEIGHT,
//       STATUS: data.STATUS,
//       PAR_COIL_NO: data.PAR_COIL_NO,
//       ID_FIRST_PAR: data.ID_FIRST_PAR,
//       ID_ORDER_NO: data.ID_ORDER_NO,
//       ITEM_NO: data.ITEM_NO,
//       QUALITY_CD: data.QUALITY_CD,
//       MATNR: data.MATNR,
//       FLAG: data.FLAG,
//       START_DT: data.START_DT,
//       END_DT: data.END_DT,
//       RESULT: data.RESULT,
//       REMARK: data.REMARK,
//       HEAT_NO: data.HEAT_NO,
//       INSP_NAME: data.INSP_NAME,
//       PTEMP_BEFORE_BLAST: data.PTEMP_BEFORE_BLAST,
//       PTEMP_BEFORE_ACID_WASH: data.PTEMP_BEFORE_ACID_WASH,
//       PH_BEFORE_ACID_WASH: data.PH_BEFORE_ACID_WASH,
//       PH_AFTER_ACID_WASH: data.PH_AFTER_ACID_WASH,
//       DWELL_TIME: data.DWELL_TIME,
//       PRESS_DM_WASH: data.PRESS_DM_WASH,
//       DM_WATER_FLOW_RATE1: data.DM_WATER_FLOW_RATE1,
//       DM_WATER_FLOW_RATE2: data.DM_WATER_FLOW_RATE2,
//       DM_WATER_FLOW_RATE3: data.DM_WATER_FLOW_RATE3,
//       PRE_HEAT_AIR_AFTER_WATER_WASH: data.PRE_HEAT_AIR_AFTER_WATER_WASH,
//       REL_HUMID: data.REL_HUMID,
//       AMB_TEMP: data.AMB_TEMP,
//       DEW_POINT_TEMP: data.DEW_POINT_TEMP,
//       PIPE_SURFACE_TEMP: data.PIPE_SURFACE_TEMP,
//       DEGREE_CLEANLINESS: data.DEGREE_CLEANLINESS,
//       ROUGHNESS: data.ROUGHNESS,
//       DUST_LEVEL_RATING: data.DUST_LEVEL_RATING,
//       DUST_LEVEL_CLASS: data.DUST_LEVEL_CLASS,
//       SALT_CONTAMIN: data.SALT_CONTAMIN,
//       PHOS_ACID_MATERIAL: data.PHOS_ACID_MATERIAL,
//       PHOS_ACID_GRADE: data.PHOS_ACID_GRADE,
//       PHOS_ACID_BATCH: data.PHOS_ACID_BATCH,
//       HOLD_REASON: data.HOLD_REASON,
//     };
//     console.log("30insert", sql);
//     console.log("binds", binds);
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };
export const insertTempData = async (data: any) => {
  try {
    console.log(data);
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
          TBP_PIPTMP_BEBLST_100,
          TBP_PIPTMP_BEACID_100,
          TBP_PH_BEACID_100,
          TBP_PH_AFACID_100,
          TBP_VISUAL_INSP_80,
          TBP_DWELLTM_100,
          TBP_PREDM_WA_100,
          TBP_DMWA_FRA_1_100,
          TBP_DMWA_FRA_2_100,
          TBP_DMWA_FRA_3_100,
          TBP_AIRTEM_AFTWA_100,
          TBP_RH_100,
          TBP_AMBT_TMP_100,
          TBP_DEW_TMP_100,
          TBP_PIPSUR_TEMP_100,
          TBP_DEG_CLEAN_100,
          TBP_ROUGH_100,
          TBP_DUST_LVLRA_100,
          TBP_DUST_LVLCL_100,
          TBP_SALT_CONTA_100,
          TBP_PHOSACID_M_100,
          TBP_PHOSACID_GR_100,
          TBP_PHOSACID_BH_100,
          TBP_HOLD_RSN,
          TBP_SHIFT_DN
        )
        VALUES(
          :PLANT, :PIPE_NO, :PLAN_PROC, :BATCH_PROC_NO, :N_PRC, :PROCESS_DT, substr(F_Tatadate(TO_DATE(:END_DT, 'DD/MM/YYYY HH24:MI')),1,1), 
          :WEIGHT, :STATUS, :PAR_COIL_NO, :ID_FIRST_PAR, :ID_ORDER_NO, :ITEM_NO, 
          :QUALITY_CD, :MATNR, :FLAG, 
          TO_DATE(:START_DT, 'DD/MM/YYYY HH24:MI'), TO_DATE(:END_DT, 'DD/MM/YYYY HH24:MI'),
          :RESULT, :REMARK, :HEAT_NO, :INSP_NAME, 
          :PTEMP_BEFORE_BLAST, :PTEMP_BEFORE_ACID_WASH, :PH_BEFORE_ACID_WASH, 
          :PH_AFTER_ACID_WASH,:VISUAL_INSP, :DWELL_TIME, :PRESS_DM_WASH, :DM_WATER_FLOW_RATE1, 
          :DM_WATER_FLOW_RATE2, :DM_WATER_FLOW_RATE3, :PRE_HEAT_AIR_AFTER_WATER_WASH, 
          :REL_HUMID, :AMB_TEMP, :DEW_POINT_TEMP, :PIPE_SURFACE_TEMP, :DEGREE_CLEANLINESS, 
          :ROUGHNESS, :DUST_LEVEL_RATING, :DUST_LEVEL_CLASS, :SALT_CONTAMIN, :PHOS_ACID_MATERIAL, 
          :PHOS_ACID_GRADE, :PHOS_ACID_BATCH, :HOLD_REASON,:SHIFT
        )`;

    // Prepare binds explicitly field by field
    let binds = {
      PLANT: data.PLANT,
      PIPE_NO: data.PIPE_NO,
      PLAN_PROC: data.PLAN_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      N_PRC: data.NEXT_PROC,
      PROCESS_DT: data.PROCESS_DT,
      SHIFT: data.SHIFT,
      WEIGHT: data.WEIGHT ? parseFloat(data.WEIGHT) : null,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ID_ORDER_NO: data.ORDER_NO,
      ITEM_NO: data.ITEM ? parseInt(data.ITEM) : null,
      QUALITY_CD: data.QUALITY_CD,
      MATNR: data.MATNR,
      FLAG: data.FLAG,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      RESULT: data.RESULT,
      REMARK: data.REMARK,
      HEAT_NO: data.HEAT_NO,
      INSP_NAME: data.INSP_NAME,
      VISUAL_INSP: data.VISUAL_INSP,
      DEGREE_CLEANLINESS: data.DEGREE_CLEANLINESS,

      // Convert each NUMBER field explicitly
      PTEMP_BEFORE_BLAST: data.PTEMP_BEFORE_BLAST
        ? parseFloat(data.PTEMP_BEFORE_BLAST)
        : null,
      PTEMP_BEFORE_ACID_WASH: data.PTEMP_BEFORE_ACID_WASH
        ? parseFloat(data.PTEMP_BEFORE_ACID_WASH)
        : null,
      PH_BEFORE_ACID_WASH: data.PH_BEFORE_ACID_WASH
        ? parseFloat(data.PH_BEFORE_ACID_WASH)
        : null,
      PH_AFTER_ACID_WASH: data.PH_AFTER_ACID_WASH
        ? parseFloat(data.PH_AFTER_ACID_WASH)
        : null,
      DWELL_TIME: data.DWELL_TIME ? parseInt(data.DWELL_TIME) : null,
      PRESS_DM_WASH: data.PRESS_DM_WASH ? parseInt(data.PRESS_DM_WASH) : null,
      DM_WATER_FLOW_RATE1: data.DM_WATER_FLOW_RATE1
        ? parseInt(data.DM_WATER_FLOW_RATE1)
        : null,
      DM_WATER_FLOW_RATE2: data.DM_WATER_FLOW_RATE2
        ? parseInt(data.DM_WATER_FLOW_RATE2)
        : null,
      DM_WATER_FLOW_RATE3: data.DM_WATER_FLOW_RATE3
        ? parseInt(data.DM_WATER_FLOW_RATE3)
        : null,
      PRE_HEAT_AIR_AFTER_WATER_WASH: data.PRE_HEAT_AIR_AFTER_WATER_WASH
        ? parseFloat(data.PRE_HEAT_AIR_AFTER_WATER_WASH)
        : null,
      REL_HUMID: data.REL_HUMID ? parseInt(data.REL_HUMID) : null,
      AMB_TEMP: data.AMB_TEMP ? parseFloat(data.AMB_TEMP) : null,
      DEW_POINT_TEMP: data.DEW_POINT_TEMP
        ? parseFloat(data.DEW_POINT_TEMP)
        : null,
      PIPE_SURFACE_TEMP: data.PIPE_SURFACE_TEMP
        ? parseFloat(data.PIPE_SURFACE_TEMP)
        : null,
      ROUGHNESS: data.ROUGHNESS ? parseFloat(data.ROUGHNESS) : null,
      DUST_LEVEL_RATING: data.DUST_LEVEL_RATING
        ? parseFloat(data.DUST_LEVEL_RATING)
        : null,
      DUST_LEVEL_CLASS: data.DUST_LEVEL_CLASS
        ? parseFloat(data.DUST_LEVEL_CLASS)
        : null,
      SALT_CONTAMIN: data.SALT_CONTAMIN ? parseFloat(data.SALT_CONTAMIN) : null,

      PHOS_ACID_MATERIAL: data.PHOS_ACID_MATERIAL,
      PHOS_ACID_GRADE: data.PHOS_ACID_GRADE,
      PHOS_ACID_BATCH: data.PHOS_ACID_BATCH,
      HOLD_REASON: data.HOLD_REASON,
    };

    console.log("Generated SQL Query:", sql);
    console.log("Bind Variables:", JSON.stringify(binds, null, 2));

    // Execute the query
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.error("Error while executing insertTempData:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc100 = async (data: any) => {
  try {
    //console.log("30querydata",data)
    let resData = [];
    const sql = `call LDPDBA.LD10B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.PIPE_NO ? data.PIPE_NO : "",
      LS_CD_PROC: "B",
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

    // console.log(sql,binds);
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
                    where  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
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
    // console.log("pipe100",sql)
    // console.log("bindspipe",binds)
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatNo = async (rmBatch: any) => {
  try {
    let sql = `select LOM_NO_MATNR from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;

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

// export const getFillData = async (rmBatch: any, pipeno: any, status: any) => {
//   try {
//     let sql = ` SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO,TBP_ASL_NO_80 from v_bare_pdo
//         where TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = 'A' `;

//     if (rmBatch != "") {
//       sql += ` AND TBP_BATCH_NO = '${pipeno}' `;
//     } else {
//       sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
//                      AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`;
//     }

//     console.log("filldataqry100", sql);
//     return await query.executeQuery(sql);
//   } catch (error) {
//     console.log("filldata", error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getFillData = async (data: any) => {
  try {
    let sql = `SELECT TBP_BATCH_NO, lom_sec2, lom_sec1,lom_ms_piece_actl, TBP_PIPE_LNG_10,
       TBP_NO_MATNR, TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
       (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, 'B') as nxtproc from dual) NEXT_PROC,
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

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
