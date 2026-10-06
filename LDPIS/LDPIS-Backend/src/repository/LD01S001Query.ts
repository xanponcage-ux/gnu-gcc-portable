import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getorderwiseProdData = async (RM_BATCH: any) => {
  try {
    let sql = `select EWI_ID_BATCH,EWI_ID_WRK_INST,EWI_ID_ORDER_CUS,EWI_ID_ORD_ITEM_CUS,EWI_WRK_CENTER_NO,LOM_MS_PIECE_ACTL, EWI_ROUTE_CD,
    EWI_MS_PIECE_ACTL,EWI_SEC1,EWI_COMBINATION,
    TO_CHAR(EWI_SEC2, 'FM999999990.000') AS EWI_SEC2, 
    TO_CHAR(EWI_LENGTH * 1000, 'FM999999990.000') AS EWI_LENGTH,
    0 TUBE_COUNT, EWI_PLANNED_PROC, EWI_NO_MATNR, EWI_FG_MATNR, EWI_SFG_MATNR, LOM_PASSED_PROC,
    LOM_NO_CAST,
    (select F_GET_NEXTPROC(EWI_PLANNED_PROC, LOM_PASSED_PROC, '1') as nxtproc from dual) NEXT_PROC,
    (select enc_geometry from v_end_cust_ord_epa where ENC_ID_ORDER = EWI_ID_ORDER_CUS and enc_no_item = EWI_ID_ORD_ITEM_CUS AND ENC_CD_EPA=ewi_cd_epa) GEOMETRY
            from V_WORK_INST,V_LDP_PRODN
            WHERE LOM_cd_epa=ewi_cd_epa and LOM_id_batch=ewi_id_batch AND EWI_ID_SCHEDULE=:SCHEDULE_ID
            AND EWI_CD_STATUS='CN'
            AND EWI_PRIORITY=(select MIN(EWI_PRIORITY) from  V_WORK_INST
                            WHERE EWI_ID_SCHEDULE=:SCHEDULE_ID
                            AND EWI_CD_STATUS='CN')
      ORDER BY EWI_ID_WRK_INST`;
    let binds = {
      SCHEDULE_ID: RM_BATCH,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapProductionTable = async (req: any) => {
  try {
    const sql = `SELECT 
        LDPDBA.f_LDB010_scrapid (
            :p_plant,
            :p_mbatch,
            :p_prodn_dt,
            :p_proc
        ) AS scrap_batch_id,
            '' AS idpdi, 
        'SC88888888' AS order_id, 
        0 AS item, 
        '' AS rm_prod, 
        '' AS fg_prod, 
        'SCRP' AS qlty,
        '' AS grade, 
        '' AS thk, 
        '' AS width_odia, 
        '' AS length1, 
        '0' AS no_pcs, 
        '' AS net_wt,
        '' AS next_proc, 
        '' AS rsn_hold, 
        '' AS hold_desc, 
        '' AS opr_remarks,
        SUBSTR(r.cd_desc, 1, 18) AS material,
        SUBSTR(r.cd_desc, 21, 70) AS material_desc, 
        '' AS sfg_matnr,
        '' AS sfg_matnr_desc, 
        '' AS rm_matnr, 
        '' AS rm_matnr_desc, 
        '' AS odia, 
        '' AS idia
    FROM (
        SELECT cd_desc
        FROM v_codes
        WHERE cd_type = 'TB014'
          AND SUBSTR(cd_value, 1, 4) = '0780'
          AND SUBSTR(cd_value, 6, 1) = '1'
    ) r
    ORDER BY r.cd_desc
    `;

    let binds = {
      p_plant: "0780",
      p_mbatch: req.RM_BATCH,
      p_prodn_dt: req.SHIFT_DATE,
      p_proc: "1",
    };
    // console.log(binds);
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

// export const getPipeId = async (req: any) => {
//   try {
//     console.log("inside pipeid");
//     console.log(req);
//     let mill;
//     let bindsMill = {
//       mBatch: req.RM_BATCH,
//     };
//     console.log("bindsmill", bindsMill);
//     let qryMillCode = `SELECT SUBSTR(EWI_WRK_CENTER_NO,5,1) FROM V_WORK_INST
//         WHERE EWI_CD_ePA= '0780'
//         AND EWI_ID_BATCH =:mBatch
//         AND EWI_CD_STATUS ='CN' and ROWNUM=1`;

//     let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

//     mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : "1";
//     console.log("mill", mill);
//     const sql = `SELECT f_LDB010_pipeid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :shift) as PIPEID FROM dual`;

//     let binds = {
//       plant: "0780",
//       mbatch: req.RM_BATCH,
//       p_prodn_dt: req.SHIFT_DATE,
//       process: "1",
//       mill: mill,
//       shift: req.SHIFT,
//     };
//     console.log(binds);
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getPipeId = async (req: any) => {
  try {
    const sql = `SELECT F_LDB010_PIPEID_NEW('${req?.prodDt}', '${req?.millNo}', '${req?.seqNo}') as PIPEID FROM dual`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeWeight = async (req: any) => {
  try {
    const sql = `SELECT f_get_piece_actl(
            :p_plant ,
            :p_batch_id ,
            :p_no_pcs ,
            :p_length ,
            :p_od,
            :p_id,
            :p_thickness,
            :p_depth,
            :p_width,
            :p_geo
        ) as WEIGHT FROM dual`;

    let binds = {
      p_plant: req.p_plant ?? "",
      p_batch_id: req.p_batch_id ?? "",
      p_no_pcs: "1",
      p_length: req.p_length ?? "",
      p_od: req.p_od ?? "",
      p_id: "0",
      p_thickness: req.p_thickness ?? "",
      p_depth: req?.p_depth ?? "",
      p_width: req?.p_width ?? "",
      p_geo: req?.p_geo ?? "",
    };
    // console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRmList = async (status: any) => {
  try {
    let sql = `select LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS=:status
        and LOM_CD_EPA='0780'`;
    let binds = {
      status: status,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const delete_tempprod = async (req: any) => {
  try {
    const sql = `DELETE FROM V_BARE_PDO_TEMP
        WHERE TBP_PLANT_CD = '0780'
        AND  TBP_PAR_COIL_NO = :P_BATCH
        AND TBP_CD_PROC='1'`;

    let delBind = {
      P_BATCH: req?.[0]?.RM_BATCH,
    };
    // console.log(delBind);
    return await query.executeQuery(sql, delBind);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD01S001Duration = async (data: any) => {
  try {
    let sql: any = `select CD_VALUE from V_CODES
                            WHERE CD_TYPE='LDP100'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD01S001HoldReason = async () => {
  try {
    let sql: any = `select CD_VALUE,CD_DESC from V_CODES
                            WHERE CD_TYPE='LDP101'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD01S001_TEMP_Insert = async (
  newDataPrime: any,
  newDataScrap: any,
  flag: any,
  matNo: any
) => {
  try {
    console.log(newDataPrime, newDataScrap);
    // console.log("matNo: ", matNo);
    const sql = ` call LD01B001(
        p_tbp_batch_no => :p_tbp_batch_no,
        p_tbp_plant_cd => :p_tbp_plant_cd,
        p_tbp_cd_proc => :p_tbp_cd_proc,
        p_tbp_batch_proc_no => :p_tbp_batch_proc_no,
        p_tbp_next_proc => :p_tbp_next_proc,
        p_tbp_prod_date => :p_tbp_prod_date,
        p_tbp_shift => :p_tbp_shift,
        p_tbp_weight => :p_tbp_weight,
        p_tbp_cd_status => :p_tbp_cd_status,
        p_tbp_par_coil_no => :p_tbp_par_coil_no,
        p_tbp_id_first_par => :p_tbp_id_first_par,
        p_tbp_id_order_no => :p_tbp_id_order_no,
        p_tbp_item_no => :p_tbp_item_no,
        p_tbp_quality_cd => :p_tbp_quality_cd,
        p_tbp_no_matnr => :p_tbp_no_matnr,
        p_tbp_cd_flag => :p_tbp_cd_flag,
        p_tbp_prod_start_dt => :p_tbp_prod_start_dt,
        p_tbp_prod_end_dt => :p_tbp_prod_end_dt,
        p_tbp_result => :p_tbp_result,
        p_tbp_remark => :p_tbp_remark,
        p_tbp_insp_name => :p_tbp_insp_name,
        p_tbp_pipe_od_10 => :p_tbp_pipe_od_10,
        p_tbp_pipe_thk_10 => :p_tbp_pipe_thk_10,
        p_tbp_pipe_lng_10 => :p_tbp_pipe_lng_10,
        p_tbp_flatng_0_o_10 => :p_tbp_flatng_0_o_10,
        p_tbp_flatng_90_o_10 => :p_tbp_flatng_90_o_10,
        p_tbp_rbt_10 => :p_tbp_rbt_10,
        p_tbp_dia_end_10 => :p_tbp_dia_end_10,
        p_tbp_dia_body_10 => :p_tbp_dia_body_10,
        p_tbp_out_round_body_10 => :p_tbp_out_round_body_10,
        p_tbp_out_round_end_10 => :p_tbp_out_round_end_10,
        p_tbp_wall_thk_body_10 => :p_tbp_wall_thk_body_10,
        p_tbp_wall_thk_end_10 => :p_tbp_wall_thk_end_10,
        p_tbp_strghtnes_t_end_10 => :p_tbp_strghtnes_t_end_10,
        p_tbp_strghtnes_f_end_10 => :p_tbp_strghtnes_f_end_10,
        p_tbp_sqoc_10 => :p_tbp_sqoc_10,
        p_tbp_roc_10 => :p_tbp_roc_10,
        p_tbp_id_flash_10 => :p_tbp_id_flash_10,
        p_tbp_convx_10 => :p_tbp_convx_10,
        p_tbp_concv_10 => :p_tbp_concv_10,
        p_tbp_twist_10 => :p_tbp_twist_10,
        p_tbp_depth_10 => :p_tbp_depth_10,
        p_tbp_widths_10 => :p_tbp_widths_10,
        p_tbp_sample_10 => :p_tbp_sample_10,
        p_tbp_wld_temp_10 => :p_tbp_wld_temp_10,
        p_tbp_mill_spd_10 => :p_tbp_mill_spd_10,
        p_tbp_currentt_10 => :p_tbp_currentt_10,
        p_tbp_temp_qn_10 => :p_tbp_temp_qn_10,
        p_tbp_voltage_10 => :p_tbp_voltage_10,
        p_tbp_frequency_10 => :p_tbp_frequency_10,
        p_tbp_normz_temp_10 => :p_tbp_normz_temp_10,
        p_tbp_weld_power_10 => :p_tbp_weld_power_10,
        p_tbp_mill_rmk_10 => :p_tbp_mill_rmk_10,
        p_tbp_work_center => :p_tbp_work_center,
        p_tbp_hold_reason => :p_tbp_hold_reason,
        p_tbp_sampl_tag => :p_tbp_sampl_tag,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {};
    if (flag == "PRIME") {
      binds = {
        p_tbp_batch_no: newDataPrime?.PIPEID,
        p_tbp_plant_cd: "0780",
        p_tbp_cd_proc: "1",
        p_tbp_batch_proc_no: 1,
        p_tbp_next_proc: newDataPrime?.NEXT_PROC ?? "", //"2",
        p_tbp_prod_date: newDataPrime?.SHIFT_DATE,
        p_tbp_shift: newDataPrime?.SHIFT,
        p_tbp_weight: isNaN(parseFloat(newDataPrime?.WEIGHT))
          ? null
          : parseFloat(newDataPrime?.WEIGHT),
        p_tbp_cd_status: "1C",
        p_tbp_par_coil_no: newDataPrime?.RM_BATCH,
        p_tbp_id_first_par: newDataPrime?.RM_BATCH,
        p_tbp_id_order_no: newDataPrime?.EWI_ID_ORDER_CUS,
        p_tbp_item_no: isNaN(parseInt(newDataPrime?.EWI_ID_ORD_ITEM_CUS))
          ? 0
          : parseInt(newDataPrime?.EWI_ID_ORD_ITEM_CUS),
        p_tbp_quality_cd: "PRIME",
        // p_tbp_no_matnr: "0",
        p_tbp_no_matnr: newDataPrime?.EWI_SFG_MATNR, //matNo ?? "", //"0",
        p_tbp_cd_flag: "1",
        p_tbp_prod_start_dt: newDataPrime?.prdPStartDt,
        p_tbp_prod_end_dt: newDataPrime?.prdPEndDt,
        p_tbp_result: newDataPrime?.RESULT,
        p_tbp_remark: newDataPrime?.REMARK,
        p_tbp_insp_name: newDataPrime?.INSP_NAME,
        p_tbp_pipe_od_10: isNaN(parseFloat(newDataPrime?.EWI_SEC2))
          ? null
          : parseFloat(newDataPrime?.EWI_SEC2),
        p_tbp_pipe_thk_10: isNaN(parseFloat(newDataPrime?.EWI_SEC1))
          ? null
          : parseFloat(newDataPrime?.EWI_SEC1),
        // p_tbp_pipe_lng_10: isNaN(parseFloat(newDataPrime?.EWI_LENGTH))
        //   ? null
        //   : parseFloat(newDataPrime?.EWI_LENGTH),
        p_tbp_pipe_lng_10: isNaN(parseFloat(newDataPrime?.PIPE_LNG))
          ? null
          : parseFloat(newDataPrime?.PIPE_LNG),
        p_tbp_flatng_0_o_10: newDataPrime?.FLATNG_0_O,
        p_tbp_flatng_90_o_10: newDataPrime?.FLATNG_90_O,
        p_tbp_rbt_10: newDataPrime?.RBT,
        p_tbp_dia_end_10: isNaN(parseFloat(newDataPrime?.DIA_END))
          ? null
          : parseFloat(newDataPrime?.DIA_END),
        p_tbp_dia_body_10: isNaN(parseFloat(newDataPrime?.DIA_BODY))
          ? null
          : parseFloat(newDataPrime?.DIA_BODY),
        p_tbp_out_round_body_10: isNaN(parseFloat(newDataPrime?.OUT_ROUND_BODY))
          ? null
          : parseFloat(newDataPrime?.OUT_ROUND_BODY),
        p_tbp_out_round_end_10: isNaN(parseFloat(newDataPrime?.OUT_ROUND_END))
          ? null
          : parseFloat(newDataPrime?.OUT_ROUND_END),
        p_tbp_wall_thk_body_10: isNaN(parseFloat(newDataPrime?.WALL_THK_BODY))
          ? null
          : parseFloat(newDataPrime?.WALL_THK_BODY),
        p_tbp_wall_thk_end_10: isNaN(parseFloat(newDataPrime?.WALL_THK_END))
          ? null
          : parseFloat(newDataPrime?.WALL_THK_END),
        p_tbp_strghtnes_t_end_10: isNaN(
          parseFloat(newDataPrime?.STRGHTNES_T_END)
        )
          ? null
          : parseFloat(newDataPrime?.STRGHTNES_T_END),
        p_tbp_strghtnes_f_end_10: isNaN(
          parseFloat(newDataPrime?.STRGHTNES_F_END)
        )
          ? null
          : parseFloat(newDataPrime?.STRGHTNES_F_END),
        p_tbp_sqoc_10: newDataPrime?.SQOC,
        p_tbp_roc_10: newDataPrime?.ROC,
        p_tbp_id_flash_10: newDataPrime?.ID_FLASH,
        p_tbp_convx_10: newDataPrime?.CONVX,
        p_tbp_concv_10: newDataPrime?.CONCV,
        p_tbp_twist_10: newDataPrime?.TWIST,
        p_tbp_depth_10: newDataPrime?.DEPTH,
        p_tbp_widths_10: isNaN(parseFloat(newDataPrime?.WIDTHS))
          ? null
          : parseFloat(newDataPrime?.WIDTHS),
        p_tbp_sample_10: newDataPrime?.SAMPLE,
        p_tbp_wld_temp_10: newDataPrime?.WLD_TEMP,
        p_tbp_mill_spd_10: newDataPrime?.MILL_SPD,
        p_tbp_currentt_10: newDataPrime?.CURRENTT,
        p_tbp_temp_qn_10: newDataPrime?.TEMP_QN,
        p_tbp_voltage_10: newDataPrime?.VOLTAGE,
        p_tbp_frequency_10: newDataPrime?.FREQUENCY,
        p_tbp_normz_temp_10: newDataPrime?.NORMZ_TEMP,
        p_tbp_weld_power_10: newDataPrime?.WELD_POWER,
        p_tbp_mill_rmk_10: newDataPrime?.MILL_RMK,
        p_tbp_work_center: newDataPrime?.MILL_NO ?? "",
        p_tbp_hold_reason: newDataPrime?.HOLD_REASON ?? "",
        p_tbp_sampl_tag: newDataPrime?.LOM_SAMPL_TAG ?? "",
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
      // console.log("sql: ", sql);
      // console.log("bindsSave1: ", binds);
    } else {
      binds = {
        p_tbp_batch_no: newDataScrap?.SCRAP_BATCH_ID,
        p_tbp_plant_cd: "0780",
        p_tbp_cd_proc: "1",
        p_tbp_batch_proc_no: 1,
        p_tbp_next_proc: newDataPrime?.NEXT_PROC ?? "", //"2",
        p_tbp_prod_date: newDataPrime?.SHIFT_DATE,
        p_tbp_shift: newDataPrime?.SHIFT,
        p_tbp_weight: isNaN(parseFloat(newDataScrap?.NET_WT))
          ? null
          : parseFloat(newDataScrap?.NET_WT),
        p_tbp_cd_status: "1L",
        p_tbp_par_coil_no: newDataPrime?.RM_BATCH,
        p_tbp_id_first_par: newDataPrime?.RM_BATCH,
        p_tbp_id_order_no: "SC88888888",
        p_tbp_item_no: 0,
        p_tbp_quality_cd: "SCRP",
        p_tbp_no_matnr: newDataScrap?.MATERIAL ? newDataScrap?.MATERIAL : "0",
        p_tbp_cd_flag: "1",
        p_tbp_prod_start_dt: null,
        p_tbp_prod_end_dt: null,
        p_tbp_result: null,
        p_tbp_remark: null,
        p_tbp_insp_name: " ",
        p_tbp_pipe_od_10: null,
        p_tbp_pipe_thk_10: null,
        p_tbp_pipe_lng_10: null,
        p_tbp_flatng_0_o_10: " ",
        p_tbp_flatng_90_o_10: " ",
        p_tbp_rbt_10: " ",
        p_tbp_dia_end_10: null,
        p_tbp_dia_body_10: null,
        p_tbp_out_round_body_10: null,
        p_tbp_out_round_end_10: null,
        p_tbp_wall_thk_body_10: null,
        p_tbp_wall_thk_end_10: null,
        p_tbp_strghtnes_t_end_10: null,
        p_tbp_strghtnes_f_end_10: null,
        p_tbp_sqoc_10: " ",
        p_tbp_roc_10: " ",
        p_tbp_id_flash_10: " ",
        p_tbp_convx_10: " ",
        p_tbp_concv_10: " ",
        p_tbp_twist_10: " ",
        p_tbp_depth_10: " ",
        p_tbp_widths_10: null,
        p_tbp_sample_10: " ",
        p_tbp_wld_temp_10: " ",
        p_tbp_mill_spd_10: " ",
        p_tbp_currentt_10: " ",
        p_tbp_temp_qn_10: " ",
        p_tbp_voltage_10: " ",
        p_tbp_frequency_10: " ",
        p_tbp_normz_temp_10: " ",
        p_tbp_weld_power_10: " ",
        p_tbp_mill_rmk_10: " ",
        p_tbp_work_center: " ",
        p_tbp_hold_reason: " ",
        p_tbp_sampl_tag: " ",
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
      // console.log("bindsSave2: ", binds);
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("errorSave: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSchedules = async (id: any) => {
  try {
    const sql = `select  SCH_ID_SCHEDULE,
    SCH_TS_SCHD_CRT,
    SCH_NO_OF_COIL,
    SCH_MILL_NO,ROWNUM FROM V_SCHEDULE
WHERE SCH_TS_SCHD_CRT    =(select MIN(SCH_TS_SCHD_CRT) FROM V_SCHEDULE WHERE SCH_SCHD_CLOSE = 'Y'
        AND SCH_CD_STATUS = 'C'
        AND SCH_MILL_NO in ('1'))  
UNION ALL
select  SCH_ID_SCHEDULE,
    SCH_TS_SCHD_CRT,
    SCH_NO_OF_COIL,
    SCH_MILL_NO,ROWNUM FROM V_SCHEDULE
WHERE SCH_TS_SCHD_CRT    =(select MIN(SCH_TS_SCHD_CRT) FROM V_SCHEDULE WHERE SCH_SCHD_CLOSE = 'Y'
        AND SCH_CD_STATUS = 'C'
        AND SCH_MILL_NO in ('2') ) `;
    //    let binds = [`${id}`];
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertCoilDetails = async (newDataPrime: any) => {
  try {
    const sql = `call LD01B002(
        P_MOTHERBATCH => :P_MOTHERBATCH,
        LS_OUT_FLAG => :LS_OUT_FLAG
        )`;

    let binds = {};
    binds = {
      P_MOTHERBATCH: newDataPrime?.RM_BATCH,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log(binds, "binds");

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//procedure to validate data from process sheet
export const validateData = async (data: any) => {
  try {
    const sql = ` call F_BARE_QLTY_CHK_10_DUMMY(
        p_batchid => :p_batchid,
        p_ord => :p_ord,
        p_item => :p_item,
        p_TBP_WEIGHT => :p_TBP_WEIGHT,
        p_TBP_PAR_COIL_NO => :p_TBP_PAR_COIL_NO,
        p_TBP_ID_FIRST_PAR => :p_TBP_ID_FIRST_PAR,
        p_TBP_HEAT_NO => :p_TBP_HEAT_NO,
        p_TBP_PIPE_OD_10  => :p_TBP_PIPE_OD_10,
        p_TBP_PIPE_THK_10 => :p_TBP_PIPE_THK_10,
        p_TBP_PIPE_LNG_10 => :p_TBP_PIPE_LNG_10,
        p_TBP_FLATNG_0_O_10 => :p_TBP_FLATNG_0_O_10,
        p_TBP_FLATNG_90_O_10 => :p_TBP_FLATNG_90_O_10,
        p_TBP_RBT_10 => :p_TBP_RBT_10,
        p_TBP_DIA_END_10 => :p_TBP_DIA_END_10,
        p_TBP_DIA_BODY_10 => :p_TBP_DIA_BODY_10,
        p_TBP_OUT_ROUND_BODY_10 => :p_TBP_OUT_ROUND_BODY_10,
        p_TBP_OUT_ROUND_END_10 => :p_TBP_OUT_ROUND_END_10,
        p_TBP_WALL_THK_BODY_10 => :p_TBP_WALL_THK_BODY_10,
        p_TBP_WALL_THK_END_10 => :p_TBP_WALL_THK_END_10,
        p_TBP_STRGHTNES_F_END_10 => :p_TBP_STRGHTNES_F_END_10,
        p_TBP_STRGHTNES_T_END_10 => :p_TBP_STRGHTNES_T_END_10,
        p_TBP_SQOC_10 => :p_TBP_SQOC_10,
        p_TBP_ROC_10 => :p_TBP_ROC_10,
        p_TBP_ID_FLASH_10 => :p_TBP_ID_FLASH_10,
        p_TBP_CONVX_10 => :p_TBP_CONVX_10,
        p_TBP_CONCV_10 => :p_TBP_CONCV_10,
        p_TBP_TWIST_10 => :p_TBP_TWIST_10,
        p_TBP_DEPTH_10 => :p_TBP_DEPTH_10,
        p_TBP_WIDTHS_10 => :p_TBP_WIDTHS_10,
        p_TBP_SAMPLE_10 => :p_TBP_SAMPLE_10,
        p_TBP_WLD_TEMP_10 => :p_TBP_WLD_TEMP_10,
        p_TBP_MILL_SPD_10 => :p_TBP_MILL_SPD_10,
        p_TBP_CURRENTT_10 => :p_TBP_CURRENTT_10,
        p_TBP_TEMP_QN_10 => :p_TBP_TEMP_QN_10,
        p_TBP_VOLTAGE_10 => :p_TBP_VOLTAGE_10,
        p_TBP_FREQUENCY_10 => :p_TBP_FREQUENCY_10,
        p_TBP_NORMZ_TEMP_10 => :p_TBP_NORMZ_TEMP_10,
        p_TBP_WELD_POWER_10 => :p_TBP_WELD_POWER_10,
        p_TBP_MILL_RMK_10 => :p_TBP_MILL_RMK_10,
        ls_out_flag       => :ls_out_flag
      )`;

    let binds = {
      p_batchid: data?.p_batchid ?? "",
      p_ord: data?.p_ord ?? "",
      p_item: data?.p_item ?? "",
      p_TBP_WEIGHT: data?.p_TBP_WEIGHT ?? "",
      p_TBP_PAR_COIL_NO: data?.p_TBP_PAR_COIL_NO ?? "",
      p_TBP_ID_FIRST_PAR: data?.p_TBP_ID_FIRST_PAR ?? "",
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
      p_TBP_STRGHTNES_F_END_10: data?.p_TBP_STRGHTNES_F_END_10 ?? "",
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
      p_TBP_MILL_RMK_10: data?.p_TBP_MILL_RMK_10 ?? "",
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("sql: ", sql);
    console.log("bindsChk: ", binds);
    // }
    let result = await query.executeQuery(sql, binds);
    // console.log("result chk: ", result);
    return result?.outBinds?.ls_out_flag;
  } catch (error) {
    console.log("errorSave: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
