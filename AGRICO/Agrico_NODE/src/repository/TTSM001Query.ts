import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import { runInThisContext } from "vm";

export const GetCoils = async (Plant: any, Order: any, Item: any, sfgMat: any) => {
  try {

    let qrycdDesc = `SELECT NVL( CD_DESC1,0) WIDTH_TOLERANCE
    FROM V_CODES
    WHERE CD_TYPE='TB023'
    AND CD_VALUE= :plant`

    let qrycdDescBinds = {
      plant: Plant,
    }

    let cddesc = await query.executeQuery(qrycdDesc, qrycdDescBinds);

    const sql = `SELECT
    eom_cd_epa,
    batch_id,
    current_proc,
    status,
    mass,
    mass mass1,
    odia,
    prod_cd,
    thick,
    width,
    tdc,
    epa_code,
    prev_order,
    prev_item,
    eom_cd_qlty_actl,
    mat_no,
    mat_desc,
    processing_flag,
    cast_no,
    batch_age
FROM
    (

     --QUERY for plant having slit coil as input
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
            eom_ms_gross_cal     act_batch_wt,
            round(eom_ms_gross_cal, 3) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn
        WHERE
            eom_cd_epa = :plant
            AND eom_cd_status = 'VF'
            AND eom_id_batch = eom_id_first_par
            AND eom_cd_prod NOT IN (
                SELECT
                    cd_value
                FROM
                    v_codes
                WHERE
                    cd_type = 'TB007'
                    AND cd_desc1 = eom_cd_epa
            )
            AND eom_no_matnr IN (
                SELECT
                    tmm_rm_mat
                FROM
                    v_tub_matl_mapping
                WHERE
                    tmm_status = 'A'
                    AND tmm_cd_epa = eom_cd_epa
                    AND tmm_sfg_mat = nvl(:sfg_mat, tmm_sfg_mat)
                    AND tmm_fg_mat IN (
                        SELECT
                            enc_no_matnr
                        FROM
                            v_end_cust_ord_epa
                        WHERE
                            enc_cd_epa = eom_cd_epa
                            AND enc_st_order = 'A'
                            AND enc_id_order = :ord
                            AND enc_no_item = :item
                    )
            )
        UNION

      --QUERY for plant having partial allotment   
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
            eom_ms_gross_cal     act_batch_wt,
            ( eom_ms_gross_cal - (
                SELECT
                    SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                FROM
                    v_temp_allotment
                WHERE
                    tma_cd_epa = b.tma_cd_epa
                    AND tma_id_batch = a.eom_id_batch
                    AND tma_cd_status = 'VM'
            ) ) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn        a,
            v_temp_allotment   b
        WHERE
            eom_cd_epa = tma_cd_epa
            AND eom_id_batch = tma_id_batch
            AND eom_cd_epa = :plant
            AND eom_cd_status = 'VM'
            AND ( eom_ms_gross_cal - (
                SELECT
                    SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                FROM
                    v_temp_allotment
                WHERE
                    tma_cd_epa = b.tma_cd_epa
                    AND tma_id_batch = a.eom_id_batch
                    AND tma_cd_status = 'VM'
            ) ) > 0 -- REMAINING MASS SHOULD BE >0
--            AND eom_id_batch = eom_id_first_par
            AND eom_cd_prod NOT IN (
                SELECT
                    cd_value
                FROM
                    v_codes
                WHERE
                    cd_type = 'TB007'
                    AND cd_desc1 = eom_cd_epa
            )
            AND eom_no_matnr IN (
                SELECT
                    tmm_rm_mat
                FROM
                    v_tub_matl_mapping
                WHERE
                    tmm_status = 'A'
                    AND tmm_cd_epa = eom_cd_epa
                    AND tmm_sfg_mat = nvl(:sfg_mat, tmm_sfg_mat)
                    AND tmm_fg_mat IN (
                        SELECT
                            enc_no_matnr
                        FROM
                            v_end_cust_ord_epa
                        WHERE
                            enc_cd_epa = eom_cd_epa
                            AND enc_st_order = 'A'
                            AND enc_id_order = :ord
                            AND enc_no_item = :item
                    )
            )
        UNION

            --QUERY for plant having hr coil input and slit in econvereted in TUBENXT , so the status = WB   
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
            eom_ms_gross_cal     act_batch_wt,
            round(eom_ms_gross_cal, 3) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn a
        WHERE
            eom_cd_epa = :plant
            AND eom_cd_status = 'WA'
            AND eom_cd_epa IN (
                SELECT
                    cd_value
                FROM
                    v_codes
                WHERE
                    cd_type = 'EPA424'
            )
            AND eom_no_matnr IN (
                SELECT
                    tmm_rm_mat
                FROM
                    v_tub_matl_mapping
                WHERE
                    tmm_status = 'A'
                    AND tmm_cd_epa = eom_cd_epa
                    AND tmm_sfg_mat = nvl(:sfg_mat, tmm_sfg_mat)
                    AND tmm_fg_mat IN (
                        SELECT
                            enc_no_matnr
                        FROM
                            v_end_cust_ord_epa
                        WHERE
                            enc_cd_epa = eom_cd_epa
                            AND enc_st_order = 'A'
                            AND enc_id_order = :ord
                            AND enc_no_item = :item
                    )
            )
    )
ORDER BY
    eom_cd_epa,
    batch_id`;

    let binds = {
      plant: Plant,
      ord: Order,
      item: Item,
      sfg_mat: sfgMat
    }

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const GetOrders = async (
  Plant: any,//0
  Order: any, //1
  Item: any, //2
  Odia: any, //3
  Idia: any, //4
  OrderType: any, //5
  OrderCreateFrom: any, //6
  OrderCreateTo: any, //7
  Thick1: any,//8
  Thick2: any,//9
  Grade: any,//10
  Length: any//11
) => {


  try {

    let sql = `SELECT ENC_CD_EPA, round(SYSDATE-ENC_DT_ORD_CREATE) Agening_Days,ENC_ID_ORDER,ENC_NO_ITEM,ENC_SALES_OFF Sales_Office
    ,ENC_SHIP_TO_PRTY_DESC Sold_Cust_NM,ENC_MARK_CUST_NAME,ENC_NO_MATNR FG_Material, nvl((select MAKTX from v_makt where mandt='600' AND MATNR=ENC_NO_MATNR AND ROWNUM=1),' ')FG_Material_Desc
    ,GRADE,ENC_SALES_QTY_UOM Sales_Unit, ENC_SALES_QTY ORD_QNTY_IN_SALES_UNIT,ENC_ORD_QUANTITY Order_Qty_MT
    ,(SELECT F_DISPATCH(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) Dispatched_FG_MT  
    ,(select F_BAL_TO_SCHD (A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM)  from dual) BTS
    ,((SELECT F_WIP(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)*1000) WIP_QTY
    ,((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)*1000) FG_STOCK
    ,' ' OverAll_Delv_Status,ENC_PRINT_SPEC Material_Grp
    , ENC_ODIA ODIA
    , ENC_IDIA IDIA
    ,ENC_SEC1_MAX THICK , ENC_LENGTH_MAX LNGTH , ENC_NO_TDC TDC , ENC_CD_PROD PROD_CD , ENC_CD_QLTY QLTY_CD  ,ENC_ORDER_TYPE
    , TO_CHAR(ENC_DT_ORD_CREATE,'DD-MON-YY HH24:MI:SS') ENC_DT_ORD_CREATE ,ENC_SEC2_MAX WIDTH
    ,ITEM_TYPE ,MILL,DRAW_TYPE,GEOMETRY,category ,SPEC,SUR_FINISH,END_FINISH,class,INS_CODE,OUT_DIA,IN_DIA
    ,( SELECT F_COIL_MATCHING_BOM_COUNT(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) coil_with_bom_count
    ,(SELECT F_COIL_DEVIATION_BOM_COUNT(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) coil_without_bom_count
    ,(SELECT F_ALLOTED(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) Alloted_qty
    ,(SELECT F_FREESTOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) freestock_qty
    ,NVL(TMM_SFG_MAT,' ') TMM_SFG_MAT,NVL(TMM_SFG_MAT_DESC,' ')TMM_SFG_MAT_DESC,NVL(TMM_RM_MAT,' ') TMM_RM_MAT ,NVL(TMM_RM_MAT_DESC,' ') TMM_RM_MAT_DESC 
    ,ENC_ORD_QUANTITY-((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)) BTF , -- Order qty- ( FG/1000)  ---- IF FG IS SHOWING in KG IN SCREEN
    ENC_ORD_QUANTITY-(((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL))+ ((SELECT F_WIP(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)) ) BTR, -- Order Qty - ( FG/1000 + WIP /1000 ) – IF FG AND WIP showing kg in screen
    ENC_ORD_QUANTITY-(((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL))+ ((SELECT F_WIP(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL))+(SELECT F_ALLOTED(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) ) BTA-- Order qty - ( FG/1000 + WIP/1000 + ALLOTED)
    ,ENC_MATNR_SPEC MATNR_SPEC, ENC_MATNR_IP MATNR_IP
    FROM V_END_CUST_ORD_EPA A
    LEFT OUTER JOIN V_YMPCT_TUB_MATL
    ON ENC_NO_MATNR = MATNR
    LEFT OUTER JOIN V_TUB_MATL_MAPPING ON TMM_CD_EPA=ENC_CD_EPA AND TMM_FG_MAT = ENC_NO_MATNR    
    WHERE ENC_ST_ORDER='A'
    AND ENC_CD_EPA = NVL(:Plant, ENC_CD_EPA)     
    AND (select F_BAL_TO_SCHD (A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM)  from dual) > 0
    AND NVL(TMM_PRIORITY_NO,1)='1'
    AND enc_slit_plan='TUBE' `;
    let binds = {
      Plant: Plant
    }

    // ,ENC_ORD_QUANTITY-((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)) BTF , -- Order qty- ( FG/1000)  ---- IF FG IS SHOWING in KG IN SCREEN
    // ENC_ORD_QUANTITY-(((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)/1000)+ ((SELECT F_WIP(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)/1000) ) BTR, -- Order Qty - ( FG/1000 + WIP /1000 ) – IF FG AND WIP showing kg in screen
    // ENC_ORD_QUANTITY-(((SELECT F_FG_STOCK(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)/1000)+ ((SELECT F_WIP(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL)/1000)+(SELECT F_ALLOTED(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) ) BTA-- Order qty - ( FG/1000 + WIP/1000 + ALLOTED)

    if (Order && Order != "") {
    }
    else {
      sql += ` AND ENC_ORDER_TYPE IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE='TB003') `;
    }

    if (Order && Order != "") {
      sql += ` AND ENC_ID_ORDER = NVL(:Odr,ENC_ID_ORDER) `;
      binds["Odr"] = Order;
    }

    if (Item && Item != "") {
      sql += ` AND ENC_NO_ITEM = NVL(:Item,ENC_NO_ITEM) `;
      binds["Item"] = Item;
    }

    if (OrderType && OrderType != "") {
      sql += ` AND ENC_ORDER_TYPE = NVL(:OrderType , ENC_ORDER_TYPE) `;
      binds["OrderType"] = OrderType;
    }

    if ((Length && Array.isArray(Length) && Length.length > 1)) {
      if ((Length && Array.isArray(Length) && Length.length > 1)) {
        sql += `AND ENC_LENGTH_MAX in(` + Length.join(',') + `) `;
        // binds["LengthFrm"] = LengthFrm.join(',');
      }
    } else {
      if (Length && Length !== "") {
        sql += `AND ENC_LENGTH_MAX = nvl(:Length, ENC_LENGTH_MAX) `;
        binds["Length"] = Array.isArray(Length) ? Length[0] : Length;
      }
    }

    if ((Thick1 && Array.isArray(Thick1) && Thick1.length > 1) || (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)) {
      if ((Thick1 && Array.isArray(Thick1) && Thick1.length > 1)) {
        sql += `AND enc_sec1_max in(` + Thick1.join(',') + `) `;
        // binds["Thick1"] = Thick1.join(',');
      } else if ((Thick2 && Array.isArray(Thick2) && Thick2.length > 1)) {
        sql += `AND enc_sec1_max in(` + Thick2.join(',') + `) `;
        // binds["Thick2"] = Thick2.join(',');
      }
    } else {
      if (Thick1 && Thick1 !== "") {
        sql += `AND enc_sec1_min >= nvl(:Thick1, enc_sec1_min) `;
        binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
      }
      if (Thick2 && Thick2 !== "") {
        sql += `AND enc_sec1_max <= nvl(:Thick2, enc_sec1_max) `;
        binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
      }
    }

    if ((Odia && Array.isArray(Odia) && Odia.length > 1)) {
      if ((Odia && Array.isArray(Odia) && Odia.length > 1)) {
        sql += `AND ENC_ODIA in(` + Odia.join(',') + `) `;
        // binds["Odia"] = Odia.join(',');
      }
    } else {
      if (Odia && Odia?.length) {
        sql += `AND ENC_ODIA = nvl(:Odia, ENC_ODIA) `;
        binds["Odia"] = Array.isArray(Odia) ? Odia[0] : Odia;
      }
    }
    if ((Idia && Array.isArray(Idia) && Idia.length > 1)) {
      if ((Idia && Array.isArray(Idia) && Idia.length > 1)) {
        sql += `AND ENC_IDIA in(` + Idia.join(',') + `) `;
        // binds["Idia"] = Idia.join(',');
      }
    } else {
      if (Idia && Idia?.length) {
        sql += `AND ENC_IDIA = nvl(:Idia, ENC_IDIA) `;
        binds["Idia"] = Array.isArray(Idia) ? Idia[0] : Idia;
      }
    }

    if (OrderCreateFrom && OrderCreateFrom != "" && OrderCreateTo && OrderCreateTo != "") {
      sql += ` AND ENC_DT_ORD_CREATE BETWEEN NVL(:OrderCreateFrom,ENC_DT_ORD_CREATE) AND NVL(:OrderCreateTo, ENC_DT_ORD_CREATE) `;
      binds["OrderCreateFrom"] = OrderCreateFrom;
      binds["OrderCreateTo"] = OrderCreateTo;
    }

    if (Grade && Grade != "") {
      sql += ` AND GRADE = NVL(:Grade , GRADE)   `;
      binds["Grade"] = Grade;
    }
    sql += ` ORDER BY ENC_CD_EPA, ENC_ID_ORDER,ENC_NO_ITEM `;


    console.log(sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
  }
};

export const LinkCoils = async (
  plant: any,
  order: any,
  item: any,
  batchId: any,
  remarks: any,
  allotedQty: any,
  btp: any,
  BTP_T: any,
  sfgMaterial: any
) => {
  try {
    const sql = `call C1CVB001 (
      LS_CD_EPA => :LS_CD_EPA1,
      LS_ORDER_NO => :LS_ORDER_NO,
      LN_ITEM_NO => :LN_ITEM_NO,
      LS_BATCH_ID => :LS_BATCH_ID,
      BTS => :BTS,
      TOT_COIL_QTY => :TOT_COIL_QTY,
      LS_REMARKS => :LS_REMARKS,
      LN_ALLOTED_QTY => :LN_ALLOTED_QTY,
      LS_SFG_MATNR => :LS_SFG_MATNR,
      LS_OUT_FLAG => :LS_OUT_FLAG         
      )`;


    const binds = {
      LS_CD_EPA1: plant,
      LS_ORDER_NO: order,
      LN_ITEM_NO: item,
      LS_BATCH_ID: batchId,
      LS_REMARKS: remarks,
      BTS: btp,
      TOT_COIL_QTY: allotedQty,
      LN_ALLOTED_QTY: BTP_T,
      LS_SFG_MATNR: sfgMaterial,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
  }
};


export const GetCoilsDeviationFromBOM = async (Plant: any, Order: any, Item: any, sfg_mate: any) => {
  try {

    let qrycdDesc = `SELECT NVL( CD_DESC1,0) WIDTH_TOLERANCE
    FROM V_CODES
    WHERE CD_TYPE='TB023'
    AND CD_VALUE= :plant`

    let qrycdDescBinds = {
      plant: Plant,
    }

    let cddesc = await query.executeQuery(qrycdDesc, qrycdDescBinds);


    // Added as on date 23-01-23.
    const sql = `SELECT
    eom_cd_epa,
    batch_id,
    current_proc,
    status,
    mass,
    mass mass1,
    odia,
    prod_cd,
    thick,
    width,
    tdc,
    epa_code,
    prev_order,
    prev_item,
    eom_cd_qlty_actl,
    mat_no,
    mat_desc,
    processing_flag,
    cast_no,
    batch_age
FROM
    (
     --QUERY for plant having slit coil as input
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
            round(eom_ms_gross_cal, 3) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn
        WHERE
            eom_cd_epa = :plant
            AND eom_cd_status = 'VF'
            AND eom_id_batch = eom_id_first_par
            AND eom_cd_prod NOT IN (
                SELECT
                    cd_value
                FROM
                    v_codes
                WHERE
                    cd_type = 'TB007'
                    AND cd_desc1 = eom_cd_epa
            )
            AND ( eom_sec2 BETWEEN (
                SELECT
                    nvl(sec2_max,0)-1
                FROM
                    ymt_matchar
                WHERE
                    mandt = '600'
                    AND matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat = (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_id_order = :ordr
                                    AND enc_no_item = :item
                                    AND enc_cd_epa = :plant
                            )
                            AND tmm_cd_epa = :plant
                    )
            )
          AND
          (
                SELECT
                    nvl(sec2_max,0)+1
                FROM
                    ymt_matchar
                WHERE
                    mandt = '600'
                    AND matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat = (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_id_order = :ordr
                                    AND enc_no_item = :item
                                    AND enc_cd_epa = :plant
                            )
                            AND tmm_cd_epa = :plant
                    )
            )
            )  
        UNION
      --QUERY for plant having partial allotment  
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
      --ROUND((EOM_MS_GROSS_CAL - DECODE(TMA_MS_ALLOTED_UOM,'KG',ROUND((NVL(TMA_MS_ALLOTED,0)/1000),3),TMA_MS_ALLOTED) ),3) MASS,
            ( eom_ms_gross_cal - (
                SELECT
                    SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                FROM
                    v_temp_allotment
                WHERE
                    tma_cd_epa = tma_cd_epa
                    AND tma_id_batch = eom_id_batch
                    AND tma_cd_status = 'VM'
            ) ) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn        a,
            v_temp_allotment   b
        WHERE
            eom_cd_epa = tma_cd_epa
            AND eom_id_batch = tma_id_batch
            AND eom_id_order_cus = tma_id_order
            AND eom_id_ord_item_cus = tma_no_item
            AND eom_cd_epa = :plant
            AND eom_cd_status = 'VM'
            AND ( eom_ms_gross_cal - (
                SELECT
                    SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                FROM
                    v_temp_allotment
                WHERE
                    tma_cd_epa = b.tma_cd_epa
                    AND tma_id_batch = a.eom_id_batch
                    AND tma_cd_status = 'VM'
            ) ) > 0 -- REMAINING MASS SHOULD BE >0
             --AND ROUND((EOM_MS_GROSS_CAL - DECODE(TMA_MS_ALLOTED_UOM,'KG',ROUND((NVL(TMA_MS_ALLOTED,0)/1000),3),TMA_MS_ALLOTED) ),3) > 0 -- REMAINING MASS SHOULD BE >0
            --AND eom_id_batch = eom_id_first_par
            AND eom_cd_prod NOT IN (
                SELECT
                    cd_value
                FROM
                    v_codes
                WHERE
                    cd_type = 'TB007'
                    AND cd_desc1 = eom_cd_epa
            )
            AND ( eom_sec2 BETWEEN (
                SELECT
                    sec2_max - 1
                FROM
                    ymt_matchar
                WHERE
                    mandt = '600'
                    AND matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat = (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_id_order = :ordr
                                    AND enc_no_item = :item
                                    AND enc_cd_epa = :plant
                            )
                            AND tmm_cd_epa = :plant
                    )
            )
            AND (
                SELECT
                    sec2_max + 1
                FROM
                    ymt_matchar
                WHERE
                    mandt = '600'
                    AND matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat = (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_id_order = :ordr
                                    AND enc_no_item = :item
                                    AND enc_cd_epa = :plant
                            )
                            AND tmm_cd_epa = :plant
                    )
            )
            )
        UNION
            --QUERY for plant having hr coil input and slit in econvereted in TUBENXT , so the status = WB 
        SELECT
            eom_cd_epa,
            eom_id_batch         batch_id,
            eom_cd_curr_proc     current_proc,
            eom_cd_status        status,
            round(eom_ms_gross_cal, 3) mass,
            eom_odia             odia,
            eom_cd_prod          prod_cd,
            eom_sec1             thick,
            eom_sec2             width,
            eom_tdc_actl         tdc,
            eom_cd_epa           epa_code,
            eom_id_ord_cus_aim   prev_order,
            eom_id_itm_cus_aim   prev_item,
            eom_cd_qlty_actl,
            eom_no_matnr         mat_no,
            (
                SELECT
                    maktx
                FROM
                    v_makt
                WHERE
                    mandt = '600'
                    AND matnr = eom_no_matnr
            ) mat_desc,
            decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                   '3', 'Downgraded', '5', 'Additional Process', '8',
                   'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
            eom_no_cast          cast_no,
            round(sysdate - eom_ts_creation) batch_age
        FROM
            v_epa_prodn a
        WHERE
            eom_cd_epa = :plant
            AND eom_cd_status = 'WA'
            AND eom_sec2 IN (
                SELECT
                    sec2_max
                FROM
                    ymt_matchar
                WHERE
                    mandt = '600'
                    AND matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat = (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_id_order = :ordr
                                    AND enc_no_item = :item
                                    AND enc_cd_epa = :plant
                            )
                            AND tmm_cd_epa = :plant
                    )
            )
    )
WHERE
    batch_id NOT IN (
        SELECT DISTINCT
            batch_id
        FROM
            (
     --- THIS IS COMPLETE QUERY OF COIL MATCHING WITH BOM
     --QUERY for plant having slit coil as input
                SELECT
                    eom_cd_epa,
                    eom_id_batch         batch_id,
                    eom_cd_curr_proc     current_proc,
                    eom_cd_status        status,
                    eom_ms_gross_cal     act_batch_wt,
                    round(eom_ms_gross_cal, 3) mass,
                    eom_odia             odia,
                    eom_cd_prod          prod_cd,
                    eom_sec1             thick,
                    eom_sec2             width,
                    eom_tdc_actl         tdc,
                    eom_cd_epa           epa_code,
                    eom_id_ord_cus_aim   prev_order,
                    eom_id_itm_cus_aim   prev_item,
                    eom_cd_qlty_actl,
                    eom_no_matnr         mat_no,
                    (
                        SELECT
                            maktx
                        FROM
                            v_makt
                        WHERE
                            mandt = '600'
                            AND matnr = eom_no_matnr
                    ) mat_desc,
                    decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                           '3', 'Downgraded', '5', 'Additional Process', '8',
                           'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                    eom_no_cast          cast_no
                FROM
                    v_epa_prodn
                WHERE
                    eom_cd_epa = :plant
                    AND eom_cd_status = 'VF'
                    AND eom_id_batch = eom_id_first_par
                    AND eom_cd_prod NOT IN (
                        SELECT
                            cd_value
                        FROM
                            v_codes
                        WHERE
                            cd_type = 'TB007'
                            AND cd_desc1 = eom_cd_epa
                    )
                    AND eom_no_matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_cd_epa = eom_cd_epa
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat IN (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_cd_epa = eom_cd_epa
                                    AND enc_st_order = 'A'
                                    AND enc_id_order = :ordr
                                    AND enc_no_item = :item
                            )
                    )
                UNION
      --QUERY for plant having partial allotment 
                SELECT
                    eom_cd_epa,
                    eom_id_batch         batch_id,
                    eom_cd_curr_proc     current_proc,
                    eom_cd_status        status,
                    eom_ms_gross_cal     act_batch_wt,
                    ( eom_ms_gross_cal - (
                        SELECT
                            SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                        FROM
                            v_temp_allotment
                        WHERE
                            tma_cd_epa = b.tma_cd_epa
                            AND tma_id_batch = a.eom_id_batch
                            AND tma_cd_status = 'VM'
                    ) ) mass,
                    eom_odia             odia,
                    eom_cd_prod          prod_cd,
                    eom_sec1             thick,
                    eom_sec2             width,
                    eom_tdc_actl         tdc,
                    eom_cd_epa           epa_code,
                    eom_id_ord_cus_aim   prev_order,
                    eom_id_itm_cus_aim   prev_item,
                    eom_cd_qlty_actl,
                    eom_no_matnr         mat_no,
                    (
                        SELECT
                            maktx
                        FROM
                            v_makt
                        WHERE
                            mandt = '600'
                            AND matnr = eom_no_matnr
                    ) mat_desc,
                    decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                           '3', 'Downgraded', '5', 'Additional Process', '8',
                           'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                    eom_no_cast          cast_no
                FROM
                    v_epa_prodn        a,
                    v_temp_allotment   b
                WHERE
                    eom_cd_epa = tma_cd_epa
                    AND eom_id_batch = tma_id_batch
                    AND eom_cd_epa = :plant
                    AND eom_cd_status = 'VM'
                    AND ( eom_ms_gross_cal - (
                        SELECT
                            SUM(decode(tma_ms_alloted_uom, 'KG', round((nvl(tma_ms_alloted, 0) / 1000), 3), tma_ms_alloted))
                        FROM
                            v_temp_allotment
                        WHERE
                            tma_cd_epa = b.tma_cd_epa
                            AND tma_id_batch = a.eom_id_batch
                            AND tma_cd_status = 'VM'
                    ) ) > 0 -- REMAINING MASS SHOULD BE >0
                  --AND eom_id_batch = eom_id_first_par
                    AND eom_cd_prod NOT IN (
                        SELECT
                            cd_value
                        FROM
                            v_codes
                        WHERE
                            cd_type = 'TB007'
                            AND cd_desc1 = eom_cd_epa
                    )
                    AND eom_no_matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_cd_epa = eom_cd_epa
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat IN (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_cd_epa = eom_cd_epa
                                    AND enc_st_order = 'A'
                                    AND enc_id_order = :ordr
                                    AND enc_no_item = :item
                            )
                    )
                UNION
            --QUERY for plant having hr coil input and slit in econvereted in TUBENXT , so the status = WB  
                SELECT
                    eom_cd_epa,
                    eom_id_batch         batch_id,
                    eom_cd_curr_proc     current_proc,
                    eom_cd_status        status,
                    eom_ms_gross_cal     act_batch_wt,
                    round(eom_ms_gross_cal, 3) mass,
                    eom_odia             odia,
                    eom_cd_prod          prod_cd,
                    eom_sec1             thick,
                    eom_sec2             width,
                    eom_tdc_actl         tdc,
                    eom_cd_epa           epa_code,
                    eom_id_ord_cus_aim   prev_order,
                    eom_id_itm_cus_aim   prev_item,
                    eom_cd_qlty_actl,
                    eom_no_matnr         mat_no,
                    (
                        SELECT
                            maktx
                        FROM
                            v_makt
                        WHERE
                            mandt = '600'
                            AND matnr = eom_no_matnr
                    ) mat_desc,
                    decode(eom_cd_st_actl, '1', 'Prime', 2, 'Partial Scrapped',
                           '3', 'Downgraded', '5', 'Additional Process', '8',
                           'Diverted', '9', 'Scrapped', 'Prime') processing_flag,
                    eom_no_cast          cast_no
                FROM
                    v_epa_prodn a
                WHERE
                    eom_cd_epa = :plant
                    AND eom_cd_status = 'WA'
                    AND eom_cd_epa IN (
                        SELECT
                            cd_value
                        FROM
                            v_codes
                        WHERE
                            cd_type = 'EPA424'
                    )
                    AND eom_no_matnr IN (
                        SELECT
                            tmm_rm_mat
                        FROM
                            v_tub_matl_mapping
                        WHERE
                            tmm_status = 'A'
                            AND tmm_cd_epa = eom_cd_epa
                            AND tmm_sfg_mat = nvl(:sfg_mate, tmm_sfg_mat)
                            AND tmm_fg_mat IN (
                                SELECT
                                    enc_no_matnr
                                FROM
                                    v_end_cust_ord_epa
                                WHERE
                                    enc_cd_epa = eom_cd_epa
                                    AND enc_st_order = 'A'
                                    AND enc_id_order = :ordr
                                    AND enc_no_item = :item
                            )
                    )
            )
    )
ORDER BY
    eom_cd_epa,
    batch_id`;

    let binds = {
      plant: Plant,
      ordr: Order,
      item: Item,
      sfg_mate: sfg_mate
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};


export const getDeAllot = async (
  plant: any,
  idia: any,
  item: any,
  odia: any,
  orderId: any,
  orderType: any
) => {

  try {

    let sql = `SELECT eom_cd_epa, eom_id_batch batch_id, eom_cd_curr_proc current_proc,
    eom_cd_status status, ROUND (decode(eom_uom,'KG',eom_ms_gross_cal/1000,eom_ms_gross_cal), 3) mass,TMA_MS_ALLOTED alloted_Mass,
    NVL (eom_odia, eom_sec2) odia, EOM_IDIA idia, eom_cd_prod prod_cd, eom_sec1 thick,
    eom_sec2 width, eom_tdc_actl tdc, eom_cd_epa epa_code,
    TMA_ID_ORDER prev_order, tma_sfg_matnr sfg_matnr, TMA_NO_ITEM prev_item,
    eom_cd_qlty_actl, eom_no_matnr mat_no,
    (SELECT maktx
       FROM v_makt
      WHERE mandt = '600' AND matnr = eom_no_matnr) mat_desc,
      TO_CHAR (TMA_TS_ALLOTMENT, 'DD-MON-YY HH24:MI:SS') crt_dt,    
    (SELECT grade
       FROM v_ympct_tub_matl
      WHERE mandt = '600' AND matnr = eom_no_matnr) grade, '' mat_type,
    '' sloc, '' sloc_on
    ,(SELECT NVL(ENC_ORD_QUANTITY,0) FROM V_END_CUST_ORD_EPA 
    WHERE ENC_CD_EPA = TMA_CD_EPA AND ENC_ID_ORDER = TMA_ID_ORDER 
    AND ENC_NO_ITEM = TMA_NO_ITEM) ORD_QTY
    ,(select F_BAL_TO_SCHD (TMA_CD_EPA,TMA_ID_ORDER,TMA_NO_ITEM)  from dual) BTS
    ,(select MAKTX from V_MAKT where MANDT='600' and MATNR=NVL(EOM_NO_MATNR,ENC_NO_MATNR) and rownum=1)FG_MATERIAL_DESC    
    ,NVL(( select MAKTX from V_MAKT where MANDT = '600' and MATNR = (select TMM_SFG_MAT from V_TUB_MATL_MAPPING where TMM_CD_EPA = EOM_CD_EPA and TMM_FG_MAT = EOM_NO_MATNR and rownum = 1) ), ' ') SFG_MATERIAL_DESC
    ,(select (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EIC_NO_MATNR AND ROWNUM=1) from V_INPUT_COIL
    where EOM_CD_EPA=EIC_CD_EPA AND EOM_ID_FIRST_PAR=EIC_ID_COIL and rownum =1) RM_MATERIAL_DESC
    ,ENC_MARK_CUST_NAME CUSTOMER_NAME
FROM v_epa_prodn , V_TEMP_ALLOTMENT ,V_END_CUST_ORD_EPA
WHERE EOM_CD_ePA = TMA_CD_EPA
AND eom_cd_epa = :plant
AND (eom_cd_status = 'VM' OR eom_cd_status LIKE '%B')
AND EOM_cD_STATUS NOT IN ('VB','WB')
AND EOM_ID_BATCH = TMA_ID_BATCH
AND EOM_CD_EPA = ENC_CD_EPA(+) 
And EOM_ID_ORDER_CUS = ENC_ID_ORDER(+) 
And EOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM(+)
 `;
    let binds = {
      plant: plant
    }
    //TO_CHAR (eom_ts_creation, 'DD-MON-YY HH24:MI:SS') crt_dt,
    if (orderId && orderId != "") {
      sql += ` AND TMA_ID_ORDER = NVL(:orderId,TMA_ID_ORDER) `;
      binds["orderId"] = orderId;
    }

    if (item && item != "") {
      sql += ` AND TMA_NO_ITEM = NVL(:item,TMA_NO_ITEM) `;
      binds["item"] = item;
    }



    if ((odia && Array.isArray(odia) && odia.length > 1)) {
      if ((odia && Array.isArray(odia) && odia.length > 1)) {
        sql += `AND NVL (eom_odia, eom_sec2) in(` + odia.join(',') + `) `;
        // binds["Odia"] = Odia.join(',');
      }
    } else {
      if (odia && odia?.length) {
        sql += `AND NVL (eom_odia, eom_sec2) = nvl(:odia, NVL (eom_odia, eom_sec2)) `;
        binds["odia"] = Array.isArray(odia) ? odia[0] : odia;
      }
    }

    if ((idia && Array.isArray(idia) && idia.length > 1)) {
      if ((idia && Array.isArray(idia) && idia.length > 1)) {
        sql += `AND EOM_IDIA in(` + idia.join(',') + `) `;
        // binds["Idia"] = Idia.join(',');
      }
    } else {
      if (idia && idia?.length) {
        sql += `AND EOM_IDIA = nvl(:idia, EOM_IDIA) `;
        binds["idia"] = Array.isArray(idia) ? idia[0] : idia;
      }
    }

    sql += `ORDER BY TMA_CD_EPA,TMA_TS_ALLOTMENT,TMA_ID_ORDER ,TMA_NO_ITEM,eom_id_batch`;
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const updateAllotData = async (
  BATCH_ID: any,
  personalNo: any,
  EPA_CODE: any,
  order: any,
  item: any,
  remarks: any
) => {

  try {
    // const sql = `
    // UPDATE  v_epa_prodn 
    // SET EOM_ID_ORDER_CUS='',
    // EOM_ID_ORD_ITEM_CUS=0,
    // EOM_REC_UPD_DT=SYSDATE ,
    // EOM_REC_UPD_USR=:personalNo , 
    // EOM_CD_STATUS='VF'
    // where eom_cd_epa=:plant
    // and eom_cd_status='VM'
    // AND EOM_ID_BATCH =:batch`;

    // const binds = {
    //   personalNo : personalNo,
    //   batch: BATCH_ID,
    //   plant : EPA_CODE
    // };


    // TUBEDBA.C1CVB002( VARCHAR2,  VARCHAR2,  NUMBER,  VARCHAR
    //   , LS_REMARKS VARCHAR2 , LS_OUT_FLAG OUT VARCHAR2)

    const sql = `call C1CVB002 (
      LS_CD_EPA => :LS_CD_EPA,
      LS_ORDER_NO => :LS_ORDER_NO,
      LN_ITEM_NO => :LN_ITEM_NO,
      LS_BATCH_ID => :LS_BATCH_ID,
      LS_REMARKS => :LS_REMARKS,
      LS_OUT_FLAG => :LS_OUT_FLAG         
      )`;
    const binds = {
      LS_CD_EPA: EPA_CODE,
      LS_ORDER_NO: order,
      LN_ITEM_NO: item,
      LS_BATCH_ID: BATCH_ID,
      LS_REMARKS: remarks,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

//**** Started Chemistry check ****/
export const ChemCheck = async (
  plant: any,
  order: any,
  item: any,
  batchId: any,
  remarks: any,
  allotedQty: any,
  btp: any,
  BTP_T: any
) => {

  try {
    const sql = `call f_SPCB031_CHEM_CHK_TUB (
      LS_CD_EPA => :LS_CD_EPA,
      LS_ORDER_NO => :LS_ORDER_NO,
      LN_ITEM_NO => :LN_ITEM_NO,
      LS_BATCH_ID => :LS_BATCH_ID,     
      LS_OUT_FLAG => :LS_OUT_FLAG         
      )`;
    const binds = {
      LS_CD_EPA: plant,
      LS_ORDER_NO: order,
      LN_ITEM_NO: item,
      LS_BATCH_ID: batchId,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const GetWIPCoilsMatchingWithBOM = async (Plant: any, Order: any, Item: any, OrdTdc: any) => {
  try {
  let cdType: any;
   if (Plant == "0788")
   {
    cdType = "TB030C";
   } 
   else
   {
    cdType = "TB030";
   }

    const sql = `SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
    EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC             
   ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
   ,EOM_NO_CAST CAST_NO
   ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
    FROM V_EPA_PRODN A
    WHERE EOM_CD_EPA = :Plant
    AND (EOM_CD_STATUS like '%F' AND EOM_CD_STATUS NOT IN ('VF') )
    AND (EOM_ID_BATCH <> EOM_ID_FIRST_PAR or eom_id_batch like 'MG%')
    AND (
      EOM_TDC_ACTL = :OrdTdc
      OR EOM_TDC_ACTL IN (
        SELECT
          CD_DESC1
        FROM
          V_CODES
        WHERE
          CD_TYPE = :cdType
          AND CD_VALUE = :OrdTdc
      )
    )
    AND NVL(EOM_CD_ST_ACTL,'1') IN ('8','5','1') -- DIVERETED AND ADDITIONAL PROCESS
UNION 
SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
    EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC             
    ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
    ,EOM_NO_CAST CAST_NO
    ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
    FROM V_EPA_PRODN A
    WHERE EOM_CD_EPA = :Plant
    AND (EOM_CD_STATUS like '%F' AND EOM_CD_STATUS NOT IN ('VF') )
    AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR
    AND EOM_CD_ST_ACTL = '3' -- DOWNGRADED
    AND EOM_NO_MATNR
    in
    (
    select TMM_SFG_MAT from v_TUB_MATL_MAPPING WHERE TMM_STATUS='A' AND TMM_CD_EPA = EOM_CD_EPA AND TMM_FG_MAT in
        (
        select ENC_NO_MATNR from V_END_CUST_ORD_EPA
            WHERE ENC_CD_EPA = EOM_CD_ePA
            AND ENC_ST_ORDER='A'
            AND ENC_ID_ORDER = :OrdNo
            AND ENC_NO_ITEM = :Item
        )
    )
UNION
 SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
    EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC
    ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
    ,EOM_NO_CAST CAST_NO
    ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
    FROM V_EPA_PRODN A
    WHERE EOM_CD_EPA = :Plant
    AND EOM_CD_STATUS ='WF'
    AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR
    AND EOM_NO_MATNR
    in
    (
    select TMM_FG_MAT from v_TUB_MATL_MAPPING WHERE TMM_STATUS='A' AND TMM_CD_EPA = EOM_CD_EPA AND TMM_FG_MAT in
        (
        select ENC_NO_MATNR from V_END_CUST_ORD_EPA
            WHERE ENC_CD_EPA = EOM_CD_ePA
            AND ENC_ST_ORDER='A'
            AND ENC_ID_ORDER = :OrdNo
            AND ENC_NO_ITEM = :Item
        )
    )
ORDER BY EOM_CD_EPA,BATCH_ID`;
    //let binds = [`${Plant}`, `${Order}`, `${Item}`];
    let binds = {
      Plant: Plant,
      OrdNo: Order,
      Item: Item,
      OrdTdc: OrdTdc,
      cdType: cdType
    }
    //console.log(sql,binds); //remove
    return await query.executeQuery(sql, binds);
  } catch (error) {
    //console.log(error);
    throw new Error.InternalServerError("!Error");
  }
};

//******WIP allotment - Coil Not Matching with BOM*************
export const GetWIPCoilsNotMatchingWithBOM = async (Plant: any, Order: any, Item: any) => {
  try {
    const sql = `SELECT *
    FROM
     (
     --QUERY for plant having slit coil as input
     SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),5) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),5) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
                 EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC  
                 FROM V_EPA_PRODN
                 WHERE 1=2
                 AND EOM_CD_EPA = :Plant
                 AND (EOM_CD_STATUS like '%F' AND EOM_CD_STATUS NOT IN ('VF'))
                 AND EOM_SEC2 =
                  (SELECT SEC2_MAX
                     FROM YMT_MATCHAR
                    WHERE MANDT = '600'
                      AND MATNR IN (
                             SELECT TMM_RM_MAT
                               FROM V_TUB_MATL_MAPPING
                              WHERE TMM_STATUS='A' AND TMM_FG_MAT =
                                       (SELECT ENC_NO_MATNR
                                          FROM V_END_CUST_ORD_EPA
                                         WHERE ENC_ID_ORDER = :Ordr
                                           AND ENC_NO_ITEM = :Item
                                           AND ENC_CD_EPA = :Plant)
                                AND TMM_CD_EPA = :Plant))
      )
      ORDER BY EOM_CD_EPA,BATCH_ID`;

    let binds = {
      Plant: Plant,
      Ordr: Order,
      Item: Item
    }

    // let binds = [`${Plant}`, `${Order}`, `${Item}`];

    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const chemChk = async (LS_CD_EPA: any, LS_ORDER_NO: any, LN_ITEM_NO: any, LS_BATCH_ID: any) => {
  try {
    const sql = `SELECT f_SPCB031_CHEM_CHK_TUB ( '${LS_CD_EPA}', '${LS_ORDER_NO}', ${LN_ITEM_NO}, '${LS_BATCH_ID}' ) from dual`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}

export const getOdia = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT ENC_SEC2_MAX FROM
      (
      SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      UNION
      SELECT DISTINCT round(ENC_SEC2_MIN,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      )
      ORDER BY 1 DESC
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getDOdia = async (plant: string) => {
  try {
    const sql = `
    SELECT DISTINCT round(NVL (eom_odia, eom_sec2),3) EOM_ODIA
    FROM v_epa_prodn , V_TEMP_ALLOTMENT
    WHERE EOM_CD_ePA = TMA_CD_EPA
    AND eom_cd_epa = :plant
    AND (eom_cd_status = 'VM' OR eom_cd_status LIKE '%B')
    AND EOM_cD_STATUS NOT IN ('VB','WB')
    AND EOM_ID_BATCH = TMA_ID_BATCH
    ORDER BY 1 DESC
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getThickList = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT ENC_SEC1_MAX FROM
      (
      SELECT DISTINCT round(ENC_SEC1_MAX,3) ENC_SEC1_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      UNION
      SELECT DISTINCT round(ENC_SEC1_MIN,3) ENC_SEC1_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      )
      ORDER BY 1 DESC
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getlengthList = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT ENC_LENGTH_MAX FROM
      (
      SELECT DISTINCT round(ENC_LENGTH_MAX,3) ENC_LENGTH_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      UNION
      SELECT DISTINCT round(ENC_LENGTH_MIN,3) ENC_LENGTH_MAX FROM V_END_CUST_ORD_ePA
      WHERE ENC_CD_EPA=:plant
      AND ENC_ST_ORDER='A'
      )
      ORDER BY 1 DESC
          
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getIdiaList = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_IDIA,3) ENC_IDIA FROM V_END_CUST_ORD_ePA
    WHERE ENC_CD_EPA=:plant
    AND ENC_ST_ORDER='A'
    ORDER BY 1 DESC
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getDIdiaList = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT EOM_IDIA idia
    FROM v_epa_prodn , V_TEMP_ALLOTMENT
    WHERE EOM_CD_ePA = TMA_CD_EPA
    AND eom_cd_epa = :plant
    AND (eom_cd_status = 'VM' OR eom_cd_status LIKE '%B')
    AND EOM_cD_STATUS NOT IN ('VB','WB')
    AND EOM_ID_BATCH = TMA_ID_BATCH
    ORDER BY 1 DESC
      `;
    const binds = {
      plant: plant
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getOrderType = async (req: any) => {
  try {
    const sql = `select cd_value from v_codes where cd_type='TB003'`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getCoilList = async (req: any) => {
  try {
    let sql = ``;
    if (req.body.type === 'SFG') {
      sql = `
      SELECT DISTINCT TMM_SFG_MAT MATERIAL, TMM_SFG_MAT_DESC MATERIAL_DEC FROM V_TUB_MATL_MAPPING
      WHERE TMM_CD_EPA = :plant
      AND TMM_FG_MAT  = :material
      AND TMM_RM_MAT  = NVL(:Mat,TMM_RM_MAT)
      `
    }
    if (req.body.type === 'RM') {
      sql = `
      SELECT DISTINCT TMM_RM_MAT MATERIAL, TMM_RM_MAT_DESC MATERIAL_DEC FROM V_TUB_MATL_MAPPING
      WHERE TMM_CD_EPA = :plant
      AND TMM_FG_MAT  = :material
      AND  TMM_SFG_MAT = NVL(:Mat,TMM_SFG_MAT)
      `
    }
    const binds = {
      plant: req.body.plant,
      material: req.body.material,
      Mat: req.body.Mat,
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const checkCEWProduct = async (plant: string, FG_Mat: string) => {
    try {
      //console.log("HEllo CEW PROD repo");//remove
      const sql = `SELECT
      pph_product_nm
  FROM
      v_fg_route_mapping,
      v_epa_proc_path
  WHERE
      frm_cd_epa = :plant
      AND frm_fg_mat = :FG_Mat
      AND frm_cd_epa = pph_cd_epa
      AND frm_route = pph_cd_proc_path`;
      const binds = {
        plant: plant,
        FG_Mat: FG_Mat
      }
      return await query.executeQuery(sql, binds);
    } catch (error) {
      //console.log(error);
      throw new Error.InternalServerError("Error!");
    }
  };

  
export const GetWIPCoilsMatchingWithTDCBOM = async (Plant: any, OrdTdc: any) => {
    try {
      const sql = `SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
      EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC             
     ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
     ,EOM_NO_CAST CAST_NO
     ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
      FROM V_EPA_PRODN A
      WHERE EOM_CD_EPA = :Plant
      AND (EOM_CD_STATUS like '%F' AND EOM_CD_STATUS NOT IN ('VF') )
      AND (EOM_ID_BATCH <> EOM_ID_FIRST_PAR or eom_id_batch like 'MG%')
      AND (
        EOM_TDC_ACTL = :OrdTdc
        OR EOM_TDC_ACTL IN (
          SELECT
            CD_DESC1
          FROM
            V_CODES
          WHERE
            CD_TYPE = 'TB030C'
            AND CD_VALUE = :OrdTdc
        )
      )
      AND NVL(EOM_CD_ST_ACTL,'1') IN ('8','5','1') -- DIVERETED AND ADDITIONAL PROCESS
  UNION 
  SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
      EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC             
      ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
      ,EOM_NO_CAST CAST_NO
      ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
      FROM V_EPA_PRODN A
      WHERE EOM_CD_EPA = :Plant
      AND (EOM_CD_STATUS like '%F' AND EOM_CD_STATUS NOT IN ('VF') )
      AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR
      AND EOM_CD_ST_ACTL = '3' -- DOWNGRADED
      AND EOM_NO_MATNR
      in
      (
      select TMM_SFG_MAT from v_TUB_MATL_MAPPING WHERE TMM_STATUS='A' AND TMM_CD_EPA = EOM_CD_EPA AND TMM_FG_MAT in
          (
          select ENC_NO_MATNR from V_END_CUST_ORD_EPA
              WHERE ENC_CD_EPA = EOM_CD_EPA
              AND ENC_ST_ORDER='A'
              AND ENC_NO_TDC = :OrdTdc
          )
      )
  UNION
   SELECT EOM_CD_EPA,EOM_ID_BATCH BATCH_ID, EOM_CD_CURR_PROC CURRENT_PROC,  EOM_CD_STATUS STATUS, EOM_MS_GROSS_CAL ACT_BATCH_WT, ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS,ROUND(decode(EOM_UOM,'KG',EOM_MS_GROSS_CAL/1000,EOM_MS_GROSS_CAL),3) MASS1, EOM_ODIA ODIA, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, EOM_SEC2 WIDTH,
      EOM_TDC_ACTL TDC, EOM_CD_EPA EPA_CODE, EOM_ID_ORD_CUS_AIM PREV_ORDER, EOM_ID_ITM_CUS_AIM PREV_ITEM , EOM_CD_QLTY_ACTL , EOM_NO_MATNR MAT_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR= EOM_NO_MATNR) MAT_DESC
      ,decode(EOM_CD_ST_ACTL,'1','Prime',2,'Partial Scrapped','3','Downgraded','5', 'Additional Process','8','Diverted','9','Scrapped','Prime') PROCESSING_FLAG
      ,EOM_NO_CAST CAST_NO
      ,ROUND (SYSDATE-EOM_TS_CREATION) Batch_Age
      FROM V_EPA_PRODN A
      WHERE EOM_CD_EPA = :Plant
      AND EOM_CD_STATUS ='WF'
      AND EOM_ID_BATCH <> EOM_ID_FIRST_PAR
      AND EOM_NO_MATNR
      in
      (
      select TMM_FG_MAT from v_TUB_MATL_MAPPING WHERE TMM_STATUS='A' AND TMM_CD_EPA = EOM_CD_EPA AND TMM_FG_MAT in
          (
          select ENC_NO_MATNR from V_END_CUST_ORD_EPA
              WHERE ENC_CD_EPA = EOM_CD_ePA
              AND ENC_ST_ORDER='A'
              AND ENC_NO_TDC = :OrdTdc
          )
      )
  ORDER BY EOM_CD_EPA,BATCH_ID`;
      let binds = {
        Plant: Plant,
        OrdTdc: OrdTdc
      }
      return await query.executeQuery(sql, binds);
    } catch (error) {
      throw new Error.InternalServerError("Error!");
    }
  };

  export const getFGDelink = async (
    plant: any,
    batch: any,
    orderId: any,
    item: any
  ) => {
  
    try {
  
      let sql = `SELECT EOM_CD_EPA, EOM_ID_BATCH BATCH_ID,EOM_ID_PAR_COIL_NO PARENT_BATCH, EOM_ID_FIRST_PAR M_BATCH, EOM_CD_CURR_PROC CURRENT_PROC, EOM_CD_STATUS STATUS, EOM_CD_PROD PROD_CD, EOM_SEC1 THICK, 
      EOM_SEC2 WIDTH,EOM_LENGTH LENGTH, EOM_TDC_ACTL TDC, EOM_MS_GROSS_ACTL NET_WT, EOM_CD_EPA EPA_CODE, EOM_ID_ORDER_CUS ORDER_ID, EOM_ID_ORD_ITEM_CUS ORDER_ITEM,
      EOM_CD_QLTY_ACTL QLTY_ACTL, EOM_NO_MATNR MAT_NO, ( SELECT MAKTX FROM V_MAKT WHERE MANDT = '600' AND MATNR = EOM_NO_MATNR ) MAT_DESC, 
      TO_CHAR(EOM_TS_CREATION, 'DD-MON-YY HH24:MI:SS') PRODN_DT, EOM_OPER_ID PRODN_BY
      FROM V_EPA_PRODN A 
      WHERE EOM_CD_EPA = :PLANT
      AND EOM_CD_STATUS='WB'`;    
      let binds = {
        plant: plant
      }
      if (batch && batch != "") {
        sql += ` AND EOM_ID_BATCH = NVL(:batch,EOM_ID_BATCH) `;
        binds["batch"] = batch;
      }
  
      if (orderId && orderId != "") {
        sql += ` AND EOM_ID_ORDER_CUS = NVL(:orderId,EOM_ID_ORDER_CUS) `;
        binds["orderId"] = orderId;
      }
  
      if (item && item != "") {
        sql += ` AND EOM_ID_ORD_ITEM_CUS = NVL(:item,EOM_ID_ORD_ITEM_CUS) `;
        binds["item"] = item;
      }
      return await query.executeQuery(sql, binds);
    } catch (error) {
      throw new Error.InternalServerError("Error!");
    }
  };
  
  //updateFGDelink
  
  export const updateFGDelink = async (  
    EPA_CODE: any,
    BATCH_ID: any,  
    ORDER_ID: any,
    ORDER_ITEM: any,  
    personalNo: any
  ) => {
  
    try {
      const sql = `call C1CVB003 (
        LS_CD_EPA => :LS_CD_EPA,      
        LS_BATCH_ID => :LS_BATCH_ID,
        LS_ORDER_NO => :LS_ORDER_NO,
        LN_ITEM_NO => :LN_ITEM_NO,
        LS_OUT_FLAG => :LS_OUT_FLAG         
        )`;
      const binds = {
        LS_CD_EPA: EPA_CODE,      
        LS_BATCH_ID: BATCH_ID,
        LS_ORDER_NO: ORDER_ID,
        LN_ITEM_NO: ORDER_ITEM,
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