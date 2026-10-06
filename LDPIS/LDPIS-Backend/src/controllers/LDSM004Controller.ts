import { Request, Response } from "express";
import moment from 'moment'
import LDSM004 from "../models/LDSM004Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const GetProcess = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetProcess(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getUserIdsEditableMass = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let userid= req.body.UserId;

        const results: any = await LDSM004.prototype.getUserIdsEditableMass(Plant,userid);
        console.log(results.rows);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const GetBatchTonage = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let PROC = req.body.plant;
        let Batch = req.body.plant;
        let MBatch = req.body.plant;
        let CusrOrd = req.body.plant;
        let CustItm = req.body.plant;
        let Thick = req.body.plant;
        let Idia = req.body.plant;
        let BatchWT = req.body.plant;
        let QLTYCD = req.body.plant;
        let Odia = req.body.plant;
        let CampNo = req.body.plant;
        const results: any = await LDSM004.prototype.GetBatchTonage(Plant, PROC, Batch, MBatch, CusrOrd, CustItm, Thick, Idia, BatchWT, QLTYCD, Odia, CampNo);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchDtl = async (req: Request, res: Response) => {
    try {

        let { Plant, Batch, ProcLine, workcenter, recordType } = req.body
        const results: any = await LDSM004.prototype.GetBatchDtl(Plant, Batch, ProcLine, workcenter, recordType);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchInfo = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let Batch = req.body.plant;
        const results: any = await LDSM004.prototype.GetBatchInfo(Plant, Batch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetODIA = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        const results: any = await LDSM004.prototype.GetODIA(Plant, Process);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getReverseMerge = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let workCenter = req.body.workCenter;
        const results: any = await LDSM004.prototype.getReverseMerge(Plant, Process, workCenter);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const callUNMERGE = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var { mBatchArr, Plant, ProcLine } = req.body;
        for (var i = 0; i < mBatchArr.length; i++) {
            var ele = mBatchArr[i];
            var results: any = await LDSM004.prototype.callUNMERGE(ele, Plant, ProcLine);
            var flag = results.outBinds.LS_OUT_FLAG;

            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += " Error for batch " + ele + " -- " + flag.toString().replace("N-", "");
            }
        }

        if (!error) {
            errorString = flag;
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPalletPlantCount = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let ProcessLine = req.body.plant;
        const results: any = await LDSM004.prototype.GetPalletPlantCount(Plant, ProcessLine);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPrDateShift = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM004.prototype.getPrDateShift();
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAdjBatch = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID = req.body.plant;
        let Thick = req.body.plant;
        let Width = req.body.plant;
        let Lengths = req.body.plant;
        const results: any = await LDSM004.prototype.getAdjBatch(Plant, BatchID, Thick, Width, Lengths);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetLblInfo = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let Batch = ""
        const results: any = await LDSM004.prototype.GetLblInfo(Plant, Batch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPdiDtl = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Batch = req.body.Batch;
        let Process = req.body.Process;
        let ProdDate = req.body.ProdDate;
        let MBatch = req.body.MBatch;
        let BusUnit = req.body.BusUnit;
        let Odia = req.body.Odia;
        let status = req.body.status;
        const results: any = await LDSM004.prototype.GetPdiDtl(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPdiDtlSingleLot = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let ProdDate = req.body.ProdDate;
        let BusUnit = req.body.BusUnit;
        let Odia = req.body.Odia;
        let status = req.body.status;

        var results: any = [];
        var metaData: any = [];
        var { newData } = req.body;
        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            var MBatch = newData[i].LOM_ID_BATCH;
            var Batch = newData[i].LOM_ID_BATCH;
            var resDt: any = await LDSM004.prototype.GetPdiDtlSingleLot(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status, ele);
            results.push(resDt.rows);
            metaData.push(resDt.metaData);
        }

        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        var mdLength = metaData[0] ? metaData[0].length : 0;
        for (let i = 0; i < mdLength; i++) {
            header.push((metaData[0][i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < mdLength; i++) {
            var obj: any = {};
            obj.title = (metaData[0][i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.length; i++) {
            const arr = results[i][0];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPdiDtlMultiLot = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let ProdDate = req.body.ProdDate;
        let BusUnit = req.body.BusUnit;
        let Odia = req.body.Odia;
        let status = req.body.status;

        var results: any = [];
        var metaData: any = [];
        var { newData } = req.body;
        var ele = newData[0];
        var MBatch = newData[0].LOM_ID_BATCH;
        var Batch = newData[0].LOM_ID_BATCH;
        var resDt: any = await LDSM004.prototype.GetPdiDtlMultiLot(Plant, Batch, Process, ProdDate, MBatch, BusUnit, Odia, status, ele);
        results.push(resDt.rows);
        metaData.push(resDt.metaData);

        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        var mdLength = metaData[0] ? metaData[0].length : 0;
        for (let i = 0; i < mdLength; i++) {
            header.push((metaData[0][i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < mdLength; i++) {
            var obj: any = {};
            obj.title = (metaData[0][i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.length; i++) {
            const arr = results[i][0];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchDspl = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let Batch_id = "";
        let MBatch_id = "";
        let Process = ""
        const results: any = await LDSM004.prototype.GetBatchDspl(Plant, Batch_id, MBatch_id, Process);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetWtAdjust = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let DBatch = "";
        const results: any = await LDSM004.prototype.GetWtAdjust(Plant, DBatch);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const OrderCheck = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let OrderID;
        let OrdItem
        const results: any = await LDSM004.prototype.OrderCheck(Plant, OrderID, OrdItem);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPlantPdf = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetPlantPdf(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CntProcPlant = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.CntProcPlant(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const Reverse_Grn = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let dt;
        const results: any = await LDSM004.prototype.Reverse_Grn(Plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetVal = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID;
        let PceActl;
        const results: any = await LDSM004.prototype.GetVal(Plant, BatchID, PceActl);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetMResWT = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID;
        const results: any = await LDSM004.prototype.GetMResWT(Plant, BatchID);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetScrapPlant = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetScrapPlant(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const Batch_Chk = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let IDBatch;
        let ProdDate;
        let ProcLine;
        let IDPDI;
        let QltyCD;
        const results: any = await LDSM004.prototype.Batch_Chk(Plant, IDBatch, ProdDate, ProcLine, IDPDI, QltyCD);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ModifyBatch = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let dt;
        let resWT;
        const results: any = await LDSM004.prototype.ModifyBatch(Plant, dt, resWT);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchID = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let ProcLine;
        let RowIndex;
        let ProdDate;
        let MBatch;
        const results: any = await LDSM004.prototype.GetBatchID(Plant, ProcLine, RowIndex, ProdDate, MBatch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ChkBatchID = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let NewBatch;
        const results: any = await LDSM004.prototype.ChkBatchID(Plant, NewBatch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOrdDtls = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let OrdId;
        let OrdItem;
        const results: any = await LDSM004.prototype.getOrdDtls(Plant, OrdId, OrdItem);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetQltyGrade = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let OrdId;
        let OrdItem;
        const results: any = await LDSM004.prototype.GetQltyGrade(Plant, OrdId, OrdItem);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CheckBatchAvailibility = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID;
        const results: any = await LDSM004.prototype.CheckBatchAvailibility(Plant, BatchID);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const WithoutRecordingBypass = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.WithoutRecordingBypass(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const PlanNM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.PlanNM(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetProcLine = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetProcLine(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getCustNm = async (req: Request, res: Response) => {
    try {
        let CustCD = req.body.plant;
        const results: any = await LDSM004.prototype.getCustNm(CustCD);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getSecRsns = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let RsnCat;
        const results: any = await LDSM004.prototype.getSecRsns(Plant, RsnCat);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetScrRsnCD = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let RsnCat;
        const results: any = await LDSM004.prototype.GetScrRsnCD(Plant, RsnCat);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetSlitSts = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetSlitSts(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetRsnCat = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetRsnCat(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetHoldRsn = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetHoldRsn(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetScrRsnCat = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetScrRsnCat(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetScrMat = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.GetScrMat(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const InvPerc = async (req: Request, res: Response) => {
    try {
        let Plant;
        let ScoNo;
        let ScoItm;
        const results: any = await LDSM004.prototype.InvPerc(Plant, ScoNo, ScoItm);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const OrderRnage = async (req: Request, res: Response) => {
    try {
        let Plant;
        let MBatch;
        let Cust_Ord;
        let Cust_Itm;
        let Thick;
        let Width;
        let BatchID;
        let Process;
        let ln_odia_chk;
        let MS_PIECE_ACTL;
        const results: any = await LDSM004.prototype.OrderRnage(Plant, MBatch, Cust_Ord, Cust_Itm, Thick, Width, BatchID, Process, ln_odia_chk, MS_PIECE_ACTL);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CheckRange = async (req: Request, res: Response) => {
    try {
        let Plant;
        let MBatch;
        let Cust_Ord;
        let Cust_Itm;
        let Sco_Ord;
        let Sco_Itm;
        let NxtProc;
        let ACT_THICK;
        let ACT_WIDTH;
        let Width;
        let batchID;
        let FL_HOLD;
        let NetWT;
        let Idia;
        let Prod_DT;
        const results: any = await LDSM004.prototype.CheckRange(Plant, MBatch, Cust_Ord, Cust_Itm, Sco_Ord, Sco_Itm, NxtProc, ACT_THICK, ACT_WIDTH, Width, batchID, FL_HOLD, NetWT, Idia, Prod_DT);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const Grade = async (req: Request, res: Response) => {
    try {
        let Plant;
        let QLTY_ACTL;
        let mk_spec;
        let CD_COMP;
        let GRADE_DESC;
        let MARK_CUST;
        let LS_TDC;
        let SEC1;
        let SEC2;
        const results: any = await LDSM004.prototype.Grade(Plant, QLTY_ACTL, mk_spec, CD_COMP, GRADE_DESC, MARK_CUST, LS_TDC, SEC1, SEC2);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const P_Insert = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let dt;
        let ScrQty
        const results: any = await LDSM004.prototype.P_Insert(Plant, dt, ScrQty);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const P_Insert_Wires = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let dt;
        let ScrQty;
        let TotalQty;
        const results: any = await LDSM004.prototype.P_Insert_Wires(Plant, dt, ScrQty, TotalQty);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetMCoilList = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let workCenter = req.body.workCenter ? req.body.workCenter : '';
        let radio = req.body.radioType;
        const results: any = await LDSM004.prototype.GetMCoilList(Plant, Process, workCenter, radio);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetScrapWiresDtl = async (req: Request, res: Response) => {
    try {
        let Plant;
        let MBatch;
        let Process;
        let ProdDate;
        let SumQty;
        const results: any = await LDSM004.prototype.GetScrapWiresDtl(Plant, MBatch, Process, ProdDate, SumQty);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const DelWorkInst = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let dt;
        let ScrQty;
        const results: any = await LDSM004.prototype.DelWorkInst(Plant, dt, ScrQty);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const InsertLabel = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID;
        let Sts;
        let UserID;
        const results: any = await LDSM004.prototype.InsertLabel(Plant, BatchID, Sts, UserID);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const InsertScr = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let Process;
        let DT;
        let UsrID;
        const results: any = await LDSM004.prototype.InsertScr(Plant, Process, DT, UsrID);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CallProcedureSCRAPPOST = async (req: Request, res: Response) => {
    try {
        let dtParameter = req.body.plant;
        const results: any = await LDSM004.prototype.CallProcedureSCRAPPOST(dtParameter);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const SendMailProc = async (req: Request, res: Response) => {
    try {
        let batch;
        let epa_cd;
        const results: any = await LDSM004.prototype.SendMailProc(batch, epa_cd);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const UpdateMailTag = async (req: Request, res: Response) => {
    try {
        let Tag;
        let Epa_cd;
        let batch;
        const results: any = await LDSM004.prototype.UpdateMailTag(Tag, Epa_cd, batch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetMotherCoil = async (req: Request, res: Response) => {
    try {
        let Batch;
        let Plant;
        const results: any = await LDSM004.prototype.GetMotherCoil(Batch, Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetDaugherCoil = async (req: Request, res: Response) => {
    try {

        let Plant = req.body.Plant;
        const results: any = await LDSM004.prototype.GetDaughterCoil(Plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });

        //return results
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const FetchParCoil = async (req: Request, res: Response) => {
    try {
        let M_coil = req.body.plant;
        const results: any = await LDSM004.prototype.FetchParCoil(M_coil);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchIds = async (req: Request, res: Response) => {
    try {
        let M_coil;
        let epa_cd;
        const results: any = await LDSM004.prototype.GetBatchIds(M_coil, epa_cd);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetMat_type = async (req: Request, res: Response) => {
    try {
        let ProdCd = req.body.plant;
        const results: any = await LDSM004.prototype.GetMat_type(ProdCd);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetSelectedRsnCat = async (req: Request, res: Response) => {
    try {
        let desc = req.body.plant;
        const results: any = await LDSM004.prototype.GetSelectedRsnCat(desc);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const PopMsgData = async (req: Request, res: Response) => {
    try {
        let batch;
        let epa_cd;
        const results: any = await LDSM004.prototype.PopMsgData(batch, epa_cd);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ReqIdGeneration = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM004.prototype.ReqIdGeneration();
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const SetWtAdj = async (req: Request, res: Response) => {
    try {
        let Plant;
        let dt;
        let MBatch;
        let ResWT;
        let PROC;
        let ST_DATE;
        let RG_IUS;
        const results: any = await LDSM004.prototype.SetWtAdj(Plant, dt, MBatch, ResWT, PROC, ST_DATE, RG_IUS);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ChkLoc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM004.prototype.ChkLoc(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const P_INSERT_LP = async (req: Request, res: Response) => {
    try {
        let Plant;
        let Batch_id;
        let dt;
        let ScrQty;
        let schd_wt;
        const results: any = await LDSM004.prototype.P_INSERT_LP(Plant, Batch_id, dt, ScrQty, schd_wt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetMatDtlsLP = async (req: Request, res: Response) => {
    try {
        let OrderNo;
        let OrderItem;
        const results: any = await LDSM004.prototype.GetMatDtlsLP(OrderNo, OrderItem);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBundleId = async (req: Request, res: Response) => {
    try {
        let Plant;
        let ProcLine;
        let RowIndex;
        let ProdDate;
        let MBatch;
        const results: any = await LDSM004.prototype.GetBundleId(Plant, ProcLine, RowIndex, ProdDate, MBatch);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetQtyForLP = async (req: Request, res: Response) => {
    try {
        let Plant;
        let OrdNo;
        let OrdItm;
        const results: any = await LDSM004.prototype.GetQtyForLP(Plant, OrdNo, OrdItm);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetBatchDtlforLP = async (req: Request, res: Response) => {
    try {
        let { Plant, MBatch, DBatch } = req.body;
        var results = await LDSM004.prototype.GetBatchDtlforLP_daughter(Plant, MBatch, DBatch);

        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTataDate = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let { prodEndDt } = req.body;
        console.log(prodEndDt);
        const results: any = await LDSM004.prototype.getTataDate(prodEndDt);
        console.log(results.rows);
        return res.status(200).json(results.rows);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

export const getPrevRecorder = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let { User } = req.body;
        console.log(User);
        const results: any = await LDSM004.prototype.getPrevRecorder(User);
        console.log(results.rows);
        return res.status(200).json( results.rows);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

export const insertCoilDetails = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var uom = "";
        var errorData = "";

        var { newData, scrapData, Plant, Batch, Process, resWt, totalNetWt, ProdDate, Shift, user, recordTyp } = req.body;
        
       // Function to format date to DD/MM/YYYY HH24:MI:SS
const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
   // const s = date.getSeconds().toString().padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
};

// Parse start and end dates correctly
const parseDateString = (dateStr: string) => {
    const parts = dateStr?.split(' ');
    const dateParts = parts[0]?.split('/'); // Assuming date format is DD/MM/YYYY
    const timeParts = parts[1]?.split(':');
    return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`);//
};
    console.log(newData[0].prdPStartDt);
        // Parse the start and end dates properly from the newData array
        const startDate = parseDateString(newData[0].prdPStartDt);
        const endDate = parseDateString(newData[0].prdPEndDt);
        
        // Calculate total duration and interval duration
        const totalDuration = endDate.getTime() - startDate.getTime();
        const intervalDuration = totalDuration / newData.length;
        
        let currentStart = startDate;
            console.log(newData);
            console.log("INTERVALDURATION",intervalDuration);
            
        for (let i = 0; i < newData.length; i++) {
            const ele = newData[i];
            
            // Set start and end times
            ele.prdPStartDt = formatDate(currentStart);
            const currentEnd = new Date(currentStart.getTime() + intervalDuration);
            ele.prdPEndDt = formatDate(currentEnd);
            
             // Calculate the duration for the current record
                const duration = currentEnd.getTime() - currentStart.getTime();
                const resultInMinutes = Math.round(duration / 60000);
                console.log(resultInMinutes);
                // Validation checks
                if (resultInMinutes < 10) {
                    errorString = "N-Minimum activity duration should be more than 10 min!";
                    return res.status(200).json({ errorString });
                } else if (resultInMinutes > 600) {
                    errorString = "N-Maximum activity duration should not exceed 600 min!";
                    return res.status(200).json({ errorString });
                }

                // Update currentStart for next iteration
                currentStart = currentEnd;
            // Update currentStart for next iteration
            currentStart = currentEnd;
        }
        //console.log("new data 1171",newData);

        // Continue with the rest of the logic
        var resDel: any = await LDSM004.prototype.delete_tempprod(Plant, Batch, user);
        console.log("Whole data 1175", newData);

        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            uom = newData[0].EWI_UOM;
            var fg = "FG";
           // console.log("prod start date for index", i, ele.prdPStartDt);
           // console.log("prod date", ProdDate);
            var results: any = await LDSM004.prototype.SPCB004_TEMP_Insert(ele, Plant, Batch, Process, resWt, totalNetWt, ProdDate, Shift, user, uom, fg);
            var flag = results.outBinds.LS_OUT_FLAG;
            errorData = results.outBinds.LS_OUT_FLAG;
            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += "N-Error for batch Prime " + ele.BATCH_ID + " -- " + flag.toString();
            }
        }
        for (var i = 0; i < scrapData.length; i++) {
            var scrapObj = {
                BATCH_ID: scrapData[i].SCRAP_BATCH_ID,
                EWI_ID_ORDER_CUS: scrapData[i].ORDER_ID,
                EWI_ID_ORD_ITEM_CUS: scrapData[i].ITEM,
                NEXT_PROC: '',
                EWI_CD_PROD: '',
                EWI_CD_QLTY: scrapData[i].QLTY,
                ddlRsnHold: '',
                prdTimeDiff: 0,
                EWI_SEC1: 0,
                EWI_SEC2: 0,
                EWI_LENGTH: 0,
                EWI_MS_PIECE_ACTL: scrapData[i].NET_WT,
                EWI_ID_WRK_INST: null,
                EWI_NO_PIECES: scrapData[i].LOM_NO_PIECES,
                IDIA: 0,
                ODIA: 0,
                EWI_ID_SCHEDULE: null,
                EWI_PLANNED_PROC: null,
                CD_HOLD: '',
                HOLD_OP_REMARKS: '',
                prdPStartDt: '',
                prdPEndDt: '',
                ddlWorkCenter: ele.ddlWorkCenter, //Pass prime work center
                FG_MAT: null,
                SFG_MAT: null,
                P_SCRP_MATNR: scrapData[i].MATERIAL,
                P_ROLLING_LENGTH: null,
            };
            var scrap = "SCRAP";

            var results: any = await LDSM004.prototype.SPCB004_TEMP_Insert(scrapObj, Plant, Batch, Process, resWt, totalNetWt, ProdDate, Shift, user, uom, scrap);
            var flag = results.outBinds.LS_OUT_FLAG;
            errorData = results.outBinds.LS_OUT_FLAG;
            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += " Error for batch Scrap" + scrapData[i].SCRAP_BATCH_ID + " -- " + flag.toString().replace("N-", "");
            }

        }

        if (!error) {
            var ins_khapoli: any = await LDSM004.prototype.Insert_Khapoli(Plant, Batch, Process, user);
            var d = ins_khapoli.outBinds.LS_OUT_FLAG;
            if (d.toString().startsWith("N-") || d == null) {
                errorString = ins_khapoli.outBinds.LS_OUT_FLAG;
            } else {
                errorString = "Batch successfully recorded !"
            }
        }

        // if (!error) {
        //     for (var i = 0; i < 2; i++) {
        //         let PIECE_ACTL_UOM = uom;
        //         let ScrWt_UOM = uom;
        //         let primeNetWt = 0;
        //         let scrapNetWt = 0;

        //         newData.forEach(function (item: any) {
        //             primeNetWt += Number(item.EWI_MS_PIECE_ACTL);
        //         });

        //         scrapData.forEach(function (item: any) {
        //             scrapNetWt += Number(item.NET_WT);
        //         });

        //         var updateResults: any = await LDSM004.prototype.updateCoilDetails(Plant, Batch, primeNetWt, PIECE_ACTL_UOM, scrapNetWt, ScrWt_UOM, user);

        //     }
        //     errorString = "Batch successfully recorded !"
        // }

        // if (error) {
        //     var updateErrResults: any = await LDSM004.prototype.updateErrCoilDetails(user, errorData, errorString);

        //     errorString = "Error Batch recorded !!!"
        // }

        // if (error == false && recordTyp == "M") {
        //     var sendMergeDetails: any = await LDSM004.prototype.sendMerge(Plant, Batch, newData);

        //     errorString = "Batch successfully recorded !"
        // }

        return res.status(200).json({ errorString });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

export const getHoldRsnDetails = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getHoldRsnDetails(req);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);


        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchCount = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getBatchCount(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const modifyCoilDetails = async (req: Request, res: Response) => {
    try {

        var errorString = "";
        var error = false;
        var { newData, Plant, resWt, user } = req.body;
        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            var results: any = await LDSM004.prototype.modifyCoilDetails(ele, Plant, resWt, user);
            var flag = results.outBinds.LS_OUT_FLAG;


            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += " Error for batch " + ele.LOM_ID_BATCH + " -- " + flag.toString().replace("N-", "");
            }

        }

        if (!error) {
            errorString = "Batch successfully modified !"
        }

        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapBatchId = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM004.prototype.getScrapBatchId(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getWorkCenterList = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getWorkCenterList(req);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[0]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapProductionTable = async (req: Request, res: Response) => {
    try {
        let results = await LDSM004.prototype.getScrapProductionTable(req);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);
        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getProductionType = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getProductionType(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getWorkCenter = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getWorkCenter(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getShiftStatus = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getShiftStatus(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CRTScheduleMerge = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.CRTScheduleMerge(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMotherBatch = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM004.prototype.getMotherBatch(req);
        return res.status(200).json(results.outBinds.LS_OUT_FLAG);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const noMergeDetails = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.noMergeDetails(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getRollingLen = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getRollingLen(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getLengthList = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getLengthList(req);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);

        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getIntrmMatl = async (req: Request, res: Response) => {
    try {
       let plant =  req.body.plant;
       let fg_mat = req.body.fg_mat; 
       let p_line = req.body.p_line;
        const results: any = await LDSM004.prototype.getIntrmMatl(plant, fg_mat, p_line);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        fullData.push(columns);
        fullData.push(table);

        return res.status(200).json(fullData);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getProductName = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM004.prototype.getProductName(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPieceActl = async (req: Request, res: Response) => {
    try {
        //data retreival
        let { P_PLANT,
            P_BATCH_ID,
            P_PROD_NAME,
            P_NO_PCS,
            P_LENGTH,
            P_OD,
            P_ID,
            P_THICKNESS } = req.body;
        //execute query
        const results: any = await LDSM004.prototype.GetPieceActl(P_PLANT, P_BATCH_ID, P_PROD_NAME, P_NO_PCS, P_LENGTH, P_OD, P_ID, P_THICKNESS);
        //response
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchstatuscn = async (req: Request, res: Response) => {
    try {
        var flag = false;
        var { coil, Plant, workInstNo } = req.body;
        for (var i = 0; i < coil.length; i++) {
            var ele = coil[i];
            var workIns = workInstNo[i];
            var results: any = await LDSM004.prototype.getBatchstatuscn(ele, Plant, workIns);
            if (results.rows.length > 0) {
                flag = true;
            } else {
                flag = false;
                break;
            }
        }
        return res.status(200).json(flag);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapMatNo = async (req: Request, res: Response) => {
    try {
        var {
            plant
        } = req.body;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        
        //execute query
        const results: any = await LDSM004.prototype.getScrapMatNo(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });

        //response
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};


