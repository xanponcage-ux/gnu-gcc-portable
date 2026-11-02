// D.Model (models/TTSC015Model.js)
import * as repository from "../repository/TTSC015Query";
import Error from "./errors";

export default class TTSC015 {
  GetGradeInfo(spec: any, status: any) {
    return repository.GetGradeInfo(spec, status);
  }
  GetSpecList() {
    return repository.GetSpecList();
  }
  getStatus(plant: any) {
    return repository.getStatus(plant);
  }
  getBatchID(plant: any, status: any, flag:any) {
    return repository.getBatchID(plant, status, flag);
  }

  getsize(plant: any, Batch: any) {
    return repository.getsize(plant, Batch);
  }
  insertTubecount(dt: any) {
    return repository.insertTubecount(dt);
  }

  GetreportTubecnt(plant: any, status: any, Batchid: any) {
    return repository.GetreportTubecnt(plant, status, Batchid);
  }

  getBatchCount(plant: any, batch: any) {
  return repository.getBatchCount(plant, batch);
}

  getTxtdownloadflag(plant: any) {
    return repository.getTxtdownloadflag(plant);
  }

    getTxtdownloadsize(flag: any) {
    return repository.getTxtdownloadsize(flag);//
  }

  tubecountapi(res: any) {
    return repository.tubecountapi(res);
  }

}
