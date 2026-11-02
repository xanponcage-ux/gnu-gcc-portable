import * as repository from "../repository/TTSC003Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class TTSC003 {
  getBOMData(plant : any) {
    return repository.getBOMData(plant);
  }
  getRouteMasterData(plant : any) {
    return repository.getRouteMasterData(plant);
  }
}
