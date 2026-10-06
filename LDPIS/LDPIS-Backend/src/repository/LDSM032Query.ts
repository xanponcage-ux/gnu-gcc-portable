import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRolePlant = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetProcDesc = async (Plant: any, tabValue: any) => {
  try {
    let sql;
    if (tabValue == 0) {
      sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_NO_PROC_SEQ=1 ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    } else {
      sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    }

    let binds = [`${Plant}`];

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetIDIA = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA= :0
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetODIA = async (Plant: any) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA=:0
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetRoll = async (Plant: any) => {
  try {
    const sql = `select distinct(tro_id_rollchange) roll from v_rollchange_order where tro_roll_status='A'and tro_cd_epa= :0 ORDER BY 1 DESC`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetPath = async (Plant: any, Process: any) => {
  try {
    const sql = `select distinct(pph_cd_proc_path)path from v_epa_proc_path where pph_cd_proc_path not in (select epl_cd_process||'KW' from v_epa_proc_line where epl_cd_epa = :0 and epl_activity_nm = 'SLT') and pph_cd_proc_path like '%'||NVL( :1 ,pph_cd_proc_path)||'%' and pph_cd_epa = :2 `;
    let binds = [`${Plant}`, `${Process}`, `${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const OrdercHK = async (Plant: any, OrderNo: any, ItemNo: any) => {
  try {
    const sql = `SELECT COUNT(1) FROM V_END_CUST_ORD_EPA WHERE ENC_CD_ePA :0 and enc_id_order=:1  and enc_no_item=:2`;
    let binds = [`${Plant}`, `${OrderNo}`, `${ItemNo}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const RMDetails = async (Plant: any, FG_Mat: any) => {
  try {
    const sql = `select CHARG Mother_Batch, MATNR, (SELECT MAKTX FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR= LPAD(A.MATNR,18,'0') AND ROWNUM=1) RM_MATNR_DESC ,RAW_QTY ,SFG_QTY,FG_QTY ,EIC_SEC1 THK,EIC_SEC2 WIDTH ,(SELECT GRADE FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=A.MATNR) GRADE ,ROUND((SYSDATE-B.EIC_DT_LOADING)) COIL_AGE from v_tube_planning A LEFT OUTER JOIN V_INPUT_COIL B ON A.WERKS = EIC_CD_EPA AND A.CHARG = EIC_ID_COIL where mandt='600' and werks=:0 and VBELN = :1 AND POSNR = :2`;
    let binds = [`${Plant.EOP_CD_EPA}`, `${Plant.EOP_ID_ORDER}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const schTypModal = async (
  Plant: any,
  RM_Mat: any,
  Order: any,
  Item: any
) => {
  try {
    let sql = `SELECT COUNT(1) FROM V_WORK_INST
        WHERE EWI_CD_ePA= :plant
        AND EWI_ID_ORDER_CUS = :Ordered
        AND EWI_ID_ORD_ITEM_CUS = :iTEM
        AND EWI_CD_STATUS IN ('WC','CN')`;
    let binds = {
      plant: Plant,
      Ordered: Order,
      iTEM: Item,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CoilDetails = async (
  Plant: any,
  RM_Mat: any,
  Order: any,
  Item: any
) => {
  try {
    // Scheduling Details Table
    let sql = `SELECT   LOM_id_batch, LOM_sec1, LOM_sec2, LTRIM (LOM_no_matnr, '0') material,
        (SELECT maktx
           FROM v_makt
          WHERE matnr = '600' AND matnr = LOM_no_matnr AND ROWNUM = 1) maktx,
        LOM_tdc_actl, LOM_ms_gross_actl prc_wt,
        ROUND (SYSDATE - LOM_ts_creation) age,
        NVL (LOM_ms_gross_cal, 0) gross_wt,
        ( NVL (LOM_ms_gross_cal, 0) * 1000) sch_qty 
   FROM v_LDP_PRODN b
  WHERE LOM_cd_epa = :plant
    AND LOM_ms_gross_cal > 0
    AND LOM_cd_status ='VM'
    AND LOM_ID_ORDER_CUS = :Ordered
    AND LOM_ID_ORD_ITEM_CUS = :iTEM
GROUP BY LOM_sec1,
        LOM_sec2,
        LOM_no_matnr,
        LOM_tdc_actl,
        LOM_ms_gross_cal,
        LOM_ms_gross_actl,
        LOM_ts_creation,
        LOM_id_batch
ORDER BY 8, 1 DESC`;

    let binds = {
      plant: Plant,
      Ordered: Order,
      iTEM: Item,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetSchDetl = async (Plant: any, Process: any, BatchID: any) => {
  try {
    const sql = `select ewi_id_batch,ewi_uom, ewi_l_sco_order, ewi_no_pieces,ewi_ms_piece_actl,ewi_id_order_cus,ewi_id_ord_item_cus,ewi_cd_status,ewi_no_sco_order,ewi_no_sco_item,ewi_priority,ewi_no_pack,to_char(ewi_ts_creation,'DD-MON-YY')cr_dt,enc_cust_name,ewi_id_wrk_inst,ewi_id_schedule,ewi_sec2,ewi_idia from v_work_inst,v_end_cust_ord_epa where ewi_cd_epa=enc_cd_epa and ewi_id_order_cus=enc_id_order and ewi_id_ord_item_cus =enc_no_item and ewi_cd_epa=:0 and ewi_id_batch=nvl(:1,ewi_id_batch) and ewi_cd_process=:2 and ewi_cd_status='WC' `;
    let binds = [`${Plant}`, `${BatchID}`, `${Process}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetInqDetl = async (
  Plant: any,
  Process: any,
  BatchID: any,
  Status: any,
  OrdID: any,
  OrdItm: any,
  Prod_DT: any
) => {
  try {
    const sql = `select ewi_id_batch,ewi_no_pieces,ewi_ms_piece_actl,ewi_id_order_cus,ewi_id_ord_item_cus,ewi_cd_status,ewi_no_sco_order,ewi_no_sco_item,ewi_priority,ewi_no_pack,to_char(ewi_ts_creation,'DD-MON-YY')cr_dt,enc_cust_name,ewi_id_wrk_inst,ewi_id_schedule,ewi_sec2,ewi_idia from v_work_inst,v_end_cust_ord_epa where ewi_cd_epa=enc_cd_epa and ewi_id_order_cus=enc_id_order and ewi_id_ord_item_cus =enc_no_item and ewi_cd_epa=:Plant and ewi_id_batch=nvl(:BatchID,ewi_id_batch)  and ewi_cd_process=nvl(:Process,ewi_cd_process) and ewi_cd_status= nvl(:Status,ewi_cd_status) and ewi_id_order_cus=nvl(:OrdID,ewi_id_order_cus) and ewi_id_ord_item_cus=nvl(:OrdItm,ewi_id_ord_item_cus) AND  to_char(ewi_ts_creation,'DD-MON-YY') = nvl(TO_CHAR(to_DATE(:Prod_DT,'DD-MON-YYYY'),'DD-MON-YY'),to_char(ewi_ts_creation,'DD-MON-YY')) `;
    //let binds = [`${Plant}`, `${Process}`, `${BatchID}`, `${Status}`, `${OrdID}`, `${OrdItm}`, `${Prod_DT}`];
    let binds = {
      Plant: Plant,
      Process: Process,
      BatchID: BatchID,
      Status: Status,
      OrdID: OrdID,
      OrdItm: OrdItm,
      Prod_DT: Prod_DT,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetWIPSchDetl = async (Plant: any, BatchID: any) => {
  try {
    const sql = `select ewi_id_batch,ewi_sec1,ewi_sec2,ewi_length,ewi_idia,ewi_id_order_cus,ewi_id_ord_item_cus,LOM_ms_gross_cal,ewi_id_parent_batch,ewi_no_sco_order,ewi_no_sco_item,ewi_camp_no,to_char(ewi_ts_creation,'DD-MON-YY')cr_dt from v_work_inst,v_LDP_PRODN where LOM_cd_epa=ewi_cd_epa and LOM_id_batch=ewi_id_batch and LOM_cd_status like '%B' and LOM_cd_status not in ('KB','WB','WL') and ewi_cd_status='PR' and ewi_cd_epa=:Plant and ewi_cd_qlty not in (select distinct(cd_value) from v_codes where cd_type='EPA82') and ewi_id_batch=nvl(:BatchID,ewi_id_batch)`;
    let binds = [`${Plant}`, `${BatchID}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ScheduleConf = async (req: any) => {
  const { Plant, shift, Prod_dt, dt, CHK_PFS, Process } = req.body;
  try {
    var res;
    if (dt) {
      const sql = `call C1CEB170_SCHED_CONFIRM ( 
                NBT_REL_DT => :NBT_REL_DT,
                NBT_LOM_CD_SHIFT => :NBT_LOM_CD_SHIFT,
                CHK_INQ => :CHK_INQ,
                P_EWI_ID_BATCH => :P_EWI_ID_BATCH,
                EWI_NO_PIECES => :EWI_NO_PIECES,
                EWI_MS_PIECE_ACTL => :EWI_MS_PIECE_ACTL,
                EWI_ID_ORDER_CUS => :EWI_ID_ORDER_CUS,
                EWI_ID_ORD_ITEM_CUS => :EWI_ID_ORD_ITEM_CUS,
                EWI_CD_STATUS => :EWI_CD_STATUS,
                EWI_NO_SCO_ORDER => :EWI_NO_SCO_ORDER,
                EWI_NO_SCO_ITEM => :EWI_NO_SCO_ITEM,
                EWI_NO_PACK => :EWI_NO_PACK,
                EWI_TS_CREATION => :EWI_TS_CREATION,
                NBT_CUST_NAME => :NBT_CUST_NAME,
                NBT_PROC_LINE => :NBT_PROC_LINE,
                NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
                P_EWI_ID_WRK_INST => :P_EWI_ID_WRK_INST,
                LS_OUT_FLAG => :LS_OUT_FLAG
                )`;

      const binds = {
        NBT_REL_DT: Prod_dt,
        NBT_LOM_CD_SHIFT: shift,
        CHK_INQ: "Y",
        P_EWI_ID_BATCH: dt.EWI_ID_BATCH,
        EWI_NO_PIECES: dt.EWI_NO_PIECES,
        EWI_MS_PIECE_ACTL: dt.EWI_MS_PIECE_ACTL,
        EWI_ID_ORDER_CUS: dt.EWI_ID_ORDER_CUS,
        EWI_ID_ORD_ITEM_CUS: dt.EWI_ID_ORD_ITEM_CUS,
        EWI_CD_STATUS: dt.EWI_CD_STATUS,
        EWI_NO_SCO_ORDER: dt.EWI_NO_SCO_ORDER,
        EWI_NO_SCO_ITEM: dt.EWI_NO_SCO_ITEM,
        EWI_NO_PACK: dt.EWI_NO_PACK,
        EWI_TS_CREATION: dt.CR_DT,
        NBT_CUST_NAME: dt.ENC_CUST_NAME,
        NBT_PROC_LINE: Process,
        NBT_EPL_CD_EPA: Plant,
        P_EWI_ID_WRK_INST: dt.EWI_ID_WRK_INST,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };
      res = await query.executeQuery(sql, binds);
    } else {
      const sql = `call C1CEB170_NO_PACK ( 
                Plant => :Plant,
                BatchID => :BatchID,
                Proc => :Proc,
                CustOrd => :CustOrd,
                CustItm => :CustItm,
                piece_actl => :piece_actl,
                id_wrk_inst => :id_wrk_inst,
                chk_inq => :chk_inq,
                nbt_rel_dt => :nbt_rel_dt,
                nbt_LOM_cd_shift => :nbt_LOM_cd_shift,
                CHK_PFS => :CHK_PFS,
                LS_OUT_FLAG => :LS_OUT_FLAG
                )`;

      const binds = {
        Plant: Plant,
        BatchID: dt.BATCHID,
        Proc: dt.PROC_LINE,
        CustOrd: dt.CUST_ORD,
        CustItm: dt.CUST_ITM,
        piece_actl: dt.PIECE_ACTL,
        id_wrk_inst: dt.ID_WRK_INST,
        chk_inq: "Y",
        nbt_rel_dt: Prod_dt,
        nbt_LOM_cd_shift: shift,
        CHK_PFS: CHK_PFS,
        LS_OUT_FLAG: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 500,
        },
      };

      res = await query.executeQuery(sql, binds);
    }
    return res;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ScheduleDel = async (req: any) => {
  try {
    const sql = `call C1CEB170_SCHED_DEL (
            CHK_INQ => :CHK_INQ,
            P_EWI_CD_STATUS => :P_EWI_CD_STATUS,
            P_EWI_ID_BATCH => :P_EWI_ID_BATCH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            P_EWI_ID_WRK_INST => :P_EWI_ID_WRK_INST,
            REC_FLAG => :REC_FLAG,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      CHK_INQ: "Y",
      P_EWI_CD_STATUS: req.body.dt.EWI_CD_STATUS ?? "",
      P_EWI_ID_BATCH: req.body.dt.EWI_ID_BATCH ?? "",
      NBT_EPL_CD_EPA: req.body.Plant ?? "",
      P_EWI_ID_WRK_INST: req.body.dt.EWI_ID_WRK_INST ?? "",
      REC_FLAG: "F", //CODE FOR FULL DELETION
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

export const WIPSchedule = async (req: any) => {
  try {
    const { Plant, PROC_LINE, BATCHID, ORD_ID, ORD_ITM } = req.body;
    const sql = `call C1CEB170_WIP_SCHED (
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            NBT_PROC_LINE => :NBT_PROC_LINE,
            CHK_WIP => :CHK_WIP,
            EWI_ID_BATCH => :EWI_ID_BATCH,
            EWI_ID_ORDER_CUS => :EWI_ID_ORDER_CUS,
            EWI_ID_ORD_ITEM_CUS => :EWI_ID_ORD_ITEM_CUS,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      NBT_EPL_CD_EPA: Plant,
      NBT_PROC_LINE: PROC_LINE ?? "",
      CHK_WIP: "Y",
      EWI_ID_BATCH: BATCHID ?? "",
      EWI_ID_ORDER_CUS: ORD_ID ?? "",
      EWI_ID_ORD_ITEM_CUS: ORD_ITM ?? "",
      LS_OUT_FLAG: "Z",
      // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const CRTSchedule = async (req: any) => {
  try {
    const {
      PlanPath,
      Plant,
      Process,
      ORD_ID,
      ORD_ITM,
      ORD_QTY,
      IDIA,
      ODIA,
      LENGTH,
      THICK,
      GRADE,
      MATNR,
      PROS_WT,
      GALVY_WT,
      rollchange,
      MOTHER_BATCH,
      CL_WT,
      CL_MATNR,
      FG_WT,
      adid,
      EOP_SFG_MATNR_BOM,
      P_SCH_TYPE_FL,
      P_NOMINATE_BATCH,
      P_NOMINATE_MATNR,
    } = req.body;
    const sql = `call C1CEB170_CRT_SCHED (
            CHK_COIL => :CHK_COIL,
            PARAM_PLANT_CNT => :PARAM_PLANT_CNT,
            PPH_CD_PROC_PATH => :PPH_CD_PROC_PATH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            NBT_PROC_LINE => :NBT_PROC_LINE,
            CHK_ORDER => :CHK_ORDER,
            NBT_CUS_ORD => :NBT_CUS_ORD,
            NBT_ITEM => :NBT_ITEM,
            NBT_ORD_QTY => :NBT_ORD_QTY,
            NBT_IDIA => :NBT_IDIA,
            NBT_ODIA => :NBT_ODIA,
            NBT_LENGTH => :NBT_LENGTH,
            NBT_THICK => :NBT_THICK,
            NBT_GRADE => :NBT_GRADE,
            NBT_MATNR => :NBT_MATNR,
            NBT_PROC_WT => :NBT_PROC_WT,
            NBT_GALV_WT => :NBT_GALV_WT,
            NBT_ROLLCHAIN => :NBT_ROLLCHAIN,
            NBT_MOTHER_BATCH => :NBT_MOTHER_BATCH,
            NBT_CL_WT => :NBT_CL_WT,
            NBT_CL_MATNR => :NBT_CL_MATNR,
            NBT_FG_WT => :NBT_FG_WT,
            P_USER => :P_USER,
            P_SCH_TYPE_FL => :P_SCH_TYPE_FL,
            P_SFG_MATNR => :P_SFG_MATNR,
            P_NOMINATE_BATCH => :P_NOMINATE_BATCH,
            P_NOMINATE_MATNR => :P_NOMINATE_MATNR,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

    const binds = {
      CHK_COIL: "Y",
      PARAM_PLANT_CNT: 1,
      PPH_CD_PROC_PATH: PlanPath,
      NBT_EPL_CD_EPA: Plant,
      NBT_PROC_LINE: Process,
      CHK_ORDER: "Y",
      NBT_CUS_ORD: ORD_ID,
      NBT_ITEM: ORD_ITM,
      NBT_ORD_QTY: ORD_QTY,
      NBT_IDIA: IDIA,
      NBT_ODIA: ODIA,
      NBT_LENGTH: LENGTH,
      NBT_THICK: THICK,
      NBT_GRADE: GRADE,
      NBT_MATNR: MATNR,
      NBT_PROC_WT: PROS_WT,
      NBT_GALV_WT: GALVY_WT,
      NBT_ROLLCHAIN: rollchange,
      NBT_MOTHER_BATCH: MOTHER_BATCH,
      NBT_CL_WT: CL_WT,
      NBT_CL_MATNR: CL_MATNR,
      NBT_FG_WT: FG_WT,
      P_USER: adid,
      P_SCH_TYPE_FL: P_SCH_TYPE_FL,
      P_SFG_MATNR: EOP_SFG_MATNR_BOM,
      P_NOMINATE_BATCH: P_NOMINATE_BATCH,
      P_NOMINATE_MATNR: P_NOMINATE_MATNR,
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

export const getMotherBatch = async (req: any) => {
  try {
    const { Plant, InputCoil, coilLength, adid, P_SCH_TYPE_FL } = req.body;
    const sql = `call TTSB001 (
            P_PLANT => :P_PLANT,
            P_INP_COILS => :P_INP_COILS,
            P_NO_OF_COIL => :P_NO_OF_COIL,
            P_USER => :P_USER,
            P_SCH_TYPE_FL => :P_SCH_TYPE_FL,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      P_PLANT: Plant,
      P_INP_COILS: InputCoil,
      P_NO_OF_COIL: coilLength,
      P_USER: adid,
      P_SCH_TYPE_FL: P_SCH_TYPE_FL,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    //P_PLANT == plnt code
    //P_INP_COILS == cpncatenated coil id of 10 charecter. (LOM_ID_BATCH)
    //P_NO_OF_COIL == total no of coils (Rows Length)

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetOrder = async (req: any) => {
  // get order details table
  const { Plant, Odia, Idia, Order, Item } = req.body;
  try {
    //const sql = `SELECT eop_cd_epa, eop_id_order, eop_no_item, eop_sec1, eop_sec2, eop_length, eop_qty order_qnty, eop_dispatched_qty dispatched, eop_free_fg_stock free_stock, eop_tot_wip tot_wip, eop_bal_to_prod net_balance_to_prod, eop_id, eop_od, eop_fg_matnr, eop_fg_matnr_desc, eop_sfg_matnr_bom, eop_sfg_matnr_desc, eop_rm_matnr_bom, eop_rm_matnr_desc, eop_cust_cd, eop_cust_nm, eop_city, eop_ord_edge, enc_cd_grade FROM v_epa_order_prog a LEFT OUTER JOIN v_end_cust_ord_epa b ON eop_cd_epa = enc_cd_epa AND eop_id_order = enc_id_order AND eop_no_item = enc_no_item WHERE eop_cd_epa = :Plant AND eop_id_order = NVL(:eop_id_order, eop_id_order)  AND eop_no_item  = NVL(:eop_no_item, eop_no_item) AND eop_od = NVL (:eop_od, eop_od) AND eop_id = NVL (:eop_id, eop_id)`;
    let sql = `SELECT ENC_CD_ePA, ENC_id_order, ENC_no_item, ENC_SEC1_MAX, ENC_SEC2_MAX, ENC_length_Max,
        ENC_ORD_QUANTITY order_qnty, 0 dispatched,
        0 free_stock, 0 tot_wip,
        0 net_balance_to_prod, ENC_IDIA, ENC_SEC2_MAX, ENC_NO_MATNR,
        (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=ENC_NO_MATNR AND ROWNUM=1) Matnr_desc
        , '' sfg_matnr_bom, '' sfg_matnr_desc,
        '' rm_matnr_bom, '' rm_matnr_desc, ENC_MARK_CUST mark_cust, ENC_MARK_CUST_NAME mark_cust_nm,
        '' city, ENC_ORDER_EDGE ord_edge, GRADE cd_grade,ITEM_TYPE,MILL,DRAW_TYPE,GEOMETRY,CATEGORY,SPEC,SUR_FINISH,CLASS
        ,END_FINISH,INS_CODE
     FROM v_end_cust_ord_epa a LEFT OUTER JOIN V_YMPCT_TUB_MATL b
        ON ENC_NO_MATNR = MATNR
 WHERE ENC_CD_EPA = :plant
    AND ENC_ID_ORDER = NVL (:enc_id_orde, ENC_ID_ORDER)
    AND ENC_NO_ITEM = NVL (:enc_no_item, ENC_NO_ITEM)
    AND ENC_SEC2_MAX = NVL (:enc_od, ENC_SEC2_MAX)
    AND ENC_IDIA = NVL (:enc_id, ENC_IDIA)`;
    let binds = {
      plant: Plant,
      enc_id_orde: Order,
      enc_no_item: Item,
      enc_od: Odia,
      enc_id: Idia,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const GetAddedColumns = async (id: any) => {
  try {
    const sql = ``;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getWorkCenter = async (Plant: any) => {
  try {
    const sql = `SELECT PLM_WCNT_CODE||' , '||PLM_WCNT_DESC FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA=:0 AND PLM_CD_PROCESS ='M' AND PLM_ACTIVE_STATUS='A'`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getBatchId = async (Plant: any) => {
  try {
    const sql = `select EWI_ID_BATCH
        from v_work_inst
        where ewi_Cd_Epa=:0
        and ewi_cd_status='WC'`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAllOrderList = async (req: any) => {
  try {
    const { Plant } = req.body;
    //const sql = `SELECT DISTINCT eop_id_order ord, eop_no_item item, TO_CHAR (enc_dt_delv, 'DD-MON-YY') enc_dt_delv FROM v_epa_order_prog, v_tube_planning, v_end_cust_ord_epa WHERE eop_cd_epa = werks AND eop_id_order = vbeln AND eop_no_item = TO_NUMBER (posnr) AND mandt = '600' AND eop_cd_epa = enc_cd_epa AND eop_id_order = enc_id_order AND eop_no_item = enc_no_item and EOP_CD_EPA = :Plant AND eop_net_bal_qty > 0 AND raw_qty > 0 AND enc_order_type = 'ZBTI' AND enc_st_order = 'A' ORDER BY enc_dt_delv, eop_id_order, eop_no_item`;
    let sql = `SELECT DISTINCT ENC_ID_ORDER
        FROM V_LDP_PRODN A, V_END_CUST_ORD_EPA B
        WHERE LOM_CD_EPA = ENC_CD_ePA
        and LOM_ID_ORDER_CUS = ENC_ID_ORDER
        and LOM_ID_ORD_ITEM_CUS =  ENC_NO_ITEM
        AND LOM_CD_ePA= :Plant
        AND LOM_CD_status='VM'
        AND ENC_ST_ORDER='A'`;
    let binds = {
      Plant: Plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getAllItemList = async (req: any) => {
  try {
    const { Plant } = req.body;

    let sql = `SELECT DISTINCT ENC_NO_ITEM
        FROM V_LDP_PRODN A, V_END_CUST_ORD_EPA B
        WHERE LOM_CD_EPA = ENC_CD_ePA
        and LOM_ID_ORDER_CUS = ENC_ID_ORDER
        and LOM_ID_ORD_ITEM_CUS =  ENC_NO_ITEM
        AND LOM_CD_ePA=:Plant
        AND LOM_CD_status='VM'
        AND ENC_ST_ORDER='A'
        ORDER BY 1`;
    let binds = {
      Plant: Plant,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const schMatDesc = async (req: any) => {
  try {
    let sql = `SELECT DISTINCT TMM_SFG_MAT SFG_MATL ,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.TMM_SFG_MAT AND ROWNUM=1)SFG_MATL_DESC
        FROM V_TUB_MATL_MAPPING A
        WHERE TMM_CD_EPA =:plant
        AND TMM_FG_MAT =LPAD(:FG_Mat,18,'0')`;

    let binds = {
      plant: req.body.plant,
      FG_Mat: req.body.FG_Mat,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergeBatchDetails = async (req: any) => {
  try {
    let sql = `select erd_cd_epa,ERD_ID_NEW_BATCH MERGE_BATCH,ERD_ID_BATCH COMPONENT_BATCH,ROUND((ERD_BATCH_QTY*1000),1) COMPONENT_BATCH_QTY , ERD_FLG_SEND_SAP SEND_SAP_FLAG
        , ERD_REC_CRT_DT CREATION_DATE,ERD_REC_CRT_UID CREATED_BY
        from v_epa_random_dtls
        where ERD_CD_ePA=:Plant
        AND ERD_ID_NEW_BATCH=:batchId
        AND ERD_MOV_IND='B' AND ERD_REC_STATUS='A'`;

    let binds = {
      Plant: req.body.Plant,
      batchId: req.body.batchId,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const ScheduleDelMerge = async (req: any) => {
  try {
    const sql = `call LDPDBA.C1CEB170_SCHED_DEL_CHILD (
            CHK_INQ => :CHK_INQ,
            P_EWI_CD_STATUS => :P_EWI_CD_STATUS,
            P_EWI_ID_BATCH => :P_EWI_ID_BATCH,
            NBT_EPL_CD_EPA => :NBT_EPL_CD_EPA,
            P_EWI_ID_WRK_INST => :P_EWI_ID_WRK_INST,
            P_EWI_ID_BATCH_CHILD => :P_EWI_ID_BATCH_CHILD,
            P_EWI_QTY_BATCH_CHILD => :P_EWI_QTY_BATCH_CHILD,
            REC_FLAG => : REC_FLAG,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;
    const binds = {
      CHK_INQ: "Y",
      P_EWI_CD_STATUS: req.body.dt.EWI_CD_STATUS ?? "",
      P_EWI_ID_BATCH: req.body.dt.EWI_ID_BATCH ?? "",
      NBT_EPL_CD_EPA: req.body.Plant ?? "",
      P_EWI_ID_WRK_INST: req.body.dt.EWI_ID_WRK_INST ?? "",
      P_EWI_ID_BATCH_CHILD: req.body.dt2.COMPONENT_BATCH, // ---CHILD BATCH FROM 2ND WINDOW
      P_EWI_QTY_BATCH_CHILD: req.body.dt2.COMPONENT_BATCH_QTY, //CHILD BATCH QTY FROM 2ND WINDOW
      REC_FLAG: "P", //CODE FOR PARTIAL DELETION
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
