import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getBOMData = async (req: any) => {
  try {
    var sql = `select TMM_CD_EPA CD_EPA, TMM_FG_MAT FG_MAT,TMM_FG_MAT_DESC FG_MAT_DESC, TMM_RM_MAT RM_MAT,TMM_RM_MAT_DESC RM_MAT_DESC,
    TMM_SFG_MAT SFG_MAT,TMM_SFG_MAT_DESC SFG_MAT_DESC, TMM_PRIORITY_NO PRIORITY_NO,TMM_STATUS STATUS,  
    TMM_CRT_BY CREATED_BY,NVL(TO_CHAR(TMM_CRT_DT, 'DD-MON-YYYY HH24:MI:SS') , ' ') CREATED_ON, TMM_UPD_BY UPDATED_BY, TMM_UPD_ON UPDATED_ON,TMM_PROG_ID PROG_ID,
    TMM_SFG1_MAT,TMM_SFG1_MAT_DESC,TMM_SFG2_MAT,TMM_SFG2_MAT_DESC
    from V_TUB_MATL_MAPPING WHERE TMM_CD_EPA =:plant`;
    let binds = {
      plant: req?.plant,
    };
    console.log("bomb", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("bomberror", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
