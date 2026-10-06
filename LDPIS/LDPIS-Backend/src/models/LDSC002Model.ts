import * as repository from "../repository/LDSC002Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDSC002 {
  getTDC() {
    return repository.getTDC();
  }

  getParam(tdc: any) {
    return repository.getParam(tdc);
  }

  getCastNo() {
    return repository.getCastNo();
  }

  getBatchNo() {
    return repository.getBatchNo();
  }

  getCustNoByBatch(batchno: any) {
    return repository.getCustNoByBatch(batchno);
  }

  getIP() {
    return repository.getIP();
  }

  getSpecByIp(ip: any) {
    return repository.getSpecByIp(ip);
  }

  getInspPlan(ip: any, spec: any) {
    return repository.getInspPlan(ip, spec);
  }

  getSpecLimit(tdc: any, param: any) {
    return repository.getSpecLimit(tdc, param);
  }

  getCastTest(castNo: any) {
    return repository.getCastTest(castNo);
  }

  getCoilTest(castNo: any, batchNo: any) {
    return repository.getCoilTest(castNo, batchNo);
  }

  getBatchTest(castNo: any, batchNo: any) {
    return repository.getBatchTest(batchNo, castNo);
  }
}
