
import * as repository from "../repository/LD06S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LD06S001 {

  insertTempData(data: any)
  {
      return repository.insertTempData(data);
  }

  callproc50(data: any)
  {
      return repository.callproc60(data);
  }

  deleteTempData(data: any)
  {
      return repository.deleteTempData(data);
  }

  getMatNo(rmBatch: any)
    {
        return repository.getMatNo(rmBatch);
    }

    getPono(rmBatch: any,pipeno: any)
    {
        return repository.getPono(rmBatch,pipeno);
    }
    getFillData(rmBatch: any,pipeno: any,status: any){
        return repository.getFillData(rmBatch,pipeno,status);

    }
   
}