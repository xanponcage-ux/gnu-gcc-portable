import * as repository from "../repository/LD16S002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD16S002 {
  getCoils(data: any) {
    return repository.getCoils(data);
  }

  saveData(batchId: any, plant: any) {
    return repository.saveData(batchId, plant);
  }
}
