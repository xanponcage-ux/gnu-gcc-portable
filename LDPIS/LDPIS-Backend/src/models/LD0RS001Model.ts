import * as repository from "../repository/LD0RS001Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD0RS001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getMatList(status: any) {
    return repository.getMatList(status);
  }

  getPipeNoList(rmBatch: any, status: any, mill: any) {
    return repository.getPipeNoList(rmBatch, status, mill);
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

  LRS001_TEMP_INSERT(newReworkData: any, parting: any) {
    return repository.LRS001_TEMP_INSERT(newReworkData, parting);
  }

  insertPipeDetails(newReworkData: any, parting: any) {
    return repository.insertPipeDetails(newReworkData, parting);
  }
  getMaterialNo(data: any) {
    return repository.getMaterialNo(data);
  }
  getPipeWeight(data: any) {
    return repository.getPipeWeight(data);
  }
  getGeometry(data: any) {
    return repository.getGeometry(data);
  }
}
