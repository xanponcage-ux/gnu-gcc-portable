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
1.In LdSM020 the columns should be in this sequence :Plant	Ord Crt Dt	Order Id	Item No 	FG MATNR	CUST/Party NAME	Order Qty.(Sales Unit)	Qty	DISP QTY IN UOM	DISP QTY	BTD	FG QTY	BTR	WIP QTY	Sales Unit	Order Type	Incot	Sales Org.	Division	FG MATNR DESC	Width	Thick	LENGTH	Ref. Standard	BTP	MILL SCH_QTY	DISP PEND	Sign-off Month	Sign-off Qty	Inspection	VDI GRN	GRN GAP	Non-SIGNOF QTY	ZONE	CATEGORY	SEGEMENT	INSPECTION FLAG	Po No.	Delivery Date	MARK CUST NAME	MARK CUST	END CUST/Party Code	Sold Cust. City	Ship To Party	Ship Cust. Name	Ship Cust. City	SHIP_TO_PRTY DESC	Freight Indicator	Billing Block	Delivery Block	Process Sheet BARE	Process Sheet EXT	Process Sheet INT	DT ORD FULFILL	TDC	Material SPEC	Material IP	Surface Finish	END Finish	FIN COND	Geometry


Also, Make shure sign-off month is always sent to backend in format "MONYY"
```


## 2026-11-17 — LDSM020 column order and sign-off month

Reordered all 61 columns as requested, preserving existing filters, formats and totals. Sign-off uploads and save payloads normalize months to uppercase MONYY (NOV26). Accepted inputs include NOV26, Nov-2026 and 2026-11; invalid/ambiguous values are rejected before updates. Blank months remain omitted, preserving existing values.

Run in PowerShell from the rough repository after pulling main:

```powershell
git pull --ff-only origin main
.\LDPIS\Apply-LD150-To-Office.ps1 -ChangeSet "2026-11-17" -CheckOnly
.\LDPIS\Apply-LD150-To-Office.ps1 -ChangeSet "2026-11-17"
```

The default office root remains D:\LDP UAT MAY. This change set affects only LDSM020.jsx. Preview before applying; the script creates backups and does not commit or push the office repositories.
