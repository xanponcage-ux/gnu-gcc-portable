import query from "../infrastructure/database/querys";
import Error from "../models/errors";

export const getCoils = async (data: any) => {
  try {
    let sql = `SELECT LOM_ID_BATCH BATCH_ID, LOM_CD_CURR_PROC CURR_PROC,
       LOM_CD_PREV_PROC PREV_PROC, LOM_CD_NEXT_PROC NEXT_PROC,
       LOM_CD_QLTY_ACTL QLTY_CD, LOM_CD_STATUS STATUS, LOM_CD_YRD YARD,
       TO_CHAR(LOM_TS_CREATION, 'DD-MM-YY HH24:MI:SS') PROD_DT, LOM_FL_HOLD HOLD_FL, LOM_IDIA IDIA,
       LOM_ODIA ODIA, LOM_NO_CAST CAST_NO, LOM_LENGTH LEN,
       LOM_MS_GROSS_ACTL GROSS_WT, LOM_MS_PIECE_ACTL NET_WT,
       LOM_CD_PROD PROD_CD, LOM_SEC1 THICK, LOM_SEC2 WIDTH,
       LOM_ID_ORDER_CUS CUST_ORDER, LOM_ID_ORD_ITEM_CUS CUST_ITEM,
       LOM_ID_PAR_COIL_NO PARENT_BATCH, LOM_ID_FIRST_PAR MOTHER_BATCH,
       LOM_TDC_ACTL TDC, LOM_CD_EPA PLANT, LOM_NO_MATNR MAT_NO,
       LOM_PLANNED_PROC PLAN_PROC, LOM_PASSED_PROC PASS_PROC, LOM_SAMPL_TAG SAMPLE_TAG,
       LOM_TAGGED_BATCH TAGGED_BATCH,
       (SELECT a.TBP_ASL_NO_80 FROM V_BARE_PDO a
         WHERE a.TBP_BATCH_NO = LOM_ID_BATCH AND a.TBP_PLANT_CD = LOM_CD_EPA
           AND a.TBP_CD_PROC = '8'
           AND a.TBP_BATCH_PROC_NO = (SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
             WHERE x.TBP_BATCH_NO = a.TBP_BATCH_NO AND x.TBP_PLANT_CD = a.TBP_PLANT_CD AND x.TBP_CD_PROC = '8')
           AND ROWNUM = 1) AS ASL_NO,
       (SELECT f.TBP_FLD_NO_130 FROM V_BARE_PDO f
         WHERE f.TBP_BATCH_NO = LOM_ID_BATCH AND f.TBP_PLANT_CD = LOM_CD_EPA
           AND f.TBP_CD_PROC = 'E'
           AND f.TBP_BATCH_PROC_NO = (SELECT MAX(x.TBP_BATCH_PROC_NO) FROM V_BARE_PDO x
             WHERE x.TBP_BATCH_NO = f.TBP_BATCH_NO AND x.TBP_PLANT_CD = f.TBP_PLANT_CD AND x.TBP_CD_PROC = 'E')
           AND ROWNUM = 1) AS FIELD_NO
       FROM V_LDP_PRODN
       WHERE LOM_CD_EPA = :plant AND LOM_CD_STATUS IN ('2F', '8F')`;


    const binds: any = { plant: "0780" };
    const filters = [
      ["batchId", "LOM_ID_BATCH"], ["mBatch", "LOM_ID_FIRST_PAR"],
    ];
    for (const [key, column] of filters) {
      const value = String(data[key] ?? "").trim();
      if (value) {
        sql += ` AND ${column} = :${key}`;
        binds[key] = value;
      }
    }
    sql += " ORDER BY LOM_TS_CREATION DESC, LOM_ID_PAR_COIL_NO, LOM_ID_BATCH";
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (data: any) => {
  const sql = `UPDATE V_LDP_PRODN
SET    LOM_CD_STATUS    = 'RC',
       LOM_REC_UPD_DT   = SYSDATE,
       LOM_REC_UPD_USR  = USER,
       LOM_DT_PIECE_UPD = SYSDATE,
       LOM_PASSED_PROC = LOM_PASSED_PROC || SUBSTR(LOM_CD_STATUS,1,1),
       LOM_CD_CURR_PROC = SUBSTR(LOM_CD_STATUS,1,1),
       LOM_CD_NEXT_PROC = (SELECT F_GET_NEXTPROC(LOM_PLANNED_PROC,
         LOM_PASSED_PROC || SUBSTR(LOM_CD_STATUS,1,1), '2') FROM DUAL)
WHERE LOM_ID_BATCH = :TBP_BATCH_NO
  AND LOM_CD_EPA = '0780'
  AND LOM_CD_STATUS IN ('2F', '8F')`;
  // Recheck eligibility at save time; a stale selection must not be updated again.
  return query.executeQuery(sql, { TBP_BATCH_NO: data.batchId });
};
