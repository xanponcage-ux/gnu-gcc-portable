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
1.in LD12S001 if alreadyExists is false then if   row.TBP_SAMPLE_10     is not null  and row. tbp_prod_date from getfilldata api is same as SHIFT_DATE then lab test and field test will remain uneditable and tag will also be uneditable and will assume the vaue of row.TBP_SAMPLE_10
2.in LDSM012 in getInventoryData if no stock type is selected the two different queries both(Normal Inventory and RM WITHOUT INSPECTION inventory) will be run and will be union
```

## Implemented — 14 October 2026 (evening)

- LD12S001: for a new row (`alreadyExists === false`), a non-null `TBP_SAMPLE_10` and production date equal to `SHIFT_DATE` lock Tag, Lab Test and Field Test. Tag retains the exact returned sample value. Calendar-day comparison accepts ISO and DD-MON-YYYY/DD-MON-YY dates. Other new-row fields keep their existing editability; existing-record behavior is unchanged.
- LDSM012: an empty, whitespace-only, null or omitted stock type combines normal inventory and RM without inspection using SQL `UNION`, with one final plant/batch sort. Existing query filters and explicit stock-type selections are preserved. The RM without inspection source has no mill column, so its existing handling of the mill filter remains unchanged.
- `Apply-LD150-To-Office.ps1` now defaults to bundle `2026-10-14-evening`, containing only these two application-file patches. Previous bundles remain selectable with `-ChangeSet 2026-10-14` or `-ChangeSet 2026-10-07`.

### Office PowerShell commands

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Default destination: `D:\LDP UAT MAY`. Use `-OfficeRoot "your destination root"` on both script calls to override it. The script checks every patch on temporary copies before writing, detects already-applied patches, preserves unrelated edits, and creates backups. It does not commit or push to Azure.

Validation: `node LDPIS/tests/oct14-evening.cjs` tests sampling date conditions, lock/edit callbacks, inventory selections, SQL union and filter bind coverage. Transfer patches were checked with LF and Windows CRLF files and reverse checks for repeat application. Live Oracle execution and Windows PowerShell execution require office verification.
