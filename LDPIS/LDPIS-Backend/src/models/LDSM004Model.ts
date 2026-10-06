import * as repository from "../repository/LDSM004Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LDSM004 {

    GetProcess(Plant: any) {
        return repository.GetProcess(Plant);
    }


    GetBatchTonage(Plant: any, PROC: any, Batch: any, MBatch: any, CusrOrd: any, CustItm: any, Thick: any, Idia: any, BatchWT: any, QLTYCD: any, Odia: any, CampNo: any) {
        return repository.GetBatchTonage(Plant, PROC, Batch, MBatch, CusrOrd, CustItm, Thick, Idia, BatchWT, QLTYCD, Odia, CampNo);
    };

    GetBatchDtl(Plant: any, Batch: any, ProcLine: any, workcenter: any, recordType:any) {
        return repository.GetBatchDtl(Plant, Batch, ProcLine, workcenter, recordType);
    }

    GetBatchInfo(Plant: any, Batch: any) {
        return repository.GetBatchInfo(Plant, Batch);
    }

    getUserIdsEditableMass(Plant: any, userid: any) {
        return repository.getUserIdsEditableMass(Plant, userid);
    }

    GetODIA(Plant: any, Process: any) {
        return repository.GetODIA(Plant, Process);
    }

    getReverseMerge(Plant: any, Process: any, workCenter:any) {
        return repository.getReverseMerge(Plant, Process, workCenter);
    }

    callUNMERGE(mBatchA:any, Plant:any, ProcLine:any) {
        return repository.callUNMERGE(mBatchA, Plant, ProcLine);
    }

    GetPalletPlantCount(Plant: any, ProcessLine: any) {
        return repository.GetPalletPlantCount(Plant, ProcessLine);
    }

    getPrDateShift() {
        return repository.getPrDateShift();
    }

    getAdjBatch(Plant: any, BatchID: any, Thick: any, Width: any, Lengths: any) {
        return repository.getAdjBatch(Plant, BatchID, Thick, Width, Lengths);
    }

    GetLblInfo(Plant: any, Batch: any) {
        return repository.GetLblInfo(Plant, Batch);
    }

    GetPdiDtl(Plant: any, Batch: any, Process: any, ProdDate: any, MBatch: any, BusUnit: any, Odia: any, status: any) {
        return repository.GetPdiDtl(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status);
    }

    GetPdiDtlSingleLot(Plant: any, Batch: any, Process: any, ProdDate: any, MBatch: any, BusUnit: any, Odia: any, status: any, ele: any) {
        return repository.GetPdiDtlSingleLot(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status, ele);
    }

    GetPdiDtlMultiLot(Plant: any, Batch: any, Process: any, ProdDate: any, MBatch: any, BusUnit: any, Odia: any, status: any, ele: any) {
        return repository.GetPdiDtlMultiLot(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status, ele);
    }

    GetBatchDspl(Plant: any, Batch_id: any, MBatch_id: any, Process: any) {
        return repository.GetBatchDspl(Plant, Batch_id, MBatch_id, Process);
    }

    GetWtAdjust(Plant: any, DBatch: any) {
        return repository.GetWtAdjust(Plant, DBatch);
    }

    OrderCheck(Plant: any, OrderID: any, OrdItem: any) {
        return repository.OrderCheck(Plant, OrderID, OrdItem);
    }

    GetPlantPdf(Plant: any) {
        return repository.GetPlantPdf(Plant);
    }

    CntProcPlant(Plant: any) {
        return repository.CntProcPlant(Plant);
    }

    Reverse_Grn(Plant: any, dt: any) {
        return repository.Reverse_Grn(Plant, dt);
    }

    GetVal(Plant: any, BatchID: any, PceActl: any) {
        return repository.GetVal(Plant, BatchID, PceActl);
    }

    GetMResWT(Plant: any, BatchID: any) {
        return repository.GetMResWT(Plant, BatchID);
    }

    GetScrapPlant(Plant: any) {
        return repository.GetScrapPlant(Plant);
    }

    Batch_Chk(Plant: any, IDBatch: any, ProdDate: any, ProcLine: any, IDPDI: any, QltyCD: any) {
        return repository.Batch_Chk(Plant, IDBatch, ProdDate, ProcLine, IDPDI, QltyCD);
    }

    ModifyBatch(Plant: any, dt: any, resWT: any) {
        return repository.ModifyBatch(Plant, dt, resWT);
    }

    GetBatchID(Plant: any, ProcLine: any, RowIndex: any, ProdDate: any, MBatch: any) {
        return repository.GetBatchID(Plant, ProcLine, RowIndex, ProdDate, MBatch);
    }

    ChkBatchID(Plant: any, NewBatch: any) {
        return repository.ChkBatchID(Plant, NewBatch);
    }

    getOrdDtls(Plant: any, OrdId: any, OrdItem: any) {
        return repository.getOrdDtls(Plant, OrdId, OrdItem);
    }

    GetQltyGrade(Plant: any, OrdId: any, OrdItem: any) {
        return repository.GetQltyGrade(Plant, OrdId, OrdItem);
    }

    CheckBatchAvailibility(Plant: any, BatchID: any) {
        return repository.CheckBatchAvailibility(Plant, BatchID);
    }

    WithoutRecordingBypass(Plant: any) {
        return repository.WithoutRecordingBypass(Plant);
    }

    PlanNM(Plant: any) {
        return repository.PlanNM(Plant);
    }

    GetProcLine(Plant: any) {
        return repository.GetProcLine(Plant);
    }

    getCustNm(CustCD: any) {
        return repository.getCustNm(CustCD);
    }

    getSecRsns(Plant: any, RsnCat: any) {
        return repository.getSecRsns(Plant, RsnCat);
    }

    GetScrRsnCD(Plant: any, RsnCat: any) {
        return repository.GetScrRsnCD(Plant, RsnCat);
    }

    GetSlitSts(Plant: any) {
        return repository.GetSlitSts(Plant);
    }

    GetRsnCat(Plant: any) {
        return repository.GetRsnCat(Plant);
    }

    GetHoldRsn(Plant: any) {
        return repository.GetHoldRsn(Plant);
    }

    GetScrRsnCat(Plant: any) {
        return repository.GetScrRsnCat(Plant);
    }

    GetScrMat(Plant: any) {
        return repository.GetScrMat(Plant);
    }

    InvPerc(Plant: any, ScoNo: any, ScoItm: any) {
        return repository.InvPerc(Plant, ScoNo, ScoItm);
    }

    OrderRnage(Plant: any, MBatch: any, Cust_Ord: any, Cust_Itm: any, Thick: any, Width: any, BatchID: any, Process: any, ln_odia_chk: any, MS_PIECE_ACTL: any) {
        return repository.OrderRnage(Plant, MBatch, Cust_Ord, Cust_Itm, Thick, Width, BatchID, Process, ln_odia_chk, MS_PIECE_ACTL);
    }

    CheckRange(Plant: any, MBatch: any, Cust_Ord: any, Cust_Itm: any, Sco_Ord: any, Sco_Itm: any, NxtProc: any, ACT_THICK: any, ACT_WIDTH: any, Width: any, batchID: any, FL_HOLD: any, NetWT: any, Idia: any, Prod_DT: any) {
        return repository.CheckRange(Plant, MBatch, Cust_Ord, Cust_Itm, Sco_Ord.Trim, Sco_Itm, NxtProc, ACT_THICK, ACT_WIDTH, Width, batchID, FL_HOLD, NetWT, Idia, Prod_DT);
    }

    Grade(Plant: any, QLTY_ACTL: any, mk_spec: any, CD_COMP: any, GRADE_DESC: any, MARK_CUST: any, LS_TDC: any, SEC1: any, SEC2: any) {
        return repository.Grade(Plant, QLTY_ACTL, mk_spec, CD_COMP, GRADE_DESC, MARK_CUST, LS_TDC, SEC1, SEC2);
    }

    P_Insert(Plant: any, dt: any, ScrQty: any) {
        return repository.P_Insert(Plant, dt, ScrQty);
    }

    P_Insert_Wires(Plant: any, dt: any, ScrQty: any, TotalQty: any) {
        return repository.P_Insert_Wires(Plant, dt, ScrQty, TotalQty);
    }

    GetMCoilList(Plant: any, Process: any, workCenter: any, radio:any) {
        return repository.GetMCoilList(Plant, Process, workCenter, radio);
    }

    GetScrapWiresDtl(Plant: any, MBatch: any, Process: any, ProdDate: any, SumQty: any) {
        return repository.GetScrapWiresDtl(Plant, MBatch, Process, ProdDate, SumQty);
    }

    DelWorkInst(Plant: any, dt: any, ScrQty: any) {
        return repository.DelWorkInst(Plant, dt, ScrQty);
    }

    InsertLabel(Plant: any, BatchID: any, Sts: any, UserID: any) {
        return repository.InsertLabel(Plant, BatchID, Sts, UserID);
    }

    InsertScr(Plant: any, Process: any, DT: any, UsrID: any) {
        return repository.InsertScr(Plant, Process, DT, UsrID);
    }

    CallProcedureSCRAPPOST(dtParameter: any) {
        return repository.CallProcedureSCRAPPOST(dtParameter);
    }

    SendMailProc(batch: any, epa_cd: any) {
        return repository.SendMailProc(batch, epa_cd);
    }

    UpdateMailTag(Tag: any, Epa_cd: any, batch: any) {
        return repository.UpdateMailTag(Tag, Epa_cd, batch);
    }

    GetMotherCoil(Batch: any, Plant: any) {
        return repository.GetMotherCoil(Batch, Plant);
    }

    GetDaughterCoil(Plant: any) {
        return repository.GetDaughterCoil(Plant);
    }

    FetchParCoil(M_coil: any) {
        return repository.FetchParCoil(M_coil);
    }

    GetBatchIds(M_coil: any, epa_cd: any) {
        return repository.GetBatchIds(M_coil, epa_cd);
    }

    GetMat_type(ProdCd: any) {
        return repository.GetMat_type(ProdCd);
    }

    GetSelectedRsnCat(desc: any) {
        return repository.GetSelectedRsnCat(desc);
    }

    PopMsgData(batch: any, epa_cd: any) {
        return repository.PopMsgData(batch, epa_cd);
    }

    ReqIdGeneration() {
        return repository.ReqIdGeneration();
    }

    SetWtAdj(Plant: any, dt: any, MBatch: any, ResWT: any, PROC: any, ST_DATE: any, RG_IUS: any) {
        return repository.SetWtAdj(Plant, dt, MBatch, ResWT, PROC, ST_DATE, RG_IUS);
    }

    ChkLoc(Plant: any) {
        return repository.ChkLoc(Plant);
    }

    P_INSERT_LP(Plant: any, Batch_id: any, dt: any, ScrQty: any, schd_wt: any) {
        return repository.P_INSERT_LP(Plant, Batch_id, dt, ScrQty, schd_wt);
    }

    GetMatDtlsLP(OrderNo: any, OrderItem: any) {
        return repository.GetMatDtlsLP(OrderNo, OrderItem);
    }

    GetBundleId(Plant: any, ProcLine: any, RowIndex: any, ProdDate: any, MBatch: any) {
        return repository.GetBundleId(Plant, ProcLine, RowIndex, ProdDate, MBatch);
    }

    GetQtyForLP(Plant: any, OrdNo: any, OrdItm: any) {
        return repository.GetQtyForLP(Plant, OrdNo, OrdItm);
    }

    GetBatchDtlforLP_mother(Plant: any, MBatch: any) {
        return repository.GetBatchDtlforLP_mother(Plant, MBatch);
    }

    GetBatchDtlforLP_daughter(Plant: any, MBatch: any, DBatch: any) {
        return repository.GetBatchDtlforLP_daughter(Plant, MBatch, DBatch);
    }
    getTataDate(prodEndDt: any) {
        return repository.getTataDate(prodEndDt);
    }
    getPrevRecorder(User: any) {
        return repository.getPrevRecorder(User);
    }
    insertCoilDetails(ele: any, Plant: any, Batch: any, Process: any, resWt: any, totalNetWt: any, ProdDt: any, Shift: any, user: any, uom: any) {
        return repository.insertCoilDetails(ele, Plant, Batch, Process, resWt, totalNetWt, ProdDt, Shift, user, uom);
    }

    SPCB004_TEMP_Insert(ele: any, Plant: any, Batch: any, Process: any, resWt: any, totalNetWt: any, ProdDt: any, Shift: any, user: any, uom: any, batchType: any) {
        return repository.SPCB004_TEMP_Insert(ele, Plant, Batch, Process, resWt, totalNetWt, ProdDt, Shift, user, uom, batchType);
    }

    updateErrCoilDetails(user: any, errorData: any, errorString: any) {
        return repository.updateErrCoilDetails(user, errorData, errorString);
    }

    delete_tempprod(Plant: any, Batch: any, user: any) {
        return repository.delete_tempprod(Plant, Batch, user);
    }

    sendMerge(Plant: any, Batch: any, newData: any) {
        return repository.sendMerge(Plant, Batch, newData);
    }

    Insert_Khapoli(Plant: any, Batch: any, Process: any, user: any) {
        return repository.Insert_Khapoli(Plant, Batch, Process, user);
    }

    updateCoilDetails(PLANT: any, MCOIL: any, PIECE_ACTL: any, PIECE_ACTL_UOM: any, SCRWT: any, SCRWT_UOM: any, P_USER: any) {
        return repository.updateCoilDetails(PLANT, MCOIL, PIECE_ACTL, PIECE_ACTL_UOM, SCRWT, SCRWT_UOM, P_USER);
    }

    modifyCoilDetails(ele: any, Plant: any, resWt: any, user: any) {
        return repository.modifyCoilDetails(ele, Plant, resWt, user);
    }


    getHoldRsnDetails(req: any) {
        return repository.getHoldRsnDetails(req);
    }

    getBatchCount(req: any) {
        return repository.getBatchCount(req);
    }

    getScrapProductionTable(req: any) {
        return repository.getScrapProductionTable(req);
    }

    getScrapBatchId(req: any) {
        return repository.getScrapBatchId(req);
    }

    getWorkCenterList(req: any) {
        return repository.getWorkCenterList(req);
    }

    getProductionType(req: any) {
        return repository.getProductionType(req);
    }

    getWorkCenter(req: any) {
        return repository.getWorkCenter(req);
    }

    getShiftStatus(req: any) {
        return repository.getShiftStatus(req);
    }

    CRTScheduleMerge(req: any) {
        return repository.CRTScheduleMerge(req)
    }

    getMotherBatch(req: any) {
        return repository.getMotherBatch(req)
    }

    noMergeDetails(req: any) {
        return repository.noMergeDetails(req)
    }

    getRollingLen(req: any) {
        return repository.getRollingLen(req)
    }

    getLengthList(req: any) {
        return repository.getLengthList(req)
    }

    getIntrmMatl(plant:any, fg_mat:any, p_line:any) {
        return repository.getIntrmMatl(plant, fg_mat, p_line)
    }


    getProductName(req: any) {
        return repository.getProductName(req)
    }

    GetPieceActl(P_PLANT: any, P_BATCH_ID: any, P_PROD_NAME: any, P_NO_PCS: any, P_LENGTH: any, P_OD: any, P_ID: any, P_THICKNESS: any) {
        return repository.GetPieceActl(P_PLANT, P_BATCH_ID, P_PROD_NAME, P_NO_PCS, P_LENGTH, P_OD, P_ID, P_THICKNESS);
    }

    getBatchstatuscn(ele:any, Plant:any, workInstNo:any) {
        return repository.getBatchstatuscn(ele, Plant, workInstNo)
    }

    getScrapMatNo(plant: any) {
        return repository.getScrapMatNo(plant)
      }
}
