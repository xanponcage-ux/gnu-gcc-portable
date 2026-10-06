import { Request, Response } from "express";
import moment from 'moment'
import LDSC009 from '../models/LDSC009Model';
import { Post } from "../typed/typed";



export const displayRouteMapping = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        const results: any = await LDSC009.prototype.displayRouteMapping(plant);
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

        return res.status(400).json(error);
    }
};

export const updateRouteData = async (req: Request, res: Response) => {
    try {
        var { adid, dt } = req.body;
        var rowsAffected: number = 0;
        for (var i in dt) {
            let results = await LDSC009.prototype.updateRouteData(
                adid,
                dt[i]
            );
            rowsAffected += Number(results.rowsAffected);
        }
        return res.status(200).json(rowsAffected);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const dataExistsCheck = async(req:Request,res:Response) =>{

    try{
        var {dt}=req.body;
        const results=await LDSC009.prototype.dataExistsCheck(dt);
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
        return res.status(200).json(table[0].TOTAL)
    }
   
    catch (error) {
        return res.status(400).json(error);
    }
};


export const insertData = async (req: Request, res: Response) => {
  
    try {
        let { adid, dt } = req.body;    
        //let rowsAffected: number = 0;
        let results = await LDSC009.prototype.insertData(adid,dt);
        //rowsAffected=results.rowseffected()
        return res.status(200).json(results);
        }
        
    catch (error) {
        return res.status(400).json(error);
    }
};
// export const insertData1 = async(res:Response,req:Request)=>{
//     console.log(req.body)
//     try{
//         var adid=req.body.adid;
//         var dt=req.body.dt;
//         var effectedrow:any=0;
//         const results=;
//         return res.status(200).json("Good")
//     }
//     catch(error)
//     {
//         return res.status(400).json(error);
//     }

// }
    
export const deleteRouteData = async (req: Request, res: Response) => {
    try {
        var { adid, dt } = req.body;
        var rowsAffected: number = 0;
        for (var i in dt) {
            let results = await LDSC009.prototype.deleteRouteData(
                adid,
                dt[i]

            );
            rowsAffected += Number(results.rowsAffected);
        }
        return res.status(200).json(rowsAffected);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const maintainProcedure = async (req: Request, res: Response) => {
    try {
        var { adid, dt} = req.body;
        var rowsAffected: number = 0;
        var failRowSl = [];
        for (var i in dt) {
            let results = await LDSC009.prototype.maintainProcedure(adid,dt[i]);
            
            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                rowsAffected += Number(0);
                failRowSl.push(dt[i].SL)
            } else {
                rowsAffected += Number(1);
            }
        }
        var obj = {
            rowsAffSuc: rowsAffected,
            failRowSL: failRowSl
        };
        return res.status(200).json(obj);
        }
     catch (error) {
        return res.status(400).json(error);
    }
};

