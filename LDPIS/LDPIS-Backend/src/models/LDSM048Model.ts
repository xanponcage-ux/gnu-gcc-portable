import * as repository from '../repository/LDSM048Query'
import { Post } from '../typed/typed';
import Error from './errors'
export default class LDSM048 {

  getScrapData(
    batch: any,
    castNo: any,
    decFrmDt: any,
    decToDt: any,
    // matNo: any ,
    mbatch: any,
    plant: any,
    // procFrmDt: any ,
    // procToDt: any ,
    process: any,
    prodCd: any,
    // prodType: any ,
    qltyCd: any,
    scrpWt: any,
    status: any,
    // tdc: any ,
    thickFrm: any,
    thickTo: any,
    tonnage: any,
    widthFrm: any,
    widthTo: any
  ) {
    return repository.getScrapData(
      batch,
      castNo,
      decFrmDt,
      decToDt,
      // matNo,
      mbatch,
      plant,
      // procFrmDt,
      // procToDt,
      process,
      prodCd,
      // prodType,
      qltyCd,
      scrpWt,
      status,
      // tdc,
      thickFrm,
      thickTo,
      tonnage,
      widthFrm,
      widthTo
    )
  }

  getProcessDesc(plant: any) {
    return repository.getProcessDesc(plant);
  }

  getMaterialData(plant: any) {
    return repository.getMaterialData(plant)
    }

  getMergingData(
    plant: any,
    statusMerging: any,
    castNo: any,
    matNo: any
  ) {
    return repository.getMergingData(
      plant,
      statusMerging,
      castNo,
      matNo
    );
  }
  saveMergingData(
    plant: any,
    mergedQnty: any,
    mergedPcs: any,
    totalActualQnty: any,
    totalActualPcs: any,
    createdBy: any,
    ACTUAL_PCS: any,
    ACTUAL_QTY: any,
    BATCH1: any,
    LOM_NO_CAST: any,
    LOM_NO_MATNR: any,
    LOM_CD_STATUS: any,
    merge_id: any,
    batch_count: any,
    rowCount: any) {
    return repository.saveMergingData(
      plant,
      mergedQnty,
      mergedPcs,
      totalActualQnty,
      totalActualPcs,
      createdBy,
      ACTUAL_PCS,
      ACTUAL_QTY,
      BATCH1,
      LOM_NO_CAST,
      LOM_NO_MATNR,
      LOM_CD_STATUS,
      merge_id,
      batch_count,
      rowCount);
  }

  getMaterialNo(plant: any) {
    return repository.getMaterialNo(plant);
  }

  getCastNo(plant: any) {
    return repository.getCastNo(plant);
  }

  getMaxBatchIDCount(plant: any) {
    return repository.getMaxBatchIDCount(plant);
  }

  getMergeID(ls_max: any) {
    return repository.getMergeID(ls_max)
  }

  TTSB048mergeNew(
    plant: any,
    BATCH1: any,
    merge_id: any,
    createdBy:any
  ) {
    return repository.TTSB048mergeNew(
      plant,
      BATCH1,
      merge_id,
      createdBy);
  }

  saveMergingDataTemp(plant:any,
    BATCH1:any,
    merge_id:any,
    createdBy:any) {
    return repository.saveMergingDataTemp(
      plant,
      BATCH1,
      merge_id,
      createdBy)
  }

  getMoMData(
    plant: any,
    batch_id: any,
    widthOdia: any
  ) {
    return repository.getMoMData(
      plant,
      batch_id,
      widthOdia);
  }

  getSplitData(
    plant: any,
    batch_id: any,
    mother_batch: any
  ) {

    return repository.getSplitData(
      plant,
      batch_id,
      mother_batch
    );
  }

  getScrapRsn(plant: any, rsnCat: any) {
    return repository.getScrapRsn(plant, rsnCat)
  }

  getScrapMatNo(plant: any) {
    return repository.getScrapMatNo(plant)
  }

  saveMaintainReason(
    plant: any,
    rsnCat: any,
    rsnCd: any,
    scrpMatNo: any,
    batch: any,
    scrapQty: any,
    totalScrapQty: any,
    actualScrapQty: any,
    process: any
  ) {
    return repository.saveMaintainReason(
      plant,
      rsnCat,
      rsnCd,
      scrpMatNo,
      batch,
      scrapQty,
      totalScrapQty,
      actualScrapQty,
      process
    );
  }

  postScrap(
    plant: any,
    LOM_ID_BATCH: any,
    LOM_CD_STATUS: any,
    SCRP_MATNR: any,
    LOM_MS_PIECE_ACTL: any,
    LOM_ID_PAR_COIL_NO: any,
    LOM_ID_FIRST_PAR: any,
    LOM_CD_PROD: any,
    LOM_NO_PIECES: any,
    LOM_NO_MATNR: any,
    CURR_PROC: any,
    LOM_MS_SCRAP: any
  ) {
    return repository.postScrap(
      plant,
      LOM_ID_BATCH,
      LOM_CD_STATUS,
      SCRP_MATNR,
      LOM_MS_PIECE_ACTL,
      LOM_ID_PAR_COIL_NO,
      LOM_ID_FIRST_PAR,
      LOM_CD_PROD,
      LOM_NO_PIECES,
      LOM_NO_MATNR,
      CURR_PROC,
      LOM_MS_SCRAP
    );
  }
  getReasonCategory() {
    return repository.getReasonCategory();
  }

  getSplitBatch(plant: any) {
    return repository.getSplitBatch(plant);
  }

  getSplitBatchRM(plant: any,batchId:any, count:any) {
    return repository.getSplitBatchRM(plant,batchId, count);
  }

  getsplitbatchActal(plant: any,batchId:any, count:any) {
    return repository.getsplitbatchActal(plant,batchId, count);
    }


  saveSplitBatch(BATCH_ID: any,
    PCS: any,
    QTY: any,
    DelinkOrderFlag: any,
    plant: any,
    mainBatch: any,
    mainBatchQty: any,
    mainBatchPcs: any,
    bUnit: any,
    splitNo: any,
    length: any) {
    return repository.saveSplitBatch(
      BATCH_ID,
      PCS,
      QTY,
      DelinkOrderFlag,
      plant,
      mainBatch,
      mainBatchQty,
      mainBatchPcs,
      bUnit,
      splitNo,
      length
    );
  }

  updateSplit(plant: any,
    mainBatch: any,
    mainBatchQty: any,
    mainBatchPcs: any,
    splitQty: any,
    splitPcs: any) {
    return repository.updateSplit(plant,
      mainBatch,
      mainBatchQty,
      mainBatchPcs,
      splitQty,
      splitPcs)
  }

  getSplitBatchDetails(plant: any, splitted_batch: any) {
    return repository.getSplitBatchDetails(plant, splitted_batch);
  }

  getBatchDetails(plant: any, batch: any, status: any) {
    return repository.getBatchDetails(plant, batch, status);
  }

  getMoMTargetMaterialNo(plant: any) {
    return repository.getMoMTargetMaterialNo(plant);
  }

  saveMoMData(
    PLANT: any,
    BATCH_ID: any,
    MATNO: any,
    personalNo: any,
    targetMatNo: any) {
    return repository.saveMoMData(
      PLANT,
      BATCH_ID,
      MATNO,
      personalNo,
      targetMatNo);
  }

  getMoMWidthOdia(plant: any) {
    return repository.getMoMWidthOdia(plant);
  }


  getAuth(pno: any) {
    return repository.getAuth(pno);
  }
  GetSplitStatus(plant: any) {
    return repository.GetSplitStatus(plant);
  }
  GetMergingStatus(plant: any) {
    return repository.GetMergingStatus(plant);
  }
  GetPieceActl(req: any) {
    return repository.GetPieceActl(req);
  }
}