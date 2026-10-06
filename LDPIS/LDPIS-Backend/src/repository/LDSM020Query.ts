import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getTubePlanData = async (
  plant: any,
  Order1: any,
  Item: any,
  MatNo: any,
  tdc: any,
  thickFrm: any,
  thickTo: any,
  widthFrm: any,
  widthTo: any,
  cust: any
) => {
  try {
    let sql = `
    select EOP_CD_EPA,
    EOP_ID_ORDER,
    EOP_NO_ITEM,
    EOP_QTY,
    EOP_BTR,
    EOP_BTP,
    EOP_BTD,
    EOP_MILLSCH_QTY,
    EOP_FG_QTY,
    EOP_WIP_QTY,
    EOP_DISP_QTY,
    EOP_SEC1,
    EOP_SEC2,
    EOP_LENGTH,
    ENC_NO_TDC,
    ENC_ORDER_TYPE,
    EOP_FG_MATNR,
    EOP_FG_MATNR_DESC,
    ENC_CD_END_CUST,
    ENC_CUST_NAME,
    ENC_CD_SHIP_TO_PRTY,
    ENC_SHIP_TO_PRTY_DESC,
    ENC_MARK_CUST,
    ENC_MARK_CUST_NAME,
    ENC_DT_ORD_FULFILL,
    ENC_MATNR_SPEC,
    ENC_MATNR_IP,
    ENC_SUR_FINISH,
    ENC_END_FINISH,
    ENC_FIN_COND,
    ENC_GEOMETRY,
    --ENC_DT_ORD_CREATE,
    TO_CHAR(ENC_DT_ORD_CREATE, 'DD-MON-YYYY') AS ENC_DT_ORD_CREATE,
    NVL(EOP_UPD_DT,EOP_CRT_DT) LAST_REFRESH_DT
    from V_LDP_ORDER_PROG, V_END_CUST_ORD_EPA
    WHERE EOP_CD_ePA= ENC_CD_EPA
    AND EOP_ID_ORDER = ENC_ID_ORDER
    AND EOP_NO_ITEM = ENC_NO_ITEM
    AND ENC_DT_ORD_CREATE >= SYSDATE-365
    AND ENC_ST_ORDER='A'
    AND EOP_CD_EPA=:plant `;

    type jsonObj = {
      [key: string]: any;
    };
    var binds: jsonObj = {};
    binds.plant = plant;
    if (Order1 == "") {
      sql = sql + "";
    } else {
      binds.Order1 = Order1;

      sql = sql + " And EOP_ID_ORDER =:Order1";
    }
    if (MatNo == "") {
      sql = sql + "";
    } else {
      binds.MatNo = MatNo;
      sql = sql + " And EOP_FG_MATNR = :MatNo";
    }
    if (Item == "") {
      sql = sql + "";
    } else {
      binds.Item = Item;
      sql = sql + " And EOP_NO_ITEM =:Item";
    }
    if (tdc == "") {
      sql = sql + "";
    } else {
      binds.tdc = tdc;
      sql = sql + " And EOP_RM_MATNR_TDC = :tdc";
    }
    if (thickFrm == "") {
      sql = sql + "";
    } else {
      binds.thickFrm = thickFrm;
      binds.thickTo = thickTo;
      sql =
        sql +
        " And EOP_SEC1 BETWEEN  NVL(:thickFrm,EOP_SEC1) AND NVL(:thickTo,EOP_SEC1)";
    }
    if (widthFrm == "") {
      sql = sql + "";
    } else {
      binds.widthFrm = widthFrm;
      binds.widthTo = widthTo;
      sql =
        sql +
        " And EOP_SEC2 BETWEEN  NVL(:widthFrm,EOP_SEC2) AND NVL(:widthTo,EOP_SEC2)";
    }
    if (cust == "") {
      sql = sql + "";
    } else {
      binds.cust = cust;
      sql = sql + " and EOP_CUST_CD =:cust ";
    }

    sql += ` ORDER BY EOP_cD_ePA,EOP_ID_ORDER,EOP_NO_ITEM,ENC_DT_ORD_CREATE `;
    console.log("order progress report", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPlanModalData = async (plant: any, Order1: any, Item: any) => {
  try {
    // const sql = `SELECT * FROM V_TUBE_PLANNING WHERE MANDT='600'and VBELN=:Order1 AND POSNR=:Item AND WERKS=:plant`;
    const sql = `SELECT NVL(LOM_CD_EPA , ' ') PLANT,  NVL(LOM_ID_BATCH , ' ') BATCH, NVL(LOM_MS_GROSS_CAL , 0) NET_WT , NVL(LOM_CD_STATUS , ' ') STATUS
            FROM V_LDP_PRODN
            WHERE LOM_CD_ePA= :plant
            AND LOM_ID_ORDER_CUS= :Order1
            AND LOM_ID_ORD_ITEM_CUS = :Item`;

    let binds = { plant: plant, Order1: Order1, Item: Item };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaFrm = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA=:plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaTo = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA= :plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRefresh = async () => {
    try {
        const sql = `call LDPDBA.P_INSERT_ORDER_PROG()`;
        console.log("getrefresherror Query -->",'call P_INSERT_ORDER_PROG()')
        return await query.executeQuery(sql);
    } catch (error) {
        console.log("getrefresherror",error)
        throw new Error.InternalServerErrorMsg(error);
    }
};

//added