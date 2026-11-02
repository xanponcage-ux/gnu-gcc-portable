import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";



export const getPlant = async () => {
  try {
    const sql = `SELECT DISTINCT CD_VALUE
        FROM V_CODES WHERE  CD_TYPE='TB065'`;
    // let binds = [`${id}`];
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getPlanData = async (Plant: any, MonthYear: any) => {
  try {
    let sql = ` SELECT  C.CD_VALUE     AS PLANT_CD,
    :P_YEARMON                         AS YEARMON,
    'ABP_'||C.CD_DESC1                 AS CATEGORY_CODE,
    C.CD_DESC                          AS CATEGORY_NAME,
    NVL(P.TVP_ABP, 0)                  AS ABP_VALUE,
    NVL(P.TVP_OSP, 0)                  AS OSP_VALUE,
    P.TVP_ABP_FREQUENCY                AS ABP_FREQUENCY,
    P.TVP_OSP_FREQUENCY                AS OSP_FREQUENCY,
    P.TVP_CRT_BY,
    P.TVP_CRT_ON,
    P.TVP_UPD_BY,
    P.TVP_UPD_ON,
    P.TVD_PROG_NM,
    P.TVD_DATABS_NM
    FROM V_CODES C
    LEFT JOIN V_VPDS_PLAN P
          ON P.TVP_PLANT_CD = C.CD_VALUE
          AND P.TVP_YEARMON  = :P_YEARMON
          AND P.TVP_CAT_ID   = 'ABP_' || C.CD_DESC1
    WHERE C.CD_TYPE  = 'TB065'
      AND C.CD_VALUE =:P_PLANT
    ORDER BY C.CD_DESC1`;
    let binds: any = {
      P_PLANT: Plant,
      P_YEARMON: MonthYear,
    };

    console.log('sql->', sql);
    console.log('binds->', binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};

export const savePlan = async (plant:any ,yearmon: any,catId: any,abp:any,osp:any,
          abpFrequency:any,ospFrequency: any,user:any) => {
  try {
    const sql = ` MERGE INTO v_vpds_plan tgt
    USING (  SELECT
            :p_plant                      AS tvp_plant_cd,
            :p_yearmon                    AS tvp_yearmon,
            :p_cat_id                     AS tvp_cat_id,      -- e.g. 'ABP_'||CD_DESC1
            :p_abp                        AS tvp_abp,
            :p_osp                        AS tvp_osp,
            NVL(:p_abp_frequency, 'YEARLY') AS tvp_abp_frequency,
            :p_osp_frequency              AS tvp_osp_frequency,
            :p_user                       AS user_id,
            :p_prog                       AS tvd_prog_nm,
            :p_db                         AS tvd_databs_nm
        FROM dual
    ) src
    ON ( tgt.tvp_plant_cd = src.tvp_plant_cd
        AND tgt.tvp_yearmon  = src.tvp_yearmon
        AND tgt.tvp_cat_id   = src.tvp_cat_id
    )
    WHEN MATCHED THEN
        UPDATE SET
            tgt.tvp_abp           = COALESCE(src.tvp_abp, tgt.tvp_abp),
            tgt.tvp_osp           = COALESCE(src.tvp_osp, tgt.tvp_osp),
            tgt.tvp_abp_frequency = COALESCE(src.tvp_abp_frequency, tgt.tvp_abp_frequency),
            tgt.tvp_osp_frequency = COALESCE(src.tvp_osp_frequency, tgt.tvp_osp_frequency),
            tgt.tvp_upd_by        = src.user_id,
            tgt.tvp_upd_on        = SYSDATE,
            tgt.tvd_prog_nm       = COALESCE(src.tvd_prog_nm, tgt.tvd_prog_nm),
            tgt.tvd_databs_nm     = COALESCE(src.tvd_databs_nm, tgt.tvd_databs_nm)
    WHEN NOT MATCHED THEN
    INSERT (
        tvp_plant_cd,
        tvp_yearmon,
        tvp_cat_id,
        tvp_abp,
        tvp_osp,
        tvp_abp_frequency,
        tvp_osp_frequency,
        tvp_crt_by,
        tvp_crt_on,
        tvd_prog_nm,
        tvd_databs_nm
    )
    VALUES (
        src.tvp_plant_cd,
        src.tvp_yearmon,
        src.tvp_cat_id,
        NVL(src.tvp_abp, 0),
        src.tvp_osp,
        NVL(src.tvp_abp_frequency, 'YEARLY'),
        src.tvp_osp_frequency,
        src.user_id,
        SYSDATE,
        src.tvd_prog_nm,
        src.tvd_databs_nm )`;
    let binds = {
      p_plant: plant,
      p_yearmon: yearmon,
      p_cat_id: catId,
      p_abp: abp,
      p_osp:osp,
      p_abp_frequency:abpFrequency,
      p_osp_frequency:ospFrequency,
      p_user:user,
      p_prog:'TTSC012',
      p_db:'TSMTUBPRDK',
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
}