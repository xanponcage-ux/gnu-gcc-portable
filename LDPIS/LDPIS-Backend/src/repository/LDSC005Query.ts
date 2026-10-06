import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getCodetyp = async (req: any) => {
  try {
    let sql = `select distinct cd_type from v_codes`;
    let binds = { tdc: "" };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCodeval = async (req: any) => {
  try {
    let sql = `select distinct cd_value from v_codes where cd_type =:cd_type`;
    let binds = { cd_type: req.body.cdvalue };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRecords = async (req: any) => {
  try {
    let cdval = req.body.cdval;
    var sql = `select distinct cd_type, cd_value, cd_desc from v_codes where cd_type =:cd_type`;

    let binds = {
      cd_type: req.body.cdtype,
    };
    if (cdval && cdval != "") {
      sql += " and  cd_value =:cd_value";
      binds["cd_value"] = cdval;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertRecords = async (req: any) => {
  try {
    let sql = `select count(1) CNT from v_codes where cd_type =:cd_type and cd_value =:cd_value`;
    let binds = {
      cd_type: req.CD_TYPE,
      cd_value: req.CD_VALUE,
    };
    let checkExt = await query.executeQuery(sql, binds);
    if (checkExt.length > 1) {
      let sql = `INSERT INTO V_CODES (cd_type, cd_value, cd_desc)
            VALUES (:CD_TYPE,:CD_VALUE,:CD_DESC)`;
      let binds = {
        CD_TYPE: req.CD_TYPE,
        CD_VALUE: req.CD_VALUE,
        CD_DESC: req.CD_DESC,
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateRecords = async (req: any) => {
  try {
    let sql = `select distinct cd_type, cd_value, cd_desc from v_codes where cd_type =:cd_type and  cd_value =:cd_value`;
    let binds = {
      cd_type: req.CD_TYPE,
      cd_value: req.CD_VALUE,
    };
    let getPrev = await query.executeQuery(sql, binds);
    if (getPrev.rows) {
      let sql = `UPDATE V_CODES SET CD_VALUE =:EDIT_CD_VALUE, CD_DESC =:EDITCD_DESC
            WHERE CD_TYPE =:CD_TYPE AND CD_VALUE =:CD_VALUE AND CD_DESC =:CD_DESC`;
      let binds = {
        EDIT_CD_VALUE: req.CD_VALUE,
        EDITCD_DESC: req.CD_DESC,
        CD_TYPE: req.CD_TYPE,
        CD_VALUE: getPrev.rows[0][1],
        CD_DESC: getPrev.rows[0][2],
      };
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteRecords = async (req: any) => {
  try {
    let sql = `UPDATE V_CODES SET CD_VALUE = ('X' || CD_VALUE)
        WHERE CD_TYPE =:CD_TYPE AND CD_VALUE =:CD_VALUE AND CD_DESC =:CD_DESC`;
    let binds = {
      CD_TYPE: req.CD_TYPE,
      CD_VALUE: req.CD_VALUE,
      CD_DESC: req.CD_DESC,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetBatchId = async (plant: any, status: any) => {
  try {
    let sql = `SELECT DISTINCT LOM_ID_BATCH
      FROM V_LDP_PRODN
      WHERE LOM_CD_EPA=:Plant
      AND LOM_CD_QLTY_ACTL<>'SCRP'
    `;
    //   if (status === 'HOLD') {
    //     sql += ` AND (LOM_CD_STATUS LIKE '%B' OR LOM_CD_STATUS LIKE '%F')`
    //   }
    //   if (status === 'UPDATE REMARKS') {
    //     sql += ` AND (LOM_CD_STATUS LIKE '%D' OR LOM_CD_STATUS LIKE '%Q')`
    //   }
    sql += ` ORDER BY 1`;
    let binds = { plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getIndTubesData = async (req: any) => {
  try {
    let cdval = req.body.cdval;
    var sql = `select distinct cd_type, cd_value, cd_desc from v_codes where cd_type =:cd_type`;

    let binds = {
      cd_type: req.body.cdtype,
    };
    if (cdval && cdval != "") {
      sql += " and  cd_value =:cd_value";
      binds["cd_value"] = cdval;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
