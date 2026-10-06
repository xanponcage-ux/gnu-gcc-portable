import * as repository from "../repository/LDSM041Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDSM041 {
  getGroupPlant(id: any) {
    return repository.getGroupPlant(id);
  }

  getBatchId(plant: any, status: any) {
    return repository.GetBatchId(plant, status);
  }

  getSubDetails(BatchId: any, plant: any, status: any) {
    return repository.GetSubDetails(BatchId, plant, status);
  }

  getSecRsns() {
    return repository.GetSecRsnQuery();
  }

  getBtnHold(
    plant: any,
    batch: any,
    holdRsn: any,
    remarks: any,
    currProc: any,
    nextProc: any,
    netWt: any,
    status: any,
    pUser: any,
    flag: any) {
    return repository.getBtnHold(
      plant,
      batch,
      holdRsn,
      remarks,
      currProc,
      nextProc,
      netWt,
      status,
      pUser,
      flag
    );
  }


  updateOprRemark(req: any) {
    return repository.updateOprRemark(req);
  }
}
