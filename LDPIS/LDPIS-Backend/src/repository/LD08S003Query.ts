import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any, mill: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS in (select CD_VALUE from V_CODES where cd_type = 'TB061')
        and LOM_CD_EPA='0780'
        AND LOM_CD_QLTY_ACTL<>'SCRP'
         and lom_planned_proc in (select  lpp_cd_proc_path from V_LDP_PROC_PATH where lpp_product <> 'BARE')`;

    if (mill !== "") {
      sql += ` AND LOM_MILL_NO = '${mill}'`;
    }

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any, mill: any) => {
  try {
    let sql = `select DISTINCT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO,LOM_MILL_NO
        from V_LDP_PRODN 
        WHERE LOM_CD_STATUS in (select CD_VALUE from V_CODES where cd_type = 'TB061')
        and LOM_CD_EPA ='0780'
        and lom_planned_proc in (select  lpp_cd_proc_path from V_LDP_PROC_PATH where lpp_product <> 'BARE') `;

    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (mill !== "") {
      sql += ` AND LOM_MILL_NO = '${mill}'`;
    }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }

    sql += ` order by 1 `;
    return await query.executeQuery(sql);
  } catch (error) {
    console.log("LD08S001-getPipeNoList", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const get80ScrapProductionTable = async (req: any) => {
//   try {
//     const sql = `SELECT
//         LDPDBA.f_LDB010_scrapid (
//             :p_plant,
//             :p_mbatch,
//             :p_prodn_dt,
//             :p_proc
//         ) AS scrap_batch_id,
//             '' AS idpdi,
//         'SC88888888' AS order_id,
//         0 AS item,
//         '' AS rm_prod,
//         '' AS fg_prod,
//         'SCRP' AS qlty,
//         '' AS grade,
//         '' AS thk,
//         '' AS width_odia,
//         '' AS length1,
//         '0' AS no_pcs,
//         '' AS net_wt,
//         '' AS next_proc,
//         '' AS rsn_hold,
//         '' AS hold_desc,
//         '' AS opr_remarks,
//         SUBSTR(r.cd_desc, 1, 18) AS material,
//         SUBSTR(r.cd_desc, 21, 70) AS material_desc,
//         '' AS sfg_matnr,
//         '' AS sfg_matnr_desc,
//         '' AS rm_matnr,
//         '' AS rm_matnr_desc,
//         '' AS odia,
//         '' AS idia
//     FROM (
//         SELECT CD_DESC
//         FROM v_codes
//         WHERE cd_type = 'TB045'
//           AND SUBSTR(cd_value, 1, 4) = '0780'
//           AND SUBSTR(cd_value, 6, 1) = '1'
//     ) r
//     ORDER BY r.cd_desc
//     `;

//     let binds = {
//       p_plant: "0780",
//       p_mbatch: req.RM_BATCH,
//       p_prodn_dt: req.SHIFT_DATE,
//       p_proc: "8",
//     };
//     console.log(binds);
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     console.log("LD08S001-", error)
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const insertScrapTempData = async (data: any) => {
  try {
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
      TBP_PIPE_LNG_10,
      TBP_WORK_CENTER
  )
  SELECT 
      :p_plant, 
      LDPDBA.f_LDB010_scrapid (
          :p_plant,
          :p_mbatch,
          :p_prodn_dt,
          :p_proc
      ) AS scrap_batch_id,
      :p_proc,
      '8',
      1,
      :p_prodn_dt,
      :SHIFT,
      :WEIGHT,
      :STATUS,
      :p_mbatch,
      :ID_FIRST_PAR, 
      'SC88888888' AS order_id, 
      0 AS item, 
      'SCRP' AS qlty,
      SUBSTR(r.cd_desc, 1, 18) AS material,
      '1' AS fg_prod, 
      TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
      TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),
      'OK',
      '',
      '',
      :INSP_NAME, 
      '' AS OD,
      '' AS thk, 
      '' AS length1,
      :TBP_WORK_CENTER
  FROM (
      SELECT cd_desc
      FROM v_codes
      WHERE cd_type = 'TB045'
        AND SUBSTR(cd_value, 1, 4) = '0780'
        AND SUBSTR(cd_value, 6, 1) = '8'
  ) r`;

    let binds = {
      p_plant: data.PLANT,
      p_mbatch: data.TBP_BATCH_NO,
      p_proc: data.CD_PROC,
      p_prodn_dt: data.PROD_DATE,
      SHIFT: data.SHIFT,
      STATUS: '8Q',
      WEIGHT: data.BATCH_SCRAP_WEIGHT,
      ID_FIRST_PAR: data.TBP_ID_FIRST_PAR,
      START_DT: data.TBP_PROD_START_DT,
      END_DT: data.TBP_PROD_END_DT,
      INSP_NAME: data.TBP_INSP_NAME,
      TBP_WORK_CENTER: data.TBP_WORK_CENTER
    };
    //console.log("sql80insert: ", sql);
    //console.log("binds80scrapinsert: ", binds);
    await query.executeQuery(sql, binds);

    console.log({
      ls_batch_no: data.TBP_BATCH_NO ? data.TBP_BATCH_NO : "",
      ls_cd_proc: data.CD_PROC ? data.CD_PROC : "",
      ls_plant_cd: data.PLANT ?? '',
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      }
    });
    return await query.executeQuery(`call LDPDBA.ld08b004(
      ls_batch_no => :ls_batch_no,
      ls_cd_proc => :ls_cd_proc,
      ls_plant_cd => :ls_plant_cd,
      ls_out_flag => :ls_out_flag
      )`, {
      ls_batch_no: data.TBP_BATCH_NO ? data.TBP_BATCH_NO : "",
      ls_cd_proc: data.CD_PROC ? data.CD_PROC : "",
      ls_plant_cd: data.PLANT ?? '',
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    })
  } catch (error) {
    console.log("LD08S001-insertScrapTempData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    const sql = `update V_BARE_PDO
      set TBP_PIPE_OD_10 = NVL(:TBP_PIPE_OD_10,TBP_PIPE_OD_10),
      TBP_PIPE_THK_10 = NVL(:TBP_PIPE_THK_10,TBP_PIPE_THK_10),
      TBP_PIPE_LNG_10 = NVL(:TBP_PIPE_LNG_10,TBP_PIPE_LNG_10),
      TBP_ASL_NO_80 = NVL(:TBP_ASL_NO_80,TBP_ASL_NO_80),
      TBP_INSP_NAME = NVL(:TBP_INSP_NAME,TBP_INSP_NAME),
      TBP_REMARK = NVL(:TBP_REMARK,TBP_REMARK),
      TBP_VDI_FINAL_RMK_1_80 = NVL(:TBP_VDI_FINAL_RMK_1_80,TBP_VDI_FINAL_RMK_1_80),
      TBP_VDI_FINAL_RMK_2_80 = NVL(:TBP_VDI_FINAL_RMK_2_80,TBP_VDI_FINAL_RMK_2_80),
      TBP_VISUAL_INSP_80 = NVL(:TBP_VISUAL_INSP_80,TBP_VISUAL_INSP_80),
      TBP_DIA_BODY_10 = NVL(:TBP_DIA_BODY_10,TBP_DIA_BODY_10),
      TBP_DIA_END_10 = NVL(:TBP_DIA_END_10,TBP_DIA_END_10),
      TBP_WEIGHT = NVL(:TBP_WEIGHT,TBP_WEIGHT),
      TBP_OUT_ROUND_BODY_10 = NVL(:TBP_OUT_ROUND_BODY_10,TBP_OUT_ROUND_BODY_10),
      TBP_OUT_ROUND_END_10 = NVL(:TBP_OUT_ROUND_END_10,TBP_OUT_ROUND_END_10),
      TBP_SQOC_10 = NVL(:TBP_SQOC_10,TBP_SQOC_10),
      TBP_ROC_10 = NVL(:TBP_ROC_10,TBP_ROC_10),
      TBP_ECN_PERCEN_80 = NVL(:TBP_ECN_PERCEN_80,TBP_ECN_PERCEN_80),
      TBP_WALL_THK_BODY_10 = NVL(:TBP_WALL_THK_BODY_10,TBP_WALL_THK_BODY_10),
      TBP_WALL_THK_END_10 = NVL(:TBP_WALL_THK_END_10,TBP_WALL_THK_END_10),
      TBP_B_ANGL_F_END_80 = NVL(:TBP_B_ANGL_F_END_80,TBP_B_ANGL_F_END_80),
      TBP_B_ANGL_T_END_80 = NVL(:TBP_B_ANGL_T_END_80,TBP_B_ANGL_T_END_80),
      TBP_SQU_F_END_80 = NVL(:TBP_SQU_F_END_80,TBP_SQU_F_END_80),
      TBP_SQU_T_END_80 = NVL(:TBP_SQU_T_END_80,TBP_SQU_T_END_80),
      TBP_ID_FLASH_10 = NVL(:TBP_ID_FLASH_10,TBP_ID_FLASH_10),
      TBP_RADIAL_OFF_80 = NVL(:TBP_RADIAL_OFF_80,TBP_RADIAL_OFF_80),
      TBP_STRGHTNES_F_END_80 = NVL(:TBP_STRGHTNES_F_END_80,TBP_STRGHTNES_F_END_80),
      TBP_STRGHTNES_T_END_10 = NVL(:TBP_STRGHTNES_T_END_10,TBP_STRGHTNES_T_END_10),
      TBP_ROOTFACE_F_END_80 = NVL(:TBP_ROOTFACE_F_END_80,TBP_ROOTFACE_F_END_80),
      TBP_ROOTFACE_T_END_80 = NVL(:TBP_ROOTFACE_T_END_80,TBP_ROOTFACE_T_END_80),
      TBP_WID_MIN_80 = NVL(:TBP_WID_MIN_80,TBP_WID_MIN_80),
      TBP_WID_MAX_80 = NVL(:TBP_WID_MAX_80,TBP_WID_MAX_80),
      TBP_DEPTH_MIN_80 = NVL(:TBP_DEPTH_MIN_80,TBP_DEPTH_MIN_80),
      TBP_DEPTH_MAX_80 = NVL(:TBP_DEPTH_MAX_80,TBP_DEPTH_MAX_80),
      TBP_TWIST_10 = NVL(:TBP_TWIST_10,TBP_TWIST_10),
      TBP_CONCV_10 = NVL(:TBP_CONCV_10,TBP_CONCV_10),
      TBP_CONVX_10 = NVL(:TBP_CONVX_10,TBP_CONVX_10),
      TBP_UPDATED_BY = NVL(:TBP_UPDATED_BY, ''),
      TBP_UPDATED_ON = sysdate
      where tbp_batch_no = :TBP_BATCH_NO
      and TBP_CD_PROC = '8'
      and TBP_BATCH_PROC_NO = :TBP_BATCH_PROC_NO `;

    const bind = {
      TBP_PIPE_OD_10: data.TBP_PIPE_OD_10,
      TBP_PIPE_THK_10: data.TBP_PIPE_THK_10,
      TBP_PIPE_LNG_10: data.TBP_PIPE_LNG_10,
      TBP_ASL_NO_80: data.TBP_ASL_NO_80,
      TBP_INSP_NAME: data.TBP_INSP_NAME,
      TBP_REMARK: data.TBP_REMARK,
      TBP_VDI_FINAL_RMK_1_80: data.TBP_VDI_FINAL_RMK_1_80,
      TBP_VDI_FINAL_RMK_2_80: data.TBP_VDI_FINAL_RMK_2_80,
      TBP_VISUAL_INSP_80: data.TBP_VISUAL_INSP_80,
      TBP_DIA_BODY_10: data.TBP_DIA_BODY_10,
      TBP_DIA_END_10: data.TBP_DIA_END_10,
      TBP_WEIGHT: data.TBP_WEIGHT,
      TBP_OUT_ROUND_BODY_10: data.TBP_OUT_ROUND_BODY_10,
      TBP_OUT_ROUND_END_10: data.TBP_OUT_ROUND_END_10,
      TBP_SQOC_10: data.TBP_SQOC_10,
      TBP_ROC_10: data.TBP_ROC_10,
      TBP_ECN_PERCEN_80: data.TBP_ECN_PERCEN_80,
      TBP_WALL_THK_BODY_10: data.TBP_WALL_THK_BODY_10,
      TBP_WALL_THK_END_10: data.TBP_WALL_THK_END_10,
      TBP_B_ANGL_F_END_80: data.TBP_B_ANGL_F_END_80,
      TBP_B_ANGL_T_END_80: data.TBP_B_ANGL_T_END_80,
      TBP_SQU_F_END_80: data.TBP_SQU_F_END_80,
      TBP_SQU_T_END_80: data.TBP_SQU_T_END_80,
      TBP_ID_FLASH_10: data.TBP_ID_FLASH_10,
      TBP_RADIAL_OFF_80: data.TBP_RADIAL_OFF_80,
      TBP_STRGHTNES_F_END_80: data.TBP_STRGHTNES_F_END_80,
      TBP_STRGHTNES_T_END_10: data.TBP_STRGHTNES_T_END_10,
      TBP_ROOTFACE_F_END_80: data.TBP_ROOTFACE_F_END_80,
      TBP_ROOTFACE_T_END_80: data.TBP_ROOTFACE_T_END_80,
      TBP_WID_MIN_80: data.TBP_WID_MIN_80,
      TBP_WID_MAX_80: data.TBP_WID_MAX_80,
      TBP_DEPTH_MIN_80: data.TBP_DEPTH_MIN_80,
      TBP_DEPTH_MAX_80: data.TBP_DEPTH_MAX_80,
      TBP_TWIST_10: data.TBP_TWIST_10,
      TBP_CONCV_10: data.TBP_CONCV_10,
      TBP_CONVX_10: data.TBP_CONVX_10,
      TBP_BATCH_NO: data.TBP_BATCH_NO,
      TBP_UPDATED_BY: data.TBP_UPDATED_BY,
      TBP_BATCH_PROC_NO: data.TBP_BATCH_PROC_NO,
    }
    // console.log("sql80insert: ", sql);
    // console.log("binds80insert: ", binds);
    const varRet = await query.executeQuery(sql, bind);

    await query.executeQuery(
      `update v_ldp_prodn  set lom_length = '${data.TBP_PIPE_LNG_10}',
      lom_ms_gross_actl =  '${data.TBP_WEIGHT}',
      lom_ms_gross_cal = '${data.TBP_WEIGHT}',
      lom_ms_piece_actl = '${data.TBP_WEIGHT}',
      lom_rec_upd_usr = NVL('${data.TBP_UPDATED_BY}', ''),
      lom_rec_upd_dt = sysdate,
      lom_dt_piece_upd = SYSDATE
        where lom_id_batch= '${data.TBP_BATCH_NO}'`
    )

    return varRet;
    // console.log("result LD08S001-insertTempData: ", result);
  } catch (error) {
    console.log("LD08S003-insertTempData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    let sql = ` Delete from V_BARE_PDO_TEMP 
                        where (tbp_batch_no= :Batchno OR TBP_PAR_COIL_NO= :Batchno)
                        and  tbp_cd_proc= :curproc
                        and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.TBP_BATCH_NO ? data.TBP_BATCH_NO : "",
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };
    await query.executeQuery(sql, binds);
    return null;
  } catch (error) {
    return null;
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
    console.log("LD08S001-getTataDate", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const execQueryScreenAccess = async (user: any) => {
  try {
    let sql = `SELECT count(*)
      FROM v_codes
      WHERE cd_type = 'TB062'
      and cd_value = '${user}' `;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (data: any, user: any) => {
  try {
    let updt = await query.executeQuery(`SELECT count(*)
      FROM v_codes
      WHERE cd_type = 'TB062'
      and cd_value = '${user}' `);

    console.log(updt.rows?.[0]?.[0])
    if(updt.rows?.[0]?.[0] > 0){
    let sql = ` select A.*, C.LOM_ODIA, C.LOM_IDIA, C.LOM_SEC1, C.LOM_SEC2, C.LOM_LENGTH, D.enc_geometry geometry  from v_bare_pdo A, V_LDP_PRODN C, v_end_cust_ord_epa D
           where A.TBP_CD_PROC = '8'
        and A.TBP_BATCH_PROC_NO =( SELECT MAX(TBP_BATCH_PROC_NO) FROM v_bare_pdo B
        where A.tbp_batch_no = B.tbp_batch_no
        and B.TBP_CD_PROC = '8' )
        and C.lom_id_order_cus = D.enc_id_order(+)
        and C.lom_id_ord_item_cus = D.enc_no_item(+)
        AND C.LOM_ID_BATCH = A.tbp_batch_no`;

    // If PIPE_NO is present
    if (data.PIPE_NO && data.PIPE_NO !== "") {
      sql += ` AND A.tbp_batch_no = '${data.PIPE_NO}'`;
    }

    // If RM_BATCH is present
    if (data.RM_BATCH && data.RM_BATCH !== "") {
      sql += ` AND lom_id_par_coil_no = '${data.RM_BATCH}'`;
    }

    // If both ORDNO and ORDITEM are present

    return await query.executeQuery(sql);
  } else {
    throw new Error.InternalServerErrorMsg('Not Authorised!');
  }
  } catch (error) {
    console.log("LD08S001-getFillData", error);
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
    console.log("LD08S001-getPono", error);
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
    console.log("LD08S001-getMatNo", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getnxtproc = async (pipeno: any) => {
  try {
    //console.log("rmBatch: ", rmBatch);

    let sql = ` select LOM_PLANNED_PROC PLANNED_PROC,LOM_PASSED_PROC PASSED_PROC from V_LDP_PRODN 
                 WHERE LOM_ID_BATCH= '${pipeno}' `;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log("LD08S001-getnxtproc", error);
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
    console.log("LD08S001-callfunction", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//procedure to validate data from process sheet
export const validateDataMill80 = async (data: any) => {
  try {
    const sql = ` call P_BARE_QLTY_CHK_80_DUMMY(
        p_batchid => :p_batchid,
        p_ord => :p_ord,
        p_item  => :p_item,
        p_TBP_WEIGHT  => :p_TBP_WEIGHT,
        p_TBP_PAR_COIL_NO => :p_TBP_PAR_COIL_NO,
        p_TBP_ID_FIRST_PAR  => :p_TBP_ID_FIRST_PAR,
        P_RESULT  => :P_RESULT,
        p_TBP_HEAT_NO => :p_TBP_HEAT_NO,
        p_TBP_PIPE_OD_10  => :p_TBP_PIPE_OD_10,
        p_TBP_PIPE_THK_10 => :p_TBP_PIPE_THK_10,
        p_TBP_PIPE_LNG_10 => :p_TBP_PIPE_LNG_10,
        p_TBP_FLATNG_0_O_10 => :p_TBP_FLATNG_0_O_10,
        p_TBP_FLATNG_90_O_10  => :p_TBP_FLATNG_90_O_10,
        p_TBP_RBT_10  => :p_TBP_RBT_10,
        p_TBP_DIA_END_10  => :p_TBP_DIA_END_10,
        p_TBP_DIA_BODY_10 => :p_TBP_DIA_BODY_10,
        p_TBP_OUT_ROUND_BODY_10 => :p_TBP_OUT_ROUND_BODY_10,
        p_TBP_OUT_ROUND_END_10  => :p_TBP_OUT_ROUND_END_10,
        p_TBP_WALL_THK_BODY_10  => :p_TBP_WALL_THK_BODY_10,
        p_TBP_WALL_THK_END_10 => :p_TBP_WALL_THK_END_10,
        p_TBP_STRGHTNES_T_END_10  => :p_TBP_STRGHTNES_T_END_10,
        p_TBP_SQOC_10 => :p_TBP_SQOC_10,
        p_TBP_ROC_10  => :p_TBP_ROC_10,
        p_TBP_ID_FLASH_10 => :p_TBP_ID_FLASH_10,
        p_TBP_CONVX_10  => :p_TBP_CONVX_10,
        p_TBP_CONCV_10  => :p_TBP_CONCV_10,
        p_TBP_TWIST_10  => :p_TBP_TWIST_10,
        p_TBP_DEPTH_10  => :p_TBP_DEPTH_10,
        p_TBP_WIDTHS_10 => :p_TBP_WIDTHS_10,
        p_TBP_SAMPLE_10 => :p_TBP_SAMPLE_10,
        p_TBP_WLD_TEMP_10 => :p_TBP_WLD_TEMP_10,
        p_TBP_MILL_SPD_10 => :p_TBP_MILL_SPD_10,
        p_TBP_CURRENTT_10 => :p_TBP_CURRENTT_10,
        p_TBP_TEMP_QN_10  => :p_TBP_TEMP_QN_10,
        p_TBP_VOLTAGE_10  => :p_TBP_VOLTAGE_10,
        p_TBP_FREQUENCY_10  => :p_TBP_FREQUENCY_10,
        p_TBP_NORMZ_TEMP_10 => :p_TBP_NORMZ_TEMP_10,
        p_TBP_WELD_POWER_10 => :p_TBP_WELD_POWER_10,
        p_TBP_VISUAL_INSP_80  => :p_TBP_VISUAL_INSP_80,
        p_TBP_ECN_PERCEN_80 => :p_TBP_ECN_PERCEN_80,
        p_TBP_B_ANGL_F_END_80 => :p_TBP_B_ANGL_F_END_80,
        p_TBP_B_ANGL_T_END_80 => :p_TBP_B_ANGL_T_END_80,
        p_TBP_ROOTFACE_F_END_80 => :p_TBP_ROOTFACE_F_END_80,
        p_TBP_ROOTFACE_T_END_80 => :p_TBP_ROOTFACE_T_END_80,
        p_TBP_STRGHTNES_F_END_80  => :p_TBP_STRGHTNES_F_END_80,
        p_TBP_SQU_F_END_80  => :p_TBP_SQU_F_END_80,
        p_TBP_SQU_T_END_80  => :p_TBP_SQU_T_END_80,
        p_TBP_ASL_NO_80 => :p_TBP_ASL_NO_80,
        p_TBP_WID_MIN_80  => :p_TBP_WID_MIN_80,
        p_TBP_WID_MAX_80  => :p_TBP_WID_MAX_80,
        p_TBP_DEPTH_MIN_80  => :p_TBP_DEPTH_MIN_80,
        p_TBP_DEPTH_MAX_80  => :p_TBP_DEPTH_MAX_80,
        p_TBP_VDI_FINAL_RMK_1_80  => :p_TBP_VDI_FINAL_RMK_1_80,
        p_TBP_VDI_FINAL_RMK_2_80  => :p_TBP_VDI_FINAL_RMK_2_80,
        p_TBP_LEN_FT_80 => :p_TBP_LEN_FT_80,
        p_TBP_LEN_INCH_80 => :p_TBP_LEN_INCH_80,
        p_TBP_RADIAL_OFF_80 => :p_TBP_RADIAL_OFF_80,
        ls_out_flag => :ls_out_flag
      )`;

    let binds = {
      p_batchid: data?.p_batchid ?? "",
      p_ord: data?.p_ord ?? "",
      p_item: data?.p_item ?? "",
      p_TBP_WEIGHT: data?.p_TBP_WEIGHT ?? "",
      p_TBP_PAR_COIL_NO: data?.p_TBP_PAR_COIL_NO ?? "",
      p_TBP_ID_FIRST_PAR: data?.p_TBP_ID_FIRST_PAR ?? "",
      P_RESULT: data?.P_RESULT ?? "",
      p_TBP_HEAT_NO: data?.p_TBP_HEAT_NO ?? "",
      p_TBP_PIPE_OD_10: data?.p_TBP_PIPE_OD_10 ?? "",
      p_TBP_PIPE_THK_10: data?.p_TBP_PIPE_THK_10 ?? "",
      p_TBP_PIPE_LNG_10: data?.p_TBP_PIPE_LNG_10 ?? "",
      p_TBP_FLATNG_0_O_10: data?.p_TBP_FLATNG_0_O_10 ?? "",
      p_TBP_FLATNG_90_O_10: data?.p_TBP_FLATNG_90_O_10 ?? "",
      p_TBP_RBT_10: data?.p_TBP_RBT_10 ?? "",
      p_TBP_DIA_END_10: data?.p_TBP_DIA_END_10 ?? "",
      p_TBP_DIA_BODY_10: data?.p_TBP_DIA_BODY_10 ?? "",
      p_TBP_OUT_ROUND_BODY_10: data?.p_TBP_OUT_ROUND_BODY_10 ?? "",
      p_TBP_OUT_ROUND_END_10: data?.p_TBP_OUT_ROUND_END_10 ?? "",
      p_TBP_WALL_THK_BODY_10: data?.p_TBP_WALL_THK_BODY_10 ?? "",
      p_TBP_WALL_THK_END_10: data?.p_TBP_WALL_THK_END_10 ?? "",
      p_TBP_STRGHTNES_T_END_10: data?.p_TBP_STRGHTNES_T_END_10 ?? "",
      p_TBP_SQOC_10: data?.p_TBP_SQOC_10 ?? "",
      p_TBP_ROC_10: data?.p_TBP_ROC_10 ?? "",
      p_TBP_ID_FLASH_10: data?.p_TBP_ID_FLASH_10 ?? "",
      p_TBP_CONVX_10: data?.p_TBP_CONVX_10 ?? "",
      p_TBP_CONCV_10: data?.p_TBP_CONCV_10 ?? "",
      p_TBP_TWIST_10: data?.p_TBP_TWIST_10 ?? "",
      p_TBP_DEPTH_10: data?.p_TBP_DEPTH_10 ?? "",
      p_TBP_WIDTHS_10: data?.p_TBP_WIDTHS_10 ?? "",
      p_TBP_SAMPLE_10: data?.p_TBP_SAMPLE_10 ?? "",
      p_TBP_WLD_TEMP_10: data?.p_TBP_WLD_TEMP_10 ?? "",
      p_TBP_MILL_SPD_10: data?.p_TBP_MILL_SPD_10 ?? "",
      p_TBP_CURRENTT_10: data?.p_TBP_CURRENTT_10 ?? "",
      p_TBP_TEMP_QN_10: data?.p_TBP_TEMP_QN_10 ?? "",
      p_TBP_VOLTAGE_10: data?.p_TBP_VOLTAGE_10 ?? "",
      p_TBP_FREQUENCY_10: data?.p_TBP_FREQUENCY_10 ?? "",
      p_TBP_NORMZ_TEMP_10: data?.p_TBP_NORMZ_TEMP_10 ?? "",
      p_TBP_WELD_POWER_10: data?.p_TBP_WELD_POWER_10 ?? "",
      p_TBP_VISUAL_INSP_80: data?.p_TBP_VISUAL_INSP_80 ?? "",
      p_TBP_ECN_PERCEN_80: data?.p_TBP_ECN_PERCEN_80 ?? "",
      p_TBP_B_ANGL_F_END_80: data?.p_TBP_B_ANGL_F_END_80 ?? "",
      p_TBP_B_ANGL_T_END_80: data?.p_TBP_B_ANGL_T_END_80 ?? "",
      p_TBP_ROOTFACE_F_END_80: data?.p_TBP_ROOTFACE_F_END_80 ?? "",
      p_TBP_ROOTFACE_T_END_80: data?.p_TBP_ROOTFACE_T_END_80 ?? "",
      p_TBP_STRGHTNES_F_END_80: data?.p_TBP_STRGHTNES_F_END_80 ?? "",
      p_TBP_SQU_F_END_80: data?.p_TBP_SQU_F_END_80 ?? "",
      p_TBP_SQU_T_END_80: data?.p_TBP_SQU_T_END_80 ?? "",
      p_TBP_ASL_NO_80: data?.p_TBP_ASL_NO_80 ?? "",
      p_TBP_WID_MIN_80: data?.p_TBP_WID_MIN_80 ?? "",
      p_TBP_WID_MAX_80: data?.p_TBP_WID_MAX_80 ?? "",
      p_TBP_DEPTH_MIN_80: data?.p_TBP_DEPTH_MIN_80 ?? "",
      p_TBP_DEPTH_MAX_80: data?.p_TBP_DEPTH_MAX_80 ?? "",
      p_TBP_VDI_FINAL_RMK_1_80: data?.p_TBP_VDI_FINAL_RMK_1_80 ?? "",
      p_TBP_VDI_FINAL_RMK_2_80: data?.p_TBP_VDI_FINAL_RMK_2_80 ?? "",
      p_TBP_LEN_FT_80: data?.p_TBP_LEN_FT_80 ?? "",
      p_TBP_LEN_INCH_80: data?.p_TBP_LEN_INCH_80 ?? "",
      p_TBP_RADIAL_OFF_80: data?.p_TBP_RADIAL_OFF_80 ?? "",
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("sql: ", sql);
    // console.log("bindsChk: ", binds);
    // }
    let result = await query.executeQuery(sql, binds);
    // console.log("result ValidateData: ", result);
    return result?.outBinds?.ls_out_flag;
  } catch (error) {
    console.log("LD08S001-ValidateData: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
