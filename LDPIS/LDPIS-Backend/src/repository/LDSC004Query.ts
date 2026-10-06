import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getExceptionReport = async (fromdt: any, todt: any) => {
  try {
    var sql = `SELECT erl_ts_create    error_date, erl_cd_error     error1, erl_error_data   error2, erl_remarks      error3 FROM v_err_log WHERE trunc(erl_ts_create) >= :fromdt AND trunc(erl_ts_create) <= :todt AND erl_id_pgm = 'INSERT_COIL' ORDER BY 1`;
    let binds = {
      fromdt: fromdt,
      todt: todt,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getRoundOdMaster = async (plant: any) => {
  try {
    var sql = `SELECT *
        FROM
            v_roundod_hosur
        WHERE
            TRH_CD_EPA = :plant
        ORDER BY
            1`;

    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateCoilReceiving = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY),COUNT(1)
        FROM V_YEPA_COIL_RECV
        WHERE SUBSTR(TIMESTAMP,1,10) = TO_CHAR(TO_DATE(:firstDt,'DD-MON-YYYY'),'YYYY-MM-DD') AND WERKS = :plant`;

    let binds = {
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateWiderProduction = async (req: any) => {
  try {
    var sql = `SELECT SUM(EPR_MS_GROSS_ACTL) wider_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='F'
              AND TRUNC(EPR_DT_PRODN_TATA) = :firstDt 
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateNarrowProduction = async (req: any) => {
  try {
    var sql = `SELECT SUM(EPR_MS_GROSS_ACTL) wider_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='B'
              AND TRUNC(EPR_DT_PRODN_TATA) = :firstDt 
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateTubeSchedule = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(EWI_MS_PIECE_ACTL),0)/1000 SCHD_ton, COUNT(DISTINCT EWI_ID_PARENT_BATCH) SCHD_CNT  
        FROM V_WORK_INST
        WHERE EWI_CD_ePA=:plant
        AND EWI_CD_PROCESS='M'
        AND EWI_CD_STATUS <>'RJ'
        AND EWI_ID_BATCH NOT LIKE 'MR%'
        AND TRUNC(EWI_TS_CREATION) = :firstDt`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateTubeProduction = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='M'
              AND TRUNC(EPR_DT_PRODN_TATA) = :firstDt 
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateCtlProduction = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='C'
              AND TRUNC(EPR_DT_PRODN_TATA) = :firstDt 
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDatePacking = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='W'
              AND TRUNC(EPR_DT_PRODN_TATA) = :firstDt 
              AND LOM_CD_QLTY_ACTL <>'SCRP'
              AND LOM_WORK_CENTER  IN (select  PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA =:plant AND EPL_ACTIVITY_NM IN ('TUBE','ERW','CTL')))`;

    let binds = {
      plant: req.body.plant,
      firstDt:
        req.body.chechCurMonth == true ? req.body.prevDate : req.body.firstDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOnDateDispatch = async (req: any) => {
  try {
    var sql = `SELECT ROUND((SUM(EPR_MS_GROSS_ACTL)/1000),3) tb_prd_ton,COUNT(1) FROM V_EPA_LINE_PRODN , V_LDP_PRODN
        WHERE LOM_CD_EPA = EPR_CD_ePA
        AND  LOM_ID_BATCH  = EPR_ID_BATCH
        AND LOM_CD_STATUS='WL'
        AND EPR_CD_EPA= :plant
        AND EPR_CD_PROCESS='W'
        AND TRUNC(EPR_TS_REC_CREATE) = TRUNC(SYSDATE)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateCoilReceiving = async (req: any) => {
  try {
    var sql = `SELECT SUM(RCPT_QTY),COUNT(1)
        FROM V_YEPA_COIL_RECV
        WHERE SUBSTR(TIMESTAMP,1,10) BETWEEN  TO_CHAR(TO_DATE(:firstDt,'DD-MON-YYYY'),'YYYY-MM-DD')
        AND  TO_CHAR(TO_DATE(:lastDt,'DD-MON-YYYY'),'YYYY-MM-DD') AND WERKS= :plant`;

    let binds = {
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateWiderProduction = async (req: any) => {
  try {
    var sql = `SELECT SUM(EPR_MS_GROSS_ACTL) wider_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='F'
              AND TRUNC(EPR_DT_PRODN_TATA) >= :firstDt and TRUNC(EPR_DT_PRODN_TATA) <= :lastDt
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateNarrowProduction = async (req: any) => {
  try {
    var sql = `SELECT SUM(EPR_MS_GROSS_ACTL) wider_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='B'
              AND TRUNC(EPR_DT_PRODN_TATA) >= :firstDt and TRUNC(EPR_DT_PRODN_TATA) <= :lastDt
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateTubeSchedule = async (req: any) => {
  try {
    var sql = `SELECT NVL(SUM(EWI_MS_PIECE_ACTL),0)/1000 SCHD_ton, COUNT(DISTINCT EWI_ID_PARENT_BATCH) SCHD_CNT  
        FROM V_WORK_INST
        WHERE EWI_CD_ePA=:plant
        AND EWI_CD_PROCESS='M'
        AND EWI_CD_STATUS <>'RJ'
        AND EWI_ID_BATCH NOT LIKE 'MR%'
        AND TRUNC(EWI_TS_CREATION) >= :firstDt and TRUNC(EWI_TS_CREATION) <= :lastDt`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateTubeProduction = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='M'
              AND TRUNC(EPR_DT_PRODN_TATA) >= :firstDt and TRUNC(EPR_DT_PRODN_TATA) <= :lastDt
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateCtlProduction = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='C'
              AND TRUNC(EPR_DT_PRODN_TATA) >= :firstDt and TRUNC(EPR_DT_PRODN_TATA) <= :lastDt
              AND LOM_CD_QLTY_ACTL <>'SCRP'`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDatePacking = async (req: any) => {
  try {
    var sql = `SELECT (SUM(EPR_MS_GROSS_ACTL)/1000) tb_prd_ton,COUNT(1)
        FROM
              v_epa_line_prodn   a,
              v_work_inst        b,
              v_LDP_PRODN        c
          WHERE epr_id_batch = LOM_id_batch
              AND epr_cd_epa = LOM_cd_epa
              AND LOM_cd_epa = ewi_cd_epa
              AND LOM_id_batch = ewi_id_batch
              AND epr_cd_epa = ewi_cd_epa
              AND epr_id_batch = ewi_id_batch
              AND epr_id_wrk_inst = ewi_id_wrk_inst
              AND ewi_cd_status <> 'RJ'
              AND LOM_cd_epa = :plant
              AND EPR_CD_PROCESS='W'
              AND TRUNC(EPR_DT_PRODN_TATA) >= :firstDt and TRUNC(EPR_DT_PRODN_TATA) <= :lastDt
              AND LOM_CD_QLTY_ACTL <>'SCRP'
              AND LOM_WORK_CENTER  IN (select  PLM_WCNT_CODE FROM V_PROC_LINE_MACHINE WHERE PLM_CD_PROCESS IN (SELECT EPL_CD_PROCESS FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA =:plant AND EPL_ACTIVITY_NM IN ('TUBE','ERW','CTL')))`;

    let binds = {
      plant: req.body.plant,
      firstDt: req.body.firstDate,
      lastDt: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTillDateDispatch = async (req: any) => {
  try {
    var sql = `SELECT ROUND((SUM(EPR_MS_GROSS_ACTL)/1000),3) tb_prd_ton,COUNT(1) FROM V_EPA_LINE_PRODN , V_LDP_PRODN
        WHERE LOM_CD_EPA = EPR_CD_ePA
        AND  LOM_ID_BATCH  = EPR_ID_BATCH
        AND LOM_CD_STATUS='WL'
        AND EPR_CD_EPA= :plant 
        AND EPR_CD_PROCESS='W'
        --AND TRUNC(EPR_TS_REC_CREATE) >= ’01-10-2023’ AND TRUNC(EPR_TS_REC_CREATE) <= TRUNC(SYSDATE-1)`;

    let binds = {
      plant: req.body.plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTubeProdMonthlyReport = async (req: any) => {
  try {
    // 01-APR-2023 -31-DEC-2023 (if 2024 merch select then 01-APR-2023 to 01-APR-2024)
    // if 2023-May then (01-APR-2023 -31-DEC-2023)
    // if()

    var sql = `SELECT
        to_char(trunc(epr_dt_prodn_tata), 'YYYY-MM') epr_dt_prodn,
        ( SUM(epr_ms_gross_actl) / 1000 ) tb_prd_ton,
        COUNT(1)
    FROM
        v_epa_line_prodn   a,
        v_work_inst        b,
        v_LDP_PRODN        c
    WHERE
        epr_id_batch = LOM_id_batch
        AND epr_cd_epa = LOM_cd_epa
        AND LOM_cd_epa = ewi_cd_epa
        AND LOM_id_batch = ewi_id_batch
        AND epr_cd_epa = ewi_cd_epa
        AND epr_id_batch = ewi_id_batch
        AND epr_id_wrk_inst = ewi_id_wrk_inst
        AND ewi_cd_status <> 'RJ'
        AND LOM_cd_epa = :plant
        AND epr_cd_process = 'M'
        AND trunc(epr_dt_prodn_tata) >= :firstDate
        AND trunc(epr_dt_prodn_tata) <= :lastDate
        AND LOM_cd_qlty_actl <> 'SCRP'
    GROUP BY
        to_char(trunc(epr_dt_prodn_tata), 'YYYY-MM')`;

    let binds = {
      plant: req.body.plant,
      firstDate: req.body.firstDate,
      lastDate: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPackingMonthlyReport = async (req: any) => {
  try {
    var sql = `SELECT
        to_char(trunc(epr_dt_prodn_tata), 'YYYY-MM') epr_dt_prodn,
        round((SUM(epr_ms_gross_actl) / 1000), 3) tot_pack_ton,
        COUNT(1)
    FROM
        v_epa_line_prodn   a,
        v_work_inst        b,
        v_LDP_PRODN        c
    WHERE
        epr_id_batch = LOM_id_batch
        AND epr_cd_epa = LOM_cd_epa
        AND LOM_cd_epa = ewi_cd_epa
        AND LOM_id_batch = ewi_id_batch
        AND epr_cd_epa = ewi_cd_epa
        AND epr_id_batch = ewi_id_batch
        AND epr_id_wrk_inst = ewi_id_wrk_inst
        AND ewi_cd_status <> 'RJ'
        AND LOM_cd_status <> 'VF'
        AND LOM_cd_epa = :plant
        AND epr_cd_process = 'W'
        AND trunc(epr_dt_prodn_tata) >= :firstDate
        AND trunc(epr_dt_prodn_tata) <= :lastDate
        AND LOM_cd_qlty_actl <> 'SCRP'
        AND LOM_work_center IN (
            SELECT
                plm_wcnt_code
            FROM
                v_proc_line_machine
            WHERE
                plm_cd_process IN (
                    SELECT
                        epl_cd_process
                    FROM
                        v_epa_proc_line
                    WHERE
                        epl_cd_epa = :plant
                        AND epl_activity_nm IN (
                            'TUBE',
                            'ERW',
                            'CTL'
                        )
                )
        )
    GROUP BY
        to_char(trunc(epr_dt_prodn_tata), 'YYYY-MM')`;

    let binds = {
      plant: req.body.plant,
      firstDate: req.body.firstDate,
      lastDate: req.body.lastDate,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
