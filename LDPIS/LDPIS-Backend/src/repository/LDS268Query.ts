import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const page20 = async (data: any) => {
  try {
    if (data.type == "insertData") {
      let resData = [];
      for (let i = 0; i < data.loopData?.length; i++) {
        const sql = `call LDPDBA.LDB020_INSERT (
                    ls_out_flag     => :ls_out_flag,
                    LS_CREATE_USER  => :LS_CREATE_USER,
                    LS_PLANT_CD		=> :LS_PLANT_CD,
                    LS_ID_ORDER_NO  => :LS_ID_ORDER_NO,
                    LS_BATCH_NO		=> :LS_BATCH_NO,
                    LS_MATE_NO		=> :LS_MATE_NO,
                    LS_CURR_PROC	=> :LS_CURR_PROC,
                    LS_NEXT_PROC	=> :LS_NEXT_PROC,
                    LN_BATCH_PROC_NO=> :LN_BATCH_PROC_NO,
                    LS_ANGLE		=> :LS_ANGLE,
                    LS_RESULT		=> :LS_RESULT,
                    LS_REMARK		=> :LS_REMARK,
                    LS_INSP_NAME	=> :LS_INSP_NAME,
                    LS_SHIFT_DATE	=> :LS_SHIFT_DATE,
                    LS_SHIFT		=> :LS_SHIFT,
                    LS_SALE_ORDER_NO=> :LS_SALE_ORDER_NO,
                    LS_CD_STATUS   	=> :LS_CD_STATUS2
            )`;
        let binds = {
          ls_out_flag: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
            maxSize: 500,
          },
          LS_CREATE_USER: data.loopData.LS_CREATE_USER,
          LS_PLANT_CD: data.loopData.LS_PLANT_CD,
          LS_ID_ORDER_NO: data.loopData.LS_ID_ORDER_NO,
          LS_BATCH_NO: data.loopData.LS_BATCH_NO,
          LS_MATE_NO: data.loopData.LS_MATE_NO,
          LS_CURR_PROC: data.loopData.LS_CURR_PROC,
          LS_NEXT_PROC: data.loopData.LS_NEXT_PROC,
          LN_BATCH_PROC_NO: data.loopData.LN_BATCH_PROC_NO,
          LS_ANGLE: data.loopData.LS_ANGLE,
          LS_RESULT: data.loopData.LS_RESULT,
          LS_REMARK: data.loopData.LS_REMARK,
          LS_INSP_NAME: data.loopData.LS_INSP_NAME,
          LS_SHIFT_DATE: data.loopData.LS_SHIFT_DATE,
          LS_SHIFT: data.loopData.LS_SHIFT,
          LS_SALE_ORDER_NO: data.loopData.LS_SALE_ORDER_NO,
          LS_CD_STATUS2: data.loopData.LS_CD_STATUS2,
        };
        const indVarRes = await query.executeQuery(sql, binds);
        resData.push(indVarRes?.outBinds?.ls_out_flag);
      }
      return resData;
    }
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const page60 = async (Plant: any, tabValue: any) => {
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
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const page80 = async (Plant: any) => {
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
