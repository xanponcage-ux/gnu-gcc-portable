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


---

## 2026-10-14 — Latest prompt implemented

1. **LD14S001–LD16S001 Save:** report the number of successfully saved pipes. Counts come from each pipe's procedure result, not the last result or a cumulative insert count. Processing stops at the first failure and reports successful, failed, and not-processed counts. On a partial save, only confirmed successful rows are removed; failed and unprocessed rows retain their edits for retry. LD16 still performs its existing scrap/lab/field steps before its procedure, checking each current pipe's inserts.
2. **LD16S001 Internal Field No:** Fill Data copies each pipe's Field No into its Internal Field No. Edit it in the `Int. Field No *` grid column. Blank/null/whitespace values are rejected on Save and again by the backend before any selected pipe is written. The former shared form field was removed because the default is now per pipe.
3. **LDLTS006 / LDLTS010:** added independent optional Order No and Order Item filters, combined with the existing plant, batch and mother-batch filters. Values are passed as Oracle binds. Added ASL No and Field No as adjacent read-only columns after Batch ID. ASL No comes from the latest process-8 record; Field No uses the latest process-E (130) record, as in LD14–LD16, scoped to pipe and plant. Existing EQ/HQ eligibility and decision procedures remain in place.

### Apply this update to the office working copies

Run in **Windows PowerShell or the VS Code PowerShell terminal** on the office laptop:

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
```

Only if the preview says all checks passed, run:

```powershell
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

The existing script defaults to the **2026-10-14 bundle (10 application files)**. It targets `D:\LDP UAT MAY\LDPIS-Backend` and `D:\LDP UAT MAY\LDPIS-Frontend`, checks temporary copies first, preserves unrelated edits, skips applied patches, creates backups and attempts rollback on copy failure. Conflicts stop before office writes. No Azure commit or push is performed. Restart the backend and reload the frontend after applying.

This is an incremental update against the current repository source. If an office file differs in a changed area, share the conflict output instead of overwriting that file.

The earlier bundle remains available explicitly (only if needed):

```powershell
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-10-07" -CheckOnly
# After that preview passes:
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-10-07"
```

### Verification

- Actual handlers tested with mocked dependencies: all-success, procedure failure, zero-row insert, exceptions after a previous success, LD16 scrap/lab/field failure, and retry row retention.
- LD16 per-pipe Fill Data defaults, edited values, and blank/null/whitespace validation tested in UI and backend.
- Both decision screens' filter payloads, filter reset, Oracle binds, and Field No/ASL No queries checked.
- Current transfer patches checked against the baseline, already-applied files and CRLF files; unrelated edits were retained and conflicts rejected.
- Modified TypeScript, JSX and PowerShell parsed with no new syntax errors. Native Windows PowerShell execution, full application builds, and live Oracle/UAT were not available here.

Optional regression test from the rough repository root, with Node 24+:

```powershell
node LDPIS/tests/oct14-screen-changes.cjs
```
