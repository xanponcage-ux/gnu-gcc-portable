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

## 2026-10-06 — PowerShell script blocked during LD150 transfer

The error means PowerShell is blocking scripts; the transfer hasn’t started.

Run these two commands in the same PowerShell window:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

This setting lasts only until you close that window; it doesn’t permanently change your laptop’s policy.

If it still fails, run this and send the output:

```powershell
Get-ExecutionPolicy -List
```
