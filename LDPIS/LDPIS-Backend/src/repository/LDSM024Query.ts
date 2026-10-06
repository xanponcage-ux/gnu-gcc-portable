import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getInventoryData = async (
  DespFromDate: any,
  DespToDate: any,
  ProdFromDate: any,
  ProdToDate: any,
  batch: any,
  customer: any,
  item: any,
  materialNo: any,
  mbatch: any,
  order: any,
  orderType: any,
  plant: any,
  process: any,
  status: any,
  thikFrm: any,
  thikTo: any,
  widthFrm: any,
  widthTo: any,
  stockType: any
) => {
  try {
    console.log({
      p_plant: plant,
      P_PROC_LINE: process,
      P_DATE_FROM: ProdFromDate,
      P_DATE_TO: ProdToDate
    })
    await query.executeQuery(`call LDPDBA.P_INS_YIELD_DATA(
          P_PLANT => :p_plant,
          P_PROC_LINE => :P_PROC_LINE,
          P_DATE_FROM => :P_DATE_FROM ,
          P_DATE_TO => :P_DATE_TO
        )`,
      {
        p_plant: plant,
        P_PROC_LINE: process,
        P_DATE_FROM: ProdFromDate,
        P_DATE_TO: ProdToDate
      })
    var sql = ` select TCY_CD_PLANT,
TCY_CD_PROC,
TCY_CUST_NAME,
TCY_DOWNGRADE,
TCY_ETO,
TCY_ETO_TILLDT,
TCY_GRADE,
TCY_HOLD,
TCY_ITEM_NO,
TCY_NOT_OK,
TCY_NO_MATNR,
TCY_ORDER_NO,
TCY_ORD_QNTY,
TCY_PIPE_OD_10,
TCY_PRIME,
TCY_PRIME_TILLDT,
TCY_PROG_ID,
TCY_REP_DT_FROM,
TCY_REP_DT_TO,
TCY_RM_ISSUE,
TCY_SCRAP,
TCY_SPEC,
TCY_THICKNESS,
TCY_WIP,
TCY_YEILD from V_COIL_YIELD
where TCY_CD_PLANT = '${plant}'
and TCY_CD_PROC = '${process}'
and TCY_REP_DT_FROM between '${ProdFromDate}' and '${ProdToDate}'
and TCY_REP_DT_TO between '${ProdFromDate}' and '${ProdToDate}'`;

    // console.log("binds: ", binds);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergedInv = async (
  fromDt: any,
  mergedType: any,
  plant: any,
  toDt: any,
  batchMerg: any,
  mergedBatchMerg: any
) => {
  try {
    var sql = `SELECT ERD_CD_EPA PLANT, ERD_ID_BATCH SLIT_COIL,ERD_BATCH_QTY SLIT_COIL_QTY, ERD_ID_NEW_BATCH MERGED_BATCH , ERD_NEW_BATCH_QTY MERGED_BATCH_QTY
        ,ERD_NO_MATNR FG_MATERIAL_NO , (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.ERD_NO_MATNR AND ROWNUM=1)FG_MATERIAL_DESC
        ,TO_CHAR(ERD_REC_CRT_DT) MERGE_DT ,ERD_REC_CRT_UID MERGED_BY_USER , decode(ERD_MOV_IND , 'B','COIL','F','FG','S','SFG','') MERGED_TYPE
        FROM V_EPA_RANDOM_DTLS A
        WHERE ERD_CD_EPA=:plant
        --AND ERD_REC_STATUS = NVL('A', ERD_REC_STATUS)
        `;
    const binds: any = {
      plant: plant,
    };

    if (mergedType && mergedType != "") {
      if (mergedType == "ALL") {
        sql += ` AND ERD_MOV_IND IN ('B' , 'F' , 'S')`;
      } else {
        sql += ` AND ERD_MOV_IND = NVL(:mergedType, ERD_REC_STATUS)`;
        binds["mergedType"] = mergedType;
      }
    } else {
      sql += ` AND ERD_MOV_IND = NVL('B', ERD_REC_STATUS)`;
    }

    if (batchMerg && batchMerg != "") {
      sql += ` AND ERD_ID_BATCH = :batchMerg`;
      binds["batchMerg"] = batchMerg;
    }

    if (mergedBatchMerg && mergedBatchMerg != "") {
      sql += ` AND ERD_ID_NEW_BATCH = :mergedBatchMerg`;
      binds["mergedBatchMerg"] = mergedBatchMerg;
    }

    if (fromDt && toDt && fromDt != "" && toDt != "") {
      sql += ` AND trunc(ERD_REC_CRT_DT) BETWEEN :fromDt AND :toDt `;
      binds["fromDt"] = fromDt;
      binds["toDt"] = toDt;
    }

    sql += ` ORDER BY ERD_ID_NEW_BATCH , ERD_ID_BATCH , ERD_MOV_IND`;

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

export const getReversedBatchInfo = async (
  plant: any,
  batchId: any,
  mergeBatch: any
) => {
  try {
    const sql = `SELECT
    LOM_timestamp         reversal_dt,
    LOM_user_rev          reversal_done_by,
    LOM_id_batch          batch_id,
    LOM_ms_gross_cal      net_wt,
    LOM_uom               net_wt_uom,
    LOM_sec1              batch_thk,
    LOM_sec2              batch_odia,
    LOM_length            batch_length,
    LOM_tdc_actl          batch_grade,
    LOM_cd_status         batch_status,
    LOM_id_par_coil_no    parent_batch,
    LOM_id_first_par      first_parent,
    LOM_merge_batch       merge_bt,
    LOM_no_cast           cast_no,
    LOM_idia              idia,
    LOM_id_order_cus      order1,
    LOM_id_ord_item_cus   item,
    LOM_cd_epa            plant,
    LOM_no_matnr          material_no,
    LOM_oper_id           production_done_by_usr
FROM
    v_LDP_PRODN_reverse
WHERE
    LOM_cd_epa = :plant
    AND LOM_id_batch = nvl(:batchId, LOM_id_batch)
    AND LOM_id_first_par = nvl(:motherBatch, LOM_id_first_par)
    Order by LOM_id_first_par, LOM_id_batch`;

    const binds = {
      plant: plant,
      batchId: batchId,
      motherBatch: mergeBatch,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
