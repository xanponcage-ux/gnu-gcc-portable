# ChatGPT Comments — Agrico

This file is the shared scratchpad for ChatGPT instructions, runnable commands, one-off scripts, SQL, Windows CMD, Git commands, and other code related to the Agrico project that is **not itself part of the requested application/source-code change**.

## Working rule

- Actual requested Agrico source changes should be made in the appropriate project files.
- Any extra command/code that the user needs to run manually should be written here.
- Prefer appending a new dated/topic section instead of overwriting older useful instructions.
- Keep commands copy-paste ready and mention where they should be run when relevant.
- Work directly on `main` for this rough GitHub repo unless the user explicitly asks otherwise; do not create extra branches by default.

---

## 2026-10-06 — File created

Use this file for future Agrico-related runnable instructions and supplementary code.

---

```
Prompt:

We are starting a new project AGRINXT for agrico plant (4603) and for that i copied TUBENXT MES for KHOP and hosur tubes (0788/0789) code base .
Nomenclature:
1.Screens: TTSM will become AGSM and so on.
2.Tables and procedures: all tables and procedures and functions will have _AG as suffix.
For now we need to do following:
1.Configure Db tns and application urls:
EPATEST=
  (DESCRIPTION=
    (ADDRESS=
      (PROTOCOL=TCP)
      (HOST=<office Oracle host>)
      (PORT=1521)
    )
    (CONNECT_DATA=
      (SERVER=dedicated)
      (SERVICE_NAME=EPATEST)
    )
  )


UI:  <office UI origin>/agrigomes
API:  <office UI origin>/agriapi

schema:AGRIDBA

2. We need following screens:
1.LOGIN PAGE (image is replaced with TATA Agrico logo)
Planning module:
2.RM RECEIVEING SCREEN COPY FROM (TSM TUBES but without entry columns as no entry required)(TTSM003)
3.Production Recording screeen ->YET TO BE DISCUSSED
Reports:
4.PRODUCTION REPORT similar to (TTSM006)
5.IN transit/RM recieiving Report
6.Inventory Screen (TTSM012)
```

## 2026-11-02 — Transfer AGRINXT changes to the office repositories

Use Windows Command Prompt with Git and Node.js on PATH. Run from the root of your rough GitHub checkout. The destination defaults to `D:\AGRICO`, containing `Agrico_NODE` and `Agrico_UI`.

```cmd
git pull --ff-only origin main
AGRICO\Apply-AGRINXT-To-Office.cmd check
AGRICO\Apply-AGRINXT-To-Office.cmd apply
git -C "D:\AGRICO\Agrico_NODE" status --short
git -C "D:\AGRICO\Agrico_UI" status --short
```

Check previews every patch on temporary copies. Apply repeats the checks, backs up the originals, and updates the working files. It skips patches already applied. Review and test the changes before committing in each office repository.

AGSM003 receives selected in-transit material. AGSM004 is the read-only receiving report, AGSM006 the production report, and AGSM012 inventory. Use the existing screen authorization administration for these IDs. Production recording awaits the process definition.

Configure AGRINXT_DB_CONNECT_STRING on the Node host or configure its EPATEST alias. Set AGRINXT_UI_ORIGIN to the office browser origin. Serve the UI under /agrigomes and proxy /agriapi/ to Node with the prefix stripped. For local UI development REACT_APP_AGRINXT_API_URL overrides the same-origin default. A fresh build of the rough repository requires the existing office login encryption input in REACT_APP_AGRINXT_LOGIN_KEY. The office transfer preserves the existing login input. REACT_APP_AGRICO_LOGO_URL can point to an internally hosted logo.
