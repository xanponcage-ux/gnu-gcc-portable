import { Request, Response } from "express";
import SMCS001 from "../models/SMCS001Model";


export const getProcessChartList = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        let Action = req.body.Action;
      console.log('controller-action->',Action);
        
      const results: any = await SMCS001.prototype.getProcessChartList(Plant,Action);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const getProcessChartData = async (req: Request, res: Response) => {   
  try {    
    const {
          plant,
          Process_ChartNO,
          Version,
          Product_Group,
          Product_Group_Description,
          Quality_Code,
          Product_Category,
          TDC_No,
          Product_Application,
          Grade_Description,
          Action
        } = req.body;


      // // Call service with filters
      
    const results = await SMCS001.prototype.getProcessChartData({
          Plant: plant, // Default plant
          ProcessChart: Process_ChartNO,
          Version,
          ProductGroup: Product_Group,
          ProductGroupDesc: Product_Group_Description,
          QualityCode: Quality_Code,
          ProductCategory: Product_Category,
          TDCNo: TDC_No,
          ProductApplication: Product_Application,
          GradeDesc: Grade_Description,
          Action : Action
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
      console.error('Error in getProcessChartDataHandler:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      });
    }
}
export const InsertProcChartData = async (req: Request, res: Response) => {   
  try {    
    const {
          Plant,
          Action,
          ProcessChart,
          Version,
          Prod_Version,
          QualityCode,
          TDCNo,
          ProductGroup,
          GradeDesc,
          ProductApplication,
          ProductCategory,
          Remarks
        } = req.body;


      // // Call service with filters
      
    const results = await SMCS001.prototype.InsertProcChartData( Plant,Action, ProcessChart,Version,Prod_Version,
      QualityCode,TDCNo,ProductGroup,GradeDesc,ProductApplication,ProductCategory,Remarks);
    return res.status(200).json(results.outBinds.LS_OUT_FLAG);
    } catch (error: any) {
      console.error('Error in getProcessChartDataHandler:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      });
    }
}
export const updateActiveDeactive =async(req : Request, res : Response)=>{
  try {
    let Plant = req.body.Plant;
    let Action = req.body.Action;
    let selectedPCHART = req.body.PCHART;
      // Version,Prod_Version,QualityCode,TDCNo,ProductGroup,GradeDesc,ProductApplication,ProductCategory,Remarks
    var res_y: any = [];
    var res_n: any = [];
    for (var i=0; i< selectedPCHART.length; i++) {
      console.log(selectedPCHART[i].PCM_PCHART_NO);
      var proc = selectedPCHART[i].PCM_PCHART_NO;
      var version = selectedPCHART[i].PCM_VERSION;
      var results: any = await SMCS001.prototype.InsertProcChartData(Plant, Action, proc, version, '','', '', '', '', '', '', '');
       // console.log(plant, order, item, BATCH_ID, "", allotedQty, btp, BTP_T, sfgMaterial);
      console.log(proc,results.outBinds.LS_OUT_FLAG.toString());
       
        if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
          res_n.push([proc, version,results.outBinds.LS_OUT_FLAG.toString()]);
        } else {
          res_y.push([proc, version]);
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
}

export const getProcessChartSpec = async(req: Request, res: Response) => {
  try {
    const {
      Plant,
      Process_ChartNO,
      Version
    } = req.body;

    const result = await SMCS001.prototype.getProcessChartSpec({Plant: Plant,
      ProcessChart: Process_ChartNO,
      Version:Version,
    })

    console.log("result:  ",result)

    const table: any = [];
      const header: any = [];
      const columns: any = [];
      const fullData: any = [];

      for (let i = 0; i < result.metaData.length; i++) {
          header.push((result.metaData[i].name as string).replace(/ /g, ''))
      }

      for (let i = 0; i < result.metaData.length; i++) {
          var obj: any = {};
          obj.title = (result.metaData[i].name as string);
          obj.field = header[i];
          columns.push(obj)
      }

      for (let i = 0; i < result.rows.length; i++) {
          const arr = result.rows[i];
          var jsonObj: any = {};
          header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
          table.push(jsonObj)
      }

      fullData.push(columns);
      fullData.push(table);

      return res.status(200).json(fullData);
  } catch (error: any) {
    console.error('Error in getProcessChartSpec:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      });
  }
}
