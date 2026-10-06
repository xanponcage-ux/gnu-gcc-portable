import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

// NOTE: SQL queries are placeholders. Replace `sql` and `binds` once you provide the real queries.
export const getSpecList = async (req: any) => {
  try {
    const sql = `select distinct SPEC from V_YMPCT_TUB_MATL`;
    // const binds = {
    //   plant: req?.plant,
    // };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const writeAccess = async (req: any) => {
  try {
    const sql = `select count(*) as COUNT from V_CODES WHERE CD_TYPE='TB066' and CD_VALUE=user`;
    // const binds = {
    //   plant: req?.plant,
    // };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getParameters = async (req: any) => {
  try {
    const sql = `select CD_VALUE||'-'||CD_DESC PARA,CD_DESC1 as UOM from V_CODES where CD_TYPE='TB064'`;
    // const binds = {
    //   plant: req?.plant,
    // };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getData = async (req: any) => {
  try {
    const sql = `SELECT
    USL_SPEC,
    USL_TEST_PARA,
    USL_CD_TEST,
    USL_PARA_MIN,
    USL_PARA_MAX,
    USL_PARA_UNIT,
    USL_PARA_SEQ_NO,
    USL_REC_CRT_DT,
    USL_REC_CRT_BY,
    USL_UPD_DT,
    USL_UPD_BY
FROM
    LDPDBA.T_USER_SPEC_LIMIT
WHERE
    USL_SPEC = :SPEC
ORDER BY
    USL_TEST_PARA`;
    const binds = {
      SPEC: req?.SPEC,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const upsert = async (req: any) => {
  try {
    const data = req;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error.InternalServerErrorMsg("Invalid payload");
    }

    const sql = `
      MERGE INTO LDPDBA.T_USER_SPEC_LIMIT tgt
      USING (
        SELECT
          :USL_SPEC        AS USL_SPEC,
          :USL_TEST_PARA   AS USL_TEST_PARA,
          :USL_CD_TEST     AS USL_CD_TEST,
          :USL_PARA_MIN    AS USL_PARA_MIN,
          :USL_PARA_MAX    AS USL_PARA_MAX,
          :USL_PARA_UNIT   AS USL_PARA_UNIT,
          :USL_PARA_SEQ_NO AS USL_PARA_SEQ_NO
        FROM dual
      ) src
      ON (
        tgt.USL_SPEC = src.USL_SPEC
        AND tgt.USL_TEST_PARA = src.USL_TEST_PARA
        AND tgt.USL_CD_TEST = src.USL_CD_TEST
      )
      WHEN MATCHED THEN
        UPDATE SET
          tgt.USL_PARA_MIN    = src.USL_PARA_MIN,
          tgt.USL_PARA_MAX    = src.USL_PARA_MAX,
          tgt.USL_PARA_UNIT   = src.USL_PARA_UNIT,
          tgt.USL_PARA_SEQ_NO = src.USL_PARA_SEQ_NO,
          tgt.USL_UPD_DT      = SYSDATE,
          tgt.USL_UPD_BY      = user
      WHEN NOT MATCHED THEN
        INSERT (
          USL_SPEC,
          USL_TEST_PARA,
          USL_CD_TEST,
          USL_PARA_MIN,
          USL_PARA_MAX,
          USL_PARA_UNIT,
          USL_PARA_SEQ_NO,
          USL_REC_CRT_DT,
          USL_REC_CRT_BY
        )
        VALUES (
          src.USL_SPEC,
          src.USL_TEST_PARA,
          src.USL_CD_TEST,
          src.USL_PARA_MIN,
          src.USL_PARA_MAX,
          src.USL_PARA_UNIT,
          src.USL_PARA_SEQ_NO,
          SYSDATE,
          user
        )
    `;
    console.log("data:", data);
    const bindArray = data.map((row: any) => ({
      USL_SPEC: row.USL_SPEC,
      USL_TEST_PARA: row.USL_TEST_PARA,
      USL_CD_TEST: row.USL_CD_TEST || "",
      USL_PARA_MIN: row.USL_PARA_MIN || null,
      USL_PARA_MAX: row.USL_PARA_MAX || null,
      USL_PARA_UNIT: row.USL_PARA_UNIT || "",
      USL_PARA_SEQ_NO: row.USL_PARA_SEQ_NO || 0,
      //   USER_ID: row.user,
    }));
    console.log("upsert binds", bindArray);
    return await query.executeMany(sql, bindArray);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteRow = async (req: any) => {
  try {
    const data = req;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error.InternalServerErrorMsg("Invalid payload");
    }

    const sql = `
      DELETE FROM LDPDBA.T_USER_SPEC_LIMIT
      WHERE USL_SPEC = :USL_SPEC
        AND USL_TEST_PARA = :USL_TEST_PARA
        AND USL_CD_TEST = :USL_CD_TEST
    `;

    console.log("data:", data);

    const bindArray = data.map((row: any) => ({
      USL_SPEC: row.USL_SPEC,
      USL_TEST_PARA: row.USL_TEST_PARA,
      USL_CD_TEST: row.USL_CD_TEST || "",
    }));

    console.log("delete binds", bindArray);

    return await query.executeMany(sql, bindArray);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
