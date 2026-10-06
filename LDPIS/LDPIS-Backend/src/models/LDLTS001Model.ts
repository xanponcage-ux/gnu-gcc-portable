import * as repository from "../repository/LDLTS001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDLTS001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getHeatList(status: any) {
    return repository.getHeatList(status);
  }

  getHeatData(req: any) {
    return repository.getHeatData(req);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getFillData(rmBatch: any, status: any, pipeid: any) {
    return repository.getFillData(rmBatch, status, pipeid);
  }
  checkStatusInsert(batch: any) {
    return repository.checkStatusInsert(batch);
  }
  getTestResults(req: any) {
    let resMOdel = repository.getTestResults(req);
    console.log("resMOdel: ", resMOdel);
    return resMOdel;
  }

  insertTestResults(
    newTableData: any,
    reportType: any,
    shiftDate: any,
    inspector: any,
    action: any,
    resultrm: any
  ) {
    return repository.insertTestResults(
      newTableData,
      reportType,
      shiftDate,
      inspector,
      action,
      resultrm
    );
  }
}
