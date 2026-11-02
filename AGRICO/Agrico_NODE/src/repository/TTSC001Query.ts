import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getProdInqData = async (plant: any, value: any) => {
  try {
    var sql = '';

    //      sql=`select EPR_ID_BATCH,
    //      EOM_ID_PAR_COIL_NO,
    //      EOM_ID_FIRST_PAR,
    //      EOM_CD_CURR_PROC,
    //      EOM_CD_NEXT_PROC,
    //      EOM_CD_PREV_PROC,
    //      EOM_CD_PROD,
    //      EOM_PALLET_CODE,
    //      EOM_CD_QLTY_ACTL,
    //      EOM_CD_STATUS,
    //      EPR_NO_TDC,
    //      EPR_SEC1,
    //      EPR_SEC2,
    //      EPR_LENGTH,
    //      EPR_NO_PIECES,
    //      EPR_MS_PIECE_ACTL,
    //      EPR_MS_GROSS_CAL,
    //      EPR_MS_GROSS_ACTL,
    //      EOM_MS_GROSS_ACTL,
    //      case eom_cd_curr_proc
    //        when 'W' THEN
    //         EPR_MS_PIECE_ACTL
    //        ELSE
    //         EPR_MS_INPUT
    //      end MS_INPUT,
    //      (case eom_cd_curr_proc
    //        when 'W' THEN
    //         EPR_MS_PIECE_ACTL
    //        ELSE
    //         EPR_MS_INPUT
    //      end - nvl(EPR_MS_PIECE_ACTL, 0)) MS_SCRAP,
    //      EOM_INV_LOSS,
    //      EOM_ID_ORDER_CUS,
    //      EOM_ID_ORD_ITEM_CUS,
    //      (SELECT ENC_ORDER_TYPE
    //         FROM V_END_CUST_ORD_EPA
    //        WHERE ENC_CD_EPA = EOM_CD_EPA
    //          AND ENC_ID_ORDER = EOM_ID_ORDER_CUS
    //          AND ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS) ORD_TYPE,
    //      case eom_cd_curr_proc
    //        when 'W' THEN
    //         100
    //        ELSE
    //         EPR_YIELD_PERC
    //      END Yield_perc,
    //      EOM_ID_ORDER,
    //      EOM_NO_ITEM,
    //      (SELECT ENC_CUST_NAME
    //         FROM V_END_CUST_ORD_EPA
    //        WHERE ENC_CD_EPA = EOM_CD_EPA
    //          AND ENC_ID_ORDER = EOM_ID_ORDER_CUS
    //          AND ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS) CUSTOMER,
    //      (SELECT ENC_MARK_CUST_NAME
    //         FROM V_END_CUST_ORD_EPA
    //        WHERE ENC_CD_EPA = EOM_CD_EPA
    //          AND ENC_ID_ORDER = EOM_ID_ORDER_CUS
    //          AND ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS) EOM_MK_CUSTOMER,
    //      (SELECT ENC_NO_TRACKING
    //         FROM V_END_CUST_ORD_EPA
    //        WHERE ENC_CD_EPA = EOM_CD_EPA
    //          And ENC_ID_ORDER = EOM_ID_ORDER_CUS
    //          And ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS) TRACK_NO,
    //      EPR_DT_PRODN_TATA,
    //      EPR_CD_SHIFT,
    //      (SELECT distinct EIC_CD_QLTY_ACTL
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) M_BATCHQLTY,
    //      (SELECT distinct EIC_TDC_ACTL
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) M_BATCH_TDC,
    //      (SELECT distinct EIC_SEC1
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) M_BATCH_THICK,
    //      (SELECT distinct EIC_SEC2
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) M_BATCH_WIDTH,
    //      (SELECT distinct EIC_MS_GROSS_CAL
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) M_BATCH_WEIGHT,
    //      (SELECT distinct EIC_MK_CUSTOMER
    //         from v_input_coil
    //        where eic_cd_epa = epr_cd_epa
    //          and eic_id_coil = EOM_ID_FIRST_PAR) INTENDENT_CUST,
    //      EPR_NO_CAST,
    //      EOM_PASSED_PROC,
    //      (SELECT CD_DESC
    //         FROM V_CODES
    //        WHERE CD_VALUE = EOM_cD_STATUS
    //          AND CD_TYPE = 'E0001') STATUS_DESC,
    //      (SELECT ENC_SHIP_TO_PRTY_DESC
    //         FROM V_END_CUST_ORD_EPA
    //        WHERE ENC_CD_EPA = EOM_CD_EPA
    //          AND ENC_ID_ORDER = EOM_ID_ORDER_CUS
    //          AND ENC_NO_ITEM = EOM_ID_ORD_ITEM_CUS) SHIP_TO_PARTY,
    //      EPR_CD_EPA,
    //      eom_id_op_decsn,
    //      EOM_NO_MATNR,
    //      (SELECT DISTINCT NVL(SOI_END_PROD_DESC, ' ')
    //         FROM V_SCO_ORDER_ITEM
    //        WHERE SOI_CD_EPA = EPR_CD_EPA
    //          AND SOI_ID_ORDER = EOM_ID_ORDER
    //          AND SOI_NO_ITEM = EOM_NO_ITEM) MATR_DESC
    // from v_epa_line_prodn, v_epa_prodn
    // where EPR_ID_BATCH = EOM_ID_BATCH
    //  And EOM_CD_STATUS <> 'VF'
    //  And EPR_CD_EPA = :Plant
    //  AND EOM_CD_EPA = EPR_CD_EPA
    //  AND EOM_ID_BATCH = EPR_ID_BATCH
    //  And EOM_CD_STATUS <> 'VF'`;



    let binds = {
      plant: plant,

    };
    if (value == 0 && (plant && plant != ''))
      sql += `select EPL_CD_EPA,EPL_EPA_DESC,EPL_CD_PROCESS,EPL_PROC_LINE_DESC,EPL_ID_PRINTER,EPL_NO_PROC_SEQ,EPL_ADDRESS,EPL_SAP_INTERFACE_IND, EPL_REM1, EPL_REM2, EPL_REM3, EPL_CD_CUST, EPL_URL, EPL_SERVER, EPL_ACTIVITY_TIME, EPL_ACTIVITY_FLAG, EPL_CONSP_FLAG, EPL_BUSINESS_UNIT, EPL_PLNG_FLAG, EPL_CD_COMP, EPL_ACTIVITY_NM, EPL_THK_TOL_FLAG, EPL_SR_COMP_FLAG, EPL_ACTIVE_PLANT_FL, EPL_BUSI_ROLE, EPL_STOR_LOC, EPL_PRODUCTION_TYPE from V_EPA_PROC_LINE where EPL_CD_EPA=:plant order by EPL_CD_EPA,EPL_NO_PROC_SEQ`;
    if (value == 1 && (plant && plant != ''))
      sql += `SELECT
      pph_no_proc_path,
      pph_cd_sub_path,
      pph_no_of_pass,
      pph_cd_proc_path,
      pph_desc,
      pph_cd_epa,
      pph_product
  FROM
      v_epa_proc_path
  WHERE
      pph_cd_epa = :plant
  ORDER BY
      pph_cd_epa`;
    if (value == 2 && (plant && plant != ''))
      sql += `select PLM_CD_EPA,PLM_CD_PROCESS,PLM_WCNT_CODE,PLM_WCNT_DESC,PLM_ACTIVE_STATUS,PLM_CRT_DT,PLM_CRT_BY,PLM_WCNT_SCODE from V_PROC_LINE_MACHINE where PLM_CD_EPA=:plant order by PLM_CD_EPA,PLM_CD_PROCESS,PLM_WCNT_CODE`;



    return await query.executeQuery(sql, binds);
    //   return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};