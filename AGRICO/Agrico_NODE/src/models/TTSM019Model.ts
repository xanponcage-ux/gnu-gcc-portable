import * as repository from "../repository/TTSM019Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class TTSM019 {
  GetProcDesc(Plant: any) {
    return repository.GetProcDesc(Plant);
  }
  getFGMATDataDetailed(plant: any, matno: any, frmDt: any, toDt: any) {
    return repository.getFGMATDataDetailed(plant, matno, frmDt, toDt);
  }
  getFGMAT(Plant: any) {
    return repository.getFGMAT(Plant);
  }
  getFGMATDataMonthlySummary(plant: any, matno: any, toDt: any) {
    return repository.getFGMATDataMonthlySummary(plant, matno, toDt);
  }
}
