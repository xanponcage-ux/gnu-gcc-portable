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
1.Implement excel upload in following screens like that done in LD08S001 but make sure that one screen is done   and take confirmation before starting with the next(in case of any doubt please ask):
    a>LD10S001
    b>LD11S001
    c>LD13S001
```

## 2026-10-30 — LD10S001 Excel upload completed

Implemented the first screen only, per the prompt above. LD11S001 and LD13S001 are pending confirmation before starting the next screen.

### Using LD10S001

1. Download Template from LD10S001. Enter pipe numbers as Excel Text to preserve leading zeros and long identifiers.
2. Upload an `.xlsx` or `.xls` workbook. Only the first worksheet is read. `Pipe_No` is required; inspection columns are optional. Headers are case-insensitive. Duplicate headers, unknown columns, duplicate pipe numbers, and numeric pipe identifiers are rejected.
3. Set the shared production start/end dates and shift on screen. Nonblank Excel inspection values override screen defaults; blank cells use screen defaults. Numeric zero is preserved.
4. Click Fill Data. Excel pipe numbers take priority over Pipe/Order filters. Each pipe is looked up at the existing BC stage; missing/ineligible pipes are skipped and listed. Multiple matching records or failed lookups stop the fill. Database material, order, and routing identifiers are preserved.
5. Review the grid, select rows, and save using the existing action. Upload and Fill Data do not save automatically. Visual inspection, degree of cleanliness, remarks, inspector name and result must be present after merging. Result must be OK or NOT OK. These validations run again before saving selected rows.

Template columns:

```text
Pipe_No, RESULT, REMARKS, INSP_NAME, PTEMP_BEFORE_BLAST, PTEMP_BEFORE_ACID_WASH,
PH_BEFORE_ACID_WASH, PH_AFTER_ACID_WASH, VISUAL_INSP, DWELL_TIME, PRESS_DM_WASH,
DM_WATER_FLOW_RATE1, DM_WATER_FLOW_RATE2, DM_WATER_FLOW_RATE3,
PREHEAT_AIR_AFTER_WATER_WASH, REL_HUMID, AMB_TEMP, DEW_POINT_TEMP,
PIPE_SURFACE_TEMP, DEGREE_CLEANLINESS, ROUGHNESS, DUST_LEVEL_RATING,
DUST_LEVEL_CLASS, SALT_CONTAMIN, PHOS_ACID_MATERIAL, PHOS_ACID_GRADE, PHOS_ACID_BATCH
```

### Apply to the office projects

Run in Windows PowerShell. The script now defaults to `2026-10-30-ld10`, with patches for the LD10 frontend, new upload helper, and backend lookup query. Previous bundles remain selectable with `-ChangeSet`.

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Default destination is `D:\LDP UAT MAY`, containing `LDPIS-Backend` and `LDPIS-Frontend`. If needed, append `-OfficeRoot "your destination root"` to both script invocations. The script checks temporary copies before applying, creates backups, and detects already-applied patches. It does not commit or push to Azure.

### Verification

Focused regression tests cover parsing, leading zeros and numeric zero, duplicate rejection, protected database fields, required values, query binds, and the actual multi-pipe Fill Data path including skipped pipes. All three transfer patches passed apply, content comparison, and reverse checks against LF and CRLF copies.

```powershell
# From the rough repository root; test harness requires Node 22.6 or newer.
node LDPIS/tests/ld10-excel-upload.cjs
```

Full application build, browser workbook upload/save against Oracle, and Windows PowerShell execution remain to be verified in the office environment.

## 2026-10-30 — LD11S001 Excel upload completed after confirmation

The user confirmed proceeding with LD11S001. LD13S001 remains pending confirmation.

LD11 now provides Download Template, Excel upload, Clear Upload and lookup status. Use the downloaded template and store Pipe_No as Excel Text. Only the first worksheet is read. Blank inspection cells use screen defaults; nonblank cells override them, including numeric zero. Headers are case-insensitive; unknown/duplicate headers, numeric pipe identifiers and duplicate pipes are rejected.

The template includes the existing coating inspection fields, material manufacturer/grade/batch fields, A1–A12 and B1–B12 epoxy readings, FA1–FA12 and FB1–FB12 flow readings, RESULT, REMARKS and INSP_NAME. Database identity/order/routing fields cannot be imported. Column names match the grid data fields; use the template headers unchanged.

Set shared production start/end dates and shift, upload the workbook, then click Fill Data. Excel pipes take priority over Pipe/Order filters. Lookup uses the existing CC status and preceding process 1 eligibility. Missing/ineligible pipes are listed and skipped. Failed lookups or multiple matching database records stop the fill and leave the grid empty. Inspector, remarks and result are required after merging; result must be OK or NOT OK. Inspector is visible/editable in the grid and saved per row. Existing result-based grid editing rules remain in effect. Review and select rows, then use the existing Save action; uploading/filling does not save automatically. Mandatory values are rechecked before save.

### Office commands for LD11

The apply script now defaults to `2026-10-30-ld11`. Run these commands in Windows PowerShell:

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Destination defaults to `D:\LDP UAT MAY`; append `-OfficeRoot "your destination root"` to both invocations if needed. This bundle changes only LD11 application files. If LD10 has not yet been transferred, run the check and apply commands separately with `-ChangeSet "2026-10-30-ld10"`. Earlier bundles remain available. The script checks temporary copies, backs up changed files and detects repeat application; it does not commit or push to Azure.

### Verification

```powershell
# From the rough repository root; test harness requires Node 22.6+.
node LDPIS/tests/ld11-excel-upload.cjs
```

Passed: parser/merge validation, text identifiers and zero values, protected database fields, bound SQL filters, actual multi-pipe fill including missing/ambiguous/failed lookups, and actual save payload with per-row inspector and epoxy/flow values. Source syntax checks passed. All three transfer patches passed apply/content comparison/reverse checks for LF and Windows CRLF files. Full application build, browser upload/save against Oracle and native Windows PowerShell execution remain office verification tasks.

## 2026-10-30 — LD13S001 Excel upload completed after confirmation

The user confirmed proceeding with LD13S001. All three requested screens (LD10, LD11, LD13) now have Excel upload implementations.

### LD13 usage

Download Template, populate it, upload an `.xlsx` or `.xls` workbook, then click Fill Data. Only the first worksheet is read. Pipe_No must be Excel Text; use Text for Field No too if leading zeros matter. Unknown/duplicate headers, duplicate pipes and numeric Pipe_No cells are rejected. Nonblank inspection cells override screen defaults; blank cells use those defaults, and numeric zero is preserved.

Template columns:

```text
Pipe_No, FIELD_NO, REMARKS, INSPECT_NAME, RESULT,
CUT_BACK_F_END, CUT_BACK_T_END, EPOXY_BAND_F_END, EPOXY_BAND_T_END,
CUT_ANGEL_F_END, CUT_ANGEL_T_END, HOLIDAY_TEST, RM_G1, RM_G2, RM_G3, RM_G4,
FINAL_STATION
```

Set production start/end dates, final inspection date and shift on screen; these retain the existing shared screen flow. Excel pipes take priority over Pipe/Order filters. Each pipe is looked up at EC status using the existing process 1 query. Missing/ineligible pipes are skipped and listed. A failed lookup or multiple database matches stops the fill and leaves the grid empty. Database-derived Field Test, coat weight, identity, order and routing cannot be overwritten by Excel.

After merging, remarks, inspector, result, holiday test and final station are required. Allowed values match the screen: RESULT = OK; HOLIDAY_TEST = 15_KV_OK or 25_KV_OK; FINAL_STATION = VISUAL_OK, REPAIR or REJECT. Uploaded enum values are normalized to uppercase. Field No can be filled in Excel or edited in the grid, but is mandatory before saving. Review and select rows, then use Save. Upload/Fill Data do not save automatically. Required fields and allowed values are revalidated on save.

Fixed the existing save field-name mismatches: remarks now come from grid REMARKS and inspector from grid INSPECT_NAME. Both screen defaults and Excel values therefore reach the save API correctly.

### Office commands

The script now defaults to `2026-10-30-ld13`, which transfers only LD13 application changes.

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Destination defaults to `D:\LDP UAT MAY`; append `-OfficeRoot "your destination root"` to both invocations if needed. If LD10 or LD11 has not yet been transferred, run the same check/apply commands separately with `-ChangeSet "2026-10-30-ld10"` or `-ChangeSet "2026-10-30-ld11"`. Existing backups, temporary checks and already-applied detection remain available. No Azure commit or push is performed.

### Verification

```powershell
# From the rough repository root; test harness requires Node 22.6+.
node LDPIS/tests/ld13-excel-upload.cjs
```

Passed: parsing/merging, text identifiers, numeric zero, protected fields, mandatory and enum validation, bound SQL filters, actual multi-pipe fill with skipped/ambiguous/failed lookups, and actual save payload mapping including Field No, remarks and inspector. Transfer patches passed apply/content comparison/reverse checks for LF and CRLF. Syntax checks introduced no new parser diagnostics (the JSX parser still reports the pre-existing literal ampersand in a heading). Full application build, browser workbook upload/save against Oracle and native Windows PowerShell execution remain office verification tasks.


