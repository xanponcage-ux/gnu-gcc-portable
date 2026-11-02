import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getCampaignData = async (Plant: any, Mill: any, Segment: any, Zone: any, TType: any) => {
  try {
    const flatMill = Array.isArray(Mill) ? Mill.map(m => m[0].replace('Mill-', 'M_')): [];
    const flatSegment = Array.isArray(Segment) ? Segment.map(m => m[0]): [];
    const flatZone = Array.isArray(Zone) ? Zone.map(m => m[0]): [];
    const flatTType = Array.isArray(TType) ? TType.map(m => m[0]): [];
    let sql = `SELECT TCD_TUBE_MILL,TCD_SIZE,TCD_MES_BTP,TCD_MES_ROLLED,TCD_BTR_WITH_YIELD,''  TCD_BTR_MES ,TCD_CAMPAIGN,TCD_SLIT_COVERED,
    TCD_SLIT_5MT,TCD_SLIT_ETO,TCD_SCHEDULED_1,TCD_BAL_TO_SCHD_1,TCD_SLIT_AS_ON_DATE,TCD_CRM_FG_1,TCD_CRM_CRS_1,
    TCD_VISIBILITY_COVERED,TCD_CRM_WIP_1,TCD_BAL_SLIT_REQUIRED,TCD_BTD,TCD_CRM_DESPATCH,TCD_GROUND_HR_STOCK
    FROM V_CAMPAIGN_DTL
    WHERE TCD_CD_EPA=NVL(:Plant,TCD_CD_EPA)`;
    let binds:any = {
      Plant: Plant,
    };
    if (flatMill.length > 0) {
      const placeholdersm = flatMill.map((_, i) => `:m${i}`).join(",");
      sql += ` AND TCD_TUBE_MILL IN (${placeholdersm})`;
      flatMill.forEach((val, i) => {
        binds[`m${i}`] = val;
      });
    }
    if (flatSegment.length > 0) {
      const placeholderss = flatSegment.map((_, i) => `:s${i}`).join(",");
      sql += ` AND TCD_MATERIAL_GROUP IN (${placeholderss})`;
      flatSegment.forEach((val, i) => {
        binds[`s${i}`] = val;
      });
    }
    if (flatZone.length > 0) {
      const placeholdersz = flatZone.map((_, i) => `:z${i}`).join(",");
      sql += ` AND TCD_ZONE IN (${placeholdersz})`;
      flatZone.forEach((val, i) => {
        binds[`z${i}`] = val;
      });
    }
    if (flatTType.length > 0) {
      const placeholderst = flatTType.map((_, i) => `:t${i}`).join(",");
      sql += ` AND TCD_T_TYPE IN (${placeholderst})`;
      flatTType.forEach((val, i) => {
        binds[`t${i}`] = val;
      });
    }
    sql+=`ORDER BY TCD_TUBE_MILL,TCD_SIZE`;
    console.log('sql->',sql);
    console.log('binds->',binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};

export const getCampaignDataByPOD = async (Plant: any, Mill: any, Segment: any, Zone: any, TType: any) => {
  try {
    const flatMill = Array.isArray(Mill) ? Mill.map(m => m[0].replace('Mill-', 'M_')) : [];
    const flatSegment = Array.isArray(Segment) ? Segment.map(m => m[0]) : [];
    const flatZone = Array.isArray(Zone) ? Zone.map(m => m[0]) : [];
    const flatTType = Array.isArray(TType) ? TType.map(m => m[0]) : [];
    let sql = `SELECT TCD_SFG_ODIA,TCD_FG_GRADE,TCD_SFG_THICKNESS,TCD_FG_PCODE,TCD_MES_BTP,   TCD_GR_DONE,TCD_DISPATCHED,TCD_MES_ROLLED,TCD_CURRENT_FG_MAT,TCD_CURRENT_WIP_ORD,''  TCD_BTR_MES,
    TCD_SLIT_COVERED,TCD_SLIT_ETO,TCD_SCHEDULED_1,TCD_BAL_TO_SCHD_1,TCD_SLIT_AS_ON_DATE,TCD_CRM_FG_1,TCD_CRM_CRS_1,TCD_VISIBILITY_COVERED,
    TCD_CRM_WIP_1,TCD_BAL_SLIT_REQUIRED,TCD_CRM_DESPATCH,'' TCD_CRM_BTD,TCD_GROUND_HR_STOCK
    FROM V_CAMPAIGN_DTL
    WHERE TCD_CD_EPA=NVL(:Plant,TCD_CD_EPA)`;
    let binds:any = {
      Plant: Plant,
    };
    if (flatMill.length > 0) {
      const placeholdersm = flatMill.map((_, i) => `:m${i}`).join(",");
      sql += ` AND TCD_TUBE_MILL IN (${placeholdersm})`;
      flatMill.forEach((val, i) => {
        binds[`m${i}`] = val;
      });
    }
    if (flatSegment.length > 0) {
      const placeholderss = flatSegment.map((_, i) => `:s${i}`).join(",");
      sql += ` AND TCD_MATERIAL_GROUP IN (${placeholderss})`;
      flatSegment.forEach((val, i) => {
        binds[`s${i}`] = val;
      });
    }
    if (flatZone.length > 0) {
      const placeholdersz = flatZone.map((_, i) => `:z${i}`).join(",");
      sql += ` AND TCD_ZONE IN (${placeholdersz})`;
      flatZone.forEach((val, i) => {
        binds[`z${i}`] = val;
      });
    }
    if (flatTType.length > 0) {
      const placeholderst = flatTType.map((_, i) => `:t${i}`).join(",");
      sql += ` AND TCD_T_TYPE IN (${placeholderst})`;
      flatTType.forEach((val, i) => {
        binds[`t${i}`] = val;
      });
    }
    sql+=`ORDER BY TCD_SFG_ODIA`;
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};
export const getCampaignDataByOD = async (Plant: any, Mill: any, Segment: any, Zone: any, TType: any) => {
  try {
    const flatMill = Array.isArray(Mill) ? Mill.map(m => m[0].replace('Mill-', 'M_')) : [];
    const flatSegment = Array.isArray(Segment) ? Segment.map(m => m[0]) : [];
    const flatZone = Array.isArray(Zone) ? Zone.map(m => m[0]) : [];
    const flatTType = Array.isArray(TType) ? TType.map(m => m[0]) : [];
    let sql = `SELECT TCD_OD,TCD_IDIA,TCD_THICKNESS,TCD_SFG_ODIA,TCD_FG_GRADE,TCD_SFG_THICKNESS,TCD_FG_PCODE,TCD_MES_BTP,TCD_CURRENT_WIP_ORD,TCD_CURRENT_FG_MAT,TCD_SIGN_OFF2,TCD_GR_DONE,TCD_MES_ROLLED,''  TCD_BTR_MES,TCD_SLIT_COVERED,TCD_SLIT_ETO,TCD_SLIT_AS_ON_DATE,TCD_CRM_FG_1,TCD_CRM_CRS_1,TCD_VISIBILITY_COVERED,TCD_CRM_WIP_1,TCD_BAL_SLIT_REQUIRED,'' TCD_CRM_BTD,
    TCD_GROUND_HR_STOCK,TCD_EXTRA_ORDER,TCD_BAL_SLIT_ORDER_TO_LOG
    FROM V_CAMPAIGN_DTL
    WHERE TCD_CD_EPA=NVL(:Plant,TCD_CD_EPA)`;
    let binds:any = {
      Plant: Plant,
    };
    if (flatMill.length > 0) {
      const placeholdersm = flatMill.map((_, i) => `:m${i}`).join(",");
      sql += ` AND TCD_TUBE_MILL IN (${placeholdersm})`;
      flatMill.forEach((val, i) => {
        binds[`m${i}`] = val;
      });
    }
    if (flatSegment.length > 0) {
      const placeholderss = flatSegment.map((_, i) => `:s${i}`).join(",");
      sql += ` AND TCD_MATERIAL_GROUP IN (${placeholderss})`;
      flatSegment.forEach((val, i) => {
        binds[`s${i}`] = val;
      });
    }
    if (flatZone.length > 0) {
      const placeholdersz = flatZone.map((_, i) => `:z${i}`).join(",");
      sql += ` AND TCD_ZONE IN (${placeholdersz})`;
      flatZone.forEach((val, i) => {
        binds[`z${i}`] = val;
      });
    }
    if (flatTType.length > 0) {
      const placeholderst = flatTType.map((_, i) => `:t${i}`).join(",");
      sql += ` AND TCD_T_TYPE IN (${placeholderst})`;
      flatTType.forEach((val, i) => {
        binds[`t${i}`] = val;
      });
    }
    sql+=`ORDER BY TCD_OD,TCD_IDIA`;
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};


