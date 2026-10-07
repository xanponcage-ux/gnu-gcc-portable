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
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProdInqData = async (
  Proc: any,
  Batch: any,
  PBatch: any,
  MBatch: any,
  OrdNo: any,
  OrdItem: any,
  Status: any,
  MatnrNo: any,
  QltyCd: any,
  ProdDateFrom: any,
  ProdDateTo: any,
  shift: any,
  millNo: any
) => {
  try {
    let sql = `
            SELECT
                TBP_PLANT_CD, TBP_BATCH_NO, TBP_CD_PROC, TBP_BATCH_PROC_NO, TBP_NEXT_PROC,TO_CHAR(TBP_PROD_DATE, 'DD-MM-YYYY') TBP_PROD_DATE, TBP_SHIFT, TBP_WEIGHT,LOM_CD_STATUS TBP_CD_STATUS,
                TBP_PAR_COIL_NO, TBP_ID_FIRST_PAR, TBP_ID_ORDER_NO, TBP_ITEM_NO, TBP_QUALITY_CD, TBP_NO_MATNR,
                (SELECT MAKTX
                  FROM V_MAKT
                 WHERE MANDT = '600'
                   AND MATNR = NVL (TBP_NO_MATNR, LOM_NO_MATNR)
                   AND ROWNUM = 1) MAT_DESC, TBP_CD_FLAG,LOM_SEC2,LOM_SEC1,LOM_LENGTH,NVL(TBP_HEAT_NO,LOM_NO_CAST) TBP_HEAT_NO,
                (select CASE WHEN REGEXP_LIKE(A.TBP_DIA_END_10, '^[0-9]+$') THEN TO_NUMBER(A.TBP_DIA_END_10) ELSE NULL END FROM V_BARE_PDO A
                where A.TBP_BATCH_NO = LOM_ID_BATCH
                  and A.TBP_CD_PROC = 'A'
                  and A.TBP_BATCH_PROC_NO = (
                    SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                    WHERE A.TBP_BATCH_NO = x.TBP_BATCH_NO
                      AND x.TBP_CD_PROC = 'A'
                  )
                and rownum = 1) EXTERNAL_SEQ_NO,
                TO_CHAR(TBP_PROD_START_DT, 'DD-MM-YYYY HH24:MI:SS') TBP_PROD_START_DT,TO_CHAR(TBP_PROD_END_DT, 'DD-MM-YYYY HH24:MI:SS') TBP_PROD_END_DT,
                TBP_RESULT, TBP_REMARK, TBP_INSP_NAME, TBP_PIPE_OD_10, TBP_PIPE_THK_10, TBP_PIPE_LNG_10, TBP_FLATNG_0_O_10,
                TBP_FLATNG_90_O_10, TBP_RBT_10, TBP_DIA_END_10, TBP_DIA_BODY_10, TBP_OUT_ROUND_BODY_10, TBP_OUT_ROUND_END_10, TBP_WALL_THK_BODY_10,
                TBP_WALL_THK_END_10, TBP_STRGHTNES_T_END_10, TBP_SQOC_10, TBP_ROC_10, TBP_ID_FLASH_10, TBP_CONVX_10, TBP_CONCV_10, TBP_TWIST_10,
                TBP_DEPTH_10, TBP_WIDTHS_10, tbp_sample_10, tbp_wld_temp_10, tbp_mill_spd_10, tbp_currentt_10, tbp_temp_qn_10, tbp_voltage_10,
                tbp_frequency_10, tbp_normz_temp_10, tbp_weld_power_10, tbp_mill_rmk_10, tbp_angle_20, tbp_gauge_id_30, tbp_calib_date_30,
                tbp_calib_due_dt_30, tbp_gauge_range_30, tbp_obsv_f_end_40, tbp_obsv_t_end_40, tbp_res_mg_f_end_40, tbp_res_mg_t_end_40,
                tbp_no_ind_50, tbp_mut_result_50, tbp_mut_f_end_50, tbp_mut_t_end_50, tbp_calb_rmk_50, tbp_ut_remark_50, tbp_visual_insp_80, tbp_ecn_percen_80,
                tbp_b_angl_f_end_80, tbp_b_angl_f_end_80, tbp_b_angl_t_end_80, tbp_rootface_f_end_80, tbp_rootface_t_end_80, tbp_strghtnes_f_end_80,
                tbp_squ_f_end_80, tbp_squ_t_end_80, tbp_asl_no_80, tbp_wid_min_80, tbp_wid_max_80, tbp_depth_min_80, tbp_depth_max_80, tbp_vdi_final_rmk_1_80, tbp_vdi_final_rmk_2_80,
                tbp_len_ft_80, tbp_len_inch_80,TO_CHAR(tbp_create_date, 'DD-MM-YYYY HH24:MI:SS') tbp_create_date,tbp_create_user,TO_CHAR(tbp_updated_on, 'DD-MM-YYYY HH24:MI:SS') tbp_updated_on, 
                tbp_updated_by, tbp_piptmp_beblst_100,tbp_piptmp_beacid_100, tbp_ph_beacid_100, tbp_ph_afacid_100, tbp_dwelltm_100, tbp_predm_wa_100, tbp_dmwa_fra_1_100, tbp_predm_wa_100, tbp_dmwa_fra_1_100,
                tbp_dmwa_fra_2_100, tbp_dmwa_fra_3_100, tbp_airtem_aftwa_100, tbp_rh_100, tbp_ambt_tmp_100, tbp_dew_tmp_100, tbp_pipsur_temp_100,
                tbp_deg_clean_100, tbp_rough_100, tbp_dust_lvlra_100, tbp_dust_lvlcl_100, tbp_salt_conta_100, tbp_phosacid_m_100, tbp_phosacid_gr_100,
                tbp_phosacid_bh_100, tbp_piptmp_becrm_110, tbp_chrm_visual_110, tbp_chrm_tmp_110, tbp_piptmp_afcrm_110, tbp_piptmp_befbe_110, tbp_tmp_adhef_fil_110,
                tbp_tmp_pefilm_110, tbp_qun_wa_betmp_110, tbp_qun_wa_aftmp_110, tbp_epgun_1_110, tbp_epgun_2_110, tbp_epgun_3_110, tbp_epgun_4_110, tbp_epgun_5_110, tbp_epgun_6_110,
                tbp_epgun_7_110, tbp_epgun_8_110, tbp_epgun_9_110, tbp_epgun_10_110, tbp_epgun_11_110, tbp_epgun_12_110, tbp_epgun_13_110, tbp_epgun_14_110, tbp_epgun_15_110,
                tbp_epgun_16_110, tbp_epgun_17_110, tbp_epgun_18_110, tbp_epgun_19_110, tbp_epgun_20_110, tbp_epgun_21_110, tbp_epgun_22_110, tbp_epgun_23_110, tbp_epgun_24_110,
                tbp_airpress_1_110, tbp_airpress_2_110, tbp_airpress_3_110, tbp_airpress_4_110, tbp_airpress_5_110, tbp_airpress_6_110, tbp_airpress_7_110, tbp_airpress_8_110,
                tbp_airpress_9_110, tbp_airpress_10_110, tbp_airpress_11_110, tbp_airpress_12_110, tbp_airpress_13_110, tbp_airpress_14_110, tbp_airpress_15_110, tbp_airpress_16_110,
                tbp_airpress_17_110, tbp_airpress_18_110, tbp_airpress_19_110, tbp_airpress_20_110, tbp_airpress_21_110, tbp_airpress_22_110, tbp_airpress_23_110,
                tbp_airpress_24_110, tbp_flwrate_1_110, tbp_flwrate_2_110, tbp_flwrate_3_110, tbp_flwrate_4_110, tbp_flwrate_5_110, tbp_flwrate_6_110, tbp_flwrate_7_110, tbp_flwrate_8_110,
                tbp_flwrate_9_110, tbp_flwrate_10_110, tbp_flwrate_11_110, tbp_flwrate_12_110, tbp_flwrate_13_110, tbp_flwrate_14_110, tbp_flwrate_15_110, tbp_flwrate_16_110, tbp_flwrate_17_110,
                tbp_flwrate_18_110, tbp_flwrate_19_110, tbp_flwrate_20_110, tbp_flwrate_21_110, tbp_flwrate_22_110, tbp_flwrate_23_110, tbp_flwrate_24_110, tbp_rm_1_110, tbp_rm_2_110, tbp_rm_3_110,
                tbp_rm_4_110, tbp_manfact_1_110, tbp_manfact_2_110, tbp_manfact_3_110, tbp_manfact_4_110, tbp_chrm_gr_110, tbp_epoxy_gr_110, tbp_adha_gr_110, tbp_pepp_gr_110, tbp_chrom_bh_110,
                tbp_epxy_bh_110, tbp_adha_bh_110, tbp_pepp_bh_110, tbp_lines_sped_110, tbp_epxy_dwpt_110, tbp_no_epgun_110, tbp_hdpe_rpm01_110, tbp_adhe_rpm_110, tbp_cot_thk_1_120, tbp_cot_thk_3_120,
                tbp_cot_thk_4_120, tbp_cot_thk_5_120, tbp_cot_thk_6_120, tbp_cot_thk_7_120, tbp_cot_thk_8_120, tbp_cot_thk_9_120,
                tbp_cot_thk_10_120, tbp_cot_thk_11_120, tbp_cot_thk_12_120, tbp_cot_wt_vs_120, tbp_coat_stas_120, tbp_test_pip_120, tbp_lab_tst_120, tbp_fld_test_120, tbp_cb_fend_130, tbp_cb_tend_130,
                tbp_ep_fend_130, tbp_ep_tend_130, tbp_ca_fend_130, tbp_ca_tend_130, tbp_holidat_130, tbp_resumg_1_130, tbp_resumg_2_130, tbp_resumg_3_130, tbp_resumg_4_130, tbp_fstation_130,
                tbp_work_center,TO_CHAR(tbp_rec_crt_dt, 'DD-MM-YYYY HH24:MI:SS') tbp_rec_crt_dt,tbp_rec_crt_by, tbp_hold_rsn, tbp_sampl_tag
                ,(select ENC_MARK_CUST_NAME from v_end_cust_ord_epa 
                where ENC_ID_ORDER = TBP_ID_ORDER_NO
                and ENC_NO_ITEM = TBP_ITEM_NO) MARK_CUST
                ,(select ENC_NO_TDC from v_end_cust_ord_epa 
                where ENC_ID_ORDER = TBP_ID_ORDER_NO
                and ENC_NO_ITEM = TBP_ITEM_NO) ORD_GRADE,
                 DECODE (LOM_MILL_NO,
                         '1', 'MILL 1',
                         '2', 'MILL 2'
                        ) MILL_NO,
                LOM_ID_ORDER_CUS CURR_ORD, LOM_ID_ORD_ITEM_CUS CURR_ITEM
                FROM v_bare_pdo,v_ldp_prodn
                WHERE tbp_plant_cd = '0780'
                AND TBP_BATCH_NO = LOM_ID_BATCH
        `;

    // Initialize binds as an empty object
    const binds: { [key: string]: any } = {};

    if (Proc && Proc !== "") {
      sql += ` AND TBP_CD_PROC = :Proc`;
      binds.Proc = Proc;
    }

    if (shift && shift !== "") {
      sql += ` AND TBP_SHIFT = :shift`;
      binds.shift = shift;
    }

    if (Batch && Batch !== "") {
      sql += ` AND TBP_BATCH_NO = :Batch`;
      binds.Batch = Batch;
    }
    if (PBatch && PBatch !== "") {
      sql += ` AND TBP_PAR_COIL_NO = :PBatch`;
      binds.PBatch = PBatch;
    }
    if (MBatch && MBatch !== "") {
      sql += ` AND TBP_ID_FIRST_PAR = :MBatch`;
      binds.MBatch = MBatch;
    }
    if (OrdNo && OrdNo !== "") {
      sql += ` AND TBP_ID_ORDER_NO = :OrdNo`;
      binds.OrdNo = OrdNo;
    }
    if (OrdItem && OrdItem !== "") {
      sql += ` AND TBP_ITEM_NO = :OrdItem`;
      binds.OrdItem = OrdItem;
    }
    if (Status && Status !== "") {
      sql += ` AND TBP_CD_STATUS = :Status`;
      binds.Status = Status;
    }
    if (MatnrNo && MatnrNo !== "") {
      sql += ` AND TBP_NO_MATNR = :MatnrNo`;
      binds.MatnrNo = MatnrNo;
    }

    if (QltyCd && QltyCd !== "") {
      sql += ` AND TBP_QUALITY_CD = :QltyCd`;
      binds.QltyCd = QltyCd;
    }

    if (
      ProdDateFrom &&
      ProdDateFrom !== "" &&
      ProdDateTo &&
      ProdDateTo !== ""
    ) {
      sql +=
        " AND  TRUNC(TBP_PROD_DATE) >= :ProdDateFrom AND TRUNC(TBP_PROD_DATE) <= :ProdDateTo";
      binds.ProdDateFrom = ProdDateFrom;
      binds.ProdDateTo = ProdDateTo;
    } else if (ProdDateFrom && ProdDateFrom !== "") {
      sql +=
        " AND TRUNC(TBP_PROD_DATE) = :ProdDateFrom AND TRUNC(TBP_PROD_DATE) <= TRUNC(SYSDATE)";
      binds.ProdDateFrom = ProdDateFrom;
    }

    if (millNo && millNo !== "") {
      sql += ` And LOM_MILL_NO=NVL('${millNo}', LOM_MILL_NO)`;
    }

    sql += ` ORDER BY TBP_CD_PROC`;

    console.log("prodUCT ENQUIRY: ", sql);
    console.log("binds", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getProdInqData = async (Proc: any,ProdDateFrom: any, ProdDateTo: any) => {
//     try {
//         var sql = ` SELECT TBP_PLANT_CD,TBP_BATCH_NO,TBP_CD_PROC,TBP_BATCH_PROC_NO,TBP_NEXT_PROC,TBP_PROD_DATE,TBP_SHIFT,TBP_WEIGHT,TBP_CD_STATUS,
//         TBP_PAR_COIL_NO,TBP_ID_FIRST_PAR,TBP_ID_ORDER_NO,TBP_ITEM_NO,TBP_QUALITY_CD,TBP_NO_MATNR,TBP_CD_FLAG,TBP_PROD_START_DT,TBP_PROD_END_DT,
//         TBP_RESULT,TBP_REMARK,TBP_HEAT_NO,TBP_INSP_NAME,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_FLATNG_0_O_10,
//         TBP_FLATNG_90_O_10,TBP_RBT_10,TBP_DIA_END_10,TBP_DIA_BODY_10,TBP_OUT_ROUND_BODY_10,TBP_OUT_ROUND_END_10,TBP_WALL_THK_BODY_10,
//         TBP_WALL_THK_END_10,TBP_STRGHTNES_T_END_10,TBP_SQOC_10,TBP_ROC_10,TBP_ID_FLASH_10,TBP_CONVX_10,TBP_CONCV_10,TBP_TWIST_10,
//         TBP_DEPTH_10,TBP_WIDTHS_10,tbp_sample_10,tbp_wld_temp_10,tbp_mill_spd_10,tbp_currentt_10,tbp_temp_qn_10,tbp_voltage_10,
//         tbp_frequency_10,tbp_normz_temp_10,tbp_weld_power_10,tbp_mill_rmk_10,tbp_angle_20,tbp_gauge_id_30,tbp_calib_date_30,
//         tbp_calib_due_dt_30,tbp_gauge_range_30,tbp_obsv_f_end_40,tbp_obsv_t_end_40,tbp_res_mg_f_end_40,tbp_res_mg_t_end_40,
//         tbp_no_ind_50,tbp_mut_result_50,tbp_mut_f_end_50,tbp_mut_t_end_50,tbp_calb_rmk_50,tbp_ut_remark_50,tbp_visual_insp_80,tbp_ecn_percen_80,
//         tbp_b_angl_f_end_80,tbp_b_angl_f_end_80,tbp_b_angl_t_end_80,tbp_rootface_f_end_80,tbp_rootface_t_end_80,tbp_strghtnes_f_end_80,
//         tbp_squ_f_end_80,tbp_squ_t_end_80,tbp_asl_no_80,tbp_wid_min_80,tbp_wid_max_80,tbp_depth_min_80,tbp_depth_max_80,tbp_vdi_final_rmk_1_80,tbp_vdi_final_rmk_2_80,
//         tbp_len_ft_80,tbp_len_inch_80,tbp_create_date,tbp_create_user,tbp_create_user,tbp_updated_on,tbp_updated_by,tbp_piptmp_beblst_100,
//         tbp_piptmp_beacid_100,tbp_ph_beacid_100,tbp_ph_afacid_100,tbp_dwelltm_100,tbp_predm_wa_100,tbp_dmwa_fra_1_100,tbp_predm_wa_100,tbp_dmwa_fra_1_100,
//         tbp_dmwa_fra_2_100,tbp_dmwa_fra_3_100,tbp_airtem_aftwa_100,tbp_rh_100,tbp_ambt_tmp_100,tbp_dew_tmp_100,tbp_pipsur_temp_100,
//         tbp_deg_clean_100,tbp_rough_100,tbp_dust_lvlra_100,tbp_dust_lvlcl_100,tbp_salt_conta_100,tbp_phosacid_m_100,tbp_phosacid_gr_100,
//         tbp_phosacid_bh_100,tbp_piptmp_becrm_110,tbp_chrm_visual_110,tbp_chrm_tmp_110,tbp_piptmp_afcrm_110,tbp_piptmp_befbe_110,tbp_tmp_adhef_fil_110,
//         tbp_tmp_pefilm_110,tbp_qun_wa_betmp_110,tbp_qun_wa_aftmp_110,tbp_epgun_1_110,tbp_epgun_2_110,tbp_epgun_3_110,tbp_epgun_4_110,tbp_epgun_5_110,tbp_epgun_6_110,
//         tbp_epgun_7_110,tbp_epgun_8_110,tbp_epgun_9_110,tbp_epgun_10_110,tbp_epgun_11_110,tbp_epgun_12_110,tbp_epgun_13_110,tbp_epgun_14_110,tbp_epgun_15_110,
//         tbp_epgun_16_110,tbp_epgun_17_110,tbp_epgun_18_110,tbp_epgun_19_110,tbp_epgun_20_110,tbp_epgun_21_110,tbp_epgun_22_110,tbp_epgun_23_110,tbp_epgun_24_110,
//         tbp_airpress_1_110,tbp_airpress_2_110,tbp_airpress_3_110,tbp_airpress_4_110,tbp_airpress_5_110,tbp_airpress_6_110,tbp_airpress_7_110,tbp_airpress_8_110,
//         tbp_airpress_9_110,tbp_airpress_10_110,tbp_airpress_11_110,tbp_airpress_12_110,tbp_airpress_13_110,tbp_airpress_14_110,tbp_airpress_15_110,tbp_airpress_16_110,
//         tbp_airpress_17_110,tbp_airpress_18_110,tbp_airpress_19_110,tbp_airpress_20_110,tbp_airpress_21_110,tbp_airpress_22_110,tbp_airpress_23_110,
//         tbp_airpress_24_110,tbp_flwrate_1_110,tbp_flwrate_2_110,tbp_flwrate_3_110,tbp_flwrate_4_110,tbp_flwrate_5_110,tbp_flwrate_6_110,tbp_flwrate_7_110,tbp_flwrate_8_110,
//         tbp_flwrate_9_110,tbp_flwrate_10_110,tbp_flwrate_11_110,tbp_flwrate_12_110,tbp_flwrate_13_110,tbp_flwrate_14_110,tbp_flwrate_15_110,tbp_flwrate_16_110,tbp_flwrate_17_110,
//         tbp_flwrate_18_110,tbp_flwrate_19_110,tbp_flwrate_20_110,tbp_flwrate_21_110,tbp_flwrate_22_110,tbp_flwrate_23_110,tbp_flwrate_24_110,tbp_rm_1_110,tbp_rm_2_110,tbp_rm_3_110,
//         tbp_rm_4_110,tbp_manfact_1_110,tbp_manfact_2_110,tbp_manfact_3_110,tbp_manfact_4_110,tbp_chrm_gr_110,tbp_epoxy_gr_110,tbp_adha_gr_110,tbp_pepp_gr_110,tbp_chrom_bh_110,
//         tbp_epxy_bh_110,tbp_adha_bh_110,tbp_pepp_bh_110,tbp_lines_sped_110,tbp_epxy_dwpt_110,tbp_no_epgun_110,tbp_hdpe_rpm01_110,tbp_adhe_rpm_110,tbp_cot_thk_1_120,tbp_cot_thk_3_120,
//         tbp_cot_thk_4_120,tbp_cot_thk_5_120,tbp_cot_thk_6_120,tbp_cot_thk_7_120,tbp_cot_thk_8_120,tbp_cot_thk_9_120,                                                                                                                                                                                    tbp_cot_thk_10_120
//         tbp_cot_thk_10_120,tbp_cot_thk_11_120,tbp_cot_thk_12_120,tbp_cot_wt_vs_120,tbp_coat_stas_120,tbp_test_pip_120,tbp_lab_tst_120,tbp_fld_test_120,tbp_cb_fend_130,tbp_cb_tend_130,
//         tbp_ep_fend_130,tbp_ep_tend_130,tbp_ca_fend_130,tbp_ca_tend_130,tbp_holidat_130,tbp_resumg_1_130,tbp_resumg_2_130,tbp_resumg_3_130,tbp_resumg_4_130,tbp_fstation_130,
//         tbp_work_center,tbp_rec_crt_dt,tbp_rec_crt_by,tbp_hold_rsn,tbp_sampl_tag FROM V_BARE_PDO`

//         let binds = {

//         };

//         if (Proc && Proc != '') {
//             sql += ` WHERE TBP_CD_PROC = :Proc`
//             Object.assign(binds, { Proc: Proc });
//         }

//         if ((ProdDateFrom && ProdDateFrom != "") && (ProdDateTo && ProdDateTo != "")) {
//             sql += " AND  TRUNC(TBP_PROD_DATE) >=:ProdDateFrom and TRUNC(TBP_PROD_DATE) <=:ProdDateTo"
//             Object.assign(binds, { ProdDateFrom: ProdDateFrom });
//             Object.assign(binds, { ProdDateTo: ProdDateTo });
//         }
//         if ((ProdDateFrom && ProdDateFrom != "") && ProdDateTo == "") {
//             sql += " AND TRUNC(TBP_PROD_DATE) =:ProdDateFrom AND TRUNC(TBP_PROD_DATE) <= TRUNC(SYSDATE)"
//             Object.assign(binds, { ProdDateFrom: ProdDateFrom });
//         }

//         sql += ` ORDER BY TBP_CD_PROC`

//     console.log("prodUCT ENQUIRY",sql);
//     //console.log("binds",binds);
//         return await query.executeQuery(sql);

//     } catch (error) {
//         console.log(error);
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };
