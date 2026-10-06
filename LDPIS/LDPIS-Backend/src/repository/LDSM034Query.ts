import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getStatusList = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT LOM_CD_STATUS FROM V_LDP_PRODN 
    WHERE 
    LOM_CD_EPA= :plant  
    AND LOM_CD_STATUS IN ('MQ' , 'KQ') `;
    // const sql = `select SUBSTR(CD_VALUE,6,2) LOM_CD_STATUS from v_codes
    // where cd_type='TB008'
    // AND SUBSTR(CD_VALUE,1,4)=:plant
    // AND SUBSTR(CD_VALUE,6,2) LIKE '%Q' -- this tab will give decision for %Q only
    // ORDER BY 1`;
    let binds = { plant: plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrderList = async (plant: any, statusList: any) => {
  try {
    const sql = ` SELECT DISTINCT
    LOM_id_order_cus
    || ' - '
    || LOM_ID_PAR_COIL_NO
    || ' - '
    || LOM_no_matnr,
    LOM_id_order_cus
    || ' - '
    || LOM_ID_PAR_COIL_NO
FROM
    v_LDP_PRODN
WHERE
    LOM_cd_epa = :plant
    AND LOM_cd_status = :statuslist`;
    let binds = { plant: plant, statusList: statusList };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMBatchData = async (orderList: any) => {
  try {
    const sql = `SELECT DISTINCT LOM_ID_FIRST_PAR FROM V_LDP_PRODN WHERE LOM_ID_ORDER_CUS=:orderList`;
    let binds = { orderList: orderList };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getQualityResultData = async (
  plant: any,
  ORDERID: any,
  ITEM: any,
  MATERIAL: any,
  MOTHER_BATCH: any,
  LOM_NO_CAST: any,
  BATCH_ID: any
) => {
  try {
    const sql = `
    SELECT A.* 
            , (SELECT NVL(TCO_TEST_PARA_REM,TCO_TEST_PARA_VAL) FROM V_TC_COIL_TEST WHERE TCO_PROD_NO=:BATCH_ID AND TCO_CAST_NO=:LOM_NO_CAST AND TCO_LAB_TEST_CD = CODE_VALUE AND TCO_TEST_PARA = TC_ELEMENT AND  ROWNUM=1) actual_record_val ,
            (  SELECT COUNT(1) FROM V_CODES WHERE CD_TYPE='TB011' AND CD_VALUE=TC_ELEMENT ) DROP_CHK
                FROM
                (
                SELECT DISTINCT TQP_PARAM_CD CODE_VALUE, TQP_PARAM_ATTR TC_ELEMENT, TQP_PARAM_DESC CODE_DESC, TQP_OPER_ID, TQP_TS_REC_CREATE 
                            , TQP_SEQ, '' REMARKS, 0 VALUE, TSL_PARA_MIN INT_MIN_SPEC_VAL, TSL_PARA_MAX INT_MAX_SPEC_VAL, TSL_PARA_UNIT CODE_SUB_DESC, '' CODE_SUB_VALUE 
                            , '' IP, '' CP, '' ISI_NO, '' LICENSE_NO, '' MATERIAL_NO 
                            FROM V_QLTY_PARAM, V_TDC_SPEC_LIMIT 
                            WHERE TQP_PARAM_CD = TSL_TDC_NO 
                            AND TQP_PARAM_ATTR = TSL_TEST_PARA 
                            AND TQP_PARAM_CD IN ( 
                            SELECT MAX(DISTINCT(IP)) FROM V_YMQMT_INSP_PLAN 
                            WHERE MANDT = '600' AND SPEC IN (                            
                            SELECT DISTINCT(ENC_MATNR_SPEC) FROM V_END_CUST_ORD_EPA 
                            WHERE ENC_CD_EPA = :PLANT AND ENC_ID_ORDER = :ORDERID AND ENC_NO_ITEM = :ORDERITEM))
                            UNION 
                            SELECT '' CODE_VALUE, TCA_TEST_PARA TC_ELEMENT, '' CODE_DESC, '' TQP_OPER_ID, TRUNC(SYSDATE) TQP_TS_REC_CREATE 
                            , 0 TQP_SEQ, TCA_TEST_PARA_REM REMARKS, TCA_TEST_PARA_VAL VALUE, 0 INT_MIN_SPEC_VAL, 0 INT_MAX_SPEC_VAL, '' CODE_SUB_DESC, '' CODE_SUB_VALUE 
                            , '' IP, '' CP, '' ISI_NO, '' LICENSE_NO, '' MATERIAL_NO 
                            FROM V_TC_CAST_TEST_TUB 
                            WHERE TCA_CAST_NO = :CASTNO 
                            AND TCA_TEST_PARA NOT IN (SELECT DISTINCT(CD_VALUE) FROM V_CODES WHERE CD_TYPE = 'EPA255' AND SUBSTR(CD_DESC,1,4) = :PLANT) 
                )A ORDER BY A.TQP_SEQ`;

    let binds = {
      PLANT: plant,
      ORDERID: ORDERID,
      ORDERITEM: ITEM,
      CASTNO: LOM_NO_CAST,
      BATCH_ID: MOTHER_BATCH,
      LOM_NO_CAST: LOM_NO_CAST,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDisplayData = async (
  batch: any,
  item: any,
  mBatch: any,
  order: any,
  plant: any,
  status: any,
  tdc: any
) => {
  try {
    let sql = `SELECT
    nvl(LOM_cd_next_proc, '') LOM_cd_next_proc,
    nvl(LOM_id_first_par, '') mother_batch,
    nvl(LOM_id_batch, '') batch_id,
    nvl(LOM_cd_qlty_actl, '') quality,
    nvl(LOM_cd_status, '') status,
    nvl(LOM_cd_prod, '') product,
    nvl(LOM_ms_gross_cal, '') net_wt,
    nvl(LOM_cd_curr_proc, '') current_process,
    nvl(LOM_sec1, '') thickness,
    nvl(LOM_id_order_cus, '') orderid,
    nvl(LOM_id_ord_item_cus, '') item,
    nvl(LOM_no_matnr, '') material,
    nvl(maktx, '') mat_description,
    LOM_planned_proc,
    nvl((
        SELECT
            grade
        FROM
            v_ympct_tub_matl
        WHERE
            mandt = '600'
            AND matnr = LOM_no_matnr
    ), '') grade,
    nvl(LOM_act_length, '') rolling_length,
    '' yield,
    nvl((
        SELECT
            spec
        FROM
            v_ympct_tub_matl
        WHERE
            mandt = '600'
            AND matnr = LOM_no_matnr
    ), '') spec,
    nvl(LOM_idia, '') sec_size,
    nvl(LOM_no_pieces, '') no_prime_tube,
    nvl(LOM_ms_piece_actl, '') gross_wt,
    nvl(LOM_no_cast, '') LOM_no_cast,
    nvl((
        SELECT
            enc_mark_cust_name
        FROM
            v_end_cust_ord_epa
        WHERE
            enc_cd_epa = :plant
            AND enc_id_order = LOM_id_order_cus
            AND enc_no_item = LOM_id_ord_item_cus
    ), '') customer,
    nvl((
        SELECT
            decode(epl_production_type, 'SFG', 'SFG', 'FG', 'FG',
                   'WIP') production_type
        FROM
            v_epa_proc_line
        WHERE
            epl_cd_epa = :plant
            AND epl_cd_process = LOM_cd_curr_proc
    ), '') prod_type,
    nvl(LOM_sec2, '') LOM_sec2,
    nvl(LOM_odia, '') LOM_odia,
    nvl(LOM_idia, '') LOM_idia,
    nvl(to_char(LOM_prod_end_tm, 'YYMMDDHH24MI'), '') prod_end_tm,
    nvl(to_char(LOM_prod_strt_tm, 'YYMMDDHH24MI'), '') prod_strt_tm,
    nvl(LOM_no_pieces, '') LOM_no_pieces,
    nvl(LOM_passed_proc, '') LOM_passed_proc,
    (
        SELECT
            to_char(epr_dt_prodn_tata, 'DD-MON-YYYY HH24:MI')
        FROM
            v_epa_line_prodn
        WHERE
            epr_cd_epa = LOM_cd_epa
            AND epr_id_batch = LOM_id_batch
            AND epr_cd_process = 'M'
            AND ROWNUM = 1
    ) crt_dt,
    nvl(LOM_tdc_actl, '') LOM_tdc_actl,
    nvl(LOM_work_center, '') LOM_work_center,
    nvl((
        SELECT
            enc_length_min
        FROM
            v_end_cust_ord_epa
        WHERE
            enc_cd_epa = LOM_cd_epa
            AND enc_id_order = LOM_id_order_cus
            AND enc_no_item = LOM_id_ord_item_cus
    ), 0) so_length,
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
    LOM_id_par_coil_no par_coil_no
FROM
    v_LDP_PRODN left
    JOIN v_makt ON LOM_no_matnr = matnr
WHERE
    LOM_cd_epa = :plant
    AND LOM_cd_qlty_actl NOT IN (
        SELECT
            cd_value
        FROM
            v_codes
        WHERE
            cd_type = 'EPA62'
    )
    AND LOM_id_par_coil_no = :mbatch
    AND ( LOM_cd_status LIKE '%Q'
          OR LOM_cd_status LIKE '%D'
          OR LOM_cd_status = 'KB' )
    AND LOM_id_batch NOT IN (
        SELECT
            tco_prod_no
        FROM
            v_tc_coil_test
        WHERE
            tco_prod_no = :mbatch
    ) `;
    let binds = {
      plant: plant,
      mBatch: mBatch,
    };

    if (batch && batch !== "") {
      sql += ` And LOM_ID_BATCH =NVL(:batch, LOM_ID_BATCH)`;
      binds["batch"] = batch;
    }

    if (item && item !== "") {
      sql += ` And NVL(LOM_id_ord_item_cus,0) = NVL(:item, NVL(LOM_id_ord_item_cus, 0))`;
      binds["item"] = item;
    }

    if (mBatch && mBatch !== "") {
      sql += ` And LOM_id_par_coil_no = NVL(:mBatch, LOM_id_par_coil_no)`;
      binds["mBatch"] = mBatch;
    }

    if (order && order !== "") {
      // sql += ` And NVL(LOM_ID_ORDER,0) = NVL(:orderID, NVL(LOM_ID_ORDER, 0))`;
      sql += ` AND LOM_id_order_cus = NVL(:orderID , LOM_id_order_cus) `;
      binds["orderID"] = order;
    }

    if (status && status !== "") {
      sql += ` and LOM_CD_STATUS = NVL(:status , LOM_CD_STATUS)`;
      binds["status"] = status;
    }

    if (tdc && tdc !== "") {
      sql += ` and LOM_TDC_ACTL = NVL(:tdc , LOM_TDC_ACTL)`;
      binds["tdc"] = tdc;
    }

    // sql += ` ORDER  BY LOM_CD_STATUS, LOM_ID_BATCH`;
    sql += ` ORDER BY LOM_ID_BATCH , LOM_SEC2 , LOM_id_order_cus `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const countQualityTestData = async (
  plant: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  TEST_CODE: any,
  TEST_PARAMETER: any,
  TEST_REMARK: any,
  TEST_VALUE: any,
  personalNo: any,
  LOM_NO_CAST: any
) => {
  try {
    const sql = `SELECT COUNT(*) COUNT FROM V_TC_COIL_TEST WHERE TCO_CAST_NO = :LOM_NO_CAST AND TCO_PROD_NO = :BATCH_ID 
    AND TCO_LAB_TEST_CD = :TEST_CODE AND TCO_TEST_PARA = :TEST_PARAMETER`;

    const binds = {
      // MOTHER_BATCH: MOTHER_BATCH,
      // BATCH_ID: BATCH_ID,
      BATCH_ID: MOTHER_BATCH,
      TEST_CODE: TEST_CODE,
      TEST_PARAMETER: TEST_PARAMETER,
      // TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
      // TEST_VALUE: TEST_VALUE ? TEST_VALUE : "" ,
      // personalNo: personalNo,
      LOM_NO_CAST: LOM_NO_CAST,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getCATEGORY = async (FG_MAT: any) => {
  try {
    const sql = `select CATEGORY from v_ympct_tub_matl
    where matnr= :FG_MAT`;

    const binds = {
      FG_MAT: FG_MAT,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHydraDt = async (plant: any, BATCH_ID: any) => {
  try {
    const sql = `select  TO_CHAR(MAX(EPR_DT_PRODN_TATA),'DD-MM-YYYY') HYDRA_DT
    from V_EPA_LINE_PRODN
   where EPR_CD_EPA= :plant
   AND EPR_ID_BATCH= :BATCH_ID
   AND EPR_CD_CURR_PROC ='H'
   GROUP BY EPR_ID_BATCH`;

    const binds = {
      plant: plant,
      BATCH_ID: BATCH_ID,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateQualityTestData = async (
  plant: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  TEST_CODE: any,
  TEST_PARAMETER: any,
  TEST_REMARK: any,
  TEST_VALUE: any,
  personalNo: any,
  LOM_NO_CAST: any,
  up_res_tag: any,
  TCO_TEST_PARA_REM: any,
  TCO_TEST_PARA_VAL: any,
  wire_dt: any
) => {
  try {
    if (TEST_VALUE != "") {
      if (!isNaN(TEST_VALUE)) {
        let sql = `UPDATE 
        V_TC_COIL_TEST 
      SET 
        TCO_OPR_REMARKS = :TEST_REMARK, 
        TCO_TEST_PARA_VAL = :TEST_VALUE, 
        TCO_UP_RESULT_TAG =:up_res_tag, 
        TCO_UPD_DT = SYSDATE,
        TCO_TEST_PARA_VAL_WIRE = :wire_dt
      WHERE 
        TCO_CAST_NO = :LOM_NO_CAST 
        AND TCO_PROD_NO = :BATCH_ID 
        AND TCO_LAB_TEST_CD = :TEST_CODE 
        AND TCO_TEST_PARA = :TEST_PARAMETER`;

        let binds = {
          BATCH_ID: MOTHER_BATCH,
          TEST_CODE: TEST_CODE,
          TEST_PARAMETER: TEST_PARAMETER,
          TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
          TEST_VALUE: TEST_VALUE != null ? TEST_VALUE : "",
          LOM_NO_CAST: LOM_NO_CAST,
          up_res_tag: up_res_tag,
          wire_dt: wire_dt?.toString(),
        };
        return await query.executeQuery(sql, binds);
      } else {
        let sql = `UPDATE 
        V_TC_COIL_TEST 
      SET 
        TCO_OPR_REMARKS = :TEST_REMARK, 
        TCO_TEST_PARA_REM = :TEST_VALUE, 
        TCO_UP_RESULT_TAG =:up_res_tag, 
        TCO_UPD_DT = SYSDATE,
        TCO_TEST_PARA_VAL_WIRE = :wire_dt
      WHERE 
        TCO_CAST_NO = :LOM_NO_CAST 
        AND TCO_PROD_NO = :BATCH_ID 
        AND TCO_LAB_TEST_CD = :TEST_CODE 
        AND TCO_TEST_PARA = :TEST_PARAMETER`;

        let binds = {
          BATCH_ID: MOTHER_BATCH,
          TEST_CODE: TEST_CODE,
          TEST_PARAMETER: TEST_PARAMETER,
          TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
          TEST_VALUE: TEST_VALUE != null ? TEST_VALUE : "",
          LOM_NO_CAST: LOM_NO_CAST,
          up_res_tag: up_res_tag,
          wire_dt: wire_dt?.toString(),
        };
        return await query.executeQuery(sql, binds);
      }
    } else {
      let sql = `UPDATE 
      V_TC_COIL_TEST 
    SET 
      TCO_OPR_REMARKS = :TEST_REMARK,
      TCO_TEST_PARA_REM = :TCO_TEST_PARA_REM,
      TCO_TEST_PARA_VAL = :TCO_TEST_PARA_VAL, 
      TCO_UP_RESULT_TAG =:up_res_tag, 
      TCO_UPD_DT = SYSDATE ,
      TCO_TEST_PARA_VAL_WIRE = :wire_dt
    WHERE 
      TCO_CAST_NO = :LOM_NO_CAST 
      AND TCO_PROD_NO = :BATCH_ID 
      AND TCO_LAB_TEST_CD = :TEST_CODE 
      AND TCO_TEST_PARA = :TEST_PARAMETER`;

      let binds = {
        BATCH_ID: MOTHER_BATCH,
        TEST_CODE: TEST_CODE,
        TEST_PARAMETER: TEST_PARAMETER,
        TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
        TCO_TEST_PARA_REM: TCO_TEST_PARA_REM,
        TCO_TEST_PARA_VAL: TCO_TEST_PARA_VAL != null ? TCO_TEST_PARA_VAL : "",
        LOM_NO_CAST: LOM_NO_CAST,
        up_res_tag: up_res_tag,
        wire_dt: wire_dt?.toString(),
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const changeQualityTestData = async (
  plant: any,
  selectedFirstTableData: any,
  selectedSecondTableData: any,
  personalNo: any,
  up_res_tag: any
) => {
  try {
    let sql = `UPDATE v_tc_coil_test
    SET
        tco_test_para_rem = :tco_test_para_rem,
        tco_test_para_val = :tco_test_para_val,
        tco_up_result_tag = :up_res_tag,
        tco_upd_dt = sysdate,
        tco_upd_by = substr(user, 1, 10),
        --tco_lab_test_cd = :tco_lab_test_cd,
        tco_source_pgm = 'LDSM034_CHG'
    WHERE
        tco_cast_no = :tco_cast_no
        AND tco_prod_no = :tco_prod_no
        AND tco_test_para = :tco_test_para
        AND tco_crt_by <> 'TSMTUBEPI'`;

    var binds: any;
    if (selectedSecondTableData.TEST_VALUE) {
      binds = {
        tco_test_para_rem: isNaN(selectedSecondTableData.TEST_VALUE)
          ? selectedSecondTableData.TEST_VALUE
          : null,
        tco_test_para_val: !isNaN(selectedSecondTableData.TEST_VALUE)
          ? parseFloat(selectedSecondTableData.TEST_VALUE)
          : null,
        //tco_lab_test_cd: selectedFirstTableData.LOM_TDC_ACTL,
        tco_cast_no: selectedFirstTableData.LOM_NO_CAST,
        tco_prod_no: selectedFirstTableData.BATCH_ID,
        tco_test_para: selectedSecondTableData.TEST_PARAMETER,
        up_res_tag: up_res_tag,
      };
    } else {
      binds = {
        tco_test_para_rem: selectedSecondTableData.TCO_TEST_PARA_REM,
        tco_test_para_val: selectedSecondTableData.TCO_TEST_PARA_VAL,
        //tco_lab_test_cd: selectedFirstTableData.LOM_TDC_ACTL,
        tco_cast_no: selectedFirstTableData.LOM_NO_CAST,
        tco_prod_no: selectedFirstTableData.BATCH_ID,
        tco_test_para: selectedSecondTableData.TEST_PARAMETER,
        up_res_tag: up_res_tag,
      };
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertQualityTestData = async (
  plant: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  TEST_CODE: any,
  TEST_PARAMETER: any,
  TEST_REMARK: any,
  TEST_VALUE: any,
  personalNo: any,
  LOM_NO_CAST: any,
  up_res_tag: any,
  TCO_TEST_PARA_REM: any,
  TCO_TEST_PARA_VAL: any,
  wire_dt: any
) => {
  try {
    if (isNaN(TEST_VALUE)) {
      let sql = `INSERT INTO  V_TC_COIL_TEST  (
        TCO_CAST_NO,
        TCO_PROD_NO,
        TCO_LAB_TEST_CD,
        TCO_TEST_PARA,
        TCO_OPR_REMARKS,
        TCO_TEST_PARA_REM,
        TCO_CRT_DT,
        TCO_CRT_BY,
        TCO_UP_RESULT_TAG,
        TCO_TEST_PARA_VAL_WIRE)
      VALUES (
        :LOM_NO_CAST ,
        :BATCH_ID ,
        :TEST_CODE , 
        :TEST_PARAMETER , 
        :TEST_REMARK ,
        :TEST_VALUE,
        SYSDATE,
        :personalNo,
        :up_res_tag,
        :wire_dt )`;

      let binds = {
        BATCH_ID: MOTHER_BATCH,
        TEST_CODE: TEST_CODE,
        TEST_PARAMETER: TEST_PARAMETER,
        TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
        TEST_VALUE: TEST_VALUE != null ? TEST_VALUE : "",
        personalNo: personalNo,
        LOM_NO_CAST: LOM_NO_CAST,
        up_res_tag: up_res_tag,
        wire_dt: wire_dt?.toString(),
      };
      return await query.executeQuery(sql, binds);
    } else {
      let sql = `INSERT INTO  V_TC_COIL_TEST  (
        TCO_CAST_NO,
        TCO_PROD_NO,
        TCO_LAB_TEST_CD,
        TCO_TEST_PARA,
        TCO_OPR_REMARKS,
        TCO_TEST_PARA_REM,
        TCO_TEST_PARA_VAL,
        TCO_CRT_DT,
        TCO_CRT_BY,
        TCO_UP_RESULT_TAG,
        TCO_TEST_PARA_VAL_WIRE)
      VALUES (
        :LOM_NO_CAST ,
        :BATCH_ID ,
        :TEST_CODE , 
        :TEST_PARAMETER , 
        :TEST_REMARK ,
        :TCO_TEST_PARA_REM ,
        :TCO_TEST_PARA_VAL,
        SYSDATE,
        :personalNo,
        :up_res_tag,
        :wire_dt )`;

      let binds = {
        BATCH_ID: MOTHER_BATCH,
        TEST_CODE: TEST_CODE,
        TEST_PARAMETER: TEST_PARAMETER,
        TEST_REMARK: TEST_REMARK ? TEST_REMARK : "",
        TCO_TEST_PARA_REM: TCO_TEST_PARA_REM ? TCO_TEST_PARA_REM : "",
        //TCO_TEST_PARA_VAL: TCO_TEST_PARA_VAL ? TCO_TEST_PARA_VAL : "",
        TCO_TEST_PARA_VAL: TEST_VALUE != null ? TEST_VALUE : "",
        personalNo: personalNo,
        LOM_NO_CAST: LOM_NO_CAST,
        up_res_tag: up_res_tag,
        wire_dt: wire_dt?.toString(),
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDefectRecording = async (
  plant: any,
  MOTHER_BATCH: any,
  CURRENT_PROCESS: any,
  BATCH_ID: any,
  selLen: any
) => {
  try {
    //   const sql = `SELECT ESR_RSN_CD ,ESR_RSN_DESC
    // FROM V_SCRP_SEC_RSN
    // WHERE ESR_CD_EPA=:plant
    // AND ESR_STATUS='A'
    // ORDER BY TO_NUMBER(ESR_RSN_CD)`;

    let sql = ``,
      binds = {};
    if (selLen == 1) {
      sql = `SELECT DISTINCT TBD_ID_BATCH,ESR_RSN_CD ,ESR_RSN_DESC, TBD_DEFECT_NO_PCS,TBD_DEFECT_WT,TBD_DEFECT_WT TBD_DEFECT_WT1 
    FROM V_SCRP_SEC_RSN  LEFT OUTER JOIN V_BATCH_DEFECT 
    ON  ESR_CD_ePA = TBD_CD_EPA
    AND ESR_RSN_CD = TBD_RSN_CD
    WHERE ESR_CD_EPA=:plant
    AND TBD_ID_BATCH = NVL(:BATCH_ID ,TBD_ID_BATCH)
    AND TBD_ID_FIRST_PAR = NVL(:MOTHER_BATCH,TBD_ID_FIRST_PAR)
    AND TBD_CD_PROC = NVL(:CURRENT_PROCESS ,TBD_CD_PROC)
    AND ESR_STATUS='A'
    ORDER BY TO_NUMBER(ESR_RSN_CD) `;

      binds = {
        plant: plant,
        MOTHER_BATCH: MOTHER_BATCH,
        CURRENT_PROCESS: CURRENT_PROCESS,
        BATCH_ID: BATCH_ID,
      };
    } else {
      sql = `
    SELECT ESR_RSN_CD , ESR_RSN_DESC , '' TBD_DEFECT_NO_PCS
    FROM V_SCRP_SEC_RSN
    WHERE ESR_CD_EPA=:plant
    AND ESR_STATUS='A'
    ORDER BY TO_NUMBER(ESR_RSN_CD) `;

      binds = {
        plant: plant,
      };
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertDefectRecording = async (
  ESR_RSN_CD: any,
  TBD_DEFECT_NO_PCS: any,
  TBD_DEFECT_WT: any,
  personalNo: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  CURRENT_PROCESS: any,
  plant: any
) => {
  try {
    const sql = `Insert into V_BATCH_DEFECT
    (TBD_CD_EPA, TBD_ID_BATCH, TBD_ID_FIRST_PAR, TBD_CD_PROC, TBD_RSN_CD, TBD_DEFECT_NO_PCS, TBD_DEFECT_WT, TBD_CRT_BY, TBD_CRT_ON, TBD_PROG_ID )
 Values
    (:plant , :BATCH_ID , :MOTHER_BATCH , :CURRENT_PROCESS , :ESR_RSN_CD , :TBD_DEFECT_NO_PCS , :TBD_DEFECT_WT, :personalNo , SYSDATE, 'LDSM034')`;

    const binds = {
      ESR_RSN_CD: ESR_RSN_CD,
      TBD_DEFECT_NO_PCS: TBD_DEFECT_NO_PCS,
      TBD_DEFECT_WT: TBD_DEFECT_WT,
      personalNo: personalNo,
      MOTHER_BATCH: MOTHER_BATCH,
      BATCH_ID: BATCH_ID,
      CURRENT_PROCESS: CURRENT_PROCESS,
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDefectRecordingCount = async (
  ESR_RSN_CD: any,
  plant: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  CURRENT_PROCESS: any
) => {
  try {
    const sql = `SELECT COUNT(*) FROM V_BATCH_DEFECT WHERE
      TBD_CD_EPA = :plant AND
      TBD_ID_BATCH = :BATCH_ID AND
      TBD_ID_FIRST_PAR = :MOTHER_BATCH AND
      TBD_CD_PROC = :CURRENT_PROCESS AND
      TBD_RSN_CD = :ESR_RSN_CD`;

    const binds = {
      ESR_RSN_CD: ESR_RSN_CD,
      plant: plant,
      MOTHER_BATCH: MOTHER_BATCH,
      BATCH_ID: BATCH_ID,
      CURRENT_PROCESS: CURRENT_PROCESS,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateDefectRecording = async (
  ESR_RSN_CD: any,
  TBD_DEFECT_NO_PCS: any,
  TBD_DEFECT_WT: any,
  personalNo: any,
  MOTHER_BATCH: any,
  BATCH_ID: any,
  CURRENT_PROCESS: any,
  plant: any
) => {
  try {
    const sql = `UPDATE V_BATCH_DEFECT
    SET
    TBD_DEFECT_NO_PCS = :TBD_DEFECT_NO_PCS,
    TBD_DEFECT_WT = :TBD_DEFECT_WT,
    TBD_UPD_ON = SYSDATE ,
    TBD_UPD_BY = :personalNo
    WHERE
    TBD_CD_EPA = :plant AND
    TBD_ID_BATCH = :BATCH_ID AND
    TBD_ID_FIRST_PAR = :MOTHER_BATCH AND
    TBD_CD_PROC = :CURRENT_PROCESS AND
    TBD_RSN_CD = :ESR_RSN_CD
    `;

    const binds = {
      ESR_RSN_CD: ESR_RSN_CD,
      TBD_DEFECT_NO_PCS: TBD_DEFECT_NO_PCS,
      TBD_DEFECT_WT: TBD_DEFECT_WT,
      personalNo: personalNo,
      MOTHER_BATCH: MOTHER_BATCH,
      BATCH_ID: BATCH_ID,
      CURRENT_PROCESS: CURRENT_PROCESS,
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getItem = async (plant: any, orderId: any) => {
  try {
    const sql = `SELECT DISTINCT EOP_NO_ITEM FROM V_EPA_ORDER_PROG
    WHERE EOP_CD_ePA= :plant
    AND EOP_ID_ORDER = :orderId
    ORDER BY 1`;

    const binds = {
      plant: plant,
      orderId: orderId,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDataDeci = async (
  plant: any,
  batch: any,
  status: any,
  coil: any
) => {
  try {
    // let sql = `,SELECT LOM_CD_EPA , LOM_ID_BATCH, LOM_ID_FIRST_PAR ,LOM_CD_PROD,LOM_CD_QLTY_AIM,LOM_CD_QLTY_ACTL,LOM_MS_GROSS_ACTL,LOM_MS_PIECE_ACTL,LOM_MS_GROSS_CAL,LOM_SEC1,LOM_SEC2,
    //             LOM_LENGTH,LOM_TDC_AIM,LOM_TDC_ACTL,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_CD_ST_ACTL,LOM_CD_STATUS,LOM_CD_CURR_PROC,LOM_CD_NEXT_PROC,ENC_CUST_NAME
    //              , LOM_WFL_STATUS,LOM_PROD_HOLD
    //             FROM   V_LDP_PRODN, V_END_CUST_ORD_EPA WHERE  LOM_CD_EPA   = :plant  AND    ENC_ID_ORDER(+) = LOM_ID_ORDER_CUS
    //             AND    ENC_NO_ITEM(+)  = LOM_ID_ORD_ITEM_CUS AND    ENC_CD_EPA(+)   = LOM_CD_EPA AND ( LOM_CD_STATUS LIKE '%D' OR LOM_CD_STATUS LIKE '%Q' OR LOM_CD_STATUS = 'ZZ') `;

    //     let sql = `SELECT
    //     NVL(LOM_cd_epa , ' ') LOM_cd_epa,
    //     NVL(LOM_id_batch , ' ') LOM_id_batch,
    //     NVL(LOM_id_first_par , ' ') LOM_id_first_par,
    //     NVL(LOM_cd_prod , ' ') LOM_cd_prod,
    //     NVL(LOM_cd_qlty_aim , ' ') LOM_cd_qlty_aim,
    //     NVL(LOM_cd_qlty_actl , ' ') LOM_cd_qlty_actl,
    //     NVL(LOM_ms_gross_actl , 0) LOM_ms_gross_actl,
    //     NVL(LOM_ms_piece_actl , 0) LOM_ms_piece_actl,
    //     NVL(LOM_ms_gross_cal , 0) LOM_ms_gross_cal,
    //     NVL(LOM_sec1 , 0) LOM_sec1,
    //     NVL(LOM_sec2 , 0) LOM_sec2,
    //     NVL(LOM_length , 0) LOM_length,
    //     NVL(LOM_tdc_aim , ' ') LOM_tdc_aim,
    //     NVL(LOM_tdc_actl , ' ') LOM_tdc_actl,
    //     NVL(LOM_id_order_cus , ' ') LOM_id_order_cus,
    //     NVL(LOM_id_ord_item_cus , 0) LOM_id_ord_item_cus,
    //     NVL(LOM_cd_st_actl , ' ') LOM_cd_st_actl,
    //     NVL(LOM_cd_status , ' ') LOM_cd_status,
    //     NVL(LOM_cd_curr_proc , ' ') LOM_cd_curr_proc,
    //     NVL(LOM_cd_next_proc , ' ') LOM_cd_next_proc,
    //     NVL(enc_cust_name , ' ') enc_cust_name,
    //     NVL(LOM_wfl_status , ' ') LOM_wfl_status,
    //     NVL(LOM_prod_hold , ' ') LOM_prod_hold,
    //     NVL(LOM_NO_MATNR , ' ') MATNO,
    //     NVL(MAKTX , ' ') MAT_DESC
    // FROM
    //     v_LDP_PRODN ,
    //     v_end_cust_ord_epa,
    //     v_makt
    // WHERE
    //     LOM_cd_epa = :plant
    //     AND enc_id_order (+) = LOM_id_order_cus
    //     AND enc_no_item (+) = LOM_id_ord_item_cus
    //     AND enc_cd_epa (+) = LOM_cd_epa
    //     AND LOM_NO_MATNR (+)= MATNR
    //     AND ( LOM_cd_status LIKE '%D'
    //           OR LOM_cd_status LIKE '%Q'
    //           OR LOM_cd_status = 'ZZ' ) `;

    let sql = `SELECT A.* , NVL(B.EHR_CD_RSN_HOLD , ' ') HOLD_CD , NVL(B.EHR_OP_REMARKS , ' ') OPR_REMARKS ,
NVL((SELECT CD_DESC FROM V_EPA_HOLD_RSN WHERE CD_HOLD =B.EHR_CD_RSN_HOLD AND CD_COMP='1000'), ' ') HOLD_DESC
FROM (
SELECT
    NVL(LOM_CD_EPA , ' ') LOM_CD_EPA,
    NVL(LOM_ID_BATCH , ' ') LOM_ID_BATCH,
    NVL(LOM_ID_FIRST_PAR , ' ') LOM_ID_FIRST_PAR,
    NVL(LOM_CD_PROD , ' ') LOM_CD_PROD,
    NVL(LOM_CD_QLTY_AIM , ' ') LOM_CD_QLTY_AIM,
    NVL(LOM_CD_QLTY_ACTL , ' ') LOM_CD_QLTY_ACTL,
    NVL(LOM_MS_GROSS_ACTL , 0) LOM_MS_GROSS_ACTL,
    NVL(LOM_MS_PIECE_ACTL , 0) LOM_MS_PIECE_ACTL,
    NVL(LOM_MS_GROSS_CAL , 0) LOM_MS_GROSS_CAL,
    NVL(LOM_SEC1 , 0) LOM_SEC1,
    NVL(LOM_SEC2 , 0) LOM_SEC2,
    NVL(LOM_LENGTH , 0) LOM_LENGTH,
    NVL(LOM_TDC_AIM , ' ') LOM_TDC_AIM,
    NVL(LOM_TDC_ACTL , ' ') LOM_TDC_ACTL,
    NVL(LOM_ID_ORDER_CUS , ' ') LOM_ID_ORDER_CUS,
    NVL(LOM_ID_ORD_ITEM_CUS , 0) LOM_ID_ORD_ITEM_CUS,
    NVL(LOM_CD_ST_ACTL , ' ') LOM_CD_ST_ACTL,
    NVL(LOM_CD_STATUS , ' ') LOM_CD_STATUS,
    NVL(LOM_CD_CURR_PROC , ' ') LOM_CD_CURR_PROC,
    NVL(LOM_CD_NEXT_PROC , ' ') LOM_CD_NEXT_PROC,
    NVL(ENC_CUST_NAME , ' ') ENC_CUST_NAME,
    NVL(LOM_WFL_STATUS , ' ') LOM_WFL_STATUS,
    NVL(LOM_PROD_HOLD , ' ') LOM_PROD_HOLD,
    NVL(LOM_NO_MATNR , ' ') MATNO,
    NVL(MAKTX , ' ') MAT_DESC
FROM
    V_LDP_PRODN,
    V_END_CUST_ORD_EPA,
    V_MAKT
WHERE
    LOM_CD_EPA = :plant
    AND ENC_ID_ORDER (+) = LOM_ID_ORDER_CUS
    AND ENC_NO_ITEM (+) = LOM_ID_ORD_ITEM_CUS
    AND ENC_CD_EPA (+) = LOM_CD_EPA
    AND  MATNR (+)=  LOM_NO_MATNR
    AND ( LOM_CD_STATUS LIKE '%D'
    OR LOM_CD_STATUS LIKE '%Q'
    OR LOM_CD_STATUS = 'ZZ' )
    )  A LEFT JOIN V_EPA_MATL_HOLD_RLS B ON EHR_CD_EPA = LOM_CD_EPA AND EHR_ID_BATCH = LOM_ID_BATCH
    AND EHR_TS_HOLD = (SELECT MAX(EHR_TS_HOLD) FROM V_EPA_MATL_HOLD_RLS WHERE EHR_CD_ePA = B.EHR_CD_ePA AND EHR_ID_BATCH =B.EHR_ID_BATCH)
    WHERE LOM_ID_BATCH=NVL(:batch,LOM_ID_BATCH) AND LOM_CD_STATUS <> 'MQ' AND LOM_CD_QLTY_ACTL <> 'SCRP' `;
    const binds = {
      plant: plant,
      batch: batch,
    };

    // if (batch && batch !== "") {
    //   sql += ` AND LOM_ID_BATCH = :batch `;
    //   binds["batch"] = batch;
    // }

    if (status && status !== "") {
      if (status == "%D" || status == "%Q") {
        sql += ` AND LOM_CD_STATUS LIKE :status`;
      } else if (status == "ZZ") {
        sql += ` AND LOM_CD_STATUS = :status`;
      }
      // sql += ` AND LOM_CD_STATUS = :status `;
      binds["status"] = status;
    }

    if (coil && coil !== "") {
      sql += ` AND LOM_ID_BATCH = :coil`;
      binds["coil"] = coil;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveQADeci = async (
  P_PLANT: any,
  P_BATCH: any,
  P_STATUS: any,
  P_CURR_PROC: any,
  P_NEXT_PROC: any,
  P_RADIO_VALUE: any,
  P_QLTY_ACTL: any,
  P_TDC: any,
  P_CUST_ORD: any,
  P_CUST_ITEM: any,
  P_SEC_QLTY: any,
  P_SEC_TDC: any,
  P_PROC: any, // process line
  P_TDC_NO: any,
  P_SEC_NO_MATNR: any,
  P_GROSS_CAL: any,
  P_RSN_CD: any,
  P_RSN_CAT: any,
  P_RSN_DESC: any,
  P_PARAM_CUST: any,
  P_DECISION_REM: any
) => {
  try {
    let sql = `call SPCB034(
      P_PLANT => :P_PLANT ,       
      P_BATCH => :P_BATCH ,
      P_STATUS => :P_STATUS ,
      P_CURR_PROC => :P_CURR_PROC ,
      P_NEXT_PROC => :P_NEXT_PROC ,
      P_RADIO_VALUE => :P_RADIO_VALUE ,
      P_QLTY_ACTL => :P_QLTY_ACTL ,
      P_TDC => :P_TDC ,
      P_CUST_ORD => :P_CUST_ORD ,
      P_CUST_ITEM => :P_CUST_ITEM ,
      P_SEC_QLTY  => :P_SEC_QLTY ,
      P_SEC_TDC => :P_SEC_TDC ,
      P_PROC   => :P_PROC ,
      P_TDC_NO => :P_TDC_NO ,
      P_SEC_NO_MATNR => :P_SEC_NO_MATNR ,
      P_GROSS_CAL => :P_GROSS_CAL ,
      P_RSN_CD  => :P_RSN_CD ,
      P_RSN_CAT => :P_RSN_CAT ,
      P_RSN_DESC => :P_RSN_DESC ,
      P_PARAM_CUST => :P_PARAM_CUST ,
      P_DECISION_REM => :P_DECISION_REM,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    const binds = {
      P_PLANT: P_PLANT,
      P_BATCH: P_BATCH,
      P_STATUS: P_STATUS,
      P_CURR_PROC: P_CURR_PROC,
      P_NEXT_PROC: P_NEXT_PROC,
      P_RADIO_VALUE: P_RADIO_VALUE,
      P_QLTY_ACTL: P_QLTY_ACTL,
      P_TDC: P_TDC,
      P_CUST_ORD: P_CUST_ORD,
      P_CUST_ITEM: P_CUST_ITEM,
      P_SEC_QLTY: P_SEC_QLTY,
      P_SEC_TDC: P_SEC_TDC,
      P_PROC: P_PROC, //null
      P_TDC_NO: P_TDC_NO, //null
      P_SEC_NO_MATNR: P_SEC_NO_MATNR, //material no
      P_GROSS_CAL: P_GROSS_CAL,
      P_RSN_CD: P_RSN_CD,
      P_RSN_CAT: P_RSN_CAT, //null
      P_RSN_DESC: P_RSN_DESC, //null
      P_PARAM_CUST: P_PARAM_CUST, //null
      P_DECISION_REM: P_DECISION_REM,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getQlty = async () => {
  try {
    let sql = `SELECT IQL_CD_QLTY,IQL_DS_QLTY,IQL_GRADE,IQL_GRADE_DESC FROM V_QUALITY WHERE IQL_PS_INDICATOR NOT IN ('T','L') ORDER BY 1`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTdc = async () => {
  try {
    let sql = `SELECT DISTINCT EAT_TDC_NO FROM V_EPA_ARISING_TDC ORDER BY 1`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAddlProcess = async (plant: any, curr_proc: any) => {
  try {
    // let sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :plant ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let sql;
    let binds;
    if (plant == "0788") {
      sql = `Select EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :plant  ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;

      binds = {
        plant: plant,
      };
    } else {
      sql = `select SUBSTR(CD_DESC,4,1) from v_codes
      where cd_type='TB016'
      AND CD_VALUE =:plant -- PLANT
      AND SUBSTR(CD_DESC,1,1) = :curr_proc --- CURR_PROCESS
      `;
      binds = {
        plant: plant,
        curr_proc: curr_proc,
      };
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatNo = async (plant: any) => {
  try {
    let sql = `SELECT TDM_MATNR_NO , TDM_NO_MATNR_DESC FROM V_DOWNGRADE_MATL
    WHERE TDM_CD_PLANT=:plant 
    union
    SELECT DISTINCT A.MATNR , A.MAKTX  FROM V_YMPCT_TUB_MATL A ,V_MARC B
    WHERE A.MANDT = B.MANDT AND A.MATNR = B.MATNR AND B.WERKS= :plant   AND A.mandt='600'
    and CATEGORY like 'DWG%'
    ORDER BY 1`;
    var binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getmatnoDiverted = async (plant: any) => {
  try {
    let sql = `SELECT CD_VALUE
    FROM V_CODES WHERE CD_TYPE='TB036'
    and CD_DESC=:PLANT`;
    var binds = {
      PLANT: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveUD = async (
  plant: any,
  BATCH_ID: any,
  LOM_IDIA: any,
  LOM_NO_CAST: any,
  LOM_NO_PIECES: any,
  LOM_ODIA: any,
  LOM_PASSED_PROC: any,
  LOM_SEC2: any,
  ITEM: any,
  MATERIAL: any,
  MOTHER_BATCH: any,
  NET_WT: any,
  ORDERID: any,
  PROD_END_TM: any,
  PROD_STRT_TM: any,
  stor: any,
  personalNo: any,
  flag: any,
  sch_id: any,
  THICKNESS: any,
  LOM_WORK_CENTER: any
) => {
  try {
    //
    // let sql = `call TTSB002(
    //   P_PLANT => :P_PLANT ,
    //   P_FLAG => :P_FLAG ,
    //   P_ORD_ID => :P_ORD_ID ,
    //   P_CUST_ITEM => :P_CUST_ITEM ,
    //   P_SCH_ID => :P_SCH_ID ,
    //   P_BATCH => :P_BATCH ,
    //   P_MOTH_BATCH => :P_MOTH_BATCH ,
    //   P_MATNR_TARGET => :P_MATNR_TARGET,
    //   P_MATNR_SOURCE => :P_MATNR_SOURCE ,
    //   P_STOR => :P_STOR ,
    //   P_NET_QTY => :P_NET_QTY ,
    //   P_GRS_QTY => :P_GRS_QTY ,
    //   P_CAST_NO => :P_CAST_NO ,
    //   P_PROC_PATH => :P_PROC_PATH ,
    //   P_NO_PIECE => :P_NO_PIECE ,
    //   P_STRT_TM => TO_CHAR(TO_DATE(:P_STRT_TM ,'DD-MON-YY', 'NLS_DATE_LANGUAGE = English'),'YYMMDDHHMI'),
    //   P_END_TM => TO_CHAR(TO_DATE(:P_END_TM ,'DD-MON-YY', 'NLS_DATE_LANGUAGE = English'),'YYMMDDHHMI'),
    //   P_SEC1 => :P_SEC1 ,
    //   P_SEC2 => :P_SEC2 ,
    //   P_ODIA => :P_ODIA ,
    //   P_IDIA => :P_IDIA ,
    //   P_INV_LOSS_WT => :P_INV_LOSS_WT ,
    //   P_WORK_CENT  => :P_WORK_CENT ,
    //   P_USER => :P_USER ,
    //   LS_OUT_FLAG => :LS_OUT_FLAG
    // )`;

    let sql = `call TTSB002(
      P_PLANT => :P_PLANT ,
      P_FLAG => :P_FLAG ,
      P_ORD_ID => :P_ORD_ID ,
      P_CUST_ITEM => :P_CUST_ITEM ,
      P_SCH_ID => :P_SCH_ID ,
      P_BATCH => :P_BATCH ,
      P_MOTH_BATCH => :P_MOTH_BATCH ,
      P_MATNR_TARGET => :P_MATNR_TARGET,
      P_MATNR_SOURCE => :P_MATNR_SOURCE ,
      P_STOR => :P_STOR ,     
      P_NET_QTY => :P_NET_QTY ,
      P_GRS_QTY => :P_GRS_QTY ,
      P_CAST_NO => :P_CAST_NO ,
      P_PROC_PATH => :P_PROC_PATH ,
      P_NO_PIECE => :P_NO_PIECE ,
      P_STRT_TM => :P_STRT_TM,
      P_END_TM => :P_END_TM ,
      P_SEC1 => :P_SEC1 ,
      P_SEC2 => :P_SEC2 ,
      P_ODIA => :P_ODIA ,
      P_IDIA => :P_IDIA ,
      P_INV_LOSS_WT => :P_INV_LOSS_WT , 
      P_WORK_CENT  => :P_WORK_CENT ,
      P_USER => :P_USER ,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    const binds = {
      P_PLANT: plant,
      P_FLAG: flag,
      P_ORD_ID: ORDERID,
      P_CUST_ITEM: ITEM,
      P_SCH_ID: sch_id,
      P_BATCH: BATCH_ID,
      P_MOTH_BATCH: MOTHER_BATCH,
      P_MATNR_TARGET: MATERIAL,
      P_MATNR_SOURCE: null,
      P_STOR: stor,
      P_NET_QTY: NET_WT,
      P_GRS_QTY: NET_WT,
      P_CAST_NO: LOM_NO_CAST,
      P_PROC_PATH: LOM_PASSED_PROC,
      P_NO_PIECE: LOM_NO_PIECES,
      P_STRT_TM: PROD_STRT_TM,
      P_END_TM: PROD_END_TM,
      P_SEC1: THICKNESS,
      P_SEC2: LOM_SEC2,
      P_ODIA: LOM_ODIA,
      P_IDIA: LOM_IDIA,
      P_INV_LOSS_WT: 0,
      P_WORK_CENT: LOM_WORK_CENTER,
      P_USER: personalNo,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const rejectUD = async () => {
  try {
    let sql = `call TTSB002(
      P_PARAM_CUST => :P_PARAM_CUST ,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    const binds = {
      // P_PARAM_CUST : P_PARAM_CUST , //null
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCastDetails = async (castNo: any) => {
  try {
    let sql = `SELECT  TCA_LAB_TEST_CD , TCA_TEST_PARA , TCA_TEST_PARA_VAL  , TCA_TEST_PARA_REM FROM V_TC_CAST_TEST WHERE TCA_CAST_NO = :castNo `;
    let binds = { castNo: castNo };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSTOR = async (plant: any, BATCH_ID: any) => {
  try {
    let sql = `SELECT EPL_STOR_LOC
    FROM V_EPA_PROC_LINE 
    WHERE EPL_CD_EPA=:plant
    AND EPL_CD_PROCESS = (SELECT LOM_CD_CURR_PROC FROM V_LDP_PRODN
    WHERE LOM_CD_EPA=:plant
    AND LOM_ID_BATCH = :BATCH_ID) `;
    let binds = {
      plant: plant,
      BATCH_ID: BATCH_ID,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScheduleID = async (
  plant: any,
  BATCH_ID: any,
  CURRENT_PROCESS: any
) => {
  try {
    let sql = `SELECT EWI_L_SCO_ORDER , EWI_SFG_MATNR FROM V_WORK_INST
    WHERE EWI_ID_BATCH=:BATCH_ID
    AND EWI_CD_EPA=:plant 
    AND EWI_CD_PROCESS = :CURRENT_PROCESS
    AND EWI_CD_STATUS<>'RJ'`;

    let binds = {
      plant: plant,
      BATCH_ID: BATCH_ID,
      CURRENT_PROCESS: CURRENT_PROCESS,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateUD = async (
  plant: any,
  ORDERID: any,
  ITEM: any,
  BATCH_ID: any,
  MOTHER_BATCH: any,
  CURRENT_PROCESS: any,
  LOM_CD_NEXT_PROC: any,
  personalNo: any,
  ACTION: any,
  MATERIAL: any,
  REMARKS: any
) => {
  try {
    // let sql = `UPDATE V_LDP_PRODN
    // SET LOM_CD_STATUS= :CURRENT_PROCESS||'B',
    // LOM_PROG_ID ='LDSM034' ,
    // LOM_REC_UPD_DT = SYSDATE ,
    // LOM_REC_UPD_USR= :personalNo
    // WHERE LOM_CD_EPA= :plant
    // AND LOM_ID_BATCH= :BATCH_ID `;

    // let binds = {
    //   plant : plant,
    //   BATCH_ID : BATCH_ID ,
    //   CURRENT_PROCESS : CURRENT_PROCESS ,
    //   personalNo : personalNo
    // }

    const sql = `call LDSM034_UPDATE (
      P_PLANT => :P_PLANT ,
      P_ORD_ID => :P_ORD_ID ,
      P_CUST_ITEM => :P_CUST_ITEM ,
      P_BATCH => :P_BATCH ,
      P_MOTH_BATCH => :P_MOTH_BATCH ,
      P_CURR_PROC => :P_CURR_PROC ,
      P_NEXT_PROC => :P_NEXT_PROC ,
      P_USER => :P_USER ,
      P_UD_FLAG => :P_UD_FLAG,
      P_MATNR => :P_MATNR,
      P_REMARKS => :P_REMARKS,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;
    const binds = {
      P_PLANT: plant,
      P_ORD_ID: ORDERID,
      P_CUST_ITEM: ITEM,
      P_BATCH: BATCH_ID,
      P_MOTH_BATCH: MOTHER_BATCH,
      P_CURR_PROC: CURRENT_PROCESS,
      P_NEXT_PROC: LOM_CD_NEXT_PROC,
      P_USER: personalNo,
      P_UD_FLAG: ACTION,
      P_MATNR: MATERIAL,
      P_REMARKS: REMARKS,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const returnUD = async (
  plant: any,
  ORDERID: any,
  ITEM: any,
  BATCH_ID: any,
  MOTHER_BATCH: any,
  CURRENT_PROCESS: any,
  LOM_CD_NEXT_PROC: any,
  personalNo: any,
  ACTION: any,
  MATERIAL: any,
  REMARKS: any
) => {
  try {
    const sql = `call LDSM034_UPDATE (
      P_PLANT => :P_PLANT ,
      P_ORD_ID => :P_ORD_ID ,
      P_CUST_ITEM => :P_CUST_ITEM ,
      P_BATCH => :P_BATCH ,
      P_MOTH_BATCH => :P_MOTH_BATCH ,
      P_CURR_PROC => :P_CURR_PROC ,
      P_NEXT_PROC => :P_NEXT_PROC ,
      P_USER => :P_USER ,
      P_UD_FLAG => :P_UD_FLAG,
      P_MATNR => :P_MATNR,
      P_REMARKS => :P_REMARKS,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;
    const binds = {
      P_PLANT: plant,
      P_ORD_ID: ORDERID,
      P_CUST_ITEM: ITEM,
      P_BATCH: BATCH_ID,
      P_MOTH_BATCH: MOTHER_BATCH,
      P_CURR_PROC: CURRENT_PROCESS,
      P_NEXT_PROC: LOM_CD_NEXT_PROC,
      P_USER: personalNo,
      P_UD_FLAG: ACTION,
      P_MATNR: MATERIAL,
      P_REMARKS: REMARKS ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const checkPdate = async (
  plant: any,
  BATCH_ID: any,
  P_PRODN_DT: any
) => {
  try {
    let sql = `call LDSM034_CHECK(
      P_PLANT => :P_PLANT ,
      P_BATCH => :P_BATCH ,
      P_PRODN_DT => :P_PRODN_DT,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    let binds = {
      P_PLANT: plant,
      P_BATCH: BATCH_ID,
      P_PRODN_DT: P_PRODN_DT,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const crtWIP = async (
  plant: any,
  BATCH_ID: any,
  LOM_CD_NEXT_PROC: any
) => {
  try {
    let sql = `call C1CEB170_CRT_TUBEWIP(
      P_PLANT => :P_PLANT ,
      P_BATCH => :P_BATCH ,
      P_PROCLINE => :P_PROCLINE,
      LS_OUT_FLAG => :LS_OUT_FLAG
    )`;

    let binds = {
      P_PLANT: plant,
      P_BATCH: BATCH_ID,
      P_PROCLINE: LOM_CD_NEXT_PROC,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getQRRFlg = async (plant: any, status: any) => {
  try {
    const sql = `SELECT COUNT(1) QRR_FLG
    FROM V_CODES
    WHERE CD_TYPE='TB008'
    AND SUBSTR(CD_VALUE,1,4) = :plant
    AND SUBSTR(CD_VALUE,6,2) = :status`;

    const binds = {
      plant: plant,
      status: status,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCntResTag = async (mother_batch: any, cast_no: any) => {
  try {
    const sql = `SELECT COUNT(*) CNT_RES_TAG FROM V_TC_COIL_TEST WHERE TCO_PROD_NO = :BATCH_ID AND TCO_CAST_NO = :CAST_NO AND TCO_UP_RESULT_TAG = 'F' `;

    const binds = {
      BATCH_ID: mother_batch,
      CAST_NO: cast_no,
    };

    return await query.executeQuery(sql, binds);
    // return 1;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCntResTagSuccess = async (mother_batch: any, cast_no: any) => {
  try {
    const sql = `SELECT COUNT(*) CNT_RES_TAG FROM V_TC_COIL_TEST WHERE TCO_PROD_NO = :BATCH_ID AND TCO_CAST_NO = :CAST_NO AND TCO_UP_RESULT_TAG = 'N' AND TCO_CRT_BY <> 'TSMTUBEPI' `;

    const binds = {
      BATCH_ID: mother_batch,
      CAST_NO: cast_no,
    };

    return await query.executeQuery(sql, binds);
    // return 1;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCntCoilTest = async (mother_batch: any, cast_no: any) => {
  try {
    const sql = `SELECT COUNT(1) FROM V_TC_COIL_TEST
    WHERE TCO_PROD_NO=:MOTHER_BATCH
    AND TCO_CAST_NO = :CAST_NO `;

    const binds = {
      MOTHER_BATCH: mother_batch,
      CAST_NO: cast_no,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// c1ceb086(p_plant varchar2,p_coil_id VARCHAR2 , p_cast_no VARCHAR2)

export const updateDaughterBatch = async (
  mother_batch: any,
  cast_no: any,
  plant: any,
  batch_id: any // added parameter as on date 06-04-2023
) => {
  try {
    let sql = `call C1CEB086(
      P_PLANT => :P_PLANT ,
      P_COIL_ID => :P_COIL_ID ,
      P_CAST_NO => :P_CAST_NO,
      P_BATCH_ID => :P_BATCH_ID
      )`;

    let binds = {
      P_PLANT: plant,
      P_COIL_ID: mother_batch,
      P_CAST_NO: cast_no,
      P_BATCH_ID: batch_id,
      // LS_OUT_FLAG : { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500 }
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProdTypeTitle = async (plant: any, status: any) => {
  try {
    let sql = `
    select EPL_PRODUCTION_TYPE from v_epa_proc_line
    where epl_cd_epa=:plant
    and epl_cd_procESS= SUBSTR(:status,1,1)`;

    let binds = {
      plant: plant,
      status: status,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCntDefectRec = async (
  plant: any,
  batch_id: any,
  mBatch: any
) => {
  try {
    const sql = `SELECT count(*) CNT FROM V_BATCH_DEFECT WHERE TBD_CD_EPA = :plant AND TBD_ID_BATCH = :batch_id AND TBD_ID_FIRST_PAR = :mBatch`;

    const binds = {
      plant: plant,
      batch_id: batch_id,
      mBatch: mBatch,
    };

    return await query.executeQuery(sql, binds);
    // return 1;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const cntStatusUD = async (plant: any) => {
  try {
    const sql = `SELECT COUNT(CD_DESC1) CNT
    FROM V_CODES
    WHERE CD_TYPE='TB008'
    AND SUBSTR(CD_VALUE,1,4) = :plant
    and CD_DESC1 ='SFG' `;

    const binds = {
      plant: plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const chkMqStatus = async (plant: any, status: any) => {
  try {
    const sql = `SELECT count(1) 
    FROM V_CODES
    WHERE CD_TYPE='TB008'
    AND SUBSTR(CD_VALUE,1,4) = :plant
    AND SUBSTR(CD_VALUE,6,2) = :status `;

    const binds = {
      plant: plant,
      status: status,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getQualityResultCount = async (
  plant: any,
  order_id: any,
  cast_no: any,
  order_item: any,
  mother_batch: any,
  material_no: any
) => {
  try {
    const sql = `
    SELECT COUNT(*) CNT FROM (
        SELECT A.* 
                , (SELECT NVL(TCO_TEST_PARA_REM,TCO_TEST_PARA_VAL) FROM V_TC_COIL_TEST WHERE TCO_PROD_NO=:BATCH_ID AND TCO_CAST_NO=:LOM_NO_CAST AND TCO_LAB_TEST_CD = CODE_VALUE AND TCO_TEST_PARA = TC_ELEMENT AND  ROWNUM=1) actual_record_val ,
                (  SELECT COUNT(1) FROM V_CODES WHERE CD_TYPE='TB011' AND CD_VALUE=TC_ELEMENT ) DROP_CHK
                    FROM
                    (
                    SELECT DISTINCT TQP_PARAM_CD CODE_VALUE, TQP_PARAM_ATTR TC_ELEMENT, TQP_PARAM_DESC CODE_DESC, TQP_OPER_ID, TQP_TS_REC_CREATE 
                                , TQP_SEQ, '' REMARKS, 0 VALUE, TSL_PARA_MIN INT_MIN_SPEC_VAL, TSL_PARA_MAX INT_MAX_SPEC_VAL, TSL_PARA_UNIT CODE_SUB_DESC, '' CODE_SUB_VALUE 
                                , '' IP, '' CP, '' ISI_NO, '' LICENSE_NO, '' MATERIAL_NO 
                                FROM V_QLTY_PARAM, V_TDC_SPEC_LIMIT 
                                WHERE TQP_PARAM_CD = TSL_TDC_NO 
                                AND TQP_PARAM_ATTR = TSL_TEST_PARA 
                                AND TQP_PARAM_CD IN ( 
                                SELECT MAX(DISTINCT(IP)) FROM V_YMQMT_INSP_PLAN 
                                WHERE MANDT = '600' AND SPEC IN (                                
                                SELECT DISTINCT(ENC_MATNR_SPEC) FROM V_END_CUST_ORD_EPA 
                                WHERE ENC_CD_EPA = :PLANT AND ENC_ID_ORDER = :ORDERID AND ENC_NO_ITEM = :ORDERITEM))
                                UNION 
                                SELECT '' CODE_VALUE, TCA_TEST_PARA TC_ELEMENT, '' CODE_DESC, '' TQP_OPER_ID, TRUNC(SYSDATE) TQP_TS_REC_CREATE 
                                , 0 TQP_SEQ, TCA_TEST_PARA_REM REMARKS, TCA_TEST_PARA_VAL VALUE, 0 INT_MIN_SPEC_VAL, 0 INT_MAX_SPEC_VAL, '' CODE_SUB_DESC, '' CODE_SUB_VALUE 
                                , '' IP, '' CP, '' ISI_NO, '' LICENSE_NO, '' MATERIAL_NO 
                                FROM V_TC_CAST_TEST_TUB 
                                WHERE TCA_CAST_NO = :CASTNO 
                                AND TCA_TEST_PARA NOT IN (SELECT DISTINCT(CD_VALUE) FROM V_CODES WHERE CD_TYPE = 'EPA255' AND SUBSTR(CD_DESC,1,4) = :PLANT) 
                    )A) `;
    const binds = {
      PLANT: plant,
      ORDERID: order_id,
      LOM_NO_CAST: cast_no,
      ORDERITEM: order_item,
      BATCH_ID: mother_batch,
      CASTNO: cast_no,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// Added as on date 07-06-2023 to check duplicate entry.

export const chkDuplicateBatch = async (plant: any, batch_id: any) => {
  try {
    let sql = `SELECT COUNT(1) CNT 
    FROM V_LDP_PRODN
    WHERE LOM_CD_EPA =:P_PLANT
    AND LOM_ID_BATCH =:P_BATCH_ID
    AND LOM_CD_STATUS NOT IN ('MQ', 'KQ')`;

    let binds = {
      P_PLANT: plant,
      P_BATCH_ID: batch_id,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getChangeResult = async (
  batch_id: any,
  LOM_no_cast: any,
  plant: any,
  orderid: any,
  orderitem: any
) => {
  try {
    let sql = `SELECT
    a.*,
    (
        SELECT
            nvl(tco_test_para_rem, tco_test_para_val)
        FROM
            v_tc_coil_test
        WHERE
            tco_prod_no = :batch_id
            AND tco_cast_no = :LOM_no_cast
            AND tco_lab_test_cd = code_value
            AND tco_test_para = tc_element
            AND ROWNUM = 1
    ) actual_record_val,
    (
        SELECT
            COUNT(1)
        FROM
            v_codes
        WHERE
            cd_type = 'TB011'
            AND cd_value = tc_element
    ) drop_chk
FROM
    (
        SELECT DISTINCT
            tqp_param_cd     code_value,
            tqp_param_attr   tc_element,
            tqp_param_desc   code_desc,
            tqp_oper_id,
            tqp_ts_rec_create,
            tqp_seq,
            '' remarks,
            0 value,
            tsl_para_min     int_min_spec_val,
            tsl_para_max     int_max_spec_val,
            tsl_para_unit    code_sub_desc,
            '' code_sub_value,
            '' ip,
            '' cp,
            '' isi_no,
            '' license_no,
            '' material_no
        FROM
            v_qlty_param,
            v_tdc_spec_limit
        WHERE
            tqp_param_cd = tsl_tdc_no
            AND tqp_param_attr = tsl_test_para
            AND tqp_param_cd IN (
                SELECT
                    MAX(DISTINCT(ip))
                FROM
                    v_ymqmt_insp_plan
                WHERE
                    mandt = '600'
                    AND spec IN (
                        SELECT DISTINCT
                            ( spec )
                        FROM
                            v_ympct_tub_matl
                        WHERE
                            mandt = '600'
                            AND ( matnr IN (
                                SELECT DISTINCT
                                    ( enc_no_matnr )
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_cd_epa = :plant
                                    AND enc_id_order = :orderid
                                    AND enc_no_item = :orderitem
                            ) )
                    )
            )
    ) a
ORDER BY
    a.tqp_seq`;

    var binds = {
      batch_id: batch_id,
      LOM_no_cast: LOM_no_cast,
      plant: plant,
      orderid: orderid,
      orderitem: orderitem,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getChangeResultDetails = async (batch: any, testpra: any) => {
  try {
    let sql = `SELECT * FROM V_TC_COIL_TEST
    WHERE TCO_PROD_NO = :batch
    AND TCO_TEST_PARA = :testpra
    AND TCO_CRT_BY <>'TSMTUBEPI'`;
    var binds = {
      batch: batch,
      testpra: testpra,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getChangeResultBatch = async (plant: any) => {
  try {
    let sql = `SELECT DISTINCT
    LOM_id_batch,
    LOM_no_cast,
    LOM_id_order_cus,
    LOM_id_ord_item_cus,
    LOM_TDC_ACTL
FROM
    v_LDP_PRODN
WHERE
    LOM_cd_epa = :plant
    AND LOM_cd_qlty_actl <> 'SCRP'
    AND LOM_CD_STATUS ='KB'
    AND LOM_UOM='KG'`;

    var binds = {
      Plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getChangeResultMBatch = async () => {
  try {
    let sql = `SELECT DISTINCT TCO_PROD_NO FROM V_TC_COIL_TEST where TCO_CRT_BY <>'TSMTUBEPI'`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetScrapWt = async (
  plant: any,
  MOTHER_BATCH: any,
  CUR_PROCESS: any
) => {
  try {
    let sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0) SCRAP_WT,NVL(SUM(LOM_NO_PIECES),0) LOM_NO_PIECES
    FROM V_LDP_PRODN
    WHERE LOM_CD_EPA=:plant
    AND LOM_ID_PAR_COIL_NO=:MOTHER_BATCH 
    AND LOM_CD_QLTY_ACTL='SCRP'
    AND LOM_CD_CURR_PROC=:PROCESS
    AND LOM_NO_MATNR NOT IN (select CD_DESC from v_codes where cd_type='TB032' AND CD_VALUE = LOM_CD_EPA)`;
    const binds = {
      plant: plant,
      MOTHER_BATCH: MOTHER_BATCH,
      PROCESS: CUR_PROCESS,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPieceActl = async (req: any) => {
  try {
    const sql = `select LDPDBA.f_get_piece_actl(:P_PLANT, :P_BATCH_ID, :P_PROD_NAME, :P_NO_PCS, :P_LENGTH, :P_OD, :P_ID, :P_THICKNESS) piece_actl from dual`;
    let binds = {
      P_PLANT: req.body.plant,
      P_BATCH_ID: req.body.batch_id,
      P_PROD_NAME: req.body.prod_name,
      P_NO_PCS: req.body.no_pcs,
      P_LENGTH: parseFloat(req.body.length),
      P_OD: parseFloat(req.body.p_od),
      P_ID: parseFloat(req.body.p_id),
      P_THICKNESS: parseFloat(req.body.p_thk),
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProductName = async (req: any) => {
  try {
    let sql = `select PPH_PRODUCT_NM from v_epa_proc_path
      where PPH_CD_EPA= :plant
      and PPH_CD_PROC_PATH = :procPath`;
    let binds = {
      plant: req.body.plant,
      procPath: req.body.procPath,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
