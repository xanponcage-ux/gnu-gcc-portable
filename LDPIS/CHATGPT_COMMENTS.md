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
1.in LDP ORDER BOOK(LDSM007) AND ORDER PROGRESS SCREEN(LDSM020) add following columns:
Order Qty.(Sales Unit)	ENC_SALES_QTY
Sales Unit	ENC_SALES_QTY_UOM
Incot	ENC_INCOT
Sold Cust. City	ENC_SOLD_CUST_CITY
Ship Cust. City	ENC_SHIP_CUST_CITY
Ship Cust. Name	ENC_SHIP_CUST_NAME             
Division	ENC_DIVISION                 
Sales Org.	ENC_SAL_ORG               
Ref. Standard	ENC_REF_STANDARD
Ship To Party	ENC_CD_SHIP_TO_PRTY   
Po No.	ENC_PO_NO
Freight Indicator	ENC_FRT_IND
Delivery Date	ENC_DT_DELV
Billing Block	ENC_BILING_BLOCK
Delivery Block	ENC_DELV_BLOCK
```
