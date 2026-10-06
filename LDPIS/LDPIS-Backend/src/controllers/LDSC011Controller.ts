import { Request, Response } from "express";
import moment from 'moment'
import LDSC011 from '../models/LDSC011Model';
import { Post } from "../typed/typed";

export const getOrderData = async (req: Request, res: Response) => {
    try {
        console.log("incontroller")
        let plant = req.body.plant;
        let OrdGrd = req.body.OrdGrd;

        const results: any = await LDSC011.prototype.getOrderData(plant,OrdGrd);
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


export const updateOrderData = async (req: Request, res: Response) => {
    try {
      const selectedData = req.body?.rowData;
      const adid = req.body?.adid
      let totalRowsAffected = 0;
      console.log("controller",selectedData)
  var result1 = [];
      for (const data of selectedData) {       
        result1 = await LDSC011.prototype.updateOrderData(data,adid);
        // if (result1?.rowsAffected) {
        //     totalRowsAffected += result1.rowsAffected;
        //   }
        console.log("result1: ", result1);
        }
    //   console.log("rowseffected",totalRowsAffected)
      return res.status(200).json(result1);
    } catch (error: any) {
      console.log("controllererror",error)
      return res.status(400).json(error);
    }
  };

export const InsertOrderData = async (req: Request, res: Response) => {
    try {
      const selectedData = req.body?.rowData;
      const adid = req.body?.adid
      let totalRowsAffected = 0;
      console.log("controller",selectedData)
  
      for (const data of selectedData) {
       
        var  result1 = await LDSC011.prototype.InsertOrderData(data,adid);
        if (result1?.rowsAffected) {
            totalRowsAffected += result1.rowsAffected;
          }
        }
  
      return res.status(200).json(result1);
    } catch (error: any) {
      console.log("insert_cont",error)
      return res.status(400).json(error);
    }
  };

  export const DeleteOrderData = async (req: Request, res: Response) => {
    try {
      const selectedData = req.body?.rowData;
      const adid = req.body?.adid
      let totalRowsAffected = 0;
      console.log("controller",selectedData)
  
      for (const data of selectedData) {
       
        var  result1 = await LDSC011.prototype.DeleteOrderData(data,adid);
        if (result1?.rowsAffected) {
            totalRowsAffected += result1.rowsAffected;
          }
        }
  
      return res.status(200).json(result1);
    } catch (error: any) {
      console.log("delete_cont",error)
      return res.status(400).json(error);
    }
  };


  export const getCdValue = async (req: Request, res: Response) => {
    try {
        
        const results: any = await LDSC011.prototype.getCdValue();
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPathVal = async (req: Request, res: Response) => {
  try {
      
      const results: any = await LDSC011.prototype.getPathVal();
      return res.status(200).json(results.rows);
  } catch (error) {
      return res.status(400).json(error);
  }
};