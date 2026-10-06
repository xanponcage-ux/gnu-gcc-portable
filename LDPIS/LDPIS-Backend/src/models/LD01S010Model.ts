import * as repository from "../repository/LD01S010Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S010 {
  getList(props: any) {
    return repository.getList(props);
  }
  getRM(props: any) {
    return repository.getRM(props);
  }

    getRMtab(props: any) {
    return repository.getRMtab(props);
  }
  populateForecast() {
return repository.populateForecast();
}
}
