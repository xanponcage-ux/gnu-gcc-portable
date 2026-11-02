import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getFinalcampaignData = async ( Plant: any ) => {
  try {
    const sql = `SELECT TFC_CD_EPA,TFC_CAMPAIGN, TFC_TUBE_MILL, TFC_OD_GROUP, TFC_RM_AVL,TFC_UNCOVERED_RM,TFC_FG_CRS ,TFC_OD_TOTAL_QTY,TFC_SCHED_ST_DATE,TFC_END_DATE,TFC_CRT_DT,TFC_CRT_BY
                FROM V_FINAL_CAMPAIGNS where TFC_CD_EPA=:plantcode order by 2,3`;
    // const sql = `select * from v_final_campaign 
    //             where   TFC_CD_EPA =:plantcode
    //   --and TFC_TUBE_MILL='MILL01'
    //    ORDER BY TFC_CRT_DT desc`;
    const binds = {
      plantcode: Plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch chemical composition data."+err);
  }
};


