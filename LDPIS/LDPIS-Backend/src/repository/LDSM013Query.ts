import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const GetProcDesc = async (Plant: any) => {
  try {
    const sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS <>'V' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDefectData = async (
  plant: any,
  process: any,
  batch_id: any,
  mBatch: any,
  frmDt: any,
  toDt: any
) => {
  try {
    //     var sql = `SELECT
    //     NVL(TBD_CD_EPA , ' ')            PLANT,
    //     NVL(TBD_CD_PROC , ' ')           PROCESS,
    //     NVL(TBD_ID_BATCH , ' ')          BATCHID,
    //     NVL(TBD_RSN_CD , 0)            DEFECT_CODE,
    //     NVL(ESR_RSN_DESC , ' ')          DEFECT_NM,
    //     NVL(TBD_CRT_BY , ' ')            DEFECT_BOOKED_BY,
    //     NVL(TO_CHAR(TBD_CRT_ON, 'DD-MON-YYYY HH24:MI:SS') , ' ') DEFECT_BOOKING_DT,
    //     NVL(LOM_ID_PAR_COIL_NO , ' ')    PARENT_BATCHID,
    //     NVL(LOM_ID_FIRST_PAR , ' ')      MOTHER_BATCHID,
    //     NVL(LOM_MERGE_BATCH , ' ')       MERGE_BATCH_ID,
    //     NVL(LOM_MS_GROSS_CAL , 0)      BATCH_WT,
    //     NVL(LOM_UOM , ' ')               WT_UOM,
    //     NVL(LOM_CD_QLTY_ACTL , ' ')      BATCH_QLTYCD,
    //     NVL(LOM_CD_STATUS , ' ')         BATCH_STATUS,
    //     NVL(LOM_SEC1 , 0)              THICKNESS,
    //     NVL(LOM_SEC2 , 0)              ODIA,
    //     NVL(LOM_TDC_ACTL , ' ')          GRADE,
    //     NVL(LOM_ID_ORDER_CUS , ' ')      ORDERNO,
    //     NVL(LOM_ID_ORD_ITEM_CUS , 0)   ORDERITEM,
    //     NVL(LOM_NO_PIECES , 0)         PRIME_TUBE_NOS,
    //     NVL(LOM_IDIA , 0)              IDIA,
    //     NVL(EPR_REC_CRT_BY , ' ')        BATCH_RECORDED_BY,
    //     NVL(TO_CHAR(EPR_TS_REC_CREATE, 'DD-MON-YYYY HH24:MI:SS') , ' ')     BATCH_RECORDED_ON
    // FROM
    //     V_BATCH_DEFECT,
    //     V_LDP_PRODN,
    //     V_SCRP_SEC_RSN,
    //     V_EPA_LINE_PRODN
    // WHERE  TBD_CD_EPA = LOM_CD_EPA
    //     AND TBD_ID_BATCH = LOM_ID_BATCH
    //     AND TBD_CD_EPA = ESR_CD_EPA
    // AND TBD_RSN_CD = ESR_RSN_CD
    //     AND LOM_CD_EPA = ESR_CD_EPA
    //     AND LOM_CD_EPA = EPR_CD_EPA
    //     AND LOM_ID_BATCH = EPR_ID_BATCH
    //     AND TBD_CD_EPA = EPR_CD_EPA
    //     AND TBD_ID_BATCH = EPR_ID_BATCH
    //     AND TBD_CD_PROC = EPR_CD_PROCESS
    //     AND ESR_CD_EPA = EPR_CD_EPA
    //     AND TBD_CD_EPA = :plant
    //     `;
    var sql = `SELECT  DISTINCT TBD_CD_EPA Plant,LOM_CD_CURR_PROC Process,tbd_id_batch Batch_Id,LOM_MS_GROSS_CAL Batch_Wt,LOM_UOM Batch_UOM
    ,MAX(TBD_CRT_BY) "Defect Booking By",MAX(to_char(TBD_CRT_ON)) "Defect Booked on",LOM_no_cast Cast_no
    ,LOM_ID_PAR_COIL_NO Parent_Batch,LOM_ID_FIRST_PAR Mother_Batch,LOM_NO_MATNR Material_No, (SELECT MAKTX FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=LOM_NO_MATNR AND ROWNUM = 1) RM_MATNR_DESC,LOM_SEC2 Odia,LOM_SEC1 Thickness,LOM_LENGTH Length
    ,LOM_NO_PIECES No_Of_Prime_tube
    ,LOM_CD_QLTY_ACTL Qlty_Cd,LOM_CD_STATUS Status,LOM_TDC_ACTL Grade,LOM_ID_ORDER_CUS Ord,LOM_ID_ORD_ITEM_CUS Ord_Item
    ,LOM_IDIA Idia
    ,WorkCenter
    , SUM("OPEN") "OPEN"    
    , SUM("OPEN_WT") "OPEN_WT"
    , SUM("JOINT") "JOINT"
    , SUM("JOINT_WT") "JOINT_WT"
    , SUM("NEARJOIN") "NEARJOIN"
    , SUM("NEARJOIN_WT") "NEARJOIN_WT"
    , SUM("SETUP") "SETUP"
    , SUM("SETUP_WT") "SETUP_WT"
    , SUM("TOOLMARK") "TOOLMARK"
    , SUM("TOOLMARK_WT") "TOOLMARK_WT"
    , SUM("SCRATCH") "SCRATCH"
    , SUM("SCRATCH_WT") "SCRATCH_WT"
    , SUM("PICKUP") "PICKUP"
    , SUM("PICKUP_WT") "PICKUP_WT"
    , SUM("OVERLAP") "OVERLAP"
    , SUM("OVERLAP_WT") "OVERLAP_WT"
    , SUM("WEAKWELD") "WEAKWELD"
    , SUM("WEAKWELD_WT") "WEAKWELD_WT"
    , SUM("ROLLMARK") "ROLLMARK"
    , SUM("ROLLMARK_WT") "ROLLMARK_WT"
    , SUM("NFC") "NFC"
    , SUM("NFC") "NFC_WT"
    , SUM("RUST") "RUST"
    , SUM("RUST") "RUST_WT"
    , SUM("RAWMATERIALDEFECT") "RAWMATERIALDEFECT"
    , SUM("RAWMATERIALDEFECT_WT") "RAWMATERIALDEFECT_WT"
    , SUM("BEND") "BEND"
    , SUM("BEND") "BEND_WT"
    , SUM("OTHERS") "OTHERS"
    , SUM("OTHERS_WT") "OTHERS_WT"
    , SUM("PITTING_MARK") "PITTING_MARK"
    , SUM("PITTING_MARK_WT") "PITTING_MARK_WT"
    , SUM("ID_LINE_MARK") "ID_LINE_MARK"
    , SUM("ID_LINE_MARK_WT") "ID_LINE_MARK_WT"
    , SUM("ID_BEAD_LINE") "ID_BEAD_LINE"
    , SUM("ID_BEAD_LINE_WT") "ID_BEAD_LINE_WT"
    , SUM("OD_LINE") "OD_LINE"
    , SUM("OD_LINE_WT") "OD_LINE_WT"
    , SUM("SINK_TUBE") "SINK_TUBE"
    , SUM("SINK_TUBE_WT") "SINK_TUBE_WT"
    , SUM("VIBRATION") "VIBRATION"
    , SUM("VIBRATION_WT") "VIBRATION_WT"
    FROM(
    select  TBD_CD_EPA ,LOM_CD_CURR_PROC ,tbd_id_batch
    ,TBD_CRT_BY ,TBD_CRT_ON ,LOM_no_cast ,TBD_RSN_CD ,ESR_RSN_DESC
    ,LOM_ID_PAR_COIL_NO,LOM_ID_FIRST_PAR,LOM_NO_MATNR,LOM_SEC2,LOM_SEC1,LOM_LENGTH,LOM_MS_GROSS_CAL,LOM_UOM,LOM_NO_PIECES
    ,LOM_CD_QLTY_ACTL,LOM_CD_STATUS,LOM_TDC_ACTL,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS
    ,LOM_ODIA,LOM_IDIA
    ,(select EPR_WORK_CENT from v_epa_line_prodn
      where epr_cd_epa = tbd_cd_epa and epr_id_batch = TBD_ID_BATCH and EPR_CD_PROCESS='M' and ROWNUM = 1) WorkCenter
    ,SUM(decode(TBD_RSN_CD,1,TBD_DEFECT_NO_PCS,0)) "OPEN"
    ,SUM(decode(TBD_RSN_CD,2,TBD_DEFECT_NO_PCS,0)) "JOINT"
    ,SUM(decode(TBD_RSN_CD,3,TBD_DEFECT_NO_PCS,0)) "NEARJOIN"
    ,SUM(decode(TBD_RSN_CD,4,TBD_DEFECT_NO_PCS,0)) "SETUP"
    ,SUM(decode(TBD_RSN_CD,5,TBD_DEFECT_NO_PCS,0)) "TOOLMARK"
    ,SUM(decode(TBD_RSN_CD,6,TBD_DEFECT_NO_PCS,0)) "SCRATCH"
    ,SUM(decode(TBD_RSN_CD,7,TBD_DEFECT_NO_PCS,0)) "PICKUP"
    ,SUM(decode(TBD_RSN_CD,8,TBD_DEFECT_NO_PCS,0)) "OVERLAP"
    ,SUM(decode(TBD_RSN_CD,9,TBD_DEFECT_NO_PCS,0)) "WEAKWELD"
    ,SUM(decode(TBD_RSN_CD,10,TBD_DEFECT_NO_PCS,0)) "ROLLMARK"
    ,SUM(decode(TBD_RSN_CD,11,TBD_DEFECT_NO_PCS,0)) "NFC"
    ,SUM(decode(TBD_RSN_CD,12,TBD_DEFECT_NO_PCS,0)) "RUST"
    ,SUM(decode(TBD_RSN_CD,13,TBD_DEFECT_NO_PCS,0)) "RAWMATERIALDEFECT"
    ,SUM(decode(TBD_RSN_CD,14,TBD_DEFECT_NO_PCS,0)) "BEND"
    ,SUM(decode(TBD_RSN_CD,15,TBD_DEFECT_NO_PCS,0)) "OTHERS"
    ,SUM(decode(TBD_RSN_CD,16,TBD_DEFECT_NO_PCS,0)) "PITTING_MARK"
    ,SUM(decode(TBD_RSN_CD,17,TBD_DEFECT_NO_PCS,0)) "ID_LINE_MARK"
    ,SUM(decode(TBD_RSN_CD,18,TBD_DEFECT_NO_PCS,0)) "ID_BEAD_LINE"
    ,SUM(decode(TBD_RSN_CD,19,TBD_DEFECT_NO_PCS,0)) "OD_LINE"
    ,SUM(decode(TBD_RSN_CD,20,TBD_DEFECT_NO_PCS,0)) "SINK_TUBE"
    ,SUM(decode(TBD_RSN_CD,21,TBD_DEFECT_NO_PCS,0)) "VIBRATION"
    ,SUM(decode(TBD_RSN_CD,1,TBD_DEFECT_WT,0)) "OPEN_WT" 
    ,SUM(decode(TBD_RSN_CD,2,TBD_DEFECT_WT,0)) "JOINT_WT"
    ,SUM(decode(TBD_RSN_CD,3,TBD_DEFECT_WT,0)) "NEARJOIN_WT"
    ,SUM(decode(TBD_RSN_CD,4,TBD_DEFECT_WT,0)) "SETUP_WT"
    ,SUM(decode(TBD_RSN_CD,5,TBD_DEFECT_WT,0)) "TOOLMARK_WT"
    ,SUM(decode(TBD_RSN_CD,6,TBD_DEFECT_WT,0)) "SCRATCH_WT"
    ,SUM(decode(TBD_RSN_CD,7,TBD_DEFECT_WT,0)) "PICKUP_WT"
    ,SUM(decode(TBD_RSN_CD,8,TBD_DEFECT_WT,0)) "OVERLAP_WT"
    ,SUM(decode(TBD_RSN_CD,9,TBD_DEFECT_WT,0)) "WEAKWELD_WT"
    ,SUM(decode(TBD_RSN_CD,10,TBD_DEFECT_WT,0)) "ROLLMARK_WT"
    ,SUM(decode(TBD_RSN_CD,11,TBD_DEFECT_WT,0)) "NFC_WT"
    ,SUM(decode(TBD_RSN_CD,12,TBD_DEFECT_WT,0)) "RUST_WT"
    ,SUM(decode(TBD_RSN_CD,13,TBD_DEFECT_WT,0)) "RAWMATERIALDEFECT_WT"
    ,SUM(decode(TBD_RSN_CD,14,TBD_DEFECT_WT,0)) "BEND_WT"
    ,SUM(decode(TBD_RSN_CD,15,TBD_DEFECT_WT,0)) "OTHERS_WT"
    ,SUM(decode(TBD_RSN_CD,16,TBD_DEFECT_WT,0)) "PITTING_MARK_WT"
    ,SUM(decode(TBD_RSN_CD,17,TBD_DEFECT_WT,0)) "ID_LINE_MARK_WT"
    ,SUM(decode(TBD_RSN_CD,18,TBD_DEFECT_WT,0)) "ID_BEAD_LINE_WT"
    ,SUM(decode(TBD_RSN_CD,19,TBD_DEFECT_WT,0)) "OD_LINE_WT"
    ,SUM(decode(TBD_RSN_CD,20,TBD_DEFECT_WT,0)) "SINK_TUBE_WT"
    ,SUM(decode(TBD_RSN_CD,21,TBD_DEFECT_WT,0)) "VIBRATION_WT"
    from v_batch_defect , v_scrp_sec_rsn , v_LDP_PRODN
    where tbd_cd_epa= esr_Cd_Epa
    and TBD_RSN_CD = esr_rsn_cd
    and tbd_cd_epa = LOM_cd_epa
    and TBD_ID_BATCH = LOM_id_batch
    and esr_Cd_Epa = LOM_cd_epa
    and TBD_CD_EPA=:plant `;
    let binds = {
      plant: plant,
    };
    if (process && process != "") {
      sql += ` AND LOM_CD_CURR_PROC = NVL(:process, LOM_CD_CURR_PROC) `;
      binds["process"] = process;
    }
    if (batch_id && batch_id != "") {
      sql += ` AND TBD_ID_BATCH = NVL(:batch_id, TBD_ID_BATCH) `;
      binds["batch_id"] = batch_id;
    }
    if (mBatch && mBatch != "") {
      sql += ` AND LOM_ID_FIRST_PAR = NVL(:mBatch , LOM_ID_FIRST_PAR) `;
      binds["mBatch"] = mBatch;
    }
    // if(frmDt && toDt && frmDt != "" && toDt != ""){
    //     sql += ` AND to_char(TBD_CRT_ON,'dd-Mon-yyyy') >= NVL(:frmDt,to_char(TBD_CRT_ON,'dd-Mon-yyyy'))
    //     AND to_char(TBD_CRT_ON,'dd-Mon-yyyy') <= NVL(:toDt,to_char(TBD_CRT_ON,'dd-Mon-yyyy'))`;
    //     binds["frmDt"] = frmDt;
    //     binds["toDt"] = toDt;
    // }
    if (frmDt && toDt && frmDt != "" && toDt != "") {
      sql += ` AND to_date(to_char(TBD_CRT_ON,'dd-Mon-yyyy'),'dd-Mon-yyyy') >= TO_DATE(NVL(:frmDt,to_char(TBD_CRT_ON,'dd-Mon-yyyy')),'dd-Mon-yyyy')
          AND to_date(to_char(TBD_CRT_ON,'dd-Mon-yyyy'),'dd-Mon-yyyy') <= TO_DATE(NVL(:toDt,to_char(TBD_CRT_ON,'dd-Mon-yyyy')),'dd-Mon-yyyy')`;
      binds["frmDt"] = frmDt;
      binds["toDt"] = toDt;
    }
    // sql += ` ORDER BY TBD_CD_EPA,TBD_CD_PROC , TBD_ID_BATCH,TBD_RSN_CD `;
    sql += `  GROUP BY TBD_CD_EPA,tbd_id_batch,LOM_CD_CURR_PROC,TBD_RSN_CD,ESR_RSN_DESC,TBD_CRT_BY,TBD_CRT_ON,LOM_no_cast,
        LOM_ID_PAR_COIL_NO,LOM_ID_FIRST_PAR,LOM_NO_MATNR,LOM_SEC2,LOM_SEC1,LOM_LENGTH,LOM_MS_GROSS_CAL,LOM_NO_PIECES,
        LOM_UOM,LOM_CD_QLTY_ACTL,LOM_CD_STATUS,LOM_TDC_ACTL,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_ODIA,LOM_IDIA
          )
          GROUP BY TBD_CD_EPA,tbd_id_batch,LOM_CD_CURR_PROC,LOM_no_cast,LOM_ID_PAR_COIL_NO,LOM_ID_FIRST_PAR
        ,LOM_NO_MATNR,LOM_SEC2,LOM_SEC1,LOM_LENGTH,LOM_MS_GROSS_CAL,LOM_NO_PIECES,LOM_UOM,LOM_CD_QLTY_ACTL,
        LOM_CD_STATUS,LOM_TDC_ACTL,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,LOM_ODIA,LOM_IDIA,WorkCenter
        ORDER BY TBD_CD_EPA,tbd_id_batch
        `;
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
