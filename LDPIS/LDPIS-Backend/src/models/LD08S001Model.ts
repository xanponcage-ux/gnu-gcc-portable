import * as repository from "../repository/LD08S001Query";

export default class LD08S001 {
  getRmList(status: any, mill: any) {
    return repository.getRmList(status, mill);
  }

  getPipeNoList(rmBatch: any, status: any, mill: any) {
    return repository.getPipeNoList(rmBatch, status, mill);
  }
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }
  insertScrapTempData(data: any) {
    return repository.insertScrapTempData(data);
  }

  callproc80(data: any) {
    return repository.callproc80(data);
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
  validateDataMill80(req: any) {
    return repository.validateDataMill80(req);
  }
}
