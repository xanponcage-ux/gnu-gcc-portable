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

## 2026-10-16 afternoon — Order Book and Order Progress columns

Implemented all requested fields in LDSM007 (LDP Order Book) and LDSM020 (Order Progress), including the existing grid Excel export.

| Column label | Database field |
| --- | --- |
| Order Qty.(Sales Unit) | `ENC_SALES_QTY` |
| Sales Unit | `ENC_SALES_QTY_UOM` |
| Incot | `ENC_INCOT` |
| Sold Cust. City | `ENC_SOLD_CUST_CITY` |
| Ship Cust. City | `ENC_SHIP_CUST_CITY` |
| Ship Cust. Name | `ENC_SHIP_CUST_NAME` |
| Division | `ENC_DIVISION` |
| Sales Org. | `ENC_SAL_ORG` |
| Ref. Standard | `ENC_REF_STANDARD` |
| Ship To Party | `ENC_CD_SHIP_TO_PRTY` |
| Po No. | `ENC_PO_NO` |
| Freight Indicator | `ENC_FRT_IND` |
| Delivery Date | `ENC_DT_DELV` |
| Billing Block | `ENC_BILING_BLOCK` |
| Delivery Block | `ENC_DELV_BLOCK` |

Both LDSM007 query variants are updated. Existing sales quantity/unit, Delivery Date and Ship To Party fields are reused where available; no duplicate grid columns are added. LDSM007 retains its existing API aliases SALES_QTY, SALES_QTY_UOM, DELIVERYDATE and SHIPTOPARTYID. Ship To Party headings now match the requested label. Delivery Date uses DD-MON-YYYY on both reports. Existing filters and joins are unchanged.

### Office transfer — run in the VS Code PowerShell terminal

```powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
```

Default bundle: `2026-10-16-orders`. Destination remains `D:\LDP UAT MAY`. This bundle updates the two report screens and their two query files only. Earlier bundles remain selectable with `-ChangeSet`; use `-ChangeSet 2026-10-16` for the earlier LD0RS002 Excel upload change. The script checks all patches before writing, keeps backups and performs no Azure commit or push. Restart/rebuild the frontend and backend using your normal office workflow.

### Verification

```powershell
# From the rough repository root, Node 22.6 or later:
node LDPIS/tests/order-report-columns.cjs
```

Checks passed for all 15 database-to-grid mappings in both LDSM007 query variants and LDSM020, duplicate column detection, delivery-date formatting and plant binds. Source/PowerShell syntax and LF/CRLF patch/repeat-application checks passed. Full application builds, browser export and live Oracle execution still require office verification.

