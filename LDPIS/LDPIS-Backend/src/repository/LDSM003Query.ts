import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetCustDesc = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT EIC_MK_CUSTOMER FROM V_INPUT_COIL WHERE EIC_CD_EPA =:0`;
    let binds = [`${Plant}`];
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

export const getCoils = async (
  Plant: any,
  Status: any,
  BATCH_ID: any,
  TDC: any,
  RECVDTFROM: any,
  RECVDTTO: any,
  PROCDTFROM: any,
  PROCDTTO: any,
  ProdCd: any,
  QltyCd: any,
  Thick1: any,
  Thick2: any,
  Width1: any,
  Width2: any,
  Material: any,
  INVOICE: any,
  INVOICE_DTFROM: any,
  INVOICE_DTTO: any,
  coilType: any,
  Length1: any,
  Length2: any
) => {
  try {
    let binds = {
      Plant: Plant,
    };

    // var QrygetData = ` SELECT EIC_ID_COIL, EIC_CD_STATUS,(SELECT DISTINCT CD_DESC FROM   V_CODES WHERE CD_TYPE = 'E0001' AND    CD_VALUE = EIC_CD_STATUS AND ROWNUM=1 ) STATUS_DESC, EIC_NO_INVOICE, TO_CHAR(EIC_DT_INVOICE)EIC_DT_INVOICE,EIC_CD_PROD,EIC_CD_QLTY_ACTL,(select DISTINCT IQL_GRADE_DESC from v_quality where IQL_CD_QLTY = EIC_CD_QLTY_ACTL And ROWNUM=1) QUALITY_DESC,EIC_SEC1, EIC_SEC2,EIC_TDC_ACTL,(select case (SELECT YPG_PROD_GRP FROM V_COST_PROD_GRP  WHERE YPG_CD_PROD=EIC_CD_PROD) when 'G' then 'GC' else 'CRCA' end PROD_GRP from dual) PROD_GRP,(SELECT distinct LOM_PASSED_PROC	FROM V_LDP_PRODN WHERE LOM_ID_FIRST_PAR=EIC_ID_COIL AND ROWNUM = 1  AND LENGTH(LOM_PASSED_PROC) = (SELECT MAX(LENGTH(LOM_PASSED_PROC))  FROM V_LDP_PRODN  WHERE LOM_ID_FIRST_PAR=EIC_ID_COIL)) EPA_Passed_Proc,EIC_CD_EDGE, EIC_MS_PIECE_ACTL,(SELECT LOM_MS_GROSS_CAL FROM V_LDP_PRODN WHERE LOM_CD_EPA= EIC_CD_EPA And LOM_ID_BATCH = EIC_ID_COIL And ROWNUM = 1 And LOM_cd_status In ('VF','VB'))RESIDUAL_WEIGHT,'' MS_Scrap, ''PRIME,''ARISING,''BALANCE_SLIT_SEC,''PROCESSED_PRM,''GROSS_YILED,''PRIME_YIELD,EIC_WO_NO, EIC_ITEM_NO,(SELECT DISTINCT iwo_order_status FROM v_wo_master, v_wo_item WHERE  iwo_wo_no = iwi_wo_no And iwo_wo_no = EIC_WO_NO And iwi_item_no =EIC_ITEM_NO And ROWNUM=1)ORDER_STATUS,(SELECT DISTINCT ENC_ID_ORDER FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO=EIC_WO_NO 	AND   ENC_ITEM_NO=EIC_ITEM_NO AND ROWNUM =1) ORDER_NO,(SELECT DISTINCT ENC_NO_ITEM FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO= EIC_WO_NO And ENC_ITEM_NO = EIC_ITEM_NO And ROWNUM = 1) ORDER_ITEM,(SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO=EIC_WO_NO 	AND   ENC_ITEM_NO=EIC_ITEM_NO AND ROWNUM =1) ORDER_TYPE,EIC_NO_MATNR, TO_CHAR(EIC_DT_LOADING)EIC_DT_LOADING,(FLOOR(EIC_DT_LOADING - EIC_DT_INVOICE))TRANSIT_LEAD,''TIME,TO_CHAR(EIC_DT_PIECE_UPD)EIC_DT_PIECE_UPD,''BILLET,''BILLET_PIECE,EIC_CD_YRD,EIC_ID_LOC_X,EIC_ID_LOC_Y,EIC_ID_POS,EIC_REMARKS,(ROUND(EIC_DT_PIECE_UPD - EIC_DT_LOADING))PROC_DAYS,(ROUND(SYSDATE-EIC_DT_LOADING) ) INV_DAYS,(SELECT ROUND(SYSDATE-FHC_TS_REC_CREATE) FROM V_FULL_HARD_COILS WHERE FHC_ID_COIL = EIC_ID_COIL And ROWNUM = 1)AGE,( ROUND(SYSDATE-EIC_DT_LOADING))EPA_AGE,EIC_CD_EPA, EIC_ID_OP_DECSN, EIC_MARK_CUST, EIC_MK_CUSTOMER, EIC_CD_PLANT,(SELECT DISTINCT MAX(TRIM(REPLACE(CAD_DEF2_COMM,CHR(10),' '))) FROM  V_COIL_CARD  WHERE  CAD_ID_COIL = EIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM=1) SALVAGING_REMARKS,(SELECT DISTINCT MAX(TRIM(REPLACE(CAD_CD_TOP_REMARKS, Chr(10),' '))) FROM  V_COIL_CARD  WHERE  CAD_ID_COIL = EIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM=1) TOP_REMARKS, (SELECT DISTINCT MAX(TRIM(REPLACE(CAD_CD_BOT_REMARKS,CHR(10),' '))) FROM  V_COIL_CARD  WHERE  CAD_ID_COIL = EIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM=1) BOTTOM_REMARKS,(SELECT DISTINCT  MAX(TRIM(REPLACE(CAD_FILE_NAME, Chr(10),' '))) FROM  V_COIL_CARD  WHERE  CAD_ID_COIL = EIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM=1) FILE_NAME,(SELECT DISTINCT  MAX(CAD_LST_WRK_CEN) FROM  V_COIL_CARD  WHERE  CAD_ID_COIL = EIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM=1) WORK_CENTER,(SELECT DISTINCT CCL_PASSED_PROC	FROM V_COLD_COIL WHERE CCL_ID_COIL = EIC_ID_COIL And ROWNUM = 1)PASSED_PROC,(SELECT DISTINCT LOM_SCRAP_REMARKS FROM V_LDP_PRODN  WHERE LOM_ID_BATCH=EIC_ID_COIL  AND LOM_CD_EPA =EIC_CD_EPA AND ROWNUM=1)SCRAP_REMARKS, EIC_VEHICAL_NO As Vehical_No  FROM V_INPUT_COIL a WHERE EIC_CD_EPA=:Plant  `;
    var QrygetData = `
        SELECT NVL(EIC_ID_COIL , ' ') EIC_ID_COIL, NVL(EIC_CD_STATUS , ' ') EIC_CD_STATUS, 
        NVL(( SELECT DISTINCT CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND CD_VALUE = EIC_CD_STATUS AND ROWNUM = 1 ) , ' ') STATUS_DESC, 
        NVL( EIC_NO_INVOICE , ' ') EIC_NO_INVOICE, NVL( EIC_NO_CAST , ' ') EIC_NO_CAST, NVL(TO_CHAR(EIC_DT_INVOICE) , ' ') EIC_DT_INVOICE, 
        NVL(EIC_CD_PROD , ' ') EIC_CD_PROD, NVL(EIC_CD_QLTY_ACTL , ' ') EIC_CD_QLTY_ACTL,
        NVL(( SELECT DISTINCT IQL_GRADE_DESC FROM V_QUALITY WHERE IQL_CD_QLTY = EIC_CD_QLTY_ACTL AND ROWNUM = 1) , ' ') QUALITY_DESC, 
        NVL(EIC_SEC1 , 0) EIC_SEC1, NVL(EIC_SEC2 , 0) EIC_SEC2, NVL(EIC_LENGTH , 0) EIC_LENGTH, NVL(EIC_TDC_ACTL , ' ') EIC_TDC_ACTL, 
        ''PROD_GRP,
        NVL(( SELECT DISTINCT LOM_PASSED_PROC FROM V_LDP_PRODN WHERE LOM_ID_FIRST_PAR = EIC_ID_COIL AND ROWNUM = 1 AND LENGTH(LOM_PASSED_PROC) = ( SELECT MAX(LENGTH(LOM_PASSED_PROC)) FROM V_LDP_PRODN WHERE LOM_ID_FIRST_PAR = EIC_ID_COIL ) ) , ' ' ) EPA_PASSED_PROC, 
        NVL( EIC_CD_EDGE , ' ' ) EIC_CD_EDGE, 
        NVL(EIC_MS_PIECE_ACTL , 0) EIC_MS_PIECE_ACTL, 
        NVL(( SELECT LOM_MS_GROSS_CAL FROM V_LDP_PRODN WHERE LOM_CD_EPA = EIC_CD_EPA AND LOM_ID_BATCH = EIC_ID_COIL AND ROWNUM = 1 AND LOM_CD_STATUS IN ( 'VF', 'VB' ) ) , 0) RESIDUAL_WEIGHT, 
        NVL((SELECT DISTINCT LOM_MS_SCRAP FROM V_LDP_PRODN WHERE LOM_ID_BATCH = EIC_ID_COIL AND LOM_CD_EPA = EIC_CD_EPA AND ROWNUM = 1),0) MS_SCRAP, NVL('' , ' ' ) PRIME, NVL('' , ' ') ARISING, 
        NVL('' , ' ') BALANCE_SLIT_SEC, NVL('' , ' ') PROCESSED_PRM, NVL('' , ' ') GROSS_YILED, NVL('' , ' ') PRIME_YIELD, NVL(EIC_WO_NO , ' ') EIC_WO_NO, NVL(EIC_ITEM_NO , 0) EIC_ITEM_NO, 
        '' ORDER_STATUS,
        NVL(( SELECT DISTINCT ENC_ID_ORDER FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , ' ') ORDER_NO, 
        NVL(( SELECT DISTINCT ENC_NO_ITEM FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , 0) ORDER_ITEM, 
        NVL(( SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , ' ') ORDER_TYPE, NVL( EIC_NO_MATNR, ' ') EIC_NO_MATNR, NVL(TO_CHAR(EIC_DT_LOADING) , ' ') EIC_DT_LOADING, NVL(( FLOOR(EIC_DT_LOADING - EIC_DT_INVOICE) ) , 0) TRANSIT_LEAD, 
        NVL('' , ' ') TIME, NVL(TO_CHAR(EIC_DT_PIECE_UPD) , ' ') EIC_DT_PIECE_UPD, NVL('' , ' ' ) BILLET, NVL('' , ' ') BILLET_PIECE, NVL(EIC_CD_YRD , ' ') EIC_CD_YRD, NVL(EIC_ID_LOC_X , ' ') EIC_ID_LOC_X, NVL(EIC_ID_LOC_Y , ' ') EIC_ID_LOC_Y, NVL(EIC_ID_POS , 0) EIC_ID_POS, NVL(EIC_REMARKS , ' ') EIC_REMARKS, NVL(( ROUND(EIC_DT_PIECE_UPD - EIC_DT_LOADING) ) , 0) PROC_DAYS, NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) INV_DAYS, 
        '' AGE,
        NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) EPA_AGE, 
        NVL(EIC_CD_EPA , ' ') EIC_CD_EPA, NVL(EIC_ID_OP_DECSN , ' ') EIC_ID_OP_DECSN, NVL(EIC_MARK_CUST , 0) EIC_MARK_CUST, NVL(EIC_MK_CUSTOMER , ' ') EIC_MK_CUSTOMER, NVL(EIC_CD_PLANT , ' ') EIC_CD_PLANT, 
          ''SALVAGING_REMARKS,''TOP_REMARKS,''BOTTOM_REMARKS,''FILE_NAME,'' WORK_CENTER,
         ''PASSED_PROC,
        NVL(( SELECT DISTINCT LOM_SCRAP_REMARKS FROM V_LDP_PRODN WHERE LOM_ID_BATCH = EIC_ID_COIL AND LOM_CD_EPA = EIC_CD_EPA AND ROWNUM = 1 ) , ' ') SCRAP_REMARKS, 
        NVL(EIC_VEHICAL_NO , ' ')AS VEHICAL_NO ,
        NVL( EIC_NO_DELIVERY , ' ') EIC_NO_DELIVERY
        FROM V_INPUT_COIL A 
        WHERE EIC_CD_EPA = :plant `;

    if (Status != "" && Status != "ALL") {
      if (Status == "VF" || (Status == "VF+VB" && PROCDTFROM == "")) {
        Status = "VF";
        Object.assign(binds, { Status: Status });
        QrygetData += "And EIC_CD_STATUS =NVL(:Status, EIC_CD_STATUS) ";
        QrygetData +=
          " And ( EIC_CD_EPA||EIC_ID_COIL ) in (select LOM_cd_epa||LOM_id_batch from v_LDP_PRODN where LOM_cd_epa = a.EIC_CD_EPA And LOM_id_batch = a.EIC_ID_COIL And ((a.EIC_CD_STATUS=LOM_CD_STATUS) Or LOM_CD_STATUS ='VB' )) ";
      } else {
        if (PROCDTFROM != "" && Status != "VF" && Status != "VF+VB") {
          Object.assign(binds, { Status: Status });
          QrygetData += "And EIC_CD_STATUS =NVL(:'Status', EIC_CD_STATUS) ";
        } else {
          Object.assign(binds, { Status: Status });
          QrygetData += "And EIC_CD_STATUS =NVL(:Status, EIC_CD_STATUS) ";
        }
      }
    }
    if (BATCH_ID != "") {
      QrygetData += " And EIC_ID_COIL = NVL(:BATCH_ID, EIC_ID_COIL)";
      Object.assign(binds, { BATCH_ID: BATCH_ID });
    }

    // if (TDC != "") {
    //     QrygetData += " And EIC_TDC_ACTL =NVL(:TDC,EIC_TDC_ACTL)"
    //     Object.assign(binds, { TDC: TDC });
    // }

    if (RECVDTFROM != "") {
      QrygetData +=
        " And TRUNC(EIC_DT_LOADING) BETWEEN NVL(:RECVDTFROM, TRUNC(EIC_DT_LOADING)) And  NVL(:RECVDTTO, NVL(:RECVDTFROM, TRUNC(EIC_DT_LOADING))) ";
      Object.assign(binds, { RECVDTFROM: RECVDTFROM });
      Object.assign(binds, { RECVDTTO: RECVDTTO });
    }

    if (PROCDTFROM != "") {
      if (Status == "VF+VB" || Status == "VF") {
        Status = "VF";
        QrygetData += " And EIC_CD_STATUS =NVL(:Status, EIC_CD_STATUS) ";
        QrygetData +=
          " And (EIC_CD_EPA||EIC_ID_COIL ) in (select LOM_cd_epa||LOM_id_batch from v_LDP_PRODN where LOM_cd_epa = a.EIC_CD_EPA and LOM_id_batch = a.EIC_ID_COIL and eic_cd_status='VF' And LOM_MS_GROSS_CAL =0  ) ";
        QrygetData +=
          "And TRUNC(EIC_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)) And  NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)))";
      } else if (Status != "" && PROCDTFROM != "" && Status != "VF+VB") {
        QrygetData +=
          " And TRUNC(EIC_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)) And  NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)))";
      } else if (Status == "") {
        QrygetData +=
          " And TRUNC(EIC_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)) And  NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(EIC_DT_PIECE_UPD)))";
      } else {
        QrygetData += "";
      }

      Object.assign(binds, { PROCDTFROM: PROCDTFROM });
      Object.assign(binds, { PROCDTTO: PROCDTTO });
    }

    // if (ProdCd != "") {
    //     QrygetData += " And EIC_CD_PROD = NVL(: ProdCd, EIC_CD_PROD)"
    //     Object.assign(binds, { ProdCd: ProdCd });

    // }

    // if (QltyCd != '') {
    //     QrygetData += " And EIC_CD_QLTY_ACTL =NVL(:QltyCd, EIC_CD_QLTY_ACTL)"
    //     Object.assign(binds, { QltyCd: QltyCd });

    // }

    if (
      (Length1 && Array.isArray(Length1) && Length1.length > 1) ||
      (Length2 && Array.isArray(Length2) && Length2.length > 1)
    ) {
      if (Length1 && Array.isArray(Length1) && Length1.length > 1) {
        QrygetData += `AND EIC_LENGTH in(` + Length1.join(",") + `) `;
        // binds["Length1"] = Length1.join(',');
      } else if (Length2 && Array.isArray(Length2) && Length2.length > 1) {
        QrygetData += `AND EIC_LENGTH in(` + Length2.join(",") + `) `;
        // binds["Length2"] = Length2.join(',');
      }
    } else {
      if (Length1 && Length1 !== "") {
        QrygetData += `AND EIC_LENGTH >= nvl(:Length1, EIC_LENGTH) `;
        binds["Length1"] = Array.isArray(Length1) ? Length1[0] : Length1;
      }
      if (Length2 && Length2 !== "") {
        QrygetData += `AND EIC_LENGTH <= nvl(:Length2, EIC_LENGTH) `;
        binds["Length2"] = Array.isArray(Length2) ? Length2[0] : Length2;
      }
    }

    if (
      (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) ||
      (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)
    ) {
      if (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) {
        QrygetData += `AND EIC_SEC1 in(` + Thick1.join(",") + `) `;
        // binds["Thick1"] = Thick1.join(',');
      } else if (Thick2 && Array.isArray(Thick2) && Thick2.length > 1) {
        QrygetData += `AND EIC_SEC1 in(` + Thick2.join(",") + `) `;
        // binds["Thick2"] = Thick2.join(',');
      }
    } else {
      if (Thick1 && Thick1 !== "") {
        QrygetData += `AND EIC_SEC1 >= nvl(:Thick1, EIC_SEC1) `;
        binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
      }
      if (Thick2 && Thick2 !== "") {
        QrygetData += `AND EIC_SEC1 <= nvl(:Thick2, EIC_SEC1) `;
        binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
      }
    }

    if (
      (Width1 && Array.isArray(Width1) && Width1.length > 1) ||
      (Width2 && Array.isArray(Width2) && Width2.length > 1)
    ) {
      if (Width1 && Array.isArray(Width1) && Width1.length > 1) {
        QrygetData += `AND EIC_SEC2 in(` + Width1.join(",") + `) `;
        // binds["Width1"] = Width1.join(',');
      } else if (Width2 && Array.isArray(Width2) && Width2.length > 1) {
        QrygetData += `AND EIC_SEC2 in(` + Width2.join(",") + `) `;
        // binds["Width2"] = Width2.join(',');
      }
    } else {
      if (Width1 && Width1?.length) {
        QrygetData += `AND EIC_SEC2 >= nvl(:Width1, EIC_SEC2) `;
        binds["Width1"] = Array.isArray(Width1) ? Width1[0] : Width1;
      }
      if (Width2 && Width2?.length) {
        QrygetData += `AND EIC_SEC2 <= nvl(:Width2, EIC_SEC2) `;
        binds["Width2"] = Array.isArray(Width2) ? Width2[0] : Width2;
      }
    }

    // if (Thick1 != '') {
    //     QrygetData += " And EIC_SEC1 BETWEEN NVL(:Thick1,EIC_SEC1) AND NVL(:Thick2,NVL(:Thick1,EIC_SEC1))"
    //     Object.assign(binds, { Thick1: Thick1 });
    //     Object.assign(binds, { Thick2: Thick2 });

    // }
    // if (Width1 != '') {
    //     QrygetData += " And EIC_SEC2 BETWEEN NVL(:Width1,EIC_SEC2) AND NVL(:Width2,NVL(:Width1,EIC_SEC2))"
    //     Object.assign(binds, { Width1: Width1 });
    //     Object.assign(binds, { Width2: Width2 });
    // }

    if (Material != "") {
      QrygetData += " And EIC_NO_MATNR =NVL(:Material, EIC_NO_MATNR)";
      Object.assign(binds, { Material: Material });
    }
    if (INVOICE != "") {
      QrygetData += " And EIC_NO_INVOICE =NVL(:INVOICE, EIC_NO_INVOICE)";
      Object.assign(binds, { INVOICE: INVOICE });
    }
    if (INVOICE_DTFROM != "") {
      QrygetData +=
        "And TRUNC(EIC_DT_INVOICE) BETWEEN NVL(:INVOICE_DTFROM, TRUNC(EIC_DT_INVOICE)) And  NVL(:INVOICE_DTTO, NVL(:INVOICE_DTFROM, TRUNC(EIC_DT_INVOICE)))";
      Object.assign(binds, { INVOICE_DTFROM: INVOICE_DTFROM });
      Object.assign(binds, { INVOICE_DTTO: INVOICE_DTTO });
    }

    if (coilType != "All" && coilType == "RM_Coil") {
      QrygetData += " And EIC_SEC2 > 900 ";
    }

    if (coilType != "All" && coilType == "Parted_Coil") {
      QrygetData += " And EIC_SEC2 >= 200 AND EIC_SEC2<=900 ";
    }

    QrygetData += " Order by EIC_NO_INVOICE";
    return await query.executeQuery(QrygetData, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchDetails = async (Plant: any, MBATCH_ID: any) => {
  try {
    const sql = ` SELECT EIC_ID_COIL,EIC_CD_PROD,EIC_CD_QLTY_ACTL,EIC_SEC1,EIC_SEC2,EIC_TDC_ACTL,EIC_MS_PIECE_ACTL,EIC_CD_PLANT,EIC_CD_EDGE,EIC_MK_CUSTOMER, LOM_ID_BATCH,LOM_CD_PROD,LOM_CD_QLTY_ACTL,LOM_SEC1,LOM_SEC2,LOM_TDC_ACTL,LOM_LENGTH,NVL(LOM_MS_GROSS_CAL,0)+NVL(LOM_MS_SCRAP,0) QTY, LOM_NO_PIECES,LOM_PASSED_PROC,LOM_CD_STATUS, (SELECT DISTINCT ENC_CUST_NAME FROM v_end_cust_ord_epa WHERE LOM_ID_ORDER_CUS=ENC_ID_ORDER And LOM_ID_ORD_ITEM_CUS=ENC_NO_ITEM And LOM_ID_BATCH= LOM_ID_BATCH And LOM_CD_EPA= ENC_CD_EPA) CUSTOMER_NAME, LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,' 'TONN, LOM_MK_CUSTOMER, (SELECT DISTINCT ENC_ORDER_TYPE FROM v_end_cust_ord_epa WHERE LOM_ID_ORDER_CUS=ENC_ID_ORDER AND LOM_ID_ORD_ITEM_CUS=ENC_NO_ITEM AND LOM_ID_BATCH= LOM_ID_BATCH AND LOM_CD_EPA= ENC_CD_EPA) ORDER_TYPE,(SELECT DISTINCT MAX(CD_DESC) FROM  V_RSN_HLD_RJCT,v_Epa_matl_hold_rls WHERE  CD_RSN_HLD_RJCT_CODES  = EHR_CD_RSN_HOLD AND EHR_ID_BATCH = LOM_ID_BATCH AND EHR_CD_EPA=LOM_CD_EPA) REMARKS FROM V_INPUT_COIL A, V_LDP_PRODN B  WHERE A.EIC_CD_EPA=B.LOM_CD_EPA  And A.EIC_ID_COIL=B.LOM_ID_FIRST_PAR  AND B.LOM_ID_BATCH<>B.LOM_ID_FIRST_PAR  And B.LOM_CD_EPA=:0 AND A.EIC_ID_COIL=:1`;
    let binds = [`${Plant}`, `${MBATCH_ID}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CONFIRM = async (Plant: any, dt: any, userId: any) => {
  try {
    const sql = `call SPCB003 (
            NBT_EPA_CD => :NBT_EPA_CD,
            P_EIC_ID_COIL => :P_EIC_ID_COIL,
            NBT_EIC_NO_INVOICE => :NBT_EIC_NO_INVOICE,
            NBT_GR_DATE => :NBT_GR_DATE,
            P_EIC_ID_POS => :P_EIC_ID_POS,
            P_EIC_LOC_X => :P_EIC_LOC_X,
            P_EIC_LOC_Y => :P_EIC_LOC_Y,
            P_EIC_CD_YRD => :P_EIC_CD_YRD,
            P_EIC_REMARKS => :P_EIC_REMARKS,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      NBT_EPA_CD: Plant,
      P_EIC_ID_COIL: dt.EIC_ID_COIL ?? "",
      NBT_EIC_NO_INVOICE: dt.STORE_LOCATION ?? "",
      NBT_GR_DATE: dt.EIC_DT_INVOICE ?? "",
      P_EIC_ID_POS: dt.EIC_ID_POS ?? "",
      P_EIC_LOC_X: dt.EIC_ID_LOC_X ?? "",
      P_EIC_LOC_Y: dt.EIC_ID_LOC_Y ?? "",
      P_EIC_CD_YRD: dt.EIC_CD_YRD ?? "",
      P_EIC_REMARKS: dt.EIC_REMARKS ?? "",
      P_USER: userId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CONFIRM_Wires = async (Plant: any, dt: any, UserID: any) => {
  try {
    const sql = `call SPCB003_CONFIRM_WIRE (
            P_NBT_EPA_CD => :P_NBT_EPA_CD,
            P_EIC_ID_COIL => :P_EIC_ID_COIL,
            P_NBT_EIC_NO_INVOICE => :P_NBT_EIC_NO_INVOICE,
            P_EIC_NO_MATNR => :P_EIC_NO_MATNR,
            P_EIC_MS_PIECE_ACTL => :P_EIC_MS_PIECE_ACTL,
            P_NBT_NO_BLT => :P_NBT_NO_BLT,
            P_EIC_MS_PIECE_CAL => :P_EIC_MS_PIECE_CAL,
            P_EIC_CD_YRD => :P_EIC_CD_YRD,
            P_EIC_ID_LOC_X => :P_EIC_ID_LOC_X,
            P_EIC_ID_LOC_Y => :P_EIC_ID_LOC_Y,
            P_EIC_ID_POS => :P_EIC_ID_POS,
            P_EIC_REMARKS => :P_EIC_REMARKS,
            P_EIC_DT_INVOICE => :P_EIC_DT_INVOICE,
            P_EIC_CD_STATUS => :P_EIC_CD_STATUS,
            P_USER_ID => :P_USER_ID,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      P_NBT_EPA_CD: Plant,
      P_EIC_ID_COIL: dt.EIC_ID_COIL ?? "",
      P_NBT_EIC_NO_INVOICE: dt.EIC_NO_INVOICE ?? "",
      P_EIC_NO_MATNR: dt.EIC_NO_MATNR,
      P_EIC_MS_PIECE_ACTL: dt.EIC_MS_PIECE_ACTL,
      P_NBT_NO_BLT: dt.NBT_NO_BLT,
      P_EIC_MS_PIECE_CAL: dt.EIC_MS_PIECE_CAL,
      P_EIC_CD_YRD: dt.txtyrd,
      P_EIC_ID_LOC_X: dt.txtLocX,
      P_EIC_ID_LOC_Y: dt.txtLocY,
      P_EIC_ID_POS: dt.EIC_ID_POS,
      P_EIC_REMARKS: dt.txtRemarks,
      P_EIC_DT_INVOICE: dt.EIC_DT_INVOICE,
      P_EIC_CD_STATUS: dt.EIC_CD_STATUS,
      P_USER_ID: UserID,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const RETURN_COIL = async (Plant: any, dt: any, userId: any) => {
  try {
    const sql = `call SPCB003_RETURN (
            NBT_EPA_CD => :NBT_EPA_CD,
            P_EIC_ID_COIL => :P_EIC_ID_COIL,
            NBT_EIC_NO_INVOICE => :NBT_EIC_NO_INVOICE,
            NBT_GR_DATE => :NBT_GR_DATE,
            P_EIC_ID_POS => :P_EIC_ID_POS,
            P_EIC_LOC_X => :P_EIC_LOC_X,
            P_EIC_LOC_Y => :P_EIC_LOC_Y,
            P_EIC_CD_YRD => :P_EIC_CD_YRD,
            P_EIC_REMARKS => :P_EIC_REMARKS,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      NBT_EPA_CD: Plant,
      P_EIC_ID_COIL: dt.EIC_ID_COIL ?? "",
      NBT_EIC_NO_INVOICE: dt.STORE_LOCATION ?? "",
      NBT_GR_DATE: dt.EIC_DT_INVOICE ?? "",
      P_EIC_ID_POS: dt.EIC_ID_POS ?? "",
      P_EIC_LOC_X: dt.EIC_ID_LOC_X ?? "",
      P_EIC_LOC_Y: dt.EIC_ID_LOC_Y ?? "",
      P_EIC_CD_YRD: dt.EIC_CD_YRD ?? "",
      P_EIC_REMARKS: dt.EIC_REMARKS ?? "",
      P_USER: userId ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils_Wires = async (
  Plant: any,
  Status: any,
  BATCH_ID: any,
  TDC: any,
  RECVDTFROM: any,
  RECVDTTO: any,
  PROCDTFROM: any,
  PROCDTTO: any,
  ProdCd: any,
  QltyCd: any,
  Thick1: any,
  Thick2: any,
  Width1: any,
  Width2: any,
  Material: any,
  INVOICE: any,
  INVOICE_DTFROM: any,
  INVOICE_DTTO: any,
  Length1: any,
  Length2: any
) => {
  try {
    let binds = {
      Plant: Plant,
    };

    var QrygetData = `SELECT LIC_ID_COIL EIC_ID_COIL, LIC_CD_STATUS EIC_CD_STATUS,(SELECT DISTINCT CD_DESC FROM   V_CODES WHERE CD_TYPE = 'E0001' AND    CD_VALUE = LIC_CD_STATUS AND ROWNUM=1 ) STATUS_DESC, LIC_NO_INVOICE EIC_NO_INVOICE, TO_CHAR(LIC_DT_INVOICE) EIC_DT_INVOICE,'' EIC_CD_PROD,'' EIC_CD_QLTY_ACTL, '' QUALITY_DESC, LIC_SEC1 EIC_SEC1, LIC_SEC2 EIC_SEC2,'' EIC_TDC_ACTL,'' PROD_GRP, '' EPA_Passed_Proc, '' EIC_CD_EDGE, LIC_MS_PIECE_ACTL EIC_MS_PIECE_ACTL,  LIC_MS_PIECE_ACTL RESIDUAL_WEIGHT, '' MS_Scrap,''PRIME,''ARISING,''BALANCE_SLIT_SEC,''PROCESSED_PRM,''GROSS_YILED,''PRIME_YIELD, '' EIC_WO_NO, '' EIC_ITEM_NO, '' ORDER_STATUS, '' ORDER_NO, '' ORDER_ITEM, '' ORDER_TYPE, LIC_NO_MATNR EIC_NO_MATNR, '' EIC_DT_LOADING,'' TRANSIT_LEAD,'' TIME,'' EIC_DT_PIECE_UPD,''BILLET,''BILLET_PIECE, '' EIC_CD_YRD,'' EIC_ID_LOC_X,'' EIC_ID_LOC_Y,'' EIC_ID_POS,'' EIC_REMARKS, '' PROC_DAYS, '' INV_DAYS, '' AGE, '' EPA_AGE, LIC_CD_EPA EIC_CD_EPA, '' EIC_ID_OP_DECSN, '' EIC_MARK_CUST, '' EIC_MK_CUSTOMER, '' EIC_CD_PLANT, '' SALVAGING_REMARKS, '' TOP_REMARKS, '' BOTTOM_REMARKS, '' FILE_NAME, '' WORK_CENTER, '' PASSED_PROC, '' SCRAP_REMARKS   FROM V_INPUT_COIL_LP  WHERE LIC_CD_EPA=:Plant  And LIC_CD_STATUS='VA'`;

    if (BATCH_ID != "") {
      QrygetData += " And LIC_ID_COIL = NVL(:BATCH, LIC_ID_COIL)";
      Object.assign(binds, { BATCH: BATCH_ID });
    }

    // if ((Length1 && Array.isArray(Length1) && Length1.length > 1) || (Length2 && Array.isArray(Length2) && Length2.length > 1)) {
    //     if ((Length1 && Array.isArray(Length1) && Length1.length > 1)) {
    //         QrygetData += `AND LIC_LENGTH in(` + Length1.join(',') + `) `;
    //         // binds["Length1"] = Length1.join(',');
    //     } else if ((Length2 && Array.isArray(Length2) && Length2.length > 1)) {
    //         QrygetData += `AND LIC_LENGTH in(` + Length2.join(',') + `) `;
    //         // binds["Length2"] = Length2.join(',');
    //     }
    // } else {
    //     if (Length1 && Length1 !== "") {
    //         QrygetData += `AND LIC_LENGTH >= nvl(:Length1, LIC_LENGTH) `;
    //         binds["Length1"] = Array.isArray(Length1) ? Length1[0] : Length1;
    //     }
    //     if (Length2 && Length2 !== "") {
    //         QrygetData += `AND LIC_LENGTH <= nvl(:Length2, LIC_LENGTH) `;
    //         binds["Length2"] = Array.isArray(Length2) ? Length2[0] : Length2;
    //     }
    // }

    if (
      (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) ||
      (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)
    ) {
      if (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) {
        QrygetData += `AND LIC_SEC1 in(` + Thick1.join(",") + `) `;
        // binds["Thick1"] = Thick1.join(',');
      } else if (Thick2 && Array.isArray(Thick2) && Thick2.length > 1) {
        QrygetData += `AND LIC_SEC1 in(` + Thick2.join(",") + `) `;
        // binds["Thick2"] = Thick2.join(',');
      }
    } else {
      if (Thick1 && Thick1 !== "") {
        QrygetData += `AND LIC_SEC1 >= nvl(:Thick1, LIC_SEC1) `;
        binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
      }
      if (Thick2 && Thick2 !== "") {
        QrygetData += `AND LIC_SEC1 <= nvl(:Thick2, LIC_SEC1) `;
        binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
      }
    }

    if (
      (Width1 && Array.isArray(Width1) && Width1.length > 1) ||
      (Width2 && Array.isArray(Width2) && Width2.length > 1)
    ) {
      if (Width1 && Array.isArray(Width1) && Width1.length > 1) {
        QrygetData += `AND LIC_SEC2 in(` + Width1.join(",") + `) `;
        // binds["Width1"] = Width1.join(',');
      } else if (Width2 && Array.isArray(Width2) && Width2.length > 1) {
        QrygetData += `AND LIC_SEC2 in(` + Width2.join(",") + `) `;
        // binds["Width2"] = Width2.join(',');
      }
    } else {
      if (Width1 && Width1?.length) {
        QrygetData += `AND LIC_SEC2 >= nvl(:Width1, LIC_SEC2) `;
        binds["Width1"] = Array.isArray(Width1) ? Width1[0] : Width1;
      }
      if (Width2 && Width2?.length) {
        QrygetData += `AND LIC_SEC2 <= nvl(:Width2, LIC_SEC2) `;
        binds["Width2"] = Array.isArray(Width2) ? Width2[0] : Width2;
      }
    }

    // if (Thick1 != '') {
    //     QrygetData += " And LIC_SEC1 BETWEEN NVL(:Thick1,LIC_SEC1) AND NVL(:Thick2,NVL(:Thick1,LIC_SEC1))"
    //     Object.assign(binds, { Thick1: Thick1 });
    //     Object.assign(binds, { Thick2: Thick2 });
    // }

    // if (Width1 != '') {
    //     QrygetData += " And LIC_SEC2 BETWEEN NVL(:Width1,LIC_SEC2) AND NVL(:Width2,NVL(:Width1,LIC_SEC2))"
    //     Object.assign(binds, { Width1: Width1 });
    //     Object.assign(binds, { Width2: Width2 });

    // }

    if (Material != "") {
      QrygetData += " And LIC_NO_MATNR =NVL(:Material, LIC_NO_MATNR)";
      Object.assign(binds, { Material: Material });
    }

    if (INVOICE != "") {
      QrygetData += " And LIC_NO_INVOICE =NVL(:INVOICE, LIC_NO_INVOICE)";
      Object.assign(binds, { INVOICE: INVOICE });
    }

    if (INVOICE_DTFROM != "") {
      QrygetData +=
        "And TRUNC(LIC_DT_INVOICE) BETWEEN NVL(:INVOICE_DTFROM, TRUNC(LIC_DT_INVOICE)) And  NVL(:INVOICE_DTTO, NVL(:INVOICE_DTFROM, TRUNC(LIC_DT_INVOICE)))";
      Object.assign(binds, { INVOICE_DTFROM: INVOICE_DTFROM });
      Object.assign(binds, { INVOICE_DTTO: INVOICE_DTTO });
    }

    QrygetData += " ORDER BY LIC_ID_COIL,LIC_NO_INVOICE";

    return await query.executeQuery(QrygetData, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils_LP = async (
  Plant: any,
  Status: any,
  BATCH_ID: any,
  TDC: any,
  RECVDTFROM: any,
  RECVDTTO: any,
  PROCDTFROM: any,
  PROCDTTO: any,
  ProdCd: any,
  QltyCd: any,
  Thick1: any,
  Thick2: any,
  Width1: any,
  Width2: any,
  Material: any,
  INVOICE: any,
  INVOICE_DTFROM: any,
  INVOICE_DTTO: any,
  Length1: any,
  Length2: any
) => {
  try {
    let binds = {
      Plant: Plant,
    };

    var QrygetData = `SELECT LIC_ID_COIL EIC_ID_COIL, LIC_CD_STATUS EIC_CD_STATUS, (SELECT DISTINCT CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND CD_VALUE = LIC_CD_STATUS AND ROWNUM = 1) STATUS_DESC, LIC_NO_INVOICE EIC_NO_INVOICE, TO_CHAR(LIC_DT_INVOICE) EIC_DT_INVOICE, LOM_CD_PROD EIC_CD_PROD, LOM_CD_QLTY_ACTL EIC_CD_QLTY_ACTL, (SELECT DISTINCT IQL_GRADE_DESC FROM V_QUALITY WHERE IQL_CD_QLTY = LOM_CD_QLTY_ACTL AND ROWNUM = 1) QUALITY_DESC, LIC_SEC1 EIC_SEC1, LIC_SEC2 EIC_SEC2, LOM_TDC_ACTL EIC_TDC_ACTL, (SELECT CASE (SELECT YPG_PROD_GRP FROM V_COST_PROD_GRP WHERE YPG_CD_PROD = LOM_CD_PROD) WHEN 'G' THEN 'GC' ELSE 'CRCA' END PROD_GRP FROM DUAL) PROD_GRP, (SELECT DISTINCT LOM_PASSED_PROC FROM V_LDP_PRODN WHERE LOM_ID_FIRST_PAR = LIC_ID_COIL AND ROWNUM = 1 AND LENGTH(LOM_PASSED_PROC) =  (SELECT MAX(LENGTH(LOM_PASSED_PROC)) FROM V_LDP_PRODN WHERE LOM_ID_FIRST_PAR = LIC_ID_COIL)) EPA_PASSED_PROC, '' EIC_CD_EDGE, LIC_MS_PIECE_ACTL EIC_MS_PIECE_ACTL, (SELECT LOM_MS_GROSS_CAL FROM V_LDP_PRODN WHERE LOM_CD_EPA = LIC_CD_EPA AND LOM_ID_BATCH = LIC_ID_COIL AND ROWNUM = 1 AND LOM_CD_STATUS IN ('VF', 'VB')) RESIDUAL_WEIGHT, '' MS_SCRAP, '' PRIME, '' ARISING, '' BALANCE_SLIT_SEC, '' PROCESSED_PRM, '' GROSS_YILED, '' PRIME_YIELD, LOM_ID_ORDER EIC_WO_NO, LOM_NO_ITEM EIC_ITEM_NO, (SELECT DISTINCT IWO_ORDER_STATUS FROM V_WO_MASTER, V_WO_ITEM WHERE IWO_WO_NO = IWI_WO_NO AND IWO_WO_NO = LOM_ID_ORDER AND IWI_ITEM_NO = LOM_NO_ITEM AND ROWNUM = 1) ORDER_STATUS, (SELECT DISTINCT ENC_ID_ORDER FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = LOM_ID_ORDER AND ENC_ITEM_NO = LOM_NO_ITEM AND ROWNUM = 1) ORDER_NO, (SELECT DISTINCT ENC_NO_ITEM FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = LOM_ID_ORDER AND ENC_ITEM_NO = LOM_NO_ITEM AND ROWNUM = 1) ORDER_ITEM, (SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE ENC_WO_NO = LOM_ID_ORDER AND ENC_ITEM_NO = LOM_NO_ITEM AND ROWNUM = 1) ORDER_TYPE, LIC_NO_MATNR EIC_NO_MATNR, TO_CHAR(LOM_DT_LOADING) EIC_DT_LOADING, (FLOOR(LOM_DT_LOADING - LIC_DT_INVOICE)) TRANSIT_LEAD, '' TIME, TO_CHAR(LOM_DT_PIECE_UPD) EIC_DT_PIECE_UPD, '' BILLET, '' BILLET_PIECE, LOM_CD_YRD EIC_CD_YRD, LOM_ID_LOC_X EIC_ID_LOC_X, LOM_ID_LOC_Y EIC_ID_LOC_Y, LOM_ID_POS EIC_ID_POS, '' EIC_REMARKS, (ROUND(LOM_DT_PIECE_UPD - LOM_DT_LOADING)) PROC_DAYS, (ROUND(SYSDATE - LOM_DT_LOADING)) INV_DAYS, (SELECT ROUND(SYSDATE - FHC_TS_REC_CREATE) FROM V_FULL_HARD_COILS WHERE FHC_ID_COIL = LIC_ID_COIL AND ROWNUM = 1) AGE, (ROUND(SYSDATE - LOM_DT_LOADING)) EPA_AGE, LIC_CD_EPA EIC_CD_EPA, LOM_ID_OP_DECSN EIC_ID_OP_DECSN, '' EIC_MARK_CUST, LOM_MK_CUSTOMER EIC_MK_CUSTOMER, '' EIC_CD_PLANT, (SELECT DISTINCT MAX(TRIM(REPLACE(CAD_DEF2_COMM, CHR(10), ' '))) FROM V_COIL_CARD WHERE CAD_ID_COIL = LIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM = 1) SALVAGING_REMARKS, (SELECT DISTINCT MAX(TRIM(REPLACE(CAD_CD_TOP_REMARKS, CHR(10), ' '))) FROM V_COIL_CARD WHERE CAD_ID_COIL = LIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM = 1) TOP_REMARKS, (SELECT DISTINCT MAX(TRIM(REPLACE(CAD_CD_BOT_REMARKS, CHR(10), ' '))) FROM V_COIL_CARD WHERE CAD_ID_COIL = LIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM = 1) BOTTOM_REMARKS, (SELECT DISTINCT MAX(TRIM(REPLACE(CAD_FILE_NAME, CHR(10), ' '))) FROM V_COIL_CARD WHERE CAD_ID_COIL = LIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM = 1) FILE_NAME, (SELECT DISTINCT MAX(CAD_LST_WRK_CEN) FROM V_COIL_CARD WHERE CAD_ID_COIL = LIC_ID_COIL AND CAD_DEF2_COMM LIKE 'SLP%' AND ROWNUM = 1) WORK_CENTER, (SELECT DISTINCT CCL_PASSED_PROC FROM V_COLD_COIL WHERE CCL_ID_COIL = LIC_ID_COIL AND ROWNUM = 1) PASSED_PROC, (SELECT DISTINCT LOM_SCRAP_REMARKS FROM V_LDP_PRODN WHERE LOM_ID_BATCH = LIC_ID_COIL AND LOM_CD_EPA = LIC_CD_EPA AND ROWNUM = 1) SCRAP_REMARKS FROM V_LDP_PRODN, V_INPUT_COIL_LP A WHERE LOM_ID_BATCH(+) = LIC_ID_COIL AND LOM_CD_EPA(+) = LIC_CD_EPA AND LIC_CD_EPA = :Plant `;

    if (Status != "") {
      if (Status == "VF" || (Status == "VFVB" && PROCDTFROM != "")) {
        Status = "VF";
        QrygetData += "AND LIC_CD_STATUS = NVL(:Status, LIC_CD_STATUS) ";
        QrygetData +=
          " AND (LIC_CD_EPA||LIC_ID_COIL ) IN (SELECT LOM_CD_EPA||LOM_ID_BATCH FROM V_LDP_PRODN WHERE LOM_CD_EPA = A.LIC_CD_EPA AND LOM_ID_BATCH = A.LIC_ID_COIL AND ((A.LIC_CD_STATUS = LOM_CD_STATUS) OR LOM_CD_STATUS ='VB')) ";
      } else {
        if (PROCDTFROM != "" && Status != "VF" && Status != "VFVB") {
          QrygetData += "AND LIC_CD_STATUS = NVL(:Status, LIC_CD_STATUS) ";
        } else {
          QrygetData += "AND LIC_CD_STATUS =NVL(:Status, LIC_CD_STATUS) ";
        }
      }
      Object.assign(binds, { Status: Status });
    }

    if (BATCH_ID != "") {
      QrygetData += " AND LIC_ID_COIL = NVL(:BATCH, LIC_ID_COIL)";
      Object.assign(binds, { BATCH: BATCH_ID });
    }

    // if (TDC != '') {
    //     QrygetData += " AND LIC_TDC_ACTL = NVL(:TDC, LIC_TDC_ACTL)"
    //     Object.assign(binds, { TDC: TDC });
    // }

    if (RECVDTFROM != "") {
      QrygetData +=
        " AND TRUNC(LOM_DT_LOADING) BETWEEN NVL(:RECVDTFROM, TRUNC(LOM_DT_LOADING)) And  NVL(:RECVDTTO, NVL(:RECVDTFROM, TRUNC(LOM_DT_LOADING)))";
      Object.assign(binds, { RECVDTFROM: RECVDTFROM });
      Object.assign(binds, { RECVDTTO: RECVDTTO });
    }

    if (PROCDTFROM != "") {
      if ((Status = "VFVB" || Status == "VF")) {
        Status = "VF";
        QrygetData += " AND LIC_CD_STATUS = NVL(:Status, LIC_CD_STATUS) ";
        QrygetData +=
          " AND (LIC_CD_EPA||LIC_ID_COIL ) IN (SELECT LOM_CD_EPA||LOM_ID_BATCH FROM V_LDP_PRODN WHERE LOM_CD_EPA = A.LIC_CD_EPA AND LOM_ID_BATCH = A.LIC_ID_COIL AND LIC_CD_STATUS='VF' AND LOM_MS_GROSS_CAL = 0  ) ";
        QrygetData +=
          "AND TRUNC(LOM_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)) AND NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)))";
      } else if (Status != "" && PROCDTFROM != "" && Status != "VFVB") {
        QrygetData +=
          " AND TRUNC(LOM_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)) And  NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)))";
      } else if (Status == "") {
        QrygetData +=
          " AND TRUNC(LOM_DT_PIECE_UPD) BETWEEN NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)) And  NVL(:PROCDTTO, NVL(:PROCDTFROM, TRUNC(LOM_DT_PIECE_UPD)))";
      } else {
        QrygetData += "";
      }
      Object.assign(binds, { PROCDTFROM: PROCDTFROM });
      Object.assign(binds, { PROCDTTO: PROCDTTO });
    }

    // if (ProdCd != '') {
    //     QrygetData += " AND LIC_CD_PROD = NVL(: ProdCd, LIC_CD_PROD)"
    //     Object.assign(binds, { ProdCd: ProdCd });
    // }

    // if (QltyCd != '') {
    //     QrygetData += " AND LOM_CD_QLTY_ACTL = NVL(:QltyCd, LOM_CD_QLTY_ACTL)"
    //     Object.assign(binds, { QltyCd: QltyCd });
    // }

    // if ((Length1 && Array.isArray(Length1) && Length1.length > 1) || (Length2 && Array.isArray(Length2) && Length2.length > 1)) {
    //     if ((Length1 && Array.isArray(Length1) && Length1.length > 1)) {
    //         QrygetData += `AND LIC_LENGTH in(` + Length1.join(',') + `) `;
    //         // binds["Length1"] = Length1.join(',');
    //     } else if ((Length2 && Array.isArray(Length2) && Length2.length > 1)) {
    //         QrygetData += `AND LIC_LENGTH in(` + Length2.join(',') + `) `;
    //         // binds["Length2"] = Length2.join(',');
    //     }
    // } else {
    //     if (Length1 && Length1 !== "") {
    //         QrygetData += `AND LIC_LENGTH >= nvl(:Length1, LIC_LENGTH) `;
    //         binds["Length1"] = Array.isArray(Length1) ? Length1[0] : Length1;
    //     }
    //     if (Length2 && Length2 !== "") {
    //         QrygetData += `AND LIC_LENGTH <= nvl(:Length2, LIC_LENGTH) `;
    //         binds["Length2"] = Array.isArray(Length2) ? Length2[0] : Length2;
    //     }
    // }

    if (
      (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) ||
      (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)
    ) {
      if (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) {
        QrygetData += `AND LIC_SEC1 in(` + Thick1.join(",") + `) `;
        // binds["Thick1"] = Thick1.join(',');
      } else if (Thick2 && Array.isArray(Thick2) && Thick2.length > 1) {
        QrygetData += `AND LIC_SEC1 in(` + Thick2.join(",") + `) `;
        // binds["Thick2"] = Thick2.join(',');
      }
    } else {
      if (Thick1 && Thick1 !== "") {
        QrygetData += `AND LIC_SEC1 >= nvl(:Thick1, LIC_SEC1) `;
        binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
      }
      if (Thick2 && Thick2 !== "") {
        QrygetData += `AND LIC_SEC1 <= nvl(:Thick2, LIC_SEC1) `;
        binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
      }
    }

    if (
      (Width1 && Array.isArray(Width1) && Width1.length > 1) ||
      (Width2 && Array.isArray(Width2) && Width2.length > 1)
    ) {
      if (Width1 && Array.isArray(Width1) && Width1.length > 1) {
        QrygetData += `AND LIC_SEC2 in(` + Width1.join(",") + `) `;
        // binds["Width1"] = Width1.join(',');
      } else if (Width2 && Array.isArray(Width2) && Width2.length > 1) {
        QrygetData += `AND LIC_SEC2 in(` + Width2.join(",") + `) `;
        // binds["Width2"] = Width2.join(',');
      }
    } else {
      if (Width1 && Width1?.length) {
        QrygetData += `AND LIC_SEC2 >= nvl(:Width1, LIC_SEC2) `;
        binds["Width1"] = Array.isArray(Width1) ? Width1[0] : Width1;
      }
      if (Width2 && Width2?.length) {
        QrygetData += `AND LIC_SEC2 <= nvl(:Width2, LIC_SEC2) `;
        binds["Width2"] = Array.isArray(Width2) ? Width2[0] : Width2;
      }
    }

    // if (Thick1 != '') {
    //     QrygetData += " AND LIC_SEC1 BETWEEN NVL(:Thick1, LIC_SEC1) AND NVL(:Thick2, NVL(:Thick1, LIC_SEC1))"
    //     Object.assign(binds, { Thick1: Thick1 });
    //     Object.assign(binds, { Thick2: Thick2 });
    // }

    // if (Width1 != '') {
    //     QrygetData += " AND LIC_SEC2 BETWEEN NVL(:Width1, LIC_SEC2) AND NVL(:Width2, NVL(:Width1, LIC_SEC2))"
    //     Object.assign(binds, { Width1: Width1 });
    //     Object.assign(binds, { Width2: Width2 });
    // }

    if (Material != "") {
      QrygetData += " AND LIC_NO_MATNR = NVL(:Material, LIC_NO_MATNR)";
      Object.assign(binds, { Material: Material });
    }

    if (INVOICE != "") {
      QrygetData += " AND LIC_NO_INVOICE = NVL(:INVOICE, LIC_NO_INVOICE)";
      Object.assign(binds, { INVOICE: INVOICE });
    }

    if (INVOICE_DTFROM != "") {
      QrygetData +=
        "AND TRUNC(LIC_DT_INVOICE) BETWEEN NVL(:INVOICE_DTFROM, TRUNC(LIC_DT_INVOICE)) AND NVL(:INVOICE_DTTO, NVL(:INVOICE_DTFROM, TRUNC(LIC_DT_INVOICE)))";
      Object.assign(binds, { INVOICE_DTFROM: INVOICE_DTFROM });
      Object.assign(binds, { INVOICE_DTTO: INVOICE_DTTO });
    }

    QrygetData += " ORDER BY LIC_NO_INVOICE";

    return await query.executeQuery(QrygetData, binds);
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

export const getStatus = async () => {
  try {
    // const sql = `select CD_VALUE val, CD_VALUE ||' - ' ||CD_DESC Display
    // from v_codes
    // where cd_type='TB004'
    // order by 1`;
    const sql = `SELECT
        *
    FROM
        (
            SELECT
                cd_value val,
                cd_value
                || ' - '
                || cd_desc display
            FROM
                v_codes
            WHERE
                cd_type = 'TB004'
            UNION
            SELECT
                nvl('', 'ALL') cd_value,
                nvl('', 'ALL') display
            FROM
                dual
        )
    ORDER BY
        1`;
    // const binds = {
    //     plant : plant
    //             }
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdia = async (plant: string) => {
  try {
    const sql = `SELECT DISTINCT EIC_SEC2 FROM V_INPUT_COIL
      WHERE EIC_CD_EPA=:plant
      ORDER BY 1
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
    const sql = `SELECT DISTINCT EIC_SEC1 FROM V_INPUT_COIL
      WHERE EIC_CD_EPA=:plant
      ORDER BY 1
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
    const sql = `SELECT DISTINCT EIC_LENGTH FROM V_INPUT_COIL
      WHERE EIC_CD_EPA=:plant
      ORDER BY 1
        `;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStoreLocation = async () => {
  try {
    const sql = `
        SELECT CD_DESC FROM V_CODES
        WHERE CD_TYPE='TB021'
        ORDER BY 1
        `;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
//-------------------------------------------------------------------------------------------------------------LDP
export const LDS001GetData = async (data: any) => {
  //  console.log(data)
  const binds = {
    Status: data?.Status,
  };
  try {
    let sql: any = ` SELECT NVL(EIC_ID_COIL , ' ') EIC_ID_COIL, NVL(EIC_CD_STATUS , ' ') EIC_CD_STATUS, 
             NVL(( SELECT DISTINCT CD_DESC FROM LDPDBA.T_CODES WHERE CD_TYPE = 'E0001' AND CD_VALUE = EIC_CD_STATUS AND ROWNUM = 1 ) , ' ') STATUS_DESC, 
             NVL( EIC_NO_INVOICE , ' ') EIC_NO_INVOICE, NVL( EIC_NO_CAST , ' ') EIC_NO_CAST, NVL(TO_CHAR(EIC_DT_INVOICE) , ' ') EIC_DT_INVOICE, 
             NVL(EIC_CD_PROD , ' ') EIC_CD_PROD, NVL(EIC_CD_QLTY_ACTL , ' ') EIC_CD_QLTY_ACTL,
             NVL(( SELECT DISTINCT IQL_GRADE_DESC FROM LDPDBA.T_QUALITY WHERE IQL_CD_QLTY = EIC_CD_QLTY_ACTL AND ROWNUM = 1) , ' ') QUALITY_DESC, 
             NVL(EIC_SEC1 , 0) EIC_SEC1, NVL(EIC_SEC2 , 0) EIC_SEC2, NVL(EIC_LENGTH , 0) EIC_LENGTH, NVL(EIC_TDC_ACTL , ' ') EIC_TDC_ACTL, 
             ''PROD_GRP,
             NVL(( SELECT DISTINCT LOM_PASSED_PROC FROM LDPDBA.T_LDP_PRODN WHERE LOM_ID_FIRST_PAR = EIC_ID_COIL AND ROWNUM = 1 AND LENGTH(LOM_PASSED_PROC) = ( SELECT MAX(LENGTH(LOM_PASSED_PROC)) FROM LDPDBA.T_LDP_PRODN WHERE LOM_ID_FIRST_PAR = EIC_ID_COIL ) ) , ' ' ) EPA_PASSED_PROC, 
             NVL( EIC_CD_EDGE , ' ' ) EIC_CD_EDGE, 
             NVL(EIC_MS_PIECE_ACTL , 0) EIC_MS_PIECE_ACTL, 
             NVL(( SELECT LOM_MS_GROSS_CAL FROM LDPDBA.T_LDP_PRODN WHERE LOM_CD_EPA = EIC_CD_EPA AND LOM_ID_BATCH = EIC_ID_COIL AND ROWNUM = 1 AND LOM_CD_STATUS IN ( 'VF', 'VB' ) ) , 0) RESIDUAL_WEIGHT, 
             NVL((SELECT DISTINCT LOM_MS_SCRAP FROM LDPDBA.T_LDP_PRODN WHERE LOM_ID_BATCH = EIC_ID_COIL AND LOM_CD_EPA = EIC_CD_EPA AND ROWNUM = 1),0) MS_SCRAP, NVL('' , ' ' ) PRIME, NVL('' , ' ') ARISING, 
             NVL('' , ' ') BALANCE_SLIT_SEC, NVL('' , ' ') PROCESSED_PRM, NVL('' , ' ') GROSS_YILED, NVL('' , ' ') PRIME_YIELD, NVL(EIC_WO_NO , ' ') EIC_WO_NO, NVL(EIC_ITEM_NO , 0) EIC_ITEM_NO, 
             '' ORDER_STATUS,
             NVL(( SELECT DISTINCT ENC_ID_ORDER FROM LDPDBA.T_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , ' ') ORDER_NO, 
             NVL(( SELECT DISTINCT ENC_NO_ITEM FROM LDPDBA.T_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , 0) ORDER_ITEM, 
             NVL(( SELECT DISTINCT ENC_ORDER_TYPE FROM LDPDBA.T_END_CUST_ORD_EPA WHERE ENC_WO_NO = EIC_WO_NO AND ENC_ITEM_NO = EIC_ITEM_NO AND ROWNUM = 1 ) , ' ') ORDER_TYPE, NVL( EIC_NO_MATNR, ' ') EIC_NO_MATNR, NVL(TO_CHAR(EIC_DT_LOADING) , ' ') EIC_DT_LOADING, NVL(( FLOOR(EIC_DT_LOADING - EIC_DT_INVOICE) ) , 0) TRANSIT_LEAD, 
             NVL('' , ' ') TIME, NVL(TO_CHAR(EIC_DT_PIECE_UPD) , ' ') EIC_DT_PIECE_UPD, NVL('' , ' ' ) BILLET, NVL('' , ' ') BILLET_PIECE, NVL(EIC_CD_YRD , ' ') EIC_CD_YRD, NVL(EIC_ID_LOC_X , ' ') EIC_ID_LOC_X, NVL(EIC_ID_LOC_Y , ' ') EIC_ID_LOC_Y, NVL(EIC_ID_POS , 0) EIC_ID_POS, NVL(EIC_REMARKS , ' ') EIC_REMARKS, NVL(( ROUND(EIC_DT_PIECE_UPD - EIC_DT_LOADING) ) , 0) PROC_DAYS, NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) INV_DAYS, 
             '' AGE,
             NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) EPA_AGE, 
             NVL(EIC_CD_EPA , ' ') EIC_CD_EPA, NVL(EIC_ID_OP_DECSN , ' ') EIC_ID_OP_DECSN, NVL(EIC_MARK_CUST , 0) EIC_MARK_CUST, NVL(EIC_MK_CUSTOMER , ' ') EIC_MK_CUSTOMER, NVL(EIC_CD_PLANT , ' ') EIC_CD_PLANT, 
               ''SALVAGING_REMARKS,''TOP_REMARKS,''BOTTOM_REMARKS,''FILE_NAME,'' WORK_CENTER,
              ''PASSED_PROC,
             NVL(( SELECT DISTINCT LOM_SCRAP_REMARKS FROM LDPDBA.T_LDP_PRODN WHERE LOM_ID_BATCH = EIC_ID_COIL AND LOM_CD_EPA = EIC_CD_EPA AND ROWNUM = 1 ) , ' ') SCRAP_REMARKS, 
             NVL(EIC_VEHICAL_NO , ' ')AS VEHICAL_NO ,
             NVL( EIC_NO_DELIVERY , ' ') EIC_NO_DELIVERY
             FROM LDPDBA.T_INPUT_COIL A 
             WHERE EIC_CD_STATUS= :Status`;
    if (data?.plantId === "ALL") {
    } else {
      sql += ` AND EIC_CD_EPA = :PLANT `;
      // binds["PLANT"] = data?.plantId;
      Object.assign(binds, { PLANT: data?.plantId });
    }

    // console.log("SQL=======>",sql,binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001GetPlantID = async (data: any) => {
  try {
    let sql: any = `select CD_VALUE,CD_DESC from LDPDBA.T_CODES
                              WHERE CD_TYPE='RMPNT'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001GetTestCastData = async (data: any) => {
  try {
    let sql: any = ` select'C' PROP, TCA_LAB_TEST_CD TEST_CD,TCA_TEST_PARA TEST_PARA,TCA_TEST_PARA_VAL PARA_VAL 
                              from LDPDBA.T_TC_CAST_TEST where
                              TCA_CAST_NO= :CASTNO
                              AND TRIM(TCA_TEST_PARA) IS NOT NULL`;

    const binds = {
      CASTNO: data?.INPUTDATA?.CastNo,
    };
    //  console.log(sql,binds)
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001GetTestBatchData = async (data: any) => {
  try {
    let sql: any = `select  'M' PROP,TCO_LAB_TEST_CD TEST_CD,TCO_TEST_PARA TEST_PARA,TCO_TEST_PARA_VAL PARA_VAL 
                          from LDPDBA.T_TC_COIL_TEST 
                          WHERE TCO_PROD_NO= :BATCHID 
                          AND TCO_CAST_NO= :CASTNO
                          AND TRIM(TCO_TEST_PARA) IS NOT NULL`;

    const binds = {
      BATCHID: data?.INPUTDATA?.Batchid,
      CASTNO: data?.INPUTDATA?.CastNo,
    };
    // console.log(sql,binds)
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001SaveLDS003 = async (data: any) => {
  try {
    // console.log("query.executeQuery")
    const sql = `call LDPDBA.LD50B001(
        NBT_EPA_CD => :NBT_EPA_CD,
        P_EIC_ID_COIL => :P_EIC_ID_COIL,
        NBT_EIC_NO_INVOICE => :NBT_EIC_NO_INVOICE,
        NBT_GR_DATE => :NBT_GR_DATE,
        P_EIC_ID_POS => :P_EIC_ID_POS,
        P_EIC_LOC_X => :P_EIC_LOC_X,
        P_EIC_LOC_Y => :P_EIC_LOC_Y,
        P_EIC_CD_YRD => :P_EIC_CD_YRD,
        P_EIC_REMARKS => :P_EIC_REMARKS,
        P_USER => :P_USER,
        P_STATUS => :P_STATUS,
        LS_OUT_FLAG => :LS_OUT_FLAG 
            )`;
    const binds = {
      NBT_EPA_CD: data?.NBT_EPA_CD ? data?.NBT_EPA_CD : "",
      P_EIC_ID_COIL: data?.P_EIC_ID_COIL ? data?.P_EIC_ID_COIL : "",
      NBT_EIC_NO_INVOICE: data?.NBT_EIC_NO_INVOICE
        ? data?.NBT_EIC_NO_INVOICE
        : "",
      NBT_GR_DATE: data?.NBT_GR_DATE ? data?.NBT_GR_DATE : "",
      P_EIC_ID_POS: data?.P_EIC_ID_POS ? data?.P_EIC_ID_POS : "",
      P_EIC_LOC_X: data?.P_EIC_LOC_X ? data?.P_EIC_LOC_X : "",
      P_EIC_LOC_Y: data?.P_EIC_LOC_Y ? data?.P_EIC_LOC_Y : "",
      P_EIC_CD_YRD: data?.P_EIC_CD_YRD ? data?.P_EIC_CD_YRD : "",
      P_EIC_REMARKS: data?.P_EIC_REMARKS ? data?.P_EIC_REMARKS : "",
      P_USER: data?.P_USER ? data?.P_USER : "",
      P_STATUS: data?.P_STATUS ? data?.P_STATUS : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log("e: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//     let sql: any = `select'M' PROP, TCO_LAB_TEST_CD TEST_CD,TCO_TEST_PARA TEST_PARA,TCO_TEST_PARA_VAL PARA_VAL ,TSL_PARA_MIN PARA_MIN,TSL_PARA_MAX PARA_MAX
//                             from V_TC_COIL_TEST,V_TDC_SPEC_LIMIT,V_INPUT_COIL where
//                             EIC_ID_COIL=:BATCHID
//                             AND TSL_TDC_NO=EIC_TDC_ACTL
//                             AND TSL_TEST_PARA=TCO_TEST_PARA
//                             AND TCO_PROD_NO=EIC_ID_COIL
//                             AND TCO_CAST_NO= :CASTNO
//                             AND TRIM(TCO_TEST_PARA) IS NOT NULL`;

//     const binds = {
//       BATCHID: data?.INPUTDATA?.Batchid,
//       CASTNO: data?.INPUTDATA?.CastNo,
//     };
//     console.log(sql, binds);
//     return await query.executeQuery(sql, binds);
//   } catch (error: any) {
//     console.log(error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const generateSeqNo = async (data: any) => {
  try {
    let seqNoQry: any = `select NVL(MAX(BTR_SEQ_NO),0)+1 BTR_SEQ_NO from V_LDP_CAST_TEST
      WHERE BTR_CAST_NO= :CASTNO AND BTR_PROD_NO= :BATCHID`;

    const seqNoResult = await query.executeQuery(seqNoQry, {
      CASTNO: data?.INPUTDATA?.CastNo,
      BATCHID: data?.INPUTDATA?.Batchid,
    });
    const currentSeqNo = seqNoResult.rows[0][0];

    return currentSeqNo;
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001UpdateCoilData = async (data: any, seqNo: any) => {
  try {
    // let sql: any = `UPDATE LDPDBA.T_TC_COIL_TEST
    //                 SET
    //                 TCO_TEST_PARA_VAL = :PARA_VAL,
    //                 TCO_UP_RESULT_TAG = 'N',
    //                 TCO_UPD_DT=sysdate,
    //                 TCO_UPD_BY= :USERID
    //                 WHERE TCO_PROD_NO= :BATCHID
    //                 AND TCO_CAST_NO= :CASTNO
    //                 AND TCO_TEST_PARA= :PARAM`;
    // const binds = {
    //   PARA_VAL : data?.INPUTDATA?.PARA_CHG_VAL,
    //   USERID   : data?.user,
    //   BATCHID  : data?.INPUTDATA?.BatchId,
    //   CASTNO   : data?.INPUTDATA?.CastNo,
    //   PARAM    : data?.INPUTDATA?.TEST_PARA,
    // }
    let sql: any = ` INSERT INTO  V_LDP_COIL_TEST  (
          LCO_CAST_NO,
          LCO_PROD_NO,
          LCO_LAB_TEST_CD,
          LCO_TEST_PARA,
          LCO_OPR_REMARKS,
          LCO_TEST_PARA_REM,
          LCO_CRT_DT,
          LCO_CRT_BY,
          LCO_UP_RESULT_TAG,
          LCO_TEST_PARA_VAL
          )
        VALUES (
          :CASTNO ,
          :BATCHID ,
          :TEST_CD ,
          :TEST_PARA ,
          'LDS002 OPR REMARK' ,
          NULL,
          SYSDATE,
          :USERID,
          'N',
          :PARA_CHG_VAL)`;

    const binds = {
      PARA_CHG_VAL: data?.INPUTDATA?.PARA_CHG_VAL,
      USERID: data?.USER,
      BATCHID: data?.INPUTDATA?.BatchId,
      CASTNO: data?.INPUTDATA?.CastNo,
      TEST_PARA: data?.INPUTDATA?.TEST_PARA,
      TEST_CD: data?.INPUTDATA?.TEST_CD,
    };

    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LDS001UpdateCastData = async (data: any, seqNo: any) => {
  try {
    // let sql: any = `UPDATE LDPDBA.T_TC_CAST_TEST
    //                       SET
    //                       TCA_TEST_PARA_VAL = :PARA_VAL,
    //                       TCA_UPD_DT=sysdate,
    //                       TCA_UPD_BY= :USERID
    //                       WHERE TCA_CAST_NO= :CASTNO
    //                       AND TCA_TEST_PARA= :PARAM`;

    // const binds = {
    //   PARA_VAL: data?.INPUTDATA?.PARA_CHG_VAL,
    //   USERID: data?.user,
    //   CASTNO: data?.INPUTDATA?.CastNo,
    //   PARAM: data?.INPUTDATA?.TEST_PARA,
    // };

    //     let seqNoQry: any = `select NVL(MAX(BTR_SEQ_NO),0)+1 BTR_SEQ_NO from V_LDP_CAST_TEST
    // WHERE BTR_CAST_NO= :CASTNO AND BTR_PROD_NO= :BATCHID`;

    //     const seqNoResult = await query.executeQuery(seqNoQry, {
    //       CASTNO: data?.INPUTDATA?.CastNo,
    //       BATCHID: data?.INPUTDATA?.Batchid,
    //     });
    //     const currentSeqNo = seqNoResult.rows[0][0];

    // const newSeqNo = currentSeqNo + 1;

    // console.log("newSeqNo: ", newSeqNo);
    // console.log("seqNoResult: ", seqNoResult.rows[0][0]);
    // console.log("currentSeqNo: ", currentSeqNo);

    let sql: any = `INSERT INTO  V_LDP_CAST_TEST  (
          BTR_CAST_NO,
          BTR_PROD_NO,
          BTR_LAB_TEST_CD,
          BTR_TEST_PARA,
          BTR_TEST_PARA_REM,
          BTR_CRT_DT,
          BTR_CRT_BY,
          BTR_TEST_PARA_VAL,
          BTR_SEQ_NO
          )
        VALUES (
          :CASTNO ,
          :BATCHID ,
          :TEST_CD ,
          :TEST_PARA ,
          NULL,
          SYSDATE,
          :USERID,
          :PARA_CHG_VAL,
          :seqNo)`;

    const binds = {
      PARA_CHG_VAL: data?.INPUTDATA?.PARA_CHG_VAL,
      USERID: data?.USER,
      BATCHID: data?.INPUTDATA?.BatchId,
      CASTNO: data?.INPUTDATA?.CastNo,
      TEST_PARA: data?.INPUTDATA?.TEST_PARA,
      TEST_CD: data?.INPUTDATA?.TEST_CD,
      seqNo: seqNo,
    };
    console.log("binds: ", binds);
    console.log("sqlQry: ", sql);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
