import * as repository from "../repository/LDLTS009Query";
import Error from "./errors"; 

export default class LDLTS009 {
    getOrderid(data: any) {
      return repository.getOrderid(data);
    }
    
  async getDetails(data: any) {
    try {
      return await repository.getDetails(data);
    } catch (error) {
      throw new Error.InternalServerErrorMsg(error);
    }
  }

  async insertUpdateDetails(data: any) {
    try {
      return await repository.insertUpdateDetails(data);
    } catch (error) {
      throw new Error.InternalServerErrorMsg(error);
    }
  }
}
