import * as repository from "../repository/LD13S002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD13S002 {
  getCoils(data: any) {
    return repository.getCoils(data);
  }

  saveData(batchId: any, plant: any) {
    return repository.saveData(batchId, plant);
  }
}
