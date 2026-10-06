import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const displanyLengthMaster = async (plant: any) => {
  try {
    var sql = `SELECT * FROM V_TUB_LENGTH_MASTER WHERE TLM_CD_EPA = :plant`;
    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateLengthData = async (adid: any, dt: any) => {
  try {
    let sql = `UPDATE 
        V_TUB_LENGTH_MASTER 
    SET 
        TLM_SFG_THK = :TLM_SFG_THK, 
        TLM_SFG_LENGTH = :TLM_SFG_LENGTH, 
        TLM_TS_UPDATE =SYSDATE, 
        TLM_TS_UPD_USER = SUBSTR(:TLM_TS_UPD_USER, 1, 10) 
    WHERE 
        TLM_CD_EPA = :TLM_CD_EPA 
        AND ROUND(TLM_SFG_OD,3) = :TLM_SFG_OD 
        AND ROUND(TLM_FG_ID,3) =:TLM_FG_ID 
        AND ROUND(TLM_FG_OD,3) =:TLM_FG_OD 
        AND ROUND(TLM_FG_THK, 3) =:TLM_FG_THK 
        AND ROUND(TLM_FG_LENGTH,3) =:TLM_FG_LENGTH`;

    let binds = {
      TLM_CD_EPA: dt.TLM_CD_EPA,
      TLM_SFG_OD: dt.TLM_SFG_OD,
      TLM_FG_ID: dt.TLM_FG_ID,
      TLM_FG_OD: dt.TLM_FG_OD,
      TLM_FG_THK: dt.TLM_FG_THK,
      TLM_FG_LENGTH: dt.TLM_FG_LENGTH,
      TLM_SFG_THK: dt.TLM_SFG_THK,
      TLM_SFG_LENGTH: dt.TLM_SFG_LENGTH,
      TLM_TS_UPD_USER: adid ? adid : 0,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteLengthData = async (adid: any, dt: any) => {
  try {
    var inssql = `INSERT INTO V_TUB_LENGTH_MASTER_DELETED 
        SELECT 
        * 
        FROM 
        V_TUB_LENGTH_MASTER 
        WHERE 
        TLM_CD_EPA =:TLM_CD_EPA 
        AND TLM_SFG_OD =:TLM_SFG_OD 
        AND TLM_FG_ID =:TLM_FG_ID 
        AND TLM_FG_OD =:TLM_FG_OD 
        AND TLM_FG_THK =:TLM_FG_THK 
        AND ROUND(TLM_FG_LENGTH,3) =:TLM_FG_LENGTH
        AND TLM_SFG_THK = :TLM_SFG_THK`;

    var insBinds = {
      TLM_CD_EPA: dt.TLM_CD_EPA,
      TLM_SFG_OD: dt.TLM_SFG_OD,
      TLM_FG_ID: dt.TLM_FG_ID,
      TLM_FG_OD: dt.TLM_FG_OD,
      TLM_FG_THK: dt.TLM_FG_THK,
      TLM_FG_LENGTH: dt.TLM_FG_LENGTH,
      TLM_SFG_THK: dt.TLM_SFG_THK,
    };

    let resInsert = await query.executeQuery(inssql, insBinds);
    if (resInsert.rowsAffected > 0) {
      var sql = `DELETE FROM 
            V_TUB_LENGTH_MASTER 
          WHERE 
            TLM_CD_EPA =:TLM_CD_EPA 
            AND TLM_SFG_OD =:TLM_SFG_OD 
            AND TLM_FG_ID =:TLM_FG_ID 
            AND TLM_FG_OD =:TLM_FG_OD 
            AND TLM_FG_THK =:TLM_FG_THK 
            AND ROUND(TLM_FG_LENGTH,3) =:TLM_FG_LENGTH
            AND TLM_SFG_THK = :TLM_SFG_THK`;

      let binds = {
        TLM_CD_EPA: dt.TLM_CD_EPA,
        TLM_SFG_OD: dt.TLM_SFG_OD,
        TLM_FG_ID: dt.TLM_FG_ID,
        TLM_FG_OD: dt.TLM_FG_OD,
        TLM_FG_THK: dt.TLM_FG_THK,
        TLM_FG_LENGTH: dt.TLM_FG_LENGTH,
        TLM_SFG_THK: dt.TLM_SFG_THK,
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const perviewUpdateData = async (adid: any, dt: any, plant: any) => {
  try {
    const sql = `call TTSB010 (
            P_PLANT => :P_PLANT,
            P_SFG_OD => :P_SFG_OD,
            P_FG_ID => :P_FG_ID,
            P_FG_OD => :P_FG_OD,
            P_FG_THK => :P_FG_THK,
            P_FG_LENGTH => :P_FG_LENGTH,
            P_SFG_THK => :P_SFG_THK,
            P_SFG_LENGTH => :P_SFG_LENGTH,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG       
            )`;

    let binds = {
      P_PLANT: plant,
      P_SFG_OD: dt.TLM_SFG_OD ? dt.TLM_SFG_OD : 0,
      P_FG_ID: dt.TLM_FG_ID ? dt.TLM_FG_ID : 0,
      P_FG_OD: dt.TLM_FG_OD ? dt.TLM_FG_OD : 0,
      P_FG_THK: dt.TLM_FG_THK ? dt.TLM_FG_THK : 0,
      P_FG_LENGTH: dt.TLM_FG_LENGTH ? dt.TLM_FG_LENGTH : 0,
      P_SFG_THK: dt.TLM_SFG_THK ? dt.TLM_SFG_THK : 0,
      P_SFG_LENGTH: dt.TLM_SFG_LENGTH ? dt.TLM_SFG_LENGTH : 0,
      P_USER: adid,
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
