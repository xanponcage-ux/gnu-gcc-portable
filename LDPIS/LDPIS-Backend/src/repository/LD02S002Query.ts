import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB048')
        and LOM_CD_EPA='0780'
        AND LOM_CD_QLTY_ACTL<>'SCRP'`;
    // let binds = {
    //   status: status,
    // };
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB048')
        and LOM_CD_EPA ='0780' 
        AND LOM_CD_QLTY_ACTL<>'SCRP' `;
    // let binds = {
    //     status: status,
    //     rmBatch: rmBatch
    // }

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
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

export const getPono = async (rmBatch: any, pipeno: any) => {
  try {
    let sql = ` select LOM_ID_ORDER_CUS from V_LDP_PRODN WHERE LOM_ID_PAR_COIL_NO = '${rmBatch}' `;

    if (pipeno !== "") {
      sql += ` AND LOM_ID_BATCH = '${pipeno}'`;
    }

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const insertTempData = async (data: any) => {
//   try {
//     const insertSql = ` INSERT INTO V_FLAT_RBT_DISTANCE(
//       FRD_PLANT_CD,
//       FRD_BATCH_NO,
//       FRD_BATCH_PROC_NO,
//       FRD_PAR_COIL_NO,
//       FRD_ID_FIRST_PAR,
//       FRD_ID_ORDER_NO,
//       FRD_ITEM_NO,
//       FRD_FLAT_0_1,
//       FRD_FLAT_0_1_RESULT,
//       FRD_FLAT_0_2,
//       FRD_FLAT_0_2_RESULT,
//       FRD_FLAT_0_3,
//       FRD_FLAT_0_3_RESULT,
//       FRD_FLAT_90_1,
//       FRD_FLAT_90_1_RESULT,
//       FRD_FLAT_90_2,
//       FRD_FLAT_90_2_RESULT,
//       FRD_FLAT_90_3,
//       FRD_FLAT_90_3_RESULT,
//       FRD_MANDR_DIA,
//       FRD_MANDR_DIA_RESULT,
//       FRD_FLAT_0_O_10,
//       FRD_FLAT_90_O_10,
//       FRD_RBT_10,
//       FRD_REMARK,
//       FRD_HEAT_NO,
//       FRD_INSP_NAME,
//       FRD_CREATE_DATE,
//       FRD_CREATE_USER,
//       FRD_PROD_DATE,
//       FRD_SHIFT,
//       FRD_START_DT,
//       FRD_END_DT
//       )
//         VALUES(
//           :FRD_PLANT_CD,
//           :FRD_BATCH_NO,
//           (SELECT
//           CASE
//             WHEN COUNT(*) = 0 THEN 1
//             ELSE MAX(FRD_BATCH_PROC_NO) + 1
//             END AS NEXT_BATCH_PROC_NO
//           FROM
//             V_FLAT_RBT_DISTANCE
//           WHERE
//             FRD_PLANT_CD = '0780'
//             AND FRD_BATCH_NO = :FRD_BATCH_NO_SUBQUERY),
//           :FRD_PAR_COIL_NO,
//           :FRD_ID_FIRST_PAR,
//           :FRD_ID_ORDER_NO,
//           :FRD_ITEM_NO,
//           :FRD_FLAT_0_1,
//           :FRD_FLAT_0_1_RESULT,
//           :FRD_FLAT_0_2,
//           :FRD_FLAT_0_2_RESULT,
//           :FRD_FLAT_0_3,
//           :FRD_FLAT_0_3_RESULT,
//           :FRD_FLAT_90_1,
//           :FRD_FLAT_90_1_RESULT,
//           :FRD_FLAT_90_2,
//           :FRD_FLAT_90_2_RESULT,
//           :FRD_FLAT_90_3,
//           :FRD_FLAT_90_3_RESULT,
//           :FRD_MANDR_DIA,
//           :FRD_MANDR_DIA_RESULT,
//           :FRD_FLAT_0_O_10,
//           :FRD_FLAT_90_O_10,
//           :FRD_RBT_10,
//           :FRD_REMARK,
//           :FRD_HEAT_NO,
//           :FRD_INSP_NAME,
//           sysdate,
//           user,
//           :PROD_DATE,
//           :SHIFT,
//           TO_DATE(:START_DT,'DD/MM/YYYY HH24:MI'),
//           TO_DATE(:END_DT,'DD/MM/YYYY HH24:MI')
//         ) `;

//     // Prepare binds for the INSERT statement
//     let insertBinds = {
//       FRD_PLANT_CD: data.PLANT,
//       FRD_BATCH_NO: data.BATCH_NO,
//       FRD_BATCH_NO_SUBQUERY: data.BATCH_NO, // Separate bind for the subquery's WHERE clause
//       FRD_PAR_COIL_NO: data.PAR_COIL_NO,
//       FRD_ID_FIRST_PAR: data.ID_FIRST_PAR,
//       FRD_ID_ORDER_NO: data.ID_ORDER_NO,
//       FRD_ITEM_NO: data.ITEM_NO,
//       FRD_FLAT_0_1: data.FRD_FLAT_0_1,
//       FRD_FLAT_0_1_RESULT: data.FRD_FLAT_0_1_RESULT,
//       FRD_FLAT_0_2: data.FRD_FLAT_0_2,
//       FRD_FLAT_0_2_RESULT: data.FRD_FLAT_0_2_RESULT,
//       FRD_FLAT_0_3: data.FRD_FLAT_0_3,
//       FRD_FLAT_0_3_RESULT: data.FRD_FLAT_0_3_RESULT,
//       FRD_FLAT_90_1: data.FRD_FLAT_90_1,
//       FRD_FLAT_90_1_RESULT: data.FRD_FLAT_90_1_RESULT,
//       FRD_FLAT_90_2: data.FRD_FLAT_90_2,
//       FRD_FLAT_90_2_RESULT: data.FRD_FLAT_90_2_RESULT,
//       FRD_FLAT_90_3: data.FRD_FLAT_90_3,
//       FRD_FLAT_90_3_RESULT: data.FRD_FLAT_90_3_RESULT,
//       FRD_MANDR_DIA: data.FRD_MANDR_DIA,
//       FRD_MANDR_DIA_RESULT: data.FRD_MANDR_DIA_RESULT,
//       FRD_FLAT_0_O_10: data.FRD_FLAT_0_O_10,
//       FRD_FLAT_90_O_10: data.FRD_FLAT_90_O_10,
//       FRD_RBT_10: data.FRD_RBT_10,
//       FRD_REMARK: data.REMARK,
//       FRD_HEAT_NO: data.HEAT_NO,
//       FRD_INSP_NAME: data.INSPECTOR,
//       PROD_DATE: data.PROD_DATE,
//       SHIFT: data.SHIFT,
//       START_DT: data.START_DT,
//       END_DT: data.END_DT,
//     };

//     console.log("Insert Binds:", insertBinds);

//     // Execute the INSERT statement
//     const insertResult: any = await query.executeQuery(insertSql, insertBinds);

//     if (insertResult?.rowsAffected > 0) {
//       console.log("Insert successful! Now performing update.");

//       // Prepare the UPDATE statement
//       const updateSql = `UPDATE V_BARE_PDO SET
//           TBP_FLATNG_0_O_10 = :FRD_FLAT_0_O_10,
//           TBP_FLATNG_90_O_10 = :FRD_FLAT_90_O_10,
//           TBP_RBT_10 = :FRD_RBT_10,
//           TBP_UPDATED_ON = SYSDATE,
//           TBP_UPDATED_BY = SUBSTR(user,1,6)
//       WHERE
//           TBP_PLANT_CD = :FRD_PLANT_CD AND
//           TBP_BATCH_NO = :FRD_BATCH_NO AND
//           TBP_CD_PROC = '1'`;

//       // Prepare binds for the UPDATE statement
//       let updateBinds = {
//         FRD_FLAT_0_O_10: data.FRD_FLAT_0_O_10,
//         FRD_FLAT_90_O_10: data.FRD_FLAT_90_O_10,
//         FRD_RBT_10: data.FRD_RBT_10,
//         FRD_PLANT_CD: data.PLANT,
//         FRD_BATCH_NO: data.BATCH_NO,
//       };

//       console.log("Update Binds:", updateBinds);

//       // Execute the UPDATE statement
//       const updateResult: any = await query.executeQuery(
//         updateSql,
//         updateBinds
//       );
//       console.log("Update Result:", updateResult);

//       return updateResult; // Return the result of the update query
//     } else {
//       console.log("Insert did not affect any rows. Skipping update.");
//       return { rowsAffected: 0 }; // Indicate no rows affected by update
//     }
//   } catch (error) {
//     console.error("Error in insertTempData:", error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const insertTempData = async (data: any) => {
  try {
    const mergeSql = `
      MERGE INTO V_FLAT_RBT_DISTANCE D
      USING (
          SELECT
              :FRD_PLANT_CD AS FRD_PLANT_CD_SRC,
              :FRD_BATCH_NO AS FRD_BATCH_NO_SRC,
              :FRD_PAR_COIL_NO AS FRD_PAR_COIL_NO_SRC,
              :FRD_ID_FIRST_PAR AS FRD_ID_FIRST_PAR_SRC,
              :FRD_ID_ORDER_NO AS FRD_ID_ORDER_NO_SRC,
              :FRD_ITEM_NO AS FRD_ITEM_NO_SRC,
              :FRD_FLAT_0_1 AS FRD_FLAT_0_1_SRC,
              :FRD_FLAT_0_1_RESULT AS FRD_FLAT_0_1_RESULT_SRC,
              :FRD_FLAT_0_2 AS FRD_FLAT_0_2_SRC,
              :FRD_FLAT_0_2_RESULT AS FRD_FLAT_0_2_RESULT_SRC,
              :FRD_FLAT_0_3 AS FRD_FLAT_0_3_SRC,
              :FRD_FLAT_0_3_RESULT AS FRD_FLAT_0_3_RESULT_SRC,
              :FRD_FLAT_90_1 AS FRD_FLAT_90_1_SRC,
              :FRD_FLAT_90_1_RESULT AS FRD_FLAT_90_1_RESULT_SRC,
              :FRD_FLAT_90_2 AS FRD_FLAT_90_2_SRC,
              :FRD_FLAT_90_2_RESULT AS FRD_FLAT_90_2_RESULT_SRC,
              :FRD_FLAT_90_3 AS FRD_FLAT_90_3_SRC,
              :FRD_FLAT_90_3_RESULT AS FRD_FLAT_90_3_RESULT_SRC,
              :FRD_MANDR_DIA AS FRD_MANDR_DIA_SRC,
              :FRD_MANDR_DIA_RESULT AS FRD_MANDR_DIA_RESULT_SRC,
              :FRD_FLAT_0_O_10 AS FRD_FLAT_0_O_10_SRC,
              :FRD_FLAT_90_O_10 AS FRD_FLAT_90_O_10_SRC,
              :FRD_RBT_10 AS FRD_RBT_10_SRC,
              :FRD_REMARK AS FRD_REMARK_SRC,
              :FRD_HEAT_NO AS FRD_HEAT_NO_SRC,
              :FRD_INSP_NAME AS FRD_INSP_NAME_SRC,
              :PROD_DATE AS PROD_DATE_SRC,
              :SHIFT AS SHIFT_SRC,
              :START_DT AS START_DT_SRC,
              :END_DT AS END_DT_SRC
          FROM DUAL
      ) S
      ON (D.FRD_PLANT_CD = S.FRD_PLANT_CD_SRC AND D.FRD_BATCH_NO = S.FRD_BATCH_NO_SRC)
      WHEN MATCHED THEN
        UPDATE SET
          D.FRD_BATCH_PROC_NO = 1, -- Set to 1 explicitly
          D.FRD_PAR_COIL_NO = S.FRD_PAR_COIL_NO_SRC,
          D.FRD_ID_FIRST_PAR = S.FRD_ID_FIRST_PAR_SRC,
          D.FRD_ID_ORDER_NO = S.FRD_ID_ORDER_NO_SRC,
          D.FRD_ITEM_NO = S.FRD_ITEM_NO_SRC,
          D.FRD_FLAT_0_1 = S.FRD_FLAT_0_1_SRC,
          D.FRD_FLAT_0_1_RESULT = S.FRD_FLAT_0_1_RESULT_SRC,
          D.FRD_FLAT_0_2 = S.FRD_FLAT_0_2_SRC,
          D.FRD_FLAT_0_2_RESULT = S.FRD_FLAT_0_2_RESULT_SRC,
          D.FRD_FLAT_0_3 = S.FRD_FLAT_0_3_SRC,
          D.FRD_FLAT_0_3_RESULT = S.FRD_FLAT_0_3_RESULT_SRC,
          D.FRD_FLAT_90_1 = S.FRD_FLAT_90_1_SRC,
          D.FRD_FLAT_90_1_RESULT = S.FRD_FLAT_90_1_RESULT_SRC,
          D.FRD_FLAT_90_2 = S.FRD_FLAT_90_2_SRC,
          D.FRD_FLAT_90_2_RESULT = S.FRD_FLAT_90_2_RESULT_SRC,
          D.FRD_FLAT_90_3 = S.FRD_FLAT_90_3_SRC,
          D.FRD_FLAT_90_3_RESULT = S.FRD_FLAT_90_3_RESULT_SRC,
          D.FRD_MANDR_DIA = S.FRD_MANDR_DIA_SRC,
          D.FRD_MANDR_DIA_RESULT = S.FRD_MANDR_DIA_RESULT_SRC,
          D.FRD_FLAT_0_O_10 = S.FRD_FLAT_0_O_10_SRC,
          D.FRD_FLAT_90_O_10 = S.FRD_FLAT_90_O_10_SRC,
          D.FRD_RBT_10 = S.FRD_RBT_10_SRC,
          D.FRD_REMARK = S.FRD_REMARK_SRC,
          D.FRD_HEAT_NO = S.FRD_HEAT_NO_SRC,
          D.FRD_UPDATED_ON = SYSDATE,
          D.FRD_UPDATED_BY = USER
      WHEN NOT MATCHED THEN
        INSERT (
            FRD_PLANT_CD, FRD_BATCH_NO, FRD_BATCH_PROC_NO, FRD_PAR_COIL_NO, FRD_ID_FIRST_PAR,
            FRD_ID_ORDER_NO, FRD_ITEM_NO, FRD_FLAT_0_1, FRD_FLAT_0_1_RESULT, FRD_FLAT_0_2,
            FRD_FLAT_0_2_RESULT, FRD_FLAT_0_3, FRD_FLAT_0_3_RESULT, FRD_FLAT_90_1, FRD_FLAT_90_1_RESULT,
            FRD_FLAT_90_2, FRD_FLAT_90_2_RESULT, FRD_FLAT_90_3, FRD_FLAT_90_3_RESULT, FRD_MANDR_DIA,
            FRD_MANDR_DIA_RESULT, FRD_FLAT_0_O_10, FRD_FLAT_90_O_10, FRD_RBT_10, FRD_REMARK,
            FRD_HEAT_NO, FRD_INSP_NAME, FRD_CREATE_DATE, FRD_CREATE_USER, FRD_PROD_DATE,
            FRD_SHIFT, FRD_START_DT, FRD_END_DT
        )
        VALUES (
            S.FRD_PLANT_CD_SRC,
            S.FRD_BATCH_NO_SRC,
            1, -- Set to 1 explicitly for new inserts
            S.FRD_PAR_COIL_NO_SRC, S.FRD_ID_FIRST_PAR_SRC, S.FRD_ID_ORDER_NO_SRC, S.FRD_ITEM_NO_SRC,
            S.FRD_FLAT_0_1_SRC, S.FRD_FLAT_0_1_RESULT_SRC, S.FRD_FLAT_0_2_SRC, S.FRD_FLAT_0_2_RESULT_SRC,
            S.FRD_FLAT_0_3_SRC, S.FRD_FLAT_0_3_RESULT_SRC, S.FRD_FLAT_90_1_SRC, S.FRD_FLAT_90_1_RESULT_SRC,
            S.FRD_FLAT_90_2_SRC, S.FRD_FLAT_90_2_RESULT_SRC, S.FRD_FLAT_90_3_SRC, S.FRD_FLAT_90_3_RESULT_SRC,
            S.FRD_MANDR_DIA_SRC, S.FRD_MANDR_DIA_RESULT_SRC, S.FRD_FLAT_0_O_10_SRC, S.FRD_FLAT_90_O_10_SRC,
            S.FRD_RBT_10_SRC, S.FRD_REMARK_SRC, S.FRD_HEAT_NO_SRC, S.FRD_INSP_NAME_SRC,
            SYSDATE, USER,
            S.PROD_DATE_SRC, S.SHIFT_SRC,
            TO_DATE(S.START_DT_SRC,'DD/MM/YYYY HH24:MI'),
            TO_DATE(S.END_DT_SRC,'DD/MM/YYYY HH24:MI')
        )
    `;

    // All binds for the MERGE statement
    let mergeBinds = {
      FRD_PLANT_CD: data.PLANT,
      FRD_BATCH_NO: data.BATCH_NO,
      FRD_PAR_COIL_NO: data.PAR_COIL_NO,
      FRD_ID_FIRST_PAR: data.ID_FIRST_PAR,
      FRD_ID_ORDER_NO: data.ID_ORDER_NO,
      FRD_ITEM_NO: data.ITEM_NO,
      FRD_FLAT_0_1: data.FRD_FLAT_0_1,
      FRD_FLAT_0_1_RESULT: data.FRD_FLAT_0_1_RESULT,
      FRD_FLAT_0_2: data.FRD_FLAT_0_2,
      FRD_FLAT_0_2_RESULT: data.FRD_FLAT_0_2_RESULT,
      FRD_FLAT_0_3: data.FRD_FLAT_0_3,
      FRD_FLAT_0_3_RESULT: data.FRD_FLAT_0_3_RESULT,
      FRD_FLAT_90_1: data.FRD_FLAT_90_1,
      FRD_FLAT_90_1_RESULT: data.FRD_FLAT_90_1_RESULT,
      FRD_FLAT_90_2: data.FRD_FLAT_90_2,
      FRD_FLAT_90_2_RESULT: data.FRD_FLAT_90_2_RESULT,
      FRD_FLAT_90_3: data.FRD_FLAT_90_3,
      FRD_FLAT_90_3_RESULT: data.FRD_FLAT_90_3_RESULT,
      FRD_MANDR_DIA: data.FRD_MANDR_DIA,
      FRD_MANDR_DIA_RESULT: data.FRD_MANDR_DIA_RESULT,
      FRD_FLAT_0_O_10: data.FRD_FLAT_0_O_10,
      FRD_FLAT_90_O_10: data.FRD_FLAT_90_O_10,
      FRD_RBT_10: data.FRD_RBT_10,
      FRD_REMARK: data.REMARK,
      FRD_HEAT_NO: data.HEAT_NO,
      FRD_INSP_NAME: data.INSPECTOR,
      PROD_DATE: data.PROD_DATE,
      SHIFT: data.SHIFT,
      START_DT: data.START_DT,
      END_DT: data.END_DT,
    };

    console.log("Merge Binds:", mergeBinds);

    // Execute the MERGE statement for V_FLAT_RBT_DISTANCE
    const mergeResult_V_FLAT: any = await query.executeQuery(
      mergeSql,
      mergeBinds
    );

    if (mergeResult_V_FLAT?.rowsAffected > 0) {
      console.log(
        "V_FLAT_RBT_DISTANCE operation successful! Now performing V_BARE_PDO update."
      );

      // Prepare the UPDATE statement for V_BARE_PDO
      const updateSql_V_BARE = `UPDATE V_BARE_PDO SET
          TBP_FLATNG_0_O_10 = :FRD_FLAT_0_O_10,
          TBP_FLATNG_90_O_10 = :FRD_FLAT_90_O_10,
          TBP_RBT_10 = :FRD_RBT_10,
          TBP_UPDATED_ON = SYSDATE,
          TBP_UPDATED_BY = SUBSTR(user,1,6)
      WHERE
          TBP_PLANT_CD = :FRD_PLANT_CD AND
          TBP_BATCH_NO = :FRD_BATCH_NO AND
          TBP_CD_PROC = '1'`;

      // Prepare binds for the V_BARE_PDO UPDATE statement
      let updateBinds_V_BARE = {
        FRD_FLAT_0_O_10: data.FRD_FLAT_0_O_10,
        FRD_FLAT_90_O_10: data.FRD_FLAT_90_O_10,
        FRD_RBT_10: data.FRD_RBT_10,
        FRD_PLANT_CD: data.PLANT,
        FRD_BATCH_NO: data.BATCH_NO,
      };

      console.log("Update V_BARE_PDO Binds:", updateBinds_V_BARE);

      // Execute the UPDATE statement for V_BARE_PDO
      const updateResult_V_BARE: any = await query.executeQuery(
        updateSql_V_BARE,
        updateBinds_V_BARE
      );
      console.log("Update V_BARE_PDO Result:", updateResult_V_BARE);

      return updateResult_V_BARE; // Return the result of the V_BARE_PDO update query
    } else {
      console.log(
        "V_FLAT_RBT_DISTANCE operation did not affect any rows. Skipping V_BARE_PDO update."
      );
      return { rowsAffected: 0 }; // Indicate no rows affected by V_BARE_PDO update
    }
  } catch (error) {
    console.error("Error in insertTempData:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const callproc20 = async (data: any) => {
  try {
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
    const result = await query.executeQuery(sql, binds);
    resData.push(result?.outBinds?.LS_OUT_FLAG);
    return resData;
  } catch (error) {
    console.log("procedure error: ", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const deleteTempData = async (data: any) => {
  try {
    let sql = ` Delete V_BARE_PDO_TEMP 
                    where tbp_batch_no= :Batchno 
                    and  tbp_cd_proc= :curproc
                    and tbp_plant_cd= :plant `;
    let binds = {
      Batchno: data.BATCH_NO ? data.BATCH_NO : "",
      curproc: data.CD_PROC ? data.CD_PROC : "",
      plant: data.PLANT ? data.PLANT : "",
    };

    let delRes = await query.executeQuery(sql, binds);
    return delRes;
  } catch (error) {
    console.log("delete error: ", error);
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
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getFillData = async (rmBatch: any, pipeno: any, status: any) => {
  try {
    console.log("==> ", rmBatch, pipeno, status);
    // let sql = `SELECT TBP_BATCH_NO, TBP_PIPE_OD_10, TBP_PIPE_THK_10, TBP_PIPE_LNG_10,
    //    TBP_NO_MATNR, TBP_ID_ORDER_NO ORDER_NO, TBP_ITEM_NO ITEM, ENC_CUST_NAME CUST_NAME, LOM_PLANNED_PROC PLAN_PROC,
    //    (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC
    //       FROM V_BARE_PDO, V_END_CUST_ORD_EPA, V_LDP_PRODN
    //      WHERE TBP_ID_ORDER_NO = ENC_ID_ORDER
    //        AND TBP_ITEM_NO = ENC_NO_ITEM
    //        AND TBP_BATCH_NO = LOM_ID_BATCH
    //        AND TBP_PLANT_CD = LOM_CD_EPA
    //        AND LOM_CD_EPA = ENC_CD_EPA
    //        AND LOM_ID_ORDER_CUS = ENC_ID_ORDER
    //        AND LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM
    //        AND TBP_PAR_COIL_NO = '${rmBatch}' `;

    let sql = `select lom_id_batch TBP_BATCH_NO, lom_sec2 TBP_PIPE_OD_10, lom_sec1 TBP_PIPE_THK_10, lom_length TBP_PIPE_LNG_10, lom_no_matnr TBP_NO_MATNR,
    enc_id_order ORDER_NO, enc_no_item ITEM, enc_cust_name CUST_NAME, lom_planned_proc PLAN_PROC,LOM_ID_PAR_COIL_NO,
    LOM_ID_FIRST_PAR,LOM_NO_CAST HEAT_NO,
     (select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC, '2') as nxtproc from dual) NEXT_PROC,
     FRD_FLAT_0_1,FRD_FLAT_0_1_RESULT,FRD_FLAT_0_2,FRD_FLAT_0_2_RESULT,FRD_FLAT_0_3,
     FRD_FLAT_0_3_RESULT,FRD_FLAT_90_1,FRD_FLAT_90_1_RESULT,FRD_FLAT_90_2,
     FRD_FLAT_90_2_RESULT,FRD_FLAT_90_3,FRD_FLAT_90_3_RESULT,FRD_MANDR_DIA,
     FRD_MANDR_DIA_RESULT,FRD_INSP_NAME,TO_CHAR(FRD_PROD_DATE, 'DD-MM-YYYY') FRD_PROD_DATE,FRD_SHIFT,TO_CHAR(FRD_START_DT, 'DD-MM-YYYY HH24:MI') FRD_START_DT,
     TO_CHAR(FRD_END_DT, 'DD-MM-YYYY HH24:MI') FRD_END_DT,FRD_FLAT_0_O_10,FRD_FLAT_90_O_10,FRD_RBT_10     
     from v_ldp_prodn, v_end_cust_ord_epa,V_FLAT_RBT_DISTANCE
     where lom_id_order_cus = enc_id_order(+)
     and lom_id_ord_item_cus = enc_no_item(+)
     AND LOM_CD_EPA=FRD_PLANT_CD(+)
     AND LOM_ID_BATCH=FRD_BATCH_NO(+)
     and lom_cd_status in (select CD_VALUE FROM V_CODES WHERE CD_TYPE='TB048')`;

    // let sql = `SELECT TBP_BATCH_NO,TBP_PIPE_OD_10,TBP_PIPE_THK_10,TBP_PIPE_LNG_10,TBP_NO_MATNR from v_bare_pdo
    //            where TBP_PAR_COIL_NO = '${rmBatch}'`;

    if (pipeno != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`;
      sql += `and lom_id_batch = '${pipeno}'`;
    }
    if (rmBatch != "") {
      // sql += ` AND TBP_BATCH_NO = '${pipeno}' AND  TBP_CD_PROC = '1'`;
      sql += `and lom_id_par_coil_no = '${rmBatch}'`;
    }
    // else {
    //   sql += ` AND TBP_BATCH_NO IN (select t.lom_id_batch from v_ldp_prodn t where t.lom_cd_status='${status}'
    //                  AND t.lom_id_par_coil_no = '${rmBatch}') AND TBP_CD_PROC = '1'`;
    // }
    console.log("sql: ", sql);

    let results = await query.executeQuery(sql);
    console.log("results: ", results);
    return results;
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

export const getOrderDetails = async (pipeno: any) => {
  try {
    let sql = ` SELECT LOM_ID_ORDER_CUS,LOM_ID_ORD_ITEM_CUS,ENC_CUST_NAME FROM v_ldp_prodn,V_END_CUST_ORD_EPA
                    WHERE LOM_ID_ORDER_CUS = ENC_ID_ORDER and LOM_ID_ORD_ITEM_CUS = ENC_NO_ITEM 
                    
                    and LOM_ID_BATCH = '${pipeno}' `;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
