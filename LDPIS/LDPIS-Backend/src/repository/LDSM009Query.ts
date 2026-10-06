import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetProcess = async (Plant: any) => {
  try {
    let sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProdInqData = async (
  plant: any,
  Process: any,
  pname: any,
  Batch_Id: any,
  MBatch_Id: any,
  ThickMin: any,
  ThickMax: any,
  widthMin: any,
  widthMax: any,
  ProdDateFrom: any,
  ProdDateTo: any,
  SchedDateFrom: any,
  SchedDateTo: any,
  prodType: any
) => {
  try {
    var sql = `SELECT
        LOM_cd_epa           plant,
        LOM_cd_status,
        LOM_id_batch         batch_id,
        CASE
            WHEN LOM_NO_MATNR NOT IN (
            SELECT CD_VALUE
            FROM V_CODES
            WHERE CD_TYPE='TB041'
            ) THEN 'A Prime'
            ELSE (
            SELECT CD_DESC
            FROM V_CODES
            WHERE CD_TYPE='TB041'
            AND CD_VALUE = LOM_NO_MATNR
            and rownum=1
            )
        END AS CATEGORY,
        nvl(decode(LOM_uom, 'KG', round((LOM_ms_gross_cal / 1000), 3), LOM_ms_gross_cal), 0) net_wt,
        nvl(LOM_uom, 'Ton') uom,
        (
            SELECT
                f_scrappdi_tub(LOM_cd_epa, LOM_id_first_par, epr_cd_process,(
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = LOM_cd_epa
                        AND ROWNUM = 1
                ), 'SCRAP')
            FROM
                dual
        ) scrap_batch_id,
        epr_no_pieces,
        EPR_CD_PROCESS,
        LOM_ms_gross_actl,
        nvl((
            SELECT
                cd_desc
            FROM
                v_codes
            WHERE
                cd_value = LOM_cd_status
                AND cd_type = 'E0001'
        ), ' ') status_desc,
        nvl(
            CASE LOM_cd_curr_proc
                WHEN 'W' THEN
                    epr_ms_piece_actl
                ELSE
                    epr_ms_input
            END, 0) ms_input,
        nvl(ewi_ms_input, 0) / 1000 planned_wt,
        nvl(
            CASE LOM_cd_curr_proc
                WHEN 'W' THEN
                    epr_ms_piece_actl
                ELSE
                    epr_ms_input
            END
            - nvl(epr_ms_piece_actl, 0), 0) ms_scrap,
        CASE LOM_cd_curr_proc
            WHEN 'W' THEN
                100
            ELSE
                epr_yield_perc
        END yield_perc,
        LOM_inv_loss,
        LOM_id_order_cus,
        LOM_id_ord_item_cus,
        nvl((
            SELECT
                enc_order_type
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ), ' ') ord_type,
        LOM_id_order,
        LOM_no_item,
        epr_no_cast,
        nvl((
            SELECT
                enc_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ), ' ') customer,
        nvl((
            SELECT
                enc_no_tracking
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ), ' ') track_no,
        to_char(epr_dt_prodn_tata, 'DD-MON-YY') epr_dt_prodn_tata,
        to_char(epr_dt_prodn_tata, 'HH24:MI:SS') epr_tm_prodn_tata,
        epr_cd_shift,
        round(nvl(LOM_ms_scrap, 0), 3) scrap_wt,
        to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt,
        LOM_cd_curr_proc     curr_process,
        nvl(LOM_cd_next_proc, ' ') next_process,
        nvl(LOM_cd_prev_proc, ' ') prev_process,
        LOM_cd_qlty_actl     batchqltycd,
        LOM_sec1             thick,
        LOM_sec2             odia,
        LOM_length           length,
        LOM_tdc_actl         grade,
        LOM_id_first_par     mother_batch,
        LOM_id_par_coil_no   parent_batch,
        LOM_cd_prod,
        (
            SELECT DISTINCT
                eic_cd_qlty_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) m_batchqlty,
        (
            SELECT DISTINCT
                eic_tdc_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) m_batch_tdc,
        (
            SELECT DISTINCT
                eic_sec1
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) m_batch_thick,
        (
            SELECT DISTINCT
                eic_sec2
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) m_batch_width,
        (
            SELECT DISTINCT
                eic_ms_piece_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) m_batch_weight,
        (
            SELECT DISTINCT
                eic_mk_customer
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) intendent_cust,
        LOM_no_cast,
        LOM_passed_proc,
        nvl((
            SELECT
                enc_ship_to_prty_desc
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = LOM_cd_epa
                AND enc_id_order = LOM_id_order_cus
                AND enc_no_item = LOM_id_ord_item_cus
        ), ' ') ship_to_party,
        epr_cd_epa,
        LOM_id_op_decsn,
        LOM_no_matnr,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = LOM_no_matnr
        ) matr_desc,
        (
            SELECT
                nvl(length, 0)
            FROM
                v_ympct_tub_matl
            WHERE
                mandt = '600'
                AND matnr = b.ewi_sfg_matnr
        ) semi_finish_length,
        nvl(LOM_act_length, 0) mill_length,
        b.ewi_sfg_matnr      semi_finish_mat_no,
        (
            SELECT
                maktx
            FROM
                v_ympct_tub_matl
            WHERE
                mandt = '600'
                AND matnr = b.ewi_sfg_matnr
        ) semi_finish_desc,
        (
            SELECT
                SUM(LOM_ms_gross_cal)
            FROM
                v_LDP_PRODN d
            WHERE
                LOM_cd_epa = c.LOM_cd_epa
                AND LOM_id_batch = c.LOM_id_batch
                AND LOM_cd_qlty_actl = 'SCRP'
                AND LOM_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.LOM_cd_epa
                        AND cd_desc1 = 'T'
                )
        ) sf_cq_tube,
        (
            SELECT
                SUM(LOM_ms_gross_cal)
            FROM
                v_LDP_PRODN d
            WHERE
                LOM_cd_epa = c.LOM_cd_epa
                AND LOM_id_batch = c.LOM_id_batch
                AND LOM_cd_qlty_actl = 'SCRP'
                AND LOM_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.LOM_cd_epa
                        AND cd_desc1 = 'O'
                )
        ) sf_open,
        (
            SELECT
                SUM(LOM_ms_gross_cal)
            FROM
                v_LDP_PRODN d
            WHERE
                LOM_cd_epa = c.LOM_cd_epa
                AND LOM_id_batch = c.LOM_id_batch
                AND LOM_cd_qlty_actl = 'SCRP'
                AND LOM_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.LOM_cd_epa
                        AND cd_desc1 NOT IN (
                            'O',
                            'T'
                        )
                )
        ) scrap,
        ewi_sfg_matnr        sfg_material_no,
        nvl((
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = ewi_sfg_matnr
        ), ' ') sfg_material_desc,
        (
            SELECT DISTINCT
                eic_no_matnr
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = LOM_id_first_par
        ) rm_material_no,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                    SELECT DISTINCT
                        eic_no_matnr
                    FROM
                        v_input_coil
                    WHERE
                        eic_cd_epa = epr_cd_epa
                        AND eic_id_coil = LOM_id_first_par
                )
                AND ROWNUM = 1
        ) rm_material_desc,
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
          (
            SELECT
                pph_product
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = LOM_cd_epa
                AND pph_cd_proc_path = LOM_planned_proc
                AND ROWNUM = 1
        ) product_name,
        to_char(LOM_ts_creation, 'DD-MON-YY HH24:MI:SS') LOM_ts_creation,
        (
            SELECT
                eic_ms_gross_actl
            FROM
                v_input_coil d
            WHERE
                c.LOM_id_first_par = d.eic_id_coil
        ) mother_batch_wt,
        to_char(epr_prod_strt_tm, 'DD-MON-YY HH24:MI:SS') prod_strt_tm,
        to_char(epr_prod_end_tm, 'DD-MON-YY HH24:MI:SS') prod_end_tm,
        decode(c.LOM_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
               '3', 'Downgraded', '5', 'Additional Process', '8',
               'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
               NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) Mill_Wt
               ,TO_CHAR(EPR_TS_REC_CREATE, 'DD-MM-YYYY HH24:MI:SS') REC_CRT_DT
               ,EPR_WORK_CENT,EPR_ID_ORDER, EPR_SEC1, EPR_SEC2, EPR_IDIA, EPR_NO_ITEM,ROUND(EPR_LENGTH,3) EPR_LENGTH
               ,substr((F_WIP_MATNR (c.LOM_cd_epa , c.LOM_id_batch)),1,18) WIP_MAT,
               substr((F_WIP_MATNR (c.LOM_cd_epa , c.LOM_id_batch)),20,200) WIP_MAT_DESC
               FROM
        v_epa_line_prodn   a,
        v_work_inst        b,
        v_LDP_PRODN        c
    WHERE
        epr_id_batch = LOM_id_batch
        AND epr_cd_epa = LOM_cd_epa
        AND LOM_cd_epa = ewi_cd_epa
        AND LOM_id_batch = ewi_id_batch
        AND epr_cd_epa = ewi_cd_epa
        AND epr_id_batch = ewi_id_batch
        AND epr_id_wrk_inst = ewi_id_wrk_inst
        AND ewi_cd_status <> 'RJ'
        AND LOM_cd_status <> 'VF'
        AND LOM_cd_epa = :plant`;

    let binds = {
      plant: plant,
    };

    if (pname && pname != "") {
      sql +=
        " AND LOM_planned_proc IN ( SELECT pph_cd_proc_path FROM v_epa_proc_path WHERE pph_cd_epa = LOM_cd_epa AND pph_product_nm = :Pname )";
      Object.assign(binds, { Pname: pname });
    }

    if (Process && Process != "") {
      sql += " and EPR_CD_PROCESS = nvl(:Process,EPR_CD_PROCESS ) ";
      Object.assign(binds, { Process: Process });
    }
    if (Batch_Id && Batch_Id != "") {
      sql += " AND LOM_ID_BATCH =:Batch_Id ";
      Object.assign(binds, { Batch_Id: Batch_Id });
    }
    if (MBatch_Id && MBatch_Id != "") {
      sql += " and LOM_id_first_par = NVL(:mbatch,LOM_id_first_par) ";
      Object.assign(binds, { mbatch: MBatch_Id });
    }
    if (ThickMin && ThickMin != "" && ThickMax && ThickMax != "") {
      // sql += " AND EPR_SEC1 BETWEEN :SEC1_MIN AND :SEC1_MAX "
      sql += " AND EPR_SEC1 BETWEEN :ThickMin AND :ThickMax ";
      Object.assign(binds, { ThickMin: ThickMin });
      Object.assign(binds, { ThickMax: ThickMax });
    }
    if (ThickMin && ThickMin != "" && ThickMax == "") {
      sql += " AND EPR_SEC1 =:ThickMin ";
      Object.assign(binds, { ThickMin: ThickMin });
    }
    if (prodType && prodType != "") {
      if (prodType === 2) {
        sql += " AND LOM_cd_qlty_actl <> 'SCRP' ";
      } else if (prodType === 1) {
        sql += " AND LOM_cd_qlty_actl = 'SCRP' ";
      }
    }
    if (ThickMin == "" && ThickMax && ThickMax != "") {
      sql += " AND EPR_SEC1 =:ThickMax ";
      Object.assign(binds, { ThickMax: ThickMax });
    }
    if (widthMin && widthMin != "" && widthMax && widthMax != "") {
      sql += " AND EPR_SEC2 BETWEEN :widthMin AND :widthMax ";
      Object.assign(binds, { widthMin: widthMin });
      Object.assign(binds, { widthMax: widthMax });
    }
    if (widthMin && widthMin != "" && widthMax == "") {
      sql += " AND EPR_SEC2 = :widthMin ";
      Object.assign(binds, { widthMin: widthMin });
    }
    if (widthMin == "" && widthMax && widthMax != "") {
      sql += " AND  EPR_SEC2 = :widthMax ";
      Object.assign(binds, { widthMax: widthMax });
    }
    if (ProdDateFrom && ProdDateFrom != "" && ProdDateTo && ProdDateTo != "") {
      sql +=
        " AND  TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo";
      Object.assign(binds, { ProdDateFrom: ProdDateFrom });
      Object.assign(binds, { ProdDateTo: ProdDateTo });
    }
    if (ProdDateFrom && ProdDateFrom != "" && ProdDateTo == "") {
      sql +=
        " AND TRUNC(EPR_DT_PRODN_TATA) =:ProdDateFrom AND TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE)";
      Object.assign(binds, { ProdDateFrom: ProdDateFrom });
    }
    if (
      SchedDateFrom &&
      SchedDateFrom != "" &&
      SchedDateTo &&
      SchedDateTo != ""
    ) {
      sql +=
        " AND TRUNC(EWI_TS_CREATION) >=:SchedDateFrom  AND TRUNC(EWI_TS_CREATION) <=:SchedDateTo ";
      Object.assign(binds, { SchedDateFrom: SchedDateFrom });
      Object.assign(binds, { SchedDateTo: SchedDateTo });
    }
    if (SchedDateFrom && SchedDateFrom != "" && SchedDateTo == "") {
      sql +=
        " AND TRUNC(EWI_TS_CREATION) =:SchedDateFrom AND TRUNC(EWI_TS_CREATION) <=TRUNC(SYSDATE)";
      Object.assign(binds, { SchedDateFrom: SchedDateFrom });
    }
    sql += `
  ORDER BY
      LOM_cd_epa,
      LOM_id_first_par`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getReportData = async (
  plant: any,
  Process: any,
  pname: any,
  Batch_Id: any,
  MBatch_Id: any,
  ThickMin: any,
  ThickMax: any,
  widthMin: any,
  widthMax: any,
  ProdDateFrom: any,
  ProdDateTo: any,
  SchedDateFrom: any,
  SchedDateTo: any,
  prodType: any
) => {
  try {
    var sql = `SELECT 
        COALESCE(CASE
            WHEN EPR_WORK_CENT ='MTMILL_1' THEN 'MTMILL_1'
            WHEN EPR_WORK_CENT ='MTMILL_2' THEN 'MTMILL_2'
            WHEN EPR_WORK_CENT ='MTMILL_3' THEN 'MTMILL_3'   
            WHEN EPR_WORK_CENT ='MTMILL_4' THEN 'MTMILL_4'
            WHEN EPR_WORK_CENT ='MTMILL_5' THEN 'MTMILL_5'
            WHEN EPR_WORK_CENT ='MTMILL_6' THEN 'MTMILL_6'   
            WHEN EPR_WORK_CENT ='MTMILL_7' THEN 'MTMILL_7'            
            ELSE
                'Other'
        END, 'TOTAL') AS WORKCENTER,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'B open'      =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Open_tube_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'CQ'          =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS CQ_tube_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'D scrafing'  =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Scarfing_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'E strip end' =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS strip_end_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'F tube end'  =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Tube_end_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND LOM_no_matnr not in (SELECT CD_VALUE from V_CODES where CD_TYPE='TB041' ) THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Prime_weight,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS slit_consumed,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'B open'      =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Open_tube_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'CQ'          =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS CQ_tube_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'D scrafing'  =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Scarfing_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'E strip end' =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS strip_end_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND 'F tube end'  =(SELECT CD_DESC from V_CODES where CD_TYPE='TB041' AND CD_VALUE=LOM_no_matnr)THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Tube_end_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) AND LOM_no_matnr not in (SELECT CD_VALUE from V_CODES where CD_TYPE='TB041' ) THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS Prime_weight_ONDT,
        SUM(CASE WHEN (TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateTo and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo) THEN NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) ELSE 0 END) AS slit_consumed_ONDT
        FROM
            v_epa_line_prodn   a,
            v_work_inst        b,
            v_LDP_PRODN        c
        WHERE
            epr_id_batch = LOM_id_batch
            AND epr_cd_epa =   LOM_cd_epa
            AND LOM_cd_epa =   ewi_cd_epa
            AND LOM_id_batch = ewi_id_batch
            AND epr_cd_epa =   ewi_cd_epa
            AND epr_id_batch = ewi_id_batch
            AND epr_id_wrk_inst = ewi_id_wrk_inst
            AND ewi_cd_status <> 'RJ'
            AND LOM_cd_status <> 'VF'
            AND LOM_cd_epa = :plant
            AND EPR_CD_PROCESS='M'
            AND  TRUNC(EPR_DT_PRODN_TATA) >=:ProdDateFrom and TRUNC(EPR_DT_PRODN_TATA) <=:ProdDateTo
            AND EPR_WORK_CENT in ('MTMILL_1','MTMILL_2','MTMILL_3','MTMILL_4','MTMILL_7')
        GROUP BY GROUPING SETS (
        CASE
            WHEN EPR_WORK_CENT ='MTMILL_1' THEN 'MTMILL_1'
            WHEN EPR_WORK_CENT ='MTMILL_2' THEN 'MTMILL_2'
            WHEN EPR_WORK_CENT ='MTMILL_3' THEN 'MTMILL_3'   
            WHEN EPR_WORK_CENT ='MTMILL_4' THEN 'MTMILL_4'
            WHEN EPR_WORK_CENT ='MTMILL_5' THEN 'MTMILL_5'
            WHEN EPR_WORK_CENT ='MTMILL_6' THEN 'MTMILL_6'   
            WHEN EPR_WORK_CENT ='MTMILL_7' THEN 'MTMILL_7'            
            ELSE
                'Other'
        END,
        ('TOTAL')
        )
        ORDER BY 
        CASE    WHEN WORKCENTER ='MTMILL_1' THEN 1
            WHEN WORKCENTER ='MTMILL_2' THEN 2
            WHEN WORKCENTER ='MTMILL_3' THEN 3   
            WHEN WORKCENTER ='MTMILL_4' THEN 4 
            WHEN WORKCENTER ='MTMILL_5' THEN 5 
            WHEN WORKCENTER ='MTMILL_6' THEN 6   
            WHEN WORKCENTER ='MTMILL_7' THEN 7            
            WHEN WORKCENTER ='TOTAL' THEN    8
            ELSE  9
        END`;

    let binds = {
      plant: plant,
      ProdDateFrom: ProdDateFrom,
      ProdDateTo: ProdDateTo,
    };

    console.log("Hello");
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
