import * as repository from '../repository/LDSM024Query'
import { Post } from '../typed/typed';
import Error from './errors'
export default class LDSM024 {
    getInventoryData(
        DespFromDate: any,
        DespToDate: any,
        ProdFromDate: any,
        ProdToDate: any,
        batch: any,
        customer: any,
        item: any,
        materialNo: any,
        mbatch: any,
        order: any,
        orderType: any,
        plant: any,
        process: any,
        status: any,
        thikFrm: any,
        thikTo: any,
        widthFrm: any,
        widthTo: any,
        stockType: any) {
        return repository.getInventoryData(
            DespFromDate,
            DespToDate,
            ProdFromDate,
            ProdToDate,
            batch,
            customer,
            item,
            materialNo,
            mbatch,
            order,
            orderType,
            plant,
            process,
            status,
            thikFrm,
            thikTo,
            widthFrm,
            widthTo,
            stockType)
    }

   

}