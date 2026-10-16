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
1.in LD0RS002 in the Update FG Material tab give excel upload functionality where user will give in excel batch and final material number ,so we fetch all the data for each batch given they are in WF status and have LOM_SE_UPD_FL = 'Y' and also popolate the material number given in excel.Implement just like it is done in LD08S001.
```

## 2026-10-16 — LD0RS002 Update FG Material Excel upload

Implemented Excel upload and template download in **Update FG Material**, using the existing XLSX library and fetch/merge pattern from LD08S001. The existing API now accepts an optional bound `batchId`; every upload lookup retains both `WF` status and `LOM_SE_UPD_FL = 'Y'`. The normal full-list lookup remains available.

### Using the upload

1. Download the template from the Update FG Material tab.
2. Fill the first sheet with headers **Batch** and **Final Material Number**. Both columns must contain Text cells; the material must be exactly 18 digits. The template preformats 1,000 input rows as Text. If adding more rows, format them as Text too. Numeric cells are rejected because Excel may already have rounded long identifiers; re-enter the original values after changing their format.
3. Choose the `.xlsx` or `.xls` file. The screen fetches eligible data per batch, populates Material No. and runs the existing material validation. Upload does not save anything.
4. Review the loaded rows and the list of missing/ineligible batches. Enter required Comment/Special Comment values according to validation and existing permissions, select rows, and Save.
5. The existing same-attributes save rule is unchanged: selected rows must have the same Material No., thickness, length, surface condition and end finish. Save different groups separately. **Clear Upload / Reload All** restores the normal eligible list.

Identical duplicate batches are loaded once; conflicting duplicate materials or malformed rows reject the file. Fetch/validation failures clear the upload result rather than leaving a partially prepared list. Existing access controls and save procedure are unchanged.

### Office transfer — run in the VS Code PowerShell terminal

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Default bundle: `2026-10-16`. Default office root: `D:\LDP UAT MAY`. Earlier bundles remain selectable using `-ChangeSet`. The script checks all patches before writing, preserves unrelated edits, backs up existing files and supports the new upload helper file. No Azure commit or push is performed. Restart/rebuild the frontend and backend using the usual office workflow after transfer.

### Verification

```powershell
# Run from the rough repository root with Node 22.6 or later:
node LDPIS/tests/fg-material-upload.cjs
```

Focused tests cover headers, text/18-digit preservation, duplicate handling, bound eligible batch lookup, per-batch merge/validation, skipped batches, error handling and no automatic save. JSX/JavaScript/TypeScript/PowerShell syntax checks and LF/CRLF patch application/repeat checks passed. Full application builds, real Excel browser interaction, live Oracle and Windows PowerShell execution remain for office verification.

