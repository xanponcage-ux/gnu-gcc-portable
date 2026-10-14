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
