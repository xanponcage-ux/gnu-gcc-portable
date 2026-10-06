import * as repository from "../repository/LD0YS001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD0YS001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getPipeId(req: any) {
    return repository.getPipeId(req);
  }
  getPipeWeight(data: any) {
    return repository.getPipeWeight(data);
  }

  getPipeInfo(req: any) {
    return repository.getPipeInfo(req);
  }

  getFillData(rmBatch: any, status: any, pipeid: any) {
    return repository.getFillData(rmBatch, status, pipeid);
  }

  tempInsert(newReworkData: any) {
    return repository.tempInsert(newReworkData);
  }

  insertPipeDetails(newReworkData: any) {
    return repository.insertPipeDetails(newReworkData);
  }
}
