import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT
    epl_cd_epa
    || ' - '
    || epl_epa_desc egp_cd_epa,
    egp_cd_epa,
    epl_business_unit,
    epl_cd_comp
FROM
    v_epa_group_plant a,
    v_epa_proc_line
WHERE
    egp_cd_epa = epl_cd_epa
    AND upper(egp_grp_user) = :0
    AND epl_active_plant_fl = 'A'
ORDER BY
    1`;
    let binds = [`${id}`];

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
