import { Request, Response } from "express";
import moment from 'moment'
import LDSC004 from '../models/LDSC004Model';
import { Post } from "../typed/typed";

export const getExceptionReport = async (req: Request, res: Response) => {
    try {
        let frmDt = req.body.frmDt;
        let toDt = req.body.toDt;
        const results: any = await LDSC004.prototype.getExceptionReport(frmDt, toDt)
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


export const getRoundOdMaster = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;

        const results: any = await LDSC004.prototype.getRoundOdMaster(plant)
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

export const getOnDateCoilReceiving = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateCoilReceiving(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateWiderProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateWiderProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateNarrowProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateNarrowProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateTubeSchedule = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateTubeSchedule(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateTubeProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateTubeProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateCtlProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateCtlProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDatePacking = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDatePacking(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOnDateDispatch = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getOnDateDispatch(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateCoilReceiving = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateCoilReceiving(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateWiderProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateWiderProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateNarrowProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateNarrowProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateTubeSchedule = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateTubeSchedule(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateTubeProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateTubeProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateCtlProduction = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDateCtlProduction(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDatePacking = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTillDatePacking(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTillDateDispatch = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC004.prototype.getTillDateDispatch(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTubeProdMonthlyReport = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getTubeProdMonthlyReport(req);
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

export const getPackingMonthlyReport = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC004.prototype.getPackingMonthlyReport(req);
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

