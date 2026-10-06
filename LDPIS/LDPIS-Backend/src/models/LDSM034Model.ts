import * as repository from "../repository/LDSM034Query";


export default class C1CES34W {
  getStatusList(plant: any) {
    return repository.getStatusList(plant);
    }


  getOrderList(plant: any, statusList: any) {
    return repository.getOrderList(plant, statusList);
    }


  getMBatchData(orderList: any) {
    return repository.getMBatchData(orderList);
  }
  getDisplayData(
    batch: any,
    item: any,
    mBatch: any,
    order: any,
    plant: any,
    status: any,
    tdc: any
  ) {
    return repository.getDisplayData(
      batch,
      item,
      mBatch,
      order,
      plant,
      status,
      tdc
    );
  }
  getQualityResultData(
    plant: any,
    ORDERID: any,
    ITEM: any,
    MATERIAL: any,
    MOTHER_BATCH: any,
    LOM_NO_CAST: any,
    BATCH_ID: any
  ) {
    return repository.getQualityResultData(
      plant,
      ORDERID,
      ITEM,
      MATERIAL,
      MOTHER_BATCH,
      LOM_NO_CAST,
      BATCH_ID
    );
  }
  getCATEGORY(
    FG_MAT: any,
  ) {
    return repository.getCATEGORY(
      FG_MAT
    );
  }
  getHydraDt (
    plant: any,
    BATCH_ID: any)
    {
      return repository.getHydraDt(
        plant,
        BATCH_ID);
    }
  insertQualityTestData(
    plant: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    TEST_CODE: any,
    TEST_PARAMETER: any,
    TEST_REMARK: any,
    TEST_VALUE: any,
    personalNo: any,
    LOM_NO_CAST: any,
    up_res_tag: any,
    TCO_TEST_PARA_REM: any,
    TCO_TEST_PARA_VAL: any,
    wire_dt: any
  ) {
    console.log(wire_dt,"inside model");
    return repository.insertQualityTestData(
      plant,
      MOTHER_BATCH,
      BATCH_ID,
      TEST_CODE,
      TEST_PARAMETER,
      TEST_REMARK,
      TEST_VALUE,
      personalNo,
      LOM_NO_CAST,
      up_res_tag,
      TCO_TEST_PARA_REM,
      TCO_TEST_PARA_VAL,
      wire_dt
    );
  }

  countQualityTestData(
    plant: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    TEST_CODE: any,
    TEST_PARAMETER: any,
    TEST_REMARK: any,
    TEST_VALUE: any,
    personalNo: any,
    LOM_NO_CAST: any
  ) {
    return repository.countQualityTestData(
      plant,
      MOTHER_BATCH,
      BATCH_ID,
      TEST_CODE,
      TEST_PARAMETER,
      TEST_REMARK,
      TEST_VALUE,
      personalNo,
      LOM_NO_CAST
    );
  }

  updateQualityTestData(
    plant: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    TEST_CODE: any,
    TEST_PARAMETER: any,
    TEST_REMARK: any,
    TEST_VALUE: any,
    personalNo: any,
    LOM_NO_CAST: any,
    up_res_tag: any,
    TCO_TEST_PARA_REM: any,
    TCO_TEST_PARA_VAL: any,
    wire_dt:any
  ) {
    return repository.updateQualityTestData(
      plant,
      MOTHER_BATCH,
      BATCH_ID,
      TEST_CODE,
      TEST_PARAMETER,
      TEST_REMARK,
      TEST_VALUE,
      personalNo,
      LOM_NO_CAST,
      up_res_tag,
      TCO_TEST_PARA_REM,
      TCO_TEST_PARA_VAL,
      wire_dt
    );
  }

  changeQualityTestData(
    plant: any, selectedFirstTableData: any, selectedSecondTableData: any, personalNo: any, up_res_tag:any

  ) {
    return repository.changeQualityTestData(
      plant, selectedFirstTableData, selectedSecondTableData, personalNo, up_res_tag
    );
  }


  getDefectRecording(plant: any, MOTHER_BATCH: any, CURRENT_PROCESS: any, BATCH_ID: any, selLen: any) {
    return repository.getDefectRecording(plant, MOTHER_BATCH, CURRENT_PROCESS, BATCH_ID, selLen);
  }

  insertDefectRecording(
    ESR_RSN_CD: any,
    TBD_DEFECT_NO_PCS: any,
    TBD_DEFECT_WT: any,
    personalNo: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    CURRENT_PROCESS: any,
    plant: any
  ) {
    return repository.insertDefectRecording(
      ESR_RSN_CD,
      TBD_DEFECT_NO_PCS,
      TBD_DEFECT_WT,
      personalNo,
      MOTHER_BATCH,
      BATCH_ID,
      CURRENT_PROCESS,
      plant
    );
  }

  getDefectRecordingCount(
    ESR_RSN_CD: any,
    plant: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    CURRENT_PROCESS: any
  ) {
    return repository.getDefectRecordingCount(
      ESR_RSN_CD,
      plant,
      MOTHER_BATCH,
      BATCH_ID,
      CURRENT_PROCESS
    );
  }

  updateDefectRecording(
    ESR_RSN_CD: any,
    TBD_DEFECT_NO_PCS: any,
    TBD_DEFECT_WT: any,
    personalNo: any,
    MOTHER_BATCH: any,
    BATCH_ID: any,
    CURRENT_PROCESS: any,
    plant: any
  ) {
    return repository.updateDefectRecording(
      ESR_RSN_CD,
      TBD_DEFECT_NO_PCS,
      TBD_DEFECT_WT,
      personalNo,
      MOTHER_BATCH,
      BATCH_ID,
      CURRENT_PROCESS,
      plant
    );
  }

  getItem(plant: any, orderId: any) {
    return repository.getItem(plant, orderId);
  }

  getDataDeci(
    plant: any,
    batch: any,
    status: any,
    coil: any) {
    return repository.getDataDeci(
      plant,
      batch,
      status,
      coil);
  } 
  getChangeResult(
    batch_id: any, LOM_no_cast: any, plant: any, orderid: any, orderitem: any
  ) {
    return repository.getChangeResult(
      batch_id, LOM_no_cast, plant, orderid, orderitem);
  }

  getChangeResultDetails(
    batch: any, testpra: any) {
    return repository.getChangeResultDetails(
      batch,
      testpra);
  }

  saveQADeci(
    P_PLANT: any,
    P_BATCH: any,
    P_STATUS: any,
    P_CURR_PROC: any,
    P_NEXT_PROC: any,
    P_RADIO_VALUE: any,
    P_QLTY_ACTL: any,
    P_TDC: any,
    P_CUST_ORD: any,
    P_CUST_ITEM: any,
    P_SEC_QLTY: any,
    P_SEC_TDC: any,
    P_PROC: any,
    P_TDC_NO: any,
    P_SEC_NO_MATNR: any,
    P_GROSS_CAL: any,
    P_RSN_CD: any,
    P_RSN_CAT: any,
    P_RSN_DESC: any,
    P_PARAM_CUST: any,
    P_DECISION_REM: any
  ) {
    return repository.saveQADeci(
      P_PLANT,
      P_BATCH,
      P_STATUS,
      P_CURR_PROC,
      P_NEXT_PROC,
      P_RADIO_VALUE,
      P_QLTY_ACTL,
      P_TDC,
      P_CUST_ORD,
      P_CUST_ITEM,
      P_SEC_QLTY,
      P_SEC_TDC,
      P_PROC,
      P_TDC_NO,
      P_SEC_NO_MATNR,
      P_GROSS_CAL,
      P_RSN_CD,
      P_RSN_CAT,
      P_RSN_DESC,
      P_PARAM_CUST,
      P_DECISION_REM
    );
  }

  getQlty() {
    return repository.getQlty();
  }

  getTdc() {
    return repository.getTdc();
  }

  getAddlProcess(plant: any, curr_proc: any) {
    return repository.getAddlProcess(plant, curr_proc);
  }

  getMatNo(plant: any) {
    return repository.getMatNo(plant);
  }

  getmatnoDiverted(plant: any) {
    return repository.getmatnoDiverted(plant);
  }

  saveUD(
    plant: any,
    BATCH_ID: any,
    LOM_IDIA: any,
    LOM_NO_CAST: any,
    LOM_NO_PIECES: any,
    LOM_ODIA: any,
    LOM_PASSED_PROC: any,
    LOM_SEC2: any,
    ITEM: any,
    MATERIAL: any,
    MOTHER_BATCH: any,
    NET_WT: any,
    ORDERID: any,
    PROD_END_TM: any,
    PROD_STRT_TM: any,
    stor: any,
    personalNo: any,
    flag: any,
    sch_id: any,
    THICKNESS: any,
    LOM_WORK_CENTER: any) {
    return repository.saveUD(
      plant,
      BATCH_ID,
      LOM_IDIA,
      LOM_NO_CAST,
      LOM_NO_PIECES,
      LOM_ODIA,
      LOM_PASSED_PROC,
      LOM_SEC2,
      ITEM,
      MATERIAL,
      MOTHER_BATCH,
      NET_WT,
      ORDERID,
      PROD_END_TM,
      PROD_STRT_TM,
      stor,
      personalNo,
      flag,
      sch_id,
      THICKNESS,
      LOM_WORK_CENTER);
  }

  rejectUD() {
    return repository.rejectUD();
  }

  getCastDetails(castNo: any) {
    return repository.getCastDetails(castNo);
  }

  getSTOR(plant: any, BATCH_ID: any) {
    return repository.getSTOR(plant, BATCH_ID);
  }

  getScheduleID(plant: any, BATCH_ID: any, CURRENT_PROCESS: any) {
    return repository.getScheduleID(plant, BATCH_ID, CURRENT_PROCESS);
  }

  updateUD(plant: any,
    ORDERID: any,
    ITEM: any,
    BATCH_ID: any,
    MOTHER_BATCH: any,
    CURRENT_PROCESS: any,
    LOM_CD_NEXT_PROC: any,
    personalNo: any,
    ACTION: any,
    MATERIAL: any,
    REMARKS: any) {
    return repository.updateUD(plant,
      ORDERID,
      ITEM,
      BATCH_ID,
      MOTHER_BATCH,
      CURRENT_PROCESS,
      LOM_CD_NEXT_PROC,
      personalNo,
      ACTION,
      MATERIAL,
      REMARKS)
  }

  saveudReturn(plant: any,
    ORDERID: any,
    ITEM: any,
    BATCH_ID: any,
    MOTHER_BATCH: any,
    CURRENT_PROCESS: any,
    LOM_CD_NEXT_PROC: any,
    personalNo: any,
    ACTION: any,
    MATERIAL: any,
    REMARKS: any) {
    return repository.returnUD(plant,
      ORDERID,
      ITEM,
      BATCH_ID,
      MOTHER_BATCH,
      CURRENT_PROCESS,
      LOM_CD_NEXT_PROC,
      personalNo,
      ACTION,
      MATERIAL,
      REMARKS)
  }

  checkPdate(plant: any, BATCH_ID: any, P_PRODN_DT: any) {
    return repository.checkPdate(plant, BATCH_ID, P_PRODN_DT)
  }

  crtWIP(plant: any, BATCH_ID: any, LOM_CD_NEXT_PROC: any) {
    return repository.crtWIP(plant, BATCH_ID, LOM_CD_NEXT_PROC)
  }

  getQRRFlg(plant: any, status: any) {
    return repository.getQRRFlg(plant, status);
  }

  getCntResTag(mother_batch: any, cast_no: any) {
    return repository.getCntResTag(mother_batch, cast_no);
  }


  getCntResTagSuccess(mother_batch: any, cast_no: any) {
    return repository.getCntResTagSuccess(mother_batch, cast_no);
  }


  getCntCoilTest(mother_batch: any, cast_no: any) {
    return repository.getCntCoilTest(mother_batch, cast_no);
  }


  updateDaughterBatch(mother_batch: any, cast_no: any, plant: any, batch_id: any) {
    return repository.updateDaughterBatch(mother_batch, cast_no, plant, batch_id);
  }

  getProdTypeTitle(plant: any, status: any) {
    return repository.getProdTypeTitle(plant, status);
  }

  getCntDefectRec(plant: any, batch_id: any, mBatch: any) {
    return repository.getCntDefectRec(plant, batch_id, mBatch);
  }

  cntStatusUD(plant: any) {
    return repository.cntStatusUD(plant);
  }


  getQualityResultCount(plant: any, order_id: any, cast_no: any, order_item: any, mother_batch: any, material_no: any) {
    return repository.getQualityResultCount(plant, order_id, cast_no, order_item, mother_batch, material_no);
  }

  chkDuplicateBatch(plant: any, batch_id: any) {
    return repository.chkDuplicateBatch(plant, batch_id);
  }

  chkMqStatus(plant: any, batch_id: any) {
    return repository.chkMqStatus(plant, batch_id);
  }

  getChangeResultBatch(plant: any) {
    return repository.getChangeResultBatch(plant);
  }

  getChangeResultMBatch() {
    return repository.getChangeResultMBatch();
  }
  GetScrapWt( plant: any, MOTHER_BATCH: any, CUR_PROCESS:any) { 
    return repository.GetScrapWt( plant, MOTHER_BATCH, CUR_PROCESS); 
  }
  GetPieceActl(req: any) {
    return repository.GetPieceActl(req);
    }

  getProductName(req: any) {
    return repository.getProductName(req)
}
}
