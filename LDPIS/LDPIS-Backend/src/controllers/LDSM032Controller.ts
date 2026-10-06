import { Request, Response } from "express";
import moment from 'moment'
import LDSM032 from "../models/LDSM032Model";
import { Post } from "../typed/typed";


export const GetProcDesc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.d.Plant;
        let tabValue = req.body.d.tabValue
        const results: any = await LDSM032.prototype.GetProcDesc(Plant, tabValue);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetIDIA = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await LDSM032.prototype.GetIDIA(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetODIA = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await LDSM032.prototype.GetODIA(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchId = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await LDSM032.prototype.getBatchId(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetRoll = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await LDSM032.prototype.GetRoll(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPath = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        const results: any = await LDSM032.prototype.GetPath(Plant, Process);
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
        const results: any = await LDSM032.prototype.OrdercHK(Plant, OrderNo, ItemNo);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const RMDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let FG_Mat = req.body.FG_Mat;
        const results: any = await LDSM032.prototype.RMDetails(Plant, FG_Mat);
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
        const results: any = await LDSM032.prototype.schTypModal(Plant, RM_Mat, Order, Item);
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
        const results: any = await LDSM032.prototype.CoilDetails(Plant, RM_Mat, Order, Item);
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
        const results: any = await LDSM032.prototype.GetSchDetl(Plant, Process, BatchID);
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

        const results: any = await LDSM032.prototype.GetInqDetl(Plant, Process, BatchID, Status, OrdID, OrdItm, Prod_DT);
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
        let Plant = req.body.Plant;
        let BatchID = req.body.BatchID;
        const results: any = await LDSM032.prototype.GetWIPSchDetl(Plant, BatchID);
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
        const results: any = await LDSM032.prototype.ScheduleConf(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const ScheduleDel = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM032.prototype.ScheduleDel(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const WIPSchedule = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM032.prototype.WIPSchedule(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CRTSchedule = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM032.prototype.CRTSchedule(req);

        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrder = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM032.prototype.GetOrder(req);
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
        const results: any = await LDSM032.prototype.GetAddedColumns(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getWorkCenter = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await LDSM032.prototype.getWorkCenter(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMotherBatch = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM032.prototype.getMotherBatch(req);
        return res.status(200).json(results.outBinds.LS_OUT_FLAG);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllOrderList = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM032.prototype.getAllOrderList(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllItemList = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM032.prototype.getAllItemList(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const schMatDesc = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM032.prototype.schMatDesc(req);
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
        const results: any = await LDSM032.prototype.getMergeBatchDetails(req);
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
        const results: any = await LDSM032.prototype.ScheduleDelMerge(req);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};





