import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getSectionData = async (plant: any) => {
  try {
    var sql = `SELECT
        '0788' AS Plant,
        EIC_SEC1,EIC_SEC2,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM
        V_LDP_PRODN, V_INPUT_COIL
        WHERE
        LOM_CD_EPA = '0788'
        AND LOM_CD_STATUS IN ('VF', 'VM', 'MC')
        AND LOM_ID_BATCH = EIC_ID_COIL
        AND LOM_CD_EPA = EIC_CD_EPA
        AND LOM_ID_BATCH NOT LIKE 'MR%'
        GROUP BY
        EIC_SEC1,EIC_SEC2
        UNION
        SELECT 
            '0788' AS Plant,
            EIC_SEC1,EIC_SEC2,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM (
            SELECT 
                D.EIC_SEC1,D.EIC_SEC2,
                (SELECT LOM_NO_INVOICE 
                 FROM V_LDP_PRODN 
                 WHERE LOM_CD_EPA = A.LOM_CD_EPA 
                   AND LOM_ID_BATCH IN (
                       SELECT ERD_ID_BATCH 
                       FROM V_EPA_RANDOM_DTLS 
                       WHERE ERD_CD_EPA = '0788' 
                         AND ERD_MOV_IND = 'B' 
                         AND ERD_ID_NEW_BATCH = A.LOM_ID_BATCH) 
                   AND (LOM_NO_INVOICE <> ' ' OR LOM_NO_INVOICE IS NOT NULL)
                   AND ROWNUM =1
                ) AS LOM_NO_INVOICE,
                A.LOM_MS_GROSS_CAL,
                A.LOM_ID_BATCH,
                D.EIC_CD_STATUS,
                D.EIC_CD_EPA
            FROM 
                V_LDP_PRODN A
                JOIN V_INPUT_COIL D ON A.LOM_ID_BATCH = D.EIC_ID_COIL 
                    AND A.LOM_CD_EPA = D.EIC_CD_EPA 
            WHERE 
                A.LOM_CD_EPA = '0788'
                AND A.LOM_CD_STATUS IN ('VF', 'VM', 'MC')
                AND A.LOM_ID_BATCH LIKE 'MR%'
        ) 
        GROUP BY 
            EIC_SEC1,EIC_SEC2
        ORDER BY
        EIC_SEC1,EIC_SEC2`;
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getODdata = async (data: any) => {
  try {
    let sql = `SELECT
        '0788' AS Plant,
        EIC_TEN_TUBOD AS "Tentative TubeOD (mm)",
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
        SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM
        V_LDP_PRODN, V_INPUT_COIL
        WHERE
        LOM_CD_EPA = '0788'
        AND LOM_CD_STATUS IN ('VF', 'VM', 'MC')
        AND LOM_ID_BATCH = EIC_ID_COIL
        AND LOM_CD_EPA = EIC_CD_EPA
        AND LOM_ID_BATCH NOT LIKE 'MR%'
        GROUP BY
        EIC_TEN_TUBOD
        UNION
        SELECT 
            '0788' AS Plant,
            EIC_TEN_TUBOD AS "Tentative TubeOD (mm)",
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS1' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS2' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS3' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS4' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS5' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS6' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
            SUM(CASE WHEN LOM_NO_INVOICE = 'WTS7' THEN LOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM (
            SELECT 
                D.EIC_TEN_TUBOD,
                (SELECT LOM_NO_INVOICE 
                 FROM V_LDP_PRODN 
                 WHERE LOM_CD_EPA = A.LOM_CD_EPA 
                   AND LOM_ID_BATCH IN (
                       SELECT ERD_ID_BATCH 
                       FROM V_EPA_RANDOM_DTLS 
                       WHERE ERD_CD_EPA = '0788' 
                         AND ERD_MOV_IND = 'B' 
                         AND ERD_ID_NEW_BATCH = A.LOM_ID_BATCH) 
                   AND (LOM_NO_INVOICE <> ' ' OR LOM_NO_INVOICE IS NOT NULL)
                   AND ROWNUM =1
                ) AS LOM_NO_INVOICE,
                A.LOM_MS_GROSS_CAL,
                A.LOM_ID_BATCH,
                D.EIC_CD_STATUS,
                D.EIC_CD_EPA
            FROM 
                V_LDP_PRODN A
                JOIN V_INPUT_COIL D ON A.LOM_ID_BATCH = D.EIC_ID_COIL 
                    AND A.LOM_CD_EPA = D.EIC_CD_EPA 
            WHERE 
                A.LOM_CD_EPA = '0788'
                AND A.LOM_CD_STATUS IN ('VF', 'VM', 'MC')
                AND A.LOM_ID_BATCH LIKE 'MR%'
        ) 
        GROUP BY 
            EIC_TEN_TUBOD
        ORDER BY
        "Tentative TubeOD (mm)"`;
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
