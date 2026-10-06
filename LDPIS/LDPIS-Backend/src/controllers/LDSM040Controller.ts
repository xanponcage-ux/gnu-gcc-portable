import { Request, Response } from "express";
import moment from 'moment'
import LDSM040 from "../models/LDSM040Model";
import { Post } from "../typed/typed";


export const GetProcDesc = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM040.prototype.GetProcDesc(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetCustDesc = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM040.prototype.GetCustDesc(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CheckSCO = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let dt = req.body.dt;
        const results: any = await LDSM040.prototype.CheckSCO(plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrderType = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM040.prototype.GetOrderType(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetTracking = async (req: Request, res: Response) => {
    try {
        let plant = req.body.Plant;

        const results: any = await LDSM040.prototype.GetTracking(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetCustData = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant ? req.body.Plant : "";
        let Process = req.body.Process ? req.body.Process : "";
        let Status = req.body.Status ? req.body.Status : "";
        let Batch = req.body.Batch ? req.body.Batch : "";
        let Order_Type = req.body.Order_Type ? req.body.Order_Type : "";
        let TDC = req.body.TDC ? req.body.TDC : "";
        let SchTyp = req.body.SchTyp ? req.body.SchTyp : "";
        let Order = req.body.Order ? req.body.Order : "";
        let Order_Item = req.body.Order_Item ? req.body.Order_Item : "";
        let Customer_code = req.body.Customer_code ? req.body.Customer_code : "";
        let SchDt_from = req.body.SchDt_from ? req.body.SchDt_from : "";
        let SchDt_To = req.body.SchDt_To ? req.body.SchDt_To : "";
        let Prdn_Dt = req.body.Prdn_Dt ? req.body.Prdn_Dt : "";
        let Tracking = req.body.Tracking ? req.body.Tracking : "";
        let WorkCenter = req.body.WorkCenter ? req.body.WorkCenter : "";
        let Odia = req.body.Odia ? req.body.Odia : "";
        let IDia = req.body.Idia ? req.body.Idia : "";
        let Thick = req.body.Thick ? req.body.Thick : "";

        const results: any = await LDSM040.prototype.getCustData(Plant, Process, Status, Batch, Order_Type, TDC, SchTyp, Order, Order_Item, Customer_code, SchDt_from, SchDt_To, Prdn_Dt, Tracking, WorkCenter, Odia, IDia, Thick);

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
export const getCoils = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant ? req.body.Plant : "";
        let Process = req.body.Process ? req.body.Process : "";
        let Status = req.body.Status ? req.body.Status : "";
        let Batch = req.body.Batch ? req.body.Batch : "";
        let Order_Type = req.body.Order_Type ? req.body.Order_Type : "";
        let TDC = req.body.TDC ? req.body.TDC : "";
        let SchTyp = req.body.SchTyp ? req.body.SchTyp : "";
        let Order = req.body.Order ? req.body.Order : "";
        let Order_Item = req.body.Order_Item ? req.body.Order_Item : "";
        let Customer_code = req.body.Customer_code ? req.body.Customer_code : "";
        let SchDt_from = req.body.SchDt_from ? req.body.SchDt_from : "";
        let SchDt_To = req.body.SchDt_To ? req.body.SchDt_To : "";
        let Prdn_Dt = req.body.Prdn_Dt ? req.body.Prdn_Dt : "";
        let Tracking = req.body.Tracking ? req.body.Tracking : "";
        let WorkCenter = req.body.WorkCenter ? req.body.WorkCenter : "";
        let Odia = req.body.Odia ? req.body.Odia : "";
        let IDia = req.body.Idia ? req.body.Idia : "";
        let Thick = req.body.Thick ? req.body.Thick : "";

        const results: any = await LDSM040.prototype.getCoils(Plant, Process, Status, Batch, Order_Type, TDC, SchTyp, Order, Order_Item, Customer_code, SchDt_from, SchDt_To, Prdn_Dt, Tracking, WorkCenter, Odia, IDia, Thick);

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

export const getSlitCoilDetails = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let mother_batch = req.body.mother_batch;
        const results: any = await LDSM040.prototype.getSlitCoilDetails(plant, mother_batch);
        // return res.status(200).json(results.rows);

        const table: any = [];
        const header: any = [];
        const columns: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = results.metaData[i].name as string;
            obj.field = header[i];
            columns.push(obj);
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }

        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};
export const GetWorkCenter = async (req: Request, res: Response) => {
    try {
        let plant = req.body.Plant;
        let process = req.body.Process;
        const results: any = await LDSM040.prototype.getWorkCenter(plant, process);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const GetTdcList = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM040.prototype.getTdcList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
