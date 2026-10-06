import { Request, Response } from "express";
import moment from 'moment'
import LDSC006 from '../models/LDSC006Model';
import { Post } from "../typed/typed";


export const displanyLengthMaster = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;

        const results: any = await LDSC006.prototype.displanyLengthMaster(plant);
        const table: any = [];
        const header: any = [];
        const columns: any = [];

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

export const updateLengthData = async (req: Request, res: Response) => {
    try {
        var { adid, dt } = req.body;
        var rowsAffected: number = 0;
        for (var i in dt) {
            let results = await LDSC006.prototype.updateLengthData(
                adid,
                dt[i]
            );
            rowsAffected += Number(results.rowsAffected);
        }
        return res.status(200).json(rowsAffected);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const deleteLengthData = async (req: Request, res: Response) => {
    try {
        var { adid, dt } = req.body;
        var rowsAffected: number = 0;
        for (var i in dt) {
            let results = await LDSC006.prototype.deleteLengthData(
                adid,
                dt[i]

            );
            rowsAffected += Number(results.rowsAffected);
        }
        return res.status(200).json(rowsAffected);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const perviewUpdateData = async (req: Request, res: Response) => {
    try {
        var { adid, dt, plant } = req.body;
        var rowsAffected: number = 0;
        var failRowSl = [];
        for (var i in dt) {
            let results = await LDSC006.prototype.perviewUpdateData(
                adid,
                dt[i],
                plant
            );
            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                rowsAffected += Number(0);
                failRowSl.push(dt[i].SL)
            } else {
                rowsAffected += Number(1);
            }
        }
        var obj = {
            rowsAffSuc: rowsAffected,
            failRowSL: failRowSl
        };
        return res.status(200).json(obj);
    } catch (error) {
        return res.status(400).json(error);
    }
};
