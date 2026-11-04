import * as repository from "../repository/LD01S011Query";

export default class LD01S011 {
  getBatches(props: any) {
    return repository.getBatches(props);
  }

  getOrder(props: any) {
    return repository.getOrder(props);
  }

  swap(props: any) {
    return repository.swap(props);
  }
}
