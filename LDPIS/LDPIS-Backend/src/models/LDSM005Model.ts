import * as repository from '../repository/LDSM005Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSM005 {

    GetProcDesc(Plant: any) {
        return repository.GetProcDesc(Plant)
    }

    GetOrderType(Plant: any) {
        return repository.GetOrderType(Plant)
    }
    getCommRecorder(User: any) {
        return repository.getCommRecorder(User);
    }

    // GetCount(Plant: any) {
    //     return repository.GetCount(Plant)
    // }


    // CheckPackBatch(Plant: any, Status: any, BatchID: any) {
    //     return repository.CheckPackBatch(Plant, Status, BatchID)
    // }

    GetLargeCount(Plant: any, ID_Batch: any) {
        return repository.GetLargeCount(Plant, ID_Batch)
    }

    // SCO_INSERT(Plant: any, dt: any) {
    //     return repository.SCO_INSERT(Plant, dt)
    // }

    CONFIRM(Plant: any, dt: any, userId: any) {
        return repository.CONFIRM(Plant, dt, userId)
    }

    // CONFIRM_Wires(Plant: any, dt: any, userId:any) {
    //     return repository.CONFIRM_Wires(Plant, dt, userId)
    // }

    // getCoils_Wires(Plant: any, Process: any, Status: any, Order_ID: any, OrderItem: any, batch: any, Mbatch: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, TDC: any, SCO: any, OrderType: any, ProdDtFrom: any, ProdDtTo: any, Customer: any) {
    //     return repository.getCoils_Wires(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer)
    // }

    GetSCOList(Plant: any, Status: any) {
        return repository.GetSCOList(Plant, Status)
    }

    // checkRes(Plant: any, dt: any) {
    //     return repository.checkRes(Plant, dt)
    // }

    // getCoils(Plant: any, Process: any, Status: any, Order_ID: any, OrderItem: any, batch: any, Mbatch: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, TDC: any, SCO: any, OrderType: any, ProdDtFrom: any, ProdDtTo: any, Customer: any) {

    //     return repository.getCoils(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer)

    // }
    getCoils(Plant: any, Process: any, Status: any, Order_ID: any, OrderItem: any, batch: any, Mbatch: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, TDC: any, SCO: any, OrderType: any, ProdDtFrom: any, ProdDtTo: any, Customer: any, Odia: any, PkgDtFrom: any, PkgDtTo: any, pname: any) {

        return repository.getCoils(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer, Odia, PkgDtFrom, PkgDtTo, pname)

    }

    getKbCoils(Plant: any, Process: any, Status: any, Order_ID: any, OrderItem: any, batch: any, Mbatch: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, TDC: any, SCO: any, OrderType: any, ProdDtFrom: any, ProdDtTo: any, Customer: any, Odia: any, PkgDtFrom: any, PkgDtTo: any, pname: any) {
        return repository.getKbCoils(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer, Odia, PkgDtFrom, PkgDtTo, pname)
    }
    // PrintResult(Plant: any, dt: any) {
    //     return repository.PrintResult(Plant, dt)
    // }
    PlantAddress(Plant: any) {
        return repository.PlantAddress(Plant)
    }
    SFGDetails(Plant: any, Batch: any) {
        return repository.SFGDetails(Plant, Batch)
    }

    getSecRsns(Plant: any) {
        return repository.getSecRsns(Plant)
    }

    GetStsList() {
        return repository.GetStsList()
    }

    GetOdiaList(Plant: any) {
        return repository.GetOdiaList(Plant)
    }

    GetCustDesc(Plant: any) {
        return repository.GetCustDesc(Plant)
    }

    getSCO(Plant: any) {
        return repository.getSCO(Plant)
    }

    GetPrvEpa(Plant: any, BatchID: any) {
        return repository.GetPrvEpa(Plant, BatchID)
    }

    GetSrcCoil(Plant: any, BatchID: any) {
        return repository.GetSrcCoil(Plant, BatchID)
    }

    InsertLabel(Plant: any, BatchID: any, Sts: any, UserID: any) {
        return repository.InsertLabel(Plant, BatchID, Sts, UserID)
    }

    getScrapData(req: any) {
        return repository.getScrapData(req);
    }
    updateScrapDetails(req: any) {
        return repository.updateScrapDetails(req);
    }
    insertScrapDetails(Plant: any, dt: any, userId: any) {
        return repository.insertScrapDetails(Plant, dt, userId);
    }
    getScrapFlag(Plant: any, BatchID: any) {
        return repository.getScrapFlag(Plant, BatchID);
    }

    getGroupPlant(id: any) {
        return repository.getGroupPlant(id);
    }

    getBatchId(plant: any, status: any) {
        return repository.GetBatchId(plant, status);
    }

    getIndTubesData(req: any) {
        return repository.getIndTubesData(req);
    }
    GetPieceActl(req: any) {
        return repository.GetPieceActl(req);
    }

    getProductName(req: any) {
        return repository.getProductName(req)
    }

    saveKbBatches(Plant: any,  MBATCHID: any,  userId: any) {
        return repository.saveKbBatches(Plant,  MBATCHID,  userId)
    }
    saveDefectBatches(req: any) {
        return repository.saveDefectBatches(req)
    }

    get_applicatio_id(plant: any, fg_mat_no: any, fg_mat_spec: any) {
        return repository.get_applicatio_id(plant, fg_mat_no, fg_mat_spec)
    }

    get_hsn_code(plant: any, fg_mat_no: any, fg_mat_spec: any) {
        return repository.get_hsn_code(plant, fg_mat_no, fg_mat_spec)
    }

    get_grade(plant: any, fg_mat_no: any, fg_mat_spec: any) {
        return repository.get_grade(plant, fg_mat_no, fg_mat_spec)
    }
}