import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetProcDesc = async (Plant: any) => {
  try {
    const sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetOrderType = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA=:0 and ENC_ST_ORDER='A' ORDER  BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const GetCount = async (Plant: any) => {
//     try {
//         const sql = `SELECT COUNT(1) FROM V_CODES WHERE CD_TYPE = 'EPA173' AND  SUBSTR(CD_VALUE,1,4) = :0`;
//         let binds = [`${Plant}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

// export const CheckPackBatch = async (Plant: any, Status: any, BatchID: any) => {
//     try {
//         const sql = `SELECT COUNT(1) FROM V_LDP_PRODN WHERE LOM_CD_EPA =:0 AND LOM_CD_STATUS =:1 AND LOM_ID_BATCH = :2`;
//         let binds = [`${Plant}`, `${Status}`, `${BatchID}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const GetLargeCount = async (Plant: any, ID_Batch: any) => {
  try {
    const sql = `SELECT NVL(LOM_PRINT_LARGE_CNT, 0) FROM V_LDP_PRODN WHERE LOM_CD_EPA = :0 AND LOM_ID_BATCH = :1`;
    let binds = [`${Plant}`, `${ID_Batch}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const SCO_INSERT = async (Plant: any, dt: any) => {
//     try {
//         const sql = ``;
//         let binds = [`${Plant}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const CONFIRM = async (Plant: any, dt: any, userId: any) => {
  try {
    const sql = `call SPCB005_CONFIRM_KHOP (
            p_plant_id => :p_plant_id,
            p_batch => :p_batch,          
            p_UserID => :p_UserID,           
            ls_out_flag => :ls_out_flag
            )`;
    const binds = {
      p_plant_id: Plant,
      p_batch: dt.LOM_ID_BATCH,
      p_UserID: userId,
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
// export const CONFIRM = async (Plant: any, dt: any, userId: any) => {
//     try {
//         //const sql = `call SPCB005_CONFIRM (
//             p_plant => :p_plant,
//             p_batchid => :p_batchid,
//             p_order => :p_order,
//             p_ord_item => :p_ord_item,
//             p_sco_no => :p_sco_no,
//             p_sco_item => :p_sco_item,
//             nbt_LOM_ms_gross_actl => :nbt_LOM_ms_gross_actl,
//             nbt_LOM_ms_piece_actl => :nbt_LOM_ms_piece_actl,
//             nbt_LOM_no_pieces => :nbt_LOM_no_pieces,
//             nbt_LOM_ms_gross_cal => :nbt_LOM_ms_gross_cal,
//             nbt_sec_rsn => :nbt_sec_rsn,
//             nbt_LOM_curr_proc => :nbt_LOM_curr_proc,
//             nbt_LOM_id_first_par => :nbt_LOM_id_first_par,
//             nbt_LOM_id_par_coil_no => :nbt_LOM_id_par_coil_no,
//             nbt_LOM_sec1 => :nbt_LOM_sec1,
//             nbt_LOM_sec2 => :nbt_LOM_sec2,
//             nbt_LOM_length => :nbt_LOM_length,
//             nbt_LOM_cd_qlty_actl => :nbt_LOM_cd_qlty_actl,
//             nbt_LOM_tdc_actl => :nbt_LOM_tdc_actl,
//             nbt_LOM_cd_rsn_scrap => :nbt_LOM_cd_rsn_scrap,
//             nbt_LOM_cd_status => :nbt_LOM_cd_status,
//             nbt_LOM_fl_send_sap => :nbt_LOM_fl_send_sap,
//             nbt_LOM_cd_prod => :nbt_LOM_cd_prod,
//             nbt_LOM_no_cast => :nbt_LOM_no_cast,
//             nbt_idia => :nbt_idia,
//             nbt_LOM_odia => :nbt_LOM_odia,
//             nbt_proc => :nbt_proc,
//             epl_cd_process => :epl_cd_process,
//             nbt_LOM_ms_piece_cal => :nbt_LOM_ms_piece_cal,
//             nbt_activity_time => :nbt_activity_time,
//             p_chk_sel => :p_chk_sel,
//             ls_user_id => :ls_user_id,
//             ls_sec_rsn_desc => :ls_sec_rsn_desc,
//             BYPass_val => :BYPass_val,
//             nbt_location => :nbt_location,
//             ls_out_flag => :ls_out_flag
//             )`;
//         const binds = {
//             p_plant: Plant,
//             p_batchid: dt.LOM_ID_BATCH,
//             p_order: dt.LOM_ID_ORDER_CUS,
//             p_ord_item: dt.LOM_ID_ORD_ITEM_CUS,
//             p_sco_no: dt.LOM_ID_ORDER,
//             p_sco_item: dt.LOM_NO_ITEM,
//             nbt_LOM_ms_gross_actl: dt.LOM_MS_GROSS_ACTL ?? 0,
//             nbt_LOM_ms_piece_actl: dt.LOM_MS_PIECE_ACTL ?? 0,
//             nbt_LOM_no_pieces: dt.LOM_NO_PIECES ?? 0,
//             nbt_LOM_ms_gross_cal: dt.LOM_MS_GROSS_CAL ?? 0,
//             nbt_sec_rsn: dt.SEC_RSN ?? "",
//             nbt_LOM_curr_proc: dt.LOM_CURR_PROC ?? "",
//             nbt_LOM_id_first_par: dt.LOM_ID_FIRST_PAR ?? "",
//             nbt_LOM_id_par_coil_no: dt.LOM_ID_PAR_COIL_NO ?? "",
//             nbt_LOM_sec1: dt.LOM_SEC1 ?? "",
//             nbt_LOM_sec2: dt.LOM_SEC2 ?? "",
//             nbt_LOM_length: dt.LOM_LENGTH ?? 0,
//             nbt_LOM_cd_qlty_actl: dt.LOM_CD_QLTY_ACTL ?? 0,
//             nbt_LOM_tdc_actl: dt.LOM_TDC_ACTL ?? 0,
//             nbt_LOM_cd_rsn_scrap: dt.LOM_CD_RSN_SCRAP ?? "",
//             nbt_LOM_cd_status: dt.LOM_CD_STATUS ?? "",
//             nbt_LOM_fl_send_sap: dt.LOM_FL_SEND_SAP ?? "",
//             nbt_LOM_cd_prod: dt.LOM_CD_PROD ?? "",
//             nbt_LOM_no_cast: dt.LOM_NO_CAST ?? 0,
//             nbt_idia: dt.IDIA ?? 0,
//             nbt_LOM_odia: dt.LOM_ODIA ?? 0,
//             nbt_proc: dt.PROC ?? "",
//             epl_cd_process: dt.EPL_CD_PROCESS ?? "",
//             nbt_LOM_ms_piece_cal: dt.LOM_MS_PIECE_CAL ?? 0,
//             nbt_activity_time: dt.ACTIVITY_TIME ?? 0,
//             p_chk_sel: "Y",
//             ls_user_id: userId,
//             ls_sec_rsn_desc: dt.LS_SEC_RSN_DESC ?? "",
//             BYPass_val: "",
//             nbt_location: dt.LOM_CD_YRD ?? "",
//             ls_out_flag: {
//                 type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500
//             }
//         }
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

// export const CONFIRM_Wires = async (Plant: any, dt: any, userId: any) => {
//     try {
//         const sql = `call SPCB005_WIRES_check (
//             p_plant => :p_plant,
//             p_batchid => :p_batchid,
//             p_order => :p_order,
//             p_ord_item => :p_ord_item,
//             p_sco_no => :p_sco_no,
//             p_sco_item => :p_sco_item,
//             nbt_LOM_ms_gross_actl => :nbt_LOM_ms_gross_actl,
//             nbt_LOM_ms_piece_actl => :nbt_LOM_ms_piece_actl,
//             nbt_LOM_no_pieces => :nbt_LOM_no_pieces,
//             nbt_LOM_ms_gross_cal => :nbt_LOM_ms_gross_cal,
//             nbt_sec_rsn => :nbt_sec_rsn,
//             nbt_LOM_curr_proc => :nbt_LOM_curr_proc,
//             nbt_LOM_id_first_par => :nbt_LOM_id_first_par,
//             nbt_LOM_id_par_coil_no => :nbt_LOM_id_par_coil_no,
//             nbt_LOM_sec1 => :nbt_LOM_sec1,
//             nbt_LOM_sec2 => :nbt_LOM_sec2,
//             nbt_LOM_length => :nbt_LOM_length,
//             nbt_LOM_cd_qlty_actl => :nbt_LOM_cd_qlty_actl,
//             nbt_LOM_tdc_actl => :nbt_LOM_tdc_actl,
//             nbt_LOM_cd_rsn_scrap => :nbt_LOM_cd_rsn_scrap,
//             nbt_LOM_cd_status => :nbt_LOM_cd_status,
//             nbt_LOM_fl_send_sap => :nbt_LOM_fl_send_sap,
//             nbt_LOM_cd_prod => :nbt_LOM_cd_prod,
//             nbt_LOM_no_cast => :nbt_LOM_no_cast,
//             nbt_idia => :nbt_idia,
//             nbt_LOM_odia => :nbt_LOM_odia,
//             nbt_proc => :nbt_proc,
//             epl_cd_process => :epl_cd_process,
//             nbt_LOM_ms_piece_cal => :nbt_LOM_ms_piece_cal,
//             nbt_activity_time => :nbt_activity_time,
//             p_chk_sel => :p_chk_sel,
//             ls_user_id => :ls_user_id,
//             ls_sec_rsn_desc => :ls_sec_rsn_desc,
//             BYPass_val => :BYPass_val,
//             ls_out_flag => :ls_out_flag
//             )`;
//         const binds = {

//             p_plant: Plant,
//             p_batchid: dt.LOM_ID_BATCH,
//             p_order: dt.p_order,
//             p_ord_item: dt.p_ord_item,
//             p_sco_no: dt.p_sco_no,
//             p_sco_item: dt.p_sco_item,
//             nbt_LOM_ms_gross_actl: dt.LOM_MS_GROSS_ACTL,
//             nbt_LOM_ms_piece_actl: dt.LOM_MS_PIECE_ACTL,
//             nbt_LOM_no_pieces: dt.LOM_NO_PIECES,
//             nbt_LOM_ms_gross_cal: dt.LOM_MS_GROSS_CAL,
//             nbt_sec_rsn: dt.SEC_RSN,
//             nbt_LOM_curr_proc: dt.LOM_CURR_PROC,
//             nbt_LOM_id_first_par: dt.LOM_ID_FIRST_PAR,
//             nbt_LOM_id_par_coil_no: dt.LOM_ID_PAR_COIL_NO,
//             nbt_LOM_sec1: dt.LOM_SEC1,
//             nbt_LOM_sec2: dt.LOM_SEC2,
//             nbt_LOM_length: dt.LOM_LENGTH,
//             nbt_LOM_cd_qlty_actl: dt.LOM_CD_QLTY_ACTL,
//             nbt_LOM_tdc_actl: dt.LOM_TDC_ACTL,
//             nbt_LOM_cd_rsn_scrap: dt.LOM_CD_RSN_SCRAP,
//             nbt_LOM_cd_status: dt.LOM_CD_STATUS,
//             nbt_LOM_fl_send_sap: dt.LOM_FL_SEND_SAP,
//             nbt_LOM_cd_prod: dt.LOM_CD_PROD,
//             nbt_LOM_no_cast: dt.LOM_NO_CAST,
//             nbt_idia: dt.IDIA,
//             nbt_LOM_odia: dt.LOM_ODIA,
//             nbt_proc: dt.PROC,
//             epl_cd_process: dt.EPL_CD_PROCESS,
//             nbt_LOM_ms_piece_cal: dt.LOM_MS_PIECE_CAL,
//             nbt_activity_time: dt.ACTIVITY_TIME,
//             p_chk_sel: dt.P_CHK_SEL,
//             ls_user_id: userId,
//             ls_sec_rsn_desc: dt.LS_SEC_RSN_DESC,
//             BYPass_val: dt.bypass_val,
//             ls_out_flag: {
//                 type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500
//             }

//             // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
//         }
//         return await query.executeQuery(sql, binds);
//     } catch (error) {

//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

// export const getCoils_Wires = async (Plant: any, Process: any, Status: any, Order_ID: any, OrderItem: any, batch: any, Mbatch: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, TDC: any, SCO: any, OrderType: any, ProdDtFrom: any, ProdDtTo: any, Customer: any) => {
//     try {
//         const sql = ``;
//         let binds = [`${Plant}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const GetSCOList = async (Plant: any, Status: any) => {
  try {
    const sql = `SELECT DISTINCT LOM_ID_ORDER_CUS AS CD_VALUE,LOM_ID_FIRST_PAR AS CD_DESC,LOM_NO_MATNR MATNR FROM V_LDP_PRODN WHERE LOM_CD_EPA =:0 AND LOM_CD_STATUS=:1 ORDER BY LOM_ID_ORDER_CUS`;
    let binds = [`${Plant}`, `${Status}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const checkRes = async (Plant: any, dt: any) => {
//     try {
//         const sql = ``;
//         let binds = [`${Plant}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const getCoils = async (
  Plant: any,
  Process: any,
  Status: any,
  Order_ID: any,
  OrderItem: any,
  batch: any,
  Mbatch: any,
  ProdCd: any,
  QltyCd: any,
  Thick1: any,
  Thick2: any,
  TDC: any,
  SCO: any,
  OrderType: any,
  ProdDtFrom: any,
  ProdDtTo: any,
  Customer: any,
  Odia: any,
  PkgDtFrom: any,
  PkgDtTo: any,
  pname: any
) => {
  try {
    let binds = {
      Plant: Plant,
    };

    let QrygetCoils = `SELECT
        LOM_id_batch,
        LOM_id_par_coil_no,
        LOM_id_first_par,
        LOM_cd_prod,
        LOM_length,
        LOM_cd_qlty_actl,
        LOM_cd_shift,
        round(LOM_ms_gross_actl, 3) LOM_ms_gross_actl,
        LOM_ms_piece_actl,
        LOM_sec1,
        LOM_sec2,
        LOM_cd_st_actl,
        LOM_passed_proc,
        LOM_no_pieces,
        LOM_tdc_actl,
        LOM_fl_sleeve,
        LOM_ms_sleeve,
        round(LOM_ms_gross_cal, 3) LOM_ms_gross_cal,
        LOM_passed_proc,
        LOM_planned_proc,
        LOM_ms_piece_cal,
        LOM_idia,
        LOM_odia,
        LOM_no_cast,
        LOM_cd_shift,
        TRIM(LOM_id_order) LOM_id_order,
        LOM_no_item,
        LOM_id_order_cus,
        LOM_id_ord_item_cus,
        LOM_cd_curr_proc,
        LOM_cd_next_proc,
        LOM_cd_status,
        LOM_cd_prev_proc,
        TO_CHAR(LOM_ts_creation, 'DD-MON-YY HH24:MI:SS') LOM_ts_creation,
        LOM_fl_send_sap,
        LOM_id_op_decsn,
        LOM_slit_status,
        LOM_yield_strength,
        LOM_tentative_length,
        LOM_final_jac_grd,
        LOM_uom,
        LOM_activity_time,
        nvl(LOM_cd_pack, ' ') storage_loc,
        CASE LOM_cd_status
            WHEN 'WB'   THEN round(trunc(SYSDATE) - trunc(LOM_dt_piece_upd))
            ELSE 0
        END age,
        CASE
            WHEN LOM_cd_status IN (
                'WB',
                'WS',
                'WT',
                'WL',
                'WO',
                'WD',
                'WC',
                'WF'
            ) THEN round(LOM_ms_gross_actl, 3)
        END gross_actl,
        CASE LOM_cd_status
            WHEN 'WB'   THEN TO_CHAR(LOM_dt_piece_upd, 'DD-MON-YY HH24:MI:SS')
            ELSE ''
        END LOM_dt_piece_upd,
        (
            SELECT DISTINCT
                enc_order_type
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) order_type,
        (
            SELECT DISTINCT
                enc_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) customer_name,
        (
            SELECT DISTINCT
                enc_ship_to_prty_desc
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) party_desc,
        (
            SELECT DISTINCT
                iql_grade_desc
            FROM
                v_quality
            WHERE
                iql_cd_qlty = LOM_cd_qlty_actl
        ) grade_desc,
        (
            SELECT DISTINCT
                enc_mark_cust
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) mark_cust,
        (
            SELECT DISTINCT
                substr(replace(enc_mark_cust_name, CHR(10), ' '), 1, 100) enc_mark_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) mkcustomer_name,
        (
            SELECT DISTINCT
                cd_desc
            FROM
                v_codes
            WHERE
                cd_type = 'E0001'
                AND cd_value = LOM_cd_status
        ) status_desc,
        (
            SELECT DISTINCT
                ewi_pkg_typ
            FROM
                v_work_inst
            WHERE
                ewi_id_batch = LOM_id_batch
                AND ewi_cd_epa = LOM_cd_epa
                AND ewi_no_sco_order = LOM_id_order
                AND ewi_no_sco_item = LOM_no_item
                AND ewi_cd_process <> 'W'
                AND ewi_cd_status <> 'RJ'
        ) package_type,
        LOM_no_pieces       LOM_no_pieces1,
        LOM_ms_piece_actl   LOM_ms_piece_actl1,
        round(LOM_ms_gross_actl, 3) LOM_ms_gross_actl1,
        LOM_no_matnr        matnr,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = LOM_no_matnr
        ) matr_desc,
        nvl(LOM_cd_yrd, ' ') LOM_cd_yrd,
        LOM_cd_yrd          LOM_cd_yrd1,
        (
            SELECT
                enc_no_matnr
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) fg_mat_no,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                    SELECT
                        enc_no_matnr
                    FROM
                        v_end_cust_ord_epa
                    WHERE
                        enc_cd_epa = LOM_cd_epa
                        AND enc_id_order = LOM_id_order_cus
                        AND enc_no_item = LOM_id_ord_item_cus
                )
                AND ROWNUM = 1
        ) fg_material_desc,
        LOM_planned_proc    plan_path,
        (
            SELECT
                pph_product
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = LOM_cd_epa
                AND pph_cd_proc_path = LOM_planned_proc
                AND ROWNUM = 1
        ) product_nm,
        (
            SELECT
                pph_product_nm
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = LOM_cd_epa
                AND pph_cd_proc_path = LOM_planned_proc
                AND ROWNUM = 1
        ) pph_product_nm,
        LOM_WORK_CENTER CURR_WORK_CENT,
        (SELECT TO_CHAR (epr_ts_creation, 'DD-MON-YYYY')
          FROM v_epa_line_prodn
         WHERE epr_cd_epa = :plant
           AND epr_id_batch = LOM_id_batch
           AND epr_cd_process = 'W' AND ROWNUM = 1) packing_dt,
      (SELECT SUBSTR (f_tatadate (epr_ts_creation), 1, 1)
         FROM v_epa_line_prodn
        WHERE epr_cd_epa = :plant
          AND epr_id_batch = LOM_id_batch
          AND epr_cd_process = 'W' AND ROWNUM = 1) packing_shft,
      (SELECT epr_rec_crt_by packed_by
         FROM v_epa_line_prodn
        WHERE epr_cd_epa = :plant
          AND epr_id_batch = LOM_id_batch
          AND epr_cd_process = 'W' AND ROWNUM = 1) packed_by,
        (select ENC_MK_SPEC_COMPLETE from V_END_CUST_ORD_EPA
        where ENC_ID_ORDER = LOM_id_order_cus
        AND ENC_CD_EPA = LOM_cd_epa
        AND ENC_NO_ITEM = LOM_id_ord_item_cus AND ROWNUM = 1) SPECEFICATION,(
            SELECT
                enc_matnr_spec
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_id_order = LOM_id_order_cus
                AND enc_cd_epa = LOM_cd_epa
                AND enc_no_item = LOM_id_ord_item_cus
                AND ROWNUM = 1
        ) fg_spec
    FROM
        v_LDP_PRODN
    WHERE
        LOM_cd_epa = :plant
        AND LOM_cd_status IN (
            'KB',
            'KF',
            'WF',
            'WB',
            'WO',
            'WL',
            'WT',
            'WS',
            'WA'
        )
        AND LOM_cd_qlty_actl NOT IN (
            'SCRP'
        )`;

    // SELECT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO, LOM_ID_FIRST_PAR, LOM_CD_PROD, LOM_LENGTH, LOM_CD_QLTY_ACTL, LOM_CD_SHIFT, round(LOM_MS_GROSS_ACTL,3) LOM_MS_GROSS_ACTL, LOM_MS_PIECE_ACTL, LOM_SEC1, LOM_SEC2, LOM_CD_ST_ACTL, LOM_PASSED_PROC, LOM_NO_PIECES, LOM_TDC_ACTL, LOM_FL_SLEEVE, LOM_MS_SLEEVE,round(LOM_MS_GROSS_CAL,3) LOM_MS_GROSS_CAL,LOM_PASSED_PROC,LOM_PLANNED_PROC,LOM_MS_PIECE_CAL, LOM_IDIA, LOM_ODIA,LOM_NO_CAST,LOM_CD_SHIFT, TRIM(LOM_ID_ORDER) LOM_ID_ORDER,LOM_NO_ITEM, LOM_ID_ORDER_CUS, LOM_ID_ORD_ITEM_CUS, LOM_CD_CURR_PROC, LOM_CD_NEXT_PROC, LOM_CD_STATUS, LOM_CD_PREV_PROC, LOM_TS_CREATION, LOM_FL_SEND_SAP, LOM_ID_OP_DECSN,LOM_SLIT_STATUS, LOM_YIELD_STRENGTH,LOM_TENTATIVE_LENGTH, LOM_FINAL_JAC_GRD, LOM_UOM, LOM_ACTIVITY_TIME,
    // NVL(LOM_cD_PACK,' ') STORAGE_LOC ,CASE LOM_CD_STATUS WHEN 'WB' THEN ROUND(trunc(SYSDATE)-trunc(LOM_DT_PIECE_UPD))   ELSE 0  END AGE, CASE WHEN LOM_CD_STATUS in ('WB','WS','WT','WL','WO','WD','WC','WF') THEN round(LOM_MS_GROSS_ACTL,3)  END GROSS_ACTL, Case LOM_CD_STATUS When 'WB' THEN TO_CHAR(LOM_DT_PIECE_UPD)   ELSE ''  END LOM_DT_PIECE_UPD, (Select DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = LOM_CD_ePA  And ENC_ID_ORDER = LOM_ID_ORDER_CUS And ENC_NO_ITEM=LOM_ID_ORD_ITEM_CUS) Order_Type,  (Select DISTINCT ENC_CUST_NAME FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = LOM_CD_ePA  And ENC_ID_ORDER = LOM_ID_ORDER_CUS And ENC_NO_ITEM=LOM_ID_ORD_ITEM_CUS) Customer_name,  (Select DISTINCT ENC_SHIP_TO_PRTY_DESC FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = LOM_CD_ePA  And ENC_ID_ORDER = LOM_ID_ORDER_CUS And ENC_NO_ITEM=LOM_ID_ORD_ITEM_CUS) Party_Desc,  ( SELECT DISTINCT  IQL_GRADE_DESC  FROM V_QUALITY WHERE IQL_CD_QLTY = LOM_CD_QLTY_ACTL) Grade_Desc,  (Select DISTINCT ENC_MARK_CUST FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = LOM_CD_ePA  And ENC_ID_ORDER = LOM_ID_ORDER_CUS And ENC_NO_ITEM=LOM_ID_ORD_ITEM_CUS) Mark_Cust,   (Select DISTINCT SUBSTR(REPLACE(ENC_MARK_CUST_NAME,CHR(10),' '),1,100) ENC_MARK_CUST_NAME FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = LOM_CD_ePA  And ENC_ID_ORDER = LOM_ID_ORDER_CUS And ENC_NO_ITEM=LOM_ID_ORD_ITEM_CUS) MkCustomer_Name,   (SELECT DISTINCT SOI_END_PROD_DESC FROM  V_SCO_ORDER_ITEM WHERE  SOI_CD_EPA = LOM_CD_EPA AND  SOI_ID_ORDER = LOM_ID_ORDER AND SOI_NO_ITEM=LOM_NO_ITEM) PRODUCT_DESC,(SELECT DISTINCT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'E0001' AND  CD_VALUE = LOM_CD_STATUS) STATUS_DESC, (select DISTINCT EWI_PKG_TYP from v_work_inst where ewi_id_batch=LOM_ID_BATCH and ewi_cd_epa=LOM_CD_ePA and EWI_NO_SCO_ORDER= LOM_ID_ORDER and EWI_NO_SCO_ITEM= LOM_NO_ITEM and EWI_CD_PROCESS<>'W'AND EWI_CD_STATUS<>'RJ') Package_Type, nvl(nvl((SELECT DISTINCT TRIM(ebs_cd_rsn_scrap) FROM v_epa_batch_scrap  WHERE ebs_cd_epa = LOM_cd_epa And ebs_id_batch = LOM_id_batch  AND nvl(ebs_ind,'A') = 'B' AND ROWNUM = 1),  (SELECT DISTINCT TRIM(ewi_pln_rsn_cd) FROM v_work_inst   WHERE ewi_cd_epa = LOM_cd_epa And ewi_id_batch = LOM_id_batch   AND ewi_cd_process <> 'W' AND ewi_cd_status NOT IN( 'RJ','CN','WC' ))),  (select ssi_seconds_rsn_cd from v_spc_seconds_int a where a.ssi_plant_cd = LOM_cd_epa and a.ssi_batch_id = LOM_id_batch and a.ssi_request_id IN (select max(b.ssi_request_id) from v_spc_seconds_int b where b.ssi_plant_cd = a.ssi_plant_cd and b.ssi_batch_id = a.ssi_batch_id)))  second_rsn,   ( SELECT DISTINCT TRIM(esr_rsn_desc) FROM v_scrp_sec_rsn WHERE esr_cd_epa = LOM_cd_epa  And esr_rsn_cd IN ( nvl(nvl(   ( SELECT DISTINCT TRIM(ebs_cd_rsn_scrap) FROM v_epa_batch_scrap WHERE ebs_cd_epa = LOM_cd_epa AND ebs_id_batch = LOM_id_batch AND nvl(ebs_ind,'A') = 'B' AND ROWNUM = 1 ),   ( SELECT DISTINCT TRIM(ewi_pln_rsn_cd) FROM v_work_inst WHERE ewi_cd_epa = LOM_cd_epa And ewi_id_batch = LOM_id_batch And ewi_cd_process <> 'W' AND ewi_cd_status NOT IN( 'RJ','CN','WC' ) )   ),(select ssi_seconds_rsn_cd from v_spc_seconds_int a  where a.ssi_plant_cd = LOM_cd_epa And a.ssi_batch_id = LOM_id_batch and a.ssi_request_id IN (select max(b.ssi_request_id) from v_spc_seconds_int b where b.ssi_plant_cd = a.ssi_plant_cd and b.ssi_batch_id = a.ssi_batch_id)  ))) ) second_rsn_desc ,LOM_wfl_status wfl_status_cd,cd_desc wfl_status_desc , (select max(ssi_request_id) ssi_request_id from v_spc_seconds_int where ssi_plant_cd = LOM_cd_epa AND ssi_batch_id = LOM_id_batch and rownum = 1 ) request_id, (select ssi_acceptable_mass from v_spc_seconds_int where ssi_plant_cd = LOM_cd_epa AND ssi_batch_id = LOM_id_batch and rownum = 1 ) ssi_acceptable_mass, (select DECODE(ssi_yield_approval,'Y','Yes','N','No',ssi_yield_approval) from v_spc_seconds_int where ssi_plant_cd = LOM_cd_epa AND ssi_batch_id = LOM_id_batch and rownum = 1 ) ssi_yield_approval  ,(SELECT MAX(ssi_wfl_stage_id) FROM v_spc_seconds_int WHERE ssi_plant_cd = LOM_cd_epa AND ssi_batch_id = LOM_id_batch AND ROWNUM = 1 ) stage_id
    // ,LOM_NO_PIECES LOM_NO_PIECES1,LOM_MS_PIECE_ACTL LOM_MS_PIECE_ACTL1, round(LOM_MS_GROSS_ACTL,3) LOM_MS_GROSS_ACTL1
    // ,LOM_NO_MATNR MATNR,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= LOM_NO_MATNR) MATR_DESC
    // FROM V_LDP_PRODN
    // left join v_codes on cd_type = 'C0WFL' and cd_value = LOM_wfl_status
    // WHERE LOM_CD_EPA = :Plant
    // AND LOM_CD_STATUS IN ('KB','KF','WF','WB','WO','WL','WT','WS')
    // AND LOM_CD_QLTY_ACTL  not in ('SCRP')
    // `;
    if (pname && pname != "") {
      QrygetCoils +=
        " AND LOM_planned_proc IN ( SELECT pph_cd_proc_path FROM v_epa_proc_path WHERE pph_cd_epa = LOM_cd_epa AND pph_product_nm = :Pname )";
      Object.assign(binds, { Pname: pname });
    }

    if (Process && Process != "") {
      QrygetCoils += " And LOM_CD_CURR_PROC =NVL(:Process, LOM_CD_CURR_PROC)";
      Object.assign(binds, { Process: Process });
    }

    if (Status && Status != "") {
      QrygetCoils += " And LOM_CD_STATUS =NVL(:Status, LOM_CD_STATUS)";
      Object.assign(binds, { Status: Status });
    }

    if (Order_ID && Order_ID != "") {
      QrygetCoils += " And LOM_ID_ORDER_CUS =NVL(:Order_ID, LOM_ID_ORDER_CUS)";
      Object.assign(binds, { Order_ID: Order_ID });
    }

    if (OrderItem && OrderItem != "") {
      QrygetCoils +=
        " And LOM_ID_ORD_ITEM_CUS =NVL(:OrderItem, LOM_ID_ORD_ITEM_CUS)";
      Object.assign(binds, { OrderItem: OrderItem });
    }

    if (batch && batch != "") {
      QrygetCoils += " And LOM_ID_BATCH =NVL(:batch, LOM_ID_BATCH)";
      Object.assign(binds, { batch: batch });
    }

    if (Mbatch && Mbatch != "") {
      QrygetCoils += " And LOM_ID_FIRST_PAR =NVL(:Mbatch, LOM_ID_FIRST_PAR)";
      Object.assign(binds, { Mbatch: Mbatch });
    }

    // if (ProdCd != '') {
    //     QrygetCoils += " And LOM_CD_PROD =NVL(:ProdCd, LOM_CD_PROD)"
    //     Object.assign(binds, { ProdCd: ProdCd });
    // }

    // if (QltyCd != '') {
    //     QrygetCoils += " And LOM_CD_QLTY_ACTL =NVL(:QltyCd, LOM_CD_QLTY_ACTL)"
    //     Object.assign(binds, { QltyCd: QltyCd });
    // }

    // if (TDC != '') {
    //     QrygetCoils += " And LOM_TDC_ACTL =NVL(:TDC, LOM_TDC_ACTL)"
    //     Object.assign(binds, { TDC: TDC });
    // }

    // if (SCO != '') {
    //     QrygetCoils += " And LOM_ID_ORDER =NVL(:SCO, LOM_ID_ORDER)"
    //     Object.assign(binds, { SCO: SCO });
    // }

    if ((Thick1 && Thick1 != "") || (Thick2 && Thick2 != "")) {
      if (Thick2 == "") {
        Thick2 = Thick1;
      } else if (Thick1 == "") {
        Thick1 = Thick2;
      }

      QrygetCoils +=
        " And LOM_SEC1 BETWEEN NVL(:Thick1,LOM_SEC1) AND NVL(:Thick2,NVL(:Thick1,LOM_SEC1))";
      Object.assign(binds, { Thick1: Thick1 });
      Object.assign(binds, { Thick2: Thick2 });
    }

    // if (Width1 && Width1 != '') {
    //     QrygetCoils += " And LOM_SEC2 BETWEEN NVL(:Width1,LOM_SEC2) AND NVL(:Width2,NVL(:Width1,LOM_SEC2))"
    //     Object.assign(binds, { Width1: Width1 });
    //     Object.assign(binds, { Width2: Width2 });
    // }

    if (ProdDtFrom && ProdDtFrom != "") {
      if (ProdDtTo && ProdDtTo != "") {
        ProdDtTo = ProdDtTo;
      } else {
        ProdDtTo = ProdDtFrom;
      }
      QrygetCoils +=
        " And TRUNC(LOM_ts_creation) BETWEEN NVL(:ProdDtFrom,TRUNC(LOM_ts_creation)) AND  NVL(:ProdDtTo,NVL(:ProdDtFrom,TRUNC(LOM_ts_creation)))";
      Object.assign(binds, { ProdDtFrom: ProdDtFrom });
      Object.assign(binds, { ProdDtTo: ProdDtTo });
    }

    if (Customer && Customer != "") {
      QrygetCoils +=
        " and ( LOM_cd_epa||LOM_ID_ORDER_CUS ||LOM_ID_ORD_ITEM_CUS) in (select enc_cd_epa||enc_id_order||enc_no_item from v_End_cust_ord_Epa where  enc_cd_epa=LOM_cd_epa And enc_id_order = LOM_ID_ORDER_CUS And enc_no_item =LOM_ID_ORD_ITEM_CUS And enc_cD_END_CUST =:Customer) ";
      Object.assign(binds, { Customer: Customer });
    }
    if (Odia && Odia != "") {
      QrygetCoils += " and LOM_odia =:Odia ";
      Object.assign(binds, { Odia: Odia });
    }

    if (PkgDtFrom && PkgDtFrom != "") {
      if (PkgDtTo && PkgDtTo != "") {
        PkgDtTo = PkgDtTo;
      } else {
        PkgDtTo = PkgDtFrom;
      }
      QrygetCoils +=
        " AND LOM_ID_BATCH IN (select epr_id_batch  from v_epa_line_prodn where epr_cd_process = 'W' ";
      QrygetCoils +=
        " AND TRUNC(epr_ts_creation) BETWEEN NVL(:PkgDtFrom,TRUNC(epr_ts_creation)) AND  NVL(:PkgDtTo,NVL(:PkgDtFrom,TRUNC(epr_ts_creation)))) ";
      Object.assign(binds, { PkgDtFrom: PkgDtFrom });
      Object.assign(binds, { PkgDtTo: PkgDtTo });
    }

    return await query.executeQuery(QrygetCoils, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getKbCoils = async (
  Plant: any,
  Process: any,
  Status: any,
  Order_ID: any,
  OrderItem: any,
  batch: any,
  Mbatch: any,
  ProdCd: any,
  QltyCd: any,
  Thick1: any,
  Thick2: any,
  TDC: any,
  SCO: any,
  OrderType: any,
  ProdDtFrom: any,
  ProdDtTo: any,
  Customer: any,
  Odia: any,
  PkgDtFrom: any,
  PkgDtTo: any,
  pname: any
) => {
  try {
    let binds = {
      Plant: Plant,
      Status: Status,
    };

    let QrygetCoils = `SELECT
        LOM_id_batch,
        LOM_id_par_coil_no,
        LOM_id_first_par,
        LOM_cd_prod,
        LOM_length,
        LOM_cd_qlty_actl,
        LOM_cd_shift,
        round(LOM_ms_gross_actl, 3) LOM_ms_gross_actl,
        LOM_ms_piece_actl,
        LOM_sec1,
        LOM_sec2,
        LOM_cd_st_actl,
        LOM_passed_proc,
        LOM_no_pieces,
        LOM_tdc_actl,
        LOM_fl_sleeve,
        LOM_ms_sleeve,
        round(LOM_ms_gross_cal, 3) LOM_ms_gross_cal,
        LOM_passed_proc,
        LOM_planned_proc,
        LOM_ms_piece_cal,
        LOM_idia,
        LOM_odia,
        LOM_no_cast,
        LOM_cd_shift,
        TRIM(LOM_id_order) LOM_id_order,
        LOM_no_item,
        LOM_id_order_cus,
        LOM_id_ord_item_cus,
        LOM_cd_curr_proc,
        LOM_cd_next_proc,
        LOM_cd_status,
        LOM_cd_prev_proc,
        TO_CHAR(LOM_ts_creation, 'DD-MON-YY HH24:MI:SS') LOM_ts_creation,
        LOM_fl_send_sap,
        LOM_id_op_decsn,
        LOM_slit_status,
        LOM_yield_strength,
        LOM_tentative_length,
        LOM_final_jac_grd,
        LOM_uom,
        LOM_activity_time,
        nvl(LOM_cd_pack, ' ') storage_loc,
        CASE LOM_cd_status
            WHEN 'WB'   THEN round(trunc(SYSDATE) - trunc(LOM_dt_piece_upd))
            ELSE 0
        END age,
        CASE
            WHEN LOM_cd_status IN (
                'WB',
                'WS',
                'WT',
                'WL',
                'WO',
                'WD',
                'WC',
                'WF'
            ) THEN round(LOM_ms_gross_actl, 3)
        END gross_actl,
        CASE LOM_cd_status
            WHEN 'WB'   THEN TO_CHAR(LOM_dt_piece_upd, 'DD-MON-YY HH24:MI:SS')
            ELSE ''
        END LOM_dt_piece_upd,
        (
            SELECT DISTINCT
                enc_order_type
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) order_type,
        (
            SELECT DISTINCT
                enc_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) customer_name,
        (
            SELECT DISTINCT
                enc_ship_to_prty_desc
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) party_desc,
        (
            SELECT DISTINCT
                iql_grade_desc
            FROM
                v_quality
            WHERE
                iql_cd_qlty = LOM_cd_qlty_actl
        ) grade_desc,
        (
            SELECT DISTINCT
                enc_mark_cust
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) mark_cust,
        (
            SELECT DISTINCT
                substr(replace(enc_mark_cust_name, CHR(10), ' '), 1, 100) enc_mark_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) mkcustomer_name,
        (
            SELECT DISTINCT
                cd_desc
            FROM
                v_codes
            WHERE
                cd_type = 'E0001'
                AND cd_value = LOM_cd_status
        ) status_desc,
        (
            SELECT DISTINCT
                ewi_pkg_typ
            FROM
                v_work_inst
            WHERE
                ewi_id_batch = LOM_id_batch
                AND ewi_cd_epa = LOM_cd_epa
                AND ewi_no_sco_order = LOM_id_order
                AND ewi_no_sco_item = LOM_no_item
                AND ewi_cd_process <> 'W'
                AND ewi_cd_status <> 'RJ'
        ) package_type,
        LOM_no_pieces       LOM_no_pieces1,
        LOM_ms_piece_actl   LOM_ms_piece_actl1,
        round(LOM_ms_gross_actl, 3) LOM_ms_gross_actl1,
        LOM_no_matnr        matnr,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = LOM_no_matnr
        ) matr_desc,
        nvl(LOM_cd_yrd, ' ') LOM_cd_yrd,
        LOM_cd_yrd          LOM_cd_yrd1,
        (
            SELECT
                enc_no_matnr
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) fg_mat_no,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                    SELECT
                        enc_no_matnr
                    FROM
                        v_end_cust_ord_epa
                    WHERE
                        enc_cd_epa = LOM_cd_epa
                        AND enc_id_order = LOM_id_order_cus
                        AND enc_no_item = LOM_id_ord_item_cus
                )
                AND ROWNUM = 1
        ) fg_material_desc,
        LOM_planned_proc    plan_path,
        (
            SELECT
                pph_product
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = LOM_cd_epa
                AND pph_cd_proc_path = LOM_planned_proc
                AND ROWNUM = 1
        ) product_nm,
        (
            SELECT
                pph_product_nm
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = LOM_cd_epa
                AND pph_cd_proc_path = LOM_planned_proc
                AND ROWNUM = 1
        ) pph_product_nm,
        LOM_WORK_CENTER CURR_WORK_CENT,
        (SELECT TO_CHAR (epr_ts_creation, 'DD-MON-YYYY')
          FROM v_epa_line_prodn
         WHERE epr_cd_epa = :plant
           AND epr_id_batch = LOM_id_batch
           AND epr_cd_process = 'W' AND ROWNUM = 1) packing_dt,
      (SELECT SUBSTR (f_tatadate (epr_ts_creation), 1, 1)
         FROM v_epa_line_prodn
        WHERE epr_cd_epa = :plant
          AND epr_id_batch = LOM_id_batch
          AND epr_cd_process = 'W' AND ROWNUM = 1) packing_shft,
      (SELECT epr_rec_crt_by packed_by
         FROM v_epa_line_prodn
        WHERE epr_cd_epa = :plant
          AND epr_id_batch = LOM_id_batch
          AND epr_cd_process = 'W' AND ROWNUM = 1) packed_by,
        (select ENC_MK_SPEC_COMPLETE from V_END_CUST_ORD_EPA
        where ENC_ID_ORDER = LOM_id_order_cus
        AND ENC_CD_EPA = LOM_cd_epa
        AND ENC_NO_ITEM = LOM_id_ord_item_cus AND ROWNUM = 1) SPECEFICATION
    FROM
        v_LDP_PRODN
    WHERE
        LOM_cd_epa = :plant
        AND LOM_cd_status = :Status
        AND LOM_cd_qlty_actl NOT IN (
            'SCRP'
        )`;

    if (pname && pname != "") {
      QrygetCoils +=
        " AND LOM_planned_proc IN ( SELECT pph_cd_proc_path FROM v_epa_proc_path WHERE pph_cd_epa = LOM_cd_epa AND pph_product_nm = :Pname )";
      Object.assign(binds, { Pname: pname });
    }

    if (batch && batch != "") {
      QrygetCoils += " And LOM_ID_BATCH =NVL(:batch, LOM_ID_BATCH)";
      Object.assign(binds, { batch: batch });
    }

    if (Mbatch && Mbatch != "") {
      QrygetCoils += " And LOM_ID_FIRST_PAR =NVL(:Mbatch, LOM_ID_FIRST_PAR)";
      Object.assign(binds, { Mbatch: Mbatch });
    }

    if (PkgDtFrom && PkgDtFrom != "") {
      if (PkgDtTo && PkgDtTo != "") {
        PkgDtTo = PkgDtTo;
      } else {
        PkgDtTo = PkgDtFrom;
      }
      QrygetCoils +=
        " AND LOM_ID_BATCH IN (select epr_id_batch  from v_epa_line_prodn where epr_cd_process = 'W' ";
      QrygetCoils +=
        " AND TRUNC(epr_ts_creation) BETWEEN NVL(:PkgDtFrom,TRUNC(epr_ts_creation)) AND  NVL(:PkgDtTo,NVL(:PkgDtFrom,TRUNC(epr_ts_creation)))) ";
      Object.assign(binds, { PkgDtFrom: PkgDtFrom });
      Object.assign(binds, { PkgDtTo: PkgDtTo });
    }

    return await query.executeQuery(QrygetCoils, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const PrintResult = async (Plant: any, dt: any) => {
//     try {
//         const sql = ``;
//         let binds = [`${Plant}`];
//         return await query.executeQuery(sql, binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };
export const PlantAddress = async (Plant: any) => {
  try {
    const sql = `
        select EPL_ADDRESS third_Line,EPL_REM1 fourth_Line
        from v_epa_proc_line
        where epl_cd_Epa=:Plant
        and rownum=1
        `;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCommRecorder = async (User: any) => {
  try {
    const sql = `select CD_VALUE FROM V_CODES where CD_TYPE='TB049'`;
    // const binds = {
    //     Userid: User,
    //   };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const SFGDetails = async (Plant: any, Batch: any) => {
  try {
    const sql = `
            SELECT EWI_SFG_MATNR , (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR AND ROWNUM=1 ) MAT_DESC
            FROM V_WORK_INST
            WHERE EWI_CD_EPA=:Plant
            AND EWI_ID_BATCH = :Batch
            AND EWI_CD_STATUS ='PR'
        `;
    let binds = [`${Plant}`, `${Batch}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSecRsns = async (Plant: any) => {
  try {
    const sql = `SELECT CD_DESC, ESR_RSN_CD, ESR_RSN_DESC FROM V_SCRP_SEC_RSN, V_CODES WHERE  ESR_CD_EPA = :0 AND CD_TYPE = 'EPA231' AND ESR_RSN_TYPE IN ('B','AB') AND CD_VALUE = ESR_RSN_CAT AND ESR_STATUS='A' AND UPPER(ESR_RSN_DESC) NOT LIKE 'BLOCKED%' ORDER  BY 1, 2`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetStsList = async () => {
  try {
    const sql = `SELECT CD_VALUE,CD_DESC From V_Codes Where Cd_Type='E0001' AND CD_VALUE IN ('KB','KF','WB','WC','WF','WO','WL','WS','WT','WA') ORDER BY 1`;
    //let binds = [`${Plant}`];
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const GetCustDesc = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_CD_END_CUST,ENC_CD_END_CUST||' - '||ENC_CUST_NAME ENC_CUST_NAME FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA= :0 AND  ENC_ST_ORDER='A' AND TRIM(ENC_CD_END_CUST) IS NOT NULL ORDER BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const GetOdiaList = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT LOM_ODIA, ROUND(LOM_ODIA,3) ODIA FROM V_LDP_PRODN WHERE LOM_CD_EPA =:0 AND LOM_CD_STATUS IN ('KB','KF','WF','WB','WO','WL','WT','WS','WA') AND LOM_CD_QLTY_ACTL not in ('SCRP')`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSCO = async (Plant: any) => {
  try {
    const sql = `SELECT ESC_CHRG_TYP ,ESC_PROC,ESC_PROC_DESC,ESC_SCO_RATE ,ESC_CONTRCT_NO,ESC_CONTRACT_ITEM,ESC_PR_NO,ESC_PR_ITEM  FROM (SELECT ESC_CHRG_TYP ,ESC_PROC,ESC_PROC_DESC,ESC_SCO_RATE ,ESC_CONTRCT_NO,ESC_CONTRACT_ITEM,ESC_PR_NO,ESC_PR_ITEM,1 PRIORITY FROM V_EPA_sCO_PROC  WHERE ESC_cD_ePA=:0 AND TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN ESC_EFF_DT_FROM AND ESC_EFF_DT_TO  And ESC_FLAG = (SELECT SUBSTR(CD_DESC,1,1) FROM V_CODES WHERE CD_TYPE='EPA69' AND CD_VALUE=ESC_cD_ePA)  And ESC_STATUS='A' And ESC_CHRG_TYP <>'PKG'UNION SELECT ESC_CHRG_TYP ,EPD_PKG_TYPE ESC_PROC,ESC_PROC_DESC,ESC_SCO_RATE ,ESC_CONTRCT_NO,ESC_CONTRACT_ITEM,ESC_PR_NO,ESC_PR_ITEM , 2 PRIORITY From V_EPA_sCO_PROC , V_EPA_PKG_DTLS  WHERE ESC_CD_ePA = EPD_CD_EPA AND ESC_PROC = EPD_COMP And ESC_cD_ePA=:1 And EPD_STATUS='A'And TO_CHAR(SYSDATE,'YYYYMMDD') BETWEEN ESC_EFF_DT_FROM AND ESC_EFF_DT_TO And ESC_FLAG = (SELECT SUBSTR(CD_DESC,1,1) FROM V_CODES WHERE CD_TYPE='EPA69' AND CD_VALUE=ESC_cD_ePA) And ESC_STATUS='A' And ESC_CHRG_TYP ='PKG' )  ORDER BY PRIORITY,ESC_CONTRCT_NO,ESC_CONTRACT_ITEM `;
    let binds = [`${Plant}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPrvEpa = async (Plant: any, BatchID: any) => {
  try {
    const sql = `SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE='EPA197'AND CD_VALUE<> :0 AND CD_DESC = SUBSTR(:1,1,2)`;
    let binds = [`${Plant}`, `${BatchID}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSrcCoil = async (Plant: any, BatchID: any) => {
  try {
    const sql = `SELECT LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_CD_EPA= :0 AND LOM_ID_BATCH= :1 AND LOM_CD_STATUS='WL'`;
    let binds = [`${Plant}`, `${BatchID}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const InsertLabel = async (
  Plant: any,
  BatchID: any,
  Sts: any,
  UserID: any
) => {
  try {
    const sql = `INSERT INTO V_LABEL_INFO(TLC_TIMESTAMP,TLC_CD_EPA,TLC_ID_BATCH,TLC_LABEL_TYPE,TLC_CD_STATUS,TLC_LABEL_CRT_ON,TLC_LABLE_CRT_BY,TLC_PRINT_ON,TLC_PRINT_BY,TLC_CD_COMP)   VALUES (f_nannow_second_telgrm(SYSDATE), :Plant, :BatchID,'FG', :Sts,SYSDATE, :UserID ,NULL,NULL,'1000')`;
    const binds = {
      Plant: Plant,
      BatchID: BatchID ?? "",
      Sts: Sts ?? "",
      UserID: UserID ?? "",
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getScrapData = async (req: any) => {
  try {
    const sql = `SELECT ROWNUM SR_NO, ( SELECT f_scrappdi_tub(:plant, :mbatch, :process, substr(cd_desc, 1, 18), :p_flag) scrap_batch_id FROM dual ) scrap_batch_id, '' NO_OF_SCRAP_TUBES, '' SCRAP_WT,substr(cd_desc, 1, 18) SCRP_MATNR, substr(cd_desc, 19, 70) material_desc FROM v_codes WHERE cd_type = 'EPA196C' AND substr(cd_value, 1, 4) = :plant AND substr(cd_value, 6, 1) = :process ORDER BY 1`;
    let binds = {
      Plant: req.body.Plant,
      MBatch: req.body.MBatch,
      P_FLAG: "SCRAP",
      Process: req.body.Process,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updateScrapDetails = async (req: any) => {
  try {
    const sql = `DELETE V_PRODUCTION_TEMP WHERE
            TPT_CD_EPA = :Plant AND
            TPT_ID_FIRST_PAR = :ID_BATCH AND
            TPT_USER_ID =:USER_ID AND
            TPT_PAGE_ID ='LDSM005'`;
    const binds = {
      Plant: req.body.Plant,
      ID_BATCH: req.body.Batch,
      USER_ID: req.body.userId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertScrapDetails = async (Plant: any, dt: any, userId: any) => {
  try {
    const sql = `call SPCB005_TEMP_INSERT (
            P_PLANT => :P_PLANT,
            P_BATCHID=> :P_BATCHID,
            P_MCOIL => :P_MCOIL,
            P_PROC => :P_PROC,
            CUSTORD => :CUSTORD,
            CUSTITM => :CUSTITM,
            NXTPROC => :NXTPROC,
            PROD  => :PROD,
            QLTY => :QLTY,            
            THICK  => :THICK,
            WIDTH => :WIDTH,
            P_LENGTH => :P_LENGTH,
            PIECE_ACTL    => :PIECE_ACTL,
            GROSS_ACTL => :GROSS_ACTL, 
            TDC => :TDC,
            USRID => :USRID,
            ID_PDI => :ID_PDI,
            NOPCS => :NOPCS,
            IDIA => :IDIA,
            ODIA => :ODIA,
            PLANRSNCD => :PLANRSNCD,
            IDSCH => :IDSCH,           
            SHIFT => :SHIFT,
            PLANNED_PROC => :PLANNED_PROC,
            OPR_CMNT => substr(:OPR_CMNT,1,200),
            UOM => :UOM,
            ST_PRODN => :ST_PRODN,
            P_PROD_STRT_DTTM => :P_PROD_STRT_DTTM,
            P_PROD_END_DTTM => :P_PROD_END_DTTM,
            P_WORK_CENTER  => :P_WORK_CENTER,
            P_FG_MATNR => :P_FG_MATNR,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_SCRP_MATNR  => :P_SCRP_MATNR,
            P_ROLLING_LENGTH   => :P_ROLLING_LENGTH,
            P_RM_MATNR     => :P_RM_MATNR,
            P_BATCH_TYPE     => :P_BATCH_TYPE,
            P_NO_OF_PASS       => :P_NO_OF_PASS,
            P_YIELD        => :P_YIELD,
            P_SCRAP_WT       => :P_SCRAP_WT,
            P_CAST_NO=> :P_CAST_NO,
            P_YARD => :P_YARD,         
            ls_out_flag => :ls_out_flag
            )`;
    console.log(dt.OPR_COMMENT);
    const binds = {
      P_PLANT: Plant,
      P_BATCHID: dt.ID_BATCH,
      P_MCOIL: dt.ID_FIRST_PAR,
      P_PROC: dt.CD_PROCESS,
      CUSTORD: dt.ID_ORDER,
      CUSTITM: dt.NO_ITEM,
      NXTPROC: dt.CD_NEXT_PROC ?? "",
      PROD: dt.CD_PROD ?? "",
      QLTY: dt.CD_QLTY ?? "",
      THICK: dt.SEC1 ?? 0,
      WIDTH: dt.SEC2 ?? 0,
      P_LENGTH: dt.LENGTH ?? 0,
      PIECE_ACTL: dt.MS_INPUT ?? "", //dt.MS_PIECE_ACTL, scrap mass is in MS_INPUT
      GROSS_ACTL: dt.MS_INPUT ?? "", //dt.MS_GROSS_CAL,
      TDC: dt.NO_TDC,
      USRID: userId,
      ID_PDI: dt.ID_PDI ?? "",
      NOPCS: dt.NO_PIECES,
      IDIA: dt.IDIA ?? 0,
      ODIA: dt.ODIA ?? 0,
      PLANRSNCD: dt.PLANRSNCD ?? "",
      IDSCH: dt.IDSCH ?? "",
      SHIFT: dt.CD_SHIFT ?? "",
      PLANNED_PROC: dt.PLAN_PROC ?? "",
      OPR_CMNT: dt.OPR_COMMENT ?? "",
      UOM: dt.UOM ?? "",
      ST_PRODN: dt.ST_PRODN ?? "",
      P_PROD_STRT_DTTM: dt.P_PROD_STRT_DTTM ?? "",
      P_PROD_END_DTTM: dt.P_PROD_END_DTTM ?? "",
      P_WORK_CENTER: dt.P_WORK_CENTER ?? "",
      P_FG_MATNR: dt.FG_MATNR ?? "",
      P_SFG_MATNR: dt.SFG_MATNR ?? "",
      P_SCRP_MATNR: dt.SCRP_MATNR ?? "", //{Scrap}
      P_ROLLING_LENGTH: dt.P_ROLLING_LENGTH ?? "",
      P_RM_MATNR: dt.RM_MATNR ?? "",
      P_BATCH_TYPE: dt.BATCH_TYPE ?? "",
      P_NO_OF_PASS: dt.NO_OF_PASS ?? "",
      P_YIELD: dt.YIELD ?? 0,
      P_SCRAP_WT: dt.MS_PIECE_ACTL, //dt.MS_INPUT ?? "",//{Scrap} this P_SCRAP_WT is being inserted in input mass in procedure thus piece_mass is being passed
      P_CAST_NO: dt.NO_CAST ?? "",
      P_YARD: dt.LOM_CD_YRD ?? "",
      ls_out_flag: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapFlag = async (Plant: any, BatchID: any) => {
  try {
    const sql = `SELECT COUNT(1) CNT FROM V_PRODUCTION_TEMP WHERE
                    TPT_CD_EPA = :Plant AND
                    TPT_ID_BATCH = :BatchId`;
    const binds = {
      Plant: Plant,
      BatchId: BatchID,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchId = async (plant: any, status: any) => {
  try {
    let sql = `SELECT DISTINCT LOM_ID_BATCH
      FROM V_LDP_PRODN
      WHERE LOM_CD_EPA=:Plant
      AND LOM_CD_QLTY_ACTL<>'SCRP'
    `;
    //   if (status === 'HOLD') {
    //     sql += ` AND (LOM_CD_STATUS LIKE '%B' OR LOM_CD_STATUS LIKE '%F')`
    //   }

    sql += ` ORDER BY 1`;
    let binds = { plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getIndTubesData = async (req: any) => {
  try {
    let cdval = req.body.cdval;

    var sql = `select distinct cd_type, cd_value, cd_desc from v_codes where cd_type =:cd_type`;

    let binds = {
      cd_type: req.body.cdtype,
    };
    if (cdval && cdval != "") {
      sql += " and  cd_value =:cd_value";
      binds["cd_value"] = cdval;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const GetPieceActl = async (req: any) => {
  try {
    const sql = `select LDPDBA.f_get_piece_actl(:P_PLANT, :P_BATCH_ID, :P_PROD_NAME, :P_NO_PCS, :P_LENGTH, :P_OD, :P_ID, :P_THICKNESS) piece_actl from dual`;
    let binds = {
      P_PLANT: req.body.plant,
      P_BATCH_ID: req.body.batch_id,
      P_PROD_NAME: req.body.prod_name,
      P_NO_PCS: req.body.no_pcs,
      P_LENGTH: parseFloat(req.body.length),
      P_OD: parseFloat(req.body.p_od),
      P_ID: parseFloat(req.body.p_id),
      P_THICKNESS: parseFloat(req.body.p_thk),
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProductName = async (req: any) => {
  try {
    let sql = `select DISTINCT PPH_PRODUCT_NM from v_epa_proc_path
        where PPH_CD_EPA= :plant`;
    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveKbBatches = async (Plant: any, MBATCHID: any, userId: any) => {
  try {
    let sql = `call SPCB005_SCRAP (
            PLANT => :PLANT,
            MBATCHID => :MBATCHID,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    let binds = {
      PLANT: Plant,
      MBATCHID: MBATCHID,
      P_USER: userId,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveDefectBatches = async (req: any) => {
  try {
    let sql = ``;
    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const get_applicatio_id = async (
  plant: any,
  fg_mat_no: any,
  fg_mat_spec: any
) => {
  try {
    let sql = `select applicationid app_id
        from v_qci_appl_mst,v_marc where status = 'A'
        and hsn_code = SUBSTR(STEUC,1,4)
        and plantcode =:Plant --- plant code
        AND MATNR =:MatNo  --- fg material
        AND ROWNUM = 1`;

    let binds = {
      Plant: plant,
      MatNo: fg_mat_no,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const get_hsn_code = async (
  plant: any,
  fg_mat_no: any,
  fg_mat_spec: any
) => {
  try {
    let sql = `SELECT SUBSTR(STEUC,1,4) hsn_code
        FROM V_MARC
        WHERE  MANDT='600' 
        and MATNR= :matnr 
        --FG MATERIAL`;

    let binds = {
      matnr: fg_mat_no,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const get_grade = async (
  plant: any,
  fg_mat_no: any,
  fg_mat_spec: any
) => {
  try {
    let sql = `select KURZTEXT isi_logo_upper,SORTFELD cml_no,LONG_TEXT grade from ymqmt_bis_info
        where mandt='600'
        and VORLNR = :fg_spec -- fg material spec
        and werks= :plant ---plant`;

    let binds = {
      fg_spec: fg_mat_spec,
      plant: plant,
      // fg_spec: 'HX31',
      // plant: '117'
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
