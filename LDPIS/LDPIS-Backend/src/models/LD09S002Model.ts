import * as repository from "../repository/LD09S002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD09S002 {
  getCoils(data: any) {
    return repository.getCoils(data);
  }

  saveData(batchId: any, plant: any) {
    return repository.saveData(batchId, plant);
  }
}
