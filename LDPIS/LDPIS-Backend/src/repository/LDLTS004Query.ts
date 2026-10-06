import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getOrderid = async (data: any) => {
  try {
    console.log("data1: ", data);
    let sql = `SELECT distinct ENC_ID_ORDER FROM V_END_CUST_ORD_EPA
    WHERE ENC_CD_EPA='${data?.plant}'
    AND ENC_ST_ORDER='A'
    AND ENC_SLIT_PLAN='TUBE'
    UNION 
    SELECT DISTINCT TPC_ORDER_ID FROM V_PROCESS_SHEET_EC`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getItemNo = async (data: any) => {
  try {
    console.log("data2: ", data);
    let sql = `select enc_no_item from 
      v_end_cust_ord_epa where enc_id_order = '${data?.orderId}'
      UNION 
      SELECT TO_NUMBER(TPC_ORDER_ITEM) FROM V_PROCESS_SHEET_EC 
      WHERE  TPC_ORDER_ID  = '${data?.orderId}'`;

    console.log("sql:: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailLD = async (data: any) => {
  try {
    let sql = `SELECT TCP_LD_MSHORT_GRRATIO,
    TCP_LD_PH_CON_MIN,
    TCP_LD_PH_CON_MAX,
    TCP_LD_TURBID_MAX,
    TCP_LD_ALK_MIN,
    TCP_LD_ALK_MAX,
    TCP_LD_COMP_AIR,
    TCP_LD_CONDUCT_MAX,
    TCP_LD_SULFATE_MAX,
    TCP_LD_PH_MIN,
    TCP_LD_PH_MAX,
    TCP_LD_CHROM_SOL_MIN,
    TCP_LD_CHROM_SOL_MAX,
    TCP_LD_CLORID_SOL_MIN,
    TCP_LD_CLORID_SOL_MAX,
    TCP_LD_HARDNESS,
    TCP_LD_CLORID_MAX,
    TCP_LD_DEGREE_CURE_MIN,
    TCP_LD_DEGREE_CURE_MAX,
    TCP_LD_DCURE_REFSTD,
    TCP_LD_TAG_MIN,
    TCP_LD_TAG_MAX,
    TCP_LD_FLEXI_FBE,
    TCP_LD_FLEX_REFSTD,
    TCP_LD_24H_ADHETEST_MIN,
    TCP_LD_24H_ADHETEST_MAX,
    TCP_LD_ADHETEST_UNIT,
    TCP_LD_24H_REFSTD,
    TCP_LD_DH_MIN,
    TCP_LD_DH_MAX,
    TCP_LD_REF_STD,
    TCP_LD_TEST_DUR,
    TCP_LD_OPR_TEMP,
    TCP_LD_INTERPORO_MIN,
    TCP_LD_INTERPORO_REFSTD,
    TCP_LD_CS_MIN,
    TCP_LD_CS_REFSTD,
    TCP_LD_INDEN_HOT_MAX,
    TCP_LD_INDEN_ROM_MAX,
    TCP_LD_IND_REFSTD,
    TCP_LD_ELONG_TEST_MIN,
    TCP_LD_HOTWATER_MIN,
    TCP_LD_48H_REFSTD,
    TCP_LD_ELON_REFSTD,
    TCP_LD_PRDSTABL_MIN,
    TCP_LD_ELONG_REFSTD,
    TCP_LD_TENSILE_REFSTD,
    TCP_LD_FLEX_3LPE,
    TCP_LD_3LPE_REFSTD,
    TCP_LD_HARDH_REFSTD,
    TCP_LD_CD_48H_MIN,
    TCP_LD_CD_48H_MAX,
    TCP_LD_CD_48H_REFSTD,
    TCP_LD_CD_48H_TESTDUR,
    TCP_LD_CD_48H_OPR_TEMP,
    TCP_LD_CD_28D_MIN,
    TCP_LD_CD_28D_MAX,
    TCP_LD_CD_28D_REFSTD,
    TCP_LD_CD_28D_TESTDUR,
    TCP_LD_CD_28D_OPRTEMP,
    TCP_LD_CD_28DN_MIN,
    TCP_LD_CD_28DN_MAX,
    TCP_LD_CD_28DN_REFSTD,
    TCP_LD_28DN_TESTDUR,
    TCP_LD_28DN_OPRTEMP    
    FROM V_PROCESS_SHEET_EC WHERE
    TPC_ORDER_ID = '${data?.orderId}'
    AND LTRIM(TPC_ORDER_ITEM) = ${data?.itemNo}`; //and ltrim(tps_order_item)=1

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailID = async (data: any) => {
  try {
    let sql = `SELECT TCP_ID_HOLI_DETEC_MIN
    ,TCP_ID_HOLI_DETEC_MAX
    ,TCP_ID_COAT_THKGAUGE_MIN
    ,TCP_ID_COAT_THKGAUGE_MAX
    ,TCP_ID_ROUGH_TEST_MIN
    ,TCP_ID_ROUGH_TEST_MAX
    ,TCP_ID_DIGITEMP_GAUG_MIN
    ,TCP_ID_DIGITEMP_GAUG_MAX,
    TCP_FD_HOLIDAY_FBE_TEST,
    TCP_FD_ADHESION_VCUT_TEST,
    TCP_FD_3LPE_HOLIDAY_MIN,
    TCP_FD_3LPE_HOLIDAY_MAX,
    TCP_FD_PEEL_COLD_TEST,
    TCP_FD_PEEL_TEMP_COLD,
    TCP_FD_PEEL_TEST_HOT,
    TCP_FD_PEEL_TEMP_HOT,
    TCP_FD_IMPACT_TEST,
    TCP_FD_ENTRAP_TEST
    FROM V_PROCESS_SHEET_EC WHERE
    TPC_ORDER_ID = '${data?.orderId}'
    AND LTRIM(TPC_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailMD = async (data: any) => {
  try {
    let sql = `SELECT TCP_CP1_VERIF_BPIPE
    TCP_CP1_VISUAL_INSP,
    TCP_CP1_INSP_ABRAS,
    TCP_CP1_REL_HUMID,
    TCP_CP1_HTEMP_MIN,
    TCP_CP1_HTEMP_MAX,
    TCP_CP1_SALT_TEST,
    TCP_CP1_ABRA_HUMID,
    TCP_CP1_DO_CLEAN,
    TCP_CP1_SRUF_MIN,
    TCP_CP1_SRUF_MAX,
    TCP_CP1_AP_30X,
    TCP_CP1_DG_DUST_MAX,
    TCP_CP1_ID_CLEAN_BPIPE,
    TCP_CP1_VISUAL_CHK,
    TCP_CP1_SALT_CONT,
    TCP_CP1_PH_CONCENT,
    TCP_CP1_PH_SUR_PIPE,
    TCP_CP1_PRE_HEAT_MIN,
    TCP_CP1_PRE_HEAT_MAX,
    TCP_CP1_DWEL_TIME,
    TCP_CP1_DIHIGH_PRESU_MIN,
    TCP_CP1_DIHIGH_PRESU_MAX,
    TCP_CP1_VISUAL_APPEA,
    TCP_CP1_HEATAIRTEMP_MIN,
    TCP_CP1_HEATAIRTEMP_MAX,
    TCP_CP1_DIWFLOW_MIN,
    TCP_CP1_DIWFLOW_MAX,
    TCP_CP1_CHPHEATEMP_MIN,
    TCP_CP1_CHPHEATEMP_MAX,
    TCP_CP1_CHSOL_TEMP,
    TCP_CP1_CH_APPLI,
    TCP_CP1_CO_APPLI,
    TCP_CP1_PH_FBEAPP_MIN,
    TCP_CP1_PH_FBEAPP_MAX,
    TCP_CP1_ADHEFLIM_MIN,
    TCP_CP1_ADHEFLIM_MAX,
    TCP_CP1_PEFFLIM_TEMP_MIN,
    TCP_CP1_PEFFLIM_TEMP_MAX,
    TCP_CP1_QUENTEMP_MIN,
    TCP_CP1_QUENTEMP_MAX,
    TCP_CP1_DEWPOINT_MIN    
    FROM V_PROCESS_SHEET_EC WHERE
    TPC_ORDER_ID = '${data?.orderId}'
    AND LTRIM(TPC_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailSD = async (data: any) => {
  try {
    let sql = `SELECT TPC_SD_PROC_SHEET TPS_SD_PROC_SHEET, TCP_SD_CUST_CD TPS_SD_CUST_CD,
    TCP_SD_POREF_NO TPS_SD_REF_NO, '' TPS_SD_TEST_PRESSURE,
     ''  TPS_SD_DESTN,TCP_SD_TECH_SPEC TPS_SD_SPEC_GRD,
     TPC_SD_QAP_NO1 TPS_SD_QAP_NO,
       ENC_ORD_QUANTITY QUANTITY, 
       TO_CHAR(ENC_DT_ORD_CREATE, 'DD-MM-YYYY') CREATE_ON,
       ENC_LENGTH_MAX LEN, ENC_SEC1_MAX THICK, ENC_ODIA ODIA,
       ENC_CD_GRADE GRADE, ENC_MARK_CUST CUST_CD, ENC_MARK_CUST_NAME CUST_DESC,
       ENC_MK_SPEC_COMPLETE SPEC,TCP_SD_IC_TYPE,TCP_PO_ITEM_NO,
       TCP_SD_INSP_AGEN
       FROM V_PROCESS_SHEET_EC A, V_END_CUST_ORD_EPA B
       WHERE A.TPC_ORDER_ID = B.ENC_ID_ORDER(+) AND A.TPC_ORDER_ITEM = B.ENC_NO_ITEM(+)
       AND TPC_ORDER_ID = '${data?.orderId}'
       AND LTRIM(TPC_ORDER_ITEM) = ${data?.itemNo}`;

    // if (data?.orderId) {
    //   sql += ` AND TPS_ORDER_ID = '${data?.orderId}'`;
    // }
    // if (data?.itemNo) {
    //   sql += ` AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;
    // }

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailGD = async (data: any) => {
  try {
    console.log("data3: ", data);
    let sql = `SELECT 
    TCP_CP2_AFWATEMP_QUEN_MIN,
    TCP_CP2_AFWATEMP_QUEN_MAX,
    TCP_CP2_ADHE_THICK_MIN,
    TCP_CP2_ADHE_THICK_MAX,
    TCP_CP2_CTHICK_EPOXY_MIN,
    TCP_CP2_CTHICK_EPOXY_MIN,
    TCP_CP2_TOT_CTHICK_MIN,
    TCP_CP2_TOT_CTHICK_MAX,
    TCP_CP2_TEMP_AQUEN_MIN,
    TCP_CP2_TEMP_AQUEN_MAX,
    TCP_CP2_VS_INSP_CPIPE,
    TCP_CP2_CUT_BACK_MIN,
    TCP_CP2_CUT_BACK_MAX,
    TCP_CP2_EPOXY_BND_MIN,
    TCP_CP2_EPOXY_BND_MAX,
    TCP_CP2_BEVEL_ANGLE_MIN,
    TCP_CP2_BEVEL_ANGLE_MAX,
    TCP_CP2_BARCODE,
    TCP_CP2_STENCILLING_MARK,
    TCP_CP2_COLOR_CODE,
    TCP_CP2_LOW_STRES_PUNCH,
    TCP_CP2_COATING_REPAIR,
    TCP_CP2_PIPE_IDENTIF,
    TCP_CP2_VIS_CHECK,
    TCP_CP2_RESU_MG    
    FROM V_PROCESS_SHEET_EC WHERE
    TPC_ORDER_ID = '${data?.orderId}'
    AND LTRIM(TPC_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
