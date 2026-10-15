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

## 2026-10-15 — Implemented LDLTS011: Free Stock to Rework

- Added Quality menu entry and frontend route `/LDLTS011`, using LDLTS010's table layout, Batch/Mother Batch filters, ASL No and Field No columns, selection and export.
- Commented out the Order and Item filter controls; they are not sent as filters.
- Fetches only plant `0780`, status `2F` or `8F`, matching the plant in the requested update. The plant list uses only the user's existing permitted `0780` entry.
- Save moves selected batches to `RC` using the supplied update, including Oracle `USER`, timestamps, original status prefix and `F_GET_NEXTPROC(..., '2')`. A status check also applies at save time to prevent updating stale/already-moved batches.
- No PASS decision or LDLTB005 call is used on the new screen. Empty/invalid selections are rejected, duplicate batches are updated once, and per-batch saved/failed results are reported. The existing database helper commits per batch, so partial successes remain committed and are clearly listed.
- Registered authenticated backend endpoints `/api/LDLTS011/getcoils` and `/api/LDLTS011/saveData`. Existing LDLTS010 is unchanged.
- The prompt's point `2.` was blank; no additional change was inferred.

### Run in the office VS Code PowerShell terminal

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

The default bundle is now `2026-10-15`. Destination remains `D:\LDP UAT MAY`; pass `-OfficeRoot "your destination root"` to both script calls if needed. Earlier bundles remain selectable with `-ChangeSet`.

The transfer contains five new application files and two route-registration edits. The script now supports new files, rejects conflicting existing files, checks all patches before writing, backs up existing files and removes newly created files during rollback. It performs no Azure commit or push.

After transfer, restart/rebuild the backend and frontend using your normal office workflow. Open **Quality → Free Stock to Rework**. The screen uses the existing screen-authorization mechanism with page ID `LDLTS011`; provision that screen and its intended user access through your normal authorization administration if not already present. No permission bypass or guessed database permission inserts are included.

### Validation

```powershell
# From the rough repository root, with Node 22.6 or later:
node LDPIS/tests/ldlts011.cjs
```

Checks cover fixed plant/status, bound batch filters, update clauses, invalid and duplicate selections, stale batches, partial database failures, and route registration. New/existing transfer patches were checked with LF and CRLF baseline files, including repeat-application detection. JSX, TypeScript and PowerShell syntax were parsed. Live Oracle behavior, complete application builds and Windows PowerShell execution still require office verification.
