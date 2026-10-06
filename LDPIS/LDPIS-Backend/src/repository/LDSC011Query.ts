import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getOrderData = async (plant: any, OrdGrd: any) => {
  try {
    var sql = `select OPD_CD_EPA,OPD_CD_PATH,OPD_ORD_GRD,OPD_SUR_COND,
                      OPD_TUB_GEO,OPD_END_FINISH,OPD_CRT_BY,
                      NVL(TO_CHAR(OPD_CRT_DT, 'DD-MON-YYYY HH24:MI:SS') , ' ') OPD_CRT_DT,
                      OPD_UPD_BY,
                      NVL(TO_CHAR(OPD_UPD_ON, 'DD-MON-YYYY HH24:MI:SS') , ' ') OPD_UPD_ON,
                      OPD_PROG_ID,
                      OPD_SEC_CD,
                      OPR_SEC_DESC
                      from V_ord_path_dtls 
                      WHERE OPD_CD_EPA = '${plant}' `;

    if (OrdGrd && OrdGrd !== "") {
      sql += ` AND OPD_ORD_GRD = '${OrdGrd}'`;
    }
    console.log("Order", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log("ordererror", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateOrderData = async (data: any, adid: any) => {
  try {
    console.log("data1: ", data);
    var sql = ` Update V_ord_path_dtls  
                        SET OPD_CD_PATH = :PATH,
                        OPD_UPD_BY = :ADID, 
                        OPD_UPD_ON = SYSDATE
                        where opd_cd_epa = :PLANT
                        and OPD_ORD_GRD = :GRD 
                        and opd_sur_cond = :SUR_COND
                        and opd_tub_geo  = :TUB_GEO
                        and opd_end_finish = :END_FINISH
                        and OPD_SEC_CD = :SEC_CD `;
    const binds = {
      PLANT: data?.OPD_CD_EPA,
      PATH: data?.OPD_CD_PATH,
      GRD: data?.OPD_ORD_GRD,
      SUR_COND: data?.OPD_SUR_COND,
      TUB_GEO: data?.OPD_TUB_GEO,
      END_FINISH: data?.OPD_END_FINISH,
      ADID: adid,
      SEC_CD: data?.OPD_SEC_CD,
    };
    console.log("sql1: ", sql);
    console.log("binds: ", binds);
    let result = await query.executeQuery(sql, binds);
    console.log("resultQry: ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const updateOrderData = async (data: any, adid: any) => {
//     try {
//       console.log("data1: ", data);
//       var sql = ` UPDATE V_ord_path_dtls
//       SET OPD_SUR_COND =:SUR_COND,
//           opd_tub_geo = :TUB_GEO,
//           OPD_END_FINISH = :END_FINISH,
//           OPD_UPD_BY = :ADID,
//           OPD_UPD_ON = SYSDATE,
//           OPD_PROG_ID = :PROG_ID
//       WHERE OPD_CD_PATH = :PATH
//          AND OPD_ORD_GRD = :GRD`;
//       const binds = {
//         //PLANT: data?.OPD_CD_EPA,
//         PATH: data?.OPD_CD_PATH,
//         GRD: data?.OPD_ORD_GRD,
//         SUR_COND: data?.OPD_SUR_COND,
//         TUB_GEO: data?.OPD_TUB_GEO,
//         END_FINISH: data?.OPD_END_FINISH,
//         ADID: adid,
//         PROG_ID: data?.OPD_PROG_ID
//       };
//       console.log("sql1: ", sql);
//       console.log("binds: ", binds);
//       let result = await query.executeQuery(sql, binds);
//       console.log("resultQry: ", result);
//       return result;
//     } catch (error) {
//       console.log(error);
//       throw new Error.InternalServerErrorMsg(error);
//     }
//   };

export const InsertOrderData = async (data: any, adid: any) => {
  try {
    console.log("data", data);

    const sql = ` INSERT INTO V_ord_path_dtls(
                           OPD_CD_EPA,
                           opd_cd_path,
                           opd_ord_grd,
                           opd_sur_cond,
                           opd_tub_geo,
                           opd_end_finish,
                           opd_crt_by,
                           opd_crt_dt,
                           opd_prog_id,
                           OPD_SEC_CD,
                           OPR_SEC_DESC)
                    VALUES (:plant,:path,:grd,:surcon,:tubgeo,:endfinish,:crt_by,SYSDATE,:prog_id,:sec_cd,:sec_desc) `;
    const binds = {
      plant: data?.OPD_CD_EPA,
      path: data?.OPD_CD_PATH,
      grd: data?.OPD_ORD_GRD,
      surcon: data?.OPD_SUR_COND,
      tubgeo: data?.OPD_TUB_GEO,
      endfinish: data?.OPD_END_FINISH,
      crt_by: adid,
      prog_id: data?.OPD_PROG_ID,
      sec_cd: data?.OPD_SEC_CD,
      sec_desc: data?.OPR_SEC_DESC,
    };
    console.log(sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const DeleteOrderData = async (data: any, adid: any) => {
  try {
    console.log("data", data);

    const sql = ` DELETE FROM V_ORD_PATH_DTLS 
                   where opd_cd_epa = :plant
                        and OPD_ORD_GRD = :grd 
                        and opd_sur_cond = :surcon
                        and opd_tub_geo  = :tubgeo
                        and opd_end_finish = :endfinish 
                    `;

    const binds = {
      plant: data?.OPD_CD_EPA,
      grd: data?.OPD_ORD_GRD,
      surcon: data?.OPD_SUR_COND,
      tubgeo: data?.OPD_TUB_GEO,
      endfinish: data?.OPD_END_FINISH,
    };
    console.log(sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCdValue = async () => {
  try {
    const sql = `select CD_VALUE,CD_DESC from v_codes where cd_type = 'TB043'`;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPathVal = async () => {
  try {
    const sql = `select DISTINCT LPP_NO_PROC_PATH from v_ldp_proc_path `;

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
