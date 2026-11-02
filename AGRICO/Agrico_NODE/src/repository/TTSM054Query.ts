import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getDispatchData = async (Plant: any, FrDate: any, ToDate: any, matno: any, OrderId: any, OrderItem: any, division:any) => {
  try {
    const flatMatno = Array.isArray(matno) ? matno.map(m => m[0]): [];
      let sql = `SELECT EOM_ODIA,EOM_SEC1,EOM_SEC2,EOM_LENGTH, EOM_CD_EPA,
       ENC_PRINT_SPEC MATERIAL_GROUP, EOM_NO_INVOICE, EOM_DT_INVOICE, EOM_ID_BATCH, NVL (A.EOM_NO_MATNR, ENC_NO_MATNR) FG_MATERIAL_NO,
       (SELECT MAKTX FROM V_MAKT WHERE MANDT = '600'AND MATNR = NVL (A.EOM_NO_MATNR, ENC_NO_MATNR) AND ROWNUM = 1) FG_MATERIAL_DESC,
       EOM_ID_ORDER_CUS,EOM_ID_ORD_ITEM_CUS ,EOM_MS_GROSS_ACTL,  EOM_MS_GROSS_CAL ,NVL (EOM_UOM, 'Ton') UOM,
       EOM_NO_PIECES,
       ENC_WO_PLANT,
       ENC_MARK_CUST,
       ENC_ROAD_DEST, 
       ENC_ROADDEST_DESC,
       ENC_CD_END_CUST ,
       SUBSTR(ENC_NO_MATNR1,6,2) DIVISION,
       ENC_ORDER_TYPE,  
       ENC_SALES_OFF,
       SUBSTR((ENC_CD_END_CUST ||'-'||ENC_CUST_NAME),1,255) RECVPLANT,
       '' "VechileNo",
       '' "DistributionChanel",'' "QtyNo",'' "SalesUnit",'' "RateUnit", '' "CamNo",'' "TotalValue",'' "Delivery"
  FROM V_EPA_PRODN A, V_END_CUST_ORD_EPA C
  WHERE A.EOM_CD_EPA = C.ENC_CD_EPA(+)
   AND A.EOM_ID_ORDER_CUS = C.ENC_ID_ORDER(+)
   AND A.EOM_ID_ORD_ITEM_CUS = C.ENC_NO_ITEM(+)
   AND EOM_CD_EPA =:PLANT
   AND EOM_CD_STATUS = NVL ('WL', EOM_CD_STATUS)
   AND TRUNC (EOM_DT_LOADING) BETWEEN TO_DATE (:FrDate, 'DD-MON-YYYY' ) AND TO_DATE (:ToDate, 'DD-MON-YYYY')
   AND A.EOM_ID_ORDER_CUS =NVL(:OrderID,EOM_ID_ORDER_CUS)
   AND A.EOM_ID_ORD_ITEM_CUS = NVL(:OrderItem,EOM_ID_ORD_ITEM_CUS)`;
   
   const binds:any = {
     Plant: Plant,
     FrDate: FrDate,
     ToDate: ToDate,
     OrderID: OrderId,
     OrderItem: OrderItem,
    };
  if (division && division!=='' ) {
     sql+= `AND SUBSTR(ENC_NO_MATNR1, 6, 2) = NVL(: division, SUBSTR(ENC_NO_MATNR1, 6, 2))`;
      binds.division = division
    }
    if (flatMatno.length > 0) {
      const placeholders = flatMatno.map((_, i) => `:m${i}`).join(",");
      sql += ` AND ENC_PRINT_SPEC IN (${placeholders})`;

      flatMatno.forEach((val, i) => {
        binds[`m${i}`] = val;
      });
    }

    console.log('sql->',sql);
    console.log('binds->',binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch dispatch details data."+err);
  }
};

export const getPlanningData = async (Plant: any, FrDate: any, ToDate: any, OrderId: any, OrderItem: any, division:any) => {
  try {
    let sql = `SELECT ENC_MARK_CUST_NAME CUST_NAME, EWI_WRK_CENTER_NO WORK_CENT,
       EWI_SFG_MATNR SFG_MATERIAL_NO,
       NVL ((SELECT MAKTX FROM V_MAKT WHERE MANDT = '600' AND MATNR = EWI_SFG_MATNR), ' ' ) SFG_MATERIAL_DESC,
       EWI_NO_MATNR GI_MATERIAL, EWI_ID_BATCH GI_BATCH, EWI_MS_INPUT GI_QNTY,
       EWI_FG_MATNR FG_MATNR,
       (SELECT MAKTX FROM V_MAKT WHERE MANDT = '600' AND MATNR = EWI_FG_MATNR) FG_MATNR_DESC,
       EWI_SEC2 CUST_OD, EWI_SEC1 CUST_THK, EWI_LENGTH CUST_LENGTH,
       EWI_ID_ORDER_CUS CUST_ORD, EWI_ID_ORD_ITEM_CUS CUST_ITEM,
       EWI_PLANNED_PROC PLANNED_PROC,
       (SELECT MAKTX  FROM V_MAKT WHERE MANDT = '600' AND MATNR = EWI_NO_MATNR) GI_MATERIAL_DESC,
       (SELECT LENGTH * 1000  FROM V_YMPCT_TUB_MATL WHERE MANDT = '600' AND MATNR = EWI_SFG_MATNR) MILL_LENGTH,
       B.EOM_NO_PIECES NO_OF_PIECES, NVL (EWI_IDIA, 0) IDIA,
       (SELECT END_FINISH FROM V_YMPCT_TUB_MATL WHERE MANDT = '600' AND MATNR = EWI_FG_MATNR) END_FINISH,
       EWI_ID_WRK_INST ID_WRK_INST, EWI_NO_TDC GRADE, EOM_CD_STATUS BATCH_STATUS,
       EWI_CD_STATUS PDI_STATUS,
       TO_CHAR (EWI_TS_CREATION, 'DD-MON-YY HH24:MI:SS') CREATION_DT,
       EWI_SCH_SHIFT SHIFT, NVL (EWI_REMARKS, ' ') PLANNING_REMARKS,
       NVL ((SELECT LISTAGG (   NVL (TLM_SFG_THK, 0) || 'X' || NVL (TLM_SFG_LENGTH, 0) ) MULTIPLE_LEN FROM V_TUB_LENGTH_MASTER A
              WHERE TLM_CD_EPA = EWI_CD_EPA
                AND TLM_SFG_OD = (SELECT OUT_DIA FROM V_YMPCT_TUB_MATL WHERE MANDT = '600' AND MATNR = EWI_SFG_MATNR)
                AND TLM_FG_ID = (SELECT ENC_IDIA FG_ID  FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = A.TLM_CD_EPA
                                   AND ENC_ID_ORDER = EWI_ID_ORDER_CUS
                                   AND ENC_NO_ITEM = EWI_ID_ORD_ITEM_CUS
                                   AND ENC_LENGTH_MIN = ENC_LENGTH_MAX)
                AND TLM_FG_OD = (SELECT ENC_SEC2_MAX FG_OD  FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = A.TLM_CD_EPA
                                   AND ENC_ID_ORDER = EWI_ID_ORDER_CUS
                                   AND ENC_NO_ITEM = EWI_ID_ORD_ITEM_CUS
                                   AND ENC_LENGTH_MIN = ENC_LENGTH_MAX)
                AND TLM_FG_THK = (SELECT ENC_SEC1_MAX FG_THK  FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = A.TLM_CD_EPA
                                   AND ENC_ID_ORDER = EWI_ID_ORDER_CUS
                                   AND ENC_NO_ITEM = EWI_ID_ORD_ITEM_CUS
                                   AND ENC_LENGTH_MIN = ENC_LENGTH_MAX)
                AND ROUND (TLM_FG_LENGTH, 3) =(SELECT ENC_LENGTH_MAX FG_LENGTH FROM V_END_CUST_ORD_EPA WHERE ENC_CD_EPA = A.TLM_CD_EPA
                                               AND ENC_ID_ORDER = EWI_ID_ORDER_CUS
                                               AND ENC_NO_ITEM = EWI_ID_ORD_ITEM_CUS
                                               AND ENC_LENGTH_MIN = ENC_LENGTH_MAX)),
          ' ' ) MULTIPLE_LEN,
       NVL (SUBSTR ((F_WIP_MATNR (A.EWI_CD_EPA, A.EWI_ID_BATCH)), 1, 18), ' ' ) WIP_MAT,
       NVL (SUBSTR ((F_WIP_MATNR (A.EWI_CD_EPA, A.EWI_ID_BATCH)), 20, 200), ' ' ) WIP_MAT_DESC,
       EOM_NO_CAST CAST_NO,
       EWI_TS_CREATION,
       SUBSTR(ENC_NO_MATNR1,6,2) DIVISION
  FROM V_WORK_INST_PLAN A, V_EPA_PRODN B, V_EPA_SCHEDULE, V_END_CUST_ORD_EPA
 WHERE EWI_ID_BATCH = EOM_ID_BATCH
   --AND EWI_ID_BATCH = EOM_ID_FIRST_PAR
   AND EWI_CD_EPA = EOM_CD_EPA
   AND EWI_CD_EPA = EPS_CD_EPA
   AND EWI_ID_SCHEDULE = EPS_ID_SCHEDULE
   AND EWI_CD_STATUS <> 'RJ'
   AND EWI_ID_SCHEDULE = EPS_ID_SCHEDULE
   AND EWI_CD_PROCESS = EPS_CD_PROCESS
   AND EWI_CD_EPA =:Plant
   AND EWI_CD_EPA = ENC_CD_EPA(+)
   AND EWI_ID_ORDER_CUS = ENC_ID_ORDER(+)
   AND EWI_ID_ORD_ITEM_CUS = ENC_NO_ITEM(+)
   AND EOM_CD_STATUS <> 'WC'
   AND EOM_TDC_ACTL <> 'NULL'
   AND EWI_TS_CREATION BETWEEN TO_DATE(:FrDate,'DD-MON-YYYY') AND  TO_DATE(:ToDate,'DD-MON-YYYY')
   AND EWI_ID_ORDER_CUS =NVL(:OrderID,EWI_ID_ORDER_CUS)
   AND EWI_ID_ORD_ITEM_CUS= NVL(:OrderItem,EWI_ID_ORD_ITEM_CUS)`;

   const binds:any = {
     Plant: Plant,
     FrDate: FrDate,
     ToDate: ToDate,
     OrderID:OrderId,
     OrderItem:OrderItem
    };

    if (division && division!=='' ) {
     sql+= `AND SUBSTR(ENC_NO_MATNR1,6,2)=NVL(:division,SUBSTR(ENC_NO_MATNR1,6,2))`;
      binds.division = division
    }
    console.log('sql->',sql);
    console.log('binds->',binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch dispatch details data."+err);
  }
};

export const getFGMAT = async (Plant: any) => {
  try {
    const sql = `select distinct ENC_PRINT_SPEC
    FROM 
        V_END_CUST_ORD_EPA
    WHERE 
        ENC_CD_EPA = :0
        AND ENC_ST_ORDER = 'A'
        AND ENC_SLIT_PLAN='TUBE'
        AND ENC_PRINT_SPEC IS NOT NULL`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


