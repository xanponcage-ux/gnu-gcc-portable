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
    var sql = `SELECT
    batch_age,
    creation_date,
    plant,
    nvl(storage_loc, ' ') storage_loc,
    nvl(current_work_center, ' ') current_work_center,
    nvl(planned_work_center, ' ') planned_work_center,
    nvl(next_work_center, ' ') next_work_center,
    nvl(planned_cust_name, ' ') planned_cust_name,
    batch_id,
    thick,
    width,
    nvl(idia, 0) idia,
    length,
    net_wt,
    gross_wt,
    cust_order,
    cust_item,
    age_days,
    enc_id_order,
    enc_no_item,
    enc_order_type,
    nvl(so_thick, 0) so_thick,
    nvl(so_odia, 0) so_odia,
    nvl(so_idia, 0) so_idia,
    nvl(so_length, 0) so_length,
    so_od_tolerance,
    so_thick_tolerance,
    so_length_tolerance,
    nvl(so_grade, ' '),
    actual_tdc,
    prod_cd,
    qlty,
    nvl(planned_route, ' ') planned_route,
    nvl(surfase_size, 0) surfase_size,
    so_finish,
    fg_material_no,
    nvl(fg_material_desc, ' ') fg_material_desc,
    nvl(planned_stage_remark, ' ') planned_stage_remark,
    nvl(planned_header_remark, ' ') planned_header_remark,
    unrestricted_stock,
    material_desc,
    stock_in_qinsp,
    blocked_stock,
    stock_in_transit,
    nvl(material_group, ' ') material_group,
    nvl(material_type, ' ') material_type,
    source1,
    cast_no,
    nvl(divison, ' ') divison,
    nvl(hsn_code, ' ') hsn_code,
    plan_quantity,
    no_of_pieces,
    nvl(physical_loc, ' ') physical_loc,
    slit_batch,
    slit_batch_qty,
    nvl(merged_batch, ' ') merged_batch,
    uom,
    nvl(prev_proc, ' ') prev_proc,
    curr_proc,
    nvl(next_proc, ' ') next_proc,
    status,
    STATUSAGE,
    parent_batch,
    mother_batch,
    mother_batch_age,
    mother_batch_wt,
    rm_matrl_no,
    nvl(rm_material_desc, ' ') rm_material_desc,
    actual_route,
    plant_nm,
    scrap_wt,
    rolling_length,
    nvl(prod_strt_tm, ' ') prod_strt_tm,
    nvl(prod_end_tm, ' ') prod_end_tm,
    nvl(processing_flag, ' ') processing_flag,
    STATUS_DESC,
    nvl(WIP_MAT, ' ') WIP_MAT,
    nvl(WIP_MAT_DESC, ' ') WIP_MAT_DESC,
    nvl(FG_MAT_NO, ' ') FG_MAT_NO, 
    nvl(FG_MAT_DESC, ' ') FG_MAT_DESC,
    RECVPLANT,
    nvl(EOM_OPER_COMMENT, ' ') EOM_OPER_COMMENT,
    spec,
    EIC_TDC_ACTL
FROM
    (
        SELECT
            nvl(round((sysdate - eom_ts_creation), 0), 0) batch_age,
            to_char(eom_ts_creation, 'DD-MON-YY HH24:MI:SS') creation_date,
            eom_cd_epa            plant,
            eom_cd_pack           storage_loc,
            (
                SELECT
                    ewi_wrk_center_no
                FROM
                    AGRIDBA.V_WORK_INST_AG
                WHERE
                    ewi_cd_epa = eom_cd_epa
                    AND ewi_id_batch = eom_id_first_par
                    AND ewi_cd_status = 'CN'
                    AND ewi_cd_process = SUBSTR(EOM_CD_STATUS,1,1)
                    AND ROWNUM = 1
            ) planned_work_center,
            eom_work_center       current_work_center,
            (
                SELECT
                    plm_wcnt_code
                FROM
                    AGRIDBA.V_PROC_LINE_MACHINE_AG
                WHERE
                    plm_cd_epa = eom_cd_epa
                    AND plm_cd_process = eom_cd_next_proc
                    AND plm_active_status = 'A'
                    AND ROWNUM = 1
            ) next_work_center,
            enc_mark_cust_name    planned_cust_name,
            eom_id_batch          batch_id,
            eom_sec1              thick,
            eom_sec2              width,
            eom_idia              idia,
            eom_length            length,
            eom_ms_gross_cal      net_wt,
            eom_ms_gross_actl     gross_wt,
            eom_id_order_cus      cust_order,
            eom_id_ord_item_cus   cust_item,
            nvl(round((sysdate - eom_ts_creation), 0), 0) age_days,
            enc_id_order,
            enc_no_item,
            enc_order_type,
            enc_sec1_min          so_thick,
            enc_odia              so_odia,
            enc_idia              so_idia,
            enc_length_min        so_length,
            '' so_od_tolerance,
            '' so_thick_tolerance,
            '' so_length_tolerance,
            (
                SELECT
                    grade
                FROM
                    AGRIDBA.V_YMPCT_TUB_MATL_AG
                WHERE
                    mandt = '600'
                    AND matnr = enc_no_matnr
                    AND ROWNUM = 1
            ) so_grade,
            NVL ((SELECT spec FROM AGRIDBA.V_YMPCT_TUB_MATL_AG
              WHERE mandt = '600' AND matnr = eom_no_matnr AND ROWNUM = 1), '') spec,
            eom_tdc_actl          actual_tdc,
            eom_cd_prod           prod_cd,
            eom_cd_qlty_actl      qlty,
            eom_planned_proc      planned_route,
            eom_surfase_size      surfase_size,
            '' so_finish,
            nvl(a.eom_no_matnr, enc_no_matnr) fg_material_no,
            (
                SELECT
                    maktx
                FROM
                    AGRIDBA.V_MAKT_AG
                WHERE
                    mandt = '600'
                    AND matnr = nvl(a.eom_no_matnr, enc_no_matnr)
                    AND ROWNUM = 1
            ) fg_material_desc,
            '' planned_stage_remark,
            '' planned_header_remark,
            eom_ms_gross_cal      unrestricted_stock,
            '' material_desc,
            '' stock_in_qinsp,
            '' blocked_stock,
            '' stock_in_transit,
            enc_print_spec        material_group,
            '' material_type,
            '' source1,
            nvl(eic_no_cast, eom_no_cast) cast_no,
            '' divison,
            '' hsn_code,
            0 plan_quantity,
            eom_no_pieces         no_of_pieces,
            '' physical_loc,
            '' slit_batch,
            0 slit_batch_qty,
            eom_merge_batch       merged_batch,
            nvl(eom_uom, 'Ton') uom,
            eom_cd_prev_proc      prev_proc,
            eom_cd_curr_proc      curr_proc,
            eom_cd_next_proc      next_proc,
            eom_cd_status         status,
            (
              SELECT TRUNC(SYSDATE - STB_TIMESTAMP)
              FROM AGRIDBA.V_STATUS_BKUP_AG x
              WHERE STB_ID_COIL = a.EOM_ID_BATCH
              AND STB_NEW_STATUS = a.EOM_CD_STATUS
              AND STB_TIMESTAMP = (SELECT MAX(STB_TIMESTAMP) FROM AGRIDBA.V_STATUS_BKUP_AG WHERE STB_ID_COIL=x.STB_ID_COIL AND STB_NEW_STATUS=x.STB_NEW_STATUS )
              )  STATUSAGE,
            eom_id_par_coil_no    parent_batch,
            eom_id_first_par      mother_batch,
            nvl(round((sysdate - eic_dt_loading), 0), 0) mother_batch_age,
            eic_ms_gross_actl     mother_batch_wt,
            eic_no_matnr          rm_matrl_no,
            (
                SELECT
                    maktx
                FROM
                    AGRIDBA.V_MAKT_AG
                WHERE
                    mandt = '600'
                    AND matnr = eic_no_matnr
                    AND ROWNUM = 1
            ) rm_material_desc,
            nvl(eom_passed_proc, ' ') actual_route,
            (
                SELECT DISTINCT
                    epl_epa_desc
                FROM
                    AGRIDBA.V_EPA_PROC_LINE_AG
                WHERE
                    epl_active_plant_fl = 'A'
                    AND epl_cd_epa = eom_cd_epa
                    AND ROWNUM = 1
            ) plant_nm,
            eom_ms_scrap          scrap_wt,
            SUBSTR((ENC_CD_END_CUST ||'-'||ENC_CUST_NAME),1,255) RECVPLANT,
            nvl(a.eom_act_length, 0) rolling_length,
            to_char(eom_prod_strt_tm, 'DD-MON-YY HH24:MI:SS') prod_strt_tm,
            to_char(eom_prod_end_tm, 'DD-MON-YY HH24:MI:SS') prod_end_tm,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                   (SELECT DISTINCT CD_DESC FROM AGRIDBA.V_CODES_AG WHERE  CD_TYPE = 'E0001' AND  CD_VALUE = EOM_CD_STATUS AND ROWNUM = 1) STATUS_DESC 
                   ,substr((AGRIDBA.F_WIP_MATNR_AG (a.eom_cd_epa , a.eom_id_batch)),1,18) WIP_MAT,
                   substr((AGRIDBA.F_WIP_MATNR_AG (a.eom_cd_epa , a.eom_id_batch)),20,200) WIP_MAT_DESC,
                   enc_no_matnr fg_mat_no,
                    (
                        SELECT
                            maktx
                        FROM
                            AGRIDBA.V_MAKT_AG
                        WHERE
                            mandt = '600'
                            AND matnr = enc_no_matnr
                            AND ROWNUM = 1
                    ) fg_mat_desc,
                    EOM_OPER_COMMENT,
                    EIC_TDC_ACTL
        FROM
            AGRIDBA.V_EPA_PRODN_AG          a,
            AGRIDBA.V_INPUT_COIL_AG         b,
            AGRIDBA.V_END_CUST_ORD_EPA_AG   c
        WHERE
            eom_cd_epa = eic_cd_epa (+)
            AND eom_id_first_par = eic_id_coil (+)
            AND a.eom_cd_epa = c.enc_cd_epa (+)
            AND a.eom_id_order_cus = c.enc_id_order (+)
            AND a.eom_id_ord_item_cus = c.enc_no_item (+)
            AND eom_cd_epa = :plant`;

    let binds = {
      Plant: plant,
    };

    if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
      sql += ` And trunc(EOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
      binds["DespFromDate"] = DespFromDate;
      binds["DespToDate"] = DespToDate;
    }

    if (ProdFromDate && ProdFromDate !== "" && ProdToDate !== "") {
      sql += ` And trunc(EOM_TS_CREATION) BETWEEN :ProdFromDate AND :ProdToDate `;
      binds["ProdFromDate"] = ProdFromDate;
      binds["ProdToDate"] = ProdToDate;
    }

    if (item && item !== "") {
      sql += ` And EOM_ID_ORD_ITEM_CUS=NVL(:item, EOM_ID_ORD_ITEM_CUS)`;
      binds["item"] = item;
    }

    var chkwidthTo = widthTo ? widthTo : widthFrm;
    var chkwidthFrm = widthFrm ? widthFrm : widthTo;
    if (chkwidthFrm && chkwidthFrm !== "" && chkwidthTo !== "") {
      sql += ` And EOM_SEC2 BETWEEN NVL(:widthFrm, EOM_SEC2) And NVL(:widthTo, EOM_SEC2)`;
      binds["widthFrm"] = chkwidthFrm;
      binds["widthTo"] = chkwidthTo;
    }

    if (status && status !== "") {
      sql += ` And EOM_CD_STATUS =nvl(:Status,EOM_CD_STATUS)`;
      binds["Status"] = status;
    }

    var chkThickTo = thikTo ? thikTo : thikFrm;
    var chkThickFrm = thikFrm ? thikFrm : thikTo;
    if (chkThickFrm && chkThickFrm !== "" && chkThickTo !== "") {
      sql += ` And EOM_SEC1 BETWEEN NVL(:thikFrm, EOM_SEC1) And NVL(:thikTo, EOM_SEC1)`;
      binds["thikFrm"] = chkThickFrm;
      binds["thikTo"] = chkThickTo;
    }

    if (batch && batch !== "") {
      sql += ` And EOM_ID_BATCH = NVL(:batch,EOM_ID_BATCH)`;
      binds["batch"] = batch;
    }

    if (customer && customer !== undefined) {
      sql += ` and ( eom_cd_epa||EOM_ID_ORDER_CUS ||EOM_ID_ORD_ITEM_CUS) in (select enc_cd_epa||enc_id_order||enc_no_item from AGRIDBA.V_END_CUST_ORD_EPA_AG where 
          enc_cd_epa=a.eom_cd_epa And enc_id_order = a.EOM_ID_ORDER_CUS And enc_no_item =a.EOM_ID_ORD_ITEM_CUS And enc_cD_END_CUST =:Customer) `;
      binds["Customer"] = customer;
    }

    if (materialNo && materialNo !== "") {
      sql += ` And EOM_NO_MATNR=NVL(LPAD(:materialNo, 18,'0'),EOM_NO_MATNR)`;
      binds["materialNo"] = materialNo;
    }

    if (mbatch && mbatch !== "") {
      sql += ` And EOM_ID_FIRST_PAR = NVL(:mbatch, EOM_ID_FIRST_PAR) `;
      binds["mbatch"] = mbatch;
    } else {
      sql += ` And EOM_CD_STATUS Not Like '%L' AND EOM_CD_STATUS NOT LIKE '%U' `;
    }

    if (order && order !== "") {
      sql += ` And EOM_ID_ORDER_CUS=NVL(:ordr, EOM_ID_ORDER_CUS)`;
      binds["ordr"] = order;
    }

    if (orderType && orderType !== undefined) {
      sql += ` and ( eom_cd_epa||EOM_ID_ORDER_CUS ||EOM_ID_ORD_ITEM_CUS) in (select enc_cd_epa||enc_id_order||enc_no_item from AGRIDBA.V_END_CUST_ORD_EPA_AG where 
       enc_cd_epa=a.eom_cd_epa And enc_id_order = a.EOM_ID_ORDER_CUS And enc_no_item =a.EOM_ID_ORD_ITEM_CUS And ENC_ORDER_TYPE =:orderType) `;
      binds["orderType"] = orderType;
    }

    if (process && process !== "") {
      sql += ` And EOM_CD_CURR_PROC =NVL(:process, EOM_CD_CURR_PROC)`;
      binds["process"] = process;
    }

    // if (stockType && stockType !== undefined && stockType == 'RM') {
    //   sql += ` AND (EOM_CD_STATUS IN ('VF','VM','MC') OR EOM_CD_STATUS Like '%M' OR EOM_CD_STATUS Like 'V%')
    //   AND EOM_NO_MATNR NOT IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)
    //   `;
    // }
    if (stockType && stockType !== undefined && stockType == "RM") {
      sql += ` AND (EOM_CD_STATUS IN ( SELECT CD_DESC FROM AGRIDBA.V_CODES_AG
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='RM STOCK'))
      AND EOM_NO_MATNR NOT IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)
      `;
    }

    // if (stockType && stockType !== undefined && stockType == 'FG') {
    //   sql += ` AND EOM_CD_STATUS IN ('WB' , 'WS' , 'WT' ,'WC','WD','KB','KF','WF') AND EOM_CD_QLTY_ACTL != 'SCRP'
    //   AND EOM_NO_MATNR NOT IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)
    //   `;
    // }
    if (stockType && stockType !== undefined && stockType == "FG") {
      sql += ` AND EOM_CD_STATUS IN (SELECT CD_DESC FROM AGRIDBA.V_CODES_AG
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='FG STOCK') AND EOM_CD_QLTY_ACTL <> 'SCRP'
      AND EOM_NO_MATNR NOT IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)
      `;
    }

    if (stockType && stockType !== undefined && stockType == "SCRAP") {
      sql += ` AND EOM_CD_QLTY_ACTL = 'SCRP' 
      AND EOM_NO_MATNR NOT IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)`;
    }

    // if (stockType && stockType !== undefined && stockType == 'WIP') {
    //   sql += ` AND
    //   ((EOM_CD_STATUS NOT IN ('VF','VM','MC','WB','WS','WT','WC','WL','WD','KB','KF','WF') AND EOM_CD_STATUS NOT Like '%M' AND EOM_CD_STATUS NOT Like 'V%'  AND EOM_CD_QLTY_ACTL != 'SCRP')
    //   or (EOM_NO_MATNR IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)))`;
    // }
    if (stockType && stockType !== undefined && stockType == "WIP") {
      sql += ` AND 
      ((EOM_CD_STATUS IN ( SELECT CD_DESC FROM AGRIDBA.V_CODES_AG
        WHERE CD_TYPE='TB040'
        AND CD_DESC1 NOT in ('RM STOCK','FG STOCK'))   AND EOM_CD_QLTY_ACTL <> 'SCRP')
      or (EOM_NO_MATNR IN(select cd_value from AGRIDBA.V_CODES_AG where cd_type = 'TB019' and cd_desc1 =eom_cd_epa)))`;
    }

    sql += `)
        ORDER by plant,merged_batch,batch_id`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
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
        ,ERD_NO_MATNR FG_MATERIAL_NO , (SELECT MAKTX FROM AGRIDBA.V_MAKT_AG WHERE MANDT='600' AND MATNR=A.ERD_NO_MATNR AND ROWNUM=1)FG_MATERIAL_DESC
        ,TO_CHAR(ERD_REC_CRT_DT) MERGE_DT ,ERD_REC_CRT_UID MERGED_BY_USER , decode(ERD_MOV_IND , 'B','COIL','F','FG','S','SFG','') MERGED_TYPE
        FROM AGRIDBA.V_EPA_RANDOM_DTLS_AG A
        WHERE ERD_CD_EPA=:plant
        --AND ERD_REC_STATUS = NVL('A', ERD_REC_STATUS)
        `;
    const binds = {
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
    throw new Error.InternalServerError("Error!");
  }
};

export const getOdiaFrm = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM AGRIDBA.V_END_CUST_ORD_EPA_AG
        WHERE ENC_CD_EPA=:plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getOdiaTo = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM AGRIDBA.V_END_CUST_ORD_EPA_AG
        WHERE ENC_CD_EPA= :plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getReversedBatchInfo = async (
  plant: any,
  batchId: any,
  mergeBatch: any
) => {
  try {
    const sql = `SELECT
    eom_timestamp         reversal_dt,
    eom_user_rev          reversal_done_by,
    eom_id_batch          batch_id,
    eom_ms_gross_cal      net_wt,
    eom_uom               net_wt_uom,
    eom_sec1              batch_thk,
    eom_sec2              batch_odia,
    eom_length            batch_length,
    eom_tdc_actl          batch_grade,
    eom_cd_status         batch_status,
    eom_id_par_coil_no    parent_batch,
    eom_id_first_par      first_parent,
    eom_merge_batch       merge_bt,
    eom_no_cast           cast_no,
    eom_idia              idia,
    eom_id_order_cus      order1,
    eom_id_ord_item_cus   item,
    eom_cd_epa            plant,
    eom_no_matnr          material_no,
    eom_oper_id           production_done_by_usr
FROM
    AGRIDBA.V_EPA_PRODN_REVERSE_AG
WHERE
    eom_cd_epa = :plant
    AND eom_id_batch = nvl(:batchId, eom_id_batch)
    AND eom_id_first_par = nvl(:motherBatch, eom_id_first_par)
    Order by eom_id_first_par, eom_id_batch`;

    const binds = {
      plant: plant,
      batchId: batchId,
      motherBatch: mergeBatch,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
