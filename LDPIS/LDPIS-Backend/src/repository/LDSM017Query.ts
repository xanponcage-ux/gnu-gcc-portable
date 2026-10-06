import oracledb from "oracledb";
import query from "../infrastructure/database/querys";
import Error from "../models/errors";

export const getGroupPlant = async (userId: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC TEXT,EGP_CD_EPA VAL,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :userId AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    const binds = {
      userId: userId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRolePlant = async (userId: any) => {
  try {
    const sql = `SELECT DISTINCT (EPL_CD_EPA||'-'||EPL_EPA_DESC) as TEXT,EPL_CD_EPA VAL,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_PROC_LINE
    where EPL_BUSI_ROLE IN (SELECT DISTINCT (SUBSTR(uug_id_usergrp,2,4)) FROM v_user_user_group WHERE uug_id_users = :userId) AND EPL_ACTIVE_PLANT_FL='A' ORDER BY EPL_CD_EPA`;
    const binds = {
      userId: userId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getAllPlant = async (userId: any) => {
  try {
    const sql = `SELECT DISTINCT (EPL_CD_EPA||'-'||EPL_EPA_DESC) as TEXT,EPL_CD_EPA VAL,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_PROC_LINE
    where EPL_CD_EPA IN (SELECT DISTINCT (SUBSTR(uug_id_usergrp,2,4)) FROM v_user_user_group WHERE uug_id_users = :userId ) AND EPL_ACTIVE_PLANT_FL='A' ORDER BY EPL_CD_EPA`;
    const binds = {
      userId: userId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB002 = async (date: any) => {
  try {
    const sql = `CALL C1CEB002(p_date=>TO_DATE(:p_date,'dd-Mon-yyyy'))`;
    const binds = {
      p_date: date,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchTrigger = async (batch: any) => {
  try {
    const sql = `UPDATE v_ymqmt_tc_res_comn_tsm SET PI_STATUS='N' WHERE CHARG= :batch`;
    const binds = {
      batch: batch,
    };
    console.log(sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMANDT = async (plantCd: any) => {
  try {
    const sql = `SELECT CD_DESC FROM V_CODES WHERE  CD_TYPE = 'EPA205'	AND  CD_VALUE = (SELECT DISTINCT EPL_CD_COMP FROM V_EPA_PROC_LINE WHERE  EPL_CD_EPA = :plantCd)`;
    const binds = {
      plantCd: plantCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getBU = async (plantCd: any) => {
  try {
    const sql = `SELECT DISTINCT EPL_BUSINESS_UNIT FROM V_EPA_PROC_LINE WHERE EPL_cD_EPA=:plantCd AND ROWNUM=1`;
    const binds = {
      plantCd: plantCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getCompanyCode = async (plantCd: any) => {
  try {
    const sql = `SELECT DISTINCT EPL_CD_COMP LS_COMP_CD FROM V_EPA_PROC_LINE WHERE  EPL_CD_EPA = :plantCd`;
    const binds = {
      plantCd: plantCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSCOCount = async (mandt: any, plantCd: any, scoNo: any) => {
  try {
    const sql = `SELECT COUNT(1) LN_SCO FROM V_YMT_EPA_SCO_DTLS WHERE MANDT=NVL(:mandt,'600') AND WERKS  = :plantCd And SCO_NO = :scoNo`;
    const binds = {
      mandt: mandt,
      plantCd: plantCd,
      scoNo: scoNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updateSCOStatus = async (mandt: any, plantCd: any, scoNo: any) => {
  try {
    const sql = `UPDATE V_YMT_EPA_SCO_DTLS SET REQ_STATUS = 'R', REQ_TIMESTAMP = F_NANNOW_SECOND_TELGRM(SYSDATE)
    WHERE  MANDT  = :mandt AND WERKS  = :plantCd AND SCO_NO = :scoNo`;
    const binds = {
      mandt: mandt,
      plantCd: plantCd,
      scoNo: scoNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB010 = async (scoNo: any) => {
  try {
    const sql = `CALL C1CEB010(
      SCO_ORDER=>:SCO_ORDER
      ls_flag=>:ls_flag)`;
    const binds = {
      SCO_ORDER: scoNo,
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
export const getSCOINSCount = async (businessUnit: any) => {
  try {
    const sql = `SELECT COUNT(1) LN_INS FROM V_CODES WHERE CD_TYPE = 'EPA324'	AND CD_VALUE = :businessUnit`;
    const binds = {
      businessUnit: businessUnit,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const insertSCODetails = async (
  mandt: any,
  plantCd: any,
  scoNo: any
) => {
  try {
    const sql = `INSERT INTO V_YMT_EPA_SCO_DTLS (MANDT,TIMESTAMP,WERKS,MATNR,MOTH_MATNR,SCRAP_MATNR,SCO_NO,SCO_ITEM_NO, 
      BATCH_IND, CD_QLTY, SEC1, SEC2, LENGTH, NO_PART, IDIA, PASSED_PROC, INP_WEIGHT, OUT_WEIGHT, DT_CREATION, L_SCO_NO, L_SCO_ITEM_NO, 
      STATUS,DELETE_FLAG,ERROR_CD,SCO_RATE,PI_STATUS,CREATION_TIMESTAMP,PICK_TIMESTAMP,ACK_TIMESTAMP,FINAL_TIMESATMP,
      PI_IB_MESSAGE_ID, PI_OB_MESSAGE_ID, PI_SOURCE_PGM, REQ_STATUS, REQ_TIMESTAMP)
      VALUES ( :mandt,F_NANNOW_SECOND_TELGRM(SYSDATE),:plantCd,'000000000000000000','000000000000000000',' ', :scoNo, 
      '000000',' ',' ',0,0,0,'000',0,' ',0,0,'00000000',' ',' ','Y','N','record only for SCO dowld from PI Interface',
      0,'U',' ',' ',' ',' ',' ',' ','C1CES017','R',F_NANNOW_SECOND_TELGRM(SYSDATE))`;
    const binds = {
      mandt: mandt,
      plantCd: plantCd,
      scoNo: scoNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getBaraTubesCount = async (plantCd: any) => {
  try {
    const sql = `SELECT COUNT(1) CNT FROM V_CODES WHERE  CD_TYPE = 'EPA105' AND CD_VALUE = :plantCd`;
    const binds = {
      plantCd: plantCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getLogLoadCount = async (orderNo: any) => {
  try {
    const sql = `SELECT COUNT(1) LS_COUNT FROM  SAPOMS.V_WO_ITEM@OMSEPA,SAPOMS.V_WO_MASTER@OMSEPA,SAPOMS.V_PART_ORDER@OMSEPA 
    WHERE  WOM_ID_ORDER = IWI_ID_ORDER AND  IWI_ID_ORDER = POR_ID_ORDER AND IWI_ID_ORDER_ITEM = POR_ID_ORDER_ITEM AND  WOM_LD_CLAUSE_TAG = '1' 
    AND   (IWI_MATL_NO IS NOT NULL OR IWI_MATL_NO <> ' ') AND  LPAD(IWI_ID_ORDER,10,'0') = LPAD( :orderNo ,10,'0') 
    AND   (WOM_STATUS <> 'A' OR IWI_STATUS <> 'E' OR POR_ST_PRT_ORDER NOT IN ('L','R'))`;
    const binds = {
      orderNo: orderNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB011B = async (
  plantCd: any,
  date: any,
  orderNo: any
) => {
  try {
    const sql = `CALL C1CEB011B(:p_epa,TO_DATE(:P_date,'dd-Mon-YYYY'),:p_order)`;
    const binds = {
      p_epa: plantCd,
      P_date: date,
      p_order: orderNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB011 = async (
  plantCd: any,
  date: any,
  orderNo: any
) => {
  if (date && date != "") {
  }
  try {
    const sql = `CALL C1CEB011(p_epa=>:p_epa,
      P_date=>TO_DATE(:P_date,'dd-Mon-YYYY'),
       p_order=>:p_order,
      ls_flag_out=>:ls_flag_out)`;

    const binds = {
      p_epa: plantCd,
      P_date: date,
      p_order: orderNo,
      ls_flag_out: {
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
export const getCPLCount = async (plantCd: any) => {
  try {
    const sql = `SELECT COUNT(1) count_capl FROM V_CODES WHERE CD_TYPE = 'EPA203' AND CD_VALUE = 'CAPL' AND  CD_DESC  = :plantCd`;
    const binds = {
      plantCd: plantCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const insertCustOrderDetails = async (
  plantCd: any,
  orderNo: any,
  companyCd: any
) => {
  try {
    const sql = `Insert into EPADBA.T_END_CUST_ORD_EPA_INTPI
    (ENP_TIMESTAMP, ENP_ID_ORDER, ENP_NO_ITEM, ENP_CD_EPA, ENP_CD_COMP, ENP_PI_STATUS, ENP_CREATION_TIMESTAMP, ENP_PICK_TIMESTAMP, ENP_ACK_TIMESTAMP, ENP_PI_IB_MESSAGE_ID, ENP_PI_OB_MESSAGE_ID, ENP_PI_SOURCE_PGM, ENP_DOC_TYPE, ENP_REC_CRT_USR, ENP_ERROR_CD)
    Values
    (F_NANNOW_SECOND_TELGRM(SYSDATE), :orderNo, 0, :plantCd, :companyCd, 'N', ' ', ' ', ' ', ' ', ' ', 'C1CES017', 'ORDER', USER, ' ')`;
    const binds = {
      plantCd: plantCd,
      orderNo: orderNo,
      companyCd: companyCd,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB004 = async (date: any) => {
  try {
    const sql = `CALL C1CEB004(ld_date=>TO_DATE(:ld_date,'dd-Mon-YYYY'))`;
    const binds = {
      ld_date: date,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB008 = async (data: any) => {
  try {
    const sql = `CALL C1CEB008(LS_OUT_FLAG=>:LS_OUT_FLAG)`;
    const binds = {
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
export const getProductionWB = async (batchId: any) => {
  try {
    const sql = `SELECT LOM_CD_STATUS,LOM_FL_SEND_SAP,LOM_CD_EPA,LOM_NO_MATNR FROM V_LDP_PRODN	WHERE LOM_ID_BATCH=:batchId AND LOM_cd_Status = 'WB'`;
    const binds = {
      batchId: batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getCountFGPost = async (
  batchId: any,
  plant: any,
  material: any
) => {
  try {
    const sql = `SELECT COUNT(1) count FROM v_mchb WHERE mandt='600'	AND matnr= :material AND charg= :batchId AND werks= :plant AND lgort='F001'`;
    const binds = {
      batchId: batchId,
      plant: plant,
      material: material,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getCountFGPost1 = async (
  batchId: any,
  plant: any,
  material: any
) => {
  try {
    const sql = `Select count(1) s_count1 from V_YEPA_FG_STOCK  where charg = :batchId and werks = :plant and MATNR= :material`;
    const binds = {
      batchId: batchId,
      plant: plant,
      material: material,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB022 = async (batchId: any, sendSAP: any) => {
  try {
    const sql = `CALL C1CEB022(p_batch=>:p_batch,
      ls_send_sap=>:ls_send_sap
      p_epa=>:p_epa)`;
    const binds = {
      p_batch: batchId,
      ls_send_sap: sendSAP,
      p_epa: null,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getProductionWO = async (batchId: any) => {
  try {
    const sql = `SELECT NVL(LOM_ID_ORDER,' ') SCO_ORDER,NVL(LOM_NO_ITEM,0) SCO_ITM,LOM_FL_SEND_SAP,LOM_CD_STATUS,LOM_CD_EPA,LOM_ID_FIRST_PAR,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_MS_PIECE_ACTL
    FROM V_LDP_PRODN WHERE LOM_ID_BATCH =:batchId AND LOM_CD_STATUS ='WO'`;
    const binds = {
      batchId: batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getOrderQuantity = async (
  plant: any,
  custOrder: any,
  custItem: any
) => {
  try {
    const sql = `SELECT ENC_ORD_QUANTITY,ENC_NO_MATNR FROM V_END_CUST_ORD_EPA WHERE ENC_ID_ORDER= :custOrder AND ENC_NO_ITEM= :custItem and enc_cd_epa= :plant`;
    const binds = {
      plant: plant,
      custOrder: custOrder,
      custItem: custItem,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getDespQuantity = async (
  plant: any,
  custOrder: any,
  custItem: any
) => {
  try {
    const sql = `SELECT SUM(LOM_MS_GROSS_CAL) LS_SUM FROM V_LDP_PRODN WHERE LOM_ID_ORDER_CUS= :custOrder AND LOM_ID_ORD_ITEM_CUS= :custItem And LOM_CD_EPA= :plant AND LOM_CD_STATUS IN ('WB','WC','WL')`;
    const binds = {
      plant: plant,
      custOrder: custOrder,
      custItem: custItem,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSCOMaterial = async (plant: any, sco: any, scoItem: any) => {
  try {
    const sql = `SELECT SOI_NO_END_MATNR,SOI_NO_INP_MATNR, NVL(SOI_QUANTITY,0) SCO_QTY FROM V_SCO_ORDER_ITEM WHERE SOI_ID_ORDER= :sco AND SOI_NO_ITEM= :scoItem AND SOI_CD_EPA= :plant`;
    const binds = {
      plant: plant,
      sco: sco,
      scoItem: scoItem,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getCoilMaterial = async (plant: any, coilId: any) => {
  try {
    const sql = `SELECT EIC_NO_MATNR FROM V_INPUT_COIL WHERE EIC_ID_COIL = :coilId AND EIC_CD_EPA = :plant`;
    const binds = {
      plant: plant,
      coilId: coilId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getTotalSCOQuantity = async (
  plant: any,
  sco: any,
  scoItem: any,
  batchId: any
) => {
  try {
    const sql = `Select nvl(SUM(NVL(LOM_MS_GROSS_CAL,0)),0) FROM V_LDP_PRODN WHERE LOM_ID_ORDER= :sco AND LOM_NO_ITEM=:scoItem AND    LOM_CD_STATUS LIKE 'W%' AND LOM_ID_BATCH <> :batchId  AND LOM_CD_EPA = :plant`;
    const binds = {
      plant: plant,
      sco: sco,
      scoItem: scoItem,
      batchId: batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updateProductionUpload = async (plant: any, batchId: any) => {
  try {
    const sql = `UPDATE V_LDP_PRODN SET LOM_CD_STATUS = 'WB', LOM_FL_SEND_SAP = DECODE(LOM_fl_send_sap,'Y','Z',LOM_FL_SEND_SAP), LOM_DT_PIECE_UPD=SYSDATE WHERE LOM_ID_BATCH = :batchId And LOM_cd_epa= :plant`;
    const binds = {
      plant: plant,
      batchId: batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB086B = async (coilNo: any) => {
  try {
    const sql = `CALL C1CEB086B(var_batchID_spctospc=>:var_batchID_spctospc)`;
    const binds = {
      var_batchID_spctospc: coilNo,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const CallProcC1CEB178 = async (
  plant: any,
  rmMaterial: any,
  motherBatch: any
) => {
  try {
    const sql = `CALL C1CEB178(P_PLANT=>:P_PLANT,P_BATCH=>:P_BATCH,P_MATNR=>:P_MATNR,LS_OUT_FLAG=>:LS_OUT_FLAG)`;
    const binds = {
      P_PLANT: plant,
      P_BATCH: motherBatch,
      P_MATNR: rmMaterial,
      LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
