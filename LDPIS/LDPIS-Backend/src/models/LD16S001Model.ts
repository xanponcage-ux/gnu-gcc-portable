import * as repository from "../repository/LD16S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD16S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getLabTestList(rmBatch: any) {
    return repository.getLabTestList(rmBatch);
  }

  getFieldTestList(rmBatch: any) {
    return repository.getFieldTestList(rmBatch);
  }

  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  insertScrapTempData(data: any) {
    return repository.insertScrapTempData(data);
  }

  callproc120(data: any) {
    return repository.callproc120(data);
  }

  deleteTempData(data: any) {
    return repository.deleteTempData(data);
  }

  insertLAB(BATCH_NO: any, PROD_DATE: any, SHIFT: any, labTest: any) {
    return repository.insertLAB(BATCH_NO, PROD_DATE, SHIFT, labTest);
  }

  insertField(BATCH_NO: any, PROD_DATE: any, SHIFT: any, labTest: any) {
    return repository.insertField(BATCH_NO, PROD_DATE, SHIFT, labTest);
  }

  getFillData(data: any) {
    return repository.getFillData(data);
  }

  getTataDate(prodEndDt: any) {
    return (repository as any).getTataDate(prodEndDt);
  }

  getCoatWt(
    W1: any,
    W2: any,
    W3: any,
    W4: any,
    W5: any,
    W6: any,
    W7: any,
    W8: any,
    W9: any,
    W10: any,
    W11: any,
    W12: any,
    LENGTH: any,
    OD: any
  ) {
    return (repository as any).getCoatWt(
      W1,
      W2,
      W3,
      W4,
      W5,
      W6,
      W7,
      W8,
      W9,
      W10,
      W11,
      W12,
      LENGTH,
      OD
    );
  }
}
