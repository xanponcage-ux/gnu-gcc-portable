import * as repository from "../repository/LDSM012Query";
import { Post } from "../typed/typed";
import Error from "./errors";
export default class LDSM012 {
  getInventoryData(
    DespFromDate: any,
    DespToDate: any,
    ProdFromDate: any,
    ProdToDate: any,
    batch: any,
    customer: any,
    item: any,
    materialNo: any,
    mbatch: any,
    order: any,
    orderType: any,
    plant: any,
    process: any,
    status: any,
    thikFrm: any,
    thikTo: any,
    widthFrm: any,
    widthTo: any,
    stockType: any,
    millNo: any
  ) {
    return repository.getInventoryData(
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType,
      millNo
    );
  }

  getMergedInv(
    fromDt: any,
    mergedType: any,
    plant: any,
    toDt: any,
    batchMerg: any,
    mergedBatchMerg: any
  ) {
    return repository.getMergedInv(
      fromDt,
      mergedType,
      plant,
      toDt,
      batchMerg,
      mergedBatchMerg
    );
  }

  getOdiaFrm(plant: any) {
    return repository.getOdiaFrm(plant);
  }

  getOdiaTo(plant: any) {
    return repository.getOdiaTo(plant);
  }

  getReversedBatchInfo(plant: any, batchId: any, mergeBatch: any) {
    return repository.getReversedBatchInfo(plant, batchId, mergeBatch);
  }
}
