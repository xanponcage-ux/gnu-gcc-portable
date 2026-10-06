import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRMData = async (
  WERKS: any,
  CLIENT_ID: any,
  status: any,
  invoice: any,
  Upload_Date_From: any,
  Upload_Date_To: any,
  delivery: any,
  batch: any,
  action: any
) => {
  try {
    var sql = `SELECT   TIMESTAMP AS TIMESTAMP,   CHARG AS BATCH_ID,   NO_INVOICE AS Invoice_No,   DT_INVOICE AS Invoice_Date, 
    NO_DELIVERY AS Delivery_No,   ACPT_QTY AS Weight,   PI_STATUS AS RFC_Status,   STATUS AS Status, 
    MATNR AS Material_No,   ERROR_CD AS REMARKS ,DOCUMENT_NO FROM V_YEPA_COIL_RECV   WHERE WERKS = NVL(:WERKS, WERKS) 
    AND MANDT = NVL(:CLIENT_ID, MANDT) `;
    //let binds = {plant:plant};
    var binds = {
      WERKS: WERKS,
      CLIENT_ID: CLIENT_ID,
      // batch: batch,
      // mBatch: mBatch,
      // status: status,
      // scorder: scorder,
      // scoitem: scoitem,
      // order: order,
      // item: item
    };

    if (
      Upload_Date_From &&
      Upload_Date_From !== "" &&
      Upload_Date_To &&
      Upload_Date_To !== ""
    ) {
      sql += ` AND TO_DATE(SUBSTR(TIMESTAMP, 1, 10),'YYYY-MM-DD') BETWEEN :UploadFromDate AND :UploadToDate`;
      binds["UploadFromDate"] = Upload_Date_From;
      binds["UploadToDate"] = Upload_Date_To;
    }
    if (batch && batch !== "") {
      sql += ` And CHARG = NVL(:batch, CHARG)`;
      binds["batch"] = batch;
    }
    if (status && status !== "") {
      sql += ` And STATUS = NVL(:status, STATUS)`;
      binds["status"] = status;
    }
    if (invoice && invoice !== "") {
      sql += ` And NO_INVOICE = NVL(:invoice, NO_INVOICE)`;
      binds["invoice"] = invoice;
    }
    if (delivery && delivery !== "") {
      sql += ` And NO_DELIVERY = NVL(:delivery, NO_DELIVERY)`;
      binds["delivery"] = delivery;
    }
    if (delivery && delivery !== "") {
      sql += ` And ACTION_CD = NVL(:action, ACTION_CD);`;
      binds["action"] = action;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateRMData = async (
  timestamp: any,
  charg: any,
  old_status: any,
  new_status: any
) => {
  try {
    var sql = "";
    if (old_status == "E" && new_status == "A") {
      var sql1 = `UPDATE V_YEPA_COIL_RECV SET DOCUMENT_NO=' ' ,STAGE_CD=' ' , STATUS='A' ,ERROR_cD=' ' , PI_STATUS='N',PI_SOURCE_PGM='LDSM021'
      WHERE TIMESTAMP =:timestamp 
      AND CHARG = :charg
      `;
      sql = sql1;
    }
    if (old_status == "E" && new_status == "Y") {
      var sql2 = `UPDATE V_YEPA_COIL_RECV SET STATUS='Y' ,PI_STATUS='N',PI_SOURCE_PGM='LDSM021'
      WHERE TIMESTAMP =:timestamp 
      AND CHARG = :charg 
      `;
      sql = sql2;
    }
    if (old_status == "P" && new_status == "Y") {
      var sql3 = `UPDATE V_YEPA_COIL_RECV SET STATUS='Y' ,PI_STATUS='N',PI_SOURCE_PGM='LDSM021'
      WHERE TIMESTAMP =:timestamp 
      AND CHARG = :charg   
      `;
      sql = sql3;
    }
    if (old_status == "P" && new_status == "A") {
      var sql4 = `UPDATE V_YEPA_COIL_RECV SET DOCUMENT_NO=' ' ,STAGE_CD=' ' , STATUS='A' ,ERROR_cD=' ' , PI_STATUS='N',PI_SOURCE_PGM='LDSM021'
        WHERE TIMESTAMP =:timestamp 
        AND CHARG = :charg      
      `;
      sql = sql4;
    }

    const binds = {
      TIMESTAMP: timestamp,
      CHARG: charg,
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
