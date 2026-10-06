import * as repository from '../repository/LDSM035Query'
import { Post } from '../typed/typed';
import Error from './errors';

export default class LDSM035 {
    getFGBatchRev(
            batch_id : any    ,
            custOrd : any,
            custItem : any,
            length : any,
            mBatch : any,
            ordType : any,
            plant : any,
            process : any,
            prodCD : any,
            qltyCD : any,
            status : any,
            tdc : any,
            thickFrm : any,
            thickTo : any,
            widthFrm : any,
            widthTo : any
    ) {
        return repository.getFGBatchRev(
            batch_id    ,
            custOrd,
            custItem,
            length,
            mBatch,
            ordType,
            plant,
            process,
            prodCD,
            qltyCD,
            status,
            tdc,
            thickFrm,
            thickTo,
            widthFrm,
            widthTo
            )
    }

    // insertFGBatchRev(
    //     plant : any ,
    //     batch_id : any ,
    //     personalNo : any){
    //     return repository.insertFGBatchRev(
    //         plant ,
    //         batch_id ,
    //         personalNo 
    //     );
    // }

    reverseBatch(
        plant : any ,
        batch_id : any ){
        return repository.reverseBatch(
            plant ,
            batch_id 
        );
    }

    // deleteFGBatchRev(
    //     plant : any ,
    //     batch_id : any ,
    //     personalNo : any
    // ){
    //     return repository.deleteFGBatchRev(
    //         plant ,
    //         batch_id ,
    //         personalNo
    //     );
    // }

    getTdcList(
        plant : any
    ){
        return repository.getTdcList(
            plant
        );
    }

    getUserIdsEditableMass( userid: any) {
        return repository.getUserIdsEditableMass( userid);
    }
    
}