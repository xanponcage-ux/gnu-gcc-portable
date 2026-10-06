import * as repository from "../repository/LD01S008Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S006 {
  getBatchDetails(data: any) {
    return repository.getBatchDetails(data);
  }
  // updateStatusBtn(batchId: any, usr: any) {
  //   return repository.updateStatusBtn(batchId, usr);
  // }

  updateStatusBtn(data: any) {
    return repository.updateStatusBtn(data);
  }
}
