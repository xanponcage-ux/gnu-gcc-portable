import * as repository from "../repository/LDLTS011Query";

export default class LDLTS011 {
  getCoils(data: any) { return repository.getCoils(data); }
  saveData(data: any) { return repository.saveData(data); }
}
