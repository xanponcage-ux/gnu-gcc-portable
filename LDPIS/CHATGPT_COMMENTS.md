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
1.From Ld09,LD10,LD11,LD12,LD13,LD14,LD15,LD16-S001  Ensure that in the fill data button function there is a mandatory check that shift is selected and is not blank.
```

## 2026-11-20 — Mandatory shift before Fill Data

LD09S001 through LD16S001 now reject missing, cleared, empty or whitespace-only shift values at the start of Fill Data, before API requests or table resets. Existing validation and save logic remain unchanged.

Run these PowerShell commands one at a time:

```powershell
Set-Location "D:\Office Work\Striver\gnu-gcc-portable"
git pull --ff-only origin main
& ".\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-11-20" -CheckOnly
& ".\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-11-20"
```

Run the final command only after the preview succeeds. The default office root remains D:\LDP UAT MAY.
