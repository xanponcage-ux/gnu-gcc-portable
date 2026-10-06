import * as repository from "../repository/LD50S005Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD50S005 {
  getCoils(data: any) {
    return repository.getCoils(data);
  }

  saveData(batchId: any, plant: any) {
    return repository.saveData(batchId, plant);
  }
}
