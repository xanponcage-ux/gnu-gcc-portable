import * as repository from '../repository/TTSM067Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class TTSM067 {

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
        EOM_ID_BATCH : any,
        MS_SCRAP : any,
        EOM_CD_STATUS : any,
        EOM_CD_CURR_PROC : any,
        EOM_MS_GROSS_CAL : any,
        HOLD_REASON  : any,
        OPERATOR_REMARKS : any,
        SCRAP_MATNR : any,
        personalNo : any
    ){
        return repository.saveUnloadData(
            plant ,
            EOM_ID_BATCH ,
            MS_SCRAP ,
            EOM_CD_STATUS ,
            EOM_CD_CURR_PROC ,
            EOM_MS_GROSS_CAL ,
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