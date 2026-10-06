import { Request, Response } from "express";
import moment from 'moment'
import LDSM012 from '../models/LDSC001Model';
import { Post } from "../typed/typed";

export const getProdInqData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let value = req.body.value;
        const results: any = await LDSM012.prototype.getProdInqData(plant, value)
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