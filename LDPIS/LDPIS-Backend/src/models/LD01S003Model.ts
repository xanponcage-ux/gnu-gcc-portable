import * as repository from "../repository/LD01S003Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S003 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getFillData(rmBatch: any, status: any, pipeid: any) {
    return repository.getFillData(rmBatch, status, pipeid);
  }

  confirm(holdData: any, process: any, inspector: any) {
    return repository.confirm(holdData, process, inspector);
  }
}
