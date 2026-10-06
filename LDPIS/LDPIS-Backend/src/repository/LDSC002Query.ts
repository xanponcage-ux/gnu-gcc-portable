import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getTDC = async () => {
  try {
    const sql = `
      SELECT DISTINCT tsl_tdc_no
      FROM v_tdc_spec_limit
      ORDER BY tsl_tdc_no
    `;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getParam = async (tdc: any) => {
  try {
    const sql = `
      SELECT DISTINCT tsl_test_para
      FROM v_tdc_spec_limit
      WHERE tsl_tdc_no = :tdc
      ORDER BY tsl_test_para
    `;

    const binds = { tdc };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCastNo = async () => {
  try {
    const sql = `
      SELECT DISTINCT tca_cast_no
      FROM v_tc_cast_test
      ORDER BY tca_cast_no
    `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchNo = async () => {
  try {
    const sql = `
      SELECT DISTINCT tco_prod_no
      FROM v_tc_coil_test
      ORDER BY tco_prod_no
    `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCustNoByBatch = async (batchno: any) => {
  try {
    const sql = `
      SELECT DISTINCT tco_cast_no
      FROM v_tc_coil_test
      WHERE tco_prod_no = :batchno
      ORDER BY tco_cast_no
    `;

    const binds = { batchno };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getIP = async () => {
  try {
    const sql = `
      SELECT DISTINCT ip
      FROM v_ymqmt_insp_plan
      ORDER BY ip
    `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSpecByIp = async (ip: any) => {
  try {
    const sql = `
      SELECT DISTINCT spec
      FROM v_ymqmt_insp_plan
      WHERE TRIM(ip) = :ip
      ORDER BY spec
    `;

    const binds = { ip };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getInspPlan = async (ip: any, spec: any) => {
  try {
    let sql = `
      SELECT
        MANDT,
        IP,
        SPEC,
        COMP_VAL,
        CRT_BY,
        TO_CHAR(CRT_ON) CRT_DT,
        PROG_ID
      FROM V_YMQMT_INSP_PLAN
    `;

    const binds: Record<string, any> = {};

    const conditions: string[] = [];

    if (ip?.trim()) {
      conditions.push("TRIM(IP) = :ip");
      binds.ip = ip;
    }

    if (spec?.trim()) {
      conditions.push("SPEC = :spec");
      binds.spec = spec;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY IP, SPEC`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSpecLimit = async (tdc: any, param: any) => {
  try {
    let sql = `
      SELECT
        TSL_TDC_NO,
        TSL_TEST_PARA,
        TSL_PARA_MIN,
        TSL_PARA_MAX,
        TSL_PARA_UNIT,
        TO_CHAR(TSL_REC_CRT_DT) CRT_DT
      FROM V_TDC_SPEC_LIMIT
    `;

    const binds: Record<string, any> = {};
    const conditions: string[] = [];

    if (tdc?.trim()) {
      conditions.push("TSL_TDC_NO = :tdc");
      binds.tdc = tdc;
    }

    if (param?.trim()) {
      conditions.push("TSL_TEST_PARA = :param");
      binds.param = param;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY TSL_TDC_NO, TSL_TEST_PARA`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCastTest = async (castNo: any) => {
  try {
    let sql = `
      SELECT
        TCA_CAST_NO,
        TCA_TEST_PARA,
        TCA_TEST_PARA_REM,
        TCA_TEST_PARA_VAL,
        TO_CHAR(TCA_CRT_DT) CRT_DT
      FROM V_TC_CAST_TEST
    `;

    const binds: Record<string, any> = {};

    if (castNo?.trim()) {
      sql += ` WHERE TCA_CAST_NO = :castNo`;
      binds.castNo = castNo;
    }

    sql += ` ORDER BY TCA_CAST_NO, TCA_TEST_PARA`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoilTest = async (castNo: any, batchNo: any) => {
  try {
    let sql = `
      SELECT
        TCO_CAST_NO,
        TCO_PROD_NO,
        TCO_LAB_TEST_CD,
        TCO_TEST_PARA,
        TCO_TEST_PARA_REM,
        TCO_TEST_PARA_VAL,
        TO_CHAR(TCO_CRT_DT) CRT_DT
      FROM V_TC_COIL_TEST
    `;

    const binds: Record<string, any> = {};
    const conditions: string[] = [];

    if (castNo?.trim()) {
      conditions.push("TCO_CAST_NO = :castNo");
      binds.castNo = castNo;
    }

    if (batchNo?.trim()) {
      conditions.push("TCO_PROD_NO = :batchNo");
      binds.batchNo = batchNo;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY TCO_PROD_NO, TCO_CAST_NO`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchTest = async (batchNo: any, castNo: any) => {
  try {
    let sql = `
      SELECT *
      FROM V_BATCH_TEST_RESULT A
      WHERE BTR_SEQ_NO =
            (
              SELECT MAX(BTR_SEQ_NO)
              FROM V_BATCH_TEST_RESULT
              WHERE BTR_PROD_NO = A.BTR_PROD_NO
                AND BTR_CAST_NO = A.BTR_CAST_NO
            )
    `;

    let binds: any = {};

    if (batchNo && batchNo !== "") {
      sql += ` AND BTR_PROD_NO = :batchNo `;
      binds.batchNo = batchNo;
    }

    if (castNo && castNo !== "") {
      sql += ` AND BTR_CAST_NO = :castNo `;
      binds.castNo = castNo;
    }

    sql += ` ORDER BY BTR_PROD_NO, BTR_CAST_NO `;

    console.log("Batch Test Query :", sql);
    console.log("Batch Test Binds :", binds);

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
