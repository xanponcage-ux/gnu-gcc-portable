import * as repository from "../repository/LDLTS010Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDLTS010 {
  getCoils(data: any) {
    return repository.getCoils(data);
  }
  saveData(data: any) {
    return repository.saveData(data);
  }
  getDownMatl(data: any) {
    return repository.getDownMatl(data);
  }
  getScrapMatl(data: any) {
    return repository.getScrapMatl(data);
  }
}
