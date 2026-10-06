import * as repository from "../repository/LDLTS005Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDLTS005 {
  getOrderid(data: any) {
    return repository.getOrderid(data);
  }
  getItemNo(data: any) {
    return repository.getItemNo(data);
  }
  getdateandshift(data: any) {
    return repository.getdateandshift(data);
  }
  getCommonTests(data: any) {
    return repository.getCommonTests(data);
  }
  getOrdDetailLD(data: any) {
    return repository.getOrdDetailLD(data);
  }
  getOrdDetailID(data: any) {
    return repository.getOrdDetailID(data);
  }
  getcountcheck(data: any) {
    return repository.getcountcheck(data);
  }
  getOrdDetailMD(data: any) {
    return repository.getOrdDetailMD(data);
  }
  getOrdDetailSD(data: any) {
    return repository.getOrdDetailSD(data);
  }
  getOrdDetailGD(data: any) {
    return repository.getOrdDetailGD(data);
  }
  insertTempData(data: any) {
    return repository.insertTempData(data);
  }
}
