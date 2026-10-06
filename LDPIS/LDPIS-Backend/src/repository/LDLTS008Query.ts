import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

// Exact copy of relevant methods from LDLTS003Query (LDLTS003 -> LDLTS008)

export const getOrderid = async (data: any) => {
  try {
    let sql = `SELECT distinct ENC_ID_ORDER FROM V_END_CUST_ORD_EPA
    WHERE ENC_CD_EPA='${data?.plant}'
    AND ENC_ST_ORDER='A'
    AND ENC_SLIT_PLAN='TUBE'
    UNION 
    SELECT DISTINCT TPI_ORDER_ID FROM V_PROCESS_SHEET_INC`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getItemNo = async (data: any) => {
  try {
    let sql = ` select enc_no_item from 
    v_end_cust_ord_epa where enc_id_order = '${data?.orderId}'
    UNION 
    SELECT TO_NUMBER(TPI_ORDER_ITEM) FROM V_PROCESS_SHEET_INC 
     WHERE  TPI_ORDER_ID  = '${data?.orderId}' `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProcessSheetData = async (data: any) => {
  try {
    let sql = `SELECT A.*,B.ENC_ORD_QUANTITY TPI_ORDER_QTY, 
       B.ENC_LENGTH_MAX TPI_SD_LEN, B.ENC_SEC1_MAX TPI_SD_THK, B.ENC_ODIA TPI_SD_OD,
       B.ENC_CD_GRADE TPI_SD_GRADE
    FROM V_PROCESS_SHEET_INC A,V_END_CUST_ORD_EPA B
       WHERE A.TPI_ORDER_ID = B.ENC_ID_ORDER(+) 
       AND A.TPI_ORDER_ITEM = B.ENC_NO_ITEM(+) 
      AND TPI_ORDER_ID = '${data?.orderId}'
      AND LTRIM(TPI_ORDER_ITEM) = ${data?.itemNo}`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// Exact copy of DeleteProcesssheet
export const DeleteProcesssheet = async (data: any) => {
  try {
    let sql = `DELETE
                    FROM V_PROCESS_SHEET_INC 
                    WHERE TPI_ORDER_ID = '${data?.orderId}'
                    AND LTRIM(TPI_ORDER_ITEM) = ${data?.itemNo}
                    AND 0 < (SELECT COUNT(*) FROM V_CODES WHERE CD_TYPE = 'TB038' AND  CD_VALUE = '${data?.pno}')`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
