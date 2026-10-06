import * as repository from "../repository/LD50S003Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S002 {
  getGroupPlant(id: any) {
    return repository.getGroupPlant(id);
  }
  getProcessList(plant: any) {
    return repository.getProcessList(plant);
  }

  getStatus(process: any) {
    return repository.getStatus(process);
  }

  getResqtyval(Plant: any) {
    return repository.getResqtyval(Plant);
  }

  getCoils(req: any) {
    return repository.getCoils(req);
  }

  compute(req: any) {
    return repository.compute(req);
  }

  confirm(req: any) {
    return repository.confirm(req);
  }

  GetOrdFilter(
    plant: any,
    ordid: any,
    orditem: any,
    ordtdc: any,
    ordtype: any,
    ordthick: any,
    ordwidth: any
  ) {
    return repository.GetOrdFilter(
      plant,
      ordid,
      orditem,
      ordtdc,
      ordtype,
      ordthick,
      ordwidth
    );
  }

  GetPlanPathWire(req: any) {
    return repository.GetPlanPathWire(req);
  }

  getOrdTyp() {
    return repository.getOrdTyp();
  }
  GetBatchDtl(Plant: any, Batch: any, ProcLine: any) {
    return repository.GetBatchDtl(Plant, Batch, ProcLine);
  }
  GetPdiDtl(
    Plant: any,
    Batch: any,
    Process: any,
    ProdDate: any,
    MBatch: any,
    BusUnit: any,
    Odia: any,
    status: any,
    prodEndDt: any
  ) {
    return repository.GetPdiDtl(
      Plant,
      Batch,
      Process,
      ProdDate,
      MBatch,
      BusUnit,
      Odia,
      status,
      prodEndDt
    );
  }
  delete_tempprod(Plant: any, Batch: any, user: any) {
    return repository.delete_tempprod(Plant, Batch, user);
  }
  SPCB004_TEMP_Insert(
    ele: any,
    Plant: any,
    Batch: any,
    Process: any,
    resWt: any,
    totalNetWt: any,
    ProdDt: any,
    Shift: any,
    user: any,
    uom: any,
    batchType: any,
    startDt: any,
    endDt: any
  ) {
    return repository.SPCB004_TEMP_Insert(
      ele,
      Plant,
      Batch,
      Process,
      resWt,
      totalNetWt,
      ProdDt,
      Shift,
      user,
      uom,
      batchType,
      startDt,
      endDt
    );
  }
  GetMCoilList(Plant: any, Process: any) {
    return repository.GetMCoilList(Plant, Process);
  }
  GetODIA(Plant: any, Process: any) {
    return repository.GetODIA(Plant, Process);
  }
  getShiftStatus(req: any) {
    return repository.getShiftStatus(req);
  }
  getProductionType(req: any) {
    return repository.getProductionType(req);
  }
  getBatchCount(req: any) {
    return repository.getBatchCount(req);
  }
  // getWorkCenterList(req: any) {
  //   return repository.getWorkCenterList(req);
  // }
  getScrapProductionTable(req: any) {
    return repository.getScrapProductionTable(req);
  }
  GetBatchDtlforLP_daughter(Plant: any, MBatch: any, DBatch: any) {
    return repository.GetBatchDtlforLP_daughter(Plant, MBatch, DBatch);
  }

  getHoldRsnDetails(req: any) {
    return repository.getHoldRsnDetails(req);
  }
  GetPdiDtlMultiLot(
    Plant: any,
    Batch: any,
    Process: any,
    ProdDate: any,
    MBatch: any,
    BusUnit: any,
    Odia: any,
    status: any,
    ele: any
  ) {
    return repository.GetPdiDtlMultiLot(
      Plant,
      Batch,
      Process,
      ProdDate,
      MBatch,
      BusUnit,
      Odia,
      status,
      ele
    );
  }

  Insert_Khapoli(
    Plant: any,
    Batch: any,
    Process: any,
    activity: any,
    user: any
  ) {
    return repository.Insert_Khapoli(Plant, Batch, Process, activity, user);
  }

  getBatchId(Plant: any) {
    return repository.getBatchId(Plant);
  }
  GetInqDetl(
    Plant: any,
    Process: any,
    BatchID: any,
    Status: any,
    OrdID: any,
    OrdItm: any,
    Prod_DT: any
  ) {
    return repository.GetInqDetl(
      Plant,
      Process,
      BatchID,
      Status,
      OrdID,
      OrdItm,
      Prod_DT
    );
  }
  ScheduleDel(Plant: any, ele: any) {
    return repository.ScheduleDel(Plant, ele);
  }
  getWorkCenter(req: any) {
    return repository.getWorkCenter(req);
  }
  getMergeBatchDetails(req: any) {
    return repository.getMergeBatchDetails(req);
  }
  chemChkSlt(req: any) {
    return repository.chemChkSlt(req);
  }
  getActivity(data: any) {
    return repository.getActivity(data);
  }
  getEquivTdc(data: any) {
    return repository.getEquivTdc(data);
  }
}
