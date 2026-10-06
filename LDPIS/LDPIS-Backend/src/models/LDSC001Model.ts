import * as repository from '../repository/LDSC001Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSC001 {

    getProdInqData(plant: any, value: any) {

        return repository.getProdInqData(plant, value)
    }
}