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

Run Windows Command Prompt from the source checkout shown below. Node.js reads the transfer bundle from that checkout and applies only its listed changes to the corresponding files in `D:\AGRICO\Agrico_NODE` and `D:\AGRICO\Agrico_UI`. The transfer requires Node.js and uses no Git commands. Use an up-to-date source checkout.

```cmd
cd /d "D:\Office Work\Striver\gnu-gcc-portable"
AGRICO\Apply-AGRINXT-To-Office.cmd check
AGRICO\Apply-AGRINXT-To-Office.cmd apply
```

Check previews the changes. If it reports zero files ready, the office copy already has the changes. Apply repeats the checks, saves backups and updates the office files. Conflicting edits stop the transfer before copying. Run check again to verify.

AGSM003 receives selected in-transit material. AGSM004 is the read-only receiving report, AGSM006 the production report, and AGSM012 inventory. Use the existing screen authorization administration for these IDs. Production recording awaits the process definition.

Configure AGRINXT_DB_CONNECT_STRING on the Node host or configure its EPATEST alias. Set AGRINXT_UI_ORIGIN to the office browser origin. Serve the UI under /agrigomes and proxy /agriapi/ to Node with the prefix stripped. For local UI development REACT_APP_AGRINXT_API_URL overrides the same-origin default. A fresh build of the rough repository requires the existing office login encryption input in REACT_APP_AGRINXT_LOGIN_KEY. The office transfer preserves the existing login input. REACT_APP_AGRICO_LOGO_URL can point to an internally hosted logo.

## Per-prompt changes, following LDPIS

For each prompt, edit the Agrico source files on main and put only that prompt’s changes in a dated transfer bundle. Make the new bundle the default and keep earlier bundles selectable. The office projects already contain the baseline. Run the transfer from the source checkout. Only matching edits in the selected bundle are applied to the office files.

To check this specific prompt after newer bundles are added, run:

```cmd
cd /d "D:\Office Work\Striver\gnu-gcc-portable"
AGRICO\Apply-AGRINXT-To-Office.cmd check --change-set 2026-11-02-agrinxt
```

Use `apply` in place of `check` when the check reports pending changes. If there are zero, this prompt is already applied.

## 2026-11-02 — Agrico Node environments and AGSM filenames

This change set follows the initial Agrico bundle. Run from the source checkout in CMD. It updates Node configuration and performs the screen-file renames in the office copy. The transfer retains a backup of the previous env.ts and stops if that configuration contains unexpected local edits.

```cmd
cd /d "D:\Office Work\Striver\gnu-gcc-portable"
AGRICO\Apply-AGRINXT-To-Office.cmd check --change-set 2026-11-02-agrico-env
AGRICO\Apply-AGRINXT-To-Office.cmd apply --change-set 2026-11-02-agrico-env
```

In Agrico_NODE, keep actual values in ignored files or process variables. For a first local setup, run these commands and edit the files before starting the server.

```cmd
cd /d "D:\AGRICO\Agrico_NODE"
if not exist .env copy .env.example .env
if not exist .env.local copy .env.local.example .env.local
notepad .env
notepad .env.local
set "AGRINXT_ENV=local"
npm run dev
```

Use the existing deployment's JWT, refresh, screen authorization, API, Oracle and SOAP settings in the shared .env. The previous env.ts in the transfer backup contains the old values. For an environment with different credentials, put its values in the corresponding private profile file. Configure the Python URL if that service is used. Keep the existing UI and server authorization keys aligned.

For development use AGRINXT_ENV=dev and .env.dev. For production use AGRINXT_ENV=prd and .env.prd. Each profile has a matching .example. Local and dev support the EPATEST TNS alias or a private Oracle host/service or full descriptor. Set the allowed UI origin on dev and prd. Set the actual production service explicitly. Process variables override the selected file, which overrides the shared .env. Build with npm run build and start the compiled Node server with npm start.

AGSM003, AGSM006 and AGSM012 now use matching filenames through the UI, route, controller, model and query modules. AGSM004 has its own read-only report component and reuses AGSM003's table. Its authorization lookup still uses AGSM004. The active server entry is src/agrinxtserver.ts.
