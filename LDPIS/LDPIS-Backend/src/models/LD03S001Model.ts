import * as repository from "../repository/LD03S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD03S001 {
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc30(data: any) {
    return repository.callproc30(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getMatNo(rmBatch: any, pipeno: any) {
    return repository.getMatNo(rmBatch, pipeno);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }
  getFillData(rmBatch: any, pipeno: any, status: any) {
    return repository.getFillData(rmBatch, pipeno, status);
  }
  getnxtproc(pipeno: any) {
    return repository.getnxtproc(pipeno);
  }
  callfunction(Planned_proc: any, Passed_proc: any, currproc: any) {
    return repository.callfunction(Planned_proc, Passed_proc, currproc);
  }
  getHoldRsn() {
    return repository.getHoldRsn();
  }
}
