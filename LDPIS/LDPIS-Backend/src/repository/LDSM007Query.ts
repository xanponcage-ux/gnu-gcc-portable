import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getBUnitCd = async (plant: any) => {
  try {
    var sql;
    sql = `SELECT DISTINCT EPL_CD_COMP COMP_CODE , EPL_BUSINESS_UNIT BUSI_UNIT
     FROM V_EPA_PROC_LINE
     WHERE EPL_cD_EPA=:plant
     AND ROWNUM=1`;
    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetOrdTyp = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = :0`;
    let binds = [`${plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetProdCat = async (req: any) => {
  try {
    const sql = `Select distinct CD_DESC From v_codes Where cd_type='EPA339' ORDER BY 1`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetCustDesc = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_CD_END_CUST,ENC_CD_END_CUST||' - '||ENC_CUST_NAME ENC_CUST_NAME FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA= :0 AND  ENC_ST_ORDER='A' AND TRIM(ENC_CD_END_CUST) IS NOT NULL ORDER BY 1`;
    let binds = [`${plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

const dateFormat = (OrddtFr: string) => {
  const varDate = new Date(OrddtFr);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yyyy = varDate.getFullYear();
  let mm = varDate.getMonth(); // Months start at 0!
  let dd = varDate.getDate();
  let fdate: any = varDate.getDate();
  if (dd < 10) fdate = "0" + dd;
  return fdate + "-" + monthNames[mm].toUpperCase() + "-" + yyyy;
};

export const GetOrderDT = async (
  Customer: any,
  DispFr: any,
  DispTo: any,
  Item: any,
  MatNo: any,
  OrdStAs: any,
  OrdTyp: any,
  OrddtFr: any,
  OrddtTm: any,
  Order1: any,
  Plant: any,
  ThickFr: any,
  ThickTo: any,
  WidthFr: any,
  WidthTo: any
) => {
  try {
    var sql = `SELECT
    enc_cd_epa            plant,
    enc_id_order          orderid,
    enc_no_item           item,
    enc_order_type        ordtype,
    enc_ord_desc          description,
    enc_ord_quantity      ord_tonn,
    (
        SELECT
            nvl(SUM(nvl(LOM_ms_gross_cal, 0)), 0)
        FROM
            v_LDP_PRODN
        WHERE
            LOM_cd_epa = a.enc_cd_epa
            AND LOM_cd_status IN (
                'WB',
                'WC',
                'WS',
                'WT'
            )
            AND LOM_id_order_cus = a.enc_id_order
            AND LOM_id_ord_item_cus = a.enc_no_item
    ) dispatchable,
    (
        SELECT
            nvl(SUM(nvl(LOM_ms_gross_cal, 0)),0)
        FROM
            v_LDP_PRODN
        WHERE
            LOM_cd_epa = a.enc_cd_epa And LOM_cd_status IN (
                'WL',
                'WH'
            )
            AND LOM_id_order_cus =A.enc_id_order
            AND LOM_id_ord_item_cus = a.enc_no_item
    ) dispatched,
    CASE enc_st_order
        WHEN 'A'   THEN
            'Active'
        WHEN 'C'   THEN
            'Closed'
        ELSE
            'Error'
    END ord_status,
    enc_cd_end_cust       customer_code,
    enc_cust_name         customer_name,
    enc_cd_prod           prod_cd,
    enc_cd_qlty           qltycd,
    enc_sec1_min          thick,
    enc_sec2_min          width,
    enc_length_min        ordlength,
    enc_no_tdc            tdc,
    enc_cd_grade          grade,   
    enc_no_matnr          matnr,
    NVL((SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=ENC_NO_MATNR AND ROWNUM=1),(select TMM_FG_MAT_DESC from V_TUB_MATL_MAPPING where TMM_CD_EPA = ENC_CD_EPA and tmm_fg_mat = ENC_NO_MATNR AND rownum = 1)) matnrdesc,
    TO_CHAR(enc_dt_ord_create, 'DD-MON-YYYY') ord_crt_dt,
    TO_CHAR(enc_dt_delv, 'DD-MON-YYYY') deliverydate,
    enc_despatch_wk       dispatchweek,
    'NA' ord_rel_dt,
    enc_no_tracking       trackingno,
    enc_cd_ship_to_prty   shiptopartyid,
    enc_ship_to_prty_desc,
    enc_min_piece_wt      minwt,
    enc_max_piece_wt      maxwt,
    enc_aim_piece_wt      aimwt,
    enc_idia,
    enc_odia,
    enc_road_dest,
    enc_rail_dest,
    0 extratoorder,
    enc_mark_cust,
    enc_mark_cust_name,
    TO_CHAR(enc_dt_ord_close, 'DD-MON-YYYY') orderclosedt,
    TO_CHAR(enc_last_ord_dwnld, 'DD-MON-YYYY') orderdwnlddt,
    enc_mk_spec           vendorpanel,
    0 orderage,
    enc_sec1_min          minthick,
    enc_sec1_max          maxthick,
    enc_sec1_act          actthick,
    enc_sec2_min          minwidth,
    enc_sec2_max          maxwidth,
    enc_sec2_act          actwidth,
    enc_sec3_min          minlength,
    enc_sec3_max          maxlength,
    enc_sec3_act          actlength,
    enc_fl_toc            ordercolor,
    enc_buffer_size       buffersize,
    enc_inv_value         inventoryvalue,
    enc_sales_qty  sales_qty,
    enc_sales_qty_uom sales_qty_uom,
    enc_matnr_spec spec,
    ENC_GEOMETRY geometry, 
    ENC_SUR_FINISH sur_finish, 
    ENC_END_FINISH end_finish
FROM
    v_end_cust_ord_epa a
WHERE
    enc_cd_epa = :plant `;
    let binds = {
      Plant: Plant,
    };
    if (Customer && Customer !== "") {
      sql += `AND  enc_cD_END_CUST =NVL( :Customer,enc_cD_END_CUST) `;
      binds["Customer"] = Customer;
    }
    if (DispFr && DispFr !== "") {
      sql += `AND trunc(enc_dt_delv) >= nvl(:DispFr, enc_dt_delv) `;
      binds["DispFr"] = DispFr;
    }
    if (DispTo && DispTo !== "") {
      sql += `AND trunc(enc_dt_delv) <= nvl(:DispTo, enc_dt_delv) `;
      binds["DispTo"] = DispTo;
    }
    if (Item && Item !== "") {
      sql += `AND enc_no_item = nvl(:Item, enc_no_item) `;
      binds["Item"] = Item;
    }
    if (MatNo && MatNo !== "") {
      sql += `AND enc_no_matnr = lpad(nvl(:MatNo, enc_no_matnr), 18, '0') `;
      binds["MatNo"] = MatNo;
    }
    if (OrdStAs && OrdStAs !== "") {
      sql += `AND enc_st_order = :OrdStAs `;
      binds["OrdStAs"] = OrdStAs;
    }
    if (OrdTyp && OrdTyp !== "") {
      sql += `AND enc_order_type = nvl(:OrdTyp, enc_order_type) `;
      binds["OrdTyp"] = OrdTyp;
    }
    if (OrddtFr && OrddtFr !== "") {
      sql += `AND trunc(enc_dt_ord_create) >= nvl(:OrddtFr, enc_dt_ord_create) `;
      binds["OrddtFr"] = OrddtFr;
    }
    if (OrddtTm && OrddtTm !== "") {
      sql += `AND trunc(enc_dt_ord_create) <= nvl(:OrddtTm, enc_dt_ord_create) `;
      binds["OrddtTm"] = OrddtTm;
    }
    if (Order1 && Order1 !== "") {
      sql += `AND enc_id_order = lpad(nvl(:Order1, enc_id_order), 10, '0') `;
      binds["Order1"] = Order1;
    }

    if (ThickFr && ThickFr !== "") {
      sql += `AND enc_sec1_min >= nvl(:ThickFr, enc_sec1_min) `;
      binds["ThickFr"] = ThickFr;
    }
    if (ThickTo && ThickTo !== "") {
      sql += `AND enc_sec1_max <= nvl(:ThickTo, enc_sec1_max) `;
      binds["ThickTo"] = ThickTo;
    }
    if (WidthFr && WidthFr !== "") {
      sql += `AND enc_sec2_min >= nvl(:WidthFr, enc_sec2_min) `;
      binds["WidthFr"] = WidthFr;
    }
    if (WidthTo && WidthTo !== "") {
      sql += `AND enc_sec2_max <= nvl(:widthto, enc_sec2_max) `;
      binds["WidthFr"] = WidthFr;
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetOrderDT_Tubes = async (
  Customer: any,
  DispFr: any,
  DispTo: any,
  Item: any,
  MatNo: any,
  OrdStAs: any,
  OrdTyp: any,
  OrddtFr: any,
  OrddtTm: any,
  Order1: any,
  Plant: any,
  ThickFr: any,
  ThickTo: any,
  WidthFr: any,
  WidthTo: any,
  LengthFrm: any,
  LengthTo: any,
  SlitPlan: any
) => {
  try {
    var sql = `
    SELECT
        enc_cd_epa            plant,
        enc_id_order          orderid,
        enc_no_item           item,
        enc_order_type        ordtype,
        enc_ord_desc          description,
        enc_ord_quantity      ord_tonn,
        (
            SELECT
                nvl(SUM(nvl(LOM_ms_gross_cal, 0)), 0)
            FROM
                v_LDP_PRODN
            WHERE
                LOM_cd_epa = a.enc_cd_epa
                AND LOM_cd_status IN (
                    'WB',
                    'MB'
                )
                AND LOM_id_order_cus = a.enc_id_order
                AND LOM_id_ord_item_cus = a.enc_no_item
        ) dispatchable,
        (SELECT F_DISPATCH(A.ENC_CD_EPA,A.ENC_ID_ORDER,A.ENC_NO_ITEM) FROM DUAL) dispatched,
        CASE ENC_ST_ORDER
            WHEN 'A'   THEN
                'Active'
            WHEN 'C'   THEN
                'Closed'
            ELSE
                'Error'
        END ord_status,
        enc_cd_end_cust       customer_code,
        enc_cust_name         customer_name,
        enc_cd_prod           prod_cd,
        enc_cd_qlty           qltycd,
        enc_sec1_min          thick,
        enc_sec2_min          width,
        enc_length_min        ordlength,
        enc_no_tdc            tdc,
        enc_cd_grade          grade,        
        enc_no_matnr          matnr,
        NVL((SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=ENC_NO_MATNR AND ROWNUM=1),(select TMM_FG_MAT_DESC from V_TUB_MATL_MAPPING where TMM_CD_EPA = ENC_CD_EPA and tmm_fg_mat = ENC_NO_MATNR AND rownum = 1)) matnrdesc,
        TO_CHAR(enc_dt_ord_create, 'DD-MON-YYYY') ord_crt_dt,
        TO_CHAR(enc_dt_delv, 'DD-MON-YYYY') deliverydate,
        enc_despatch_wk       dispatchweek,
        'NA' ord_rel_dt,
        enc_no_tracking       trackingno,
        enc_cd_ship_to_prty   shiptopartyid,
        enc_ship_to_prty_desc,
        enc_min_piece_wt      minwt,
        enc_max_piece_wt      maxwt,
        enc_aim_piece_wt      aimwt,
        enc_idia,
        enc_odia,
        enc_road_dest,
        enc_rail_dest,
        0 extratoorder,
        enc_mark_cust,
        enc_mark_cust_name,
        TO_CHAR(enc_dt_ord_close, 'DD-MON-YYYY') orderclosedt,
        TO_CHAR(enc_last_ord_dwnld, 'DD-MON-YYYY') orderdwnlddt,
        enc_mk_spec           vendorpanel,
        round(SYSDATE - enc_dt_ord_create) orderage,
        enc_sec1_min          minthick,
        enc_sec1_max          maxthick,
        enc_sec1_act          actthick,
        enc_sec2_min          minwidth,
        enc_sec2_max          maxwidth,
        enc_sec2_act          actwidth,
        enc_sec3_min          minlength,
        enc_sec3_max          maxlength,
        enc_sec3_act          actlength,
        enc_fl_toc            ordercolor,
        enc_buffer_size       buffersize,
        enc_inv_value         inventoryvalue,
        enc_slit_plan,
        ENC_MATNR_SPEC spec ,
        ENC_MATNR_IP IP,
        enc_sales_qty  sales_qty,
        enc_sales_qty_uom sales_qty_uom,
        ENC_GEOMETRY geometry, 
        ENC_SUR_FINISH sur_finish, 
        ENC_END_FINISH end_finish
    FROM
        v_end_cust_ord_epa a
    WHERE
        enc_cd_epa = :Plant `;

    let binds = {
      Plant: Plant,
    };
    if (Customer && Customer !== "") {
      sql += `AND  enc_cD_END_CUST =NVL( :Customer,enc_cD_END_CUST) `;
      binds["Customer"] = Customer;
    }
    if (DispFr && DispFr !== "") {
      sql += `AND trunc(enc_dt_delv) >= nvl(:DispFr, enc_dt_delv) `;
      binds["DispFr"] = DispFr;
    }
    if (DispTo && DispTo !== "") {
      sql += `AND trunc(enc_dt_delv) <= nvl(:DispTo, enc_dt_delv) `;
      binds["DispTo"] = DispTo;
    }
    if (Item && Item !== "") {
      sql += `AND enc_no_item = nvl(:Item, enc_no_item) `;
      binds["Item"] = Item;
    }
    if (MatNo && MatNo !== "") {
      sql += `AND enc_no_matnr = lpad(nvl(:MatNo, enc_no_matnr), 18, '0') `;
      binds["MatNo"] = MatNo;
    }
    if (OrdStAs && OrdStAs !== "") {
      sql += `AND enc_st_order = :OrdStAs `;
      binds["OrdStAs"] = OrdStAs;
    }
    if (OrdTyp && OrdTyp !== "") {
      sql += `AND enc_order_type = nvl(:OrdTyp, enc_order_type) `;
      binds["OrdTyp"] = OrdTyp;
    }
    if (OrddtFr && OrddtFr !== "") {
      sql += `AND trunc(enc_dt_ord_create) >= nvl(:OrddtFr, enc_dt_ord_create) `;
      binds["OrddtFr"] = dateFormat(OrddtFr);
    }
    if (OrddtTm && OrddtTm !== "") {
      sql += `AND trunc(enc_dt_ord_create) <= nvl(:OrddtTm, enc_dt_ord_create) `;
      binds["OrddtTm"] = dateFormat(OrddtTm);
    }
    if (Order1 && Order1 !== "") {
      sql += `AND enc_id_order = lpad(nvl(:Order1, enc_id_order), 10, '0') `;
      binds["Order1"] = Order1;
    }
    if (
      (LengthFrm && Array.isArray(LengthFrm) && LengthFrm.length > 1) ||
      (LengthTo && Array.isArray(LengthTo) && LengthTo.length > 1)
    ) {
      if (LengthFrm && Array.isArray(LengthFrm) && LengthFrm.length > 1) {
        sql += `AND enc_length_max in(` + LengthFrm.join(",") + `) `;
        // binds["LengthFrm"] = LengthFrm.join(',');
      } else if (LengthTo && Array.isArray(LengthTo) && LengthTo.length > 1) {
        sql += `AND enc_length_max in(` + LengthTo.join(",") + `) `;
        // binds["LengthTo"] = LengthTo.join(',');
      }
    } else {
      if (LengthFrm.length > 1 && LengthFrm !== "") {
        sql += `AND enc_length_min >= nvl(:LengthFrm, enc_length_min) `;
        binds["LengthFrm"] = Array.isArray(LengthFrm)
          ? LengthFrm[0]
          : LengthFrm;
      }
      if (LengthTo.length > 1 && LengthTo !== "") {
        sql += `AND enc_length_max <= nvl(:LengthTo, enc_length_max) `;
        binds["LengthTo"] = Array.isArray(LengthTo) ? LengthTo[0] : LengthTo;
      }
    }

    if (
      (ThickFr && Array.isArray(ThickFr) && ThickFr.length > 1) ||
      (ThickTo && Array.isArray(ThickTo) && ThickTo.length > 1)
    ) {
      if (ThickFr && Array.isArray(ThickFr) && ThickFr.length > 1) {
        sql += `AND enc_sec1_max in(` + ThickFr.join(",") + `) `;
        //binds["ThickFr"] = ThickFr.join(',');
      } else if (ThickTo && Array.isArray(ThickTo) && ThickTo.length > 1) {
        sql += `AND enc_sec1_max in(` + ThickTo.join(",") + `) `;
        //binds["ThickTo"] = ThickTo.join(',');
      }
    } else {
      if (ThickFr && ThickFr?.length) {
        sql += `AND enc_sec1_min >= nvl(:ThickFr, enc_sec1_min) `;
        binds["ThickFr"] = Array.isArray(ThickFr) ? ThickFr[0] : ThickFr;
      }
      if (ThickTo.length && ThickTo?.length) {
        sql += `AND enc_sec1_max <= nvl(:ThickTo, enc_sec1_max) `;
        binds["ThickTo"] = Array.isArray(ThickTo) ? ThickTo[0] : ThickTo;
      }
    }

    if (
      (WidthFr && Array.isArray(WidthFr) && WidthFr.length > 1) ||
      (WidthTo && Array.isArray(WidthTo) && WidthTo.length > 1)
    ) {
      if (WidthFr && Array.isArray(WidthFr) && WidthFr.length > 1) {
        sql += `AND enc_sec2_max in(` + WidthFr.join(",") + `) `;
        // binds["WidthFr"] = WidthFr.join(',');
      } else if (WidthTo && Array.isArray(WidthTo) && WidthTo.length > 1) {
        sql += `AND enc_sec2_max in(` + WidthTo.join(",") + `) `;
        // binds["WidthTo"] = WidthTo.join(',');
      }
    } else {
      if (WidthFr && WidthFr?.length) {
        sql += `AND enc_sec2_min >= nvl(:WidthFr, enc_sec2_min) `;
        binds["WidthFr"] = Array.isArray(WidthFr) ? WidthFr[0] : WidthFr;
      }
      if (WidthTo && WidthTo?.length) {
        sql += `AND enc_sec2_max <= nvl(:WidthTo, enc_sec2_max) `;
        binds["WidthTo"] = Array.isArray(WidthTo) ? WidthTo[0] : WidthTo;
      }
      if (SlitPlan && SlitPlan !== "") {
        sql += `AND ENC_SLIT_PLAN = nvl(:SlitPlan, ENC_SLIT_PLAN) `;
        binds["SlitPlan"] = SlitPlan;
      }
    }
    console.log("sqlOrderBook", sql);
    console.log("binds", binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

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
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
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
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
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
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
