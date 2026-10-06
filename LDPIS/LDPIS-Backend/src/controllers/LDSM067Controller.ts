import { Request, Response } from "express";
import moment from 'moment'
import LDSM067 from "../models/LDSM067Model";
import { Post } from "../typed/typed";

export const getProcessDesc = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSM067.prototype.getProcessDesc(plant);
        const list: any = [];

        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getCoils = async (req: Request, res: Response) => {
    try {
        let {
            plant,
            process,
            batch,
            prodCd,
            status,
            tdc,
            thickfrm,
            thickto
        } = req.body;

        const results: any = await LDSM067.prototype.getCoils(
            plant,
            process,
            batch,
            prodCd,
            status,
            tdc,
            thickfrm,
            thickto
        );


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

export const getHoldRsn = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSM067.prototype.getHoldRsn();
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const saveUnloadData = async (req: Request, res: Response) => {
    try {

        var {
            plant,
            selectedData,
            personalNo
        } = req.body;
        var res_y: any = [];
        var res_n: any = [];

        for (var i in selectedData) {
            //get data from request
            var {
                LOM_ID_BATCH,
                MS_SCRAP,
                LOM_CD_STATUS,
                LOM_CD_CURR_PROC,
                LOM_MS_GROSS_CAL,
                HOLD_REASON,
                OPERATOR_REMARKS,
                SCRAP_MATNR
            } = selectedData[i];


            //execute query to update staus
            const results: any = await LDSM067.prototype.saveUnloadData(
                plant,
                LOM_ID_BATCH,
                MS_SCRAP,
                LOM_CD_STATUS,
                LOM_CD_CURR_PROC,
                LOM_MS_GROSS_CAL,
                HOLD_REASON,
                OPERATOR_REMARKS,
                SCRAP_MATNR,
                personalNo
            );

            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                res_n.push(results.outBinds.LS_OUT_FLAG);
            } else {
                res_y.push(results.outBinds.LS_OUT_FLAG);
            }
        }
        var fin_res = {
            res_n: res_n,
            res_y: res_y
        }
        return res.status(200).json(fin_res);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStatus = async (req: Request, res: Response) => {
    try {
        //let plant = req.body.plant;

        //const results: any = await LDSM067.prototype.getStatus(plant);
        const results: any = await LDSM067.prototype.getStatus();
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapMatNo = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;

        const results: any = await LDSM067.prototype.getScrapMatNo(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};
