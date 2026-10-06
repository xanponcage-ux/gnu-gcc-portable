import * as repository from "../repository/LDSC003Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LDSC003 {
  getBOMData(plant : any) {
    return repository.getBOMData(plant);
  }
 
}
