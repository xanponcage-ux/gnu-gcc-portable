# LD14S001 Changes - Filter by Pipe No or Order No+Item (Hide RM Batch)

## Overview

This document describes the changes required to modify LD14S001 to match the filtering behavior of LD10-LD13: hide the RM Batch dropdown and allow users to filter by either **Pipe No** OR **Order No + Order Item** pair.

## Current Behavior (LD14)

- Frontend displays an RM Batch dropdown that must be selected first
- [`getRmList()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:307) is called on page load and auto-selects the first RM batch
- [`getPipeNoList()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:354) requires an RM batch parameter to filter pipes
- Backend [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190) expects `(rmBatch, pipeno, status)` parameters and always filters by `TBP_PAR_COIL_NO = rmBatch`
- Users cannot search by Pipe No alone or by Order No+Item pair without selecting RM first

## Desired Behavior (Like LD10-LD13)

- Hide the RM Batch dropdown from the UI
- Allow filtering by:
  1. **Pipe No only** (preferred)
  2. **Order No + Order Item pair** (if no Pipe No)
  3. **RM Batch** (optional, as fallback if needed)
- Backend implements filter priority: PIPE_NO > RM_BATCH > ORDNO+ORDITEM
- Frontend validation allows either Pipe No OR (Order No + Order Item)

## Reference Implementation

- LD10: [`LDPIS-Frontend/src/views/Mill/LD10S001.jsx`](LDPIS-Frontend/src/views/Mill/LD10S001.jsx:1) and [`LDPIS-Backend/src/repository/LD10S001Query.ts`](LDPIS-Backend/src/repository/LD10S001Query.ts:1)
- LD13: [`LDPIS-Frontend/src/views/Mill/LD13S001.jsx`](LDPIS-Frontend/src/views/Mill/LD13S001.jsx:1) and [`LDPIS-Backend/src/repository/LD13S001Query.ts`](LDPIS-Backend/src/repository/LD13S001Query.ts:1)

---

## Changes Required

### 1. Frontend Changes - [`LDPIS-Frontend/src/views/Mill/LD14S001.jsx`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:1)

#### 1.1 Remove/Hide RM Batch Dropdown

- **Location**: Lines ~1381-1387 (RM Batch ReactSelect component)
- **Action**: Remove or hide the ReactSelect with `id="rmList"`
- **State**: Keep `rmBatchId` state but make it optional (default to null/empty)

#### 1.2 Update [`fetchDetails()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:114)

- **Current**: Calls `Promise.all([getRmList(accessToken), getPipeNoList(items[0], accessToken)])`
- **Change to**: Call only `getPipeNoList(accessToken)` without RM batch parameter
- **Reason**: Populate all available pipes on load, not filtered by RM

#### 1.3 Update [`getPipeNoList()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:354)

- **Current signature**: `getPipeNoList(value, accessToken)` where value is rmBatch
- **Change to**: `getPipeNoList(accessToken)` or make rmBatch optional
- **Request payload**: Send `rmBatch: ""` to backend to get all pipes for the status
- **Backend will handle**: Return all pipes when rmBatch is empty

#### 1.4 Update [`handlePipeNoChange()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:439)

- **Add**: Fetch order details and next process when pipe is selected (mirror LD10/LD13)
- **Pattern**:
  ```javascript
  Promise.all([
    getOrdDetails(accessToken, value),
    getNxtProc(accessToken, value),
  ]);
  ```
- **Clear**: Dependent fields when pipe changes

#### 1.5 Remove/Adjust [`handleRMBatchChange()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:400)

- **Action**: Remove this handler or make it optional (not required for main flow)
- **Reason**: RM dropdown is hidden

#### 1.6 Update [`bindLPEData()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:799) Validation

- **Current validation** (lines ~845-858): Requires rmBatchId
- **Change to**: Allow either:
  - Pipe No is selected, OR
  - Both Order No AND Order Item are entered
- **Request payload** (lines ~902-905):
  ```javascript
  let requestData = {
    RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
    STATUS: "FC",
    PIPE_NO: hasPipeNo ? pipeno.value : "",
    ORDNO: hasPipeNo ? "" : String(ordNo || "").trim(),
    ORDITEM: hasPipeNo ? "" : String(ordItem || "").trim(),
  };
  ```
- **Validation message**: Update to say "Please select Pipe No or enter both Order No and Order Item"

---

### 2. Backend Changes - [`LDPIS-Backend/src/repository/LD14S001Query.ts`](LDPIS-Backend/src/repository/LD14S001Query.ts:1)

#### 2.1 Update [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190)

- **Current signature**: `getFillData(rmBatch: any, pipeno: any, status: any)`
- **Change to**: `getFillData(data: any)` - accept single data object like LD10/LD13
- **Filter priority logic**:

  ```typescript
  let whereClause = `WHERE TBP_CD_PROC = '1'`; // Base filter

  if (data.PIPE_NO && data.PIPE_NO !== "") {
    // Priority 1: Filter by Pipe No
    whereClause += ` AND TBP_BATCH_NO = '${data.PIPE_NO}'`;
  } else if (data.RM_BATCH && data.RM_BATCH !== "") {
    // Priority 2: Filter by RM Batch
    whereClause += ` AND TBP_BATCH_NO IN (
      SELECT t.lom_id_batch 
      FROM v_ldp_prodn t 
      WHERE t.lom_cd_status='${data.STATUS}' 
      AND t.lom_id_par_coil_no = '${data.RM_BATCH}'
    )`;
  } else if (
    data.ORDNO &&
    data.ORDNO !== "" &&
    data.ORDITEM &&
    data.ORDITEM !== ""
  ) {
    // Priority 3: Filter by Order No + Item
    whereClause += ` AND TBP_ID_ORDER_NO = '${data.ORDNO}' AND TBP_ITEM_NO = '${data.ORDITEM}'`;
  }
  ```

- **Preserve**: Existing SELECT columns, joins, and TBP_RBT_10 logic

#### 2.2 Update [`getPipeNoList()`](LDPIS-Backend/src/repository/LD14S001Query.ts:24)

- **Current**: Always filters by `rmBatch` parameter
- **Change**: Make rmBatch optional
  ```typescript
  let whereClause = `WHERE LOM_CD_STATUS = '${status}'`;
  if (rmBatch && rmBatch !== "") {
    whereClause += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
  }
  ```
- **Result**: Returns all pipes for status when rmBatch is empty

#### 2.3 Keep [`getRmList()`](LDPIS-Backend/src/repository/LD14S001Query.ts:6) Unchanged

- **Reason**: May be used for optional RM filtering in future or kept for backward compatibility
- **Action**: No changes needed

---

### 3. Route Changes - [`LDPIS-Backend/src/routes/LD14S001Route.ts`](LDPIS-Backend/src/routes/LD14S001Route.ts:1)

#### 3.1 Update `getFillData` Endpoint Handler

- **Current**: May parse `rmBatch`, `pipeno`, `status` as separate parameters
- **Change to**: Accept request body as single object and forward to repository
  ```typescript
  router.post("/getFillData", async (req, res) => {
    const data = req.body;
    const result = await LD14S001Query.getFillData(data);
    res.json(result);
  });
  ```

#### 3.2 Update `getPipeNoList` Endpoint Handler

- **Ensure**: Accepts optional rmBatch parameter
- **Forward**: To repository method with optional rmBatch

---

## Testing Checklist

### Unit/Integration Tests

- [ ] Test [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190) with PIPE_NO only → returns correct rows
- [ ] Test [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190) with RM_BATCH only → returns correct rows
- [ ] Test [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190) with ORDNO+ORDITEM only → returns correct rows
- [ ] Test [`getPipeNoList()`](LDPIS-Backend/src/repository/LD14S001Query.ts:24) without rmBatch → returns all pipes
- [ ] Test [`getPipeNoList()`](LDPIS-Backend/src/repository/LD14S001Query.ts:24) with rmBatch → returns filtered pipes

### Manual QA

- [ ] LD14 UI loads without RM Batch dropdown
- [ ] Selecting a Pipe No populates order fields and table data
- [ ] Entering Order No + Order Item (without pipe) returns matching rows
- [ ] Validation prevents submission without Pipe No OR Order pair
- [ ] Stored procedure calls ([`insertTempData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:48), [`callproc140()`](LDPIS-Backend/src/repository/LD14S001Query.ts:137)) still work correctly
- [ ] Table updates and clears work as expected

---

## Implementation Steps

1. **Create this plan document** ✓
2. **Update backend repository** [`LDPIS-Backend/src/repository/LD14S001Query.ts`](LDPIS-Backend/src/repository/LD14S001Query.ts:1)
   - Modify [`getFillData()`](LDPIS-Backend/src/repository/LD14S001Query.ts:190) signature and SQL
   - Update [`getPipeNoList()`](LDPIS-Backend/src/repository/LD14S001Query.ts:24) to handle optional rmBatch
3. **Update backend route** [`LDPIS-Backend/src/routes/LD14S001Route.ts`](LDPIS-Backend/src/routes/LD14S001Route.ts:1)
   - Adjust endpoint handlers to forward data object
4. **Update frontend** [`LDPIS-Frontend/src/views/Mill/LD14S001.jsx`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:1)
   - Hide RM dropdown
   - Update [`fetchDetails()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:114), [`getPipeNoList()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:354), [`handlePipeNoChange()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:439)
   - Update validation in [`bindLPEData()`](LDPIS-Frontend/src/views/Mill/LD14S001.jsx:799)
5. **Test** using checklist above
6. **Create PR** with screenshots and description
7. **Deploy** and verify in UAT

---

## Notes for LD15 and LD16

This same pattern should be applied to:

- [`LDPIS-Frontend/src/views/Mill/LD15S001.jsx`](LDPIS-Frontend/src/views/Mill/LD15S001.jsx:1) and [`LDPIS-Backend/src/repository/LD15S001Query.ts`](LDPIS-Backend/src/repository/LD15S001Query.ts:1)
- [`LDPIS-Frontend/src/views/Mill/LD16S001.jsx`](LDPIS-Frontend/src/views/Mill/LD16S001.jsx:1) and [`LDPIS-Backend/src/repository/LD16S001Query.ts`](LDPIS-Backend/src/repository/LD16S001Query.ts:1)

Reuse this plan and adjust file-specific details (function names, line numbers, stored procedure names).

---

## References

- LD10 Implementation: [`LDPIS-Backend/src/plans/LD10S001_Changes.md`](LDPIS-Backend/src/plans/LD10S001_Changes.md:1)
- LD13 Implementation: [`LDPIS-Backend/src/plans/LD13S001_Changes.md`](LDPIS-Backend/src/plans/LD13S001_Changes.md:1)
- Original Request: "Hide RM batch dropdown in LD14-LD16 and use Pipe No or Order No+Item pair to filter, like LD10-LD13"
