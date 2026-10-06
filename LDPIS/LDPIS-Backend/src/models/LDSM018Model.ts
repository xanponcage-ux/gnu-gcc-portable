import * as repository from '../repository/LDSM018Query';
import { Post } from '../typed/typed';
import Error from './errors';

export default class LDSM018 {
    GetProcDesc(Plant: any) {
        return repository.GetProcDesc(Plant);
    }
    getHoldData(
        plant : any,
        process : any,
        batch_id : any,
        mBatch : any,
        frmDt : any,
        toDt : any,
        frmDtRls : any,
        toDtRls : any
    ) {
        return repository.getHoldData(
            plant,
            process,
            batch_id,
            mBatch,
            frmDt,
            toDt,
            frmDtRls,
            toDtRls)
    };
}