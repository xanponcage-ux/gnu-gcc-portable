import * as repository from '../repository/LDSC004Query';
import { Post } from '../typed/typed';
import Error from './errors'


export default class LDSC004 {

    getExceptionReport(plant: any, value: any) {
        return repository.getExceptionReport(plant, value)
    }
    getRoundOdMaster(plant: any) {
        return repository.getRoundOdMaster(plant)
    }

    getOnDateCoilReceiving(req: any) {
        return repository.getOnDateCoilReceiving(req)
    }
    getOnDateWiderProduction(req: any) {
        return repository.getOnDateWiderProduction(req)
    }
    getOnDateNarrowProduction(req: any) {
        return repository.getOnDateNarrowProduction(req)
    }
    getOnDateTubeSchedule(req: any) {
        return repository.getOnDateTubeSchedule(req)
    }
    getOnDateTubeProduction(req: any) {
        return repository.getOnDateTubeProduction(req)
    }
    getOnDateCtlProduction(req: any) {
        return repository.getOnDateCtlProduction(req)
    }
    getOnDatePacking(req: any) {
        return repository.getOnDatePacking(req)
    }
    getOnDateDispatch(req: any) {
        return repository.getOnDateDispatch(req)
    }
    getTillDateCoilReceiving(req: any) {
        return repository.getTillDateCoilReceiving(req)
    }
    getTillDateWiderProduction(req: any) {
        return repository.getTillDateWiderProduction(req)
    }
    getTillDateNarrowProduction(req: any) {
        return repository.getTillDateNarrowProduction(req)
    }
    getTillDateTubeSchedule(req: any) {
        return repository.getTillDateTubeSchedule(req)
    }
    getTillDateTubeProduction(req: any) {
        return repository.getTillDateTubeProduction(req)
    }
    getTillDateCtlProduction(req: any) {
        return repository.getTillDateCtlProduction(req)
    }
    getTillDatePacking(req: any) {
        return repository.getTillDatePacking(req)
    }
    getTillDateDispatch(req: any) {
        return repository.getTillDateDispatch(req)
    }
    getTubeProdMonthlyReport(req: any) {
        return repository.getTubeProdMonthlyReport(req)
    }
    getPackingMonthlyReport(req: any) {
        return repository.getPackingMonthlyReport(req)
    }

}