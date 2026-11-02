import * as repository from '../repository/TTSM014Query'
import { Post } from '../typed/typed';
import Error from './errors'
export default class TTSM014 {

    getQualityResultData(
        plant : any,
        batch_id : any,
        frmDt : any,
        toDt : any
    ) {
        return repository.getQualityResultData(
            plant,
            batch_id,
            frmDt,
            toDt
        )
    }
    getStripChartData(
        data: any
    ) {
        return repository.getStripChartData(
            data
        )
    }

    
}