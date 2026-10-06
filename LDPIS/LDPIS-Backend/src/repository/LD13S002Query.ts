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
    WHERE LOM_CD_STATUS = 'EQ' `;

    if (data.plant) {
      sql += ` AND lom_cd_epa = '${data?.plant}'`;
    }
    if (data.batchId) {
      sql += ` And LOM_ID_BATCH = '${data?.batchId}'`;
    }
    if (data.mBatch) {
      sql += ` and LOM_ID_FIRST_PAR = '${data?.mBatch}'`;
    }
    if (data.thick) {
      sql += ` and LOM_SEC1 = '${data?.thick}'`;
    }
    if (data.odia) {
      sql += ` and LOM_SEC2 = '${data?.odia}'`;
    }
    sql += ` order by LOM_ID_PAR_COIL_NO, LOM_ID_BATCH `;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (batchId: any, plant: any) => {
  try {
    var sql = `UPDATE V_LDP_PRODN SET LOM_CD_STATUS = DECODE(LOM_CD_NEXT_PROC,'W','WE','E','EC') ,
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
