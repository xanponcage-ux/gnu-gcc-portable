import * as repository from '../repository/LDSM067Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSM067 {

    getProcessDesc(plant: any) {
        return repository.getProcessDesc(plant)
    }

    getCoils(plant : any,
            process : any,
            batch : any,
            prodCd : any,
            status : any,
            tdc : any,
            thickfrm : any,
            thickto : any){
        return repository.getCoils( 
                                    plant,
                                    process,
                                    batch,
                                    prodCd,
                                    status,
                                    tdc,
                                    thickfrm,
                                    thickto
                                );
    }

    getHoldRsn() {
        return repository.getHoldRsn();
    }

    saveUnloadData(
        plant : any,
        LOM_ID_BATCH : any,
        MS_SCRAP : any,
        LOM_CD_STATUS : any,
        LOM_CD_CURR_PROC : any,
        LOM_MS_GROSS_CAL : any,
        HOLD_REASON  : any,
        OPERATOR_REMARKS : any,
        SCRAP_MATNR : any,
        personalNo : any
    ){
        return repository.saveUnloadData(
            plant ,
            LOM_ID_BATCH ,
            MS_SCRAP ,
            LOM_CD_STATUS ,
            LOM_CD_CURR_PROC ,
            LOM_MS_GROSS_CAL ,
            HOLD_REASON  ,
            OPERATOR_REMARKS ,
            SCRAP_MATNR,
            personalNo
        );
    }

    // getStatus(plant : any){
    //     return repository.getStatus(plant);
    // }

    getStatus(){
        return repository.getStatus();
    }
    getScrapMatNo(plant: any) {
        return repository.getScrapMatNo(plant)
    }
}