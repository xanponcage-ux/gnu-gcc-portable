import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

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
    // let binds = {
    //   status: status,
    // };
    console.log("rmlist", sql);
    // console.log(binds);
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
    // let binds = {
    //   status: status,
    // };
    console.log("rmlist", sql);
    // console.log(binds);
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
    let sql = `select DISTINCT LOM_ID_BATCH,LOM_ID_PAR_COIL_NO ,(SELECT COUNT (1)
                    FROM v_bare_pdo t
                  WHERE t.tbp_cd_proc = 'D'
                    AND t.tbp_batch_no = LOM_ID_BATCH
                    AND NVL (t.tbp_rbt_10, 'N') = 'Y'
                    AND t.tbp_batch_proc_no =
                            (SELECT MAX (t1.tbp_batch_proc_no)
                              FROM v_bare_pdo t1
                              WHERE t1.tbp_batch_no = t.tbp_batch_no
                                AND t1.tbp_cd_proc = 'D')) AS no_of_rec 
          from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    console.log("pipeno", sql);
    // console.log("bindspipe",binds)
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
    // First, fetch the TEST_NAME using the labTest code
    const testNameQuery = `SELECT CD_DESC,CD_DESC1 FROM V_CODES WHERE CD_VALUE = :labTest AND CD_TYPE = 'TB052'`;
    const testNameBinds = { labTest: labTest };
    const testNameResult = await query.executeQuery(
      testNameQuery,
      testNameBinds
    );
    console.log(testNameResult);
    const testName = testNameResult?.rows?.[0]?.[0] || "";

    // Insert into FIELD_TEST_EXT table
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
      PLANT_CD: "0780", // Replace with actual plant code or pass as parameter
      BATCH_NO: batchNo,
      TEST_CODE: testNameResult?.rows?.[0]?.[1] || "",
      TEST_NAME: testName,
      PROD_DATE: prodDate,
      SHIFT: shift,
    };

    // console.log("insertFieldTestExt SQL: ", sql);
    // console.log("insertFieldTestExt binds: ", binds);

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
    // First, fetch the TEST_NAME using the labTest code
    const testNameQuery = `SELECT CD_DESC,CD_DESC1 FROM V_CODES WHERE CD_VALUE = :labTest AND CD_TYPE = 'TB053'`;
    const testNameBinds = { labTest: labTest };
    const testNameResult = await query.executeQuery(
      testNameQuery,
      testNameBinds
    );
    console.log(testNameResult);
    const testName = testNameResult?.rows?.[0]?.[0] || "";

    // Insert into FIELD_TEST_EXT table
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
      PLANT_CD: "0780", // Replace with actual plant code or pass as parameter
      BATCH_NO: batchNo,
      TEST_CODE: testNameResult?.rows?.[0]?.[1] || "",
      TEST_NAME: testName,
      PROD_DATE: prodDate,
      SHIFT: shift,
    };

    // console.log("insertFieldTestExt SQL: ", sql);
    // console.log("insertFieldTestExt binds: ", binds);

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

    let binds = {
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

    // console.log("sql80insert: ", sql);
    console.log("binds80scrapinsert: ", binds);
    console.log("sql80scrapinsert: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("LD12S001-insertScrapTempData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    const sql = `INSERT INTO V_BARE_PDO_TEMP(
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
        TBP_HEAT_NO,
        TBP_INSP_NAME,
        TBP_PIPE_LNG_10,
        TBP_COT_THK_1_120,
        TBP_COT_THK_2_120,
        TBP_COT_THK_3_120,
        TBP_COT_THK_4_120,
        TBP_COT_THK_5_120,
        tbp_cot_thk_6_120,
        tbp_cot_thk_7_120,
        tbp_cot_thk_8_120,
        tbp_cot_thk_9_120,
        tbp_cot_thk_10_120,
        tbp_cot_thk_11_120,
        tbp_cot_thk_12_120,
        tbp_cot_wt_vs_120,
        tbp_coat_stas_120,
        tbp_test_pip_120,
        TBP_HOLD_RSN,
        TBP_SHIFT_DN,
        TBP_SAMPLE_10,TBP_QTEMP_120)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,substr(F_Tatadate(TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')),1,1),
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ID_ORDER_NO,:ITEM_NO,
               :QUALITY_CD,:MATNR,:FLAG,TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI'),:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_LNG_10,:COT_THK_1,:COT_THK_2,:COT_THK_3,:COT_THK_4,:COT_THK_5,:cot_thk_6,:cot_thk_7,
               :cot_thk_8,:cot_thk_9,:cot_thk_10,:cot_thk_11,:cot_thk_12,:cot_wt_vs,:coat_stas,:test_pip,:HOLD_RSN,:SHIFT,:TAG,:TBP_QTEMP_120) `;
    let binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CD_PROC: data.CD_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      // Compute TBP_WEIGHT server-side. If frontend explicitly provided WEIGHT use it; otherwise compute metal + coat here.
      WEIGHT:
        String(data.RESULT).toUpperCase() === "NOT OK"
          ? Number(Number(data.PIPE_WEIGHT || 0).toFixed(3))
          : Number(
              (
                Number(data.PIPE_WEIGHT || 0) + Number(data.COT_WT_VS || 0)
              ).toFixed(3)
            ),
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
      HEAT_NO: data.HEAT_NO,
      INSP_NAME: data.INSP_NAME,
      PIPE_LNG_10: data.LENGTH,
      COT_THK_1: data.COT_THK_1,
      COT_THK_2: data.COT_THK_2,
      COT_THK_3: data.COT_THK_3,
      COT_THK_4: data.COT_THK_4,
      COT_THK_5: data.COT_THK_5,
      cot_thk_6: data.COT_THK_6,
      cot_thk_7: data.COT_THK_7,
      cot_thk_8: data.COT_THK_8,
      cot_thk_9: data.COT_THK_9,
      cot_thk_10: data.COT_THK_10,
      cot_thk_11: data.COT_THK_11,
      cot_thk_12: data.COT_THK_12,
      cot_wt_vs: data.COT_WT_VS,
      coat_stas: data.COAT_STAS,
      test_pip: data.TEST_PIP,
      HOLD_RSN: data.HOLD_RSN,
      TAG: data.TAG,
      TBP_QTEMP_120: data.TBP_QTEMP_120,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc120 = async (data: any) => {
  try {
    //console.log("20querydata",data)
    let resData = [];
    const sql = `call LDPDBA.LD12B001(
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
    // console.log("binds: ", binds);
    // console.log("query: ", sql);
    const result = await query.executeQuery(sql, binds);
    // console.log("proflag", result);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    //console.log("resData: ", resData);
    return resData;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    // const deleteQuery = `DELETE FROM LDPDBA.T_lab_field_test_EC WHERE ELF_BATCH_NO = :BATCH_NO`;
    // const deleteBinds = { BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "" };

    // console.log(
    //   "Deleting existing records for batch: ",
    //   data.BATCH_NO ? data.BATCH_NO : ""
    // );
    // await query.executeQuery(deleteQuery, deleteBinds);
    // console.log("Deletion completed successfully");
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
    // Build base SQL with bind placeholders to avoid SQL injection and ORA-01722 (invalid number)
    let sql = `SELECT b.tbp_batch_no, l.lom_sec2 AS tbp_pipe_od_10,
       l.lom_sec1 AS tbp_pipe_thk_10, l.lom_length AS tbp_pipe_lng_10,
       b.tbp_no_matnr, b.tbp_heat_no,
       TO_CHAR(
(
SELECT ldpdba.f_get_coat_wt(
         :plant,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_1_120,0) ELSE :w1 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_2_120,0) ELSE :w2 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_3_120,0) ELSE :w3 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_4_120,0) ELSE :w4 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_5_120,0) ELSE :w5 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_6_120,0) ELSE :w6 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_7_120,0) ELSE :w7 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_8_120,0) ELSE :w8 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_9_120,0) ELSE :w9 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_10_120,0) ELSE :w10 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_11_120,0) ELSE :w11 END,
         CASE WHEN (
             SELECT COUNT(1)
             FROM v_bare_pdo t
             WHERE t.tbp_cd_proc = 'D'
               AND t.tbp_batch_no = b.tbp_batch_no
               AND NVL(t.tbp_rbt_10,'N') = 'Y'
               AND t.tbp_batch_proc_no = (
                    SELECT MAX(t1.tbp_batch_proc_no)
                    FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D'
               )
         ) > 0 THEN NVL(d120.tbp_cot_thk_12_120,0) ELSE :w12 END,
         l.lom_length,
         l.lom_sec2
       )
FROM dual
),
'FM9999999990.000'
) AS coat_wt,
       b.tbp_id_order_no AS order_no, b.tbp_item_no AS item, b.tbp_rbt_10,
       e.enc_cust_name AS cust_name, l.lom_planned_proc AS plan_proc,
       (SELECT f_get_nextproc (l.lom_planned_proc,
                               l.lom_passed_proc,
                               'D'
                              )
          FROM DUAL) AS next_proc,
       (SELECT d.tbp_asl_no_80
          FROM v_bare_pdo d
         WHERE d.tbp_batch_no = l.lom_id_batch
           AND d.tbp_cd_proc = '8'
           AND d.tbp_batch_proc_no =
                  (SELECT MAX (x.tbp_batch_proc_no)
                     FROM v_bare_pdo x
                    WHERE x.tbp_batch_no = d.tbp_batch_no
                      AND x.tbp_cd_proc = '8')
           AND ROWNUM = 1) AS asl_no,
       (SELECT COUNT (1)
          FROM v_bare_pdo t
         WHERE t.tbp_cd_proc = 'D'
           AND t.tbp_batch_no = b.tbp_batch_no
           AND NVL (t.tbp_rbt_10, 'N') = 'Y'
           AND t.tbp_batch_proc_no =
                  (SELECT MAX (t1.tbp_batch_proc_no)
                     FROM v_bare_pdo t1
                    WHERE t1.tbp_batch_no = t.tbp_batch_no
                      AND t1.tbp_cd_proc = 'D')) AS no_of_rec,
       (SELECT CASE
                  WHEN REGEXP_LIKE (a.tbp_dia_end_10,
                                    '^[0-9]+$'
                                   )
                     THEN TO_NUMBER (a.tbp_dia_end_10)
                  ELSE NULL
               END
          FROM v_bare_pdo a
         WHERE a.tbp_batch_no = l.lom_id_batch
           AND a.tbp_cd_proc = 'A'
           AND a.tbp_batch_proc_no =
                  (SELECT MAX (x.tbp_batch_proc_no)
                     FROM v_bare_pdo x
                    WHERE x.tbp_batch_no = a.tbp_batch_no
                      AND x.tbp_cd_proc = 'A')
           AND ROWNUM = 1) AS tbp_dia_end_10,
       b.tbp_depth_10 AS depth_mm, b.tbp_widths_10 AS width_mm,
       l.lom_ms_piece_actl, l.lom_id_par_coil_no,
       (SELECT m.geometry
          FROM v_ympct_tub_matl m
         WHERE m.mandt = '600' AND m.matnr = l.lom_no_matnr) AS geo,
       d120.tbp_result, d120.tbp_remark, d120.tbp_insp_name,
       d120.tbp_cot_thk_1_120, d120.tbp_cot_thk_2_120, d120.tbp_cot_thk_3_120,
       d120.tbp_cot_thk_4_120, d120.tbp_cot_thk_5_120, d120.tbp_cot_thk_6_120,
       d120.tbp_cot_thk_7_120, d120.tbp_cot_thk_8_120, d120.tbp_cot_thk_9_120,
       d120.tbp_cot_thk_10_120, d120.tbp_cot_thk_11_120,
       d120.tbp_cot_thk_12_120, 
       d120.tbp_coat_stas_120, d120.tbp_test_pip_120, d120.tbp_hold_rsn, d120.tbp_qtemp_120, d120.tbp_shift_dn,
       d120.tbp_weight, d120.tbp_prod_date, d120.tbp_prod_start_dt,
       d120.tbp_prod_end_dt,
       d120.TBP_SAMPLE_10
  FROM v_bare_pdo b JOIN v_end_cust_ord_epa e
       ON b.tbp_id_order_no = e.enc_id_order AND b.tbp_item_no = e.enc_no_item
       JOIN V_LDP_PRODN  l
       ON b.tbp_batch_no = l.lom_id_batch
     AND b.tbp_plant_cd = l.lom_cd_epa
     AND l.lom_cd_epa = e.enc_cd_epa
     AND l.lom_id_order_cus = e.enc_id_order
     AND l.lom_id_ord_item_cus = e.enc_no_item
       LEFT JOIN
       (SELECT d.*
          FROM v_bare_pdo d
         WHERE d.tbp_cd_proc = 'D') d120
       ON d120.tbp_batch_no = b.tbp_batch_no
     AND d120.tbp_batch_proc_no =
            (SELECT MAX (x.tbp_batch_proc_no)
               FROM v_bare_pdo x
              WHERE x.tbp_batch_no = d120.tbp_batch_no AND x.tbp_cd_proc = 'D')
 WHERE l.lom_cd_status = :status
   AND b.tbp_batch_proc_no =
            (SELECT MAX (t1.tbp_batch_proc_no)
               FROM v_bare_pdo t1
              WHERE t1.tbp_batch_no = b.tbp_batch_no AND t1.tbp_cd_proc = '1')`;

    // Prepare binds and coerce coating thickness values to numbers (default 0 if not parseable)
    const safeNumber = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    let binds: any = {
      plant: data.PLANT ? data.PLANT : "0780",
      w1: safeNumber(data.W1),
      w2: safeNumber(data.W2),
      w3: safeNumber(data.W3),
      w4: safeNumber(data.W4),
      w5: safeNumber(data.W5),
      w6: safeNumber(data.W6),
      w7: safeNumber(data.W7),
      w8: safeNumber(data.W8),
      w9: safeNumber(data.W9),
      w10: safeNumber(data.W10),
      w11: safeNumber(data.W11),
      w12: safeNumber(data.W12),
      status: data.STATUS ? data.STATUS : "",
    };

    // Apply filters: prefer PIPE_NO, then RM_BATCH, then ORDER/ITEM (LD08 behaviour)
    if (data.PIPE_NO && data.PIPE_NO !== "") {
      sql += ` AND b.TBP_BATCH_NO = :pipe_no AND  b.TBP_CD_PROC = '1'`;
      binds.pipe_no = data.PIPE_NO;
    } else if (data.RM_BATCH && data.RM_BATCH !== "") {
      sql += ` AND b.TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status= :status and t.lom_id_par_coil_no = :rm_batch) AND b.TBP_CD_PROC = '1'`;
      binds.rm_batch = data.RM_BATCH;
      // status bind already present
    } else if (
      data.ORDNO &&
      data.ORDNO !== "" &&
      data.ORDITEM &&
      data.ORDITEM !== ""
    ) {
      sql += ` AND b.TBP_ID_ORDER_NO = :ordno AND b.TBP_ITEM_NO = :orditem  AND b.TBP_CD_PROC='1'`;
      binds.ordno = data.ORDNO;
      binds.orditem = data.ORDITEM;
    }

    sql += ` order by tbp_dia_end_10 `;

    console.log("filldataqry120", sql);
    console.log("filldata binds", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const verifyProdDateRepetition = async (
  data: any
): Promise<"YES" | "NO"> => {
  try {
    const sql = `
      SELECT
        CASE
          WHEN COUNT(*) > 0 THEN 'YES'
          ELSE 'NO'
        END AS REPETITION_STATUS
      FROM V_BARE_PDO t
      WHERE t.TBP_CD_PROC = 'D'
        AND t.TBP_BATCH_NO = :Batch
        AND NVL(t.TBP_RBT_10, 'N') <> 'Y'
        AND TRUNC(t.TBP_PROD_DATE) =
            TRUNC(TO_DATE(:PROD_DATE, 'DD-MON-YYYY'))
    `;

    const binds: any = {
      Batch: data.BATCH_NO,
      PROD_DATE: data.PROD_DATE,
    };

    console.log("verifyProdDateRepetition query =>", sql);

    console.log("verifyProdDateRepetition binds =>", binds);

    const result: any = await query.executeQuery(sql, binds);

    console.log("verifyProdDateRepetition result =>", result);

    /*
     * Support the common query result formats:
     *
     * 1. [{ REPETITION_STATUS: "YES" }]
     * 2. [["YES"]]
     * 3. { rows: [{ REPETITION_STATUS: "YES" }] }
     * 4. { rows: [["YES"]] }
     */

    const firstRow = result?.rows?.[0] ?? result?.[0] ?? null;

    const repetitionStatus =
      firstRow?.REPETITION_STATUS ??
      firstRow?.repetition_status ??
      firstRow?.[0] ??
      "NO";

    return String(repetitionStatus).trim().toUpperCase() === "YES"
      ? "YES"
      : "NO";
  } catch (error) {
    console.error("verifyProdDateRepetition error =>", error);

    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTataDate = async (prodEndDt: any) => {
  try {
    const sql = `select substr(F_Tatadate(
              TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),1,1)
               shift,substr(F_Tatadate(TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),2) prod_dt from dual`;
    const binds = {
      prodEndDt: prodEndDt,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoatWt = async (
  W1: any,
  W2: any,
  W3: any,
  W4: any,
  W5: any,
  W6: any,
  W7: any,
  W8: any,
  W9: any,
  W10: any,
  W11: any,
  W12: any,
  LENGTH: any,
  OD: any
) => {
  try {
    // Coerce to numbers, default 0 for non-numeric inputs
    const safeNumber = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const binds = {
      plant: "0780",
      w1: safeNumber(W1),
      w2: safeNumber(W2),
      w3: safeNumber(W3),
      w4: safeNumber(W4),
      w5: safeNumber(W5),
      w6: safeNumber(W6),
      w7: safeNumber(W7),
      w8: safeNumber(W8),
      w9: safeNumber(W9),
      w10: safeNumber(W10),
      w11: safeNumber(W11),
      w12: safeNumber(W12),
      length: LENGTH,
      od: OD,
    };

    const sql = `select LDPDBA.f_get_coat_wt(:plant,:w1,:w2,:w3,:w4,:w5,:w6,:w7,:w8,:w9,:w10,:w11,:w12,:length,:od) COAT_WT from dual `;
    console.log("coat", sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
