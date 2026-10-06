import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getInventoryData = async (
  DespFromDate: any,
  DespToDate: any,
  ProdFromDate: any,
  ProdToDate: any,
  batch: any,
  customer: any,
  item: any,
  materialNo: any,
  mbatch: any,
  order: any,
  orderType: any,
  plant: any,
  process: any,
  status: any,
  thikFrm: any,
  thikTo: any,
  widthFrm: any,
  widthTo: any,
  stockType: any
) => {
  try {
    var sql = ` SELECT   BATCH_AGE, CREATION_DATE,LOADING_DATE, PLANT, NVL (STORAGE_LOC, ' ') STORAGE_LOC,
         NVL (CURRENT_WORK_CENTER, ' ') CURRENT_WORK_CENTER,
         NVL (PLANNED_WORK_CENTER, ' ') PLANNED_WORK_CENTER,
         NVL (PLANNED_CUST_NAME, ' ') PLANNED_CUST_NAME, BATCH_ID, THICK,
         WIDTH, NVL (IDIA, 0) IDIA, LENGTH, NET_WT, GROSS_WT, CUST_ORDER,
         CUST_ITEM, AGE_DAYS, ENC_ID_ORDER, ENC_NO_ITEM, ENC_ORDER_TYPE,
         NVL (SO_THICK, 0) SO_THICK, NVL (SO_ODIA, 0) SO_ODIA,
         NVL (SO_IDIA, 0) SO_IDIA, NVL (SO_LENGTH, 0) SO_LENGTH,
         SO_OD_TOLERANCE, SO_THICK_TOLERANCE, SO_LENGTH_TOLERANCE,
         NVL (SO_GRADE, ' '), ACTUAL_TDC, PROD_CD, QLTY,
         NVL (PLANNED_ROUTE, ' ') PLANNED_ROUTE, FG_MATERIAL_NO,
         NVL (FG_MATERIAL_DESC, ' ') FG_MATERIAL_DESC, UNRESTRICTED_STOCK,
         NVL (MATERIAL_GROUP, ' ') MATERIAL_GROUP, CAST_NO, NO_OF_PIECES, UOM,
         NVL (PREV_PROC, ' ') PREV_PROC, CURR_PROC,
         NVL (NEXT_PROC, ' ') NEXT_PROC, STATUS, STATUSAGE, PARENT_BATCH,
         MOTHER_BATCH, MOTHER_BATCH_AGE, MOTHER_BATCH_WT, RM_MATRL_NO,
         NVL (RM_MATERIAL_DESC, ' ') RM_MATERIAL_DESC, ACTUAL_ROUTE, PLANT_NM,
         NVL (PROCESSING_FLAG, ' ') PROCESSING_FLAG, STATUS_DESC,
         NVL (FG_MAT_NO, ' ') FG_MAT_NO, NVL (FG_MAT_DESC, ' ') FG_MAT_DESC,
         BARE_SAMPL_TAG_FL, BARE_TAG_BATCH, EC_SAMPL_TAG, EC_TAG_BATCH
    FROM (SELECT NVL (ROUND ((SYSDATE - LOM_TS_CREATION), 0), 0) BATCH_AGE,
                 TO_CHAR (LOM_TS_CREATION,
                          'DD-MON-YY HH24:MI:SS'
                         ) CREATION_DATE,
                         TO_CHAR (LOM_DT_LOADING,
                          'DD-MON-YY'
                         ) LOADING_DATE,
                 LOM_CD_EPA PLANT, LOM_CD_PACK STORAGE_LOC,
                 (SELECT EWI_WRK_CENTER_NO
                    FROM V_WORK_INST
                   WHERE EWI_CD_EPA = LOM_CD_EPA
                     AND EWI_ID_BATCH = LOM_ID_FIRST_PAR
                     AND EWI_CD_STATUS = 'CN'
                     AND EWI_CD_PROCESS = SUBSTR (LOM_CD_STATUS, 1, 1)
                     AND ROWNUM = 1) PLANNED_WORK_CENTER,
                 LOM_WORK_CENTER CURRENT_WORK_CENTER,
                 ENC_MARK_CUST_NAME PLANNED_CUST_NAME, LOM_ID_BATCH BATCH_ID,
                 LOM_SEC1 THICK, LOM_SEC2 WIDTH, LOM_IDIA IDIA,
                 LOM_LENGTH LENGTH, LOM_MS_GROSS_CAL NET_WT,
                 LOM_MS_GROSS_ACTL GROSS_WT, LOM_ID_ORDER_CUS CUST_ORDER,
                 LOM_ID_ORD_ITEM_CUS CUST_ITEM,
                 NVL (ROUND ((SYSDATE - LOM_TS_CREATION), 0), 0) AGE_DAYS,
                 ENC_ID_ORDER, ENC_NO_ITEM, ENC_ORDER_TYPE,
                 ENC_SEC1_MIN SO_THICK, ENC_ODIA SO_ODIA, ENC_IDIA SO_IDIA,
                 ENC_LENGTH_MIN SO_LENGTH, '' SO_OD_TOLERANCE,
                 '' SO_THICK_TOLERANCE, '' SO_LENGTH_TOLERANCE,
                 (SELECT GRADE
                    FROM V_YMPCT_TUB_MATL
                   WHERE MANDT = '600'
                     AND MATNR = ENC_NO_MATNR
                     AND ROWNUM = 1) SO_GRADE,
                 LOM_TDC_ACTL ACTUAL_TDC, LOM_CD_PROD PROD_CD,
                 LOM_CD_QLTY_ACTL QLTY, LOM_PLANNED_PROC PLANNED_ROUTE,
                 NVL (A.LOM_NO_MATNR, ENC_NO_MATNR) FG_MATERIAL_NO,
                 (SELECT MAKTX
                    FROM V_MAKT
                   WHERE MANDT = '600'
                     AND MATNR = NVL (A.LOM_NO_MATNR, ENC_NO_MATNR)
                     AND ROWNUM = 1) FG_MATERIAL_DESC,
                 LOM_MS_GROSS_CAL UNRESTRICTED_STOCK,
                 ENC_PRINT_SPEC MATERIAL_GROUP,
                 NVL (EIC_NO_CAST, LOM_NO_CAST) CAST_NO,
                 LOM_NO_PIECES NO_OF_PIECES, NVL (LOM_UOM, 'Ton') UOM,
                 LOM_CD_PREV_PROC PREV_PROC, LOM_CD_CURR_PROC CURR_PROC,
                 LOM_CD_NEXT_PROC NEXT_PROC, LOM_CD_STATUS STATUS,
                 (SELECT TRUNC (SYSDATE - STB_TIMESTAMP)
                    FROM V_STATUS_BKUP X
                   WHERE STB_ID_COIL = A.LOM_ID_BATCH
                     AND STB_NEW_STATUS = A.LOM_CD_STATUS
                     AND STB_TIMESTAMP =
                            (SELECT MAX (STB_TIMESTAMP)
                               FROM V_STATUS_BKUP
                              WHERE STB_ID_COIL = X.STB_ID_COIL
                                AND STB_NEW_STATUS = X.STB_NEW_STATUS))
                                                                    STATUSAGE,
                 LOM_ID_PAR_COIL_NO PARENT_BATCH,
                 LOM_ID_FIRST_PAR MOTHER_BATCH,
                 NVL (ROUND ((SYSDATE - EIC_DT_LOADING), 0),
                      0
                     ) MOTHER_BATCH_AGE,
                 EIC_MS_GROSS_ACTL MOTHER_BATCH_WT, EIC_NO_MATNR RM_MATRL_NO,
                 (SELECT MAKTX
                    FROM V_MAKT
                   WHERE MANDT = '600'
                     AND MATNR = EIC_NO_MATNR
                     AND ROWNUM = 1) RM_MATERIAL_DESC,
                 NVL (LOM_PASSED_PROC, ' ') ACTUAL_ROUTE,
                 (SELECT DISTINCT EPL_EPA_DESC
                             FROM V_EPA_PROC_LINE
                            WHERE EPL_ACTIVE_PLANT_FL = 'A'
                              AND EPL_CD_EPA = LOM_CD_EPA
                              AND ROWNUM = 1) PLANT_NM,
                 DECODE (LOM_CD_ST_ACTL,
                         '1', 'Prime',
                         2, 'Partial Scrapped',
                         '3', 'Downgraded',
                         '5', 'Additional Process',
                         '8', 'Diverted',
                         '9', 'Scrapped',
                         'Prime'
                        ) PROCESSING_FLAG,
                 (SELECT DISTINCT CD_DESC
                             FROM V_CODES
                            WHERE CD_TYPE = 'E0001'
                              AND CD_VALUE = LOM_CD_STATUS
                              AND ROWNUM = 1) STATUS_DESC,
                 ENC_NO_MATNR FG_MAT_NO,
                 (SELECT MAKTX
                    FROM V_MAKT
                   WHERE MANDT = '600'
                     AND MATNR = ENC_NO_MATNR
                     AND ROWNUM = 1) FG_MAT_DESC,
                 LOM_SAMPL_TAG BARE_SAMPL_TAG_FL,
                 LOM_TAGGED_BATCH BARE_TAG_BATCH,
                 LOM_SAMPL_TAG_EC EC_SAMPL_TAG,
                 LOM_TAGGED_BATCH_EC EC_TAG_BATCH
            FROM V_LDP_PRODN A, V_INPUT_COIL B, V_END_CUST_ORD_EPA C
           WHERE LOM_CD_EPA = EIC_CD_EPA(+)
             AND LOM_ID_FIRST_PAR = EIC_ID_COIL(+)
             AND A.LOM_CD_EPA = C.ENC_CD_EPA(+)
             AND A.LOM_ID_ORDER_CUS = C.ENC_ID_ORDER(+)
             AND A.LOM_ID_ORD_ITEM_CUS = C.ENC_NO_ITEM(+)
             AND LOM_CD_EPA = :plant 
             AND LOM_CD_STATUS = 'WL' `;

    //     var sql = `SELECT
    //     batch_age,
    //     creation_date,
    //     plant,
    //     nvl(storage_loc, ' ') storage_loc,
    //     nvl(current_work_center, ' ') current_work_center,
    //     nvl(planned_work_center, ' ') planned_work_center,
    //     nvl(planned_cust_name, ' ') planned_cust_name,
    //     batch_id,
    //     thick,
    //     width,
    //     nvl(idia, 0) idia,
    //     length,
    //     net_wt,
    //     gross_wt,
    //     cust_order,
    //     cust_item,
    //     age_days,
    //     enc_id_order,
    //     enc_no_item,
    //     enc_order_type,
    //     nvl(so_thick, 0) so_thick,
    //     nvl(so_odia, 0) so_odia,
    //     nvl(so_idia, 0) so_idia,
    //     nvl(so_length, 0) so_length,
    //     so_od_tolerance,
    //     so_thick_tolerance,
    //     so_length_tolerance,
    //     nvl(so_grade, ' '),
    //     actual_tdc,
    //     prod_cd,
    //     qlty,
    //     nvl(planned_route, ' ') planned_route,
    //     fg_material_no,
    //     nvl(fg_material_desc, ' ') fg_material_desc,
    //     unrestricted_stock,
    //     nvl(material_group, ' ') material_group,
    //     cast_no,
    //     no_of_pieces,
    //     uom,
    //     nvl(prev_proc, ' ') prev_proc,
    //     curr_proc,
    //     nvl(next_proc, ' ') next_proc,
    //     status,
    //     STATUSAGE,
    //     parent_batch,
    //     mother_batch,
    //     mother_batch_age,
    //     mother_batch_wt,
    //     rm_matrl_no,
    //     nvl(rm_material_desc, ' ') rm_material_desc,
    //     actual_route,
    //     plant_nm,
    //     nvl(processing_flag, ' ') processing_flag,
    //     STATUS_DESC,
    //     nvl(FG_MAT_NO, ' ') FG_MAT_NO,
    //     nvl(FG_MAT_DESC, ' ') FG_MAT_DESC
    // FROM
    //     (
    //         SELECT
    //             nvl(round((sysdate - LOM_ts_creation), 0), 0) batch_age,
    //             to_char(LOM_ts_creation, 'DD-MON-YY HH24:MI:SS') creation_date,
    //             LOM_cd_epa            plant,
    //             LOM_cd_pack           storage_loc,
    //             (
    //                 SELECT
    //                     ewi_wrk_center_no
    //                 FROM
    //                     v_work_inst
    //                 WHERE
    //                     ewi_cd_epa = LOM_cd_epa
    //                     AND ewi_id_batch = LOM_id_first_par
    //                     AND ewi_cd_status = 'CN'
    //                     AND ewi_cd_process = SUBSTR(LOM_CD_STATUS,1,1)
    //                     AND ROWNUM = 1
    //             ) planned_work_center,
    //             LOM_work_center       current_work_center,
    //             enc_mark_cust_name    planned_cust_name,
    //             LOM_id_batch          batch_id,
    //             LOM_sec1              thick,
    //             LOM_sec2              width,
    //             LOM_idia              idia,
    //             LOM_length            length,
    //             LOM_ms_gross_cal      net_wt,
    //             LOM_ms_gross_actl     gross_wt,
    //             LOM_id_order_cus      cust_order,
    //             LOM_id_ord_item_cus   cust_item,
    //             nvl(round((sysdate - LOM_ts_creation), 0), 0) age_days,
    //             enc_id_order,
    //             enc_no_item,
    //             enc_order_type,
    //             enc_sec1_min          so_thick,
    //             enc_odia              so_odia,
    //             enc_idia              so_idia,
    //             enc_length_min        so_length,
    //             '' so_od_tolerance,
    //             '' so_thick_tolerance,
    //             '' so_length_tolerance,
    //             (
    //                 SELECT
    //                     grade
    //                 FROM
    //                     v_ympct_tub_matl
    //                 WHERE
    //                     mandt = '600'
    //                     AND matnr = enc_no_matnr
    //                     AND ROWNUM = 1
    //             ) so_grade,
    //             LOM_tdc_actl          actual_tdc,
    //             LOM_cd_prod           prod_cd,
    //             LOM_cd_qlty_actl      qlty,
    //             LOM_planned_proc      planned_route,
    //             nvl(a.LOM_no_matnr, enc_no_matnr) fg_material_no,
    //             (
    //                 SELECT
    //                     maktx
    //                 FROM
    //                     v_makt
    //                 WHERE
    //                     mandt = '600'
    //                     AND matnr = nvl(a.LOM_no_matnr, enc_no_matnr)
    //                     AND ROWNUM = 1
    //             ) fg_material_desc,
    //             LOM_ms_gross_cal      unrestricted_stock,
    //             enc_print_spec        material_group,
    //             nvl(eic_no_cast, LOM_no_cast) cast_no,
    //             LOM_no_pieces         no_of_pieces,
    //             nvl(LOM_uom, 'Ton') uom,
    //             LOM_cd_prev_proc      prev_proc,
    //             LOM_cd_curr_proc      curr_proc,
    //             LOM_cd_next_proc      next_proc,
    //             LOM_cd_status         status,
    //             (
    //               SELECT TRUNC(SYSDATE - STB_TIMESTAMP)
    //               FROM V_STATUS_BKUP x
    //               WHERE STB_ID_COIL = a.LOM_ID_BATCH
    //               AND STB_NEW_STATUS = a.LOM_CD_STATUS
    //               AND STB_TIMESTAMP = (SELECT MAX(STB_TIMESTAMP) FROM V_STATUS_BKUP WHERE STB_ID_COIL=x.STB_ID_COIL AND STB_NEW_STATUS=x.STB_NEW_STATUS )
    //               )  STATUSAGE,
    //             LOM_id_par_coil_no    parent_batch,
    //             LOM_id_first_par      mother_batch,
    //             nvl(round((sysdate - eic_dt_loading), 0), 0) mother_batch_age,
    //             eic_ms_gross_actl     mother_batch_wt,
    //             eic_no_matnr          rm_matrl_no,
    //             (
    //                 SELECT
    //                     maktx
    //                 FROM
    //                     v_makt
    //                 WHERE
    //                     mandt = '600'
    //                     AND matnr = eic_no_matnr
    //                     AND ROWNUM = 1
    //             ) rm_material_desc,
    //             nvl(LOM_passed_proc, ' ') actual_route,
    //             (
    //                 SELECT DISTINCT
    //                     epl_epa_desc
    //                 FROM
    //                     v_epa_proc_line
    //                 WHERE
    //                     epl_active_plant_fl = 'A'
    //                     AND epl_cd_epa = LOM_cd_epa
    //                     AND ROWNUM = 1
    //             ) plant_nm,
    //             decode(LOM_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
    //                    '3', 'Downgraded', '5', 'Additional Process', '8',
    //                    'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
    //                    (SELECT DISTINCT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'E0001' AND  CD_VALUE = LOM_CD_STATUS AND ROWNUM = 1) STATUS_DESC,
    //                    enc_no_matnr fg_mat_no,
    //                     (
    //                         SELECT
    //                             maktx
    //                         FROM
    //                             v_makt
    //                         WHERE
    //                             mandt = '600'
    //                             AND matnr = enc_no_matnr
    //                             AND ROWNUM = 1
    //                     ) fg_mat_desc
    //         FROM
    //             v_LDP_PRODN          a,
    //             v_input_coil         b,
    //             v_end_cust_ord_epa   c
    //         WHERE
    //             LOM_cd_epa = eic_cd_epa (+)
    //             AND LOM_id_first_par = eic_id_coil (+)
    //             AND a.LOM_cd_epa = c.enc_cd_epa (+)
    //             AND a.LOM_id_order_cus = c.enc_id_order (+)
    //             AND a.LOM_id_ord_item_cus = c.enc_no_item (+)
    //             AND LOM_cd_epa = :plant `;

    let binds: any = {
      Plant: plant,
    };

    if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
      sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
      binds["DespFromDate"] = DespFromDate;
      binds["DespToDate"] = DespToDate;
    }

    if (ProdFromDate && ProdFromDate !== "" && ProdToDate !== "") {
      sql += ` And trunc(LOM_DT_LOADING) BETWEEN :ProdFromDate AND :ProdToDate `;
      binds["ProdFromDate"] = ProdFromDate;
      binds["ProdToDate"] = ProdToDate;
    }

    if (item && item !== "") {
      sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
      binds["item"] = item;
    }

    var chkwidthTo = widthTo ? widthTo : widthFrm;
    var chkwidthFrm = widthFrm ? widthFrm : widthTo;
    if (chkwidthFrm && chkwidthFrm !== "" && chkwidthTo !== "") {
      sql += ` And LOM_SEC2 BETWEEN NVL(:widthFrm, LOM_SEC2) And NVL(:widthTo, LOM_SEC2)`;
      binds["widthFrm"] = chkwidthFrm;
      binds["widthTo"] = chkwidthTo;
    }

    if (status && status !== "") {
      sql += ` And LOM_CD_STATUS =nvl(:Status,LOM_CD_STATUS)`;
      binds["Status"] = status;
    }

    var chkThickTo = thikTo ? thikTo : thikFrm;
    var chkThickFrm = thikFrm ? thikFrm : thikTo;
    if (chkThickFrm && chkThickFrm !== "" && chkThickTo !== "") {
      sql += ` And LOM_SEC1 BETWEEN NVL(:thikFrm, LOM_SEC1) And NVL(:thikTo, LOM_SEC1)`;
      binds["thikFrm"] = chkThickFrm;
      binds["thikTo"] = chkThickTo;
    }

    if (batch && batch !== "") {
      sql += ` And LOM_ID_BATCH = NVL(:batch,LOM_ID_BATCH)`;
      binds["batch"] = batch;
    }

    if (customer && customer !== undefined) {
      sql += ` and ( LOM_cd_epa||LOM_ID_ORDER_CUS ||LOM_ID_ORD_ITEM_CUS) in (select enc_cd_epa||enc_id_order||enc_no_item from v_End_cust_ord_Epa where 
          enc_cd_epa=a.LOM_cd_epa And enc_id_order = a.LOM_ID_ORDER_CUS And enc_no_item =a.LOM_ID_ORD_ITEM_CUS And enc_cD_END_CUST =:Customer) `;
      binds["Customer"] = customer;
    }

    if (materialNo && materialNo !== "") {
      sql += ` And LOM_NO_MATNR=NVL(LPAD(:materialNo, 18,'0'),LOM_NO_MATNR)`;
      binds["materialNo"] = materialNo;
    }

    if (mbatch && mbatch !== "") {
      sql += ` And LOM_ID_FIRST_PAR = NVL(:mbatch, LOM_ID_FIRST_PAR) `;
      binds["mbatch"] = mbatch;
    } else {
      sql += `  `;
    }

    if (order && order !== "") {
      sql += ` And LOM_ID_ORDER_CUS=NVL(:ordr, LOM_ID_ORDER_CUS)`;
      binds["ordr"] = order;
    }

    if (orderType && orderType !== undefined) {
      sql += ` and ( LOM_cd_epa||LOM_ID_ORDER_CUS ||LOM_ID_ORD_ITEM_CUS) in (select enc_cd_epa||enc_id_order||enc_no_item from v_End_cust_ord_Epa where 
       enc_cd_epa=a.LOM_cd_epa And enc_id_order = a.LOM_ID_ORDER_CUS And enc_no_item =a.LOM_ID_ORD_ITEM_CUS And ENC_ORDER_TYPE =:orderType) `;
      binds["orderType"] = orderType;
    }

    if (process && process !== "") {
      sql += ` And LOM_CD_CURR_PROC =NVL(:process, LOM_CD_CURR_PROC)`;
      binds["process"] = process;
    }

    // if (stockType && stockType !== undefined && stockType == 'RM') {
    //   sql += ` AND (LOM_CD_STATUS IN ('VF','VM','MC') OR LOM_CD_STATUS Like '%M' OR LOM_CD_STATUS Like 'V%')
    //   AND LOM_NO_MATNR NOT IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)
    //   `;
    // }
    if (stockType && stockType !== undefined && stockType == "RM") {
      sql += ` AND (LOM_CD_STATUS IN ( SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='RM STOCK'))
      AND LOM_NO_MATNR NOT IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)
      `;
    }

    // if (stockType && stockType !== undefined && stockType == 'FG') {
    //   sql += ` AND LOM_CD_STATUS IN ('WB' , 'WS' , 'WT' ,'WC','WD','KB','KF','WF') AND LOM_CD_QLTY_ACTL != 'SCRP'
    //   AND LOM_NO_MATNR NOT IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)
    //   `;
    // }
    if (stockType && stockType !== undefined && stockType == "FG") {
      sql += ` AND LOM_CD_STATUS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='FG STOCK') AND LOM_CD_QLTY_ACTL <> 'SCRP'
      AND LOM_NO_MATNR NOT IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)
      `;
    }

    if (stockType && stockType !== undefined && stockType == "SCRAP") {
      sql += `AND LOM_CD_ST_ACTL = '9' `;
      // sql += ` AND LOM_CD_QLTY_ACTL = 'SCRP'
      // AND LOM_NO_MATNR NOT IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)`;
    }

    // if (stockType && stockType !== undefined && stockType == 'WIP') {
    //   sql += ` AND
    //   ((LOM_CD_STATUS NOT IN ('VF','VM','MC','WB','WS','WT','WC','WL','WD','KB','KF','WF') AND LOM_CD_STATUS NOT Like '%M' AND LOM_CD_STATUS NOT Like 'V%'  AND LOM_CD_QLTY_ACTL != 'SCRP')
    //   or (LOM_NO_MATNR IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)))`;
    // }
    if (stockType && stockType !== undefined && stockType == "WIP") {
      sql += ` AND 
      ((LOM_CD_STATUS IN ( SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1 NOT in ('RM STOCK','FG STOCK'))   AND LOM_CD_QLTY_ACTL <> 'SCRP')
      or (LOM_NO_MATNR IN(select cd_value from V_CODES where cd_type = 'TB019' and cd_desc1 =LOM_cd_epa)))`;
    }

    sql += `)
        ORDER by plant,batch_id `;
    console.log("dispatch: ", sql);
    // console.log("binds: ", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergedInv = async (
  fromDt: any,
  mergedType: any,
  plant: any,
  toDt: any,
  batchMerg: any,
  mergedBatchMerg: any
) => {
  try {
    var sql = `SELECT ERD_CD_EPA PLANT, ERD_ID_BATCH SLIT_COIL,ERD_BATCH_QTY SLIT_COIL_QTY, ERD_ID_NEW_BATCH MERGED_BATCH , ERD_NEW_BATCH_QTY MERGED_BATCH_QTY
        ,ERD_NO_MATNR FG_MATERIAL_NO , (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.ERD_NO_MATNR AND ROWNUM=1)FG_MATERIAL_DESC
        ,TO_CHAR(ERD_REC_CRT_DT) MERGE_DT ,ERD_REC_CRT_UID MERGED_BY_USER , decode(ERD_MOV_IND , 'B','COIL','F','FG','S','SFG','') MERGED_TYPE
        FROM V_EPA_RANDOM_DTLS A
        WHERE ERD_CD_EPA=:plant
        --AND ERD_REC_STATUS = NVL('A', ERD_REC_STATUS)
        `;
    const binds: any = {
      plant: plant,
    };

    if (mergedType && mergedType != "") {
      if (mergedType == "ALL") {
        sql += ` AND ERD_MOV_IND IN ('B' , 'F' , 'S')`;
      } else {
        sql += ` AND ERD_MOV_IND = NVL(:mergedType, ERD_REC_STATUS)`;
        binds["mergedType"] = mergedType;
      }
    } else {
      sql += ` AND ERD_MOV_IND = NVL('B', ERD_REC_STATUS)`;
    }

    if (batchMerg && batchMerg != "") {
      sql += ` AND ERD_ID_BATCH = :batchMerg`;
      binds["batchMerg"] = batchMerg;
    }

    if (mergedBatchMerg && mergedBatchMerg != "") {
      sql += ` AND ERD_ID_NEW_BATCH = :mergedBatchMerg`;
      binds["mergedBatchMerg"] = mergedBatchMerg;
    }

    if (fromDt && toDt && fromDt != "" && toDt != "") {
      sql += ` AND trunc(ERD_REC_CRT_DT) BETWEEN :fromDt AND :toDt `;
      binds["fromDt"] = fromDt;
      binds["toDt"] = toDt;
    }

    sql += ` ORDER BY ERD_ID_NEW_BATCH , ERD_ID_BATCH , ERD_MOV_IND`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaFrm = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA=:plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaTo = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA= :plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getReversedBatchInfo = async (
  plant: any,
  batchId: any,
  mergeBatch: any
) => {
  try {
    const sql = `SELECT
    LOM_timestamp         reversal_dt,
    LOM_user_rev          reversal_done_by,
    LOM_id_batch          batch_id,
    LOM_ms_gross_cal      net_wt,
    LOM_uom               net_wt_uom,
    LOM_sec1              batch_thk,
    LOM_sec2              batch_odia,
    LOM_length            batch_length,
    LOM_tdc_actl          batch_grade,
    LOM_cd_status         batch_status,
    LOM_id_par_coil_no    parent_batch,
    LOM_id_first_par      first_parent,
    LOM_merge_batch       merge_bt,
    LOM_no_cast           cast_no,
    LOM_idia              idia,
    LOM_id_order_cus      order1,
    LOM_id_ord_item_cus   item,
    LOM_cd_epa            plant,
    LOM_no_matnr          material_no,
    LOM_oper_id           production_done_by_usr
FROM
    v_LDP_PRODN_reverse
WHERE
    LOM_cd_epa = :plant
    AND LOM_id_batch = nvl(:batchId, LOM_id_batch)
    AND LOM_id_first_par = nvl(:motherBatch, LOM_id_first_par)
    Order by LOM_id_first_par, LOM_id_batch`;

    const binds = {
      plant: plant,
      batchId: batchId,
      motherBatch: mergeBatch,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
