import * as repository from "../repository/LD01S007Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S007 {
  getList(props: any) {
    return repository.getList(props);
  }
  getMatNoList(data: any) {
    return repository.getMatNoList(data);
  }
  getWipOrders(props: any) {
    return repository.getWipOrders(props);
  }
}
