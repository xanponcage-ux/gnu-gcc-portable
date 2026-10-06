import * as repository from "../repository/LDSC011Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LDSC011 {
  getOrderData(plant : any,OrdGrd : any) {
    return repository.getOrderData(plant,OrdGrd);
  }
  updateOrderData(data: any,adid : any) {
    let resM = repository.updateOrderData(data,adid);
    console.log("resM :", resM);
    return resM;
  }
  InsertOrderData(data: any,adid : any) {
    return repository.InsertOrderData(data,adid);
  }
  DeleteOrderData(data: any,adid : any) {
    return repository.DeleteOrderData(data,adid);
  }
  getCdValue() {
    return repository.getCdValue();
  }

  getPathVal() {
    return repository.getPathVal();
  }
 
}