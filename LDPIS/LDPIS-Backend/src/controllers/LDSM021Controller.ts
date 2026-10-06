import { Request, Response } from "express";
import moment from 'moment'
import FGStock from "../models/LDSM021Model";
import { Post } from "../typed/typed";

export const getRMData = async (req: Request, res: Response) => {
    try {
        let WERKS = req.body.WERKS;
        let CLIENT_ID = req.body.CLIENT_ID;
        let batch = req.body.batch as String;
        let status = req.body.status as String;
        let invoice = req.body.invoice as String;
        let Upload_Date_From = req.body.Upload_Date_From as String;
        let Upload_Date_To = req.body.Upload_Date_To as String;
        let delivery = req.body.delivery as String;
        let action = req.body.action as String;


        const results: any = await FGStock.prototype.getRMData(WERKS, CLIENT_ID, status, invoice, Upload_Date_From,
            Upload_Date_To, delivery, batch,action);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        //const fullData: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
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

export const updateRMData = async (req: Request, res: Response) => {
    try {
        var new_status = req.body.new_status;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var rowsAffected: number = 0;
        for (var i = 0; i < dt.length; i++) {
            //initalize variables
            var ele = dt[i];
            var timestamp = ele.TIMESTAMP;
            var charg = ele.BATCH_ID;
            var old_status = ele.STATUS;
            var results: any = await FGStock.prototype.updateRMData(timestamp, charg, old_status, new_status);
            if (results && results.rowsAffected)
                rowsAffected += Number(results.rowsAffected);

        }
        return res.status(200).json(rowsAffected);
        //return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};