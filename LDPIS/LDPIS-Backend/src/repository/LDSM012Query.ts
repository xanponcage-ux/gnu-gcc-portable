import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getInventoryData = async (
  DespFromDate: any,
  DespToDate: any,
  ProdFromDate: any,
  ProdToDate: any,
  batch: any,
  customer: any,
  item: any,
  materialNo: any,
  mbatch: any,
  order: any,
  orderType: any,
  plant: any,
  process: any,
  status: any,
  thikFrm: any,
  thikTo: any,
  widthFrm: any,
  widthTo: any,
  stockType: any,
  millNo: any
) => {
  try {
    /*
     * ==========================================================
     * RM WITHOUT INSPECTION
     * ==========================================================
     *
     * For this stock type:
     *
     * 1. Data is available in V_INPUT_COIL instead of V_LDP_PRODN.
     * 2. There is no corresponding entry in V_BARE_PDO.
     * 3. Same aliases are returned so that no frontend changes
     *    are required.
     * ==========================================================
     */

    if (
      stockType &&
      stockType !== undefined &&
      stockType === "RM(without Inspection)"
    ) {
      let sql = `
        SELECT
          NVL(
            ROUND(
              (SYSDATE - A.EIC_TS_CREATION),
              0
            ),
            0
          ) BATCH_AGE,

          TO_CHAR(
            A.EIC_TS_CREATION,
            'DD-MON-YY HH24:MI:SS'
          ) CREATION_DATE,

          A.EIC_CD_EPA PLANT,

          NVL(
            A.EIC_SOURCE_STOR_LOC,
            ' '
          ) STORAGE_LOC,

          ' ' CURRENT_WORK_CENTER,

          NVL(
            (
              SELECT EWI_WRK_CENTER_NO
              FROM V_WORK_INST
              WHERE EWI_CD_EPA = A.EIC_CD_EPA
                AND EWI_ID_BATCH = A.EIC_ID_FIRST_PAR
                AND EWI_CD_STATUS = 'CN'
                AND EWI_CD_PROCESS =
                    SUBSTR(A.EIC_CD_STATUS, 1, 1)
                AND ROWNUM = 1
            ),
            ' '
          ) PLANNED_WORK_CENTER,

          NVL(
            C.ENC_CUST_NAME,
            ' '
          ) PLANNED_CUST_NAME,

          A.EIC_ID_COIL BATCH_ID,

          A.EIC_SEC1 THICK,

          A.EIC_SEC2 WIDTH,

          NVL(
            A.EIC_IDIA,
            0
          ) IDIA,

          A.EIC_LENGTH LENGTH,

          A.EIC_MS_GROSS_CAL NET_WT,

          A.EIC_MS_GROSS_ACTL GROSS_WT,

          A.EIC_ID_ORDER CUST_ORDER,

          A.EIC_ID_ORDER_ITEM CUST_ITEM,

          NVL(
            ROUND(
              (SYSDATE - A.EIC_TS_CREATION),
              0
            ),
            0
          ) AGE_DAYS,

          C.ENC_ID_ORDER ENC_ID_ORDER,

          C.ENC_NO_ITEM ENC_NO_ITEM,

          C.ENC_ORDER_TYPE ENC_ORDER_TYPE,

          C.ENC_MARK_CUST ENC_MARK_CUST,

          C.ENC_MARK_CUST_NAME ENC_MARK_CUST_NAME,

          C.ENC_NO_TDC ENC_NO_TDC,

          NVL(
            C.ENC_SEC1_MIN,
            0
          ) SO_THICK,

          NVL(
            C.ENC_ODIA,
            0
          ) SO_ODIA,

          NVL(
            C.ENC_IDIA,
            0
          ) SO_IDIA,

          NVL(
            C.ENC_LENGTH_MIN,
            0
          ) SO_LENGTH,

          ' ' SO_OD_TOLERANCE,

          ' ' SO_THICK_TOLERANCE,

          ' ' SO_LENGTH_TOLERANCE,

          NVL(
            (
              SELECT GRADE
              FROM V_YMPCT_TUB_MATL
              WHERE MANDT = '600'
                AND MATNR = C.ENC_NO_MATNR
                AND ROWNUM = 1
            ),
            ' '
          ) SO_GRADE,

          A.EIC_TDC_ACTL ACTUAL_TDC,

          A.EIC_CD_PROD PROD_CD,

          A.EIC_CD_QLTY_ACTL QLTY,

          ' ' PLANNED_ROUTE,

          A.EIC_NO_MATNR FG_MATERIAL_NO,

          NVL(
            (
              SELECT MAKTX
              FROM V_MAKT
              WHERE MANDT = '600'
                AND MATNR = A.EIC_NO_MATNR
                AND ROWNUM = 1
            ),
            ' '
          ) FG_MATERIAL_DESC,

          A.EIC_MS_GROSS_CAL UNRESTRICTED_STOCK,

          NVL(
            C.ENC_PRINT_SPEC,
            ' '
          ) MATERIAL_GROUP,

          A.EIC_NO_CAST CAST_NO,

          1 NO_OF_PIECES,

          NVL(
            A.EIC_UOM,
            'Ton'
          ) UOM,

          NVL(
            A.EIC_CD_PREV_PROC,
            ' '
          ) PREV_PROC,

          A.EIC_CD_CURR_PROC CURR_PROC,

          NVL(
            A.EIC_CD_NEXT_PROC,
            ' '
          ) NEXT_PROC,

          A.EIC_CD_STATUS STATUS,

          (
            SELECT TRUNC(
                     SYSDATE - STB_TIMESTAMP
                   )
            FROM V_STATUS_BKUP X
            WHERE STB_ID_COIL = A.EIC_ID_COIL
              AND STB_NEW_STATUS = A.EIC_CD_STATUS
              AND STB_TIMESTAMP =
                  (
                    SELECT MAX(STB_TIMESTAMP)
                    FROM V_STATUS_BKUP
                    WHERE STB_ID_COIL = X.STB_ID_COIL
                      AND STB_NEW_STATUS =
                          X.STB_NEW_STATUS
                  )
          ) STATUSAGE,

          A.EIC_ID_PAR_COIL_NO PARENT_BATCH,

          A.EIC_ID_FIRST_PAR MOTHER_BATCH,

          NVL(
            ROUND(
              (SYSDATE - A.EIC_DT_LOADING),
              0
            ),
            0
          ) MOTHER_BATCH_AGE,

          A.EIC_MS_GROSS_ACTL MOTHER_BATCH_WT,

          A.EIC_NO_MATNR RM_MATRL_NO,

          NVL(
            (
              SELECT MAKTX
              FROM V_MAKT
              WHERE MANDT = '600'
                AND MATNR = A.EIC_NO_MATNR
                AND ROWNUM = 1
            ),
            ' '
          ) RM_MATERIAL_DESC,

          NVL(
            A.EIC_PASSED_PROC,
            ' '
          ) ACTUAL_ROUTE,

          NVL(
            (
              SELECT DISTINCT EPL_EPA_DESC
              FROM V_EPA_PROC_LINE
              WHERE EPL_ACTIVE_PLANT_FL = 'A'
                AND EPL_CD_EPA = A.EIC_CD_EPA
                AND ROWNUM = 1
            ),
            ' '
          ) PLANT_NM,

          DECODE(
            A.EIC_CD_ST_ACTL,
            '1', 'Prime',
            '2', 'Partial Scrapped',
            '3', 'Downgraded',
            '5', 'Additional Process',
            '8', 'Diverted',
            '9', 'Scrapped',
            'Prime'
          ) PROCESSING_FLAG,

          NVL(
            (
              SELECT DISTINCT CD_DESC
              FROM V_CODES
              WHERE CD_TYPE = 'E0001'
                AND CD_VALUE = A.EIC_CD_STATUS
                AND ROWNUM = 1
            ),
            ' '
          ) STATUS_DESC,

          NVL(
            C.ENC_NO_MATNR,
            ' '
          ) FG_MAT_NO,

          NVL(
            (
              SELECT MAKTX
              FROM V_MAKT
              WHERE MANDT = '600'
                AND MATNR = C.ENC_NO_MATNR
                AND ROWNUM = 1
            ),
            ' '
          ) FG_MAT_DESC,

          ' ' BARE_SAMPL_TAG_FL,

          ' ' BARE_TAG_BATCH,

          ' ' EC_SAMPL_TAG,

          ' ' EC_TAG_BATCH,

          ' ' MILL_NO,

          ' ' LOM_SCRAP_REMARKS

        FROM
          V_INPUT_COIL A,
          V_END_CUST_ORD_EPA C

        WHERE
              A.EIC_CD_EPA = C.ENC_CD_EPA(+)

          AND A.EIC_ID_ORDER =
              C.ENC_ID_ORDER(+)

          AND A.EIC_ID_ORDER_ITEM =
              C.ENC_NO_ITEM(+)

          

          AND A.EIC_CD_STATUS IN
          (
            SELECT CD_DESC
            FROM V_CODES
            WHERE CD_TYPE = 'TB040'
              AND CD_DESC1 = 'RM NOINSP'
          )
          AND A.EIC_CD_EPA = (
            SELECT CD_VALUE
            FROM V_CODES
            WHERE CD_TYPE = 'TB040'
             AND CD_DESC=A.EIC_CD_STATUS
              AND CD_DESC1 = 'RM NOINSP'
          )
          AND A.EIC_NO_MATNR NOT IN
          (
            SELECT CD_VALUE
            FROM V_CODES
            WHERE CD_TYPE = 'TB019'
              AND CD_DESC1 = A.EIC_CD_EPA
          )
      `;

      let binds: any = {
        plant: plant,
      };

      /*
       * DESPATCH / LOADING DATE
       */
      if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
        sql += `
          AND TRUNC(A.EIC_DT_LOADING)
              BETWEEN :DespFromDate
              AND :DespToDate
        `;

        binds["DespFromDate"] = DespFromDate;
        binds["DespToDate"] = DespToDate;
      }

      /*
       * PRODUCTION / CREATION DATE
       */
      if (ProdFromDate && ProdFromDate !== "" && ProdToDate !== "") {
        sql += `
          AND TRUNC(A.EIC_TS_CREATION)
              BETWEEN :ProdFromDate
              AND :ProdToDate
        `;

        binds["ProdFromDate"] = ProdFromDate;
        binds["ProdToDate"] = ProdToDate;
      }

      /*
       * ITEM
       */
      if (item && item !== "") {
        sql += `
          AND A.EIC_ID_ORDER_ITEM =
              NVL(
                :item,
                A.EIC_ID_ORDER_ITEM
              )
        `;

        binds["item"] = item;
      }

      /*
       * WIDTH
       */
      var chkwidthTo = widthTo ? widthTo : widthFrm;

      var chkwidthFrm = widthFrm ? widthFrm : widthTo;

      if (chkwidthFrm && chkwidthFrm !== "" && chkwidthTo !== "") {
        sql += `
          AND A.EIC_SEC2
              BETWEEN
              NVL(
                :widthFrm,
                A.EIC_SEC2
              )
              AND
              NVL(
                :widthTo,
                A.EIC_SEC2
              )
        `;

        binds["widthFrm"] = chkwidthFrm;
        binds["widthTo"] = chkwidthTo;
      }

      /*
       * STATUS
       */
      if (status && status !== "") {
        sql += `
          AND A.EIC_CD_STATUS =
              NVL(
                :Status,
                A.EIC_CD_STATUS
              )
        `;

        binds["Status"] = status;
      }

      /*
       * THICKNESS
       */
      var chkThickTo = thikTo ? thikTo : thikFrm;

      var chkThickFrm = thikFrm ? thikFrm : thikTo;

      if (chkThickFrm && chkThickFrm !== "" && chkThickTo !== "") {
        sql += `
          AND A.EIC_SEC1
              BETWEEN
              NVL(
                :thikFrm,
                A.EIC_SEC1
              )
              AND
              NVL(
                :thikTo,
                A.EIC_SEC1
              )
        `;

        binds["thikFrm"] = chkThickFrm;
        binds["thikTo"] = chkThickTo;
      }

      /*
       * BATCH
       */
      if (batch && batch !== "") {
        sql += `
          AND A.EIC_ID_COIL =
              NVL(
                :batch,
                A.EIC_ID_COIL
              )
        `;

        binds["batch"] = batch;
      }

      /*
       * CUSTOMER
       */
      if (customer && customer !== undefined && customer !== "") {
        sql += `
          AND EXISTS
          (
            SELECT 1
            FROM V_END_CUST_ORD_EPA EC
            WHERE EC.ENC_CD_EPA =
                  A.EIC_CD_EPA

              AND EC.ENC_ID_ORDER =
                  A.EIC_ID_ORDER

              AND EC.ENC_NO_ITEM =
                  A.EIC_ID_ORDER_ITEM

              AND EC.ENC_CD_END_CUST =
                  :Customer
          )
        `;

        binds["Customer"] = customer;
      }

      /*
       * MATERIAL NUMBER
       */
      if (materialNo && materialNo !== "") {
        sql += `
          AND A.EIC_NO_MATNR =
              NVL(
                LPAD(
                  :materialNo,
                  18,
                  '0'
                ),
                A.EIC_NO_MATNR
              )
        `;

        binds["materialNo"] = materialNo;
      }

      /*
       * MOTHER BATCH
       */
      if (mbatch && mbatch !== "") {
        sql += `
          AND A.EIC_ID_FIRST_PAR =
              NVL(
                :mbatch,
                A.EIC_ID_FIRST_PAR
              )
        `;

        binds["mbatch"] = mbatch;
      } else {
        sql += `
          AND A.EIC_CD_STATUS NOT LIKE '%L'
          AND A.EIC_CD_STATUS NOT LIKE '%U'
        `;
      }

      /*
       * ORDER
       */
      if (order && order !== "") {
        sql += `
          AND A.EIC_ID_ORDER =
              NVL(
                :ordr,
                A.EIC_ID_ORDER
              )
        `;

        binds["ordr"] = order;
      }

      /*
       * ORDER TYPE
       */
      if (orderType && orderType !== undefined && orderType !== "") {
        sql += `
          AND EXISTS
          (
            SELECT 1
            FROM V_END_CUST_ORD_EPA EO
            WHERE EO.ENC_CD_EPA =
                  A.EIC_CD_EPA

              AND EO.ENC_ID_ORDER =
                  A.EIC_ID_ORDER

              AND EO.ENC_NO_ITEM =
                  A.EIC_ID_ORDER_ITEM

              AND EO.ENC_ORDER_TYPE =
                  :orderType
          )
        `;

        binds["orderType"] = orderType;
      }

      /*
       * PROCESS
       */
      if (process && process !== "") {
        sql += `
          AND A.EIC_CD_CURR_PROC =
              NVL(
                :process,
                A.EIC_CD_CURR_PROC
              )
        `;

        binds["process"] = process;
      }

      /*
       * No EIC_MILL_NO field is present in supplied
       * V_INPUT_COIL structure.
       *
       * MILL_NO alias is therefore returned blank.
       */

      sql += `
        ORDER BY
          PLANT,
          BATCH_ID
      `;

      return await query.executeQuery(sql, binds);
    }

    /*
     * ==========================================================
     * NORMAL INVENTORY
     * ==========================================================
     *
     * Existing V_LDP_PRODN based query.
     * Used for RM / FG / WIP / SCRAP etc.
     * ==========================================================
     */

    var sql = `
      SELECT
        BATCH_AGE,
        CREATION_DATE,
        PLANT,
        NVL(STORAGE_LOC, ' ') STORAGE_LOC,
        NVL(CURRENT_WORK_CENTER, ' ') CURRENT_WORK_CENTER,
        NVL(PLANNED_WORK_CENTER, ' ') PLANNED_WORK_CENTER,
        NVL(PLANNED_CUST_NAME, ' ') PLANNED_CUST_NAME,
        BATCH_ID,
        THICK,
        WIDTH,
        NVL(IDIA, 0) IDIA,
        LENGTH,
        NET_WT,
        GROSS_WT,
        CUST_ORDER,
        CUST_ITEM,
        AGE_DAYS,
        ENC_ID_ORDER,
        ENC_NO_ITEM,
        ENC_ORDER_TYPE,
        ENC_MARK_CUST,
        ENC_MARK_CUST_NAME,
        ENC_NO_TDC,
        NVL(SO_THICK, 0) SO_THICK,
        NVL(SO_ODIA, 0) SO_ODIA,
        NVL(SO_IDIA, 0) SO_IDIA,
        NVL(SO_LENGTH, 0) SO_LENGTH,
        SO_OD_TOLERANCE,
        SO_THICK_TOLERANCE,
        SO_LENGTH_TOLERANCE,
        NVL(SO_GRADE, ' ') SO_GRADE,
        ACTUAL_TDC,
        PROD_CD,
        QLTY,
        NVL(PLANNED_ROUTE, ' ') PLANNED_ROUTE,
        FG_MATERIAL_NO,
        NVL(FG_MATERIAL_DESC, ' ') FG_MATERIAL_DESC,
        UNRESTRICTED_STOCK,
        NVL(MATERIAL_GROUP, ' ') MATERIAL_GROUP,
        CAST_NO,
        NO_OF_PIECES,
        UOM,
        NVL(PREV_PROC, ' ') PREV_PROC,
        CURR_PROC,
        NVL(NEXT_PROC, ' ') NEXT_PROC,
        STATUS,
        STATUSAGE,
        PARENT_BATCH,
        MOTHER_BATCH,
        MOTHER_BATCH_AGE,
        MOTHER_BATCH_WT,
        RM_MATRL_NO,
        NVL(RM_MATERIAL_DESC, ' ') RM_MATERIAL_DESC,
        ACTUAL_ROUTE,
        PLANT_NM,
        NVL(PROCESSING_FLAG, ' ') PROCESSING_FLAG,
        STATUS_DESC,
        NVL(FG_MAT_NO, ' ') FG_MAT_NO,
        NVL(FG_MAT_DESC, ' ') FG_MAT_DESC,
        BARE_SAMPL_TAG_FL,
        BARE_TAG_BATCH,
        EC_SAMPL_TAG,
        EC_TAG_BATCH,
        NVL(MILL_NO, ' ') MILL_NO,
        LOM_SCRAP_REMARKS

      FROM
      (
        SELECT
          NVL(
            ROUND(
              (SYSDATE - LOM_TS_CREATION),
              0
            ),
            0
          ) BATCH_AGE,

          TO_CHAR(
            LOM_TS_CREATION,
            'DD-MON-YY HH24:MI:SS'
          ) CREATION_DATE,

          LOM_CD_EPA PLANT,

          LOM_CD_PACK STORAGE_LOC,

          (
            SELECT EWI_WRK_CENTER_NO
            FROM V_WORK_INST
            WHERE EWI_CD_EPA =
                  LOM_CD_EPA

              AND EWI_ID_BATCH =
                  LOM_ID_FIRST_PAR

              AND EWI_CD_STATUS =
                  'CN'

              AND EWI_CD_PROCESS =
                  SUBSTR(
                    LOM_CD_STATUS,
                    1,
                    1
                  )

              AND ROWNUM = 1
          ) PLANNED_WORK_CENTER,

          LOM_WORK_CENTER CURRENT_WORK_CENTER,

          ENC_CUST_NAME PLANNED_CUST_NAME,

          LOM_ID_BATCH BATCH_ID,

          LOM_SEC1 THICK,

          LOM_SEC2 WIDTH,

          LOM_IDIA IDIA,

          LOM_LENGTH LENGTH,

          LOM_NO_CAST,

          LOM_MS_GROSS_CAL NET_WT,

          LOM_MS_GROSS_ACTL GROSS_WT,

          LOM_ID_ORDER_CUS CUST_ORDER,

          LOM_ID_ORD_ITEM_CUS CUST_ITEM,

          NVL(
            ROUND(
              (SYSDATE - LOM_TS_CREATION),
              0
            ),
            0
          ) AGE_DAYS,

          ENC_ID_ORDER,

          ENC_NO_ITEM,

          ENC_ORDER_TYPE,

          ENC_MARK_CUST,

          ENC_MARK_CUST_NAME,

          ENC_NO_TDC,

          ENC_SEC1_MIN SO_THICK,

          ENC_ODIA SO_ODIA,

          ENC_IDIA SO_IDIA,

          ENC_LENGTH_MIN SO_LENGTH,

          '' SO_OD_TOLERANCE,

          '' SO_THICK_TOLERANCE,

          '' SO_LENGTH_TOLERANCE,

          (
            SELECT GRADE
            FROM V_YMPCT_TUB_MATL
            WHERE MANDT = '600'
              AND MATNR = ENC_NO_MATNR
              AND ROWNUM = 1
          ) SO_GRADE,

          LOM_TDC_ACTL ACTUAL_TDC,

          LOM_CD_PROD PROD_CD,

          LOM_CD_QLTY_ACTL QLTY,

          LOM_PLANNED_PROC PLANNED_ROUTE,

          NVL(
            A.LOM_NO_MATNR,
            ENC_NO_MATNR
          ) FG_MATERIAL_NO,

          (
            SELECT MAKTX
            FROM V_MAKT
            WHERE MANDT = '600'
              AND MATNR =
                  NVL(
                    A.LOM_NO_MATNR,
                    ENC_NO_MATNR
                  )
              AND ROWNUM = 1
          ) FG_MATERIAL_DESC,

          LOM_MS_GROSS_CAL UNRESTRICTED_STOCK,

          ENC_PRINT_SPEC MATERIAL_GROUP,

          NVL(
            EIC_NO_CAST,
            LOM_NO_CAST
          ) CAST_NO,

          LOM_NO_PIECES NO_OF_PIECES,

          NVL(
            LOM_UOM,
            'Ton'
          ) UOM,

          LOM_CD_PREV_PROC PREV_PROC,

          LOM_CD_CURR_PROC CURR_PROC,

          LOM_CD_NEXT_PROC NEXT_PROC,

          LOM_CD_STATUS STATUS,

          (
            SELECT TRUNC(
                     SYSDATE - STB_TIMESTAMP
                   )
            FROM V_STATUS_BKUP X
            WHERE STB_ID_COIL =
                  A.LOM_ID_BATCH

              AND STB_NEW_STATUS =
                  A.LOM_CD_STATUS

              AND STB_TIMESTAMP =
                  (
                    SELECT MAX(
                             STB_TIMESTAMP
                           )
                    FROM V_STATUS_BKUP
                    WHERE STB_ID_COIL =
                          X.STB_ID_COIL

                      AND STB_NEW_STATUS =
                          X.STB_NEW_STATUS
                  )
          ) STATUSAGE,

          LOM_ID_PAR_COIL_NO PARENT_BATCH,

          LOM_ID_FIRST_PAR MOTHER_BATCH,

          NVL(
            ROUND(
              (SYSDATE - EIC_DT_LOADING),
              0
            ),
            0
          ) MOTHER_BATCH_AGE,

          EIC_MS_GROSS_ACTL MOTHER_BATCH_WT,

          EIC_NO_MATNR RM_MATRL_NO,

          (
            SELECT MAKTX
            FROM V_MAKT
            WHERE MANDT = '600'
              AND MATNR =
                  EIC_NO_MATNR
              AND ROWNUM = 1
          ) RM_MATERIAL_DESC,

          NVL(
            LOM_PASSED_PROC,
            ' '
          ) ACTUAL_ROUTE,

          (
            SELECT DISTINCT
              EPL_EPA_DESC
            FROM V_EPA_PROC_LINE
            WHERE EPL_ACTIVE_PLANT_FL =
                  'A'

              AND EPL_CD_EPA =
                  LOM_CD_EPA

              AND ROWNUM = 1
          ) PLANT_NM,

          DECODE(
            LOM_CD_ST_ACTL,
            '1', 'Prime',
            2, 'Partial Scrapped',
            '3', 'Downgraded',
            '5', 'Additional Process',
            '8', 'Diverted',
            '9', 'Scrapped',
            'Prime'
          ) PROCESSING_FLAG,

          (
            SELECT DISTINCT
              CD_DESC
            FROM V_CODES
            WHERE CD_TYPE = 'E0001'
              AND CD_VALUE =
                  LOM_CD_STATUS
              AND ROWNUM = 1
          ) STATUS_DESC,

          ENC_NO_MATNR FG_MAT_NO,

          (
            SELECT MAKTX
            FROM V_MAKT
            WHERE MANDT = '600'
              AND MATNR =
                  ENC_NO_MATNR
              AND ROWNUM = 1
          ) FG_MAT_DESC,

          LOM_SAMPL_TAG BARE_SAMPL_TAG_FL,

          LOM_TAGGED_BATCH BARE_TAG_BATCH,

          LOM_SAMPL_TAG_EC EC_SAMPL_TAG,

          LOM_TAGGED_BATCH_EC EC_TAG_BATCH,

          DECODE(
            LOM_MILL_NO,
            '1', 'MILL 1',
            '2', 'MILL 2'
          ) MILL_NO,

          (
            SELECT LISTAGG(TBP_REMARK)
            FROM V_BARE_PDO T1
            WHERE TBP_BATCH_NO =
                  A.LOM_ID_BATCH

              AND TBP_NEXT_PROC =
                  (
                    SELECT LOM_CD_CURR_PROC
                    FROM V_LDP_PRODN
                    WHERE LOM_ID_BATCH =
                          A.LOM_ID_BATCH

                      AND LOM_CD_EPA =
                          '0780'
                  )

              AND TBP_BATCH_PROC_NO =
                  (
                    SELECT MAX(
                             TBP_BATCH_PROC_NO
                           )
                    FROM V_BARE_PDO
                    WHERE TBP_BATCH_NO =
                          T1.TBP_BATCH_NO

                      AND TBP_NEXT_PROC =
                          T1.TBP_NEXT_PROC

                      AND TBP_PLANT_CD =
                          '0780'
                  )
          ) LOM_SCRAP_REMARKS

        FROM
          V_LDP_PRODN A,
          V_INPUT_COIL B,
          V_END_CUST_ORD_EPA C

        WHERE
              LOM_CD_EPA =
              EIC_CD_EPA(+)

          AND LOM_ID_FIRST_PAR =
              EIC_ID_COIL(+)

          AND A.LOM_CD_EPA =
              C.ENC_CD_EPA(+)

          AND A.LOM_ID_ORDER_CUS =
              C.ENC_ID_ORDER(+)

          AND A.LOM_ID_ORD_ITEM_CUS =
              C.ENC_NO_ITEM(+)

          AND LOM_CD_EPA =
              :plant
    `;

    let binds: any = {
      plant: plant,
    };

    /*
     * DESPATCH DATE
     */
    if (DespFromDate && DespFromDate !== "" && DespToDate !== "") {
      sql += `
        AND TRUNC(LOM_DT_LOADING)
            BETWEEN :DespFromDate
            AND :DespToDate
      `;

      binds["DespFromDate"] = DespFromDate;

      binds["DespToDate"] = DespToDate;
    }

    /*
     * PRODUCTION DATE
     */
    if (ProdFromDate && ProdFromDate !== "" && ProdToDate !== "") {
      sql += `
        AND TRUNC(LOM_TS_CREATION)
            BETWEEN :ProdFromDate
            AND :ProdToDate
      `;

      binds["ProdFromDate"] = ProdFromDate;

      binds["ProdToDate"] = ProdToDate;
    }

    /*
     * ITEM
     */
    if (item && item !== "") {
      sql += `
        AND LOM_ID_ORD_ITEM_CUS =
            NVL(
              :item,
              LOM_ID_ORD_ITEM_CUS
            )
      `;

      binds["item"] = item;
    }

    /*
     * WIDTH
     */
    var chkwidthTo = widthTo ? widthTo : widthFrm;

    var chkwidthFrm = widthFrm ? widthFrm : widthTo;

    if (chkwidthFrm && chkwidthFrm !== "" && chkwidthTo !== "") {
      sql += `
        AND LOM_SEC2
            BETWEEN
            NVL(
              :widthFrm,
              LOM_SEC2
            )
            AND
            NVL(
              :widthTo,
              LOM_SEC2
            )
      `;

      binds["widthFrm"] = chkwidthFrm;

      binds["widthTo"] = chkwidthTo;
    }

    /*
     * STATUS
     */
    if (status && status !== "") {
      sql += `
        AND LOM_CD_STATUS =
            NVL(
              :Status,
              LOM_CD_STATUS
            )
      `;

      binds["Status"] = status;
    }

    /*
     * THICKNESS
     */
    var chkThickTo = thikTo ? thikTo : thikFrm;

    var chkThickFrm = thikFrm ? thikFrm : thikTo;

    if (chkThickFrm && chkThickFrm !== "" && chkThickTo !== "") {
      sql += `
        AND LOM_SEC1
            BETWEEN
            NVL(
              :thikFrm,
              LOM_SEC1
            )
            AND
            NVL(
              :thikTo,
              LOM_SEC1
            )
      `;

      binds["thikFrm"] = chkThickFrm;

      binds["thikTo"] = chkThickTo;
    }

    /*
     * BATCH
     */
    if (batch && batch !== "") {
      sql += `
        AND LOM_ID_BATCH =
            NVL(
              :batch,
              LOM_ID_BATCH
            )
      `;

      binds["batch"] = batch;
    }

    /*
     * CUSTOMER
     */
    if (customer && customer !== undefined) {
      sql += `
        AND
        (
          LOM_CD_EPA ||
          LOM_ID_ORDER_CUS ||
          LOM_ID_ORD_ITEM_CUS
        )
        IN
        (
          SELECT
            ENC_CD_EPA ||
            ENC_ID_ORDER ||
            ENC_NO_ITEM

          FROM V_END_CUST_ORD_EPA

          WHERE
                ENC_CD_EPA =
                A.LOM_CD_EPA

            AND ENC_ID_ORDER =
                A.LOM_ID_ORDER_CUS

            AND ENC_NO_ITEM =
                A.LOM_ID_ORD_ITEM_CUS

            AND ENC_CD_END_CUST =
                :Customer
        )
      `;

      binds["Customer"] = customer;
    }

    /*
     * MATERIAL NUMBER
     */
    if (materialNo && materialNo !== "") {
      sql += `
        AND LOM_NO_MATNR =
            NVL(
              LPAD(
                :materialNo,
                18,
                '0'
              ),
              LOM_NO_MATNR
            )
      `;

      binds["materialNo"] = materialNo;
    }

    /*
     * MOTHER BATCH
     */
    if (mbatch && mbatch !== "") {
      sql += `
        AND LOM_ID_FIRST_PAR =
            NVL(
              :mbatch,
              LOM_ID_FIRST_PAR
            )
      `;

      binds["mbatch"] = mbatch;
    } else {
      sql += `
        AND LOM_CD_STATUS NOT LIKE '%L'
        AND LOM_CD_STATUS NOT LIKE '%U'
      `;
    }

    /*
     * ORDER
     */
    if (order && order !== "") {
      sql += `
        AND LOM_ID_ORDER_CUS =
            NVL(
              :ordr,
              LOM_ID_ORDER_CUS
            )
      `;

      binds["ordr"] = order;
    }

    /*
     * ORDER TYPE
     */
    if (orderType && orderType !== undefined) {
      sql += `
        AND
        (
          LOM_CD_EPA ||
          LOM_ID_ORDER_CUS ||
          LOM_ID_ORD_ITEM_CUS
        )
        IN
        (
          SELECT
            ENC_CD_EPA ||
            ENC_ID_ORDER ||
            ENC_NO_ITEM

          FROM V_END_CUST_ORD_EPA

          WHERE
                ENC_CD_EPA =
                A.LOM_CD_EPA

            AND ENC_ID_ORDER =
                A.LOM_ID_ORDER_CUS

            AND ENC_NO_ITEM =
                A.LOM_ID_ORD_ITEM_CUS

            AND ENC_ORDER_TYPE =
                :orderType
        )
      `;

      binds["orderType"] = orderType;
    }

    /*
     * PROCESS
     */
    if (process && process !== "") {
      sql += `
        AND LOM_CD_CURR_PROC =
            NVL(
              :process,
              LOM_CD_CURR_PROC
            )
      `;

      binds["process"] = process;
    }

    /*
     * RM STOCK
     */
    if (stockType && stockType !== undefined && stockType === "RM") {
      sql += `
        AND
        (
          LOM_CD_STATUS IN
          (
            SELECT CD_DESC
            FROM V_CODES
            WHERE CD_TYPE = 'TB040'
              AND CD_DESC1 = 'RM STOCK'
          )
        )

        AND LOM_NO_MATNR NOT IN
        (
          SELECT CD_VALUE
          FROM V_CODES
          WHERE CD_TYPE = 'TB019'
            AND CD_DESC1 = LOM_CD_EPA
        )
      `;
    }

    /*
     * NOTE:
     *
     * RM(without Inspection) is NOT handled here anymore.
     *
     * It is handled at the beginning of this function using
     * V_INPUT_COIL.
     */

    /*
     * FG
     */
    if (stockType && stockType !== undefined && stockType === "FG") {
      sql += `
        AND LOM_CD_STATUS IN
        (
          SELECT CD_DESC
          FROM V_CODES
          WHERE CD_TYPE = 'TB040'
            AND CD_DESC1 = 'FG STOCK'
        )

        AND LOM_CD_QLTY_ACTL <> 'SCRP'

        AND LOM_NO_MATNR NOT IN
        (
          SELECT CD_VALUE
          FROM V_CODES
          WHERE CD_TYPE = 'TB019'
            AND CD_DESC1 = LOM_CD_EPA
        )
      `;
    }

    /*
     * SCRAP
     */
    if (stockType && stockType !== undefined && stockType === "SCRAP") {
      sql += `
        AND LOM_CD_ST_ACTL = '9'
      `;
    }

    /*
     * WIP
     */
    if (stockType && stockType !== undefined && stockType === "WIP") {
      sql += `
        AND
        (
          (
            LOM_CD_STATUS IN
            (
              SELECT CD_DESC
              FROM V_CODES
              WHERE CD_TYPE = 'TB040'

                AND CD_DESC1 NOT IN
                (
                  'RM STOCK',
                  'FG STOCK'
                )
            )

            AND LOM_CD_QLTY_ACTL <> 'SCRP'
          )

          OR

          (
            LOM_NO_MATNR IN
            (
              SELECT CD_VALUE
              FROM V_CODES
              WHERE CD_TYPE = 'TB019'
                AND CD_DESC1 = LOM_CD_EPA
            )
          )
        )
      `;
    }

    /*
     * MILL
     *
     * Changed to bind variable rather than direct string
     * interpolation.
     */
    if (millNo && millNo !== "") {
      sql += `
        AND LOM_MILL_NO =
            NVL(
              :millNo,
              LOM_MILL_NO
            )
      `;

      binds["millNo"] = millNo;
    }

    /*
     * CLOSE INNER QUERY
     */
    sql += `
      )
      ORDER BY
        PLANT,
        BATCH_ID
    `;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);

    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMergedInv = async (
  fromDt: any,
  mergedType: any,
  plant: any,
  toDt: any,
  batchMerg: any,
  mergedBatchMerg: any
) => {
  try {
    var sql = `SELECT ERD_CD_EPA PLANT, ERD_ID_BATCH SLIT_COIL,ERD_BATCH_QTY SLIT_COIL_QTY, ERD_ID_NEW_BATCH MERGED_BATCH , ERD_NEW_BATCH_QTY MERGED_BATCH_QTY
        ,ERD_NO_MATNR FG_MATERIAL_NO , (SELECT MAKTX FROM V_MAKT WHERE MANDT='600' AND MATNR=A.ERD_NO_MATNR AND ROWNUM=1)FG_MATERIAL_DESC
        ,TO_CHAR(ERD_REC_CRT_DT) MERGE_DT ,ERD_REC_CRT_UID MERGED_BY_USER , decode(ERD_MOV_IND , 'B','COIL','F','FG','S','SFG','') MERGED_TYPE
        FROM V_EPA_RANDOM_DTLS A
        WHERE ERD_CD_EPA=:plant
        --AND ERD_REC_STATUS = NVL('A', ERD_REC_STATUS)
        `;
    const binds = {
      plant: plant,
    };

    if (mergedType && mergedType != "") {
      if (mergedType == "ALL") {
        sql += ` AND ERD_MOV_IND IN ('B' , 'F' , 'S')`;
      } else {
        sql += ` AND ERD_MOV_IND = NVL(:mergedType, ERD_REC_STATUS)`;
        binds["mergedType"] = mergedType;
      }
    } else {
      sql += ` AND ERD_MOV_IND = NVL('B', ERD_REC_STATUS)`;
    }

    if (batchMerg && batchMerg != "") {
      sql += ` AND ERD_ID_BATCH = :batchMerg`;
      binds["batchMerg"] = batchMerg;
    }

    if (mergedBatchMerg && mergedBatchMerg != "") {
      sql += ` AND ERD_ID_NEW_BATCH = :mergedBatchMerg`;
      binds["mergedBatchMerg"] = mergedBatchMerg;
    }

    if (fromDt && toDt && fromDt != "" && toDt != "") {
      sql += ` AND trunc(ERD_REC_CRT_DT) BETWEEN :fromDt AND :toDt `;
      binds["fromDt"] = fromDt;
      binds["toDt"] = toDt;
    }

    sql += ` ORDER BY ERD_ID_NEW_BATCH , ERD_ID_BATCH , ERD_MOV_IND`;

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaFrm = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA=:plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getOdiaTo = async (plant: any) => {
  try {
    const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA= :plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
    const binds = {
      plant: plant,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getReversedBatchInfo = async (
  plant: any,
  batchId: any,
  mergeBatch: any
) => {
  try {
    const sql = `SELECT
    LOM_timestamp         reversal_dt,
    LOM_user_rev          reversal_done_by,
    LOM_id_batch          batch_id,
    LOM_ms_gross_cal      net_wt,
    LOM_uom               net_wt_uom,
    LOM_sec1              batch_thk,
    LOM_sec2              batch_odia,
    LOM_length            batch_length,
    LOM_tdc_actl          batch_grade,
    LOM_cd_status         batch_status,
    LOM_id_par_coil_no    parent_batch,
    LOM_id_first_par      first_parent,
    LOM_merge_batch       merge_bt,
    LOM_no_cast           cast_no,
    LOM_idia              idia,
    LOM_id_order_cus      order1,
    LOM_id_ord_item_cus   item,
    LOM_cd_epa            plant,
    LOM_no_matnr          material_no,
    LOM_oper_id           production_done_by_usr
FROM
    v_LDP_PRODN_reverse
WHERE
    LOM_cd_epa = :plant
    AND LOM_id_batch = nvl(:batchId, LOM_id_batch)
    AND LOM_id_first_par = nvl(:motherBatch, LOM_id_first_par)
    Order by LOM_id_first_par, LOM_id_batch`;

    const binds = {
      plant: plant,
      batchId: batchId,
      motherBatch: mergeBatch,
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
