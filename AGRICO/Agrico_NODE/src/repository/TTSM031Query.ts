import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP 
    FROM V_EPA_GROUP_PLANT , v_epa_proc_line 
    WHERE EGP_CD_EPA = EPL_CD_EPA 
    AND UPPER(EGP_GRP_USER)= :0 
    AND EPL_ACTIVITY_NM = 'SLT'
    AND  EPL_ACTIVE_PLANT_FL='A'  ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};



export const getProcessList = async (plant: any) => {
  try {
    const sql = `SELECT
    epl_cd_process
    || ' - '
    || epl_proc_line_desc epl_proc_line_desc,
    epl_cd_process
FROM
    v_epa_proc_line
WHERE
    epl_cd_epa = :plant
    AND epl_activity_nm = 'SLT'
ORDER BY
    epl_no_proc_seq,
    epl_cd_process
`;
    let binds = { plant: plant }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const getStatus = async (process: any) => {
  try {
    const sql = `select CD_VALUE, CD_DESC
      from v_codes
      where cd_type='TB024' and cd_value = :process
      order by 1`;
    let binds = { process: process }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getResqtyval = async (Plant: any) => {
  try {
    const sql = `SELECT CD_DESC1 FROM V_CODES
    WHERE Cd_TYPE='TB031'
    AND CD_VALUE= :plant `;
    let binds = { plant: Plant }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const getScheduleData = async (plant: any, status: any) => {
  try {
    const sql = `
      select EOM_ID_BATCH,EOM_CD_PROD,EOM_CD_QLTY_ACTL,(SELECT DISTINCT NVL(IQL_GRADE_DESC ,'.') GRADE_DESC  FROM V_QUALITY WHERE IQL_CD_QLTY = EOM_CD_QLTY_ACTL) GRADE_DESC,EOM_SEC1,EOM_SEC2,EOM_LENGTH,EOM_IDIA,'' Planned_Width,  EOM_NO_MATNR1 materil_no1, '' material_desc1, EOM_MATNR1_QTY EOM_MATNR1_QTY, 
      EOM_NO_MATNR2 materil_no2,'' material_desc2, EOM_MATNR2_QTY , EOM_NO_MATNR3 materil_no3,'' material_desc3, 
      EOM_MATNR3_QTY , EOM_NO_MATNR4 materil_no4, '' material_desc4, EOM_MATNR4_QTY, EOM_TDC_ACTL,EOM_CD_YRD,EOM_ID_LOC_X,
      EOM_ID_LOC_Y,EOM_ID_POS,EOM_NO_PIECES,
      (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) UTS fROM V_TC_COIL_TEST where TCO_PROD_NO=EOM_ID_BATCH AND TCO_CAST_NO=EOM_NO_CAST AND tco_test_parA in ('UTS') AND ROWNUM=1) UTS, 
      (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) YS fROM V_TC_COIL_TEST where TCO_PROD_NO=EOM_ID_BATCH AND TCO_CAST_NO=EOM_NO_CAST AND tco_test_parA in ('LYS','YS') AND ROWNUM=1)YS ,
      EOM_MS_PIECE_ACTL,NVL(EOM_MS_GROSS_CAL,0)+NVL(EOM_INV_LOSS,0) Gross_cal,(SELECT MAX(IWI_MARK_CUST_DESC) MK_CUSTOMER  FROM V_SAPOMS_WO_ITEM WHERE IWI_ID_ORDER IN (SELECT DISTINCT EIC_WO_NO FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=EOM_ID_BATCH	AND EIC_CD_EPA =EOM_CD_EPA) AND IWI_ID_ORDER_ITEM  IN (SELECT DISTINCT EIC_ITEM_NO FROM V_INPUT_COIL WHERE EIC_ID_COIL=EOM_ID_BATCH And EIC_CD_EPA =EOM_CD_EPA))MK_CUSTOMER,
      EOM_MS_SCRAP,EOM_ID_ORDER_CUS,EOM_ID_ORD_ITEM_CUS,''Ord_Typ,EOM_CD_STATUS,
      (SELECT DISTINCT EIC_WO_NO MillOrd FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=EOM_ID_BATCH	AND EIC_CD_EPA = EOM_CD_EPA and rownum=1) MillOrd, 
      (SELECT DISTINCT EIC_ITEM_NO Mill_Item FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=EOM_ID_BATCH	AND EIC_CD_EPA =EOM_CD_EPA
      and rownum=1) Mill_Item,(SELECT ehr_op_remarks Remarks	FROM v_epa_matl_hold_rls WHERE ehr_remarks='Diverted' AND 
      ehr_ts_release=(SELECT MAX(ehr_ts_release) FROM v_epa_matl_hold_rls WHERE ehr_id_batch= EOM_ID_BATCH AND EHR_CD_EPA= EOM_CD_EPA AND ehr_remarks='Diverted') AND   
      ehr_id_batch= EOM_ID_BATCH AND EHR_CD_EPA = EOM_CD_EPA) Remarks, (SELECT MAX(TRIM(REPLACE(CAD_DEF2_COMM,CHR(10),' '))) Salvage_Remark FROM   V_COIL_CARD WHERE  CAD_ID_COIL = EOM_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Salvage_Remark,
      (SELECT MAX(TRIM(REPLACE(CAD_CD_TOP_REMARKS,CHR(10),' '))) Top_Remrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = EOM_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Top_Remrk,
      (SELECT MAX(TRIM(REPLACE(CAD_CD_BOT_REMARKS,CHR(10),' '))) BottamRemrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = EOM_ID_BATCH AND  CAD_DEF2_COMM LIKE 'SLP%') BottamRemrk, 
      (SELECT MAX(TRIM(REPLACE(CAD_FILE_NAME,CHR(10),' '))) FileName FROM V_COIL_CARD WHERE  CAD_ID_COIL = EOM_ID_BATCH AND 
      CAD_DEF2_COMM LIKE 'SLP%') FileName,(SELECT MAX(CAD_LST_WRK_CEN) WrkCentr FROM   V_COIL_CARD WHERE  CAD_ID_COIL = EOM_ID_BATCH AND  
       CAD_DEF2_COMM LIKE 'SLP%') WrkCentr,EOM_NO_MATNR Materil_No,(SELECT NVL(MAKTX,' ') Material_desc FROM V_MAKT WHERE  MATNR = EOM_NO_MATNR	 AND  MANDT = (SELECT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'EPA205' AND  
       CD_VALUE = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE  EPL_CD_EPA = EOM_CD_EPA))) Material_desc,(SELECT EOM_OPER_COMMENT FROM V_EPA_PRODN WHERE EOM_ID_BATCH = A.EOM_ID_BATCH AND EOM_CD_EPA <> :Plant AND ROWNUM=1) PRV_SPC_OPR_COMNTS,ROUND((SYSDATE-EOM_TS_CREATION),0)Age_Days from v_epa_prodn A  
       where eom_cd_epa = :Plant and eom_cd_status =nvl( :Status,eom_cd_status) AND EOM_MS_GROSS_CAL>=0 `;
    let binds = { plant: plant, status: status };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCoils = async (req: any) => {
  try {

    let binds = {
      Plant: req.body.Plant,
      //Status: req.body.Status,
    };

    let QrygetCoils = `SELECT eom_id_batch, eom_cd_prod, eom_cd_qlty_actl, 
      ( SELECT DISTINCT nvl(iql_grade_desc, '.') grade_desc FROM v_quality WHERE iql_cd_qlty = eom_cd_qlty_actl ) grade_desc, eom_sec1, eom_sec2, eom_length, eom_idia, '' planned_width, eom_no_matnr1 materil_no1, '' material_desc1, eom_matnr1_qty eom_matnr1_qty, eom_no_matnr2 materil_no2, '' material_desc2, eom_matnr2_qty, eom_no_matnr3 materil_no3, '' material_desc3, eom_matnr3_qty, eom_no_matnr4 materil_no4, '' material_desc4, eom_matnr4_qty, eom_tdc_actl, eom_cd_yrd, eom_id_loc_x, eom_id_loc_y, eom_id_pos, eom_no_pieces, ( SELECT DISTINCT nvl(tco_test_para_val, 0) uts FROM v_tc_coil_test WHERE tco_prod_no = eom_id_batch AND tco_cast_no = eom_no_cast AND tco_test_para IN ( 'UTS' ) AND ROWNUM = 1 ) uts, ( SELECT DISTINCT nvl(tco_test_para_val, 0) ys FROM v_tc_coil_test WHERE tco_prod_no = eom_id_batch AND tco_cast_no = eom_no_cast AND tco_test_para IN ( 'LYS', 'YS' ) AND ROWNUM = 1 ) ys, eom_ms_piece_actl, nvl(eom_ms_gross_cal, 0) + nvl(eom_inv_loss, 0) gross_cal, eom_ms_scrap, eom_id_order_cus, eom_id_ord_item_cus, '' ord_typ, eom_cd_status, ( SELECT DISTINCT eic_wo_no millord FROM v_input_coil WHERE eic_id_coil = eom_id_batch AND eic_cd_epa = eom_cd_epa AND ROWNUM = 1 ) millord, ( SELECT DISTINCT eic_item_no mill_item FROM v_input_coil WHERE eic_id_coil = eom_id_batch AND eic_cd_epa = eom_cd_epa AND ROWNUM = 1 ) mill_item, ( SELECT ehr_op_remarks remarks FROM v_epa_matl_hold_rls WHERE ehr_remarks = 'Diverted' AND ehr_ts_release = ( SELECT MAX(ehr_ts_release) FROM v_epa_matl_hold_rls WHERE ehr_id_batch = eom_id_batch AND ehr_cd_epa = eom_cd_epa AND ehr_remarks = 'Diverted' ) AND ehr_id_batch = eom_id_batch AND ehr_cd_epa = eom_cd_epa ) remarks, ( SELECT MAX(TRIM(replace(cad_def2_comm, CHR(10), ' '))) salvage_remark FROM v_coil_card WHERE cad_id_coil = eom_id_batch AND cad_def2_comm LIKE 'SLP%' ) salvage_remark, ( SELECT MAX(TRIM(replace(cad_cd_top_remarks, CHR(10), ' '))) top_remrk FROM v_coil_card WHERE cad_id_coil = eom_id_batch AND cad_def2_comm LIKE 'SLP%' ) top_remrk, ( SELECT MAX(TRIM(replace(cad_cd_bot_remarks, CHR(10), ' '))) bottamremrk FROM v_coil_card WHERE cad_id_coil = eom_id_batch AND cad_def2_comm LIKE 'SLP%' ) bottamremrk, ( SELECT MAX(TRIM(replace(cad_file_name, CHR(10), ' '))) filename FROM v_coil_card WHERE cad_id_coil = eom_id_batch AND cad_def2_comm LIKE 'SLP%' ) filename, ( SELECT MAX(cad_lst_wrk_cen) wrkcentr FROM v_coil_card WHERE cad_id_coil = eom_id_batch AND cad_def2_comm LIKE 'SLP%' ) wrkcentr, eom_no_matnr materil_no,
      (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=eom_no_matnr AND ROWNUM=1) MATERIAL_DESC,( SELECT eom_oper_comment FROM v_epa_prodn WHERE eom_id_batch = a.eom_id_batch AND eom_cd_epa <> :plant AND ROWNUM = 1 ) prv_spc_opr_comnts, round((sysdate - eom_ts_creation), 0) age_days ,(select EIC_MK_CUSTOMER from v_input_coil where eic_cd_plant = a.eom_cd_epa and eic_id_coil =a.eom_id_batch) MK_CUSTOMER
      ,EOM_NO_CAST CAST_NO
      FROM v_epa_prodn a 
      WHERE eom_cd_epa = :plant 
      AND EOM_CD_STATUS IN (select CD_DESC from v_codes  where cD_type='TB024')
      AND eom_ms_gross_cal >= 0 `

    if ((req.body.Status && Array.isArray(req.body.Status) && req.body.Status.length > 1)) {
      if ((req.body.Status && Array.isArray(req.body.Status) && req.body.Status.length > 1)) {
        let dt = req.body.Status.map((d: any) => `'${d}'`).join();
        QrygetCoils += ` AND eom_cd_status in(` + dt + `) `;

      }
    } else {
      if (req.body.Status && req.body.Status?.length) {
        QrygetCoils += ` AND eom_cd_status = nvl(:Status, eom_cd_status) `;
        binds["Status"] = Array.isArray(req.body.Status) ? req.body.Status[0] : req.body.Status;
      }
    }

    if (req.body.BatchId != '') {
      QrygetCoils += " AND EOM_ID_BATCH = :BatchId "
      Object.assign(binds, { BatchId: req.body.BatchId });
    }

    if (req.body.ThickFR != '') {
      QrygetCoils += " AND EOM_SEC1 BETWEEN NVL(:ThickFR,EOM_SEC1) AND NVL(:ThickTo,NVL(:ThickFR,EOM_SEC1))"
      Object.assign(binds, { ThickFR: req.body.ThickFR });
      Object.assign(binds, { ThickTo: req.body.ThickTo });
    }

    if (req.body.WidthFr != '') {
      QrygetCoils += " AND EOM_SEC2 BETWEEN NVL(:WidthFr,EOM_SEC2) AND NVL(:WidthTo,NVL(:WidthFr,EOM_SEC2))"
      Object.assign(binds, { WidthFr: req.body.WidthFr });
      Object.assign(binds, { WidthTo: req.body.WidthTo });
    }

    if (req.body.Tdc != '') {
      QrygetCoils += " AND EOM_TDC_ACTL = :Tdc "
      Object.assign(binds, { Tdc: req.body.Tdc });
    }

    if (req.body.ProdCd != '') {
      QrygetCoils += " AND EOM_CD_PROD = :ProdCd "
      Object.assign(binds, { ProdCd: req.body.ProdCd });
    }

    if (req.body.rcvDtFr != '' && req.body.rcvdtTo != '') {
      QrygetCoils += " AND TRUNC(EOM_TS_CREATION) BETWEEN :recvDtFr AND :recvdtTo "
      Object.assign(binds, { recvDtFr: req.body.rcvDtFr });
      Object.assign(binds, { recvdtTo: req.body.rcvdtTo });
    }

    if (req.body.Tonn == "20") {
      QrygetCoils += " AND EOM_MS_PIECE_ACTL <= 20"
    } else if (req.body.Tonn == "21") {
      QrygetCoils += " AND EOM_MS_PIECE_ACTL > 20"
    }

    if (req.body.coilType != "All" && req.body.coilType == "RM_Coil") {
      QrygetCoils += " AND EOM_SEC2 > 900 ";
    }

    if (req.body.coilType != "All" && req.body.coilType == "Parted_Coil") {
      QrygetCoils += " AND EOM_SEC2 >= 200 AND EOM_SEC2<=900 ";
    }
    if (req.body.coilType == "All") {
      QrygetCoils += " AND (EOM_SEC2 > 900 OR (EOM_SEC2 >= 200 AND EOM_SEC2<=900)) ";
    }
    QrygetCoils += " order by EOM_TS_CREATION"
    return await query.executeQuery(QrygetCoils, binds);

  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const compute = async (req: any) => {
  try {
    let sql = `call SPCB031_YIELD_APP(
        P_MANDT => :P_MANDT,
        P_PLANT => :P_PLANT,
        P_BATCHID => :P_BATCHID,
        P_PROC_LINE => :P_PROC_LINE,
        P_LOOP_CNT => :P_LOOP_CNT,
        FL_MULTISETUP => :FL_MULTISETUP,
        LN_TOT_PLANWT => :LN_TOT_PLANWT,
        P_TEXT1 => :P_TEXT1,
        P_TEXT2 => :P_TEXT2,
        P_TEXT3 => :P_TEXT3,
        P_TEXT4 => :P_TEXT4,
        P_TEXT5 => :P_TEXT5,
        P_TEXT6 => :P_TEXT6,
        P_TEXT7 => :P_TEXT7,
        P_TEXT8 => :P_TEXT8,
        P_TEXT9 => :P_TEXT9,
        P_TEXT10 => :P_TEXT10,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {
      P_MANDT: req.body.mandt,
      P_PLANT: req.body.Plant,
      P_BATCHID: req.body.BatchId,
      P_PROC_LINE: req.body.ProcLine,
      P_LOOP_CNT: req.body.loop_cnt,
      FL_MULTISETUP: req.body.fl_multisetup,
      LN_TOT_PLANWT: req.body.TotYieldPlanWT,
      P_TEXT1: req.body.text1,
      P_TEXT2: '',
      P_TEXT3: '',
      P_TEXT4: '',
      P_TEXT5: '',
      P_TEXT6: '',
      P_TEXT7: '',
      P_TEXT8: '',
      P_TEXT9: '',
      P_TEXT10: '',
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const confirm2 = async (req: any) => {
  try {
    let sql = `call SPCB031_CONFIRM_1(
        P_MANDT => :P_MANDT,
        P_PLANT => :P_PLANT,
        P_BATCHID => :P_BATCHID,
        P_PROC_LINE => :P_PROC_LINE,
        P_LOOP_CNT => :P_LOOP_CNT,
        P_TEXT1 => :P_TEXT1,
        P_TEXT2 => :P_TEXT2,
        P_TEXT3 => :P_TEXT3,
        P_TEXT4 => :P_TEXT4,
        P_TEXT5 => :P_TEXT5,
        P_TEXT6 => :P_TEXT6,
        P_TEXT7 => :P_TEXT7,
        P_TEXT8 => :P_TEXT8,
        P_TEXT9 => :P_TEXT9,
        P_TEXT10 => :P_TEXT10,
        P_YIELDPER => :P_YIELDPER,
        P_YLDSETUP => :P_YLDSETUP,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {
      P_MANDT: req.body.mandt,
      P_PLANT: req.body.Plant,
      P_BATCHID: req.body.BatchId,
      P_PROC_LINE: req.body.ProcLine,
      P_LOOP_CNT: req.body.loop_cnt,
      P_TEXT1: '',
      P_TEXT2: '',
      P_TEXT3: '',
      P_TEXT4: '',
      P_TEXT5: '',
      P_TEXT6: '',
      P_TEXT7: '',
      P_TEXT8: '',
      P_TEXT9: '',
      P_TEXT10: '',
      P_YIELDPER: null,
      P_YLDSETUP: '',
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const GetOrdFilter = async (plant: any, ordid: any, orditem: any, ordtdc: any, ordtype: any, ordthick: any, ordwidth: any) => {
  try {
    let binds = {
      plant: plant,
      ordtype: ordtype ?? "",
    };
    let sql = ` 
    SELECT
    enc_id_order,
    enc_no_item,
    enc_cd_epa,
    enc_ord_quantity,
    NVL(TO_CHAR(enc_dt_delv, 'dd-mm-yyyy'),' ') enc_dt_delv,
    enc_mark_cust,
    enc_mark_cust_name,
    enc_no_tdc,
    enc_sec1_min,    
    enc_sec1_max,
    enc_sec2_min,
    enc_sec2_max,
    enc_length_max,
    nvl(SUM(DECODE(eom_cd_status, 'WL', eom_ms_gross_cal)),0) desp,
    nvl(SUM(DECODE(eom_cd_status, 'WB', eom_ms_gross_cal)), 0) displ,
    nvl(SUM(DECODE(substr(eom_cd_status, 2, 1), 'B', eom_ms_gross_cal)), 0) linked,
    enc_cust_name,
    enc_order_type,
    enc_cd_end_cust,
    enc_no_matnr,
    ( SELECT
            nvl(maktx, ' ')
        FROM
            v_makt
        WHERE
            mandt = '600'
            AND matnr = enc_no_matnr
    ) material_desc,
    enc_cd_prod,
    TO_CHAR(enc_dt_ord_create) enc_dt_ord_create,
    enc_ord_desc,
    nvl(enc_roaddest_desc,' ') enc_roaddest_desc,
    nvl(enc_raildest_desc,' ') enc_raildest_desc,
    enc_cd_qlty,
    (
        SELECT
            f_btp_slt(enc_cd_epa, enc_id_order, enc_no_item)
        FROM
            dual
    ) slt_btp
FROM
    v_end_cust_ord_epa,
    v_epa_prodn
WHERE
    enc_cd_epa = :plant
    AND enc_order_type = nvl(:ordtype, enc_order_type)
    AND enc_st_order = 'A'
    AND enc_id_order LIKE '002%'
    AND eom_id_order_cus (+) = enc_id_order
    AND eom_id_ord_item_cus (+) = enc_no_item
    AND enc_slit_plan='SLIT'`;
    if (ordid && ordid != '') {
      sql += " AND enc_id_order LIKE nvl('%'|| :ordid || '%', '%')"
      Object.assign(binds, { ordid: ordid });
    }
    if (orditem && orditem != '') {
      sql += " AND enc_no_item = nvl(:orditem, enc_no_item)"
      Object.assign(binds, { orditem: orditem });
    }
    if (ordtdc && ordtdc != '') {
      sql += " AND nvl(enc_no_tdc, ' ') = nvl(:ordtdc, nvl(enc_no_tdc, ' '))"
      Object.assign(binds, { ordtdc: ordtdc });
    }
    if (ordthick && ordthick != '') {
      sql += "  AND :ordthick BETWEEN enc_sec1_min AND enc_sec1_max"
      Object.assign(binds, { ordthick: ordthick });
    }
    if (ordwidth && ordwidth != '') {
      sql += " AND :ordwidth BETWEEN enc_sec2_min AND enc_sec2_max"
      Object.assign(binds, { ordwidth: ordwidth });
    }
    sql += ` GROUP BY
    enc_id_order,
    enc_no_item,
    enc_ord_quantity,
    enc_no_tdc,
    enc_cd_epa,
    enc_sec1_min,   
    enc_sec1_max,    
    enc_sec2_min,
    enc_sec2_max,
    enc_length_max,
    enc_cust_name,
    enc_order_type,
    enc_cd_prod,
    enc_order_type,
    enc_dt_ord_create,
    enc_dt_delv,
    enc_mark_cust,
    enc_mark_cust_name,
    enc_ord_desc,
    enc_roaddest_desc,
    enc_raildest_desc,
    enc_cd_end_cust,
    enc_no_matnr,
    enc_cd_qlty `

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const GetPlanPathWire = async (req: any) => {
  try {
    const sql = `SELECT PPH_CD_PROC_PATH, PPH_DESC FROM   V_EPA_PROC_PATH WHERE  PPH_CD_EPA = :Plant AND    PPH_CD_PROC_PATH LIKE NVL(:SchPLine,:FltPLine)||'%' ORDER  BY 1`;
    let binds = {
      Plant: req.body.Plant,
      SchPLine: req.body.SchPLine,
      FltPLine: req.body.FltPLine
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const confirm = async (req: any) => {

  let sql = `call SPCB031_CONFIRM_1(
    P_MANDT => :P_MANDT,
    P_PLANT => :P_PLANT,
    P_BATCHID => :P_BATCHID,
    P_PROC_LINE => :P_PROC_LINE,
    P_LOOP_CNT => :P_LOOP_CNT,
    P_TEXT1 => :P_TEXT1,
    P_TEXT2 => :P_TEXT2,
    P_TEXT3 => :P_TEXT3,
    P_TEXT4 => :P_TEXT4,
    P_TEXT5 => :P_TEXT5,
    P_TEXT6 => :P_TEXT6,
    P_TEXT7 => :P_TEXT7,
    P_TEXT8 => :P_TEXT8,
    P_TEXT9 => :P_TEXT9,
    P_TEXT10 => :P_TEXT10,
    P_YIELDPER => :P_YIELDPER,
    P_YLDSETUP => :P_YLDSETUP,
    LS_OUT_FLAG => :LS_OUT_FLAG
  )`;

  let bindsSql = {
    P_MANDT: req.body.mandt,
    P_PLANT: req.body.Plant,
    P_BATCHID: req.body.BatchId,
    P_PROC_LINE: req.body.ProcLine,
    P_LOOP_CNT: req.body.loop_cnt,
    P_TEXT1: '',
    P_TEXT2: '',
    P_TEXT3: '',
    P_TEXT4: '',
    P_TEXT5: '',
    P_TEXT6: '',
    P_TEXT7: '',
    P_TEXT8: '',
    P_TEXT9: '',
    P_TEXT10: '',
    P_YIELDPER: null,
    P_YLDSETUP: '',
    LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
  }
  let confirm1 = await query.executeQuery(sql, bindsSql);
  if (confirm1.outBinds.LS_OUT_FLAG.substring(0, 1) == "Y" || confirm1.outBinds.LS_OUT_FLAG.substring(0, 1) == "Z") {
    let CntPlant = 0;
    let MailID = "";
    let str;
    let count = "";
    let batchid = "";
    let TotAimWt = "";
    let Coiltdc = "";
    const QryMailID = `select (PVL_SCT_ID||PVL_PAR_ID)mail_id from V_PARAMETER_VALUE where PVL_INFN_TYPE='A000000017' and PVL_CAT_ID= :Plant `;
    let binds = { Plant: req.body.Plant };
    let MailIDt = await query.executeQuery(QryMailID, binds);

    if (MailIDt.rows.length > 0) {
      CntPlant = CntPlant + 1;
      MailID = MailIDt.rows;


      const QryCoilTdc = `select distinct EIC_TDC_ACTL from v_input_coil where eic_cd_epa = :Plant and eic_id_coil IN (SELECT DISTINCT EOM_ID_FIRST_PAR FROM V_EPA_PRODN WHERE EOM_CD_ePA= :Plant AND EOM_ID_BATCH = :CoilID) `;
      let bindsQryCoilTdc = { Plant: req.body.Plant, CoilID: req.body.BatchId };
      let CoiltdcDt = await query.executeQuery(QryCoilTdc, bindsQryCoilTdc);
      if (CoiltdcDt.rows.length > 0) {
        Coiltdc = CoiltdcDt.rows;
      }

      let CntTDC = 0;
      const QryCntTdc = `SELECT COUNT(1) CNT FROM v_work_inst WHERE EWI_CD_ePA= :Plant and EWI_NO_TDC= :Coiltdc and EWI_CD_STATUS <>'RJ' `;
      let bindsQryCntTdc = { Plant: req.body.Plant, Coiltdc: req.body.Coiltdc };
      let CntTDCDt = await query.executeQuery(QryCntTdc, bindsQryCntTdc);
      if (CntTDCDt.rows.length > 0) {
        CntTDC = CntTDCDt.rows;
        if (CntTDC == 0) {

          let MAILBody = `"Coil id- " & ${req.body.BatchId} & ", Plant - " & ${req.body.Plant} & ", TDC - " & ${Coiltdc} & " is getting planned first time in plant. Please ensure availibity of TPR."`;
          let sql = `call SendMail_Generic(
            mailid => :mailid,
            mailid_cc => :mailid_cc,
            sgacode => :sgacode,
            sgadesc => :sgadesc,
            subj => :subj,
            urllink => :urllink,
            sendrTyp => :sendrTyp,
            Remarks => :Remarks,
            LS_OUT_FLAG => :LS_OUT_FLAG
          )`;

          let binds = {
            mailid: MailID,
            mailid_cc: "",
            sgacode: "02",
            sgadesc: MAILBody,
            subj: "1st Time TDC processing information",
            urllink: "",
            sendrTyp: "N",
            Remarks: "Dear Sir/Madam,",
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
          }
          let sendMail = await query.executeQuery(sql, binds);

        }
      }
    }

    let no_pkt = "";
    let Pktwt = "";
    let stk = "";

    var checkLS_SCH_HOLD = confirm1.outBinds.LS_OUT_FLAG.substring(0, 1);

    let sqlConfirm3 = `call SPCB031_CONFIRM_2(
      p_mandt => :p_mandt,
      p_plant => :p_plant,
      p_batchid => :p_batchid,
      p_proc_line => :p_proc_line,
      p_order => :p_order,
      p_item => :p_item,
      p_setup_cd => :p_setup_cd,
      p_sec1 => :p_sec1,
      p_sec2 => :p_sec2,
      p_length => :p_length,
      p_tdc => :p_tdc,
      p_pcode => :p_pcode,
      p_qcode => :p_qcode,
      no_piece => :no_piece,
      NBT_PKT_NO => :NBT_PKT_NO,
      NBT_PLAN_QTY => :NBT_PLAN_QTY,
      NBT_NO_OF_PART => :NBT_NO_OF_PART,
      NBT_EWI_NO_PIECES_WIP => :NBT_EWI_NO_PIECES_WIP,
      NBT_EOM_MS_PIECE_ACTL => :NBT_EOM_MS_PIECE_ACTL,
      NBT_EWI_OFF_CUT_REMARKS => :NBT_EWI_OFF_CUT_REMARKS,
      NBT_EWI_IDIA => :NBT_EWI_IDIA,
      NBT_MIN_WT => :NBT_MIN_WT,
      NBT_MAX_WT => :NBT_MAX_WT,
      NBT_EWI_MS_PACK => :NBT_EWI_MS_PACK,
      NBT_PLANNED_PROC => :NBT_PLANNED_PROC,
      NBT_REMARKS => :NBT_REMARKS,
      NBT_EWI_NO_STACK => :NBT_EWI_NO_STACK,
      NBT_CD_PACK => :NBT_CD_PACK,
      NBT_PRC_ROUT => :NBT_PRC_ROUT,
      LST_REWORK => :LST_REWORK,
      NBT_EOM_CD_NEXT_PROC => :NBT_EOM_CD_NEXT_PROC,
      p_fg_plan_grade => :p_fg_plan_grade,
      LS_SCH_HOLD => :LS_SCH_HOLD,
      P_PLAN_RSN_CD => :P_PLAN_RSN_CD,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;


    // let bindsConfirm3 = {
    //   p_mandt: req.body.mandt,
    //   p_plant: req.body.Plant,
    //   p_batchid: req.body.dt[0].txtSchBatch,
    //   p_proc_line: req.body.ProcLine,
    //   p_order: req.body.dt[0].txtSchOrd,
    //   p_item: req.body.dt[0].txtSchItem,
    //   p_setup_cd: req.body.dt[0].ddlSchStCD,
    //   p_sec1: req.body.dt[0].txtSchThick.toFixed(3) ? parseFloat(req.body.dt[0].txtSchThick.toFixed(3)) : 0,
    //   p_sec2: parseFloat(req.body.dt[0].txtSchWidth).toFixed(3) ? parseFloat(req.body.dt[0].txtSchWidth).toFixed(3) : 0,
    //   p_length: req.body.dt[0].txtSchLength.toFixed(3) ? parseFloat(req.body.dt[0].txtSchLength.toFixed(3)) : 0,
    //   p_tdc: req.body.dt[0].txtSchTdc,
    //   p_pcode: req.body.dt[0].txtSchProdCd,
    //   p_qcode: req.body.dt[0].txtSchQltycd,
    //   no_piece: req.body.dt[0].txtSchNoslt ? parseFloat(req.body.dt[0].txtSchNoslt) : 1,
    //   NBT_PKT_NO: no_pkt ? parseFloat(no_pkt) : 0,
    //   NBT_PLAN_QTY: req.body.dt[0].txtSchPlantwt ? parseFloat(req.body.dt[0].txtSchPlantwt) : 0,
    //   NBT_NO_OF_PART: req.body.dt[0].txtSchNoPart ? parseFloat(req.body.dt[0].txtSchNoPart) : 0,
    //   NBT_EWI_NO_PIECES_WIP: req.body.dt[0].txtSchNoPcs ? parseFloat(req.body.dt[0].txtSchNoPcs) : 0,
    //   NBT_EOM_MS_PIECE_ACTL: req.body.dt[0].txtSchAimWt ? parseFloat(req.body.dt[0].txtSchAimWt) : 0,
    //   NBT_EWI_OFF_CUT_REMARKS: req.body.dt[0].ddlSchOfcut,
    //   NBT_EWI_IDIA: req.body.dt[0].txtSchIdia ? parseFloat(req.body.dt[0].txtSchIdia) : 0,
    //   NBT_MIN_WT: req.body.dt[0].txtSchMinwt ? parseFloat(req.body.dt[0].txtSchMinwt) : 0,
    //   NBT_MAX_WT: req.body.dt[0].txtSchMaxwt ? parseFloat(req.body.dt[0].txtSchMaxwt) : 0,
    //   NBT_EWI_MS_PACK: Pktwt ? parseFloat(Pktwt) : 0,
    //   NBT_PLANNED_PROC: req.body.dt[0].txtSchPlannedPath,
    //   NBT_REMARKS: req.body.dt[0].txtSchRemark,
    //   NBT_EWI_NO_STACK: stk ? parseFloat(stk) : 0,
    //   NBT_CD_PACK: req.body.dt[0].txtSchPkgTyp,
    //   NBT_PRC_ROUT: req.body.dt[0].ddlProcRt,
    //   LST_REWORK: '',
    //   NBT_EOM_CD_NEXT_PROC: "P",
    //   p_fg_plan_grade: '',
    //   LS_SCH_HOLD: checkLS_SCH_HOLD == "Y" ? "X" : "Z",
    //   P_PLAN_RSN_CD: '',
    //   LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
    // };
    for (let i = 0; i < req.body.dt.length; i++) {
      let bindsConfirm3 = {
        p_mandt: req.body.mandt,
        p_plant: req.body.Plant,
        p_batchid: req.body.dt[i].txtSchBatch,
        p_proc_line: req.body.ProcLine,
        p_order: req.body.dt[i].txtSchOrd,
        p_item: req.body.dt[i].txtSchItem,
        p_setup_cd: req.body.dt[i].ddlSchStCD,
        p_sec1: req.body.dt[i].txtSchThick.toFixed(3) ? parseFloat(req.body.dt[i].txtSchThick.toFixed(3)) : 0,
        p_sec2: parseFloat(req.body.dt[i].txtSchWidth).toFixed(3) ? parseFloat(req.body.dt[i].txtSchWidth).toFixed(3) : 0,
        p_length: req.body.dt[i].txtSchLength.toFixed(3) ? parseFloat(req.body.dt[i].txtSchLength.toFixed(3)) : 0,
        p_tdc: req.body.dt[i].txtSchTdc,
        p_pcode: req.body.dt[i].txtSchProdCd,
        p_qcode: req.body.dt[i].txtSchQltycd,
        no_piece: req.body.dt[i].txtSchNoslt ? parseFloat(req.body.dt[i].txtSchNoslt) : 1,
        NBT_PKT_NO: no_pkt ? parseFloat(no_pkt) : 0,
        NBT_PLAN_QTY: req.body.dt[i].txtSchPlantwt ? parseFloat(req.body.dt[i].txtSchPlantwt) : 0,
        NBT_NO_OF_PART: req.body.dt[i].txtSchNoPart ? parseFloat(req.body.dt[i].txtSchNoPart) : 0,
        NBT_EWI_NO_PIECES_WIP: req.body.dt[i].txtSchNoPcs ? parseFloat(req.body.dt[i].txtSchNoPcs) : 0,
        NBT_EOM_MS_PIECE_ACTL: req.body.dt[i].txtSchAimWt ? parseFloat(req.body.dt[i].txtSchAimWt) : 0,
        NBT_EWI_OFF_CUT_REMARKS: req.body.dt[i].ddlSchOfcut,
        NBT_EWI_IDIA: req.body.dt[i].txtSchIdia ? parseFloat(req.body.dt[i].txtSchIdia) : 0,
        NBT_MIN_WT: req.body.dt[i].txtSchMinwt ? parseFloat(req.body.dt[i].txtSchMinwt) : 0,
        NBT_MAX_WT: req.body.dt[i].txtSchMaxwt ? parseFloat(req.body.dt[i].txtSchMaxwt) : 0,
        NBT_EWI_MS_PACK: Pktwt ? parseFloat(Pktwt) : 0,
        NBT_PLANNED_PROC: req.body.dt[i].txtSchPlannedPath,
        NBT_REMARKS: req.body.dt[i].txtSchRemark,
        NBT_EWI_NO_STACK: stk ? parseFloat(stk) : 0,
        NBT_CD_PACK: req.body.dt[i].txtSchPkgTyp,
        NBT_PRC_ROUT: req.body.dt[i].ddlProcRt,
        LST_REWORK: '',
        NBT_EOM_CD_NEXT_PROC: "P",
        p_fg_plan_grade: '',
        LS_SCH_HOLD: checkLS_SCH_HOLD == "Y" ? "X" : "Z",
        P_PLAN_RSN_CD: '',
        LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
      };

      //if Y = pass X and if Z then Pass Z (confirm return LS_SCH_HOLD); 

      str = await query.executeQuery(sqlConfirm3, bindsConfirm3);
      if (str.outBinds.LS_OUT_FLAG.substring(0, 1) == "Z" || str.outBinds.LS_OUT_FLAG.substring(0, 1) == "Y") {
        let IV_Chk = 0;
        let iv_qry = `select nvl(eom_inv_loss,0) from v_EPA_PRODN where eom_cd_epa= :Plant AND EOM_ID_BATCH=:BatchID AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR AND NVL(EOM_INV_LOSS,0)>0`;
        let ivBinds = {
          Plant: req.body.Plant,
          BatchID: req.body.BatchId
        };

        let IV_ChkDt = await query.executeQuery(iv_qry, ivBinds);
        if (IV_ChkDt.rows.length > 0) {
          IV_Chk = IV_ChkDt.rows;
          let QRY = `update v_epa_prodn set eom_ms_gross_cal=nvl(eom_ms_gross_cal,0)+ :IV_Chk , eom_inv_loss=null where eom_cd_epa= :Plant AND EOM_ID_BATCH=:BatchID AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR AND NVL(EOM_INV_LOSS,0)>0 `;
          let queryBinds = {
            Plant: req.body.Plant,
            BatchID: req.body.BatchId,
            IV_Chk: IV_Chk
          }
          let qryExc = await query.executeQuery(QRY, queryBinds);

        }
      }
    }

    if (str.outBinds.LS_OUT_FLAG.substring(0, 1) == "Z") {
      var sumAim_WT = 0;
      req.body.dt.forEach((item: any) => {
        sumAim_WT += parseFloat(item.txtSchAimWt);
      });

      var d = confirm1.outBinds.LS_OUT_FLAG;
      var confirmSplit = d.split("-");

      let sql = `call SPCB031_CONFIRM_3(
        p_plant => :p_plant,
        p_coilid => :p_coilid,
        p_loopcnt => :p_loopcnt,
        p_proc_line => :p_proc_line,
        p_yieldper => :p_yieldper,
        p_setup => :p_setup,
        p_planwt => :p_planwt,
        p_rsncd => :p_rsncd,
        p_rem => :p_rem,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

      let binds = {
        p_plant: req.body.Plant,
        p_coilid: req.body.BatchId,
        p_loopcnt: count ? parseFloat(count) : 0,
        p_proc_line: req.body.ProcLine,
        p_yieldper: req.body.p_yieldper ? parseFloat(req.body.p_yieldper) : 0, //P Yield (1-100)
        p_setup: req.body.p_Yldsetup, //setup Cd (A01)
        p_planwt: sumAim_WT,
        p_rsncd: '', //Exce Modal for val
        p_rem: '', //Exce Modal for val
        LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
      }

      let str1 = await query.executeQuery(sql, binds);
      let LN_SEC_ORD = 0;
      let LS_FG_MAT = 0;
      let result = "";
      if (str1.outBinds.LS_OUT_FLAG.substring(0, 1) == "Y") {

        let QryOrdCnt = `SELECT COUNT(1) FROM V_END_CUST_ORD_EPA WHERE ENC_ID_ORDER =:OrdId AND ENC_NO_ITEM=:OrdItem  AND ENC_CD_EPA= :Plant AND ENC_ORDER_TYPE IN (SELECT CD_VALUE FROM V_CODES WHERE  CD_TYPE = 'EPA28')  AND (ENC_NO_TDC  IN (SELECT DISTINCT ESP_TDC_DOWNGRADE FROM V_EPA_SECONDS_PRIME_TDC WHERE  ESP_CD_EPA = :Plant) OR ENC_NO_TDC IN (SELECT DISTINCT EPM_SEC_TDC FROM V_EPA_PRODCD_MAPPING WHERE EPM_CD_EPA = :Plant))`
        let bindsQryOrdCnt = {
          Plant: req.body.Plant,
          OrdId: req.body.dt[0].txtSchOrd,
          OrdItem: req.body.dt[0].txtSchItem
        }

        let QryOrdCntRes = await query.executeQuery(QryOrdCnt, bindsQryOrdCnt);
        if (QryOrdCntRes.rows.length > 0) {
          LN_SEC_ORD = QryOrdCntRes.rows[0][0];
        }

        if (LN_SEC_ORD == 0) {
          let QryOrdFGMat = `SELECT ENC_NO_MATNR FROM V_END_CUST_ORD_EPA WHERE ENC_ID_ORDER = :OrdId AND ENC_NO_ITEM = :OrdItem AND ENC_CD_EPA= :Plant`;
          let bindsQryOrdFGMat = {
            Plant: req.body.Plant,
            OrdId: req.body.dt[0].txtSchOrd,
            OrdItem: req.body.dt[0].txtSchItem
          }
          let QryOrdFGMatRes = await query.executeQuery(QryOrdFGMat, bindsQryOrdFGMat);

          if (QryOrdFGMatRes.rows.length > 0) {
            LS_FG_MAT = QryOrdFGMatRes.rows[0][0];
          }

          // var val = str1.split("!");

          let QryInsertYieldDtls = `INSERT INTO V_YIELD_DTLS (TYD_ID_REQ,TYD_ID_COIL,TYD_ID_ORDER,TYD_NO_ITEM,TYD_FG_MAT,TYD_CRT_ID,TYD_CRT_DT,TYD_UPD_ID,TYD_UPD_DT,TYD_ACT_STATUS,TYD_ORD_PARAM, TYD_ORD_QTY,TYD_FG_TDC) VALUES  (:Req_id,:Batch_Id,:Ord,:OrdItm,:LS_FG_MAT,USER,SYSDATE,USER,SYSDATE,'A',:Sec2,ROUND(:PLAN_QTY,3),:DC_ACTL )`;
          let bindsQryInsertYieldDtls = {
            Req_id: req.body.Plant + "/" + req.body.dt[0].txtSchBatch + "/" + "0001",
            Batch_Id: req.body.dt[0].txtSchBatch,
            Ord: req.body.dt[0].txtSchOrd,
            OrdItm: req.body.dt[0].txtSchItem,
            LS_FG_MAT: LS_FG_MAT,
            Sec2: req.body.dt[0].txtSchWidth,
            PLAN_QTY: req.body.dt[0].txtSchPlantwt,
            DC_ACTL: req.body.dt[0].txtSchTdc
          };

          let QryInsertYieldDtlsRes = await query.executeQuery(QryInsertYieldDtls, bindsQryInsertYieldDtls);

        }
      }
    }
    return str;
  }
}

export const getOrdTyp = async () => {
  try {
    const sql = `SELECT CD_VALUE FROM V_CODES
    WHERE CD_TYPE='TB005'
    ORDER BY 1`;
    // let binds = { plant: plant }
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const GetBatchDtl = async (Plant: any, Batch: any, ProcLine: any, workcenter: any) => {
  try {
    if (ProcLine == "M") {

      let sql = `SELECT eom_id_batch, eom_cd_prod, eom_cd_qlty_actl, eom_sec1, eom_sec2, eom_length, eom_tdc_actl, eom_ms_piece_actl     input_wt_old, nvl(decode(eom_uom, 'KG', round((eom_ms_piece_actl / 1000), 3), eom_ms_piece_actl), 0) input_wt, eom_cd_status, nvl(eom_ms_gross_cal, 0) eom_ms_gross_cal_old, nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) eom_ms_gross_cal, eom_cd_next_proc, ( SELECT substr(eom_planned_proc, instr(eom_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(eom_planned_proc, eom_passed_proc, :procline) FROM dual ) next_proc, nvl(eom_ms_scrap, 0) eom_ms_scrap, ( eom_ms_piece_actl - eom_ms_gross_cal ) proc_wt_old, ( ( nvl(decode(eom_uom, 'KG', round((eom_ms_piece_actl / 1000), 3), eom_ms_piece_actl), 0) ) - ( nvl(decode(eom_uom, 'KG', round ((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) ) ) proc_wt, eom_id_first_par, EWI_MS_INPUT plan_wt, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, eom_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length FROM v_epa_prodn          a, v_work_inst          b, v_end_cust_ord_epa   c WHERE a.eom_cd_epa = b.ewi_cd_epa AND a.eom_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND eom_cd_epa = :plant AND eom_id_batch = nvl(:batch, eom_id_batch) AND eom_cd_status = 'MC' AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) ORDER BY ewi_cd_epa, ewi_wrk_center_no, eom_planned_proc, ewi_no_matnr, ewi_no_tdc`
      let binds = {
        plant: Plant,
        batch: Batch,
        procLine: ProcLine,
        workcenter: workcenter
      }
      return await query.executeQuery(sql, binds);
    } else {

      let sql = `select  ewi_cd_epa,
          eom_id_batch,
          eom_cd_prod,
          eom_cd_qlty_actl,
          eom_sec1,
          eom_sec2,
          eom_length,
          eom_tdc_actl,
          eom_ms_piece_actl input_wt_old,
          nvl(DECODE(eom_uom, 'KG', round((eom_ms_piece_actl / 1000), 3), eom_ms_piece_actl),
          
          0
          
           ) input_wt,
          eom_cd_status,
          nvl(eom_ms_gross_cal, 0) eom_ms_gross_cal_old,
          nvl(DECODE(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal),
          
          0) eom_ms_gross_cal,
          eom_cd_next_proc,
          
           (
              SELECT
                  substr(eom_planned_proc, instr(eom_planned_proc, :procline) + 1,
          
           1)
              FROM
                  dual
          ) next_proc_old,
          (
              SELECT
                  f_get_nextproc(eom_planned_proc, eom_passed_proc, :procline)
              FROM
                  dual
          ) next_proc,
          nvl(eom_ms_scrap, 0) eom_ms_scrap,
          ( eom_ms_piece_actl - eom_ms_gross_cal ) proc_wt_old,
          ( ( nvl(DECODE(eom_uom, 'KG', round((eom_ms_piece_actl / 1000), 3), eom_ms_piece_actl),
          
          0) ) - ( nvl(DECODE(eom_uom, 'KG', round((eom_ms_gross_cal
          / 1000), 3), eom_ms_gross_cal),
          
          0) ) ) proc_wt,
          eom_id_first_par,
          EWI_MS_INPUT plan_wt,
          (
              SELECT
                  SUM(ewi_ms_piece_actl)
              FROM
                  v_work_inst
              WHERE
                  ewi_id_batch = b.ewi_id_batch
                  AND ewi_cd_status = 'CN'
          ) schd_wt,
          eom_planned_proc,
          ewi_id_order_cus cust_ord,
          ewi_id_ord_item_cus cust_item,
          TO_CHAR(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt,
          ewi_wrk_center_no work_center,
          nvl(ewi_remarks, ' ') planning_remarks,
          (
              SELECT
                  f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus)
              FROM
                  dual
          ) cust_nm,
          ewi_no_matnr rm_material,
          (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = ewi_no_matnr
          ) rm_material_desc,
          ewi_sfg_matnr sfg_material,
          (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = ewi_sfg_matnr
          ) sfg_material_desc,
          ewi_fg_matnr fg_material,
          (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = ewi_fg_matnr
          ) fg_material_desc,
          ewi_no_tdc grade,
          enc_print_spec print_spec,
          enc_sec1_max ord_thk,
          enc_sec2_max ord_odia,
          enc_idia ord_idia,
          enc_length_min ord_min_length,
          enc_length_max ord_max_length
          
          FROM v_epa_prodn a,
                                             v_work_inst b,
                                             v_end_cust_ord_epa c
          WHERE
              a.eom_cd_epa = b.ewi_cd_epa
              AND a.eom_id_batch = b.ewi_id_batch
                  AND b.ewi_id_order_cus = c.enc_id_order
                      AND b.ewi_id_ord_item_cus = c.enc_no_item
                          AND eom_cd_epa = :plant
                              AND eom_id_batch = nvl(:batch, eom_id_batch)
                                  AND ewi_cd_status = 'CN'
                                      AND ewi_cd_process = :procline
                                          AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no)
                                          and rownum =1
          
          ORDER by ewi_cd_epa,
                ewi_wrk_center_no,
                eom_planned_proc,
                ewi_no_matnr,
                ewi_no_tdc`
      let binds = {
        plant: Plant,
        batch: Batch,
        procLine: ProcLine,
        workcenter: workcenter
      }
      return await query.executeQuery(sql, binds);
    }

  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const GetPdiDtl = async (Plant: any, Batch: any, Process: any, ProdDate: any, MBatch: any, BusUnit: any, Odia: any, status: any) => {
  try {
    let countVal: any;
    let mill: any;
    return new Promise(async function (resolve, reject) {
      let bindsCount = {
        plant: Plant,
        process: Process,
        odia: Odia,
        mbatch: MBatch
      };
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_epa_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.eom_id_batch AND a.ewi_cd_epa = b.eom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.eom_cd_status NOT LIKE '%X' AND b.eom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`
      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      let bindsMill = {
        plant: Plant,
        process: Process,
        MBatch: MBatch
      };

      let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant
          AND PLM_CD_PROCESS = :process AND
          PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST
              WHERE EWI_CD_ePA= PLM_CD_EPA
              AND EWI_ID_BATCH = :MBatch
              AND EWI_CD_STATUS ='CN' and ROWNUM=1)
           AND PLM_ACTIVE_STATUS ='A'`
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
          mill: mill
        };
        let sql = `SELECT
              (
                  SELECT
                      f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, a.srno)
                  FROM
                      dual
              ) batch_id,
              a.*
          FROM
              (
                  SELECT
                      ROWNUM srno,
                      ewi_uom,
                      ewi_id_wrk_inst,
                      ewi_id_order_cus,
                      ewi_id_ord_item_cus,
                      ewi_cd_prod,
                      ewi_cd_qlty,
                      ewi_sec1,
                      ewi_sec2,
                      ewi_length,
                      ewi_no_tdc,
                      ewi_no_pieces,
                      TO_CHAR(ewi_ms_piece_actl, 'fm99D000') ewi_ms_piece_actl,
                      ewi_planned_proc,
                      ewi_no_sco_order,
                      ewi_no_sco_item,
                      ewi_id_schedule,
                      ewi_off_cut_remarks,
                      ewi_ts_creation, ewi_sch_shift,
                      nvl(ewi_rwk_ind, 'N') ewi_rwk_ind,
                      ewi_pln_rsn_cd,
                      ewi_pkg_typ,
                      ewi_pkg_rate,
                      ewi_prc1_rate,
                      ewi_prc2_rate,
                      ewi_prc3_rate, ewi_seg_rate,
                      ewi_oth_rate,
                      ewi_tot_rate,
                      ewi_print_batch,
                      ewi_fg_eto_wt,
                      ewi_camp_no,
                      ewi_no_pieces_wip,
                      '' act_thick,
                      '' act_width,
                      '' act_length,
                      ewi_sec2          odia,
                      '' scrp_wt,
                      '' scrp_rsn,
                      '' qa_insp,
                      '' rsn_hold,
                      next_proc,
                      idia,
                      '' sleev_wt,
                      '' slit_sec,
                      CASE
                          WHEN ewi_off_cut_remarks IS NOT NULL THEN
                              'O'
                          ELSE
                              ''
                      END off_cut,
                      '' yard,
                      round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt,
                      inv_loss,
                      '' loc_x,
                      '' loc_y,
                      '' loc_z,
                      '' opr_cmnt,
                      '' mtr_desc,
                      '' yld_str,
                      '' ten_len,
                      ewi_inp_jac_grd   plan_fg_grd,
                      '' rsn_cat,
                      '' rsn_cd,
                      '' rsn_desc,
                      rm_prod,
                      grd_desc,
                      spec,
                      ewi_print_batch   batch_id1,
                      (
                          SELECT
                              f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count)
                          FROM
                              dual
                      ) bundle_id,
                      rm_mat,
                      (
                          SELECT
                              maktx
                          FROM
                              v_makt
                          WHERE
                              mandt = '600'
                              AND matnr = rm_mat
                              AND ROWNUM = 1
                      ) rm_mat_desc,
                      sfg_mat,
                      (
                          SELECT
                              maktx
                          FROM
                              v_makt
                          WHERE
                              mandt = '600'
                              AND matnr = sfg_mat
                              AND ROWNUM = 1
                      ) sfg_mat_desc,
                      fg_mat,
                      (
                          SELECT
                              maktx
                          FROM
                              v_makt
                          WHERE
                              mandt = '600'
                              AND matnr = fg_mat
                              AND ROWNUM = 1
                      ) fg_mat_desc
                  FROM
                      (
                          SELECT
                              ewi_uom,
                              ewi_id_wrk_inst,
                              ewi_id_order_cus,
                              ewi_id_ord_item_cus,
                              ewi_cd_prod,
                              ewi_cd_qlty,
                              ewi_inp_jac_grd,
                              ewi_sec1,
                              ewi_sec2,
                              ewi_length,
                              ewi_no_tdc,
                              ewi_no_pieces,
                              ewi_ms_piece_actl,
                              ewi_planned_proc,
                              ewi_no_sco_order,
                              ewi_no_sco_item,
                              ewi_id_schedule,
                              ewi_off_cut_remarks,
                              ewi_ts_creation,
                              ewi_sch_shift,
                              nvl(ewi_rwk_ind, 'N') ewi_rwk_ind,
                              ewi_pln_rsn_cd,
                              ewi_pkg_typ,
                              ewi_pkg_rate,
                              ewi_prc1_rate,
                              ewi_prc2_rate,
                              ewi_prc3_rate,
                              ewi_seg_rate,
                              ewi_oth_rate,
                              ewi_tot_rate,
                              ewi_print_batch,
                              ewi_fg_eto_wt,
                              ewi_camp_no,
                              ewi_no_pieces_wip,
                              '' act_thick,
                              '' act_width,
                              '' act_length,
                              '' odia,
                              '' scrp_wt,
                              '' scrp_rsn,
                              '' qa_insp,
                              '' rsn_hold,
                              substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc_old,
                              (
                                  SELECT
                                      f_get_nextproc(ewi_planned_proc, b.eom_passed_proc, ewi_cd_process)
                                  FROM
                                      dual
                              ) next_proc,
                              ewi_idia        idia,
                              '' sleev_wt,
                              '' slit_sec,
                              '' off_cut,
                              '' yard,
                              '' loc_x,
                              '' loc_y,
                              '' loc_z,
                              '' opr_cmnt,
                              '' mtr_desc,
                              '' yld_str,
                              '' ten_len,
                              '' plan_fg_grd,
                              '' rsn_cat,
                              '' rsn_cd,
                              '' rsn_desc,
                              ROWNUM rnum,
                              (
                                  SELECT DISTINCT
                                      eom_cd_prod
                                  FROM
                                      v_epa_prodn
                                  WHERE
                                      eom_id_batch IN (
                                          SELECT DISTINCT
                                              eom_id_first_par
                                          FROM
                                              v_epa_prodn
                                          WHERE
                                              eom_id_batch = :batch_id
                                              AND eom_cd_epa = :plant
                                      )
                                      AND eom_cd_epa = b.eom_cd_epa
                              ) rm_prod,
                              (
                                  SELECT
                                      grade
                                  FROM
                                      v_ympct_tub_matl
                                  WHERE
                                      mandt = '600'
                                      AND matnr = a.ewi_fg_matnr
                              ) grd_desc,
                              (
                                  SELECT
                                      spec
                                  FROM
                                      v_ympct_tub_matl
                                  WHERE
                                      mandt = '600'
                                      AND matnr = a.ewi_fg_matnr
                              ) spec,
                              ewi_no_matnr    rm_mat,
                              ewi_sfg_matnr   sfg_mat,
                              ewi_fg_matnr    fg_mat,
                              0 inv_loss
                          FROM
                              v_work_inst   a,
                              v_epa_prodn   b
                          WHERE
                              a.ewi_id_batch = :mbatch
                              AND a.ewi_cd_epa = :plant
                              AND a.ewi_id_batch = b.eom_id_batch
                              AND a.ewi_cd_epa = b.eom_cd_epa
                              AND a.ewi_cd_process = :process
                              AND a.ewi_cd_status = 'CN'
                              AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2)
                              AND ( b.eom_cd_status NOT LIKE '%X'
                                    AND b.eom_cd_status NOT IN (
                                  SELECT DISTINCT
                                      cd_value
                                  FROM
                                      v_codes
                                  WHERE
                                      cd_type = 'EPA320'
                              ) )
                      )
              ) a`
        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        reject("Error!!");
        throw new Error.InternalServerError("Error!");
      }
    });
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const delete_tempprod = async (Plant: any, Batch: any, user: any) => {
  try {

    const sql = `DELETE FROM V_PRODUCTION_TEMP
      WHERE  TPT_USER_ID = :P_USER
      AND  TPT_CD_EPA = :P_PLANT
      AND  TPT_ID_FIRST_PAR = :P_BATCH`;

    let delBind = {
      P_USER: user,
      P_PLANT: Plant,
      P_BATCH: Batch
    }
    return await query.executeQuery(sql, delBind);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const SPCB004_TEMP_Insert = async (ele: any, Plant: any, Batch: any, Process: any, resWt: any, totalNetWt: any,
  ProdDt: any, Shift: any, user: any, uom: any, batchType: any) => {
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
          MILL_SPEED => : MILL_SPEED,
          BENCH_SPEED => : BENCH_SPEED,
          FURNACE_TEMP => : FURNACE_TEMP,
          FURNACE_SPEED => : FURNACE_SPEED,
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
      SLIT_SEC: '',
      SLIT_STATUS: '',
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
      MILL_SPEED: null,    //    mill speed is null
      BENCH_SPEED: null,   //    mill speed is null
      FURNACE_TEMP: null,  //    mill speed is null
      FURNACE_SPEED: null, //    mill speed is null
      BUS_UNIT: 'TUBES',
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
        type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500
      }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const GetMCoilList = async (Plant: any, Process: any, workCenter: any) => {
  try {
    // const sql = `SELECT DISTINCT EWI_ID_BATCH AS BATCH , to_char(max(ewi_ts_creation),'DD-Mon-YYYY HH24:MI:SS') EWI_TS_CREATION FROM V_WORK_INST WHERE EWI_CD_PROCESS=:0 AND EWI_CD_EPA=:1 AND EWI_CD_STATUS='CN' and  eXISTS ( select EOM_ID_Batch from V_EPA_PRODN where eOM_cd_epa=eWI_cd_epa AND EOM_ID_BATCH=EWI_ID_BATCH and EOM_cd_status LIKE '%C') group by ewi_id_batch `;
    const sql = `SELECT DISTINCT ewi_id_batch AS batch, TO_CHAR (MAX (ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS' ) ewi_ts_creation FROM v_work_inst WHERE ewi_cd_process = :0 AND ewi_cd_epa = :1 AND ewi_cd_status = 'CN' AND EXISTS ( SELECT eom_id_batch FROM v_epa_prodn WHERE eom_cd_epa = ewi_cd_epa AND eom_id_batch = ewi_id_batch AND eom_cd_status LIKE '%C') AND EWI_WRK_CENTER_NO = NVL(:2,EWI_WRK_CENTER_NO) GROUP BY ewi_id_batch`
    let binds = [`${Process}`, `${Plant}`, `${workCenter}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
export const GetODIA = async (Plant: any, Process: any) => {
  try {
    //const sql = `SELECT DISTINCT(EWI_SEC2)ODIA FROM V_WORK_INST WHERE EWI_CD_STATUS = 'CN' AND EWI_CD_EPA = :0 And ewi_cd_process = :1`;
    const sql = `SELECT DISTINCT(EWI_SEC2)ODIA FROM V_WORK_INST WHERE EWI_CD_STATUS = 'CN' AND EWI_CD_EPA = :0 And ewi_cd_process = :1`
    let binds = [`${Plant}`, `${Process}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const getShiftStatus = async (req: any) => {
  const { } = req.body;
  try {
    const sql = `select substr(F_Tatadate(sysdate),1,1) shift,substr(F_Tatadate(sysdate),2) prod_dt from dual`;
    let binds = {
    };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getProductionType = async (req: any) => {

  try {
    const sql = `SELECT EPL_PRODUCTION_TYPE FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :Plant AND EPL_CD_PROCESS = :process`;
    const binds = {
      Plant: req.body.Plant,
      process: req.body.Process
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const getBatchCount = async (req: any) => {
  try {
    let mill;
    let bindsMill = {
      plant: req.body.Plant,
      process: req.body.Process,
      mBatch: req.body.MBatch
    };

    let qryMillCode = `  SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant 
      AND PLM_CD_PROCESS = :process
       AND PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST
         WHERE EWI_CD_ePA= PLM_CD_EPA 
         AND EWI_ID_BATCH =:mBatch  
         AND EWI_CD_STATUS ='CN' and ROWNUM=1) 
        AND PLM_ACTIVE_STATUS ='A'`

    let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

    mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : req.body.Process;

    const sql = `SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual`;

    let binds = {
      plant: req.body.Plant,
      mbatch: req.body.MBatch,
      p_prodn_dt: req.body.ProdDate,
      process: req.body.Process,
      mill: mill,
      status: req.body.status,
      count: req.body.count
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const getWorkCenterList = async (req: any) => {
  try {
    let results;

    let esql = `SELECT PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_cD_ePA= :Plant AND PLM_CD_PROCESS = :process order by 1`;
    let ebinds = {
      Plant: req.body.Plant,
      process: req.body.Process
    };
    results = await query.executeQuery(esql, ebinds);
    return results;
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
export const getScrapProductionTable = async (req: any) => {
  try {
    const sql = `SELECT ( SELECT f_scrappdi_tub(:plant, :mbatch, :process, substr(cd_desc, 1, 18), :p_flag) scrap_batch_id FROM dual ) scrap_batch_id, '' idpdi, '' order_id, 0 item, '' rm_prod, '' fg_prod, 'SCRP' qlty, '' grade, '' thk, '' width_odia, '' length1, '0' no_pcs, '' net_wt, '' next_proc, '' rsn_hold, '' hold_desc, '' opr_remarks, substr(cd_desc, 1, 18) material, substr(cd_desc, 19, 70) material_desc, '' sfg_matnr, '' sfg_matnr_desc, '' rm_matnr, '' rm_matnr_desc, '' odia, '' idia FROM v_codes WHERE cd_type = 'EPA196C' AND substr(cd_value, 1, 4) = :plant AND substr(cd_value, 6, 1) = :process ORDER BY CD_DESC1`;
    let binds = {
      Plant: req.body.Plant,
      MBatch: req.body.MBatch,
      P_FLAG: "SCRAP",
      Process: req.body.Process
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}
export const GetBatchDtlforLP_daughter = async (Plant: any, MBatch: any, DBatch: any) => {
  try {
    const sql = `SELECT
      eom_cd_epa            plant,
      eom_id_batch          batchid,
      eom_sec2              odia,
      eom_sec1              thk,
      eom_idia              idia,
      eom_length            length1,
      eom_cd_status         cd_status,
      eom_tdc_actl          grade,
      eom_id_order_cus      orderno,
      eom_id_ord_item_cus   orderitem,
      eom_id_par_coil_no    parent_batch,
      eom_id_first_par      mother_coil,
      eom_cd_next_proc      next_proc,
      eom_no_pieces,
      ewi_no_matnr          rm_material,
      to_char(eom_ts_creation, 'DD/MM/YYYY') eom_ts_creation,
      (
          SELECT
              to_char(epr_dt_prodn_tata, 'DD-MON-YYYY')||' - '||EPR_CD_SHIFT
          FROM
              v_epa_line_prodn
          WHERE
              epr_cd_epa = eom_cd_epa
              AND epr_id_batch = eom_id_batch
              AND epr_cd_process = 'W'
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
      eom_ms_gross_cal,
      nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) eom_ms_gross_cal,
      (
          SELECT
              pph_desc
          FROM
              v_epa_proc_path
          WHERE
              pph_cd_epa = a.eom_cd_epa
              AND pph_cd_proc_path = a.eom_planned_proc
              AND ROWNUM = 1
      ) process_path_desc,
      (
          SELECT
              f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus)
          FROM
              dual
      ) cust_nm,
       EWI_WRK_CENTER_NO
  FROM
      v_epa_prodn   a,
      v_work_inst   b
  WHERE
      a.eom_id_batch = nvl(:DBatch, eom_id_batch)
      AND a.eom_id_par_coil_no = nvl(:MBatch, eom_id_par_coil_no)
      AND a.eom_cd_epa = :Plant
      AND a.eom_cd_epa = b.ewi_cd_epa
      AND a.eom_id_batch = b.ewi_id_batch
      AND eom_cd_status = 'WA'
      --AND ( a.eom_cd_status LIKE '%B' OR a.eom_cd_status LIKE '%C' )
      --AND eom_cd_status NOT IN ( 'VF','VM','VB')
      AND a.eom_cd_qlty_actl <> 'SCRP'
      AND eom_id_batch <> eom_id_first_par
  ORDER BY
      eom_id_batch`

    let binds = {
      Plant: Plant,
      MBatch: MBatch ? MBatch : '',
      DBatch: DBatch ? DBatch : '',
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const getHoldRsnDetails = async (req: any) => {
  try {
    const sql = `SELECT CD_HOLD,CD_DESC FROM V_EPA_HOLD_RSN WHERE CD_COMP='1000' ORDER BY 2`;
    let binds = {
    };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const GetPdiDtlMultiLot = async (Plant: any, Batch: any, Process: any, ProdDate: any, MBatch: any, BusUnit: any, Odia: any, status: any, ele: any) => {
  try {
    let countVal: any;
    let mill: any;
    return new Promise(async function (resolve, reject) {
      let bindsCount = {
        plant: Plant,
        process: Process,
        odia: Odia,
        mbatch: MBatch
      };
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_epa_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.eom_id_batch AND a.ewi_cd_epa = b.eom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.eom_cd_status NOT LIKE '%X' AND b.eom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`
      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      let bindsMill = {
        plant: Plant,
        process: Process,
        MBatch: MBatch
      };

      let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant AND PLM_CD_PROCESS = :process AND PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST WHERE EWI_CD_ePA= PLM_CD_EPA AND EWI_ID_BATCH = :MBatch AND EWI_CD_STATUS ='CN' and ROWNUM=1) AND PLM_ACTIVE_STATUS ='A'`
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
          workinstno: null
        };

        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT eom_cd_prod FROM v_epa_prodn WHERE eom_id_batch IN ( SELECT DISTINCT eom_id_first_par FROM v_epa_prodn WHERE eom_id_batch = :batch_id AND eom_cd_epa = :plant ) AND eom_cd_epa = b.eom_cd_epa ) rm_prod, ( SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) grd_desc, ( SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) spec, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat, 0 inv_loss FROM v_work_inst   a, v_epa_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.eom_id_batch AND a.ewi_cd_epa = b.eom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_id_order_cus = :orderno AND a.ewi_id_ord_item_cus = :orderitem AND a.ewi_id_wrk_inst = NVL(:workinstno,ewi_id_wrk_inst) AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.eom_cd_status NOT LIKE '%X' AND b.eom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`
        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        reject("Error!!");
        throw new Error.InternalServerError("Error!");
      }
    });
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}
export const Insert_Khapoli = async (Plant: any, Batch: any, Process: any, user: any) => {
  try {
    const sql = `call SPCB004_INSERT_SLT ( 
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
        type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500
      }
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const CRTScheduleMerge = async (req: any) => {
  try {
    const { PlanPath, Plant, Process, ORD_ID, ORD_ITM, ORD_QTY, IDIA, ODIA, LENGTH, THICK, GRADE, MATNR, PROS_WT, GALVY_WT, rollchange, MOTHER_BATCH, CL_WT, CL_MATNR, FG_WT, adid, EOP_SFG_MATNR_BOM, P_SCH_TYPE_FL, P_NOMINATE_BATCH, P_NOMINATE_MATNR } = req.body;
    const sql = `call TTSM004_MERGE_SCHD (
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
      CHK_COIL: 'Y',
      PARAM_PLANT_CNT: 1,
      PPH_CD_PROC_PATH: PlanPath,
      NBT_EPL_CD_EPA: Plant,
      NBT_PROC_LINE: Process,
      CHK_ORDER: 'Y',
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
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, },
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const getBatchId = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT EWI_ID_BATCH,EWI_TS_CREATION FROM V_WORK_INST
        WHERE EWI_CD_EPA=:0
        AND EWI_CD_STATUS='CN'
        AND  EWI_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA=EWI_CD_EPA AND EPL_ACTIVITY_NM='SLT')
        ORDER BY EWI_TS_CREATION`

    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const GetInqDetl = async (Plant: any, Process: any, BatchID: any, Status: any, OrdID: any, OrdItm: any, Prod_DT: any) => {
  try {
    var sql = `        SELECT ewi_id_batch,
    ewi_no_pieces,
    ewi_ms_piece_actl,
    ewi_id_order_cus,
    ewi_id_ord_item_cus,
    ewi_cd_status,
    ewi_no_sco_order,
    ewi_no_sco_item,
    ewi_priority,
    ewi_no_pack,
    to_char(ewi_ts_creation, 'DD-MON-YYYY HH24:MI:SS') cr_dt,
    enc_cust_name,
    ewi_id_wrk_inst,
    ewi_id_schedule,
    ewi_sec2,
    ewi_idia,
    ewi_wrk_center_no work_cent,
    ewi_rec_crt_by schd_crt_by,
    to_char(ewi_rec_crt_dt, 'DD-MON-YYYY HH24:MI:SS') schd_crt_dt,
    ewi_planned_proc route,
    ewi_uom,
    nvl(eom_no_matnr, enc_no_matnr) fg_material,
    (SELECT maktx
       FROM v_makt
      WHERE mandt = '600'
        AND matnr = nvl(eom_no_matnr, enc_no_matnr)
        AND ROWNUM = 1) fg_material_desc,
    nvl((SELECT tmm_sfg_mat
          FROM v_tub_matl_mapping
         WHERE tmm_cd_epa = eom_cd_epa
           AND tmm_fg_mat = eom_no_matnr
           AND ROWNUM = 1),
        ' ') sfg_material,
    nvl((SELECT maktx
          FROM v_makt
         WHERE mandt = '600'
           AND matnr = (SELECT tmm_sfg_mat
                          FROM v_tub_matl_mapping
                         WHERE tmm_cd_epa = eom_cd_epa
                           AND tmm_fg_mat = eom_no_matnr
                           AND ROWNUM = 1)),
        ' ') sfg_material_desc,
    nvl((SELECT eic_no_matnr
          FROM v_input_coil
         WHERE eic_cd_epa = eom_cd_epa
           AND eic_id_coil = eom_id_first_par
           AND ROWNUM = 1),
        ' ') rm_material,
    (SELECT (SELECT maktx
               FROM v_makt
              WHERE mandt = '600'
                AND matnr = eic_no_matnr
                AND ROWNUM = 1)
       FROM v_input_coil
      WHERE eic_cd_epa = eom_cd_epa
        AND eic_id_coil = eom_id_first_par
        AND ROWNUM = 1) rm_material_desc,
    ewi_no_tdc tube_grade
FROM v_work_inst, v_end_cust_ord_epa, v_epa_prodn
WHERE ewi_cd_epa = enc_cd_epa
AND ewi_id_order_cus = enc_id_order
AND ewi_id_ord_item_cus = enc_no_item
AND ewi_cd_epa = :plant
AND ewi_id_batch = nvl(:batchid, ewi_id_batch)
AND ewi_cd_process = nvl(:process, ewi_cd_process)
AND ewi_id_order_cus = nvl(:ordid, ewi_id_order_cus)
AND ewi_id_ord_item_cus = nvl(:orditm, ewi_id_ord_item_cus)
AND to_char(ewi_ts_creation, 'DD-MON-YY') =
    nvl(to_char(to_date(:prod_dt, 'DD-MON-YYYY'), 'DD-MON-YY'),
        to_char(ewi_ts_creation, 'DD-MON-YY'))
AND ewi_cd_epa = eom_cd_epa(+)
AND ewi_id_batch = eom_id_batch(+)
AND EWI_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA=EWI_CD_EPA AND EPL_ACTIVITY_NM='SLT')
    `;
    let binds = {
      Plant: Plant,
      Process: Process,
      BatchID: BatchID,
      OrdID: OrdID,
      OrdItm: OrdItm,
      Prod_DT: Prod_DT
    };

    if (Status == "") {
      sql += " and ewi_cd_status in ('WC','CN') "
    } else {
      if (Status == "CN") {
        sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) "
        Object.assign(binds, { status: 'CN' });
      } else {
        sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) "
        Object.assign(binds, { status: 'WC' });
      }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
export const ScheduleDel = async (Plant: any, dt: any) => {
  try {
    const sql = `call C1CEB170_SCHED_DEL (
            CHK_INQ => :CHK_INQ,
            P_EWI_CD_STATUS => :P_EWI_CD_STATUS,
            P_EWI_ID_BATCH => :P_EWI_ID_BATCH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            P_EWI_ID_WRK_INST => :P_EWI_ID_WRK_INST,
            REC_FLAG => :REC_FLAG,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      CHK_INQ: "Y",
      P_EWI_CD_STATUS: dt.EWI_CD_STATUS ?? "",
      P_EWI_ID_BATCH: dt.EWI_ID_BATCH ?? "",
      NBT_EPL_CD_EPA: Plant ?? "",
      P_EWI_ID_WRK_INST: dt.EWI_ID_WRK_INST ?? "",
      REC_FLAG: "F", //CODE FOR FULL DELETION
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
export const ScheduleDelMerge = async (req: any) => {
  try {
    const sql = `call TUBEDBA.C1CEB170_SCHED_DEL_CHILD (
            CHK_INQ => :CHK_INQ,
            P_EWI_CD_STATUS => :P_EWI_CD_STATUS,
            P_EWI_ID_BATCH => :P_EWI_ID_BATCH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            P_EWI_ID_WRK_INST => :P_EWI_ID_WRK_INST,
            P_EWI_ID_BATCH_CHILD => :P_EWI_ID_BATCH_CHILD,
            P_EWI_QTY_BATCH_CHILD => :P_EWI_QTY_BATCH_CHILD,
            REC_FLAG => : REC_FLAG,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      CHK_INQ: "Y",
      P_EWI_CD_STATUS: req.body.dt.EWI_CD_STATUS ?? "",
      P_EWI_ID_BATCH: req.body.dt.EWI_ID_BATCH ?? "",
      NBT_EPL_CD_EPA: req.body.Plant ?? "",
      P_EWI_ID_WRK_INST: req.body.dt.EWI_ID_WRK_INST ?? "",
      P_EWI_ID_BATCH_CHILD: req.body.dt2.COMPONENT_BATCH, // ---CHILD BATCH FROM 2ND WINDOW
      P_EWI_QTY_BATCH_CHILD: req.body.dt2.COMPONENT_BATCH_QTY, //CHILD BATCH QTY FROM 2ND WINDOW
      REC_FLAG: "P", //CODE FOR PARTIAL DELETION
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getWorkCenter = async (req: any) => {
  const { Plant, Process } = req.body;
  try {
    const sql = `SELECT PLM_WCNT_CODE||' , '||PLM_WCNT_DESC FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA=:plant AND PLM_CD_PROCESS = :process AND PLM_ACTIVE_STATUS='A' ORDER BY 1`;
    let binds = {
      plant: Plant,
      process: Process
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getMergeBatchDetails = async (req: any) => {
  try {
    let sql = `select erd_cd_epa,ERD_ID_NEW_BATCH MERGE_BATCH,ERD_ID_BATCH COMPONENT_BATCH,ROUND((ERD_BATCH_QTY*1000),1) COMPONENT_BATCH_QTY , ERD_FLG_SEND_SAP SEND_SAP_FLAG
        , ERD_REC_CRT_DT CREATION_DATE,ERD_REC_CRT_UID CREATED_BY
        from v_epa_random_dtls
        where ERD_CD_ePA=:Plant
        AND ERD_ID_NEW_BATCH=:batchId
        AND ERD_MOV_IND='B' AND ERD_REC_STATUS='A'`

    let binds = {
      Plant: req.body.Plant,
      batchId: req.body.batchId
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const chemChkSlt = async (req: any) => {
  try {

    let Plant = req.body.Plant;
    var MBatch = req.body.BatchId;
    var text = req.body.text1;
    var OrderNo = text.substr(3, 10);
    var OrderItem = text.substr(13, 4);
    const sql = `SELECT TUBEDBA.F_SPCB031_CHEM_CHK_SLT ( '${Plant}', '${OrderNo}', ${OrderItem}, '${MBatch}' ) from dual`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}


