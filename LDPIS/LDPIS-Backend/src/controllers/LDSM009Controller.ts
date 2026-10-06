import { Request, Response } from "express";
import moment from 'moment'
import LDSM009 from '../models/LDSM009Model';
import { Post } from "../typed/typed";

export const GetProcess = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await LDSM009.prototype.GetProcess(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getProdInqData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let Process = req.body.Process;
        let pname = req.body.pname;
        let Batch_Id = req.body.Batch_Id;
        let MBatch_Id = req.body.MBatch_Id;
        // let OrderNo = req.body.Order_ID;
        // let ItemNo = req.body.OrderItem;        
        let ThickMin = req.body.ThickMin;
        let ThickMax = req.body.ThickMax;
        let widthMin = req.body.WidthMin;
        let widthMax = req.body.WidthMax;
        let ProdDateFrom = req.body.ProdDtFrom;
        let ProdDateTo = req.body.ProdDtTo;
        let SchedDateFrom = "";
        let SchedDateTo = "";
        let prodType = req.body.prodType;
        
        // let NextProcess = req.body.Width1;
        // let shift = req.body.shift;
        // let TDC = req.body.TDC;
        // let SCO = req.body.SCO;
        // let OrderType = req.body.OrderType;
        // let ProdDtFrom = req.body.ProdDtFrom;
        // let ProdDtTo = req.body.ProdDtTo;
        // let Customer = req.body.Customer;

        const results: any = await LDSM009.prototype.getProdInqData(plant, Process,pname, Batch_Id, MBatch_Id, ThickMin, ThickMax, widthMin, widthMax, ProdDateFrom, ProdDateTo, SchedDateFrom, SchedDateTo, prodType)
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

export const getReportData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let Process = req.body.Process;
        let pname = req.body.pname;
        let Batch_Id = req.body.Batch_Id;
        let MBatch_Id = req.body.MBatch_Id;
        // let OrderNo = req.body.Order_ID;
        // let ItemNo = req.body.OrderItem;        
        let ThickMin = req.body.ThickMin;
        let ThickMax = req.body.ThickMax;
        let widthMin = req.body.WidthMin;
        let widthMax = req.body.WidthMax;
        let ProdDateFrom = req.body.ProdDtFrom;
        let ProdDateTo = req.body.ProdDtTo;
        let SchedDateFrom = "";
        let SchedDateTo = "";
        let prodType = req.body.prodType;
        

        const results: any = await LDSM009.prototype.getReportData(plant, Process,pname, Batch_Id, MBatch_Id, ThickMin, ThickMax, widthMin, widthMax, ProdDateFrom, ProdDateTo, SchedDateFrom, SchedDateTo, prodType)
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];
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

        fullData.push(columns);
        fullData.push(table);

        return res.status(200).json(fullData);


    } catch (error) {
        return res.status(400).json(error);
    }
}; 