import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getBatchDetails = async (data: any) => {
  try {
    let sql = `SELECT LOM_ID_BATCH AS ID_BATCH,  
      LOM_CD_CURR_PROC AS CURR_PROC,
       LOM_CD_NEXT_PROC AS NEXT_PROC, LOM_CD_PREV_PROC AS PREV_PROC,
       LOM_CD_QLTY_ACTL AS QLTY_ACTL, LOM_CD_QLTY_AIM AS QLTY_AIM,
       LOM_CD_STATUS AS STATUS, LOM_CD_YRD AS YARD,
       TO_CHAR(LOM_TS_CREATION, 'DD-MON-YYYY HH:MI:SS') AS CREATION_TS, LOM_FL_HOLD AS FL_HOLD,
       LOM_IDIA AS IDIA, LOM_NO_CAST AS CAST_NO, LOM_LENGTH AS LENGTH,
       TO_CHAR(LOM_MS_GROSS_ACTL, 'FM999999990.000') AS GROSS_ACTL, TO_CHAR(LOM_MS_GROSS_CAL, 'FM999999990.000') AS GROSS_CAL,
       TO_CHAR(LOM_MS_PIECE_ACTL, 'FM999999990.000') AS PIECE_ACTL,  TO_CHAR(LOM_MS_PIECE_CAL, 'FM999999990.000') AS PIECE_CAL, 
       LOM_ODIA AS ODIA, LOM_CD_PROD AS PROD_CD, TO_CHAR(LOM_SEC1, 'FM999999990.000') AS THICK,
       TO_CHAR(LOM_SEC2, 'FM999999990.000') AS WIDTH, LOM_ID_ORDER_CUS AS ORDER_ID,
       LOM_ID_ORD_ITEM_CUS AS ITEM, LOM_CD_SHIFT AS SHIFT_CODE,
       LOM_ID_PAR_COIL_NO AS PAR_COIL_NO, LOM_ID_FIRST_PAR AS FIRST_PAR_ID,
       LOM_PASSED_PROC AS PASSED_PROC, TO_CHAR(LOM_TS_COIL_CREATE, 'DD-MON-YYYY HH:MI:SS') AS COIL_CREATE_TS,
       TO_CHAR(LOM_TS_REC_CREATE, 'DD-MON-YYYY HH:MI:SS') AS REC_CREATE_TS, LOM_TDC_AIM AS TDC_AIM,
       LOM_TDC_ACTL AS TDC_ACTL, LOM_OIL_TYPE AS OIL_TYPE,
       LOM_NO_PIECES AS NO_PIECES, LOM_CD_EPA AS EPA_CODE,
       LOM_PLANNED_PROC AS PLANNED_PROC, LOM_CD_PACK AS PACK_CODE,
       LOM_NO_MATNR AS MAT_NO, LOM_MERGE_BATCH AS MERGE_BATCH,
       LOM_REMARKS AS REMARKS, LOM_MILL_NO AS MILL_NO
        FROM V_LDP_PRODN  `;

    if (data?.plant) {
      sql += ` WHERE LOM_CD_EPA = '${data?.plant}' `;
    }
    if (data?.status) {
      sql += ` AND LOM_CD_STATUS = '${data?.status}' `;
    }

    sql += ` ORDER BY LOM_TS_CREATION `;
    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const updateStatusBtn = async (batchId: any, usr: any) => {
//   try {
//     console.log("batchId: ", batchId, usr);
//     let sql = ` update v_ldp_prodn
//       set lom_cd_status = 'RD'
//       ,lom_dt_piece_upd = sysdate
//       ,lom_rec_upd_dt = sysdate
//       ,lom_rec_upd_usr = '${usr}'
//       where lom_id_batch = '${batchId}' `;

//     console.log("sql: ", sql);
//     return await query.executeQuery(sql);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };


export const updateStatusBtn = async (data: any) => {
  try {

    let sql = `call LDPDBA.LDDIS001(
      LS_BATCH     => :LS_BATCH,
      LS_STATUS    => :LS_STATUS,
      LS_OUT_FLAG  => :LS_OUT_FLAG
    )`;

    const binds = {
      LS_BATCH: data?.batchId,
      LS_STATUS: data?.status,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("bindsProc: ", binds);
    console.log("sql: ", sql);
    let result = await query.executeQuery(sql, binds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
