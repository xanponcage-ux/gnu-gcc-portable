import { Request, Response } from "express";
import moment from 'moment'
import LDSC010 from '../models/LDSC010Model';
import { Post } from "../typed/typed";

export const getRmReceivedOnDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getRmReceivedOnDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMatGrp = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getMatGrp(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getRmReceivedToDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getRmReceivedToDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllotmentOnDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getAllotmentOnDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getAllotmentToDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getAllotmentToDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTubeSchedulingOnDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getTubeSchedulingOnDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTubeSchedulingToDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getTubeSchedulingToDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTubeProductionOnDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getTubeProductionOnDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getTubeProductionToDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getTubeProductionToDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPackingConfirmationOnDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getPackingConfirmationOnDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getPackingConfirmationToDate = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getPackingConfirmationToDate(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getInventorySumRm = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getInventorySumRm(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getInventorySumWip = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getInventorySumWip(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getInventorySumPendingUd = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getInventorySumPendingUd(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getInventorySumFG = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getInventorySumFG(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryRm = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryRm(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getStageWiseInventoryPendingUd = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryPendingUd(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryAnn = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryAnn(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryColdDraw = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryColdDraw(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryStp = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryStp(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryCtl = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryCtl(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryHydra = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryHydra(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryEct = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryEct(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryFG = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryFG(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryFinalUD = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryFinalUD(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseInventoryPacking = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSC010.prototype.getStageWiseInventoryPacking(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStageWiseGrAllAPI = async (req: Request, res: Response) => {
    try {
        const RmgrOnDate: any = await LDSC010.prototype.getRmgrOnDate(req);
        const RmgrToDate: any = await LDSC010.prototype.getRmgrToDate(req);
        const SfgProdOnDate: any = await LDSC010.prototype.getSfgProdOnDate(req);
        const SfgProdToDate: any = await LDSC010.prototype.getSfgProdToDate(req);
        const AnnProdOnDate: any = await LDSC010.prototype.getAnnProdOnDate(req);
        const AnnProdToDate: any = await LDSC010.prototype.getAnnProdToDate(req);
        const StpProdOnDate: any = await LDSC010.prototype.getStpProdOnDate(req);
        const StpProdToDate: any = await LDSC010.prototype.getStpProdToDate(req);
        const ColdDProdOnDt: any = await LDSC010.prototype.getColdDProdOnDt(req);
        const ColdDProdToDt: any = await LDSC010.prototype.getColdDProdToDt(req);
        const CltProdOnDate: any = await LDSC010.prototype.getCltProdOnDate(req);
        const CltProdToDate: any = await LDSC010.prototype.getCltProdToDate(req);
        const HydraProdOnDate: any = await LDSC010.prototype.getHydraProdOnDate(req);
        const HydraProdToDate: any = await LDSC010.prototype.getHydraProdToDate(req);
        const EtcProdOnDate: any = await LDSC010.prototype.getEtcProdOnDate(req);
        const EtcProdToDate: any = await LDSC010.prototype.getEtcProdToDate(req);
        const FGOnDate: any = await LDSC010.prototype.getFGOnDate(req);
        const FGToDate: any = await LDSC010.prototype.getFGToDate(req);

        const RmgrCurrDate: any = await LDSC010.prototype.getRmgrCurrDate(req);
        const SfgProdCurrDate: any = await LDSC010.prototype.getSfgProdCurrDate(req);
        const AnnProdCurrDate: any = await LDSC010.prototype.getAnnProdCurrDate(req);
        const StpProdCurrDate: any = await LDSC010.prototype.getStpProdCurrDate(req);
        const ColdDProdCurrDt: any = await LDSC010.prototype.getColdDProdCurrDt(req);
        const CltProdCurrDate: any = await LDSC010.prototype.getCltProdCurrDate(req);
        const HydraProdCurrDate: any = await LDSC010.prototype.getHydraProdCurrDate(req);
        const EtcProdCurrDate: any = await LDSC010.prototype.getEtcProdCurrDate(req);
        const FGCurrDate: any = await LDSC010.prototype.getFGCurrDate(req);
        

        let data = {
            
            RM_GROnDate: RmgrOnDate.rows[0],
            RM_GRToDate: RmgrToDate.rows[0],
            RM_GRCurrDate:RmgrCurrDate.rows[0],
            SFG_ProdOnDate: SfgProdOnDate.rows[0],
            SFG_ProdToDate: SfgProdToDate.rows[0],
            SFG_ProdCurrDate:SfgProdCurrDate.rows[0],
            ANN_ProdOnDate: AnnProdOnDate.rows[0],
            ANN_ProdToDate: AnnProdToDate.rows[0],
            ANN_ProdCurrDate:AnnProdCurrDate.rows[0],
            STP_ProdOnDate: StpProdOnDate.rows[0],
            STP_ProdToDate: StpProdToDate.rows[0],
            STP_ProdCurrDate:StpProdCurrDate.rows[0],
            COLD_DProdOnDt: ColdDProdOnDt.rows[0],
            COLD_DProdToDt: ColdDProdToDt.rows[0],
            COLD_DProdCurrDt:ColdDProdCurrDt.rows[0],
            CLT_ProdOnDate: CltProdOnDate.rows[0],
            CLT_ProdToDate: CltProdToDate.rows[0],
            CLT_ProdCurrDate:CltProdCurrDate.rows[0],
            HYDRA_ProdOnDate: HydraProdOnDate.rows[0],
            HYDRA_ProdToDate: HydraProdToDate.rows[0],
            HYDRA_ProdCurrDate:HydraProdCurrDate.rows[0],
            ETC_ProdOnDate: EtcProdOnDate.rows[0],
            ETC_ProdToDate: EtcProdToDate.rows[0],
            ETC_ProdCurrDate:EtcProdCurrDate.rows[0],
            FG_OnDate: FGOnDate.rows[0],
            FG_ToDate: FGToDate.rows[0],
            FG_CurrDate:FGCurrDate.rows[0]
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getGRReportData = async (req: Request, res: Response) => {
    try {

        const result: any = await LDSC010.prototype.getDaysList(req);        
        var Days = result.rows[0][0];
        var All_Columns = result.rows[0][1];
        var Total = result.rows[0][2];
        console.log(Days,All_Columns,Total);
        const results: any = await LDSC010.prototype.getGRReportData(Days,All_Columns,Total, req);

        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];


      for (let i = 0; i < results.metaData.length; i++) {
        header.push((results.metaData[i].name as string).replace(/ /g, ''))
      }

      for (let i = 1; i < results.metaData.length; i++) {
        var obj: any = {};
        obj.title = (results.metaData[i].name as string).replace("'", '');
        obj.field = header[i];
        //obj.headerFilter = "input";
        //obj.headerFilterPlaceholder = "search...";
        //obj.hozAlign = "center";        
        if (i != 1){
        obj.bottomCalc= "sum"
        obj.bottomCalcParams= { precision: 3 }    
    }
        if(i == 1)
        {
            obj.frozen=true;
        }
        // obj.formatter = function (cell, formatterParams) {
        //     var value = cell.getValue();
        //     const isDecimal = (value) => {
        //         if (value === null || typeof value === 'string' || isNaN(value)) {
        //             return false;
        //         }
        //         return !Number.isInteger(parseFloat(value));
        //     };

        //     const roundToThreeDecimals = (value) => {
        //         return Number(parseFloat(value).toFixed(3));
        //     };

        //     if (isDecimal(value)) {
        //         return roundToThreeDecimals(value);
        //     }
        //     return value;
        // }    
        columns.push(obj)
      }

      for (let i = 0; i < results.rows.length; i++) {
        const arr = results.rows[i];
        var jsonObj: any = {};
        header.forEach((key: any, i: any) => jsonObj[key] = parseFloat(arr[i]).toFixed(3).replace('NaN',arr[i]).replace('null','0',))
        table.push(jsonObj)
      }

      fullData.push(columns);
      fullData.push(table);

      return res.status(200).json(fullData);;
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};