import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};


export const GetBatchId = async (plant: any, status: any) => {
  try {
    let sql = `SELECT DISTINCT EOM_ID_BATCH
    FROM V_EPA_PRODN
    WHERE EOM_CD_EPA=:Plant
    AND EOM_CD_QLTY_ACTL<>'SCRP'
  `;
    if (status === 'HOLD') {
      sql += ` AND (EOM_CD_STATUS LIKE '%B' OR EOM_CD_STATUS LIKE '%F')`
    }
    if (status === 'UPDATE REMARKS') {
      sql += ` AND (EOM_CD_STATUS LIKE '%D' OR EOM_CD_STATUS LIKE '%Q')`
    }
    sql += ` ORDER BY 1`
    let binds = { plant };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const GetSubDetails = async (BatchId: any, plant: any, status: any) => {
    try {
    this
    let sql = ``
    // this quary is for to display hold batch
    if (status === 'UPDATE REMARKS') {
      sql = `
      SELECT DISTINCT EHR_TS_HOLD HOLD_DT,EOM_UOM,EHR_CD_RSN_HOLD Hold_Rsn,(SELECT CD_DESC FROM V_EPA_HOLD_RSN WHERE CD_HOLD =EHR_CD_RSN_HOLD AND CD_COMP='1000' AND ROWNUM=1)HOLD_DESC, EHR_ID_OP_HOLD Hold_By
      ,eom_cd_prod,eom_cd_qlty_actl,eom_sec1,eom_sec2,eom_length,eom_tdc_actl,eom_ms_piece_actl,eom_ms_gross_cal,nvl(eom_ms_scrap/1000,0) EOM_MS_SCRAP,eom_cd_status,  eom_cd_curr_proc,eom_cd_next_proc,eom_id_order_cus,eom_id_ord_item_cus,enc_cust_name,
      (select cd_desc from v_codes where eom_cd_status=cd_value and cd_type='E0001') cd_desc 
      ,NVL(EOM_NO_MATNR,ENC_NO_MATNR) MATERIAL_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=NVL(EOM_NO_MATNR,ENC_NO_MATNR) AND ROWNUM=1)MATERIAL_DESC
      ,EHR_ID_BATCH BATCHID,EHR_CD_RSN_HOLD Holdrsn,EHR_OP_REMARKS OP_REMARKS,EHR_UPDATED_BY USERID,EHR_UPDATED_ON HOLDDATETIME,
      (select  p.eom_tdc_actl from v_epa_prodn p where p.eom_id_batch=x.EOM_ID_FIRST_PAR  and p.eom_cd_epa=x.eom_cd_epa and rownum=1) eom_tdc_actl_rm
      FROM v_epa_prodn x, v_end_cust_ord_epa,v_epa_matl_hold_rls
      WHERE eom_id_order_cus = enc_id_order(+) 
      and eom_id_ord_item_cus=enc_no_item(+) 
      and eom_id_batch = ehr_id_batch(+) 
      and eom_cd_epa=ehr_cd_epa(+)      
      and eom_id_batch= :BatchId
      and eom_cd_epa= :plant
      order by EHR_TS_HOLD desc
    `;
    }
    // this quary is for to display the unhold batch
    if (status === 'HOLD') {
      sql = `
      SELECT eom_id_batch BATCHID,EOM_UOM,eom_cd_prod,eom_cd_qlty_actl,eom_sec1,eom_sec2,eom_length,eom_tdc_actl,eom_ms_piece_actl,eom_ms_gross_cal,nvl(eom_ms_scrap/1000,0) EOM_MS_SCRAP,eom_cd_status,  eom_cd_curr_proc,eom_cd_next_proc,eom_id_order_cus,eom_id_ord_item_cus,enc_cust_name,
      (select cd_desc from v_codes where eom_cd_status=cd_value and cd_type='E0001') cd_desc 
      ,NVL(EOM_NO_MATNR,ENC_NO_MATNR) MATERIAL_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=NVL(EOM_NO_MATNR,ENC_NO_MATNR) AND ROWNUM=1)MATERIAL_DESC,
      (select  p.eom_tdc_actl from v_epa_prodn p where p.eom_id_batch=x.EOM_ID_FIRST_PAR  and p.eom_cd_epa=x.eom_cd_epa and rownum=1) eom_tdc_actl_rm
      FROM v_epa_prodn x, v_end_cust_ord_epa
      WHERE eom_id_order_cus = enc_id_order(+) 
      and eom_id_ord_item_cus=enc_no_item(+)  
      and eom_id_batch= :BatchId
      and eom_cd_epa= :plant
      AND (EOM_CD_STATUS LIKE '%B' OR EOM_CD_STATUS LIKE '%F')
      AND EOM_CD_QLTY_ACTL<>'SCRP'
      ORDER BY EOM_TS_CREATION
    `
    }

    // `Select eom_cd_prod,eom_cd_qlty_actl,eom_sec1,eom_sec2,eom_length,eom_tdc_actl,eom_ms_piece_actl,eom_ms_gross_cal,nvl(eom_ms_scrap/1000,0) EOM_MS_SCRAP,eom_cd_status,  eom_cd_curr_proc,eom_cd_next_proc,eom_id_order_cus,eom_id_ord_item_cus,enc_cust_name,cd_desc 
    // ,NVL(EOM_NO_MATNR,ENC_NO_MATNR) MATERIAL_NO,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=NVL(EOM_NO_MATNR,ENC_NO_MATNR) AND ROWNUM=1)MATERIAL_DESC
    // FROM v_epa_prodn, v_end_cust_ord_epa,v_codes 
    // WHERE eom_id_order_cus = enc_id_order(+) and eom_id_ord_item_cus=enc_no_item(+) and eom_cd_status=cd_value and cd_type='E0001' and eom_id_batch= :0 and eom_cd_epa= :1`;

    let binds = [`${BatchId}`, `${plant}`];

    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const GetSecRsnQuery = async () => {
  try {
    const sql = `SELECT distinct CD_DESC,CD_HOLD FROM  V_EPA_HOLD_RSN order by   CD_HOLD`;
    // let binds = [`${plant}`];
    return await query.executeQuery(sql);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};

export const getBtnHold = async (
  plant: any,
  batch: any,
  holdRsn: any,
  remarks: any,
  currProc: any,
  nextProc: any,
  netWt: any,
  status: any,
  pUser: any,
  flag: any
) => {
  try {

    const sql = `
    call spcb041 (
      p_plant => :PLANT,
      p_batch => :BATCH,
      p_rsn_hold_cd => :HOLD_RSN,  
      p_op_remarks =>  :REMARKS,  
      p_status  => :STATUS,
      p_curr_proc => :C_PROC,
      p_next_proc => :N_PROC,
      p_net_wt  => :NET_WT,  
      p_flag => :FLAG, 
      p_user => :P_USER,    
      LS_OUT_FLAG => :LS_OUT_FLAG         
      )
    `;
    let binds = {
      PLANT: plant ? plant : null,
      BATCH: batch ? batch : null,
      HOLD_RSN: holdRsn ? holdRsn : null,
      REMARKS: remarks ? remarks : ' ',
      STATUS: status ? status : null,
      C_PROC: currProc ? currProc : null,
      N_PROC: nextProc ? nextProc : null,
      NET_WT: netWt ?? netWt,
      FLAG: flag ? flag : null,
      P_USER: pUser ? pUser : null,
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


export const updateOprRemark = async (req: any) => {
  try {
    let ehrOpRemarks = "";
    let opRemarks = `SELECT EHR_PREV_OP_REMARKS, EHR_OP_REMARKS FROM V_EPA_MATL_HOLD_RLS,V_CODES WHERE CD_TYPE = 'EPA459' AND EHR_CD_EPA = CD_VALUE AND EHR_CD_EPA =:PLANT AND EHR_ID_BATCH =:BATCH_ID`;
    let remBinds = {
      PLANT: req.body.Plant,
      BATCH_ID: req.body.Batch_id
    };

    let resOrmx = await query.executeQuery(opRemarks, remBinds);
    if (resOrmx.rows.length > 0) {

      ehrOpRemarks = resOrmx.rows[0][1];
    }

    const sql = `UPDATE v_epa_matl_hold_rls SET ehr_op_remarks =:opr_remarks, ehr_prev_op_remarks =:prev_opr_remarks, ehr_updated_by =:userid,ehr_updated_on =sysdate WHERE ehr_cd_epa =:plant AND ehr_id_batch =:batch_id`;
    let binds = {
      Plant: req.body.Plant,
      Batch_id: req.body.Batch_id,
      opr_remarks: req.body.OprRemaks ?? '',
      prev_opr_remarks: ehrOpRemarks,
      userid: req.body.userid
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {

    throw new Error.InternalServerError("Error!");
  }
};