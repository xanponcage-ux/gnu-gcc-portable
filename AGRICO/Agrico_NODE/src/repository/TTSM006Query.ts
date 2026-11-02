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
    throw new Error.InternalServerError("Error!");
  }
};

export const getMatGrp = async (Plant: any) => {
  try {
    var sql = `select distinct(ENC_PRINT_SPEC) MAT_GRP from V_END_CUST_ORD_EPA WHERE ENC_CD_EPA=:plant AND ENC_PRINT_SPEC IS NOT NULL`;

    let binds = {
      plant: Plant,
    };
    //console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
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
  prodType: any,
  MatGrp: any
) => {
  try {
    var sql = "";
    let binds;

    sql = `SELECT
        eom_cd_epa           plant,
        eom_cd_status,
        eom_id_batch         batch_id,
        NVL(EPR_MILL_SPEED,0) EPR_MILL_SPEED,
        NVL(EPR_BENCH_SPEED,0) EPR_BENCH_SPEED,
        NVL(EPR_FURNACE_TEMP,0) EPR_FURNACE_TEMP,
        NVL(EPR_FURNACE_SPEED,0) EPR_FURNACE_SPEED,
        nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) net_wt,
        nvl(eom_uom, 'Ton') uom,
        (
            SELECT
                f_scrappdi_tub(eom_cd_epa, eom_id_first_par, epr_cd_process,(
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = eom_cd_epa
                        AND ROWNUM = 1
                ), 'SCRAP')
            FROM
                dual
        ) scrap_batch_id,
        epr_no_pieces,
        EPR_CD_PROCESS,
        eom_ms_gross_actl,
        nvl((
            SELECT
                cd_desc
            FROM
                v_codes
            WHERE
                cd_value = eom_cd_status
                AND cd_type = 'E0001'
        ), ' ') status_desc,
        nvl(
            CASE eom_cd_curr_proc
                WHEN 'W' THEN
                    epr_ms_piece_actl
                ELSE
                    epr_ms_input
            END, 0) ms_input,
        nvl(ewi_ms_input, 0) / 1000 planned_wt,
        nvl(
            CASE eom_cd_curr_proc
                WHEN 'W' THEN
                    epr_ms_piece_actl
                ELSE
                    epr_ms_input
            END
            - nvl(epr_ms_piece_actl, 0), 0) ms_scrap,
        CASE eom_cd_curr_proc
            WHEN 'W' THEN
                100
            ELSE
                epr_yield_perc
        END yield_perc,
        eom_inv_loss,
        eom_id_order_cus,
        eom_id_ord_item_cus,
        nvl((
            SELECT
                enc_order_type
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = eom_cd_epa
                AND enc_id_order = eom_id_order_cus
                AND enc_no_item = eom_id_ord_item_cus
        ), ' ') ord_type,
        eom_id_order,
        eom_no_item,
        epr_no_cast,
        nvl((
            SELECT
                enc_cust_name
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = eom_cd_epa
                AND enc_id_order = eom_id_order_cus
                AND enc_no_item = eom_id_ord_item_cus
        ), ' ') customer,
        nvl((
            SELECT
                enc_no_tracking
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = eom_cd_epa
                AND enc_id_order = eom_id_order_cus
                AND enc_no_item = eom_id_ord_item_cus
        ), ' ') track_no,
        to_char(epr_dt_prodn_tata, 'DD-MON-YY') epr_dt_prodn_tata,
        to_char(epr_dt_prodn_tata, 'HH24:MI:SS') epr_tm_prodn_tata,
        epr_cd_shift,
        round(nvl(eom_ms_scrap, 0), 3) scrap_wt,
        to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt,
        eom_cd_curr_proc     curr_process,
        nvl(eom_cd_next_proc, ' ') next_process,
        nvl(eom_cd_prev_proc, ' ') prev_process,
        eom_cd_qlty_actl     batchqltycd,
        eom_sec1             thick,
        eom_sec2             odia,
        eom_length           length,
        eom_tdc_actl         grade,
        eom_id_first_par     mother_batch,
        eom_id_par_coil_no   parent_batch,
        eom_cd_prod,
        (
            SELECT DISTINCT
                eic_cd_qlty_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) m_batchqlty,
        (
            SELECT DISTINCT
                eic_tdc_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) m_batch_tdc,
        (
            SELECT DISTINCT
                eic_sec1
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) m_batch_thick,
        (
            SELECT DISTINCT
                eic_sec2
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) m_batch_width,
        (
            SELECT DISTINCT
                eic_ms_piece_actl
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) m_batch_weight,
        (
            SELECT DISTINCT
                eic_mk_customer
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) intendent_cust,
        eom_no_cast,
        eom_passed_proc,
        nvl((
            SELECT
                enc_ship_to_prty_desc
            FROM
                v_end_cust_ord_epa
            WHERE
                enc_cd_epa = eom_cd_epa
                AND enc_id_order = eom_id_order_cus
                AND enc_no_item = eom_id_ord_item_cus
        ), ' ') ship_to_party,
        epr_cd_epa,
        eom_id_op_decsn,
        eom_no_matnr,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = eom_no_matnr
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
        nvl(eom_act_length, 0) mill_length,
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
                SUM(eom_ms_gross_cal)
            FROM
                v_epa_prodn d
            WHERE
                eom_cd_epa = c.eom_cd_epa
                AND eom_id_batch = c.eom_id_batch
                AND eom_cd_qlty_actl = 'SCRP'
                AND eom_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.eom_cd_epa
                        AND cd_desc1 = 'T'
                )
        ) sf_cq_tube,
        (
            SELECT
                SUM(eom_ms_gross_cal)
            FROM
                v_epa_prodn d
            WHERE
                eom_cd_epa = c.eom_cd_epa
                AND eom_id_batch = c.eom_id_batch
                AND eom_cd_qlty_actl = 'SCRP'
                AND eom_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.eom_cd_epa
                        AND cd_desc1 = 'O'
                )
        ) sf_open,
        (
            SELECT
                SUM(eom_ms_gross_cal)
            FROM
                v_epa_prodn d
            WHERE
                eom_cd_epa = c.eom_cd_epa
                AND eom_id_batch = c.eom_id_batch
                AND eom_cd_qlty_actl = 'SCRP'
                AND eom_no_matnr IN (
                    SELECT
                        substr(cd_desc, 1, 18)
                    FROM
                        v_codes
                    WHERE
                        cd_type = 'EPA196'
                        AND cd_value = d.eom_cd_epa
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
        CASE
        WHEN (
            SELECT DISTINCT
                eic_no_matnr
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        ) IS NULL THEN (
            SELECT
                eom_no_matnr
            FROM
                v_epa_prodn
            WHERE
                eom_id_batch = c.EOM_ID_BATCH
        )
        ELSE (
            SELECT DISTINCT
                eic_no_matnr
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = epr_cd_epa
                AND eic_id_coil = eom_id_first_par
        )
    END as rm_material_no,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                   CASE
                            WHEN (
                                SELECT DISTINCT
                                    eic_no_matnr
                                FROM
                                    v_input_coil
                                WHERE
                                    eic_cd_epa = epr_cd_epa
                                    AND eic_id_coil = eom_id_first_par
                                    AND ROWNUM = 1
                            ) IS NULL THEN (
                                SELECT
                                    eom_no_matnr
                                FROM
                                    v_epa_prodn
                                WHERE
                                    eom_id_batch = c.EOM_ID_BATCH
                                    AND ROWNUM = 1
                            )
                            ELSE (
                                SELECT DISTINCT
                                    eic_no_matnr
                                FROM
                                    v_input_coil
                                WHERE
                                    eic_cd_epa = epr_cd_epa
                                    AND eic_id_coil = eom_id_first_par
                                    AND ROWNUM = 1
                            )
                        END
                )
        ) rm_material_desc,
        CASE 
            WHEN eom_cd_qlty_actl = 'SCRP' THEN eom_no_matnr 
            ELSE '0'
        END AS SCRP_MATERIAL_No,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                    CASE 
                    WHEN eom_cd_qlty_actl = 'SCRP' THEN eom_no_matnr 
                    ELSE '0'
                END
                )
        ) SCRP_MATERIAL_DESC,
        (
              SELECT
                  enc_no_matnr
              FROM
                  v_end_cust_ord_epa
              WHERE
                  enc_cd_epa = eom_cd_epa
                  AND enc_id_order = eom_id_order_cus
                  AND enc_no_item = eom_id_ord_item_cus
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
                          enc_cd_epa = eom_cd_epa
                          AND enc_id_order = eom_id_order_cus
                          AND enc_no_item = eom_id_ord_item_cus
                  )
                  AND ROWNUM = 1
          ) fg_material_desc,
          (
            SELECT
                pph_product
            FROM
                v_epa_proc_path
            WHERE
                pph_cd_epa = eom_cd_epa
                AND pph_cd_proc_path = eom_planned_proc
                AND ROWNUM = 1
        ) product_name,
        to_char(eom_ts_creation, 'DD-MON-YY HH24:MI:SS') eom_ts_creation,
        (
            SELECT
                eic_ms_gross_actl
            FROM
                v_input_coil d
            WHERE
                c.eom_id_first_par = d.eic_id_coil
        ) mother_batch_wt,
        to_char(epr_prod_strt_tm, 'DD-MON-YY HH24:MI:SS') prod_strt_tm,
        to_char(epr_prod_end_tm, 'DD-MON-YY HH24:MI:SS') prod_end_tm,
        decode(c.eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
               '3', 'Downgraded', '5', 'Additional Process', '8',
               'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
               NVL(DECODE(EOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) Mill_Wt
               ,TO_CHAR(EPR_TS_REC_CREATE, 'DD-MM-YYYY HH24:MI:SS') REC_CRT_DT
               ,EPR_WORK_CENT,EPR_ID_ORDER, EPR_SEC1, EPR_SEC2, EPR_IDIA, EPR_NO_ITEM,ROUND(EPR_LENGTH,3) EPR_LENGTH
               ,substr((F_WIP_MATNR (c.eom_cd_epa , c.eom_id_batch)),1,18) WIP_MAT,
               substr((F_WIP_MATNR (c.eom_cd_epa , c.eom_id_batch)),20,200) WIP_MAT_DESC,
               EOM_OPER_COMMENT OP_REMARK,
               EOM_SCRAP_REMARKS COMM_REMARK,
               ENC_PRINT_SPEC MatGrp,
               NVL ((SELECT spec FROM v_ympct_tub_matl WHERE mandt = '600' AND matnr = eom_no_matnr AND ROWNUM = 1), '') spec,
               (SELECT  EIC_TDC_ACTL FROM v_input_coil WHERE eic_cd_epa = epr_cd_epa AND eic_id_coil = eom_id_first_par) EIC_TDC_ACTL
               FROM
        v_epa_line_prodn   a,
        v_work_inst        b,
        v_epa_prodn        c,
        v_END_CUST_ORD_EPA d                
    WHERE
        epr_id_batch = eom_id_batch
        AND epr_cd_epa = eom_cd_epa
        AND eom_cd_epa = ewi_cd_epa
        AND eom_id_batch = ewi_id_batch
        AND epr_cd_epa = ewi_cd_epa
        AND epr_id_batch = ewi_id_batch
        AND epr_id_wrk_inst = ewi_id_wrk_inst
        AND c.eom_cd_epa = d.enc_cd_epa(+) 
        AND c.eom_id_order_cus = d.enc_id_order(+) 
        AND c.eom_id_ord_item_cus = d.enc_no_item(+)
        AND ewi_cd_status <> 'RJ'
        AND eom_cd_status <> 'VF'
        AND eom_cd_epa = :plant`;

    binds = {
      plant: plant,
    };

    if (pname && pname != "") {
      sql +=
        " AND eom_planned_proc IN ( SELECT pph_cd_proc_path FROM v_epa_proc_path WHERE pph_cd_epa = eom_cd_epa AND pph_product_nm = :Pname )";
      Object.assign(binds, { Pname: pname });
    }
    if (Process && Process != "") {
      sql += " and EPR_CD_PROCESS = nvl(:Process,EPR_CD_PROCESS ) ";
      Object.assign(binds, { Process: Process });
    }
    if (Batch_Id && Batch_Id != "") {
      sql += " AND EOM_ID_BATCH =:Batch_Id ";
      Object.assign(binds, { Batch_Id: Batch_Id });
    }
    if (MatGrp && MatGrp != "") {
      sql += " AND  ENC_PRINT_SPEC = :matGRp ";
      Object.assign(binds, { matGrp: MatGrp });
    }
    if (MBatch_Id && MBatch_Id != "") {
      sql += " and eom_id_first_par = NVL(:mbatch,eom_id_first_par) ";
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
    if (
      Process &&
      Process != "" &&
      Process === "W" &&
      ((prodType && prodType != "" && prodType === 1) ||
        (prodType && prodType != "" && prodType === 3) ||
        prodType === "")
    ) {
      if (prodType === 1 || prodType === 3) {
        sql += " AND 1 <> 1 ";
      } else sql += " AND eom_cd_qlty_actl <> 'SCRP' ";
    } else {
      if (prodType && prodType != "") {
        if (prodType === 2) {
          sql += " AND eom_cd_qlty_actl <> 'SCRP' ";
        } else if (prodType === 1) {
          //sql += " AND eom_cd_qlty_actl = 'SCRP' " Comment on 07-02-2024 for Commercial
          sql +=
            " AND eom_cd_qlty_actl = 'SCRP' AND eom_cd_st_actl != '6' AND EOM_NO_MATNR NOT IN ( SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) ";
        } else if (prodType === 3) {
          sql +=
            " AND ((EOM_CD_st_ACTL = '6' and epr_slit_sec='C') OR (EOM_NO_MATNR IN (SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) AND EOM_CD_st_ACTL <> '6'))";
        }
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
    // KUNJAN :Below is added union for W line scrap and the same has been excluded from above query, done because W scrap has no order and item
    if (
      Process &&
      Process != "" &&
      Process === "W" &&
      ((prodType && prodType != "" && prodType === 1) ||
        (prodType && prodType != "" && prodType === 3) ||
        prodType === "")
    ) {
      sql += `
        UNION ALL
        SELECT
          eom_cd_epa           plant,
          eom_cd_status,
          eom_id_batch         batch_id,
          NVL(EPR_MILL_SPEED,0) EPR_MILL_SPEED,
          NVL(EPR_BENCH_SPEED,0) EPR_BENCH_SPEED,
          NVL(EPR_FURNACE_TEMP,0) EPR_FURNACE_TEMP,
          NVL(EPR_FURNACE_SPEED,0) EPR_FURNACE_SPEED,
          nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) net_wt,
          nvl(eom_uom, 'Ton') uom,
          (
              SELECT
                  f_scrappdi_tub(eom_cd_epa, eom_id_first_par, epr_cd_process,(
                      SELECT
                          substr(cd_desc, 1, 18)
                      FROM
                          v_codes
                      WHERE
                          cd_type = 'EPA196'
                          AND cd_value = eom_cd_epa
                          AND ROWNUM = 1
                  ), 'SCRAP')
              FROM
                  dual
          ) scrap_batch_id,
          epr_no_pieces,
          EPR_CD_PROCESS,
          eom_ms_gross_actl,
          nvl((
              SELECT
                  cd_desc
              FROM
                  v_codes
              WHERE
                  cd_value = eom_cd_status
                  AND cd_type = 'E0001'
          ), ' ') status_desc,
          nvl(
              CASE eom_cd_curr_proc
                  WHEN 'W' THEN
                      epr_ms_piece_actl
                  ELSE
                      epr_ms_input
              END, 0) ms_input,
          nvl(ewi_ms_input, 0) / 1000 planned_wt,
          nvl(
              CASE eom_cd_curr_proc
                  WHEN 'W' THEN
                      epr_ms_piece_actl
                  ELSE
                      epr_ms_input
              END
              - nvl(epr_ms_piece_actl, 0), 0) ms_scrap,
          CASE eom_cd_curr_proc
              WHEN 'W' THEN
                  100
              ELSE
                  epr_yield_perc
          END yield_perc,
          eom_inv_loss,
          eom_id_order_cus,
          eom_id_ord_item_cus,
          nvl((
              SELECT
                  enc_order_type
              FROM
                  v_end_cust_ord_epa
              WHERE
                  enc_cd_epa = eom_cd_epa
                  AND enc_id_order = eom_id_order_cus
                  AND enc_no_item = eom_id_ord_item_cus
          ), ' ') ord_type,
          eom_id_order,
          eom_no_item,
          epr_no_cast,
          nvl((
              SELECT
                  enc_cust_name
              FROM
                  v_end_cust_ord_epa
              WHERE
                  enc_cd_epa = eom_cd_epa
                  AND enc_id_order = eom_id_order_cus
                  AND enc_no_item = eom_id_ord_item_cus
          ), ' ') customer,
          nvl((
              SELECT
                  enc_no_tracking
              FROM
                  v_end_cust_ord_epa
              WHERE
                  enc_cd_epa = eom_cd_epa
                  AND enc_id_order = eom_id_order_cus
                  AND enc_no_item = eom_id_ord_item_cus
          ), ' ') track_no,
          to_char(epr_dt_prodn_tata, 'DD-MON-YY') epr_dt_prodn_tata,
          to_char(epr_dt_prodn_tata, 'HH24:MI:SS') epr_tm_prodn_tata,
          epr_cd_shift,
          round(nvl(eom_ms_scrap, 0), 3) scrap_wt,
          to_char(ewi_ts_creation, 'DD-MON-YY HH24:MI:SS') schd_crt_dt,
          eom_cd_curr_proc     curr_process,
          nvl(eom_cd_next_proc, ' ') next_process,
          nvl(eom_cd_prev_proc, ' ') prev_process,
          eom_cd_qlty_actl     batchqltycd,
          eom_sec1             thick,
          eom_sec2             odia,
          eom_length           length,
          eom_tdc_actl         grade,
          eom_id_first_par     mother_batch,
          eom_id_par_coil_no   parent_batch,
          eom_cd_prod,
          (
              SELECT DISTINCT
                  eic_cd_qlty_actl
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) m_batchqlty,
          (
              SELECT DISTINCT
                  eic_tdc_actl
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) m_batch_tdc,
          (
              SELECT DISTINCT
                  eic_sec1
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) m_batch_thick,
          (
              SELECT DISTINCT
                  eic_sec2
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) m_batch_width,
          (
              SELECT DISTINCT
                  eic_ms_piece_actl
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) m_batch_weight,
          (
              SELECT DISTINCT
                  eic_mk_customer
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) intendent_cust,
          eom_no_cast,
          eom_passed_proc,
          nvl((
              SELECT
                  enc_ship_to_prty_desc
              FROM
                  v_end_cust_ord_epa
              WHERE
                  enc_cd_epa = eom_cd_epa
                  AND enc_id_order = eom_id_order_cus
                  AND enc_no_item = eom_id_ord_item_cus
          ), ' ') ship_to_party,
          epr_cd_epa,
          eom_id_op_decsn,
          eom_no_matnr,
          (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = eom_no_matnr
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
          nvl(eom_act_length, 0) mill_length,
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
                  SUM(eom_ms_gross_cal)
              FROM
                  v_epa_prodn d
              WHERE
                  eom_cd_epa = c.eom_cd_epa
                  AND eom_id_batch = c.eom_id_batch
                  AND eom_cd_qlty_actl = 'SCRP'
                  AND eom_no_matnr IN (
                      SELECT
                          substr(cd_desc, 1, 18)
                      FROM
                          v_codes
                      WHERE
                          cd_type = 'EPA196'
                          AND cd_value = d.eom_cd_epa
                          AND cd_desc1 = 'T'
                  )
          ) sf_cq_tube,
          (
              SELECT
                  SUM(eom_ms_gross_cal)
              FROM
                  v_epa_prodn d
              WHERE
                  eom_cd_epa = c.eom_cd_epa
                  AND eom_id_batch = c.eom_id_batch
                  AND eom_cd_qlty_actl = 'SCRP'
                  AND eom_no_matnr IN (
                      SELECT
                          substr(cd_desc, 1, 18)
                      FROM
                          v_codes
                      WHERE
                          cd_type = 'EPA196'
                          AND cd_value = d.eom_cd_epa
                          AND cd_desc1 = 'O'
                  )
          ) sf_open,
          (
              SELECT
                  SUM(eom_ms_gross_cal)
              FROM
                  v_epa_prodn d
              WHERE
                  eom_cd_epa = c.eom_cd_epa
                  AND eom_id_batch = c.eom_id_batch
                  AND eom_cd_qlty_actl = 'SCRP'
                  AND eom_no_matnr IN (
                      SELECT
                          substr(cd_desc, 1, 18)
                      FROM
                          v_codes
                      WHERE
                          cd_type = 'EPA196'
                          AND cd_value = d.eom_cd_epa
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
          CASE
          WHEN (
              SELECT DISTINCT
                  eic_no_matnr
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          ) IS NULL THEN (
              SELECT
                  eom_no_matnr
              FROM
                  v_epa_prodn
              WHERE
                  eom_id_batch = c.EOM_ID_BATCH
          )
          ELSE (
              SELECT DISTINCT
                  eic_no_matnr
              FROM
                  v_input_coil
              WHERE
                  eic_cd_epa = epr_cd_epa
                  AND eic_id_coil = eom_id_first_par
          )
      END as rm_material_no,
          (
              SELECT
                  maktx
              FROM
                  v_makt
              WHERE
                  mandt = '600'
                  AND matnr = (
                     CASE
                              WHEN (
                                  SELECT DISTINCT
                                      eic_no_matnr
                                  FROM
                                      v_input_coil
                                  WHERE
                                      eic_cd_epa = epr_cd_epa
                                      AND eic_id_coil = eom_id_first_par
                                      AND ROWNUM = 1
                              ) IS NULL THEN (
                                  SELECT
                                      eom_no_matnr
                                  FROM
                                      v_epa_prodn
                                  WHERE
                                      eom_id_batch = c.EOM_ID_BATCH
                                      AND ROWNUM = 1
                              )
                              ELSE (
                                  SELECT DISTINCT
                                      eic_no_matnr
                                  FROM
                                      v_input_coil
                                  WHERE
                                      eic_cd_epa = epr_cd_epa
                                      AND eic_id_coil = eom_id_first_par
                                      AND ROWNUM = 1
                              )
                          END
                  )
          ) rm_material_desc,
          CASE 
            WHEN eom_cd_qlty_actl = 'SCRP' THEN eom_no_matnr 
            ELSE '0' 
        END AS SCRP_MATERIAL_No,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = (
                    CASE 
                    WHEN eom_cd_qlty_actl = 'SCRP' THEN eom_no_matnr 
                    ELSE '0' 
                END
                )
        ) SCRP_MATERIAL_DESC,
          (
                SELECT
                    enc_no_matnr
                FROM
                    v_end_cust_ord_epa
                WHERE
                    enc_cd_epa = eom_cd_epa
                    AND enc_id_order = eom_id_order_cus
                    AND enc_no_item = eom_id_ord_item_cus
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
                            enc_cd_epa = eom_cd_epa
                            AND enc_id_order = eom_id_order_cus
                            AND enc_no_item = eom_id_ord_item_cus
                    )
                    AND ROWNUM = 1
            ) fg_material_desc,
            (
              SELECT
                  pph_product
              FROM
                  v_epa_proc_path
              WHERE
                  pph_cd_epa = eom_cd_epa
                  AND pph_cd_proc_path = eom_planned_proc
                  AND ROWNUM = 1
          ) product_name,
          to_char(eom_ts_creation, 'DD-MON-YY HH24:MI:SS') eom_ts_creation,
          (
              SELECT
                  eic_ms_gross_actl
              FROM
                  v_input_coil d
              WHERE
                  c.eom_id_first_par = d.eic_id_coil
          ) mother_batch_wt,
          to_char(epr_prod_strt_tm, 'DD-MON-YY HH24:MI:SS') prod_strt_tm,
          to_char(epr_prod_end_tm, 'DD-MON-YY HH24:MI:SS') prod_end_tm,
          decode(c.eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                 '3', 'Downgraded', '5', 'Additional Process', '8',
                 'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                 NVL(DECODE(EOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0) Mill_Wt
                 ,TO_CHAR(EPR_TS_REC_CREATE, 'DD-MM-YYYY HH24:MI:SS') REC_CRT_DT
                 ,EPR_WORK_CENT,EPR_ID_ORDER, EPR_SEC1, EPR_SEC2, EPR_IDIA, EPR_NO_ITEM,ROUND(EPR_LENGTH,3) EPR_LENGTH
                 ,substr((F_WIP_MATNR (c.eom_cd_epa , c.eom_id_batch)),1,18) WIP_MAT,
                 substr((F_WIP_MATNR (c.eom_cd_epa , c.eom_id_batch)),20,200) WIP_MAT_DESC,
                 EOM_OPER_COMMENT OP_REMARK,
                 EOM_SCRAP_REMARKS COMM_REMARK,
                  '' MatGrp
                 FROM
          v_epa_line_prodn   a,
          v_work_inst        b,
          v_epa_prodn        c               
      WHERE
          epr_id_batch = eom_id_batch
          AND epr_cd_epa = eom_cd_epa
          AND eom_cd_epa = ewi_cd_epa
          AND eom_id_batch = ewi_id_batch
          AND epr_cd_epa = ewi_cd_epa
          AND epr_id_batch = ewi_id_batch
          AND epr_id_wrk_inst = ewi_id_wrk_inst
          AND ewi_cd_status <> 'RJ'
          AND eom_cd_status <> 'VF'
          AND eom_cd_epa = :plant`;

      binds = {
        plant: plant,
      };

      if (pname && pname != "") {
        sql +=
          " AND eom_planned_proc IN ( SELECT pph_cd_proc_path FROM v_epa_proc_path WHERE pph_cd_epa = eom_cd_epa AND pph_product_nm = :Pname )";
        Object.assign(binds, { Pname: pname });
      }

      if (Process && Process != "") {
        sql += " and EPR_CD_PROCESS = nvl(:Process,EPR_CD_PROCESS ) ";
        Object.assign(binds, { Process: Process });
      }
      if (Batch_Id && Batch_Id != "") {
        sql += " AND EOM_ID_BATCH =:Batch_Id ";
        Object.assign(binds, { Batch_Id: Batch_Id });
      }
      if (MBatch_Id && MBatch_Id != "") {
        sql += " and eom_id_first_par = NVL(:mbatch,eom_id_first_par) ";
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
      if (
        Process &&
        Process != "" &&
        Process === "W" &&
        ((prodType && prodType != "" && prodType === 1) ||
          (prodType && prodType != "" && prodType === 3) ||
          prodType === "")
      ) {
        if (prodType === 1) {
          sql +=
            " AND eom_cd_qlty_actl = 'SCRP' AND eom_cd_st_actl != '6' AND EOM_NO_MATNR NOT IN ( SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) ";
        } else if (prodType === 3) {
          sql +=
            "AND ((EOM_CD_st_ACTL = '6' and epr_slit_sec='C') OR (EOM_NO_MATNR IN (SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) AND EOM_CD_st_ACTL <> '6'))";
        } else sql += " AND eom_cd_qlty_actl= 'SCRP' ";
      }
      //   if (prodType && prodType != "") {
      //     if (prodType === 2) {
      //       sql += " AND eom_cd_qlty_actl <> 'SCRP' ";
      //     } else if (prodType === 1) {
      //       //sql += " AND eom_cd_qlty_actl = 'SCRP' " Comment on 07-02-2024 for Commercial
      //       sql +=
      //         " AND eom_cd_qlty_actl = 'SCRP' AND eom_cd_st_actl != '6' AND EOM_NO_MATNR NOT IN ( SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) ";
      //     } else if (prodType === 3) {
      //       sql +=
      //         " AND ((EOM_CD_st_ACTL = '6' and epr_slit_sec='C') OR (EOM_NO_MATNR IN (SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='TB045' AND CD_VALUE =EOM_CD_EPA) AND EOM_CD_st_ACTL <> '6'))";
      //     }
      //   }
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
      if (
        ProdDateFrom &&
        ProdDateFrom != "" &&
        ProdDateTo &&
        ProdDateTo != ""
      ) {
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
    }

    sql += `
            ORDER BY
            epr_dt_prodn_tata,
            epr_cd_shift,
            parent_batch,
            prod_end_tm`;
    console.log(sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
  }
};
