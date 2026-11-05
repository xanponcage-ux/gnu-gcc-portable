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
1.In Ld14S001 just like in LD10S001 we do:
    a> mark numeric and text fields : Pipe Surface Temp,Roughness(Rz Um),Degree Of Cleanliness,Dust Level are all numeric
    b>error message given by api should be handled and cleared exactly like in LD10S001 like we do it in a label at bottom
2.in LD15S001 just like in LD10S001 we do:
    a>error message given by api should be handled and cleared exactly like in LD10S001 like we do it in a label at bottom
    b>just like in LD10 when we change a field value the table gets cleared do similar here
```


## 2026-11-05 — LD14S001 and LD15S001

LD14 marks the four specified measurements as numeric and distinguishes text fields. Both screens show fill/save API errors below the results grid. Dismiss the message, edit the form, clear it, or retry to clear the previous error. LD15 form edits invalidate the filled rows; use Fill Data again before saving. The transfer contains only the two frontend files.

```powershell
$repo = "D:\Office Work\Striver\gnu-gcc-portable"
git -C $repo pull --ff-only origin main
& "$repo\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-11-05" -CheckOnly
& "$repo\LDPIS\Apply-LD150-To-Office.ps1" -ChangeSet "2026-11-05"
```
