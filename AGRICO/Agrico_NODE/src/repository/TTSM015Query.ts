import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getSectionData = async (
    plant: any
) => {
    try {

        var sql = `SELECT
        '0788' AS Plant,
        EIC_SEC1,EIC_SEC2,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM
        V_EPA_PRODN, V_INPUT_COIL
        WHERE
        EOM_CD_EPA = '0788'
        AND EOM_CD_STATUS IN ('VF', 'VM', 'MC')
        AND EOM_ID_BATCH = EIC_ID_COIL
        AND EOM_CD_EPA = EIC_CD_EPA
        AND EOM_ID_BATCH NOT LIKE 'MR%'
        GROUP BY
        EIC_SEC1,EIC_SEC2
        UNION
        SELECT 
            '0788' AS Plant,
            EIC_SEC1,EIC_SEC2,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM (
            SELECT 
                D.EIC_SEC1,D.EIC_SEC2,
                (SELECT EOM_NO_INVOICE 
                 FROM V_EPA_PRODN 
                 WHERE EOM_CD_EPA = A.EOM_CD_EPA 
                   AND EOM_ID_BATCH IN (
                       SELECT ERD_ID_BATCH 
                       FROM V_EPA_RANDOM_DTLS 
                       WHERE ERD_CD_EPA = '0788' 
                         AND ERD_MOV_IND = 'B' 
                         AND ERD_ID_NEW_BATCH = A.EOM_ID_BATCH) 
                   AND (EOM_NO_INVOICE <> ' ' OR EOM_NO_INVOICE IS NOT NULL)
                   AND ROWNUM =1
                ) AS EOM_NO_INVOICE,
                A.EOM_MS_GROSS_CAL,
                A.EOM_ID_BATCH,
                D.EIC_CD_STATUS,
                D.EIC_CD_EPA
            FROM 
                V_EPA_PRODN A
                JOIN V_INPUT_COIL D ON A.EOM_ID_BATCH = D.EIC_ID_COIL 
                    AND A.EOM_CD_EPA = D.EIC_CD_EPA 
            WHERE 
                A.EOM_CD_EPA = '0788'
                AND A.EOM_CD_STATUS IN ('VF', 'VM', 'MC')
                AND A.EOM_ID_BATCH LIKE 'MR%'
        ) 
        GROUP BY 
            EIC_SEC1,EIC_SEC2
        ORDER BY
        EIC_SEC1,EIC_SEC2`;
        return await query.executeQuery(sql);
    } catch (error) {
        console.log(error);
        throw new Error.InternalServerError("Error!");
    }
};

export const getODdata = async (
    data: any
) => {
    try {
        let sql = `SELECT
        '0788' AS Plant,
        EIC_TEN_TUBOD AS "Tentative TubeOD (mm)",
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
        SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM
        V_EPA_PRODN, V_INPUT_COIL
        WHERE
        EOM_CD_EPA = '0788'
        AND EOM_CD_STATUS IN ('VF', 'VM', 'MC')
        AND EOM_ID_BATCH = EIC_ID_COIL
        AND EOM_CD_EPA = EIC_CD_EPA
        AND EOM_ID_BATCH NOT LIKE 'MR%'
        GROUP BY
        EIC_TEN_TUBOD
        UNION
        SELECT 
            '0788' AS Plant,
            EIC_TEN_TUBOD AS "Tentative TubeOD (mm)",
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN 1 ELSE 0 END) AS WTS1_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS1' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS1_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN 1 ELSE 0 END) AS WTS2_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS2' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS2_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN 1 ELSE 0 END) AS WTS3_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS3' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS3_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN 1 ELSE 0 END) AS WTS4_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS4' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS4_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN 1 ELSE 0 END) AS WTS5_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS5' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS5_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN 1 ELSE 0 END) AS WTS6_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS6' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS6_wt,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN 1 ELSE 0 END) AS WTS7_nos,
            SUM(CASE WHEN EOM_NO_INVOICE = 'WTS7' THEN EOM_MS_GROSS_CAL ELSE 0 END) AS WTS7_wt
        FROM (
            SELECT 
                D.EIC_TEN_TUBOD,
                (SELECT EOM_NO_INVOICE 
                 FROM V_EPA_PRODN 
                 WHERE EOM_CD_EPA = A.EOM_CD_EPA 
                   AND EOM_ID_BATCH IN (
                       SELECT ERD_ID_BATCH 
                       FROM V_EPA_RANDOM_DTLS 
                       WHERE ERD_CD_EPA = '0788' 
                         AND ERD_MOV_IND = 'B' 
                         AND ERD_ID_NEW_BATCH = A.EOM_ID_BATCH) 
                   AND (EOM_NO_INVOICE <> ' ' OR EOM_NO_INVOICE IS NOT NULL)
                   AND ROWNUM =1
                ) AS EOM_NO_INVOICE,
                A.EOM_MS_GROSS_CAL,
                A.EOM_ID_BATCH,
                D.EIC_CD_STATUS,
                D.EIC_CD_EPA
            FROM 
                V_EPA_PRODN A
                JOIN V_INPUT_COIL D ON A.EOM_ID_BATCH = D.EIC_ID_COIL 
                    AND A.EOM_CD_EPA = D.EIC_CD_EPA 
            WHERE 
                A.EOM_CD_EPA = '0788'
                AND A.EOM_CD_STATUS IN ('VF', 'VM', 'MC')
                AND A.EOM_ID_BATCH LIKE 'MR%'
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