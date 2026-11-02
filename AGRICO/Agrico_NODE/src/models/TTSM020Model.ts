import * as repository from '../repository/TTSM020Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class TubePlanning {
    
    getTubePlanData(plant: any,Order1: any,Item: any,div: any,orderType: any,MatNo: any,ORDDTFROM: any,ORDDTTO: any,tdc: any,thickFrm: any,thickTo: any,widthFrm: any,widthTo: any,cust: any) {
        return repository.getTubePlanData(plant,Order1,Item,div,orderType,MatNo,ORDDTFROM,ORDDTTO,tdc,thickFrm,thickTo,widthFrm,widthTo,cust)
    }
    getPlanModalData(plant: any,Order1: any,Item: any) {
        return repository.getPlanModalData(plant,Order1,Item)
    }

    getOdiaFrm(plant : any) {
        return repository.getOdiaFrm(plant);
    }

    getOdiaTo(plant : any) {
        return repository.getOdiaTo(plant);
    }
    getOrderType(plant : any) {
        return repository.getOrderType(plant);
    }
    getRefresh() {
        return repository.getRefresh();
    }
}