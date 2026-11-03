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
1.in LD01S009 in linking part give excel upload feature in batch filter where user will give batch no and then we fetch batch details based on that .Also, put a check on the LINK button that for all selected rows in batch compare the FG MAT with the FG Material of selected row of Order Details and should be same.Also,enable select all in Batch Details.

2.IN LDSM020 give excel upload (just like in LD10S001 but slight logic modification :) where user uploads rows having data in  following fields where order and item and plant  is mandatory,   for each order and item we fetch the details by calling api of submit button with the corresponding order and item :
ENC_CD_EPA
ENC_ID_ORDER
ENC_NO_ITEM
ENC_SIGNOF_MONTH   (needs to be added to table )
ENC_SIGNOF_QTY      (needs to be added to table )
ENC_INSPECTION_FLAG  (Column name Inspection and only allowed values Y or N)  (needs to be added to table )

give a button beside download upon clicking which an api is called which has an update query which updates the V_END_CUST_ORD_EPA with values of ENC_SIGNOF_MONTH,ENC_SIGNOF_QTY and ENC_GRN_GAP_SIGNOF where given order and item and plant (also any of ENC_SIGNOF_MONTH,ENC_SIGNOF_QTY and ENC_GRN_GAP_SIGNOF which is null or blank will not be updated )
```
