import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getTDC = async () => {
  try {
    let sql = `SELECT DISTINCT tsl_tdc_no FROM v_tdc_spec_limit ORDER BY tsl_tdc_no`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const getParam = async (tdc: any) => {
  try {
    let sql = `SELECT DISTINCT tsl_test_para FROM v_tdc_spec_limit WHERE tsl_tdc_no = :tdc ORDER BY tsl_test_para`;
    let binds = { tdc: tdc };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCastNo = async () => {
  try {
    let sql = `SELECT DISTINCT tca_cast_no FROM v_tc_cast_test ORDER BY tca_cast_no`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getBatchNo = async () => {
  try {
    let sql = `SELECT DISTINCT tco_prod_no FROM v_tc_coil_test ORDER BY tco_prod_no`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCustNoByBatch = async (batchno: any) => {
  try {
    let sql = `SELECT DISTINCT tco_cast_no FROM v_tc_coil_test WHERE tco_prod_no = :batchno ORDER BY tco_cast_no`;
    let binds = { batchno: batchno };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getIP = async () => {
  try {
    let sql = `SELECT DISTINCT ip FROM v_ymqmt_insp_plan ORDER BY ip`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getSpecByIp = async (ip: any) => {
  try {
    let sql = `SELECT DISTINCT spec FROM v_ymqmt_insp_plan WHERE TRIM(ip) = :ip ORDER BY spec`;
    let binds = { ip: ip };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getInspPlan = async (ip: any, spec: any) => {
  try {

    var sql = `SELECT 
        MANDT , 
        IP , 
        SPEC , 
        COMP_VAL , 
        CRT_BY , 
        TO_CHAR(CRT_ON) CRT_DT , 
        PROG_ID 
    FROM V_YMQMT_INSP_PLAN `
    let binds = {};

    if (ip || spec) {
      sql += ` WHERE `;
      if (ip && ip != "") {
        sql += ` TRIM(IP) = :ip `;
        binds["ip"] = ip;
      }

      if (ip && spec && ip != "" && spec != "") {
        sql += ` AND `;
      }

      if (spec && spec != "") {
        sql += ` SPEC = :spec`;
        binds["spec"] = spec;
      }
    }

    sql += ` ORDER BY IP , SPEC`;


    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};



export const getSpecLimit = async (tdc: any, param: any) => {
  try {
    let sql = `SELECT 
        TSL_TDC_NO       ,
        TSL_TEST_PARA    ,
        TSL_PARA_MIN     ,
        TSL_PARA_MAX     ,
        TSL_PARA_UNIT    ,
        TO_CHAR(TSL_REC_CRT_DT) CRT_DT   
        FROM V_TDC_SPEC_LIMIT `;

    let binds = {};

    if (tdc || param) {
      sql += ` WHERE `;
      if (tdc && tdc != "") {
        sql += ` TSL_TDC_NO = :tdc `;
        binds["tdc"] = tdc;
      }

      if (tdc && param && tdc != "" && param != "") {
        sql += ` AND `;
      }

      if (param && param != "") {
        sql += ` TSL_TEST_PARA = :param`;
        binds["param"] = param;
      }
    }

    sql += ` ORDER BY TSL_TDC_NO , TSL_TEST_PARA`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCastTest = async (castNo: any) => {
  try {
    var sql = `SELECT 
    TCA_CAST_NO,
    TCA_TEST_PARA,
    TCA_TEST_PARA_REM,
    TCA_TEST_PARA_VAL,
    TO_CHAR(TCA_CRT_DT) CRT_DT
FROM 
    V_TC_CAST_TEST`;

    let binds = {};
    if (castNo && castNo != "") {
      sql += " WHERE TCA_CAST_NO=:castNo";
      binds["castNo"] = castNo;
    }

    sql += ` ORDER BY TCA_CAST_NO , TCA_TEST_PARA`;


    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCoilTest = async (castNo: any, batchNo: any) => {
  try {
    var sql = `SELECT
        TCO_CAST_NO,
        TCO_PROD_NO,
        TCO_LAB_TEST_CD,
        TCO_TEST_PARA,
        TCO_TEST_PARA_REM,
        TCO_TEST_PARA_VAL,
        TO_CHAR(TCO_CRT_DT) CRT_DT
    FROM
        V_TC_COIL_TEST `;

    let binds = {};

    if (castNo || batchNo) {
      sql += ` WHERE `;
      if (castNo && castNo != "") {
        sql += ` TCO_CAST_NO = :castNo `;
        binds["castNo"] = castNo;
      }

      if (castNo && batchNo && castNo != "" && batchNo != "") {
        sql += ` AND `;
      }

      if (batchNo && batchNo != "") {
        sql += ` TCO_PROD_NO = :batchNo`;
        binds["batchNo"] = batchNo;
      }
    }

    sql += ` ORDER BY TCO_PROD_NO , TCO_CAST_NO`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};
