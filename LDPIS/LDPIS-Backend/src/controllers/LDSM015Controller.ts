import { Request, Response } from "express";
import moment from 'moment'
import LDSM015 from '../models/LDSM015Model';
import { Post } from "../typed/typed";


export const getSectionData = async (req: Request, res: Response) => {
    try {
        var {
            plant
        } = req.body;
        console.log("hello before call");
        const results: any = await LDSM015.prototype.getSectionData(
            plant
        );
        const table: any = [];
        const header: any = [];
        const columns: any = [];
            console.log(results);
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

export const getODdata = async (req: Request, res: Response) => {
    try {
        let data = {
                    ...req.body
                }
                const results: any = await LDSM015.prototype.getODdata(
                    data
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
        
                return res.status(200).json(table);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
};

