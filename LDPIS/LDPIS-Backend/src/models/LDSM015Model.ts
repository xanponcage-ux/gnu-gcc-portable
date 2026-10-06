import * as repository from '../repository/LDSM015Query'
import { Post } from '../typed/typed';
import Error from './errors'
export default class LDSM015 {

    getSectionData(
        plant : any
    ) {
        return repository.getSectionData(
            plant
        )
    }
    getODdata(
        data: any
    ) {
        return repository.getODdata(
            data
        )
    }

    
}