import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const displayRouteMapping = async (plant: any) => {
  try {
    var sql = `SELECT * FROM  V_FG_ROUTE_MAPPING where FRM_CD_EPA = :plant`;
    let binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateRouteData = async (adid: any, dt: any) => {
  try {
    let sql = `UPDATE 
        V_FG_ROUTE_MAPPING
    SET
        FRM_ROUTE = :FRM_ROUTE,
        FRM_PROG_ID='LDSC009',
        FRM_UPD_BY = SUBSTR(:FRM_UPD_BY,1,10),
        FRM_UPD_ON = SYSDATE
        WHERE FRM_CD_EPA = :FRM_CD_EPA
        AND FRM_FG_MAT = :FRM_FG_MAT`;

    let binds = {
      FRM_ROUTE: dt.FRM_ROUTE,
      FRM_CD_EPA: dt.FRM_CD_EPA,
      FRM_FG_MAT: dt.FRM_FG_MAT,
      FRM_UPD_BY: adid ? adid : 0,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteRouteData = async (adid: any, dt: any) => {
  try {
    var sql = `DELETE FROM
                    V_FG_ROUTE_MAPPING
                    WHERE
                    FRM_CD_EPA = :FRM_CD_EPA
                    AND FRM_FG_MAT =:FRM_FG_MAT 
                    AND FRM_ROUTE =:FRM_ROUTE 
                    AND FRM_STATUS =:FRM_STATUS 
                    AND FRM_PROG_ID = :FRM_PROG_ID
                    AND FRM_FG_MAT_DESC= :FRM_FG_MAT_DESC`;

    let binds = {
      FRM_CD_EPA: dt.FRM_CD_EPA,
      FRM_FG_MAT: dt.FRM_FG_MAT,
      FRM_ROUTE: dt.FRM_ROUTE,
      FRM_STATUS: dt.FRM_STATUS,
      FRM_PROG_ID: dt.FRM_PROG_ID,
      FRM_FG_MAT_DESC: dt.FRM_FG_MAT_DESC,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const dataExistsCheck = async (dt: any) => {
  try {
    let sql: any = `select count(*) as Total from V_FG_ROUTE_MAPPING 
                      where FRM_CD_EPA = :FRM_CD_EPA
                      AND FRM_FG_MAT =:FRM_FG_MAT
                      AND FRM_ROUTE =:FRM_ROUTE`;
    let binds = {
      FRM_CD_EPA: dt[0].FRM_CD_EPA, //.replace(/\"/g, "'"),
      FRM_FG_MAT: dt[0].FRM_FG_MAT, //.replace(/\"/g, "'"),
      FRM_ROUTE: dt[0].FRM_ROUTE, //.replace(/\"/g, "'"),
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertData = async (adid: any, dt: any) => {
  try {
    let sql: any = `Insert into V_FG_ROUTE_MAPPING
                    (FRM_CD_EPA,FRM_FG_MAT,FRM_ROUTE,FRM_STATUS, FRM_CRT_BY, FRM_CRT_DT, FRM_UPD_BY, FRM_UPD_ON, FRM_PROG_ID, FRM_FG_MAT_DESC)
                    Values
                    (
                     :FRM_CD_EPA
                    , :FRM_FG_MAT
                    , :FRM_ROUTE
                    ,  NULL
                    , SUBSTR(:P_USER,1,10)
                    , SYSDATE
                    , NULL
                    , NULL
                    , NULL
                    , :FRM_FG_MAT_DESC
                    )`;

    const binds = {
      FRM_CD_EPA: dt[0].FRM_CD_EPA,
      FRM_FG_MAT: dt[0].FRM_FG_MAT,
      FRM_ROUTE: dt[0].FRM_ROUTE,
      P_USER: adid,
      FRM_FG_MAT_DESC: dt[0].FRM_FG_MAT_DESC,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const maintainProcedure = async (adid: any, dt: any) => {
  try {
    let sql: any = `call LDPDBA.TTSB011 (
            P_CD_EPA => :P_CD_EPA,
            P_FG_MAT => :P_FG_MAT,
            P_FG_ROUTE => :P_FG_ROUTE,
            P_FG_STATUS => :P_FG_STATUS,
            P_FRM_PROG_ID => :P_FRM_PROG_ID,
            P_FRM_FG_MAT_DESC => :P_FRM_FG_MAT_DESC,
            P_USER => :P_USER,
            LS_OUT_FLAG => :LS_OUT_FLAG       
            )`;

    const binds = {
      P_CD_EPA: dt.FRM_CD_EPA,
      P_FG_MAT: dt.FRM_FG_MAT ? dt.FRM_FG_MAT : null,
      P_FG_ROUTE: dt.FRM_ROUTE ? dt.FRM_ROUTE : null,
      P_FG_STATUS: dt.FRM_STATUS ? dt.FRM_STATUS : null,
      P_FRM_PROG_ID: dt.FRM_PROG_ID ? dt.FRM_PROG_ID : "LDSC009",
      P_FRM_FG_MAT_DESC: dt.FRM_FG_MAT_DESC ? dt.FRM_FG_MAT_DESC : null,
      P_USER: adid,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const previewUpdatedRouteData = async (
  adid: any,
  dt: any,
  plant: any
) => {
  try {
    let sql = `call TTSB011 (
            P_CD_EPA => :FRM_CD_EPA
            P_FG_MAT=> :FRM_FG_MAT
            P_FG_ROUTE=> :FRM_ROUTE
            P_USER=> : P_USER
            P_FRM_FG_MAT_DESC=> :FRM_FG_MAT_DESC
            )`;

    let binds = {
      FRM_CD_EPA: dt.FRM_CD_EPA ? dt.FRM_CD_EPA : null,
      FRM_FG_MAT: dt.FRM_FG_MAT ? dt.FRM_FG_MAT : null,
      FRM_ROUTE: dt.FRM_ROUTE ? dt.FRM_FG_MAT : null,
      FRM_FG_MAT_DESC: dt.FRM_FG_MAT_DESC ? dt.FRM_FG_MAT_DESC : null,
      P_USER: adid ? adid : null,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
