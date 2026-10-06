import * as repository from '../repository/LDSM007Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSMS007 {

    getBUnitCd(plant: any) {
        return repository.getBUnitCd(plant)
    }

    getGroupPlant(id: any) {
        return repository.getGroupPlant(id)
    }

    GetOrdTyp(plant: any) {
        return repository.GetOrdTyp(plant)
    }

    GetProdCat(req: any) {
        return repository.GetProdCat(req)
    }

    GetCustDesc(plant: any) {
        return repository.GetCustDesc(plant)
    }

    GetOrderDT(
              Customer : any,
              DispFr : any,
              DispTo : any,
              Item : any,
              MatNo : any,
              OrdStAs : any,
              OrdTyp : any,
              OrddtFr : any,
              OrddtTm : any,
              Order1 : any,
              Plant : any,
              ThickFr : any,
              ThickTo : any,
              WidthFr : any,
              WidthTo : any
    ) {
        return repository.GetOrderDT(
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo
        );
    }

    GetOrderDT_Tubes(
            Customer : any,
            DispFr : any,
            DispTo : any,
            Item : any,
            MatNo : any,
            OrdStAs : any,
            OrdTyp : any,
            OrddtFr : any,
            OrddtTm : any,
            Order1 : any,
            Plant : any,
            ThickFr : any,
            ThickTo : any,
            WidthFr : any,
            WidthTo : any,
            LengthFrm : any,
            LengthTo : any,
            SlitPlan : any,
    ) {
        return repository.GetOrderDT_Tubes(
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo,
            LengthFrm,
            LengthTo,
            SlitPlan,
        )
    }

    getOdia(plant: string) {
        return repository.getOdia(plant);
    }

    getThickList(plant: string) {
        return repository.getThickList(plant);
    }
    
    getlengthList(plant: string) {
        return repository.getlengthList(plant);
    }


}