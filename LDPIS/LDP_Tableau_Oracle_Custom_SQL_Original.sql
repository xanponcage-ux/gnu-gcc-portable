-- ORIGINAL QUERY FROM Tableau query.txt
-- Requires Oracle LD PDBA schema and review before use.
-- Pending DO and production metrics currently hardcoded to zero in source.
SELECT
    M.EOP_BTD BTD,
    M.EOP_BTP BTP,
    0 PENDING_DO, -- LOGIC TO BE PROVIDED
    M.EOP_MILLSCH_QTY TOTAL_LNK_QTY,
    (
        SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
        FROM V_LDP_PRODN
        WHERE LOM_CD_STATUS IN (
            SELECT CD_DESC
            FROM V_CODES
            WHERE CD_TYPE = 'TB040'
              AND CD_DESC1 = 'FG STOCK'
        )
    ) TOTAL_STK,
    (
        SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
        FROM V_LDP_PRODN
        WHERE LOM_ID_ORDER_CUS IS NOT NULL
          AND TRIM(LOM_ID_ORDER_CUS) <> '0'
          AND LOM_CD_STATUS IN (
                SELECT CD_DESC
                FROM V_CODES
                WHERE CD_TYPE = 'TB040'
                  AND CD_DESC1 = 'FG STOCK'
          )
    ) TOTAL_LINK_STK,
    (
        SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
        FROM V_LDP_PRODN
        WHERE LOM_ID_ORDER_CUS IS NOT NULL
          AND TRIM(LOM_ID_ORDER_CUS) <> '0'
          AND LOM_CD_STATUS = 'WF'
    ) TOTAL_UNLINK_STK,
    (
        SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
        FROM V_LDP_PRODN
        WHERE LOM_ID_ORDER_CUS IS NOT NULL
          AND TRIM(LOM_ID_ORDER_CUS) <> '0'
          AND LOM_CD_STATUS = '8Q'
    ) TOTAL_HOLD,
    -- Modified to handle division by zero for TOTAL_HOLD_PER
    CASE
        WHEN (
            SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
            FROM V_LDP_PRODN
            WHERE LOM_CD_STATUS IN (
                SELECT CD_DESC
                FROM V_CODES
                WHERE CD_TYPE = 'TB040'
                  AND CD_DESC1 = 'FG STOCK'
            )
        ) = 0 THEN 0
        ELSE ROUND( -- Rounding the entire percentage calculation to 2 decimal places
            (
                (
                    SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
                    FROM V_LDP_PRODN
                    WHERE LOM_ID_ORDER_CUS IS NOT NULL
                      AND TRIM(LOM_ID_ORDER_CUS) <> '0'
                      AND LOM_CD_STATUS = '8Q'
                ) / (
                    SELECT NVL(ROUND(SUM(LOM_MS_GROSS_CAL)/1000,3),0)
                    FROM V_LDP_PRODN
                    WHERE LOM_CD_STATUS IN (
                        SELECT CD_DESC
                        FROM V_CODES
                        WHERE CD_TYPE = 'TB040'
                          AND CD_DESC1 = 'FG STOCK'
                    )
                )
            ) * 100
        , 2)
    END AS TOTAL_HOLD_PER,
    M.EOP_SIGNOF_QTY,
    0 GRNCOMP_QTY,
    0 GRNCOMP_PER,
    0 ROLLING_OSP,
    0 ROLLING_MTD,
    0 ROLLCOMP_PER,
    0 PRODUCTION_OSP,
    0 PRODUCTION_MTD,
    0 PRODUCTION_PER,
    -- New fields for Segments
    S.BPRTUBE_BTD,
    S.BPRTUBE_BTP,
    S.CETUBE_BTD,
    S.CETUBE_BTP,
    S.CSTUBE_BTD,
    S.CSTUBE_BTP,
    S.EPTUBE_BTD,
    S.EPTUBE_BTP,
    -- New fields for Zones
    S.API_BTD,
    S.API_BTP,
    S.EAST_BTD,
    S.EAST_BTP,
    S.NORTH_BTD,
    S.NORTH_BTP,
    S.SOUTH_BTD,
    S.SOUTH_BTP,
    S.WEST_BTD,
    S.WEST_BTP,
    S.EXPORT_BTD,
    S.EXPORT_BTP
FROM
(
    SELECT
        SUM(NVL(EOP_BTD,0)) EOP_BTD,
        SUM(NVL(EOP_BTP,0)) EOP_BTP,
        SUM(NVL(EOP_MILLSCH_QTY,0)) EOP_MILLSCH_QTY,
        SUM(NVL(EOP_SIGNOF_QTY,0)) EOP_SIGNOF_QTY
    FROM V_LDP_ORDER_PROG,
         V_END_CUST_ORD_EPA
    WHERE EOP_CD_EPA = ENC_CD_EPA
      AND EOP_ID_ORDER = ENC_ID_ORDER
      AND EOP_NO_ITEM = ENC_NO_ITEM
      AND ENC_DT_ORD_CREATE >= SYSDATE - 365
      AND ENC_ST_ORDER = 'A'
      AND EOP_CD_EPA = '0780'
) M
CROSS JOIN
(
    SELECT
        -- Segment-based sums
        SUM(CASE WHEN EOP_SEGEMENT = 'Branded Products & Retail' THEN NVL(EOP_BTD,0) ELSE 0 END) AS BPRTUBE_BTD,
        SUM(CASE WHEN EOP_SEGEMENT = 'Branded Products & Retail' THEN NVL(EOP_BTP,0) ELSE 0 END) AS BPRTUBE_BTP,
        SUM(CASE WHEN EOP_SEGEMENT = 'Commercial & Exports' THEN NVL(EOP_BTD,0) ELSE 0 END) AS CETUBE_BTD,
        SUM(CASE WHEN EOP_SEGEMENT = 'Commercial & Exports' THEN NVL(EOP_BTP,0) ELSE 0 END) AS CETUBE_BTP,
        SUM(CASE WHEN EOP_SEGEMENT = 'Construction and Solution' THEN NVL(EOP_BTD,0) ELSE 0 END) AS CSTUBE_BTD,
        SUM(CASE WHEN EOP_SEGEMENT = 'Construction and Solution' THEN NVL(EOP_BTP,0) ELSE 0 END) AS CSTUBE_BTP,
        SUM(CASE WHEN EOP_SEGEMENT = 'Engineering & Packaging - Tubes' THEN NVL(EOP_BTD,0) ELSE 0 END) AS EPTUBE_BTD,
        SUM(CASE WHEN EOP_SEGEMENT = 'Engineering & Packaging - Tubes' THEN NVL(EOP_BTP,0) ELSE 0 END) AS EPTUBE_BTP,
        -- Zone-based sums
        SUM(CASE WHEN EOP_ZONE = 'API' THEN NVL(EOP_BTD,0) ELSE 0 END) AS API_BTD,
        SUM(CASE WHEN EOP_ZONE = 'API' THEN NVL(EOP_BTP,0) ELSE 0 END) AS API_BTP,
        SUM(CASE WHEN EOP_ZONE = 'East' THEN NVL(EOP_BTD,0) ELSE 0 END) AS EAST_BTD,
        SUM(CASE WHEN EOP_ZONE = 'East' THEN NVL(EOP_BTP,0) ELSE 0 END) AS EAST_BTP,
        SUM(CASE WHEN EOP_ZONE = 'North' THEN NVL(EOP_BTD,0) ELSE 0 END) AS NORTH_BTD,
        SUM(CASE WHEN EOP_ZONE = 'North' THEN NVL(EOP_BTP,0) ELSE 0 END) AS NORTH_BTP,
        SUM(CASE WHEN EOP_ZONE = 'South' THEN NVL(EOP_BTD,0) ELSE 0 END) AS SOUTH_BTD,
        SUM(CASE WHEN EOP_ZONE = 'South' THEN NVL(EOP_BTP,0) ELSE 0 END) AS SOUTH_BTP,
        SUM(CASE WHEN EOP_ZONE = 'West' THEN NVL(EOP_BTD,0) ELSE 0 END) AS WEST_BTD,
        SUM(CASE WHEN EOP_ZONE = 'West' THEN NVL(EOP_BTP,0) ELSE 0 END) AS WEST_BTP,
        SUM(CASE WHEN EOP_ZONE = 'Export' THEN NVL(EOP_BTD,0) ELSE 0 END) AS EXPORT_BTD,
        SUM(CASE WHEN EOP_ZONE = 'Export' THEN NVL(EOP_BTP,0) ELSE 0 END) AS EXPORT_BTP
    FROM V_LDP_ORDER_PROG
) S
