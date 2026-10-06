import * as repository from "../repository/LD08S002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD08S002 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  // getPipeId(req: any) {
  //   return repository.getPipeId(req);
  // }

  getPipeInfo(req: any) {
    return repository.getPipeInfo(req);
  }

  // getFillData(rmBatch: any, status: any, pipeid: any) {
  //   return repository.getFillData(rmBatch, status, pipeid);
  // }

  LD08B003(newReworkData: any, status: any) {
    return repository.LD08B003(newReworkData, status);
  }

  // insertPipeDetails(newReworkData: any, parting: any) {
  //   return repository.insertPipeDetails(newReworkData, parting);
  // }
  getMaterialNo(data: any) {
    return repository.getMaterialNo(data);
  }
}
