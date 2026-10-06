import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getList = async (props: any) => {
  try {
    console.log("props", props);
    let binds = {};
    // Changed on - 05.01.2026, To allow multiselect in WIP Linking
    if (props?.type == "DELINK" || props?.type == "LINK") {
      binds = {
        LS_BATCH: props?.DelinkRow?.BATCH1,
        LS_ORDER:
          props?.type == "DELINK"
            ? props?.DelinkRow?.ORD
            : props?.newDataOrder?.[0]?.ORD,
        LS_ITEM:
          props?.type == "DELINK"
            ? props?.DelinkRow?.ITEM
            : props?.newDataOrder?.[0]?.ITEM,
        LS_LINK_TYPE: props?.type,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
    } else {
      binds = {
        LS_BATCH: props?.newDataDelink?.[0]?.BATCH1,
        LS_ORDER: props?.newDataOrder?.[0]?.ORD,
        LS_ITEM: props?.newDataOrder?.[0]?.ITEM,
        LS_LINK_TYPE: props?.type,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
    }
    console.log("binds", binds);
    const statusCondition =
      props.type === "LINK"
        ? `lom_cd_status IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'TB046' AND CD_DESC = 'WIP_LINK_STATUS')`
        : props.type === "DELINK"
        ? `lom_cd_status IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'TB046' AND CD_DESC = 'WIP_DELINK_STATUS')`
        : `lom_cd_status IN (SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'TB046' AND CD_DESC = 'WIP_LINK_STATUS')`; // Default to LINK if type is not specified
    let sql = ``;
    if (props.param == "GetCoil") {
      sql = `
      select LOM_ID_BATCH Batch1,LOM_SEC1 Thk
      ,LOM_SEC2 Odia
      ,LOM_LENGTH length1
      ,LOM_MS_PIECE_ACTL net_wt
      ,LOM_TDC_ACTL Grade
      ,LOM_CD_STATUS Status
      ,LOM_PLANNED_PROC Planned_Proc
      ,LOM_PASSED_PROC Passed_Proc
      ,LOM_CD_CURR_PROC curr_proc
      ,LOM_CD_NEXT_PROC Next_Proc
      ,LOM_ID_PAR_COIL_NO Parent_Batch
      ,LOM_ID_FIRST_PAR   Mother_Batch
      ,LOM_ID_ORDER_CUS Ord
      ,LOM_ID_ORD_ITEM_CUS Item
      ,LOM_MILL_NO Mill_No
      ,LOM_SAMPL_TAG Sample_Tag
      ,To_char(LOM_TS_CREATION,'yyyy-MM-dd HH24:MI:SS') Batch_crt_dt
      ,LOM_NO_MATNR MAT_NO
      from v_ldp_prodn
      WHERE ${statusCondition}
      and lom_id_batch= NVL('${props.coilId ?? null}',lom_id_batch)
      AND LOM_ID_PAR_COIL_NO =NVL('${
        props.parentBatch ?? null
      }',LOM_ID_PAR_COIL_NO)
      AND LOM_ID_FIRST_PAR = NVL('${
        props.motherBatch ?? null
      }',LOM_ID_FIRST_PAR)
      AND LOM_SEC2 = NVL('${props.odia ?? null}',LOM_SEC2)
      AND LOM_SEC1 = NVL('${props.thick ?? null}',LOM_SEC1)
      ORDER BY Batch_crt_dt DESC
      `;
      // console.log("sqlCoil : ", sql);
      return await query.executeQuery(sql);
    } else if (props.param == "GetOrder") {
      // Removing join from v_tub_matl_mapping, no longer need of fitting order in WIP
      sql = `
      SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_SCHD (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
      ,ENC_LENGTH_MIN length_min
      ,ENC_LENGTH_MAX length_max
      ,ENC_SEC1_MIN Thk_Min
      ,ENC_SEC1_MAX Thk_Max
      ,ENC_SEC2_MAX Odia_Min
      ,ENC_SEC2_MAX Odia_Max
      ,ENC_NO_MATNR FG_mat
      ,(select MAKTX from v_makt where mandt='600' AND MATNR=ENC_NO_MATNR)FG_DESC
      ,ENC_MARK_CUST Mark_cust_cd
      ,ENC_MARK_CUST_NAME Mark_Cust_NM
      ,ENC_MATNR_IP IP
      ,ENC_MATNR_SPEC SPEC
      ,ENC_SUR_FINISH Sur_Finish
      ,ENC_END_FINISH End_Finish
      ,ENC_FIN_COND Fin_Condition
      ,ENC_GEOMETRY Geometry
      ,DECODE(ENC_GEOMETRY,'O','Round','R','Section','S','Section',ENC_GEOMETRY) Section_Type
      FROM V_END_CUST_ORD_EPA --,v_tub_matl_mapping
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A' `;

      if (props.orderId && props.orderId != "") {
        sql += ` AND ENC_ID_ORDER = NVL('${props.orderId}',ENC_ID_ORDER) `;
        // binds["Odr"] = props.orderId;
      }

      if (props.itemId && props.itemId != "") {
        sql += ` AND ENC_NO_ITEM = NVL('${props.itemId}',ENC_NO_ITEM) `;
        // binds["Item"] = props.itemId;
      }

      if (props.thkFrom && props.thkFrom !== "") {
        sql += `AND enc_sec1_min >= nvl('${props.thkFrom}', enc_sec1_min) `;
        // binds["Thick1"] = props.thkFrom;
      }
      if (props.thkTo && props.thkTo !== "") {
        sql += `AND enc_sec1_max <= nvl('${props.thkTo}', enc_sec1_max) `;
        // binds["Thick2"] = props.thkTo;
      }

      if (props.odiaFrom && props.odiaFrom !== "") {
        sql += `AND ENC_SEC2_MIN >= nvl('${props.odiaFrom}', ENC_SEC2_MIN) `;
        // binds["Odiafrm"] = props.odiaFrom;
      }
      if (props.odiaTo && props.odiaTo !== "") {
        sql += `AND ENC_SEC2_MAX <= nvl('${props.odiaTo}', ENC_SEC2_MAX) `;
        // binds["OdiaTo"] = props.odiaTo;
      }
      if (props.section && props.section !== "") {
        sql += `AND ENC_GEOMETRY = nvl('${props.section}', ENC_GEOMETRY) `;
        // binds["section"] = props.section;
      }
      if (props.matNo && props.matNo !== "") {
        sql += `AND ENC_NO_MATNR = nvl('${props.matNo}', ENC_NO_MATNR) `;
        // binds["matnr"] = props.matNo;
      }

      sql += `AND (SELECT f_bal_to_schd (enc_cd_epa, enc_id_order, enc_no_item)
      FROM DUAL) > 0
     --AND NVL (tmm_priority_no, 1) = '1'
      ORDER BY ENC_CD_EPA, ENC_ID_ORDER,ENC_NO_ITEM `;

      // console.log("sqlCoil: ", sql);
      return await query.executeQuery(sql);
    } else if (props.param == "UpdateCoil") {
      const sql = `call LDPDBA.LDLTB003(
          LS_BATCH => :LS_BATCH,
          LS_ORDER => :LS_ORDER,
          LS_ITEM => :LS_ITEM,
          LS_LINK_TYPE => :LS_LINK_TYPE,
          LS_OUT_FLAG => :LS_OUT_FLAG
        )`;

      console.log("sqlUpdateCoil: ", sql);
      console.log("bindsProc: ", binds);
      let result = await query.executeQuery(sql, binds);
      console.log("resultProc: ", result);
      return result;
    }
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatNoList = async (data: any) => {
  try {
    let sql;
    if (data?.type === "FITORD") {
      sql = `SELECT DISTINCT TMM_FG_MAT MAT_NO
      FROM V_TUB_MATL_MAPPING
      WHERE TMM_CD_EPA = '${data?.plant}' AND TMM_RM_MAT = '${data?.matNo}'`;
    } else {
      sql = ` SELECT DISTINCT ENC_NO_MATNR MAT_NO
           FROM V_END_CUST_ORD_EPA
          WHERE ENC_CD_EPA = '${data?.plant}'
            AND ENC_ST_ORDER = 'A'
            AND ENC_SLIT_PLAN = 'TUBE'
       ORDER BY 1 `;
    }
    // console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getWipOrders = async (props: any) => {
  try {
    let sql = `
      SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_SCHD (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
      ,ENC_LENGTH_MIN length_min
      ,ENC_LENGTH_MAX length_max
      ,ENC_SEC1_MIN Thk_Min
      ,ENC_SEC1_MAX Thk_Max
      ,ENC_SEC2_MAX Odia_Min
      ,ENC_SEC2_MAX Odia_Max
      ,ENC_NO_MATNR FG_mat
      ,(select MAKTX from v_makt where mandt='600' AND MATNR=ENC_NO_MATNR)FG_DESC
      ,ENC_MARK_CUST Mark_cust_cd
      ,ENC_MARK_CUST_NAME Mark_Cust_NM
      ,ENC_MATNR_IP IP
      ,ENC_MATNR_SPEC SPEC
      ,ENC_SUR_FINISH Sur_Finish
      ,ENC_END_FINISH End_Finish
      ,ENC_FIN_COND Fin_Condition
      ,ENC_GEOMETRY Geometry
      ,DECODE(ENC_GEOMETRY,'O','Round','R','Section','S','Section',ENC_GEOMETRY) Section_Type
      FROM V_END_CUST_ORD_EPA --,v_tub_matl_mapping
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A' `;

    if (props.orderId && props.orderId != "") {
      sql += ` AND ENC_ID_ORDER = NVL('${props.orderId}',ENC_ID_ORDER) `;
    }

    if (props.itemId && props.itemId != "") {
      sql += ` AND ENC_NO_ITEM = NVL('${props.itemId}',ENC_NO_ITEM) `;
    }

    if (props.section && props.section !== "") {
      sql += `AND ENC_GEOMETRY = nvl('${props.section}', ENC_GEOMETRY) `;
    }
    if (props.matNo && props.matNo !== "") {
      sql += `AND ENC_NO_MATNR = nvl('${props.matNo}', ENC_NO_MATNR) `;
    }

    sql += `AND (SELECT f_bal_to_schd (enc_cd_epa, enc_id_order, enc_no_item)
      FROM DUAL) > 0
     --AND NVL (tmm_priority_no, 1) = '1'
      ORDER BY ENC_CD_EPA, ENC_ID_ORDER,ENC_NO_ITEM `;

    // console.log("sqlOrder : ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
