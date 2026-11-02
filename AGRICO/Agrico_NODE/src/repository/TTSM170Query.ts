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
        throw new Error.InternalServerError("Error!");
    }
};


export const GetProcDesc = async (Plant: any, tabValue: any) => {
    try {
        let sql;
        if (tabValue == 0) {
            sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS not in ('V','K','W') AND EPL_ACTIVITY_NM <>'SLT' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
        } else if (tabValue == 1) {
            sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_PROC_LINE_DESC FROM V_EPA_PROC_LINE WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS not in ('V','K','W') AND EPL_ACTIVITY_NM <>'SLT' ORDER BY EPL_NO_PROC_SEQ, EPL_CD_PROCESS`;
        } else {
            sql = `SELECT epl_cd_process, epl_cd_process || ' - ' || epl_proc_line_desc epl_proc_line_desc FROM v_epa_proc_line WHERE epl_cd_epa = :0 AND epl_no_proc_seq > 1 ORDER BY epl_no_proc_seq, epl_cd_process`;
        }

        let binds = [`${Plant}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
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
        throw new Error.InternalServerError("Error!");
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
        throw new Error.InternalServerError("Error!");
    }
};

export const GetRoll = async (Plant: any) => {
    try {
        const sql = `select distinct(tro_id_rollchange) roll from v_rollchange_order where tro_roll_status='A'and tro_cd_epa= :0 ORDER BY 1 DESC`;
        let binds = [`${Plant}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const GetPath = async (Plant: any, Process: any) => {
    try {
        const sql = `SELECT DISTINCT ( pph_cd_proc_path ) path, PPH_PRODUCT FROM v_epa_proc_path WHERE pph_cd_proc_path NOT IN ( SELECT epl_cd_process || 'KW' FROM v_epa_proc_line WHERE epl_cd_epa = :0 AND epl_activity_nm = 'SLT' ) AND pph_cd_proc_path LIKE '%' || nvl(:1, pph_cd_proc_path) || '%' AND pph_cd_epa = :2`;
        let binds = [`${Plant}`, `${Process}`, `${Plant}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getPathKhapoli = async (Plant: any, fgmat: any) => {
    try {
        const sql = `SELECT
        frm_route,
        pph_product,
        pph_desc
    FROM
        v_fg_route_mapping,
        v_epa_proc_path
    WHERE
        frm_cd_epa = pph_cd_epa
        AND frm_route = pph_cd_proc_path
        AND frm_cd_epa = :plant
        AND frm_fg_mat = :fgmat`;

        let binds = {
            plant : Plant,
            fgmat: fgmat
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const OrdercHK = async (Plant: any, OrderNo: any, ItemNo: any) => {
    try {
        const sql = `SELECT COUNT(1) FROM V_END_CUST_ORD_EPA WHERE ENC_CD_ePA :0 and enc_id_order=:1  and enc_no_item=:2`;
        let binds = [`${Plant}`, `${OrderNo}`, `${ItemNo}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const RMDetails = async (Plant: any, FG_Mat: any) => {
    try {

        const sql = ``;
        let binds = [`${Plant.EOP_CD_EPA}`, `${Plant.EOP_ID_ORDER}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const schTypModal = async (Plant: any, RM_Mat: any, Order: any, Item: any) => {
    try {
        let sql = `SELECT COUNT(1) FROM V_WORK_INST
        WHERE EWI_CD_ePA= :plant
        AND EWI_ID_ORDER_CUS = :Ordered
        AND EWI_ID_ORD_ITEM_CUS = :iTEM
        AND EWI_CD_STATUS IN ('WC','CN')`;
        let binds = {
            plant: Plant,
            Ordered: Order,
            iTEM: Item
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
}

export const CoilDetails = async (Plant: any, Process: any, RM_Mat: any, Order: any, Item: any) => {
    try {
        let binds = {
            plant: Plant,
            ordered: Order,
            item: Item
        };
        if (Process && Process == 'M') {
            Object.assign(binds, { cdStatus: "VM" });
        } else {
            Object.assign(binds, { cdStatus: Process + "B" });
        }
        // Scheduling Details Table
        let sql = `SELECT
        (
            SELECT
                f_coil_allot_status(b.eom_cd_epa, b.eom_id_batch, a.tma_id_order, a.tma_no_item)
            FROM
                dual
        ) allot_flag,
        eom_id_batch,
        eom_sec1,
        eom_sec2,
        a.tma_id_order   eom_id_order_cus,
        a.tma_no_item    eom_id_ord_item_cus,
        ltrim(eom_no_matnr, '0') material_old,
        (
            SELECT
                ltrim(eom_no_matnr, '0')
            FROM
                v_epa_prodn
            WHERE
                eom_cd_epa = b.eom_cd_epa
                AND eom_id_batch = b.eom_id_par_coil_no
        ) material,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = eom_no_matnr
                AND ROWNUM = 1
        ) maktx,
        eom_tdc_actl,
        decode(eom_uom, 'KG', round((eom_ms_gross_actl / 1000), 3), eom_ms_gross_actl) prc_wt,
        round(sysdate - eom_ts_creation) age,
        nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0) gross_wt,
        ( nvl(eom_ms_gross_cal, 0) * 1000 ) sch_qty_old,
        nvl(SUM(decode(tma_ms_alloted_uom, 'KG', tma_ms_alloted, 'TO', tma_ms_alloted * 1000)), 0) sch_qty,
        eom_uom,
        eom_no_cast,
        eom_no_matnr,
        tma_sfg_matnr
    FROM
        v_epa_prodn        b,
        v_temp_allotment   a
    WHERE
        b.eom_cd_epa = a.tma_cd_epa
        AND b.eom_id_batch = a.tma_id_batch
        AND eom_cd_epa = :plant
        AND eom_ms_gross_cal > 0
        AND ( eom_cd_status = 'VM'
              OR eom_cd_status LIKE '%B' )
        AND eom_cd_status NOT IN (
            'WB',
            'VB',
            'KB'
        )
        AND eom_cd_status = :cdstatus
        AND a.tma_id_order = :ordered
        AND a.tma_no_item = :item
    GROUP BY
        eom_cd_epa,
        eom_sec1,
        eom_sec2,
        tma_id_order,
        tma_no_item,
        eom_no_matnr,
        eom_tdc_actl,
        eom_ms_gross_cal,
        eom_ms_gross_actl,
        eom_ts_creation,
        eom_id_batch,
        eom_uom,
        eom_no_cast,
        eom_no_matnr,
        eom_id_par_coil_no,
        a.tma_id_order,
        a.tma_no_item,
        ltrim(eom_no_matnr, '0'),
        decode(eom_uom, 'KG', round((eom_ms_gross_actl / 1000), 3), eom_ms_gross_actl),
        round(sysdate - eom_ts_creation),
        nvl(decode(eom_uom, 'KG', round((eom_ms_gross_cal / 1000), 3), eom_ms_gross_cal), 0),
        ( nvl(eom_ms_gross_cal, 0) * 1000 ),
        tma_sfg_matnr
    ORDER BY
        eom_id_batch DESC`

        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const GetSchDetl = async (Plant: any, Process: any, BatchID: any) => {
    try {
        const sql = `SELECT ewi_id_batch, ewi_uom, ewi_l_sco_order, ewi_no_pieces, ewi_ms_piece_actl, ewi_id_order_cus, ewi_id_ord_item_cus, ewi_cd_status, ewi_no_sco_order, ewi_no_sco_item, ewi_priority, ewi_no_pack, to_char(ewi_ts_creation, 'DD-MON-YY') cr_dt, enc_cust_name, ewi_id_wrk_inst, ewi_id_schedule, ewi_sec2, ewi_idia, EWI_WRK_CENTER_NO WORK_CENT, EWI_REC_CRT_BY SCHD_CRT_BY , EWI_REC_CRT_DT SCHD_CRT_DT , EWI_PLANNED_PROC Route FROM v_work_inst, v_end_cust_ord_epa WHERE ewi_cd_epa = enc_cd_epa AND ewi_id_order_cus = enc_id_order AND ewi_id_ord_item_cus = enc_no_item AND ewi_cd_epa = :0 AND ewi_id_batch = nvl(:1, ewi_id_batch) AND ewi_cd_process = :2 AND ewi_cd_status = 'WC'`;
        let binds = [`${Plant}`, `${BatchID}`, `${Process}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const GetInqDetl = async (Plant: any, Process: any, BatchID: any, Status: any, OrdID: any, OrdItm: any, Prod_DT: any) => {
    try {
        var sql = `SELECT
        ewi_id_batch,
        ewi_no_pieces,
        ewi_ms_piece_actl,
        ewi_id_order_cus,
        ewi_id_ord_item_cus,
        ewi_cd_status,
        ewi_no_sco_order,
        ewi_no_sco_item,
        ewi_priority,
        ewi_no_pack,
        to_char(ewi_ts_creation, 'DD-MON-YYYY HH24:MI:SS') cr_dt,
        enc_cust_name,
        ewi_id_wrk_inst,
        ewi_id_schedule,
        ewi_sec2,
        ewi_idia,
        ewi_wrk_center_no   work_cent,
        ewi_rec_crt_by      schd_crt_by,
        to_char(ewi_rec_crt_dt, 'DD-MON-YYYY HH24:MI:SS') schd_crt_dt,
        ewi_planned_proc    route,
        ewi_uom,
        nvl(eom_no_matnr, enc_no_matnr) fg_material,
        (
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr = nvl(eom_no_matnr, enc_no_matnr)
                AND ROWNUM = 1
        ) fg_material_desc,
        nvl((
            SELECT
                tmm_sfg_mat
            FROM
                v_tub_matl_mapping
            WHERE
                tmm_cd_epa = eom_cd_epa
                AND tmm_fg_mat = eom_no_matnr
                AND ROWNUM = 1
        ), ' ') sfg_material,
        nvl((
            SELECT
                maktx
            FROM
                v_makt
            WHERE
                mandt = '600'
                AND matnr =(
                    SELECT
                        tmm_sfg_mat
                    FROM
                        v_tub_matl_mapping
                    WHERE
                        tmm_cd_epa = eom_cd_epa
                        AND tmm_fg_mat = eom_no_matnr
                        AND ROWNUM = 1
                )
        ), ' ') sfg_material_desc,
        nvl((
            SELECT
                eic_no_matnr
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = eom_cd_epa
                AND eic_id_coil = eom_id_first_par
                AND ROWNUM = 1
        ), ' ') rm_material,
        (
            SELECT
                (
                    SELECT
                        maktx
                    FROM
                        v_makt
                    WHERE
                        mandt = '600'
                        AND matnr = eic_no_matnr
                        AND ROWNUM = 1
                )
            FROM
                v_input_coil
            WHERE
                eic_cd_epa = eom_cd_epa
                AND eic_id_coil = eom_id_first_par
                AND ROWNUM = 1
        ) rm_material_desc,
        ewi_no_tdc          tube_grade
    FROM
        v_work_inst,
        v_end_cust_ord_epa,
        v_epa_prodn
    WHERE
        ewi_cd_epa = enc_cd_epa
        AND ewi_id_order_cus = enc_id_order
        AND ewi_id_ord_item_cus = enc_no_item
        AND ewi_cd_epa = :plant
        AND ewi_id_batch = nvl(:batchid, ewi_id_batch)
        AND ewi_cd_process = nvl(:process, ewi_cd_process)
        AND ewi_cd_process NOT IN (
            SELECT
                epl_cd_process
            FROM
                v_epa_proc_line
            WHERE
                epl_cd_epa = :plant
                AND epl_activity_nm = 'SLT'
        )
        AND ewi_id_order_cus = nvl(:ordid, ewi_id_order_cus)
        AND ewi_id_ord_item_cus = nvl(:orditm, ewi_id_ord_item_cus)
        AND to_char(ewi_ts_creation, 'DD-MON-YY') = nvl(to_char(to_date(:prod_dt, 'DD-MON-YYYY'), 'DD-MON-YY'), to_char(ewi_ts_creation
        , 'DD-MON-YY'))
        AND ewi_cd_epa = eom_cd_epa (+)
        AND ewi_id_batch = eom_id_batch (+)`;
        let binds = {
            Plant: Plant,
            Process: Process,
            BatchID: BatchID,
            OrdID: OrdID,
            OrdItm: OrdItm,
            Prod_DT: Prod_DT
        };

        if (Status == "") {
            sql += " and ewi_cd_status in ('WC','CN') "
        } else {
            if (Status == "CN") {
                sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) "
                Object.assign(binds, { status: 'CN' });
            } else {
                sql += "AND ewi_cd_status = nvl(:status, ewi_cd_status) "
                Object.assign(binds, { status: 'WC' });
            }
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const GetWIPSchDetl = async (Plant: any, BatchID: any) => {
    try {
        const sql = `select ewi_id_batch,ewi_sec1,ewi_sec2,ewi_length,ewi_idia,ewi_id_order_cus,ewi_id_ord_item_cus,eom_ms_gross_cal,ewi_id_parent_batch,ewi_no_sco_order,ewi_no_sco_item,ewi_camp_no,to_char(ewi_ts_creation,'DD-MON-YY')cr_dt from v_work_inst,v_epa_prodn where eom_cd_epa=ewi_cd_epa and eom_id_batch=ewi_id_batch and eom_cd_status like '%B' and eom_cd_status not in ('KB','WB','WL') and ewi_cd_status='PR' and ewi_cd_epa=:Plant and ewi_cd_qlty not in (select distinct(cd_value) from v_codes where cd_type='EPA82') and ewi_id_batch=nvl(:BatchID,ewi_id_batch)`;
        let binds = [`${Plant}`, `${BatchID}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const ScheduleConf = async (Plant: any, shift: any, Prod_dt: any, dt: any, CHK_PFS: any, Process: any) => {
    try {
        var res;
        if (dt) {
            const sql = `call C1CEB170_SCHED_CONFIRM ( 
                NBT_REL_DT => :NBT_REL_DT,
                NBT_EOM_CD_SHIFT => :NBT_EOM_CD_SHIFT,
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
                NBT_EOM_CD_SHIFT: shift,
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
                LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, },
            }
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
                nbt_eom_cd_shift => :nbt_eom_cd_shift,
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
                nbt_eom_cd_shift: shift,
                CHK_PFS: CHK_PFS,
                LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, },
            }

            res = await query.executeQuery(sql, binds);
        }
        return res;
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const ScheduleDel = async (Plant: any, dt: any) => {
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
            P_EWI_CD_STATUS: dt.EWI_CD_STATUS ?? "",
            P_EWI_ID_BATCH: dt.EWI_ID_BATCH ?? "",
            NBT_EPL_CD_EPA: Plant ?? "",
            P_EWI_ID_WRK_INST: dt.EWI_ID_WRK_INST ?? "",
            REC_FLAG: "F", //CODE FOR FULL DELETION
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
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
            LS_OUT_FLAG: "Z"
            // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const CRTSchedule = async (req: any) => {
    try {
        const { PlanPath, Plant, Process, ORD_ID, ORD_ITM, ORD_QTY, IDIA, ODIA, LENGTH, THICK, GRADE, MATNR, PROS_WT, GALVY_WT, rollchange, MOTHER_BATCH, CL_WT, CL_MATNR, FG_WT, adid, EOP_SFG_MATNR_BOM, P_SCH_TYPE_FL, P_NOMINATE_BATCH, P_NOMINATE_MATNR, REMARKS, Priority } = req.body;
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
            P_PLNG_REMARKS => :P_PLNG_REMARKS,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;


        const binds = {
            CHK_COIL: 'Y',
            PARAM_PLANT_CNT: 1,
            PPH_CD_PROC_PATH: PlanPath,
            NBT_EPL_CD_EPA: Plant,
            NBT_PROC_LINE: Process,
            CHK_ORDER: Priority,
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
            P_PLNG_REMARKS: REMARKS,
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, },
        }

        return await query.executeQuery(sql, binds);
    } catch (error) {

        throw new Error.InternalServerError("Error!");
    }
};

export const CRTScheduleAll = async (PlanPath: any, Plant: any, Process: any, ORD_ID: any, ORD_ITM: any, ORD_QTY: any, IDIA: any, ODIA: any, LENGTH: any, THICK: any, GRADE: any, MATNR: any, PROS_WT: any, GALVY_WT: any, rollchange: any, MOTHER_BATCH: any, CL_WT: any, CL_MATNR: any, FG_WT: any, adid: any, EOP_SFG_MATNR_BOM: any, P_SCH_TYPE_FL: any, COIL_ID: any, P_NOMINATE_MATNR: any, REMARKS: any, Priority: any) => {
    try {

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
            P_PLNG_REMARKS  => :P_PLNG_REMARKS,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;


        const binds = {
            CHK_COIL: 'Y',
            PARAM_PLANT_CNT: 1,
            PPH_CD_PROC_PATH: PlanPath,
            NBT_EPL_CD_EPA: Plant,
            NBT_PROC_LINE: Process,
            CHK_ORDER: Priority,
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
            NBT_MOTHER_BATCH: COIL_ID, //MOTHER_BATCH
            NBT_CL_WT: CL_WT,
            NBT_CL_MATNR: CL_MATNR,
            NBT_FG_WT: FG_WT,
            P_USER: adid,
            P_SCH_TYPE_FL: P_SCH_TYPE_FL,
            P_SFG_MATNR: EOP_SFG_MATNR_BOM,
            P_NOMINATE_BATCH: null,
            P_NOMINATE_MATNR: null,
            P_PLNG_REMARKS: REMARKS,
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, },
        }

        return await query.executeQuery(sql, binds);
    } catch (error) {

        throw new Error.InternalServerError("Error!");
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
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
        }
        //P_PLANT == plnt code
        //P_INP_COILS == cpncatenated coil id of 10 charecter. (EOM_ID_BATCH)
        //P_NO_OF_COIL == total no of coils (Rows Length) 

        return await query.executeQuery(sql, binds);
    } catch (error) {

        throw new Error.InternalServerError("Error!");
    }
};

export const GetOrder = async (req: any) => {
    // get order details table
    const { Plant, process, Odia, Idia, Order, Item } = req.body;
    let binds = {
        plant: Plant,
        enc_id_orde: Order,
        enc_no_item: Item,
        enc_od: Odia,
        enc_id: Idia
    };

    try {
        if (process && process == 'M') {
            Object.assign(binds, { cdStatus: "VM" });
        } else {
            Object.assign(binds, { cdStatus: process + "B" });
        }

        // let sql = `SELECT DISTINCT enc_cd_epa, enc_id_order, enc_no_item, enc_sec1_max, enc_sec2_max, enc_length_max, enc_ord_quantity order_qnty, 0 dispatched, 0 free_stock, (SELECT f_wip (enc_cd_epa, enc_id_order, enc_no_item) FROM DUAL) tot_wip, (SELECT f_fg_stock (enc_cd_epa, enc_id_order, enc_no_item ) FROM DUAL) tot_fg, 0 net_balance_to_prod, enc_idia, enc_sec2_max, enc_no_matnr, (SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = enc_no_matnr AND ROWNUM = 1) matnr_desc, (SELECT DISTINCT tmm_sfg_mat FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1) sfg_matnr_bom, (SELECT DISTINCT tmm_sfg_mat_desc FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1) sfg_matnr_desc, (SELECT DISTINCT tmm_rm_mat FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1) rm_matnr_bom, (SELECT DISTINCT tmm_rm_mat_desc FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1) rm_matnr_desc, enc_mark_cust mark_cust, enc_mark_cust_name mark_cust_nm, '' city, enc_order_edge ord_edge, grade cd_grade, item_type, mill, draw_type, geometry, CATEGORY, spec, sur_finish, CLASS, end_finish, ins_code, (SELECT f_alloted (a.enc_cd_epa, a.enc_id_order, a.enc_no_item ) FROM DUAL) alloted_qty, to_char(tma_ts_allotment,'DD-MON-YYYY') allot_dt, NVL (eop_alloted, 0) alloted_to, NVL (eop_fg, 0) fg_kg, NVL (eop_qty, 0) ord_qty, NVL (eop_wip_qty, 0) wip_kg, NVL (eop_qty - ((eop_fg / 1000) + (eop_wip_qty / 1000)), 0 ) btr, NVL (eop_qty - ((eop_fg / 1000)), 0) btf, NVL (  eop_qty - (  (eop_fg / 1000) + (eop_wip_qty / 1000) - (eop_alloted / 1000) ), 0 ) bta FROM v_end_cust_ord_epa a, v_epa_prodn c, v_temp_allotment d, v_ympct_tub_matl b, v_epa_order_prog e WHERE enc_cd_epa = c.eom_cd_epa AND a.enc_id_order = d.tma_id_order AND a.enc_no_item = d.tma_no_item AND a.enc_cd_epa = d.tma_cd_epa AND c.eom_id_batch = d.tma_id_batch AND c.eom_cd_epa = d.tma_cd_epa AND enc_no_matnr(+) = b.matnr AND c.eom_cd_status = :cdstatus AND enc_cd_epa = :plant AND enc_id_order = NVL (:enc_id_orde, enc_id_order) AND enc_no_item = NVL (:enc_no_item, enc_no_item) AND enc_sec2_max = NVL (:enc_od, enc_sec2_max) AND enc_idia = NVL (:enc_id, enc_idia) AND a.enc_id_order = e.eop_id_order AND a.enc_no_item = e.eop_no_item AND a.enc_cd_epa = e.eop_cd_epa AND enc_id_order = enc_id_order AND enc_no_item = enc_no_item ORDER BY enc_cd_epa, to_char(tma_ts_allotment,'DD-MON-YYYY')`
        let sql = `SELECT DISTINCT enc_cd_epa, enc_id_order, enc_no_item, enc_sec1_max, enc_sec2_max, enc_length_max, enc_ord_quantity     order_qnty, 0 dispatched, 0 free_stock, ( SELECT f_wip(enc_cd_epa, enc_id_order, enc_no_item) FROM dual ) tot_wip, ( SELECT f_fg_stock(enc_cd_epa, enc_id_order, enc_no_item) FROM dual ) tot_fg, 0 net_balance_to_prod, enc_idia, enc_sec2_max, enc_no_matnr, ( SELECT maktx FROM v_makt WHERE mandt = '600' AND matnr = enc_no_matnr AND ROWNUM = 1 ) matnr_desc, ( SELECT DISTINCT tmm_sfg_mat FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1 ) sfg_matnr_bom, ( SELECT DISTINCT tmm_sfg_mat_desc FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1 ) sfg_matnr_desc, ( SELECT DISTINCT tmm_rm_mat FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1 ) rm_matnr_bom, ( SELECT DISTINCT tmm_rm_mat_desc FROM v_tub_matl_mapping WHERE tmm_cd_epa = a.enc_cd_epa AND tmm_fg_mat = a.enc_no_matnr AND ROWNUM = 1 ) rm_matnr_desc, enc_mark_cust        mark_cust, enc_mark_cust_name   mark_cust_nm, '' city, enc_order_edge       ord_edge, grade                cd_grade, item_type, mill, draw_type, geometry, category, spec, sur_finish, class, end_finish, ins_code, ( SELECT f_alloted(a.enc_cd_epa, a.enc_id_order, a.enc_no_item) FROM dual ) alloted_qty, to_char(tma_ts_allotment, 'DD-MON-YYYY') allot_dt FROM v_end_cust_ord_epa   a, v_epa_prodn          c, v_temp_allotment     d, v_ympct_tub_matl     b WHERE enc_cd_epa = c.eom_cd_epa AND a.enc_id_order = d.tma_id_order AND a.enc_no_item = d.tma_no_item AND a.enc_cd_epa = d.tma_cd_epa AND c.eom_id_batch = d.tma_id_batch AND c.eom_cd_epa = d.tma_cd_epa AND enc_no_matnr  = b.matnr (+) AND c.eom_cd_status = :cdstatus AND enc_cd_epa = :plant AND enc_id_order = nvl(:enc_id_orde, enc_id_order) AND enc_no_item = nvl(:enc_no_item, enc_no_item) AND enc_sec2_max = nvl(:enc_od, enc_sec2_max) AND enc_idia = nvl(:enc_id, enc_idia) AND enc_id_order = enc_id_order AND enc_no_item = enc_no_item ORDER BY enc_cd_epa, to_char(tma_ts_allotment, 'DD-MON-YYYY')`

        return await query.executeQuery(sql, binds);
    }
    catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const GetAddedColumns = async (id: any) => {
    try {
        const sql = ``;
        let binds = [`${id}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getWorkCenter = async (Plant: any, process: any) => {
    try {
        const sql = `SELECT PLM_WCNT_CODE||' , '||PLM_WCNT_DESC FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA=:0 AND PLM_CD_PROCESS =:1 AND PLM_ACTIVE_STATUS='A' Order by PLM_WCNT_CODE`;
        let binds = [`${Plant}`, `${process}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getBatchId = async (Plant: any) => {
    try {
        const sql = `select EWI_ID_BATCH
        from v_work_inst
        where ewi_Cd_Epa=:0
        and ewi_cd_status in ('WC','CN')`;
        let binds = [`${Plant}`];
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getAllOrderList = async (req: any) => {
    try {
        const { Plant } = req.body;
        let sql = `SELECT DISTINCT enc_id_order, tma_ts_allotment FROM v_epa_prodn          a, v_end_cust_ord_epa   b, v_temp_allotment     c WHERE eom_cd_epa = enc_cd_epa AND tma_cd_epa = enc_cd_epa AND tma_id_order = enc_id_order AND tma_no_item = enc_no_item AND tma_cd_epa = eom_cd_epa AND tma_id_batch = eom_id_batch AND eom_cd_epa = :Plant AND ( ( eom_cd_status = 'VM' OR eom_cd_status LIKE '%B' ) AND eom_cd_status NOT IN ( 'WB', 'VB', 'KB' ) ) AND enc_st_order = 'A' ORDER BY tma_ts_allotment DESC`
        let binds = {
            Plant: Plant
        };

        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getAllItemList = async (req: any) => {
    try {
        const { Plant, OrderId } = req.body;
        let sql = `SELECT DISTINCT enc_no_item FROM v_end_cust_ord_epa, v_temp_allotment WHERE enc_cd_epa = tma_cd_epa AND enc_id_order = tma_id_order AND enc_no_item = tma_no_item AND enc_cd_epa = :plant AND enc_id_order = :orderid ORDER BY 1`
        let binds = {
            plant: Plant,
            orderid: OrderId
        };

        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const schMatDesc = async (req: any) => {
    try {
        let sql = `SELECT DISTINCT TMM_SFG_MAT SFG_MATL ,(SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.TMM_SFG_MAT AND ROWNUM=1)SFG_MATL_DESC
        FROM V_TUB_MATL_MAPPING A
        WHERE TMM_CD_EPA =:plant
        AND TMM_FG_MAT =LPAD(:FG_Mat,18,'0')`

        let binds = {
            plant: req.body.plant,
            FG_Mat: req.body.FG_Mat
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
}

export const getMergeBatchDetails = async (req: any) => {
    try {
        let sql = `select erd_cd_epa,ERD_ID_NEW_BATCH MERGE_BATCH,ERD_ID_BATCH COMPONENT_BATCH,ROUND((ERD_BATCH_QTY*1000),1) COMPONENT_BATCH_QTY , ERD_FLG_SEND_SAP SEND_SAP_FLAG
        , ERD_REC_CRT_DT CREATION_DATE,ERD_REC_CRT_UID CREATED_BY
        from v_epa_random_dtls
        where ERD_CD_ePA=:Plant
        AND ERD_ID_NEW_BATCH=:batchId
        AND ERD_MOV_IND='B' AND ERD_REC_STATUS='A'`

        let binds = {
            Plant: req.body.Plant,
            batchId: req.body.batchId
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
}

export const ScheduleDelMerge = async (req: any) => {
    try {
        const sql = `call TUBEDBA.C1CEB170_SCHED_DEL_CHILD (
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
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const noMergeDetails = async (req: any) => {
    try {
        let sql = `SELECT CD_DESC1 FROM V_CODES
        WHERE CD_TYPE='TB006'
        AND CD_VALUE= :Plant`

        let binds = {
            Plant: req.body.Plant
        };
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const saveTUBEWIP = async (Plant: any, process: any, batch: any) => {
    try {
        const sql = `call C1CEB170_CRT_TUBEWIP (
            P_PLANT => :P_PLANT,
            P_BATCH => :P_BATCH,
            P_PROCLINE => :P_PROCLINE,
            LS_OUT_FLAG => :LS_OUT_FLAG
            )`;

        const binds = {
            P_PLANT: Plant,
            P_BATCH: batch,
            P_PROCLINE: process,
            LS_OUT_FLAG: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500, }
        }
        return await query.executeQuery(sql, binds);
    } catch (error) {

        throw new Error.InternalServerError("Error!");
    }
};

export const getPrioity = async (req: any) => {
    try {
        const sql = `SELECT MAX(NVL(EWI_PRIORITY,0)) DAY_MAX_PRIORITY 
        FROM V_WORK_INST
        WHERE TRUNC(EWI_TS_CREATION) = TRUNC(SYSDATE)
        AND EWI_CD_STATUS='CN'`;

        const binds = {
        };

        return await query.executeQuery(sql);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};


