import { Request, Response } from "express";
import SMCS002 from "../models/SMCS002Model";


export const getHeatList = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        
        const results: any = await SMCS002.prototype.getHeatList(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const getHeatDetails = async (req: Request, res: Response) => {   
  try {    
    const {
          plant,
          ProdDtFrm,
          ProdDtTo,
          Decision,
          HeatNo,
          PcNo,
          Caster,
          Status,   
        } = req.body;

      const results = await SMCS002.prototype.getHeatDetails({
          plant:plant,
          ProdDtFrm: ProdDtFrm,
          ProdDtTo:ProdDtTo,
          Decision:Decision,
          HeatNo:HeatNo,
          PcNo:PcNo,
          Caster:Caster,
          Status :Status, 
      });
      console.log("in controller page")
      console.log("data",results)
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
    } catch (error: any) {
      console.error('Error in getHeatDetailsHandler:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      });
    }
};