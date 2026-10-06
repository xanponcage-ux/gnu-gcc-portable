import * as repository from "../repository/LD0RS002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD0RS001 {
  getRmList(status: any) {
    return repository.getRmList(status);
  }

  getPipeNoList(rmBatch: any, status: any) {
    return repository.getPipeNoList(rmBatch, status);
  }

  getPipeInfo(req: any) {
    return repository.getPipeInfo(req);
  }

  tempInsert(newReworkData: any, parting: any) {
    return repository.tempInsert(newReworkData, parting);
  }

  insertPipeDetails(newReworkData: any, parting: any) {
    return repository.insertPipeDetails(newReworkData, parting);
  }
  getMaterialNo(data: any) {
    return repository.getMaterialNo(data);
  }
  dltTempData(mBatch: any) {
    return repository.dltTempData(mBatch);
  }

  getPipeWeight(data: any) {
    return repository.getPipeWeight(data);
  }
  getGeometry(data: any) {
    return repository.getGeometry(data);
  }

  //Material Tab Apis
  getMatTabData(props: any) {
    return repository.getMatTabData(props);
  }
  validateData(data: any) {
    return repository.validateData(data);
  }
  saveData(data: any) {
    return repository.saveData(data);
  }
  getUserAccess() {
    return repository.getUserAccess();
  }
  getDropdown() {
    return repository.getDropdown();
  }
}
