import * as repository from "../repository/LDSM006Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDSM006 {
  getProdInqData(
    Proc: any,
    Batch: any,
    PBatch: any,
    MBatch: any,
    OrdNo: any,
    OrdItem: any,
    Status: any,
    MatnrNo: any,
    QltyCd: any,
    ProdDateFrom: any,
    ProdDateTo: any,
    shift: any,
    millNo: any
  ) {
    return repository.getProdInqData(
      Proc,
      Batch,
      PBatch,
      MBatch,
      OrdNo,
      OrdItem,
      Status,
      MatnrNo,
      QltyCd,
      ProdDateFrom,
      ProdDateTo,
      shift,
      millNo
    );
  }
}
