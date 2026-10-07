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
1.In screen LD11S001 >> in display grid 2 fields are same. Pipe Temp Before FBE and Pipe Temp FBE Induction. Remove one field if so
2.Coating wt field should not be editable in screen 120(LD12S001)
3.Screen 130 >> Field no should be mandatory in each pipe (LD13S001)
4.LD09S002-Receive at coating screen -Implement pipe or  Order and Item pairfilter in the same way as is done in LD10S001 (ask in case of doubts)
5.Provide no of successful pipes count in screen 90-120 on "Save" button (in case of success along with success message also provide number of success)(Ld09S001,LD10S001,LD11S001,LD12S001)
6.s140,s150,s160 - provide "field no" column beside the "ASL No" field(LD14S001,LD15S001,LD16S001)
```



---

## 2026-10-07 — Six requested screen changes implemented

1. LD11S001: removed duplicate FBE Induction display column; retained the saved Before FBE value.
2. LD12S001: Coating WT is read-only; thickness-driven calculation remains enabled.
3. LD13S001: Field No is required for every selected pipe, checked in the UI and backend before writes.
4. LD09S002: Pipe No dropdown or complete Order No + Order Item pair, matching LD10S001 switching behavior. Selecting a pipe fills its order/item; editing either switches to pair search. Filters use Oracle binds and remain plant-scoped.
5. LD09S001–LD12S001: Save reports the successful pipe count. LD09–LD11 now count individual procedure outcomes and stop on failure; confirmed successes are removed from a partial-save grid to avoid retrying them.
6. LD14/LD15: Field No immediately follows ASL No. LD16 already had this column; its missing query value is now supplied. Field No comes from the latest stage-130 (E) record, scoped by pipe and plant. LD150 rework preserves its saved values.

### Transfer to the office Azure working copies

Run in **Windows PowerShell or the VS Code PowerShell terminal** on the office laptop. The rough repo is `D:\Office Work\Striver\gnu-gcc-portable`; the destination root is `D:\LDP UAT MAY`, containing `LDPIS-Backend` and `LDPIS-Frontend`.

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Run the final command only if the preview passes. The execution-policy setting lasts only for this PowerShell session. If scripts remain blocked, run `Get-ExecutionPolicy -List` and share the output.

The same Apply-LD150 file now transfers all six requests. It uses bundled patches, adds the earlier LD150 update if missing, checks all files on temporary copies, skips already-applied changes, preserves unrelated office edits, and makes backups. A conflict stops before office writes. It does not stage, commit, or push to Azure. Keep the `transfer/2026-10-07` folder with the script; pulling the rough repo brings both down.

Restart the backend to register the new receive-screen pipe-list route, then review the office diffs and test the screens. Oracle procedures and live UAT execution still require the office environment.

### Verification performed

- Node handler tests passed for save counts, partial/failed/empty saves, missing Field No before writes, pipe/order filter switching and SQL binds, and LD120 exception counts.
- Existing LD150 rework regression tests passed.
- Transfer patches reproduced the expected files from both prior-update states, with Windows CRLF files, on repeat runs, and with an unrelated office edit. Conflicting patch content was rejected.
- No new JSX/TypeScript parse errors compared with the baseline. Full application builds, native Windows PowerShell execution, and Oracle/UAT testing were not available here.

Optional regression commands from the rough repository root (Node 24+):

```powershell
node LDPIS/tests/ld09-ld16-changes.cjs
node LDPIS/tests/ld150-rework.cjs
```
