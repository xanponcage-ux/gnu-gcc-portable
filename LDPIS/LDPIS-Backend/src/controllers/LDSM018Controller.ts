import { Request, Response } from "express";
import moment from 'moment'
import LDSM018 from '../models/LDSM018Model';
import { Post } from "../typed/typed";


export const getHoldData = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            process,
            batch_id,
            mBatch,
            frmDt,
            toDt,
            frmDtRls,
            toDtRls
        } = req.body;

        const results: any = await LDSM018.prototype.getHoldData(
            plant,
            process,
            batch_id,
            mBatch,
            frmDt,
            toDt,
            frmDtRls,
            toDtRls
        );
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
        //  fullData.push(columns);
        //  fullData.push(table);
        
        return res.status(200).json(table);


    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetProcDesc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM018.prototype.GetProcDesc(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};