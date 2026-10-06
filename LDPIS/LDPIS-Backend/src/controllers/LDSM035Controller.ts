import { Request, Response } from "express";
import moment from 'moment'
import LDSM035 from '../models/LDSM035Model';
import { Post } from "../typed/typed";


export const getFGBatchRev = async (req: Request, res: Response) => {
    try {
        var {
            batch_id,
            custOrd,
            custItem,
            length,
            mBatch,
            ordType,
            plant,
            process,
            prodCD,
            qltyCD,
            status,
            tdc,
            thickFrm,
            thickTo,
            widthFrm,
            widthTo

        } = req.body;

        const results: any = await LDSM035.prototype.getFGBatchRev(
            batch_id,
            custOrd,
            custItem,
            length,
            mBatch,
            ordType,
            plant,
            process,
            prodCD,
            qltyCD,
            status,
            tdc,
            thickFrm,
            thickTo,
            widthFrm,
            widthTo
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


export const saveFGBatchRev = async (req: Request, res: Response) => {
    try {
        var { personalNo, selectedData, plant } = req.body;
        var rowsAffected: any = 0;
        let res_n: any = [], res_y: any = [];
        for (var i in selectedData) {

            var batch_id = selectedData[i];

            //const res_insfgBatchRev: any = await LDSM035.prototype.insertFGBatchRev(plant, batch_id, personalNo);
            const res_revBatch: any = await LDSM035.prototype.reverseBatch(plant, batch_id);

            if (res_revBatch.outBinds.ls_flag == null || res_revBatch.outBinds.ls_flag.toString().startsWith("N-")) {
                //const res_delfgBatchRev: any = await LDSM035.prototype.deleteFGBatchRev(plant, batch_id, personalNo);

                res_n.push({ id: batch_id, msg: res_revBatch.outBinds.ls_flag ? res_revBatch.outBinds.ls_flag.toString() : '' });
            } else {
                res_y.push(batch_id);
            }
        }

        var fin_res = {
            res_y: res_y,
            res_n: res_n
        }

        return res.status(200).json(fin_res);
    } catch (error) {
        
        return res.status(400).json(error);
    }
};

export const getTdcList = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM035.prototype.getTdcList(
            plant,
        );
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getUserIdsEditableMass = async (req: Request, res: Response) => {
    try {
        let userid= req.body.UserId;

        const results: any = await LDSM035.prototype.getUserIdsEditableMass(userid);
        console.log(results.rows);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};