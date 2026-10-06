import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getRM = async (props: any) => {
  try {

  let sql = `SELECT
    RMF_CD_EPA AS EPA_Code,
    RMF_ID_BATCH AS id_batch,
    RMF_CD_PROD AS Product_Code,
    RMF_CD_STATUS AS Status_Code,
    RMF_CD_QLTY_ACTL AS Quality_Actual_Code,
    RMF_SEC1 AS rmf_sec1,
    RMF_SEC2 AS rmf_sec2,
    RMF_LENGTH AS Length_Value,
    RMF_TDC_ACTL AS rmf_tdc_actl,
    RMF_MS_PIECE_ACTL AS QTY,
    RMF_CAST_NO AS Cast_Number,
    RMF_NO_MATNR AS Material_Number,
    RMF_MATNR_DESC AS Material_Description,
    RMF_AGE_DAYS AS Age_In_Days,
    RMF_TS_CREATION AS Creation_Timestamp,
    RMF_GROSS_CAL AS Gross_Calculation,
    RMF_ID_ORDER_1 AS Order_ID_1,
    RMF_NO_ITEM_1 AS Item_Number_1,
    RMF_ID_ORDER_2 AS Order_ID_2,
    RMF_NO_ITEM_2 AS Item_Number_2,
    RMF_ID_ORDER_3 AS Order_ID_3,
    RMF_NO_ITEM_3 AS Item_Number_3,
    RMF_ID_ORDER_4 AS Order_ID_4,
    RMF_NO_ITEM_4 AS Item_Number_4,
    RMF_WT_USED_ORD1 AS Weight_Used_Order1,
    RMF_WT_USED_ORD2 AS Weight_Used_Order2,
    RMF_WT_USED_ORD3 AS Weight_Used_Order3,
    RMF_WT_USED_ORD4 AS Weight_Used_Order4,
    RMF_WT_USED_TOTAL AS Weight_Used_Total,
    RMF_SEC2_USED AS Section2_Used,
    RMF_NO_SLIT_ORD1 AS Slit_Number_Order1,
    RMF_NO_SLIT_ORD2 AS Slit_Number_Order2,
    RMF_NO_SLIT_ORD3 AS Slit_Number_Order3,
    RMF_NO_SLIT_ORD4 AS Slit_Number_Order4,
           rmf_id_order_1 || rmf_id_order_2 as LINKED_ORDER_ID, -- Alias for concatenated order ID
        rmf_no_item_1 || rmf_no_item_2 as LINKED_ITEM_NO, -- Alias for concatenated item NO
     To_char(RMF_CREATE_DATE,'yyyy-MM-dd HH24:MI:SS') RMF_CREATE_DATE,
    RMF_CREATE_USER AS Create_User,
    RMF_UPDATED_ON AS Updated_On,
    RMF_UPDATED_BY AS Updated_By
FROM
    v_rm_forcast `;

    const conditions = [];

    if (props.orderId || props.itemId) {
      sql += `WHERE RMF_ID_ORDER_1 = '${props.orderId}'`;
    }
    if (props.itemId) {
      conditions.push(`rmf_no_item_1 = '${props.itemId}'`);
    }



    console.log("getRM sql: ", sql); // Corrected log message
    let results = await query.executeQuery(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getList = async (props: any) => {
  try {

    let sql = `SELECT
    t.COS_CD_EPA,
    t.COS_ID_ORDER,
    t.COS_NO_ITEM,
    t.COS_NO_MATNR,
    t.COS_AGENING_DAYS,
    t.COS_SALES_QTY,
    t.COS_ORD_QUANTITY,
    t.COS_DISPATCHED_FG,
    t.COS_BTS,
    t.COS_BTR,
  (t.COS_BTR-t.COS_ORD_QTY_RESERVE) PROPOSED_BTR,
    t.COS_WIP_QTY,
    t.COS_FG_STOCK,
    t.COS_ODIA,
    t.COS_IDIA,
    t.COS_SEC1_MIN,
    t.COS_SEC1_MAX,
    t.COS_LENGTH_MAX,
    t.COS_NO_TDC,
    t.COS_CD_PROD,
    t.COS_CD_QLTY,
    t.COS_ORDER_TYPE,
    t.COS_SEC2_MIN,
    t.COS_SEC2_MAX,
    t.COS_SLIT_WIDTH,
    t.COS_MATNR_SPEC,
    t.COS_ORD_QTY_RESERVE,
    --t.COS_CREATE_DATE,
    To_char(t.COS_CREATE_DATE,'yyyy-MM-dd HH24:MI:SS') COS_CREATE_DATE,
    t.COS_CREATE_USER,
    t.COS_UPDATED_ON,
    t.COS_UPDATED_BY
FROM
    V_CUS_ORD_FORECAST t
WHERE
    t.COS_CD_EPA = '0780'`;

    // let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR from v_bare_pdo
    //            where TBP_PAR_COIL_NO = '${rmBatch}'`;

      // if (props.pipeno != "") {
      //   // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`;
      //   sql += `and lom_id_batch = '${props.pipeno}'`;
      // }
      // if (props.rmBatch != "") {
      //   // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`;
      //   sql += `and lom_id_par_coil_no = '${props.rmBatch}'`;
      // }
    // else {
    //   sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
    //                  AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`;
    // }
    console.log("getList sql: ", sql);

    let results = await query.executeQuery(sql);
    // console.log("getList results: ", results);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRMtab = async (props: any) => {
  try {

    let sql = `SELECT
  RMF_CD_EPA,
  RMF_ID_BATCH,
  RMF_CD_PROD,
  RMF_CD_STATUS,
  RMF_CD_QLTY_ACTL,
  RMF_SEC1,
  RMF_SEC2,
  RMF_LENGTH,
  RMF_TDC_ACTL,
  RMF_MS_PIECE_ACTL,
  RMF_CAST_NO,
  RMF_NO_MATNR,
  RMF_MATNR_DESC,
  RMF_AGE_DAYS,
  RMF_TS_CREATION,
  RMF_GROSS_CAL,
  RMF_ID_ORDER_1,
  RMF_NO_ITEM_1,
  RMF_ID_ORDER_2,
  RMF_NO_ITEM_2,
  RMF_ID_ORDER_3,
  RMF_NO_ITEM_3,
  RMF_ID_ORDER_4,
  RMF_NO_ITEM_4,
  RMF_WT_USED_ORD1,
  RMF_WT_USED_ORD2,
  RMF_WT_USED_ORD3,
  RMF_WT_USED_ORD4,
  RMF_WT_USED_TOTAL,
  RMF_SEC2_USED,
  RMF_NO_SLIT_ORD1,
  RMF_NO_SLIT_ORD2,
  RMF_NO_SLIT_ORD3,
  RMF_NO_SLIT_ORD4,
  To_char(RMF_CREATE_DATE,'yyyy-MM-dd HH24:MI:SS') RMF_CREATE_DATE, -- Formatted for consistency
  RMF_CREATE_USER,
  RMF_UPDATED_ON,
  To_char(RMF_UPDATED_ON,'yyyy-MM-dd HH24:MI:SS') RMF_UPDATED_ON, -- Formatted for consistency
  RMF_UPDATED_BY
FROM V_RM_FORCAST`;

    const conditions = [];

    if (props.plant) {
      conditions.push(`RMF_CD_EPA = '${props.plant}'`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    console.log("getRMtab sql: ", sql);

    let results = await query.executeQuery(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const populateForecast = async () => {
  try {
    console.log('P_ORDRM_DET_FORCAST');

    let sql1 = `
    call LDPDBA.P_ORDRM_DET_FORCAST(
      LS_OUT_FLAG   => :LS_OUT_FLAG
      )`;

    let bind1 = {
      LS_OUT_FLAG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result1: any = await query.executeQuery(sql1, bind1);
    const flag1 = result1.outBinds.LS_OUT_FLAG;

    console.log("P_ORDRM_DET_FORCAST :", flag1);

    if (!flag1 || !flag1.startsWith("Y")) {
      return {
        success: false,
        message: flag1,
      };
    }

    let sql2 = `
    call LDPDBA.P_ORD_MAP_FORCAST(
      LS_OUT_FLAG   => :LS_OUT_FLAG
      )`;

    let bind2 = {
      LS_OUT_FLAG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result2: any = await query.executeQuery(sql2, bind2);
    const flag2 = result2.outBinds.LS_OUT_FLAG;

    console.log("P_ORD_MAP_FORCAST :", flag2);

    if (!flag2 || !flag2.startsWith("Y")) {
      return {
        success: false,
        message: flag2,
      };
    }

    return {
      success: true,
      message: flag2,
    };
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};