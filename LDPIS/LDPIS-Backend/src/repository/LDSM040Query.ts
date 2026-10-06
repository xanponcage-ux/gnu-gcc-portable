import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import { GetPlantPdf } from "./LDSM004Query";

export const GetProcDesc = async (Plant: any) => {
  try {
    const sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 and EPL_CD_PROCESS != 'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetCustDesc = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_CD_END_CUST,ENC_CD_END_CUST||' - '||ENC_CUST_NAME ENC_CUST_NAME FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA= :0 AND  ENC_ST_ORDER='A' AND TRIM(ENC_CD_END_CUST) IS NOT NULL ORDER BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CheckSCO = async (Plant: any, dt: any) => {
  try {
    let Result = "";
    const dt5 = ` Select LPAD(soi_no_end_matnr,18,0),LPAD(soi_no_inp_matnr,18,0) FROM  v_sco_order_item  WHERE soi_id_order = :ScoOrder And soi_no_item  =:ScoItem And  SOI_CD_EPA=:plant`;
    let binds = {
      Plant: Plant,
      ScoOrder: dt.ScoOrder1,
      ScoItem: dt.ScoItem1,
    };
    let dt5Qry = await query.executeQuery(dt5, binds);
    let ls_sco_end_matnr = dt5Qry;
    let ls_sco_inp_matnr = dt5Qry;
    // ls_sco_end_matnr = CInt(DT5.Rows(0)(0))
    // ls_sco_inp_matnr = CInt(DT5.Rows(0)(1))

    const dt1 =
      " Select  LPAD(eic_no_matnr,18,0) FROM  v_input_coil WHERE  eic_id_coil = (SELECT  LOM_id_first_par FROM  v_LDP_PRODN  WHERE LOM_id_batch = :Batch  And LOM_cd_epa=:plant) And eic_CD_EPA=:plant ";
    let bindsDt1 = {
      Plant: Plant,
      Batch: dt.Batch1,
    };
    let dt1Qry = await query.executeQuery(dt1, bindsDt1);
    let ls_coil_inp_matnr = dt1Qry;
    //ls_coil_inp_matnr = CInt(DT1.Rows(0)(0)) -3187452

    const dt2 =
      "SELECT LPAD(enc_no_matnr,18,0)  FROM  v_end_cust_ord_epa WHERE  enc_id_order  =:CustOrder AND  enc_no_item =:CustItem aND ENC_CD_EPA = :plant";
    let bindsDt2 = {
      Plant: Plant,
      CustOrder: dt.CustOrder1,
      CustItem: dt.CustItem1,
    };
    let dt2Qry = await query.executeQuery(dt2, bindsDt2);
    let ls_cust_no_matnr = dt2Qry;
    //ls_cust_no_matnr = CInt(DT2.Rows(0)(0)) - 2279504

    if (ls_sco_end_matnr != ls_cust_no_matnr) {
      Result =
        "N-For Batch ID -" +
        `${dt.Batch1}` +
        " Material No of SCO Order/Item:" +
        ls_sco_end_matnr +
        " and Material No of Cust Order/Item:" +
        ls_cust_no_matnr +
        " is Not matching,Please Check.";
    }

    if (ls_coil_inp_matnr != ls_sco_inp_matnr) {
      Result =
        "N-For Batch ID -" +
        dt.Batch1 +
        " Material No Mother coil: " +
        ls_coil_inp_matnr +
        "and input Material No of SCO no/item :" +
        ls_sco_inp_matnr +
        " is Not matching ,Please Check.";
    }
    return Result;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetOrderType = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA=:0 and ENC_ST_ORDER='A' ORDER  BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetTracking = async (Plant: any) => {
  try {
    const sql = `Select DISTINCT ENC_NO_TRACKING FROM  V_END_CUST_ORD_EPA WHERE  ENC_CD_EPA = : Plant AND ENC_ST_ORDER='A' And TRIM(ENC_NO_TRACKING) Is Not NULL ORDER  BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils = async (
  Plant: any,
  Process: any,
  Status: any,
  Batch: any,
  Order_Type: any,
  TDC: any,
  SchTyp: any,
  Order: any,
  Order_Item: any,
  Customer_code: any,
  SchDt_from: any,
  SchDt_To: any,
  Prdn_Dt: any,
  Tracking: any,
  WorkCenter: any,
  Odia: any,
  Idia: any,
  Thick: any
) => {
  try {
    let binds = {
      Plant: Plant,
      BatchID: Batch,
      Status: Status,
    };

    if (SchTyp != "1") {
      Object.assign(binds, { Status: "" });
    }

    let QrygetCoils = "";
    let QryWIP = "";

    if (SchTyp == "1") {
      QrygetCoils = `             
    select ENC_MARK_CUST_NAME Cust_Name,EWI_WRK_CENTER_NO Work_Cent,EWI_SFG_MATNR SFG_Material_No,
    NVL((SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR),' ')SFG_Material_Desc
      ,EWI_NO_MATNR GI_Material,EWI_ID_BATCH GI_Batch , EWI_MS_INPUT GI_Qnty,EWI_FG_MATNR FG_Matnr,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_FG_MATNR)FG_Matnr_Desc
      ,EWI_SEC2 Cust_OD,EWI_SEC1 Cust_Thk,EWI_LENGTH Cust_Length,EWI_ID_ORDER_CUS Cust_Ord, EWI_ID_ORD_ITEM_CUS Cust_Item, EWI_PLANNED_PROC Planned_Proc
      ,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_NO_MATNR) GI_Material_Desc
      ,(select LENGTH*1000 from v_ympct_tub_matl where mandt='600' and matnr=EWI_SFG_MATNR) MILL_LENGTH,
      0 No_of_Pieces, NVL(EWI_IDIA,0) IDIA,(select END_FINISH from v_ympct_tub_matl where mandt='600' and matnr=EWI_FG_MATNR) END_FINISH
      ,''ID_WRK_INST ,EWI_NO_TDC GRADE,LOM_CD_STATUS BATCH_STATUS, EWI_CD_STATUS PDI_STATUS  
      ,TO_CHAR(EWI_TS_CREATION,'DD-MON-YY HH24:MI:SS') CREATION_DT ,EWI_SCH_SHIFT SHIFT
      ,NVL(EWI_REMARKS, ' ') PLANNING_REMARKS
      , NVL((SELECT
        LISTAGG( nvl(tlm_sfg_thk, 0)
         || 'X'
         || nvl(tlm_sfg_length, 0)  ) multiple_len
     FROM
         v_tub_length_master a
     WHERE
         tlm_cd_epa = ewi_cd_epa
         AND tlm_sfg_od = (select OUT_DIA from v_ympct_tub_matl where mandt='600' AND MATNR = EWI_SFG_MATNR)
         AND tlm_fg_id = (
             SELECT
                 enc_idia fg_id
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND tlm_fg_od = (
             SELECT
                 enc_sec2_max fg_od
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND tlm_fg_thk = (
             SELECT
                 enc_sec1_max fg_thk
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND round(tlm_fg_length, 3) = (
             SELECT
                 enc_length_max fg_length
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )),' ') multiple_len
         ,nvl(substr((F_WIP_MATNR (a.ewi_cd_epa , a.ewi_id_batch)),1,18),' ') WIP_MAT,
         nvl(substr((F_WIP_MATNR (a.ewi_cd_epa , a.ewi_id_batch)),20,200),' ') WIP_MAT_DESC
         ,LOM_no_cast CAST_NO
      FROM v_work_inst a, v_LDP_PRODN b, v_epa_schedule, v_end_cust_ord_epa
          WHERE ewi_id_batch = LOM_id_batch
            --AND ewi_id_batch = LOM_id_first_par
            AND ewi_cd_epa = LOM_cd_epa
            AND ewi_cd_epa = eps_cd_epa
            AND ewi_id_schedule = eps_id_schedule
            AND ewi_cd_status <> 'RJ'
            AND ewi_id_schedule = eps_id_schedule
            AND ewi_cd_process = eps_cd_process
            AND ewi_cd_epa = :Plant
            AND ewi_cd_epa = enc_cd_epa(+)
            AND ewi_id_order_cus = enc_id_order(+)
            AND ewi_id_ord_item_cus = enc_no_item(+)
            AND ewi_id_batch LIKE NVL (:BatchID, '%')
            AND ewi_cd_status = NVL (:Status, 'CN')
            --AND LOM_cd_status LIKE '%C'
            AND LOM_cd_status IN (select cd_desc from v_codes where cd_type = 'TB028' and cd_value = ewi_cd_epa)
            AND LOM_cd_status <> 'WC'
            AND LOM_tdc_actl <> 'NULL'
            `;

      if (Order_Type != "") {
        QrygetCoils += " And ENC_ORDER_TYPE =NVL(:Order_Type, ENC_ORDER_TYPE)";
        Object.assign(binds, { Order_Type: Order_Type });
      }

      if (Order != "") {
        QrygetCoils +=
          " And EWI_ID_ORDER_CUS =NVL(:Order_ID, EWI_ID_ORDER_CUS)";
        Object.assign(binds, { Order_ID: Order });
      }

      if (Order_Item != "") {
        QrygetCoils +=
          " And EWI_ID_ORD_ITEM_CUS =NVL(:Order_Item, EWI_ID_ORD_ITEM_CUS)";
        Object.assign(binds, { Order_Item: Order_Item });
      }

      if (TDC != "") {
        QrygetCoils += " And ewi_no_tdc =NVL(:TDC, ewi_no_tdc)";
        Object.assign(binds, { TDC: TDC });
      }

      if (SchDt_from != "") {
        // QrygetCoils += " AND TRUNC(EPS_TS_SCHD_CRT) BETWEEN NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)) AND  NVL(:SchDt_To,NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)))"
        QrygetCoils +=
          " AND TO_CHAR(EWI_TS_CREATION,'DD-MON-YY') BETWEEN NVL(TO_CHAR(to_DATE(:SchDt_from,'DD-MON-YYYY'),'DD-MON-YY'),to_char(EWI_TS_CREATION,'DD-MON-YY')) AND  NVL(TO_CHAR(to_DATE(:SchDt_To,'DD-MON-YYYY'),'DD-MON-YY'),NVL(TO_CHAR(to_DATE(:SchDt_from,'DD-MON-YYYY'),'DD-MON-YY'),TO_CHAR(EWI_TS_CREATION,'DD-MON-YY')))";
        Object.assign(binds, { SchDt_from: SchDt_from });
        Object.assign(binds, { SchDt_To: SchDt_To });
      }

      if (Prdn_Dt != "") {
        QrygetCoils += " And EWI_SCH_REL_DT =NVL(:Prdn_Dt, EWI_SCH_REL_DT)";
        Object.assign(binds, { Prdn_Dt: Prdn_Dt });
      }

      if (Process != "") {
        QrygetCoils += " And EWI_CD_PROCESS =NVL(:Process, EWI_CD_PROCESS)";
        Object.assign(binds, { Process: Process });
      }

      if (Tracking != "") {
        QrygetCoils += " And ENC_NO_TRACKING =NVL(:Tracking, ENC_NO_TRACKING)";
        Object.assign(binds, { Tracking: Tracking });
      }

      if (Customer_code != "") {
        QrygetCoils +=
          " And ENC_CD_END_CUST =NVL(:Customer_code, ENC_CD_END_CUST)";
        Object.assign(binds, { Customer_code: Customer_code });
      }

      if (WorkCenter != "") {
        QrygetCoils +=
          " AND EWI_WRK_CENTER_NO = NVL(:WorkCenter,EWI_WRK_CENTER_NO)";
        Object.assign(binds, { WorkCenter: WorkCenter });
      }

      if (Odia != "") {
        QrygetCoils += " AND EWI_SEC2 = NVL(:Odia,EWI_SEC2)";
        Object.assign(binds, { Odia: Odia });
      }
      if (Idia != "") {
        QrygetCoils += " AND EWI_IDIA = NVL(:Idia,EWI_IDIA)";
        Object.assign(binds, { Idia: Idia });
      }
      if (Thick != "") {
        QrygetCoils += " AND EWI_SEC1 = NVL(:Thick,EWI_SEC1)";
        Object.assign(binds, { Thick: Thick });
      }

      QrygetCoils += ` order by GI_BATCH`;
      return await query.executeQuery(QrygetCoils, binds);
    }

    if (SchTyp == "2") {
      QryWIP = `            
    select ENC_MARK_CUST_NAME Cust_Name,EWI_WRK_CENTER_NO Work_Cent,EWI_SFG_MATNR SFG_Material_No,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR)SFG_Material_Desc
    ,EWI_NO_MATNR GI_Material,EWI_ID_BATCH GI_Batch , EWI_MS_PIECE_ACTL GI_Qnty,EWI_FG_MATNR FG_Matnr,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_FG_MATNR)FG_Matnr_Desc
    ,EWI_SEC2 Cust_OD,EWI_SEC1 Cust_Thk,EWI_LENGTH Cust_Length,EWI_ID_ORDER_CUS Cust_Ord, EWI_ID_ORD_ITEM_CUS Cust_Item, EWI_PLANNED_PROC Planned_Proc
    ,TO_CHAR(EPS_TS_SCHD_CRT,'DD-MON-YY HH24:MI:SS')CREATION_DT ,LOM_CD_SHIFT SHIFT, NVL(EWI_IDIA,0) IDIA
    , NVL( (SELECT
        LISTAGG( nvl(tlm_sfg_thk, 0)
         || 'X'
         || nvl(tlm_sfg_length, 0)  ) multiple_len
     FROM
         v_tub_length_master a
     WHERE
         tlm_cd_epa = ewi_cd_epa
         AND tlm_sfg_od = (select OUT_DIA from v_ympct_tub_matl where mandt='600' AND MATNR = EWI_SFG_MATNR)
         AND tlm_fg_id = (
             SELECT
                 enc_idia fg_id
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND tlm_fg_od = (
             SELECT
                 enc_sec2_max fg_od
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND tlm_fg_thk = (
             SELECT
                 enc_sec1_max fg_thk
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )
         AND round(tlm_fg_length, 3) = (
             SELECT
                 enc_length_max fg_length
             FROM
                 v_end_cust_ord_epa
             WHERE
                 enc_cd_epa = a.tlm_cd_epa
                 AND enc_id_order = EWI_ID_ORDER_CUS
                 AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                 AND enc_length_min = enc_length_max
         )),' ') multiple_len
         ,nvl(substr((F_WIP_MATNR (a.ewi_cd_epa , a.ewi_id_batch)),1,18),' ') WIP_MAT,
         nvl(substr((F_WIP_MATNR (a.ewi_cd_epa , a.ewi_id_batch)),20,200),' ') WIP_MAT_DESC
         ,EWI_NO_TDC GRADE,LOM_CD_STATUS BATCH_STATUS, EWI_CD_STATUS PDI_STATUS
         ,LOM_no_cast CAST_NO
         FROM v_work_inst a, v_LDP_PRODN b, v_epa_schedule, v_end_cust_ord_epa
          WHERE ewi_id_batch = LOM_id_batch
            AND ewi_id_batch <> LOM_id_first_par
            AND ewi_cd_epa = LOM_cd_epa
            AND ewi_cd_epa = eps_cd_epa
            AND ewi_id_schedule = eps_id_schedule
            AND ewi_cd_status <> 'RJ'
            AND ewi_id_schedule = eps_id_schedule
            AND ewi_cd_process = eps_cd_process
            AND ewi_cd_epa = :Plant
            AND ewi_cd_epa = enc_cd_epa(+)
            AND ewi_id_order_cus = enc_id_order(+)
            AND ewi_id_ord_item_cus = enc_no_item(+)
            AND ewi_id_batch LIKE NVL (:BatchID, '%')
            AND ewi_cd_status = NVL (:Status, 'CN')
            AND LOM_cd_status LIKE '%C'
            AND LOM_cd_status NOT IN (select cd_desc from v_codes where cd_type = 'TB028' and cd_value = ewi_cd_epa)
            AND LOM_cd_status <> 'WC'
            AND LOM_tdc_actl <> 'NULL'
    `;
      if (Order_Type != "") {
        QryWIP += " And ENC_ORDER_TYPE =NVL(:Order_Type, ENC_ORDER_TYPE)";
        Object.assign(binds, { Order_Type: Order_Type });
      }

      if (Order != "") {
        QryWIP += " And EWI_ID_ORDER_CUS =NVL(:Order_ID, EWI_ID_ORDER_CUS)";
        Object.assign(binds, { Order_ID: Order });
      }

      if (Order_Item != "") {
        QryWIP +=
          " And EWI_ID_ORD_ITEM_CUS =NVL(:Order_Item, EWI_ID_ORD_ITEM_CUS)";
        Object.assign(binds, { Order_Item: Order_Item });
      }

      if (TDC != "") {
        QryWIP += " And ewi_no_tdc =NVL(:TDC, ewi_no_tdc)";
        Object.assign(binds, { TDC: TDC });
      }

      if (SchDt_from != "") {
        QryWIP +=
          " AND TRUNC(EPS_TS_SCHD_CRT) BETWEEN NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)) AND  NVL(:SchDt_To,NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)))";
        Object.assign(binds, { SchDt_from: SchDt_from });
        Object.assign(binds, { SchDt_To: SchDt_To });
      }

      if (Prdn_Dt != "") {
        QryWIP += " And EWI_SCH_REL_DT =NVL(:Prdn_Dt, EWI_SCH_REL_DT)";
        Object.assign(binds, { Prdn_Dt: Prdn_Dt });
      }

      if (Process != "") {
        QryWIP += " And EWI_CD_PROCESS =NVL(:Process, EWI_CD_PROCESS)";
        Object.assign(binds, { Process: Process });
      }

      if (Tracking != "") {
        QryWIP += " And ENC_NO_TRACKING =NVL(:Tracking, ENC_NO_TRACKING)";
        Object.assign(binds, { Tracking: Tracking });
      }

      if (Customer_code != "") {
        QryWIP += " And ENC_CD_END_CUST =NVL(:Customer_code, ENC_CD_END_CUST)";
        Object.assign(binds, { Customer_code: Customer_code });
      }

      if (WorkCenter != "") {
        QrygetCoils +=
          " AND EWI_WRK_CENTER_NO = NVL(:WorkCenter,EWI_WRK_CENTER_NO),)";
        // Object.assign(binds, { Tracking: Tracking });
        Object.assign(binds, { WorkCenter: WorkCenter });
      }

      if (Odia != "") {
        QrygetCoils += " AND EWI_SEC2 = NVL(:Odia,EWI_SEC2)";
        Object.assign(binds, { Odia: Odia });
      }
      if (Thick != "") {
        QrygetCoils += " AND EWI_SEC1 = NVL(:Thick,EWI_SEC1)";
        Object.assign(binds, { Thick: Thick });
      }

      QryWIP += ` order by GI_BATCH`;
      return await query.executeQuery(QryWIP, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSlitCoilDetails = async (plant: any, mother_batch: any) => {
  try {
    // const sql = `select * from v_epa_random_dtls where erd_id_new_batch=:mother_batch`;
    const sql = `SELECT ERD_CD_EPA PLANT, ERD_ID_BATCH SLIT_COIL,ERD_BATCH_QTY SLIT_COIL_QTY, ERD_ID_NEW_BATCH MERGED_BATCH , ERD_NEW_BATCH_QTY MERGED_BATCH_QTY
        ,ERD_NO_MATNR FG_MATERIAL_NO , (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.ERD_NO_MATNR AND ROWNUM=1)FG_MATERIAL_DESC
        ,TO_CHAR(ERD_REC_CRT_DT) MERGE_DT ,ERD_REC_CRT_UID MERGED_BY_USER , decode(ERD_MOV_IND , 'B','COIL','F','FG','S','SFG','') MERGED_TYPE
        FROM V_EPA_RANDOM_DTLS A
        WHERE ERD_CD_EPA=:Plant
        AND ERD_REC_STATUS = 'A'
        AND ERD_MOV_IND = 'B'
        AND ERD_ID_NEW_BATCH =: mother_batch
        ORDER BY ERD_ID_NEW_BATCH, ERD_ID_BATCH`;
    let binds = {
      Plant: plant,
      mother_batch: mother_batch,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getWorkCenter = async (plant: any, process: any) => {
  try {
    const sql = `Select PLM_WCNT_CODE,PLM_WCNT_CODE||' - '|| PLM_WCNT_DESC PLM_WCNT_DESC from V_PROC_LINE_MACHINE where PLM_ACTIVE_STATUS = 'A' and PLM_CD_EPA =:0 and PLM_CD_PROCESS =nvl(:1,PLM_CD_PROCESS)`;
    let binds = [`${plant}`, `${process}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getTdcList = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT
        ewi_no_tdc
    FROM
        v_work_inst
    WHERE
        ewi_cd_status <> 'RJ'
        AND ewi_cd_epa = :plant
        AND TRIM(ewi_no_tdc) != ' '`;
    // let binds = [`${Plant}`];
    let binds = {
      plant: Plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCustData = async (
  Plant: any,
  Process: any,
  Status: any,
  Batch: any,
  Order_Type: any,
  TDC: any,
  SchTyp: any,
  Order: any,
  Order_Item: any,
  Customer_code: any,
  SchDt_from: any,
  SchDt_To: any,
  Prdn_Dt: any,
  Tracking: any,
  WorkCenter: any,
  Odia: any,
  Idia: any,
  Thick: any
) => {
  try {
    let binds = {
      Plant: Plant,
      BatchID: Batch,
      Status: Status,
    };

    if (SchTyp != "1") {
      Object.assign(binds, { Status: "" });
    }

    let QrygetCoils = "";
    let QryWIP = "";

    if (SchTyp == "1") {
      QrygetCoils = `             
            select ENC_MARK_CUST_NAME Cust_Name,EWI_WRK_CENTER_NO Work_Cent,EWI_SFG_MATNR SFG_Material_No,
            NVL((SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR),' ')SFG_Material_Desc
              ,EWI_NO_MATNR GI_Material,EWI_ID_BATCH GI_Batch , EWI_MS_INPUT GI_Qnty,EWI_FG_MATNR FG_Matnr,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_FG_MATNR)FG_Matnr_Desc
              ,EWI_SEC2 Cust_OD,EWI_SEC1 Cust_Thk,EWI_LENGTH Cust_Length,EWI_ID_ORDER_CUS Cust_Ord, EWI_ID_ORD_ITEM_CUS Cust_Item, EWI_PLANNED_PROC Planned_Proc
              ,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_NO_MATNR) GI_Material_Desc
              ,(select LENGTH*1000 from v_ympct_tub_matl where mandt='600' and matnr=EWI_SFG_MATNR) MILL_LENGTH,
              0 No_of_Pieces, NVL(EWI_IDIA,0) IDIA,(select END_FINISH from v_ympct_tub_matl where mandt='600' and matnr=EWI_FG_MATNR) END_FINISH
              ,(select GEOMETRY from v_ympct_tub_matl where mandt='600' and matnr=EWI_FG_MATNR) GEOMETRY
              ,(select SUR_FINISH from v_ympct_tub_matl where mandt='600' and matnr=EWI_FG_MATNR) SUR_FINISH
              ,''ID_WRK_INST ,EWI_NO_TDC GRADE,LOM_CD_STATUS BATCH_STATUS, EWI_CD_STATUS PDI_STATUS  
              ,TO_CHAR(EPS_TS_SCHD_CRT,'DD-MON-YY HH24:MI:SS') CREATION_DT ,EWI_SCH_SHIFT SHIFT
              ,NVL(EWI_REMARKS, ' ') PLANNING_REMARKS, ENC_NO_ITEM,ENC_ID_ORDER,b.LOM_SEC2 width, b.LOM_SEC1 Thick, b.LOM_Tdc_Actl TDC, nvl(trim(b.LOM_id_op_scrap),a.ewi_rec_crt_by) userid
              ,EWI_PRIORITY PRIORITY,DECODE(UPPER(ENC_SALES_QTY_UOM),'NOS',ENC_SALES_QTY,0) ORDR_QTY_NUM,DECODE(UPPER(ENC_SALES_QTY_UOM),'MTR',ENC_SALES_QTY,0) ORDR_QTY_METER 
             , (ENC_ORD_QUANTITY*1000) ORD_QTY ,(SELECT PPH_PRODUCT FROM V_EPA_PROC_PATH
               WHERE PPH_CD_EPA=LOM_CD_EPA AND PPH_CD_PROC_PATH=LOM_PLANNED_PROC AND ROWNUM= 1) TUBE_TYPE,LOM_NO_CAST RM_HEAT_NO,
              (SELECT EIC_SOURCE_STOR_LOC FROM V_INPUT_COIL WHERE EIC_CD_EPA = EWI_CD_EPA AND EIC_ID_COIL = EWI_ID_BATCH) RM_PHY_LOC
              , NVL((SELECT
                LISTAGG( nvl(tlm_sfg_thk, 0)
                 || 'X'
                 || nvl(tlm_sfg_length, 0)  ) multiple_len
             FROM
                 v_tub_length_master a
             WHERE
                 tlm_cd_epa =ewi_cd_epa
                 AND tlm_sfg_od = (select OUT_DIA from v_ympct_tub_matl where mandt='600' AND MATNR = EWI_SFG_MATNR)
                 AND tlm_fg_id = (
                     SELECT
                         enc_idia fg_id
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND tlm_fg_od = (
                     SELECT
                         enc_sec2_max fg_od
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND tlm_fg_thk = (
                     SELECT
                         enc_sec1_max fg_thk
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND round(tlm_fg_length, 3) = (
                     SELECT
                         enc_length_max fg_length
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )),' ') multiple_len,LOM_no_cast CAST_NO
              FROM v_work_inst a, v_LDP_PRODN b, v_epa_schedule, v_end_cust_ord_epa
                  WHERE ewi_id_batch = LOM_id_batch
                    AND ewi_id_batch = LOM_id_first_par
                    AND ewi_cd_epa = LOM_cd_epa
                    AND ewi_cd_epa = eps_cd_epa
                    AND ewi_id_schedule = eps_id_schedule
                    AND ewi_cd_status <> 'RJ'
                    AND ewi_id_schedule = eps_id_schedule
                    AND ewi_cd_process = eps_cd_process
                    AND ewi_cd_epa = :Plant
                    AND ewi_cd_epa = enc_cd_epa(+)
                    AND ewi_id_order_cus = enc_id_order(+)
                    AND ewi_id_ord_item_cus = enc_no_item(+)
                    AND ewi_id_batch LIKE NVL (:BatchID, '%')
                    AND ewi_cd_status = NVL (:Status, 'CN')
                    AND LOM_cd_status LIKE '%C'
                    AND LOM_cd_status <> 'WC'
                    AND LOM_tdc_actl <> 'NULL'
            `;

      if (Order_Type != "") {
        QrygetCoils += " And ENC_ORDER_TYPE =NVL(:Order_Type, ENC_ORDER_TYPE)";
        Object.assign(binds, { Order_Type: Order_Type });
      }

      if (Order != "") {
        QrygetCoils +=
          " And EWI_ID_ORDER_CUS =NVL(:Order_ID, EWI_ID_ORDER_CUS)";
        Object.assign(binds, { Order_ID: Order });
      }

      if (Order_Item != "") {
        QrygetCoils +=
          " And EWI_ID_ORD_ITEM_CUS =NVL(:Order_Item, EWI_ID_ORD_ITEM_CUS)";
        Object.assign(binds, { Order_Item: Order_Item });
      }

      if (TDC != "") {
        QrygetCoils += " And ewi_no_tdc =NVL(:TDC, ewi_no_tdc)";
        Object.assign(binds, { TDC: TDC });
      }

      if (SchDt_from != "") {
        QrygetCoils +=
          " AND TRUNC(EPS_TS_SCHD_CRT) BETWEEN NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)) AND  NVL(:SchDt_To,NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)))";
        Object.assign(binds, { SchDt_from: SchDt_from });
        Object.assign(binds, { SchDt_To: SchDt_To });
      }

      if (Prdn_Dt != "") {
        QrygetCoils += " And EWI_SCH_REL_DT =NVL(:Prdn_Dt, EWI_SCH_REL_DT)";
        Object.assign(binds, { Prdn_Dt: Prdn_Dt });
      }

      if (Process != "") {
        QrygetCoils += " And EWI_CD_PROCESS =NVL(:Process, EWI_CD_PROCESS)";
        Object.assign(binds, { Process: Process });
      }

      if (Tracking != "") {
        QrygetCoils += " And ENC_NO_TRACKING =NVL(:Tracking, ENC_NO_TRACKING)";
        Object.assign(binds, { Tracking: Tracking });
      }

      if (Customer_code != "") {
        QrygetCoils +=
          " And ENC_CD_END_CUST =NVL(:Customer_code, ENC_CD_END_CUST)";
        Object.assign(binds, { Customer_code: Customer_code });
      }

      if (WorkCenter != "") {
        QrygetCoils +=
          " AND EWI_WRK_CENTER_NO = NVL(:WorkCenter,EWI_WRK_CENTER_NO)";
        Object.assign(binds, { WorkCenter: WorkCenter });
      }

      QrygetCoils += ` order by GI_BATCH`;
      return await query.executeQuery(QrygetCoils, binds);
    }

    if (SchTyp == "2") {
      QryWIP = `            
            select ENC_MARK_CUST_NAME Cust_Name,EWI_WRK_CENTER_NO Work_Cent,EWI_SFG_MATNR SFG_Material_No,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR)SFG_Material_Desc
            ,EWI_NO_MATNR GI_Material,EWI_ID_BATCH GI_Batch , EWI_MS_INPUT GI_Qnty,EWI_FG_MATNR FG_Matnr,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=EWI_SFG_MATNR)FG_Matnr_Desc
            ,EWI_SEC2 Cust_OD,EWI_SEC1 Cust_Thk,EWI_LENGTH Cust_Length,EWI_ID_ORDER_CUS Cust_Ord, EWI_ID_ORD_ITEM_CUS Cust_Item, EWI_PLANNED_PROC Planned_Proc
            ,TO_CHAR(EPS_TS_SCHD_CRT,'DD-MON-YY HH24:MI:SS')CREATION_DT ,LOM_CD_SHIFT SHIFT
            ,(select SUR_FINISH from v_ympct_tub_matl where mandt='600' and matnr=EWI_FG_MATNR) SUR_FINISH
            ,NVL(EWI_REMARKS, ' ') PLANNING_REMARKS, ENC_NO_ITEM,ENC_ID_ORDER,b.LOM_SEC2 width, b.LOM_SEC1 Thick, b.LOM_Tdc_Actl TDC, NVL(EWI_IDIA,0) IDIA, b.LOM_ID_OP_SCRAP userId
            ,EWI_PRIORITY PRIORITY,DECODE(UPPER(ENC_SALES_QTY_UOM),'NOS',ENC_SALES_QTY,0) ORDR_QTY_NUM,DECODE(UPPER(ENC_SALES_QTY_UOM),'MTR',ENC_SALES_QTY,0) ORDR_QTY_METER 
             , (ENC_ORD_QUANTITY*1000) ORD_QTY ,(SELECT PPH_PRODUCT FROM V_EPA_PROC_PATH
               WHERE PPH_CD_EPA=LOM_CD_EPA AND PPH_CD_PROC_PATH=LOM_PLANNED_PROC AND ROWNUM= 1) TUBE_TYPE,LOM_NO_CAST RM_HEAT_NO,
              (SELECT EIC_SOURCE_STOR_LOC FROM V_INPUT_COIL WHERE EIC_CD_EPA = EWI_CD_EPA AND EIC_ID_COIL = EWI_ID_BATCH) RM_PHY_LOC
            ,  NVL( (SELECT
                LISTAGG( nvl(tlm_sfg_thk, 0)
                 || 'X'
                 || nvl(tlm_sfg_length, 0)  ) multiple_len
             FROM
                 v_tub_length_master a
             WHERE
                 tlm_cd_epa = ewi_cd_epa
                 AND tlm_sfg_od = (select OUT_DIA from v_ympct_tub_matl where mandt='600' AND MATNR = EWI_SFG_MATNR)
                 AND tlm_fg_id = (
                     SELECT
                         enc_idia fg_id
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND tlm_fg_od = (
                     SELECT
                         enc_sec2_max fg_od
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND tlm_fg_thk = (
                     SELECT
                         enc_sec1_max fg_thk
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )
                 AND round(tlm_fg_length, 3) = (
                     SELECT
                         enc_length_max fg_length
                     FROM
                         v_end_cust_ord_epa
                     WHERE
                         enc_cd_epa = a.tlm_cd_epa
                         AND enc_id_order = EWI_ID_ORDER_CUS
                         AND enc_no_item = EWI_ID_ORD_ITEM_CUS
                         AND enc_length_min = enc_length_max
                 )),' ') multiple_len,LOM_no_cast CAST_NO
              FROM v_work_inst a, v_LDP_PRODN b, v_epa_schedule, v_end_cust_ord_epa
                  WHERE ewi_id_batch = LOM_id_batch
                    AND ewi_id_batch <> LOM_id_first_par
                    AND ewi_cd_epa = LOM_cd_epa
                    AND ewi_cd_epa = eps_cd_epa
                    AND ewi_id_schedule = eps_id_schedule
                    AND ewi_cd_status <> 'RJ'
                    AND ewi_id_schedule = eps_id_schedule
                    AND ewi_cd_process = eps_cd_process
                    AND ewi_cd_epa = :Plant
                    AND ewi_cd_epa = enc_cd_epa(+)
                    AND ewi_id_order_cus = enc_id_order(+)
                    AND ewi_id_ord_item_cus = enc_no_item(+)
                    AND ewi_id_batch LIKE NVL (:BatchID, '%')
                    AND ewi_cd_status = NVL (:Status, 'CN')
                    AND LOM_cd_status LIKE '%C'
                    AND LOM_cd_status <> 'WC'
                    AND LOM_tdc_actl <> 'NULL'
            `;
      if (Order_Type != "") {
        QryWIP += " And ENC_ORDER_TYPE =NVL(:Order_Type, ENC_ORDER_TYPE)";
        Object.assign(binds, { Order_Type: Order_Type });
      }

      if (Order != "") {
        QryWIP += " And EWI_ID_ORDER_CUS =NVL(:Order_ID, EWI_ID_ORDER_CUS)";
        Object.assign(binds, { Order_ID: Order });
      }

      if (Order_Item != "") {
        QryWIP +=
          " And EWI_ID_ORD_ITEM_CUS =NVL(:Order_Item, EWI_ID_ORD_ITEM_CUS)";
        Object.assign(binds, { Order_Item: Order_Item });
      }

      if (TDC != "") {
        QryWIP += " And ewi_no_tdc =NVL(:TDC, ewi_no_tdc)";
        Object.assign(binds, { TDC: TDC });
      }

      if (SchDt_from != "") {
        QryWIP +=
          " AND TRUNC(EPS_TS_SCHD_CRT) BETWEEN NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)) AND  NVL(:SchDt_To,NVL(:SchDt_from,TRUNC(EPS_TS_SCHD_CRT)))";
        Object.assign(binds, { SchDt_from: SchDt_from });
        Object.assign(binds, { SchDt_To: SchDt_To });
      }

      if (Prdn_Dt != "") {
        QryWIP += " And EWI_SCH_REL_DT =NVL(:Prdn_Dt, EWI_SCH_REL_DT)";
        Object.assign(binds, { Prdn_Dt: Prdn_Dt });
      }

      if (Process != "") {
        QryWIP += " And EWI_CD_PROCESS =NVL(:Process, EWI_CD_PROCESS)";
        Object.assign(binds, { Process: Process });
      }

      if (Tracking != "") {
        QryWIP += " And ENC_NO_TRACKING =NVL(:Tracking, ENC_NO_TRACKING)";
        Object.assign(binds, { Tracking: Tracking });
      }

      if (Customer_code != "") {
        QryWIP += " And ENC_CD_END_CUST =NVL(:Customer_code, ENC_CD_END_CUST)";
        Object.assign(binds, { Customer_code: Customer_code });
      }

      if (WorkCenter != "") {
        QrygetCoils +=
          " AND EWI_WRK_CENTER_NO = NVL(:WorkCenter,EWI_WRK_CENTER_NO),)";
        // Object.assign(binds, { Tracking: Tracking });
        Object.assign(binds, { WorkCenter: WorkCenter });
      }

      if (Odia != "") {
        QrygetCoils += " AND EWI_SEC2 = NVL(:Odia,EWI_SEC2)";
        Object.assign(binds, { Odia: Odia });
      }
      if (Thick != "") {
        QrygetCoils += " AND EWI_SEC1 = NVL(:Thick,EWI_SEC1)";
        Object.assign(binds, { Thick: Thick });
      }

      QryWIP += ` order by GI_BATCH`;

      return await query.executeQuery(QryWIP, binds);
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
