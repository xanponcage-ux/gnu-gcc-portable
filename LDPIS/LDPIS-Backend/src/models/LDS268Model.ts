import * as repository from '../repository/LDS268Query';
import { Post } from '../typed/typed';
import Error from './errors'


export default class LDSM006 {

    page20(data: any) {
        return repository.page20(data);
    }
}