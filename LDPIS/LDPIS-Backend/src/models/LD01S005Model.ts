import * as repository from "../repository/LD01S005Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S005 {
  getList(props: any) {
    return repository.getList(props);
  }
  getMatNoList(data: any) {
    return repository.getMatNoList(data);
  }
  getFittingOrder(props: any) {
    return repository.getFittingOrder(props);
  }
}
