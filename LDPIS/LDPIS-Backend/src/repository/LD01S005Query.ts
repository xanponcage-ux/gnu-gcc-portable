import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getList = async (props: any) => {
  try {
    let sql = ``;
    console.log("INSIDE LINK");
    if (props.param == "GetCoil" && props.type == "LINK") {
      let batchFilter = "";

      if (props.coilIds && props.coilIds.length > 0) {
        const formattedIds = props.coilIds
          .map((id: string) => `'${id}'`)
          .join(",");

        batchFilter = ` AND lom_id_batch IN (${formattedIds}) `;
      }
      // console.log("batchFilter: ", batchFilter);

      sql = `
      select lom_id_batch Batch1,LOM_SEC1 Thk
      ,LOM_SEC2 Odia
      ,LOM_NO_CAST Cast
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
      ,LOM_TAGGED_BATCH TAGGED_BATCH
      ,LOM_NO_MATNR MAT_NO
      from v_ldp_prodn
      where lom_cd_status in ('WB', 'WF' ) -- FIXED
      ${batchFilter}
      --and lom_id_batch= NVL('${props.coilId ?? null}',lom_id_batch)
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
      console.log("sql-getList-link: ", sql);
      return await query.executeQuery(sql);

      //
    } else if (props.param == "GetCoil" && props.type == "DELINK") {
      console.log("INSIDE DELINK");
      let batchFilter = "";

      if (props.coilIds && props.coilIds.length > 0) {
        const formattedIds = props.coilIds
          .map((id: string) => `'${id}'`)
          .join(",");

        batchFilter = ` AND lom_id_batch IN (${formattedIds}) `;
      }
      sql = `
        select lom_id_batch Batch1,LOM_SEC1 Thk
        ,LOM_SEC2 Odia
        ,LOM_NO_CAST Cast
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
        where lom_cd_status in ('WB') -- FIXED
        ${batchFilter}
        --and lom_id_batch= NVL('${props.coilId ?? null}',lom_id_batch)
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
      console.log("sql-getList-DELINK: ", sql);
      return await query.executeQuery(sql);
      //
    } else if (props.param == "GetOrder") {
      sql = `
      SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_ROLL (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
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
      FROM V_END_CUST_ORD_EPA
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A'
      and ENC_ID_ORDER = NVL('${props.orderId ?? null}',ENC_ID_ORDER)
      and ENC_NO_ITEM = NVL('${props.itemId ?? null}',ENC_NO_ITEM)
      and ENC_SEC1_MIN between NVL('${
        props.thkFrom ?? null
      }',ENC_SEC1_MIN) and NVL('${props.thkTo ?? null}',ENC_SEC1_MIN)
      and ENC_SEC2_MAX between NVL('${
        props.odiaFrom ?? null
      }',ENC_SEC2_MIN) and NVL('${props.odiaTo ?? null}',ENC_SEC2_MAX)
      and ENC_GEOMETRY = NVL('${props.section ?? null}',ENC_GEOMETRY)
      and ENC_NO_MATNR = NVL('${props?.matNo ?? null}', ENC_NO_MATNR)
      ORDER BY ENC_DT_ORD_CREATE DESC
      `;
      console.log("sqlCoil: ", sql);
      return await query.executeQuery(sql);
    } else if (props.param == "UpdateCoil") {
      const sql = `call LDPDBA.LDLTB002(
          LS_BATCH => :LS_BATCH,
          LS_ORDER => :LS_ORDER,
          LS_ITEM => :LS_ITEM,
          LS_LINK_TYPE => :LS_LINK_TYPE,
          LS_OUT_FLAG => :LS_OUT_FLAG
        )`;

      let binds = {};
      binds = {
        LS_BATCH: props?.selectedBatch,
        LS_ORDER: props?.selectedOrder,
        LS_ITEM: props?.selectedItem,
        LS_LINK_TYPE: props?.type,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
      console.log("sql11111: ", sql);
      console.log("bindsProc111111: ", binds);
      let result = await query.executeQuery(sql, binds);
      // console.log("result: ", result);
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
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFittingOrder = async (props: any) => {
  try {
    let sql = ` SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_ROLL (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
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
      FROM V_END_CUST_ORD_EPA
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A'
      and ENC_NO_MATNR in ('${props?.matNo}')
      --(SELECT DISTINCT TMM_FG_MAT
        --   FROM V_TUB_MATL_MAPPING
          --WHERE TMM_CD_EPA = '0780' AND TMM_RM_MAT = '${props?.matNo}')
      and ENC_ID_ORDER = NVL('${props.orderId ?? null}',ENC_ID_ORDER)
      and ENC_NO_ITEM = NVL('${props.itemId ?? null}',ENC_NO_ITEM)
      and ENC_SEC1_MIN between NVL('${
        props.thkFrom ?? null
      }',ENC_SEC1_MIN) and NVL('${props.thkTo ?? null}',ENC_SEC1_MIN)
      and ENC_SEC2_MAX between NVL('${
        props.odiaFrom ?? null
      }',ENC_SEC2_MIN) and NVL('${props.odiaTo ?? null}',ENC_SEC2_MAX)
      and ENC_GEOMETRY = NVL('${props.section ?? null}',ENC_GEOMETRY)
     ORDER BY ENC_DT_ORD_CREATE DESC `;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
