import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getProcessDesc = async (plant: any) => {
    try {
        const sql = `SELECT EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :plant and EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS `;
        let binds = {
            plant: plant
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
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
        // let sql = ` SELECT EOM_ID_BATCH,EOM_CD_STATUS,EOM_CD_CURR_PROC ,EOM_CD_NEXT_PROC,EOM_CD_PROD,EOM_CD_QLTY_ACTL,
        // EOM_SEC1,EOM_SEC2 ,EOM_TDC_ACTL, ROUND(EOM_MS_GROSS_CAL,3) Residual_Wt,EOM_ID_ORDER_CUS,EOM_ID_ORD_ITEM_CUS,
        // EOM_ID_PAR_COIL_NO parent_batch ,EOM_ID_FIRST_PAR mother_coil,EOM_ID_LOC_X,EOM_ID_LOC_Y,EOM_ID_POS,EOM_CD_YRD, 
        // EOM_MS_GROSS_CAL,'' MS_SCRAP,'' HOLD_REASON,''Operator_Remarks,EOM_LENGTH FROM V_EPA_PRODN WHERE eom_cd_epa=:plant 
        // AND eom_cd_status NOT LIKE '%L' AND eom_cd_status NOT LIKE '%Q' AND eom_cd_status NOT LIKE '%D' AND EOM_CD_STATUS LIKE  
        // '%C' AND EOM_CD_STATUS NOT IN ('KB','WB','WS','WH','WC','WL','KF','WF') AND EOM_ID_BATCH = EOM_ID_FIRST_PAR `;


        let sql = `SELECT EOM_ID_BATCH,EOM_CD_STATUS,EOM_CD_CURR_PROC ,EOM_CD_NEXT_PROC,EOM_CD_PROD,EOM_CD_QLTY_ACTL,
        EOM_SEC1,EOM_SEC2 ,EOM_TDC_ACTL, ROUND(EOM_MS_GROSS_CAL,3) Residual_Wt,EOM_ID_ORDER_CUS,EOM_ID_ORD_ITEM_CUS,
        EOM_ID_PAR_COIL_NO parent_batch ,EOM_ID_FIRST_PAR mother_coil,EOM_ID_LOC_X,EOM_ID_LOC_Y,EOM_ID_POS,EOM_CD_YRD,
        EOM_MS_GROSS_CAL,'' MS_SCRAP,'' HOLD_REASON,''Operator_Remarks,'' SCRAP_MATNR, EOM_LENGTH,         
        EOM_NO_MATNR MATNR,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MATNR_DESC
        FROM V_EPA_PRODN WHERE eom_cd_epa=:plant 
        AND eom_cd_status NOT LIKE '%L' 
        AND eom_cd_status NOT LIKE '%Q' 
        AND eom_cd_status NOT LIKE '%D' 
        AND  ( (eom_cd_status LIKE '%C') or (eom_cd_status='VF' 
        AND EOM_MS_GROSS_CAL=EOM_MS_PIECE_CAL)) 
        AND EOM_CD_STATUS NOT IN ('KB','WB','WS','WH','WC','WL','KF','WF') 
        AND EOM_ID_BATCH = EOM_ID_FIRST_PAR`;

        // AND ( (eom_cd_status LIKE '%C') or (eom_cd_status='VF' AND EOM_MS_GROSS_CAL=EOM_MS_PIECE_CAL))
        let binds = {
            plant: plant
        };

        if (process && process != "") {
            sql += ` And EOM_CD_CURR_PROC =NVL(:process, EOM_CD_CURR_PROC) `;
            binds["process"] = process;
        }
        if (batch && batch != "") {
            sql += ` And EOM_ID_BATCH =NVL(:batch, EOM_ID_BATCH) `;
            binds["batch"] = batch;
        }
        if (prodCd && prodCd != "") {
            sql += ` And EOM_CD_PROD =NVL(:prodCd, EOM_CD_PROD) `;
            binds["prodCd"] = prodCd;
        }
        if (status && status != "") {
            sql += ` And EOM_CD_STATUS =NVL(:status, EOM_CD_STATUS) `;
            binds["status"] = status;
        }
        if (tdc && tdc != "") {
            sql += ` And EOM_TDC_ACTL =NVL(:tdc, EOM_TDC_ACTL) `;
            binds["tdc"] = tdc;
        }
        if (thickfrm && thickto && thickfrm != "" && thickto != "") {
            sql += ` And EOM_SEC1 BETWEEN NVL(:thickfrm,EOM_SEC1) AND NVL(:thickto,NVL(:thickto,EOM_SEC1)) `;
            binds["thickfrm"] = thickfrm;
            binds["thickto"] = thickto;
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getHoldRsn = async () => {
    try {
        //const sql = `SELECT distinct CD_RSN_HLD_RJCT_CODES CD_VALUE,CD_DESC FROM V_RSN_HLD_RJCT order by CD_RSN_HLD_RJCT_CODES `;
        const sql=`SELECT distinct CD_HOLD CD_VALUE, CD_DESC FROM  V_EPA_HOLD_RSN order by   CD_HOLD`;
        return await query.executeQuery(sql);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const saveUnloadData = async (
    plant: any,
    EOM_ID_BATCH: any,
    MS_SCRAP: any,
    EOM_CD_STATUS: any,
    EOM_CD_CURR_PROC: any,
    EOM_MS_GROSS_CAL: any,
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
            LS_BATCH: EOM_ID_BATCH,
            LS_MS_SCRAP: MS_SCRAP ? parseFloat(MS_SCRAP) : null,
            LS_CD_STATUS: EOM_CD_STATUS,
            LS_CURR_PROC: EOM_CD_CURR_PROC,
            LS_MS_GROSS_CAL: EOM_MS_GROSS_CAL,
            LS_HOLD_REASON: HOLD_REASON,
            LS_OP_REMARKS: OPERATOR_REMARKS,
            LS_SCRAP_MATNR: SCRAP_MATNR ? SCRAP_MATNR : null,
            LS_USER_ID: personalNo,
            LS_IN_FLAG: "Y",
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};


// export const getStatus = async (plant : any) => {
//     try {
//         const sql = `SELECT DISTINCT EOM_CD_STATUS CD_VALUE,'' CD_DESC FROM V_EPA_PRODN WHERE EOM_CD_EPA =:plant AND EOM_CD_STATUS LIKE '%C' `;
//         let binds = {
//             plant : plant
//         }
//         return await query.executeQuery(sql , binds);
//     } catch (error) {
//         throw new Error.InternalServerError("Error!");
//     }
// };

export const getStatus = async () => {
    try {
        // const sql = `SELECT DISTINCT EOM_CD_STATUS CD_VALUE,'' CD_DESC FROM V_EPA_PRODN WHERE EOM_CD_EPA =:plant AND EOM_CD_STATUS LIKE '%C' `;
        // let binds = {
        //     plant : plant
        // }
        const sql = `SELECT CD_VALUE,CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND (CD_VALUE LIKE '%C' OR CD_VALUE = 'VF')`
        return await query.executeQuery(sql);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};
export const getScrapMatNo = async (plant: any) => {
    try {
        const sql = `SELECT CD_DESC FROM V_CODES WHERE CD_TYPE='EPA196A' AND CD_VALUE =:plant`;
        let binds = {
            plant: plant
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};