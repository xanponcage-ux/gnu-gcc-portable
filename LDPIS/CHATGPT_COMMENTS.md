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
1.create a screen LDLTS011(name: Free Stock to Rework)just like LDLTS010 both  the front end and back end , where data of status 2F and 8F will be fetched and upon save for each batch we execute following update query:
UPDATE V_LDP_PRODN
SET    LOM_CD_STATUS    = 'RC',
       LOM_REC_UPD_DT   = SYSDATE,
       LOM_REC_UPD_USR  = user,
       LOM_DT_PIECE_UPD = SYSDATE,
       LOM_PASSED_PROC  = LOM_PASSED_PROC || substr(LOM_CD_STATUS,1,1),
       LOM_CD_CURR_PROC = substr(LOM_CD_STATUS,1,1),
       LOM_CD_NEXT_PROC = ((select F_GET_NEXTPROC(LOM_PLANNED_PROC, LOM_PASSED_PROC || substr(LOM_CD_STATUS,1,1), '2') as nxtproc from dual))
WHERE  LOM_ID_BATCH = :TBP_BATCH_NO
AND    LOM_CD_EPA   = '0780'

Also, in front end just comment out he order and the item filter as not needed
2.
```
