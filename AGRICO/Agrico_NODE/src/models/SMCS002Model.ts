import * as repository from '../repository/SMCS002Query';
import Error from './errors'


export default class SMCS002 {

    getHeatList(Plant: any) {
        return repository.getHeatList(Plant);
    }

    getHeatDetails(params:{
        plant: any,
        ProdDtFrm: any,
        ProdDtTo: any,
        Decision: any,
        HeatNo: any,
        PcNo :any,
        Caster: any,
        Status: any,
    }){
        return repository.getHeatDetails(params);
    }
} 