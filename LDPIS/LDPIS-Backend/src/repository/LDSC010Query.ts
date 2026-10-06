import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmReceivedOnDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY) FROM V_YEPA_COIL_RECV
        WHERE WERKS= :plant
        AND TIMESTAMP like  TO_CHAR(SYSDATE -1,'YYYY-MM-DD')||'%'
        `;

    let binds = {
      plant: req.body.plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatGrp = async (req: any) => {
  try {
    var sql = `select distinct(ENC_PRINT_SPEC) MAT_GRP from V_END_CUST_ORD_EPA WHERE ENC_CD_EPA=:plant AND ENC_PRINT_SPEC IS NOT NULL`;

    let binds = {
      plant: req.body.plant,
    };
    //console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRmReceivedToDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY) FROM V_YEPA_COIL_RECV
        WHERE WERKS=:plant
        AND TIMESTAMP >= to_char((LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1),'YYYY-MM-DD') AND TIMESTAMP  <= TO_CHAR(SYSDATE,'YYYY-MM-DD')`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAllotmentOnDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(TMA_MS_ALLOTED) FROM V_TEMP_ALLOTMENT
        WHERE TMA_CD_EPA= :plant
        AND TRUNC(TMA_TS_ALLOTMENT) = TRUNC(SYSDATE -1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAllotmentToDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(TMA_MS_ALLOTED) FROM V_TEMP_ALLOTMENT
        WHERE TMA_CD_EPA=:plant
        AND TRUNC(TMA_TS_ALLOTMENT) >=TRUNC((LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1)) AND TRUNC(TMA_TS_ALLOTMENT) <= TRUNC(SYSDATE -1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTubeSchedulingOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(EWI_MS_PIECE_ACTL),0)/1000 SCHD_ton, COUNT(DISTINCT EWI_ID_PARENT_BATCH) SCHD_CNT  
        FROM V_WORK_INST
        WHERE EWI_CD_ePA=:plant
        AND EWI_CD_PROCESS='M'
        AND EWI_CD_STATUS <>'RJ'
        AND EWI_ID_BATCH NOT LIKE 'MR%'
        AND TRUNC(EWI_TS_CREATION) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTubeSchedulingToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(EWI_MS_PIECE_ACTL),0)/1000 SCHD_ton, COUNT(DISTINCT EWI_ID_PARENT_BATCH) SCHD_CNT  
        FROM V_WORK_INST
        WHERE EWI_CD_ePA=:plant
        AND EWI_CD_PROCESS='M'
        AND EWI_CD_STATUS <>'RJ'
        AND EWI_ID_BATCH NOT LIKE 'MR%'
        AND TRUNC(EWI_TS_CREATION) >= TRUNC(LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EWI_TS_CREATION) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTubeProductionOnDate = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1) 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='M'
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)
              --AND LOM_CD_QLTY_ACTL <>'SCRP'
              AND LOM_CD_EPA=:plant`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTubeProductionToDate = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1) 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='M'
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)
              --AND LOM_CD_QLTY_ACTL <>'SCRP'
              AND LOM_CD_EPA=:plant`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPackingConfirmationOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) FG_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='W' 
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPackingConfirmationToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) FG_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='W' 
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// =============

export const getInventorySumRm = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0) RM_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='RM STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getInventorySumWip = async (req: any) => {
  try {
    var sql = `SELECT ROUND(NVL(SUM(DECODE(LOM_UOM,'KG',LOM_MS_GROSS_CAL/1000,LOM_MS_GROSS_CAL)),0),3) WIP_TON 
        FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
            SELECT CD_DESC FROM V_CODES
            WHERE CD_TYPE='TB040'
            AND CD_DESC1 NOT in ('RM STOCK','FG STOCK')
            )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getInventorySumPendingUd = async (req: any) => {
  try {
    var sql = `SELECT ROUND(NVL(SUM(DECODE(LOM_UOM,'KG',LOM_MS_GROSS_CAL/1000,LOM_MS_GROSS_CAL)),0),3) UD_TON 
        FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        --AND LOM_CD_STATUS ='MQ'
        AND LOM_CD_STATUS IN (
            SELECT CD_DESC FROM V_CODES
            WHERE CD_TYPE='TB040'
            AND CD_DESC1 in ('FINAL UD', 'UD STOCK')
            )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getInventorySumFG = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(DECODE(LOM_UOM,'KG',LOM_MS_GROSS_CAL/1000,LOM_MS_GROSS_CAL)),0) FG_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='FG STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryRm = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0) RM_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='RM STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryPendingUd = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 RM_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS ='MQ'`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryAnn = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 ANN_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='ANN STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryColdDraw = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 CDB_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='CDB STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryStp = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 STP_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='STP STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryCtl = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 CTL_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
            SELECT CD_DESC FROM V_CODES
            WHERE CD_TYPE='TB040'
            AND CD_DESC1='CTL STOCK'
            )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryHydra = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 HYD_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='HYD STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryEct = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 ECT_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='ECT STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryFG = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 FG_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='FG STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryFinalUD = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 FG_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='FINAL UD'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStageWiseInventoryPacking = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(LOM_MS_GROSS_CAL),0)/1000 FG_TON FROM V_LDP_PRODN
        WHERE LOM_CD_EPA=:plant
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_QLTY_ACTL <>'SCRP'
        AND LOM_CD_STATUS IN (
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB040'
        AND CD_DESC1='PKG STOCK'
        )`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// ======
export const getRmgrOnDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY) FROM V_YEPA_COIL_RECV
        WHERE WERKS=:plant
        AND TIMESTAMP like  TO_CHAR(SYSDATE -1,'YYYY-MM-DD')||'%'`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRmgrToDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY) FROM V_YEPA_COIL_RECV
        WHERE WERKS=:plant
        AND TIMESTAMP >= to_char((LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1),'YYYY-MM-DD') 
        AND TIMESTAMP  < TO_CHAR(SYSDATE,'YYYY-MM-DD')`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSfgProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
      AND EPR_CD_PROCESS ='M'
      AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSfgProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='M'
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAnnProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ANN')
            AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAnnProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ANN')
            AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStpProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) STP_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='STP')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStpProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) STP_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='STP')
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getColdDProdOnDt = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CDB_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CDB')
             AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getColdDProdToDt = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CDB_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CDB')
             AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCltProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CTL_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CTL')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCltProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CTL_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CTL')
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHydraProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) HYDRA_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='HYD')
          AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHydraProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) HYDRA_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='HYD')
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getEtcProdOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ECT_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ECT')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getEtcProdToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ECT_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ECT')
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFGOnDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) FG_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='W' 
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFGToDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) FG_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='W' 
              AND TRUNC(EPR_DT_PRODN_TATA) >=TRUNC (LAST_DAY (ADD_MONTHS(SYSDATE,-1))+1) and TRUNC(EPR_DT_PRODN_TATA) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//========
export const getRmgrCurrDate = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY) FROM V_YEPA_COIL_RECV
        WHERE WERKS=:plant
        AND TIMESTAMP like  TO_CHAR(SYSDATE,'YYYY-MM-DD')||'%'`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSfgProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
      AND EPR_CD_PROCESS ='M'
      AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAnnProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ANN_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ANN')
            AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStpProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) STP_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='STP')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getColdDProdCurrDt = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CDB_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CDB')
             AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCltProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) CTL_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='CTL')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getHydraProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) HYDRA_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='HYD')
          AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getEtcProdCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) ECT_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS IN (SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB033'
        AND CD_DESC1='ECT')
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFGCurrDate = async (req: any) => {
  try {
    var sql = `SELECT NVL( SUM(NVL(DECODE(LOM_UOM,'KG',ROUND((EPR_MS_GROSS_ACTL/1000),3),EPR_MS_GROSS_ACTL),0)),0 ) FG_Wt 
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE
              epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_status <> 'VF'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS ='W' 
              AND TRUNC(EPR_DT_PRODN_TATA) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDaysList = async (req: any) => {
  try {
    var sql = `SELECT (SELECT
        LISTAGG(
           ''''||to_char(((to_date(:prodFrmDt,'DD-MM-YYYY')-1)+level),'DD-Mon-YYYY')||''''
        ,',') WITHIN GROUP (ORDER BY 1) as days
        FROM
        dual
        CONNECT BY LEVEL <= (to_date(:prodToDt,'DD-MM-YYYY') - to_date(:prodFrmDt,'DD-MM-YYYY')+1)
        ) days, (SELECT
        LISTAGG(
            '"'''||to_char(((to_date(:prodFrmDt,'DD-MM-YYYY')-1)+level),'DD-Mon-YYYY')||'''" AS'||' "'||to_char(((to_date(:prodFrmDt,'DD-MM-YYYY')-1)+level),'DD-Mon-YYYY')||'"'
        ,',') WITHIN GROUP (ORDER BY 1) as all_columns
        FROM
        dual
        CONNECT BY LEVEL <= (to_date(:prodToDt,'DD-MM-YYYY') - to_date(:prodFrmDt,'DD-MM-YYYY')+1)) all_columns
        ,
        (SELECT
        LISTAGG(
           'NVL("'''||to_char(((to_date(:prodFrmDt,'DD-MM-YYYY')-1)+level),'DD-Mon-YYYY')||'''", 0)'
        ,'+') WITHIN GROUP (ORDER BY 1) as TOTAL
        FROM
        dual
        CONNECT BY LEVEL <= (to_date(:prodToDt,'DD-MM-YYYY') - to_date(:prodFrmDt,'DD-MM-YYYY')+1)) TOTAL
        FROM DUAL
        `;
    let binds = {
      prodFrmDt: req.body.fromDt,
      prodToDt: req.body.toDt,
    };

    //console.log("===>", sql, binds);

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGRReportData = async (
  Days: any,
  All_Column: any,
  Total: any,
  req: any
) => {
  try {
    var p1 = Days;
    let binds = {
      plant: req.body.plant,
      prodFrmDt: req.body.fromDt,
      prodToDt: req.body.toDt,
    };

    var sql = `SELECT sr_no,decode(STAGE,'CDB','COLD DRAW','HYD','HYDRA',STAGE) STAGE,
             ${All_Column}, ${Total} as Total FROM (
            SELECT
                tab1.sr_no,
                tab1.column_value   stage,
                tab2.dt,
                tab2.wt
            FROM
                (
                    SELECT DISTINCT
                        ROW_NUMBER() OVER(
                            ORDER BY
                                1 ASC
                        ) AS sr_no,
                        column_value
                    FROM
                        TABLE ( sys.odcivarchar2list('RM','SFG','ANN','STP','CDB','CTL','HYD','ECT','FG') )
                    ORDER BY
                        sr_no
                ) tab1
                LEFT OUTER JOIN (
                    SELECT
                        cd_desc1   stage,
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY') dt,
                        nvl(SUM(nvl(DECODE(LOM_uom,'KG',round( (epr_ms_gross_actl / 1000),3),epr_ms_gross_actl),0) ),0) wt
                    FROM
                        v_epa_line_prodn a,
                        v_work_inst b,
                        v_LDP_PRODN c,
                        v_codes d,
                        v_end_cust_ord_epa e
                    WHERE
                        epr_id_batch = LOM_id_batch
                        AND epr_cd_epa = LOM_cd_epa
                        AND LOM_cd_epa = ewi_cd_epa
                        AND c.LOM_cd_epa = e.enc_cd_epa 
                        AND c.LOM_id_order_cus = e.enc_id_order 
                        AND c.LOM_id_ord_item_cus = e.enc_no_item 
                        AND LOM_id_batch = ewi_id_batch
                        AND epr_cd_epa = ewi_cd_epa
                        AND epr_id_batch = ewi_id_batch
                        AND epr_id_wrk_inst = ewi_id_wrk_inst
                        AND ewi_cd_status <> 'RJ'
                        AND LOM_cd_status <> 'VF'
                        AND LOM_cd_epa =:plant
                        AND epr_cd_process = cd_desc
                        AND cd_type = 'TB033'
                        AND trunc(epr_dt_prodn_tata) BETWEEN TO_DATE(:prodfrmdt,'dd-mm-yyyy') AND TO_DATE(:prodtodt,'dd-mm-yyyy')`;
    if (req.body.matGrp && req.body.matGrp != "") {
      sql += " AND  ENC_PRINT_SPEC = :matGRp ";
      Object.assign(binds, { matGrp: req.body.matGrp });
    }
    sql += ` GROUP BY
                        cd_desc1,
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY')
                    UNION
                    SELECT
                        'FG' stage,
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY') dt,
                        nvl(SUM(nvl(DECODE(LOM_uom,'KG',round( (epr_ms_gross_actl / 1000),3),epr_ms_gross_actl),0) ),0) wt
                    FROM
                        v_epa_line_prodn a,
                        v_work_inst b,
                        v_LDP_PRODN c,
                        v_end_cust_ord_epa d
                    WHERE
                        epr_id_batch = LOM_id_batch
                        AND epr_cd_epa = LOM_cd_epa
                        AND LOM_cd_epa = ewi_cd_epa
                        AND LOM_id_batch = ewi_id_batch
                        AND epr_cd_epa = ewi_cd_epa
                        AND epr_id_batch = ewi_id_batch
                        AND epr_id_wrk_inst = ewi_id_wrk_inst
                        AND c.LOM_cd_epa = d.enc_cd_epa 
                        AND c.LOM_id_order_cus = d.enc_id_order 
                        AND c.LOM_id_ord_item_cus = d.enc_no_item 
                        AND ewi_cd_status <> 'RJ'
                        AND LOM_cd_status <> 'VF'
                        AND LOM_cd_epa =:plant
                        AND epr_cd_process = 'W'
                        AND trunc(epr_dt_prodn_tata) BETWEEN TO_DATE(:prodfrmdt,'dd-mm-yyyy') AND TO_DATE(:prodtodt,'dd-mm-yyyy')`;
    if (req.body.matGrp && req.body.matGrp != "") {
      sql += " AND  ENC_PRINT_SPEC = :matGRp ";
      Object.assign(binds, { matGrp: req.body.matGrp });
    }
    sql += `GROUP BY
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY')
                    UNION
                    SELECT
                        'SFG' stage,
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY') dt,
                        nvl(SUM(nvl(DECODE(LOM_uom,'KG',round( (epr_ms_gross_actl / 1000),3),epr_ms_gross_actl),0) ),0) wt
                    FROM
                        v_epa_line_prodn a,
                        v_work_inst b,
                        v_LDP_PRODN c,
                        v_end_cust_ord_epa d
                        WHERE
                            epr_id_batch = LOM_id_batch
                            AND epr_cd_epa = LOM_cd_epa
                            AND LOM_cd_epa = ewi_cd_epa
                            AND LOM_id_batch = ewi_id_batch
                            AND epr_cd_epa = ewi_cd_epa
                            AND epr_id_batch = ewi_id_batch
                            AND epr_id_wrk_inst = ewi_id_wrk_inst
                            AND c.LOM_cd_epa = d.enc_cd_epa 
                            AND c.LOM_id_order_cus = d.enc_id_order 
                            AND c.LOM_id_ord_item_cus = d.enc_no_item 
                        AND ewi_cd_status <> 'RJ'
                        AND LOM_cd_status <> 'VF'
                        AND LOM_cd_epa =:plant
                        AND epr_cd_process = 'M'
                        AND trunc(epr_dt_prodn_tata) BETWEEN TO_DATE(:prodfrmdt,'dd-mm-yyyy') AND TO_DATE(:prodtodt,'dd-mm-yyyy')`;
    if (req.body.matGrp && req.body.matGrp != "") {
      sql += " AND  ENC_PRINT_SPEC = :matGRp ";
      Object.assign(binds, { matGrp: req.body.matGrp });
    }
    sql += `
                    GROUP BY
                        TO_CHAR(trunc(epr_dt_prodn_tata),'DD-Mon-YYYY')
                    UNION
                    SELECT
                         'RM' stage,TO_CHAR(TO_DATE(substr(timestamp,1,10),'YYYY-MM-DD'),'DD-Mon-YYYY') dt,SUM(rcpt_qty) wt
                     FROM
                         v_yepa_coil_recv
                     WHERE
                         werks =:plant
                         AND TO_DATE(substr(timestamp,1,10),'YYYY-MM-DD') BETWEEN TO_DATE(:prodfrmdt,'DD-MM-YYYY') 
                         AND TO_DATE(:prodtodt ,'DD-MM-YYYY')
                        group by TO_CHAR(TO_DATE(substr(timestamp,1,10),'YYYY-MM-DD'),'DD-Mon-YYYY')
                ) tab2 ON tab1.column_value = tab2.stage
        ) PIVOT (
            SUM ( wt )
            FOR dt
            IN (${p1})
        )tbl order by 1`;
    //console.log("+++==>", sql,binds,req.body.matGrp);

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
