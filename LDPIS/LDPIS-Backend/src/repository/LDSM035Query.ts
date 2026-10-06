import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getFGBatchRev = async (
  batch_id: any,
  custOrd: any,
  custItem: any,
  length: any,
  mBatch: any,
  ordType: any,
  plant: any,
  process: any,
  prodCD: any,
  qltyCD: any,
  status: any,
  tdc: any,
  thickFrm: any,
  thickTo: any,
  widthFrm: any,
  widthTo: any
) => {
  try {
    var sql = `SELECT
        NVL( LOM_ID_BATCH, ' ') LOM_ID_BATCH,
        NVL( LOM_ID_PAR_COIL_NO, ' ') LOM_ID_PAR_COIL_NO,
        NVL( LOM_ID_FIRST_PAR, ' ') LOM_ID_FIRST_PAR,
        NVL( LOM_ID_ORDER_CUS, ' ') LOM_ID_ORDER_CUS,
        NVL( LOM_ID_ORD_ITEM_CUS, 0) LOM_ID_ORD_ITEM_CUS,
        NVL( LOM_CD_CURR_PROC, ' ') LOM_CD_CURR_PROC,
        NVL( LOM_CD_NEXT_PROC, ' ') LOM_CD_NEXT_PROC,
        NVL( LOM_CD_PREV_PROC, ' ') LOM_CD_PREV_PROC,
        NVL( LOM_PLANNED_PROC, ' ') LOM_PLANNED_PROC,
        NVL( LOM_PASSED_PROC, ' ') LOM_PASSED_PROC,
        NVL(LOM_UOM,'Ton') UOM,
        NVL((
            SELECT
                NVL(ENC_ORDER_TYPE, '')
            FROM
                V_END_CUST_ORD_EPA
            WHERE
                ENC_ID_ORDER = LOM_ID_ORDER_CUS
                AND ENC_NO_ITEM = LOM_ID_ORD_ITEM_CUS
                AND ENC_CD_EPA = LOM_CD_EPA
        ) , ' ') ORD_TYP,
        NVL( LOM_ID_ORDER, ' ') LOM_ID_ORDER,
        NVL( LOM_NO_ITEM, 0) LOM_NO_ITEM,
        NVL( LOM_CD_PROD, ' ') LOM_CD_PROD,
        NVL( LOM_CD_QLTY_ACTL, ' ') LOM_CD_QLTY_ACTL,
        NVL( LOM_MS_SCRAP, 0) LOM_MS_SCRAP,
        NVL( LOM_CD_STATUS, ' ') LOM_CD_STATUS,
        NVL( LOM_TDC_ACTL, ' ') LOM_TDC_ACTL,
        NVL( TO_CHAR(LOM_TS_CREATION, 'dd-mm-yyyy'), ' ') LOM_TS_CREATION,
        NVL( LOM_MS_GROSS_CAL, 0) LOM_MS_GROSS_CAL,
        NVL( LOM_SEC1, 0) LOM_SEC1,
        NVL( LOM_SEC2, 0) LOM_SEC2,
        NVL( LOM_LENGTH, 0) LOM_LENGTH
    FROM
        V_LDP_PRODN
    WHERE
        LOM_CD_EPA = :plant `;
    let binds = {
      plant: plant,
    };

    if (batch_id && batch_id != "") {
      sql += ` AND LOM_ID_BATCH = NVL(:batch_id, LOM_ID_BATCH) `;
      binds["batch_id"] = batch_id;
    }
    if (mBatch && mBatch != "") {
      sql += ` AND LOM_ID_FIRST_PAR = NVL(:mBatch, LOM_ID_FIRST_PAR) `;
      binds["mBatch"] = mBatch;
    }
    if (status && status != "") {
      sql += ` AND LOM_CD_STATUS = NVL(:status, LOM_CD_STATUS) `;
      binds["status"] = status;
    }
    if (tdc && tdc != "") {
      sql += ` AND LOM_TDC_ACTL = NVL(:tdc, LOM_TDC_ACTL) `;
      binds["tdc"] = tdc;
    }
    if (prodCD && prodCD != "") {
      sql += ` AND LOM_CD_PROD = :prodCD `;
      binds["prodCD"] = prodCD;
    }
    if (qltyCD && qltyCD != "") {
      sql += ` AND LOM_CD_QLTY_ACTL = :qltyCD `;
      binds["qltyCD"] = qltyCD;
    }
    if (custOrd && custOrd != "") {
      sql += ` AND LOM_ID_ORDER_CUS = :custOrdItem `;
      binds["custOrdItem"] = custOrd;
    }
    if (custItem && custItem != "") {
      sql += ` AND LOM_ID_ORD_ITEM_CUS = :custItem `;
      binds["custItem"] = custItem;
    }
    if (thickFrm && thickTo && thickFrm != "" && thickTo != "") {
      sql += ` And LOM_SEC1 BETWEEN NVL(:thickFrm, LOM_SEC1) And NVL(:thickTo, LOM_SEC1) `;
      binds["thickFrm"] = thickFrm;
      binds["thickTo"] = thickTo;
    }
    if (widthFrm && widthTo && widthFrm != "" && widthTo != "") {
      sql += ` And LOM_SEC2 BETWEEN NVL(:widthFrm, LOM_SEC2) And NVL(:widthTo, LOM_SEC2) `;
      binds["widthFrm"] = widthFrm;
      binds["widthTo"] = widthTo;
    }
    if (length && length != "") {
      sql += ` And LOM_LENGTH =NVL(:LengthVal, LOM_LENGTH) `;
      binds["LengthVal"] = length;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const insertFGBatchRev = async (
//   plant: any,
//   batch_id: any,
//   personalNo: any
// ) => {
//   try {

//     var sql = `    INSERT INTO V_LDP_PRODN_REVERSE (
//             LOM_TIMESTAMP,
//             LOM_USER_REV,
//             LOM_ID_BATCH,
//             LOM_CD_CURR_PROC,
//             LOM_CD_NEXT_PROC,
//             LOM_CD_PREV_PROC,
//             LOM_CD_QLTY_ACTL,
//             LOM_CD_QLTY_AIM,
//             LOM_CD_STATUS,
//             LOM_TS_CREATION,
//             LOM_FL_HOLD,
//             LOM_FL_REPROC_REQD,
//             LOM_FL_SLEEVE,
//             LOM_IDIA,
//             LOM_NO_CAST,
//             LOM_LENGTH,
//             LOM_MS_GROSS_ACTL,
//             LOM_MS_GROSS_CAL,
//             LOM_MS_PIECE_ACTL,
//             LOM_MS_PIECE_CAL,
//             LOM_ODIA,
//             LOM_CD_PROD,
//             LOM_SEC1,
//             LOM_SEC2,
//             LOM_ID_ORDER_CUS,
//             LOM_ID_ORD_ITEM_CUS,
//             LOM_ID_OP_SCRAP,
//             LOM_CD_SHIFT,
//             LOM_FL_INSP_REQD,
//             LOM_ID_PAR_COIL_NO,
//             LOM_ID_FIRST_PAR,
//             LOM_DT_DECSN,
//             LOM_ID_OP_DECSN,
//             LOM_DT_PIECE_UPD,
//             LOM_PASSED_PROC,
//             LOM_TS_COIL_CREATE,
//             LOM_TS_REC_CREATE,
//             LOM_TDC_AIM,
//             LOM_TDC_ACTL,
//             LOM_NO_PIECES,
//             LOM_CD_EPA,
//             LOM_ID_ORDER,
//             LOM_NO_ITEM,
//             LOM_FL_SEND_SAP,
//             LOM_NO_MATNR, LOM_ID_ORD_CUS_AIM,
//             LOM_ID_ITM_CUS_AIM,
//             LOM_OPER_ID,
//             LOM_ACTIVITY_TIME,
//             LOM_MATNR1_QTY,
//             LOM_MATNR2_QTY,
//             LOM_MATNR3_QTY,
//             LOM_MATNR4_QTY
//         )
//             ( SELECT
//                 (
//                     SELECT
//                         F_NANNOW_SECOND_TELGRM(SYSDATE)
//                     FROM
//                         DUAL
//                 ) DATEC,
//                 :personalNo,
//                 LOM_ID_BATCH,
//                 LOM_CD_CURR_PROC,
//                 LOM_CD_NEXT_PROC,
//                 LOM_CD_PREV_PROC,
//                 LOM_CD_QLTY_ACTL,
//                 LOM_CD_QLTY_AIM,
//                 LOM_CD_STATUS,
//                 LOM_TS_CREATION,
//                 LOM_FL_HOLD,
//                 LOM_FL_REPROC_REQD,
//                 LOM_FL_SLEEVE,
//                 LOM_IDIA,
//                 LOM_NO_CAST,
//                 LOM_LENGTH,
//                 LOM_MS_GROSS_ACTL,
//                 LOM_MS_GROSS_CAL,
//                 LOM_MS_PIECE_ACTL,
//                 LOM_MS_PIECE_CAL,
//                 LOM_ODIA,
//                 LOM_CD_PROD,
//                 LOM_SEC1,
//                 LOM_SEC2,
//                 LOM_ID_ORDER_CUS,
//                 LOM_ID_ORD_ITEM_CUS,
//                 LOM_ID_OP_SCRAP,
//                 LOM_CD_SHIFT,
//                 LOM_FL_INSP_REQD,
//                 LOM_ID_PAR_COIL_NO,
//                 LOM_ID_FIRST_PAR,
//                 LOM_DT_DECSN,
//                 LOM_ID_OP_DECSN,
//                 LOM_DT_PIECE_UPD,
//                 LOM_PASSED_PROC,
//                 LOM_TS_COIL_CREATE,
//                 LOM_TS_REC_CREATE,
//                 LOM_TDC_AIM,
//                 LOM_TDC_ACTL,
//                 LOM_NO_PIECES,
//                 LOM_CD_EPA,
//                 LOM_ID_ORDER,
//                 LOM_NO_ITEM,
//                 LOM_FL_SEND_SAP,
//                 LOM_NO_MATNR,
//                 LOM_ID_ORD_CUS_AIM,
//                 LOM_ID_ITM_CUS_AIM,
//                 LOM_OPER_ID,
//                 LOM_ACTIVITY_TIME,
//                 LOM_MATNR1_QTY,
//                 LOM_MATNR2_QTY,
//                 LOM_MATNR3_QTY,
//                 LOM_MATNR4_QTY
//             FROM
//                 V_LDP_PRODN
//             WHERE
//                 LOM_CD_EPA = :plant
//                 AND LOM_ID_BATCH = :batch_id
//             ) `;
//     let binds = {
//       plant: plant,
//       batch_id: batch_id,
//       personalNo: personalNo
//     }

//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getUserIdsEditableMass = async (userid: any) => {
  try {
    let sql = `SELECT
      CASE
      WHEN :userid IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'TB043') THEN 1
      ELSE 0
      END AS BOOL
      FROM V_CODES 
      WHERE CD_TYPE='TB043'`;
    let binds = {
      userid: userid,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const reverseBatch = async (plant: any, batch_id: any) => {
  try {
    const sql = `call C1CEB167 (
        P_BATCH => :P_BATCH,
        P_PLANT => :P_PLANT,
        ls_flag => :ls_flag         
        )`;
    const binds = {
      P_BATCH: batch_id,
      P_PLANT: plant,
      ls_flag: {
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

// export const deleteFGBatchRev = async (
//   plant: any,
//   batch_id: any,
//   personalNo: any
// ) => {
//   try {

//     var sql = `DELETE FROM V_LDP_PRODN_REVERSE
//         WHERE
//             LOM_USER_REV = :personalNo
//             AND LOM_CD_EPA = :plant
//             AND LOM_ID_BATCH = :batch_id`;
//     let binds = {
//       plant: plant,
//       batch_id: batch_id,
//       personalNo: personalNo
//     }

//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const getTdcList = async (plant: any) => {
  try {
    /*const sql = `SELECT  CD_VALUE|| ' - ' || CD_DESC ,CD_VALUE FROM V_Codes Where Cd_Type='E0001' AND 
      CD_VALUE IN ('KB','KF','WB','WC','WF','WO','WL','WS','WT') ORDER BY 1`; */

    // const sql = `SELECT  CD_VALUE|| ' - ' || CD_DESC ,CD_VALUE FROM V_Codes Where Cd_Type='TB003' ORDER BY 1`;
    const sql = `SELECT DISTINCT ENC_NO_TDC FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA=:plant ORDER BY 1`;
    let binds = { plant: plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
