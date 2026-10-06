import * as repository from "../repository/LDR1S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDR1S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getPipeInfo(req: any) {
    return repository.getPipeInfo(req);
  }

  getMatNo(rmBatch: any, pipeno: any) {
    return repository.getMatNo(rmBatch, pipeno);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }

  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callprocR1(data: any) {
    return repository.callprocR1(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getFillData(rmBatch: any, status: any, pipeid: any) {
    return repository.getFillData(rmBatch, status, pipeid);
  }

  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }

  insertPipeDetails(newReworkData: any, parting: any) {
    return repository.insertPipeDetails(newReworkData, parting);
  }
}
