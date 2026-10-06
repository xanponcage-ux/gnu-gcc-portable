import * as repository from "../repository/LD01S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }
  getorderwiseProdData(RM_BATCH: any) {
    return repository.getorderwiseProdData(RM_BATCH);
  }
  getScrapProductionTable(req: any) {
    return repository.getScrapProductionTable(req);
  }
  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }
  getPipeId(req: any) {
    return repository.getPipeId(req);
  }
  LD01S001HoldReason() {
    return repository.LD01S001HoldReason();
  }
  getPipeWeight(req: any) {
    return repository.getPipeWeight(req);
  }
  LD01S001Duration(req: any) {
    return repository.LD01S001Duration(req);
  }
  LD01S001_TEMP_Insert(
    newDataPrime: any,
    newDataScrap: any,
    flag: any,
    matNo: any
  ) {
    return repository.LD01S001_TEMP_Insert(
      newDataPrime,
      newDataScrap,
      flag,
      matNo
    );
  }
  insertCoilDetails(newDataPrime: any) {
    return repository.insertCoilDetails(newDataPrime);
  }
  getSchedules(req: any) {
    return repository.getSchedules(req);
  }
  delete_tempprod(req: any) {
    return repository.delete_tempprod(req);
  }
  validateData(req: any) {
    return repository.validateData(req);
  }
}
