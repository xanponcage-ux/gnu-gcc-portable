import * as repository from "../repository/LDSC013Query";

export default class LDSC013 {
  getSpecList(reqBody: any) {
    return repository.getSpecList(reqBody);
  }

  getParameters(reqBody: any) {
    return repository.getParameters(reqBody);
  }

  writeAccess(reqBody: any) {
    return repository.writeAccess(reqBody);
  }

  getData(reqBody: any) {
    return repository.getData(reqBody);
  }

  upsert(reqBody: any) {
    return repository.upsert(reqBody);
  }
  deleteRow(reqBody: any) {
    return repository.deleteRow(reqBody);
  }
}
