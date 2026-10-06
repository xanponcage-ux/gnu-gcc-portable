import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getProdInqData = async (plant: any, value: any) => {
  try {
    var sql = "";
    let binds = {
      plant: plant,
    };
    if (value == 0 && plant && plant != "")
      sql += `select EPL_CD_EPA,EPL_EPA_DESC,EPL_CD_PROCESS,EPL_PROC_LINE_DESC,EPL_ID_PRINTER,EPL_NO_PROC_SEQ,EPL_ADDRESS,EPL_SAP_INTERFACE_IND, EPL_REM1, EPL_REM2, EPL_REM3, EPL_CD_CUST, EPL_URL, EPL_SERVER, EPL_ACTIVITY_TIME, EPL_ACTIVITY_FLAG, EPL_CONSP_FLAG, EPL_BUSINESS_UNIT, EPL_PLNG_FLAG, EPL_CD_COMP, EPL_ACTIVITY_NM, EPL_THK_TOL_FLAG, EPL_SR_COMP_FLAG, EPL_ACTIVE_PLANT_FL, EPL_BUSI_ROLE, EPL_STOR_LOC, EPL_PRODUCTION_TYPE from V_EPA_PROC_LINE where EPL_CD_EPA=:plant order by EPL_CD_EPA,EPL_NO_PROC_SEQ`;
    if (value == 1 && plant && plant != "")
      sql += ` SELECT
      LPP_NO_PROC_PATH,
      LPP_CD_PROC_PATH,
      LPP_DESC,
      LPP_CD_EPA,
      LPP_PRODUCT,
      LPP_PRODUCT_NM
  FROM
      v_ldp_proc_path
  WHERE
      LPP_CD_EPA = :plant
  ORDER BY
      LPP_CD_EPA `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
