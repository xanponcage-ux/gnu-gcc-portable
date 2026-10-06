Implementation Plan and Exact File-by-File Diffs for LD09–LD13 fixes

This document contains precise, copy-pastable code snippets and where to apply them. Apply these changes after you review and approve. Every file reference below is clickable and includes an anchor line suggestion.

CHANGESET 1 — LD12: Recompute COAT_WT when LENGTH changes

Target file:

- [`LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1721`](LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1721)

Problem: LENGTH cellEdited updates only pipe weight and does not call getCoatWt. This causes COAT_WT to remain stale when LENGTH changes.

Replace the existing LENGTH column entry's cellEdited handler with this implementation:

--- Replace the LENGTH column object cellEdited handler with:

{
title: "LENGTH",
field: "LOM_LENGTH",
editor: "input",
formatter: "money",
hozAlign: "center",
cellEdited: async function (cell) {
try {
const row = cell.getRow();
const rowData = row.getData();

      // 1) Existing pipe weight calculation (preserve existing signature)
      const newLength = Number(cell.getValue()) || 0;
      const pipeId = rowData.PIPE_ID || rowData.LOM_PIPE_ID;
      const od = rowData.LOM_SEC2 || rowData.LOM_ODIA || rowData.OD || 0;
      const thick = rowData.LOM_THICK || rowData.THICKNESS || 0;
      const geo = rowData.LOM_GEOMETRY || rowData.GEOMETRY || null;

      const metalWt = await calculatePipeWt(pipeId, newLength, od, thick, rowData.LOM_SEC3, geo);

      // Update metal weight cell used in UI
      row.update({ PIPE_WEIGHT: Number(metalWt).toFixed(3) });

      // 2) Recompute coating weight using current thickness readings
      const W1 = Number(rowData.THK_W1) || 0;
      const W2 = Number(rowData.THK_W2) || 0;
      const W3 = Number(rowData.THK_W3) || 0;
      const W4 = Number(rowData.THK_W4) || 0;
      const W5 = Number(rowData.THK_W5) || 0;
      const W6 = Number(rowData.THK_W6) || 0;
      const W7 = Number(rowData.THK_B1) || 0;
      const W8 = Number(rowData.THK_B2) || 0;
      const W9 = Number(rowData.THK_B3) || 0;
      const W10 = Number(rowData.THK_B4) || 0;
      const W11 = Number(rowData.THK_B5) || 0;
      const W12 = Number(rowData.THK_B6) || 0;

      // call existing frontend helper which posts to api/LD12S001/getCoatWt
      const coatResp = await getCoatWt({ W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, LENGTH: newLength, OD: od });

      if (coatResp && coatResp.data && coatResp.data[0]) {
        const coatWt = Number(coatResp.data[0].COAT_WT) || 0;
        // Update COAT_WT visible cell
        row.update({ COAT_WT: coatWt.toFixed(3) });

        // 3) Update save-weight (combined metal + coat) for UI so the value persists to save
        // Use the field your save uses (example: TBP_WEIGHT). If your save mapping uses a different field, update accordingly.
        const totalWeight = (Number(metalWt) || 0) + coatWt;
        row.update({ TBP_WEIGHT: totalWeight.toFixed(3) });
      }
    } catch (err) {
      console.error('LD12 LENGTH cellEdited error:', err);
    }

}
}

Notes:

- Verify the field names TBP_WEIGHT / PIPE_WEIGHT / COAT_WT match the ones used by your save routine. Adjust if necessary.
- This preserves the existing metal weight calculation and adds coat weight recompute, then updates combined weight.

CHANGESET 2 — LD12: Ensure saved WEIGHT = metal weight + COAT_WT

Files:

- Frontend: [`LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1352`](LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1352)
- Backend: [`LDPIS-Backend/src/repository/LD12S001Query.ts:284`](LDPIS-Backend/src/repository/LD12S001Query.ts:284)

Frontend change (updateData): compute combined weight right before constructing payload for insert. Replace the place where TBP_WEIGHT (or WEIGHT) is set to metal-only with the combined value.

--- Frontend snippet to insert into the newData mapping (inside updateData):

// compute combined weight
const metalWeight = Number(row.PIPE_WEIGHT) || 0;
const coatWeight = Number(row.COAT_WT) || 0;
const saveWeight = metalWeight + coatWeight; // ensure same units across both

// when pushing into payload
newData.push({
// ... other fields ...
TBP_WEIGHT: saveWeight.toFixed(3),
// ... rest of mapping unchanged ...
});

Backend defensive change (recommended): compute or validate TBP_WEIGHT server-side. In [`LDPIS-Backend/src/repository/LD12S001Query.ts`] update insertTempData to compute final weight if not provided:

--- Backend pseudocode to add near the top of insertTempData handler ---
const metal = Number(data.PIPE_WEIGHT) || 0;
const coat = Number(data.TBP_COT_WT_VS_120) || Number(data.COT_WT_VS_120) || 0; // adjust to incoming field name
const finalWeight = (metal + coat).toFixed(3);

// Then use finalWeight as the value for TBP_WEIGHT bind in the INSERT query

Notes:

- Decide authoritative side (frontend vs backend). Backend computation guarantees correctness.
- Confirm units (kg/mt). Convert if front-end displays kg and DB expects tonnes.

CHANGESET 3 — LD12: Fix scrap material selection logic in insertScrapTempData

File:

- [`LDPIS-Backend/src/repository/LD12S001Query.ts:193`](LDPIS-Backend/src/repository/LD12S001Query.ts:193)

Problem: SQL uses hardcoded plant '0780' and substring logic SUBSTR(cd_value,1,4) and SUBSTR(cd_value,6,1) which may not match cd_value structure; wrong material is selected.

Suggested change:

- Use the plant code from request (data.PLANT or data.plant) rather than hardcoded '0780'.
- Replace SUBSTR checks with a clear LIKE or exact match on a structured key.

--- Replace inner SELECT of insertScrapTempData with this pattern ---
(SELECT r.cd_desc FROM v_codes r
WHERE r.cd_type = 'TB045'
AND r.cd_value LIKE :plant || '%'
AND instr(r.cd_value, '-8') > 0 -- or other reliable marker for scrap if available
AND rownum = 1) AS SCRAP_MATERIAL

And in the node/oracledb bind creation, pass plant as bind: { plant: data.PLANT }

If you have a defined v_codes.cd_value format (for example: "0780-8-..."), use a concrete LIKE:
AND r.cd_value LIKE :plant || '-8%'

Notes:

- Confirm cd_value format with data dictionary or with "kakoli ma'am" before finalizing the LIKE pattern.
- Keeping rownum=1 ensures a single value is returned. If multiple matches are valid, add ordering logic.

CHANGESET 4 — LD11/LD10: Align Epoxy Gun (left) and Flow Rate (right)

Files:

- [`LDPIS-Frontend/src/views/Mill/LD11S001.jsx:1522`](LDPIS-Frontend/src/views/Mill/LD11S001.jsx:1522)
- [`LDPIS-Frontend/src/views/Mill/LD10S001.jsx:1302`](LDPIS-Frontend/src/views/Mill/LD10S001.jsx:1302)

Problem: EPGUN_x and FLWRATE_x columns lack hozAlign settings. Requirement: Epoxy Gun reading left aligned; Flow Rate right aligned.

Apply the following change for all EPGUN\_ columns (example column object):

// Epoxy Gun column example
{
title: "EPGUN_1",
field: "TBP_EPGUN_1_110",
editor: "input",
hozAlign: "left",
// keep other props as-is
}

And for Flow Rate columns:

// Flow Rate column example
{
title: "FLOW_RATE_1",
field: "TBP_FLWRATE_1_110",
editor: "input",
hozAlign: "right",
formatter: "money", // if numeric formatting desired
}

Notes:

- Add hozAlign: "left" to every EPGUN*\* entry and hozAlign: "right" to every FLWRATE*\* entry in the columns arrays.
- You can apply this change with a find/replace of each column template or programmatically adjust the column definitions before Tabulator init if the app generates those lists.

CHANGESET 5 — LD12 (and other screens): Restrict editing when RESULT != 'OK'

File examples:

- [`LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1615`](LDPIS-Frontend/src/views/Mill/LD12S001.jsx:1615)

Requirement: If Result is NOT OK (for example value 'NOT OK' or 'NG'), then LENGTH and Mass should not be changeable and Coating Weight/Thickness should not be add/modified.

Tabulator supports editable as function(cell). Apply the following pattern to LENGTH, PIPE*WEIGHT, COAT_WT and THK*\* columns:

editable: function(cell) {
const row = cell.getRow().getData();
const resultValue = (row.RESULT || row.Result || row.LOM_STATUS) || '';
// allow edits only when resultValue indicates OK
return resultValue.trim().toUpperCase() === 'OK';
}

Example integration for a column (LENGTH):
{
title: 'LENGTH',
field: 'LOM_LENGTH',
editor: 'input',
editable: function(cell) {
const r = cell.getRow().getData();
return (String(r.RESULT || r.Result || '')).toUpperCase() === 'OK';
}
}

Notes:

- Apply same editable function to THK_W1..THK_B6, COAT_WT, PIPE_WEIGHT, and any save-relevant fields.
- Confirm actual RESULT field name and values (OK, NOT OK, NG, HOLD) and align string checks accordingly.

CHANGESET 6 — 120 GR/GT LGORT mapping (H001 -> AP01)

Files to inspect (search):

- [`LDPIS-Backend/src/routes/LD12S001Route.ts`](LDPIS-Backend/src/routes/LD12S001Route.ts)
- Any SAP outbound mapping utilities: [`LDPIS-Backend/src/utils/soapHandeler.ts`](LDPIS-Backend/src/utils/soapHandeler.ts) and PL/SQL procedures invoked (LDPDBA.LD12B001 etc.)

Action:

- Search for string 'LGORT' or the hardcoded 'H001' across backend repository. Update mapping logic for GR/GT flows of plant 0780 so that LGORT value becomes 'AP01'.

Example change when constructing SAP payload (pseudocode):
payload.LGORT = (procType === 'GR' || procType === 'GT') ? 'AP01' : payload.LGORT;

Notes:

- If LGORT is computed in the PL/SQL (LD12B001), coordinate with DBA/PLSQL owner to update logic to return AP01 for the GR/GT case.
- Add unit tests or logging to confirm LGORT value is now AP01 for test runs.

CHANGESET 7 — LD09: Merge Fill Data and Filter UI

File:

- [`LDPIS-Frontend/src/views/Mill/LD09S001.jsx:571`](LDPIS-Frontend/src/views/Mill/LD09S001.jsx:571)

Recommendation:

- Instead of two separate panels, render a single Card or Paper that contains both filter controls (pipeNo, date range, order) and the Fill Data actions (Fetch / Clear). Move the fill-data grid immediately below those controls inside the same container.

Example JSX (high-level):

<div className="controlsCard">
  <div className="filtersRow"> // existing filter inputs </div>
  <div className="actionRow"> // existing Fill Data buttons </div>
  <div id="TableContainer"> // grid container </div>
</div>

Notes:

- This change is primarily a JSX layout change. No business logic changes required.
- Update CSS if spacing needs adjusting.

CHANGESET 8 — LD11: Ensure Fill Data grid contains 15 rows in single scroll

File:

- [`LDPIS-Frontend/src/views/Mill/LD11S001.jsx:304`](LDPIS-Frontend/src/views/Mill/LD11S001.jsx:304)

Recommendation: set Tabulator table height to show exactly 15 rows without pagination using a fixed pixel height (rowHeight _ 15). If your rowHeight is ~34px, height ~= 15 _ 34 = 510px.

Example change in Tabulator init options:

const table = new Tabulator('#AppTableContainer', {
// ...existing options...
height: 510, // show 15 rows in one scroll
virtualDom: true,
// other options unchanged
});

If your app has variable row height, calculate the height dynamically and set before initializing the table.

Notes:

- Test on various screen sizes to confirm the grid shows 15 rows and scrolls as required.

ADDITIONAL RECOMMENDATIONS & SECURITY

1. Use binds in backend SQL calls instead of template string interpolation for numeric inputs (getCoatWt currently uses string interpolation). This prevents SQL injection and decimal formatting issues. Example for [`LDPIS-Backend/src/repository/LD12S001Query.ts:524`](LDPIS-Backend/src/repository/LD12S001Query.ts:524):

// bad:
const sql = `select LDPDBA.f_get_coat_wt('0780','${W1}',...,'${LENGTH}','${OD}') COAT_WT from dual`;

// better (use binds in oracledb):
const sql = `select LDPDBA.f_get_coat_wt(:plant, :w1, :w2, :w3, :w4, :w5, :w6, :w7, :w8, :w9, :w10, :w11, :w12, :length, :od) COAT_WT from dual`;
const binds = { plant: data.PLANT || '0780', w1: W1, ..., length: LENGTH, od: OD };

2. Confirm unit conventions for weight (kg vs mt). When summing metal weight and coat weight, ensure both are in same unit.

3. For LGORT change that requires PL/SQL modification, coordinate channel with DB team.

WHAT I WROTE TO THE REPO

I created this implementation plan file at: [`LDPIS-Backend/src/plans/LD09-13_implementation_plan.md:1`](LDPIS-Backend/src/plans/LD09-13_implementation_plan.md:1).

NEXT STEP

Approve these diffs and I will prepare exact apply-ready patch files (or apply them in code) in the next step.
