import * as repository from '../repository/LDSM020Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class TubePlanning {
    
    getTubePlanData(plant: any,Order1: any,Item: any,MatNo: any,tdc: any,thickFrm: any,thickTo: any,widthFrm: any,widthTo: any,cust: any) {
        return repository.getTubePlanData(plant,Order1,Item,MatNo,tdc,thickFrm,thickTo,widthFrm,widthTo,cust)
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
    getRefresh() {
        return repository.getRefresh();
    }
}

//added