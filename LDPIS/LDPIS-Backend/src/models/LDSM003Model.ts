import * as repository from '../repository/LDSM003Query';
import { Post } from '../typed/typed';
import Error from './errors'

export default class LDSM003 {

//  LDS001GetData = async (data: any)
//  LDS001GetPlantID = async (data: any)
//  LDS001GetTestCastData = async (data: any)
//  LDS001GetTestBatchData = async (data: any)
//  LDS001SaveLDS003 = async (data: any)
//  generateSeqNo = async (data: any)
//  LDS001UpdateCoilData = async (data: any,seqNo: any)
//  LDS001UpdateCastData = async (data: any,seqNo: any)

    getGroupPlant(id: any) {
        return repository.getGroupPlant(id)
    }

    getCoils(Plant: any, Status: any, BATCH_ID: any, TDC: any, RECVDTFROM: any, RECVDTTO: any, PROCDTFROM: any, PROCDTTO: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, Material: any, INVOICE: any, INVOICE_DTFROM: any, INVOICE_DTTO: any, coilType: any, Length1: any, Length2: any) {
        return repository.getCoils(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, coilType, Length1, Length2)
    }

    getBatchDetails(Plant: any, MBATCH_ID: any) {
        return repository.getBatchDetails(Plant, MBATCH_ID)
    }

    CONFIRM(Plant: any, dt: any, userId: any) {
        return repository.CONFIRM(Plant, dt, userId)
    }

    CONFIRM_Wires(Plant: any, dt: any, UserID: any) {
        return repository.CONFIRM_Wires(Plant, dt, UserID)
    }
    RETURN_COIL(Plant: any, dt: any, userId: any) {
        return repository.RETURN_COIL(Plant, dt, userId)
    }
    getCoils_Wires(Plant: any, Status: any, BATCH_ID: any, TDC: any, RECVDTFROM: any, RECVDTTO: any, PROCDTFROM: any, PROCDTTO: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, Material: any, INVOICE: any, INVOICE_DTFROM: any, INVOICE_DTTO: any, Length1: any, Length2: any) {
        return repository.getCoils_Wires(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, Length1, Length2)
    }

    getCoils_LP(Plant: any, Status: any, BATCH_ID: any, TDC: any, RECVDTFROM: any, RECVDTTO: any, PROCDTFROM: any, PROCDTTO: any, ProdCd: any, QltyCd: any, Thick1: any, Thick2: any, Width1: any, Width2: any, Material: any, INVOICE: any, INVOICE_DTFROM: any, INVOICE_DTTO: any, Length1: any, Length2: any) {
        return repository.getCoils_LP(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, Length1, Length2)
    }

    getOdiaFrm(plant: any) {
        return repository.getOdiaFrm(plant);
    }

    getOdiaTo(plant: any) {
        return repository.getOdiaTo(plant);
    }

    getStatus() {
        return repository.getStatus();
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
    
    getStoreLocation() {
        return repository.getStoreLocation();
    }


}