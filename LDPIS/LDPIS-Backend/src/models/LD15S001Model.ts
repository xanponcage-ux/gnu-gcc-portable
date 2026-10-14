import * as repository from "../repository/LD15S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD15S001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  insertTempData(data: any) {
    return repository.insertTempData(data);
  }

  callproc150(data: any) {
    return repository.callproc150(data);
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

    getCoatWt(
      W1: any,
      W2: any,
      W3: any,
      W4: any,
      W5: any,
      W6: any,
      W7: any,
      W8: any,
      LENGTH: any,
      OD: any
    ) {
      return repository.getCoatWt(
        W1,
        W2,
        W3,
        W4,
        W5,
        W6,
        W7,
        W8,
        LENGTH,
        OD
      );
    }
}
