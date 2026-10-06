import * as repository from "../repository/LD02S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD02S001 {
  getRmList(status: any,mill: any) {
    return repository.getRmList(status,mill);
  }

  getPipeNoList(rmBatch: any, status: any, mill: any) {
    return repository.getPipeNoList(rmBatch, status, mill);
  }

  getMatNo(rmBatch: any, pipeno: any) {
    return repository.getMatNo(rmBatch, pipeno);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }

  getorderwiseProdData(RM_BATCH: any) {
    return repository.getorderwiseProdData(RM_BATCH);
  }

  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc20(data: any) {
    return repository.callproc20(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getFillData(rmBatch: any, pipeno: any, status: any) {
    return repository.getFillData(rmBatch, pipeno, status);
  }

  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }

  getOrderDetails(pipeno: any) {
    return repository.getOrderDetails(pipeno);
  }
  getHoldRsn() {
    return repository.getHoldRsn();
  }
}
