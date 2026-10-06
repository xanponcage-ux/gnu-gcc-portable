import * as repository from "../repository/LDLTS007Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S006 {
  getTab1Data(data: any) {
    return repository.getTab1Data(data);
  }
  fetchTagData(data: any) {
    return repository.fetchTagData(data);
  }
  saveData(batchId: any) {
    return repository.saveData(batchId);
  }
  insertDataTemp(data: any) {
    return repository.insertDataTemp(data);
  }
  dltTempData() {
    return repository.dltTempData();
  }
}
