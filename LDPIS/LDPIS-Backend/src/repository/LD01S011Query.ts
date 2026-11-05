import oracledb from "oracledb";
import query from "../infrastructure/database/querys";

const batchSQL = `select lom_id_batch Batch1,LOM_SEC1 Thk
      ,LOM_SEC2 Odia
      ,LOM_NO_CAST Cast
      ,LOM_LENGTH length1
      ,LOM_MS_PIECE_ACTL net_wt
      ,LOM_TDC_ACTL Grade
      ,LOM_CD_STATUS Status
      ,LOM_PLANNED_PROC Planned_Proc
      ,LOM_PASSED_PROC Passed_Proc
      ,LOM_CD_CURR_PROC curr_proc
      ,LOM_CD_NEXT_PROC Next_Proc
      ,LOM_ID_PAR_COIL_NO Parent_Batch
      ,LOM_ID_FIRST_PAR   Mother_Batch
      ,LOM_ID_ORDER_CUS Ord
      ,LOM_ID_ORD_ITEM_CUS Item
      ,LOM_MILL_NO Mill_No
      ,LOM_SAMPL_TAG Sample_Tag
      ,To_char(LOM_TS_CREATION,'yyyy-MM-dd HH24:MI:SS') Batch_crt_dt
      ,LOM_TAGGED_BATCH TAGGED_BATCH
      ,LOM_NO_MATNR MAT_NO
      from v_ldp_prodn
      where LOM_CD_EPA='0780' and LOM_CD_STATUS='WB' `;
const orderSQL = `SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_SCHD (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
      ,ENC_LENGTH_MIN length_min
      ,ENC_LENGTH_MAX length_max
      ,ENC_SEC1_MIN Thk_Min
      ,ENC_SEC1_MAX Thk_Max
      ,ENC_SEC2_MAX Odia_Min
      ,ENC_SEC2_MAX Odia_Max
      ,ENC_NO_MATNR FG_mat
      ,(select MAKTX from v_makt where mandt='600' AND MATNR=ENC_NO_MATNR)FG_DESC
      ,ENC_MARK_CUST Mark_cust_cd
      ,ENC_MARK_CUST_NAME Mark_Cust_NM
      ,ENC_MATNR_IP IP
      ,ENC_MATNR_SPEC SPEC
      ,ENC_SUR_FINISH Sur_Finish
      ,ENC_END_FINISH End_Finish
      ,ENC_FIN_COND Fin_Condition
      ,ENC_GEOMETRY Geometry
      ,DECODE(ENC_GEOMETRY,'O','Round','R','Section','S','Section',ENC_GEOMETRY) Section_Type
      FROM V_END_CUST_ORD_EPA --,v_tub_matl_mapping
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A'
      AND ENC_ID_ORDER=:ord AND ENC_NO_ITEM=:itm`;

type Database = Pick<typeof query, "executeQuery">;
type RequestData = {
  ids: string[];
  order: string;
  item: string;
  snapshot?: string;
};

function validateIds(ids: string[]) {
  if (
    !Array.isArray(ids) ||
    !ids.length ||
    ids.length > 1000 ||
    ids.some((id) => typeof id !== "string" || !id.trim()) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error("Enter 1–1000 distinct batch IDs.");
  }
}

async function fetchRows(
  db: Database,
  sql: string,
  binds: any
): Promise<any[]> {
  const result = await db.executeQuery(sql, binds);
  return result.rows.map((row: any) => {
    const record: any = {};
    result.metaData.forEach((col: any, i: number) => {
      record[col.name] = row[i];
    });
    return record;
  });
}

async function fetchBatches(
  db: Database,
  ids: string[],
  target?: RequestData,
  lock = false
) {
  validateIds(ids);
  const binds: any = {};
  const placeholders = ids.map((id, i) => {
    binds["batch" + i] = id;
    return ":batch" + i;
  });
  let filter = "lom_id_batch IN (" + placeholders.join(", ") + ")";
  if (target) {
    filter += " OR (LOM_ID_ORDER_CUS = :ord AND LOM_ID_ORD_ITEM_CUS = :itm)";
    binds.ord = target.order;
    binds.itm = target.item;
  }
  const sql =
    batchSQL +
    " AND (" +
    filter +
    ") ORDER BY lom_id_batch" +
    (lock ? " FOR UPDATE NOWAIT" : "");
  const rows = await fetchRows(db, sql, binds);
  const byId = new Map(
    rows.map((row) => [String(row.BATCH1), row] as [string, any])
  );
  if (byId.size !== rows.length) throw new Error("Ambiguous batch IDs.");
  return { rows, byId };
}

export async function getBatches(data: RequestData) {
  const { byId } = await fetchBatches(query, data.ids);
  return data.ids.filter((id) => byId.has(id)).map((id) => byId.get(id));
}

async function prepareSwap(db: Database, data: RequestData, lock = false) {
  if (!data.order || !data.item) throw new Error("Enter order and item.");
  const { rows, byId } = await fetchBatches(db, data.ids, data, lock);
  const source = data.ids.map((id) => {
    if (!byId.has(id)) throw new Error("Missing or not WB: " + id);
    return byId.get(id);
  });
  const orders = await fetchRows(db, orderSQL, {
    ord: data.order,
    itm: data.item,
  });
  if (orders.length !== 1)
    throw new Error("Expected one active TUBE order/item in plant 0780.");
  const onTarget = (row: any) =>
    String(row.ORD) === String(orders[0].ORD) &&
    String(row.ITEM) === String(orders[0].ITEM);
  const target = rows.filter(onTarget);
  if (target.length !== source.length)
    throw new Error(
      "Target has " +
        target.length +
        " WB batches; expected " +
        source.length +
        "."
    );
  const incoming = source.filter((row) => !onTarget(row));
  const outgoing = target.filter(
    (row) => !data.ids.includes(String(row.BATCH1))
  );
  if (incoming.some((row) => row.ORD == null || row.ITEM == null))
    throw new Error(
      "Every incoming batch must have an existing order and item."
    );
  const preview = {
    orders,
    pairs: incoming.map((row, i) => [row.BATCH1, outgoing[i].BATCH1]),
    skipped: source.length - incoming.length,
    snapshot: JSON.stringify(
      rows.map((row) => [row.BATCH1, row.ORD, row.ITEM])
    ),
  };
  return { incoming, outgoing, preview };
}

export async function getOrder(data: RequestData) {
  const { preview } = await prepareSwap(query, data);
  return preview;
}

async function changeLink(
  db: Database,
  batch: string,
  order: string,
  item: string,
  op: "LINK" | "DELINK"
) {
  const sql =
    "BEGIN LDPDBA.LDLTB002(LS_BATCH=>:b, LS_ORDER=>:o, LS_ITEM=>:i, LS_LINK_TYPE=>:op, LS_OUT_FLAG=>:flag); END;";
  const result = await db.executeQuery(sql, {
    b: batch,
    o: order,
    i: item,
    op,
    flag: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
  });
  if (!String(result.outBinds.flag).startsWith("Y"))
    throw new Error(op + " failed for " + batch + ": " + result.outBinds.flag);
}

export async function swap(data: RequestData) {
  return query.withTransaction(async (db) => {
    const { incoming, outgoing, preview } = await prepareSwap(db, data, true);
    if (data.snapshot !== preview.snapshot)
      throw new Error("Assignments changed. Fetch order details again.");
    for (let i = 0; i < incoming.length; i++) {
      const from = incoming[i],
        replacement = outgoing[i];
      await changeLink(db, from.BATCH1, from.ORD, from.ITEM, "DELINK");
      await changeLink(db, from.BATCH1, data.order, data.item, "LINK");
      await changeLink(db, replacement.BATCH1, data.order, data.item, "DELINK");
      await changeLink(db, replacement.BATCH1, from.ORD, from.ITEM, "LINK");
    }
    return { swapped: incoming.length, skipped: preview.skipped };
  });
}
