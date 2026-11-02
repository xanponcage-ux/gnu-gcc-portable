import * as repository from "../repository/TTSC012Query";

export default class  TTSC012 {

  getPlant() {
    return repository.getPlant();
  }
  getPlanData(Plant: any, MonthYear:any) {
    return repository.getPlanData(Plant, MonthYear);
  };
  savePlan(plant: any, yearmon: any, catId: any, abp: any, osp: any,abpFrequency: any, ospFrequency: any, user: any,) {
    return repository.savePlan(plant, yearmon, catId, abp, osp,abpFrequency, ospFrequency, user);
    }
};  