import * as repository from '../repository/LDSM009Query';
import { Post } from '../typed/typed';
import Error from './errors'


export default class LDSM009 {

    GetProcess(Plant: any) {
        return repository.GetProcess(Plant);
    }


    getProdInqData(plant: any, Process: any,pname:any, Batch_Id: any, MBatch_Id: any, ThickMin: any, ThickMax: any, widthMin: any, widthMax: any, ProdDateFrom: any, ProdDateTo: any, SchedDateFrom: any, SchedDateTo: any, prodType: any) {
        return repository.getProdInqData(plant, Process,pname, Batch_Id, MBatch_Id, ThickMin, ThickMax, widthMin, widthMax, ProdDateFrom, ProdDateTo, SchedDateFrom, SchedDateTo, prodType)
    }

    getReportData(plant: any, Process: any,pname:any, Batch_Id: any, MBatch_Id: any, ThickMin: any, ThickMax: any, widthMin: any, widthMax: any, ProdDateFrom: any, ProdDateTo: any, SchedDateFrom: any, SchedDateTo: any, prodType: any) {
        return repository.getReportData(plant, Process,pname, Batch_Id, MBatch_Id, ThickMin, ThickMax, widthMin, widthMax, ProdDateFrom, ProdDateTo, SchedDateFrom, SchedDateTo, prodType)
    }
}