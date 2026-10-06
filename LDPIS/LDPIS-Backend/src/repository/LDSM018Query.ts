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

export const getHoldData = async (
  plant: any,
  process: any,
  batch_id: any,
  mBatch: any,
  frmDt: any,
  toDt: any,
  frmDtRls: any,
  toDtRls: any
) => {
  try {
    let binds = {
      plant: plant,
    };
    var sql = `SELECT DISTINCT ehr_ts_hold hold_dt,EHR_TS_RELEASE Release_dt, LOM_uom, ehr_cd_rsn_hold hold_rsn,
                    (SELECT cd_desc
                       FROM v_epa_hold_rsn
                      WHERE cd_hold = ehr_cd_rsn_hold
                        AND cd_comp = '1000'
                        AND ROWNUM = 1) hold_desc,
                    ehr_id_op_hold hold_by, LOM_cd_prod, LOM_cd_qlty_actl,
                    LOM_sec1, LOM_sec2, LOM_length, LOM_tdc_actl,
                    LOM_ms_piece_actl, LOM_ms_gross_cal,
                    NVL (LOM_ms_scrap / 1000, 0) LOM_ms_scrap, LOM_cd_status,
                    LOM_cd_curr_proc, LOM_cd_next_proc, LOM_id_order_cus,
                    LOM_id_ord_item_cus, enc_cust_name,
                    (SELECT cd_desc
                       FROM v_codes
                      WHERE LOM_cd_status = cd_value
                            AND cd_type = 'E0001') cd_desc,
                    NVL (LOM_no_matnr, enc_no_matnr) material_no,
                    (SELECT maktx
                       FROM v_makt
                      WHERE mandt = '600'
                        AND matnr = NVL (LOM_no_matnr, enc_no_matnr)
                        AND ROWNUM = 1) material_desc,
                    ehr_id_batch batchid, ehr_cd_rsn_hold holdrsn,
                    ehr_op_remarks op_remarks, ehr_updated_by userid,
                    ehr_updated_on holddatetime
               FROM v_LDP_PRODN, v_end_cust_ord_epa, v_epa_matl_hold_rls
              WHERE LOM_id_order_cus = enc_id_order(+)
                AND LOM_id_ord_item_cus = enc_no_item(+)
                AND LOM_id_batch = ehr_id_batch(+)
                AND LOM_cd_epa = ehr_cd_epa(+)`;

    if (batch_id && batch_id != "") {
      sql += " And LOM_ID_BATCH =NVL(:batch, LOM_ID_BATCH)";
      Object.assign(binds, { batch: batch_id });
    }

    if (process && process != "") {
      sql += ` AND LOM_CD_CURR_PROC = NVL(:process, LOM_CD_CURR_PROC) `;
      binds["process"] = process;
    }

    if (frmDt && toDt && frmDt != "" && toDt != "") {
      sql += ` AND to_date(to_char(ehr_ts_hold,'dd-Mon-yyyy'),'dd-Mon-yyyy') >= TO_DATE(NVL(:frmDt,to_char(ehr_ts_hold,'dd-Mon-yyyy')),'dd-Mon-yyyy')
            AND to_date(to_char(ehr_ts_hold,'dd-Mon-yyyy'),'dd-Mon-yyyy') <= TO_DATE(NVL(:toDt,to_char(ehr_ts_hold,'dd-Mon-yyyy')),'dd-Mon-yyyy')`;
      binds["frmDt"] = frmDt;
      binds["toDt"] = toDt;
    }

    if (frmDtRls && toDtRls && frmDtRls != "" && toDtRls != "") {
      sql += ` AND to_date(to_char(EHR_TS_RELEASE,'dd-Mon-yyyy'),'dd-Mon-yyyy') >= TO_DATE(NVL(:frmDtRls,to_char(EHR_TS_RELEASE,'dd-Mon-yyyy')),'dd-Mon-yyyy')
          AND to_date(to_char(EHR_TS_RELEASE,'dd-Mon-yyyy'),'dd-Mon-yyyy') <= TO_DATE(NVL(:toDtRls,to_char(EHR_TS_RELEASE,'dd-Mon-yyyy')),'dd-Mon-yyyy')`;
      binds["frmDtRls"] = frmDtRls;
      binds["toDtRls"] = toDtRls;
    }

    sql += ` AND LOM_cd_epa = :plant
                AND ehr_id_batch IS NOT NULL
                AND ehr_ts_hold IS NOT NULL
           ORDER BY hold_dt DESC`;

    console.log(sql, binds);

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
