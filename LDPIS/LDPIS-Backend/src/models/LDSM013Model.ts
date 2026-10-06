import * as repository from '../repository/LDSM013Query';
import { Post } from '../typed/typed';
import Error from './errors';

export default class LDSM013 {
    GetProcDesc(Plant: any) {
        return repository.GetProcDesc(Plant);
    }
    getDefectData(
        plant : any,
        process : any,
        batch_id : any,
        mBatch : any,
        frmDt : any,
        toDt : any
    ) {
        return repository.getDefectData(
            plant,
            process,
            batch_id,
            mBatch,
            frmDt,
            toDt)
    };
}