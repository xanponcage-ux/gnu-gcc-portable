import * as repository from '../repository/TTSC001Query';
import { Post } from '../typed/typed';
import Error from './errors'

// export default class TTSM006 {

//     getProdInqData(plant: any,Process:any,OrderNo:any,ItemNo:any,ThickMin:any,ThickMax:any,widthMin:any,widthMax:any,ProdDateFrom:any,prodDateTo:any,batch:any,shift:any,NextProcess:any) {

// return repository.getProdInqData(plant,Process,OrderNo,ItemNo,ThickMin,ThickMax,widthMin,widthMax,ProdDateFrom,prodDateTo,batch,shift,NextProcess)
//     }
// }

export default class TTSC001 {

    getProdInqData(plant: any, value: any) {

        return repository.getProdInqData(plant, value)
    }
}