import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import { ResponceData } from "../utils";

export const getOrderid = async (data: any) => {
  try {
    let sql = `select  LOM_ID_BATCH from V_LDP_PRODN
    WHERE LOM_CD_EPA='0780' and LOM_SAMPL_TAG_IC='${data?.FLAG}'`;

    console.log("sql: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDetails = async (data: any) => {
  try {
    const { CHARG, PSNO } = data;
    const sql = `
      SELECT *
      FROM V_ZCOAT_INTERNAL
      WHERE CHARG = :CHARG
        AND MANDT = '600'
        AND PLANT = '0780'
    `;
    console.log("getDetails SQL:", sql, { CHARG });
    return await query.executeQuery(sql, { CHARG });
  } catch (error) {
    console.error("Error in LDLTS008Query.getDetails:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertUpdateDetails = async (data: any) => {
  try {
    // Extract TEST_TYPE along with other primary keys
    const { MANDT, PLANT, CHARG, TEST_TYPE, ...formData } = data;

    const checkStatusSql = `
      SELECT COUNT(*) AS COUNT FROM V_CODES
      WHERE CD_VALUE IN (SELECT LOM_CD_STATUS FROM V_LDP_PRODN WHERE LOM_ID_BATCH='${CHARG}')
      AND CD_TYPE='TB051'
      AND CD_DESC='EDITABLE'
    `;
    console.log("checkStatusSql:", checkStatusSql);
    const resultCheck = await ResponceData(
      await query.executeQuery(checkStatusSql),
    );

    if (resultCheck?.[0]?.COUNT < 0) {
      return { msg: "Cannot edit in Current status", statusText: "OK" };
    }

    const primaryKeys = { MANDT, PLANT, CHARG };

    // --- NEW LOGIC: Check for existing TEST_TYPE conflict ---
    const checkExistingTestTypeSql = `
  SELECT TEST_TYPE
  FROM V_ZCOAT_INTERNAL
  WHERE MANDT = :MANDT
    AND CHARG = :CHARG
    AND PLANT = :PLANT
`;
    console.log(
      "checkExistingTestTypeSql:",
      checkExistingTestTypeSql,
      primaryKeys,
    );
    const existingRecord = await ResponceData(
      await query.executeQuery(checkExistingTestTypeSql, primaryKeys),
    );

    if (
      existingRecord &&
      existingRecord.length > 0 &&
      existingRecord[0].TEST_TYPE
    ) {
      const existingTestType = existingRecord[0].TEST_TYPE.toUpperCase();

      const currentTestType = TEST_TYPE?.toUpperCase();

      if (
        existingTestType &&
        currentTestType &&
        existingTestType !== currentTestType
      ) {
        return {
          msg: `ERROR - ${existingTestType} data already filled. Cannot fill ${currentTestType}.`,
          statusText: "OK",
        };
      }
    }
    // --- END NEW LOGIC ---

    // Check if record exists (this is still needed for insert vs update)
    const checkExistsSql = `
      SELECT COUNT(*) AS COUNT
      FROM V_ZCOAT_INTERNAL
      WHERE MANDT = :MANDT
        AND CHARG = :CHARG
        AND PLANT = :PLANT
    `;
    console.log("checkExistsSql:", checkExistsSql, primaryKeys);
    const result = await ResponceData(
      await query.executeQuery(checkExistsSql, primaryKeys),
    );

    // Add TEST_TYPE back to formData for dynamic processing, as it's a regular column
    const allFormData = { ...formData, TEST_TYPE };

    const excludedKeys = new Set(["MANDT", "PLANT", "CHARG"]); // Primary keys
    // Iterate over allFormData now
    const dynamicKeys = Object.keys(allFormData).filter(
      (key) => !excludedKeys.has(key),
    );

    const insertColumnsArray: string[] = [];
    const insertValuesArray: string[] = [];
    const updateSetClauses: string[] = [];
    const bindParams: { [key: string]: any } = { ...primaryKeys };

    dynamicKeys.forEach((columnName) => {
      const value = allFormData[columnName]; // Use allFormData
      let insertValuePlaceholder: string;
      let updateSetString: string;

      // Handle DATE fields (CREATED_DT, PROD_DT)
      if (columnName === "CREATED_DT" || columnName === "PROD_DT") {
        if (value) {
          insertValuePlaceholder = `TO_DATE(:${columnName}, 'DD-MM-YY')`;
          updateSetString = `${columnName} = TO_DATE(:${columnName}, 'DD-MM-YY')`;
          bindParams[columnName] = value; // Value is already DD-MON-YYYY from frontend helper
        } else {
          insertValuePlaceholder = "NULL";
          updateSetString = `${columnName} = NULL`;
        }
      }
      // Handle other string/number fields
      else {
        insertValuePlaceholder = `:${columnName}`;
        updateSetString = `${columnName} = :${columnName}`;
        bindParams[columnName] =
          value !== undefined && value !== null ? String(value) : null;
      }

      insertColumnsArray.push(columnName);
      insertValuesArray.push(insertValuePlaceholder);
      updateSetClauses.push(updateSetString);
    });

    const columnsForInsert = insertColumnsArray.join(", ");
    const valuesForInsert = insertValuesArray.join(", ");
    const updateSetClause = updateSetClauses.join(", ");

    if (result[0]?.COUNT > 0) {
      // Update existing record
      const updateSql = `
        UPDATE V_ZCOAT_INTERNAL
        SET ${updateSetClause},
            UPDATED_DT = SYSDATE -- Update timestamp
        WHERE MANDT = :MANDT
          AND CHARG = :CHARG
          AND PLANT = :PLANT
      `;
      console.log("Generated UPDATE SQL:", updateSql, bindParams);
      return await query.executeQuery(updateSql, bindParams);
    } else {
      // Insert new record
      const insertSql = `
        INSERT INTO V_ZCOAT_INTERNAL (MANDT, CHARG, PLANT, UPDATED_DT, ${columnsForInsert})
        VALUES (:MANDT, :CHARG, :PLANT, SYSDATE, ${valuesForInsert})
      `;
      console.log("Generated INSERT SQL:", insertSql, bindParams);
      return await query.executeQuery(insertSql, bindParams);
    }
  } catch (error) {
    console.error("Error in LDLTS008Query.insertUpdateDetails:", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
