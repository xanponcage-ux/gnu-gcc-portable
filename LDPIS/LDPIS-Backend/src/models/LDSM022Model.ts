import * as repository from '../repository/LDSM022Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class FGStock {
    
    getFGData(plant: any, upType: any, batch: any, mBatch: any, status: any, order: any,
        item:any, Upload_Date_From: any,Upload_Date_To:any) {
return repository.getFGData(plant , upType , batch , mBatch , status , order ,
    item, Upload_Date_From ,Upload_Date_To)
    }
    updateFGData(status: any,ORDER_ID : any, ORER_ITEM : any ,  CHARG : any ,TIME_STAMP : any, new_status:any) {
        return repository.updateFGData(status,ORDER_ID,ORER_ITEM,CHARG,TIME_STAMP, new_status)
    }
    
    getUploadType()
    {
        return repository.getUploadType();
    }
}