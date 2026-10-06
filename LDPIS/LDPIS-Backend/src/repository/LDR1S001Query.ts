import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= :status
        and LOM_CD_EPA='0780'`;
    let binds = {
      status: status,
    };
    console.log("rmlist", sql);
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    console.log("pipeno", sql);
    // console.log("bindspipe",binds)
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMatNo = async (rmBatch: any, pipeno: any) => {
  try {
    let sql = `select LOM_NO_MATNR from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;
    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeInfo = async (req: any) => {
  try {
    console.log("rmBatch: ", req.RM_BATCH);
    // Step 3: Construct the main SQL query
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO,LOM_MS_PIECE_ACTL, LOM_SEC1, LOM_SEC2,LOM_LENGTH,LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS
                    FROM V_LDP_PRODN 
                    WHERE LOM_ID_BATCH = :rmBatch
                    AND LOM_CD_EPA ='0780'`;

    let binds = {
      rmBatch: req.RM_BATCH,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPono = async (rmBatch: any, pipeno: any) => {
  try {
    //console.log("rmBatch: ", rmBatch);

    let sql = ` select LOM_ID_ORDER_CUS from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;

    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }

    console.log("pipe", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertTempData = async (data: any) => {
  try {
    //console.log("insertdata20",data)
    const sql = ` INSERT INTO V_BARE_PDO_TEMP(
        TBP_PLANT_CD,
        TBP_BATCH_NO,
        TBP_CD_PROC,
        TBP_BATCH_PROC_NO,
        TBP_NEXT_PROC,
        TBP_PROD_DATE,
        TBP_SHIFT,
        TBP_WEIGHT,
        TBP_CD_STATUS,
        TBP_PAR_COIL_NO,
        TBP_ID_FIRST_PAR,
        TBP_ID_ORDER_NO,
        TBP_ITEM_NO,
        TBP_QUALITY_CD,
        TBP_NO_MATNR,
        TBP_CD_FLAG,
        TBP_PROD_START_DT,
        TBP_PROD_END_DT,
        TBP_RESULT,
        TBP_REMARK,
        TBP_HEAT_NO,
        TBP_INSP_NAME,
        TBP_PIPE_OD_10,
        TBP_PIPE_THK_10,
        TBP_PIPE_LNG_10)
        VALUES(:PLANT,:BATCH_NO,:CD_PROC,:BATCH_PROC_NO,:NEXT_PROC,:PROD_DATE,:SHIFT,
               :WEIGHT,:STATUS,:PAR_COIL_NO,:ID_FIRST_PAR,:ID_ORDER_NO,:ITEM_NO,
               :QUALITY_CD,:MATNR,:FLAG,:START_DT,:END_DT,:RESULT,:REMARK,:HEAT_NO,:INSP_NAME,
               :PIPE_OD_10,:PIPE_THK_10,:PIPE_LNG_10) `;
    let binds = {
      PLANT: data.PLANT,
      BATCH_NO: data.BATCH_NO,
      CD_PROC: data.CD_PROC,
      BATCH_PROC_NO: data.BATCH_PROC_NO,
      NEXT_PROC: data.NEXT_PROC,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      WEIGHT: data.WEIGHT,
      STATUS: data.STATUS,
      PAR_COIL_NO: data.PAR_COIL_NO,
      ID_FIRST_PAR: data.ID_FIRST_PAR,
      ID_ORDER_NO: data.ID_ORDER_NO,
      ITEM_NO: data.ITEM_NO,
      QUALITY_CD: data.QUALITY_CD,
      MATNR: data.MATNR,
      FLAG: data.FLAG,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
      RESULT: data.RESULT,
      REMARK: data.REMARK,
      HEAT_NO: data.HEAT_NO,
      INSP_NAME: data.INSP_NAME,
      PIPE_OD_10: data.PIPE_OD_10,
      PIPE_THK_10: data.PIPE_THK_10,
      PIPE_LNG_10: data.PIPE_LNG_10,
      ANGLE: data.ANGLE,
    };
    console.log("20insert", sql);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("insertquery", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertPipeDetails = async (newReworkData: any, parting: any) => {
  try {
    const sql = `call LDRB002(
        P_PLANT_CD => :P_PLANT_CD,
        P_MOTHER_PIPE => :P_MOTHER_PIPE,
        P_PART_COUNT => :P_PART_COUNT,
        P_PARTING_FLAG => :P_PARTING_FLAG,
        LS_OUT_FLAG => :LS_OUT_FLAG
        )`;

    let binds = {};
    binds = {
      P_PLANT_CD: "0780",
      P_MOTHER_PIPE: newReworkData?.[0]?.RM_BATCH,
      P_PART_COUNT: newReworkData?.[0]?.PARTNO,
      P_PARTING_FLAG: parting,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds, "binds");

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callprocR1 = async (data: any) => {
  try {
    //console.log("20querydata",data)
    let resData = [];
    const sql = `call LDPDBA.LD02B001(
                    LS_BATCH_NO => :LS_BATCH_NO,
                    LS_CD_PROC => :LS_CD_PROC,
                    LS_PLANT_CD => :LS_PLANT_CD,
                    ls_out_flag => :LS_OUT_FLAG
                    )`;

    let binds = {
      LS_BATCH_NO: data.BATCH_NO ? data.BATCH_NO : "",
      LS_CD_PROC: data.CD_PROC ? data.CD_PROC : "",
      LS_PLANT_CD: data.PLANT ? data.PLANT : "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    //console.log("binds",binds)
    //console.log("query",sql)
    const result = await query.executeQuery(sql, binds);
    console.log("proflag", result);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    //console.log("resData: ", resData);
    return resData;
  } catch (error) {
    console.log("procedure error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    console.log("deletedata", data);
    let sql = ` Delete V_BARE_PDO_TEMP 
                    where tbp_batch_no= :Batchno 
                    and  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.BATCH_NO ? data.BATCH_NO : "",
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delete error", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getorderwiseProdData = async (RM_BATCH: any) => {
  try {
    let sql = `select EWI_ID_ORDER_CUS,EWI_ID_ORD_ITEM_CUS,EOM_MS_PIECE_ACTL,EWI_MS_PIECE_ACTL,EWI_SEC1,EWI_SEC2,0 EWI_LENGTH,0 TUBE_COUNT
        from V_WORK_INST,V_LDP_PRODN
        WHERE  LOM_CD_EPA=ewi_cd_epa and LOM_ID_BATCH=ewi_id_batch AND LOM_ID_PAR_COIL_NO=:RM_BATCH`;
    let binds = {
      RM_BATCH: RM_BATCH,
    };

    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, status: any, pipeid: any) => {
  try {
    console.log("rmBatch: ", rmBatch);
    console.log("status: ", status);
    // Step 1: First, get the CD_VALUE from V_CODES
    const cdValueQuery = `SELECT CD_VALUE FROM V_CODES WHERE CD_TYPE = 'LDP110'`;
    const cdValueResults = await query.executeQuery(cdValueQuery);
    console.log(cdValueResults);
    // Step 2: Construct a list of columns based on CD_VALUE
    const cdValues = cdValueResults.rows.map((row: any) => row[0]); // Adjust property if necessary
    const additionalColumns = cdValues.join(", "); // Join the values into a string

    // Step 3: Construct the main SQL query
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO, LOM_SEC1, LOM_SEC2, 
                    LOM_LENGTH,LOM_ID_ORD_ITEM_CUS,LOM_ID_ORDER_CUS,TBP_REMARK ${additionalColumns} 
                    FROM V_LDP_PRODN , V_BARE_PDO
                    WHERE LOM_ID_BATCH = TBP_BATCH_NO
                    AND LOM_CD_STATUS = '${status}'
                    AND LOM_CD_EPA ='0780'`;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    if (pipeid !== "") {
      sql += ` AND LOM_ID_Batch = '${pipeid}'`;
    }
    console.log("pipeno", sql);
    // console.log("bindspipe",binds)
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getTataDate = async (prodEndDt: any) => {
  try {
    const sql = `select substr(F_Tatadate(
              TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),1,1)
               shift,substr(F_Tatadate(TO_DATE(:prodEndDt,'YYYY-MM-DD HH24:MI')),2) prod_dt from dual`;
    const binds = {
      prodEndDt: prodEndDt,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
