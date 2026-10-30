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
