import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";
import { ResponceData } from "../utils";

export const getOrderid = async (data: any) => {
  try {
    // let sql = `select  LOM_ID_BATCH from V_LDP_PRODN
    // WHERE LOM_CD_EPA='0780' and LOM_SAMPL_TAG_EC='${data?.FLAG}'
    // --AND LOM_CD_STATUS IN (SELECT DISTINCT CD_VALUE FROM V_CODES WHERE
    //    --CD_TYPE='TB051'
    //   --AND CD_DESC='EDITABLE')
    //   `
    // ;

    let sql = `SELECT
        DISTINCT
        P.LOM_ID_BATCH,
        Z.PSNO
           FROM V_LDP_PRODN P , V_ZCOAT_LAB Z
            WHERE P.LOM_ID_BATCH = Z.CHARG(+)
                 AND P.LOM_CD_EPA  = Z.ZCL_PLANT_CD(+)
           AND P.LOM_CD_EPA = '0780'
             -- AND P.LOM_SAMPL_TAG_EC = 'Y'
             AND P.LOM_SAMPL_TAG_EC = '${data?.FLAG}'
      `;
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getItemNo = async (data: any) => {
  try {
    let sql = `select enc_no_item from 
      v_end_cust_ord_epa where enc_id_order = '${data?.orderId}'`;

    console.log("sql:: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getdateandshift = async (data: any) => {
  try {
    const CHARG = data?.BATCH_ID;

    let sql = `SELECT DISTINCT TBP_PROD_DATE PROD_DATE, TO_CHAR(TBP_PROD_DATE, 'DD-MON-YYYY') DATE_FR,TBP_SHIFT SHIFT FROM V_BARE_PDO
WHERE TBP_BATCH_NO = '${CHARG}' AND TBP_CD_PROC = 'D'`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailLD = async (data: any) => {
  try {
    let sql = `SELECT *  
    FROM V_ZCOAT_LAB WHERE
    CHARG = '${data?.orderId}'`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailID = async (data: any) => {
  try {
    let sql = `SELECT *  
    FROM V_ZCOAT_LAB WHERE
    CHARG = '${data?.orderId}'`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getcountcheck = async (data: any) => {
  try {
    // let sql = `SELECT *
    // FROM V_ZCOAT_LAB
    // WHERE CHARG = '${data?.orderId}'
    // AND MANDT = '600'
    // AND PSNO = '${data?.PSNO}'
    // AND ZCL_PLANT_CD = '0780' `;

    let sql = ` select  COUNT(*) CNT
      from V_LDP_PRODN,v_zcoat_lab
      WHERE LOM_CD_EPA='0780' 
      and LOM_SAMPL_TAG_EC = 'Y'
      --AND LOM_CD_STATUS IN (SELECT DISTINCT CD_VALUE FROM V_CODES WHERE
      --CD_TYPE='TB051'
      --AND CD_DESC='EDITABLE')
      and  LOM_ID_BATCH = CHARG
      AND ZCL_PI_STATUS = 'Y'
      AND ZCL_PLANT_CD = LOM_CD_EPA
      AND PSNO = '${data?.PSNO}' 
      AND MANDT = '600'
      AND CHARG = '${data?.orderId}'
      AND PRD_DATE_120 = '${data?.selecteddate}'
      `;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const insertTempData = async (data: any) => {
//   try {
//     // console.log('data---------------->',data);
//     const CHARG = data?.BATCH_ID?.value;
//     const PSNO = data?.selectedRowsData?.PSNO;
//     const primaryKeys = {
//       MANDT: "600",
//       PSNO:PSNO,
//       CHARG: CHARG,
//     };

//     const checkStatus = `
//     select COUNT(*) AS COUNT FROM V_CODES WHERE
//       CD_VALUE IN (SELECT LOM_CD_STATUS FROM V_LDP_PRODN WHERE LOM_ID_BATCH='${CHARG}')
//       AND CD_TYPE='TB051'
//       AND CD_DESC='EDITABLE'`;
//     console.log(checkStatus);
//     const resultCheck = await ResponceData(
//       await query.executeQuery(checkStatus)
//     );
//     console.log(resultCheck, "12345--12345 ",resultCheck?.[0]?.COUNT);
//     // if (resultCheck?.[0]?.COUNT === 0) {
//     if (resultCheck?.[0]?.COUNT < 0 ) {
//       return { msg: "Cannot edit in Current status", statusText: "OK" };
//     }
//     // Prepare columns and values for INSERT and UPDATE
//     const columns = Object.keys(data.selectedRowsData).join(", ");
//     const values = Object.keys(data.selectedRowsData)
//       .map((columnName) => `'${data.selectedRowsData[columnName]}'`)
//       .join(", ");
//     const updateColumns = Object.keys(data.selectedRowsData)
//       .map(
//         (columnName) => `${columnName} = '${data.selectedRowsData[columnName]}'`
//       )
//       .join(", ");

//     // Check if the row already exists using the primary keys
//     const checkExistsSql = `
//       SELECT COUNT(*) AS count
//       FROM V_ZCOAT_LAB
//       WHERE MANDT = '${primaryKeys.MANDT}'
//         AND PSNO = '${primaryKeys.PSNO}'
//         AND CHARG = '${primaryKeys.CHARG}'
//     `;
//     console.log(checkExistsSql);
//     const result = await ResponceData(await query.executeQuery(checkExistsSql));
//     console.log(result);
//     if (result[0]?.COUNT > 0) {
//       // Row exists, perform UPDATE
//       const updateSql = `
//         UPDATE V_ZCOAT_LAB
//         SET ${updateColumns}
//         WHERE MANDT = '${primaryKeys.MANDT}'
//           AND PSNO = '${primaryKeys.PSNO}'
//           AND CHARG = '${primaryKeys.CHARG}'
//       `;
//       console.log("Generated UPDATE SQL:", updateSql);
//       return await query.executeQuery(updateSql);
//     } else {
//       // Row doesn't exist, perform INSERT
//       const insertSql = `
//         INSERT INTO V_ZCOAT_LAB(MANDT, PSNO, CHARG,PRD_DATE_120,PRD_SHIFT_120, ${columns})
//         VALUES('${primaryKeys.MANDT}', '${primaryKeys.PSNO}', '${primaryKeys.CHARG}','${data?.DATE_IN}','${data?.SHIFT}', ${values})
//       `;
//       console.log("Generated INSERT SQL:", insertSql);
//       return await query.executeQuery(insertSql);
//     }
//   } catch (error) {
//     console.error("Error in insertOrUpdateTempData:", error);
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

// ... (rest of your imports)

export const insertTempData = async (data: any) => {
  try {
    const CHARG = data?.BATCH_ID?.value;
    const PSNO = data?.selectedRowsData?.PSNO;
    const primaryKeys = {
      MANDT: "600",
      PSNO: PSNO,
      CHARG: CHARG,
      PLANT: "0780",
    };

    const checkStatus = `
    SELECT COUNT(*) AS COUNT FROM V_CODES WHERE
      CD_VALUE IN (SELECT LOM_CD_STATUS FROM V_LDP_PRODN WHERE LOM_ID_BATCH='${CHARG}')
      AND CD_TYPE='TB051'
      AND CD_DESC='EDITABLE'`;
    console.log(checkStatus);
    const resultCheck = await ResponceData(
      await query.executeQuery(checkStatus)
    );
    console.log(resultCheck, "12345--12345 ", resultCheck?.[0]?.COUNT);

    if (resultCheck?.[0]?.COUNT < 0) {
      return { msg: "Cannot edit in Current status", statusText: "OK" };
    }

    const excludedKeys = new Set(["PSNO", "MANDT", "CHARG"]);

    // Prepare dynamic columns and values — excluding primary key fields
    const dynamicKeys = Object.keys(data.selectedRowsData).filter(
      (key) => !excludedKeys.has(key)
    );

    // For INSERT statement
    const insertColumnsArray: string[] = [];
    const insertValuesArray: string[] = [];

    // For UPDATE statement
    const updateSetClauses: string[] = [];

    dynamicKeys.forEach((columnName) => {
      const value = data.selectedRowsData[columnName];
      let insertValueString: string;
      let updateSetString: string;

      if (
        columnName === "LCP_SDATE_24H1" ||
        columnName === "LCP_EDATE_24H1" ||
        columnName === "LP3_SDATE_CATH" ||
        columnName === "LP3_EDATE_CATH" ||
        columnName === "CDT_SDATE_CATH1" ||
        columnName === "CDT_EDATE_CATH1" ||
        columnName === "ACP_SDATE_48H2" ||
        columnName === "ACP_EDATE_48H2"
      ) {
        // Frontend sends YYYY-MM-DDTHH:MM (e.g., "2026-07-15T11:40")
        if (value) {
          insertValueString = `TO_TIMESTAMP('${value}', 'YYYY-MM-DD"T"HH24:MI')`;
          updateSetString = `${columnName} = TO_TIMESTAMP('${value}', 'YYYY-MM-DD"T"HH24:MI')`;
        } else {
          insertValueString = "NULL";
          updateSetString = `${columnName} = NULL`;
        }
      } else if (
        columnName === "LCP_STIME_24H1" ||
        columnName === "LP3_STIME_CATH" // Add this field
      ) {
        // Frontend now sends HH:MM directly for these fields
        const timeValue = value;
        if (timeValue) {
          insertValueString = `'${timeValue}'`;
          updateSetString = `${columnName} = '${timeValue}'`;
        } else {
          insertValueString = "NULL";
          updateSetString = `${columnName} = NULL`;
        }
      } else if (
        columnName === "LCP_ETIME_24H1" ||
        columnName === "LP3_ETIME_CATH" // Add this field
      ) {
        // Frontend now sends HH:MM directly for these fields
        const timeValue = value;
        if (timeValue) {
          insertValueString = `'${timeValue}'`;
          updateSetString = `${columnName} = '${timeValue}'`;
        } else {
          insertValueString = "NULL";
          updateSetString = `${columnName} = NULL`;
        }
      } else {
        const safeValue =
          value !== undefined && value !== null
            ? String(value).replace(/'/g, "''")
            : null;
        insertValueString = safeValue ? `'${safeValue}'` : "NULL";
        updateSetString = `${columnName} = ${insertValueString}`;
      }

      insertColumnsArray.push(columnName);
      insertValuesArray.push(insertValueString);
      updateSetClauses.push(updateSetString);
    });

    const columnsForInsert = insertColumnsArray.join(", ");
    const valuesForInsert = insertValuesArray.join(", ");
    const updateSetClause = updateSetClauses.join(", ");
    const checkExistsSql = `
      SELECT COUNT(*) AS COUNT
      FROM V_ZCOAT_LAB
      WHERE MANDT = '${primaryKeys.MANDT}'
        AND PSNO = '${primaryKeys.PSNO}'
        AND CHARG = '${primaryKeys.CHARG}'
        AND ZCL_PLANT_CD = '${primaryKeys.PLANT}'
    `;
    console.log(checkExistsSql);
    const result = await ResponceData(await query.executeQuery(checkExistsSql));
    console.log(result);

    if (result[0]?.COUNT > 0) {
      // Row exists, perform UPDATE
      const updateSql = `
        UPDATE V_ZCOAT_LAB
        SET ${updateSetClause}
        WHERE MANDT = '${primaryKeys.MANDT}'
          AND PSNO = '${primaryKeys.PSNO}'
          AND CHARG = '${primaryKeys.CHARG}'
          AND ZCL_PLANT_CD = '${primaryKeys.PLANT}'
      `;
      console.log("Generated UPDATE SQL:", updateSql);
      return await query.executeQuery(updateSql);
    } else {
      // Row doesn't exist, perform INSERT
      const insertSql = `
        INSERT INTO V_ZCOAT_LAB (MANDT, PSNO, CHARG, PRD_DATE_120, PRD_SHIFT_120, ZCL_PLANT_CD ,${columnsForInsert})
        VALUES ('${primaryKeys.MANDT}', '${primaryKeys.PSNO}', '${primaryKeys.CHARG}', '${data?.DATE_IN}', '${data?.SHIFT}', '${primaryKeys.PLANT}',${valuesForInsert})
      `;
      console.log("Generated INSERT SQL:", insertSql);
      return await query.executeQuery(insertSql);
    }
  } catch (error) {
    console.error("Error in insertOrUpdateTempData:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailMD = async (data: any) => {
  try {
    let sql = `SELECT *  
    FROM V_ZCOAT_LAB WHERE
    CHARG = '${data?.orderId}'`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailSD = async (data: any) => {
  try {
    let sql = `SELECT *  
    FROM V_ZCOAT_LAB WHERE
    CHARG = '${data?.orderId}'`;

    // if (data?.orderId) {
    //   sql += ` AND TPS_ORDER_ID = '${data?.orderId}'`;
    // }
    // if (data?.itemNo) {
    //   sql += ` AND LTRIM(TPS_ORDER_ITEM) = ${data?.itemNo}`;
    // }

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOrdDetailGD = async (data: any) => {
  try {
    console.log("data3: ", data);
    let sql = `SELECT *  
    FROM V_ZCOAT_LAB WHERE
    CHARG = '${data?.orderId}'`;
    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

// New function to fetch common tests
export const getCommonTests = async (data: any) => {
  try {
    const BATCH =
      data?.BATCH_ID?.value || data?.BATCH_ID || data?.batch || data?.orderId;
    const PROD_DATE =
      data?.PROD_DATE ||
      data?.DATE_IN ||
      data?.selecteddate ||
      data?.DATE ||
      data?.prodDate;
    const SHIFT = data?.SHIFT || data?.shift || data?.selectedShift;

    let sql = `SELECT ELF_TEST_CODE,
       LISTAGG(ELF_TEST_NAME, '/ ') WITHIN GROUP (ORDER BY ELF_TEST_NAME) AS ELF_TEST_NAME
FROM (
    SELECT ELF_PLANT_CD, ELF_BATCH_NO,
           CASE
               WHEN SUBSTR(ELF_TEST_CODE, 1, 2) = 'C_' THEN SUBSTR(ELF_TEST_CODE, 3)
               ELSE ELF_TEST_CODE
           END AS ELF_TEST_CODE,
           CASE
               WHEN SUBSTR(ELF_TEST_CODE, 1, 2) = 'C_' THEN '\$' || ELF_TEST_NAME
               ELSE ELF_TEST_NAME
           END AS ELF_TEST_NAME,
           ELF_PROD_DATE, ELF_SHIFT
    FROM v_lab_field_test_EC
    WHERE ELF_PLANT_CD = '0780'
      AND ELF_BATCH_NO = '${BATCH}'
      AND ELF_PROD_DATE = '${PROD_DATE}'
)
GROUP BY ELF_PLANT_CD, ELF_BATCH_NO, ELF_TEST_CODE, ELF_PROD_DATE, ELF_SHIFT
ORDER BY ELF_TEST_CODE`;

    console.log("getCommonTests sql:", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
