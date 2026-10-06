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
    const sql = `SELECT CD_DESC FROM V_CODES
    WHERE Cd_TYPE='TB031'
    AND CD_VALUE= :plant `;
    let binds = { plant: Plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getScheduleData = async (plant: any, status: any) => {
//   try {
//     const sql = `
//       select LOM_ID_BATCH,LOM_CD_PROD,LOM_CD_QLTY_ACTL,(SELECT DISTINCT NVL(IQL_GRADE_DESC ,'.') GRADE_DESC  FROM V_QUALITY WHERE IQL_CD_QLTY = LOM_CD_QLTY_ACTL) GRADE_DESC,LOM_SEC1,LOM_SEC2,LOM_LENGTH,LOM_IDIA,'' Planned_Width,  LOM_NO_MATNR1 materil_no1, '' material_desc1, LOM_MATNR1_QTY LOM_MATNR1_QTY,
//       LOM_NO_MATNR2 materil_no2,'' material_desc2, LOM_MATNR2_QTY , LOM_NO_MATNR3 materil_no3,'' material_desc3,
//       LOM_MATNR3_QTY , LOM_NO_MATNR4 materil_no4, '' material_desc4, LOM_MATNR4_QTY, LOM_TDC_ACTL,LOM_CD_YRD,LOM_ID_LOC_X,
//       LOM_ID_LOC_Y,LOM_ID_POS,LOM_NO_PIECES,
//       (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) UTS fROM V_TC_COIL_TEST where TCO_PROD_NO=LOM_ID_BATCH AND TCO_CAST_NO=LOM_NO_CAST AND tco_test_parA in ('UTS') AND ROWNUM=1) UTS,
//       (SELECT DISTINCT NVL(TCO_TEST_PARA_VAL,0) YS fROM V_TC_COIL_TEST where TCO_PROD_NO=LOM_ID_BATCH AND TCO_CAST_NO=LOM_NO_CAST AND tco_test_parA in ('LYS','YS') AND ROWNUM=1)YS ,
//       LOM_MS_PIECE_ACTL,NVL(LOM_MS_GROSS_CAL,0)+NVL(LOM_INV_LOSS,0) Gross_cal,(SELECT MAX(IWI_MARK_CUST_DESC) MK_CUSTOMER  FROM V_SAPOMS_WO_ITEM WHERE IWI_ID_ORDER IN (SELECT DISTINCT EIC_WO_NO FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=LOM_ID_BATCH	AND EIC_CD_EPA =LOM_CD_EPA) AND IWI_ID_ORDER_ITEM  IN (SELECT DISTINCT EIC_ITEM_NO FROM V_INPUT_COIL WHERE EIC_ID_COIL=LOM_ID_BATCH And EIC_CD_EPA =LOM_CD_EPA))MK_CUSTOMER,
//       LOM_MS_SCRAP,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,''Ord_Typ,LOM_CD_STATUS,
//       (SELECT DISTINCT EIC_WO_NO MillOrd FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=LOM_ID_BATCH	AND EIC_CD_EPA = LOM_CD_EPA and rownum=1) MillOrd,
//       (SELECT DISTINCT EIC_ITEM_NO Mill_Item FROM V_INPUT_COIL	WHERE  EIC_ID_COIL=LOM_ID_BATCH	AND EIC_CD_EPA =LOM_CD_EPA
//       and rownum=1) Mill_Item,(SELECT ehr_op_remarks Remarks	FROM v_epa_matl_hold_rls WHERE ehr_remarks='Diverted' AND
//       ehr_ts_release=(SELECT MAX(ehr_ts_release) FROM v_epa_matl_hold_rls WHERE ehr_id_batch= LOM_ID_BATCH AND EHR_CD_EPA= LOM_CD_EPA AND ehr_remarks='Diverted') AND
//       ehr_id_batch= LOM_ID_BATCH AND EHR_CD_EPA = LOM_CD_EPA) Remarks, (SELECT MAX(TRIM(REPLACE(CAD_DEF2_COMM,CHR(10),' '))) Salvage_Remark FROM   V_COIL_CARD WHERE  CAD_ID_COIL = LOM_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Salvage_Remark,
//       (SELECT MAX(TRIM(REPLACE(CAD_CD_TOP_REMARKS,CHR(10),' '))) Top_Remrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = LOM_ID_BATCH AND    CAD_DEF2_COMM LIKE 'SLP%') Top_Remrk,
//       (SELECT MAX(TRIM(REPLACE(CAD_CD_BOT_REMARKS,CHR(10),' '))) BottamRemrk FROM V_COIL_CARD WHERE  CAD_ID_COIL = LOM_ID_BATCH AND  CAD_DEF2_COMM LIKE 'SLP%') BottamRemrk,
//       (SELECT MAX(TRIM(REPLACE(CAD_FILE_NAME,CHR(10),' '))) FileName FROM V_COIL_CARD WHERE  CAD_ID_COIL = LOM_ID_BATCH AND
//       CAD_DEF2_COMM LIKE 'SLP%') FileName,(SELECT MAX(CAD_LST_WRK_CEN) WrkCentr FROM   V_COIL_CARD WHERE  CAD_ID_COIL = LOM_ID_BATCH AND
//        CAD_DEF2_COMM LIKE 'SLP%') WrkCentr,LOM_NO_MATNR Materil_No,(SELECT NVL(MAKTX,' ') Material_desc FROM V_MAKT WHERE  MATNR = LOM_NO_MATNR	 AND  MANDT = (SELECT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'EPA205' AND
//        CD_VALUE = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE  EPL_CD_EPA = LOM_CD_EPA))) Material_desc,(SELECT LOM_OPER_COMMENT FROM V_LDP_PRODN WHERE LOM_ID_BATCH = A.LOM_ID_BATCH AND LOM_CD_EPA <> :Plant AND ROWNUM=1) PRV_SPC_OPR_COMNTS,ROUND((SYSDATE-LOM_TS_CREATION),0)Age_Days from V_LDP_PRODN A
//        where LOM_cd_epa = :Plant and LOM_cd_status =nvl( :Status,LOM_cd_status) AND LOM_MS_GROSS_CAL>=0 `;
//     let binds = { plant: plant, status: status };
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getCoils = async (req: any) => {
  try {
    let binds = {
      Plant: req.body.Plant,
      //Status: req.body.Status,
    };

    let QrygetCoils = `SELECT LOM_id_batch, LOM_cd_prod, LOM_cd_qlty_actl, LOM_sec1, LOM_sec2,
        LOM_length,  LOM_tdc_actl,LOM_ms_piece_actl, (SELECT eic_mk_customer
        FROM v_input_coil
        WHERE eic_cd_plant = a.LOM_cd_epa
        AND eic_id_coil = a.LOM_id_batch) mk_customer,
        LOM_no_cast cast_no, LOM_cd_yrd, LOM_id_loc_x, LOM_id_loc_y, LOM_id_pos,
        LOM_no_pieces,
        (SELECT DISTINCT NVL (tco_test_para_val, 0) uts
        FROM v_tc_coil_test
        WHERE tco_prod_no = LOM_id_batch
        AND tco_cast_no = LOM_no_cast
        AND tco_test_para IN ('UTS')
        AND ROWNUM = 1) uts,
        (SELECT DISTINCT NVL (tco_test_para_val, 0) ys
        FROM v_tc_coil_test
        WHERE tco_prod_no = LOM_id_batch
        AND tco_cast_no = LOM_no_cast
        AND tco_test_para IN ('LYS', 'YS')
        AND ROWNUM = 1) ys,
        LOM_id_order_cus, LOM_id_ord_item_cus, 
        LOM_cd_status,
        (SELECT DISTINCT eic_wo_no millord
        FROM v_input_coil
        WHERE eic_id_coil = LOM_id_batch
        AND eic_cd_epa = LOM_cd_epa
        AND ROWNUM = 1) millord,
        (SELECT DISTINCT eic_item_no mill_item
        FROM v_input_coil
        WHERE eic_id_coil = LOM_id_batch
        AND eic_cd_epa = LOM_cd_epa
        AND ROWNUM = 1) mill_item,
        LOM_no_matnr materil_no,
        (select maktx from v_makt where mandt = 600 and matnr = lom_no_matnr) MATERIAL_DESC,
        ROUND((SYSDATE-LOM_TS_CREATION),0) Age_Days,
        LOM_idia, LOM_TS_CREATION, LOM_ms_gross_cal gross_cal
        FROM V_LDP_PRODN a
        WHERE LOM_cd_epa = :Plant AND LOM_cd_status IN ('SF', '1F')
        AND LOM_ms_gross_cal >= 0 
        AND LOM_ID_BATCH = LOM_ID_FIRST_PAR `;

    if (
      req.body.Status &&
      Array.isArray(req.body.Status) &&
      req.body.Status.length > 1
    ) {
      if (
        req.body.Status &&
        Array.isArray(req.body.Status) &&
        req.body.Status.length > 1
      ) {
        let dt = req.body.Status.map((d: any) => `'${d}'`).join();
        QrygetCoils += ` AND LOM_cd_status in(` + dt + `) `;
      }
    } else {
      // if (req.body.Status && req.body.Status?.length) {
      //   QrygetCoils += ` AND LOM_cd_status = nvl(:Status, LOM_cd_status) `;
      //   binds["Status"] = Array.isArray(req.body.Status)
      //     ? req.body.Status[0]
      //     : req.body.Status;
      // }
    }

    if (req.body.BatchId != "") {
      QrygetCoils += " AND LOM_id_batch = :BatchId ";
      Object.assign(binds, { BatchId: req.body.BatchId });
    }

    if (req.body.ThickFR != "") {
      QrygetCoils +=
        " AND LOM_sec1 BETWEEN NVL(:ThickFR,LOM_sec1) AND NVL(:ThickTo,NVL(:ThickFR,LOM_sec1))";
      Object.assign(binds, { ThickFR: req.body.ThickFR });
      Object.assign(binds, { ThickTo: req.body.ThickTo });
    }

    if (req.body.WidthFr != "") {
      QrygetCoils +=
        " AND LOM_sec2 BETWEEN NVL(:WidthFr,LOM_sec2) AND NVL(:WidthTo,NVL(:WidthFr,LOM_sec2))";
      Object.assign(binds, { WidthFr: req.body.WidthFr });
      Object.assign(binds, { WidthTo: req.body.WidthTo });
    }

    // if (req.body.Tdc != "") {
    //   QrygetCoils += " AND LOM_tdc_actl = :Tdc ";
    //   Object.assign(binds, { Tdc: req.body.Tdc });
    // }

    // if (req.body.ProdCd != "") {
    //   QrygetCoils += " AND LOM_cd_prod = :ProdCd ";
    //   Object.assign(binds, { ProdCd: req.body.ProdCd });
    // }

    // if (req.body.rcvDtFr != "" && req.body.rcvdtTo != "") {
    //   QrygetCoils +=
    //     " AND TRUNC(LOM_TS_CREATION) BETWEEN :recvDtFr AND :recvdtTo ";
    //   Object.assign(binds, { recvDtFr: req.body.rcvDtFr });
    //   Object.assign(binds, { recvdtTo: req.body.rcvdtTo });
    // }

    // if (req.body.Tonn == "20") {
    //   QrygetCoils += " AND LOM_ms_piece_actl <= 20";
    // } else if (req.body.Tonn == "21") {
    //   QrygetCoils += " AND LOM_ms_piece_actl > 20";
    // }

    // if (req.body.coilType != "All" && req.body.coilType == "RM_Coil") {
    //   QrygetCoils += " AND LOM_sec2 > 900 ";
    // }

    QrygetCoils += " order by LOM_TS_CREATION";
    const res = await query.executeQuery(QrygetCoils, binds);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const compute = async (req: any) => {
  try {
    // let dltQry = `delete from V_TEMP_SCHD where tsh_id_batch = '${req[0].batch}'`;
    let dltQry = `delete from V_TEMP_SCHD `;
    await query.executeQuery(dltQry);

    let count = 0;
    for (let i = 0; i < req.length; i++) {
      let sql = ` call LD0SB001(
        p_TSH_CD_EPA  => :p_TSH_CD_EPA,
        p_TSH_ID_BATCH  => :p_TSH_ID_BATCH,
        p_TSH_CD_PROCESS  => :p_TSH_CD_PROCESS,
        p_TSH_ID_WRK_INST  => :p_TSH_ID_WRK_INST,
        p_TSH_SEC1  => :p_TSH_SEC1,
        p_TSH_SEC2  => :p_TSH_SEC2,
        p_TSH_LENGTH  => :p_TSH_LENGTH,
        p_TSH_CD_PROD  => :p_TSH_CD_PROD,
        p_TSH_CD_QLTY  => :p_TSH_CD_QLTY,
        p_TSH_PRIORITY  => :p_TSH_PRIORITY,
        p_TSH_ID_SCHEDULE  => :p_TSH_ID_SCHEDULE,
        p_TSH_COMBINATION  => :p_TSH_COMBINATION,
        p_TSH_PAGEID  => :p_TSH_PAGEID,
        p_TSH_PLAN_WT  => :p_TSH_PLAN_WT,
        p_TSH_SCH_WT  => :p_TSH_SCH_WT,
        p_TSH_COIL_WT  => :p_TSH_COIL_WT,
        p_TSH_TDC_NO  => :p_TSH_TDC_NO,
        LS_OUT_FLAG  => :LS_OUT_FLAG,
        P_no_slit   => :P_no_slit,
        p_no_part   => :p_no_part,
        p_setup_cd  => :p_setup_cd,
        p_ord_no    => :p_ord_no,
        p_ord_item  => :p_ord_item,
        p_plan_proc => :p_plan_proc,
        p_remarks   => :p_remarks,
        p_action    => :p_action
    )`;
      let binds = {
        p_TSH_CD_EPA: req[i].plant,
        p_TSH_ID_BATCH: req[i].batch,
        p_TSH_CD_PROCESS: req[i].process,
        p_TSH_ID_WRK_INST: req[i].wrkInst,
        p_TSH_SEC1: req[i].thick,
        p_TSH_SEC2: req[i].width,
        p_TSH_LENGTH: req[i].length,
        p_TSH_CD_PROD: req[i].prodCd,
        p_TSH_CD_QLTY: req[i].qltyCd,
        p_TSH_PRIORITY: req[i].priority, //"1",
        p_TSH_ID_SCHEDULE: req[i].schdId, //"1",
        p_TSH_COMBINATION: req[i].combn, //"",
        p_TSH_PAGEID: req[i].pageId, //"LD50S003",
        p_TSH_PLAN_WT: req[i].planWt,
        p_TSH_SCH_WT: req[i].schWt,
        p_TSH_COIL_WT: req[i].coilWt,
        p_TSH_TDC_NO: req[i].tdc,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
        P_no_slit: req[i].noSlit,
        p_no_part: req[i].noPart,
        p_setup_cd: req[i].setupCd,
        p_ord_no: req[i].ordNo,
        p_ord_item: req[i].ordItem,
        p_plan_proc: req[i].planProc,
        p_remarks: req[i].remarks,
        p_action: req[i].action,
      };

      const res = await query.executeQuery(sql, binds);
      if (res?.outBinds?.LS_OUT_FLAG?.substr(0, 1) === "Y") {
        count = count + 1;
      } else if (res?.outBinds?.LS_OUT_FLAG?.substr(0, 1) === "N") {
        return res?.outBinds?.LS_OUT_FLAG;
      }
    }
    if (count === req.length) {
      return "Y";
    } else {
      return "N";
    }
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
    // throw new Error.InternalServerErrorMsg(error);
  }
};

export const confirm = async (req: any) => {
  try {
    let sql = ` call LD0SB002 (
    p_plant => :p_plant,
    p_batchid => :p_batchid,
    LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    let binds = {
      p_plant: req.plant,
      p_batchid: req.batchId,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    const result = await query.executeQuery(sql, binds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg("Error!");
  }
};

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
    nvl(SUM(DECODE(LOM_cd_status, 'WL', LOM_ms_gross_cal)),0) desp,
    nvl(SUM(DECODE(LOM_cd_status, 'WB', LOM_ms_gross_cal)), 0) displ,
    nvl(SUM(DECODE(substr(LOM_cd_status, 2, 1), 'B', LOM_ms_gross_cal)), 0) linked,
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
    enc_cd_qlty, ENC_MIN_PIECE_WT, ENC_MAX_PIECE_WT, ENC_IDIA,
    (
        SELECT
            f_btp_slt(enc_cd_epa, enc_id_order, enc_no_item)
        FROM
            dual
    ) slt_btp
FROM
    v_end_cust_ord_epa,
    V_LDP_PRODN
WHERE
    enc_cd_epa = :plant
    AND enc_order_type = nvl(:ordtype, enc_order_type)
    AND enc_st_order = 'A'
    AND LOM_id_order_cus (+) = enc_id_order
    AND LOM_id_ord_item_cus (+) = enc_no_item
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
    enc_cd_qlty, 
    ENC_MIN_PIECE_WT,
    ENC_MAX_PIECE_WT,
    ENC_IDIA `;

    console.log("sql: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("GetOrdFilter: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPlanPathWire = async (req: any) => {
  try {
    const sql = `SELECT LPP_CD_PROC_PATH, LPP_DESC FROM   V_LDP_PROC_PATH WHERE  LPP_CD_EPA = :Plant AND    LPP_CD_PROC_PATH LIKE NVL(:SchPLine,:FltPLine)||'%' ORDER  BY 1`;
    let binds = {
      Plant: req.body.Plant,
      SchPLine: req.body.SchPLine,
      FltPLine: req.body.FltPLine,
    };
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

export const GetBatchDtl = async (Plant: any, Batch: any, ProcLine: any) => {
  try {
    let sql = ` SELECT   ewi_cd_epa, lom_id_batch, lom_cd_prod, lom_cd_qlty_actl, lom_sec1,
    lom_sec2, lom_length, lom_tdc_actl,
    NVL (DECODE (lom_uom,
                 'KG', ROUND ((lom_ms_piece_actl / 1000), 3),
                 lom_ms_piece_actl
                ),
         0
        ) input_wt,
    lom_cd_status,
    NVL (DECODE (lom_uom,
                 'KG', ROUND ((lom_ms_gross_cal / 1000), 3),
                 lom_ms_gross_cal
                ),
         0
        ) lom_ms_gross_cal,
    --lom_cd_next_proc next_proc,
    F_GET_NEXTPROC(EWI_PLANNED_PROC,NULL,'S') next_proc,
    (  (NVL (DECODE (lom_uom,
                     'KG', ROUND ((lom_ms_piece_actl / 1000), 3),
                     lom_ms_piece_actl
                    ),
             0
            )
       )
     - (NVL (DECODE (lom_uom,
                     'KG', ROUND ((lom_ms_gross_cal / 1000), 3),
                     lom_ms_gross_cal
                    ),
             0
            )
       )
    ) proc_wt,
    lom_id_first_par, ewi_ms_input plan_wt,
    (SELECT SUM (ewi_ms_piece_actl)
       FROM v_work_inst
      WHERE ewi_id_batch = b.ewi_id_batch
        AND ewi_cd_status = 'CN') schd_wt,
    EWI_PLANNED_PROC, ewi_id_order_cus cust_ord,
    ewi_id_ord_item_cus cust_item,
    TO_CHAR (ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt,
    ewi_wrk_center_no work_center,
    NVL (EWI_REMARKS, ' ') planning_remarks, '' cust_nm,
    ewi_no_matnr rm_material, '' rm_material_desc,
    ewi_sfg_matnr sfg_material, '' sfg_material_desc,
    ewi_fg_matnr fg_material, '' fg_material_desc, ewi_no_tdc grade
FROM v_ldp_prodn a, v_work_inst b
WHERE a.lom_cd_epa = b.ewi_cd_epa
AND a.lom_id_batch = b.ewi_id_batch
AND lom_cd_epa = :Plant
AND lom_id_batch = NVL (:Batch, lom_id_batch)
AND ewi_cd_status = 'CN'
AND ewi_cd_process = :ProcLine
AND ROWNUM = 1
ORDER BY ewi_cd_epa,
    ewi_wrk_center_no,
    lom_planned_proc,
    ewi_no_matnr,
    ewi_no_tdc`;

    let binds = {
      Plant: Plant,
      Batch: Batch,
      ProcLine: ProcLine,
    };
    console.log("sql: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("GetBatchDtl: ", error);
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
  status: any,
  prodEndDt: any
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
      let count = `SELECT COUNT(1) FROM v_work_inst   a, v_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch
      AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch 
      AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process 
      AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) 
      AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status 
      NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) `;

      let getCount = await query.executeQuery(count, bindsCount);
      countVal = getCount.rows[0][0];

      // let bindsMill = {
      //   plant: Plant,
      //   process: Process,
      //   MBatch: MBatch,
      // };

      // let qryMillCode = `SELECT DISTINCT PLM_WCNT_SCODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA   = :plant
      //     AND PLM_CD_PROCESS = :process AND
      //     PLM_WCNT_CODE =(SELECT EWI_WRK_CENTER_NO FROM V_WORK_INST
      //         WHERE EWI_CD_ePA= PLM_CD_EPA
      //         AND EWI_ID_BATCH = :MBatch
      //         AND EWI_CD_STATUS ='CN' and ROWNUM=1)
      //      AND PLM_ACTIVE_STATUS ='A'`;
      // let getMillCode = await query.executeQuery(qryMillCode, bindsMill);

      // mill = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : Process;
      try {
        let binds = {
          plant: Plant,
          //process: Process,
          p_prodn_dt: ProdDate,
          //Odia: Odia,
          mbatch: MBatch,
          Batch_id: MBatch,
          //status: status,
          //count: countVal,
          //mill: mill,
          prodEndDt: prodEndDt,
        };

        let sql = `SELECT  (SELECT F_GETBATCHID(E.LOM_CD_EPA,E.EWI_ID_BATCH,:p_prodn_dt,E.EWI_CD_PROCESS,
            (select substr(F_Tatadate(
            TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),1,1)
             shift from dual),
            E.SEQ) FROM DUAL) batch_id,
                          E.*
                          FROM
                          ( 
                          SELECT
                            ROWNUM SEQ,
                              LOM_CD_EPA,
                              EWI_ID_BATCH,
                              EWI_CD_PROCESS,
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
                              TO_CHAR(ewi_ms_piece_actl, 'FM999999999.000') AS ewi_ms_piece_actl,--ROUND(ewi_ms_piece_actl, 3) ewi_ms_piece_actl,
                              ewi_planned_proc,
                              ewi_id_schedule,
                              ewi_off_cut_remarks,
                              ewi_ts_creation,
                              ewi_sch_shift,
                              nvl(ewi_rwk_ind, 'N') ewi_rwk_ind,
                              ewi_camp_no,
                              substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc,
                              ewi_idia        idia,
                              ROWNUM rnum,
                              (
                                  SELECT DISTINCT
                                      LOM_cd_prod
                                  FROM
                                      V_LDP_PRODN
                                  WHERE
                                      LOM_id_batch IN (
                                          SELECT DISTINCT
                                              LOM_id_first_par
                                          FROM
                                              V_LDP_PRODN
                                          WHERE
                                              LOM_id_batch = :Batch_id
                                              AND LOM_cd_epa = :plant
                                      )
                                      AND LOM_cd_epa = b.LOM_cd_epa
                              ) rm_prod,
                              ewi_no_matnr    rm_mat,
                              (
                               SELECT
                                   maktx
                               FROM
                                   v_makt
                               WHERE
                                   mandt = '600'
                                   AND matnr = ewi_no_matnr
                                   AND ROWNUM = 1
                           ) rm_mat_desc,
                              ewi_sfg_matnr   sfg_mat,
                              (
                             SELECT
                                 maktx
                             FROM
                                 v_makt
                             WHERE
                                 mandt = '600'
                                 AND matnr = ewi_sfg_matnr
                                 AND ROWNUM = 1
                         ) sfg_mat_desc,
                              ewi_fg_matnr    fg_mat,
                          (
                             SELECT
                                 maktx
                             FROM
                                 v_makt
                             WHERE
                                 mandt = '600'
                                 AND matnr = ewi_fg_matnr
                                 AND ROWNUM = 1
                         ) fg_mat_desc,
                        (
                           SELECT
                               spec
                           FROM
                               v_ympct_tub_matl
                           WHERE
                               mandt = '600'
                               AND matnr = a.ewi_fg_matnr
                       ) spec
                          FROM
                              v_work_inst   a,
                              v_LDP_PRODN   b
                          WHERE
                              a.ewi_id_batch = :mbatch
                              AND a.ewi_cd_epa = :plant
                              AND a.ewi_id_batch = b.LOM_id_batch
                              AND a.ewi_cd_epa = b.LOM_cd_epa
                              AND a.ewi_cd_process = 'S'
                              AND a.ewi_cd_status = 'CN'
                              AND b.Lom_cd_status = 'SC'
                              )E`;

        console.log("sql: ", sql);
        let d = await query.executeQuery(sql, binds);
        resolve(d);
      } catch (error) {
        console.log("GetPdiDtl-1: ", error);
        reject("Error!!");
        throw new Error.InternalServerErrorMsg(error);
      }
    });
  } catch (error) {
    console.log("GetPdiDtl-2: ", error);
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
    console.log(error);
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
  batchType: any,
  startDt: any,
  endDt: any
) => {
  try {
    const sql = `call LD0SB004 (
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
      P_PROD_STRT_DTTM: startDt, //ele.prdPStartDt, //prod dt Start time
      P_PROD_END_DTTM: endDt, //ele.prdPEndDt, //prodt dt time
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
    console.log("bindsTemp::: ", binds);
    const result = await query.executeQuery(sql, binds);
    console.log("resultTemp: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetMCoilList = async (Plant: any, Process: any) => {
  try {
    const sql = `SELECT DISTINCT ewi_id_batch AS batch, TO_CHAR (MAX (ewi_ts_creation), 'DD-Mon-YYYY HH24:MI:SS' ) ewi_ts_creation 
    FROM v_work_inst WHERE ewi_cd_process = :0 AND ewi_cd_epa = :1 AND ewi_cd_status = 'CN' AND EXISTS 
    ( SELECT LOM_id_batch FROM V_LDP_PRODN WHERE LOM_cd_epa = ewi_cd_epa AND LOM_id_batch = ewi_id_batch 
     AND LOM_cd_status LIKE '%C') GROUP BY ewi_id_batch`;
    let binds = [`${Process}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
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

// export const getWorkCenterList = async (req: any) => {
//   try {
//     let results;

//     let esql = `SELECT PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_cD_ePA= :Plant AND PLM_CD_PROCESS = :process order by 1`;
//     let ebinds = {
//       Plant: req.body.Plant,
//       process: req.body.Process,
//     };
//     results = await query.executeQuery(esql, ebinds);
//     return results;
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getScrapProductionTable = async (req: any) => {
  try {
    const sql = `SELECT ( SELECT f_scrappdi_tub(:Plant, :MBatch, :Process, substr(cd_desc, 1, 18), :P_FLAG) 
    scrap_batch_id FROM dual ) scrap_batch_id, '' idpdi, '' order_id, 0 item, '' rm_prod, '' fg_prod, 
    'SCRP' qlty, '' grade, '' thk, '' width_odia, '' length1, '0' no_pcs, '' net_wt, '' next_proc, 
    '' rsn_hold, '' hold_desc, '' opr_remarks, substr(cd_desc, 1, 18) material, 
    substr(cd_desc, 19, 70) material_desc, '' sfg_matnr, '' sfg_matnr_desc, '' rm_matnr, 
    '' rm_matnr_desc, '' odia, '' idia FROM v_codes WHERE cd_type = 'EPA196C' 
    AND substr(cd_value, 1, 4) = :Plant AND substr(cd_value, 6, 1) = :Process ORDER BY CD_DESC1`;
    let binds = {
      Plant: req.body.Plant,
      MBatch: req.body.MBatch,
      P_FLAG: "SCRAP",
      Process: req.body.Process,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("getScrapProductionTable: ", error);
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
      to_char(LOM_ts_creation, 'DD/MM/YYYY') LOM_ts_creation,
      (
          SELECT
              to_char(MIN(epr_dt_prodn_tata), 'DD-MON-YYYY')
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
      nvl(decode(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) LOM_ms_gross_cal,
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
      ) cust_nm
  FROM
      V_LDP_PRODN   a,
      v_work_inst   b
  WHERE
      a.LOM_id_batch = nvl(:DBatch, LOM_id_batch)
      AND a.LOM_id_par_coil_no = nvl(:MBatch, LOM_id_par_coil_no)
      AND a.LOM_cd_epa = :Plant
      AND a.LOM_cd_epa = b.ewi_cd_epa
      AND a.LOM_id_batch = b.ewi_id_batch
      AND LOM_cd_status NOT LIKE 'W%'
      AND ( a.LOM_cd_status LIKE '%B'
            OR a.LOM_cd_status LIKE '%C' )
      AND LOM_cd_status NOT IN (
          'VF',
          'VM',
          'VB'
      )
      AND a.LOM_cd_qlty_actl <> 'SCRP'
      AND LOM_id_batch <> LOM_id_first_par
  ORDER BY
      LOM_id_batch`;

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
    console.log("getHoldRsnDetails: ", error);
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
      let count = `SELECT COUNT(1) FROM v_work_inst   a, V_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = NVL(:odia,a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) )`;
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

        let sql = `SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, ewi_sec2          odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, next_proc, idia, '' sleev_wt, '' slit_sec, CASE WHEN ewi_off_cut_remarks IS NOT NULL THEN 'O' ELSE '' END off_cut, '' yard, round((nvl(ewi_ms_piece_actl, 0) *(nvl(inv_loss, 0) / 100)), 3) invlosswt, inv_loss, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, ewi_inp_jac_grd   plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, rm_prod, grd_desc, spec, ewi_print_batch   batch_id, ( SELECT f_spcb004_getbundleid(:plant, :mbatch, :p_prodn_dt, :process, :mill, :status, :count) FROM dual ) bundle_id, rm_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = rm_mat AND ROWNUM = 1 ) rm_mat_desc, sfg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = sfg_mat AND ROWNUM = 1 ) sfg_mat_desc, fg_mat, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = fg_mat AND ROWNUM = 1 ) fg_mat_desc FROM ( SELECT ewi_uom, ewi_id_wrk_inst, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_prod, ewi_cd_qlty, ewi_inp_jac_grd, ewi_sec1, ewi_sec2, ewi_length, ewi_no_tdc, ewi_no_pieces, ewi_ms_piece_actl, ewi_planned_proc, ewi_no_sco_order, ewi_no_sco_item, ewi_id_schedule, ewi_off_cut_remarks, ewi_ts_creation, ewi_sch_shift, nvl(ewi_rwk_ind, 'N') ewi_rwk_ind, ewi_pln_rsn_cd, ewi_pkg_typ, ewi_pkg_rate, ewi_prc1_rate, ewi_prc2_rate, ewi_prc3_rate, ewi_seg_rate, ewi_oth_rate, ewi_tot_rate, ewi_print_batch, ewi_fg_eto_wt, ewi_camp_no, ewi_no_pieces_wip, '' act_thick, '' act_width, '' act_length, '' odia, '' scrp_wt, '' scrp_rsn, '' qa_insp, '' rsn_hold, substr(ewi_planned_proc, instr(ewi_planned_proc, ewi_cd_process) + 1, 1) next_proc, ewi_idia        idia, '' sleev_wt, '' slit_sec, '' off_cut, '' yard, '' loc_x, '' loc_y, '' loc_z, '' opr_cmnt, '' mtr_desc, '' yld_str, '' ten_len, '' plan_fg_grd, '' rsn_cat, '' rsn_cd, '' rsn_desc, ROWNUM rnum, ( SELECT DISTINCT LOM_cd_prod FROM V_LDP_PRODN WHERE LOM_id_batch IN ( SELECT DISTINCT LOM_id_first_par FROM V_LDP_PRODN WHERE LOM_id_batch = :batch_id AND LOM_cd_epa = :plant ) AND LOM_cd_epa = b.LOM_cd_epa ) rm_prod, ( SELECT grade FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) grd_desc, ( SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = a.ewi_fg_matnr ) spec, ewi_no_matnr    rm_mat, ewi_sfg_matnr   sfg_mat, ewi_fg_matnr    fg_mat, 0 inv_loss FROM v_work_inst   a, V_LDP_PRODN   b WHERE a.ewi_id_batch = :mbatch AND a.ewi_cd_epa = :plant AND a.ewi_id_batch = b.LOM_id_batch AND a.ewi_cd_epa = b.LOM_cd_epa AND a.ewi_cd_process = :process AND a.ewi_id_order_cus = :orderno AND a.ewi_id_ord_item_cus = :orderitem AND a.ewi_id_wrk_inst = NVL(:workinstno,ewi_id_wrk_inst) AND a.ewi_cd_status = 'CN' AND a.ewi_sec2 = nvl(:odia, a.ewi_sec2) AND ( b.LOM_cd_status NOT LIKE '%X' AND b.LOM_cd_status NOT IN ( SELECT DISTINCT cd_value FROM v_codes WHERE cd_type = 'EPA320' ) ) )`;
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
  activity: any,
  user: any
) => {
  try {
    const sql = `call LD0SB005 ( 
          i_Plant => :i_Plant,
          i_MCoil => :i_MCoil,
          i_Proc => :i_Proc,
          i_User_ID => :i_User_ID,
          i_stl_type => :i_stl_type,
          LS_OUT_FLAG => :LS_OUT_FLAG
          )`;

    const binds = {
      i_Plant: Plant,
      i_MCoil: Batch,
      i_Proc: Process,
      i_User_ID: user,
      i_stl_type: activity,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    console.log("binds:: ", binds);
    const result = await query.executeQuery(sql, binds);
    console.log("result-khapoli: ", result);
    return result;
  } catch (error) {
    console.log("error => ", error);
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
    nvl(LOM_no_matnr, enc_no_matnr) fg_material,
    (SELECT maktx
       FROM v_makt
      WHERE mandt = '600'
        AND matnr = nvl(LOM_no_matnr, enc_no_matnr)
        AND ROWNUM = 1) fg_material_desc,
    nvl((SELECT tmm_sfg_mat
          FROM v_tub_matl_mapping
         WHERE tmm_cd_epa = LOM_cd_epa
           AND tmm_fg_mat = LOM_no_matnr
           AND ROWNUM = 1),
        ' ') sfg_material,
    nvl((SELECT maktx
          FROM v_makt
         WHERE mandt = '600'
           AND matnr = (SELECT tmm_sfg_mat
                          FROM v_tub_matl_mapping
                         WHERE tmm_cd_epa = LOM_cd_epa
                           AND tmm_fg_mat = LOM_no_matnr
                           AND ROWNUM = 1)),
        ' ') sfg_material_desc,
    nvl((SELECT eic_no_matnr
          FROM v_input_coil
         WHERE eic_cd_epa = LOM_cd_epa
           AND eic_id_coil = LOM_id_first_par
           AND ROWNUM = 1),
        ' ') rm_material,
    (SELECT (SELECT maktx
               FROM v_makt
              WHERE mandt = '600'
                AND matnr = eic_no_matnr
                AND ROWNUM = 1)
       FROM v_input_coil
      WHERE eic_cd_epa = LOM_cd_epa
        AND eic_id_coil = LOM_id_first_par
        AND ROWNUM = 1) rm_material_desc,
    ewi_no_tdc tube_grade
FROM v_work_inst, v_end_cust_ord_epa, V_LDP_PRODN
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
AND ewi_cd_epa = LOM_cd_epa(+)
AND ewi_id_batch = LOM_id_batch(+)
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
    const sql = `call LD0SB003 (
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
    console.log(error);
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

export const getActivity = async (data: any) => {
  try {
    const sql = `SELECT EWI_CAMP_NO FROM V_WORK_INST WHERE EWI_ID_BATCH = '${data?.batchId}' AND EWI_CD_STATUS='CN' AND ROWNUM=1`;
    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getEquivTdc = async (data: any) => {
  try {
    // const sql = `SELECT TDM_EQUIV_TDC AS TDC FROM v_tdc_map WHERE TDM_RM_TDC = '${data?.tdc}'  `;
    const sql = ` SELECT DISTINCT TDC FROM
                  (
                  SELECT LOM_TDC_ACTL AS TDC FROM V_LDP_PRODN WHERE LOM_ID_BATCH ='${data?.batchId}'
                  UNION
                  SELECT TDM_EQUIV_TDC AS TDC FROM v_tdc_map WHERE TDM_RM_TDC = '${data?.tdc}'
                  )
                  ORDER BY 1 `;
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
