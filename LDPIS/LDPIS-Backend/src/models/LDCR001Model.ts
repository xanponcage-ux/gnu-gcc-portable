import * as repository from "../repository/LDCR001Query";
import { Post } from "../typed/typed";
import Error from "./errors";
export default class LDCR001 {

  getinspectorlist(process: any) {
    return repository.getinspectorlist(process);
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

  getVdidata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    shift : any,
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
      shift,
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
    shift : any,
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
      shift,
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
    shift : any,
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
      shift,
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
    shift : any,
    crdate: any,
    inspector : any,
    heatno: any,
    pipeno: any,
    mutverification: any,
    result: any,
    //   ,rmno: any
  ) {
    return repository.getautomaticweld(
      plant,
      orderNo,
      item,
      matno,
      shift,
      crdate,
      inspector,
      heatno,
      pipeno,
      mutverification,
      result,
      // ,rmno
    );
  }

  getautomaticweldbody(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    shift : any,
    crdate: any,
    inspector : any,
    heatno: any,
    pipeno: any,
    mutverification: any,
    //   ,rmno: any
  ) {
    return repository.getautomaticweldbody(
      plant,
      orderNo,
      item,
      matno,
      shift,
      crdate,
      inspector,
      heatno,
      pipeno,
      mutverification,

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
    shift : any,
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
      shift,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

  getMRRdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    shift : any,
    crdate: any,
    heatno: any,
    pipeno: any,
    //   ,rmno: any
    slitNo: any
  ) {
    return repository.getMRRdata(
      plant,
      orderNo,
      item,
      matno,
      shift,
      crdate,
      heatno,
      pipeno,
      // ,rmno,
      slitNo
    );
  }

  getMRRSdata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    shift : any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getMRRSdata(
      plant,
      orderNo,
      item,
      matno,
      shift,
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

  getmechanicaldataWTWT(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getmechanicaldataWTWT(
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
    shift : any,
    inspector : any,
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
      shift,
      inspector,
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
    shift : any,
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
      shift,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

    // getInventoryData(
    //     DespFromDate: any,
    //     DespToDate: any,
    //     ProdFromDate: any,
    //     ProdToDate: any,
    //     batch: any,
    //     customer: any,
    //     item: any,
    //     materialNo: any,
    //     mbatch: any,
    //     order: any,
    //     orderType: any,
    //     plant: any,
    //     process: any,
    //     status: any,
    //     thikFrm: any,
    //     thikTo: any,
    //     widthFrm: any,
    //     widthTo: any,
    //     stockType: any) {
    //     return repository.getInventoryData(
    //         DespFromDate,
    //         DespToDate,
    //         ProdFromDate,
    //         ProdToDate,
    //         batch,
    //         customer,
    //         item,
    //         materialNo,
    //         mbatch,
    //         order,
    //         orderType,
    //         plant,
    //         process,
    //         status,
    //         thikFrm,
    //         thikTo,
    //         widthFrm,
    //         widthTo,
    //         stockType)
    // }

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

  GetPipenomillround(plant: any,crdate: any,item: any,orderNo: any,roundsectionmill:any) {
    return repository.GetPipenomillround(plant,crdate,item,orderNo,roundsectionmill);
  }

  GetPipenomulti(plant: any,crdate: any,item: any,orderNo: any,roundsectionmill: any) {
    return repository.GetPipenomulti(plant,crdate,item,orderNo,roundsectionmill);
  }

  GetPipenomill(plant: any) {
    return repository.GetPipenomill(plant);
  }
  GetSlitnomill(plant: any,crdate: any,item: any,orderNo: any,roundsectionmill: any, rm: any) {
    return repository.GetSlitnomill(plant,crdate,item,orderNo,roundsectionmill, rm);
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
}


// CHanges for production movement