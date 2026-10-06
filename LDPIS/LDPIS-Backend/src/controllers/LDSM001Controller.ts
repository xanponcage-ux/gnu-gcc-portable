import { Request, Response } from "express";
import moment from 'moment'
import LDSM001 from "../models/LDSM001Model";
import { Post } from "../typed/typed";


export const getCoils = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Order = req.body.Order;
        let Item = req.body.Item;
        let sfgMat = req.body.sfgMAT;


        const results: any = await LDSM001.prototype.getCoils(Plant, Order, Item, sfgMat);
        /*
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
        */

        //initalize variables

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }


        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOrders = async (req: Request, res: Response) => {


    try {
        let Plant = req.body.Plant;
        let Order = req.body.Order;
        let Item = req.body.Item;
        let Odia = req.body.Odia;
        let Idia = req.body.Idia;
        let OrderType = req.body.OrderType;
        let OrderCreateFrom = req.body.OrderCreateFrom;
        let OrderCreateTo = req.body.OrderCreateTo;
        let Thick1 = req.body.ThickFrom;
        let Thick2 = req.body.ThickTo;
        let grade = req.body.Grade;
        let length = req.body.Length;

        const results: any = await LDSM001.prototype.getOrders(Plant, Order, Item, Odia, Idia, OrderType,
            OrderCreateFrom, OrderCreateTo, Thick1, Thick2, grade, length);

        /*
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
        */

        //initalize variables

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }


        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};


export const linkCoils = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            order,
            item,
            selectedDataMatch,
            selectedDataDevi,
            allotedQty,
            btp,
            sfgMaterial
        } = req.body;

        var res_y: any = [];
        var res_n: any = [];

        for (var i in selectedDataMatch) {
            var {
                BATCH_ID,
                BTP_T
            } = selectedDataMatch[i];
            var results: any = await LDSM001.prototype.linkCoils(plant, order, item, BATCH_ID, "", allotedQty, btp, BTP_T, sfgMaterial);
            console.log(plant, order, item, BATCH_ID, "", allotedQty, btp, BTP_T, sfgMaterial);
            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                res_n.push(results.outBinds.LS_OUT_FLAG.toString());
            } else {
                res_y.push(BATCH_ID);
            }
        }


        for (var i in selectedDataDevi) {
            var {
                BATCH_ID,
                REMARKS,
                BTP_T
            } = selectedDataDevi[i];
            var results: any = await LDSM001.prototype.linkCoils(plant, order, item, BATCH_ID, REMARKS, allotedQty, btp, BTP_T, sfgMaterial);

            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                //res_n.push(BATCH_ID);
                res_n.push(results.outBinds.LS_OUT_FLAG.toString());
            } else {
                res_y.push(BATCH_ID);
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


export const getCoilsDeviationFromBOM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Order = req.body.Order;
        let Item = req.body.Item;
        let SFG_MAT = req.body.sfg_mate


        const results: any = await LDSM001.prototype.getCoilsDeviationFromBOM(Plant, Order, Item, SFG_MAT);
        //initalize variables

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }
        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getDeAllot = async (req: Request, res: Response) => {


    try {
        var {
            plant,
            idia,
            item,
            odia,
            orderId,
            orderType,
        } = req.body;

        const results: any = await LDSM001.prototype.getDeAllot(
            plant,
            idia,
            item,
            odia,
            orderId,
            orderType,
        );

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }


        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};


export const updateAllotData = async (req: Request, res: Response) => {


    try {
        var {
            personalNo,
            selectedData
        } = req.body;

        var rowsAffected: number = 0;

        var res_y: any = [];
        var res_n: any = [];

        for (var i in selectedData) {
            var {
                BATCH_ID,
                CURRENT_PROC,
                STATUS,
                MASS,
                ODIA,
                PROD_CD,
                THICK,
                WIDTH,
                TDC,
                EPA_CODE,
                PREV_ORDER,
                PREV_ITEM,
            } = selectedData[i];
            var results: any = await LDSM001.prototype.updateAllotData(BATCH_ID, personalNo, EPA_CODE, PREV_ORDER, PREV_ITEM, '');

            if (results.outBinds.LS_OUT_FLAG == 'Y') {
                res_y.push(BATCH_ID);
            } else {
                res_n.push(BATCH_ID);
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

export const getWIPCoilsMatchingWithBOM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Order = req.body.Order;
        let Item = req.body.Item;
        // let Thick = req.body.Thick;
        // let Odia = req.body.Odia;
        let OrdTdc = req.body.OrdTdc;
        let FGMat = req.body.FGMat;
        let results: any;
        
        
        //CRW product check for WIP BOM
        if (Plant == "0788") {
            
            const result: any = await LDSM001.prototype.checkCEWProduct(Plant, FGMat);
            
            
            
            if (result.rows[0][0] == "CEW") {                
                results = await LDSM001.prototype.getWIPCoilsMatchingWithTDCBOM(Plant, OrdTdc);
            }
            else {
                
                results = await LDSM001.prototype.getWIPCoilsMatchingWithBOM(Plant, Order, Item, OrdTdc);
                
            }
        }
        else {
            
            results = await LDSM001.prototype.getWIPCoilsMatchingWithBOM(Plant, Order, Item, OrdTdc);
        }
        //Ended
        
        //const results: any = await LDSM001.prototype.getWIPCoilsMatchingWithBOM(Plant, Order, Item, OrdTdc);
        //initalize variables

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }
        
        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};
export const getWIPCoilsNotMatchingWithBOM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Order = req.body.Order;
        let Item = req.body.Item;


        const results: any = await LDSM001.prototype.getWIPCoilsNotMatchingWithBOM(Plant, Order, Item);
        //initalize variables

        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
            table.push(jsonObj);
        }

        // return response
        return res.status(200).json(table);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const chemChk = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        const varData = []
        if (data ?.length) {
            for (var i = 0; i < data.length; i++) {
                var ele = data[i];
                var results: any = await LDSM001.prototype.chemChk(ele.CD_EPA, ele.ORDER_NO, ele.ITEM_NO, ele.BATCH_ID);
                if (results.rows[0] && results.rows[0][0]) {
                    varData.push({ ...ele, MESSAGE: results.rows[0][0] });
                }
            }
        }
        // const { metaData: rsnCol, rows: rsnRow }: any = await LDSM001.prototype.chemChk(CD_EPA, ORDER_NO, ITEM_NO, BATCH_ID);
        // const rsnColumn = rsnCol.map((column: Column) => ({
        //     title: column.name,
        //     field: column.name.replace(/ |-|-/g, ""),
        // }));
        // const rsnColmn = rsnCol.map((column: Column) => column.name);
        // let rsnData = rsnRow.map((values: any, row: number) => {
        //     const result: KeyValue = {};

        //     rsnColmn.forEach((key: string, i: any) => (result[key] = values[i]));
        //     return result;
        // });

        return res.status(200).json(varData);
    } catch (error) {

        return res.status(400).json(error);
    }
}

export const getOdia = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getOdia(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getDOdia = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getDOdia(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getDIdiaList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getDIdiaList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getThickList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getThickList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getlengthList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getlengthList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};
export const getIdiaList = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM001.prototype.getIdiaList(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOrderType = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM001.prototype.getOrderType(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getCoilList = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM001.prototype.getCoilList(req);
        const table: any = [];
        const header: any = [];

        //get headers
        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ""));
        }
        //contruct table
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
