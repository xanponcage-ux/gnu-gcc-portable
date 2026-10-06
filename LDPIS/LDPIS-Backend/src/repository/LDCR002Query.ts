import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getchemdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
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
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
    T2.FPT_TEST_PARA AS test_para,
    T2.FTP_TEST_REMARK TEST_REMARK,
    --ROWnum-1,
    T2.FPT_TEST_PARA_VAL AS test_para_val,
    T2.FPT_TEST_PARA_RESULT AS test_para_result,
    --T2.FPT_CRT_DT AS crt_dt,
    to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    t2.FPT_INSPEC_NM AS inspec_nm,
    'CARP' || '/' || TO_CHAR(T2.FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS pipe_size
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_fg_pipe_test_rslt t2,
    v_END_CUST_ORD_EPA T3
WHERE  
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND t.tps_order_item = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'CP'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    --AND TRUNC(T2.FPT_CRT_DT) = '25-jun-2025'
    --AND T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    --AND T1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    --AND t.tps_order_id = '9518617784'
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    sql += ` order by LOM_CD_EPA,ID_BATCH,TEST_PARA  `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("chem", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const gethardnessdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    t1.lom_CD_EPA AS cd_epa,
        T2.FPT_CRT_DT,
    T1.LOM_NO_MATNR ,
    t.TPS_ID_HARDN AS ID_MILLPROC,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
    T2.FPT_TEST_PARA AS test_para,
    ROUND(T2.FPT_TEST_PARA_VAL, 0) AS test_para_val,
    T2.FPT_TEST_PARA_RESULT AS test_para_result,
    TO_CHAR(T2.FPT_CRT_DT, 'DD.MM.YYYY') AS CRT_DT,
    t2.FPT_INSPEC_NM AS inspec_nm,
    t2.FPT_INSPEC_NM AS TESTED_BY,
    T2.FTP_TEST_REMARK TEST_REMARK,
    'HTRP' || '/' || TO_CHAR(T2.FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS pipe_size
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_fg_pipe_test_rslt t2,
    v_END_CUST_ORD_EPA T3
WHERE 
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND t.tps_order_item = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'HT'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('25C0092')
    --AND TRUNC(T2.FPT_CRT_DT) = '18-jul-2025'
    --AND T2.FPT_ID_PIPE BETWEEN 'P20000095' AND 'P20000095'
    --AND T1.LOM_NO_MATNR IN ('000000000111122781', '000000000111122781')
    --AND t.tps_order_id = '9518845146'
    --AND TO_NUMBER(t.tps_order_item) = 1
    AND LOM_CD_EPA  =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    sql += ` order by LOM_CD_EPA ,ID_BATCH,TEST_PARA `;

    console.error("hardness", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getautomaticweld = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA CD_EPA,
        T3.ENC_MARK_CUST_NAME AS MARK_CUST_NAME,
            T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS CRT_DT_FORMAT,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS Pipe_Size,
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
        t2.tbp_ut_remark_50 AS UT_Remark_50,
        t2.TBP_INSP_NAME AS INSP_NAME
    FROM 
        v_process_sheet t,
        v_ldp_prodn t1,
        v_bare_pdo t2,
        v_END_CUST_ORD_EPA T3
    WHERE 
        t.tps_order_id = T2.TBP_ID_ORDER_NO
        AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
        AND T.TPS_ORDER_ID = t1.lom_id_order_cus
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND t2.Tbp_Cd_PROC = '5'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
        -- FILTER COND.
        --AND T2.TBP_PROD_DATE = '02-JUL-2025'
        --AND t2.tbp_shift = 'A'
        --AND t.tps_order_id = '9518714294'
        --AND TO_NUMBER(t.tps_order_item) = 3
    AND LOM_CD_EPA  =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(T2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `      order by LOM_CD_EPA ,BATCH_ID,BATCH_NO `;

    console.error("getautomaticwel", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getautomaticweldbody = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
        T3.ENC_MARK_CUST_NAME AS MARK_CUST_NAME,
        T2.TBP_PROD_DATE || ' / ' || t2.tbp_shift AS CRT_DT_FORMAT,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        T3.ENC_SEC2_MAX || 'mm' || ' ' || 'X' || ' ' || T3.ENC_SEC1_MAX || 'mm' AS Pipe_Size,
        T3.ENC_MK_SPEC_COMPLETE AS Spec_Complete,
        T3.ENC_CD_GRADE AS Grade,
        'MPI-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.TBP_PROD_DATE, 'YYYYMMDD') || '(' || T2.TBP_SHIFT || ')' AS REP_NO,
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
        T.TPS_ORDER_ID = T2.TBP_ID_ORDER_NO
        AND TO_NUMBER(T.TPS_ORDER_ITEM) = T2.TBP_ITEM_NO
        AND T.TPS_ORDER_ID = T1.LOM_ID_ORDER_CUS
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND T2.TBP_CD_PROC = '6'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
        -- FILTER COND.
        --AND T2.TBP_PROD_DATE = '02-JUL-2025'
        --AND T2.TBP_SHIFT = 'A'
        --AND T.TPS_ORDER_ID = '9518714294'
        --AND TO_NUMBER(T.TPS_ORDER_ITEM) = 3    
    AND LOM_CD_EPA  =  ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tps_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(T2.TBP_PROD_DATE) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `      order by LOM_CD_EPA ,BATCH_ID,BATCH_NO `;

    console.error("getautomaticweldbody", sql);
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
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    T.TPS_ORDER_ID AS order_id,
    T.TPS_ID_FLTPROC||'/'||T.TPS_ID_RBTPROC   ,
    --t.TPS_ID_HARDN AS ID_MILLPROC,
    T3.ENC_ID_ORDER AS enc_order_id,
    T3.ENC_NO_ITEM AS enc_item_no,
    T3.ENC_GEOMETRY AS enc_geometry,
    T3.ENC_CD_GRADE AS enc_grade,
    T3.ENC_SEC2_MAX || 'mm' || ' ' || 'X' || ' ' || T3.ENC_SEC1_MAX || 'mm' AS pipe_size,
    T.TPS_SD_PROC_SHEET AS proc_sheet,
    T.TPS_GD_QAP_NO AS qap_no,
    T.TPS_SD_CUST_CD AS cust_code,
    T3.ENC_MARK_CUST AS mark_cust,
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
    T2.FRD_RESULT AS frd_result,
    T2.FRD_REMARK AS frd_remark,
    T2.FRD_INSP_NAME AS TESTED_BY,
    'MRR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T2.FRD_PROD_DATE, 'YYYYMMDD') || '(' || T2.FRD_SHIFT || ')' 
AS rep_no
FROM
    V_PROCESS_SHEET T,
    V_LDP_PRODN T1,
    V_FLAT_RBT_DISTANCE T2,
    V_END_CUST_ORD_EPA T3
WHERE
    T.TPS_ORDER_ID = T2.FRD_ID_ORDER_NO
    AND TO_NUMBER(T.TPS_ORDER_ITEM) = T2.FRD_ITEM_NO
    AND T.TPS_ORDER_ID = T1.LOM_ID_ORDER_CUS
    AND TO_NUMBER(T.TPS_ORDER_ITEM) = T1.LOM_ID_ORD_ITEM_CUS
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
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
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
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

export const getAirdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT t1.enc_mark_cust_name client, tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no, t1.enc_mark_cust, t.tpc_order_id,
       t.tpc_order_item, 'AETR' || '/'
                         || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no,
       t3.prd_date_120 || ' & ' || t3.prd_shift_120 DATE_SHIFT,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
    || 'mm WT' pipe_size,
--       SYSDATE, 'D' shift,
--       TO_CHAR (SYSDATE, 'DD.MM.YYYY') || '& D ' DATE_SFIFTQ,
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS shift, -- This column also needs to reflect D/N based on time
       TO_CHAR(SYSDATE, 'DD-MM-YYYY') || ' & ' ||
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS DATE_SHIFTQ,
       TO_CHAR (t3.prd_date_120, 'DD-MM-YYYY') DATE_OF_COATING,
        t.tcp_sd_ic_type type_of_coating,
       t3.prt_airent_wino procedure_wi_no, t.tcp_crt_dt procss_sheet_date,
       t3.charg pipe_no, t.tcp_fd_entrap_test required_value,
       t3.prt_air_ent_test achieved_value,
--T3.EIT_EPX_INS_NAME1 INSTRUMENT_NAME,
--T3.EIT_EPX_INS_ID1||'/'||T3.EIT_EPX_SRNO1  INSTRUMENT_ID_SERIAL_NO,
                                          t3.prd_date_120, t3.prd_shift_120
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
--FILTER COND.
   ---AND t.tpc_order_id = '0060977581'
   ---AND TO_NUMBER (t.tpc_order_item) = 1
   ---AND t3.prd_date_120 = '07-JUL-2026'
--and t3.Prd_Shift_120='D'
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t2.lom_ID_FIRST_PAR,t2.lom_ID_BATCH,t2.lom_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getAirdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCrossdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT t1.enc_mark_cust_name client,
         tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no, t1.enc_mark_cust, t.tpc_order_id,
       t.tpc_order_item, 'CCTR' || '/'
                         || TO_CHAR (t3.prd_date_120, 'YYYYMMDD') rep_no,
       TO_CHAR (t3.prd_date_120, 'DD.MM.YYYY') || ' & ' || t3.prd_shift_120 DATE_SHIFT,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' pipe_size,
       SYSDATE, 'D' shift, t.tcp_sd_ic_type type_of_coating,
       t3.eit_cross_wino procedure_wi_no, t.tcp_crt_dt procss_sheet_date,
       t3.charg pipe_no, t.tcp_fd_adhesion_vcut_test required_value,
       t3.eit_cross_cut_test achieved_value,
--T3.EIT_EPX_INS_NAME1 INSTRUMENT_NAME,
--T3.EIT_EPX_INS_ID1||'/'||T3.EIT_EPX_SRNO1  INSTRUMENT_ID_SERIAL_NO,
                                            t3.prd_date_120, t3.prd_shift_120
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
--FILTER COND.
   -- AND t.tpc_order_id = '0060977581'
   -- AND TO_NUMBER (t.tpc_order_item) = 1
   -- AND t3.prd_date_120 = '07-JUL-2026'
--and t3.Prd_Shift_120='D'
    AND t2.lom_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t2.lom_ID_FIRST_PAR,t2.lom_ID_BATCH,t2.lom_CD_STATUS `;

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
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getREPAIRdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT t1.enc_mark_cust_name client, 
       tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no, t1.enc_mark_cust, t.tpc_order_id,
       t.tpc_order_item, 'RR' || '/'
                         || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no,
       t3.prd_date_120 || ' & ' || t3.prd_shift_120 DATE_SHIFT,
              CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS shift, -- This column also needs to reflect D/N based on time
       TO_CHAR(SYSDATE, 'DD.MM.YYYY') || ' & ' ||
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS DATE_SHIFTQ,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' pipe_size,
       TO_CHAR (t3.prd_date_120, 'DD.MM.YYYY') COATING_DT,
       SYSDATE, 'D' shift, t.tcp_sd_ic_type type_of_coating,
       t3.prt_repair_wino procedure_wi_no, t.tcp_crt_dt procss_sheet_date,
       t3.charg pipe_no, t3.prt_rep_ins_name2 reason_damage,
       t3.prt_repair_area repair_area, t3.prt_rep_ins_id2 visual,
       t3.prt_repair_holiday holiday, t3.prt_repair_result,
--T3.EIT_EPX_INS_NAME1 INSTRUMENT_NAME,
--T3.EIT_EPX_INS_ID1||'/'||T3.EIT_EPX_SRNO1  INSTRUMENT_ID_SERIAL_NO,
                                                           t3.prd_date_120,
       t3.prd_shift_120
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
--FILTER COND.
   -- AND t.tpc_order_id = '0060977581'
   -- AND TO_NUMBER (t.tpc_order_item) = 1
   -- AND t3.prd_date_120 = '07-JUL-2026'
--and t3.Prd_Shift_120='D'
    AND t2.lom_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t2.lom_ID_FIRST_PAR,t2.lom_ID_BATCH,t2.lom_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getREPAIRdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getdustdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    console.log(crdate);
    var sql = `select t.tpc_order_id,t.tpc_order_item,t1.ENC_MARK_CUST ,T1.ENC_MARK_CUST_NAME CLIENT,TCP_SD_POREF_NO PO_REF_NO,
t.tpc_sd_proc_sheet process_sheet_no,t.tpc_sd_qap_no1 qap_no,
t1.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t1.enc_sec1_max || 'mm WT' pipe_size,
'DLR'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO,
sysdate ,'D' shift, --manual report entry
t.TCP_SD_TECH_SPEC SPEC,T.TCP_CRT_DT procss_sheet_date,
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS shift, -- This column also needs to reflect D/N based on time
       TO_CHAR(SYSDATE, 'DD-MM-YYYY') || ' & ' ||
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS DATE_SHIFTQ
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
--filter condt.
--and t.TPC_ORDER_ID = '0060977580'
--and to_number(t.TPC_ORDER_ITEM) =1
AND ENC_CD_EPA =  '${plant}'`;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    // if (matno && matno !== "" && matno !== null) {
    //   sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
    //   // binds["matno"] = matno;
    // }

    // if (crdate && crdate !== "" && crdate !== null) {
    //   // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
    //   sql += ` AND TRUNC(TCP_CRT_DT) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    // }

    // if (heatno && heatno !== "" && heatno !== null) {
    //   sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
    //   // binds["heatno"] = heatno;
    // }

    // if (pipeno && pipeno !== "" && pipeno !== null) {
    //   sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
    //   // binds["pipeno"] = pipeno;
    // }

    // sql += `  order by ID_FIRST_PAR,ID_BATCH`;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getdustdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getepoxydata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `select T1.ENC_MARK_CUST_NAME Client,
TCP_SD_POREF_NO PO_ref_no,
t.TCP_SD_TECH_SPEC SPEC,
'TSL/COAT/'||t.tpc_sd_qap_no1 Acceptance_Criteria,
t.tpc_sd_proc_sheet process_sheet_no,
t1.ENC_MARK_CUST,
t.tpc_order_id,t.tpc_order_item,
'EHTR'||'/'||TO_CHAR(T3.Prd_Date_120,'YYYYMMDD') REP_NO,
--T3.Prd_Date_120||' & '||T3.Prd_Shift_120 DATE_SHIFT,
TO_CHAR (T3.Prd_Date_120, 'DD.MM.YYYY') || ' & '||T3.Prd_Shift_120 DATE_SHIFT,
t1.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t1.enc_sec1_max || 'mm WT' pipe_size,
sysdate,'D' shift,
t.TCP_SD_IC_TYPE type_of_coating,
T3.EIT_EPOXY_WINO  Procedure_WI_No,
T.TCP_CRT_DT procss_sheet_date,
T3.CHARG Pipe_No,T.TCP_FD_HOLIDAY_FBE_TEST Required_Value,T3.EIT_EPOXY_HOLIDAY_TEST Achieved_Value,
T3.EIT_EPX_INS_NAME1 INSTRUMENT_NAME,
T3.EIT_EPX_INS_ID1||'/'||T3.EIT_EPX_SRNO1  INSTRUMENT_ID_SERIAL_NO,
T3.PRD_DATE_120,T3.PRD_SHIFT_120
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and t.TPC_ORDER_ID = '0060977581' 
--and to_number(t.TPC_ORDER_ITEM) =1
--and t3.shiftdate=''
--and t3.shift='D' 
    AND T2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.Prd_Date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.CHARG = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by LOM_ID_FIRST_PAR,LOM_ID_BATCH,LOM_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getepoxydata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getimpactdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `Select T1.ENC_MARK_CUST_NAME Client,
t.TCP_SD_POREF_NO PO_ref_no,
t1.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t1.enc_sec1_max || 'mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'TSL/COAT/'||t.tpc_sd_qap_no1 Acceptance_Criteria,
'ITR'||'/'||TO_CHAR(T3.Prd_Date_120,'YYYYMMDD') REP_NO,
TO_CHAR (T3.Prd_Date_120, 'DD.MM.YYYY') ||' & '||t3.prd_shift_120 DATE_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
T3.EIT_IMPACT_WINO  Procedure_WI_No,
t.tpc_order_id,t.tpc_order_item,t1.ENC_MARK_CUST,
T.TCP_CRT_DT procss_sheet_date,
T3.CHARG Pipe_No,T.TCP_FD_IMPACT_TEST  Required_Value,T3.EIT_IMPACT_TEST Achieved_Value,' ' REMARKS,
T3.EIT_IMP_INS_NAME1 INSTRUMENT_NAME,
T3.EIT_IMP_INS_ID1||'/'||T3.EIT_IMP_SRNO1  INSTRUMENT_ID_SERIAL_NO,
T3.Prd_Date_120,T3.Prd_Shift_120
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and t.TPC_ORDER_ID = '0060977581' 
--and to_number(t.TPC_ORDER_ITEM) =1 
--and t3.shiftdate=''
--and t3.shift='D'
    AND T2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += `AND  t.TPC_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPC_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND T2.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(T3.Prd_Date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND T2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND T3.CHARG = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by T2.LOM_ID_FIRST_PAR,T2.LOM_ID_BATCH,T2.LOM_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getimpactdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getpeeldata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `
SELECT   t1.enc_mark_cust,
 t1.enc_mark_cust_name client,
         t11.tpc_order_id || '/' || tcp_sd_poref_no so_po_ref_no,
            t1.enc_sec2_max
         || 'mm OD'
         || ' '
         || 'X'
         || ' '
         || t1.enc_sec1_max
         || 'mm WT' pipe_size,
         t11.tcp_sd_tech_spec spec, t11.tcp_sd_ic_type type_of_coating,
                CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS shift, -- This column also needs to reflect D/N based on time
       TO_CHAR(SYSDATE, 'DD-MM-YYYY') || ' & ' ||
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) >= 6 AND TO_NUMBER(TO_CHAR(SYSDATE, 'HH24')) < 18 THEN 'D'
           ELSE 'N'
       END AS DATE_SHIFTQ,
         'PTR' || '/' || TO_CHAR (TRUNC (SYSDATE), 'YYYYMMDD') rep_no,
         --q.prd_date_120 || ' & ' || q.prd_shift_120 date_shift,
         TO_CHAR (q.prd_date_120, 'DD.MM.YYYY') || ' & ' || q.prd_shift_120 date_shift,
         SYSDATE || ' & ' || 'D' shift1, q.prd_date_120 date_coating22,
        TO_CHAR (TRUNC (prd_date_120), 'DD.MM.YYYY') date_coating,
         t11.tpc_sd_proc_sheet process_sheet_no, t11.tpc_order_id,
         t11.tpc_order_item,
         'TSL/COAT/' || t11.tpc_sd_qap_no1 acceptance_criteria, prt_pel_srno1,
         prt_pel_ins_name1 instrument_name, prt_peel_wino procedure_wi_no,
         prt_pel_ins_id1 || '/' || prt_pel_srno1 instrument_id_serial_no,
         charg, required_value1 ,required_value2 , achieve_value, remarks
    FROM (SELECT t3.charg, prt_fend1 achieve_value, 'F-END' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_cold_test required_value1,
                  '@'
                 || t.tcp_fd_peel_temp_cold || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
             AND TO_NUMBER (t.tpc_order_item) = '${item}'
          UNION ALL
          SELECT t3.charg, prt_fend2 achieve_value, 'F-END' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_test_hot required_value1,
                  ' @'
                 || t.tcp_fd_peel_temp_hot || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
             AND TO_NUMBER (t.tpc_order_item) = '${item}'
          UNION ALL
          SELECT t3.charg, prt_midle1 achieve_value, 'MIDDLE' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_cold_test required_value1,
                  ' @'
                 || t.tcp_fd_peel_temp_cold || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
             AND TO_NUMBER (t.tpc_order_item) = '${item}'
          UNION ALL
          SELECT t3.charg, prt_midle2 achieve_value, 'MIDDLE' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_test_hot required_value1,
                  ' @'
                 || t.tcp_fd_peel_temp_hot || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
             AND TO_NUMBER (t.tpc_order_item) = '${item}'
          UNION ALL
          SELECT t3.charg, prt_tend1 achieve_value, 'T-END' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_cold_test required_value1,
                  '@'
                 || t.tcp_fd_peel_temp_cold || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
             AND TO_NUMBER (t.tpc_order_item) = '${item}'
          UNION ALL
          SELECT t3.charg, prt_tend2 achieve_value, 'T-END' remarks,
                 t2.lom_id_order_cus, t2.lom_id_ord_item_cus, t3.zcl_crt_dt,
                 t3.prd_date_120, t3.prd_shift_120,
                    'Minimum'
                 || t.tcp_fd_peel_test_hot required_value1,
                  ' @'
                 || t.tcp_fd_peel_temp_hot || ' °C' required_value2,
                 prt_pel_srno1, prt_pel_ins_name1, prt_pel_ins_id1,
                 prt_peel_wino
            FROM v_zcoat_lab t3, v_ldp_prodn t2, v_process_sheet_ec t
           WHERE t3.charg = t2.lom_id_batch
             AND t2.lom_id_order_cus = t.tpc_order_id
             AND t2.lom_id_ord_item_cus = TO_NUMBER (t.tpc_order_item)
             AND t.tpc_order_id = '${orderNo}'
                          AND t2.LOM_CD_EPA = ${plant}
             AND TO_NUMBER (t.tpc_order_item) = '${item}') q,
         v_process_sheet_ec t11,
         v_end_cust_ord_epa t1
   WHERE q.lom_id_order_cus = t11.tpc_order_id
     AND q.lom_id_ord_item_cus = TO_NUMBER (t11.tpc_order_item)
     AND t11.tpc_order_id = t1.enc_id_order
     AND TO_NUMBER (t11.tpc_order_item) = t1.enc_no_item `;

    // if (orderNo && orderNo !== "" && orderNo !== null) {
    //   sql += ` AND t.tps_order_id = '${orderNo}' `;
    //   // binds["orderNo"] = orderNo;
    // }

    // if (item && item !== "" && item !== null) {
    //   sql += ` AND TO_NUMBER(t.tps_order_item) = '${item}' `;
    //   // binds["item"] = item;
    // }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(q.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t1.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by charg,Remarks `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getpeeldata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const gettrialdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT t1.enc_mark_cust_name MARK_CUST_NAME, t.tcp_sd_poref_no ORDER_ID,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' PIPE_SIZE,
       t.tcp_sd_tech_spec SPEC_GRD, t.tcp_sd_ic_type COATING_TYPE,
       'TPR' || '/' || TO_CHAR (t3.prd_date_120, 'YYYYMMDD') || '-1' REP_NO,
       --t3.shiftdate||' & '||t3.shift date_shift,
       'TSL/COAT/' || t.tpc_sd_qap_no1 GD_QAP_NO,
       t.tpc_sd_proc_sheet PROC_SHEET,
       TO_CHAR (t3.prd_date_120, 'DD-MM-YYYY') || ' & ' || t3.prd_shift_120 date_shiftQ,
       t3.ftp_trial_wino PROCEDURE_WI_NO, t3.ftp_trl_srno1,
       t3.ftp_trl_ins_name1 instrument_name1, t.tpc_order_id,
       t.tpc_order_item, t1.enc_mark_cust, t.tcp_crt_dt procss_sheet_date,
       t3.charg pipe_no,
       t3.ftp_trl_ins_id1 || '/' || t3.ftp_trl_srno1 instrument_id_serial_no1,
       t3.ftp_trl_srno2, t3.ftp_trl_ins_name2 instrument_name2,
       t3.ftp_trl_ins_id2 || '/' || t3.ftp_trl_srno2 instrument_id_serial_no2,
       t3.ftp_epoxy_0d1, t3.ftp_epoxy_0d2, t3.ftp_epoxy_0d3,
       t3.ftp_epoxy_90d1, t3.ftp_epoxy_90d2, t3.ftp_epoxy_90d3,
       t3.ftp_epoxy_180d1, t3.ftp_epoxy_180d2, t3.ftp_epoxy_180d3,
       t3.ftp_epoxy_270d1, t3.ftp_epoxy_270d2, t3.ftp_epoxy_270d3,
       t3.ftp_adhesiv_0d1, t3.ftp_adhesiv_0d2, t3.ftp_adhesiv_0d3,
       t3.ftp_adhesiv_90d1, t3.ftp_adhesiv_90d2, t3.ftp_adhesiv_90d3,
       t3.ftp_adhesiv_180d1, t3.ftp_adhesiv_180d2, t3.ftp_adhesiv_180d3,
       t3.ftp_adhesiv_270d1, t3.ftp_adhesiv_270d2, t3.ftp_adhesiv_270d3,
       t3.ftp_totcoat_0d1, t3.ftp_totcoat_0d2, t3.ftp_totcoat_0d3,
       t3.ftp_totcoat_90d1, t3.ftp_totcoat_90d2, t3.ftp_totcoat_90d3,
       t3.ftp_totcoat_180d1, t3.ftp_totcoat_180d2, t3.ftp_totcoat_180d3,
       t3.ftp_totcoat_270d1, t3.ftp_totcoat_270d2, t3.ftp_totcoat_270d3,
       t.TCP_CP2_CTHICK_EPOXY_MIN epoxy_min,
nvl(t.TCP_CP2_CTHICK_EPOXY_MIN,0) + nvl(t.TCP_CP2_ADHE_THICK_MIN,0) epoxy_adhe_min,
TCP_CP2_TOT_CTHICK_MIN COATING_THICK
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
--FILTER COND.
--and t.TPC_ORDER_ID = '9518845119'
   AND TO_NUMBER (t.tpc_order_item) = 1
--and t3.shiftdate=''
--and t3.shift='D'
    AND LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPC_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(T3.Prd_Date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t2.LOM_ID_FIRST_PAR,t2.LOM_ID_BATCH,t2.LOM_CD_STATUS `;

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
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getapplicationdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `
SELECT    
       TO_CHAR (t3.tbp_prod_date, 'DD.MM.YYYY')
       || ' & '
       || t3.tbp_shift date_shift,
       t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' pipe_size,
       t.tcp_sd_ic_type type_of_coating,
       'CCAIR' || '/' || TO_CHAR (t3.tbp_prod_date, 'YYYYMMDD') rep_no,
       t.tcp_id_applipro_m procedure_wi_no,
--INSTRUMENT NAME
       t.tcp_id_ins_appli1_m instrument_name1,
       t.tcp_id_ins_appli2_m instrument_name2,
       t.tcp_id_ins_appli3_m instrument_name3,    
--INSTRUMENT ID SRNO
       t.tcp_id_ins_appli_id1_m instrument_id_sno1,
       t.tcp_id_ins_appli_id2_m instrument_id_sno2,
       t.tcp_id_ins_appli_id3_m instrument_id_sno3,
       t.tcp_cp1_chpheatemp_min pipe_temp_b4chrom_min,
       t.tcp_cp1_chpheatemp_max pipe_temp_b4chrom_max,
       t.tcp_cp1_chsol_temp chrom_sol_temp_max,
--T.TCP_CP1_CH_APPLI PIPE_TEMP_AFCHROM_APPLI,
       t.tcp_cp1_ph_fbeapp_min,
       t.tcp_cp1_ph_fbeapp_max, t.tcp_cp1_adheflim_min,
       t.tcp_cp1_adheflim_max, t.tcp_cp2_afwatemp_quen_min,
       t.tcp_cp2_afwatemp_quen_max, t3.tbp_batch_no, t2.lom_no_cast heat_no,
       ROUND (t2.lom_length / 1000, 2) LENGTH, t3.tbp_asl_no_80,
       t3.tbp_piptmp_becrm_110, t3.tbp_chrm_visual_110,
       t3.tbp_chrm_tmp_110 chro_sol_temp, t3.tbp_piptmp_afcrm_110,
       t3.tbp_piptmp_befbe_110, t3.tbp_tmp_adhef_fil_110,
       t3.tbp_tmp_pefilm_110, t3.tbp_qun_wa_betmp_110,
       t3.tbp_qun_wa_aftmp_110, t3.tbp_remark,
--EPOXY
       t3.tbp_epgun_1_110 a1,
       t3.tbp_epgun_2_110 a2, t3.tbp_epgun_3_110 a3, t3.tbp_epgun_4_110 a4,
       t3.tbp_epgun_5_110 a5, t3.tbp_epgun_6_110 a6, t3.tbp_epgun_7_110 a7,
       t3.tbp_epgun_8_110 a8, t3.tbp_epgun_9_110 a9, t3.tbp_epgun_10_110 a10,
       t3.tbp_epgun_11_110 a11, t3.tbp_epgun_12_110 a12,
       t3.tbp_epgun_13_110 b1, t3.tbp_epgun_14_110 b2, t3.tbp_epgun_15_110 b3,
       t3.tbp_epgun_16_110 b4, t3.tbp_epgun_17_110 b5, t3.tbp_epgun_18_110 b6,
       t3.tbp_epgun_19_110 b7, t3.tbp_epgun_20_110 b8, t3.tbp_epgun_21_110 b9,
       t3.tbp_epgun_22_110 b10, t3.tbp_epgun_23_110 b11, tbp_epgun_24_110 b12,
--AIR PRESSURE
       t3.tbp_airpress_1_110, t3.tbp_airpress_2_110, t3.tbp_airpress_3_110,
       t3.tbp_airpress_4_110, t3.tbp_airpress_5_110, t3.tbp_airpress_6_110,
       t3.tbp_airpress_7_110, t3.tbp_airpress_8_110, t3.tbp_airpress_9_110,
       t3.tbp_airpress_10_110, t3.tbp_airpress_11_110, t3.tbp_airpress_12_110,
       t3.tbp_airpress_13_110, t3.tbp_airpress_14_110, t3.tbp_airpress_15_110,
       t3.tbp_airpress_16_110, t3.tbp_airpress_17_110, t3.tbp_airpress_18_110,
       t3.tbp_airpress_19_110, t3.tbp_airpress_20_110, t3.tbp_airpress_21_110,
       t3.tbp_airpress_22_110, t3.tbp_airpress_23_110, t3.tbp_airpress_24_110,
--FLOW RATE
       t3.tbp_flwrate_1_110, t3.tbp_flwrate_2_110, t3.tbp_flwrate_3_110,
       t3.tbp_flwrate_4_110, t3.tbp_flwrate_5_110, t3.tbp_flwrate_6_110,
       t3.tbp_flwrate_7_110, t3.tbp_flwrate_8_110, t3.tbp_flwrate_9_110,
       t3.tbp_flwrate_10_110, t3.tbp_flwrate_11_110, t3.tbp_flwrate_12_110,
       t3.tbp_flwrate_13_110, t3.tbp_flwrate_14_110, t3.tbp_flwrate_15_110,
       t3.tbp_flwrate_16_110, t3.tbp_flwrate_17_110, t3.tbp_flwrate_18_110,
       t3.tbp_flwrate_19_110, t3.tbp_flwrate_20_110, t3.tbp_flwrate_21_110,
       t3.tbp_flwrate_22_110, t3.tbp_flwrate_23_110, t3.tbp_flwrate_24_110,
--ROW MATERIAL
       t3.tbp_rm_1_110, t3.tbp_rm_2_110, t3.tbp_rm_3_110, t3.tbp_rm_4_110,
--MANUFACT
       t3.tbp_manfact_1_110, t3.tbp_manfact_2_110, t3.tbp_manfact_3_110,
       t3.tbp_manfact_4_110,
--GRADE
       t3.tbp_chrm_gr_110, t3.tbp_epoxy_gr_110,
       t3.tbp_adha_gr_110, t3.tbp_pepp_gr_110,
--BATCH
       t3.tbp_chrom_bh_110,
       t3.tbp_epxy_bh_110, t3.tbp_adha_bh_110, t3.tbp_pepp_bh_110,
       t3.tbp_lines_sped_110, t3.tbp_epxy_dwpt_110, t3.tbp_no_epgun_110,
       t3.tbp_hdpe_rpm01_110, t3.tbp_adhe_rpm_110, t3.tbp_prod_date,
       t3.tbp_shift,
       t3.tbp_dia_end_10
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_bare_pdo t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.tbp_batch_no = t2.lom_id_batch
   AND t3.tbp_cd_proc = 'C'
   --FILTER COND.
   -- AND t.tpc_order_id = '0060977580'
   -- AND TO_NUMBER (t.tpc_order_item) = 1
   -- AND t3.tbp_prod_date = '13-jul-2026'
   -- AND t3.tbp_shift = 'B'
    AND t2.lom_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.tbp_prod_date) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.tbp_batch_no = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t3.tbp_prod_date,t3.tbp_dia_end_10,t2.lom_ID_FIRST_PAR,t2.lom_ID_BATCH,t2.lom_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getapplicationdata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getthickness = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `
       SELECT    
       TO_CHAR (t3.tbp_prod_date, 'DD.MM.YYYY')
       || ' & '
       || t3.tbp_shift date_shift,
       t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' pipe_size,
       t.tcp_sd_ic_type type_of_coating,
       'CTIR' || '/' || TO_CHAR (t3.tbp_prod_date, 'YYYYMMDD') rep_no,
        t.tcp_id_applipro_m procedure_wi_no,
--INSTRUMENT NAME
       t.tcp_id_ins_appli1_m instrument_name1,
       t.tcp_id_ins_appli2_m instrument_name2,
       t.tcp_id_ins_appli3_m instrument_name3,      
--INSTRUMENT ID SRNO
       t.tcp_id_ins_appli_id1_m instrument_id_sno1,
       t.tcp_id_ins_appli_id2_m instrument_id_sno2,
       t.tcp_id_ins_appli_id3_m instrument_id_sno3, t.tcp_cp2_tot_cthick_min,
       t.tcp_cp2_tot_cthick_max, t3.tbp_batch_no, t2.lom_no_cast heat_no,
       ROUND (t2.lom_length / 1000, 2) LENGTH, t3.tbp_asl_no_80,
       ROUND (t3.tbp_cot_thk_1_120,2) TBP_COT_THK_1_120,
       ROUND (t3.tbp_cot_thk_2_120,2) TBP_COT_THK_2_120,
       ROUND (t3.tbp_cot_thk_3_120,2) TBP_COT_THK_3_120, --3'OCLOCK
       ROUND (t3.tbp_cot_thk_4_120,2) TBP_COT_THK_4_120,
       ROUND (t3.tbp_cot_thk_5_120,2) TBP_COT_THK_5_120,
       ROUND (t3.tbp_cot_thk_6_120,2) TBP_COT_THK_6_120,--6'OCLOCK
       ROUND (t3.tbp_cot_thk_7_120,2) TBP_COT_THK_7_120,
       ROUND (t3.tbp_cot_thk_8_120,2) TBP_COT_THK_8_120,
       ROUND (t3.tbp_cot_thk_9_120,2) TBP_COT_THK_9_120,--9'OCLOCK
       ROUND (t3.tbp_cot_thk_10_120,2) TBP_COT_THK_10_120,
       ROUND (t3.tbp_cot_thk_11_120,2) TBP_COT_THK_11_120,
       ROUND (t3.tbp_cot_thk_12_120,2) TBP_COT_THK_12_120,--12'OCLOCK
       t3.tbp_remark REMARK, 
       t3.tbp_coat_stas_120, 
       t3.tbp_test_pip_120,
       t3.tbp_prod_date, 
        t3.tbp_result VISUAL,
       t3.tbp_shift,
       t3.tbp_dia_end_10,
       t3.TBP_QTEMP_120,
       (select LISTAGG(t4.elf_test_name, ',') test_nm from V_LAB_FIELD_TEST_EC t4
where t4.elf_batch_no = t3.tbp_batch_no and t4.elf_prod_date=t3.tbp_prod_date and t4.elf_shift=t3.tbp_shift ) test_name
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_bare_pdo t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.tbp_batch_no = t2.lom_id_batch
   AND t3.tbp_cd_proc = 'D'
--FILTER COND.
   --AND t.tpc_order_id = '0060977580'
   --AND TO_NUMBER (t.tpc_order_item) = 1
   --AND t3.tbp_prod_date = '13-jul-2026'
   --AND t3.tbp_shift = 'B'
    AND t2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.tbp_prod_date) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.LOM_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.tbp_batch_no = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t3.tbp_prod_date,t3.tbp_dia_end_10,t2.LOM_ID_FIRST_PAR,t2.LOM_ID_BATCH,t2.LOM_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getthickness", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getfinalinspection = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `
       SELECT   
        TO_CHAR (t3.tbp_prod_date, 'DD.MM.YYYY')
       || ' & '
       || t3.tbp_shift date_shift,
       t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
       t.tcp_sd_tech_spec spec,
       'TSL/COAT/' || t.tpc_sd_qap_no1 acceptance_criteria,
       t.tpc_sd_proc_sheet process_sheet_no,
          t1.enc_sec2_max
       || 'mm OD'
       || ' '
       || 'X'
       || ' '
       || t1.enc_sec1_max
       || 'mm WT' pipe_size,
       t.tcp_sd_ic_type type_of_coating,
       'FIR' || '/' || TO_CHAR (t3.tbp_prod_date, 'YYYYMMDD') rep_no,
        --CUTBACK,EPOXY,ANGLE
       t.tcp_cp2_cut_back_min cutbackmin, t.tcp_cp2_cut_back_max cutbackmax,
       t.tcp_cp2_epoxy_bnd_min epoxymin, t.tcp_cp2_epoxy_bnd_max epoxymax,
       t.tcp_cp2_bevel_angle_min cutbackanglemin,
       t.tcp_cp2_bevel_angle_max cutbackanglemax,
       t.tcp_cp2_resu_mg resudialmagnetism, t.tcp_fd_3lpe_holiday_min holiday,
       t3.tbp_batch_no, t2.lom_no_cast heat_no,
       ROUND (t2.lom_length / 1000, 2) LENGTH,
       (SELECT t5.tbp_asl_no_80
          FROM v_bare_pdo t5
         WHERE t5.tbp_batch_no = t3.tbp_batch_no
           AND t5.tbp_cd_proc = 'D'
           AND t5.tbp_batch_proc_no =
                  (SELECT MAX (tbp_batch_proc_no)
                     FROM v_bare_pdo a
                    WHERE a.tbp_batch_no = t5.tbp_batch_no
                      AND a.tbp_cd_proc = 'D')) tbp_asl_no_80,
       t3.tbp_cb_fend_130, t3.tbp_cb_tend_130, t3.tbp_ep_fend_130,
       t3.tbp_ep_tend_130, t3.tbp_ca_fend_130, t3.tbp_ca_tend_130,
       t3.tbp_holidat_130, t3.tbp_resumg_1_130, t3.tbp_resumg_2_130,
       t3.tbp_resumg_3_130, t3.tbp_resumg_4_130,
       (SELECT 
           TO_CHAR (t4.tbp_prod_date, 'DD-MM-YYYY')
          FROM v_bare_pdo t4
         WHERE t4.tbp_batch_no = t3.tbp_batch_no
           AND t4.tbp_cd_proc = 'D'
           AND t4.tbp_batch_proc_no =
                  (SELECT MAX (tbp_batch_proc_no)
                     FROM v_bare_pdo a
                    WHERE a.tbp_batch_no = t4.tbp_batch_no
                      AND a.tbp_cd_proc = 'D')) coating_date,
       t3.TBP_REMARK remark,
       TBP_FLD_NO_130 FLD_NO, 
       t3.tbp_result visual,
       t3.tbp_prod_date, t3.tbp_shift
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_bare_pdo t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.tbp_batch_no = t2.lom_id_batch
   AND t3.tbp_cd_proc = 'E'
   --FILTER COND.
   -- AND t.tpc_order_id = '0060977581'
   -- AND TO_NUMBER (t.tpc_order_item) = 1
   -- AND t3.tbp_prod_date = '29-jul-2026'
   --and t3.tbp_shift='B'
   AND t2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.LOM_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.tbp_prod_date) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    if (heatno && heatno !== "" && heatno !== null) {
      sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
      // binds["heatno"] = heatno;
    }

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.tbp_batch_no = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += `  order by t2.LOM_ID_FIRST_PAR,t2.LOM_ID_BATCH,t2.LOM_CD_STATUS `;

    // if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
    //   sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
    //   binds["DespFromDate"] = DespFromDate;
    //   binds["DespToDate"] = DespToDate;
    // }

    // if (item && item !== "") {
    //   sql += ` And LOM_ID_ORD_ITEM_CUS=NVL(:item, LOM_ID_ORD_ITEM_CUS)`;
    //   binds["item"] = item;
    // }

    console.error("getfinalinspection", sql);
    console.error("binds");
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
      T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
      t.tps_order_id = T2.TBP_ID_ORDER_NO
      AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
      AND T.TPS_ORDER_ID = t1.lom_id_order_cus
      AND T3.ENC_GEOMETRY IN ('S', 'R')
     -- AND T3.ENC_GEOMETRY IN ('S', 'R','O')
      AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
      AND t2.Tbp_Cd_PROC = '1'
      AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
      AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
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

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
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
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    t1.lom_CD_EPA AS lom_cd_epa,
    t.TPS_ID_DWTTPROC PROC_NO,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS cust_cd,
    T3.ENC_MARK_CUST AS mark_cust,
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
    t.tps_sd_spec_grd AS spec_grd,
    T3.ENC_CD_GRADE AS cd_grade,
    T2.FPT_NO_CAST AS no_cast,
    T1.LOM_NO_CAST AS lom_no_cast,
    t.tps_ld_dwtt_test_temp AS test_temp,
    --t.TPS_LD_DWTT_INDV_SA || '%'AS sa_indv,
    --t.TPS_LD_DWTT_AVG_SA || '%'AS sa_avg,
    CASE WHEN t.TPS_LD_DWTT_INDV_SA IS NOT NULL THEN t.TPS_LD_DWTT_INDV_SA || '%' ELSE NULL END AS sa_indv,
    CASE WHEN t.TPS_LD_DWTT_AVG_SA IS NOT NULL THEN t.TPS_LD_DWTT_AVG_SA || '%' ELSE NULL END AS sa_avg,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    T1.LOM_MILL_NO AS mill_no,
    T2.FPT_CD_LOC AS cd_loc,
    T2.FPT_TEST_CD AS test_cd,
    T2.FPT_TEST_PARA AS test_para,
    ROUND(T2.FPT_TEST_PARA_VAL, 0) AS test_para_val,
    T2.FPT_TEST_PARA_RESULT AS test_para_result,
    T2.FPT_INSPEC_NM TESTED_BY,
    T2.FTP_TEST_REMARK TEST_REMARK,
    to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    'DWTTRP' || '/' || TO_CHAR(T2.FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec3_max || ' ' || 'X' || ' ' || t3.enc_sec2_max ||  ' ' ||   'X' || ' ' || t3.enc_sec1_max AS pipe_size
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_fg_pipe_test_rslt t2,
    v_END_CUST_ORD_EPA T3
WHERE 
    T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND t.tps_order_item = t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE = T1.LOM_ID_BATCH
    AND t2.fpt_test_cd = 'DWTT'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    --AND TRUNC(T2.FPT_CRT_DT) = '25-jun-2025' --and '30-jun-2025'
    --AND T2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
   -- AND T1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    --AND t.tps_order_id = '9518617784' 
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    sql += `  order by TEST_PARA `;

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
    LOM_CD_EPA CD_EPA,
    t.TPS_ID_TENPROC AS ID_TENPROC,
    t1.lom_CD_EPA AS lom_cd_epa,
    t.tps_order_id AS order_id,
    t.tps_sd_proc_sheet AS proc_sheet,
    t.TPS_SD_QAP_NO AS sd_qap_no,
    t.TPS_GD_QAP_NO AS gd_qap_no,
    t.tps_sd_cust_cd AS sd_cust_cd,
    t3.ENC_MARK_CUST AS mark_cust,
    t3.ENC_MARK_CUST_NAME AS mark_cust_name,
    t.tps_sd_spec_grd AS spec,
    t3.ENC_MK_SPEC_COMPLETE,
    t3.ENC_CD_GRADE AS cd_grade,
    t2.FPT_NO_CAST AS no_cast,
    t1.LOM_NO_CAST AS lom_no_cast,
    t.TPS_LD_YS_MIN AS yield_strength_min,
    t.TPS_LD_YS_MAX AS yield_strength_max,
    t.TPS_LD_UTS_MIN AS tens_strength_base_min,
    t.TPS_LD_UTS_MAX AS tens_strength_base_max,
    t.TPS_LD_WELD_UTS_MIN AS tens_strength_weld_min,
    t.TPS_LD_WELD_UTS_MAX AS tens_strength_weld_max,
    t.TPS_LD_YS_UTS AS ys_uts_ratio,
    t.TPS_LD_EL AS elongation,
    t1.lom_id_batch AS id_batch,
    t1.lom_cd_status AS cd_status,
    t1.LOM_MILL_NO AS mill_no,
    t1.LOM_NO_MATNR AS no_matnr,
    t3.ENC_NO_MATNR AS enc_no_matnr,
    t3.ENC_NO_MATNR1 AS enc_no_matnr1,
    t2.FPT_CD_LOC AS cd_loc,
    t2.FPT_TEST_CD AS test_cd,
    t2.FPT_TEST_PARA AS test_para,
    t2.FPT_TEST_PARA_VAL AS test_para_val,
    t2.FPT_TEST_PARA_RESULT AS test_para_result,
    T2.FTP_TEST_REMARK TEST_REMARK,
    --t2.FPT_CRT_DT AS crt_dt,
    to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    'MTRP/' || TO_CHAR(t2.FPT_CRT_DT, 'YYYYMMDD') || '/1' AS rep_no,
    t3.enc_sec2_max || 'mm X ' || t3.enc_sec1_max || 'mm' AS pipe_size,
    t2.FPT_TEST_PARA_REM AS BROKEN_LOCATION,
    t2.FPT_INSPEC_NM AS TESTED_BY
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_fg_pipe_test_rslt t2,
    v_END_CUST_ORD_EPA t3
WHERE 
    t.TPS_ORDER_ID = t1.lom_id_order_cus
    AND t.tps_order_item = t1.lom_id_ord_item_cus
    AND t2.FPT_ID_PIPE = t1.LOM_ID_BATCH 
    AND t2.fpt_test_cd = 'TP'
    AND t.TPS_ORDER_ID = t3.ENC_ID_ORDER
    AND t.TPS_ORDER_ITEM = t3.ENC_NO_ITEM
    --AND t1.lom_no_cast IN ('A288957', 'A288947', 'A288990')
    --AND t2.FPT_ID_PIPE BETWEEN 'QP1000116' AND 'QP1000120'
    --AND t1.LOM_NO_MATNR IN ('000000000145000132', '000000000145000190')
    --AND t.tps_order_id = '9518617784'
    --AND TO_NUMBER(t.tps_order_item) = 2 
    --AND TRUNC(t2.FPT_CRT_DT) = '25-jun-2025'
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    sql += ` order by LOM_CD_EPA,ID_BATCH,FPT_CD_LOC, FPT_TEST_PARA `;

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

export const getMGERdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
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
    T3.ENC_MARK_CUST_NAME AS MARK_CUST_NAME,
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
    'NO UNTEMPERED MARTENSITE REMAINS & UNIFORM DISTRIBUTION OF FERRITE & PEARLITE STRUCTURE HAS BEEN ENSABLISHED.' REMARKS_FIELD,
    ROUND(T2.FPT_TEST_PARA_VAL,0) TEST_PARA_VAL ,
    T2.FPT_TEST_PARA_RESULT AS TEST_PARA_RESULT,
    to_char(T2.FPT_CRT_DT,'dd.mm.yyyy') AS crt_dt,
    'HTRP'||'/'||TO_CHAR(T2.FPT_CRT_DT,'YYYYMMDD')||'/1' AS REP_NO,
    T.TPS_ID_IMPPROC ID_IMPPROC,
    t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' pipe_size,
     t2.FPT_INSPEC_NM AS INSPEC_NM
    from v_process_sheet t,v_ldp_prodn t1,v_fg_pipe_test_rslt t2,v_END_CUST_ORD_EPA T3
    where T.TPS_ORDER_ID=t1.lom_id_order_cus
    AND t.tps_order_item=t1.lom_id_ord_item_cus
    AND T2.FPT_ID_PIPE=T1.LOM_ID_BATCH
    AND t2.fpt_test_cd='HT'
    AND T2.FPT_TEST_PARA IN  ('GRN_SIZE')
    AND T.TPS_ORDER_ID=T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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
  crdate: any,
  heatno: any,
  pipeno: any
  // ,rmno: any
) => {
  try {
    var sql = `SELECT 
    LOM_CD_EPA AS CD_EPA,
        T3.ENC_MARK_CUST_NAME AS MARK_CUST_NAME,
        T3.ENC_ID_ORDER AS Order_ID,
        T3.ENC_NO_ITEM AS Item_No,
        t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS Pipe_Size,
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
        t.tps_order_id = T2.TBP_ID_ORDER_NO
        AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
        AND T.TPS_ORDER_ID = t1.lom_id_order_cus
        AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
        AND t2.Tbp_Cd_PROC = '4'
        AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
        AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t2.FPT_ID_PIPE = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
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
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
    t2.tbp_calib_date_30 AS calib_date_30,
    t2.TBP_CALIB_DUE_DT_30  AS calib_date_DUE,
    t2.TBP_INSP_NAME AS TESTED_BY,
    t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS pipe_size
FROM 
    v_process_sheet t,
    v_ldp_prodn t1,
    v_bare_pdo t2,
    v_END_CUST_ORD_EPA T3
WHERE 
    t.tps_order_id = T2.TBP_ID_ORDER_NO
    AND TO_NUMBER(t.tps_order_item) = T2.TBP_ITEM_NO
    AND T.TPS_ORDER_ID = t1.lom_id_order_cus
    AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
    AND t2.Tbp_Cd_PROC = '3'
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

    console.error("getMGNdata", sql);
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
      T3.ENC_MARK_CUST_NAME AS MARK_CUST_NAME,
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
      'VDIR-' || T1.LOM_MILL_NO || '/' || TO_CHAR(T.TBP_PROD_DATE, 'YYYYMMDD') || '(' || t.tbp_shift || ')' AS  
  FROM 
      v_bare_pdo t
  JOIN 
      v_END_CUST_ORD_EPA T3 ON t.tbp_id_order_no = T3.enc_id_order AND t.tbp_item_no = T3.enc_no_item
  JOIN 
      v_ldp_prodn t1 ON t.tbp_batch_no = t1.lom_id_batch
  WHERE 
      t.tbp_cd_proc = '8'
      --AND t.tbp_prod_date = '03-jul-2025'
      --AND t.tbp_shift = 'B'
      --AND t.tbp_id_order_no = '9518830960'
      --AND TO_NUMBER(t.tbp_item_no) = 2
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

export const getVdirdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
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
    t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS pipe_size,
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
    T3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
    T2.TBP_PIPE_LNG_10 AS pipe_lng_10,  
    t2.tbp_weight AS weight,
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
    t.TPS_ID_RGHT_ANG AS TPS_ID_RGHT_ANG,
    t2.TBP_INSP_NAME AS TESTED_BY,
    DECODE(T1.LOM_MILL_NO, 1, '13575/1', 'N45184/1') AS WGH_MC_ID
    from v_bare_pdo t2,v_END_CUST_ORD_EPA T3,v_ldp_prodn t1,v_process_sheet t
    where t2.tbp_cd_proc='8'
    and t2.tbp_id_order_no=t3.enc_id_order
    and t2.tbp_item_no = t3.enc_no_item
    AND T2.TBP_BATCH_NO = T1.LOM_ID_BATCH
    AND T.TPS_ORDER_ID = T3.ENC_ID_ORDER
    AND T.TPS_ORDER_ITEM = T3.ENC_NO_ITEM
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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

export const getVdirSdata = async (
  plant: any,
  orderNo: any,
  item: any,
  matno: any,
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
        t3.enc_sec2_max || 'mm' || ' ' || 'X' || ' ' || t3.enc_sec1_max || 'mm' AS pipe_size,
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
        t3.ENC_MARK_CUST_NAME AS mark_cust_name,
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
        t2.TBP_PIPE_LNG_10 AS pipe_lng_10,
        t2.tbp_weight AS weight,
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
        AND t2.tbp_id_order_no = t3.enc_id_order
        AND t2.tbp_item_no = t3.enc_no_item
        AND t2.TBP_BATCH_NO = t1.LOM_ID_BATCH
        AND t.TPS_ORDER_ID = t3.ENC_ID_ORDER
        AND t.TPS_ORDER_ITEM = t3.ENC_NO_ITEM
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
      sql += ` AND t1.LOM_NO_MATNR IN ('${matno}')  `;
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
    fg_material_no,
    nvl(fg_material_desc, ' ') fg_material_desc,
    unrestricted_stock,
    nvl(material_group, ' ') material_group,
    cast_no,
    no_of_pieces,
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
    nvl(processing_flag, ' ') processing_flag,
    STATUS_DESC,
    nvl(FG_MAT_NO, ' ') FG_MAT_NO,
    nvl(FG_MAT_DESC, ' ') FG_MAT_DESC
FROM
    (
        SELECT
            nvl(round((sysdate - LOM_ts_creation), 0), 0) batch_age,
            to_char(LOM_ts_creation, 'DD-MON-YY HH24:MI:SS') creation_date,
            LOM_cd_epa            plant,
            LOM_cd_pack           storage_loc,
            (
                SELECT
                    ewi_wrk_center_no
                FROM
                    v_work_inst
                WHERE
                    ewi_cd_epa = LOM_cd_epa
                    AND ewi_id_batch = LOM_id_first_par
                    AND ewi_cd_status = 'CN'
                    AND ewi_cd_process = SUBSTR(LOM_CD_STATUS,1,1)
                    AND ROWNUM = 1
            ) planned_work_center,
            LOM_work_center       current_work_center,
            enc_mark_cust_name    planned_cust_name,
            LOM_id_batch          batch_id,
            LOM_sec1              thick,
            LOM_sec2              width,
            LOM_idia              idia,
            LOM_length            length,
            LOM_ms_gross_cal      net_wt,
            LOM_ms_gross_actl     gross_wt,
            LOM_id_order_cus      cust_order,
            LOM_id_ord_item_cus   cust_item,
            nvl(round((sysdate - LOM_ts_creation), 0), 0) age_days,
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
                    v_ympct_tub_matl
                WHERE
                    mandt = '600'
                    AND matnr = enc_no_matnr
                    AND ROWNUM = 1
            ) so_grade,
            LOM_tdc_actl          actual_tdc,
            LOM_cd_prod           prod_cd,
            LOM_cd_qlty_actl      qlty,
            LOM_planned_proc      planned_route,
            nvl(a.LOM_no_matnr, enc_no_matnr) fg_material_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = nvl(a.LOM_no_matnr, enc_no_matnr)
                    AND ROWNUM = 1
            ) fg_material_desc,
            LOM_ms_gross_cal      unrestricted_stock,
            enc_print_spec        material_group,
            nvl(eic_no_cast, LOM_no_cast) cast_no,
            LOM_no_pieces         no_of_pieces,
            nvl(LOM_uom, 'Ton') uom,
            LOM_cd_prev_proc      prev_proc,
            LOM_cd_curr_proc      curr_proc,
            LOM_cd_next_proc      next_proc,
            LOM_cd_status         status,
            (
              SELECT TRUNC(SYSDATE - STB_TIMESTAMP)
              FROM V_STATUS_BKUP x
              WHERE STB_ID_COIL = a.LOM_ID_BATCH
              AND STB_NEW_STATUS = a.LOM_CD_STATUS
              AND STB_TIMESTAMP = (SELECT MAX(STB_TIMESTAMP) FROM V_STATUS_BKUP WHERE STB_ID_COIL=x.STB_ID_COIL AND STB_NEW_STATUS=x.STB_NEW_STATUS )
              )  STATUSAGE,
            LOM_id_par_coil_no    parent_batch,
            LOM_id_first_par      mother_batch,
            nvl(round((sysdate - eic_dt_loading), 0), 0) mother_batch_age,
            eic_ms_gross_actl     mother_batch_wt,
            eic_no_matnr          rm_matrl_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eic_no_matnr
                    AND ROWNUM = 1
            ) rm_material_desc,
            nvl(LOM_passed_proc, ' ') actual_route,
            (
                SELECT DISTINCT
                    epl_epa_desc
                FROM
                    v_epa_proc_line
                WHERE
                    epl_active_plant_fl = 'A'
                    AND epl_cd_epa = LOM_cd_epa
                    AND ROWNUM = 1
            ) plant_nm,
            decode(LOM_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                   (SELECT DISTINCT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'E0001' AND  CD_VALUE = LOM_CD_STATUS AND ROWNUM = 1) STATUS_DESC,
                   enc_no_matnr fg_mat_no,
                    (
                        SELECT
                            maktx
                        FROM
                            v_makt
                        WHERE
                            mandt = '600'
                            AND matnr = enc_no_matnr
                            AND ROWNUM = 1
                    ) fg_mat_desc
        FROM
            v_LDP_PRODN          a,
            v_input_coil         b,
            v_end_cust_ord_epa   c
        WHERE
            LOM_cd_epa = eic_cd_epa (+)
            AND LOM_id_first_par = eic_id_coil (+)
            AND a.LOM_cd_epa = c.enc_cd_epa (+)
            AND a.LOM_id_order_cus = c.enc_id_order (+)
            AND a.LOM_id_ord_item_cus = c.enc_no_item (+)
            AND LOM_cd_epa =  ${plant} `;

    let binds = {
      Plant: plant,
    };

    if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
      sql += ` And trunc(LOM_DT_LOADING) BETWEEN :DespFromDate AND :DespToDate`;
      binds["DespFromDate"] = DespFromDate;
      binds["DespToDate"] = DespToDate;
    }

    if (ProdFromDate && ProdFromDate !== "" && ProdToDate !== "") {
      sql += ` And trunc(LOM_TS_CREATION) BETWEEN :ProdFromDate AND :ProdToDate `;
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
      sql += ` And LOM_CD_STATUS Not Like '%L' AND LOM_CD_STATUS NOT LIKE '%U' `;
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
        ORDER by plant,batch_id`;
    console.error("inventory", sql);
    console.error("binds", binds);
    return await query.executeQuery(sql, binds);
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
   WHERE  CD_TYPE = 'TB047B'  
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

export const getInletData = async (data: any) => {
  try {
    let sql = `select
      TO_CHAR(t3.tbp_prod_date,'DD.MM.YYYY')||' & '||t3.tbp_shift date_shift,
      T1.ENC_MARK_CUST_NAME Client,
      t.TCP_SD_POREF_NO PO_ref_no,
      t.TCP_SD_TECH_SPEC SPEC,
      'TSL/COAT/EXT/JE/IOAGPL/01 REV.00 DATE:25.04.2024' Acceptance_Criteria,
      t.tpc_sd_proc_sheet process_sheet_no,
      t1.enc_sec2_max || 'mm OD X ' || t1.enc_sec1_max || 'mm WT' pipe_size,
      t.TCP_SD_IC_TYPE type_of_coating,
      'BPIR/'||TO_CHAR(t3.tbp_prod_date,'YYYYMMDD')||'-1' REP_NO,
      t.TCP_ID_INTELPRO_M Procedure_WI_No,
      t.TCP_ID_INS_INLET1_M Instrument_Name,
      t.TCP_ID_INS_INLET_ID1_M Instrument_ID_SNo,
      t3.tbp_batch_no,
      t2.lom_no_cast Heat_no,
      round(t2.lom_length/1000,2) length,
      t3.TBP_ASL_NO_80,
      t3.tbp_visual_insp_80,
      t3.tbp_prod_date,
      t3.tbp_shift,
      t3.tbp_dia_end_10 
      from v_process_sheet_ec t,
          V_END_CUST_ORD_EPA t1,
          v_ldp_prodn t2,
          v_bare_pdo t3
      where t.TPC_ORDER_ID = t1.ENC_ID_ORDER
      and to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
      and t.TPC_ORDER_ID = t2.lom_id_order_cus
      and to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
      and t3.tbp_batch_no = t2.LOM_ID_BATCH
      and t3.tbp_cd_proc='A' `;

    if (data?.orderNo) {
      sql += ` and t.TPC_ORDER_ID='${data?.orderNo}' `;
    }

    if (data?.item) {
      sql += ` and to_number(t.TPC_ORDER_ITEM)='${data?.item}' `;
    }

    if (data?.crdate) {
      sql += ` and trunc(t3.tbp_prod_date)=to_date('${data?.crdate}','DD-MON-YYYY') `;
    }

    if (data?.shift) {
      sql += ` and t3.tbp_shift='${data?.shift}' `;
    }

    sql += ` order by t3.tbp_prod_date,t3.tbp_dia_end_10`;

    console.log("sql-getInletData: ", sql);

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBlastingData = async (data: any) => {
  try {
    var sql = `select TO_CHAR(t3.tbp_prod_date,'DD.MM.YYYY')||' & '||t3.tbp_shift date_shift,
    T1.ENC_MARK_CUST_NAME Client,
    t.TCP_SD_POREF_NO PO_ref_no,
    t.TCP_SD_TECH_SPEC SPEC,
    'TSL/COAT/'||t.tpc_sd_qap_no1 Acceptance_Criteria,
    t.tpc_sd_proc_sheet process_sheet_no,
    t1.enc_sec2_max || 'mm OD' || ' ' || 'X' || ' ' || t1.enc_sec1_max || 'mm WT' pipe_size,
    t.TCP_SD_IC_TYPE type_of_coating,
    'PABIR'||'/'||TO_CHAR(t3.tbp_prod_date,'YYYYMMDD')||'- 1' REP_NO, 
    t.TCP_ID_INTELPRO_M Procedure_WI_No,
    t.TCP_ID_INS_INLET1_M	Instrument_Name,
    t.TCP_ID_INS_INLET_ID1_M	Instrument_ID_SNo,
    t.TCP_CP1_HTEMP_MIN PTemp_Before_Blast_Min,             
    t.TCP_CP1_HTEMP_MAX PTemp_Before_Blast_Max,
    t.TCP_CP1_PRE_HEAT_MIN PTemp_Before_ACID_Min,
    t.TCP_CP1_PRE_HEAT_MAX PTemp_Before_ACID_Max,
    t.TCP_CP1_DWEL_TIME,t.TCP_CP1_PH_SUR_PIPE,
    T.TCP_CP1_HEATAIRTEMP_MIN	Preheat_Temp_AIRMIN,
    T.TCP_CP1_HEATAIRTEMP_MAX	Preheat_Temp_AIRMAX,
    T.TCP_CP1_ABRA_HUMID,
    T.TCP_CP1_DO_CLEAN,
    T.TCP_CP1_SRUF_MIN ROUGHNESS_MIN,
    T.TCP_CP1_SRUF_MAX ROUGHNESS_MAX,
    T.TCP_CP1_DG_DUST_MAX DEGREE_DUST_RATE_LEVL_MAX,
    T.TCP_CP1_SALT_CONT SALT_CONT_MAX,
    t3.tbp_batch_no,t2.lom_no_cast Heat_no,round(t2.lom_length/1000,2)length,t3.TBP_ASL_NO_80,
    t3.TBP_PIPTMP_BEBLST_100 BLAST,t3.TBP_PIPTMP_BEACID_100 ACID_WASH	,t3.TBP_DWELLTM_100,
    T3.TBP_PH_BEACID_100 B_WATER,
    T3.TBP_PH_AFACID_100 A_WATER,
    t3.tbp_visual_insp_80,
    T3.TBP_PREDM_WA_100 PRESSURE_DM_WATER,
    T3.TBP_DMWA_FRA_1_100	FM_1,
    T3.TBP_DMWA_FRA_2_100	FM_2,
    T3.TBP_DMWA_FRA_3_100	FM_3,
    NVL(T3.TBP_DMWA_FRA_1_100,0)+NVL(T3.TBP_DMWA_FRA_2_100,0)+NVL(T3.TBP_DMWA_FRA_3_100,0)TOT,
    T3.TBP_AIRTEM_AFTWA_100	PREHEAT_AFTER_WATER,T3.TBP_RH_100,t3.TBP_AMBT_TMP_100,t3.TBP_DEW_TMP_100,
    ROUND(t3.TBP_PIPSUR_TEMP_100,1) TBP_PIPSUR_TEMP_100,
    TBP_DEG_CLEAN_100,T3.TBP_DUST_LVLRA_100 DUST_RATING,T3.TBP_DUST_LVLCL_100	DUST_LEVEL,
    T3.TBP_SALT_CONTA_100,T3.TBP_REMARK,
    TBP_PHOSACID_M_100 MANUFACTURE,TBP_PHOSACID_GR_100 GRADE,
    TBP_PHOSACID_BH_100 BATCH,
    t3.tbp_prod_date,t3.tbp_shift,
    t3.tbp_dia_end_10
    from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,v_bare_pdo t3
    where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
    AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
    AND T.TPC_ORDER_ID = t2.lom_id_order_cus
    AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
    AND T3.tbp_batch_no = T2.LOM_ID_BATCH
    AND t3.tbp_cd_proc='B' `;

    if (data?.orderNo) {
      sql += ` AND t.TPC_ORDER_ID = '${data?.orderNo}' `;
    }
    if (data?.item) {
      sql += ` AND TO_NUMBER(t.TPC_ORDER_ITEM) = '${data?.item}' `;
    }
    // if (data?.matno) {
    //   sql += ` AND t1.LOM_NO_MATNR IN ('${data?.matno}')  `;
    // }
    if (data?.crdate) {
      sql += ` AND TRUNC(t3.tbp_prod_date) = TO_DATE('${data?.crdate}', 'DD-MON-YYYY') `;
    }
    // if (data?.heatno) {
    //   sql += ` AND t1.lom_no_cast IN ('${data?.heatno}')  `;
    // }
    // if (data?.pipeno) {
    //   sql += ` AND t2.FPT_ID_PIPE = '${data?.pipeno}' `;
    // }

    // sql += `  order by ID_FIRST_PAR,ID_BATCH,CD_STATUS `;
     sql += ` order by t3.tbp_prod_date,t3.tbp_dia_end_10`;

    console.error("sql-getBlastingData", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log("error-getBlastingData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
