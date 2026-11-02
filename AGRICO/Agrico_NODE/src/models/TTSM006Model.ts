import * as repository from '../repository/TTSM006Query';
import { Post } from '../typed/typed';
import Error from './errors'


export default class TTSM006 {

    GetProcess(Plant: any) {
        return repository.GetProcess(Plant);
    }
    getMatGrp(Plant: any) {
        return repository.getMatGrp(Plant);
    }


    getProdInqData(plant: any, Process: any,pname:any, Batch_Id: any, MBatch_Id: any, ThickMin: any, ThickMax: any, widthMin: any, widthMax: any, ProdDateFrom: any, ProdDateTo: any, SchedDateFrom: any, SchedDateTo: any, prodType: any,MatGrp: any) {
        return repository.getProdInqData(plant, Process,pname, Batch_Id, MBatch_Id, ThickMin, ThickMax, widthMin, widthMax, ProdDateFrom, ProdDateTo, SchedDateFrom, SchedDateTo, prodType,MatGrp)
    }
}