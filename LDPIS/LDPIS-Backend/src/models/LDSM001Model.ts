import * as repository from '../repository/LDSM001Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSM001 {

    getCoils(Plant: any, Order: any, Item: any, sfgMat:any) {                

        return repository.GetCoils(Plant, Order, Item, sfgMat)
    }    

    linkCoils(plant: any, order: any, item: any, batchId: any , remarks : any , allotedQty : any , btp : any , BTP_T : any, sfgMaterial:any) {                

        return repository.LinkCoils(plant, order, item, batchId , remarks , allotedQty , btp , BTP_T, sfgMaterial);
    }    

    getOrders( Plant: any,//0
        Order: any, //1
        Item: any, //2
        Odia: any, //3
        Idia: any, //4
        OrderType: any, //5
        OrderCreateFrom: any, //6
        OrderCreateTo: any,//7
        Thick1: any, //8
        Thick2: any, //9
        Grade: any, //10
        Length: any //11
    ) {    
            
        
        return repository.GetOrders(Plant, Order, Item, Odia, Idia, OrderType, OrderCreateFrom, OrderCreateTo,Thick1,Thick2,Grade,Length)
    }   


    getCoilsDeviationFromBOM(Plant: any, Order: any, Item: any, SFG_MAT:any) {                

        return repository.GetCoilsDeviationFromBOM(Plant, Order, Item, SFG_MAT)
    }  

    getDeAllot(
        plant : any,
        idia : any,
        item : any,
        odia : any,
        orderId : any,
        orderType : any){
        return repository.getDeAllot(plant,
                                    idia,
                                    item,
                                    odia,
                                    orderId,
                                    orderType);
    }

    updateAllotData(
        BATCH_ID : any,
        personalNo : any,
        EPA_CODE : any,
        order:any,
        item:any,
        remarks:any
        ){
            return repository.updateAllotData(BATCH_ID,
                personalNo,
                EPA_CODE,
                order,
                item,
                remarks);
        } 
        
        getWIPCoilsMatchingWithBOM(Plant: any, Order: any, Item: any, OrdTdc: any) {                

            return repository.GetWIPCoilsMatchingWithBOM(Plant, Order, Item,OrdTdc)
        }
        getWIPCoilsNotMatchingWithBOM(Plant: any, Order: any, Item: any) {                

            return repository.GetWIPCoilsNotMatchingWithBOM(Plant, Order, Item)
        }

        chemChk(LS_CD_EPA: any, LS_ORDER_NO: any, LN_ITEM_NO: any, LS_BATCH_ID: any){
            return repository.chemChk(LS_CD_EPA, LS_ORDER_NO, LN_ITEM_NO, LS_BATCH_ID)
        }

        getOdia(plant: string) {
            return repository.getOdia(plant);
        }
       
        getDOdia(plant: string) {
            return repository.getDOdia(plant);
        }
    
        getThickList(plant: string) {
            return repository.getThickList(plant);
        }
        
        getlengthList(plant: string) {
            return repository.getlengthList(plant);
        }
        getIdiaList(plant: string) {
            return repository.getIdiaList(plant);
        }
        getDIdiaList(plant: string) {
            return repository.getDIdiaList(plant);
        }
        getOrderType(req: any) {
            return repository.getOrderType(req)
        }
        getCoilList(req: any) {
            return repository.getCoilList(req)
        }
    
        checkCEWProduct(Plant: any, FG_Mat: any, ) {                
          
            return repository.checkCEWProduct(Plant, FG_Mat)
        }
        getWIPCoilsMatchingWithTDCBOM(Plant: any, OrdTdc: any) {                

            return repository.GetWIPCoilsMatchingWithTDCBOM(Plant, OrdTdc)
        }
}

