import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

//TAB 1 display
export const getTabDisplayData = async (data: any) => {
  try {
    var sql = "";
    if (data?.tabValue === 0) {
      sql = ` SELECT TDM_CD_PLANT PLANT, TDM_MATNR_NO MAT_NO, TDM_DWN_MATNR_NO DWN_MAT_NO,
        TDM_CATEGORY CATEGRY, TDM_FLAG FLAG, TO_CHAR(TDM_CRT_DT, 'DD-MM-YY') CRT_DT,
        TDM_CRT_BY CRT_BY
        FROM V_DOWNGRADE_MATL `;
    } else if (data?.tabValue === 1) {
      sql = ` SELECT PTT_CATE CATE, PTT_SPEC SPEC, PTT_TOL_PER_MIN TOL_MIN,
            PTT_TOL_PER_MAX TOL_MAX, TO_CHAR(PTT_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') CRT_DT, PTT_CRT_USER CRT_BY,
            TO_CHAR(PTT_UPD_DT, 'DD-MM-YYYY HH24:MI:SS') UPD_DT, PTT_UPD_USER UPD_BY
            FROM V_PIPE_THK_TOLERANCE`;
    } else if (data?.tabValue === 2) {
      sql = ` SELECT PWT_SPEC SPEC, PWT_CATE CATE, PWT_WT_TOL_PER WT_TOL_PER, TO_CHAR(PWT_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') CRT_DT,
        PWT_CRT_USER CRT_BY, TO_CHAR(PWT_UPD_DT, 'DD-MM-YYYY HH24:MI:SS') UPD_DT, PWT_UPD_USER UPD_BY
        FROM V_PIPE_WT_TOLERANCE`;
    } else if (data?.tabValue === 3) {
      sql = ` select TDM_RM_TDC RM_TDC, TDM_EQUIV_TDC EQUIV_TDC,
            TDM_CRT_ID CRT_BY, TO_CHAR(TDM_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') CRT_DT,
            TDM_UPD_ID UPD_BY, TO_CHAR(TDM_UPD_DT, 'DD-MM-YYYY HH24:MI:SS') UPD_DT  from V_TDC_MAP`;
    } else if (data?.tabValue === 4) {
      sql = ` SELECT RSM_SPEC SPEC, RSM_NO_TDC TDC, RSM_FLAG FLAG,
            TO_CHAR(RSM_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') CRT_DT, RSM_CRT_BY CRT_BY, RSM_REMARKS REMARKS 
            FROM V_RMTDC_SPEC_MAPPING`;
    }

    console.log("getTabDisplayData: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const InsertData = async (data: any, adid: any, tabValue: any) => {
  try {
    // console.log("data", data);

    let sql = ``;

    if (tabValue === 0) {
      sql = ` INSERT INTO V_DOWNGRADE_MATL(
              TDM_CD_PLANT, TDM_MATNR_NO,
              TDM_DWN_MATNR_NO, TDM_CATEGORY,
              TDM_FLAG, TDM_CRT_DT,
              TDM_CRT_BY)
              VALUES (
              '${data?.PLANT}', '${data?.MAT_NO}' ,
              '${data?.DWN_MAT_NO}','${data?.CATEGRY}',
              '${data?.FLAG}',SYSDATE,
              '${data?.CRT_BY}') `;
    } else if (tabValue === 1) {
      sql = ` INSERT INTO V_PIPE_THK_TOLERANCE(
              PTT_CATE, PTT_SPEC,
              PTT_TOL_PER_MIN, PTT_TOL_PER_MAX,
              PTT_CRT_DT, PTT_CRT_USER,
              PTT_UPD_DT, PTT_UPD_USER)
              VALUES (
              '${data?.CATE}', '${data?.SPEC}' ,
              '${data?.TOL_MIN}','${data?.TOL_MAX}',
              SYSDATE, '${data?.CRT_BY}',
              null, null) `;
    } else if (tabValue === 2) {
      sql = ` INSERT INTO V_PIPE_WT_TOLERANCE(
              PWT_SPEC, PWT_CATE,
              PWT_WT_TOL_PER, PWT_CRT_DT,
              PWT_CRT_USER, PWT_UPD_DT,
              PWT_UPD_USER)
              VALUES (
              '${data?.SPEC}', '${data?.CATE}' ,
              '${data?.WT_TOL_PER}',SYSDATE,
              '${data?.CRT_BY}', null,
              null) `;
    } else if (tabValue === 3) {
      sql = ` INSERT INTO V_TDC_MAP(
              TDM_RM_TDC, TDM_EQUIV_TDC,
              TDM_CRT_ID, TDM_CRT_DT,
              TDM_UPD_ID, TDM_UPD_DT)
              VALUES (
              '${data?.RM_TDC}', '${data?.EQUIV_TDC}' ,
              '${data?.CRT_BY}',SYSDATE,
              null, null) `;
    } else if (tabValue === 4) {
      sql = ` INSERT INTO V_RMTDC_SPEC_MAPPING(
              RSM_SPEC, RSM_NO_TDC,
              RSM_FLAG, RSM_CRT_DT,
              RSM_CRT_BY, RSM_REMARKS)
              VALUES (
              '${data?.SPEC}', '${data?.TDC}' ,
              '${data?.FLAG}',SYSDATE,
              '${data?.CRT_BY}', '${data?.REMARKS}') `;
    }

    console.log("sql:: ", tabValue, sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCategoryLs = async () => {
  try {
    let sql = `select distinct TDM_CATEGORY from V_DOWNGRADE_MATL`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const DeleteData = async (data: any, adid: any) => {
  try {
    // Copy the row into V_DOWNGRADE_MATL_DEL with DEL_BY and DEL_DT then delete from original table
    const insertSql = `INSERT INTO V_DOWNGRADE_MATL_DEL (
      TDM_CD_PLANT, TDM_MATNR_NO, TDM_DWN_MATNR_NO, TDM_CATEGORY,
      TDM_FLAG, TDM_CRT_DT, TDM_CRT_BY, TDM_DEL_BY, TDM_DEL_DT
    ) SELECT
      TDM_CD_PLANT, TDM_MATNR_NO, TDM_DWN_MATNR_NO, TDM_CATEGORY,
      TDM_FLAG, TDM_CRT_DT, TDM_CRT_BY, :del_by, SYSDATE
    FROM V_DOWNGRADE_MATL
    WHERE TDM_CD_PLANT = :plant
      AND TDM_MATNR_NO = :mat_no
      AND TDM_DWN_MATNR_NO = :dwn_mat_no
      AND TDM_CATEGORY = :cat`;

    const deleteSql = `DELETE FROM V_DOWNGRADE_MATL
      WHERE TDM_CD_PLANT = :plant
        AND TDM_MATNR_NO = :mat_no
        AND TDM_DWN_MATNR_NO = :dwn_mat_no
        AND TDM_CATEGORY = :cat`;

    const bindsInsert = {
      plant: data?.PLANT,
      mat_no: data?.MAT_NO,
      dwn_mat_no: data?.DWN_MAT_NO,
      cat: data?.CATEGRY,
      del_by: adid,
    };
    const bindsDel = {
      plant: data?.PLANT,
      mat_no: data?.MAT_NO,
      dwn_mat_no: data?.DWN_MAT_NO,
      cat: data?.CATEGRY,
    };
    console.log(bindsInsert);
    // Execute insert then delete. Using executeQuery which wraps the DB call
    const insertResult = await query.executeQuery(insertSql, bindsInsert);
    const deleteResult = await query.executeQuery(deleteSql, bindsDel);

    return { insertResult, deleteResult };
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
