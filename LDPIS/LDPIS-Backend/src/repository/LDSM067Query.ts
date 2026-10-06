import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getProcessDesc = async (plant: any) => {
  try {
    const sql = `SELECT EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :plant and EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS `;
    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils = async (
  plant: any,
  process: any,
  batch: any,
  prodCd: any,
  status: any,
  tdc: any,
  thickfrm: any,
  thickto: any
) => {
  try {
    // let sql = ` SELECT LOM_ID_BATCH,LOM_CD_STATUS,LOM_CD_CURR_PROC ,LOM_CD_NEXT_PROC,LOM_CD_PROD,LOM_CD_QLTY_ACTL,
    // LOM_SEC1,LOM_SEC2 ,LOM_TDC_ACTL, ROUND(LOM_MS_GROSS_CAL,3) Residual_Wt,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,
    // LOM_ID_PAR_COIL_NO parent_batch ,LOM_ID_FIRST_PAR mother_coil,LOM_ID_LOC_X,LOM_ID_LOC_Y,LOM_ID_POS,LOM_CD_YRD,
    // LOM_MS_GROSS_CAL,'' MS_SCRAP,'' HOLD_REASON,''Operator_Remarks,LOM_LENGTH FROM V_LDP_PRODN WHERE LOM_cd_epa=:plant
    // AND LOM_cd_status NOT LIKE '%L' AND LOM_cd_status NOT LIKE '%Q' AND LOM_cd_status NOT LIKE '%D' AND LOM_CD_STATUS LIKE
    // '%C' AND LOM_CD_STATUS NOT IN ('KB','WB','WS','WH','WC','WL','KF','WF') AND LOM_ID_BATCH = LOM_ID_FIRST_PAR `;

    let sql = `SELECT LOM_ID_BATCH,LOM_CD_STATUS,LOM_CD_CURR_PROC ,LOM_CD_NEXT_PROC,LOM_CD_PROD,LOM_CD_QLTY_ACTL,
        LOM_SEC1,LOM_SEC2 ,LOM_TDC_ACTL, ROUND(LOM_MS_GROSS_CAL,3) Residual_Wt,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,
        LOM_ID_PAR_COIL_NO parent_batch ,LOM_ID_FIRST_PAR mother_coil,LOM_ID_LOC_X,LOM_ID_LOC_Y,LOM_ID_POS,LOM_CD_YRD,
        LOM_MS_GROSS_CAL,'' MS_SCRAP,'' HOLD_REASON,''Operator_Remarks,'' SCRAP_MATNR, LOM_LENGTH,         
        LOM_NO_MATNR MATNR,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= LOM_NO_MATNR) MATNR_DESC
        FROM V_LDP_PRODN WHERE LOM_cd_epa=:plant 
        AND LOM_cd_status NOT LIKE '%L' 
        AND LOM_cd_status NOT LIKE '%Q' 
        AND LOM_cd_status NOT LIKE '%D' 
        AND  ( (LOM_cd_status LIKE '%C') or (LOM_cd_status='VF' 
        AND LOM_MS_GROSS_CAL=LOM_MS_PIECE_CAL)) 
        AND LOM_CD_STATUS NOT IN ('KB','WB','WS','WH','WC','WL','KF','WF') 
        AND LOM_ID_BATCH = LOM_ID_FIRST_PAR`;

    // AND ( (LOM_cd_status LIKE '%C') or (LOM_cd_status='VF' AND LOM_MS_GROSS_CAL=LOM_MS_PIECE_CAL))
    let binds = {
      plant: plant,
    };

    if (process && process != "") {
      sql += ` And LOM_CD_CURR_PROC =NVL(:process, LOM_CD_CURR_PROC) `;
      binds["process"] = process;
    }
    if (batch && batch != "") {
      sql += ` And LOM_ID_BATCH =NVL(:batch, LOM_ID_BATCH) `;
      binds["batch"] = batch;
    }
    if (prodCd && prodCd != "") {
      sql += ` And LOM_CD_PROD =NVL(:prodCd, LOM_CD_PROD) `;
      binds["prodCd"] = prodCd;
    }
    if (status && status != "") {
      sql += ` And LOM_CD_STATUS =NVL(:status, LOM_CD_STATUS) `;
      binds["status"] = status;
    }
    if (tdc && tdc != "") {
      sql += ` And LOM_TDC_ACTL =NVL(:tdc, LOM_TDC_ACTL) `;
      binds["tdc"] = tdc;
    }
    if (thickfrm && thickto && thickfrm != "" && thickto != "") {
      sql += ` And LOM_SEC1 BETWEEN NVL(:thickfrm,LOM_SEC1) AND NVL(:thickto,NVL(:thickto,LOM_SEC1)) `;
      binds["thickfrm"] = thickfrm;
      binds["thickto"] = thickto;
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHoldRsn = async () => {
  try {
    //const sql = `SELECT distinct CD_RSN_HLD_RJCT_CODES CD_VALUE,CD_DESC FROM V_RSN_HLD_RJCT order by CD_RSN_HLD_RJCT_CODES `;
    const sql = `SELECT distinct CD_HOLD CD_VALUE, CD_DESC FROM  V_EPA_HOLD_RSN order by   CD_HOLD`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveUnloadData = async (
  plant: any,
  LOM_ID_BATCH: any,
  MS_SCRAP: any,
  LOM_CD_STATUS: any,
  LOM_CD_CURR_PROC: any,
  LOM_MS_GROSS_CAL: any,
  HOLD_REASON: any,
  OPERATOR_REMARKS: any,
  SCRAP_MATNR: any,
  personalNo: any
) => {
  try {
    var sql = `call C1CEB067_UNLOADING(
        LS_EPA => :LS_EPA,
        LS_BATCH => :LS_BATCH,
        LS_MS_SCRAP => :LS_MS_SCRAP,
        LS_CD_STATUS => :LS_CD_STATUS,
        LS_CURR_PROC => :LS_CURR_PROC,
        LS_MS_GROSS_CAL => :LS_MS_GROSS_CAL,
        LS_HOLD_REASON => :LS_HOLD_REASON ,
        LS_OP_REMARKS => :LS_OP_REMARKS,
        LS_SCRAP_MATNR => :LS_SCRAP_MATNR,
        LS_USER_ID => :LS_USER_ID,
        LS_IN_FLAG => :LS_IN_FLAG,
        LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {
      LS_EPA: plant,
      LS_BATCH: LOM_ID_BATCH,
      LS_MS_SCRAP: MS_SCRAP ? parseFloat(MS_SCRAP) : null,
      LS_CD_STATUS: LOM_CD_STATUS,
      LS_CURR_PROC: LOM_CD_CURR_PROC,
      LS_MS_GROSS_CAL: LOM_MS_GROSS_CAL,
      LS_HOLD_REASON: HOLD_REASON,
      LS_OP_REMARKS: OPERATOR_REMARKS,
      LS_SCRAP_MATNR: SCRAP_MATNR ? SCRAP_MATNR : null,
      LS_USER_ID: personalNo,
      LS_IN_FLAG: "Y",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const getStatus = async (plant : any) => {
//     try {
//         const sql = `SELECT DISTINCT LOM_CD_STATUS CD_VALUE,'' CD_DESC FROM V_LDP_PRODN WHERE LOM_CD_EPA =:plant AND LOM_CD_STATUS LIKE '%C' `;
//         let binds = {
//             plant : plant
//         }
//         return await query.executeQuery(sql , binds);
//     } catch (error) {
//         throw new Error.InternalServerErrorMsg(error);
//     }
// };

export const getStatus = async () => {
  try {
    // const sql = `SELECT DISTINCT LOM_CD_STATUS CD_VALUE,'' CD_DESC FROM V_LDP_PRODN WHERE LOM_CD_EPA =:plant AND LOM_CD_STATUS LIKE '%C' `;
    // let binds = {
    //     plant : plant
    // }
    const sql = `SELECT CD_VALUE,CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND (CD_VALUE LIKE '%C' OR CD_VALUE = 'VF')`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getScrapMatNo = async (plant: any) => {
  try {
    const sql = `SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='EPA196A' AND CD_VALUE =:plant`;
    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
