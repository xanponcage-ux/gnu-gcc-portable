import * as repository from '../repository/LDSM032Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class C1CES032 {

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

    OrdercHK(Plant: any, OrderNo: any, ItemNo: any) {
        return repository.OrdercHK(Plant, OrderNo, ItemNo)
    }

    RMDetails(Plant: any, FG_Mat: any) {
        return repository.RMDetails(Plant, FG_Mat)
    }

    CoilDetails(Plant: any, RM_Mat: any, Order: any, Item: any) {
        return repository.CoilDetails(Plant, RM_Mat, Order, Item)
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

    ScheduleConf(req: any) {
        return repository.ScheduleConf(req)
    }

    ScheduleDel(req: any) {
        return repository.ScheduleDel(req)
    }

    WIPSchedule(req: any) {
        return repository.WIPSchedule(req)
    }

    CRTSchedule(req: any) {
        return repository.CRTSchedule(req)
    }

    GetOrder(req: any) {
        return repository.GetOrder(req)
    }

    GetAddedColumns(id: any) {
        return repository.GetAddedColumns(id)
    }

    getWorkCenter(Plant: any) {
        return repository.getWorkCenter(Plant)
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

}