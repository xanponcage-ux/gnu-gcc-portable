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
    SELECT DISTINCT TPS_ORDER_ID FROM V_PROCESS_SHEET  
    `;

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
    let sql = ` select enc_no_item from 
    v_end_cust_ord_epa where enc_id_order = '${data?.orderId}'
    UNION 
    SELECT TO_NUMBER(TPS_ORDER_ITEM) FROM V_PROCESS_SHEET 
     WHERE  TPS_ORDER_ID  = '${data?.orderId}' `;

    console.log("sql:: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailLD = async (data: any) => {
  try {
    let sql = `SELECT TPS_ORDER_ID, TPS_ORDER_ITEM, TPS_LD_YS_MIN, TPS_LD_YS_MAX,
       TPS_LD_UTS_MIN, TPS_LD_UTS_MAX, TPS_LD_YS_UTS, TPS_LD_EL,
       TPS_LD_HARDNESS, TPS_LD_HARD_DIFF, TPS_LD_MAGNIFIC, TPS_LD_ASTM_NO,
       TPS_LD_WELD_UTS_MIN, TPS_LD_WELD_UTS_MAX, TPS_LD_C, TPS_LD_MN_MIN,
       TPS_LD_MN_MAX, TPS_LD_AL, TPS_LD_S, TPS_LD_AL_N, TPS_LD_SI, TPS_LD_NI,
       TPS_LD_CR, TPS_LD_CU, TPS_LD_SI_MIN, TPS_LD_MO, TPS_LD_P_MIN,
       TPS_LD_P_MAX, TPS_LD_NB, TPS_LD_V, TPS_LD_NI_V_TI, TPS_LD_CU_NI,
       TPS_LD_TI, TPS_LD_B, TPS_LD_CA, TPS_LD_NB_V_TI_CU_MO, TPS_LD_N,
       TPS_LD_CE_IIW, TPS_LD_CE_PCM, TPS_LD_C_MIN, TPS_LD_AL_MIN,
       TPS_LD_S_MIN, TPS_LD_NI_MIN, TPS_LD_CR_MIN, TPS_LD_CU_MIN,
       TPS_LD_MO_MIN, TPS_LD_NB_MIN, TPS_LD_TI_MIN, TPS_LD_V_MIN,
       TPS_LD_CA_MIN, TPS_LD_B_MIN, TPS_LD_N_MIN, TPS_LD_AL_SOL_MIN,
       TPS_LD_AL_SOL_MAX, TPS_LD_IMP_TEST_TEMP, TPS_LD_BASE1, TPS_LD_BASE2,
       TPS_LD_WELD1, TPS_LD_WELD2, TPS_LD_FL1, TPS_LD_FL2, TPS_LD_SHEAR_IND,
       TPS_LD_SHEAR_AVG, TPS_LD_TEST_TEMP_IMP, TPS_LD_IMP_SPEC_SIZE,
       TPS_LD_DWTT_INDV_SA, TPS_LD_DWTT_AVG_SA, TPS_LD_DWTT_TEST_TEMP,
       TPS_LD_DWTT_EMPTY
    FROM V_PROCESS_SHEET 
    WHERE TPS_ORDER_ID = '${data?.orderId}'
    AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`; //and ltrim(tps_order_item)=1

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailID = async (data: any) => {
  try {
    let sql = `SELECT TPS_ID_MILMM, TPS_ID_MILOD, TPS_ID_MEASUR_TAPE, TPS_ID_PIPE_TAPE,
       TPS_ID_VER_CALLIPR, TPS_ID_RG, TPS_ID_SG, TPS_ID_RIGHT_ANGLE,
       TPS_ID_FILL_G_1, TPS_ID_MILOT2, TPS_ID_MILOT3, TPS_ID_MILOT4,
       TPS_ID_MM_0_25, TPS_ID_OD_MM, TPS_ID_MESR_TAPE, TPS_ID_PIPE_TAPE1,
       TPS_ID_D_METR, TPS_ID_VER_CALLIPR1, TPS_ID_STL_SCALE, TPS_ID_FILL_G_2,
       TPS_ID_ANG_PROTC, TPS_ID_ROOT_FC_G, TPS_ID_RGHT_ANG, TPS_ID_RG1,
       TPS_ID_LIX_MTR, TPS_ID_STRT_EDGE, TPS_ID_MILLPROC, TPS_ID_HYDRPROC,
       TPS_ID_VDIPROC, TPS_ID_HARDN, TPS_ID_BODYUT, TPS_ID_MANNUT,
       TPS_ID_FLTPROC, TPS_ID_RBTPROC, TPS_ID_WELDUT, TPS_ID_MWELDUT,
       TPS_ID_DWTTPROC, TPS_ID_EDDYC, TPS_ID_MPIPROC, TPS_ID_CYCHYDRO,
       TPS_ID_TENPROC, TPS_ID_SPECPROC, TPS_ID_IMPPROC, TPS_ID_METPROC,
       TPS_ID_ENDFACE
      FROM V_PROCESS_SHEET 
      WHERE TPS_ORDER_ID = '${data?.orderId}'
      AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailMD = async (data: any) => {
  try {
    let sql = `SELECT TPS_MD_SLT_WIDTH_MIN, TPS_MD_SLT_WIDTH_MAX, TPS_MD_SLT_THK,
       TPS_MD_COIL_THK, TPS_MD_EDGE_MILL, TPS_MD_HARD_PUNCH,
       TPS_MD_WELD_TEMP_MIN, TPS_MD_WELD_TEMP_MAX, TPS_MD_WELD_KW_MIN,
       TPS_MD_WELD_KW_MAX, TPS_MD_LSPEED_MIN, TPS_MD_LSPEED_MAX,
       TPS_MD_IDBEED, TPS_MD_IDBEED_DEPTH, TPS_MD_ONLINE_UST,
       TPS_MD_WSA_TEMP_MIN, TPS_MD_WSA_TEMP_MAX, TPS_MD_FLAT_TEST_WELD,
       TPS_MD_HYDRO_PRESS_TEST, TPS_MD_HOLD_TIME, TPS_MD_DIA_MTR_END_MIN,
       TPS_MD_DIA_MTR_END_MAX, TPS_MD_DIA_MTR_BODY_MIN,
       TPS_MD_DIA_MTR_BODY_MAX, TPS_MD_WALL_THK_MIN, TPS_MD_WALL_THK_MAX,
       TPS_MD_PIPE_LEN_MIN, TPS_MD_PIPE_LEN_MAX, TPS_MD_STRAIGHTNESS_FUL,
       TPS_MD_STRAIGHTNESS_END, TPS_MD_OUT_OF_ROUNDNESS, TPS_MD_OOREND,
       TPS_MD_SQUARNESS, TPS_MD_ROUT_FACE_MIN, TPS_MD_ROUT_FACE_MAX,
       TPS_MD_DIM_BEVEL_AG_MIN, TPS_MD_DIM_BEVEL_AG_MAX, TPS_MD_WEIGHT_MIN,
       TPS_MD_WEIGHT_MAX, TPS_MD_DEPTH_MN, TPS_MD_DEPTH_MX, TPS_MD_WIDTH_MN,
       TPS_MD_WIDTH_MX, TPS_MD_ROC, TPS_MD_TWIST, TPS_MD_SQOC_MN,
       TPS_MD_SQOC_MX, TPS_MD_CONVEX, TPS_MD_CONCAV, TPS_MD_ECN, TPS_MD_ROE,
       TPS_MD_RMTEST, TPS_MD_FLAT_TEST_MATT
       FROM V_PROCESS_SHEET 
        WHERE TPS_ORDER_ID = '${data?.orderId}'
        AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailSD = async (data: any) => {
  try {
    let sql = `SELECT TPS_SD_PROC_SHEET, TPS_SD_CUST_CD, TPS_SD_REF_NO, TPS_SD_TEST_PRESSURE,
       TPS_SD_DESTN, TPS_SD_SPEC_GRD, TPS_SD_QAP_NO, TPS_MARKING_NM, TPS_MARKING_BRAND, TPS_LICENSE_NO,
       ENC_ORD_QUANTITY QUANTITY, TO_CHAR(ENC_DT_ORD_CREATE, 'DD-MM-YYYY') CREATE_ON,
       ENC_LENGTH_MAX LEN, ENC_SEC1_MAX THICK, ENC_ODIA ODIA,
       ENC_CD_GRADE GRADE, ENC_MARK_CUST CUST_CD, ENC_MARK_CUST_NAME CUST_DESC,
       ENC_MK_SPEC_COMPLETE SPEC
       FROM V_PROCESS_SHEET A, V_END_CUST_ORD_EPA B
       WHERE A.TPS_ORDER_ID = B.ENC_ID_ORDER(+) AND A.TPS_ORDER_ITEM = B.ENC_NO_ITEM(+)
       AND TPS_ORDER_ID = '${data?.orderId}'
       AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo} `;

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
    let sql = `SELECT TPS_GD_TEST_MODE_1, TPS_GD_SCAN_SPD_BUT, TPS_GD_GAIN,
            TPS_GD_UT_LENANG_PROB, TPS_GD_UT_CIR_LENTR_PROB, TPS_GD_TEST_MODE_2,
            TPS_GD_GAUGEID, TPS_GD_GAIN_RANGE, TPS_GD_CALDATE, TPS_GD_CALDUEDT,
            TPS_GD_CUSED, TPS_GD_BATHCONC, TPS_GD_TECHNIQUE, TPS_GD_SCAN_SPD_AUT,
            TPS_GD_MEDIUM, TPS_GD_RESIDUAL_MAGNTSM, TPS_GD_QAP_NO, TPS_GD_BAUT,
            TPS_GD_BMUT, TPS_GD_BPROB, TPS_GD_WAUT, TPS_GD_WMUT, TPS_GD_WPROB
            FROM V_PROCESS_SHEET 
            WHERE TPS_ORDER_ID = '${data?.orderId}'
            AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateData = async (data: any) => {
  try {
    let sql = `UPDATE V_PROCESS_SHEET SET TPS_MARKING_NM = '${data?.markNm}',
            TPS_MARKING_BRAND = '${data?.markBrand}',
            TPS_LICENSE_NO = '${data?.licNo}',
            TPS_MK_UPD_BY = '${data?.user}',
            TPS_MK_UPD_DT = sysdate
            WHERE TPS_ORDER_ID = '${data?.orderId}'
            AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const DeleteProcesssheet = async (data: any) => {
  try {

        // let sql = ` DELETE V_PROCESS_SHEET
        //                 WHERE TPS_ORDER_ID = '${data?.orderId}'
        //                 AND TPS_ORDER_ITEM = ${data?.itemNo} `;

        let sql = `   DELETE
                            FROM V_PROCESS_SHEET
                            WHERE TPS_ORDER_ID = '${data?.orderId}'
                            AND TPS_ORDER_ITEM = ${data?.itemNo}
                            AND 0 < (SELECT COUNT(*) FROM V_CODES WHERE CD_TYPE = 'TB038' AND  CD_VALUE = '${data?.pno}')`
                        
    console.log('DeleteProcesssheet',sql);
    console.log('-----------------////////////////////-------------------');
    console.log(data?.orderId);
    console.log(data?.itemNo);
    console.log(data?.pno);

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
