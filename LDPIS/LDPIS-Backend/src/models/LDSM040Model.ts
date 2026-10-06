import * as repository from '../repository/LDSM040Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSM003 {

    GetProcDesc(Plant: any) {
        return repository.GetProcDesc(Plant)
    }

    GetCustDesc(Plant: any) {
        return repository.GetCustDesc(Plant)
    }

    CheckSCO(Plant: any, dt: any) {
        return repository.CheckSCO(Plant, dt)
    }

    GetOrderType(Plant: any) {
        return repository.GetOrderType(Plant)
    }

    GetTracking(Plant: any) {
        return repository.GetTracking(Plant)
    }

    getCoils(Plant: any, Process: any, Status: any, Batch: any, Order_Type: any, TDC: any, SchTyp: any, Order: any, Order_Item: any, Customer_code: any, SchDt_from: any, SchDt_To: any, Prdn_Dt: any, Tracking:any, WorkCenter: any,Odia: any,Idia: any,Thick: any) {
        return repository.getCoils(Plant, Process, Status, Batch, Order_Type, TDC, SchTyp, Order, Order_Item, Customer_code, SchDt_from, SchDt_To, Prdn_Dt, Tracking,WorkCenter,Odia,Idia,Thick)
    }
    getCustData(Plant: any, Process: any, Status: any, Batch: any, Order_Type: any, TDC: any, SchTyp: any, Order: any, Order_Item: any, Customer_code: any, SchDt_from: any, SchDt_To: any, Prdn_Dt: any, Tracking:any, WorkCenter: any,Odia: any,Idia: any,Thick: any) {
        return repository.getCustData(Plant, Process, Status, Batch, Order_Type, TDC, SchTyp, Order, Order_Item, Customer_code, SchDt_from, SchDt_To, Prdn_Dt, Tracking,WorkCenter,Odia,Idia,Thick)
    }

    getSlitCoilDetails(plant: any, mother_batch: any) {
        return repository.getSlitCoilDetails(plant, mother_batch);
    }
    getWorkCenter(plant: any, process: any) {
        return repository.getWorkCenter(plant, process);
    }  
    getTdcList(plant: any) {
        return repository.getTdcList(plant);
    }   
}