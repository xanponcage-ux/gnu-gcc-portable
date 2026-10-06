import * as repository from "../repository/LD10S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD10S001 {
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc100(data: any) {
    return repository.callproc100(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getMatNo(rmBatch: any) {
    return repository.getMatNo(rmBatch);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }

  getFillData(data: any) {
    return repository.getFillData(data);
  }
}
