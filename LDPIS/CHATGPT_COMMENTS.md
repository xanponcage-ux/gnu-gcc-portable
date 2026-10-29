# ChatGPT Comments — LDPIS

This file is the shared scratchpad for ChatGPT instructions, runnable commands, one-off scripts, SQL, PowerShell, Git commands, and other code related to the LDPIS project that is **not itself part of the requested application/source-code change**.

## Working rule

- Actual requested LDPIS source changes should be made in the appropriate project files.
- Any extra command/code that the user needs to run manually should be written here.
- Prefer appending a new dated/topic section instead of overwriting older useful instructions.
- Keep commands copy-paste ready and mention where they should be run when relevant.
- Work directly on `main` for this rough GitHub repo unless the user explicitly asks otherwise; do not create extra branches by default.

---

## 2026-10-06 — File created

Use this file for future LDPIS-related runnable instructions and supplementary code.

---

```
Prompt:
implement the following points.
1.IN LDSM012-> beside Batch Age(Days) make a column whose value depends on Batch Age and is as follows:
    · 0-30 days
    · 30-60 days
    · 60-90 days
    · Above 90 days
2.Add a column in LDSM012 where Name of column should be “Free Stock category”
    It should be either of the three tags for which logic is given below -
    · Check NON ISI tag in Grade/TDC and mark them with “Non IS”
    · Search for “DWG” or “RGD” in material description and tag it downgrade
    · Remaining – ETO/Free Stock
3.130 Field No. should be in ascending order at 140.(put order by in fill data query)
4.130 field no. add at Pipe Decision Screen Ext and Int. (LDLTS006 & LDLTS010 ) in ascending order .
5.In LD16S001 make DFT F1 and DFT T1 will be mandatory fields
```

## 2026-10-29 — Implemented inventory categories, field order and DFT requirements

- LDSM012: added **Batch Age Band** beside Batch Age(Days), and **Free Stock category**. Both are stored in grid row data for filtering and Excel export.
- Age boundaries: 0 through 30 → 0-30 days; over 30 through 60 → 30-60 days; over 60 through 90 → 60-90 days; over 90 → Above 90 days. Missing, invalid or negative ages remain blank. Corrected the existing colour boundary at day 61.
- Free-stock priority: case-insensitive NON ISI in Grade/TDC (also NON-ISI/NON_ISI) → **Non IS**; otherwise DWG or RGD anywhere in Material Description → **Downgrade**; otherwise **ETO/Free Stock**.
- LD14S001: fill-data query now fetches the latest station-130 field number for the batch/plant and orders by that field ascending, with nulls last and batch number as the tie-breaker. The existing Field No column receives this value.
- LDLTS006/LDLTS010: reused the existing latest station-130 field-number lookup, labelled it **130 Field No.**, and ordered query results by it ascending, nulls last, then batch number.
- LD16S001: DFT F1 and DFT T1 have mandatory markers, form checks, per-selected-row save checks and backend checks before temporary insertion. This is a presence requirement; no new numeric range was introduced.

### Office transfer — run in the VS Code PowerShell terminal

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

The script defaults to bundle `2026-10-29`, with destination `D:\LDP UAT MAY`. Earlier bundles remain selectable using `-ChangeSet`. It checks all patches before writing, backs up existing files and supports the new inventory helper. No Azure commit or push is performed. Restart/rebuild the frontend and backend using the normal office workflow.

### Verification

```powershell
# From the rough repository root, Node 22.6 or later:
node LDPIS/tests/oct29-changes.cjs
```

Focused checks cover age boundaries, category priority/case/nulls, latest field-number queries and ordering, and backend rejection of missing DFT before writes. Source/PowerShell syntax and LF/CRLF patch/repeat checks were also run. Complete application builds, browser/export behaviour, live Oracle and Windows PowerShell execution still require office verification.
