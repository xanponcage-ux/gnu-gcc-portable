import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetreportTyp = async (plant: any) => {
  try {
    const sql = `SELECT 
    CD_VALUE,CD_DESC
    FROM V_CODES
   WHERE  CD_TYPE = 'TB047D'  
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

export const getinternaldata = async (
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
SELECT    TO_CHAR (t3.tbp_prod_date, 'DD.MM.YYYY')
       || ' & '
       || t3.tbp_shift date_shift,
       t1.enc_mark_cust_name client, t.tpi_sd_poref_no po_ref_no,
       t.tpi_sd_tech_spec spec,
       'DSIC' || '/' || TO_CHAR (t3.tbp_prod_date, 'YYYYMMDD') rep_no, 
        'TSL/COAT/' || t.tpi_sd_qap_no acceptance_criteria,
       t.tpi_sd_proc_sheet process_sheet_no,
          t1.enc_sec2_max
       || ' mm OD '
       || 'X '
       || t1.enc_sec1_max
       || ' mm WT' pipe_size,
       t.tpi_sd_ic_type type_of_coating, t.tpi_sd_pro_wino procedure_no,
       t.tpi_cp1_pre_heat_min pipe_surf_min,
       t.tpi_cp1_pre_heat_max pipe_surf_max,
       t.tpi_cp1_chpheatemp_min amb_temp_min,
       t.tpi_cp1_chpheatemp_max amb_temp_max, t.tpi_cp1_abra_humid rh,
       t.tpi_cp1_heatairtemp_min dew_piont_min,
       t.tpi_cp1_heatairtemp_max dew_piont_max,
       t.tpi_cp1_dg_dust_max dust_contamaint_max,
       t.tpi_cp1_do_clean degree_of_clean,
       t.tpi_cp1_sruf_min || 'µm(Rz)' roughness_min,
       t.tpi_cp1_sruf_max || 'µm(Rz)' roughness_max,
       t.tpi_cp1_salt_test salt_cont, t3.tbp_batch_no, t2.lom_no_cast heat_no,
       ROUND (t2.lom_length / 1000, 2) LENGTH, t3.tbp_asl_no_80,
       t3.tbp_prod_date, t3.tbp_shift, t3.tbp_visual_insp_80 visual_blasted,
       t3.tbp_piptmp_beblst_100 pipe_sur_temp_140, t3.tbp_rough_100 rh_140,
       t3.tbp_dust_lvlra_100 dust_conta_140,
       t3.tbp_deg_clean_100 degree_of_clean_140,
       t3.tbp_rough_100 roughness_140, t3.tbp_salt_conta_100 salt_conta_140,
       (SELECT t4.tbp_ambt_tmp_100
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) ambt_temp_150,
       (SELECT t4.tbp_dew_tmp_100
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) dew_point_150,
       (SELECT t4.tbp_visual_insp_80
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) visual_coated,
       (SELECT t4.tbp_wft_f1_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) f_end1,
       (SELECT t4.tbp_wft_f2_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) f_end2,
       (SELECT t4.tbp_wft_f3_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) f_end3,
       (SELECT t4.tbp_wft_f4_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) f_end4,
       (SELECT t4.tbp_wft_t1_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) t_end1,
       (SELECT t4.tbp_wft_t2_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) t_end2,
       (SELECT t4.tbp_wft_t3_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) t_end3,
       (SELECT t4.tbp_wft_t4_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) t_end4,
       (SELECT t4.tbp_me_fend_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) cut_back_f,
       (SELECT t4.tbp_ume_tend_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) cut_back_t,
       (SELECT t4.tbp_rmuse1_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) base_manufacture,
       (SELECT t4.tbp_rmuse2_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) base_batch_no,
       (SELECT t4.tbp_batch1_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) base_grade,
       (SELECT t4.tbp_batch2_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) hardner_manufacture,
       (SELECT t4.tbp_rmuse3_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) hardner_grade,
       (SELECT t4.tbp_batch3_150
          FROM v_bare_pdo t4
         WHERE t4.tbp_cd_proc = 'G'
           AND t4.tbp_batch_no = t3.tbp_batch_no) hardner_batch_no
  FROM v_process_sheet_inc t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_bare_pdo t3
 WHERE t.tpi_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpi_order_item) = t1.enc_no_item
   AND t.tpi_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpi_order_item) = t2.lom_id_ord_item_cus
   AND t3.tbp_batch_no = t2.lom_id_batch
   AND t3.tbp_cd_proc = 'F'
--FILTER COND.
   --AND t.tpi_order_id = '0060977581'
   --AND TO_NUMBER (t.tpi_order_item) = 1
   --AND t3.tbp_prod_date = '02-jul-2026'
   --AND t3.tbp_shift = 'A'
   AND T2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
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

    console.error("getinternaldata", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getpanelTest = async (
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
select TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift date_shift,
T1.ENC_MARK_CUST_NAME MARK_CUST_NAME,
-- t3.prod_dt PRODUCTION_DATE,
TO_CHAR(t3.prod_dt,'DD.MM.YYYY')  PRODUCTION_DATE,
t.TPI_SD_POREF_NO  PO_ref_no,
t.TPI_SD_TECH_SPEC SPEC,
'DSIC'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') REP_NO,   
'TSL/COAT/'||t.TPI_SD_QAP_NO QAP_No,
t.tpi_sd_proc_sheet process_sheet_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TPI_SD_IC_TYPE type_of_coating,
t.TPI_SD_PRO_WINO  Project_name,
t.TPI_ORDER_ID,
t3.charg,t2.lom_no_cast Heat_no,round(t2.lom_length/1000,2)length,
t3.TEST_DESC,'Adhesion Test' AD_test1,t3.CLIENT,'Bend Test' BE_test2,
t3.REF_STD,'Buchhol hardness Test' BU_test3,t3.POSNR,'Curing Test' CU_test4,
--DECODE(t3.TEST_DESC1,'P','Porosity Test',t3.TEST_DESC1) p_test5,
t3.ACEPT_CRET  AD_ACCEPT_CRET_1,
t3.FOANO        BE_ACCEPT_CRET_2,
t3.WINO        BU_ACCEPT_CRET_3,
t3.AC          CU_ACCEPT_CRET_4,
--t3.AC3         P_ACCEPT_CRET_5,
t.TPI_LD_INTERPORO_REFSTD  ref_std_AD_1,
t.TPI_LD_CS_REFSTD  ref_std_BE_2,
t.TPI_LD_24H_REFSTD  ref_std_BU_3,
t.TPI_LD_FLEX_REFSTD  ref_std_CU_4,
--t.TPI_LD_DCURE_REFSTD  ref_std_P_5,
t3.TEST_RESULT  AD_TEST_RESULT1,
t3.COAT_TYPE   BE_TEST_RESULT2,
t3.TR2 BU_TEST_RESULT3,
T3.TR CU_TEST_RESULT4,
--t3.TR3 P_TEST_RESULT5,
T3.REMARK  Ad_REMARKS1,
T3.PIPE_SIZE  Be_REMARKS2,
T3.REPORTNO  Bu_REMARKS3,
T3.REM  Cu_REMARKS4,
--T3.REM1  P_REMARKS5,
SRNO,SRNO1,SRNO2,SRNO3,
INSTRUMENT,INSTRUMENT1,INSTRUMENT2,INSTRUMENT3,  
ID,ID1,ID2,ID3  
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,v_Zcoat_Internal t3
where t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPI_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPI_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
AND T3.TEST_TYPE='A'
--FILTER COND.
--and T3.CHARG = 'QQ1000029' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
    AND T2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
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

    console.error("getpanelTest", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getporositytest = async (
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
    var sql = ` select TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift date_shift,
T1.ENC_MARK_CUST_NAME Client,
t.TPI_SD_POREF_NO  PO_ref_no,
t.TPI_SD_TECH_SPEC SPEC,
'DSIC'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') REP_NO,   
'TSL/COAT/'||t.TPI_SD_QAP_NO QAP_No,
t.tpi_sd_proc_sheet process_sheet_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TPI_SD_IC_TYPE type_of_coating,
t.TPI_SD_PRO_WINO  Project_name,
t.TPI_ORDER_ID,
t3.charg,t2.lom_no_cast Heat_no,round(t2.lom_length/1000,2)length,
t3.TEST_DESC1,'Porosity Test' p_test5,
t3.AC3         P_ACCEPT_CRET_5,
t.TPI_LD_DCURE_REFSTD  ref_std_P_5,
t3.TR3 P_TEST_RESULT5,
T3.REM1  P_REMARKS5
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,v_Zcoat_Internal t3
where t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPI_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPI_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
AND T3.TEST_TYPE='A'
--FILTER COND.
--and T3.CHARG = 'QQ1000029' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
    AND T2.LOM_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }

    if (matno && matno !== "" && matno !== null) {
      sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
      // binds["matno"] = matno;
    }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
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

    console.error("getporositytest", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getsgtest = async (
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
       select T1.ENC_MARK_CUST_NAME Client,
t.TPI_SD_PRO_WINO  Project_name,
t.TPI_SD_POREF_NO  PO_ref_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TPI_SD_IC_TYPE type_of_coating,
'FTR'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') REP_NO,
TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift date_shift,
t.tpi_sd_proc_sheet process_sheet_no,
'TSL/COAT/'||t.TPI_SD_QAP_NO QAP_No,
t.TPI_SD_TECH_SPEC SPEC,
t.TPI_ORDER_ID,
t3.charg,t3.EPOXYBATCH||' '||t3.mat_desc pipe_no_mat_1,t3.hardnerbatch||' '||t3.mat_desc1 pipe_no_mat_2,
'Specific Gravity/Density' test_desc,
t3.TEST_METHOD1 ref_std_1,t3.TEST_METHOD2 ref_std_2,
t3.REQUIRMENT1 ACCEPT_CRET_1,t3.REQUIRMENT2 ACCEPT_CRET_2,
t3.TEST_RESULT1,t3.TEST_RESULT2,
t3.REMARK1,t3.REMARK2
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_Zcoat_Internal t3
where t.tpi_sd_proc_sheet = t3.psno
and t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T3.TEST_TYPE='V'
--FILTER COND.
--and T3.CHARG = '03092026B' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
    AND t1.ENC_CD_EPA = ${plant} `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }

    // if (matno && matno !== "" && matno !== null) {
    //   sql += ` AND t2.lom_NO_MATNR IN ('${matno}')  `;
    //   // binds["matno"] = matno;
    // }

    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }

    // if (heatno && heatno !== "" && heatno !== null) {
    //   sql += ` AND t2.lom_no_cast IN ('${heatno}')  `;
    //   // binds["heatno"] = heatno;
    // }

    // if (pipeno && pipeno !== "" && pipeno !== null) {
    //   sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
    //   // binds["pipeno"] = pipeno;
    // }

    sql += `  order by T3.CHARG `;

    console.error("getsgtest", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getmixpaint = async (
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
       select T1.ENC_MARK_CUST_NAME Client,
t.TPI_SD_PRO_WINO  Project_name,
t.TPI_SD_POREF_NO  PO_ref_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TPI_SD_IC_TYPE type_of_coating,
'FTR'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') REP_NO,
TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift date_shift,
t.tpi_sd_proc_sheet process_sheet_no,
'TSL/COAT/'||t.TPI_SD_QAP_NO QAP_No,
t.TPI_SD_TECH_SPEC SPEC,
t.TPI_ORDER_ID,
t3.charg,
t3.mat_desc ,
t3.EPOXYBATCH ||' '|| t3.hardnerbatch batch_no,
' Mix Paint VISCOSITY'test_desc,
t3.TEST_METHOD,t3.REQUIRMENT,t3.TEST_RESULT,t3.TIME,t3.REMARK,
t3.SRNO,t3.SRNO1,t3.SRNO2,t3.SRNO3,
t3.INSTRUMENT,t3.INSTRUMENT1,t3.INSTRUMENT2,t3.INSTRUMENT3,
t3.ID,t3.ID1,t3.ID2,t3.ID3
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_Zcoat_Internal t3
where t.tpi_sd_proc_sheet = t3.psno
and t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T3.TEST_TYPE='V'
--FILTER COND.
and T3.CHARG = '03092026B' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
AND T1.ENC_CD_EPA  = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY ENC_ID_ORDER, ENC_NO_ITEM  `;

    console.error("getmixpaint", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getpulltest = async (
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
       select T1.ENC_MARK_CUST_NAME  AS Client,
t.TPI_SD_PRO_WINO  AS Project_name,
t.TPI_SD_POREF_NO  AS PO_ref_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' AS pipe_size,
t.TPI_SD_IC_TYPE AS type_of_coating,
t.TPI_SD_TECH_SPEC AS SPEC,
'FTR'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') AS REP_NO,   
TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift AS date_shift,
t.tpi_sd_proc_sheet AS process_sheet_no,
'TSL/COAT/'||t.TPI_SD_QAP_NO AS QAP_No,
t.TPI_ORDER_ID AS ORDER_ID,
'PIPE NO:'||t3.charg AS PIPE_NO_MAT,
 DECODE(T3.TEST_DESC,'PT','Pull of Adhesion Test',T3.TEST_DESC) AS TEST_DESC_1,
 DECODE(T3.CLIENT,'CC','Adhesion Test (Cross cut)',T3.CLIENT) AS TEST_DESC_2,
T3.REMARK AS PT_REMARK,
T3.PIPE_SIZE AS CC_REMARK,
T3.ACEPT_CRET AS PT_ACEPT_CRET,
T3.FOANO AS CC_ACEPT_CRET,
T3.TEST_RESULT AS PT_RESULT,
T3.COAT_TYPE AS CC_RESULT
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,v_Zcoat_Internal t3
where t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPI_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPI_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
AND T3.TEST_TYPE='W'
--FILTER COND.
--and T3.CHARG = 'QQ1000029' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.TPI_ORDER_ID = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.TPI_ORDER_ITEM) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY PIPE_NO_MAT desc `;

    console.error("getpulltest", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const gettaber = async (
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
       select T1.ENC_MARK_CUST_NAME  AS Client,
t.TPI_SD_PRO_WINO  AS Project_name,
t.TPI_SD_POREF_NO  AS PO_ref_no,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' AS pipe_size,
t.TPI_SD_IC_TYPE AS type_of_coating,
t.TPI_SD_TECH_SPEC AS SPEC,
'FTR'||'/'||TO_CHAR(t3.prod_dt,'YYYYMMDD') AS REP_NO,   
TO_CHAR(t3.prod_dt,'DD.MM.YYYY')||' & '||t3.pshift AS date_shift,
t.tpi_sd_proc_sheet AS process_sheet_no,
'TSL/COAT/'||t.TPI_SD_QAP_NO AS QAP_No,
t.TPI_ORDER_ID AS ORDER_ID,
'PIPE NO:'||t3.charg AS PIPE_NO_MAT,
DECODE(t3.REF_STD,'AI','Taber Abrasion test (Index)',t3.REF_STD) TEST_DESC_1,
DECODE(t3.POSNR,'AW','Taber Abrasion test (Weight Loss)',T3.POSNR)TEST_DESC_2, 
DECODE(t3.TEST_DESC1,'AC','aber Abrasion test (Cycles Per Mil)',T3.TEST_DESC1)TEST_DESC_3,
t3.REPORTNO ref_std_1,
t3.REM ref_std_2,
t3.REM1 ref_std_3,
t3.WINO ACEPT_CRET_1,
t3.AC ACEPT_CRET_2,
t3.AC3 ACEPT_CRET_3,
t3.TR2 RESULT_1,
t3.TR RESULT_2,
t3.TR3 RESULT_3,
' ' Remarks
from v_process_sheet_inc t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,v_Zcoat_Internal t3
where t.TPI_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPI_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPI_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPI_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
AND T3.TEST_TYPE='W'
--FILTER COND.
--and T3.CHARG = 'QQ1000029' 
--and t3.prod_dt ='02-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t1.ENC_ID_ORDER = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t1.ENC_NO_ITEM) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prod_dt) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY t1.ENC_ID_ORDER, t1.ENC_NO_ITEM  `;

    console.error("gettaber", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};