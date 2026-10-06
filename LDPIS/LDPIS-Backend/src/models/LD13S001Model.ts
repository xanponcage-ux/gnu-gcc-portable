import * as repository from "../repository/LD13S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD13S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc130(data: any) {
    return repository.callproc130(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getFillData(data: any) {
    return repository.getFillData(data);
  }

  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }
}
