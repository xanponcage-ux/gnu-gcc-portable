import * as repository from "../repository/LD04S001Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LD04S001 {

  insertTempData(data: any)
  {
      return repository.insertTempData(data);
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

  callproc40(data: any)
  {
      return repository.callproc40(data);
  }

  deleteTempData(data: any)
  {
      return repository.deleteTempData(data);
  }

  getinspectorlist(process: any) {
    return repository.getinspectorlist(process);
  }
}