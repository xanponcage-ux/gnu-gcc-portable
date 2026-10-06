import { Request, Response } from "express";
import moment from 'moment'
import LDSC005 from "../models/LDSC005Model";
import { Post } from "../typed/typed";

export const getCodetyp = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSC005.prototype.getCodetyp(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getCodeval = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSC005.prototype.getCodeval(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getRecords = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSC005.prototype.getRecords(req);
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

export const insertRecords = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var newData = req.body;
        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            let binds = {
                CD_TYPE: newData[i].CD_TYPE,
                CD_VALUE: newData[i].CD_VALUE,
                CD_DESC: newData[i].CD_DESC
            }

            var results: any = await LDSC005.prototype.insertRecords(binds);
            var flag = results.rowsAffected;
            if (flag != 1) {
                error = true;
                errorString += " Error for record " + ele.CD_TYPE + "";
            }
        }

        if (!error) {
            errorString = "successfully recorded !"
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const updateRecords = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var newData = req.body;
        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            let binds = {
                CD_TYPE: newData[i].CD_TYPE,
                CD_VALUE: newData[i].CD_VALUE,
                CD_DESC: newData[i].CD_DESC
            }

            var results: any = await LDSC005.prototype.updateRecords(binds);
            var flag = results.rowsAffected;
            if (flag != 1) {
                error = true;
                errorString += " Error for record " + ele.CD_TYPE + "";
            }
        }

        if (!error) {
            errorString = "successfully recorded !"
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const deleteRecords = async (req: Request, res: Response) => {
    try {
        var errorString = "";
        var error = false;
        var newData = req.body;
        for (var i = 0; i < newData.length; i++) {
            var ele = newData[i];
            let binds = {
                CD_TYPE: newData[i].CD_TYPE,
                CD_VALUE: newData[i].CD_VALUE,
                CD_DESC: newData[i].CD_DESC
            }

            var results: any = await LDSC005.prototype.deleteRecords(binds);
            var flag = results.rowsAffected;
            if (flag != 1) {
                error = true;
                errorString += " Error for record " + ele.CD_TYPE + "";
            }
        }

        if (!error) {
            errorString = "successfully recorded !"
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getGroupPlant = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;
        const results: any = await LDSC005.prototype.getGroupPlant(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchId = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let status = req.body.status;
        const results: any = await LDSC005.prototype.getBatchId(plant, status);

        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getIndTubesData = async (req: Request, res: Response) => {
    try {

        const results: any = await LDSC005.prototype.getIndTubesData(req);
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

