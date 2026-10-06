import * as repository from "../repository/LDLTS003Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDLTS003 {
  getOrderid(data: any) {
    return repository.getOrderid(data);
  }
  getItemNo(data: any) {
    return repository.getItemNo(data);
  }
  getOrdDetailLD(data: any) {
    return repository.getOrdDetailLD(data);
  }
  getOrdDetailID(data: any) {
    return repository.getOrdDetailID(data);
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
  updateData(data: any) {
    return repository.updateData(data);
  }
  DeleteProcesssheet(data: any) {
    return repository.DeleteProcesssheet(data);
  }
}
