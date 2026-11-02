import * as repository from "../repository/TTSC013Query";

export default class  TTSC013 {

//   getPlant() {
//     return repository.getPlant();
//   }
    getFgProdData(Plant: any, fromDate:any, toDate:any) {
        return repository.getFgProdData(Plant, fromDate, toDate);
  };
    updateRemarks(Plant: any, REMARKS: any ,OSP:any) {
      return repository.updateRemarks(Plant, REMARKS,OSP);
    }
};  