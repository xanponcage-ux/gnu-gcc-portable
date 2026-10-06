import { Request, Response } from "express";
import moment from 'moment'
import LDSMS007 from "../models/LDSM007Model";
import { Post } from "../typed/typed";

export const getGroupPlant = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;
        const results: any = await LDSMS007.prototype.getGroupPlant(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getBUnitCd = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSMS007.prototype.getBUnitCd(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrdTyp = async (req: Request, res: Response) => {
    try {
        let p = req.body.plant;
        const results: any = await LDSMS007.prototype.GetOrdTyp(p);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetProdCat = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSMS007.prototype.GetProdCat(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetCustDesc = async (req: Request, res: Response) => {
    try {
        let p = req.body.plant;
        const results: any = await LDSMS007.prototype.GetCustDesc(p);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrderDT = async (req: Request, res: Response) => {
    try {
        var {
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo
        } = req.body;
        const results: any = await LDSMS007.prototype.GetOrderDT(
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo
        );
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

export const getOdia = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSMS007.prototype.getOdia(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getThickList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSMS007.prototype.getThickList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getlengthList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSMS007.prototype.getlengthList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetOrderDT_Tubes = async (req: Request, res: Response) => {
    try {

        var {
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo,
            LengthFrm,
            LengthTo,
            SlitPlan,
        } = req.body;
        const results: any = await LDSMS007.prototype.GetOrderDT_Tubes(
            Customer,
            DispFr,
            DispTo,
            Item,
            MatNo,
            OrdStAs,
            OrdTyp,
            OrddtFr,
            OrddtTm,
            Order1,
            Plant,
            ThickFr,
            ThickTo,
            WidthFr,
            WidthTo,
            LengthFrm,
            LengthTo,
            SlitPlan,
        );
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



