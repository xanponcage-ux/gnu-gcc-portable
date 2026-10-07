import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

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
       LOM_PLANNED_PROC PLAN_PROC, LOM_PASSED_PROC PASS_PROC, LOM_SAMPL_TAG SAMPLE_TAG
    FROM V_LDP_PRODN
    WHERE LOM_CD_STATUS = 'KC' `;

    const plant = String(data.plant ?? "").trim();
    const pipeNo = String(data.batchId ?? "").trim();
    const orderNo = String(data.ordNo ?? "").trim();
    const orderItem = String(data.ordItem ?? "").trim();
    const binds: any = {};
    if (!plant || (!pipeNo && (!orderNo || !orderItem))) {
      sql += " AND 1=0";
    } else {
      sql += " AND LOM_CD_EPA = :plant";
      binds.plant = plant;
      if (pipeNo) {
        sql += " AND LOM_ID_BATCH = :pipeNo";
        binds.pipeNo = pipeNo;
      } else {
        sql += " AND LOM_ID_ORDER_CUS = :orderNo AND LOM_ID_ORD_ITEM_CUS = :orderItem";
        binds.orderNo = orderNo;
        binds.orderItem = orderItem;
      }
      for (const [key, column] of [["mBatch", "LOM_ID_FIRST_PAR"], ["thick", "LOM_SEC1"], ["odia", "LOM_SEC2"]]) {
        const value = String(data[key] ?? "").trim();
        if (value) {
          sql += ` AND ${column} = :${key}`;
          binds[key] = value;
        }
      }
    }
    sql += " ORDER BY LOM_ID_PAR_COIL_NO, LOM_ID_BATCH";
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (batchId: any, plant: any) => {
  try {
    var sql = `UPDATE V_LDP_PRODN SET LOM_CD_STATUS = LOM_CD_NEXT_PROC||'C' ,
                                       LOM_REC_UPD_DT = SYSDATE,
                                       LOM_REC_UPD_USR = SUBSTR(USER,1,10),
                                       lom_dt_piece_upd = SYSDATE
                WHERE LOM_ID_BATCH = :LS_BATCH_NO AND LOM_CD_EPA = :LS_PLANT_CD `;

    let binds = {
      LS_BATCH_NO: batchId ?? "",
      LS_PLANT_CD: plant ?? "",
    };
    let result = await query.executeQuery(sql, binds);
    console.log("result: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};


export const getPipeNoList = async (plant: any) => {
  const sql = `SELECT DISTINCT LOM_ID_BATCH, LOM_ID_ORDER_CUS, LOM_ID_ORD_ITEM_CUS
    FROM V_LDP_PRODN
    WHERE LOM_CD_STATUS = 'KC' AND LOM_CD_EPA = :plant
    ORDER BY LOM_ID_BATCH`;
  return await query.executeQuery(sql, { plant: String(plant ?? "").trim() });
};
