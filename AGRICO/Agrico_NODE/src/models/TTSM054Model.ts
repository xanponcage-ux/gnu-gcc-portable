import * as repository from "../repository/TTSM054Query";

export default class  TTSM054 {
  getDispatchData(Plant: any, FrDate: any, ToDate: any, matno: any, OrderId: any, OrderItem: any, division:any) {
    return repository.getDispatchData(Plant, FrDate, ToDate, matno, OrderId, OrderItem, division);
  };
  getPlanningData(Plant: any, FrDate: any, ToDate: any, OrderId: any, OrderItem: any, division:any) {
    return repository.getPlanningData(Plant, FrDate, ToDate, OrderId, OrderItem, division);
  };
   getFGMAT(Plant: any) {
      return repository.getFGMAT(Plant);
    }
  
}