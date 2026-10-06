import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getTab1Data = async (data: any) => {
  try {
    let sql = `SELECT LOM_ID_BATCH BATCH_ID, LOM_ID_PAR_COIL_NO PARENT_BATCH,
            LOM_ID_FIRST_PAR MOTHER_BATCH,  LOM_TAGGED_BATCH TAGGED_BATCH, 
            LOM_SAMPL_TAG SAMPL_TAG, LOM_SEC1 THK, LOM_SEC2 ODIA,
            LOM_LENGTH LEN, LOM_CD_STATUS STATUS,
            TO_CHAR(LOM_TS_CREATION, 'DD-MM-YY HH24:MI:SS') CREATION_DT
            FROM V_LDP_PRODN
            WHERE LOM_CD_QLTY_ACTL <> 'SCRP'
            AND LOM_ID_PAR_COIL_NO = NVL('${
              data?.parentBatch ?? null
            }',LOM_ID_PAR_COIL_NO) 
            AND LOM_ID_FIRST_PAR = NVL('${
              data?.mBatch ?? null
            }',LOM_ID_FIRST_PAR) 
            AND LOM_TAGGED_BATCH = NVL('${
              data?.tagBatch ?? null
            }',LOM_TAGGED_BATCH) `;

    sql += ` ORDER BY LOM_TS_CREATION `;
    // console.log("sqlgetTab1Data: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const fetchTagData = async (data: any) => {
  try {
    let sql = `SELECT LOM_ID_BATCH BATCH_ID, LOM_TAGGED_BATCH TAGGED_BATCH, 
        LOM_ID_PAR_COIL_NO PARENT_BATCH, LOM_ID_FIRST_PAR MOTHER_BATCH,
        LOM_SAMPL_TAG SAMPL_TAG, LOM_CD_STATUS STATUS,
        TO_CHAR(LOM_TS_CREATION, 'DD-MM-YY HH24:MI:SS') CREATION_DT 
        FROM V_LDP_PRODN 
        WHERE LOM_TAGGED_BATCH = '${data?.batchId}' `;

    sql += ` ORDER BY LOM_TS_CREATION `;
    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (batchId: any) => {
  try {
    var sql = `call LD01B007(
           p_batch_ID => :p_batch_ID,
           LS_OUT_FLAG => :LS_OUT_FLAG
         )`;

    let binds = {
      p_batch_ID: batchId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("sqlSaveData: ", sql);
    // console.log("bindsSaveData: ", binds);
    let result = await query.executeQuery(sql, binds);
    // console.log("resSaveData: ", result);
    return result?.outBinds?.LS_OUT_FLAG;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertDataTemp = async (data: any) => {
  try {
    let sql = ` INSERT INTO V_RETAG_SCHD_TEMP
            (RST_TAG_TYPE, RST_PIPE_ID, RST_OLD_TAG_ID, RST_NEW_TAG_ID,
             RST_NEW_SINGLE_ID, RST_TOT_CNT_FRM_OLD_TAG,
             RST_TOT_CNT_FRM_NEW_TAG, RST_CRT_DT,
             RST_CRT_BY
            )
            VALUES ('SAMPLE', '${data?.pipeId}', '${data?.oldTagBatch}', '${data?.newTagBatch}',
             '', null, null, sysdate, '${data?.user}') `;
    // console.log("sql insertDataTemp: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const dltTempData = async () => {
  try {
    let sql = `DELETE FROM V_RETAG_SCHD_TEMP`;

    let result = await query.executeQuery(sql);
    // console.log("result-dltTempData: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
