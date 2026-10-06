import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getScrapData = async (
  batch: any,
  castNo: any,
  // decFrmDt: any ,
  // decToDt: any ,
  // matNo: any ,
  mbatch: any,
  plant: any,
  // procFrmDt: any ,
  // procToDt: any ,
  process: any,
  prodCd: any,
  // prodType: any ,
  qltyCd: any,
  scrpWt: any,
  status: any,
  // tdc: any ,
  thickFrm: any,
  thickTo: any,
  tonnage: any,
  widthFrm: any,
  widthTo: any
) => {
  try {
    // const sql = `SELECT LOM_ID_BATCH,LOM_CD_STATUS,LOM_NO_MATNR,LOM_CD_ST_ACTL,LOM_FL_OFF_CUT, LOM_MS_PIECE_ACTL,
    // NVL(LOM_MS_GROSS_CAL,0)LOM_MS_GROSS_CAL, NVL(LOM_MS_SCRAP,0)LOM_MS_SCRAP, LOM_ID_PAR_COIL_NO, LOM_ID_FIRST_PAR,
    // LOM_TDC_ACTL, LOM_CD_PROD, LOM_CD_QLTY_ACTL, LOM_LENGTH, LOM_SEC1, LOM_SEC2, LOM_ID_ORDER_CUS, LOM_ID_ORD_ITEM_CUS,
    // TO_CHAR(LOM_DT_SCRAP) LOM_DT_SCRAP, LOM_NO_PIECES, LOM_ID_ORDER, LOM_NO_ITEM, LOM_FL_SEND_SAP, LOM_NO_MATNR,
    // LOM_NO_INVOICE,TO_CHAR(LOM_DT_INVOICE) LOM_DT_INVOICE, TO_CHAR(LOM_TS_CREATION) LOM_TS_CREATION, LOM_PASSED_PROC,
    // SUBSTR(LOM_CD_STATUS,1,1) CURR_PROC, (SELECT DISTINCT(EBS_ID_OP_SCRAP) FROM V_EPA_BATCH_SCRAP WHERE
    // EBS_CD_EPA= LOM_CD_EPA AND EBS_ID_BATCH = LOM_ID_BATCH AND NVL(EBS_IND,'A') = 'A' AND ROWNUM=1)SCRAP,
    // (SELECT DISTINCT CASE (SELECT COUNT (1)FROM v_epa_batch_scrap WHERE EBS_CD_EPA = LOM_CD_EPA
    // AND EBS_ID_BATCH= LOM_ID_BATCH AND NVL(EBS_IND,'A') = 'A')WHEN 1 THEN ebs_scrp_matnr ELSE 'MULTI SCRAP MATERIAL'
    // END SCRP_MATNR FROM v_epa_batch_scrap WHERE EBS_CD_EPA = LOM_CD_EPA AND EBS_ID_BATCH= LOM_ID_BATCH AND NVL(EBS_IND,'A') = 'A' )
    // SCRP_MATNR,(	SELECT COUNT(1) FROM
    // V_EPA_BATCH_SCRAP WHERE  EBS_CD_EPA   = LOM_CD_EPA AND  EBS_ID_BATCH = LOM_ID_BATCH AND
    // NVL(EBS_IND,'A') = 'A')Count, (SELECT EBS_SCRP_BATCH_ST FROM V_EPA_BATCH_SCRAP WHERE EBS_CD_EPA   = LOM_CD_EPA AND
    // EBS_ID_BATCH = LOM_ID_BATCH AND  NVL(EBS_IND,'A') = 'A' AND ROWNUM=1) BatchSt,
    // (SELECT  CASE WHEN ESB_RELEASED_ON is NULL  THEN 'Y' ELSE 'N' END HOLD_TAG
    // FROM V_SPC_SCRAP_PLAN WHERE ESB_CD_EPA   = LOM_CD_EPA AND  ESB_ID_BATCH = LOM_ID_BATCH
    //  AND ESB_REQUEST_ID = (Select  MAX(ESB_REQUEST_ID) from V_SPC_SCRAP_PLAN WHERE ESB_ID_BATCH = LOM_ID_BATCH
    //  AND ESB_DEL_TAG='N') AND ESB_DEL_TAG='N' AND ROWNUM=1) HOLD_TAG ,
    //  (SELECT ESB_MCOIL_SCRAP FROM V_SPC_SCRAP_PLAN WHERE ESB_CD_EPA= LOM_CD_EPA AND ESB_ID_BATCH=LOM_ID_BATCH
    //  AND ESB_DEL_TAG='N' AND ROWNUM=1) TotalCoilScrap ,(SELECT ESB_ACCP_TONNAGE FROM V_SPC_SCRAP_PLAN
    //  WHERE ESB_CD_EPA= LOM_CD_EPA AND ESB_ID_BATCH=LOM_ID_BATCH AND ESB_DEL_TAG='N' AND ROWNUM=1) TotalAccptTonnage
    //  FROM V_LDP_PRODN  WHERE LOM_CD_EPA=:plant AND (LOM_cd_status like '%L' OR LOM_cd_status like '%B'
    //  OR (LOM_cd_status like '%F' AND LOM_cd_status NOT like 'VF') OR (LOM_cd_status like 'VF' AND LOM_tdc_actl
    //  IN (SELECT DISTINCT EAT_TDC_NO FROM V_EPA_ARISING_TDC)) OR
    //  ((LOM_cd_status like 'VF' OR LOM_cd_status like '%Q' OR LOM_cd_status like '%D')
    //  AND EXISTS (SELECT cd_value FROM V_CODES WHERE CD_TYPE='EPA113' AND CD_VALUE=LOM_CD_EPA)) OR (LOM_CD_STATUS LIKE '%C' AND EXISTS (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'EPA168' AND CD_VALUE = LOM_CD_EPA ))) AND LOM_cd_status not in ('WB', 'WL','WS') AND LOM_MS_GROSS_CAL<>NVL(LOM_MS_SCRAP,0) AND LOM_MS_GROSS_CAL <= NVL(NULL,LOM_MS_GROSS_CAL)   AND LOM_FL_SEND_SAP IN ('N','R','S','Y') AND LOM_TS_CREATION>=SYSDATE-731`;

    var sql = `
    SELECT LOM_id_batch, LOM_cd_status, LOM_no_matnr, LOM_cd_st_actl,
        LOM_fl_off_cut, LOM_ms_piece_actl,
        NVL (LOM_ms_gross_cal, 0) LOM_ms_gross_cal,
        NVL (LOM_ms_scrap, 0) LOM_ms_scrap, LOM_id_par_coil_no,
        LOM_id_first_par, LOM_tdc_actl, LOM_cd_prod, LOM_cd_qlty_actl,
        LOM_length, LOM_sec1, LOM_sec2, LOM_id_order_cus, LOM_id_ord_item_cus,
        TO_CHAR (LOM_dt_scrap) LOM_dt_scrap, LOM_no_pieces, LOM_id_order,
        LOM_no_item, LOM_fl_send_sap, LOM_no_matnr, LOM_no_invoice,
        TO_CHAR (LOM_dt_invoice) LOM_dt_invoice,
        TO_CHAR (LOM_ts_creation) LOM_ts_creation, LOM_passed_proc,
        SUBSTR (LOM_cd_status, 1, 1) curr_proc,
        (SELECT DISTINCT (ebs_id_op_scrap)
                    FROM v_epa_batch_scrap
                   WHERE ebs_cd_epa = LOM_cd_epa
                     AND ebs_id_batch = LOM_id_batch
                     AND NVL (ebs_ind, 'A') = 'A'
                     AND ROWNUM = 1) scrap,
        (SELECT DISTINCT CASE (SELECT COUNT (1)
                                 FROM v_epa_batch_scrap
                                WHERE ebs_cd_epa = LOM_cd_epa
                                 AND ebs_id_batch = LOM_id_batch
                                  AND NVL (ebs_ind, 'A') = 'A')
                            WHEN 1
                               THEN ebs_scrp_matnr
                            ELSE 'MULTI SCRAP MATERIAL'
                         END scrp_matnr
                    FROM v_epa_batch_scrap
                   WHERE ebs_cd_epa = LOM_cd_epa
                     AND ebs_id_batch = LOM_id_batch
                     AND NVL (ebs_ind, 'A') = 'A') scrp_matnr,
        (SELECT COUNT (1)
           FROM v_epa_batch_scrap
          WHERE ebs_cd_epa = LOM_cd_epa
            AND ebs_id_batch = LOM_id_batch
            AND NVL (ebs_ind, 'A') = 'A') COUNT,
        (SELECT ebs_scrp_batch_st
           FROM v_epa_batch_scrap
          WHERE ebs_cd_epa = LOM_cd_epa
            AND ebs_id_batch = LOM_id_batch
            AND NVL (ebs_ind, 'A') = 'A'
            AND ROWNUM = 1) batchst
    FROM v_LDP_PRODN
    WHERE LOM_cd_epa = :plant
    AND (   LOM_cd_status LIKE '%L'
         OR LOM_cd_status LIKE '%B'
         OR (LOM_cd_status LIKE '%F' AND LOM_cd_status NOT LIKE 'VF')
         OR (    LOM_cd_status LIKE 'VF'
             AND LOM_tdc_actl IN (SELECT DISTINCT eat_tdc_no
                                             FROM v_epa_arising_tdc)
            )
         OR (    (   LOM_cd_status LIKE 'VF'
                  OR LOM_cd_status LIKE '%Q'
                  OR LOM_cd_status LIKE '%D'
                 )
             AND EXISTS (SELECT cd_value
                           FROM v_codes
                          WHERE cd_type = 'EPA113' AND cd_value = LOM_cd_epa)
            )
         OR (    LOM_cd_status LIKE '%C'
             AND EXISTS (SELECT cd_value
                           FROM v_codes
                          WHERE cd_type = 'EPA168' AND cd_value = LOM_cd_epa)
            )
        )
    AND LOM_cd_status NOT IN ('WB', 'WL', 'WS')
    AND LOM_ms_gross_cal <> NVL (LOM_ms_scrap, 0)
    AND LOM_ms_gross_cal <= NVL (NULL, LOM_ms_gross_cal)
    AND LOM_fl_send_sap IN ('N', 'R', 'S', 'Y')
    AND LOM_TS_CREATION>=SYSDATE-731`;

    let binds = { plant: plant };

    if (process && process != "") {
      sql += ` AND LOM_CD_CURR_PROC = NVL(:process , LOM_CD_CURR_PROC)`;
      binds["process"] = process;
    }

    if (prodCd && prodCd != "") {
      sql += ` AND LOM_CD_PROD = NVL(:prodCd, LOM_CD_PROD)`;
      binds["prodCd"] = prodCd;
    }

    if (castNo && castNo != "") {
      sql += ` AND LOM_NO_CAST = NVL(:castNo,LOM_NO_CAST)`;
      binds["castNo"] = castNo;
    }

    if (thickFrm && thickFrm != "") {
      sql += ` AND LOM_SEC1  >=  NVL(:thickFrm,LOM_SEC1)`;
      binds["thickFrm"] = thickFrm;
    }

    if (thickTo && thickTo != "") {
      sql += ` AND LOM_SEC1  <=  NVL(:thickTo,LOM_SEC1)`;
      binds["thickTo"] = thickTo;
    }

    if (widthFrm && widthFrm != "") {
      sql += ` AND LOM_SEC2  >=  NVL(:widthFrm,LOM_SEC2)`;
      binds["widthFrm"] = widthFrm;
    }

    if (widthTo && widthTo != "") {
      sql += ` AND LOM_SEC2  <=  NVL(:widthTo,LOM_SEC2)`;
      binds["widthTo"] = widthTo;
    }

    if (scrpWt && scrpWt != "") {
      sql += ` AND LOM_MS_GROSS_CAL <= :scrpWt`;
      binds["scrpWt"] = scrpWt;
    }

    if (batch && batch != "") {
      sql += ` AND LOM_ID_BATCH = :batch`;
      binds["batch"] = batch;
    }

    if (mbatch && mbatch != "") {
      sql += ` AND LOM_ID_FIRST_PAR = NVL(:mbatch,LOM_ID_FIRST_PAR)`;
      binds["mbatch"] = mbatch;
    }

    if (tonnage && tonnage != "") {
      sql += `AND LOM_MS_GROSS_CAL<= NVL(:tonnage, LOM_MS_GROSS_CAL) `;
      binds["tonnage"] = tonnage;
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getProcessDesc = async (Plant: any) => {
  try {
    const sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMaterialData = async (plant: any) => {
  try {
    const sql = `SELECT SUBSTR(CD_DESC,1,18)MATERIAL_NO,SUBSTR(CD_DESC,22)MATERIAL_DESC,CD_VALUE,CD_TYPE FROM V_CODES 
    WHERE CD_TYPE='EPA196' AND CD_VALUE= :plant`;
    let binds = { plant: plant };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergingData = async (plant: any, castNo: any, matNo: any) => {
  try {
    var sql = `SELECT LOM_ID_BATCH BATCH1, LOM_MS_GROSS_CAL ACTUAL_QTY, LOM_NO_PIECES ACTUAL_PCS, LOM_NO_MATNR , LOM_NO_CAST , LOM_CD_STATUS
    FROM V_LDP_PRODN
    WHERE LOM_CD_EPA=:plant
    AND LOM_CD_STATUS='KB'
    AND LOM_ID_BATCH NOT IN (
    SELECT ERD_ID_NEW_BATCH FROM V_EPA_RANDOM_DTLS
    WHERE ERD_CD_EPA = LOM_CD_EPA
    AND ERD_ID_NEW_BATCH = LOM_ID_BATCH
    AND ERD_MOV_IND = 'B' ) `;

    let binds = {
      plant: plant,
    };

    if (castNo && castNo !== "") {
      sql += ` AND LOM_NO_CAST = :castNo`;
      binds["castNo"] = castNo;
    }

    if (matNo && matNo !== "") {
      sql += ` AND LOM_NO_MATNR = :matNo`;
      binds["matNo"] = matNo;
    }

    sql += ` ORDER BY LOM_TS_CREATION `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveMergingData = async (
  plant: any,
  mergedQnty: any,
  mergedPcs: any,
  totalActualQnty: any,
  totalActualPcs: any,
  createdBy: any,
  ACTUAL_PCS: any,
  ACTUAL_QTY: any,
  BATCH1: any,
  LOM_NO_CAST: any,
  LOM_NO_MATNR: any,
  LOM_CD_STATUS: any,
  merge_id: any,
  batch_count: any
) => {
  try {
    var sql = `call TTSB048_MERGE(
    P_NBT_EPL_CD_EPA => :P_NBT_EPL_CD_EPA,
    P_NBT_STATUS => :P_NBT_STATUS,
    P_NBT_MRG_BATCH => :P_NBT_MRG_BATCH,
    P_NBT_MRG_QTY => :P_NBT_MRG_QTY,
    P_NBT_MRG_PCS => :P_NBT_MRG_PCS,
    P_NBT_ACT_QTY  => :P_NBT_ACT_QTY,
    P_NBT_ACT_PCS  => :P_NBT_ACT_PCS,
    NBT_TOT_ACT_QTY => :NBT_TOT_ACT_QTY,
    NBT_TOT_ACT_PCS => :NBT_TOT_ACT_PCS,
    NBT_TOT_MRG_PCS => :NBT_TOT_MRG_PCS,
    NBT_TOT_MRG_QTY => :NBT_TOT_MRG_QTY,
    P_NBT_MATL_NO => :P_NBT_MATL_NO,
    P_NEW_BATCH => :P_NEW_BATCH,
    P_COUNT_OF_BATCH => :P_COUNT_OF_BATCH,
    LS_OUT_FLAG => :LS_OUT_FLAG
  )`;

    let binds = {
      P_NBT_EPL_CD_EPA: plant,
      P_NBT_STATUS: LOM_CD_STATUS,
      P_NBT_MRG_BATCH: BATCH1,
      P_NBT_MRG_QTY: ACTUAL_QTY,
      P_NBT_MRG_PCS: ACTUAL_PCS,
      P_NBT_ACT_QTY: ACTUAL_QTY,
      P_NBT_ACT_PCS: ACTUAL_PCS,
      NBT_TOT_ACT_QTY: mergedQnty,
      NBT_TOT_ACT_PCS: mergedPcs,
      NBT_TOT_MRG_PCS: mergedPcs,
      NBT_TOT_MRG_QTY: mergedQnty,
      P_NBT_MATL_NO: LOM_NO_MATNR,
      P_NEW_BATCH: merge_id,
      P_COUNT_OF_BATCH: batch_count,
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

export const getMaterialNo = async (plant: any) => {
  try {
    var sql = `SELECT DISTINCT LOM_NO_MATNR
  FROM V_LDP_PRODN
  WHERE LOM_CD_EPA=:plant
  AND LOM_CD_STATUS='KB'
  AND LOM_ID_BATCH NOT IN (
  SELECT ERD_ID_NEW_BATCH FROM V_EPA_RANDOM_DTLS
  WHERE ERD_CD_EPA = LOM_CD_EPA
  AND ERD_ID_NEW_BATCH = LOM_ID_BATCH
  AND ERD_MOV_IND = 'B' )`;

    let binds = {
      plant: plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCastNo = async (plant: any) => {
  try {
    var sql = `SELECT DISTINCT LOM_NO_cast
  FROM V_LDP_PRODN
  WHERE LOM_CD_EPA=:plant
  AND LOM_CD_STATUS='KB'
  AND LOM_ID_BATCH NOT IN (
  SELECT ERD_ID_NEW_BATCH FROM V_EPA_RANDOM_DTLS
  WHERE ERD_CD_EPA     = LOM_CD_EPA
  AND ERD_ID_NEW_BATCH = LOM_ID_BATCH
  AND ERD_MOV_IND = 'B' )`;

    let binds = {
      plant: plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMaxBatchIDCount = async (plant: any) => {
  try {
    const sql = `SELECT (NVL(max(TO_CHAR(SUBSTR(LOM_ID_BATCH,9,2))),0))+1 
		FROM V_LDP_PRODN
		WHERE LOM_CD_EPA=:plant
		AND LOM_ID_BATCH LIKE 'MRG'||TO_CHAR(SYSDATE,'DD')||DECODE(TO_CHAR(SYSDATE,'MM'),'10', 'A', '11', 'B', '12','C',
    TO_NUMBER(TO_CHAR(SYSDATE,'MM')))||TO_CHAR(SYSDATE,'YY')||'%'`;
    var binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergeID = async (ls_max: any) => {
  try {
    const sql = `SELECT 'MRG'||TO_CHAR(SYSDATE,'DD')||DECODE(TO_CHAR(SYSDATE,'MM'),'10', 'A', '11', 'B', '12','C',
    TO_NUMBER(TO_CHAR(SYSDATE,'MM')))||TO_CHAR(SYSDATE,'YY')|| :ls_max
 FROM DUAL`;
    var binds = {
      ls_max: ls_max,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMoMData = async (plant: any, matNo: any, status: any) => {
  try {
    const sql = ``;
    var binds = {
      plant: plant,
      matNo: matNo,
      status: status,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSplitData = async (
  batch: any,
  pieces: any,
  plant: any,
  qty: any
) => {
  try {
    const sql = ``;
    var binds = {
      batch: batch,
      pieces: pieces,
      plant: plant,
      qty: qty,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapRsn = async (plant: any, rsnCat: any) => {
  try {
    // const sql = `SELECT  ESR_RSN_CD, ESR_RSN_DESC FROM V_SCRP_SEC_RSN, V_CODES WHERE  ESR_CD_EPA = :plant AND CD_TYPE = 'EPA231' AND ESR_RSN_TYPE IN ('B','AB') AND CD_VALUE = ESR_RSN_CAT AND ESR_STATUS='A' AND CD_DESC = :rsnCat AND UPPER(ESR_RSN_DESC) NOT LIKE 'BLOCKED%' ORDER  BY 1, 2`;
    const sql = `SELECT   esr_rsn_cd, esr_rsn_desc
         FROM v_scrp_sec_rsn, v_codes
         WHERE esr_cd_epa = :plant
         AND cd_type = 'EPA231'
         AND esr_rsn_type IN ('B', 'AB')
         AND cd_value = esr_rsn_cat
         AND esr_status = 'A'
         AND UPPER (esr_rsn_desc) NOT LIKE 'BLOCKED%'
         ORDER BY esr_rsn_desc`;
    var binds = {
      plant: plant,
      // rsnCat : rsnCat
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getScrapMatNo = async (plant: any) => {
  try {
    const sql = `SELECT SUBSTR(CD_DESC,1,18)MATERIAL_NO,SUBSTR(CD_DESC,22)MATERIAL_DESC FROM V_CODES WHERE CD_TYPE='EPA196' AND CD_VALUE= :plant`;
    var binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveMaintainReason = async (
  plant: any,
  rsnCat: any,
  rsnCd: any,
  scrpMatNo: any,
  batch: any,
  scrapQty: any,
  totalScrapQty: any,
  actualScrapQty: any,
  process: any
) => {
  try {
    var sql = `call SPCB048_SCRAP(
    p_plant => :p_plant,
    NBT_RSN_CATE_NEW => :NBT_RSN_CATE_NEW,
    NBT_EBS_CD_RSN_SCRAP_NEW => :NBT_EBS_CD_RSN_SCRAP_NEW,
    NBT_SCRP_MATNR_NEW => :NBT_SCRP_MATNR_NEW,
    NBT_EBS_ID_BATCH_NEW => :NBT_EBS_ID_BATCH_NEW,
    NBT_EBS_MS_SCRAP_NEW => :NBT_EBS_MS_SCRAP_NEW,
    NBT_TOT_SCRAP_NEW => :NBT_TOT_SCRAP_NEW,
    NBT_SCRAP_NEW => :NBT_SCRAP_NEW,
    NBT_EBS_CD_PROCESS_NEW => :NBT_EBS_CD_PROCESS_NEW,
    NBT_SC_PROC_NEW => :NBT_SC_PROC_NEW,
    NBT_CHECK => :NBT_CHECK,
    LS_OUT_FLAG => :LS_OUT_FLAG
  )`;

    let binds = {
      p_plant: plant ?? "",
      NBT_RSN_CATE_NEW: rsnCat ?? "",
      NBT_EBS_CD_RSN_SCRAP_NEW: rsnCd ?? "",
      NBT_SCRP_MATNR_NEW: scrpMatNo ?? "",
      NBT_EBS_ID_BATCH_NEW: batch ?? "",
      NBT_EBS_MS_SCRAP_NEW: scrapQty ?? "",
      NBT_TOT_SCRAP_NEW: totalScrapQty ?? "",
      NBT_SCRAP_NEW: actualScrapQty ?? "",
      NBT_EBS_CD_PROCESS_NEW: process ?? "",
      NBT_SC_PROC_NEW: process ?? "",
      NBT_CHECK: "Y",
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

export const postScrap = async (
  plant: any,
  LOM_ID_BATCH: any,
  LOM_CD_STATUS: any,
  SCRP_MATNR: any,
  LOM_MS_PIECE_ACTL: any,
  LOM_ID_PAR_COIL_NO: any,
  LOM_ID_FIRST_PAR: any,
  LOM_CD_PROD: any,
  LOM_NO_PIECES: any,
  LOM_NO_MATNR: any,
  CURR_PROC: any
) => {
  try {
    var sql = `call SPCB048(
    p_plant => :p_plant, 
    BATCH_ID => :BATCH_ID,
    NBT_LOM_MS_GROSS_CAL => :NBT_LOM_MS_GROSS_CAL,
    NBT_LOM_MS_SCRAP => :NBT_LOM_MS_SCRAP, 
    NBT_LOM_CD_STATUS => :NBT_LOM_CD_STATUS, 
    NBT_LOM_ID_FIRST_PAR => :NBT_LOM_ID_FIRST_PAR, 
    NBT_LOM_ID_PAR_COIL_NO => :NBT_LOM_ID_PAR_COIL_NO,
    NBT_LOM_NO_PIECES => :NBT_LOM_NO_PIECES,
    NBT_LOM_CD_PROD => :NBT_LOM_CD_PROD,
    NBT_SCRP_MATNR => :NBT_SCRP_MATNR, 
    NBT_LOM_CD_CURR_PROC => :NBT_LOM_CD_CURR_PROC, 
    NBT_CHECK => :NBT_CHECK,
    LS_OUT_FLAG => :LS_OUT_FLAG
  )`;

    let binds = {
      p_plant: plant ?? "",
      BATCH_ID: LOM_ID_BATCH ?? "",
      NBT_LOM_MS_GROSS_CAL: LOM_MS_PIECE_ACTL ?? "",
      NBT_LOM_MS_SCRAP: SCRP_MATNR ?? "",
      NBT_LOM_CD_STATUS: LOM_CD_STATUS ?? "",
      NBT_LOM_ID_FIRST_PAR: LOM_ID_FIRST_PAR ?? "",
      NBT_LOM_ID_PAR_COIL_NO: LOM_ID_PAR_COIL_NO ?? "",
      NBT_LOM_NO_PIECES: LOM_NO_PIECES ?? "",
      NBT_LOM_CD_PROD: LOM_CD_PROD ?? "",
      NBT_SCRP_MATNR: LOM_NO_MATNR ?? "",
      NBT_LOM_CD_CURR_PROC: CURR_PROC ?? "",
      NBT_CHECK: "Y",
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

export const getReasonCategory = async () => {
  try {
    const sql = `SELECT cd_value, cd_desc FROM V_CODES
    WHERE CD_TYPE='EPA231'
    `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
