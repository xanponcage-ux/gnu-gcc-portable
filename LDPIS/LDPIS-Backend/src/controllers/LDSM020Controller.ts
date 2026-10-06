import { Request, Response } from "express";
import moment from 'moment'
import TubePlanning from "../models/LDSM020Model";
import { Post } from "../typed/typed";



export const getTubePlanData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant as String;
        let Order1 = req.body.Order1 as String;
        let Item = req.body.Item as String;
        let MatNo = req.body.MatNo as String;
        let tdc = req.body.tdc as String;
        let thickFrm = req.body.thickFrm as String;
        let thickTo = req.body.thickTo as String;
        let widthFrm = req.body.widthFrm as String;
        let widthTo = req.body.widthTo as String;
        let cust = req.body.cust as String;

        const results: any = await TubePlanning.prototype.getTubePlanData(plant, Order1, Item, MatNo, tdc, thickFrm, thickTo, widthFrm, widthTo, cust)
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        //const fullData: any = [];

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
        return res.status(200).json(table);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPlanModalData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant as String;
        let Order1 = req.body.Order1 as String;
        let Item = req.body.Item as String;
        const results: any = await TubePlanning.prototype.getPlanModalData(plant, Order1, Item)
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        //const fullData: any = [];

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
        return res.status(200).json(table);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOdiaFrm = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await TubePlanning.prototype.getOdiaFrm(plant);
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


export const getOdiaTo = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await TubePlanning.prototype.getOdiaTo(plant);
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

export const getRefresh = async (req: Request, res: Response) => {
    try {

        const results: any = await TubePlanning.prototype.getRefresh();
        console.log('LDSM020controller ---->',results)
        return res.status(200).json(results);

    } catch (error) {
        return res.status(400).json(error);
    }
};

//added