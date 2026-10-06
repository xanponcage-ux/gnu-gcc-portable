import * as repository from "../repository/LDSC012Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDSC012 {
  getTabDisplayData(data: any) {
    return repository.getTabDisplayData(data);
  }
  InsertData(data: any, adid: any, tabValue: any) {
    return repository.InsertData(data, adid, tabValue);
  }
}
