import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

const dateFormat = (OrddtFr: string) => {
  const varDate = new Date(OrddtFr);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yyyy = varDate.getFullYear();
  let mm = varDate.getMonth(); // Months start at 0!
  let dd = varDate.getDate();
  let fdate: any = varDate.getDate();
  if (dd < 10) fdate = "0" + dd;

  return fdate + "-" + monthNames[mm].toUpperCase() + "-" + yyyy;
};

export const getFGData = async (
  plant: any,
  upType: any,
  batch: any,
  mBatch: any,
  status: any,
  order: any,
  item: any,
  Upload_Date_From: any,
  Upload_Date_To: any
) => {
  try {
    var sql;

    sql = `SELECT TIMESTAMP  As TIME_STAMP,
    CHARG AS BATCH,  MOTHER_CHARG  AS MOTHER_BATCH_ID,NET_QTY AS NET_WT, GRS_QTY as GRS_QTY, nvl(SCR_QTY,0) AS SCRAP_WT,
    nvl(INV_LS_QTY,0) AS INV_LOSS,LENGTH AS LENGTH, nvl(NO_PIECES,0) AS NO_PIECES,SC_ORDER_NO   AS SCO_ORDER_NO,
    SC_ORDER_ITEM AS SCO_ORDER_ITEM, CUST_ORDER AS ORDER_NO,POSNR AS ITEM_NO,STATUS AS STATUS,ERROR_CD  AS
    ERROR_CD,MATNR AS MATERIAL_NO,nvl(SUBSTR(TIMESTAMP_PRC,1,16),' ') AS PROCESS_TIME, ' ' AS SYS_UPLOAD_TIME,
    CUSTOMER_NAME AS CUSTOMER_NAME , LGORT stor_loc,TM_SETUP strt_tm,TM_MC end_tm,nvl(WRK_CENTRE,' ') work_cent,nvl(PRINTER_ID,' ') other_info 
    FROM V_YEPA_FG_STOCK WHERE 
    MANDT =  '600' AND WERKS = NVL(:plant, WERKS)`;
    //let binds = {plant:plant};
    let binds = {
      plant: plant,
    };

    if (upType && upType !== "") {
      sql += ` and ACTION_CD = NVL(:upType, ACTION_CD)`;
      binds["upType"] = upType;
    }

    if (status && status !== "") {
      sql += ` And STATUS = NVL(:status, STATUS)`;
      binds["status"] = status;
    }
    if (
      Upload_Date_From &&
      Upload_Date_From !== "" &&
      Upload_Date_To &&
      Upload_Date_To !== ""
    ) {
      sql += ` AND TO_DATE(SUBSTR(TIMESTAMP, 1, 10),'YYYY-MM-DD') BETWEEN TO_DATE('${dateFormat(
        Upload_Date_From
      )}','DD-Mon-YYYY') AND TO_DATE('${dateFormat(
        Upload_Date_To
      )}','DD-Mon-YYYY')`;
      //binds["STATUS"] = status;
    }

    if (mBatch && mBatch !== "") {
      sql += ` And MOTHER_CHARG = NVL(:mBatch, MOTHER_CHARG)`;
      binds["mBatch"] = mBatch;
    }
    if (batch && batch !== "") {
      sql += ` And CHARG = NVL(:batch, CHARG)`;
      binds["batch"] = batch;
    }
    if (order && order !== "") {
      sql += ` And SC_ORDER_NO = NVL(:ord, SC_ORDER_NO)`;
      binds["ord"] = order;
    }
    if (item && item !== "") {
      sql += ` And SC_ORDER_ITEM = NVL(:item, SC_ORDER_ITEM)`;
      binds["item"] = item;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateFGData = async (
  old_status: any,
  ORDER_ID: any,
  ORER_ITEM: any,
  CHARG: any,
  TIME_STAMP: any,
  new_status: any
) => {
  try {
    var sql = "";
    if (old_status == "E" && new_status == "A") {
      var sql1 = `UPDATE V_YEPA_FG_STOCK SET STATUS = :newStatus,ERROR_CD  = ' ' ,STAGE_CD  = ' ',
    PI_STATUS = 'N' ,PI_SOURCE_PGM = 'LDSM022'
    WHERE TIMESTAMP   = NVL(:TIME_STAMP, TIMESTAMP) AND
    SC_ORDER_NO   = NVL(:ORDER_ID, SC_ORDER_NO)
    AND SC_ORDER_ITEM = NVL(:ORER_ITEM, SC_ORDER_ITEM)  AND CHARG = NVL(:CHARG, CHARG)

  `;
      sql = sql1;
    }
    if ((old_status == "E" || old_status == "P") && new_status == "Y") {
      var sql2 = `UPDATE V_YEPA_FG_STOCK SET STATUS = ‘Y’  = ' ',  PI_STATUS = 'N',PI_SOURCE_PGM = 'LDSM022'
  WHERE TIMESTAMP   = NVL(:TIME_STAMP, TIMESTAMP) AND
  SC_ORDER_NO   = NVL(:ORDER_ID, SC_ORDER_NO)
  AND SC_ORDER_ITEM = NVL(:ORER_ITEM, SC_ORDER_ITEM)  AND CHARG = NVL(:CHARG, CHARG)

  `;
      sql = sql2;
    }
    if (old_status == "P" && new_status == "A") {
      var sql3 = `UPDATE V_YEPA_FG_STOCK SET STATUS = :newStatus,ERROR_CD  = ' ' ,STAGE_CD  = ' ', DOCUMENT_NO=’ ‘
  PI_STATUS = 'N' ,PI_SOURCE_PGM = 'LDSM022'
  WHERE TIMESTAMP   = NVL(:TIME_STAMP, TIMESTAMP) AND
  SC_ORDER_NO   = NVL(:ORDER_ID, SC_ORDER_NO)
  AND SC_ORDER_ITEM = NVL(:ORER_ITEM, SC_ORDER_ITEM)  AND CHARG = NVL(:CHARG, CHARG)

  `;
      sql = sql3;
    }

    const binds = {
      ORDER_ID: ORDER_ID,
      ORER_ITEM: ORER_ITEM,
      CHARG: CHARG,
      TIME_STAMP: TIME_STAMP,
      new_status: new_status,
    };
    if (sql.length > 0) {
      return await query.executeQuery(sql, binds);
    } else {
      return;
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getUploadType = async () => {
  try {
    var sql;

    sql = `SELECT CD_VALUE Upl_Typ_Disp ,CD_DESC Action_cd
         FROM V_CODES
         WHERE CD_TYPE='TB002'
         ORDER BY 1`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
