import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetreportTyp = async (plant: any) => {
  try {
    const sql = `SELECT 
    CD_VALUE,CD_DESC
    FROM V_CODES
   WHERE  CD_TYPE = 'TB047C'  
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

export const get24or48HrsCDtest = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'CDT'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120,'DD.MM.YYYY') ||' & '||t3.prd_shift_120 DATE_SHIFTQ,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
TO_CHAR(T3.LP3_SDATE_CATH,'DD.MM.YYYY') TEST_ST_DT,
T3.LP3_STIME_CATH TEST_ST_TM,
TO_CHAR(T3.LP3_EDATE_CATH,'DD.MM.YYYY') TEST_ED_DT,
T3.LP3_ETIME_CATH TEST_ED_TIME,
T3.CHARG,TO_CHAR(t3.prd_date_120,'DD.MM.YYYY') COATING_DT,
T.TCP_LD_REF_STD,
(CASE WHEN TCP_LD_OPR_TEMP LIKE '%/%' THEN 
      substr(TCP_LD_OPR_TEMP,1,instr(TCP_LD_OPR_TEMP,'/')-1)||'ºC'
      ||' / '||substr(TCP_LD_OPR_TEMP,instr(TCP_LD_OPR_TEMP,'/')+1)||'V'
      ELSE TCP_LD_OPR_TEMP end )ld_opr_temp,
TCP_LD_TEST_DUR,
'Max. radius of disbondment  '||T.TCP_LD_DH_MAX||' mm' Acceptance_Criteria,
t3.LP3_CDTEST_24H_48H result,
' '  remarks,
t3.LP3_RAW_MAT1,
t3.LP3_RAW_MAT2  ,
t3.LP3_RAW_MAT3  ,
t3.LP3_MFACTURE1  ,
t3.LP3_MFACTURE2  ,
t3.LP3_MFACTURE3  ,
t3.LP3_GRADE1  ,
t3.LP3_GRADE2  ,
t3.LP3_GRADE3  ,
t3.LP3_BATCH1  ,
t3.LP3_BATCH2  ,
t3.LP3_BATCH3  
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND t3.LP3_CDTEST_24H_48H is not null
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--  and T3.CHARG = 'QQ1000031' 
--  and t3.prd_date_120 ='07-JUL-2026' 
--  AND t3.prd_shift_120 ='D'
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

    console.error("get24or48HrsCDtest", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const get28or30DaysCDTestReport = async (
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
SELECT t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
          t1.enc_sec2_max
       || ' mm OD '
       || 'X '
       || t1.enc_sec1_max
       || ' mm WT' pipe_size,
       t.TCP_CP1_CO_APPLI PROJECTNAME,
       t.tcp_sd_tech_spec spec, t.tcp_sd_ic_type type_of_coating,
       'CDT' || '/' || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no, t.tpc_order_id,
       t.tpc_order_item, t3.prd_date_120 || ' & ' || t3.prd_shift_120,
       TO_CHAR(t3.prd_date_120,'DD.MM.YYYY') ||' & '||t3.prd_shift_120 DATE_SHIFTQ,
       SYSDATE, 'D' shift, t.tpc_sd_proc_sheet process_sheet_no,
       t.tcp_ld_cd_28dn_refstd reference_std_n,
       t.tcp_ld_cd_28d_refstd reference_std_h,
       (CASE
           WHEN t.tcp_ld_28dn_oprtemp LIKE '%/%'
              THEN    SUBSTR (t.tcp_ld_28dn_oprtemp,
                              1,
                              INSTR (t.tcp_ld_28dn_oprtemp, '/') - 1
                             )
                   || 'ºC'
                   || ' / '
                   || SUBSTR (t.tcp_ld_28dn_oprtemp,
                              INSTR (t.tcp_ld_28dn_oprtemp, '/') + 1
                             )
                   || 'V'
           ELSE tcp_ld_opr_temp
        END
       ) operating_temp_n,
       (CASE
           WHEN t.tcp_ld_cd_28d_oprtemp LIKE '%/%'
              THEN    SUBSTR (t.tcp_ld_cd_28d_oprtemp,
                              1,
                              INSTR (t.tcp_ld_cd_28d_oprtemp, '/') - 1
                             )
                   || 'ºC'
                   || ' / '
                   || SUBSTR (t.tcp_ld_cd_28d_oprtemp,
                              INSTR (t.tcp_ld_cd_28d_oprtemp, '/') + 1
                             )
                   || 'V'
           ELSE tcp_ld_opr_temp
        END
       ) operating_temp_h,
       t.tcp_ld_28dn_testdur test_dur_n, t.tcp_ld_cd_28d_testdur test_dur_h,
       TO_CHAR (t3.cdt_sdate_cath1, 'DD.MM.YYYY') test_st_dt,
       t3.cdt_stime_cath1 test_st_tm,
       TO_CHAR (t3.cdt_edate_cath1, 'DD.MM.YYYY') test_ed_dt,
       t3.cdt_etime_cath1 test_ed_time, t3.charg,
       TO_CHAR (t3.prd_date_120, 'DD.MM.YYYY') coating_dt,
          'Max. radius of disbondment <= '
       || t.tcp_ld_cd_28dn_max
       || ' mm' acceptance_criteria_n,
          'Max. radius of disbondment <='
       || t.tcp_ld_cd_28d_max
       || ' mm' acceptance_criteria_h,
       t3.cdt_cd_min result_n, t3.cdt_cdtest_28d_30dh result_h, ' ' remarks,
       t3.cdt_raw_mat1, t3.cdt_raw_mat2, t3.cdt_raw_mat3, t3.cdt_mfacture1,
       t3.cdt_mfacture2, t3.cdt_mfacture3, t3.cdt_grade1, t3.cdt_grade2,
       t3.cdt_grade3, t3.cdt_batch1, t3.cdt_batch2, t3.cdt_batch3
  FROM v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
   AND t3.cdt_cdtest_28d_30dh is not null
--FILTER COND.
  -- AND t3.charg = 'Q20000026'
  -- AND t3.prd_date_120 = '13-JUL-2026'
--AND t3.prd_shift_120 ='D'
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

    console.error("get28or30DaysCDTestReport", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCROSSSECTIONINTERFACEPOROSITY = async (
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
    var sql = ` SELECT 
       t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
          t1.enc_sec2_max
       || ' mm OD '
       || 'X '
       || t1.enc_sec1_max
       || ' mm WT' pipe_size,
       t.TCP_CP1_CO_APPLI PROJECTNAME,
       t.tcp_sd_tech_spec spec, t.tcp_sd_ic_type type_of_coating,
       'LTR/C' || '&' || 'IP' || '/' || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no,
       t.tpc_order_id, t.tpc_order_item,
      TO_CHAR(t3.prd_date_120,'DD.MM.YYYY') ||' & '||t3.prd_shift_120 DATE_SHIFTQ,
       t3.prd_date_120 || ' & ' || t3.prd_shift_120, SYSDATE, 'D' shift,
       t.tpc_sd_proc_sheet process_sheet_no,
--==================
       'FBE COATED PIPE (2 SAMPLE)' mat_desc,
       'PIPE NO: ' || t3.charg batch_no, 'CROSS SECTION POROSITY' test_dec1,
       'INTERFACE POROSITY' test_dec2, t.tcp_ld_cs_refstd test_method1,
       t.tcp_ld_interporo_refstd test_method2, t.tcp_ld_cs_min requirement1,
       t.tcp_ld_interporo_min requirement2,
       t3.lcp_cross_section1 test_result_cross1,
       t3.lcp_cross_section2 test_result_cross2,
       t3.lcp_interface1 test_result_interace1,
       t3.lcp_interface2 test_result_interace2, ' ' remarks
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
   -- AND t3.charg = 'Q20000026'
   -- AND t3.prd_date_120 = '13-JUL-2026'
--AND t3.prd_shift_120 ='D'
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

    console.error("getCROSSSECTIONINTERFACEPOROSITY", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getdegreeofcure = async (
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
       t1.enc_mark_cust_name client, t.tcp_sd_poref_no po_ref_no,
          t1.enc_sec2_max
       || ' mm OD '
       || 'X '
       || t1.enc_sec1_max
       || ' mm WT' pipe_size,
       t.TCP_CP1_CO_APPLI PROJECTNAME,
       t.tcp_sd_tech_spec spec, t.tcp_sd_ic_type type_of_coating,
       'LTR/DOC' || '/' || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no,
       t.tpc_order_id, t.tpc_order_item,
       t3.prd_date_120 || ' & ' || t3.prd_shift_120, SYSDATE, 'D' shift,
       t.tpc_sd_proc_sheet process_sheet_no, t.tpc_sd_qap_no1 qap_no,
       'CURED EPOXY FROM COATED PIPE' mat_desc,
       'PIPE NO: ' || t3.charg pipe_no, 'DEGREE OF CURE' test_desc,
       t.tcp_ld_dcure_refstd test_method,
              TO_CHAR(t3.prd_date_120,'DD.MM.YYYY') ||' & '||t3.prd_shift_120 DATE_SHIFTQ,
       DECODE (t.tcp_ld_tag_min,
               NULL, UNISTR ('\x394') || 'Tg ' || t.tcp_ld_tag_max,
                  UNISTR ('\x394')
               || 'Tg'
               || t.tcp_ld_tag_min
               || ','
               || UNISTR ('\x394')
               || 'Tg '
               || t.tcp_ld_tag_max
              ) req_tg,
       DECODE (t.tcp_ld_degree_cure_max,
               NULL, 'CURE = Min ' || t.tcp_ld_degree_cure_min || '%',
                  'CURE = Min '
               || t.tcp_ld_degree_cure_min
               || '%'
               || ', CURE = Max '
               || t.tcp_ld_degree_cure_max
               || '%'
              ) req_tg,
       '% CURE = ' || lcp_doc_test1 test_result_dc1,
       '% CURE = ' || lcp_doc_test2 test_result_dc2,
       '% CURE = ' || lcp_doc_test3 test_result_dc3,
       '% CURE = ' || lcp_doc_test4 test_result_dc4,
       UNISTR ('\x394') || 'Tg =' || lcp_tag_test1 || '°C' test_result_tg1,
       UNISTR ('\x394') || 'Tg =' || lcp_tag_test2 || '°C' test_result_tg2,
       UNISTR ('\x394') || 'Tg =' || lcp_tag_test3 || '°C' test_result_tg3,
       UNISTR ('\x394') || 'Tg =' || lcp_tag_test4 || '°C' test_result_tg4,
       lcp_doc_remarks
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
   --AND t3.charg = 'Q20000026'
   --AND t3.prd_date_120 = '13-JUL-2026'
   --AND t3.prd_shift_120 ='D'
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

    console.error("getdegreeofcure", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getelongationrep = async (
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
    Client,
    PO_ref_no,
    PROJECTNAME,
    pipe_size,
    SPEC,
    type_of_coating,
    REP_NO,
    tpc_order_id,
    tpc_order_item,
    COATING_DATE,
    COATING_SHIFT,
    process_sheet_no,
    qap_no,
    CHARG,
    BATCH_NO,
    REQ_VALUE,
    TEST_NO,
    ACHIEVED_VALUE,
    REMARKS
FROM
(
     SELECT
        T1.ENC_MARK_CUST_NAME                                          AS Client,
        t.TCP_SD_POREF_NO                                              AS PO_ref_no,
        t.TCP_CP1_CO_APPLI AS PROJECTNAME,
        t1.enc_sec2_max || ' mm OD X ' || t1.enc_sec1_max || ' mm WT'  AS pipe_size,
        t.TCP_SD_TECH_SPEC                                             AS SPEC,
        t.TCP_SD_IC_TYPE                                               AS type_of_coating,
        'ETR' || '/' || TO_CHAR(SYSDATE, 'YYYYMMDD')                  AS REP_NO,
        t.tpc_order_id,
        t.tpc_order_item,
        TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT'            AS COATING_DATE,
        t3.prd_shift_120                                               AS COATING_SHIFT,
        t.tpc_sd_proc_sheet                                            AS process_sheet_no,
        t.tpc_sd_qap_no1                                               AS qap_no,
        T3.CHARG,
        'HDPE-B.NO.'                                                   AS BATCH_NO,
        T.TCP_LD_ELONG_TEST_MIN                                        AS REQ_VALUE,
        T3.LP3_ELONG_TEST1                                             AS TEST1,
        T3.LP3_ELONG_TEST2                                             AS TEST2,
        T3.LP3_ELONG_TEST3                                             AS TEST3,
        T3.LP3_ELONG_TEST4                                             AS TEST4,
        T3.LP3_ELONG_TEST5                                             AS TEST5,
        T3.LP3_ELONG_TEST6                                             AS TEST6,
        ' '                                                            AS REMARKS
    from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
)
UNPIVOT (
    ACHIEVED_VALUE FOR TEST_NO IN (
        TEST1 AS 'TEST1',
        TEST2 AS 'TEST2',
        TEST3 AS 'TEST3',
        TEST4 AS 'TEST4',
        TEST5 AS 'TEST5',
        TEST6 AS 'TEST6'
    )
)
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item, TEST_NO  `;

    console.error("getelongationrep", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFLEXIBILITYTEST3LPE = async (
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
    Client,
    PO_ref_no,
    PROJECTNAME,
    pipe_size,
    SPEC,
    type_of_coating,
    REP_NO,
    tpc_order_id,
    tpc_order_item,
    COATING_DATE,
    COATING_SHIFT,
    process_sheet_no,
    qap_no,
    PIPE_NO,
    category,
    requirement,
    REQUIRED_MANDREL,
    USED_MANDREL,
    ACHIEVED_VALUE,
    REMARKS
FROM
(
select T1.ENC_MARK_CUST_NAME Client,
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/DOC'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
T3.CHARG PIPE_NO,'3LPE' category,
t.TCP_LD_FLEX_3LPE requirement,
t3.LP3_FLX3_INS_NAME  REQUIRED_MANDREL,
t3.LP3_FLX3_INS_ID  USED_MANDREL,
t3.LP3_FLEX_3LPE_T1||' Found'  ACHIEVED_VALUE1,
t3.LP3_FLEX_3LPE_T2||' Found'  ACHIEVED_VALUE2,
t3.LP3_FLEX_3LPE_T3||' Found'  ACHIEVED_VALUE3,
' ' remarks
--=====================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
AND T2.LOM_CD_EPA = ${plant}
)
UNPIVOT (
    ACHIEVED_VALUE FOR TEST_NO IN (
        ACHIEVED_VALUE1 AS 'ACHIEVED_VALUE1',
        ACHIEVED_VALUE2 AS 'ACHIEVED_VALUE2',
        ACHIEVED_VALUE3 AS 'ACHIEVED_VALUE3'
    )
)
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item, TEST_NO  `;

    console.error("getFLEXIBILITYTEST3LPE", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFLEXIBILITYTESTREPORTFBE = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'FTR/DOC'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
T3.CHARG PIPE_NO,' FBE' category,
t.TCP_LD_FLEXI_FBE requirement  ,
'Required Mandrel radius ='|| t3.LCP_FLX_INS_NAME||' mm' REQUIRED_MANDREL,
'Used Mandrel radius ='|| t3.LCP_FLX_INS_ID||' mm '   USED_MANDREL,
t3.LCP_FLEXTEST1||t3.LCP_FLEXTEST2||t3.LCP_FLEXTEST3||t3.LCP_FLEXTEST4||t3.LCP_FLEXTEST5  ACHIEVED_VALUE1,
t3.LCP_FLEXTEST2  ACHIEVED_VALUE2,
t3.LCP_FLEXTEST3  ACHIEVED_VALUE3,
t3.LCP_FLEXTEST4  ACHIEVED_VALUE4,
t3.LCP_FLEXTEST5  ACHIEVED_VALUE5,
' ' remarks
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getFLEXIBILITYTESTREPORTFBE", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHARDNESSTEST = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/DOC'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
'PIPE No.'||T3.CHARG Mat_desc ,
t3.CDT_HRD_INS_NAME Batch_no,
'Hardness Test' Test_desc,
t.TCP_LD_HARDH_REFSTD	Test_method,
t.TCP_LD_3LPE_REFSTD	requirement,
t3.CDT_HARDNESS	test_result,
' ' remarks
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getHARDNESSTEST", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHOTWATERADHESIONTEST24HRS = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/HWI'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
'Partially/FBE Coated Pipe Sample' Mat_desc,
'PIPE No:-'||T3.CHARG Batch_no ,
'HOT WATER ADHESION TEST For 24 Hrs. at'||TCP_LD_ADHETEST_UNIT	 Test_desc,
t.TCP_LD_24H_REFSTD Test_method,
t.TCP_LD_24H_ADHETEST_MIN	|| TCP_LD_24H_ADHETEST_MAX	requirement,
t3.LCP_ADHT_MIN	test_result1,
t3.LCP_ADHT_MIN_1	test_result2,
t3.LCP_ADHT_MIN_2	test_result3,
' ' remarks,
t3.LCP_SDATE_24H1 strt_dt_time,
t3.LCP_EDATE_24H1 end_dt_time
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getHOTWATERADHESIONTEST24HRS", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getproductstablilty = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/PS'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
'Extruded Polyethylene' Mat_desc,
'PIPE No:-'||T3.CHARG Batch_no ,
'Product Stability TestProduct Stability Test'  Test_desc,
t.TCP_LD_ELONG_REFSTD Test_method,
UNISTR('\x394')||t.TCP_LD_PRDSTABL_MIN ||' between raw material and app applied material'  requirement,
UNISTR('\x394')||'MFR= '||t3.CDT_PRDSTABL_MIN 	test_result1
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getproductstablilty", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const gettensile = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/PS'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
'PIPE No:-'||T3.CHARG Mat_desc,
T3.CDT_TAN_INS_NAME Batch_no ,
'Tensile Strength'  Test_desc,
t.TCP_LD_TENSILE_REFSTD	Test_method,
t.TCP_LD_ELON_REFSTD requirement,
t3.CDT_TENSILE	test_result1
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("gettensile", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHOTWATERIMMERSION48 = async (
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
t.TCP_SD_POREF_NO PO_ref_no,
t.TCP_CP1_CO_APPLI PROJECTNAME,
t1.enc_sec2_max || ' mm OD ' || 'X '|| t1.enc_sec1_max ||' mm WT' pipe_size,
t.TCP_SD_TECH_SPEC SPEC,
t.TCP_SD_IC_TYPE type_of_coating,
'LTR/HWI'||'/'||TO_CHAR(sysdate,'YYYYMMDD') REP_NO, 
t.tpc_order_id,t.tpc_order_item,
TO_CHAR(t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' COATING_DATE,
t3.prd_shift_120 COATING_SHIFT,
sysdate,'D' shift,
t.tpc_sd_proc_sheet process_sheet_no,
t.tpc_sd_qap_no1 qap_no,
--=====================================
'3LPE COATED PIPE SAMPLE' Mat_desc,
'PIPE No:-'||T3.CHARG Batch_no ,
'HOT WATER IMMERSION TEST FOR 48 HRS. at 80+-3'  Test_desc,
t.TCP_LD_48H_REFSTD	 Test_method,
t.TCP_LD_HOTWATER_MIN  requirement,
t3.ACP_TEST_RESULT  test_result1,
t3.ACP_TEST_RESULT1  test_result2,
t3.ACP_TEST_RESULT2  test_result3,
' ' remarks,
t3.ACP_SDATE_48H2	strt_dt_time,
t3.ACP_EDATE_48H2 end_dt_time
--=======================================
from v_process_sheet_ec t ,V_END_CUST_ORD_EPA t1,v_ldp_prodn t2,V_zcoat_lab t3
where t.TPC_ORDER_ID = t1.ENC_ID_ORDER 
AND to_number(t.TPC_ORDER_ITEM) = t1.ENC_NO_ITEM
AND T.TPC_ORDER_ID = t2.lom_id_order_cus
AND to_number(t.TPC_ORDER_ITEM) = t2.lom_id_ord_item_cus
AND T3.CHARG = T2.LOM_ID_BATCH
--FILTER COND.
--and T3.CHARG = 'Q20000026' 
--and t3.prd_date_120 ='13-JUL-2026' 
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getHOTWATERIMMERSION48", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getINDENTATIONTEST = async (
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
       
SELECT t1.enc_mark_cust_name client,
       t.tcp_sd_poref_no po_ref_no,
       t.tcp_cp1_co_appli projectname,
          t1.enc_sec2_max
       || ' mm OD '
       || 'X '
       || t1.enc_sec1_max
       || ' mm WT' pipe_size,
       t.tcp_sd_tech_spec spec, t.tcp_sd_ic_type type_of_coating,
       'LTR/HWI' || '/' || TO_CHAR (SYSDATE, 'YYYYMMDD') rep_no,
       t.tpc_order_id, t.tpc_order_item,
       TO_CHAR (t3.prd_date_120, 'DD.MM.YYYY') || ' & PQT' coating_date,
       t3.prd_shift_120 coating_shift, SYSDATE, 'D' shift,
       t.tpc_sd_proc_sheet process_sheet_no, t.tpc_sd_qap_no1 qap_no,
       t3.lp3_sdate_indt strt_dt_time, t3.lp3_edate_indt end_dt_time,
       --TO_CHAR (t3.lp3_sdate_indt, 'DD.MM.YYYY') strt_dt_time,
       --TO_CHAR (t3.lp3_edate_indt, 'DD.MM.YYYY') end_dt_time,
        t3.LP3_STIME_INDT START_time,
        t3.LP3_ETIME_INDT end_time,
          'Max. '
       || t.tcp_ld_inden_rom_max
       || ' mm '
       || '@ '
       || t.tcp_cp2_pipe_identif
       || 'ºC and Max. '
       || tcp_ld_inden_hot_max
       || ' mm '
       || '@ '
       || t.tcp_cp2_low_stres_punch
       || 'ºC' acceptance_criteria, 
--=====================================
       t3.charg pipe_no, t.tcp_cp2_pipe_identif temp_test_cond_1,
       t.tcp_cp2_low_stres_punch temp_test_cond_2,
--cold
       t3.lp3_initial_cold sample_icold1, 
       t3.lp3_initial_cold1 sample_cold2,
       t3.lp3_initial_cold2 sample_cold3, 
       t3.lp3_finalrd_cold sample_fcold1,
       t3.lp3_finalrd_cold1 sample_fcold2, 
       t3.lp3_finalrd_cold2 sample_fcold3,
       t3.lp3_result_cold sample_cresult1,
       t3.lp3_result_cold1 sample_cresult2,
       t3.lp3_result_cold2 sample_cresult3,
--hot
      t3.lp3_initial_hot sample_ihot1,
       t3.lp3_initial_hot1 sample_ihot2, t3.lp3_initial_hot2 sample_ihot3,
       t3.lp3_finalrd_hot sample_fhot1, t3.lp3_finalrd_hot1 sample_fhot2,
       t3.lp3_finalrd_hot2 sample_fhot3, t3.lp3_result_hot sample_hresult1,
       t3.lp3_result_hot1 sample_hresult2, t3.lp3_result_hot2 sample_hresult3,
       t.tcp_ld_ind_refstd reference_std, ' ' remarks
--=======================================
FROM   v_process_sheet_ec t,
       v_end_cust_ord_epa t1,
       v_ldp_prodn t2,
       v_zcoat_lab t3
 WHERE t.tpc_order_id = t1.enc_id_order
   AND TO_NUMBER (t.tpc_order_item) = t1.enc_no_item
   AND t.tpc_order_id = t2.lom_id_order_cus
   AND TO_NUMBER (t.tpc_order_item) = t2.lom_id_ord_item_cus
   AND t3.charg = t2.lom_id_batch
--FILTER COND.
--AND t3.charg = 'QQ1000029'
--and t3.prd_date_120 ='13-JUL-2026'
--AND t3.prd_shift_120 ='D'
 AND T2.LOM_CD_EPA = ${plant}
    `;

    if (orderNo && orderNo !== "" && orderNo !== null) {
      sql += ` AND t.tpc_order_id = '${orderNo}' `;
      // binds["orderNo"] = orderNo;
    }

    if (item && item !== "" && item !== null) {
      sql += ` AND TO_NUMBER(t.tpc_order_item) = '${item}' `;
      // binds["item"] = item;
    }


    if (crdate && crdate !== "" && crdate !== null) {
      // sql += ` AND TRUNC(t2.FPT_CRT_DT) = '${crdate}'  `;
      sql += ` AND TRUNC(t3.prd_date_120) = TO_DATE('${crdate}', 'DD-MON-YYYY') `;
    }


    if (pipeno && pipeno !== "" && pipeno !== null) {
      sql += ` AND t3.charg = '${pipeno}' `; // changed BETWEEN to =
      // binds["pipeno"] = pipeno;
    }

    sql += ` ORDER BY tpc_order_id, tpc_order_item  `;

    console.error("getINDENTATIONTEST", sql);
    console.error("binds");
    return await query.executeQuery(sql);
  } catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};