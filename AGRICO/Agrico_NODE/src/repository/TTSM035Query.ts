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
        NVL( EOM_ID_BATCH, ' ') EOM_ID_BATCH,
        NVL( EOM_ID_PAR_COIL_NO, ' ') EOM_ID_PAR_COIL_NO,
        NVL( EOM_ID_FIRST_PAR, ' ') EOM_ID_FIRST_PAR,
        NVL( EOM_ID_ORDER_CUS, ' ') EOM_ID_ORDER_CUS,
        NVL( EOM_ID_ORD_ITEM_CUS, 0) EOM_ID_ORD_ITEM_CUS,
        NVL( EOM_CD_CURR_PROC, ' ') EOM_CD_CURR_PROC,
        NVL( EOM_CD_NEXT_PROC, ' ') EOM_CD_NEXT_PROC,
        NVL( EOM_CD_PREV_PROC, ' ') EOM_CD_PREV_PROC,
        NVL( EOM_PLANNED_PROC, ' ') EOM_PLANNED_PROC,
        NVL( EOM_PASSED_PROC, ' ') EOM_PASSED_PROC,
        NVL(EOM_UOM,'Ton') UOM,
        NVL((
            SELECT
                NVL(ENC_ORDER_TYPE, '')
            FROM
                V_END_CUST_ORD_EPA
            WHERE
                ENC_ID_ORDER = EOM_ID_ORDER_CUS
                AND ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS
                AND ENC_CD_EPA = EOM_CD_EPA
        ) , ' ') ORD_TYP,
        NVL( EOM_ID_ORDER, ' ') EOM_ID_ORDER,
        NVL( EOM_NO_ITEM, 0) EOM_NO_ITEM,
        NVL( EOM_CD_PROD, ' ') EOM_CD_PROD,
        NVL( EOM_CD_QLTY_ACTL, ' ') EOM_CD_QLTY_ACTL,
        NVL( EOM_MS_SCRAP, 0) EOM_MS_SCRAP,
        NVL( EOM_CD_STATUS, ' ') EOM_CD_STATUS,
        NVL( EOM_TDC_ACTL, ' ') EOM_TDC_ACTL,
        NVL( TO_CHAR(EOM_TS_CREATION, 'dd-mm-yyyy'), ' ') EOM_TS_CREATION,
        NVL( EOM_MS_GROSS_CAL, 0) EOM_MS_GROSS_CAL,
        NVL( EOM_SEC1, 0) EOM_SEC1,
        NVL( EOM_SEC2, 0) EOM_SEC2,
        NVL( EOM_LENGTH, 0) EOM_LENGTH
    FROM
        V_EPA_PRODN
    WHERE
        EOM_CD_EPA = :plant `;
    let binds = {
      plant: plant
    }

    if (batch_id && batch_id != "") {
      sql += ` AND EOM_ID_BATCH = NVL(:batch_id, EOM_ID_BATCH) `;
      binds["batch_id"] = batch_id;
    }
    if (mBatch && mBatch != "") {
      sql += ` AND EOM_ID_FIRST_PAR = NVL(:mBatch, EOM_ID_FIRST_PAR) `;
      binds["mBatch"] = mBatch;
    }
    if (status && status != "") {
      sql += ` AND EOM_CD_STATUS = NVL(:status, EOM_CD_STATUS) `;
      binds["status"] = status;
    }
    if (tdc && tdc != "") {
      sql += ` AND EOM_TDC_ACTL = NVL(:tdc, EOM_TDC_ACTL) `;
      binds["tdc"] = tdc;
    }
    if (prodCD && prodCD != "") {
      sql += ` AND EOM_CD_PROD = :prodCD `;
      binds["prodCD"] = prodCD;
    }
    if (qltyCD && qltyCD != "") {
      sql += ` AND EOM_CD_QLTY_ACTL = :qltyCD `;
      binds["qltyCD"] = qltyCD;
    }
    if (custOrd && custOrd != "") {
      sql += ` AND EOM_ID_ORDER_CUS = :custOrdItem `;
      binds["custOrdItem"] = custOrd;
    }
    if (custItem && custItem != "") {
      sql += ` AND EOM_ID_ORD_ITEM_CUS = :custItem `;
      binds["custItem"] = custItem;
    }
    if (thickFrm && thickTo && thickFrm != "" && thickTo != "") {
      sql += ` And EOM_SEC1 BETWEEN NVL(:thickFrm, EOM_SEC1) And NVL(:thickTo, EOM_SEC1) `;
      binds["thickFrm"] = thickFrm;
      binds["thickTo"] = thickTo;
    }
    if (widthFrm && widthTo && widthFrm != "" && widthTo != "") {
      sql += ` And EOM_SEC2 BETWEEN NVL(:widthFrm, EOM_SEC2) And NVL(:widthTo, EOM_SEC2) `;
      binds["widthFrm"] = widthFrm;
      binds["widthTo"] = widthTo;
    }
    if (length && length != "") {
      sql += ` And EOM_LENGTH =NVL(:LengthVal, EOM_LENGTH) `;
      binds["LengthVal"] = length;
    }


    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};


// export const insertFGBatchRev = async (
//   plant: any,
//   batch_id: any,
//   personalNo: any
// ) => {
//   try {

//     var sql = `    INSERT INTO V_EPA_PRODN_REVERSE (
//             EOM_TIMESTAMP,
//             EOM_USER_REV,
//             EOM_ID_BATCH,
//             EOM_CD_CURR_PROC,
//             EOM_CD_NEXT_PROC,
//             EOM_CD_PREV_PROC,
//             EOM_CD_QLTY_ACTL,
//             EOM_CD_QLTY_AIM,
//             EOM_CD_STATUS,
//             EOM_TS_CREATION,
//             EOM_FL_HOLD,
//             EOM_FL_REPROC_REQD,
//             EOM_FL_SLEEVE,
//             EOM_IDIA,
//             EOM_NO_CAST,
//             EOM_LENGTH,
//             EOM_MS_GROSS_ACTL,
//             EOM_MS_GROSS_CAL,
//             EOM_MS_PIECE_ACTL,
//             EOM_MS_PIECE_CAL,
//             EOM_ODIA,
//             EOM_CD_PROD,
//             EOM_SEC1,
//             EOM_SEC2,
//             EOM_ID_ORDER_CUS,
//             EOM_ID_ORD_ITEM_CUS,
//             EOM_ID_OP_SCRAP,
//             EOM_CD_SHIFT,
//             EOM_FL_INSP_REQD,
//             EOM_ID_PAR_COIL_NO,
//             EOM_ID_FIRST_PAR,
//             EOM_DT_DECSN,
//             EOM_ID_OP_DECSN,
//             EOM_DT_PIECE_UPD,
//             EOM_PASSED_PROC,
//             EOM_TS_COIL_CREATE,
//             EOM_TS_REC_CREATE,
//             EOM_TDC_AIM,
//             EOM_TDC_ACTL,
//             EOM_NO_PIECES,
//             EOM_CD_EPA,
//             EOM_ID_ORDER,
//             EOM_NO_ITEM,
//             EOM_FL_SEND_SAP,
//             EOM_NO_MATNR, EOM_ID_ORD_CUS_AIM,
//             EOM_ID_ITM_CUS_AIM,
//             EOM_OPER_ID,
//             EOM_ACTIVITY_TIME,
//             EOM_MATNR1_QTY,
//             EOM_MATNR2_QTY,
//             EOM_MATNR3_QTY,
//             EOM_MATNR4_QTY
//         )
//             ( SELECT
//                 (
//                     SELECT
//                         F_NANNOW_SECOND_TELGRM(SYSDATE)
//                     FROM
//                         DUAL
//                 ) DATEC,
//                 :personalNo,
//                 EOM_ID_BATCH,
//                 EOM_CD_CURR_PROC,
//                 EOM_CD_NEXT_PROC,
//                 EOM_CD_PREV_PROC,
//                 EOM_CD_QLTY_ACTL,
//                 EOM_CD_QLTY_AIM,
//                 EOM_CD_STATUS,
//                 EOM_TS_CREATION,
//                 EOM_FL_HOLD,
//                 EOM_FL_REPROC_REQD,
//                 EOM_FL_SLEEVE,
//                 EOM_IDIA,
//                 EOM_NO_CAST,
//                 EOM_LENGTH,
//                 EOM_MS_GROSS_ACTL,
//                 EOM_MS_GROSS_CAL,
//                 EOM_MS_PIECE_ACTL,
//                 EOM_MS_PIECE_CAL,
//                 EOM_ODIA,
//                 EOM_CD_PROD,
//                 EOM_SEC1,
//                 EOM_SEC2,
//                 EOM_ID_ORDER_CUS,
//                 EOM_ID_ORD_ITEM_CUS,
//                 EOM_ID_OP_SCRAP,
//                 EOM_CD_SHIFT,
//                 EOM_FL_INSP_REQD,
//                 EOM_ID_PAR_COIL_NO,
//                 EOM_ID_FIRST_PAR,
//                 EOM_DT_DECSN,
//                 EOM_ID_OP_DECSN,
//                 EOM_DT_PIECE_UPD,
//                 EOM_PASSED_PROC,
//                 EOM_TS_COIL_CREATE,
//                 EOM_TS_REC_CREATE,
//                 EOM_TDC_AIM,
//                 EOM_TDC_ACTL,
//                 EOM_NO_PIECES,
//                 EOM_CD_EPA,
//                 EOM_ID_ORDER,
//                 EOM_NO_ITEM,
//                 EOM_FL_SEND_SAP,
//                 EOM_NO_MATNR,
//                 EOM_ID_ORD_CUS_AIM,
//                 EOM_ID_ITM_CUS_AIM,
//                 EOM_OPER_ID,
//                 EOM_ACTIVITY_TIME,
//                 EOM_MATNR1_QTY,
//                 EOM_MATNR2_QTY,
//                 EOM_MATNR3_QTY,
//                 EOM_MATNR4_QTY
//             FROM
//                 V_EPA_PRODN
//             WHERE
//                 EOM_CD_EPA = :plant
//                 AND EOM_ID_BATCH = :batch_id
//             ) `;
//     let binds = {
//       plant: plant,
//       batch_id: batch_id,
//       personalNo: personalNo
//     }

//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerError("Error!");
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
          userid: userid
      }
      console.log(binds);
      return await query.executeQuery(sql, binds);
  } catch (error) {
      throw new Error.InternalServerError("Error!");
  }
};

export const reverseBatch = async (
  plant: any,
  batch_id: any
) => {

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
    throw new Error.InternalServerError("Error!");
  }
};



// export const deleteFGBatchRev = async (
//   plant: any,
//   batch_id: any,
//   personalNo: any
// ) => {
//   try {

//     var sql = `DELETE FROM V_EPA_PRODN_REVERSE
//         WHERE
//             EOM_USER_REV = :personalNo
//             AND EOM_CD_EPA = :plant
//             AND EOM_ID_BATCH = :batch_id`;
//     let binds = {
//       plant: plant,
//       batch_id: batch_id,
//       personalNo: personalNo
//     }

//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerError("Error!");
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
    throw new Error.InternalServerError("Error!");
  }
};