import * as repository from "../repository/LD05S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD05S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc50(data: any) {
    return repository.callproc50(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }

  getFillData(rmBatch: any, pipeno: any, status: any) {
    return repository.getFillData(rmBatch, pipeno, status);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }

  getMatNo(rmBatch: any, pipeno: any) {
    return repository.getMatNo(rmBatch, pipeno);
  }
}
