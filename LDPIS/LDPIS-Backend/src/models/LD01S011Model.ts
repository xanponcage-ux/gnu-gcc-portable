import * as repository from "../repository/LD01S011Query";

export default class LD01S011 {
  getBatches(props: any) {
    return repository.handleSwap("batches", props);
  }

  getOrder(props: any) {
    return repository.handleSwap("order", props);
  }

  swap(props: any) {
    return repository.handleSwap("swap", props);
  }
}
