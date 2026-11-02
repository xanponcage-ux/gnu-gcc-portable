import * as repository from '../repository/TTSM170Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class C1CES170 {

    getRolePlant(Plant: any) {
        return repository.getRolePlant(Plant)
    }

    getBatchId(Plant: any) {
        return repository.getBatchId(Plant)
    }

    GetProcDesc(Plant: any, tabValue: any) {
        return repository.GetProcDesc(Plant, tabValue)
    }

    GetIDIA(Plant: any) {
        return repository.GetIDIA(Plant)
    }

    GetODIA(Plant: any) {
        return repository.GetODIA(Plant)
    }

    GetRoll(Plant: any) {
        return repository.GetRoll(Plant)
    }

    GetPath(Plant: any, Process: any) {
        return repository.GetPath(Plant, Process)
    }

    getPathKhapoli(Plant: any, FG_Mat: any) {
        return repository.getPathKhapoli(Plant, FG_Mat)
    }


    OrdercHK(Plant: any, OrderNo: any, ItemNo: any) {
        return repository.OrdercHK(Plant, OrderNo, ItemNo)
    }

    RMDetails(Plant: any, FG_Mat: any) {
        return repository.RMDetails(Plant, FG_Mat)
    }

    CoilDetails(Plant: any, Process: any, RM_Mat: any, Order: any, Item: any) {
        return repository.CoilDetails(Plant, Process, RM_Mat, Order, Item)
    }

    schTypModal(Plant: any, RM_Mat: any, Order: any, Item: any) {
        return repository.schTypModal(Plant, RM_Mat, Order, Item)
    }

    GetSchDetl(Plant: any, Process: any, BatchID: any) {
        return repository.GetSchDetl(Plant, Process, BatchID)
    }

    GetInqDetl(Plant: any, Process: any, BatchID: any, Status: any, OrdID: any, OrdItm: any, Prod_DT: any) {
        return repository.GetInqDetl(Plant, Process, BatchID, Status, OrdID, OrdItm, Prod_DT)
    }

    GetWIPSchDetl(Plant: any, BatchID: any) {
        return repository.GetWIPSchDetl(Plant, BatchID)
    }

    ScheduleConf(Plant: any, shift: any, Prod_dt: any, ele: any, CHK_PFS: any, Process: any) {
        return repository.ScheduleConf(Plant, shift, Prod_dt, ele, CHK_PFS, Process)
    }

    ScheduleDel(Plant: any, ele: any) {
        return repository.ScheduleDel(Plant, ele)
    }

    WIPSchedule(req: any) {
        return repository.WIPSchedule(req)
    }

    CRTSchedule(req: any) {
        return repository.CRTSchedule(req)
    }

    CRTScheduleAll(PlanPath: any, Plant: any, Process: any, ORD_ID: any, ORD_ITM: any, ORD_QTY: any, IDIA: any, ODIA: any, LENGTH: any, THICK: any, GRADE: any, MATNR: any, PROS_WT: any, GALVY_WT: any, rollchange: any, MOTHER_BATCH: any, CL_WT: any, CL_MATNR: any, FG_WT: any, adid: any, EOP_SFG_MATNR_BOM: any, P_SCH_TYPE_FL: any, P_NOMINATE_BATCH: any, P_NOMINATE_MATNR: any, REMARKS: any, priority: any) {
        return repository.CRTScheduleAll(PlanPath, Plant, Process, ORD_ID, ORD_ITM, ORD_QTY, IDIA, ODIA, LENGTH, THICK, GRADE, MATNR, PROS_WT, GALVY_WT, rollchange, MOTHER_BATCH, CL_WT, CL_MATNR, FG_WT, adid, EOP_SFG_MATNR_BOM, P_SCH_TYPE_FL, P_NOMINATE_BATCH, P_NOMINATE_MATNR, REMARKS, priority)
    }

    GetOrder(req: any) {
        return repository.GetOrder(req)
    }

    GetAddedColumns(id: any) {
        return repository.GetAddedColumns(id)
    }

    getWorkCenter(Plant: any, process: any) {
        return repository.getWorkCenter(Plant, process)
    }

    getMotherBatch(req: any) {
        return repository.getMotherBatch(req)
    }

    getAllOrderList(req: any) {
        return repository.getAllOrderList(req)
    }

    getAllItemList(req: any) {
        return repository.getAllItemList(req)
    }

    schMatDesc(req: any) {
        return repository.schMatDesc(req)
    }

    getMergeBatchDetails(req: any) {
        return repository.getMergeBatchDetails(req)
    }

    ScheduleDelMerge(req: any) {
        return repository.ScheduleDelMerge(req)
    }

    noMergeDetails(req: any) {
        return repository.noMergeDetails(req)
    }

    saveTUBEWIP(Plant: any, process: any, ele: any) {
        return repository.saveTUBEWIP(Plant, process, ele)
    }

    getPrioity(req: any) {
        return repository.getPrioity(req)
    }

}