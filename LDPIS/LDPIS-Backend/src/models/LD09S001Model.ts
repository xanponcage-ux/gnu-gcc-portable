import * as repository from "../repository/LD09S001Query";

export default class LD09S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc90(data: any) {
    return repository.callproc90(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  getTataDate(prodEndDt: any) {
    return repository.getTataDate(prodEndDt);
  }

  getFillData(data: any) {
    return repository.getFillData(data);
  }

  getPono(rmBatch: any, pipeno: any) {
    return repository.getPono(rmBatch, pipeno);
  }

  getMatNo(rmBatch: any, pipeno: any) {
    return repository.getMatNo(rmBatch, pipeno);
  }

  getnxtproc(pipeno: any) {
    return repository.getnxtproc(pipeno);
  }
  callfunction(Planned_proc: any, Passed_proc: any, currproc: any) {
    return repository.callfunction(Planned_proc, Passed_proc, currproc);
  }
  getOrderDetails(pipeno: any) {
    return repository.getOrderDetails(pipeno);
  }
}
