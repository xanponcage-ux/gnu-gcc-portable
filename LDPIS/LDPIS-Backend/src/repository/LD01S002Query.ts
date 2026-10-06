import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import { ResponceData } from "../utils";

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
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSchedules = async (id: any) => {
  try {
    const sql = `select SCH_ID_SCHEDULE ,TO_CHAR(SCH_TS_SCHD_CRT,'YYYY-MM-DD HH24:MI:SS') ,TO_CHAR(SCH_NO_OF_COIL),SCH_MILL_NO
    from v_schedule
    WHERE SCH_SCHD_CLOSE='N'
    AND SCH_CD_STATUS='A'
    ORDER BY SCH_TS_SCHD_CRT DESC`;
    //    let binds = [`${id}`];
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const generateScheduleId = async (req: any) => {
  try {
    console.log("inside pipeid");
    // console.log(req);
    let schd_id;
    // let bindsMill = {
    //   mBatch: req.RM_BATCH,
    // };
    //console.log("bindsmill", bindsMill);
    let qryMillCode = `SELECT SCH_SEQ.NEXTVAL AS SCHD_ID FROM DUAL`;

    let getMillCode = await query.executeQuery(qryMillCode);

    schd_id = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : "1";
    console.log("schd_id", schd_id);
    const sql = `INSERT INTO ldpdba.t_schedule
    (sch_cd_epa, SCH_MILL_NO, sch_id_schedule, sch_schd_close,
     sch_ms_tot_coil, sch_no_of_coil, sch_ts_schd_conf,
     sch_ts_schd_crt, sch_ts_schd_end, sch_ts_schd_strt,
     sch_cd_status, sch_schd_type
    )
    VALUES (:plant,:mill, :schd_id, 'N',
        10, 0, NULL,
        SYSDATE, NULL, SYSDATE,
        'A', 'PIPE'
        )`;

    let binds = {
      plant: req?.plant,
      schd_id: schd_id,
      mill: req?.mill,
    };
    console.log(binds, req);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
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
    let binds = { plant: plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStatus = async (process: any) => {
  try {
    const sql = `select CD_VALUE, CD_DESC
      from v_codes
      where cd_type='TB024' and cd_value = :process
      order by 1`;
    let binds = { process: process };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getResqtyval = async (Plant: any) => {
  try {
    const sql = `SELECT CD_DESC1 FROM V_CODES
    WHERE Cd_TYPE='TB031'
    AND CD_VALUE= :plant `;
    let binds = { plant: Plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScheduleData = async (plant: any, status: any) => {
  try {
    const sql = `
      select lom_ID_BATCH,lom_CD_PROD,lom_CD_QLTY_ACTL,(SELECT DISTINCT NVL(IQL_GRADE_DESC ,'.') GRADE_DESC  FROM V_QUALITY WHERE IQL_CD_QLTY = lom_CD_QLTY_ACTL) GRADE_DESC,lom_SEC1,lom_SEC2,lom_LENGTH,lom_IDIA,'' Planned_Width,  lom_NO_MATNR1 materil_no1, '' material_desc1, lom_MATNR1_QTY lom_MATNR1_QTY, 
      lom_NO_MATNR2 materil_no2,'' material_desc2, lom_MATNR2_QTY , lom_NO_MATNR3 materil_no3,'' material_desc3, 
      lom_MATNR3_QTY , lom_NO_MATNR4 materil_no4, '' material_desc4, lom_MATNR4_QTY, lom_TDC_ACTL,lom_CD_YRD,lom_ID_LOC_X,
      lom_ID_LOC_Y,lom_ID_POS,lom_NO_PIECES,
      (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) UTS fROM V_TC_COIL_TEST where TCO_PROD_NO=lom_ID_BATCH AND TCO_CAST_NO=lom_NO_CAST AND tco_test_parA in ('UTS') AND ROWNUM=1) UTS, 
      (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) YS fROM V_TC_COIL_TEST where TCO_PROD_NO=lom_ID_BATCH AND TCO_CAST_NO=lom_NO_CAST AND tco_test_parA in ('LYS','YS') AND ROWNUM=1)YS ,
      lom_MS_PIECE_ACTL,NVL(lom_MS_GROSS_CAL,0)+NVL(lom_INV_LOSS,0) Gross_cal,(SELECT MAX(IWI_MARK_CUST_DESC) MK_CUSTOMER  FROM V_SAPOMS_WO_ITEM WHERE IWI_ID_ORDER IN (SELECT DISTINCT EIC_WO_NO FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=lom_ID_BATCH	AND EIC_CD_EPA =lom_CD_EPA) AND IWI_ID_ORDER_ITEM  IN (SELECT DISTINCT EIC_ITEM_NO FROM V_INPUT_COIL WHERE EIC_ID_COIL=lom_ID_BATCH And EIC_CD_EPA =lom_CD_EPA))MK_CUSTOMER,
      lom_MS_SCRAP,lom_ID_ORDER_CUS,lom_ID_ORD_ITEM_CUS,''Ord_Typ,lom_CD_STATUS,
      (SELECT DISTINCT EIC_WO_NO MillOrd FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=lom_ID_BATCH	AND EIC_CD_EPA = lom_CD_EPA and rownum=1) MillOrd, 
      (SELECT DISTINCT EIC_ITEM_NO Mill_Item FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=lom_ID_BATCH	AND EIC_CD_EPA =lom_CD_EPA
      and rownum=1) Mill_Item,(SELECT ehr_op_remarks Remarks	FROM v_epa_matl_hold_rls WHERE ehr_remarks='Diverted' AND 
      ehr_ts_release=(SELECT MAX(ehr_ts_release) FROM v_epa_matl_hold_rls WHERE ehr_id_batch= lom_ID_BATCH AND EHR_CD_EPA= lom_CD_EPA AND ehr_remarks='Diverted') AND   
      ehr_id_batch= lom_ID_BATCH AND EHR_CD_EPA = lom_CD_EPA) Remarks, (SELECT MAX(TRIM(REPLACE(CAD_DEF2_COMM,CHR(10),' '))) Salvage_Remark FROM   V_COIL_CARD WHERE  CAD_ID_COIL = lom_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Salvage_Remark,
      (SELECT MAX(TRIM(REPLACE(CAD_CD_TOP_REMARKS,CHR(10),' '))) Top_Remrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = lom_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Top_Remrk,
      (SELECT MAX(TRIM(REPLACE(CAD_CD_BOT_REMARKS,CHR(10),' '))) BottamRemrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = lom_ID_BATCH AND  CAD_DEF2_COMM LIKE 'SLP%') BottamRemrk, 
      (SELECT MAX(TRIM(REPLACE(CAD_FILE_NAME,CHR(10),' '))) FileName FROM V_COIL_CARD WHERE  CAD_ID_COIL = lom_ID_BATCH AND 
      CAD_DEF2_COMM LIKE 'SLP%') FileName,(SELECT MAX(CAD_LST_WRK_CEN) WrkCentr FROM   V_COIL_CARD WHERE  CAD_ID_COIL = lom_ID_BATCH AND  
       CAD_DEF2_COMM LIKE 'SLP%') WrkCentr,lom_NO_MATNR Materil_No,(SELECT NVL(MAKTX,' ') Material_desc FROM V_MAKT WHERE  MATNR = lom_NO_MATNR	 AND  MANDT = (SELECT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'EPA205' AND  
       CD_VALUE = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE  EPL_CD_EPA = lom_CD_EPA))) Material_desc,(SELECT lom_OPER_COMMENT FROM v_ldp_prodn WHERE lom_ID_BATCH = A.lom_ID_BATCH AND lom_CD_EPA <> :Plant AND ROWNUM=1) PRV_SPC_OPR_COMNTS,NVL(ROUND((SYSDATE-lom_TS_CREATION),0),0) Age_Days from v_ldp_prodn A  
       where lom_cd_epa = :Plant and lom_cd_status =nvl( :Status,lom_cd_status) AND lom_MS_GROSS_CAL>=0 `;
    let binds = { plant: plant, status: status };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils = async (req: any) => {
  try {
    let binds = {
      Plant: req.body.Plant,
      //Status: req.body.Status,
    };
    //     let QrygetCoils = `SELECT lom_id_batch, lom_cd_prod, lom_cd_qlty_actl, lom_sec1, lom_sec2,
    //       lom_length, lom_idia, '' planned_width, lom_no_matnr1 materil_no1,
    //       (
    //         SELECT
    //             maktx
    //         FROM
    //             v_makt
    //         WHERE
    //             mandt = '600'
    //             AND matnr = lom_no_matnr
    //             AND ROWNUM = 1
    //     )  material_desc1, lom_matnr1_qty lom_matnr1_qty,
    //       lom_no_matnr2 materil_no2, '' material_desc2, lom_matnr2_qty,
    //       lom_no_matnr3 materil_no3, '' material_desc3, lom_matnr3_qty,
    //       lom_no_matnr4 materil_no4, '' material_desc4, lom_matnr4_qty,
    //       lom_tdc_actl, lom_cd_yrd, lom_id_loc_x, lom_id_loc_y, lom_id_pos,
    //       lom_no_pieces,
    //       (SELECT DISTINCT NVL (tco_test_para_val, 0) uts
    //                   FROM v_tc_coil_test
    //                  WHERE tco_prod_no = lom_id_batch
    //                    AND tco_cast_no = lom_no_cast
    //                    AND tco_test_para IN ('UTS')
    //                    AND ROWNUM = 1) uts,
    //       (SELECT DISTINCT NVL (tco_test_para_val, 0) ys
    //                   FROM v_tc_coil_test
    //                  WHERE tco_prod_no = lom_id_batch
    //                    AND tco_cast_no = lom_no_cast
    //                    AND tco_test_para IN ('LYS', 'YS')
    //                    AND ROWNUM = 1) ys,
    //       lom_ms_piece_actl,
    //       NVL (lom_ms_gross_cal, 0) + NVL (lom_inv_loss, 0) gross_cal,
    //       lom_ms_scrap, lom_id_order_cus, lom_id_ord_item_cus, '' ord_typ,
    //       lom_cd_status,
    //       (SELECT DISTINCT eic_wo_no millord
    //                   FROM v_input_coil
    //                  WHERE eic_id_coil = lom_id_batch
    //                    AND eic_cd_epa = lom_cd_epa
    //                    AND ROWNUM = 1) millord,
    //       (SELECT DISTINCT eic_item_no mill_item
    //                   FROM v_input_coil
    //                  WHERE eic_id_coil = lom_id_batch
    //                    AND eic_cd_epa = lom_cd_epa
    //                    AND ROWNUM = 1) mill_item,
    //       lom_no_matnr materil_no,
    //       (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=lom_no_matnr AND ROWNUM=1) MATERIAL_DESC,
    //       (SELECT eic_mk_customer
    //          FROM v_input_coil
    //         WHERE eic_cd_plant = a.lom_cd_epa
    //           AND eic_id_coil = a.lom_id_batch) mk_customer,
    //       lom_no_cast cast_no
    // FROM v_ldp_prodn a
    // WHERE lom_cd_epa = :plant AND lom_cd_status IN ('1F')
    // AND lom_MS_PIECE_ACTL >= 0`;

    let QrygetCoils = ` SELECT lom_id_batch,LOM_ID_PAR_COIL_NO, lom_cd_prod, lom_cd_qlty_actl, lom_sec1, lom_sec2,
      lom_length, lom_idia, '' planned_width, 
      (
        SELECT
            maktx
        FROM
            v_makt
        WHERE
            mandt = '600'
            AND matnr = lom_no_matnr
            AND ROWNUM = 1
    )  material_desc1, 
      lom_tdc_actl, lom_cd_yrd, lom_id_loc_x, lom_id_loc_y, lom_id_pos,
      lom_no_pieces,
      (SELECT DISTINCT NVL (tco_test_para_val, 0) uts
                  FROM v_tc_coil_test
                 WHERE tco_prod_no = lom_id_first_par
                   AND tco_cast_no = lom_no_cast
                   AND tco_test_para IN ('UTS')
                   AND ROWNUM = 1) uts,
      (SELECT DISTINCT NVL (tco_test_para_val, 0) ys
                  FROM v_tc_coil_test
                 WHERE tco_prod_no = lom_id_first_par
                   AND tco_cast_no = lom_no_cast
                   AND tco_test_para IN ('LYS', 'YS')
                   AND ROWNUM = 1) ys,
      lom_ms_piece_actl,
      NVL (lom_ms_gross_cal, 0) gross_cal,
      --lom_ms_scrap, 
      lom_id_order_cus, lom_id_ord_item_cus, '' ord_typ,
      lom_cd_status,
      (SELECT DISTINCT eic_wo_no millord
                  FROM v_input_coil
                 WHERE eic_id_coil = lom_id_first_par
                   AND eic_cd_epa = lom_cd_epa
                   AND ROWNUM = 1) millord,
      (SELECT DISTINCT eic_item_no mill_item
                  FROM v_input_coil
                 WHERE eic_id_coil = lom_id_first_par
                   AND eic_cd_epa = lom_cd_epa
                   AND ROWNUM = 1) mill_item,
      lom_no_matnr materil_no,
      (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=lom_no_matnr AND ROWNUM=1) MATERIAL_DESC,
      (SELECT eic_mk_customer
         FROM v_input_coil
        WHERE eic_cd_plant = a.lom_cd_epa
          AND eic_id_coil = a.lom_id_first_par) mk_customer,
          NVL(ROUND((SYSDATE-lom_TS_CREATION),0),0) AGE_DAYS,
      lom_no_cast cast_no
      FROM v_ldp_prodn a
      WHERE lom_cd_epa = :Plant AND lom_cd_status IN ('1F')
      AND lom_MS_PIECE_ACTL >= 0 `;

    if (req.body.BatchId != "") {
      QrygetCoils += " AND lom_ID_BATCH = :BatchId ";
      Object.assign(binds, { BatchId: req.body.BatchId });
    }

    if (req.body.ThickFR != "") {
      QrygetCoils +=
        " AND lom_SEC1 BETWEEN NVL(:ThickFR,lom_SEC1) AND NVL(:ThickTo,NVL(:ThickFR,lom_SEC1))";
      Object.assign(binds, { ThickFR: req.body.ThickFR });
      Object.assign(binds, { ThickTo: req.body.ThickTo });
    }

    if (req.body.WidthFr != "") {
      QrygetCoils +=
        " AND lom_SEC2 BETWEEN NVL(:WidthFr,lom_SEC2) AND NVL(:WidthTo,NVL(:WidthFr,lom_SEC2))";
      Object.assign(binds, { WidthFr: req.body.WidthFr });
      Object.assign(binds, { WidthTo: req.body.WidthTo });
    }

    QrygetCoils += " order by materil_no";
    console.log("QrygetCoils: ", QrygetCoils);
    return await query.executeQuery(QrygetCoils, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrders = async (req: any) => {
  try {
    let binds = {
      BATCHID: req.body?.[0].LOM_ID_BATCH,
    };
    // console.log(binds);
    // console.log(req.body);
    // console.log(req.body?.[0]);
    let QrygetCoils = `
    SELECT DISTINCT enc_cd_epa, ROUND (SYSDATE - enc_dt_ord_create) agening_days,
    enc_id_order, enc_no_item, enc_sales_off sales_office,
    enc_ship_to_prty_desc sold_cust_nm, enc_mark_cust_name,
    enc_no_matnr fg_material,
    NVL ((SELECT maktx
            FROM v_makt
           WHERE mandt = '600' AND matnr = enc_no_matnr AND ROWNUM = 1),
         ' '
        ) fg_material_desc,
    grade
    ,enc_sales_qty_uom sales_unit
    ,enc_sales_qty ord_qnty_in_sales_unit
    ,enc_ord_quantity order_qty_mt,
    (SELECT f_dispatch (a.enc_cd_epa,
                        a.enc_id_order,
                        a.enc_no_item
                       )
       FROM DUAL) dispatched_fg_mt,
    (SELECT f_bal_to_schd (a.enc_cd_epa, a.enc_id_order,
                           a.enc_no_item)
       FROM DUAL) bts,
    (SELECT F_BAL_TO_ROLL (a.enc_cd_epa, a.enc_id_order,
                           a.enc_no_item)
       FROM DUAL) btr,
    ((SELECT f_wip (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
        FROM DUAL) 
    ) wip_qty,
    (  (SELECT f_fg_stock (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
          FROM DUAL)
    ) fg_stock,
    ' ' overall_delv_status, enc_print_spec material_grp, enc_odia odia,
    enc_idia idia, enc_sec1_max thick, enc_length_max lngth,
    enc_no_tdc tdc, enc_cd_prod prod_cd, enc_cd_qlty qlty_cd,
    enc_order_type,
    TO_CHAR (enc_dt_ord_create, 'DD-MON-YY HH24:MI:SS') enc_dt_ord_create,
    enc_sec2_max width, item_type, mill, draw_type, geometry, CATEGORY,
    spec, sur_finish, end_finish, CLASS, ins_code, out_dia, in_dia,
--               (SELECT f_alloted (a.enc_cd_epa,
--                                  a.enc_id_order,
--                                  a.enc_no_item
--                                 )
--                  FROM DUAL) alloted_qty,
--               (SELECT f_freestock (a.enc_cd_epa,
--                                    a.enc_id_order,
--                                    a.enc_no_item
--                                   )
--                  FROM DUAL) freestock_qty,
    NVL (tmm_sfg_mat, ' ') tmm_sfg_mat,
    NVL (tmm_sfg_mat_desc, ' ') tmm_sfg_mat_desc,
    NVL (tmm_rm_mat, ' ') tmm_rm_mat,
    NVL (tmm_rm_mat_desc, ' ') tmm_rm_mat_desc,
--                 enc_ord_quantity - ((SELECT f_fg_stock (a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL)) btf,
--                 enc_ord_quantity - (  ((SELECT f_fg_stock (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)      FROM DUAL))
--                  + ((SELECT f_wip (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
--                        FROM DUAL))
--                 ) btr,
--                 enc_ord_quantity
--               - (  ((SELECT f_fg_stock (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
--                        FROM DUAL))
--                  + ((SELECT f_wip (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
--                        FROM DUAL))
--                  + (SELECT f_alloted (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
--                       FROM DUAL)
--                 ) bta               
    enc_matnr_spec matnr_spec, enc_matnr_ip matnr_ip
FROM v_end_cust_ord_epa a,v_ympct_tub_matl,v_tub_matl_mapping,v_ldp_prodn
WHERE enc_no_matnr = matnr(+)
AND  tmm_cd_epa = enc_cd_epa
AND tmm_fg_mat = enc_no_matnr
AND TMM_RM_MAT = lom_NO_MATNR
AND lom_ID_BATCH = NVL(:BATCHID,lom_ID_BATCH)
AND enc_st_order = 'A'
AND enc_cd_epa = '0780'
AND (SELECT f_bal_to_schd (a.enc_cd_epa, a.enc_id_order, a.enc_no_item)
       FROM DUAL) > 0
AND NVL (tmm_priority_no, 1) = '1'
ORDER BY ENC_ID_ORDER,ENC_NO_ITEM`;

    //console.log("QrygetCoils: ", QrygetCoils);
    return await query.executeQuery(QrygetCoils, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdersNonBOM = async (req: any) => {
  try {
    let binds = {
      batchid: req.body?.[0].LOM_ID_BATCH, // Bind batch ID
    };

    // // console.log(binds);
    // // console.log(req.body);

    // // Step 1: Execute the initial query to fetch thickness and width ranges
    // const QryFGMAT = `
    // SELECT
    //     TMM_FG_MAT,
    //     THICKNESS,
    //     OUT_DIA AS WIDTH,
    //     THICKNESS - NVL((THICKNESS * (PTT_TOL_PER_MIN / 100)),0) AS THICKNESS_MIN,
    //     THICKNESS + NVL((THICKNESS * (PTT_TOL_PER_MAX / 100)),0) AS THICKNESS_MAX,
    //     DECODE(LOM_ID_FIRST_PAR,:batchid,NVL(OUT_DIA+(SELECT TO_NUMBER(CD_VALUE) FROM V_CODES WHERE CD_TYPE='TB044' AND CD_DESC='WIDTH_MIN_TOLERANCE'),0),OUT_DIA) AS WIDTH_MIN,    -- 5 SHOULD BE MAINTAINED IN V_CODES
    //     DECODE(LOM_ID_FIRST_PAR,:batchid,NVL(OUT_DIA+(SELECT TO_NUMBER(CD_VALUE) FROM V_CODES WHERE CD_TYPE='TB044' AND CD_DESC='WIDTH_MAX_TOLERANCE'),0),OUT_DIA)  AS WIDTH_MAX  -- 15 SHOULD BE MAINTAINED IN V_CODES
    //   FROM
    //     v_ympct_tub_matl,
    //     v_tub_matl_mapping,
    //     v_ldp_prodn,
    //     V_PIPE_THK_TOLERANCE,
    //     V_PIPE_WT_TOLERANCE
    //   WHERE
    //     tmm_fg_mat = matnr(+)
    //     AND tmm_rm_mat = lom_no_matnr
    //     AND SPEC = PTT_SPEC(+)
    //     AND SPEC = PWT_SPEC(+)
    //     AND lom_id_batch = NVL(:batchid, lom_id_batch)
    //     AND NVL(tmm_priority_no, 1) = '1'
    // `;

    // const fgMatResults = await query.executeQuery(QryFGMAT, binds); // Execute the query for thickness/width ranges

    // // Combine all rows fetched during different iterations
    // let allCoilResults: any[] = []; // Array to hold results from all iterations

    // // Step 2: Loop through results and fetch orders based on ranges

    // for (const row of fgMatResults.rows) {
    //   // Map `row` array to readable variables based on metadata
    //   const [
    //     TMM_FG_MAT,
    //     THICKNESS,
    //     WIDTH,
    //     THICKNESS_MIN,
    //     THICKNESS_MAX,
    //     WIDTH_MIN,
    //     WIDTH_MAX,
    //   ] = row;

    // Dynamically bind thickness and width values
    // const additionalBinds = {
    //   TMM_FG_MAT,
    //   THICKNESS_MIN,
    //   THICKNESS_MAX,
    //   WIDTH_MIN,
    //   WIDTH_MAX,
    // };
    console.log(binds, "Hello batch");
    const QrygetCoils = `
      SELECT DISTINCT 
      enc_cd_epa, 
      ROUND(SYSDATE - enc_dt_ord_create) aging_days,
      enc_id_order, 
      enc_no_item, 
      enc_sales_off sales_office,
      enc_ship_to_prty_desc sold_cust_nm, 
      enc_mark_cust_name,
      enc_no_matnr fg_material,
      NVL(
          (SELECT maktx 
           FROM v_makt
           WHERE mandt = '600' AND matnr = enc_no_matnr AND ROWNUM = 1),
          ' '
      ) fg_material_desc,
      F.grade, 
      enc_sales_qty_uom sales_unit,
      enc_sales_qty ord_qnty_in_sales_unit,
      enc_ord_quantity order_qty_mt,
      (SELECT f_dispatch(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) dispatched_fg_mt,
      (SELECT f_bal_to_schd(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) bts,
      (SELECT f_bal_to_roll(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) btr,
      (SELECT f_wip(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) wip_qty,
      (SELECT f_fg_stock(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) fg_stock,
      ' ' overall_delv_status, 
      enc_print_spec material_grp,
      enc_odia odia, 
      enc_idia idia, 
      enc_sec1_max thick,
      enc_length_max lngth, 
      enc_no_tdc tdc, 
      enc_cd_prod prod_cd,
      enc_cd_qlty qlty_cd, 
      enc_order_type,
      TO_CHAR(enc_dt_ord_create, 'DD-MON-YY HH24:MI:SS') enc_dt_ord_create,
      enc_sec2_max width, 
      F.item_type, 
      F.mill, 
      F.draw_type, 
      F.geometry, 
      F.CATEGORY, 
      F.spec, 
      F.sur_finish, 
      F.end_finish, 
      F.CLASS, 
      F.ins_code, 
      F.out_dia, 
      F.in_dia, 
      enc_matnr_spec matnr_spec,
      enc_matnr_ip matnr_ip,
      NVL (tmm_sfg_mat, ' ') tmm_sfg_mat,
      NVL (tmm_sfg_mat_desc, ' ') tmm_sfg_mat_desc,
      'NONBOM' TMM_RM_MAT
      from V_TUB_MATL_MAPPING M,YMT_MATCHAR R,V_YMPCT_TUB_MATL F,V_LDP_PRODN,V_PIPE_THK_TOLERANCE,V_END_CUST_ORD_EPA a
      WHERE LOM_ID_BATCH=:batchid
      AND R.SEC2_MAX< LOM_SEC2+(select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB033') 
      AND  R.SEC2_MAX> LOM_SEC2-(select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB033')
      AND TMM_RM_MAT=R.MATNR
      AND TMM_FG_MAT=F.MATNR
      AND TMM_RM_MAT <>LOM_NO_MATNR
      AND ENC_CD_EPA='0780'
      AND ENC_NO_MATNR=TMM_FG_MAT
      AND F.SPEC = PTT_SPEC(+)
      AND F.SPEC IN (select RSM_SPEC from V_RMTDC_SPEC_MAPPING 
      WHERE RSM_NO_TDC=(select LOM_TDC_ACTL FROM V_LDP_PRODN WHERE LOM_ID_BATCH=:batchid))     
      AND (F.THICKNESS - NVL((F.THICKNESS * (PTT_TOL_PER_MIN / 100)),0) ) <=LOM_SEC1 
      AND (F.THICKNESS + NVL((F.THICKNESS * (PTT_TOL_PER_MAX / 100)),0))>=LOM_SEC1
      AND ENC_ST_ORDER='A'
          AND ENC_SLIT_PLAN ='TUBE'
          AND (SELECT f_bal_to_schd (a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM DUAL) > 0
        ORDER BY enc_id_order, enc_no_item
      `;

    return await query.executeQuery(QrygetCoils, binds);
    //   const coilResultsArray = await ResponceData(coilResults);

    //   // Debug: Log raw and filtered results
    //   console.log("Raw Coil Results:", coilResultsArray, additionalBinds);

    //   if (coilResultsArray && coilResultsArray?.length > 0) {
    //     // Filter out empty or undefined rows
    //     const validCoilResults = coilResultsArray.filter(
    //       (row: any) => row && Object.keys(row).length > 0
    //     );

    //     console.log("Filtered Valid Results:");

    //     // Concatenate valid coil results
    //     allCoilResults = [...allCoilResults, ...validCoilResults];
    //   }
    // }
    // Optionally, return combined results
    // console.log("All Coil Results Combined: ", allCoilResults);
    //return allCoilResults;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
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
      P_TEXT2: "",
      P_TEXT3: "",
      P_TEXT4: "",
      P_TEXT5: "",
      P_TEXT6: "",
      P_TEXT7: "",
      P_TEXT8: "",
      P_TEXT9: "",
      P_TEXT10: "",
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

// export const confirm2 = async (req: any) => {
//   try {
//     let sql = `call SPCB031_CONFIRM_1(
//         P_MANDT => :P_MANDT,
//         P_PLANT => :P_PLANT,
//         P_BATCHID => :P_BATCHID,
//         P_PROC_LINE => :P_PROC_LINE,
//         P_LOOP_CNT => :P_LOOP_CNT,
//         P_TEXT1 => :P_TEXT1,
//         P_TEXT2 => :P_TEXT2,
//         P_TEXT3 => :P_TEXT3,
//         P_TEXT4 => :P_TEXT4,
//         P_TEXT5 => :P_TEXT5,
//         P_TEXT6 => :P_TEXT6,
//         P_TEXT7 => :P_TEXT7,
//         P_TEXT8 => :P_TEXT8,
//         P_TEXT9 => :P_TEXT9,
//         P_TEXT10 => :P_TEXT10,
//         P_YIELDPER => :P_YIELDPER,
//         P_YLDSMETUP => :P_YLDSMETUP,
//         LS_OUT_FLAG => :LS_OUT_FLAG
//       )`;

//     let binds = {
//       P_MANDT: req.body.mandt,
//       P_PLANT: req.body.Plant,
//       P_BATCHID: req.body.BatchId,
//       P_PROC_LINE: req.body.ProcLine,
//       P_LOOP_CNT: req.body.loop_cnt,
//       P_TEXT1: "",
//       P_TEXT2: "",
//       P_TEXT3: "",
//       P_TEXT4: "",
//       P_TEXT5: "",
//       P_TEXT6: "",
//       P_TEXT7: "",
//       P_TEXT8: "",
//       P_TEXT9: "",
//       P_TEXT10: "",
//       P_YIELDPER: null,
//       P_YLDSMETUP: "",
//       LS_OUT_FLAG: {
//         type: oracledb.STRING,
//         dir: oracledb.BIND_OUT,
//         maxSize: 500,
//       },
//     };
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const GetOrdFilter = async (
  plant: any,
  ordid: any,
  orditem: any,
  ordtdc: any,
  ordtype: any,
  ordthick: any,
  ordwidth: any
) => {
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
    nvl(SUM(DECODE(lom_cd_status, 'WL', lom_ms_gross_cal)),0) desp,
    nvl(SUM(DECODE(lom_cd_status, 'WB', lom_ms_gross_cal)), 0) displ,
    nvl(SUM(DECODE(substr(lom_cd_status, 2, 1), 'B', lom_ms_gross_cal)), 0) linked,
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
    v_ldp_prodn
WHERE
    enc_cd_epa = :plant
    AND enc_order_type = nvl(:ordtype, enc_order_type)
    AND enc_st_order = 'A'
    AND enc_id_order LIKE '002%'
    AND lom_id_order_cus (+) = enc_id_order
    AND lom_id_ord_item_cus (+) = enc_no_item
    AND enc_slit_plan='SLIT'`;
    if (ordid && ordid != "") {
      sql += " AND enc_id_order LIKE nvl('%'|| :ordid || '%', '%')";
      Object.assign(binds, { ordid: ordid });
    }
    if (orditem && orditem != "") {
      sql += " AND enc_no_item = nvl(:orditem, enc_no_item)";
      Object.assign(binds, { orditem: orditem });
    }
    if (ordtdc && ordtdc != "") {
      sql += " AND nvl(enc_no_tdc, ' ') = nvl(:ordtdc, nvl(enc_no_tdc, ' '))";
      Object.assign(binds, { ordtdc: ordtdc });
    }
    if (ordthick && ordthick != "") {
      sql += "  AND :ordthick BETWEEN enc_sec1_min AND enc_sec1_max";
      Object.assign(binds, { ordthick: ordthick });
    }
    if (ordwidth && ordwidth != "") {
      sql += " AND :ordwidth BETWEEN enc_sec2_min AND enc_sec2_max";
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
    enc_cd_qlty `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const specCheck = async (batch: any, order: any, item: any) => {
  try {
    console.log("specCheck inputs:", batch, order, item);

    // Step 1: Get SPEC using query
    const specQuery = `
      SELECT SPEC 
      FROM V_YMPCT_TUB_MATL, V_END_CUST_ORD_EPA 
      WHERE ENC_ID_ORDER = :ORDER_ID 
        AND ENC_NO_ITEM = :ITEM 
        AND ENC_NO_MATNR = MATNR
    `;

    const specResult: any = await query.executeQuery(specQuery, {
      ORDER_ID: order,
      ITEM: item,
    });

    let spec = null;

    if (specResult?.rows && specResult.rows.length > 0) {
      spec = specResult.rows[0][0]; // assuming SPEC is first column
    }

    console.log("Fetched SPEC:", spec);

    // If SPEC not found, return error
    if (!spec) {
      return {
        outBinds: { LS_OUT_FLAG: "N-SPEC NOT FOUND" },
      };
    }

    // Step 2: Call Oracle function
    const funcSql = `
      BEGIN
        :result := LDPDBA.F_CHEM_CHK_PIPE_SPEC(
          P_PLANT => :P_PLANT,
          P_COILID => :P_COILID,
          P_ORD_SPEC => :P_ORD_SPEC
        );
      END;
    `;

    const binds = {
      result: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 500,
      },
      P_PLANT: "0780",
      P_COILID: batch,
      P_ORD_SPEC: spec,
    };

    const result = await query.executeQuery(funcSql, binds);

    console.log("specCheck function result:", result);

    return {
      outBinds: {
        LS_OUT_FLAG: result.outBinds.result,
      },
    };
  } catch (error) {
    console.error("specCheck error:", error);
    return {
      outBinds: { LS_OUT_FLAG: "N-ERROR IN SPEC CHECK" + error },
    };
  }
};

export const confirm = async (req: any) => {
  try {
    console.log(req);
    const sql = `call LDPDBA.LD01B003(
            CHK_COIL => :CHK_COIL,
            PPH_CD_PROC_PATH => :PPH_CD_PROC_PATH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            NBT_PROC_LINE => :NBT_PROC_LINE,
            CHK_ORDER => :CHK_ORDER,
            NBT_CUS_ORD => :NBT_CUS_ORD,
            NBT_ITEM => :NBT_ITEM,
            NBT_ORD_QTY => :NBT_ORD_QTY,
            NBT_MATNR => :NBT_MATNR,
            NBT_ROLLCHAIN => :NBT_ROLLCHAIN,
            NBT_MOTHER_BATCH => :NBT_MOTHER_BATCH,
            NBT_CL_MATNR => :NBT_CL_MATNR,
            NBT_FG_WT => :NBT_FG_WT,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_SCHED_COUNT => :P_SCHED_COUNT,
            P_PLNG_REMARKS => :P_PLNG_REMARKS,
            P_SCHEDULE_ID => :P_SCHEDULE_ID,
            P_BOM_FLAG =>  :P_BOM_FLAG,
            NBT_NO_OF_TUBES => :NBT_NO_OF_TUBES,
            LS_OUT_FLAG => :LS_OUT_FLAG
        )`;
    const binds = {
      CHK_COIL: req?.CHK_COIL ?? "",
      PPH_CD_PROC_PATH: req?.PPH_CD_PROC_PATH ?? "",
      NBT_EPL_CD_EPA: req?.NBT_EPL_CD_EPA ?? "",
      NBT_PROC_LINE: req?.NBT_PROC_LINE ?? "",
      CHK_ORDER: req?.CHK_ORDER ?? "",
      NBT_CUS_ORD: req?.NBT_CUS_ORD ?? "",
      NBT_ITEM: req?.NBT_ITEM ?? "",
      NBT_ORD_QTY: req?.NBT_ORD_QTY ?? "",
      NBT_MATNR: req?.NBT_MATNR ?? "",
      NBT_ROLLCHAIN: req?.NBT_ROLLCHAIN ?? "",
      NBT_MOTHER_BATCH: req?.NBT_MOTHER_BATCH ?? "",
      NBT_CL_MATNR: req?.NBT_CL_MATNR ?? "",
      NBT_FG_WT: req?.NBT_FG_WT ?? "",
      P_SFG_MATNR: req?.P_SFG_MATNR ?? "",
      P_PLNG_REMARKS: req?.P_PLNG_REMARKS ?? "",
      P_SCHED_COUNT: req?.P_SCHED_COUNT,
      P_SCHEDULE_ID: req?.scheduleId ?? "1",
      P_BOM_FLAG: req?.BOM_FLAG,
      NBT_NO_OF_TUBES: req?.NBT_NO_OF_TUBES,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    let result = await query.executeQuery(sql, binds);
    console.log("resultTemp: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const confirmMain = async (req: any) => {
  try {
    console.log(req);
    const sql = `call LDPDBA.LD01B03A(
      NBT_EPL_CD_EPA =>: NBT_EPL_CD_EPA,
      NBT_PROC_LINE =>: NBT_PROC_LINE,
      NBT_MOTHER_BATCH =>: NBT_MOTHER_BATCH,
      LS_OUT_FLAG =>: LS_OUT_FLAG
        )`;
    const binds = {
      NBT_EPL_CD_EPA: "0780",
      NBT_PROC_LINE: "1",
      NBT_MOTHER_BATCH: req,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("sql: ", sql);
    // return await query.executeQuery(sql, binds);
    let result = await query.executeQuery(sql, binds);
    console.log("resultMain: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const delete_tempsched = async (req: any) => {
  try {
    const sql = `DELETE FROM V_TEMP_SCHD_10
    WHERE TSH_ID_BATCH  = :Batch
    AND TSH_CD_EPA      = '0780'`;
    let binds = { Batch: req };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdTyp = async () => {
  try {
    const sql = `SELECT CD_VALUE FROM V_CODES
    WHERE CD_TYPE='TB005'
    ORDER BY 1`;
    // let binds = { plant: plant }
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchDtl = async (
  Plant: any,
  Batch: any,
  ProcLine: any,
  workcenter: any
) => {
  try {
    if (ProcLine == "M") {
      let sql = `SELECT lom_id_batch, lom_cd_prod, lom_cd_qlty_actl, lom_sec1, lom_sec2, lom_length, lom_tdc_actl, lom_ms_piece_actl     input_wt_old, nvl(decode(lom_uom, 'KG', round((lom_ms_piece_actl / 1000), 3), lom_ms_piece_actl), 0) input_wt, lom_cd_status, nvl(lom_ms_gross_cal, 0) lom_ms_gross_cal_old, nvl(decode(lom_uom, 'KG', round((lom_ms_gross_cal / 1000), 3), lom_ms_gross_cal), 0) lom_ms_gross_cal, lom_cd_next_proc, ( SELECT substr(lom_planned_proc, instr(lom_planned_proc, :procline) + 1, 1) FROM dual ) next_proc_old, ( SELECT f_get_nextproc(lom_planned_proc, lom_passed_proc, :procline) FROM dual ) next_proc, nvl(lom_ms_scrap, 0) lom_ms_scrap, ( lom_ms_piece_actl - lom_ms_gross_cal ) proc_wt_old, ( ( nvl(decode(lom_uom, 'KG', round((lom_ms_piece_actl / 1000), 3), lom_ms_piece_actl), 0) ) - ( nvl(decode(lom_uom, 'KG', round ((lom_ms_gross_cal / 1000), 3), lom_ms_gross_cal), 0) ) ) proc_wt, lom_id_first_par, EWI_MS_INPUT plan_wt, round(nvl(ewi_ms_piece_actl, 0), 3) schd_wt, lom_planned_proc, ewi_id_order_cus      cust_ord, ewi_id_ord_item_cus   cust_item, to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt, ewi_wrk_center_no     work_center, ewi_id_wrk_inst, nvl(ewi_remarks, ' ') planning_remarks, ( SELECT f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus) FROM dual ) cust_nm, ewi_no_matnr          rm_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_no_matnr ) rm_material_desc, ewi_sfg_matnr         sfg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_sfg_matnr ) sfg_material_desc, ewi_fg_matnr          fg_material, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = ewi_fg_matnr ) fg_material_desc, ewi_no_tdc            grade, enc_print_spec        print_spec, enc_sec1_max          ord_thk, enc_sec2_max          ord_odia, enc_idia              ord_idia, enc_length_min        ord_min_length, enc_length_max        ord_max_length FROM v_ldp_prodn          a, v_work_inst          b, v_end_cust_ord_epa   c WHERE a.lom_cd_epa = b.ewi_cd_epa AND a.lom_id_batch = b.ewi_id_batch AND b.ewi_id_order_cus = c.enc_id_order AND b.ewi_id_ord_item_cus = c.enc_no_item AND lom_cd_epa = :plant AND lom_id_batch = nvl(:batch, lom_id_batch) AND lom_cd_status = 'MC' AND ewi_cd_status = 'CN' AND ewi_cd_process = :procline AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no) ORDER BY ewi_cd_epa, ewi_wrk_center_no, lom_planned_proc, ewi_no_matnr, ewi_no_tdc`;
      let binds = {
        plant: Plant,
        batch: Batch,
        procLine: ProcLine,
        workcenter: workcenter,
      };
      return await query.executeQuery(sql, binds);
    } else {
      let sql = `select  ewi_cd_epa,
          lom_id_batch,
          lom_cd_prod,
          lom_cd_qlty_actl,
          lom_sec1,
          lom_sec2,
          lom_length,
          lom_tdc_actl,
          lom_ms_piece_actl input_wt_old,
          nvl(DECODE(lom_uom, 'KG', round((lom_ms_piece_actl / 1000), 3), lom_ms_piece_actl),
          
          0
          
           ) input_wt,
          lom_cd_status,
          nvl(lom_ms_gross_cal, 0) lom_ms_gross_cal_old,
          nvl(DECODE(lom_uom, 'KG', round((lom_ms_gross_cal / 1000), 3), lom_ms_gross_cal),
          
          0) lom_ms_gross_cal,
          lom_cd_next_proc,
          
           (
              SELECT
                  substr(lom_planned_proc, instr(lom_planned_proc, :procline) + 1,
          
           1)
              FROM
                  dual
          ) next_proc_old,
          (
              SELECT
                  f_get_nextproc(lom_planned_proc, lom_passed_proc, :procline)
              FROM
                  dual
          ) next_proc,
          nvl(lom_ms_scrap, 0) lom_ms_scrap,
          ( lom_ms_piece_actl - lom_ms_gross_cal ) proc_wt_old,
          ( ( nvl(DECODE(lom_uom, 'KG', round((lom_ms_piece_actl / 1000), 3), lom_ms_piece_actl),
          
          0) ) - ( nvl(DECODE(lom_uom, 'KG', round((lom_ms_gross_cal
          / 1000), 3), lom_ms_gross_cal),
          
          0) ) ) proc_wt,
          lom_id_first_par,
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
          lom_planned_proc,
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
          
          FROM v_ldp_prodn a,
                                             v_work_inst b,
                                             v_end_cust_ord_epa c
          WHERE
              a.lom_cd_epa = b.ewi_cd_epa
              AND a.lom_id_batch = b.ewi_id_batch
                  AND b.ewi_id_order_cus = c.enc_id_order
                      AND b.ewi_id_ord_item_cus = c.enc_no_item
                          AND lom_cd_epa = :plant
                              AND lom_id_batch = nvl(:batch, lom_id_batch)
                                  AND ewi_cd_status = 'CN'
                                      AND ewi_cd_process = :procline
                                          AND ewi_wrk_center_no = nvl(:workcenter, b.ewi_wrk_center_no)
                                          and rownum =1
          
          ORDER by ewi_cd_epa,
                ewi_wrk_center_no,
                lom_planned_proc,
                ewi_no_matnr,
                ewi_no_tdc`;
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
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_ldp_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.lom_id_batch AND a.ewi_cd_epa = b.lom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.lom_cd_status NOT LIKE '%X' AND b.lom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
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
                                      f_get_nextproc(ewi_planned_proc, b.lom_passed_proc, ewi_cd_process)
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
                                      lom_cd_prod
                                  FROM
                                      v_ldp_prodn
                                  WHERE
                                      lom_id_batch IN (
                                          SELECT DISTINCT
                                              lom_id_first_par
                                          FROM
                                              v_ldp_prodn
                                          WHERE
                                              lom_id_batch = :batch_id
                                              AND lom_cd_epa = :plant
                                      )
                                      AND lom_cd_epa = b.lom_cd_epa
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
                              v_ldp_prodn   b
                          WHERE
                              a.ewi_id_batch = :mbatch
                              AND a.ewi_cd_epa = :plant
                              AND a.ewi_id_batch = b.lom_id_batch
                              AND a.ewi_cd_epa = b.lom_cd_epa
                              AND a.ewi_cd_process = :process
                              AND a.ewi_cd_status = 'CN'
                              AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2)
                              AND ( b.lom_cd_status NOT LIKE '%X'
                                    AND b.lom_cd_status NOT IN (
                                  SELECT DISTINCT
                                      cd_value
                                  FROM
                                      v_codes
                                  WHERE
                                      cd_type = 'EPA320'
                              ) )
                      )
              ) a`;
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
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMCoilList = async (
  Plant: any,
  Process: any,
  workCenter: any
) => {
  try {
    // const sql = `SELECT DISTINCT EWI_ID_BATCH AS BATCH , to_char(max(ewi_ts_creation),'DD-Mon-YYYY HH24:MI:SS') EWI_TS_CREATION FROM V_WORK_INST WHERE EWI_CD_PROCESS=:0 AND EWI_CD_EPA=:1 AND EWI_CD_STATUS='CN' and  eXISTS ( select lom_ID_Batch from v_ldp_prodn where lom_cd_epa=eWI_cd_epa AND lom_ID_BATCH=EWI_ID_BATCH and lom_cd_status LIKE '%C') group by ewi_id_batch `;
    const sql = `SELECT DISTINCT ewi_id_batch AS batch, TO_CHAR (MAX (ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS' ) ewi_ts_creation FROM v_work_inst WHERE ewi_cd_process = :0 AND ewi_cd_epa = :1 AND ewi_cd_status = 'CN' AND EXISTS ( SELECT lom_id_batch FROM v_ldp_prodn WHERE lom_cd_epa = ewi_cd_epa AND lom_id_batch = ewi_id_batch AND lom_cd_status LIKE '%C') AND EWI_WRK_CENTER_NO = NVL(:2,EWI_WRK_CENTER_NO) GROUP BY ewi_id_batch`;
    let binds = [`${Process}`, `${Plant}`, `${workCenter}`];
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

export const getWorkCenterList = async (req: any) => {
  try {
    let results;

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
export const GetBatchDtlforLP_daughter = async (
  Plant: any,
  MBatch: any,
  DBatch: any
) => {
  try {
    const sql = `SELECT
      lom_cd_epa            plant,
      lom_id_batch          batchid,
      lom_sec2              odia,
      lom_sec1              thk,
      lom_idia              idia,
      lom_length            length1,
      lom_cd_status         cd_status,
      lom_tdc_actl          grade,
      lom_id_order_cus      orderno,
      lom_id_ord_item_cus   orderitem,
      lom_id_par_coil_no    parent_batch,
      lom_id_first_par      mother_coil,
      lom_cd_next_proc      next_proc,
      lom_no_pieces,
      ewi_no_matnr          rm_material,
      to_char(lom_ts_creation, 'DD/MM/YYYY') lom_ts_creation,
      (
          SELECT
              to_char(MIN(epr_dt_prodn_tata), 'DD-MON-YYYY')
          FROM
              v_epa_line_prodn
          WHERE
              epr_cd_epa = lom_cd_epa
              AND epr_id_batch = lom_id_batch
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
      lom_ms_gross_cal,
      nvl(decode(lom_uom, 'KG', round((lom_ms_gross_cal / 1000), 3), lom_ms_gross_cal), 0) lom_ms_gross_cal,
      (
          SELECT
              pph_desc
          FROM
              v_epa_proc_path
          WHERE
              pph_cd_epa = a.lom_cd_epa
              AND pph_cd_proc_path = a.lom_planned_proc
              AND ROWNUM = 1
      ) process_path_desc,
      (
          SELECT
              f_get_custname(b.ewi_cd_epa, b.ewi_id_order_cus, b.ewi_id_ord_item_cus)
          FROM
              dual
      ) cust_nm
  FROM
      v_ldp_prodn   a,
      v_work_inst   b
  WHERE
      a.lom_id_batch = nvl(:DBatch, lom_id_batch)
      AND a.lom_id_par_coil_no = nvl(:MBatch, lom_id_par_coil_no)
      AND a.lom_cd_epa = :Plant
      AND a.lom_cd_epa = b.ewi_cd_epa
      AND a.lom_id_batch = b.ewi_id_batch
      AND lom_cd_status NOT LIKE 'W%'
      AND ( a.lom_cd_status LIKE '%B'
            OR a.lom_cd_status LIKE '%C' )
      AND lom_cd_status NOT IN (
          'VF',
          'VM',
          'VB'
      )
      AND a.lom_cd_qlty_actl <> 'SCRP'
      AND lom_id_batch <> lom_id_first_par
  ORDER BY
      lom_id_batch`;

    let binds = {
      Plant: Plant,
      MBatch: MBatch ? MBatch : "",
      DBatch: DBatch ? DBatch : "",
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
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_ldp_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.lom_id_batch AND a.ewi_cd_epa = b.lom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.lom_cd_status NOT LIKE '%X' AND b.lom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
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

        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT lom_cd_prod FROM v_ldp_prodn WHERE lom_id_batch IN ( SELECT DISTINCT lom_id_first_par FROM v_ldp_prodn WHERE lom_id_batch = :batch_id AND lom_cd_epa = :plant ) AND lom_cd_epa = b.lom_cd_epa ) rm_prod, ( SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) grd_desc, ( SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) spec, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat, 0 inv_loss FROM v_work_inst   a, v_ldp_prodn   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.lom_id_batch AND a.ewi_cd_epa = b.lom_cd_epa AND a.ewi_cd_process = :process AND a.ewi_id_order_cus = :orderno AND a.ewi_id_ord_item_cus = :orderitem AND a.ewi_id_wrk_inst = NVL(:workinstno,ewi_id_wrk_inst) AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.lom_cd_status NOT LIKE '%X' AND b.lom_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`;
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
export const Insert_Khapoli = async (
  Plant: any,
  Batch: any,
  Process: any,
  user: any
) => {
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

export const getBatchId = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT EWI_ID_BATCH,EWI_TS_CREATION FROM V_WORK_INST
        WHERE EWI_CD_EPA=:0
        AND EWI_CD_STATUS='CN'
        AND  EWI_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA=EWI_CD_EPA AND EPL_ACTIVITY_NM='SLT')
        ORDER BY EWI_TS_CREATION`;

    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetInqDetl = async (
  Plant: any,
  Process: any,
  BatchID: any,
  Status: any,
  OrdID: any,
  OrdItm: any,
  Prod_DT: any
) => {
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
    nvl(lom_no_matnr, enc_no_matnr) fg_material,
    (SELECT maktx
       FROM v_makt
      WHERE mandt = '600'
        AND matnr = nvl(lom_no_matnr, enc_no_matnr)
        AND ROWNUM = 1) fg_material_desc,
    nvl((SELECT tmm_sfg_mat
          FROM v_tub_matl_mapping
         WHERE tmm_cd_epa = lom_cd_epa
           AND tmm_fg_mat = lom_no_matnr
           AND ROWNUM = 1),
        ' ') sfg_material,
    nvl((SELECT maktx
          FROM v_makt
         WHERE mandt = '600'
           AND matnr = (SELECT tmm_sfg_mat
                          FROM v_tub_matl_mapping
                         WHERE tmm_cd_epa = lom_cd_epa
                           AND tmm_fg_mat = lom_no_matnr
                           AND ROWNUM = 1)),
        ' ') sfg_material_desc,
    nvl((SELECT eic_no_matnr
          FROM v_input_coil
         WHERE eic_cd_epa = lom_cd_epa
           AND eic_id_coil = lom_id_first_par
           AND ROWNUM = 1),
        ' ') rm_material,
    (SELECT (SELECT maktx
               FROM v_makt
              WHERE mandt = '600'
                AND matnr = eic_no_matnr
                AND ROWNUM = 1)
       FROM v_input_coil
      WHERE eic_cd_epa = lom_cd_epa
        AND eic_id_coil = lom_id_first_par
        AND ROWNUM = 1) rm_material_desc,
    ewi_no_tdc tube_grade
FROM v_work_inst, v_end_cust_ord_epa, v_ldp_prodn
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
AND ewi_cd_epa = lom_cd_epa(+)
AND ewi_id_batch = lom_id_batch(+)
AND EWI_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA=EWI_CD_EPA AND EPL_ACTIVITY_NM='SLT')
    `;
    let binds = {
      Plant: Plant,
      Process: Process,
      BatchID: BatchID,
      OrdID: OrdID,
      OrdItm: OrdItm,
      Prod_DT: Prod_DT,
    };

    if (Status == "") {
      sql += " and ewi_cd_status in ('WC','CN') ";
    } else {
      if (Status == "CN") {
        sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) ";
        Object.assign(binds, { status: "CN" });
      } else {
        sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) ";
        Object.assign(binds, { status: "WC" });
      }
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
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
export const ScheduleDelMerge = async (req: any) => {
  try {
    const sql = `call LDPDBA.C1CEB170_SCHED_DEL_CHILD (
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

export const getMergeBatchDetails = async (req: any) => {
  try {
    let sql = `select erd_cd_epa,ERD_ID_NEW_BATCH MERGE_BATCH,ERD_ID_BATCH COMPONENT_BATCH,ROUND((ERD_BATCH_QTY*1000),1) COMPONENT_BATCH_QTY , ERD_FLG_SEND_SAP SEND_SAP_FLAG
        , ERD_REC_CRT_DT CREATION_DATE,ERD_REC_CRT_UID CREATED_BY
        from v_epa_random_dtls
        where ERD_CD_ePA=:Plant
        AND ERD_ID_NEW_BATCH=:batchId
        AND ERD_MOV_IND='B' AND ERD_REC_STATUS='A'`;

    let binds = {
      Plant: req.body.Plant,
      batchId: req.body.batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const chemChkSlt = async (req: any) => {
  try {
    let Plant = req.body.Plant;
    var MBatch = req.body.BatchId;
    var text = req.body.text1;
    var OrderNo = text.substr(3, 10);
    var OrderItem = text.substr(13, 4);
    const sql = `SELECT LDPDBA.F_SPCB031_CHEM_CHK_SLT ( '${Plant}', '${OrderNo}', ${OrderItem}, '${MBatch}' ) from dual`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
