import * as repository from "../repository/LDCR002Query";
import { Post } from "../typed/typed";
import Error from "./errors";
export default class LDCR002 {
  getVdidata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getVdidata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getVdirdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getVdirdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getVdirSdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getVdirSdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getchemdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getchemdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getautomaticweld(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getautomaticweld(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getautomaticweldbody(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getautomaticweldbody(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  gethardnessdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.gethardnessdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getFRBTdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getFRBTdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getAirdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getAirdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getCrossdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getCrossdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

    getREPAIRdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getREPAIRdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getdustdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getdustdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getepoxydata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getepoxydata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getimpactdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getimpactdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getpeeldata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getpeeldata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  gettrialdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.gettrialdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getapplicationdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getapplicationdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }
  getthickness(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getthickness(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }
  getfinalinspection(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getfinalinspection(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getDROPdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getDROPdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getmechanicaldata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getmechanicaldata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getMGERdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getMGERdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getMGNdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getMGNdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getHYSdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getHYSdata(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getInventoryData(
    DespFromDate: any,
    DespToDate: any,
    ProdFromDate: any,
    ProdToDate: any,
    batch: any,
    customer: any,
    item: any,
    materialNo: any,
    mbatch: any,
    order: any,
    orderType: any,
    plant: any,
    process: any,
    status: any,
    thikFrm: any,
    thikTo: any,
    widthFrm: any,
    widthTo: any,
    stockType: any
  ) {
    return repository.getInventoryData(
      DespFromDate,
      DespToDate,
      ProdFromDate,
      ProdToDate,
      batch,
      customer,
      item,
      materialNo,
      mbatch,
      order,
      orderType,
      plant,
      process,
      status,
      thikFrm,
      thikTo,
      widthFrm,
      widthTo,
      stockType
    );
  }

  getMergedInv(
    fromDt: any,
    mergedType: any,
    plant: any,
    toDt: any,
    batchMerg: any,
    mergedBatchMerg: any
  ) {
    return repository.getMergedInv(
      fromDt,
      mergedType,
      plant,
      toDt,
      batchMerg,
      mergedBatchMerg
    );
  }

  GetreportTyp(plant: any) {
    return repository.GetreportTyp(plant);
  }

  getOdiaFrm(plant: any) {
    return repository.getOdiaFrm(plant);
  }

  getOdiaTo(plant: any) {
    return repository.getOdiaTo(plant);
  }

  getReversedBatchInfo(plant: any, batchId: any, mergeBatch: any) {
    return repository.getReversedBatchInfo(plant, batchId, mergeBatch);
  }

  getInletData(data: any) {
    return repository.getInletData(data);
  }

  getBlastingData(data: any) {
    return repository.getBlastingData(data);
  }
}
