import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import env from "../env"

export const GetGradeInfo = async (spec: any, status: any) => {
  try {
    let binds = {
      status: status,
    };

    let sql = ` SELECT VTG_SPEC SPEC , VTG_GRADE GRADE,
    VTG_REMARKS REMARKS,
    TO_CHAR(VTG_CRT_DT, 'DD-MM-YYYY') CRTDT,
    VTG_CRT_BY CRTBY,
    TO_CHAR(VTG_UPD_DT, 'DD-MM-YYYY') UPDDT,
    VTG_UPD_BY UPDBY,
    VTG_STATUS STATUS
FROM V_TUBE_GRADE where VTG_STATUS = :status `;

    if (spec === "ALL") {
      sql += ` `;
    } else {
      sql += ` and VTG_SPEC = :spec `;
      Object.assign(binds, { spec: spec });
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStatus = async (plant: any) => {
  try {
    let binds = {
      plant: plant,
    };

    let sql = ` SELECT DISTINCT EOM_CD_STATUS STATUSCD FROM V_EPA_PRODN
    WHERE EOM_CD_EPA = :plant
    AND EOM_CD_STATUS IN (SELECT CD_VALUE FROM V_CODES
WHERE CD_TYPE = 'TB067') `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchID = async (plant: any, status: any, flag: any) => {
  try {
    let binds = {
      plant: plant,
      status: status,
    };
    //  console.log(flag,'Flag')
    if (flag === 0) {
      // console.log('normal Sreeen ');
      let sql = ` SELECT DISTINCT EOM_ID_BATCH BATCHID FROM V_EPA_PRODN
    WHERE EOM_CD_EPA = :plant
    AND EOM_CD_STATUS = :status
    AND EOM_CD_QLTY_ACTL <> 'SCRP'
        AND EOM_CD_STATUS not like '%L'
    `;
      return await query.executeQuery(sql, binds);
    } else if (flag === 1) {
      // console.log('Report Sreeen ');
      let sql = ` SELECT DISTINCT TTC_ID_BATCH BATCHID FROM V_TUBE_COUNT
       WHERE TTC_CD_EPA = :plant
        And TTC_CD_STATUS IN (SELECT CD_VALUE FROM V_CODES
       WHERE CD_TYPE = 'TB067' and TTC_CD_STATUS = :status)
    `;
      return await query.executeQuery(sql, binds);
    }
    // return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getsize = async (plant: any, Batch: any) => {
  try {
    let binds = {
      plant: plant,
      Batch: Batch,
    };

    let sql = `         SELECT
    (EOM_SEC1 || 'X' || EOM_SEC2 || 'X' || EOM_LENGTH) AS BATCH_SIZE,
    T1.EOM_NO_MATNR AS MATNR,
    CASE
        WHEN T1.EOM_UOM = 'TO' THEN T1.EOM_MS_PIECE_ACTL
        WHEN T1.EOM_UOM = 'KG' THEN T1.EOM_MS_PIECE_ACTL / 1000
        ELSE T1.EOM_MS_PIECE_ACTL
    END AS QTY,
    T2.ENC_ORD_DESC
--    ,T2.ENC_CUST_NAME
--    ,T2.ENC_MK_SPEC_COMPLETE
FROM
    V_EPA_PRODN T1
LEFT OUTER JOIN
    V_END_CUST_ORD_EPA T2
ON
        T1.EOM_ID_ORDER_CUS = T2.ENC_ID_ORDER
    AND T1.EOM_ID_ORD_ITEM_CUS = T2.ENC_NO_ITEM
    AND T1.EOM_CD_EPA = T2.ENC_CD_EPA
     WHERE EOM_CD_EPA = :plant 
       AND EOM_ID_BATCH = :Batch 
         AND EOM_CD_QLTY_ACTL <> 'SCRP'
           AND EOM_CD_STATUS NOT LIKE '%L'    `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSpecList = async () => {
  try {
    let sql = `SELECT DISTINCT VTG_SPEC SPEC from V_TUBE_GRADE `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetreportTubecnt = async (plant: any, status: any, Batchid: any) => {
  try {
    let binds: { [key: string]: any } = { // Explicitly define binds type
      plant: plant,
    };

    // let sql = ` SELECT     
    // TTC_CD_EPA PLANT,   
    // TTC_ID_BATCH BATCHID,
    // TTC_SIZE SIZE1,
    // TTC_CD_STATUS STATUS,
    // ROUND(TTC_BATCH_QTY,3) QTY,
    // TTC_NO_MATNR MATNR,
    // TTC_URL_LINK LINK1,
    // TO_CHAR(TTC_REC_CRT_DT, 'DD-MM-YYYY') CRTDT,
    // TTC_REC_CRT_UID CRT_ID,
    // NVL(TTC_NO_PCS_SQ,0) NO_PCS_SQ,
    // NVL(TTC_NO_PCS_CR,0) NO_PCS_CR,
    // TTC_UPD_DT UPD_DT,
    // TTC_UPD_BY UPD_BY,
    //  TTC_CONF CONFI,
    //  TTC_SHIFT SHIFT
    // FROM V_TUBE_COUNT WHere  TTC_CD_EPA  = :plant `;

    let sql = `SELECT
    TTC.TTC_CD_EPA AS PLANT,
    TTC.TTC_ID_BATCH AS BATCHID,
    TTC.TTC_SIZE AS SIZE1,
    TTC.TTC_CD_STATUS AS STATUS,
    ROUND(TTC.TTC_BATCH_QTY, 3) AS QTY,
    TTC.TTC_NO_MATNR AS MATNR,
    TTC.TTC_URL_LINK AS LINK1,
    TO_CHAR(TTC.TTC_REC_CRT_DT, 'DD-MM-YYYY') AS CRTDT,
    TTC.TTC_REC_CRT_UID AS CRT_ID,
    NVL(TTC.TTC_NO_PCS_SQ, 0) AS NO_PCS_SQ,
    NVL(TTC.TTC_NO_PCS_CR, 0) AS NO_PCS_CR,
    TTC.TTC_UPD_DT AS UPD_DT,
    TTC.TTC_UPD_BY AS UPD_BY,
    TTC.TTC_CONF AS CONFI,
    TTC.TTC_SHIFT AS SHIFT,
    -- Columns from V_EPA_PRODN (Query 1)
    EOM.EOM_NO_CAST,
    EOM.EOM_MS_GROSS_ACTL,
    EOM.EOM_UOM,
    EOM.EOM_NO_MATNR AS EOM_MATNR, -- Aliased to avoid conflict with TTC_NO_MATNR
    EOM.EOM_ID_ORDER_CUS,
    EOM.EOM_ID_ORD_ITEM_CUS,
    -- Columns from V_END_CUST_ORD_EPA (Query 2)
    ENC.ENC_ORD_DESC,
    ENC.ENC_CUST_NAME,
    ENC.ENC_MK_SPEC_COMPLETE
FROM
    V_TUBE_COUNT TTC
LEFT JOIN
    V_EPA_PRODN EOM
    ON TTC.TTC_CD_EPA = EOM.EOM_CD_EPA
   AND TTC.TTC_ID_BATCH = EOM.EOM_ID_BATCH
   AND TTC.TTC_ID_BATCH = EOM.EOM_ID_BATCH --= '6928K44797' -- Filter specific to V_EPA_PRODN
LEFT JOIN
    V_END_CUST_ORD_EPA ENC
    ON EOM.EOM_ID_ORDER_CUS = ENC.ENC_ID_ORDER
   AND EOM.EOM_ID_ORD_ITEM_CUS = ENC.ENC_NO_ITEM
   AND EOM.EOM_CD_EPA = ENC.ENC_CD_EPA
--   AND ENC.ENC_ID_ORDER = '4000539524' -- Filter specific to V_END_CUST_ORD_EPA
--   AND ENC.ENC_NO_ITEM = '6'           -- Filter specific to V_END_CUST_ORD_EPA
WHERE
    TTC.TTC_CD_EPA = :plant `;

    if (status && status !== "") {
      sql += ` And TTC_CD_STATUS = :status`; // Removed NVL as it's not needed if status is always provided or empty string
      binds["status"] = status;
    }
    if (Batchid && Batchid !== "") {
      sql += ` And TTC_ID_BATCH = :Batchid`; // Removed NVL//
      binds["Batchid"] = Batchid;
    }

    sql += ` order by TTC_REC_CRT_DT desc`;

    // console.log(sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTubecount = async (dt: any) => {
  try {
    let sql: any = `INSERT INTO TUBEDBA.T_TUBE_COUNT (
    TTC_REC_TIMESTAMP,
    TTC_CD_EPA,
    TTC_ID_BATCH,
    TTC_CD_STATUS,
    TTC_BATCH_QTY,
    TTC_NO_MATNR,
    TTC_URL_LINK,
    TTC_REC_CRT_DT,
    TTC_REC_CRT_UID,
    TTC_NO_PCS_CR,
    TTC_NO_PCS_SQ,
    TTC_CONF,
    TTC_SIZE,
    TTC_SHIFT
) VALUES (
    f_nannow_second_telgrm (SYSDATE),
    :TTC_CD_EPA,
    :TTC_ID_BATCH,
    :TTC_CD_STATUS,
    :TTC_BATCH_QTY,
    :TTC_NO_MATNR,
    :TTC_URL_LINK,
    SYSDATE,
    USER,
    :TTC_NO_PCS_CR,
    :TTC_NO_PCS_SQ,
    :TTC_CONF,
    :TTC_SIZE,
    :TTC_SHIFT
    ) `;

    const binds = {
      TTC_CD_EPA: dt[0].PLANT,
      TTC_ID_BATCH: dt[0].BATCHID,
      TTC_CD_STATUS: dt[0].STATUS,
      TTC_BATCH_QTY: dt[0].QTY,
      TTC_NO_MATNR: dt[0].MATNR,
      TTC_URL_LINK: dt[0].LINK1,
      TTC_NO_PCS_CR: dt[0].NO_PCS_CR,
      TTC_NO_PCS_SQ: dt[0].NO_PCS_SQ,
      TTC_CONF: dt[0].CONFI,
      TTC_SIZE: dt[0].SIZE1,
      TTC_SHIFT: dt[0].SHIFT,
    };
    console.log(sql, binds);
    return await query.executeQuery(sql, binds)

  }
  catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }

}

export const getBatchCount = async (plant: any, batch: any) => {
  try {
    const sql = `
      SELECT COUNT(*) CNT 
      FROM V_TUBE_COUNT 
      WHERE TTC_CD_EPA = :plant 
      AND TTC_ID_BATCH = :batch
    `;

    const binds = { plant, batch };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTxtdownloadflag = async (plant: any) => {
  try {
    let binds = {
      plant: plant,
    };

    let sql = ` SELECT COUNT(*) CNT FROM V_CODES
WHERE CD_TYPE = 'TB068' and CD_VALUE = :plant `;
    console.log(sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTxtdownloadsize = async (flag: any) => {
  try {
    let binds = {
      flag: flag,
    };

    let sql = ` SELECT CD_VALUE MBSIZE FROM V_CODES
WHERE CD_TYPE = 'TB069' and CD_DESC = :flag`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const tubecountapi = async (res: any) => {
  try {
    console.log(env.appserver, 'env.ts');
    // console.log('tubecountapi', res);
    const formData = new FormData();
    // formData.append("file", res);
    const blob = new Blob([res.buffer], { type: res.mimetype });
    formData.append('file', blob, res.originalname);
    formData.append("annotated", 'No');
    const response = await fetch(env.pythonURL + "/api/get_tube_counts/get", {
        method: "POST",
        body: formData,
      });
      return response?.json()
  }
  catch (error) {
    // console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }

}