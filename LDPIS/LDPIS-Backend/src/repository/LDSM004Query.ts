import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetProcess = async (Plant: any) => {
  try {
    //const sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS <>'V' AND EPL_ACTIVITY_NM <>'SLT' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getUserIdsEditableMass = async (Plant: any, userid: any) => {
  try {
    let sql = `SELECT
        CASE
        WHEN :userid IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'TB042') THEN 1
        ELSE 0
        END AS BOOL
        FROM V_CODES 
        WHERE CD_TYPE='TB042'`;
    let binds = {
      userid: userid,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchTonage = async (
  Plant: any,
  PROC: any,
  Batch: any,
  MBatch: any,
  CusrOrd: any,
  CustItm: any,
  Thick: any,
  Idia: any,
  BatchWT: any,
  QLTYCD: any,
  Odia: any,
  CampNo: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchDtl = async (
  Plant: any,
  Batch: any,
  ProcLine: any,
  workcenter: any,
  recordType: any
) => {
  try {
    if (ProcLine == "M") {
      let sql;
      if (recordType == "U") {
        sql = `SELECT LOM_id_batch, LOM_no_cast, LOM_cd_prod, LOM_cd_qlty_actl, LOM_sec1, LOM_sec2, LOM_length, LOM_tdc_actl, LOM_ms_piece_actl     input_wt_old, nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) input_wt, LOM_cd_status, nvl(LOM_ms_gross_cal, 0) LOM_ms_gross_cal_old, nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) LOM_ms_gross_cal, LOM_cd_next_proc, ( SELECT substr(LOM_planned_proc, instr(LOM_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(LOM_planned_proc, LOM_passed_proc, :procline) FROM dual ) next_proc, nvl(LOM_ms_scrap, 0) LOM_ms_scrap, ( LOM_ms_piece_actl - LOM_ms_gross_cal ) proc_wt_old, ( ( nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) ) - ( nvl(DECODE(LOM_uom, 'KG', round ((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) ) ) proc_wt, LOM_id_first_par, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, LOM_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, TO_CHAR(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ( SELECT f_get_pcs_actl(LOM_cd_epa, ewi_id_batch, ewi_cd_process, 'ERW', ewi_length, ewi_sec2, ewi_idia, ewi_sec1) FROM dual ) sales_unit_pcs, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length ,enc_sales_qty sales_qty, enc_sales_qty_uom sales_qty_uom FROM v_LDP_PRODN a, v_work_inst b, v_end_cust_ord_epa c WHERE a.LOM_cd_epa = b.ewi_cd_epa AND a.LOM_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND LOM_cd_epa = :plant AND LOM_id_batch = nvl(:batch, LOM_id_batch) AND LOM_cd_status = 'MC' AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) AND SUBSTR(b.ewi_id_batch, 1, 2) = 'MR' ORDER BY ewi_cd_epa, ewi_wrk_center_no, LOM_planned_proc, ewi_no_matnr, ewi_no_tdc`;
      } else {
        sql = `SELECT LOM_id_batch, LOM_no_cast, LOM_cd_prod, LOM_cd_qlty_actl, LOM_sec1, LOM_sec2, LOM_length, LOM_tdc_actl, LOM_ms_piece_actl     input_wt_old, nvl(decode(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) input_wt, LOM_cd_status, nvl(LOM_ms_gross_cal, 0) LOM_ms_gross_cal_old, nvl(decode(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) LOM_ms_gross_cal, LOM_cd_next_proc, ( SELECT substr(LOM_planned_proc, instr(LOM_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(LOM_planned_proc, LOM_passed_proc, :procline) FROM dual ) next_proc, nvl(LOM_ms_scrap, 0) LOM_ms_scrap, ( LOM_ms_piece_actl - LOM_ms_gross_cal ) proc_wt_old, ( ( nvl(decode(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) ) - ( nvl(decode(LOM_uom, 'KG', round ((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) ) ) proc_wt, LOM_id_first_par, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, LOM_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ( SELECT f_get_pcs_actl(LOM_cd_epa, ewi_id_batch, ewi_cd_process, 'ERW', ewi_length, ewi_sec2, ewi_idia, ewi_sec1) FROM dual ) sales_unit_pcs, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length ,enc_sales_qty sales_qty, enc_sales_qty_uom sales_qty_uom FROM v_LDP_PRODN          a, v_work_inst          b, v_end_cust_ord_epa   c WHERE a.LOM_cd_epa = b.ewi_cd_epa AND a.LOM_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND LOM_cd_epa = :plant AND LOM_id_batch = nvl(:batch, LOM_id_batch) AND LOM_cd_status = 'MC' AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) ORDER BY ewi_cd_epa, ewi_wrk_center_no, LOM_planned_proc, ewi_no_matnr, ewi_no_tdc`;
      }
      let binds = {
        plant: Plant,
        batch: Batch,
        procLine: ProcLine,
        workcenter: workcenter,
      };
      return await query.executeQuery(sql, binds);
    } else {
      let sql;
      if (recordType == "U") {
        sql = `SELECT LOM_id_batch, LOM_no_cast, LOM_cd_prod, LOM_cd_qlty_actl, LOM_sec1, LOM_sec2, LOM_length, LOM_tdc_actl, LOM_ms_piece_actl     input_wt_old, nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) input_wt, LOM_cd_status, nvl(LOM_ms_gross_cal, 0) LOM_ms_gross_cal_old, nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) LOM_ms_gross_cal, LOM_cd_next_proc, ( SELECT substr(LOM_planned_proc, instr(LOM_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(LOM_planned_proc, LOM_passed_proc, :procline) FROM dual ) next_proc, nvl(LOM_ms_scrap, 0) LOM_ms_scrap, ( LOM_ms_piece_actl - LOM_ms_gross_cal ) proc_wt_old, ( ( nvl(DECODE(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) ) - ( nvl(DECODE(LOM_uom, 'KG', round ((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) ) ) proc_wt, LOM_id_first_par, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, LOM_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, TO_CHAR(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ( SELECT f_get_pcs_actl(LOM_cd_epa, ewi_id_batch, ewi_cd_process, 'ERW', ewi_length, ewi_sec2, ewi_idia, ewi_sec1) FROM dual ) sales_unit_pcs, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length,enc_sales_qty sales_qty, enc_sales_qty_uom sales_qty_uom FROM v_LDP_PRODN a, v_work_inst b, v_end_cust_ord_epa c WHERE a.LOM_cd_epa = b.ewi_cd_epa AND a.LOM_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND LOM_cd_epa = :plant AND LOM_id_batch = nvl(:batch, LOM_id_batch) AND LOM_cd_status = 'MC' AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) AND SUBSTR(b.ewi_id_batch, 1, 2) = 'MR' ORDER BY ewi_cd_epa, ewi_wrk_center_no, LOM_planned_proc, ewi_no_matnr, ewi_no_tdc`;
      } else {
        sql = `SELECT LOM_id_batch, LOM_no_cast, LOM_cd_prod, LOM_cd_qlty_actl, LOM_sec1, LOM_sec2, LOM_length, LOM_tdc_actl, LOM_ms_piece_actl     input_wt_old, nvl(decode(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) input_wt, LOM_cd_status, nvl(LOM_ms_gross_cal, 0) LOM_ms_gross_cal_old, nvl(decode(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) LOM_ms_gross_cal, LOM_cd_next_proc, ( SELECT substr(LOM_planned_proc, instr(LOM_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(LOM_planned_proc, LOM_passed_proc, :procline) FROM dual ) next_proc, nvl(LOM_ms_scrap, 0) LOM_ms_scrap, ( LOM_ms_piece_actl - LOM_ms_gross_cal ) proc_wt_old, ( ( nvl(decode(LOM_uom, 'KG', round((LOM_ms_piece_actl / 1000), 3), LOM_ms_piece_actl), 0) ) - ( nvl(decode(LOM_uom, 'KG', round ((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) ) ) proc_wt, LOM_id_first_par, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, LOM_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ( SELECT f_get_pcs_actl(LOM_cd_epa, ewi_id_batch, ewi_cd_process, 'ERW', ewi_length, ewi_sec2, ewi_idia, ewi_sec1) FROM dual ) sales_unit_pcs, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length,enc_sales_qty sales_qty, enc_sales_qty_uom sales_qty_uom FROM v_LDP_PRODN          a, v_work_inst          b, v_end_cust_ord_epa   c WHERE a.LOM_cd_epa = b.ewi_cd_epa AND a.LOM_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND LOM_cd_epa = :plant AND LOM_id_batch = nvl(:batch, LOM_id_batch) AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) ORDER BY ewi_cd_epa, ewi_wrk_center_no, LOM_planned_proc, ewi_no_matnr, ewi_no_tdc`;
      }
      let binds = {
        plant: Plant,
        batch: Batch,
        procLine: ProcLine,
        workcenter: workcenter,
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchInfo = async (Plant: any, Batch: any) => {
  try {
    const sql = `select LOM_MS_GROSS_ACTL,LOM_SLIT_SEC,LOM_CD_STATUS,LOM_SLIT_STATUS,LOM_FL_INSP_REQD,LOM_FL_SEND_SAP,LOM_MS_GROSS_CAL,LOM_UOM FROM V_LDP_PRODN  where LOM_cd_epa = :0 and LOM_id_batch = :1`;
    let binds = [`${Plant}`, `${Batch}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetODIA = async (Plant: any, Process: any) => {
  try {
    //const sql = `SELECT DISTINCT(EWI_SEC2)ODIA FROM V_WORK_INST WHERE EWI_CD_STATUS = 'CN' AND EWI_CD_EPA = :0 And ewi_cd_process = :1`;
    const sql = `SELECT DISTINCT(EWI_SEC2)ODIA FROM V_WORK_INST WHERE EWI_CD_STATUS = 'CN' AND EWI_CD_EPA = :0 And ewi_cd_process = :1`;
    let binds = [`${Plant}`, `${Process}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getReverseMerge = async (
  Plant: any,
  Process: any,
  workCenter: any
) => {
  try {
    const sql = `SELECT DISTINCT
        ewi_id_batch   AS batch,
        TO_CHAR(MAX(ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS') ewi_ts_creation
    FROM
        v_work_inst
    WHERE
        ewi_cd_process = :process
        AND ewi_cd_epa = :plant
        AND ewi_cd_status = 'CN'
        AND SUBSTR(ewi_id_batch, 1, 2) = 'MR'
        AND EXISTS (
            SELECT
                LOM_id_batch
            FROM
                v_LDP_PRODN
            WHERE
                LOM_cd_epa = ewi_cd_epa
                AND LOM_id_batch = ewi_id_batch
                AND LOM_cd_status LIKE '%C'
        )
        AND ewi_wrk_center_no = nvl(:WorkCenter, ewi_wrk_center_no)
    GROUP BY
        ewi_id_batch`;

    let binds = {
      plant: Plant,
      process: Process,
      WorkCenter: workCenter,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callUNMERGE = async (mBatchA: any, Plant: any, ProcLine: any) => {
  try {
    const sql = `call LDSM004_UNMERGE ( 
            P_MERGE_COIL => :P_MERGE_COIL,
            P_PLANT => :P_PLANT,
            P_PROC_LINE => :P_PROC_LINE,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    const binds = {
      P_MERGE_COIL: mBatchA,
      P_PLANT: Plant,
      P_PROC_LINE: ProcLine,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 5000,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPalletPlantCount = async (Plant: any, ProcessLine: any) => {
  try {
    const sql = `SELECT count(1) FROM V_CODES WHERE CD_TYPE = 'EPA457' AND SUBSTR(CD_VALUE,1,4) = :0 AND SUBSTR (CD_VALUE ,6,1)= :1`;
    let binds = [`${Plant}`, `${ProcessLine}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPrDateShift = async () => {
  try {
    const sql = `SELECT to_char(TO_DATE(SUBSTR(F_TATADATE,2,11)||TO_CHAR(SYSDATE,' HH24:MI:SS'),'DD-MON-YYYY HH24:MI:SS'),'DD-Mon-YYYY') PRD_DATE,SUBSTR(F_TATADATE,1,1) FROM DUAL`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAdjBatch = async (
  Plant: any,
  BatchID: any,
  Thick: any,
  Width: any,
  Lengths: any
) => {
  try {
    const sql = `SELECT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO,LOM_ID_FIRST_PAR,LOM_MS_PIECE_ACTL, LOM_MS_GROSS_CAL,LOM_SEC1,LOM_SEC2,LOM_LENGTH,LOM_CD_STATUS FROM V_LDP_PRODN  where LOM_ID_BATCH<> :Batch_id And LOM_CD_EPA = :Plant AND LOM_CD_STATUS NOT LIKE '%L' AND LOM_CD_STATUS NOT LIKE 'W%' AND LOM_CD_STATUS NOT LIKE 'KB' AND LOM_ID_FIRST_PAR IN ( SELECT LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE  LOM_ID_BATCH= :Batch_id AND LOM_CD_EPA = :Plant) AND LOM_MS_GROSS_CAL>0 ORDER BY LOM_MS_GROSS_CAL`;
    let binds = {
      Plant: Plant,
      BatchID: BatchID,
      Thick: Thick,
      Width: Width,
      Lengths: Lengths,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetLblInfo = async (Plant: any, Batch: any) => {
  try {
    const sql = `select LOM_ID_FIRST_PAR,LOM_NO_CAST,LOM_MS_GROSS_CAL,LOM_MS_GROSS_ACTL,LOM_SEC1,LOM_SEC2,nvl(LOM_LENGTH,0) LOM_LENGTH,LOM_NO_PIECES,LOM_CD_QLTY_ACTL,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_TDC_ACTL,LOM_ID_FIRST_PAR,(USER||'::'||(LOM_PRINT_LARGE_CNT+1)||'::'||to_char(sysdate,'DD-MON-YYYY HH24:MI:SS') ) LS_REM3 from v_LDP_PRODN  where LOM_cd_epa = :0 and LOM_id_batch = :1`;
    let binds = [`${Plant}`, `${Batch}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPdiDtl = async (
  Plant: any,
  Batch: any,
  Process: any,
  ProdDate: any,
  MBatch: any,
  BusUnit: any,
  Odia: any,
  status: any
) => {
  try {
    let countVal: any;
    let mill: any;
    return new Promise(async function (resolve, reject) {
      let bindsCount = {
        plant: Plant,
        process: Process,
        odia: Odia,
        mbatch: MBatch,
      };
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      let bindsMill = {
        plant: Plant,
        process: Process,
        MBatch: MBatch,
      };

      let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant
            AND PLM_CD_PROCESS = :process AND
            PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST
                WHERE EWI_CD_ePA= PLM_CD_EPA
                AND EWI_ID_BATCH = :MBatch
                AND EWI_CD_STATUS ='CN' and ROWNUM=1)
             AND PLM_ACTIVE_STATUS ='A'`;

      let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

      mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : Process;
      try {
        let binds = {
          plant: Plant,
          process: Process,
          p_prodn_dt: ProdDate,
          Odia: Odia,
          mbatch: MBatch,
          Batch_id: MBatch,
          status: status,
          count: countVal,
          mill: mill,
        };

        // let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT LOM_cd_prod FROM v_LDP_PRODN WHERE LOM_id_batch IN ( SELECT DISTINCT LOM_id_first_par FROM v_LDP_PRODN WHERE LOM_id_batch = :batch_id AND LOM_cd_epa = :plant ) AND LOM_cd_epa = b.LOM_cd_epa ) rm_prod, ( SELECT iql_grade_desc FROM v_quality WHERE iql_cd_qlty = ewi_cd_qlty ) grd_desc, ( SELECT DISTINCT nvl(ivls_perc, '0') FROM v_ymt_epa_sco_dtls WHERE werks = :plant AND delete_flag = 'Y' AND sco_no = ewi_no_sco_order AND sco_item_no = lpad(ewi_no_sco_item, 6, '0') ) inv_loss, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`;
        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, NVL (ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2 odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, ROUND ((NVL (ewi_ms_piece_actl, 0) * (NVL (inv_loss, 0) / 100)), 3 ) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch batch_id, (SELECT f_spcb004_getbundleid (:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :COUNT ) FROM DUAL) bundle_id, rm_mat, (SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1) rm_mat_desc, sfg_mat, (SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1) sfg_mat_desc, fg_mat, (SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1) fg_mat_desc FROM (SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, NVL (ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, SUBSTR (ewi_planned_proc, INSTR (ewi_planned_proc, ewi_cd_process) + 1, 1 ) next_proc_OLD, (SELECT F_GET_NEXTPROC(ewi_planned_proc , B.LOM_passed_proc,ewi_cd_process) FROM DUAL)   next_proc   , ewi_idia idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, (SELECT DISTINCT LOM_cd_prod FROM v_LDP_PRODN WHERE LOM_id_batch IN ( SELECT DISTINCT LOM_id_first_par FROM v_LDP_PRODN WHERE LOM_id_batch = :batch_id AND LOM_cd_epa = :plant) AND LOM_cd_epa = b.LOM_cd_epa) rm_prod, (SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr) grd_desc, (SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr) spec, ewi_no_matnr rm_mat, ewi_sfg_matnr sfg_mat, ewi_fg_matnr fg_mat, 0 inv_loss FROM v_work_inst a, v_LDP_PRODN b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL (:odia, a.ewi_sec2) AND (    b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN (SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320') ))`;

        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        reject("Error!!");
        throw new Error.InternalServerErrorMsg(error);
      }
    });
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPdiDtlSingleLot = async (
  Plant: any,
  Batch: any,
  Process: any,
  ProdDate: any,
  MBatch: any,
  BusUnit: any,
  Odia: any,
  status: any,
  ele: any
) => {
  try {
    let countVal: any;
    let mill: any;
    return new Promise(async function (resolve, reject) {
      let bindsCount = {
        plant: Plant,
        process: Process,
        odia: Odia,
        mbatch: MBatch,
      };
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      let bindsMill = {
        plant: Plant,
        process: Process,
        MBatch: MBatch,
      };

      let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant AND PLM_CD_PROCESS = :process AND PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST WHERE EWI_CD_ePA= PLM_CD_EPA AND EWI_ID_BATCH = :MBatch AND EWI_CD_STATUS ='CN' and ROWNUM=1) AND PLM_ACTIVE_STATUS ='A'`;
      let getMillCode = await query.executeQuery(qryMillCode, bindsMill);
      mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : Process;
      try {
        let binds = {
          plant: Plant,
          process: Process,
          p_prodn_dt: ProdDate,
          Odia: Odia,
          mbatch: MBatch,
          Batch_id: MBatch,
          status: status,
          count: countVal,
          mill: mill,
          orderno: ele.CUST_ORD,
          orderitem: ele.CUST_ITEM,
          workinstno: ele.EWI_ID_WRK_INST,
        };

        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT LOM_cd_prod FROM v_LDP_PRODN WHERE LOM_id_batch IN ( SELECT DISTINCT LOM_id_first_par FROM v_LDP_PRODN WHERE LOM_id_batch = :batch_id AND LOM_cd_epa = :plant ) AND LOM_cd_epa = b.LOM_cd_epa ) rm_prod, ( SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) grd_desc, ( SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) spec, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat, 0 inv_loss FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_id_order_cus = :orderno AND a.ewi_id_ord_item_cus = :orderitem AND a.ewi_id_wrk_inst = :workinstno AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`;
        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        reject("Error!!");
        throw new Error.InternalServerErrorMsg(error);
      }
    });
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPdiDtlMultiLot = async (
  Plant: any,
  Batch: any,
  Process: any,
  ProdDate: any,
  MBatch: any,
  BusUnit: any,
  Odia: any,
  status: any,
  ele: any
) => {
  try {
    let countVal: any;
    let mill: any;
    return new Promise(async function (resolve, reject) {
      let bindsCount = {
        plant: Plant,
        process: Process,
        odia: Odia,
        mbatch: MBatch,
      };
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      let bindsMill = {
        plant: Plant,
        process: Process,
        MBatch: MBatch,
      };

      let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant AND PLM_CD_PROCESS = :process AND PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST WHERE EWI_CD_ePA= PLM_CD_EPA AND EWI_ID_BATCH = :MBatch AND EWI_CD_STATUS ='CN' and ROWNUM=1) AND PLM_ACTIVE_STATUS ='A'`;
      let getMillCode = await query.executeQuery(qryMillCode, bindsMill);
      mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : Process;
      try {
        let binds = {
          plant: Plant,
          process: Process,
          p_prodn_dt: ProdDate,
          Odia: Odia,
          mbatch: MBatch,
          Batch_id: MBatch,
          status: status,
          count: countVal,
          mill: mill,
          orderno: ele.CUST_ORD,
          orderitem: ele.CUST_ITEM,
          workinstno: null,
        };

        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT LOM_cd_prod FROM v_LDP_PRODN WHERE LOM_id_batch IN ( SELECT DISTINCT LOM_id_first_par FROM v_LDP_PRODN WHERE LOM_id_batch = :batch_id AND LOM_cd_epa = :plant ) AND LOM_cd_epa = b.LOM_cd_epa ) rm_prod, ( SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) grd_desc, ( SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) spec, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat, 0 inv_loss FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_id_order_cus = :orderno AND a.ewi_id_ord_item_cus = :orderitem AND a.ewi_id_wrk_inst = NVL(:workinstno,ewi_id_wrk_inst) AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`;
        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        reject("Error!!");
        throw new Error.InternalServerErrorMsg(error);
      }
    });
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchDspl = async (
  Plant: any,
  Batch_id: any,
  MBatch_id: any,
  Process: any
) => {
  try {
    // Return dtResult
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetWtAdjust = async (Plant: any, DBatch: any) => {
  try {
    const sql = `SELECT * FROM ( SELECT LOM_ID_BATCH,LOM_id_first_par,LOM_id_par_coil_no,LOM_CD_STATUS,LOM_MS_GROSS_CAL NET_WT,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS ,LOM_ID_ORDER,LOM_NO_ITEM ,LOM_CD_PROD,LOM_CD_QLTY_ACTL,LOM_TDC_ACTL,LOM_MS_GROSS_ACTL GRS_WT,LOM_SEC1,LOM_SEC2,LOM_LENGTH,LOM_CD_PREV_PROC,LOM_CD_CURR_PROC,LOM_CD_NEXT_PROC ,LOM_IDIA,LOM_ODIA,1 SEQ1, 'COIL' CATEGORY , ' ' RSN_CD, LOM_TS_CREATION PROD_DT,LOM_NO_MATNR FROM V_LDP_PRODN WHERE LOM_CD_EPA= :Plant AND LOM_ID_BATCH = LOM_ID_FIRST_PAR AND LOM_ID_FIRST_PAR in (SELECT distinct LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_ID_BATCH = :BatchID AND LOM_CD_EPA= :Plant) UNION SELECT LOM_ID_BATCH,LOM_id_first_par,LOM_id_par_coil_no,LOM_CD_STATUS,LOM_MS_GROSS_CAL NET_WT,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS ,LOM_ID_ORDER,LOM_NO_ITEM ,LOM_CD_PROD,LOM_CD_QLTY_ACTL,LOM_TDC_ACTL,LOM_MS_GROSS_ACTL GRS_WT,LOM_SEC1,LOM_SEC2,LOM_LENGTH,LOM_CD_PREV_PROC,LOM_CD_CURR_PROC,LOM_CD_NEXT_PROC ,LOM_IDIA,LOM_ODIA,2 SEQ1, 'FG' CATEGORY, ' ' RSN_CD, LOM_TS_CREATION PROD_DT,LOM_NO_MATNR FROM V_LDP_PRODN WHERE LOM_CD_EPA= :Plant and LOM_CD_CURR_PROC in ('K','W') and LOM_id_first_par in (SELECT distinct LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_ID_BATCH = :BatchID AND LOM_CD_EPA= :Plant) UNION SELECT LOM_ID_BATCH,LOM_id_first_par,LOM_id_par_coil_no,'SC' LOM_CD_STATUS,EBS_MS_SCRAP NET_WT,' ' LOM_ID_ORDER_CUS,0 LOM_ID_ORD_ITEM_CUS ,' ' LOM_ID_ORDER,0 LOM_NO_ITEM,'' LOM_CD_PROD,'' LOM_CD_QLTY_ACTL,'' LOM_TDC_ACTL,0 GRS_WT,0 LOM_SEC1,0 LOM_SEC2,0 LOM_LENGTH,'' LOM_CD_PREV_PROC ,'' LOM_CD_CURR_PROC,'' LOM_CD_NEXT_PROC ,0 LOM_IDIA,0 LOM_ODIA ,3 SEQ1,'SCRAP' CATEGORY,EBS_CD_RSN_SCRAP RSN_CD,EBS_DT_SCRAP PROD_DT,LOM_NO_MATNR FROM V_EPA_BATCH_SCRAP A, V_LDP_PRODN B WHERE A.EBS_CD_EPA = B.LOM_CD_ePA AND A.EBS_ID_BATCH = B.LOM_ID_BATCH AND A.EBS_CD_EPA= :Plant AND EBS_IND='A' AND B.LOM_ID_FIRST_PAR  IN (SELECT MOTHER_CHARG FROM V_YEPA_FG_STOCK WHERE WERKS=A.EBS_CD_ePA AND SC_ORDER_NO='SC88888888' AND ACTION_CD='I' ) AND B.LOM_ID_FIRST_PAR in (SELECT distinct LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_ID_BATCH = :BatchID AND LOM_CD_EPA= :Plant) ) ORDER BY SEQ1`;
    let binds = {
      Plant: Plant,
      DBatch: DBatch,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const OrderCheck = async (Plant: any, OrderID: any, OrdItem: any) => {
  try {
    const sql = `SELECT COUNT(1) FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA= :0 And ENC_ID_ORDER = :1 and ENC_NO_ITEM= :2  AND ENC_ST_ORDER = 'A'`;
    let binds = [`${Plant}`, `${OrderID}`, `${OrdItem}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPlantPdf = async (Plant: any) => {
  try {
    const sql = `select COUNT(1) from v_codes where cd_type = 'EPA433' AND CD_VALUE = :0 `;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CntProcPlant = async (Plant: any) => {
  try {
    const sql = `select COUNT(1) from v_codes where cd_type = 'EPA430' AND CD_VALUE = :0 `;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const Reverse_Grn = async (Plant: any, dt: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetVal = async (Plant: any, BatchID: any, PceActl: any) => {
  try {
    const sql = `select nvl(( :0 - LOM_ms_gross_cal),0) from v_LDP_PRODN where LOM_id_batch= :1 and LOM_cd_epa  = :2 `;
    let binds = [`${PceActl}`, `${BatchID}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMResWT = async (Plant: any, BatchID: any) => {
  try {
    const sql = `select LOM_ms_gross_cal from v_LDP_PRODN where LOM_id_batch= :0 and LOM_cd_epa = :1 `;
    let binds = [`${BatchID}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrapPlant = async (Plant: any) => {
  try {
    const sql = `select COUNT(1) from v_codes where cd_type = 'EPA242' AND CD_VALUE = :0`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const Batch_Chk = async (
  Plant: any,
  IDBatch: any,
  ProdDate: any,
  ProcLine: any,
  IDPDI: any,
  QltyCD: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ModifyBatch = async (Plant: any, dt: any, resWT: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchID = async (
  Plant: any,
  ProcLine: any,
  RowIndex: any,
  ProdDate: any,
  MBatch: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ChkBatchID = async (Plant: any, NewBatch: any) => {
  try {
    const sql = `SELECT COUNT(1) FROM V_LDP_PRODN WHERE LOM_ID_BATCH = :0 and LOM_CD_EPA = :1`;
    let binds = [`${NewBatch}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDtls = async (Plant: any, OrdId: any, OrdItem: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetQltyGrade = async (Plant: any, OrdId: any, OrdItem: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CheckBatchAvailibility = async (Plant: any, BatchID: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const WithoutRecordingBypass = async (Plant: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const PlanNM = async (Plant: any) => {
  try {
    const sql = `select CD_DESC from v_codes where cd_type = 'EPA50' AND CD_VALUE = :0 `;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetProcLine = async (Plant: any) => {
  try {
    const sql = `SELECT MAX(LTRIM(RTRIM(EPL_EPA_DESC)))EPL_EPA_DESC, MAX(RTRIM(LTRIM(EPL_ADDRESS)))EPL_ADDRESS,MAX(RTRIM(LTRIM(EPL_REM1)))EPL_REM1, MAX(RTRIM(LTRIM(EPL_REM2)))||'   '||MAX(RTRIM(LTRIM(EPL_REM3)))EPL_REM2,EPL_CD_EPA,EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA = :0 GROUP BY EPL_CD_EPA,EPL_CD_COMP`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCustNm = async (CustCD: any) => {
  try {
    const sql = `SELECT DISTINCT NAME1 END_CUST_NAME FROM   V_T001W WHERE  WERKS  = :0`;
    let binds = [`${CustCD}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSecRsns = async (Plant: any, RsnCat: any) => {
  try {
    const sql = `SELECT ESR_RSN_CD, ESR_RSN_DESC FROM V_SCRP_SEC_RSN WHERE  ESR_CD_EPA = :0 AND ESR_RSN_CAT IN (SELECT DISTINCT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'EPA231' AND UPPER(CD_VALUE) = UPPER( :1 )) AND ESR_RSN_TYPE IN ('A','AB') AND ESR_STATUS='A' ORDER BY 2, 1`;
    let binds = [`${Plant}`, `${RsnCat}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrRsnCD = async (Plant: any, RsnCat: any) => {
  try {
    const sql = `SELECT ESR_RSN_CD, ESR_RSN_DESC FROM V_SCRP_SEC_RSN WHERE ESR_CD_EPA  = :0 AND ESR_RSN_CAT IN (SELECT DISTINCT CD_VALUE FROM V_CODES WHERE  CD_TYPE = 'EPA231' AND UPPER(CD_DESC) = UPPER(:1)) AND ESR_RSN_TYPE IN ('A','AB') AND  ESR_STATUS='A' ORDER  BY 2, 1`;
    let binds = [`${Plant}`, `${RsnCat}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSlitSts = async (Plant: any) => {
  try {
    const sql = `SELECT CD_VALUE FROM V_CODES WHERE  CD_TYPE = 'EPA212' ORDER  BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetRsnCat = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT CD_DESC,CD_VALUE FROM V_CODES, V_SCRP_SEC_RSN WHERE CD_TYPE = 'EPA231' AND  CD_VALUE = ESR_RSN_CAT AND  ESR_CD_EPA = :0`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetHoldRsn = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT CD_HOLD, CD_DESC, CD_HOLD1, CD_DESC1 FROM V_EPA_HOLD_RSN WHERE CD_COMP = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA = :0) ORDER  BY CD_HOLD`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrRsnCat = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT CD_DESC FROM V_CODES, V_SCRP_SEC_RSN WHERE  CD_TYPE = 'EPA231' AND CD_VALUE = ESR_RSN_CAT AND ESR_CD_EPA = :0`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrMat = async (Plant: any) => {
  try {
    const sql = `SELECT SUBSTR(CD_DESC,1,18)MATERIAL_NO,SUBSTR(CD_DESC,22)MATERIAL_DESC FROM V_CODES WHERE CD_TYPE='EPA196' AND CD_VALUE= :0`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const InvPerc = async (Plant: any, ScoNo: any, ScoItm: any) => {
  try {
    const sql = `SELECT NVL(IVLS_PERC,0) IVLS_PERC,NVL(IVLS_WT_FINAL,0) IVLS_WT_FINAL FROM V_YMT_EPA_SCO_DTLS WHERE WERKS = :0 AND SCO_NO = :1 AND SCO_ITEM_NO = LPAD(:2,6,'0')`;
    let binds = [`${Plant}`, `${ScoNo}`, `${ScoItm}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const OrderRnage = async (
  Plant: any,
  MBatch: any,
  Cust_Ord: any,
  Cust_Itm: any,
  Thick: any,
  Width: any,
  BatchID: any,
  Process: any,
  ln_odia_chk: any,
  MS_PIECE_ACTL: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CheckRange = async (
  Plant: any,
  MBatch: any,
  Cust_Ord: any,
  Cust_Itm: any,
  Sco_Ord: any,
  Sco_Itm: any,
  NxtProc: any,
  ACT_THICK: any,
  ACT_WIDTH: any,
  Width: any,
  batchID: any,
  FL_HOLD: any,
  NetWT: any,
  Idia: any,
  Prod_DT: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const Grade = async (
  Plant: any,
  QLTY_ACTL: any,
  mk_spec: any,
  CD_COMP: any,
  GRADE_DESC: any,
  MARK_CUST: any,
  LS_TDC: any,
  SEC1: any,
  SEC2: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const P_Insert = async (Plant: any, dt: any, ScrQty: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const P_Insert_Wires = async (
  Plant: any,
  dt: any,
  ScrQty: any,
  TotalQty: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMCoilList = async (
  Plant: any,
  Process: any,
  workCenter: any,
  radio: any
) => {
  try {
    if (radio == "U") {
      const sql = `SELECT DISTINCT
            ewi_id_batch   AS batch,
            TO_CHAR(MAX(ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS') ewi_ts_creation
        FROM
            v_work_inst
        WHERE
            ewi_cd_process = :process
            AND ewi_cd_epa = :plant
            AND ewi_cd_status = 'CN'
            AND SUBSTR(ewi_id_batch, 1, 2) = 'MR'
            AND EXISTS (
                SELECT
                    LOM_id_batch
                FROM
                    v_LDP_PRODN
                WHERE
                    LOM_cd_epa = ewi_cd_epa
                    AND LOM_id_batch = ewi_id_batch
                    AND LOM_cd_status LIKE '%C'
            )
            AND ewi_wrk_center_no = nvl(:WorkCenter, ewi_wrk_center_no)
        GROUP BY
            ewi_id_batch`;

      let binds = {
        process: Process,
        plant: Plant,
        WorkCenter: workCenter ? workCenter : "",
      };

      return await query.executeQuery(sql, binds);
    } else {
      // const sql = `SELECT DISTINCT EWI_ID_BATCH AS BATCH , to_char(max(ewi_ts_creation),'DD-Mon-YYYY HH24:MI:SS') EWI_TS_CREATION FROM V_WORK_INST WHERE EWI_CD_PROCESS=:0 AND EWI_CD_EPA=:1 AND EWI_CD_STATUS='CN' and  eXISTS ( select LOM_ID_Batch from V_LDP_PRODN where LOM_cd_epa=eWI_cd_epa AND LOM_ID_BATCH=EWI_ID_BATCH and LOM_cd_status LIKE '%C') group by ewi_id_batch `;
      const sql = `SELECT DISTINCT ewi_id_batch AS batch, TO_CHAR (MAX (ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS' ) ewi_ts_creation FROM v_work_inst WHERE ewi_cd_process = :0 AND ewi_cd_epa = :1 AND ewi_cd_status = 'CN' AND EXISTS ( SELECT LOM_id_batch FROM v_LDP_PRODN WHERE LOM_cd_epa = ewi_cd_epa AND LOM_id_batch = ewi_id_batch AND LOM_cd_status LIKE '%C') AND EWI_WRK_CENTER_NO = NVL(:2,EWI_WRK_CENTER_NO) GROUP BY ewi_id_batch`;
      let binds = [`${Process}`, `${Plant}`, `${workCenter}`];
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getWorkCenter = async (req: any) => {
  const { Plant, Process } = req.body;
  try {
    const sql = `SELECT PLM_WCNT_CODE||' , '||PLM_WCNT_DESC FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA=:plant AND PLM_CD_PROCESS = :process AND PLM_ACTIVE_STATUS='A' ORDER BY 1`;
    let binds = {
      plant: Plant,
      process: Process,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getShiftStatus = async (req: any) => {
  const {} = req.body;
  try {
    const sql = `select substr(F_Tatadate(sysdate),1,1) shift,substr(F_Tatadate(sysdate),2) prod_dt from dual`;
    let binds = {};

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrapWiresDtl = async (
  Plant: any,
  MBatch: any,
  Process: any,
  ProdDate: any,
  SumQty: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const DelWorkInst = async (Plant: any, dt: any, ScrQty: any) => {
  try {
    let mbatch = dt.MCoil;
    const sql = `UPDATE V_WORK_INST SET EWI_CD_STATUS ='RJ' WHERE EWI_CD_EPA= :0 and ewi_cd_status in ('WC','CN') AND EWI_ID_batch = :1`;
    let binds = [`${Plant}`, `${mbatch}`];
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
    const sql = `INSERT INTO V_LABEL_INFO(TLC_TIMESTAMP,TLC_CD_EPA,TLC_ID_BATCH,TLC_LABEL_TYPE,TLC_CD_STATUS,TLC_LABEL_CRT_ON,TLC_LABLE_CRT_BY,TLC_PRINT_ON,TLC_PRINT_BY,TLC_CD_COMP)   VALUES (f_nannow_second_telgrm(SYSDATE), :Plant, :BatchID,'WIP', :Sts,SYSDATE, :UserID ,NULL,NULL,'1000')`;
    let binds = {
      Plant: Plant,
      BatchID: BatchID,
      Sts: Sts,
      UserID: UserID,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const InsertScr = async (
  Plant: any,
  Process: any,
  DT: any,
  UsrID: any
) => {
  try {
    const sql = `Select epl_no_proc_seq From v_epa_proc_line Where epl_cd_epa = :0 And epl_cd_process = :1`;
    let binds = [`${Plant}`, `${Process}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CallProcedureSCRAPPOST = async (dtParameter: any) => {
  try {
    const sql = ``;
    let binds = [`${"Plant"}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const SendMailProc = async (batch: any, epa_cd: any) => {
  try {
    const sql = ``;
    let binds = [`${"Plant"}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const UpdateMailTag = async (Tag: any, Epa_cd: any, batch: any) => {
  try {
    const sql = `Update V_SPC_SCRAP_PLAN set ESB_MAIL_TO_TAG=:Tag  where ESB_CD_EPA=:Epa_Cd and ESB_ID_BATCH=:batch AND ESB_DEL_TAG='N'`;
    let binds = {
      Tag: Tag,
      Epa_cd: Epa_cd,
      batch: batch,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMotherCoil = async (Batch: any, Plant: any) => {
  try {
    const sql = `Select LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_CD_EPA= :0 and LOM_ID_BATCH = :1`;
    let binds = [`${Plant}`, `${Batch}`];
    let dt = await query.executeQuery(sql, binds);
    let MotherCoil = dt.LOM_ID_FIRST_PAR;
    return MotherCoil;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetDaughterCoil = async (Plant: any) => {
  try {
    const sql = `SELECT 
        DISTINCT LOM_id_batch, 
        LOM_ts_creation 
      FROM 
        v_LDP_PRODN a 
      WHERE 
        a.LOM_id_batch = NVL (:dbatch, LOM_id_batch) 
        AND a.LOM_id_par_coil_no = NVL (:mbatch, LOM_id_par_coil_no) 
        AND a.LOM_cd_epa = :Plant
        AND LOM_cd_status NOT LIKE 'W%' 
        AND (
          A.LOM_CD_STATUS LIKE '%B' 
          OR A.LOM_CD_STATUS LIKE '%C'
        ) 
        AND LOM_cd_status NOT IN ('VF', 'VM', 'VB') 
        AND a.LOM_cd_qlty_actl <> 'SCRP' 
        AND LOM_id_batch <> LOM_id_first_par 
      ORDER BY 
        1`;
    let binds = {
      Plant: Plant,
      dbatch: null,
      mbatch: null,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const FetchParCoil = async (M_coil: any) => {
  try {
    const sql = `Select LOM_ID_PAR_COIL_NO from V_LDP_PRODN where LOM_ID_FIRST_PAR= :0`;
    let binds = [`${M_coil}`];
    let dt = await query.executeQuery(sql, binds);
    let StrParCoil = dt.LOM_ID_PAR_COIL_NO;
    return StrParCoil;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchIds = async (M_coil: any, epa_cd: any) => {
  try {
    const sql = `Select LOM_ID_BATCH from V_LDP_PRODN where LOM_ID_FIRST_PAR=:0 and LOM_CD_EPA=:1`;
    let binds = [`${M_coil}`, `${epa_cd}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMat_type = async (ProdCd: any) => {
  try {
    const sql = `Select PCD_DESC1 from v_PCODE_DTL where pcd_type='MPCODE' and Pcd_value=:0`;
    let binds = [`${ProdCd}`];
    let dtMat = await query.executeQuery(sql, binds);
    let Mat_type = dtMat.PCD_DESC1;
    return Mat_type;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSelectedRsnCat = async (desc: any) => {
  try {
    const sql = `Select CD_VALUE FROM V_CODES WHERE CD_DESC=:cdDesc and cd_type='EPA432'`;
    let binds = [`${desc}`];
    let dtMat = await query.executeQuery(sql, binds);
    let Mat_type = dtMat.CD_VALUE;
    return Mat_type;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const PopMsgData = async (batch: any, epa_cd: any) => {
  try {
    const sql = ``;
    let binds = [`${"Plant"}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ReqIdGeneration = async () => {
  try {
    const sql = ``;
    let binds = [`${"Plant"}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const SetWtAdj = async (
  Plant: any,
  dt: any,
  MBatch: any,
  ResWT: any,
  PROC: any,
  ST_DATE: any,
  RG_IUS: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ChkLoc = async (Plant: any) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const P_INSERT_LP = async (
  Plant: any,
  Batch_id: any,
  dt: any,
  ScrQty: any,
  schd_wt: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMatDtlsLP = async (OrderNo: any, OrderItem: any) => {
  try {
    const sql = ` SELECT SOI_END_PROD_DESC MatDesc FROM V_SCO_ORDER_ITEM WHERE SOI_ID_ORDER= :0 AND SOI_NO_ITEM = :1`;
    let binds = [`${OrderNo}`, `${OrderItem}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBundleId = async (
  Plant: any,
  ProcLine: any,
  RowIndex: any,
  ProdDate: any,
  MBatch: any
) => {
  try {
    const sql = ``;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetQtyForLP = async (Plant: any, OrdNo: any, OrdItm: any) => {
  try {
    const sql = ` select a.MENGE fg_qty,b.BDMNG rm_qty ,ROUND((a.MENGE /b.BDMNG),4) sco_fraction from v_mdsb b , v_ekpo a where a.mandt='600' and a.mandt=b.mandt and a.ebeln = b.ebeln and a.EBELP =b.ebelp and b.ebeln=:OrderNo and b.ebelp=LPAD(:OrderItem,5,0) and b.shkzg='H' and b.werks=:Plant`;
    let binds = {
      Plant: Plant,
      OrdNo: OrdNo,
      OrdItm: OrdItm,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchDtlforLP_mother = async (Plant: any, MBatch: any) => {
  try {
    //const sql = `SELECT LOM_CD_PROD, LOM_CD_QLTY_ACTL, LOM_SEC1, LOM_SEC2, LOM_LENGTH, LOM_TDC_ACTL, LOM_MS_PIECE_ACTL, LOM_CD_STATUS, NVL(LOM_MS_GROSS_CAL, 0) LOM_MS_GROSS_CAL, LOM_CD_NEXT_PROC, NVL(LOM_MS_SCRAP, 0) LOM_MS_SCRAP, LOM_MS_PIECE_ACTL - LOM_MS_GROSS_CAL PROC_WT,  LOM_ID_FIRST_PAR,(SELECT ROUND(SUM(nvl(EWI_MS_PIECE_ACTL,0)),3) FROM v_work_inst WHERE ewi_id_batch =LOM_id_batch AND ewi_cd_epa = LOM_cd_epa AND ewi_cd_process =:ProcLine AND ewi_cd_status ='CN' AND ewi_id_order_cus =:OrderNo) Schd_wt FROM V_LDP_PRODN WHERE LOM_CD_EPA= :Plant AND LOM_ID_BATCH =:Batch_id`;
    const sql = `SELECT LOM_ID_BATCH, LOM_CD_PROD, LOM_CD_QLTY_ACTL, LOM_TDC_ACTL, LOM_CD_CURR_PROC, LOM_CD_NEXT_PROC, LOM_CD_PREV_PROC, LOM_CD_STATUS,LOM_FL_HOLD, LOM_FL_REPROC_REQD, LOM_FL_SLEEVE,LOM_LENGTH, LOM_MS_GROSS_ACTL, LOM_MS_PIECE_ACTL,TO_CHAR(cast(LOM_MS_GROSS_CAL as  DECIMAL(8,3))) LOM_MS_GROSS_CAL, LOM_SEC1,LOM_SEC2, LOM_ID_ORDER_CUS, 
        LOM_ID_ORD_ITEM_CUS, LOM_SLIT_STATUS, LOM_CD_SHIFT, LOM_FL_INSP_REQD, LOM_PASSED_PROC, LOM_ID_PAR_COIL_NO,TO_CHAR(cast(LOM_MS_SCRAP as  DECIMAL(8,3))) LOM_MS_SCRAP, LOM_DT_SCRAP, LOM_CD_RSN_SCRAP, LOM_ID_OP_SCRAP, LOM_NO_PIECES, LOM_ID_ORDER, LOM_NO_ITEM, LOM_ID_PAR_COIL_NO, LOM_TS_CREATION, LOM_NO_CAST, LOM_FL_OFF_CUT, LOM_FL_SEND_SAP, LOM_UOM, LOM_ACTIVITY_TIME, LOM_SLIT_SEC, LOM_IDIA, LOM_PALLET_CODE, 
        (SELECT DISTINCT MAKTX    FROM V_MAKT    WHERE MATNR = LOM_NO_MATNR AND MANDT = (SELECT CD_DESC FROM V_CODES    WHERE CD_TYPE = 'EPA205' AND    CD_VALUE = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA = LOM_CD_EPA))) MAT_DESC, 
        LOM_ODIA,(SELECT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_ID_ORDER =LOM_ID_ORDER_CUS And ENC_NO_ITEM = LOM_ID_ORD_ITEM_CUS And ENC_CD_EPA = LOM_CD_EPA) ORD_TYP,(SELECT IQL_GRADE_DESC FROM V_QUALITY WHERE IQL_CD_QLTY=LOM_CD_QLTY_ACTL) GRD_DSC, LOM_TENTATIVE_LENGTH TEN_LEN,''YLD_STR,''PKG_TYP,''PKG_RATE,''PRC1_RATE,''PRC2_RATE,''PRC3_RATE,''SEG_RATE,''OTH_RATE,''TOT_RATE,LOM_FINAL_JAC_GRD,''RSN_CAT,''RSN_CD,''RSN_DESC ,w.*,LOM_OPER_COMMENT OPR_CMNT FROM V_LDP_PRODN d  
        ,(select '' EWI_PLN_RSN_CD, '' EWI_PKG_TYP, '' EWI_PKG_RATE, '' EWI_PRC1_RATE, '' EWI_PRC2_RATE, '' EWI_PRC3_RATE, '' EWI_SEG_RATE, '' EWI_OTH_RATE, '' EWI_TOT_RATE,'' EWI_FINAL_JAC_GRD,'' EWI_CD_PROCESS,'' EWI_CD_STATUS,  
        '' EWI_ID_BATCH, :Plant ewi_cd_epa FROM dual)  w 
        WHERE  d.LOM_ID_BATCH=NVL( :MBatch,LOM_ID_BATCH) And  d.LOM_CD_EPA= :Plant
        `;

    let binds = {
      Plant: Plant,
      MBatch: MBatch,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchDtlforLP_daughter = async (
  Plant: any,
  MBatch: any,
  DBatch: any
) => {
  try {
    const sql = `SELECT
        LOM_cd_epa            plant,
        LOM_id_batch          batchid,
        LOM_sec2              odia,
        LOM_sec1              thk,
        LOM_idia              idia,
        LOM_length            length1,
        LOM_cd_status         cd_status,
        LOM_tdc_actl          grade,
        LOM_id_order_cus      orderno,
        LOM_id_ord_item_cus   orderitem,
        LOM_id_par_coil_no    parent_batch,
        LOM_id_first_par      mother_coil,
        LOM_cd_next_proc      next_proc,
        LOM_no_pieces,
        ewi_no_matnr          rm_material,
        LOM_passed_proc,
        LOM_work_center,
        LOM_no_cast,
        LOM_planned_proc,
        TO_CHAR(LOM_ts_creation, 'DD/MM/YYYY') LOM_ts_creation,
        (
            SELECT
                TO_CHAR(MIN(epr_dt_prodn_tata), 'DD-MON-YYYY')
            FROM
                v_epa_line_prodn
            WHERE
                epr_cd_epa = LOM_cd_epa
                AND epr_id_batch = LOM_id_batch
                AND epr_cd_process = 'M'
        ) tube_prod_dt,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = ewi_no_matnr
        ) rm_material_desc,
        ewi_sfg_matnr         sfg_material,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = ewi_sfg_matnr
        ) sfg_material_desc,
        ewi_fg_matnr          fg_material,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = ewi_fg_matnr
        ) fg_material_desc,
        LOM_ms_gross_cal,
        (
            SELECT
                pph_desc
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = a.LOM_cd_epa
                AND pph_cd_proc_path = a.LOM_planned_proc
                AND ROWNUM = 1
        ) process_path_desc,
        (
            SELECT
                f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus)
            FROM
                dual
        ) cust_nm,
        (
            SELECT
                substr(f_tatadate(epr_dt_prodn_tata), 1, 1) packing_shft
            FROM
                v_epa_line_prodn
            WHERE
                epr_cd_epa = :plant
                AND epr_id_batch = LOM_id_batch
                AND epr_cd_process = LOM_cd_curr_proc
                AND ROWNUM = 1
        ) packing_shft,
        (
            SELECT
                substr(f_tatadate(epr_dt_prodn_tata), 2) prod_dt
            FROM
                v_epa_line_prodn
            WHERE
                epr_cd_epa = :plant
                AND epr_id_batch = LOM_id_batch
                AND epr_cd_process = LOM_cd_curr_proc
                AND ROWNUM = 1
        ) prod_dt,
        (
            SELECT
                epr_rec_crt_by   packed_by
            FROM
                v_epa_line_prodn
            WHERE
                epr_cd_epa = :plant
                AND epr_id_batch = LOM_id_batch
                AND epr_cd_process = LOM_cd_curr_proc
                AND ROWNUM = 1
        ) packed_by,
        (
            SELECT
                enc_mk_spec_complete
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ) specefication,
        (
            SELECT
                epl_proc_line_desc
            FROM
                v_epa_proc_line
            WHERE
                epl_cd_epa = :plant
                AND epl_cd_process = LOM_cd_next_proc
        ) next_proc_desc
    FROM
        v_LDP_PRODN a,
        v_work_inst b
    WHERE
            --a.LOM_id_batch = nvl(:DBatch, 9)
            -- a.LOM_id_par_coil_no = nvl(:MBatch, LOM_id_par_coil_no)
        a.LOM_cd_epa = :plant
        AND a.LOM_cd_epa = b.ewi_cd_epa
        AND a.LOM_id_batch = b.ewi_id_batch
        AND LOM_cd_status NOT LIKE 'W%'
        AND LOM_cd_status NOT LIKE '%L'
        AND ( ( a.LOM_id_batch = nvl(:dbatch, LOM_id_batch)
                AND a.LOM_cd_curr_proc = b.ewi_cd_process
                AND ( a.LOM_cd_status LIKE '%B'
                      OR a.LOM_cd_status LIKE '%C'
                      OR a.LOM_cd_status IN (
            'MQ',
            'KQ'
        ) ) )
              OR ( a.LOM_id_par_coil_no = DECODE(:dbatch, NULL, a.LOM_id_par_coil_no,(
            SELECT
                LOM_id_par_coil_no
            FROM
                v_LDP_PRODN
            WHERE
                LOM_id_batch = :dbatch
        ))
                   AND a.LOM_cd_next_proc = b.ewi_cd_process ) )
        AND LOM_cd_status NOT IN (
            SELECT
                substr(cd_value, 6, 2)
            FROM
                v_codes
            WHERE
                cd_type = 'TB034'
                AND substr(cd_value, 1, 4) = :plant
        )
        AND a.LOM_cd_qlty_actl <> 'SCRP'
        AND LOM_id_batch <> LOM_id_first_par
    ORDER BY
        LOM_id_batch`;

    let binds = {
      Plant: Plant,
      //MBatch: MBatch ? MBatch : '',
      DBatch: DBatch ? DBatch : "",
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

const convertToDate = (str: string) => {
  try {
    var dateTimeArr = str.split(" ");

    var dateArr = dateTimeArr[0].split("/");

    var timeArr = dateTimeArr[1].split(":");

    var newDate = new Date(
      Number(dateArr[2]),
      Number(dateArr[1]) - 1,
      Number(dateArr[0]),
      Number(timeArr[0]),
      Number(timeArr[1])
    );
    return newDate;
  } catch {
    return null;
  }
};
export const getTataDate = async (prodEndDt: any) => {
  try {
    const sql = `select substr(F_Tatadate(TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),1,1) shift,substr(F_Tatadate(TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),2) prod_dt from dual`;
    const binds = {
      prodEndDt: prodEndDt,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getPrevRecorder = async (User: any) => {
  try {
    const sql = `select CD_VALUE FROM V_CODES where CD_TYPE='TB048'`;
    // const binds = {
    //     Userid: User,
    //   };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertCoilDetails = async (
  ele: any,
  Plant: any,
  Batch: any,
  Process: any,
  resWt: any,
  totalNetWt: any,
  ProdDt: any,
  Shift: any,
  user: any,
  uom: any
) => {
  try {
    const sql = `call SPCB004_INSERT (
            PLANT => : PLANT,
            BATCHID => : BATCHID,
            MCOIL => : MCOIL,
            PROC => : PROC,
            CUSTORD => : CUSTORD,
            CUSTITM => : CUSTITM,
            SCO_ORD => : SCO_ORD,
            SCOITM => : SCOITM,
            NXTPROC => : NXTPROC,
            PROD => : PROD,
            QLTY => : QLTY,
            FL_HOLD => : FL_HOLD,
            ACTIVITY_TIME => : ACTIVITY_TIME,
            INV_LOSS => : INV_LOSS,
            SLIT_SEC => : SLIT_SEC,
            SLIT_STATUS => : SLIT_STATUS,
            TEN_LEN => : TEN_LEN,
            THICK => : THICK,
            WIDTH => : WIDTH,
            P_LENGTH => : P_LENGTH,
            PIECE_ACTL => : PIECE_ACTL, 
            GROSS_ACTL => : GROSS_ACTL,
            SCRWT => : SCRWT,
            TDC => : TDC,
            USRID => : USRID,
            RES_WT => : RES_WT,
            SUM_WT => : SUM_WT,
            ID_PDI => : ID_PDI,
            NOPCS => : NOPCS,
            IDIA => : IDIA,
            ODIA => : ODIA,
            PLANRSNCD => : PLANRSNCD,
            IDSCH => : IDSCH,
            JAC_GRD => : JAC_GRD,
            ACT_THICK => : ACT_THICK,
            ACT_WIDTH => : ACT_WIDTH,
            ACT_LENGTH => : ACT_LENGTH,
            CD_YARD => : CD_YARD,
            LOCX => : LOCX,
            LOCY => : LOCY,
            ID_POS => : ID_POS,
            SCR_RSN => : SCR_RSN,
            SHIFT => : SHIFT,
            INSP_REQ => : INSP_REQ,
            MS_SLEEVE => : MS_SLEEVE,
            PLANNED_PROC => : PLANNED_PROC,
            FL_OFFCUT => : FL_OFFCUT,
            OPR_CMNT => : OPR_CMNT,
            UOM => : UOM,
            CD_RSN_HOLD => : CD_RSN_HOLD,
            HOLD_OP_REMARKS => : HOLD_OP_REMARKS,
            BUS_UNIT => : BUS_UNIT,
            ST_PRODN => : ST_PRODN,
            P_PLT_TYP => : P_PLT_TYP,
            P_SURFACE_VAL => : P_SURFACE_VAL,
            P_PROD_STRT_DTTM => :P_PROD_STRT_DTTM,
            P_PROD_END_DTTM => :P_PROD_END_DTTM,
            P_WORK_CENTER => :P_WORK_CENTER,
            P_FG_MATNR => :P_FG_MATNR,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_SCRP_MATNR => :P_SCRP_MATNR,
            P_ROLLING_LENGTH => :P_ROLLING_LENGTH,
            LS_OUT_FLAG => : LS_OUT_FLAG
            )`;

    const binds = {
      PLANT: Plant,
      BATCHID: ele.BATCH_ID,
      MCOIL: Batch,
      PROC: Process,
      CUSTORD: ele.EWI_ID_ORDER_CUS,
      CUSTITM: ele.EWI_ID_ORD_ITEM_CUS,
      SCO_ORD: ele.EWI_ID_ORDER_CUS,
      SCOITM: ele.EWI_ID_ORD_ITEM_CUS,
      NXTPROC: ele.NEXT_PROC,
      PROD: ele.EWI_CD_PROD,
      QLTY: ele.EWI_CD_QLTY,
      FL_HOLD: ele.ddlRsnHold,
      ACTIVITY_TIME: ele.prdTimeDiff, // Prod end Dt time - prod start dt time (converted into hours)
      INV_LOSS: 0,
      SLIT_SEC: "",
      SLIT_STATUS: "",
      TEN_LEN: null,
      THICK: ele.EWI_SEC1,
      WIDTH: ele.EWI_SEC2,
      P_LENGTH: ele.EWI_LENGTH,
      PIECE_ACTL: ele.EWI_MS_PIECE_ACTL, //net wt
      GROSS_ACTL: ele.EWI_MS_PIECE_ACTL, //gross wt -- equal to net wt for now. logic will change later
      SCRWT: 0,
      TDC: ele.EWI_NO_TDC ?? null, //Grade
      USRID: user,
      RES_WT: resWt, //grid 1 schdl wt- total net wt
      SUM_WT: totalNetWt, //total net wt.
      ID_PDI: ele.EWI_ID_WRK_INST,
      NOPCS: ele.EWI_NO_PIECES, //no of pieces
      IDIA: ele.IDIA,
      ODIA: ele.ODIA,
      PLANRSNCD: null,
      IDSCH: ele.EWI_ID_SCHEDULE,
      JAC_GRD: null,
      ACT_THICK: ele.EWI_SEC1,
      ACT_WIDTH: ele.EWI_SEC2,
      ACT_LENGTH: ele.EWI_LENGTH,
      CD_YARD: null,
      LOCX: null,
      LOCY: null,
      ID_POS: null,
      SCR_RSN: null,
      SHIFT: Shift,
      INSP_REQ: null,
      MS_SLEEVE: null,
      PLANNED_PROC: ele.EWI_PLANNED_PROC, //from grid 1
      FL_OFFCUT: null,
      OPR_CMNT: null,
      UOM: uom,
      CD_RSN_HOLD: ele.CD_HOLD,
      HOLD_OP_REMARKS: ele.HOLD_OP_REMARKS, //operator remarks
      BUS_UNIT: "TUBES",
      ST_PRODN: ProdDt,
      P_PLT_TYP: null,
      P_SURFACE_VAL: null,
      P_PROD_STRT_DTTM: ele.prdPStartDt, //prod dt Start time
      P_PROD_END_DTTM: ele.prdPEndDt, //prodt dt time
      P_WORK_CENTER: ele.ddlWorkCenter,
      P_FG_MATNR: ele.FG_MAT,
      P_SFG_MATNR: ele.SFG_MAT,
      P_SCRP_MATNR: ele.P_SCRP_MATNR ?? null,
      P_ROLLING_LENGTH: ele.rollingLength ?? null, //P_ROLLING_LENGTH
      LS_OUT_FLAG: {
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

export const delete_tempprod = async (Plant: any, Batch: any, user: any) => {
  try {
    const sql = `DELETE FROM V_PRODUCTION_TEMP
        WHERE  TPT_USER_ID = :P_USER
        AND  TPT_CD_EPA = :P_PLANT
        AND  TPT_ID_FIRST_PAR = :P_BATCH`;

    let delBind = {
      P_USER: user,
      P_PLANT: Plant,
      P_BATCH: Batch,
    };
    return await query.executeQuery(sql, delBind);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const SPCB004_TEMP_Insert = async (
  ele: any,
  Plant: any,
  Batch: any,
  Process: any,
  resWt: any,
  totalNetWt: any,
  ProdDt: any,
  Shift: any,
  user: any,
  uom: any,
  batchType: any
) => {
  try {
    const sql = `call SPCB004_TEMP_Insert (
            PLANT => : PLANT,
            BATCHID => : BATCHID,
            MCOIL => : MCOIL,
            PROC => : PROC,
            CUSTORD => : CUSTORD,
            CUSTITM => : CUSTITM,
            SCO_ORD => : SCO_ORD,
            SCOITM => : SCOITM,
            NXTPROC => : NXTPROC,
            PROD => : PROD,
            QLTY => : QLTY,
            FL_HOLD => : FL_HOLD,
            ACTIVITY_TIME => : ACTIVITY_TIME,
            INV_LOSS => : INV_LOSS,
            SLIT_SEC => : SLIT_SEC,
            SLIT_STATUS => : SLIT_STATUS,
            TEN_LEN => : TEN_LEN,
            THICK => : THICK,
            WIDTH => : WIDTH,
            P_LENGTH => : P_LENGTH,
            PIECE_ACTL => : PIECE_ACTL, 
            GROSS_ACTL => : GROSS_ACTL,
            SCRWT => : SCRWT,
            TDC => : TDC,
            USRID => : USRID,
            RES_WT => : RES_WT,
            SUM_WT => : SUM_WT,
            ID_PDI => : ID_PDI,
            NOPCS => : NOPCS,
            IDIA => : IDIA,
            ODIA => : ODIA,
            PLANRSNCD => : PLANRSNCD,
            IDSCH => : IDSCH,
            JAC_GRD => : JAC_GRD,
            ACT_THICK => : ACT_THICK,
            ACT_WIDTH => : ACT_WIDTH,
            ACT_LENGTH => : ACT_LENGTH,
            CD_YARD => : CD_YARD,
            LOCX => : LOCX,
            LOCY => : LOCY,
            ID_POS => : ID_POS,
            SCR_RSN => : SCR_RSN,
            SHIFT => : SHIFT,
            INSP_REQ => : INSP_REQ,
            MS_SLEEVE => : MS_SLEEVE,
            PLANNED_PROC => : PLANNED_PROC,
            FL_OFFCUT => : FL_OFFCUT,
            OPR_CMNT => : OPR_CMNT,
            UOM => : UOM,
            CD_RSN_HOLD => : CD_RSN_HOLD,
            HOLD_OP_REMARKS => : HOLD_OP_REMARKS,
            BUS_UNIT => : BUS_UNIT,
            ST_PRODN => : ST_PRODN,
            P_PLT_TYP => : P_PLT_TYP,
            P_SURFACE_VAL => : P_SURFACE_VAL,
            P_PROD_STRT_DTTM => :P_PROD_STRT_DTTM,
            P_PROD_END_DTTM => :P_PROD_END_DTTM,
            P_WORK_CENTER => :P_WORK_CENTER,
            P_FG_MATNR => :P_FG_MATNR,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_SCRP_MATNR => :P_SCRP_MATNR,
            P_ROLLING_LENGTH => :P_ROLLING_LENGTH,
            P_RM_MATNR => :P_RM_MATNR,
            P_BATCH_TYPE => :P_BATCH_TYPE,
            P_NO_OF_PASS => :P_NO_OF_PASS,
            P_Yield => :P_Yield,
            P_SCH_WT => :P_SCH_WT,
            P_CAST_NO => :P_CAST_NO,
            LS_OUT_FLAG => : LS_OUT_FLAG
            )`;

    const binds = {
      PLANT: Plant,
      BATCHID: ele.BATCH_ID,
      MCOIL: Batch,
      PROC: Process,
      CUSTORD: ele.EWI_ID_ORDER_CUS,
      CUSTITM: ele.EWI_ID_ORD_ITEM_CUS,
      SCO_ORD: ele.EWI_ID_ORDER_CUS,
      SCOITM: ele.EWI_ID_ORD_ITEM_CUS,
      NXTPROC: ele.NEXT_PROC,
      PROD: ele.EWI_CD_PROD,
      QLTY: ele.EWI_CD_QLTY,
      FL_HOLD: ele.ddlRsnHold ?? "Y",
      ACTIVITY_TIME: ele.prdTimeDiff, // Prod end Dt time - prod start dt time (converted into hours)
      INV_LOSS: 0,
      SLIT_SEC: "",
      SLIT_STATUS: "",
      TEN_LEN: null,
      THICK: ele.EWI_SEC1,
      WIDTH: ele.EWI_SEC2,
      P_LENGTH: ele.EWI_LENGTH,
      PIECE_ACTL: ele.EWI_MS_PIECE_ACTL, //net wt
      GROSS_ACTL: ele.EWI_MS_PIECE_ACTL, //gross wt -- equal to net wt for now. logic will change later
      SCRWT: 0,
      TDC: ele.EWI_NO_TDC ?? null, //Grade
      USRID: user,
      RES_WT: resWt, //grid 1 schdl wt- total net wt
      SUM_WT: totalNetWt, //total net wt.
      ID_PDI: ele.EWI_ID_WRK_INST,
      NOPCS: ele.EWI_NO_PIECES, //no of pieces
      IDIA: ele.IDIA,
      ODIA: ele.EWI_SEC2,
      PLANRSNCD: null,
      IDSCH: ele.EWI_ID_SCHEDULE,
      JAC_GRD: null,
      ACT_THICK: ele.EWI_SEC1,
      ACT_WIDTH: ele.EWI_SEC2,
      ACT_LENGTH: ele.EWI_LENGTH,
      CD_YARD: null,
      LOCX: null,
      LOCY: null,
      ID_POS: null,
      SCR_RSN: null,
      SHIFT: Shift,
      INSP_REQ: null,
      MS_SLEEVE: null,
      PLANNED_PROC: ele.EWI_PLANNED_PROC, //from grid 1
      FL_OFFCUT: null,
      OPR_CMNT: null,
      UOM: uom,
      CD_RSN_HOLD: ele.CD_HOLD ?? null,
      HOLD_OP_REMARKS: ele.HOLD_OP_REMARKS ?? null, //operator remarks
      BUS_UNIT: "TUBES",
      ST_PRODN: ProdDt,
      P_PLT_TYP: null,
      P_SURFACE_VAL: null,
      P_PROD_STRT_DTTM: ele.prdPStartDt, //prod dt Start time
      P_PROD_END_DTTM: ele.prdPEndDt, //prodt dt time
      P_WORK_CENTER: ele.ddlWorkCenter,
      P_FG_MATNR: ele.FG_MAT,
      P_SFG_MATNR: ele.SFG_MAT,
      P_SCRP_MATNR: ele.P_SCRP_MATNR ?? null,
      P_ROLLING_LENGTH: ele.rollingLength ?? null, //P_ROLLING_LENGTH
      P_RM_MATNR: ele.RM_MAT ?? null,
      P_BATCH_TYPE: batchType ?? null,
      P_NO_OF_PASS: ele.NO_PASS,
      P_Yield: 0,
      P_SCH_WT: totalNetWt,
      P_CAST_NO: null,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds, "binds");

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const Insert_Khapoli = async (
  Plant: any,
  Batch: any,
  Process: any,
  user: any
) => {
  try {
    const sql = `call SPCB004_INSERT_KHOP ( 
            I_PLANT => :I_PLANT,
            I_MCOIL => :I_MCOIL,
            I_PROC => :I_PROC,
            I_USER_ID => :I_USER_ID,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    const binds = {
      I_PLANT: Plant,
      I_MCOIL: Batch,
      I_PROC: Process,
      I_USER_ID: user,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 5000,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateErrCoilDetails = async (
  P_USER: any,
  errorData: any,
  errorString: any
) => {
  try {
    const sql = `call P_CRMCT002 ( 
            PROG_ID => :PROG_ID,
            ERROR_CD => :ERROR_CD,
            USER_NM => :USER_NM,
            ERR_DATA => :ERR_DATA,
            ERR_REMARKS => :ERR_REMARKS
            )`;

    const binds = {
      PROG_ID: "LDSM004",
      ERROR_CD: "STRT",
      USER_NM: P_USER,
      ERR_DATA: errorData,
      ERR_REMARKS: errorString,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const sendMerge = async (Plant: any, Batch: any, newData: any) => {
  try {
    const sql = `call LDSM004_SEND_MERG ( 
            P_PLANT => :P_PLANT,
            P_MRG_BATCH => :P_MRG_BATCH,
            P_ORD => :P_ORD,
            P_ORD_ITEM => :P_ORD_ITEM,
            LS_PAGE_ID => :LS_PAGE_ID,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    const binds = {
      P_PLANT: Plant,
      P_MRG_BATCH: Batch,
      P_ORD: newData[0].EWI_ID_ORDER_CUS,
      P_ORD_ITEM: newData[0].EWI_ID_ORD_ITEM_CUS,
      LS_PAGE_ID: "LDSM004",
      LS_OUT_FLAG: {
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

export const updateCoilDetails = async (
  PLANT: any,
  MCOIL: any,
  PIECE_ACTL: any,
  PIECE_ACTL_UOM: any,
  SCRWT: any,
  SCRWT_UOM: any,
  P_USER: any
) => {
  try {
    const sql = `call SPCB004_UPDATE (
            PLANT => :PLANT,
            MCOIL => :MCOIL,
            PIECE_ACTL => :PIECE_ACTL,
            PIECE_ACTL_UOM => :PIECE_ACTL_UOM,
            SCRWT => :SCRWT,
            SCRWT_UOM => :SCRWT_UOM,
            P_USER => :P_USER,
            LS_OUT_FLAG => : LS_OUT_FLAG           
            )`;

    const binds = {
      PLANT: PLANT,
      MCOIL: MCOIL,
      PIECE_ACTL: PIECE_ACTL, //SUM
      PIECE_ACTL_UOM: PIECE_ACTL_UOM,
      SCRWT: SCRWT, //SUM
      SCRWT_UOM: SCRWT_UOM,
      P_USER: P_USER,
      LS_OUT_FLAG: {
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

export const modifyCoilDetails = async (
  ele: any,
  Plant: any,
  resWt: any,
  user: any
) => {
  try {
    const sql = `call SPCB004_MODIFY (
            P_PLANT => :P_PLANT,
            ID_BATCH => :ID_BATCH,
            P_ODIA => :P_ODIA,
            P_IDIA => :P_IDIA,
            P_THK => :P_THK,
            P_LENGTH => :P_LENGTH,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      P_PLANT: Plant,
      ID_BATCH: ele.BATCHID,
      P_ODIA: ele.ODIA,
      P_IDIA: ele.IDIA,
      P_THK: ele.THK,
      P_LENGTH: ele.LENGTH1,
      P_USER: user,
      LS_OUT_FLAG: {
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

export const getHoldRsnDetails = async (req: any) => {
  try {
    const sql = `SELECT CD_HOLD,CD_DESC FROM V_EPA_HOLD_RSN WHERE CD_COMP='1000' ORDER BY 2`;
    let binds = {};
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchCount = async (req: any) => {
  try {
    let mill;
    let bindsMill = {
      plant: req.body.Plant,
      process: req.body.Process,
      mBatch: req.body.MBatch,
    };

    let qryMillCode = `  SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant 
        AND PLM_CD_PROCESS = :process
         AND PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST
           WHERE EWI_CD_ePA= PLM_CD_EPA 
           AND EWI_ID_BATCH =:mBatch  
           AND EWI_CD_STATUS ='CN' and ROWNUM=1) 
          AND PLM_ACTIVE_STATUS ='A'`;

    let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

    mill =
      getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : req.body.Process;

    const sql = `SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual`;

    let binds = {
      plant: req.body.Plant,
      mbatch: req.body.MBatch,
      p_prodn_dt: req.body.ProdDate,
      process: req.body.Process,
      mill: mill,
      status: req.body.status,
      count: req.body.count,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapProductionTable = async (req: any) => {
  try {
    const sql = `SELECT ( SELECT f_scrappdi_tub(:plant, :mbatch, :process, substr(cd_desc, 1, 18), :p_flag) scrap_batch_id FROM dual ) scrap_batch_id, '' idpdi, '' order_id, 0 item, '' rm_prod, '' fg_prod, 'SCRP' qlty, '' grade, '' thk, '' width_odia, '' length1, '0' no_pcs, '' net_wt, '' next_proc, '' rsn_hold, '' hold_desc, '' opr_remarks, substr(cd_desc, 1, 18) material, substr(cd_desc, 19, 70) material_desc, '' sfg_matnr, '' sfg_matnr_desc, '' rm_matnr, '' rm_matnr_desc, '' odia, '' idia FROM v_codes WHERE cd_type = 'EPA196C' AND substr(cd_value, 1, 4) = :plant AND substr(cd_value, 6, 1) = :process ORDER BY CD_DESC1`;
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

export const getScrapBatchId = async (req: any) => {
  try {
    const sql = `select F_SCRAPPDI_TUB(:P_PLANT, :P_MBATCH, :Process, :Material, :P_FLAG) scrap_batch_id from dual`;
    const binds = {
      P_PLANT: req.body.Plant,
      P_MBATCH: req.body.mBatch,
      Process: req.body.Process,
      Material: req.body.material,
      P_FLAG: "SCRAP",
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getWorkCenterList = async (req: any) => {
  try {
    let results;

    // let findPworkCenter = `SELECT ewi_wrk_center_no FROM v_work_inst WHERE ewi_id_batch = :MBatch AND ewi_cd_epa = :Plant AND ewi_cd_status = 'CN'`
    // const findPworkCenterBinds = {
    //     Plant: req.body.Plant,
    //     MBatch: req.body.MBatch
    // };
    // let wCenter = await query.executeQuery(findPworkCenter, findPworkCenterBinds);
    // if (wCenter.rows.length > 0 && wCenter.rows[0][0] != null) {
    //     results = wCenter;
    // } else {
    //     const sql = `SELECT EPL_PRODUCTION_TYPE FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :Plant AND EPL_CD_PROCESS = :process`;
    //     const binds = {
    //         Plant: req.body.Plant,
    //         process: req.body.Process
    //     };
    //     let pType = await query.executeQuery(sql, binds);

    //     let esql = `SELECT PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_cD_ePA= :Plant AND PLM_CD_PROCESS = :process order by 1`;
    //     let ebinds = {
    //         Plant: req.body.Plant,
    //         process: req.body.Process
    //     };
    //     results = await query.executeQuery(esql, ebinds);

    // }
    let esql = `SELECT PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_cD_ePA= :Plant AND PLM_CD_PROCESS = :process order by 1`;
    let ebinds = {
      Plant: req.body.Plant,
      process: req.body.Process,
    };
    results = await query.executeQuery(esql, ebinds);
    return results;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getLengthList = async (req: any) => {
  try {
    const sql = `SELECT
        nvl(tlm_sfg_thk, 0)
        || 'X'
        || nvl(tlm_sfg_length, 0) thk_len,
        nvl(tlm_sfg_length, 0) sfg_len
    FROM
        v_tub_length_master a
    WHERE
        tlm_cd_epa = :plant
        AND tlm_sfg_od = :odia
        AND tlm_fg_id = (
            SELECT
                enc_idia fg_id
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = a.tlm_cd_epa
                AND enc_id_order = :orderId
                AND enc_no_item = :item
                AND enc_length_min = enc_length_max
        )
        AND tlm_fg_od = (
            SELECT
                enc_sec2_max fg_od
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = a.tlm_cd_epa
                AND enc_id_order = :orderId
                AND enc_no_item = :item
                AND enc_length_min = enc_length_max
        )
        AND tlm_fg_thk = (
            SELECT
                enc_sec1_max fg_thk
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = a.tlm_cd_epa
                AND enc_id_order = :orderId
                AND enc_no_item = :item
                AND enc_length_min = enc_length_max
        )
        AND round(tlm_fg_length, 3) = (
            SELECT
                enc_length_max fg_length
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = a.tlm_cd_epa
                AND enc_id_order = :orderId
                AND enc_no_item = :item
                AND enc_length_min = enc_length_max
        )`;
    const binds = {
      plant: req.body.plant,
      odia: req.body.odia,
      orderId: req.body.order,
      item: req.body.item,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getIntrmMatl = async (plant: any, fg_mat: any, p_line: any) => {
  try {
    const sql = `SELECT
        tim_intmdt_mat
    FROM
        v_intmdt_matl
    WHERE
        tim_cd_epa = :plant
        AND tim_fg_mat = :fg_mat
        AND tim_mill IN (
            SELECT
                cd_desc1
            FROM
                v_codes
            WHERE
                cd_type = 'TB033'
                AND cd_value = tim_cd_epa
                AND cd_desc = :p_line
        )
    ORDER BY
        1`;
    const binds = {
      plant: plant,
      fg_mat: fg_mat,
      p_line: p_line,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProductionType = async (req: any) => {
  try {
    const sql = `SELECT EPL_PRODUCTION_TYPE FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :Plant AND EPL_CD_PROCESS = :process`;
    const binds = {
      Plant: req.body.Plant,
      process: req.body.Process,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMotherBatch = async (req: any) => {
  try {
    const { Plant, InputCoil, coilLength, adid, P_SCH_TYPE_FL } = req.body;
    const sql = `call TTSB001 (
            P_PLANT => :P_PLANT,
            P_INP_COILS => :P_INP_COILS,
            P_NO_OF_COIL => :P_NO_OF_COIL,
            P_USER => :P_USER,
            P_SCH_TYPE_FL => :P_SCH_TYPE_FL,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      P_PLANT: Plant,
      P_INP_COILS: InputCoil,
      P_NO_OF_COIL: coilLength,
      P_USER: adid,
      P_SCH_TYPE_FL: P_SCH_TYPE_FL,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    //P_PLANT == plnt code
    //P_INP_COILS == cpncatenated coil id of 10 charecter. (LOM_ID_BATCH)
    //P_NO_OF_COIL == total no of coils (Rows Length)

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CRTScheduleMerge = async (req: any) => {
  try {
    const {
      PlanPath,
      Plant,
      Process,
      ORD_ID,
      ORD_ITM,
      ORD_QTY,
      IDIA,
      ODIA,
      LENGTH,
      THICK,
      GRADE,
      MATNR,
      PROS_WT,
      GALVY_WT,
      rollchange,
      MOTHER_BATCH,
      CL_WT,
      CL_MATNR,
      FG_WT,
      adid,
      EOP_SFG_MATNR_BOM,
      P_SCH_TYPE_FL,
      P_NOMINATE_BATCH,
      P_NOMINATE_MATNR,
    } = req.body;
    const sql = `call LDSM004_MERGE_SCHD (
            CHK_COIL => :CHK_COIL,
            PARAM_PLANT_CNT => :PARAM_PLANT_CNT,
            PPH_CD_PROC_PATH => :PPH_CD_PROC_PATH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            NBT_PROC_LINE => :NBT_PROC_LINE,
            CHK_ORDER => :CHK_ORDER,
            NBT_CUS_ORD => :NBT_CUS_ORD,
            NBT_ITEM => :NBT_ITEM,
            NBT_ORD_QTY => :NBT_ORD_QTY,
            NBT_IDIA => :NBT_IDIA,
            NBT_ODIA => :NBT_ODIA,
            NBT_LENGTH => :NBT_LENGTH,
            NBT_THICK => :NBT_THICK,
            NBT_GRADE => :NBT_GRADE,
            NBT_MATNR => :NBT_MATNR,
            NBT_PROC_WT => :NBT_PROC_WT,
            NBT_GALV_WT => :NBT_GALV_WT,
            NBT_ROLLCHAIN => :NBT_ROLLCHAIN,
            NBT_MOTHER_BATCH => :NBT_MOTHER_BATCH,
            NBT_CL_WT => :NBT_CL_WT,
            NBT_CL_MATNR => :NBT_CL_MATNR,
            NBT_FG_WT => :NBT_FG_WT,
            P_USER => :P_USER,
            P_SCH_TYPE_FL => :P_SCH_TYPE_FL,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_NOMINATE_BATCH => :P_NOMINATE_BATCH,
            P_NOMINATE_MATNR => :P_NOMINATE_MATNR,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    const binds = {
      CHK_COIL: "Y",
      PARAM_PLANT_CNT: 1,
      PPH_CD_PROC_PATH: PlanPath,
      NBT_EPL_CD_EPA: Plant,
      NBT_PROC_LINE: Process,
      CHK_ORDER: "Y",
      NBT_CUS_ORD: ORD_ID,
      NBT_ITEM: ORD_ITM,
      NBT_ORD_QTY: ORD_QTY,
      NBT_IDIA: IDIA,
      NBT_ODIA: ODIA,
      NBT_LENGTH: LENGTH,
      NBT_THICK: THICK,
      NBT_GRADE: GRADE,
      NBT_MATNR: MATNR,
      NBT_PROC_WT: PROS_WT,
      NBT_GALV_WT: GALVY_WT,
      NBT_ROLLCHAIN: rollchange,
      NBT_MOTHER_BATCH: MOTHER_BATCH,
      NBT_CL_WT: CL_WT,
      NBT_CL_MATNR: CL_MATNR,
      NBT_FG_WT: FG_WT,
      P_USER: adid,
      P_SCH_TYPE_FL: P_SCH_TYPE_FL,
      P_SFG_MATNR: EOP_SFG_MATNR_BOM,
      P_NOMINATE_BATCH: P_NOMINATE_BATCH,
      P_NOMINATE_MATNR: P_NOMINATE_MATNR,
      LS_OUT_FLAG: {
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

export const noMergeDetails = async (req: any) => {
  try {
    let sql = `SELECT CD_DESC1 FROM V_CODES
        WHERE CD_TYPE='TB006A'
        AND CD_VALUE= :Plant`;

    let binds = {
      Plant: req.body.Plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRollingLen = async (req: any) => {
  try {
    let sql = `SELECT NVL(LENGTH,0) FROM V_YMPCT_TUB_MATL WHERE mandt ='600' and matnr= :SFGNo`;
    let binds = {
      SFGNo: req.body.SFGNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProductName = async (req: any) => {
  try {
    let sql = `select PPH_PRODUCT_NM from v_epa_proc_path
        where PPH_CD_EPA= :plant
        and PPH_CD_PROC_PATH = :procPath`;
    let binds = {
      plant: req.body.plant,
      procPath: req.body.procPath,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPieceActl = async (
  P_PLANT: any,
  P_BATCH_ID: any,
  P_PROD_NAME: any,
  P_NO_PCS: any,
  P_LENGTH: any,
  P_OD: any,
  P_ID: any,
  P_THICKNESS: any
) => {
  try {
    const sql = `select LDPDBA.f_get_piece_actl(:P_PLANT, :P_BATCH_ID, :P_PROD_NAME, :P_NO_PCS, :P_LENGTH, :P_OD, :P_ID, :P_THICKNESS) piece_actl from dual`;
    //f_get_piece_actl_04
    let binds = {
      P_PLANT: P_PLANT,
      P_BATCH_ID: P_BATCH_ID,
      P_PROD_NAME: P_PROD_NAME,
      P_NO_PCS: P_NO_PCS,
      P_LENGTH: parseFloat(P_LENGTH),
      P_OD: parseFloat(P_OD),
      P_ID: parseFloat(P_ID),
      P_THICKNESS: parseFloat(P_THICKNESS),
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchstatuscn = async (
  ele: any,
  Plant: any,
  workInstNo: any
) => {
  try {
    let sql = `SELECT * from v_work_inst where ewi_id_wrk_inst = :workInst AND ewi_id_batch = :batch AND ewi_cd_epa = :plant AND ewi_cd_status = 'CN'`;
    let binds = {
      batch: ele,
      plant: Plant,
      workInst: workInstNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapMatNo = async (plant: any) => {
  try {
    const sql = `SELECT SUBSTR(CD_DESC,1,18)MATERIAL_NO,SUBSTR(CD_DESC,22)MATERIAL_DESC FROM V_CODES WHERE CD_TYPE='EPA196' AND CD_VALUE= :plant`;
    var binds = {
      plant: plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
