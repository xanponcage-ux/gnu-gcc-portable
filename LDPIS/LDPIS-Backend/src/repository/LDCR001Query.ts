import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getinspectorlist = async (process: any) => {
  try {
    let sql = `SELECT CD_DESC INSPECTOR_NAME FROM V_CODES
    WHERE CD_TYPE = 'TB055'
    and CD_VALUE = :process `;
    let binds = {
      process: process,
    };
    console.log(sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getimpactdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    t1.lom_CD_EPA AS cd_epa,
    T.TPS_ID_IMPPROC AS ID_MILLPROC,
    t.TPS_LD_IMP_TEST_TEMP IMP_TEST_TEMP,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    decode(T.TPS_SD_REF_NO,null,T3.ENC_MARK_CUST_NAME,T.TPS_SD_REF_NO) AS mark_cust_name,
    t.tps_sd_spec_grd AS spec_grd,
    T3.ENC_CD_GRADE AS cd_grade,
    T2.FPT_NO_CAST AS no_cast,
    T1.LOM_NO_CAST AS lom_no_cast,
    t.tps_ld_base1 AS base_ind,
    t.tps_ld_base2 AS base_avg,
    t.tps_ld_weld1 AS weld_ind,
    t.tps_ld_weld2 AS weld_avg,
    t.tps_ld_fl1 AS haz_ind,
    t.tps_ld_fl2 AS haz_avg,
    t.TPS_LD_SHEAR_IND AS shear_ind,
    t.TPS_LD_SHEAR_AVG AS shear_avg,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    T1.LOM_MILL_NO AS mill_no,
    T2.FPT_CD_LOC AS cd_loc,
    T2.FPT_TEST_CD AS test_cd,
    --T2.FPT_TEST_PARA AS test_para,
    --T2.FPT_TEST_PARA_VAL AS test_para_val,
    T2.FPT_TEST_PARA_RESULT AS test_para_result,
    T2.FT_DATE AS crt_dt,
    to_char(T2.FT_DATE,'dd.mm.yyyy') AS crt_dt,
    T.TPS_ID_IMPPROC ID_IMPPROC,
    t2.FPT_INSPEC_NM TESTED_BY,
    T2.FTP_TEST_REMARK TEST_REMARK,
    t2.FPT_TEST_PARA_REM,
    'ITRP' || '/' || TO_CHAR(T2.FT_DATE, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    t2.BASE1,t2.BASE2,BASE3,BASEAVG,HAZ1,HAZ2,HAZ3,HAZAVG,SA1,SA2,SA3,SA_AVG1,TEMPERATURE,WELD1,WELD2,WELD3,WELDAVG
FROM
    v_process_sheet t,
    v_ldp_prodn t1,
    v_END_CUST_ORD_EPA T3,
    (SELECT fpt_id_pipe,FPT_NO_CAST,FPT_CD_LOC,FPT_TEST_CD,FPT_TEST_PARA_RESULT,FTP_TEST_REMARK,
    TRUNC(FPT_CRT_DT)FT_DATE,FPT_TEST_PARA_REM,FPT_INSPEC_NM,
    SUM(CASE WHEN FPT_TEST_PARA =	'BASE1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE1,
    SUM(CASE WHEN FPT_TEST_PARA =	'BASE2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE2,
    SUM(CASE WHEN FPT_TEST_PARA =	'BASE3' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE3,
    SUM(CASE WHEN FPT_TEST_PARA =	'BASE_AVG' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASEAVG,
    SUM(CASE WHEN FPT_TEST_PARA =	'HAZ1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ1,
    SUM(CASE WHEN FPT_TEST_PARA =	'HAZ2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ2,
    SUM(CASE WHEN FPT_TEST_PARA =	'HAZ3' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ3,
    SUM(CASE WHEN FPT_TEST_PARA =	'HAZ_AVG' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZAVG,
    SUM(CASE WHEN FPT_TEST_PARA =	'SA1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS SA1,
    SUM(CASE WHEN FPT_TEST_PARA =	'SA2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS SA2,
    SUM(CASE WHEN FPT_TEST_PARA =	'SA3' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS SA3,
    SUM(CASE WHEN FPT_TEST_PARA =       'SA_AVG' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS SA_AVG1,
    SUM(CASE WHEN FPT_TEST_PARA =	'TEMPERATURE' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS TEMPERATURE,
    SUM(CASE WHEN FPT_TEST_PARA =	'WELD1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD1,
    SUM(CASE WHEN FPT_TEST_PARA =	'WELD2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD2,
    SUM(CASE WHEN FPT_TEST_PARA =	'WELD3' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD3,
    SUM(CASE WHEN FPT_TEST_PARA =	'WELD_AVG' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELDAVG
FROM
    V_fg_pipe_test_rslt
where fpt_test_cd='IP'
--and trunc(FPT_CRT_DT)='31-jul-2025'--FILTER CONDN
GROUP BY
    fpt_id_pipe,FPT_NO_CAST,FPT_CD_LOC,FPT_TEST_CD,FPT_TEST_PARA_RESULT,FPT_INSPEC_NM,FTP_TEST_REMARK,TRUNC(FPT_CRT_DT),
    FPT_TEST_PARA_REM,FPT_TEST_PARA_RESULT,FTP_TEST_REMARK,FPT_INSPEC_NM
ORDER BY fpt_id_pipe)T2
WHERE  
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'IP'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    --AND TRUNC(T2.FPT_CRT_DT) = '25-jun-2025'
    --AND T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    --AND T1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    --AND t.tps_order_id = '9518617784'
    --AND TO_NUMBER(t.tps_order_item) = 2 
    AND LOM_CD_EPA = '${plant}' `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR like ('%${matno}%')  `;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      sql += ` AND TRUNC(FT_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; 
    }

    sql += ` order by LOM_CD_EPA , ID_BATCH  `;

    console.error("getimpactdata", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getchemdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {

    var sql = `SELECT 
    t1.lom_CD_EPA AS lom_cd_epa,
    t.TPS_ID_SPECPROC AS ID_MILLPROC,
    t.tps_order_id AS order_id,
    to_number(t.tps_order_item) AS order_no,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    DECODE(T.TPS_SD_REF_NO, NULL, T3.ENC_MARK_CUST_NAME, T.TPS_SD_REF_NO) AS mark_cust_name,
    T.TPS_ID_TENPROC AS id_tenproc,
    t.tps_sd_spec_grd AS spec_grd,
    T3.ENC_CD_GRADE AS cd_grade,
    T2.FPT_NO_CAST AS no_cast,
    T1.LOM_NO_CAST AS lom_no_cast,
    T.TPS_LD_C_MIN AS c_min,
    T.TPS_LD_C AS c_max,
    T.TPS_LD_MN_MIN AS mn_min,
    T.TPS_LD_MN_MAX AS mn_max,
    T.TPS_LD_SI_MIN AS si_min,
    T.TPS_LD_SI AS si_max,
    T.TPS_LD_S_MIN AS s_min,
    T.TPS_LD_S AS s_max,
    T.TPS_LD_P_MIN AS p_min,
    T.TPS_LD_P_MAX AS p_max,
    T.TPS_LD_AL_MIN AS al_min,
    T.TPS_LD_AL AS al_max,
    T.TPS_LD_AL_SOL_MIN AS al_s_min,
    T.TPS_LD_AL_SOL_MAX AS al_s_max,
    T.TPS_LD_NB_MIN AS nb_min,
    T.TPS_LD_NB AS nb_max,
    T.TPS_LD_V_MIN AS v_min,
    T.TPS_LD_V AS v_max,
    T.TPS_LD_TI_MIN AS ti_min,
    T.TPS_LD_TI AS ti_max,
    T.TPS_LD_CR_MIN AS cr_min,
    T.TPS_LD_CR AS cr_max,
    T.TPS_LD_MO_MIN AS mo_min,
    T.TPS_LD_MO AS mo_max,
    T.TPS_LD_CU_MIN AS cu_min,
    T.TPS_LD_CU AS cu_max,
    T.TPS_LD_NI_MIN AS ni_min,
    T.TPS_LD_NI AS ni_max,
    T.TPS_LD_N_MIN AS n_min,
    T.TPS_LD_N AS n_max,
    T.TPS_LD_B_MIN AS b_min,
    T.TPS_LD_B AS b_max,
    T.TPS_LD_CA_MIN AS ca_min,
    T.TPS_LD_CA AS ca_max,
    T.TPS_LD_AL_N AS AL_N_MIN,
    T.TPS_LD_NI_V_TI AS NB_V_TI_MAX,
    T.TPS_LD_CU_NI AS CU_NI_MAX,
    T.TPS_LD_NB_V_TI_CU_MO AS CR_NI_CU_MO_V_MAX,
    T.TPS_LD_CE_IIW AS CEIIW_MAX,
    T.TPS_LD_CE_PCM AS CEPCM_MAX,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    T1.LOM_MILL_NO AS mill_no,
    T2.FPT_CD_LOC AS cd_loc,
    T2.FPT_TEST_CD AS test_cd,
    T2.FTP_TEST_REMARK TEST_REMARK,
    TO_CHAR(T2.FT_DATE, 'dd.mm.yyyy') AS crt_dt,
    t2.FPT_INSPEC_NM AS inspec_nm,
    'CARP' || '/' || TO_CHAR(T2.FT_DATE, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    ROUND(C, 4) AS C,
    ROUND(MN, 4) AS MN,
    ROUND(SI, 4) AS SI,
    ROUND(S, 4) AS S,
    ROUND(P, 4) AS P,
    ROUND(AL, 4) AS AL,
    ROUND(AL_S, 4) AS AL_S,
    ROUND(NB, 4) AS NB,
    ROUND(V, 4) AS V,
    ROUND(TI, 4) AS TI,
    ROUND(CR, 4) AS CR,
    ROUND(MO, 4) AS MO,
    ROUND(CU, 4) AS CU,
    ROUND(NI, 4) AS NI,
    ROUND(N, 4) AS N,
    ROUND(B, 4) AS B,
    ROUND(CA, 4) AS CA,
    ROUND(NB_V, 4) AS NB_V,
    ROUND(AL_N, 4) AS AL_N,
    ROUND(CU_NI, 4) AS CU_NI,
    ROUND(NB_V_TI, 4) AS NB_V_TI,
    ROUND(CU_NI_CR_MO_V, 4) AS CU_NI_CR_MO_V,
    ROUND(CEIIW, 4) AS CEIIW,
    ROUND(CEPCM, 4) AS CEPCM,
    FPT_TEST_PARA_RESULT,
    FTP_TEST_REMARK
FROM
    v_process_sheet t,
    v_ldp_prodn t1,
    v_END_CUST_ORD_EPA T3,
    (SELECT 
        fpt_id_pipe,
        FPT_NO_CAST,
        FPT_CD_LOC,
        FPT_TEST_CD,
        FPT_TEST_PARA_RESULT,
        FTP_TEST_REMARK,
        TRUNC(FPT_CRT_DT) FT_DATE,
        FPT_TEST_PARA_REM,
        FPT_INSPEC_NM,
        SUM(CASE WHEN FPT_TEST_PARA = 'AL' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS AL,
        SUM(CASE WHEN FPT_TEST_PARA = 'AL_N' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS AL_N,
        SUM(CASE WHEN FPT_TEST_PARA = 'AL_S' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS AL_S,
        SUM(CASE WHEN FPT_TEST_PARA = 'B' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS B,
        SUM(CASE WHEN FPT_TEST_PARA = 'C' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS C,
        SUM(CASE WHEN FPT_TEST_PARA = 'CA' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CA,
        SUM(CASE WHEN FPT_TEST_PARA = 'CEIIW' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CEIIW,
        SUM(CASE WHEN FPT_TEST_PARA = 'CEPCM' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CEPCM,
        SUM(CASE WHEN FPT_TEST_PARA = 'CR' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CR,
        SUM(CASE WHEN FPT_TEST_PARA = 'CU' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CU,
        SUM(CASE WHEN FPT_TEST_PARA = 'CU_NI' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CU_NI,
        SUM(CASE WHEN FPT_TEST_PARA = 'CU_NI_CR_MO_V' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS CU_NI_CR_MO_V,
        SUM(CASE WHEN FPT_TEST_PARA = 'MN' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS MN,
        SUM(CASE WHEN FPT_TEST_PARA = 'MO' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS MO,
        SUM(CASE WHEN FPT_TEST_PARA = 'N' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS N,
        SUM(CASE WHEN FPT_TEST_PARA = 'NB' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS NB,
        SUM(CASE WHEN FPT_TEST_PARA = 'NB_V' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS NB_V,
        SUM(CASE WHEN FPT_TEST_PARA = 'NB_V_TI' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS NB_V_TI,
        SUM(CASE WHEN FPT_TEST_PARA = 'NI' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS NI,
        SUM(CASE WHEN FPT_TEST_PARA = 'P' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS P,
        SUM(CASE WHEN FPT_TEST_PARA = 'S' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS S,
        SUM(CASE WHEN FPT_TEST_PARA = 'SI' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS SI,
        SUM(CASE WHEN FPT_TEST_PARA = 'TI' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS TI,
        SUM(CASE WHEN FPT_TEST_PARA = 'V' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS V
FROM
    V_fg_pipe_test_rslt
where fpt_test_cd='CP'
--and trunc(FPT_CRT_DT)='28-jul-2025'--FILTER CONDN
GROUP BY
    fpt_id_pipe,FPT_NO_CAST,FPT_CD_LOC,FPT_TEST_CD,FPT_TEST_PARA_RESULT,FPT_INSPEC_NM,FTP_TEST_REMARK,TRUNC(FPT_CRT_DT),
    FPT_TEST_PARA_REM,FPT_TEST_PARA_RESULT,FTP_TEST_REMARK,FPT_INSPEC_NM
ORDER BY fpt_id_pipe)T2
WHERE
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'CP'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    --AND TRUNC(T2.FPT_CRT_DT) = '25-jun-2025'
    --AND T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    --AND T1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    --AND t.tps_order_id = '9518617784'
    --AND TO_NUMBER(t.tps_order_item) = 2
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR like ('%${matno}%')  `;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      
      sql += ` AND TRUNC(FT_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; 
      
    }

    sql += ` order by LOM_CD_EPA,ID_BATCH  `;


    console.error("chem", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const gethardnessdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {

    var sql = `SELECT 
    t1.lom_CD_EPA AS cd_epa,
        T2.FT_DATE,
    T1.LOM_NO_MATNR ,
    t.TPS_ID_HARDN AS ID_MILLPROC,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    T.TPS_SD_REF_NO AS mark_cust_name,
    t.tps_sd_spec_grd AS spec_grade,
    T3.ENC_CD_GRADE AS cd_grade,
    T2.FPT_NO_CAST AS no_cast,
    T1.LOM_NO_CAST AS lom_no_cast,
    T.TPS_LD_HARDNESS AS hardness_max,
    T.TPS_LD_HARD_DIFF AS variance_max,
    T.TPS_ID_HARDN AS id_hardn,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    T1.LOM_MILL_NO AS mill_no,
    T2.FPT_CD_LOC AS cd_loc,
    T2.FPT_TEST_CD AS test_cd,
    --T2.FPT_TEST_PARA AS test_para,
    --ROUND(T2.FPT_TEST_PARA_VAL, 0) AS test_para_val,
    T2.FPT_TEST_PARA_RESULT AS test_para_result,
    TO_CHAR(T2.FT_DATE, 'DD.MM.YYYY') AS CRT_DT,
    --t2.FPT_INSPEC_NM AS inspec_nm,
    T2.INSP_NM AS TESTED_BY,
    T2.FTP_TEST_REMARK TEST_REMARK,
    'HTRP' || '/' || TO_CHAR(T2.FT_DATE, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    T2.BASE_L1,
T2.BASE_L2,
T2.BASE_L3,
T2.BASE_L4,
T2.BASE_L5,
T2.BASE_L6,
T2.BASE_L7,
T2.BASE_L8,
T2.BASE_L9,
T2.HAZ_L10,
T2.HAZ_L11,
T2.HAZ_L12,
T2.HAZ_L13,
T2.HAZ_L14,
T2.HAZ_L15,
T2.WELD_16,
T2.WELD_17,
T2.WELD_18,
T2.HAZ_R19,
T2.HAZ_R20,
T2.HAZ_R21,
T2.HAZ_R22,
T2.HAZ_R23,
T2.HAZ_R24,
T2.BASE_R25,
T2.BASE_R26,
T2.BASE_R27,
T2.BASE_R28,
T2.BASE_R29,
T2.BASE_R30,
T2.BASE_R31,
T2.BASE_R32,
T2.BASE_R33,
T2.GRN_MAX,
T2.GRN_MIN,
T2.GRN_SIZE,
T2.GRN_VARIANCE
FROM
    v_process_sheet t,
    v_ldp_prodn t1,
    v_END_CUST_ORD_EPA T3,
    (SELECT fpt_id_pipe,FPT_NO_CAST,FPT_CD_LOC,FPT_TEST_CD,FPT_TEST_PARA_RESULT,FPT_INSPEC_NM INSP_NM,FTP_TEST_REMARK,
    TRUNC(FPT_CRT_DT)FT_DATE,FPT_TEST_PARA_REM,FPT_INSPEC_NM,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L1,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L2,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L3' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L3,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L4' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L4,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L5' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L5,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L6' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L6,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L7' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L7,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L8' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L8,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_L9' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_L9,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L10' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L10,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L11' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L11,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L12' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L12,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L13' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L13,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L14' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L14,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_L15' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_L15,
    SUM(CASE WHEN FPT_TEST_PARA =    'WELD_16' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD_16,
    SUM(CASE WHEN FPT_TEST_PARA =    'WELD_17' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD_17,
    SUM(CASE WHEN FPT_TEST_PARA =    'WELD_18' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS WELD_18,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R19' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R19,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R20' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R20,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R21' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R21,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R22' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R22,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R23' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R23,
    SUM(CASE WHEN FPT_TEST_PARA =    'HAZ_R24' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS HAZ_R24,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R25' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R25,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R26' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R26,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R27' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R27,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R28' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R28,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R29' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R29,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R30' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R30,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R31' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R31,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R32' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R32,
    SUM(CASE WHEN FPT_TEST_PARA =    'BASE_R33' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS BASE_R33,
    SUM(CASE WHEN FPT_TEST_PARA =    'GRN_MAX' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS GRN_MAX,
    SUM(CASE WHEN FPT_TEST_PARA =    'GRN_MIN' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS GRN_MIN,
    SUM(CASE WHEN FPT_TEST_PARA =    'GRN_SIZE' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS GRN_SIZE,
    SUM(CASE WHEN FPT_TEST_PARA =    'GRN_VARIANCE' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS GRN_VARIANCE
FROM
    V_fg_pipe_test_rslt
where fpt_test_cd='HT'
--FILTER CONDN
--and trunc(FPT_CRT_DT)='23-aug-2025'
GROUP BY
    fpt_id_pipe,FPT_NO_CAST,FPT_CD_LOC,FPT_TEST_CD,FPT_TEST_PARA_RESULT,FPT_INSPEC_NM,FTP_TEST_REMARK,TRUNC(FPT_CRT_DT),
    FPT_TEST_PARA_REM,FPT_TEST_PARA_RESULT,FTP_TEST_REMARK,FPT_INSPEC_NM
ORDER BY fpt_id_pipe)T2
WHERE
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'HT'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('25C0092')
    --AND TRUNC(T2.FT_DATE) = '23-aug-2025'
    --AND T2.FPT_ID_PIPE ='SP1000500'--BETWEEN 'P20000095' AND 'P20000095'
    --AND T1.LOM_NO_MATNR IN ('000000000111122781', '000000000111122781')
    --AND t.tps_order_id = '9518840815'
    --AND TO_NUMBER(t.tps_order_item) = 1
    AND LOM_CD_EPA  = '${plant}' `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR like ('%${matno}%')  `;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      
      sql += ` AND TRUNC(FT_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; 
      
    }

    sql += ` order by LOM_CD_EPA ,ID_BATCH `;

    console.error("hardness", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getautomaticweld = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
    crdate: any,
    inspector : any,
  heatno: any,
  pipeno: any,
  mutverification : any,
  result : any,
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA CD_EPA,
        T.TPS_SD_REF_NO AS MARK_CUST_NAME,
        t.TPS_GD_UT_LENANG_PROB PROB,
            T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS CRT_DT_FORMAT,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS Pipe_Size,
        t3.ENC_MK_SPEC_COMPLETE AS Spec,
        T3.ENC_CD_GRADE AS Grade,
        'AUTWR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || t2.tbp_shift AS REP_NO,
        T2.TBP_PROD_DATE || ' , ' || t2.tbp_shift AS Date_Shift,
        t.TPS_GD_QAP_NO AS GD_QAP_NO,
        t.tps_sd_proc_sheet AS Proc_Sheet,
        t.TPS_ID_WELDUT || ',' AS Proce_No,
        t.TPS_ID_MWELDUT AS Proce_No1,
        t.tps_sd_cust_cd AS Cust_Code,
        t.TPS_GD_SCAN_SPD_AUT AS Scan_Speed_Aut,
        T3.ENC_MARK_CUST AS Mark_Cust,
        t.tps_sd_spec_grd AS Spec_Grade,
        t.TPS_GD_WAUT AS Ref_Std_Aut,
        t.TPS_GD_WMUT AS Ref_Std_Mut,
        t.TPS_GD_TEST_MODE_2 AS Test_Mode,
        t.TPS_GD_SCAN_SPD_AUT AS Scan_Speed_Aut,
        t1.lom_id_batch AS Batch_ID,
        t1.lom_cd_status AS LOM_Status,
        t2.Tbp_Cd_Status AS TBP_Status,
        T1.LOM_MILL_NO AS Mill_No,
        T3.ENC_GEOMETRY AS Geometry,
        T1.LOM_NO_CAST AS No_Cast,
        T1.LOM_ID_FIRST_PAR AS First_Par,
        t2.tbp_batch_no AS Batch_No,
        t2.tbp_result AS Result,
        t2.tbp_remark AS Remark,
        t2.TBP_NO_IND_50 AS No_Ind_50,
        t2.tbp_mut_f_end_50 AS Mut_F_End_50,
        t2.tbp_mut_t_end_50 AS Mut_T_End_50,
        t2.tbp_mut_result_50 AS Mut_Result_50,
        t2.tbp_ut_remark_50 AS MUT_Remark_50,
        t2.TBP_INSP_NAME AS INSP_NAME
    FROM 
        v_process_sheet t,
        v_ldp_prodn t1,
        v_bare_pdo t2,
        v_END_CUST_ORD_EPA T3
    WHERE 
        --t.tps_order_id = T2.TBP_ID_ORDER_NO
        --AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
        T.TPS_ORDER_ID = t1.lom_id_order_cus
        AND to_number(t.tps_order_item)  = t1.lom_id_ord_item_cus
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND t2.Tbp_Cd_PROC = '5'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
        -- FILTER COND.
        --AND T2.TBP_PROD_DATE = '02-JUL-2025'
        --AND t2.tbp_shift = 'A'
        --AND t.tps_order_id = '9518714294'
        --AND TO_NUMBER(t.tps_order_item) = 3
    AND LOM_CD_EPA  =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR like ('%${matno}%')  `;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      
    }

    if (inspector && inspector !== "" && inspector !== null) {
      sql += ` AND tbp_insp_name = '${inspector}'  `;
      
    }

    if (crdate && crdate !== "" && crdate !== null) {
      
      sql += ` AND TRUNC(T2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }
    if (result && result !== "" && result !== null) {
      
      sql += ` AND T2.TBP_RESULT = '${result}' `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      
    }

    if (mutverification && mutverification !== "" && mutverification !== null) {
      sql += ` AND t2.tbp_mut_result_50 IN ('${mutverification}')  `;
    }


    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  auto", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY auto", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `      order by LOM_CD_EPA ,BATCH_ID,BATCH_NO `;

    console.error("getautomaticwel", sql, mutverification    );
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getautomaticweldbody = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
    crdate: any,
    inspector : any,

  heatno: any,
  pipeno: any,
  mutverification : any,
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
        T.TPS_SD_REF_NO AS MARK_CUST_NAME,
        t.TPS_GD_UT_CIR_LENTR_PROB PROB,
        T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS CRT_DT_FORMAT,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        T3.ENC_SEC2_MAX || 'mm OD' || ' ' || 'X' || ' ' || T3.ENC_SEC1_MAX || 'mm WT' AS Pipe_Size,
        T3.ENC_MK_SPEC_COMPLETE AS Spec_Complete,
        T3.ENC_CD_GRADE AS Grade,
        'AUTBR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || T2.TBP_SHIFT || ')' AS REP_NO,
        T2.TBP_PROD_DATE || ' , ' || T2.TBP_SHIFT AS Date_Shift,
        T.TPS_GD_QAP_NO AS GD_QAP_NO,
        T.TPS_SD_PROC_SHEET AS Proc_Sheet,
        T.TPS_ID_BODYUT || ',' AS Proc_No,
        T.TPS_ID_MANNUT AS Proc_No1,
        T.TPS_SD_CUST_CD AS Cust_Code,
        T3.ENC_MARK_CUST AS Mark_Cust,
        T.TPS_SD_SPEC_GRD AS Spec_Grade,
        T.TPS_GD_BAUT AS Ref_Std_Aut,
        T.TPS_GD_BMUT AS Ref_Std_Mut,
        T.TPS_GD_BPROB AS Prob_Det_Body_Aut,
        T.TPS_GD_WPROB AS Prob_Det_Mut,
        T.TPS_GD_SCAN_SPD_BUT AS Scan_Spd_Body_UT,
        T1.LOM_ID_BATCH AS Batch_ID,
        T1.LOM_CD_STATUS AS Status_Code,
        T2.TBP_CD_STATUS AS Prod_Status,
        T1.LOM_MILL_NO AS Mill_No,
        T3.ENC_GEOMETRY AS Geometry,
        T1.LOM_NO_CAST AS No_Cast,
        T1.LOM_ID_FIRST_PAR AS First_Par,
        T2.TBP_BATCH_NO AS Batch_No,
        t2.TBP_NO_IND_50 AS NO_IND_50,
        T2.TBP_RESULT AS Result,
        T2.TBP_REMARK AS Remark,
        T2.TBP_MUT_F_END_50 AS Mut_F_End_50,
        T2.TBP_MUT_T_END_50 AS Mut_T_End_50,
        T2.TBP_MUT_RESULT_50 AS Mut_Result_50,
        T2.TBP_UT_REMARK_50 AS UT_Remark_50,
        T2.TBP_INSP_NAME AS Insp_Name
    FROM 
        v_process_sheet T,
        v_ldp_prodn T1,
        v_bare_pdo T2,
        v_END_CUST_ORD_EPA T3
    WHERE 
        --T.TPS_ORDER_ID = T2.TBP_ID_ORDER_NO
        --AND TO_NUMBER(T.TPS_ORDER_ITEM) = T2.TBP_ITEM_NO
        T.TPS_ORDER_ID = T1.LOM_ID_ORDER_CUS
        AND to_number(t.tps_order_item)  = t1.lom_id_ord_item_cus
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND T2.TBP_CD_PROC = '6'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
        -- FILTER COND.
        --AND T2.TBP_PROD_DATE = '02-JUL-2025'
        --AND T2.TBP_SHIFT = 'A'
        --AND T.TPS_ORDER_ID = '9518714294'
        --AND TO_NUMBER(T.TPS_ORDER_ITEM) = 3    
    AND LOM_CD_EPA  =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
     
    }

    if (inspector && inspector !== "" && inspector !== null) {
      sql += ` AND tbp_insp_name = '${inspector}'  `;
      
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR like ('%${matno}%')  `;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      
      sql += ` AND TRUNC(T2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      
    }

    if (mutverification && mutverification !== "" && mutverification !== null) {
      sql += ` AND t2.tbp_mut_result_50 IN ('${mutverification}')  `;
    }


    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  body", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY body", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `      order by LOM_CD_EPA ,BATCH_ID,BATCH_NO `;

    console.error("getautomaticweldbody", sql,mutverification);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFRBTdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    T.TPS_ORDER_ID AS order_id,
    --T.TPS_ID_FLTPROC||'/'||T.TPS_ID_RBTPROC   ,
    T.TPS_ID_FLTPROC||' & '||T.TPS_ID_RBTPROC   ID_MILLPROC,
    --t.TPS_ID_HARDN AS ID_MILLPROC,
    T3.ENC_ID_ORDER AS enc_order_id,
    T3.ENC_NO_ITEM AS enc_item_no,
    T3.ENC_GEOMETRY AS enc_geometry,
    T3.ENC_CD_GRADE AS enc_grade,
    T3.ENC_SEC2_MAX || 'mm OD' || ' ' || 'X' || ' ' || T3.ENC_SEC1_MAX || 'mm WT' AS pipe_size,
    T.TPS_SD_PROC_SHEET AS proc_sheet,
    T.TPS_GD_QAP_NO AS qap_no,
    T.TPS_SD_CUST_CD AS cust_code,
    T3.ENC_MARK_CUST AS mark_cust,
    T.TPS_SD_REF_NO AS mark_cust_name,
    T.TPS_SD_SPEC_GRD AS spec_grade,
    T1.LOM_NO_CAST AS no_cast,
    T1.LOM_ID_FIRST_PAR AS first_par,
    T1.LOM_ID_BATCH AS ID_batch,
    T1.LOM_CD_STATUS AS status,
    T1.LOM_MILL_NO AS mill_no,
    TO_CHAR(T2.FRD_PROD_DATE, 'DD.MM.YYYY') AS CRT_DT,
    T2.FRD_SHIFT AS shift,
    T2.FRD_BATCH_NO AS frd_batch_no,
    T2.FRD_ID_FIRST_PAR AS frd_first_par,
    T2.FRD_FLAT_0_1 AS flat_0_1,
    T2.FRD_FLAT_0_1_RESULT AS flat_0_1_result,
    T2.FRD_FLAT_0_2 AS flat_0_2,
    T2.FRD_FLAT_0_2_RESULT AS flat_0_2_result,
    T2.FRD_FLAT_0_3 AS flat_0_3,
    T2.FRD_FLAT_0_3_RESULT AS flat_0_3_result,
    T2.FRD_FLAT_90_1 AS flat_90_1,
    T2.FRD_FLAT_90_1_RESULT AS flat_90_1_result,
    T2.FRD_FLAT_90_2 AS flat_90_2,
    T2.FRD_FLAT_90_2_RESULT AS flat_90_2_result,
    T2.FRD_FLAT_90_3 AS flat_90_3,
    T2.FRD_FLAT_90_3_RESULT AS flat_90_3_result,
    T2.FRD_MANDR_DIA AS mandr_dia,
    T2.FRD_MANDR_DIA_RESULT AS mandr_dia_result,
    T2.FRD_MANDR_DIA_RESULT AS frd_result,
    T2.FRD_REMARK AS frd_remark,
    T2.FRD_INSP_NAME AS TESTED_BY,
    'FRBT-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.FRD_PROD_DATE, 'YYYYMMDD') || '(' || T2.FRD_SHIFT || ')' 
AS rep_no
FROM
    V_PROCESS_SHEET T,
    V_LDP_PRODN T1,
    V_FLAT_RBT_DISTANCE T2,
    V_END_CUST_ORD_EPA T3
WHERE
    --T.TPS_ORDER_ID = T2.FRD_ID_ORDER_NO
    --AND TO_NUMBER(T.TPS_ORDER_ITEM) = T2.FRD_ITEM_NO
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus
    AND T2.FRD_BATCH_NO = T1.LOM_ID_BATCH
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND TO_NUMBER(T.TPS_ORDER_ITEM) = T3.ENC_NO_ITEM
    -- FILTER CONDITIONS   FBY
    --AND T2.FRD_PROD_DATE = '17-JUL-2025'
    --AND T2.FRD_SHIFT = 'A'
    --AND T2.FPT_ID_PIPE BETWEEN 'P20000051' AND 'P20000051'
    --AND T.TPS_ORDER_ID = '9518830960'
    --AND TO_NUMBER(T.TPS_ORDER_ITEM) = 2
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND FRD_SHIFT = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(T2.FRD_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t1.LOM_ID_BATCH = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by LOM_CD_EPA ,ID_BATCH `;

    console.error("hardness", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMRRdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any,
  // ,rmno: any
  slitNo: any
) => {
  try {
    var sql = `SELECT 
    T3.enc_id_order AS order_id,
    T3.ENC_NO_ITEM AS item_no,
    T3.ENC_GEOMETRY AS geometry,
    T3.ENC_CD_GRADE AS CD_GRADE,
    T3.enc_sec2_max || 'mm OD' || ' X ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    T.tps_sd_proc_sheet AS proc_sheet,
    T.TPS_GD_QAP_NO AS GD_QAP_NO,
    T.tps_sd_cust_cd AS sd_cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    T.TPS_SD_REF_NO AS mark_cust_name,
    T.tps_sd_spec_grd AS SPEC_GRD,
    T.TPS_MD_DIA_MTR_BODY_MIN AS dia_body_min,
    T.TPS_MD_DIA_MTR_BODY_MAX AS dia_body_max,
    T.TPS_MD_DIA_MTR_END_MIN AS dia_end_min,
    T.TPS_MD_DIA_MTR_END_MAX AS dia_end_max,
    T.TPS_MD_OUT_OF_ROUNDNESS AS oor_body_max,
    T.TPS_MD_OOREND AS oor_end_max,
    T.TPS_MD_STRAIGHTNESS_FUL AS straightness_full,
    T.TPS_MD_STRAIGHTNESS_END AS straightness_end,
    TPS_MD_IDBEED AS ib_height_max,
    TPS_MD_IDBEED_DEPTH AS ib_depth_min,
    T.TPS_MD_WEIGHT_MIN AS weight_min,
    T.TPS_MD_WEIGHT_MAX AS weight_max,
    T.TPS_MD_PIPE_LEN_MIN AS pipe_len_min,
    T.TPS_MD_PIPE_LEN_MAX AS pipe_len_max,
    T.TPS_ID_MILMM AS micrometer_0_25,
    T.TPS_ID_MILOD AS od_micrometer,
    T.TPS_ID_MEASUR_TAPE AS measuring_tape,
    DECODE(T1.LOM_MILL_NO, 1, '13575/1', 'N45184/1') AS weighing_mc_id,
    T1.LOM_NO_CAST AS no_cast,
    T1.LOM_ID_FIRST_PAR AS id_first_par,
    T1.lom_id_batch AS ID_batch,
    T1.lom_cd_status AS cd_status,
    T2.Tbp_Cd_Status AS tbp_cd_status,
    T1.LOM_MILL_NO AS mill_no,
    --T2.TBP_PROD_DATE AS prod_date,
    TO_CHAR(T2.TBP_PROD_DATE,'DD.MM.YYYY') || ' / ' ||T2.tbp_shift AS prod_date,
    T2.tbp_shift AS shift,
    T2.TBP_DIA_BODY_10 AS dia_body_10,
    T2.TBP_DIA_END_10 AS dia_end_10,
    T2.TBP_OUT_ROUND_END_10 AS out_round_end_10,
    T2.TBP_OUT_ROUND_BODY_10 AS out_round_body_10,
    T2.TBP_WALL_THK_BODY_10 AS WALL_THICKNESS,
    T2.TBP_WLD_TEMP_10 AS weld_temp_10,
    T2.TBP_MILL_SPD_10 AS mill_speed_10,
    T2.TBP_CURRENTT_10 AS current_10,
    T2.TBP_TEMP_QN_10 AS temp_qn_10,
    T2.TBP_VOLTAGE_10 AS voltage_10,
    T.TPS_MD_WALL_THK_MIN AS WALL_THK_MIN,
    T.TPS_MD_WALL_THK_MAX AS WALL_THK_MAX,
    t2.TBP_WALL_THK_BODY_10 AS WALL_THICK,		
    t2.TBP_WALL_THK_END_10  AS WALL_THICK_END, 
    T2.TBP_FREQUENCY_10 AS frequency_10,
    T2.TBP_NORMZ_TEMP_10 AS normz_temp_10,
    T2.TBP_WELD_POWER_10 AS weld_power_10,
    T2.TBP_STRGHTNES_F_END_10 AS straightness_f_end_10,
    T2.TBP_STRGHTNES_T_END_10 AS straightness_t_end_10,
    T1.LOM_MS_PIECE_ACTL AS weight,
    T2.TBP_PIPE_LNG_10 / 1000 AS length_mtr,
    T2.TBP_FLATNG_0_O_10 AS flatng_0_o_10,
    T2.TBP_FLATNG_90_O_10 AS flatng_90_o_10,
    T2.TBP_RBT_10 AS rbt_10,
    T2.TBP_RESULT AS result,
    T2.TBP_MILL_RMK_10 AS mill_remark_10,
    --T2.TBP_REMARK AS REMARKS,
    decode(T2.TBP_RESULT,'HOLD',(SELECT CD_DESC FROM V_CODES WHERE CD_TYPE = 'LDP101'AND CD_VALUE =  T2.TBP_HOLD_RSN),T2.TBP_REMARK)   AS REMARKS,
    T2.TBP_ID_FLASH_10 AS id_flash_10,
    TO_CHAR(T2.TBP_PROD_DATE, 'DD.MM.YYYY') AS CRT_DT,
    T2.TBP_INSP_NAME INSP_NAME,
    'MRR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || T2.tbp_shift || ')' AS rep_no,
    T.TPS_ID_MILLPROC AS ID_MILLPROC
FROM 
    v_process_sheet T,
    v_ldp_prodn T1,
    v_bare_pdo T2,
    v_END_CUST_ORD_EPA T3
WHERE 
    --T.tps_order_id = T2.TBP_ID_ORDER_NO
    --AND TO_NUMBER(T.tps_order_item) = T2.TBP_ITEM_NO
    T.TPS_ORDER_ID = T1.lom_id_order_cus
    AND to_number(T.tps_order_item) = T1.lom_id_ord_item_cus
    AND T3.ENC_GEOMETRY = 'O'
    AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
    AND T2.Tbp_Cd_PROC = '1'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
   -- AND T2.TBP_PROD_DATE = '24-Jun-2025'
    --AND T2.tbp_shift = 'B'
    --AND T.tps_order_id = '9518617784'
    --AND TO_NUMBER(T.tps_order_item) = 2 
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }


    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (
      pipeno &&
      pipeno !== "''" &&
      pipeno !== "" &&
      pipeno !== null &&
      (!Array.isArray(pipeno) || pipeno.length > 0)
    ) {
      sql += ` and T1.LOM_ID_FIRST_PAR =  '${pipeno}' `;
      // binds["pipeno"] = pipeno;
    }
    if (
      slitNo &&
      slitNo !== "''" &&
      slitNo !== "" &&
      slitNo !== null 
    ) {
      // const formattedslitNo = slitNo.map((p: any) => `'${p?.value}'`).join(",");
      sql += ` and T1.lom_id_par_coil_no in  ('${slitNo}') `;
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by ID_FIRST_PAR,ID_BATCH,CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMRRSdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
      t.tps_sd_proc_sheet AS proc_sheet,
      T2.TBP_INSP_NAME INSP_NAME,
      T.TPS_ID_MILLPROC AS ID_MILLPROC,
      TO_CHAR(T2.TBP_PROD_DATE, 'DD.MM.YYYY') AS CRT_DT,
      t.TPS_GD_QAP_NO AS qap_no,
      t.tps_sd_cust_cd AS cust_cd,
      T3.enc_id_order AS order_id,
      T3.ENC_NO_ITEM AS item_no,
      T3.ENC_MARK_CUST AS mark_cust,
      T.TPS_SD_REF_NO AS mark_cust_name,
      t.tps_sd_spec_grd AS spec_grd,
      T.TPS_MD_DEPTH_MN AS depth_min,
      T.TPS_MD_DEPTH_MX AS depth_max,
      T.TPS_MD_WIDTH_MN AS width_min,
      T.TPS_MD_WIDTH_MX AS width_max,
      T.TPS_MD_WEIGHT_MIN AS weight_min,
      T.TPS_MD_WEIGHT_MAX AS weight_max,
      T.TPS_MD_TWIST AS twist_max,
      TPS_MD_SQOC_MN AS sqoc_min,
      TPS_MD_SQOC_MX AS sqoc_max,
      TPS_MD_ROC AS roc_max,
      T.TPS_MD_STRAIGHTNESS_FUL AS straightness_full,
      T.TPS_MD_STRAIGHTNESS_END AS straightness_end,
      T.TPS_MD_CONVEX AS convex_max,
      T.TPS_MD_CONCAV AS concave_max,
      T.TPS_MD_PIPE_LEN_MIN AS LEN_MIN,
      T.TPS_MD_PIPE_LEN_MAX AS LEN_MAX,
      T.TPS_ID_MILMM AS micrometr_0_25,
      T.TPS_ID_MILOD AS od_micrometer,
      T.TPS_ID_MEASUR_TAPE AS measuring_tape,
      T3.ENC_GEOMETRY AS geometry,
      T3.ENC_CD_GRADE AS cd_grade,
      T1.LOM_NO_CAST AS no_cast,
      T1.LOM_ID_FIRST_PAR AS id_first_par,
      t1.lom_id_batch AS id_batch,
      t1.lom_cd_status AS cd_status,
      t2.Tbp_Cd_Status AS bp_cd_status,
      T1.LOM_MILL_NO AS mill_no,
      T2.TBP_PROD_DATE AS prod_date,
      t2.tbp_shift AS shift,
      T2.TBP_DEPTH_10 AS depth_10,
      TBP_WIDTHS_10 AS widths_10,
      T1.LOM_MS_PIECE_ACTL AS weight,
      T2.TBP_TWIST_10 AS twist_10,
      T2.TBP_SQOC_10 AS sqoc_10,
      T2.TBP_ROC_10 AS roc_10,
      T2.TBP_STRGHTNES_F_END_10 AS straightness_f_end_10,
      T2.TBP_STRGHTNES_T_END_10 AS straightness_t_end_10,
      T2.TBP_CONVX_10 AS convx_10,
      TBP_CONCV_10 AS concv_10,
      T2.TBP_PIPE_LNG_10 / 1000 AS length_mtr,
      T2.TBP_RESULT AS result,
      T2.TBP_MILL_RMK_10 AS mill_rmk_10,
      T2.TBP_WLD_TEMP_10 AS wld_temp_10,
      T2.TBP_MILL_SPD_10 AS mill_spd_10,
      T2.TBP_CURRENTT_10 AS currentt_10,
      T2.TBP_TEMP_QN_10 AS temp_qn_10,
      T2.TBP_VOLTAGE_10 AS voltage_10,
      T2.TBP_FREQUENCY_10 AS frequency_10,
      T2.TBP_NORMZ_TEMP_10 AS normz_temp_10,
      T2.TBP_WELD_POWER_10 AS weld_power_10,
      'MSR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t2.tbp_shift || ')' AS rep_no,
      t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size
  FROM 
      v_process_sheet t,
      v_ldp_prodn t1,
      v_bare_pdo t2,
      v_END_CUST_ORD_EPA T3
  WHERE 
      --t.tps_order_id = T2.TBP_ID_ORDER_NO
      --AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
      T.TPS_ORDER_ID = t1.lom_id_order_cus
      AND to_number(t.tps_order_item)  = t1.lom_id_ord_item_cus
      AND T3.ENC_GEOMETRY IN ('S', 'R')
     -- AND T3.ENC_GEOMETRY IN ('S', 'R','O')
      AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
      AND t2.Tbp_Cd_PROC = '1'
      AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
      AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
      -- Filter conditions
      --AND T2.TBP_PROD_DATE = '24-Jun-2025'
      --AND t2.tbp_shift = 'B'
      --AND t.tps_order_id = '9518617784'
      --AND TO_NUMBER(t.tps_order_item) = 2
      AND LOM_CD_EPA =  ${plant}`;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (
      pipeno &&
      pipeno !== "''" &&
      pipeno !== "" &&
      pipeno !== null &&
      (!Array.isArray(pipeno) || pipeno.length > 0)
    ) {
      sql += ` and T1.LOM_ID_FIRST_PAR =  '${pipeno}' `;
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by ID_FIRST_PAR,ID_BATCH,CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("MRR", sql);
    console.error("binds");
    console.error("MRR pipeno", pipeno);
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDROPdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    //     var sql = `SELECT
    //     t1.lom_CD_EPA AS lom_cd_epa,
    //     t3.enc_sec2_max ||  ' mm OD ' ||   'X' || ' ' || t3.enc_sec1_max || ' mm WT'   AS pipe_size1,
    //     t.TPS_ID_DWTTPROC PROC_NO,
    //     t.tps_id_tenproc ID_TENPROC,
    //     t.tps_order_id AS order_id,
    //     t.tps_sd_proc_sheet AS proc_sheet,
    //     t.TPS_SD_QAP_NO AS sd_qap_no,
    //     t.TPS_GD_QAP_NO AS gd_qap_no,
    //     t.tps_sd_cust_cd AS cust_cd,
    //     T3.ENC_MARK_CUST AS mark_cust,
    //     T.TPS_SD_REF_NO AS mark_cust_name,
    //     t.tps_sd_spec_grd AS spec_grd,
    //     T3.ENC_CD_GRADE AS cd_grade,
    //     T2.FPT_NO_CAST AS no_cast,
    //     T1.LOM_NO_CAST AS lom_no_cast,
    //     t.tps_ld_dwtt_test_temp AS test_temp,
    //     --t.TPS_LD_DWTT_INDV_SA || '%'AS sa_indv,
    //     --t.TPS_LD_DWTT_AVG_SA || '%'AS sa_avg,
    //     CASE WHEN t.TPS_LD_DWTT_INDV_SA IS NOT NULL THEN t.TPS_LD_DWTT_INDV_SA || '%' ELSE NULL END AS sa_indv,
    //     CASE WHEN t.TPS_LD_DWTT_AVG_SA IS NOT NULL THEN t.TPS_LD_DWTT_AVG_SA || '%' ELSE NULL END AS sa_avg,
    //     t1.lom_id_batch AS id_batch,
    //     t1.lom_cd_status AS cd_status,
    //     T1.LOM_MILL_NO AS mill_no,
    //     T2.FPT_CD_LOC AS cd_loc,
    //     T2.FPT_TEST_CD AS test_cd,
    //     T2.FPT_TEST_PARA AS test_para,
    //     ROUND(T2.FPT_TEST_PARA_VAL, 0) AS test_para_val,
    //     T2.FPT_TEST_PARA_RESULT AS test_para_result,
    //     T2.FPT_INSPEC_NM TESTED_BY,
    //     T2.FTP_TEST_REMARK TEST_REMARK,
    //     to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    //     'DWTTRP' || '/' || TO_CHAR(T2.FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    //     t3.enc_sec3_max || ' ' || 'X' || ' ' || t3.enc_sec2_max ||  ' ' ||   'X' || ' ' || t3.enc_sec1_max AS pipe_size,
    //     t3.enc_sec1_max AS SPECIMEN_THIK
    // FROM
    //     v_process_sheet t,
    //     v_ldp_prodn t1,
    //     v_fg_pipe_test_rslt t2,
    //     v_END_CUST_ORD_EPA T3
    // WHERE
    //     T.TPS_ORDER_ID = t1.lom_id_order_cus
    //     AND t.tps_order_item = t1.lom_id_ord_item_cus
    //     AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    //     AND t2.fpt_test_cd = 'DWTT'
    //     AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    //     AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
    //     --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    //     --AND TRUNC(T2.FPT_CRT_DT) = '25-jun-2025' --and '30-jun-2025'
    //     --AND T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    //    -- AND T1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    //     --AND t.tps_order_id = '9518617784'
    //     --AND TO_NUMBER(t.tps_order_item) = 2
    //     AND LOM_CD_EPA = ${plant} `;

    var sql = `SELECT 
    t1.lom_CD_EPA AS lom_cd_epa,
    t3.enc_sec2_max ||  ' mm OD ' ||   'X' || ' ' || t3.enc_sec1_max || ' mm WT' AS pipe_size1,
    t.TPS_ID_DWTTPROC AS PROC_NO,
    t.tps_id_tenproc AS ID_TENPROC,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    t3.ENC_MARK_CUST AS mark_cust,
    t.TPS_SD_REF_NO AS mark_cust_name,
    t.tps_sd_spec_grd AS spec_grd,
    t3.ENC_CD_GRADE AS cd_grade,
    FPT_NO_CAST AS no_cast,
    t1.LOM_NO_CAST AS lom_no_cast,
    t.tps_ld_dwtt_test_temp AS test_temp,
    CASE WHEN t.TPS_LD_DWTT_INDV_SA IS NOT NULL THEN t.TPS_LD_DWTT_INDV_SA || '%' ELSE NULL END AS sa_indv,
    CASE WHEN t.TPS_LD_DWTT_AVG_SA IS NOT NULL THEN t.TPS_LD_DWTT_AVG_SA || '%' ELSE NULL END AS sa_avg,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    t1.LOM_MILL_NO AS mill_no,
    t2.FPT_CD_LOC AS cd_loc,
    t2.FPT_INSPEC_NM AS TESTED_BY,
    t2.FTP_TEST_REMARK AS TEST_REMARK,
    'DWTTRP' || '/' || TO_CHAR(FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec3_max || ' ' || 'X' || ' ' || t3.enc_sec2_max ||  ' ' ||   'X' || ' ' || t3.enc_sec1_max AS pipe_size,
    t3.enc_sec1_max AS SPECIMEN_THIK,
    THICK1,THICK2,t2.LEN_A1,LEN_A2,LEN_B1,LEN_B2,INDV1,INDV2,AVGDWTT,FTP_TEST_REMARK,FPT_TEST_PARA_RESULT,TO_CHAR(FPT_CRT_DT, 'DD.MM.YYYY') CRT_DT
FROM
    v_process_sheet t
JOIN
    v_ldp_prodn t1 ON t.TPS_ORDER_ID = t1.lom_id_order_cus AND t.tps_order_item = t1.lom_id_ord_item_cus
JOIN
    (SELECT FPT_CRT_DT,fpt_id_pipe, FPT_CD_LOC, FPT_NO_CAST,FPT_TEST_CD, FPT_TEST_PARA_RESULT, FTP_TEST_REMARK,
            FPT_TEST_PARA_REM, FPT_INSPEC_NM,
            SUM(CASE WHEN FPT_TEST_PARA = 'LEN_A1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS LEN_A1,
            SUM(CASE WHEN FPT_TEST_PARA = 'LEN_A2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS LEN_A2,
            SUM(CASE WHEN FPT_TEST_PARA = 'LEN_B1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS LEN_B1,
            SUM(CASE WHEN FPT_TEST_PARA = 'LEN_B2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS LEN_B2,
            SUM(CASE WHEN FPT_TEST_PARA = 'INDV1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS INDV1,
            SUM(CASE WHEN FPT_TEST_PARA = 'INDV2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS INDV2,
            SUM(CASE WHEN FPT_TEST_PARA = 'AVGDWTT' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS AVGDWTT,
            SUM(CASE WHEN FPT_TEST_PARA = 'THICK1' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS THICK1,
            SUM(CASE WHEN FPT_TEST_PARA = 'THICK2' THEN FPT_TEST_PARA_VAL ELSE 0 END) AS THICK2
     FROM V_fg_pipe_test_rslt
     WHERE fpt_test_cd = 'DWTT'
     GROUP BY fpt_id_pipe,FPT_CRT_DT, FPT_NO_CAST, FPT_CD_LOC, FPT_TEST_CD, FPT_TEST_PARA_RESULT, FPT_INSPEC_NM, FTP_TEST_REMARK,
              FPT_TEST_PARA_REM, FPT_TEST_PARA_RESULT, FTP_TEST_REMARK, FPT_INSPEC_NM
     ORDER BY fpt_id_pipe) t2 ON t2.FPT_ID_PIPE = t1.LOM_ID_BATCH
JOIN
    v_END_CUST_ORD_EPA t3 ON t.TPS_ORDER_ID = t3.ENC_ID_ORDER AND t.TPS_ORDER_ITEM = t3.ENC_NO_ITEM
WHERE
    t2.fpt_test_cd = 'DWTT'
    AND LOM_CD_EPA = ${plant}`;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.FPT_CRT_DT) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by LOM_CD_EPA,ID_BATCH  `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("DWTT", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getmechanicaldata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    //     let binds = {
    //   plant: plant,
    //   orderNo: orderNo,
    //   item: item,
    //   matno: matno,
    //   // crdate: crdate,
    //   heatno: heatno,
    //   pipeno: pipeno,
    //   // rmno: rmno,
    // };

    console.log("QUERY MECH");

    var sql = ` SELECT 
    LOM_CD_EPA AS CD_EPA,
    T.TPS_SD_REF_NO AS mark_cust_name,
    t3.enc_id_order AS order_id,
    t3.enc_no_item AS item_no,
    t1.LOM_MILL_NO AS mill_no,
    t3.enc_sec2_max || 'mm OD' || ' X ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    t.tps_sd_spec_grd AS spec,
    t3.enc_mk_spec_complete AS spec_complete,
    t3.enc_cd_grade AS grade,
    'MTRP/' || TO_CHAR(t2.ft_date, 'YYYYMMDD') || '/1' AS rep_no,
    TO_CHAR(t2.ft_date, 'dd.mm.yyyy') AS crt_dt,
    t.tps_gd_qap_no AS GD_qap_no,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.tps_id_tenproc AS ID_TENPROC,
    t1.lom_cd_epa AS epa_code,
    t.tps_order_id AS order_id,
    t.tps_sd_cust_cd AS customer_code,
    t3.enc_mark_cust AS customer_mark,
    t2.fpt_no_cast AS no_cast,
    t1.lom_no_cast AS lom_no_cast,
    t.tps_ld_ys_min AS yield_strength_min,
    t.tps_ld_ys_max AS yield_strength_max,
    t.tps_ld_uts_min AS tensile_strength_base_min,
    t.tps_ld_uts_max AS tensile_strength_base_max,
    t.tps_ld_weld_uts_min AS tensile_strength_weld_min,
    t.tps_ld_weld_uts_max AS tensile_strength_weld_max,
    t.tps_ld_ys_uts AS ys_uts_ratio,
    t.tps_ld_el AS elongation,
    t1.lom_id_batch AS BATCH_ID,
    t1.lom_cd_status AS status_code,
    t1.lom_mill_no AS lom_mill_no,
    t1.lom_no_matnr AS lom_no_matnr,
    t3.enc_no_matnr AS enc_no_matnr,
    t2.fpt_id_pipe AS pipe_id,
    t2.fpt_no_cast AS cast_no,
    t2.fpt_cd_loc AS CD_LOC,
    t2.fpt_test_cd AS test_code,
    t2.fpt_test_para_result AS test_para_result,
    t2.fpt_inspec_nm AS inspector_name,
    t2.ftp_test_remark AS test_remark,
    t2.ft_date AS test_date,
    t2.fpt_test_para_rem AS BROKEN_LOC,
    t2.width AS width,
    t2.thick AS thickness,
    t2.area AS area,
    t2.mgl AS mgl,
    t2.yl AS yl,
    t2.ys AS ys,
    t2.utl AS utl,
    t2.uts AS uts,
    t2.fgl AS fgl,
    t2.el AS el,
    t2.ys_uts AS ys_uts
FROM 
    v_process_sheet t
JOIN 
    v_ldp_prodn t1 ON t.tps_order_id = t1.lom_id_order_cus AND t.tps_order_item = t1.lom_id_ord_item_cus
JOIN 
    v_end_cust_ord_epa t3 ON t.tps_order_id = t3.enc_id_order AND t.tps_order_item = t3.enc_no_item
JOIN 
    (
        SELECT 
            fpt_id_pipe, fpt_no_cast, fpt_cd_loc, fpt_test_cd,
            fpt_test_para_result, fpt_inspec_nm, ftp_test_remark,
            TRUNC(fpt_crt_dt) AS ft_date, fpt_test_para_rem,
            SUM(CASE WHEN fpt_test_para = 'WIDTH_B' THEN fpt_test_para_val ELSE 0 END) AS width,
            SUM(CASE WHEN fpt_test_para = 'THICK_B' THEN fpt_test_para_val ELSE 0 END) AS thick,
            SUM(CASE WHEN fpt_test_para = 'AREA_B' THEN fpt_test_para_val ELSE 0 END) AS area,
            SUM(CASE WHEN fpt_test_para = 'MGL' THEN fpt_test_para_val ELSE 0 END) AS mgl,
            SUM(CASE WHEN fpt_test_para = 'YL' THEN fpt_test_para_val ELSE 0 END) AS yl,
            SUM(CASE WHEN fpt_test_para = 'YS_B' THEN fpt_test_para_val ELSE 0 END) AS ys,
            SUM(CASE WHEN fpt_test_para = 'UTL_B' THEN fpt_test_para_val ELSE 0 END) AS utl,
            SUM(CASE WHEN fpt_test_para = 'UTS_B' THEN fpt_test_para_val ELSE 0 END) AS uts,
            SUM(CASE WHEN fpt_test_para = 'FGL' THEN fpt_test_para_val ELSE 0 END) AS fgl,
            SUM(CASE WHEN fpt_test_para = 'EL' THEN fpt_test_para_val ELSE 0 END) AS el,
            SUM(CASE WHEN fpt_test_para = 'YS_UTS_B' THEN fpt_test_para_val ELSE 0 END) AS ys_uts
        FROM 
            v_fg_pipe_test_rslt
        WHERE 
            fpt_test_cd = 'TP' AND fpt_cd_loc <> 'TWT'
            and fpt_id_pipe in (select fpt_id_pipe from v_fg_pipe_test_rslt where FPT_CD_LOC ='TWT') `;

    if (crdate && crdate !== "" && crdate !== null) {
      sql += ` AND TRUNC(fpt_crt_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }
    sql += ` GROUP BY 
            fpt_id_pipe, fpt_no_cast, fpt_cd_loc, fpt_test_cd, fpt_test_para_result,
            fpt_inspec_nm, ftp_test_remark, TRUNC(fpt_crt_dt), fpt_test_para_rem
        UNION
        SELECT 
            fpt_id_pipe, fpt_no_cast, fpt_cd_loc, fpt_test_cd,
            fpt_test_para_result, fpt_inspec_nm, ftp_test_remark,
            TRUNC(fpt_crt_dt) AS ft_date, fpt_test_para_rem,
            SUM(CASE WHEN fpt_test_para = 'WIDTH_W' THEN fpt_test_para_val ELSE 0 END) AS width,
            SUM(CASE WHEN fpt_test_para = 'THICK_W' THEN fpt_test_para_val ELSE 0 END) AS thick,
            SUM(CASE WHEN fpt_test_para = 'AREA_W' THEN fpt_test_para_val ELSE 0 END) AS area,
            SUM(CASE WHEN fpt_test_para = 'MGL' THEN fpt_test_para_val ELSE 0 END) AS mgl,
            SUM(CASE WHEN fpt_test_para = 'YL' THEN fpt_test_para_val ELSE 0 END) AS yl,
            SUM(CASE WHEN fpt_test_para = 'YS_B' THEN fpt_test_para_val ELSE 0 END) AS ys,
            SUM(CASE WHEN fpt_test_para = 'UTL_W' THEN fpt_test_para_val ELSE 0 END) AS utl,
            SUM(CASE WHEN fpt_test_para = 'UTS_W' THEN fpt_test_para_val ELSE 0 END) AS uts,
            SUM(CASE WHEN fpt_test_para = 'FGL' THEN fpt_test_para_val ELSE 0 END) AS fgl,
            SUM(CASE WHEN fpt_test_para = 'EL' THEN fpt_test_para_val ELSE 0 END) AS el,
            SUM(CASE WHEN fpt_test_para = 'YS_UTS_B' THEN fpt_test_para_val ELSE 0 END) AS ys_uts
        FROM 
            v_fg_pipe_test_rslt
        WHERE 
            fpt_test_cd = 'TP' AND fpt_cd_loc = 'TWT'`;

    if (crdate && crdate !== "" && crdate !== null) {
      sql += ` AND TRUNC(fpt_crt_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    sql += ` GROUP BY 
            fpt_id_pipe, fpt_no_cast, fpt_cd_loc, fpt_test_cd, fpt_test_para_result,
            fpt_inspec_nm, ftp_test_remark, TRUNC(fpt_crt_dt), fpt_test_para_rem
    ) t2 ON t2.fpt_id_pipe = t1.lom_id_batch
WHERE 
   LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` order by CD_EPA,BATCH_ID,CD_LOC  `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getmechanicaldata", sql);
    // console.error("binds", binds);
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getmechanicaldataWTWT = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    //     let binds = {
    //   plant: plant,
    //   orderNo: orderNo,
    //   item: item,
    //   matno: matno,
    //   // crdate: crdate,
    //   heatno: heatno,
    //   pipeno: pipeno,
    //   // rmno: rmno,
    // };

    console.log("getmechanicaldataWTWT");

    var sql = ` SELECT 
    LOM_CD_EPA AS CD_EPA,
    t1.LOM_MILL_NO AS mill_no,
        T.TPS_SD_REF_NO AS mark_cust_name,
        t3.enc_id_order AS order_id,
        t3.enc_no_item AS item_no,
        t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
        t.tps_sd_spec_grd AS spec,
        t3.enc_mk_spec_complete AS spec_complete,
        t3.enc_cd_grade AS grade,
        'MTRP' || '/' || TO_CHAR(t2.ft_date, 'YYYYMMDD') || '/1' AS rep_no,
        to_char(t2.ft_date,'dd.mm.yyyy') AS crt_dt,
        t.tps_gd_qap_no AS gd_qap_no,
        t.tps_sd_proc_sheet AS proc_sheet,
        t.tps_id_tenproc AS ID_TENPROC,
        t1.lom_cd_epa AS epa_code,
        t.tps_order_id AS order_id,
        t.tps_sd_cust_cd AS customer_code,
        t3.enc_mark_cust AS mark_cust,
        t2.fpt_no_cast AS cast_no,
        t1.lom_no_cast AS lom_cast_no,
        t.tps_ld_ys_min AS YIELD_STRENGTH_MIN,
        t.tps_ld_ys_max AS YIELD_STRENGTH_MAX,
        t.tps_ld_uts_min AS TENS_STRENGTH_BASE_MIN,
        t.tps_ld_uts_max AS TENS_STRENGTH_BASE_MAX,
        t.tps_ld_weld_uts_min AS TENS_STRENGTH_WELD_MIN,
        t.tps_ld_weld_uts_max AS TENS_STRENGTH_WELD_MAX,
        tps_ld_ys_uts AS YS_UTS_RATIO,
        tps_ld_el AS ELONGATION,
        t1.lom_id_batch AS batch_id,
        t1.lom_cd_status AS status_code,
        t1.lom_mill_no AS mill_no,
        t1.lom_no_matnr AS lom_matnr_no,
        t3.enc_no_matnr AS enc_matnr_no,
        t2.fpt_id_pipe AS pipe_id,
        t2.fpt_no_cast AS fpt_cast_no,
        t2.fpt_cd_loc AS CD_LOC,
        t2.fpt_test_cd AS test_code,
        t2.fpt_test_para_result AS test_result,
        t2.fpt_inspec_nm AS TESTED_BY,
        t2.ftp_test_remark AS test_remark,
        t2.ft_date AS test_date,
        t2.fpt_test_para_rem AS BROKEN_LOC,
        t2.width AS width,
        t2.thick AS thick,
        t2.area AS area,
        t2.mgl AS mgl,
        t2.yl AS yl,
        t2.ys as YS,
        t2.utl AS utl,
        t2.uts AS uts,
        t2.fgl AS fgl,
        t2.el AS el,
        t2.ys_uts AS ys_uts
    FROM 
        v_process_sheet t,
        v_ldp_prodn t1,
        v_end_cust_ord_epa t3,
        (
            SELECT 
                fpt_id_pipe, 
                fpt_no_cast, 
                fpt_cd_loc, 
                fpt_test_cd,
                fpt_test_para_result, 
                fpt_inspec_nm, 
                ftp_test_remark,
                TRUNC(fpt_crt_dt) AS ft_date, 
                fpt_test_para_rem,
                SUM(CASE WHEN fpt_test_para = 'WIDTH_B' THEN fpt_test_para_val ELSE 0 END) AS width,
                SUM(CASE WHEN fpt_test_para = 'THICK_B' THEN fpt_test_para_val ELSE 0 END) AS thick,
                SUM(CASE WHEN fpt_test_para = 'AREA_B' THEN fpt_test_para_val ELSE 0 END) AS area,
                SUM(CASE WHEN fpt_test_para = 'MGL' THEN fpt_test_para_val ELSE 0 END) AS mgl,
                SUM(CASE WHEN fpt_test_para = 'YL' THEN fpt_test_para_val ELSE 0 END) AS yl,
                SUM(CASE WHEN fpt_test_para = 'YS_B' THEN fpt_test_para_val ELSE 0 END) AS ys,
                SUM(CASE WHEN fpt_test_para = 'UTL_B' THEN fpt_test_para_val ELSE 0 END) AS utl,
                SUM(CASE WHEN fpt_test_para = 'UTS_B' THEN fpt_test_para_val ELSE 0 END) AS uts,
                SUM(CASE WHEN fpt_test_para = 'FGL' THEN fpt_test_para_val ELSE 0 END) AS fgl,
                SUM(CASE WHEN fpt_test_para = 'EL' THEN fpt_test_para_val ELSE 0 END) AS el,
                SUM(CASE WHEN fpt_test_para = 'YS_UTS_B' THEN fpt_test_para_val ELSE 0 END) AS ys_uts
            FROM 
                V_fg_pipe_test_rslt
            WHERE 
                fpt_test_cd = 'TP'
                AND fpt_cd_loc <> 'TWT' `;

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(fpt_crt_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
      // sql += `AND TRUNC(fpt_crt_dt) = '31-jul-2025' `;
    }

    sql += ` GROUP BY 
                fpt_id_pipe,
                fpt_no_cast,
                fpt_cd_loc,
                fpt_test_cd,
                fpt_test_para_result,
                fpt_inspec_nm,
                ftp_test_remark,
                TRUNC(fpt_crt_dt),
                fpt_test_para_rem,
                fpt_test_para_result,
                ftp_test_remark
            ORDER BY 
                fpt_id_pipe
        ) t2
    WHERE 
        t.tps_order_id = t1.lom_id_order_cus
        AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus
        AND t2.fpt_id_pipe = t1.lom_id_batch
        AND t.tps_order_id = t3.enc_id_order
        AND to_number(t.tps_order_item) = t3.enc_no_item 
        AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t1.lom_id_batch = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` order by CD_EPA,BATCH_ID,CD_LOC `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getmechanicaldataWTWT", sql);
    // console.error("binds", binds);
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMGERdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    // shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `select t1.lom_CD_EPA AS CD_EPA,
    t.tps_order_id  AS order_id,
    t.tps_sd_proc_sheet AS PROC_SHEET,
    T.TPS_SD_QAP_NO AS SD_QAP_NO,
    t.TPS_GD_QAP_NO AS GD_QAP_NO,
    t.tps_sd_cust_cd AS sd_cust_cd,
    T3.ENC_MARK_CUST AS MARK_CUST,
    T.TPS_SD_REF_NO AS MARK_CUST_NAME,
    t.TPS_ID_METPROC AS ID_TENPROC,
    t.tps_sd_spec_grd AS spec_grd,
    T3.ENC_CD_GRADE AS CD_GRADE,
    T2.FPT_NO_CAST AS NO_CAST,
    T1.LOM_NO_CAST AS LOM_NO_CAST,
    T.TPS_LD_ASTM_NO AS MEAN_GRAIN_SIZE,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    T1.LOM_MILL_NO AS MILL_NO,
    T2.FPT_CD_LOC AS CD_LOC,
    T2.FPT_TEST_CD AS TEST_CD,
    T2.FPT_TEST_PARA AS TEST_PARA,
    'SATISFACTORY' MACRO_FIELD,
    'NO UNTEMPERED MARTENSITE REMAINS & UNIFORM DISTRIBUTION OF FERRITE & PEARLITE STRUCTURE HAS BEEN ESTABLISHED. AND FUSION LINE IS CLEARLY VISIBLE' REMARKS_FIELD,
    ROUND(T2.FPT_TEST_PARA_VAL,1) TEST_PARA_VAL ,
    T2.FPT_TEST_PARA_RESULT AS TEST_PARA_RESULT,
    to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    'MERP'||'/'||TO_CHAR(T2.FPT_CRT_DT,'YYYYMMDD')||'/1' AS REP_NO,
    T.TPS_ID_IMPPROC ID_IMPPROC,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' pipe_size,
     t2.FPT_INSPEC_NM AS INSPEC_NM
    from v_process_sheet t,v_ldp_prodn t1,v_fg_pipe_test_rslt t2,v_END_CUST_ORD_EPA T3
    where T.TPS_ORDER_ID=t1.lom_id_order_cus
    AND to_number(t.tps_order_item)=t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE=T1.LOM_ID_BATCH
    AND t2.fpt_test_cd='HT'
    AND T2.FPT_TEST_PARA IN  ('GRN_SIZE')
    AND T.TPS_ORDER_ID=T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
    --filter condn.
    --and t1.lom_no_cast in('A288957', 'A288947', 'A288990')
    --and trunc(T2.FPT_CRT_DT) = '25-jun-2025' --and '30-jun-2025'
    --and T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    --AND T1.LOM_NO_MATNR in( '000000000145000132', '000000000145000190')
    --AND t.tps_order_id   ='9518617784' 
    --and TO_NUMBER(t.tps_order_item) = 2
    and LOM_CD_EPA =  ${plant}
 `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.FPT_CRT_DT) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by ID_BATCH `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("MGER", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMGNdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
    inspector : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
        T.TPS_SD_REF_NO AS MARK_CUST_NAME,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS Pipe_Size,
        t3.ENC_MK_SPEC_COMPLETE AS Spec_Complete,
        T3.ENC_CD_GRADE AS Grade,
        'MPI-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t2.tbp_shift || ')' AS REP_NO,
        T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS Date_Shift,
        t.TPS_GD_QAP_NO AS QAP_No,
        t.tps_sd_proc_sheet AS Proc_Sheet,
        t.TPS_ID_MPIPROC AS Proc_No,
        t.tps_sd_cust_cd AS Cust_Code,
        T3.ENC_MARK_CUST AS Mark_Cust,
        t.tps_sd_spec_grd AS Spec_Grade,
        t.TPS_GD_TECHNIQUE AS Technique,
        t.TPS_GD_CUSED AS Current_Use,
        t.TPS_GD_BATHCONC AS Bath_Conc,
        t.TPS_GD_MEDIUM AS Medium,
        t.TPS_GD_RESIDUAL_MAGNTSM AS Residual_Magnetism,
        t1.lom_id_batch AS Batch_ID,
        t1.lom_cd_status AS LOM_Status,
        t2.Tbp_Cd_Status AS TBP_Status,
        T1.LOM_MILL_NO AS Mill_No,
        T3.ENC_GEOMETRY AS Geometry,
        T1.LOM_NO_CAST AS No_Cast,
        T1.LOM_ID_FIRST_PAR AS First_Par,
        t2.tbp_batch_no AS Batch_No,
        t2.tbp_result AS Result,
        t2.tbp_remark AS Remark,
        t2.tbp_obsv_f_end_40 AS Obs_F_End_40,
        t2.tbp_obsv_t_end_40 AS Obs_T_End_40,
        t2.tbp_res_mg_f_end_40 AS Res_Mg_F_End_40,
        t2.tbp_res_mg_t_end_40 AS Res_Mg_T_End_40,
        t2.TBP_INSP_NAME AS TESTED_BY
    FROM 
        v_process_sheet t,
        v_ldp_prodn t1,
        v_bare_pdo t2,
        v_END_CUST_ORD_EPA T3
    WHERE 
        --t.tps_order_id = T2.TBP_ID_ORDER_NO
        --AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
        T.TPS_ORDER_ID = t1.lom_id_order_cus
        AND to_number(t.tps_order_item)  = t1.lom_id_ord_item_cus
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND t2.Tbp_Cd_PROC = '4'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
        -- FILTER CONDITIONS
        --AND T2.TBP_PROD_DATE = '02-JUL-2025'
        --AND t2.tbp_shift = 'A'
        --AND t.tps_order_id = '9518714294'
        --AND TO_NUMBER(t.tps_order_item) = 3
        AND LOM_CD_EPA =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (inspector && inspector !== "" && inspector !== null) {
      sql += ` AND tbp_insp_name = '${inspector}'  `;
      // binds["inspector"] = inspector;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    // if (pipeno && pipeno !== '' && pipeno !== null) {
    //   sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `;  // changed BETWEEN to =
    //   // binds["pipeno"] = pipeno;
    // }

    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  MGN", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY MGN", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `  order by BATCH_ID `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getMGNdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHYSdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    lom_CD_EPA CD_EPA,
    T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS CRT_DT_FORMAT,
    t.TPS_ID_HYDRPROC AS Proc_No,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_GD_QAP_NO AS qap_no,
    t.tps_sd_cust_cd AS cust_code,
    T3.ENC_MARK_CUST AS mark_cust,
    T.TPS_SD_REF_NO AS mark_cust_name,
    t.tps_sd_spec_grd AS spec_grade,
    t.Tps_Md_Hydro_Press_Test AS hydro_press_test,
    t.TPS_MD_HOLD_TIME AS hold_time,
    t.tps_order_id AS order_id,
    t.tps_order_item AS order_item,
    'HTR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t2.tbp_shift || ')' AS repo_no,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    t2.Tbp_Cd_Status AS bp_cd_status,
    T1.LOM_MILL_NO AS mill_no,
    T3.ENC_GEOMETRY AS geometry,
    T3.ENC_CD_GRADE AS cd_grade,
    T1.LOM_NO_CAST AS no_cast,
    T1.LOM_ID_FIRST_PAR AS id_first_par,
    T2.TBP_PROD_DATE AS prod_date,
    t2.tbp_shift AS shift,
    t2.tbp_batch_no AS batch_no,
    t2.tbp_result AS result,
    t2.tbp_remark AS remark,
    t2.tbp_gauge_id_30 || ',' || T2.TBP_GAUGE_ID_1_30 AS pres_gauge_id,
    t2.tbp_gauge_range_30 AS gauge_range,
    --t2.tbp_calib_date_30 AS calib_date_30,
    --t2.TBP_CALIB_DUE_DT_30  AS calib_date_DUE,
    to_char(T2.tbp_calib_date_30,'dd.mm.yyyy') AS calib_date_30,
    to_char(T2.TBP_CALIB_DUE_DT_30 ,'dd.mm.yyyy') AS calib_date_DUE,
    t2.TBP_INSP_NAME AS TESTED_BY,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_bare_pdo t2,
    v_END_CUST_ORD_EPA T3
WHERE 
    --t.tps_order_id = T2.TBP_ID_ORDER_NO
    --AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item)  = t1.lom_id_ord_item_cus
    AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
    AND t2.Tbp_Cd_PROC = '3'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
         and T2.TBP_BATCH_PROC_NO = ( SELECT MAX(TBP_BATCH_PROC_NO) FROM v_bare_pdo t1
        where T2.tbp_batch_no = t1.tbp_batch_no
        and T1.TBP_CD_PROC = '3')
    -- FILTER COND.
    --AND T2.TBP_PROD_DATE = '03-JUL-2025'
    --AND t2.tbp_shift = 'B'
    --AND t.tps_order_id = '9518830960'
    --AND TO_NUMBER(t.tps_order_item) = 2
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    // if (pipeno && pipeno !== '' && pipeno !== null) {
    //   sql += ` AND t2.FPT_ID_PIPE IN ('${pipeno}') `;  // changed BETWEEN to =
    //   // binds["pipeno"] = pipeno;
    // }

    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  HYS", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY HYS", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `  order by ID_BATCH `;


    console.error("getHYSdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getVdidata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
      LOM_CD_EPA AS CD_EPA,
      t.tbp_plant_cd AS CD_EPA,
      t.tbp_id_order_no AS order_NO,
      t.tbp_item_no AS item_nO,
      T3.ENC_MARK_CUST AS MARK_CUST,
      --T.TPS_SD_REF_NO AS MARK_CUST_NAME,
      T3.ENC_MARK_CUST_NAME,
      t1.lom_mill_no AS mill_no,
      t.tbp_batch_no AS ID_BATCH,
      t.tbp_dia_body_10 AS BODY_DIA,
      t.tbp_dia_end_10 AS END_DIA,
      t.tbp_out_round_body_10 AS BODY_OUT_ROUND,
      t.tbp_out_round_end_10 AS END_OUT_ROUND,
      t.tbp_wall_thk_body_10 AS BODY_WALL_THICKNESS,
      t.tbp_wall_thk_end_10 AS END_WALL_THICKNESS,
      t.tbp_prod_date AS prod_dT,
      t.tbp_shift AS shift,
      t.TBP_INSP_NAME AS TESTED_BY,
      'VDIR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t.tbp_shift || ')' AS REPO_NO  
  FROM 
      v_bare_pdo t
  JOIN 
      v_END_CUST_ORD_EPA T3 ON t.tbp_id_order_no = T3.enc_id_order AND t.tbp_item_no = T3.enc_no_item
  JOIN 
      v_ldp_prodn t1 ON t.tbp_batch_no = t1.lom_id_batch
  WHERE 
      t.tbp_cd_proc = '8'
      --AND t.tbp_prod_date = '03-jul-2025'
      --AND tbp_shift = 'B'
      --AND t.tbp_id_order_no = '9518830960'
      --AND TO_NUMBER(t.tbp_item_no) = 2
      AND LOM_CD_EPA =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += `AND  t.tbp_id_order_no = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND tbp_item_no = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    
    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t1.LOM_ID_BATCH = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by ID_BATCH `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("MGER", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getVdirdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_GD_QAP_NO AS qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
    t.tps_sd_spec_grd AS spec_grade,
    T3.ENC_CD_GRADE AS cd_grade,
    T1.LOM_NO_CAST AS lom_no_cast,
    t2.tbp_batch_no AS ID_BATCH,
    t.TPS_MD_DIA_MTR_BODY_MIN AS dia_mtr_body_min,
    t.TPS_MD_DIA_MTR_BODY_MAX AS dia_mtr_body_max,
    T.TPS_MD_DIA_MTR_END_MIN AS DIA_MTR_END_MIN,
    t.TPS_MD_DIA_MTR_END_MAX AS DIA_MTR_END_MAX,
    T.TPS_MD_OUT_OF_ROUNDNESS AS oor_body_max,
    T.TPS_MD_OOREND AS oor_end_max,
    t.TPS_MD_WALL_THK_MIN AS wall_thk_min,
    t.TPS_MD_WALL_THK_MAX AS wall_thk_max,
    t.TPS_MD_DIM_BEVEL_AG_MIN AS dim_bevel_ag_min,
    t.TPS_MD_DIM_BEVEL_AG_MAX AS dim_bevel_ag_max,
    t.TPS_MD_ROUT_FACE_MIN AS rout_face_min,
    t.TPS_MD_ROUT_FACE_MAX AS rout_face_max,
    T.TPS_MD_SQOC_MN AS sqoc_min,
    T.TPS_MD_SQOC_MX AS sqoc_max,
    T.TPS_MD_STRAIGHTNESS_FUL AS straightness_ful,
    T.TPS_MD_STRAIGHTNESS_END AS straightness_end,
    T.TPS_MD_IDBEED AS ib_height,
    T.TPS_MD_IDBEED_DEPTH AS ib_depth,
    T.TPS_MD_ECN AS ecn,
    T.TPS_MD_PIPE_LEN_MIN AS pipe_len_min,
    T.TPS_MD_PIPE_LEN_MAX AS pipe_len_max,
    t.TPS_MD_WEIGHT_MIN AS MD_WEIGHT_MIN,
t.TPS_MD_WEIGHT_MAX AS MD_WEIGHT_MAX,
    t2.tbp_plant_cd AS plant_cd,
    t1.lom_mill_no AS mill_no,
    t2.tbp_id_order_no AS order_no,
    t2.tbp_item_no AS item_no,
    T3.ENC_MARK_CUST AS mark_cust,
    T.TPS_SD_REF_NO AS mark_cust_name,
    t2.tbp_dia_body_10 AS dia_body_10,
    t2.tbp_dia_end_10 AS dia_end_10,
    t2.tbp_out_round_body_10 AS out_round_body_10,
    t2.tbp_out_round_end_10 AS out_round_end_10,
    t2.tbp_wall_thk_body_10 AS wall_thk_body_10,
    t2.tbp_wall_thk_end_10 AS wall_thk_end_10,
    T2.TBP_B_ANGL_F_END_80 AS b_angl_f_end_80,
    T2.TBP_B_ANGL_T_END_80 AS b_angl_t_end_80,
    T2.TBP_ROOTFACE_F_END_80 AS rootface_f_end_80,
    T2.TBP_ROOTFACE_T_END_80 AS rootface_t_end_80,
    t.TPS_MD_SQUARNESS AS SQUARNESS,
    T2.TBP_PIPE_LNG_10/1000 AS pipe_lng_10,  
    --t2.tbp_weight AS weight,
    t2.tbp_weight/(T2.TBP_PIPE_LNG_10/1000) AS weight,
    t2.tbp_asl_no_80 AS asl_no_80,
    T2.TBP_REMARK AS remark,
     to_char(T2.TBP_PROD_DATE,'dd.mm.yyyy')||' / '||t2.tbp_shift AS CRT_DT_FORMAT,
    t2.tbp_shift AS shift,
    T.TPS_ID_VDIPROC PROCEDURE_NO,
    'VDIR-'||T1.LOM_MILL_NO||'/'||TO_CHAR(T2.TBP_PROD_DATE,'YYYYMMDD')||'('||t2.tbp_shift||')' REP_NO,
    T.TPS_ID_MM_0_25 AS TPS_ID_MM_0_25,
    T.TPS_ID_OD_MM AS TPS_ID_OD_MM,
    T.TPS_ID_MESR_TAPE AS TPS_ID_MESR_TAPE,
    T.TPS_ID_PIPE_TAPE1 AS TPS_ID_PIPE_TAPE1,
    t.TPS_ID_D_METR AS TPS_ID_D_METR,
    t.TPS_ID_VER_CALLIPR1 AS TPS_ID_VER_CALLIPR1,
    t.TPS_ID_STL_SCALE AS TPS_ID_STL_SCALE,
    t.TPS_ID_Fill_G_2 AS TPS_ID_Fill_G_2,
    t.TPS_ID_ANG_PROTC AS TPS_ID_ANG_PROTC,
    t.TPS_ID_ROOT_FC_G AS TPS_ID_ROOT_FC_G,
    t2.tbp_strghtnes_t_end_10 AS ST_END,
    t2.tbp_strghtnes_f_end_80 AS ST_BODY,
    t2.tbp_squ_f_end_80 AS SQ_F,
    t2.tbp_squ_t_end_80 AS SQ_T,
    t2.tbp_id_flash_10 AS idf,
    t2.tbp_ecn_percen_80 AS ECN,
    t2.TBP_RADIAL_OFF_80 AS RADICAL,
    t.TPS_ID_RGHT_ANG AS TPS_ID_RGHT_ANG,
    t2.TBP_INSP_NAME AS TESTED_BY,
    DECODE(T1.LOM_MILL_NO, 1, '13575/1', 'N45184/1') AS WGH_MC_ID
    from v_bare_pdo t2,v_END_CUST_ORD_EPA T3,v_ldp_prodn t1,v_process_sheet t
    where t2.tbp_cd_proc='8'
    --and t2.tbp_id_order_no=t3.enc_id_order
    --and t2.tbp_item_no = t3.enc_no_item
    and T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND to_number(t.tps_order_item) = t1.lom_id_ord_item_cus 
    AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND to_number(t.tps_order_item) = T3.ENC_NO_ITEM
    AND T3.ENC_GEOMETRY='O'
    --Filter Condn.
    --AND T2.TBP_PROD_DATE = '03-JUL-2025'
    --AND T2.TBP_SHIFT = 'B'
    --AND t.tps_order_id    = '9518830960'
    --and TO_NUMBER(t.tps_order_item) = 2
    AND LOM_CD_EPA =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  auto", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY auto", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `  order by to_number(nvl(t2.tbp_asl_no_80,0)),t2.tbp_batch_no `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("MGER", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getVdirSdata = async (
  plant: any,
  orderNo: any,
  item: any,
     matno: any,
    shift : any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
    t2.TBP_INSP_NAME AS TESTED_BY,
        t.tps_sd_proc_sheet AS proc_sheet,
        t.TPS_GD_QAP_NO AS qap_no,
        t.tps_sd_cust_cd AS cust_cd,
        t3.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm WT' AS pipe_size,
        t.tps_sd_spec_grd AS spec_grade,
        t3.ENC_CD_GRADE AS grade,
        t1.LOM_NO_CAST AS heat_no,
        t.TPS_MD_DEPTH_MN AS depth_min,
        t.TPS_MD_DEPTH_MX AS depth_max,
        t.TPS_MD_WIDTH_MN AS width_min,
        t.TPS_MD_WIDTH_MX AS width_max,
        t.TPS_MD_WALL_THK_MIN AS wall_thk_min,
        t.TPS_MD_WALL_THK_MAX AS wall_thk_max,
        t.TPS_MD_ROE AS roc_MIN,
        t.TPS_MD_ROC AS roc_MAX,
        t.TPS_MD_TWIST AS twist,
        t.TPS_MD_STRAIGHTNESS_FUL AS straightness,
        t.TPS_MD_CONVEX AS convex,
        t.TPS_MD_CONCAV AS concav,
        t.TPS_MD_IDBEED AS ib_height,
        t.TPS_MD_IDBEED_DEPTH AS ib_depth,
        t.TPS_MD_SQOC_MN AS sqoc_min,
        t.TPS_MD_SQOC_MX AS sqoc_max,
        t.TPS_MD_PIPE_LEN_MIN AS pipe_len_min,
        t.TPS_MD_PIPE_LEN_MAX AS pipe_len_max,
        t.TPS_MD_WEIGHT_MIN AS weight_min,
        t.TPS_MD_WEIGHT_MAX AS weight_max,
        t.TPS_ID_VDIPROC AS procedure_no,
        t.TPS_ID_MM_0_25 AS id_mm_0_25,
        t.TPS_ID_OD_MM AS id_od_mm,
        t.TPS_ID_MESR_TAPE AS mesr_tape,
        t.TPS_ID_PIPE_TAPE1 AS pipe_tape1,
        t.TPS_ID_D_METR AS d_metr,
        t.TPS_ID_VER_CALLIPR1 AS ver_callipr1,
        t.TPS_ID_STL_SCALE AS stl_scale,
        t.TPS_ID_Fill_G_2 AS fill_g_2,
        t.TPS_ID_ANG_PROTC AS ang_protc,
        t.TPS_ID_ROOT_FC_G AS root_fc_g,
        t.TPS_ID_RGHT_ANG AS rght_ang,
        DECODE(t1.LOM_MILL_NO, 1, '13575/1', 'N45184/1') AS weighing_mc_id,
        t2.tbp_plant_cd AS plant_cd,
        t1.lom_mill_no AS mill_no,
        t2.tbp_id_order_no AS order_no,
        t2.tbp_item_no AS item_no,
        t3.ENC_MARK_CUST AS mark_cust,
        T.TPS_SD_REF_NO AS mark_cust_name,
        t2.tbp_batch_no AS ID_batch,
        t2.TBP_DEPTH_MIN_80 AS depth_min_80,
        t2.TBP_DEPTH_MAX_80 AS depth_max_80,
        t2.tbp_wid_min_80 AS wid_min_80,
        t2.tbp_wid_max_80 AS wid_max_80,
        t2.tbp_wall_thk_body_10 AS wall_thk_body_10,
        t2.tbp_wall_thk_end_10 AS wall_thk_end_10,
        t2.tbp_roc_10 AS roc_10,
        t2.TBP_STRGHTNES_F_END_80 AS STRGHTNES_F_END,
        t2.tbp_twist_10 AS twist_10,
        t2.tbp_convx_10 AS convx_10,
        t2.tbp_concv_10 AS concv_10,
        t2.tbp_id_flash_10 AS id_flash_10,
        t2.tbp_sqoc_10 AS sqoc_10,
        t2.TBP_PIPE_LNG_10/1000 AS pipe_lng_10,
        t2.tbp_weight/( t2.TBP_PIPE_LNG_10/1000) AS weight,
        t2.tbp_remark AS remark,
        t2.TBP_PROD_DATE || ' / ' || t2.TBP_SHIFT AS CRT_DT,
        t2.tbp_strghtnes_f_end_80 AS st_body,
        t2.tbp_visual_insp_80 AS visual_insp_80,
        'VDIR-' || t1.LOM_MILL_NO || '/' || TO_CHAR(t2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t2.tbp_shift || ')' AS rep_no
    FROM 
        v_bare_pdo t2,
        v_END_CUST_ORD_EPA t3,
        v_ldp_prodn t1,
        v_process_sheet t
    WHERE 
        t2.tbp_cd_proc = '8'
        --AND t2.tbp_id_order_no = t3.enc_id_order
        --AND t2.tbp_item_no = t3.enc_no_item
        and T.TPS_ORDER_ID = t1.lom_id_order_cus
        AND to_number(T.TPS_ORDER_ITEM)= t1.lom_id_ord_item_cus
        AND t2.TBP_BATCH_NO = t1.LOM_ID_BATCH
        AND t.TPS_ORDER_ID = t3.ENC_ID_ORDER
        AND to_number(t.TPS_ORDER_ITEM) = t3.ENC_NO_ITEM
        AND t3.ENC_GEOMETRY IN ('S', 'R')
        --AND t3.ENC_GEOMETRY IN ('S', 'R','O')
        --AND t2.TBP_PROD_DATE = '03-JUL-2025'
        --AND t2.TBP_SHIFT = 'B'
        --AND t.tps_order_id = '9518830960'
        --AND TO_NUMBER(t.tps_order_item) = 2
        AND LOM_CD_EPA =  ${plant}   `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR LIKE ('%${matno}%')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (shift && shift !== "" && shift !== null) {
      sql += ` AND tbp_shift = '${shift}'  `;
      // binds["shift"] = shift;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && Array.isArray(pipeno) && pipeno.length > 0) {
      // Format the array into a comma-separated string of quoted values
      console.log("QUERYpipeno  auto", pipeno);
      const formattedPipeNos = pipeno.map((p) => `'${p}'`).join(",");
      console.log("QUERY auto", formattedPipeNos);
      sql += ` AND LOM_ID_BATCH IN (${formattedPipeNos}) `;
    }

    sql += `  order by to_number(nvl(t2.tbp_asl_no_80,0)),t2.tbp_batch_no `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("MGER", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
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
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetreportTyp = async (plant: any) => {
  try {
    const sql = `SELECT 
    CD_VALUE,CD_DESC
    FROM V_CODES
   WHERE  CD_TYPE = 'TB047'  
   AND CD_DESC1 = :plant
order by
TO_NUMBER(REGEXP_SUBSTR(CD_VALUE, '[0-9]+'))`;
    let binds = [`${plant}`];
    console.log("------ooo>", sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPipenomill = async (plant: any) => {
  try {
    const sql = `SELECT 
    DISTINCT TBP_ID_FIRST_PAR
    FROM V_bare_pdo
    WHERE TBP_PLANT_CD = :plant
    and  Tbp_Cd_PROC   = '1' `;
    let binds = [`${plant}`];
    console.log("------GetPipeno>", sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSlitnomill = async (plant: any,
  crdate: any,
  item: any,
  orderNo: any,
  roundsectionmill: any,
  rm: any) => {
  try {
    let sql = "";

    if (roundsectionmill === "1") {
      sql = `SELECT DISTINCT t2.lom_id_par_coil_no
              FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '1'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND T.tbp_id_order_no = T1.ENC_ID_ORDER
                AND t.tbp_item_no = T1.ENC_NO_ITEM
                AND T1.ENC_GEOMETRY = 'O' 
                AND T2.LOM_ID_FIRST_PAR = '${rm}'
                AND LOM_CD_EPA = '${plant}'
                order by LOM_ID_FIRST_PAR `;
    } else if (roundsectionmill === "2") {
      sql = `SELECT DISTINCT t2.lom_id_par_coil_no
              FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '1'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND T.tbp_id_order_no = T1.ENC_ID_ORDER
                AND t.tbp_item_no = T1.ENC_NO_ITEM
                AND T1.ENC_GEOMETRY IN ('S', 'R')
                AND T2.LOM_ID_FIRST_PAR = '${rm}'
                AND LOM_CD_EPA = '${plant}'
                order by LOM_ID_FIRST_PAR `;
    }

    console.log("------GetPipenomillround>", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error)
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPipenomillround = async (
  plant: any,
  crdate: any,
  item: any,
  orderNo: any,
  roundsectionmill: any
) => {
  try {
    let sql = "";

    if (roundsectionmill === "1") {
      sql = `SELECT DISTINCT T2.LOM_ID_FIRST_PAR
              FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '1'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND T.tbp_id_order_no = T1.ENC_ID_ORDER
                AND t.tbp_item_no = T1.ENC_NO_ITEM
                AND T1.ENC_GEOMETRY = 'O' 
                AND LOM_CD_EPA = '${plant}'
                order by LOM_ID_FIRST_PAR `;
    } else if (roundsectionmill === "2") {
      sql = `SELECT DISTINCT T2.LOM_ID_FIRST_PAR
              FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '1'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND T.tbp_id_order_no = T1.ENC_ID_ORDER
                AND t.tbp_item_no = T1.ENC_NO_ITEM
                AND T1.ENC_GEOMETRY IN ('S', 'R')
                AND LOM_CD_EPA = '${plant}'
                order by LOM_ID_FIRST_PAR `;
    }

    console.log("------GetPipenomillround>", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPipenomulti = async (
  plant: any,
  crdate: any,
  item: any,
  orderNo: any,
  roundsectionmill: any
) => {
  try {
    let sql = "";

    if (roundsectionmill === "4") {
      sql = `SELECT DISTINCT T2.LOM_ID_BATCH
              FROM V_bare_pdo t, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '4'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND LOM_CD_EPA = '${plant}'
                order by LOM_ID_BATCH `;
    } else if (roundsectionmill === "5") {
      sql = `SELECT DISTINCT T2.LOM_ID_BATCH
      FROM V_bare_pdo t, V_LDP_PRODN T2
      WHERE 
        T.TBP_PROD_DATE = '${crdate}'
        AND t.tbp_id_order_no = '${orderNo}'
        AND t.tbp_item_no = '${item}'
        AND t.Tbp_Cd_PROC = '5'
        AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
        AND LOM_CD_EPA = '${plant}'
        order by LOM_ID_BATCH`;
    } else if (roundsectionmill === "3") {
      sql = `SELECT DISTINCT T.TBP_BATCH_NO
              FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
              WHERE 
                T.TBP_PROD_DATE = '${crdate}'
                AND t.tbp_id_order_no = '${orderNo}'
                AND t.tbp_item_no = '${item}'
                AND t.Tbp_Cd_PROC = '3'
                AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
                AND T.tbp_id_order_no = T1.ENC_ID_ORDER
                AND t.tbp_item_no = T1.ENC_NO_ITEM
                AND LOM_CD_EPA = '${plant}'
                order by TBP_BATCH_NO`;
    } else if (roundsectionmill === "6") {
      sql = `SELECT DISTINCT T2.LOM_ID_BATCH
    FROM V_bare_pdo t, V_LDP_PRODN T2
    WHERE 
      T.TBP_PROD_DATE = '${crdate}'
      AND t.tbp_id_order_no = '${orderNo}'
      AND t.tbp_item_no = '${item}'
      AND t.Tbp_Cd_PROC = '6'
      AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
      AND LOM_CD_EPA = '${plant}'
      order by LOM_ID_BATCH `;
    } else if (roundsectionmill === "7") {
      sql = `SELECT DISTINCT T2.LOM_ID_BATCH
    FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
    WHERE 
      T.TBP_PROD_DATE = '${crdate}'
      AND t.tbp_id_order_no = '${orderNo}'
      AND t.tbp_item_no = '${item}'
      AND t.Tbp_Cd_PROC = '8'
      AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
      AND T.tbp_id_order_no = T1.ENC_ID_ORDER
      AND t.tbp_item_no = T1.ENC_NO_ITEM
      AND T1.ENC_GEOMETRY = 'O' 
      AND LOM_CD_EPA = '${plant}' 
      order by LOM_ID_BATCH `;
    } else if (roundsectionmill === "8") {
      sql = `SELECT DISTINCT T2.LOM_ID_BATCH
    FROM V_bare_pdo t, v_END_CUST_ORD_EPA T1, V_LDP_PRODN T2
    WHERE 
      T.TBP_PROD_DATE = '${crdate}'
      AND t.tbp_id_order_no = '${orderNo}'
      AND t.tbp_item_no = '${item}'
      AND t.Tbp_Cd_PROC = '8'
      AND T.TBP_BATCH_NO = T2.LOM_ID_BATCH
      AND T.tbp_id_order_no = T1.ENC_ID_ORDER
      AND t.tbp_item_no = T1.ENC_NO_ITEM
      AND t1.ENC_GEOMETRY IN ('S', 'R')
      AND LOM_CD_EPA = '${plant}' 
      order by LOM_ID_BATCH `;
    }

    console.log("------GetPipenomillround>", sql);
    return await query.executeQuery(sql);
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

// CHanges for production movement
