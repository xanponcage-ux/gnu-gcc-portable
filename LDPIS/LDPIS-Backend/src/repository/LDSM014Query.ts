import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getQualityResultData = async (
  plant: any,
  batch_id: any,
  frmDt: any,
  toDt: any
) => {
  try {
    var sql = `SELECT DISTINCT
        batch_id,
        plant,
        net_wt,
        net_wt_uom,
        crt_dt,
        status,
        mother_batch,
        parent_batch,
        LOM_no_cast,
        MAX(tco_crt_by) tco_crt_by,
        MAX(nvl(TO_CHAR(tco_crt_dt, 'DD-MON-YYYY HH24:MI:SS'), ' ')) tco_crt_dt,
        LOM_no_matnr,
        thk,
        od,
        LOM_length,
        LOM_no_pieces,
        (
            SELECT
                maktx
            FROM
                v_ympct_tub_matl
            WHERE
                mandt = '600'
                AND matnr = LOM_no_matnr
                AND ROWNUM = 1
        ) rm_matnr_desc,
        LOM_cd_qlty_actl,
        LOM_id_order_cus      ord,
        LOM_id_ord_item_cus   item,
        LOM_tdc_actl          grade, LOM_CD_CURR_PROC      process,
        WorkCenter,    
        MAX(uts) uts,
        MAX(YS) ys,
        MAX(hrb) hrb_rb,
        MAX(ra) ra,
        nvl(MAX(bend), ' ') bend,
        MAX(max_thk) max_thk,
        MAX(min_thk) min_thk,
        MAX(max_height) max_height,
        MAX(min_height) min_height,
        MAX(max_width) max_width,
        MAX(min_width) min_width,
        MAX(el) el,
        MAX(straight) straight,
        MAX(ect) ect,
        MAX(crus_t) crus_t,
        MAX(fin_c) fin_c,
        MAX(max_len) max_len,
        MAX(min_len) min_len,
        MAX(max_id) max_id,
        MAX(min_id) min_id,
        MAX(min_od) min_od,
        MAX(max_od) max_od,
        MAX(fllat_t) fllat_t,
        MAX(squa_) squa_,
        MAX(r_corner) r_corner,
        MAX(twist) twist,
        nvl(MAX(driftin1), ' ') driftin1,
        nvl(MAX(hydtest), ' ') hydtest,
        nvl(MAX(r_flatt), ' ') r_flatt,
        nvl(MAX(flanging), ' ') flanging,
        MAX(c) c,
        MAX(p) p,
        MAX(s) s,
        MAX(si) si,
        MAX(mn) mn,
        MAX(al) al,
        MAX(cr) cr,
        MAX(cu) cu,
        MAX(nb) nb,
        MAX(v) v,
        MAX(ti) ti,
        MAX(ni) ni
    FROM
        (
            SELECT DISTINCT
                LOM_cd_curr_proc,
                LOM_cd_epa           plant,
                LOM_id_batch         batch_id,
                LOM_ms_gross_cal     net_wt,
                LOM_uom              net_wt_uom,
                TO_CHAR(LOM_ts_creation, 'DD-MM-YYYY HH24:MI:SS') crt_dt,
                LOM_cd_status        status,
                LOM_id_first_par     mother_batch,
                LOM_id_par_coil_no   parent_batch,
                LOM_no_cast,
                LOM_no_matnr,
                LOM_sec1             "THK",
                LOM_sec2             "OD",
                LOM_length,
                LOM_no_pieces,
                LOM_cd_qlty_actl,
                LOM_id_order_cus,
                LOM_id_ord_item_cus,
                LOM_tdc_actl,
                (select EPR_WORK_CENT from v_epa_line_prodn 
                where epr_cd_epa = LOM_cd_epa and epr_id_batch = LOM_id_batch and epr_cd_process='M' and ROWNUM = 1) WorkCenter, 
                MAX(tco_crt_by) tco_crt_by,
                MAX(tco_crt_dt) tco_crt_dt,
                MAX(DECODE(tco_test_para, 'UTS', tco_test_para_val, 0)) "UTS",
                MAX(DECODE(tco_test_para, 'YS', tco_test_para_val, 0)) "YS",
                MAX(DECODE(tco_test_para, 'HRB', tco_test_para_val, 0)) "HRB",
                MAX(DECODE(tco_test_para, 'RA', tco_test_para_val, 0)) "RA",
                MAX(DECODE(tco_test_para, 'BEND', tco_test_para_rem, '')) "BEND",
                MAX(DECODE(tco_test_para, 'MAX_THK', tco_test_para_val, 0)) "MAX_THK",
                MAX(DECODE(tco_test_para, 'MIN_THK', tco_test_para_val, 0)) "MIN_THK",
                MAX(DECODE(tco_test_para, 'MAX_HEI', tco_test_para_val, 0)) "MAX_HEIGHT",
                MAX(DECODE(tco_test_para, 'MIN_HEI', tco_test_para_val, 0)) "MIN_HEIGHT",
                MAX(DECODE(tco_test_para, 'MAX_WID', tco_test_para_val, 0)) "MAX_WIDTH",
                MAX(DECODE(tco_test_para, 'MIN_WID', tco_test_para_val, 0)) "MIN_WIDTH",
                MAX(DECODE(tco_test_para, 'EL', tco_test_para_val, 0)) "EL",
                MAX(DECODE(tco_test_para, 'STRAIGHT', tco_test_para_val, 0)) "STRAIGHT",
                MAX(DECODE(tco_test_para, 'ECT', tco_test_para_val, 0)) "ECT",
                MAX(DECODE(tco_test_para, 'CRUS_T', tco_test_para_val, 0)) "CRUS_T",
                MAX(DECODE(tco_test_para, 'FIN_C', tco_test_para_val, 0)) "FIN_C",
                MAX(DECODE(tco_test_para, 'MAX_LEN', tco_test_para_val, 0)) "MAX_LEN",
                MAX(DECODE(tco_test_para, 'MIN_LEN', tco_test_para_val, 0)) "MIN_LEN",
                MAX(DECODE(tco_test_para, 'MAX_ID', tco_test_para_val, 0)) "MAX_ID",
                MAX(DECODE(tco_test_para, 'MIN_ID', tco_test_para_val, 0)) "MIN_ID",
                MAX(DECODE(tco_test_para, 'MIN_OD', tco_test_para_val, 0)) "MIN_OD",
                MAX(DECODE(tco_test_para, 'MAX_OD', tco_test_para_val, 0)) "MAX_OD",
                MAX(DECODE(tco_test_para, 'FLLAT_T', tco_test_para_rem, '')) "FLLAT_T",
                MAX(DECODE(tco_test_para, 'SQUA_', tco_test_para_val, 0)) "SQUA_",
                MAX(DECODE(tco_test_para, 'R_CORNER', tco_test_para_val, 0)) "R_CORNER",
                MAX(DECODE(tco_test_para, 'TWIST', tco_test_para_val, 0)) "TWIST",
                MAX(DECODE(tco_test_para, 'DRIFTIN1', tco_test_para_rem, '')) "DRIFTIN1",
                MAX(DECODE(tco_test_para, 'HYDTEST', tco_test_para_rem, '')) "HYDTEST",
                MAX(DECODE(tco_test_para, 'R_FLATT', tco_test_para_rem, '')) "R_FLATT",
                MAX(DECODE(tco_test_para, 'FLANGING', tco_test_para_rem, '')) "FLANGING",
                MAX(DECODE(tca_test_para, 'C', tca_test_para_val, 0)) "C",
                MAX(DECODE(tca_test_para, 'P', tca_test_para_val, 0)) "P",
                MAX(DECODE(tca_test_para, 'S', tca_test_para_val, 0)) "S",
                MAX(DECODE(tca_test_para, 'SI', tca_test_para_val, 0)) "SI",
                MAX(DECODE(tca_test_para, 'MN', tca_test_para_val, 0)) "MN",
                MAX(DECODE(tca_test_para, 'AL', tca_test_para_val, 0)) "AL",
                MAX(DECODE(tca_test_para, 'CR', tca_test_para_val, 0)) "CR",
                MAX(DECODE(tca_test_para, 'CU', tca_test_para_val, 0)) "CU",
                MAX(DECODE(tca_test_para, 'NB', tca_test_para_val, 0)) "NB",
                MAX(DECODE(tca_test_para, 'V', tca_test_para_val, 0)) "V",
                MAX(DECODE(tca_test_para, 'TI', tca_test_para_val, 0)) "TI",
                MAX(DECODE(tca_test_para, 'NI', tca_test_para_val, 0)) "NI"
            FROM
                v_LDP_PRODN,
                v_tc_coil_test,
                v_tc_cast_test
            WHERE
                LOM_cd_epa = :plant
                AND LOM_id_batch = tco_prod_no
                AND LOM_no_cast = tco_cast_no
                AND LOM_no_cast = tca_cast_no
                AND nvl(tco_crt_by, '-') <> 'TSMTUBEPI'  -- THIS WILL GIVE RECORDED VALUE IN MES AND NONLSA        
                AND LOM_id_batch <> LOM_id_first_par       `;

    let binds = {
      plant: plant,
    };

    if (frmDt && toDt && frmDt != "" && toDt != "") {
      sql += ` AND to_char(LOM_TS_CREATION,'dd-Mon-yyyy') >= NVL(:frmDt,to_char(LOM_TS_CREATION,'dd-Mon-yyyy')) AND to_char(LOM_TS_CREATION,'dd-Mon-yyyy') <= NVL(:toDt,to_char(LOM_TS_CREATION,'dd-Mon-yyyy')) `;
      binds["frmDt"] = frmDt;
      binds["toDt"] = toDt;
    }

    sql += ` AND LOM_CD_STATUS NOT IN ('VF','VB') `;
    if (batch_id && batch_id != "") {
      sql += ` AND TCO_PROD_NO = NVL(:batch_id, TCO_PROD_NO) `;
      binds["batch_id"] = batch_id;
    }

    sql += ` GROUP BY
        LOM_cd_curr_proc,
        LOM_cd_epa,
        LOM_id_batch,
        LOM_ms_gross_cal,
        LOM_uom,
        LOM_ts_creation,
        LOM_cd_status,
        LOM_id_first_par,
        LOM_id_par_coil_no,
        LOM_no_cast,
        tco_test_para,
        LOM_no_matnr,
        LOM_sec1,
        LOM_sec2,
        LOM_length,
        LOM_no_pieces,
        LOM_cd_qlty_actl,
        LOM_id_order_cus,
        LOM_id_ord_item_cus,
        LOM_tdc_actl
)
  GROUP BY
        plant,
        batch_id,
        net_wt,
        net_wt_uom,
        crt_dt,
        status,
        mother_batch,
        parent_batch,
        LOM_no_cast,
        LOM_no_matnr,
        thk,
        od,
        LOM_length,
        LOM_no_pieces,
        LOM_cd_qlty_actl,
        LOM_id_order_cus,
        LOM_id_ord_item_cus,
        LOM_tdc_actl,
        LOM_cd_curr_proc,
        WorkCenter
    ORDER BY
        plant,
        batch_id`;
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getStripChartData = async (data: any) => {
  try {
    let sql = ``;

    let binds = {
      plant: data?.plant,
      tube: data?.tube,
      widthFrm: data?.width[0],
      widthTo: data?.width[1],
      thickFrm: data?.thick[0],
      thickTo: data?.thick[1],
    };
    if (data?.type === "R") {
      sql = `select E.*,NVL(DECODE(TEN_COIL_ODIA_MERG,'0',TEN_COIL_ODIA_UNMERG,TEN_COIL_ODIA_MERG),0)TEN_COIL_ODIA from (SELECT EPR_CD_EPA,EPR_ID_BATCH,EPR_SEC2,EPR_MS_GROSS_ACTL QTY,EPR_ID_PAR_BATCH,LOM_sec1 Tube_Thk,LOM_sec2 Tube_Odia
            ,(select LOM_sec1 from v_LDP_PRODN where LOM_id_batch=a.EPR_ID_PAR_BATCH) inp_thk_slit
            ,(select LOM_sec2 from v_LDP_PRODN where LOM_id_batch=a.EPR_ID_PAR_BATCH) inp_width_slit
            ,EPR_WORK_CENT Mill_No,
            LOM_MS_PIECE_ACTL NET_WT, LOM_ODIA ODIA, LOM_SEC1 THICK, LOM_SEC2 WIDTH, LOM_ID_ORDER ORDR, LOM_NO_ITEM ITEM, LOM_MERGE_BATCH MBATCH,
            (select NVL(EIC_TEN_TUBOD,0)EIC_TEN_TUBOD
             from v_input_coil
             where eic_cd_epa=b.LOM_cd_epa
             and eic_id_coil=b.LOM_ID_FIRST_PAR
             AND b.LOM_ID_FIRST_PAR NOT LIKE 'MR%'
            )TEN_COIL_ODIA_MERG,
            (
            SELECT MAX(NVL(EIC_TEN_TUBOD,0))EIC_TEN_TUBOD
            from v_input_coil
            where eic_cd_epa=b.LOM_cd_epa
            and eic_id_coil IN (SELECT ERD_ID_BATCH FROM V_EPA_RANDOM_DTLS
            WHERE ERD_CD_EPA='0788' AND ERD_ID_NEW_BATCH=B.LOM_ID_FIRST_PAR AND ERD_MOV_IND='B' AND ERD_ID_NEW_BATCH LIKE 'MR%')
            ) TEN_COIL_ODIA_UNMERG
            FROM V_EPA_LINE_PRODN A , V_LDP_PRODN B
            WHERE EPR_CD_EPA = LOM_CD_EPA
            AND EPR_ID_PAR_BATCH = LOM_ID_FIRST_PAR
            AND EPR_ID_BATCH = LOM_ID_BATCH
            AND EPR_CD_EPA= ${data?.plant}
             `;
      if (data?.frmDt && data?.toDt && data?.frmDt != "" && data?.toDt != "") {
        sql += ` AND trunc(EPR_DT_PRODN_TATA) >= '${data?.frmDt}' and  trunc(EPR_DT_PRODN_TATA) <= '${data?.toDt}' `;
      }

      sql += ` AND EPR_CD_PROCESS='M'
            AND EPR_CD_QLTY<>'SCRP'
            ORDER BY LOM_sec2 ) E
            WHERE (NVL(DECODE(TEN_COIL_ODIA_MERG,'0',TEN_COIL_ODIA_UNMERG,TEN_COIL_ODIA_MERG),0)) = ${data?.tube}
            AND INP_THK_SLIT >= ${data?.thick[0]} AND INP_THK_SLIT < ${data?.thick[1]}
            AND INP_WIDTH_SLIT >= ${data?.width[0]} AND INP_WIDTH_SLIT < ${data?.width[1]}
            order by TUBE_THK`;
    } else if (data?.type === "S") {
      if (data?.frmDt && data?.toDt && data?.frmDt != "" && data?.toDt != "") {
        sql += ` `;
      }

      sql += ` `;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
