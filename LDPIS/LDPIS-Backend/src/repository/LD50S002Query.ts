import { Console } from "console";
import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import OracleDB, { NUMBER } from "oracledb";

export const LD50S002GetData = async (data: any) => {
  try {
    const binds = {};
    let sql: any = `SELECT   NVL (EIC_ID_COIL, ' ') EIC_ID_COIL,
         NVL (EIC_CD_STATUS, ' ') EIC_CD_STATUS,
         NVL ((SELECT DISTINCT CD_DESC
                          FROM V_CODES
                         WHERE CD_TYPE = 'E0001'
                           AND CD_VALUE = EIC_CD_STATUS
                           AND ROWNUM = 1),
              ' '
             ) STATUS_DESC,
         NVL (EIC_NO_CAST, ' ') EIC_NO_CAST,
         NVL (EIC_NO_INVOICE, ' ') EIC_NO_INVOICE,
         TO_CHAR (EIC_DT_INVOICE, 'DD-MM-YYYY') EIC_DT_INVOICE,
         NVL (EIC_CD_PROD, ' ') EIC_CD_PROD,
         NVL (EIC_CD_QLTY_ACTL, ' ') EIC_CD_QLTY_ACTL,
         NVL (EIC_SEC1, 0) EIC_SEC1, NVL (EIC_SEC2, 0) EIC_SEC2,
         NVL (EIC_LENGTH, 0) EIC_LENGTH, NVL (EIC_TDC_ACTL, ' ') EIC_TDC_ACTL,
         NVL (EIC_MS_PIECE_ACTL, 0) EIC_MS_PIECE_ACTL,
         NVL (EIC_CD_YRD, ' ') EIC_CD_YRD,
         NVL (EIC_ID_LOC_X, ' ') EIC_ID_LOC_X,
         NVL (EIC_ID_LOC_Y, ' ') EIC_ID_LOC_Y, NVL (EIC_ID_POS, 0) EIC_ID_POS,
         NVL (EIC_REMARKS, ' ') EIC_REMARKS,
         NVL ((ROUND (SYSDATE - EIC_DT_LOADING)), 0) EPA_AGE,
         NVL (EIC_CD_EPA, ' ') EIC_CD_EPA,
         NVL (EIC_ID_OP_DECSN, ' ') EIC_ID_OP_DECSN,
         NVL (EIC_MARK_CUST, 0) EIC_MARK_CUST,
         NVL (EIC_MK_CUSTOMER, ' ') EIC_MK_CUSTOMER,
         NVL (EIC_VEHICAL_NO, ' ') AS VEHICAL_NO,
         NVL (EIC_NO_DELIVERY, ' ') EIC_NO_DELIVERY, 
         TO_CHAR(EIC_DT_LOADING, 'DD-MM-YYYY HH24:MI:SS') EIC_DT_LOADING,
         EIC_NO_MATNR, EIC_CD_PLANT, EIC_WO_NO, EIC_CD_EDGE, EIC_ITEM_NO
    FROM V_INPUT_COIL A
   WHERE EIC_CD_STATUS IN (SELECT DISTINCT CD_VALUE FROM V_CODES
WHERE CD_TYPE = 'TB054')
    ORDER BY EIC_TS_CREATION `;

    //  if (data?.plantId === "ALL") {
    //  } else {
    //    sql += ` AND EIC_CD_EPA = :PLANT `;
    //    // binds["PLANT"] = data?.plantId;
    //    Object.assign(binds, { PLANT: data?.plantId });
    //  }

    console.log("sql: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002GetPlantID = async (data: any) => {
  try {
    let sql: any = `select CD_VALUE,CD_DESC from V_CODES
                            WHERE CD_TYPE='RMPNT'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002GetTestCastData = async (data: any) => {
  try {
    let sql: any = ` SELECT DISTINCT 'C' AS prop, tsl_cd_test AS test_cd,
                tsl_test_para AS test_para, tca_test_para_val AS para_val,
                tsl_para_min AS para_min, tsl_para_max AS para_max,
                NVL
                   ((SELECT NVL (btr_test_para_val, 0)
                       FROM v_batch_test_result a
                      WHERE btr_prod_no = :BATCHID
                        AND btr_cast_no = :CASTNO
                        AND btr_seq_no =
                               (SELECT MAX (btr_seq_no)
                                  FROM v_batch_test_result
                                 WHERE btr_prod_no = a.btr_prod_no
                                   AND btr_cast_no = a.btr_cast_no)
                        AND btr_test_para = tsl_test_para
                        AND btr_lab_test_cd = 'LSA'),
                    0
                   ) AS test_para_val_coil,
                (SELECT MAX (btr_seq_no)
                   FROM v_batch_test_result a
                  WHERE btr_prod_no = :BATCHID
                    AND btr_cast_no = :CASTNO) test_para_val_coil_seq,
                     NVL
                   ((SELECT NVL (btr_test_para_val, 0)
                       FROM v_batch_test_result a
                      WHERE btr_cast_no = :CASTNO
                        AND BTR_CRT_DT =
                               (SELECT MAX (BTR_CRT_DT)
                                  FROM v_batch_test_result
                                 WHERE btr_cast_no = a.btr_cast_no)
                        AND btr_test_para = tsl_test_para
                        AND btr_lab_test_cd = 'LSA'),
                    0
                   ) AS test_para_val_cast
           FROM v_tdc_spec_limit tsl, v_tc_cast_test tca, v_input_coil coil
          WHERE coil.eic_id_coil = :BATCHID
            --AND coil.eic_tdc_actl = tsl.tsl_tdc_no
            AND tsl.tsl_test_para = tca.tca_test_para(+)
            AND tca.tca_cast_no(+) = coil.eic_no_cast
            AND coil.eic_cd_epa = '0780'
            AND tsl.tsl_cd_test = 'LSA'
            and tsl_tdc_no = :TDC
UNION ALL
SELECT DISTINCT 'M' AS prop, tsl_cd_test AS test_cd,
                tsl_test_para AS test_para, tco_test_para_val AS para_val,
                tsl_para_min AS para_min, tsl_para_max AS para_max,
                NVL
                   ((SELECT NVL (btr_test_para_val, 0)
                       FROM v_batch_test_result a
                      WHERE btr_prod_no = :BATCHID
                        AND btr_cast_no = :CASTNO
                        AND btr_seq_no =
                               (SELECT MAX (btr_seq_no)
                                  FROM v_batch_test_result
                                 WHERE btr_prod_no = a.btr_prod_no
                                   AND btr_cast_no = a.btr_cast_no)
                        AND btr_test_para = tsl_test_para
                        AND BTR_LAB_TEST_CD=TSL_CD_TEST
                        AND NVL (btr_lab_test_cd, '-') <> 'LSA'),
                    0
                  ) AS test_para_val_coil,
                (SELECT MAX (btr_seq_no)
                   FROM v_batch_test_result a
                  WHERE btr_prod_no = :BATCHID
                    AND btr_cast_no = :CASTNO) test_para_val_coil_seq,
                       NVL
                   ((SELECT NVL (btr_test_para_val, 0)
                       FROM v_batch_test_result a
                      WHERE btr_cast_no = :CASTNO
                        AND BTR_CRT_DT =
                               (SELECT MAX (BTR_CRT_DT)
                                  FROM v_batch_test_result
                                 WHERE btr_cast_no = a.btr_cast_no)
                        AND btr_test_para = tsl_test_para
                        AND BTR_LAB_TEST_CD=TSL_CD_TEST
                        AND NVL (btr_lab_test_cd, '-') <> 'LSA'),
                    0
                   ) AS test_para_val_cast
           FROM v_tdc_spec_limit tsl, v_input_coil coil, v_tc_coil_test tco
          WHERE coil.eic_id_coil = :BATCHID
            --AND coil.eic_tdc_actl = tsl.tsl_tdc_no
            AND coil.eic_id_coil = tco.tco_prod_no(+)
            AND tco.tco_test_para(+) = tsl.tsl_test_para
            AND coil.eic_cd_epa = :PLANT
            AND tsl.tsl_cd_test <> 'LSA' 
            and tsl_tdc_no = :TDC
            order by prop, test_cd, test_para`;

    const binds = {
      CASTNO: data?.INPUTDATA?.CastNo,
      BATCHID: data?.INPUTDATA?.Batchid,
      PLANT: data?.INPUTDATA?.PLANT,
      TDC: data?.INPUTDATA?.TDC,
    };
    console.log("sql: ", sql);
    console.log("binds: ", binds);

    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002GetDimData = async (data: any) => {
  try {
    let sql: any = `SELECT 
    INP_CD_EPA,
    INP_ID_BATCH,
    INP_SEQ_NO,
    INP_CD_STATUS,
    INP_WIDTH_TOP,
    INP_WIDTH_MIDDLE,
    INP_WIDTH_BOTTOM,
    INP_THICK_TOP,
    INP_THICK_MIDDLE,
    INP_THICK_BOTTOM
FROM V_INSP_RESULT
WHERE INP_ID_BATCH = :BATCHID
AND INP_CD_EPA = :PLANT
AND INP_SEQ_NO = (
    SELECT MAX(INP_SEQ_NO)
    FROM V_INSP_RESULT
    WHERE INP_ID_BATCH = :BATCHID
    AND INP_CD_EPA = :PLANT
)`;

    const binds = {
      PLANT: data?.INPUTDATA?.PLANT,
      BATCHID: data?.INPUTDATA?.Batchid,
    };
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const generateSeqNo = async (data: any) => {
  try {
    let seqNoQry: any = `select NVL(MAX(BTR_SEQ_NO),0)+1 BTR_SEQ_NO from V_LDP_CAST_TEST
    WHERE BTR_CAST_NO= :CASTNO AND BTR_PROD_NO= :BATCHID`;

    const seqNoResult = await query.executeQuery(seqNoQry, {
      CASTNO: data?.INPUTDATA?.CastNo,
      BATCHID: data?.INPUTDATA?.Batchid,
    });
    const currentSeqNo = seqNoResult.rows[0][0];

    return currentSeqNo;
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002UpdateCoilData = async (data: any, seqNo: any) => {
  try {
    //
    let sql = ``;
    let binds = {};
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002UpdateCastData = async (
  data: any,
  USER: any,
  seqNo: any
) => {
  try {
    // Determine UP_RESULT_TAG based on conditions
    let UP_RESULT_TAG = "F"; // Default to 'F'

    if (data?.PARA_MIN == null || data?.PARA_MAX == null) {
      UP_RESULT_TAG = "N"; // If PARA_MIN or PARA_MAX is null, bind 'N'
    } else if (
      data?.PARA_VAL >= data?.PARA_MIN &&
      data?.PARA_VAL <= data?.PARA_MAX
    ) {
      UP_RESULT_TAG = "N"; // If TEST_PARA_VAL_COIL is between PARA_MIN and PARA_MAX, bind 'N'
    }

    let sql: any = `INSERT INTO V_BATCH_TEST_RESULT(
        BTR_CAST_NO,
        BTR_PROD_NO,
        BTR_LAB_TEST_CD,
        BTR_TEST_PARA,
        BTR_TEST_PARA_REM,
        BTR_CRT_DT,
        BTR_CRT_BY,
        BTR_TEST_PARA_VAL,
        BTR_SEQ_NO,
        BTR_UP_RESULT_TAG,
        BTR_SOURCE_PGM
      )
      VALUES (
        :CASTNO,
        :BATCHID,
        :TEST_CD,
        :TEST_PARA,
        NULL,
        SYSDATE,
        :USERID,
        :PARA_CHG_VAL,
        :TEST_PARA_VAL_COIL_SEQ,
        :UP_RESULT_TAG,
        :page_no)`;

    const binds = {
      PARA_CHG_VAL: data?.TEST_PARA_VAL_COIL,
      USERID: USER ?? " ",
      BATCHID: data?.BatchId ?? " ",
      CASTNO: data?.CastNo ?? " ",
      TEST_PARA: data?.TEST_PARA ?? " ",
      TEST_CD: data?.TEST_CD ?? " ",
      TEST_PARA_VAL_COIL_SEQ: Number(data?.TEST_PARA_VAL_COIL_SEQ ?? 0) + 1,
      UP_RESULT_TAG: UP_RESULT_TAG, // Bind the calculated result tag
      page_no: "LD50S002",
    };

    // console.log("sql:: ", sql);
    // console.log("binds:: ", binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002UpdateDimData = async (
  data: any,
  USER: any,
  seqNo: any
) => {
  try {
    let sql: any = `INSERT INTO V_INSP_RESULT(
      INP_CD_EPA,
      INP_ID_BATCH,
      INP_SEQ_NO,
      INP_WIDTH_TOP,
      INP_WIDTH_MIDDLE,
      INP_WIDTH_BOTTOM,
      INP_THICK_TOP,
      INP_THICK_MIDDLE,
      INP_THICK_BOTTOM,
      INP_CRT_DT,
      INP_CRT_BY,
      INP_UPD_DT,
      INP_UPD_BY,
      INP_SOURCE_PGM,
      INP_CD_STATUS
      )
      VALUES (
        :CD_EPA,
        :ID_BATCH,
        :SEQ_NO,
        :WIDTH_TOP,
        :WIDTH_MIDDLE,
        :WIDTH_BOTTOM,
        :THICK_TOP,
        :THICK_MIDDLE,
        :THICK_BOTTOM,
        sysdate,
        :CRT_BY,
        sysdate,
        :UPD_BY,
        'LD50S002',
        'SA')`;

    const binds = {
      CD_EPA: data?.INP_CD_EPA,
      ID_BATCH: data?.INP_ID_BATCH,
      SEQ_NO: data?.INP_SEQ_NO + 1,
      WIDTH_TOP: data?.INP_WIDTH_TOP,
      WIDTH_MIDDLE: data?.INP_WIDTH_MIDDLE,
      WIDTH_BOTTOM: data?.INP_WIDTH_BOTTOM,
      THICK_TOP: data?.INP_THICK_TOP,
      THICK_MIDDLE: data?.INP_THICK_MIDDLE,
      THICK_BOTTOM: data?.INP_THICK_BOTTOM,
      CRT_BY: USER,
      UPD_BY: USER,
    };

    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001passLDB004 = async (data: any) => {
  try {
    const sql = `call LDPDBA.LD50B002(
      p_plant   => :p_plant,
      p_batch   => :p_batch,
      p_invoice   => :p_invoice,
      p_flag   => :p_flag,
      p_tdc_batch    => :p_tdc_batch,
      p_downgrd_tdc => :p_downgrd_tdc,
      p_remarks=> :p_remarks,
      P_USER   => :P_USER,
      p_holdrsn => :p_holdrsn,
      LS_OUT_FLAG   => :LS_OUT_FLAG
          )`;
    const binds = {
      p_plant: data?.data?.[0]?.EIC_CD_EPA, // 0780 hardcoded
      p_batch: data?.data?.[0]?.EIC_ID_COIL,
      p_invoice: data?.data?.[0]?.EIC_NO_INVOICE,
      p_flag: data?.data?.[0]?.DECISION,
      p_tdc_batch: data?.data?.[0]?.EIC_TDC_ACTL,
      p_downgrd_tdc: data?.data?.[0]?.TDC_LIST,
      p_remarks: data?.data?.[0]?.REMARKS,
      p_holdrsn: data?.data?.[0]?.HOLD_RSN,
      P_USER: data?.P_USER,
      LS_OUT_FLAG: {
        type: OracleDB.STRING,
        dir: OracleDB.BIND_OUT,
        maxSize: 500,
      },
    };
    const result = await query.executeQuery(sql, binds);
    return result;
  } catch (error: any) {
    console.log("e: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002getTdcList = async (data: any) => {
  try {
    let seqNoQry: any = `select distinct(TSL_TDC_NO) TSL_TDC_NO from V_TDC_SPEC_LIMIT`;

    return await query.executeQuery(seqNoQry);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S002getHoldrsn = async (data: any) => {
  try {
    let seqNoQry: any = `select CD_VALUE,CD_DESC from V_CODES WHERE CD_TYPE='TB032'`;

    return await query.executeQuery(seqNoQry);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
