import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

// Mirrored from LD12S001Query with new module name: LD16S001Query

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= :status
        and LOM_CD_EPA='0780'
        AND LOM_CD_QLTY_ACTL<>'SCRP'`;
    let binds = {
      status: status,
    };
    console.log("rmlist", sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getLabTestList = async (params: any) => {
  try {
    let sql = `select CD_VALUE,CD_DESC from V_CODES t
where t.cd_type IN ('TB053')`;
    console.log("rmlist", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFieldTestList = async (params: any) => {
  try {
    let sql = `select CD_VALUE,CD_DESC from V_CODES t
where t.cd_type IN ('TB052')`;
    console.log("rmlist", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    console.log("pipeno", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertField = async (
  batchNo: string,
  prodDate: string,
  shift: string,
  labTest: string
) => {
  try {
    const testNameQuery = `SELECT CD_DESC,CD_DESC1 FROM V_CODES WHERE CD_VALUE = :labTest AND CD_TYPE = 'TB052'`;
    const testNameBinds = { labTest: labTest };
    const testNameResult = await query.executeQuery(
      testNameQuery,
      testNameBinds
    );
    console.log(testNameResult);
    const testName = testNameResult?.rows?.[0]?.[0] || "";

    const sql = `INSERT INTO LDPDBA.T_lab_field_test_EC(
      ELF_PLANT_CD,
      ELF_BATCH_NO,
      ELF_TEST_CODE,
      ELF_TEST_NAME,
      ELF_PROD_DATE,
      ELF_SHIFT,
      ELF_CREATE_DATE,
      ELF_CREATE_USER
    ) VALUES(
      :PLANT_CD,
      :BATCH_NO,
      :TEST_CODE,
      :TEST_NAME,
      TO_DATE(:PROD_DATE, 'DD-MON-YYYY'),
      :SHIFT,
      SYSDATE,
      user
    )`;

    const binds = {
      PLANT_CD: "0780",
      BATCH_NO: batchNo,
      TEST_CODE: testNameResult?.rows?.[0]?.[1] || "",
      TEST_NAME: testName,
      PROD_DATE: prodDate,
      SHIFT: shift,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertLAB = async (
  batchNo: string,
  prodDate: string,
  shift: string,
  labTest: string
) => {
  try {
    const testNameQuery = `SELECT CD_DESC,CD_DESC1 FROM V_CODES WHERE CD_VALUE = :labTest AND CD_TYPE = 'TB053'`;
    const testNameBinds = { labTest: labTest };
    const testNameResult = await query.executeQuery(
      testNameQuery,
      testNameBinds
    );
    console.log(testNameResult);
    const testName = testNameResult?.rows?.[0]?.[0] || "";

    const sql = `INSERT INTO LDPDBA.T_lab_field_test_EC(
      ELF_PLANT_CD,
      ELF_BATCH_NO,
      ELF_TEST_CODE,
      ELF_TEST_NAME,
      ELF_PROD_DATE,
      ELF_SHIFT,
      ELF_CREATE_DATE,
      ELF_CREATE_USER
    ) VALUES(
      :PLANT_CD,
      :BATCH_NO,
      :TEST_CODE,
      :TEST_NAME,
      TO_DATE(:PROD_DATE, 'DD-MON-YYYY'),
      :SHIFT,
      SYSDATE,
      user
    )`;

    const binds = {
      PLANT_CD: "0780",
      BATCH_NO: batchNo,
      TEST_CODE: testNameResult?.rows?.[0]?.[1] || "",
      TEST_NAME: testName,
      PROD_DATE: prodDate,
      SHIFT: shift,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertScrapTempData = async (data: any) => {
  try {
    const sql = `INSERT INTO V_BARE_PDO_TEMP (
      TBP_PLANT_CD,
      TBP_BATCH_NO,
      TBP_CD_PROC,
      TBP_NEXT_PROC,
      TBP_BATCH_PROC_NO,
      TBP_PROD_DATE,
      TBP_SHIFT,
      TBP_WEIGHT,
      TBP_CD_STATUS,
      TBP_PAR_COIL_NO,
      TBP_ID_FIRST_PAR,
      TBP_ID_ORDER_NO,
      TBP_ITEM_NO,
      TBP_QUALITY_CD,
      TBP_NO_MATNR,
      TBP_CD_FLAG,
      TBP_PROD_START_DT,
      TBP_PROD_END_DT,
      TBP_RESULT,
      TBP_REMARK,
      TBP_HEAT_NO,
      TBP_INSP_NAME,
      TBP_PIPE_OD_10,
      TBP_PIPE_THK_10,
      TBP_PIPE_LNG_10
  )
  SELECT 
      :p_plant, 
      LDPDBA.f_LDB010_scrapid (
          :p_plant,
          :p_mbatch,
          :p_prodn_dt,
          :p_proc
      ) AS scrap_batch_id,
      :p_proc,
      'D',
      1,
      :p_prodn_dt,
      :SHIFT,
      :WEIGHT,
      'DC',
      :p_mbatch,
      :ID_FIRST_PAR, 
      'SC88888888' AS order_id, 
      0 AS item, 
      'SCRP' AS qlty,
      SUBSTR(r.cd_desc, 1, 18) AS material,
      '1' AS fg_prod, 
      TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
      TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),
      'OK',
      '',
      '',
      :INSP_NAME, 
      '' AS OD,
      '' AS thk, 
      '' AS length1
  FROM (
      SELECT cd_desc
      FROM v_codes
      WHERE cd_type = 'TB045'
        AND SUBSTR(cd_value, 1, 4) = '0780'
        AND SUBSTR(cd_value, 6, 1) = '8'
  ) r`;

    const binds = {
      p_plant: data.PLANT,
      p_mbatch: data.BATCH_NO,
      p_proc: data.CD_PROC,
      p_prodn_dt: data.PROD_DATE,
      SHIFT: data.SHIFT,
      WEIGHT: data.BATCH_SCRAP_WEIGHT,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      INSP_NAME: data.INSP_NAME,
    };

    console.log("binds80scrapinsert: ", binds);
    console.log("sql80scrapinsert: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("LD16S001-insertScrapTempData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    const sql = `
INSERT INTO V_BARE_PDO_TEMP
(
    TBP_PLANT_CD,
    TBP_BATCH_NO,
    TBP_CD_PROC,
    TBP_BATCH_PROC_NO,
    TBP_NEXT_PROC,
    TBP_PROD_DATE,
    TBP_SHIFT,
    TBP_WEIGHT,
    TBP_CD_STATUS,
    TBP_PAR_COIL_NO,
    TBP_ID_FIRST_PAR,
    TBP_ID_ORDER_NO,
    TBP_ITEM_NO,
    TBP_QUALITY_CD,
    TBP_NO_MATNR,
    TBP_CD_FLAG,
    TBP_PROD_START_DT,
    TBP_PROD_END_DT,
    TBP_RESULT,
    TBP_REMARK,
    TBP_INSP_NAME,
    TBP_ASL_NO_80,
    TBP_FLD_NO_130,
    TBP_FIELDNO_INT_160,
    TBP_VISUAL_INSP_80,
    TBP_DFT_F1_160,
    TBP_DFT_F2_160,
    TBP_DFT_F3_160,
    TBP_DFT_F4_160,
    TBP_DFT_T1_160,
    TBP_DFT_T2_160,
    TBP_DFT_T3_160,
    TBP_DFT_T4_160,
    TBP_DFTW5_160,
    TBP_MARKING_160,
    TBP_ONLTESTW1_160,
    TBP_FINALSTATION_160,
    TBP_REPAIR_ST_160,
    TBP_ONLTESTB1_160,
    TBP_ONLTESTB2_160,
    TBP_ONLTESTB3_160,
    TBP_WORK_CENTER,
    TBP_SHIFT_DN
)
VALUES
(
    :PLANT,
    :BATCH_NO,
    :CD_PROC,
    :BATCH_PROC_NO,
    :NEXT_PROC,
    :PROD_DATE,
    substr(F_Tatadate(TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')),1,1),
    :WEIGHT,
    :STATUS,
    :PAR_COIL_NO,
    :ID_FIRST_PAR,
    :ID_ORDER_NO,
    :ITEM_NO,
    :QUALITY_CD,
    :MATNR,
    :FLAG,
    TO_DATE(:START_DT,'DD-MM-YYYY HH24:MI'),
    TO_DATE(:END_DT,'DD-MM-YYYY HH24:MI'),
    :RESULT,
    :REMARK,
    :INSP_NAME,
    :ASL_NO,
    :TBP_FLD_NO_130,
    :TBP_FIELDNO_INT_160,
    :TBP_VISUAL_INSP_80,
    :TBP_DFT_F1_160,
    :TBP_DFT_F2_160,
    :TBP_DFT_F3_160,
    :TBP_DFT_F4_160,
    :TBP_DFT_T1_160,
    :TBP_DFT_T2_160,
    :TBP_DFT_T3_160,
    :TBP_DFT_T4_160,
    :TBP_DFTW5_160,
    :TBP_MARKING_160,
    :TBP_ONLTESTW1_160,
    :TBP_FINALSTATION_160,
    :TBP_REPAIR_ST_160,
    :TBP_ONLTESTB1_160,
    :TBP_ONLTESTB2_160,
    :TBP_ONLTESTB3_160,
    :TBP_WORK_CENTER,
    :TBP_SHIFT_DN
)
`;

    const binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CD_PROC: data.CD_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      WEIGHT: data.PIPE_WEIGHT,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ID_ORDER_NO: data.ID_ORDER_NO,
      ITEM_NO: data.ITEM_NO,
      QUALITY_CD: data.QUALITY_CD,
      MATNR: data.MATNR,
      FLAG: data.FLAG,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      RESULT: data.RESULT,
      REMARK: data.REMARK,
      INSP_NAME: data.INSP_NAME,

      ASL_NO: data.ASL_NO,

      TBP_FLD_NO_130: data.TBP_FLD_NO_130,
      TBP_FIELDNO_INT_160: data.TBP_FIELDNO_INT_160,

      TBP_VISUAL_INSP_80: data.TBP_VISUAL_INSP_80,

      TBP_DFT_F1_160: data.TBP_DFT_F1_160,
      TBP_DFT_F2_160: data.TBP_DFT_F2_160,
      TBP_DFT_F3_160: data.TBP_DFT_F3_160,
      TBP_DFT_F4_160: data.TBP_DFT_F4_160,

      TBP_DFT_T1_160: data.TBP_DFT_T1_160,
      TBP_DFT_T2_160: data.TBP_DFT_T2_160,
      TBP_DFT_T3_160: data.TBP_DFT_T3_160,
      TBP_DFT_T4_160: data.TBP_DFT_T4_160,

      TBP_DFTW5_160: data.TBP_DFTW5_160,

      TBP_MARKING_160: data.TBP_MARKING_160,

      TBP_ONLTESTW1_160: data.TBP_ONLTESTW1_160,
      TBP_FINALSTATION_160: data.TBP_FINALSTATION_160,
      TBP_REPAIR_ST_160: data.TBP_REPAIR_ST_160,

      TBP_ONLTESTB1_160: data.TBP_ONLTESTB1_160,
      TBP_ONLTESTB2_160: data.TBP_ONLTESTB2_160,
      TBP_ONLTESTB3_160: data.TBP_ONLTESTB3_160,

      TBP_WORK_CENTER: data.TBP_WORK_CENTER,
      TBP_SHIFT_DN: data.TBP_SHIFT_DN,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc120 = async (data: any) => {
  try {
    let resData: any[] = [];
    const sql = `call LDPDBA.LD16B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.CD_PROC ? data.CD_PROC : "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    const result = await query.executeQuery(sql, binds);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    console.log("deletedata", data);
    let sql = ` Delete V_BARE_PDO_TEMP
                    where tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delete error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (data: any) => {
  try {
    let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR,TBP_HEAT_NO,
                TBP_ID_ORDER_NO ORDER_NO,LOM_ID_PAR_COIL_NO, TBP_ITEM_NO ITEM,LOM_NO_CAST,LOM_WORK_CENTER, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
               (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, 'D') as nxtproc from dual) NEXT_PROC,
               (select D.TBP_ASL_NO_80 FROM V_BARE_PDO D
                      where D.TBP_BATCH_NO = LOM_ID_BATCH
                        and D.TBP_CD_PROC = '8'
                        and D.TBP_BATCH_PROC_NO = (
                          SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                          WHERE D.TBP_BATCH_NO = x.TBP_BATCH_NO
                            AND x.TBP_CD_PROC = '8'
                        )
                      and rownum = 1) ASL_NO,
             (SELECT f.TBP_FLD_NO_130 FROM V_BARE_PDO f
                WHERE f.TBP_BATCH_NO = LOM_ID_BATCH
                  AND f.TBP_PLANT_CD = LOM_CD_EPA
                  AND f.TBP_CD_PROC = 'E'
                  AND f.TBP_BATCH_PROC_NO = (
                    SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                     WHERE x.TBP_BATCH_NO = f.TBP_BATCH_NO
                       AND x.TBP_PLANT_CD = f.TBP_PLANT_CD
                       AND x.TBP_CD_PROC = 'E')
                  AND ROWNUM = 1) AS TBP_FLD_NO_130,
               (select A.TBP_DIA_END_10 FROM V_BARE_PDO A
                      where A.TBP_BATCH_NO = LOM_ID_BATCH
                        and A.TBP_CD_PROC = 'A'
                        and A.TBP_BATCH_PROC_NO = (
                          SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
                          WHERE A.TBP_BATCH_NO = x.TBP_BATCH_NO
                            AND x.TBP_CD_PROC = 'A'
                        )
                      and rownum = 1) TBP_DIA_END_10,
               TBP_PIPE_LNG_10 PIPE_LEN, TBP_COT_THK_1_120 COT_THK_1, TBP_COT_THK_2_120 COT_THK_2,TBP_COT_THK_3_120 COT_THK_3,
               (SELECT GEOMETRY
                  FROM V_YMPCT_TUB_MATL
                 WHERE MANDT = '600' AND MATNR = LOM_NO_MATNR) GEO
                   FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
                  WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
                    AND TBP_ITEM_NO = ENC_NO_ITEM
                    AND TBP_BATCH_NO = LOM_ID_BATCH
                    AND TBP_PLANT_CD = LOM_CD_EPA
                    AND LOM_CD_EPA = ENC_CD_EPA
                    AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
                    AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
                    AND LOM_CD_STATUS = '${data.STATUS}'
                    AND TBP_BATCH_PROC_NO = (
                      SELECT MAX(t1.TBP_BATCH_PROC_NO) FROM V_BARE_PDO t1
                      WHERE TBP_BATCH_NO = t1.TBP_BATCH_NO
                        AND t1.TBP_CD_PROC = '1'
                    )`;

    // Apply filters: prefer PIPE_NO, then RM_BATCH, then ORDER/ITEM (LD08 behaviour)
    if (data.PIPE_NO && data.PIPE_NO !== "") {
      sql += ` AND TBP_BATCH_NO = '${data.PIPE_NO}' AND  TBP_CD_PROC = '1'`;
    } else if (data.RM_BATCH && data.RM_BATCH !== "") {
      sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${data.STATUS}'
                     AND t.lom_id_par_coil_no = '${data.RM_BATCH}') AND TBP_CD_PROC = '1'`;
    } else if (
      data.ORDNO &&
      data.ORDNO !== "" &&
      data.ORDITEM &&
      data.ORDITEM !== ""
    ) {
      sql += ` AND TBP_ID_ORDER_NO = '${data.ORDNO}' AND TBP_ITEM_NO = '${data.ORDITEM}' AND TBP_CD_PROC = '1'`;
    } else {
      // No filter provided: return empty result set to avoid large queries
      sql += ` AND 1=0`;
    }
    console.log("filldataqry120", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

