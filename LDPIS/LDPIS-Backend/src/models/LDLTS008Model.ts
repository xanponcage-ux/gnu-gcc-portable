import * as repository from "../repository/LDLTS008Query";
import Error from "./errors";

export default class LDLTS008 {
  getOrderid(data: any) {
    return repository.getOrderid(data);
  }

  getItemNo(data: any) {
    return repository.getItemNo(data);
  }

  getProcessSheetData(data: any) {
    return repository.getProcessSheetData(data);
  }

  DeleteProcesssheet(data: any) {
    return repository.DeleteProcesssheet(data);
  }
}
