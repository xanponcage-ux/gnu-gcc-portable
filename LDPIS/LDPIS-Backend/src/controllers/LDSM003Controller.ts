import { Request, Response } from "express";
import moment from 'moment'
import LDSM003 from "../models/LDSM003Model";
import { Post } from "../typed/typed";

export const getRolePlant = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;
        const results: any = await LDSM003.prototype.getGroupPlant(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};



export const getCoils = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Status = req.body.Status;
        let BATCH_ID = req.body.BATCH_ID;
        let TDC = req.body.TDC;
        let RECVDTFROM = req.body.RECVDTFROM;
        let RECVDTTO = req.body.RECVDTTO;
        let PROCDTFROM = req.body.PROCDTFROM;
        let PROCDTTO = req.body.PROCDTTO;
        let ProdCd = req.body.ProdCd;
        let QltyCd = req.body.QltyCd;
        let Thick1 = req.body.Thick1;
        let Thick2 = req.body.Thick2;
        let Width1 = req.body.Width1;
        let Width2 = req.body.Width2;
        let Length1 = req.body.Length1;
        let Length2 = req.body.Length2;
        let Material = req.body.Material;
        let INVOICE = req.body.INVOICE;
        let INVOICE_DTFROM = req.body.INVOICE_DTFROM;
        let INVOICE_DTTO = req.body.INVOICE_DTTO;
        let coilType = req.body.coilType;


        const results: any = await LDSM003.prototype.getCoils(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, coilType, Length1, Length2);
        // const table: any = [];
        // const header: any = [];
        // const columns: any = [];
        // const fullData: any = [];

        // for (let i = 0; i < results.metaData.length; i++) {
        //     header.push((results.metaData[i].name as string).replace(/ /g, ''))
        // }

        // for (let i = 0; i < results.metaData.length; i++) {
        //     var obj: any = {};
        //     obj.title = (results.metaData[i].name as string);
        //     obj.field = header[i];
        //     columns.push(obj)
        // }

        // for (let i = 0; i < results.rows.length; i++) {
        //     const arr = results.rows[i];
        //     var jsonObj: any = {};
        //     header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
        //     table.push(jsonObj)
        // }

        // fullData.push(columns);
        // fullData.push(table);
        // return res.status(200).json(fullData);


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

export const getBatchDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let MBATCH_ID = req.body.MBATCH_ID;
        const results: any = await LDSM003.prototype.getBatchDetails(Plant, MBATCH_ID);
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

export const CONFIRM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var checkPass = "Y";
        for (var i = 0; i < dt.length; i++) {
            //initalize variables
            var ele = dt[i];
            var results: any = await LDSM003.prototype.CONFIRM(Plant, ele, userId);

            var outBinds = results.outBinds.LS_OUT_FLAG;
            if (outBinds.toString().startsWith("N-")) {
                checkPass = outBinds.toString();
                break;
            }

        }
        return res.status(200).json(checkPass);
        //return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const CONFIRM_Wires = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var checkPass = "Y";
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            var results: any = await LDSM003.prototype.CONFIRM_Wires(Plant, ele, userId);
            //return res.status(200).json(results.rows);
            var outBinds = results.outBinds.LS_OUT_FLAG;
            if (outBinds.toString().startsWith("N-")) {
                checkPass = "N";
            }

        }
        return res.status(200).json(checkPass);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const RETURN_COIL = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var checkPass = "Y";
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            var results: any = await LDSM003.prototype.RETURN_COIL(Plant, ele, userId);
            var outBinds = results.outBinds.LS_OUT_FLAG;
            if (outBinds.toString().startsWith("N-")) {
                checkPass = outBinds.toString();
            }

        }
        return res.status(200).json(checkPass);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getCoils_Wires = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Status = req.body.Status;
        let BATCH_ID = req.body.BATCH_ID;
        let TDC = req.body.TDC;
        let RECVDTFROM = req.body.RECVDTFROM;
        let RECVDTTO = req.body.RECVDTTO;
        let PROCDTFROM = req.body.PROCDTFROM;
        let PROCDTTO = req.body.PROCDTTO;
        let ProdCd = req.body.ProdCd;
        let QltyCd = req.body.QltyCd;
        let Thick1 = req.body.Thick1;
        let Thick2 = req.body.Thick2;
        let Width1 = req.body.Width1;
        let Width2 = req.body.Width2;
        let Material = req.body.Material;
        let INVOICE = req.body.INVOICE;
        let INVOICE_DTFROM = req.body.INVOICE_DTFROM;
        let INVOICE_DTTO = req.body.INVOICE_DTTO;
        let Length1 = req.body.Length1;
        let Length2 = req.body.Length2;
        const results: any = await LDSM003.prototype.getCoils_Wires(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, Length1, Length2);

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

export const getCoils_LP = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Status = req.body.Status;
        let BATCH_ID = req.body.BATCH_ID;
        let TDC = req.body.TDC;
        let RECVDTFROM = req.body.RECVDTFROM;
        let RECVDTTO = req.body.RECVDTTO;
        let PROCDTFROM = req.body.PROCDTFROM;
        let PROCDTTO = req.body.PROCDTTO;
        let ProdCd = req.body.ProdCd;
        let QltyCd = req.body.QltyCd;
        let Thick1 = req.body.Thick1;
        let Thick2 = req.body.Thick2;
        let Width1 = req.body.Width1;
        let Width2 = req.body.Width2;
        let Material = req.body.Material;
        let INVOICE = req.body.INVOICE;
        let INVOICE_DTFROM = req.body.INVOICE_DTFROM;
        let INVOICE_DTTO = req.body.INVOICE_DTTO;
        let Length1 = req.body.Length1;
        let Length2 = req.body.Length2;
        const results: any = await LDSM003.prototype.getCoils_LP(Plant, Status, BATCH_ID, TDC, RECVDTFROM, RECVDTTO, PROCDTFROM, PROCDTTO, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, Material, INVOICE, INVOICE_DTFROM, INVOICE_DTTO, Length1, Length2);

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




export const getOdiaFrm = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM003.prototype.getOdiaFrm(plant);
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


export const getOdiaTo = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM003.prototype.getOdiaTo(plant);
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


export const getOdia = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDSM003.prototype.getOdia(plant);
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

        const results: any = await LDSM003.prototype.getThickList(plant);
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

        const results: any = await LDSM003.prototype.getlengthList(plant);
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


export const getStatus = async (req: Request, res: Response) => {
    try {

        // var plant = req.body.plant;

        const results: any = await LDSM003.prototype.getStatus();
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStoreLocation = async (req: Request, res: Response) => {
    try {

        // var plant = req.body.plant;

        const results: any = await LDSM003.prototype.getStoreLocation();

        return res.status(200).json(results.rows);

    } catch (error) {
        return res.status(400).json(error);
    }
};