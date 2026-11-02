import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getCampaignDashBoardData = async (Plant: any) => {
  try {
      let sql = `SELECT TCD_MES_BTP,TCD_BTD,TCD_DISPATCHED,TCD_SIGN_OFF2 ,TCD_GR_DONE,TCD_BALANCE_TO_GR,
        TCD_CURRENT_WIP_ORD,TCD_CURRENT_FG_MAT,'' TCD_BTR_MES,TCD_SLIT_5MT,TCD_CRM_FG_1,TCD_CRM_CRS_1,TCD_CRM_WIP_1,TCD_BAL_SLIT_REQUIRED,TCD_CRM_BALANCE_TO_DESPATCH,TCD_GROUND_HR_STOCK,TCD_MATERIAL_GROUP,REPLACE(TCD_TUBE_MILL, 'M_', 'Mill-') TCD_TUBE_MILL,TCD_ZONE,TCD_SFG_ODIA,TCD_SIZE,TCD_SFG_THICKNESS,TCD_FG_PCODE,TCD_OD,TCD_THICKNESS,TCD_SFG_GRAD
        FROM V_CAMPAIGN_DTL
        WHERE TCD_CD_EPA=NVL(:Plant,TCD_CD_EPA)
        ORDER BY TCD_TUBE_MILL,TCD_SIZE`;
    let binds:any = {
      Plant: Plant,
    };
    
    console.log('sql->',sql);
    console.log('binds->',binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};