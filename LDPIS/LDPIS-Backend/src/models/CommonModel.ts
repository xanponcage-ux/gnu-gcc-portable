import * as repository from "../repository/LDSM041Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class CommonModel {
  getGroupPlant(id: any) {
    return repository.getGroupPlant(id);
  }
}
