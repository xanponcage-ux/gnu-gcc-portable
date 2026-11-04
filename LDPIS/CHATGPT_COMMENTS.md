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
1.create a screen LD01S011 exactly the same as Linking tab of LD01S005(dont copy the delinking part) and with following loigc:
->user enters list of batch id
->we fetch the batch details given thery are in status WB (remove WF)  (no concept of selection as all the batch ids entered above will be considered always )
->remove Fitting order button  as not needed , just give a manual entry Order and item field and user will enter value on that field and hit a Order details fetch icon on the ORder filter ribbon upon which an api will be called which does following:
    1.Check that number of LOM_ID_BATCH in V_LDP_PRODN in LOM_CD_STATUS='WB'  with selected order and item(lom_id_order_cus lom_id_ord_item_cus ) is equal to number of batches we entered above
    2.if above check passes fetch the order details fetch order details using below query:
    SELECT TO_CHAR(ENC_DT_ORD_CREATE, 'YYYY-MM-DD HH24:MI:SS') Ord_Crt_Dt
      ,ENC_ID_ORDER Ord
      ,ENC_NO_ITEM item
      ,ENC_ORD_DESC Ord_Desc
      ,ENC_ORD_QUANTITY Ord_qnty
      ,(select F_BAL_TO_SCHD (ENC_CD_EPA,ENC_ID_ORDER,ENC_NO_ITEM)  from dual) btp
      ,ENC_LENGTH_MIN length_min
      ,ENC_LENGTH_MAX length_max
      ,ENC_SEC1_MIN Thk_Min
      ,ENC_SEC1_MAX Thk_Max
      ,ENC_SEC2_MAX Odia_Min
      ,ENC_SEC2_MAX Odia_Max
      ,ENC_NO_MATNR FG_mat
      ,(select MAKTX from v_makt where mandt='600' AND MATNR=ENC_NO_MATNR)FG_DESC
      ,ENC_MARK_CUST Mark_cust_cd
      ,ENC_MARK_CUST_NAME Mark_Cust_NM
      ,ENC_MATNR_IP IP
      ,ENC_MATNR_SPEC SPEC
      ,ENC_SUR_FINISH Sur_Finish
      ,ENC_END_FINISH End_Finish
      ,ENC_FIN_COND Fin_Condition
      ,ENC_GEOMETRY Geometry
      ,DECODE(ENC_GEOMETRY,'O','Round','R','Section','S','Section',ENC_GEOMETRY) Section_Type
      FROM V_END_CUST_ORD_EPA --,v_tub_matl_mapping
      WHERE ENC_CD_ePA='0780'
      AND ENC_SLIT_PLAN='TUBE'
      AND ENC_ST_ORDER='A'
      AND ENC_ID_ORDER = NVL('${props.orderId}',ENC_ID_ORDER)
      AND ENC_NO_ITEM = NVL('${props.itemId}',ENC_NO_ITEM)
->instead of working on clicking on order give an icon button on the Order Details ribbon ,upon hitting this we do following :
1. We fetch all batches(LOM_ID_BATCH from V_LDP_PRODN with lom_id_order_cus lom_id_ord_item_cus as user entered)
2.we loop through the batches  given by user swapping their current order with the target order given by user and in return one batch currently linked to the target order will be linked to order of the user given batch
User gives:
 Batch1(linked to Order 1)   Target Order(Order2 currently having Batch2)
We need to do:
step1:Delink Batch1 with Order1 step2: link Batch1 with Order2 step3: Delink Batch2 with Order2 step4: link Batch2 with Order1

example:
Given:
batch (currently linked to order)
Batch1 -ORD1
Batch2 -ORD2
Batch3 -ORD3
Batch4 -ORDX
Batch5 -ORDX

User Given Target Order ORDX
Batches currently linked to ORDX(BatchA,BATCHB,BATCHC,Batch4,Batch5)

we will not do above steps for Batch4 and Batch5.
After doing above steps we will have:
Batch1 -ORDX
Batch2 -ORDX
Batch3 -ORDX
Batch4 -ORDX
Batch5 -ORDX

BATCHA- ORD1
BATCHB-ORD2
BATCHC-ORD3
2.we call Procedrue call LDPDBA.LDLTB007(
          LS_BATCH => :LS_BATCH,
          LS_ORDER => :LS_ORDER,
          LS_ITEM => :LS_ITEM,
          LS_LINK_TYPE => :LS_LINK_TYPE, -- 'LINK' or 'DELINK'
          LS_OUT_FLAG => :LS_OUT_FLAG
        )
   for LINK and delink (it has been done in LD01S009 and if LS_OUT FLAG starts with Y then success)
```


## 2026-11-04 — LD01S011 FG Order Swap

Planning & Scheduling → FG Order Swap. Enter distinct batch IDs and fetch the complete WB list. Enter target order and item; fetch Order Details to check the WB count and preview exchanges. Use the swap icon in Order Details to confirm. Entered batches already on the target remain there. Remaining input batches are paired in entry order with remaining target batches sorted by batch ID. Only authenticated users with screen permission can fetch; swap requires RL_RW.

Office PowerShell:
~~~powershell
git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
& "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
~~~
Default bundle: 2026-11-04. Configure LD01S011 screen permissions in UAT. Verify that V_LDP_PRODN permits FOR UPDATE and LDLTB007 does not commit internally before enabling production swaps; internal commits cannot be rolled back by the application.

LD01S011 backend correction: route → controller → model → repository, following LD01S005. Pull main and rerun the same 2026-11-04 check/apply commands above, even if the earlier bundle was already applied. Restart the backend after applying.
