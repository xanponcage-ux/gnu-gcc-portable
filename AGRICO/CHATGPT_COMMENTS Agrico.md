# ChatGPT Comments — Agrico

This file is the shared scratchpad for ChatGPT instructions, runnable commands, one-off scripts, SQL, PowerShell, Git commands, and other code related to the Agrico project that is **not itself part of the requested application/source-code change**.

## Working rule

- Actual requested LDPIS source changes should be made in the appropriate project files.
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
      (HOST=176.0.7.18)
      (PORT=1521)
    )
    (CONNECT_DATA=
      (SERVER=dedicated)
      (SERVICE_NAME=EPATEST)
    )
  )


UI:  https://mesdev.corp.tatasteel.com/agrigomes
API:  https://mesdev.corp.tatasteel.com/agriapi

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
