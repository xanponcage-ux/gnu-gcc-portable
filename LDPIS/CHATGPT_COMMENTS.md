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
