import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getGroupPlant = async (id: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP 
    FROM V_EPA_GROUP_PLANT , v_epa_proc_line 
    WHERE EGP_CD_EPA = EPL_CD_EPA 
    AND UPPER(EGP_GRP_USER)= :0 
    AND EPL_ACTIVITY_NM = 'SLT'
    AND  EPL_ACTIVE_PLANT_FL='A'  ORDER BY 1`;
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getSchedules = async (status: any) => {
  try {
    let sql = `select SCH_ID_SCHEDULE ,TO_CHAR(SCH_TS_SCHD_CRT,'YYYY-MM-DD HH24:MI:SS') ,TO_CHAR(SCH_NO_OF_COIL),SCH_MILL_NO,SCH_CD_STATUS
    from v_schedule`;

    if (status === "AC") {
      sql += ` WHERE SCH_CD_STATUS in ('C','A')
      ORDER BY SCH_TS_SCHD_CRT DESC`;
      console.log(sql);
      return await query.executeQuery(sql);
    } else {
      sql += ` WHERE SCH_CD_STATUS=:0
    ORDER BY SCH_TS_SCHD_CRT DESC`;
      let binds = [`${status}`];
      console.log(binds, sql);
      return await query.executeQuery(sql, binds);
    }
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const generateScheduleId = async (req: any) => {
  try {
    console.log("inside pipeid");
    // console.log(req);
    let schd_id;
    // let bindsMill = {
    //   mBatch: req.RM_BATCH,
    // };
    //console.log("bindsmill", bindsMill);
    let qryMillCode = `SELECT SCH_SEQ.NEXTVAL AS SCHD_ID FROM DUAL`;

    let getMillCode = await query.executeQuery(qryMillCode);

    schd_id = getMillCode.rows.length != 0 ? getMillCode.rows[0][0] : "1";
    console.log("schd_id", schd_id);
    const sql = `INSERT INTO ldpdba.t_schedule
    (sch_cd_epa, sch_cd_process, sch_id_schedule, sch_schd_close,
     sch_ms_tot_coil, sch_no_of_coil, sch_ts_schd_conf,
     sch_ts_schd_crt, sch_ts_schd_end, sch_ts_schd_strt,
     sch_cd_status, sch_schd_type
    )
    VALUES (:plant, '1', :schd_id, 'N',
        10, 0, NULL,
        SYSDATE, NULL, SYSDATE,
        'A', 'PIPE'
        )`;

    let binds = {
      plant: "0780",
      schd_id: schd_id,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCoils = async (req: any) => {
  try {
    let binds = {
      Plant: req.body.Plant,
      scheduleID: req.body.scheduleID,
      // The status itself is used in the conditional logic, not directly as a bind variable in this case
      // status: req.body.status,
    };

    let QrygetCoils = `select EWI_ID_BATCH AS EWI_ID_BATCH,LOM_ID_FIRST_PAR LOM_ID_FIRST_PAR,EWI_PRIORITY PRIORITY,EWI_PRIORITY NEWPRIORITY,EWI_CD_STATUS EWI_CD_STATUS,
EWI_ID_SCHEDULE SCHEDULE_ID,EWI_SEC1 SEC1,ENC_SEC1_MAX FG_THICKNESS,EWI_SEC2 SEC2,EWI_LENGTH LEN,EWI_MS_PIECE_ACTL MASS,EWI_COMBINATION,
    EWI_ID_ORDER_CUS ORDER_ID ,EWI_ID_ORD_ITEM_CUS ORDER_ITEM,
    TO_CHAR(EWI_TS_CREATION, 'DD.MM.YYYY') AS SC_CR_DT,
    EWI_WRK_CENTER_NO MILL
    from V_WORK_INST,V_LDP_PRODN,V_END_CUST_ORD_EPA
        WHERE EWI_ID_SCHEDULE=:scheduleID
        AND EWI_ID_BATCH = LOM_ID_BATCH
        AND EWI_ID_ORDER_CUS = ENC_ID_ORDER
        and EWI_ID_ORD_ITEM_CUS = enc_no_item
        and ewi_cd_Epa = enc_cd_epa
        and ewi_cd_Epa = lom_cd_Epa
    AND EWI_CD_EPA=:Plant`; // Removed initial status condition from here

    // Add conditional status filters
    if (req.body.status === "WC") {
      QrygetCoils += " AND EWI_CD_STATUS='WC'";
    } else if (req.body.status === "CN") {
      QrygetCoils += " AND EWI_CD_STATUS in ('CN','PR')";
    }

    QrygetCoils += `
    ORDER BY PRIORITY`;
    return await query.executeQuery(QrygetCoils, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const confirm = async (req: any) => {
  try {
    console.log(req);
    const sql = `UPDATE V_WORK_INST
    SET EWI_PRIORITY=:priority
    WHERE EWI_ID_BATCH=:BATCH
    AND EWI_CD_STATUS in ('WC','CN')`;
    const binds = {
      priority: req?.PRIORITY,
      BATCH: req?.BATCH,
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updateSchedule = async (req: any) => {
  try {
    console.log(req);
    const sql = `call LDPDBA.LD01B004(
            P_PLANT => :plant,
            P_SCHEDULE_ID => :schdid,
            LS_OUT_FLAG => :LS_OUT_FLAG
        )`;
    const binds = {
      plant: "0780",
      schdid: req,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteCoil = async (req: any) => {
  try {
    console.log(req);
    const sql = `call LDPDBA.LD01B005(
            P_PLANT => :plant,
            P_BATCH_ID => :P_BATCH_ID,
            P_SCHEDULE_ID => :P_SCHEDULE_ID,
            P_BATCH_COUNT => :P_BATCH_COUNT,
            LS_OUT_FLAG => :LS_OUT_FLAG
        )`;
    const binds = {
      plant: "0780",
      P_BATCH_ID: req?.BATCH_ID,
      P_SCHEDULE_ID: req?.EWI_ID_SCHEDULE,
      P_BATCH_COUNT: req?.COIL_COUNT,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const transferSchedule = async (req: any) => {
  try {
    console.log(req);
    const sql = `call LDPDBA.LD01B008(
            P_PLANT => :plant,
            P_BATCH_ID => :P_BATCH_ID,
            P_SCHEDULE_ID => :P_SCHEDULE_ID,
            LS_OUT_FLAG => :LS_OUT_FLAG
        )`;
    const binds = {
      plant: "0780",
      P_BATCH_ID: req?.BATCH,
      P_SCHEDULE_ID: req?.EWI_ID_SCHEDULE,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
