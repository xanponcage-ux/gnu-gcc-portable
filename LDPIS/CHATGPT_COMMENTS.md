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
1.LD14S001–LD16S001: Save reports the successful pipe count. LD09–LD11 now count individual procedure outcomes and stop on failure; confirmed successes are removed from a partial-save grid to avoid retrying them.
2.IN LD16S001 data for Internal Field No will be allotted same as field no (during fill data)and make it mandatory by giving check in save button (can be edit and cannot be null)
3.Internal & External pipe decision(LDLTS006 and LDLTS010) should have order item filter and field no should be beside ASL no
```
