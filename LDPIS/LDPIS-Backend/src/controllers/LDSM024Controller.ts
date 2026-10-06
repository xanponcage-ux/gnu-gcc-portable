import { Request, Response } from "express";
import moment from 'moment'
import LDSM024 from '../models/LDSM024Model';
import { Post } from "../typed/typed";

export const getInventoryData = async (req: Request, res: Response) => {
    try {
        var {
            DespFromDate,
            DespToDate,
            ProdFromDate,
            ProdToDate,
            batch,
            customer,
            item,
            materialNo,
            mbatch,
            order,
            orderType,
            plant,
            process,
            status,
            thikFrm,
            thikTo,
            widthFrm,
            widthTo,
            stockType

        } = req.body;

        const results: any = await LDSM024.prototype.getInventoryData(
            DespFromDate,
            DespToDate,
            ProdFromDate,
            ProdToDate,
            batch,
            customer,
            item,
            materialNo,
            mbatch,
            order,
            orderType,
            plant,
            process,
            status,
            thikFrm,
            thikTo,
            widthFrm,
            widthTo,
            stockType
        )
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


