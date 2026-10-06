import * as repository from '../repository/LDSC010Query';
import { Post } from '../typed/typed';
import Error from './errors'


export default class LDSC010 {

getRmReceivedOnDate(req: any) {
    return repository.getRmReceivedOnDate(req)
}
getMatGrp(req: any) {
    return repository.getMatGrp(req)
}
getRmReceivedToDate(req: any) {
    return repository.getRmReceivedToDate(req)
}
getAllotmentOnDate(req: any) {
    return repository.getAllotmentOnDate(req)
}
getAllotmentToDate(req: any) {
    return repository.getAllotmentToDate(req)
}
getTubeSchedulingOnDate(req: any) {
    return repository.getTubeSchedulingOnDate(req)
}
getTubeSchedulingToDate(req: any) {
    return repository.getTubeSchedulingToDate(req)
}
getTubeProductionOnDate(req: any) {
    return repository.getTubeProductionOnDate(req)
}
getTubeProductionToDate(req: any) {
    return repository.getTubeProductionToDate(req)
}

getPackingConfirmationOnDate(req: any) {
    return repository.getPackingConfirmationOnDate(req)
}
getPackingConfirmationToDate(req: any) {
    return repository.getPackingConfirmationToDate(req)
}

getInventorySumRm(req: any) {
    return repository.getInventorySumRm(req)
}
getInventorySumWip(req: any) {
    return repository.getInventorySumWip(req)
}
getInventorySumPendingUd(req: any) {
    return repository.getInventorySumPendingUd(req)
}
getInventorySumFG(req: any) {
    return repository.getInventorySumFG(req)
}
getStageWiseInventoryRm(req: any) {
    return repository.getStageWiseInventoryRm(req)
    }

getStageWiseInventoryPendingUd(req: any) {
    return repository.getStageWiseInventoryPendingUd(req)
}
getStageWiseInventoryAnn(req: any) {
    return repository.getStageWiseInventoryAnn(req)
}
getStageWiseInventoryColdDraw(req: any) {
    return repository.getStageWiseInventoryColdDraw(req)
}
getStageWiseInventoryStp(req: any) {
    return repository.getStageWiseInventoryStp(req)
}
getStageWiseInventoryCtl(req: any) {
    return repository.getStageWiseInventoryCtl(req)
}
getStageWiseInventoryHydra(req: any) {
    return repository.getStageWiseInventoryHydra(req)
}
getStageWiseInventoryEct(req: any) {
    return repository.getStageWiseInventoryEct(req)
}
getStageWiseInventoryFG(req: any) {
    return repository.getStageWiseInventoryFG(req)
}
getStageWiseInventoryFinalUD(req: any) {
    return repository.getStageWiseInventoryFinalUD(req)
}
getStageWiseInventoryPacking(req: any) {
    return repository.getStageWiseInventoryPacking(req)
}

// ===========
getRmgrOnDate(req: any) {
    return repository.getRmgrOnDate(req)
}

getRmgrToDate(req: any) {
    return repository.getRmgrToDate(req)
}

getSfgProdOnDate(req: any) {
    return repository.getSfgProdOnDate(req)
}

getSfgProdToDate(req: any) {
    return repository.getSfgProdToDate(req)
}

getAnnProdOnDate(req: any) {
    return repository.getAnnProdOnDate(req)
}

getAnnProdToDate(req: any) {
    return repository.getAnnProdToDate(req)
}

getStpProdOnDate(req: any) {
    return repository.getStpProdOnDate(req)
}

getStpProdToDate(req: any) {
    return repository.getStpProdToDate(req)
}

getColdDProdOnDt(req: any) {
    return repository.getColdDProdOnDt(req)
}

getColdDProdToDt(req: any) {
    return repository.getColdDProdToDt(req)
}

getCltProdOnDate(req: any) {
    return repository.getCltProdOnDate(req)
}

getCltProdToDate(req: any) {
    return repository.getCltProdToDate(req)
}

getHydraProdOnDate(req: any) {
    return repository.getHydraProdOnDate(req)
}

getHydraProdToDate(req: any) {
    return repository.getHydraProdToDate(req)
}

getEtcProdOnDate(req: any) {
    return repository.getEtcProdOnDate(req)
}

getEtcProdToDate(req: any) {
    return repository.getEtcProdToDate(req)
}

getFGOnDate(req: any) {
    return repository.getFGOnDate(req)
}

getFGToDate(req: any) {
    return repository.getFGToDate(req)
}

//==========
getRmgrCurrDate(req: any) {
    return repository.getRmgrCurrDate(req)
}
getSfgProdCurrDate(req: any) {
    return repository.getSfgProdCurrDate(req)
}
getAnnProdCurrDate(req: any) {
    return repository.getAnnProdCurrDate(req)
}
getStpProdCurrDate(req: any) {
    return repository.getStpProdCurrDate(req)
}
getColdDProdCurrDt(req: any) {
    return repository.getColdDProdCurrDt(req)
}
getCltProdCurrDate(req: any) {
    return repository.getCltProdCurrDate(req)
}
getHydraProdCurrDate(req: any) {
    return repository.getHydraProdCurrDate(req)
}
getEtcProdCurrDate(req: any) {
    return repository.getEtcProdCurrDate(req)
}
getFGCurrDate(req: any) {
    return repository.getFGCurrDate(req)
}
getDaysList(req: any) {
    return repository.getDaysList(req)
}
getGRReportData(Days : any,All_Column : any,Total:any, req: any) {
    return repository.getGRReportData(Days,All_Column,Total, req)
}
}