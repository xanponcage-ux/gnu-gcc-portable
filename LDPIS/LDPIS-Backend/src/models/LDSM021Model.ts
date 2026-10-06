import * as repository from '../repository/LDSM021Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class FGStock {
    
    getRMData(WERKS: any, CLIENT_ID: any, status: any, invoice: any, Upload_Date_From: any,
        Upload_Date_To:any, delivery:any, batch:any, action:any) {
return repository.getRMData(WERKS, CLIENT_ID, status, invoice, Upload_Date_From,
    Upload_Date_To, delivery, batch, action)
    }

    
    updateRMData(timestamp:any,charg:any, old_status:any, new_status:any) {
return repository.updateRMData(timestamp,charg, old_status, new_status)
    }
}