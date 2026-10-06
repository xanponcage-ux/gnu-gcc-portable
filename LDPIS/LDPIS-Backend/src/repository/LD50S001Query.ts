import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import OracleDB from "oracledb";

export const LD50S001GetData = async (data: any) => {
  //  console.log(data)
  const binds = {
    Status: data?.Status,
  };
  try {
    let sql: any = `SELECT NVL(EIC_ID_COIL , ' ') EIC_ID_COIL, NVL(EIC_CD_STATUS , ' ') EIC_CD_STATUS,
    EIC_ID_OP_DECSN OPERATOR_ID,EIC_MARK_CUST MARK_CUST,
    NVL(EIC_NO_MATNR , ' ') EIC_NO_MATNR,TO_CHAR(EIC_DT_LOADING, 'DD-MM-YYYY') AS ARRIVAL_DATE,
    EIC_VEHICAL_NO,
    TO_CHAR(EIC_TS_CREATION, 'DD-MM-YYYY') AS RECORD_CREATION,
     NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) AGE,
               NVL(( SELECT DISTINCT CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND CD_VALUE = EIC_CD_STATUS AND ROWNUM = 1 ) , ' ') STATUS_DESC,
              NVL( EIC_NO_CAST , ' ') EIC_NO_CAST, 
               NVL(EIC_CD_PROD , ' ') EIC_CD_PROD, NVL(EIC_CD_QLTY_ACTL , ' ') EIC_CD_QLTY_ACTL,
               NVL(EIC_SEC1 , 0) EIC_SEC1, NVL(EIC_SEC2 , 0) EIC_SEC2, NVL(EIC_LENGTH , 0) EIC_LENGTH, NVL(EIC_TDC_ACTL , ' ') EIC_TDC_ACTL,
               NVL( EIC_CD_EDGE , ' ' ) EIC_CD_EDGE,
               NVL(EIC_MS_PIECE_ACTL , 0) EIC_MS_PIECE_ACTL,
               NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) AGE,
               NVL(EIC_CD_EPA , ' ') EIC_CD_EPA, NVL(EIC_ID_OP_DECSN , ' ') EIC_ID_OP_DECSN, NVL(EIC_MARK_CUST , 0) EIC_MARK_CUST, NVL(EIC_MK_CUSTOMER , ' ') EIC_MK_CUSTOMER
               FROM V_INPUT_COIL A
               WHERE EIC_CD_STATUS= :Status `;
    if (data?.plantId === "ALL") {
    } else {
      sql += ` AND EIC_CD_EPA = :PLANT `;
      // binds["PLANT"] = data?.plantId;
      Object.assign(binds, { PLANT: data?.plantId });
    }
    //     if (BATCH_ID != "") {
    //       QrygetData += " And EIC_ID_COIL = NVL(:BATCH_ID, EIC_ID_COIL)"
    //       Object.assign(binds, { BATCH_ID: BATCH_ID });
    //   }

    //   if ((Thick1 && Array.isArray(Thick1) && Thick1.length > 1) || (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)) {
    //     if ((Thick1 && Array.isArray(Thick1) && Thick1.length > 1)) {
    //         QrygetData += `AND EIC_SEC1 in(` + Thick1.join(',') + `) `;
    //         // binds["Thick1"] = Thick1.join(',');
    //     } else if ((Thick2 && Array.isArray(Thick2) && Thick2.length > 1)) {
    //         QrygetData += `AND EIC_SEC1 in(` + Thick2.join(',') + `) `;
    //         // binds["Thick2"] = Thick2.join(',');
    //     }
    // } else {
    //     if (Thick1 && Thick1 !== "") {
    //         QrygetData += `AND EIC_SEC1 >= nvl(:Thick1, EIC_SEC1) `;
    //         binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
    //     }
    //     if (Thick2 && Thick2 !== "") {
    //         QrygetData += `AND EIC_SEC1 <= nvl(:Thick2, EIC_SEC1) `;
    //         binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
    //     }
    // }

    // if ((Width1 && Array.isArray(Width1) && Width1.length > 1) || (Width2 && Array.isArray(Width2) && Width2.length > 1)) {
    //     if ((Width1 && Array.isArray(Width1) && Width1.length > 1)) {
    //         QrygetData += `AND EIC_SEC2 in(` + Width1.join(',') + `) `;
    //         // binds["Width1"] = Width1.join(',');
    //     } else if ((Width2 && Array.isArray(Width2) && Width2.length > 1)) {
    //         QrygetData += `AND EIC_SEC2 in(` + Width2.join(',') + `) `;
    //         // binds["Width2"] = Width2.join(',');
    //     }
    // } else {
    //     if (Width1 && Width1?.length) {
    //         QrygetData += `AND EIC_SEC2 >= nvl(:Width1, EIC_SEC2) `;
    //         binds["Width1"] = Array.isArray(Width1) ? Width1[0] : Width1;
    //     }
    //     if (Width2 && Width2?.length) {
    //         QrygetData += `AND EIC_SEC2 <= nvl(:Width2, EIC_SEC2) `;
    //         binds["Width2"] = Array.isArray(Width2) ? Width2[0] : Width2;
    //     }
    // }

    // console.log("SQL=======>",sql,binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S001GetPlantID = async (data: any) => {
  try {
    let sql: any = `select CD_VALUE,CD_DESC from V_CODES
                            WHERE CD_TYPE='RMPNT'`;
    return await query.executeQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const LD50S001GetTestCastData = async (data: any) => {
  try {
    let sql: any = ` select'C' PROP, TCA_LAB_TEST_CD TEST_CD,TCA_TEST_PARA TEST_PARA,TCA_TEST_PARA_VAL PARA_VAL 
                            from V_TC_CAST_TEST where
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

export const LD50S001GetTestBatchData = async (data: any) => {
  try {
    let sql: any = `select  'M' PROP,TCO_LAB_TEST_CD TEST_CD,TCO_TEST_PARA TEST_PARA,TCO_TEST_PARA_VAL PARA_VAL 
                        from V_TC_COIL_TEST 
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

export const LD50S001SaveLDS003 = async (data: any) => {
  try {
    // console.log("Query")///
    //CHanges in code
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
        type: OracleDB.STRING,
        dir: OracleDB.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log("binds: ", binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log("e:-------> ", error);
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

export const LD50S001UpdateCoilData = async (data: any) => {
  try {
    // let sql: any = `UPDATE V_TC_COIL_TEST
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

export const LD50S001UpdateCastData = async (data: any, seqNo?: any) => {
  try {
    // let sql: any = `UPDATE V_TC_CAST_TEST
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
    //   console.log("newSeqNo: ", newSeqNo);
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

export const getRawMaterialData = async (
  batchId: any,
  tdc: any,
  Width1: any,
  Width2: any,
  Thick1: any,
  Thick2: any,
  Status: any,
  Plant: any,
) => {
  let binds = {
    Status: Status,
  };
  try {
    let sql: any = `SELECT NVL(EIC_ID_COIL , ' ') EIC_ID_COIL, NVL(EIC_CD_STATUS , ' ') EIC_CD_STATUS,
    EIC_ID_OP_DECSN OPERATOR_ID,EIC_MARK_CUST MARK_CUST,
    NVL(EIC_NO_MATNR , ' ') EIC_NO_MATNR,TO_CHAR(EIC_DT_LOADING, 'DD-MM-YYYY') AS ARRIVAL_DATE,
    EIC_VEHICAL_NO,
    TO_CHAR(EIC_TS_CREATION, 'DD-MM-YYYY') AS RECORD_CREATION,
     NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) AGE,
               NVL(( SELECT DISTINCT CD_DESC FROM V_CODES WHERE CD_TYPE = 'E0001' AND CD_VALUE = EIC_CD_STATUS AND ROWNUM = 1 ) , ' ') STATUS_DESC,
              NVL( EIC_NO_CAST , ' ') EIC_NO_CAST, 
               NVL(EIC_CD_PROD , ' ') EIC_CD_PROD, NVL(EIC_CD_QLTY_ACTL , ' ') EIC_CD_QLTY_ACTL,
               NVL(EIC_SEC1 , 0) EIC_SEC1, NVL(EIC_SEC2 , 0) EIC_SEC2, NVL(EIC_LENGTH , 0) EIC_LENGTH, NVL(EIC_TDC_ACTL , ' ') EIC_TDC_ACTL,
               NVL( EIC_CD_EDGE , ' ' ) EIC_CD_EDGE,
               NVL(EIC_MS_PIECE_ACTL , 0) EIC_MS_PIECE_ACTL,
               NVL(( ROUND(SYSDATE - EIC_DT_LOADING) ) , 0) AGE,
               NVL(EIC_CD_EPA , ' ') EIC_CD_EPA, NVL(EIC_ID_OP_DECSN , ' ') EIC_ID_OP_DECSN, NVL(EIC_MARK_CUST , 0) EIC_MARK_CUST, NVL(EIC_MK_CUSTOMER , ' ') EIC_MK_CUSTOMER
               FROM V_INPUT_COIL A
               WHERE EIC_CD_STATUS= :Status `;

    if (Plant != "") {
      sql += " And EIC_CD_EPA = NVL(:Plant, EIC_CD_EPA)";
      binds["Plant"] = Plant;
    }

    if (batchId != "") {
      sql += " And EIC_ID_COIL = NVL(:batchId, EIC_ID_COIL)";
      binds["batchId"] = batchId;
    }

    if (tdc != "") {
      sql += " And EIC_TDC_ACTL = NVL(:tdc, EIC_TDC_ACTL)";
      binds["tdc"] = tdc;
    }

    if (
      (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) ||
      (Thick2 && Array.isArray(Thick2) && Thick2.length > 1)
    ) {
      if (Thick1 && Array.isArray(Thick1) && Thick1.length > 1) {
        sql += `AND EIC_SEC1 in(` + Thick1.join(",") + `) `;
        // binds["Thick1"] = Thick1.join(',');
      } else if (Thick2 && Array.isArray(Thick2) && Thick2.length > 1) {
        sql += `AND EIC_SEC1 in(` + Thick2.join(",") + `) `;
        // binds["Thick2"] = Thick2.join(',');
      }
    } else {
      if (Thick1 && Thick1 !== "") {
        sql += `AND EIC_SEC1 >= nvl(:Thick1, EIC_SEC1) `;
        binds["Thick1"] = Array.isArray(Thick1) ? Thick1[0] : Thick1;
      }
      if (Thick2 && Thick2 !== "") {
        sql += `AND EIC_SEC1 <= nvl(:Thick2, EIC_SEC1) `;
        binds["Thick2"] = Array.isArray(Thick2) ? Thick2[0] : Thick2;
      }
    }

    if (
      (Width1 && Array.isArray(Width1) && Width1.length > 1) ||
      (Width2 && Array.isArray(Width2) && Width2.length > 1)
    ) {
      if (Width1 && Array.isArray(Width1) && Width1.length > 1) {
        sql += `AND EIC_SEC2 in(` + Width1.join(",") + `) `;
        // binds["Width1"] = Width1.join(',');
      } else if (Width2 && Array.isArray(Width2) && Width2.length > 1) {
        sql += `AND EIC_SEC2 in(` + Width2.join(",") + `) `;
        // binds["Width2"] = Width2.join(',');
      }
    } else {
      if (Width1 && Width1?.length) {
        sql += `AND EIC_SEC2 >= nvl(:Width1, EIC_SEC2) `;
        binds["Width1"] = Array.isArray(Width1) ? Width1[0] : Width1;
      }
      if (Width2 && Width2?.length) {
        sql += `AND EIC_SEC2 <= nvl(:Width2, EIC_SEC2) `;
        binds["Width2"] = Array.isArray(Width2) ? Width2[0] : Width2;
      }
    }

    console.log("SQLReceive=======>", sql, binds);
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
