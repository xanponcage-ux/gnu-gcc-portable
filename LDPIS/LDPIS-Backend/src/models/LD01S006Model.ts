import * as repository from "../repository/LD01S006Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S006 {
  getPalletData(data: any) {
    return repository.getPalletData(data);
  }
  savePalletUnmerge(data: any) {
    return repository.savePalletUnmerge(data);
  }
  savePalletDataTemp(data: any, mergeId: any) {
    return repository.savePalletDataTemp(data, mergeId);
  }
  GetMergingStatus(plant: any) {
    return repository.GetMergingStatus(plant);
  }
  savePalletData(mergeId: any) {
    return repository.savePalletData(mergeId);
  }
  deletePalletTemp(user: any) {
    return repository.deletePalletTemp(user);
  }
  getMergeID() {
    return repository.getMergeID();
  }
  getPalletInvData(data: any) {
    return repository.getPalletInvData(data);
  }
    getcheckMergebatch(data: any) {
    return repository.getcheckMergebatch(data);
  }
      getInitialpalletID() {
    return repository.getInitialpalletID();
  }
}
