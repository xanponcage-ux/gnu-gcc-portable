import { Request, Response } from "express";
import moment from 'moment'
import TTSM170 from "../models/TTSM170Model";
import { Post } from "../typed/typed";


export const GetProcDesc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.d.Plant;
        let tabValue = req.body.d.tabValue
        const results: any = await TTSM170.prototype.GetProcDesc(Plant, tabValue);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const GetIDIA = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await TTSM170.prototype.GetIDIA(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetODIA = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await TTSM170.prototype.GetODIA(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchId = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await TTSM170.prototype.getBatchId(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetRoll = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await TTSM170.prototype.GetRoll(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPath = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        const results: any = await TTSM170.prototype.GetPath(Plant, Process);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPathKhapoli = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let FG_Mat = req.body.FG_Mat;
        const results: any = await TTSM170.prototype.getPathKhapoli(Plant, FG_Mat);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const OrdercHK = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let OrderNo = req.body.OrderNo;
        let ItemNo = req.body.ItemNo;
        const results: any = await TTSM170.prototype.OrdercHK(Plant, OrderNo, ItemNo);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const RMDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let FG_Mat = req.body.FG_Mat;
        const results: any = await TTSM170.prototype.RMDetails(Plant, FG_Mat);
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

export const schTypModal = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let RM_Mat = req.body.RM_Mat;
        let Order = req.body.Order;
        let Item = req.body.Item;
        const results: any = await TTSM170.prototype.schTypModal(Plant, RM_Mat, Order, Item);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CoilDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let RM_Mat = req.body.RM_Mat;
        let Order = req.body.Order;
        let Item = req.body.Item;
        let Process = req.body.Process;
        const results: any = await TTSM170.prototype.CoilDetails(Plant, Process, RM_Mat, Order, Item);
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

export const GetSchDetl = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let BatchID = req.body.BatchID;
        const results: any = await TTSM170.prototype.GetSchDetl(Plant, Process, BatchID);
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

export const GetInqDetl = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let BatchID = req.body.BatchID;
        let Status = req.body.Status;
        let OrdID = req.body.OrdID;
        let OrdItm = req.body.OrdItm;
        let Prod_DT = req.body.Prod_DT;

        const results: any = await TTSM170.prototype.GetInqDetl(Plant, Process, BatchID, Status, OrdID, OrdItm, Prod_DT);
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

export const GetWIPSchDetl = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let BatchID = req.body.BatchID;
        const results: any = await TTSM170.prototype.GetWIPSchDetl(Plant, BatchID);
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

export const ScheduleConf = async (req: Request, res: Response) => {
    try {
        var resDt = "";
        const { Plant, shift, Prod_dt, dt, CHK_PFS, Process } = req.body;
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            var results: any = await TTSM170.prototype.ScheduleConf(Plant, shift, Prod_dt, ele, CHK_PFS, Process);
            resDt = results;
        }
        return res.status(200).json(resDt);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ScheduleDel = async (req: Request, res: Response) => {
    try {
        var resDt = "";
        const { Plant, dt } = req.body;
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            var results: any = await TTSM170.prototype.ScheduleDel(Plant, ele);
            resDt = results;
        }
        return res.status(200).json(resDt);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const WIPSchedule = async (req: Request, res: Response) => {
    try {

        const results: any = await TTSM170.prototype.WIPSchedule(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CRTSchedule = async (req: Request, res: Response) => {
    try {

        const results: any = await TTSM170.prototype.CRTSchedule(req);

        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CRTScheduleAll = async (req: Request, res: Response) => {
    try {
        let results = "";
        let { PlanPath, Plant, Process, ORD_ID, ORD_ITM, ORD_QTY, IDIA, ODIA, LENGTH, THICK, GRADE, MATNR, PROS_WT, GALVY_WT, rollchange, MOTHER_BATCH, CL_WT, CL_MATNR, FG_WT, adid, EOP_SFG_MATNR_BOM, P_SCH_TYPE_FL, P_NOMINATE_BATCH, P_NOMINATE_MATNR } = req.body;

        for (let i = 0; i < req.body.P_NOMINATE_BATCH.length; i++) {
            let CLMATNR = CL_MATNR[i].MATERIAL;
            let EOPSFGMATNRBOM = EOP_SFG_MATNR_BOM[i].TMA_SFG_MATNR;
            let REMARKS = EOP_SFG_MATNR_BOM[i].REMARKS;
            let priority = EOP_SFG_MATNR_BOM[i].Priority;
            let PNOMINATEBATCH = P_NOMINATE_BATCH[i].EOM_ID_BATCH;
            let PNOMINATEMATNR = P_NOMINATE_MATNR[i].MATERIAL;

            let PROS_WTL = PROS_WT[i].GROSS_WT;
            let CL_WTL = CL_WT[i].GROSS_WT;
            let FG_WTL = FG_WT[i].SCH_QTY;

            results = await TTSM170.prototype.CRTScheduleAll(PlanPath, Plant, Process, ORD_ID, ORD_ITM, ORD_QTY, IDIA, ODIA, LENGTH, THICK, GRADE, MATNR, PROS_WTL, GALVY_WT, rollchange, MOTHER_BATCH, CL_WTL, CLMATNR, FG_WTL, adid, EOPSFGMATNRBOM, P_SCH_TYPE_FL, PNOMINATEBATCH, PNOMINATEMATNR, REMARKS, priority);
        }
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrder = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.GetOrder(req);
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

export const GetAddedColumns = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;
        const results: any = await TTSM170.prototype.GetAddedColumns(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getWorkCenter = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let process = req.body.process;
        const results: any = await TTSM170.prototype.getWorkCenter(Plant, process);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMotherBatch = async (req: Request, res: Response) => {
    try {

        const results: any = await TTSM170.prototype.getMotherBatch(req);
        return res.status(200).json(results.outBinds.LS_OUT_FLAG);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllOrderList = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.getAllOrderList(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllItemList = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.getAllItemList(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const schMatDesc = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.schMatDesc(req);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMergeBatchDetails = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.getMergeBatchDetails(req);
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

export const ScheduleDelMerge = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.ScheduleDelMerge(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const noMergeDetails = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.noMergeDetails(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const saveTUBEWIP = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var { dt, Plant, process } = req.body;
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i].EWI_ID_BATCH;
            var results: any = await TTSM170.prototype.saveTUBEWIP(Plant, process, ele);
            var flag = results.outBinds.LS_OUT_FLAG;
            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += " Error for batch " + ele + " -- " + flag.toString().replace("N-", "");
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

export const getPrioity = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM170.prototype.getPrioity(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};




