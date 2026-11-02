import { Request, Response } from "express";
import moment from 'moment'
import TTSM005 from "../models/TTSM005Model";
import { Post } from "../typed/typed";

export const GetProcDesc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await TTSM005.prototype.GetProcDesc(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const GetOrderType = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await TTSM005.prototype.GetOrderType(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


// export const GetCount = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.GetCount(Plant);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const CheckPackBatch = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let Status = req.body.Status;
//         let BatchID = req.body.BatchID;
//         const results: any = await TTSM005.prototype.CheckPackBatch(Plant, Status, BatchID);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const GetLargeCount = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        const results: any = await TTSM005.prototype.GetLargeCount(Plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getCommRecorder = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let { User } = req.body;
        console.log(User);
        const results: any = await TTSM005.prototype.getCommRecorder(User);
        console.log(results.rows);
        return res.status(200).json( results.rows);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

// export const SCO_INSERT = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.SCO_INSERT(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const CONFIRM = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        let scrapFlag = req.body.scrapFlag;
        var checkPass = "";
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            if (scrapFlag == "" || scrapFlag == "2") {
                let binds = {
                    ID_FIRST_PAR: ele.EOM_ID_BATCH,
                    ID_BATCH: ele.EOM_ID_BATCH,
                    CD_PROCESS: ele.EOM_CD_CURR_PROC,
                    BATCH_TYPE: "FG",
                    CD_CURR_PROC: ele.EOM_CD_CURR_PROC,
                    CD_NEXT_PROC: ele.EOM_CD_NEXT_PROC,
                    CD_QLTY: ele.EOM_CD_QLTY_ACTL,
                    CD_PROD: ele.EOM_CD_PROD,
                    NO_TDC: ele.EOM_TDC_ACTL,
                    MS_PIECE_ACTL: ele.EOM_MS_PIECE_ACTL,
                    MS_GROSS_CAL: ele.EOM_MS_GROSS_ACTL,
                    NO_PIECES: ele.EOM_NO_PIECES,
                    IDIA: ele.EOM_IDIA,
                    ODIA: ele.EOM_ODIA,
                    SEC1: ele.EOM_SEC1,
                    SEC2: ele.EOM_SEC2,
                    LENGTH: ele.EOM_LENGTH,
                    ROLLING_LENGTH: ele.EOM_LENGTH,
                    NO_CAST: ele.EOM_NO_CAST,
                    DT_PRODN_TATA: ele.EOM_TS_CREATION,
                    CD_SHIFT: ele.EOM_CD_SHIFT,
                    ID_ORDER: ele.EOM_ID_ORDER_CUS,
                    NO_ITEM: ele.EOM_ID_ORD_ITEM_CUS,
                    ID_WRK_INST: "",
                    ID_SCHEDULE: "",
                    MS_INPUT: ele.EOM_MS_PIECE_ACTL,
                    YIELD_PERC: 0,
                    UOM: ele.EOM_UOM,
                    PROD_STRT_TM: "",
                    PROD_END_TM: "",
                    STOR_LOC: "",
                    WORK_CENT: "",
                    PLAN_PROC: "",
                    PASSED_PROC: ele.EOM_PASSED_PROC,
                    NO_OF_PASS: "",
                    FG_MATNR: ele.FG_MAT_NO,
                    RM_MATNR: "",
                    SFG_MATNR: "",
                    SCRP_MATNR: "",
                    TS_REC_CREATE: ele.EOM_TS_CREATION,
                    OPR_COMMENT: "",
                    EOM_CD_YRD: ele.EOM_CD_YRD,
                }
                let insert_result = await TTSM005.prototype.insertScrapDetails(Plant, binds, userId);
                var outInsertBinds = insert_result.outBinds.ls_out_flag;
                if (outInsertBinds == 'Y') {
                    var results: any = await TTSM005.prototype.CONFIRM(Plant, ele, userId);

                    //return res.status(200).json(results.rows);
                    var outBinds = results.outBinds.ls_out_flag;
                    //if (outBinds.toString().startsWith("N-"))
                    //{
                    checkPass += "   " + ele.EOM_ID_BATCH + "--  " + outBinds + " . ";
                    //}
                }
                else {
                    checkPass += "   " + ele.EOM_ID_BATCH + "--  " + outInsertBinds + " . ";
                }
            } else {
                var results: any = await TTSM005.prototype.CONFIRM(Plant, ele, userId);

                var outBinds = results.outBinds.ls_out_flag;
                checkPass += "   " + ele.EOM_ID_BATCH + "--  " + outBinds + " . ";
            }
        }
        return res.status(200).json(checkPass);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapData = async (req: Request, res: Response) => {
    try {
        let results = await TTSM005.prototype.getScrapData(req);
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        // if (results.rows[0][0] > 0) {
        //     let update_result = await TTSM005.prototype.updateScrapDetails(req);
        // }

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



export const insertScrapDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var errorString = "";
        var error = false;
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            let binds = {
                ID_FIRST_PAR: ele.ID_FIRST_PAR,
                ID_BATCH: ele.ID_BATCH,
                CD_PROCESS: ele.CD_PROCESS,
                BATCH_TYPE: ele.BATCH_TYPE,
                CD_CURR_PROC: ele.CD_CURR_PROC,
                CD_NEXT_PROC: ele.CD_NEXT_PROC,
                CD_QLTY: ele.CD_QLTY,
                CD_PROD: ele.CD_PROD,
                NO_TDC: ele.NO_TDC,
                MS_PIECE_ACTL: ele.MS_PIECE_ACTL,
                MS_GROSS_CAL: ele.MS_GROSS_CAL,
                NO_PIECES: ele.NO_PIECES,
                IDIA: ele.IDIA,
                ODIA: ele.ODIA,
                SEC1: ele.SEC1,
                SEC2: ele.SEC2,
                LENGTH: ele.LENGTH,
                ROLLING_LENGTH: ele.ROLLING_LENGTH,
                NO_CAST: ele.NO_CAST,
                DT_PRODN_TATA: ele.DT_PRODN_TATA,
                CD_SHIFT: ele.CD_SHIFT,
                ID_ORDER: ele.ID_ORDER,
                NO_ITEM: ele.NO_ITEM,
                ID_WRK_INST: ele.ID_WRK_INST,
                ID_SCHEDULE: ele.ID_SCHEDULE,
                MS_INPUT: ele.MS_INPUT,
                YIELD_PERC: ele.YIELD_PERC,
                UOM: ele.UOM,
                PROD_STRT_TM: ele.PROD_STRT_TM,
                PROD_END_TM: ele.PROD_END_TM,
                STOR_LOC: ele.STOR_LOC,
                WORK_CENT: ele.WORK_CENT,
                PLAN_PROC: ele.PLAN_PROC,
                PASSED_PROC: ele.PASSED_PROC,
                NO_OF_PASS: ele.NO_OF_PASS,
                FG_MATNR: ele.FG_MATNR,
                RM_MATNR: ele.RM_MATNR,
                SFG_MATNR: ele.SFG_MATNR,
                SCRP_MATNR: ele.SCRP_MATNR,
                TS_REC_CREATE: ele.TS_REC_CREATE,
                OPR_COMMENT: ele.OPR_COMMENT,
                EOM_CD_YRD: ele.EOM_CD_YRD
            }

            var results: any = await TTSM005.prototype.insertScrapDetails(Plant, binds, userId);
            var flag = results.outBinds.ls_out_flag;
            if (flag != "Y") {
                error = true;
                errorString += " Error for record " + ele.ID_BATCH + "";
            }
        }

        if (!error) {
            errorString = "Y"
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getInsertScrapKbDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let userId = req.body.userId;
        var errorString = "";
        var error = false;
        for (var i = 0; i < dt.length; i++) {
            var ele = dt[i];
            let binds = {
                ID_FIRST_PAR: ele.ID_FIRST_PAR,
                ID_BATCH: ele.ID_BATCH,
                CD_PROCESS: ele.CD_PROCESS,
                BATCH_TYPE: ele.BATCH_TYPE,
                CD_CURR_PROC: ele.CD_CURR_PROC,
                CD_NEXT_PROC: ele.CD_NEXT_PROC,
                CD_QLTY: ele.CD_QLTY,
                CD_PROD: ele.CD_PROD,
                NO_TDC: ele.NO_TDC,
                MS_PIECE_ACTL: ele.MS_PIECE_ACTL,
                MS_GROSS_CAL: ele.MS_GROSS_CAL,
                NO_PIECES: ele.NO_PIECES,
                IDIA: ele.IDIA,
                ODIA: ele.ODIA,
                SEC1: ele.SEC1,
                SEC2: ele.SEC2,
                LENGTH: ele.LENGTH,
                ROLLING_LENGTH: ele.ROLLING_LENGTH,
                NO_CAST: ele.NO_CAST,
                DT_PRODN_TATA: ele.DT_PRODN_TATA,
                CD_SHIFT: ele.CD_SHIFT,
                ID_ORDER: ele.ID_ORDER,
                NO_ITEM: ele.NO_ITEM,
                ID_WRK_INST: ele.ID_WRK_INST,
                ID_SCHEDULE: ele.ID_SCHEDULE,
                MS_INPUT: ele.MS_INPUT,
                YIELD_PERC: ele.YIELD_PERC,
                UOM: ele.UOM,
                PROD_STRT_TM: ele.PROD_STRT_TM,
                PROD_END_TM: ele.PROD_END_TM,
                STOR_LOC: ele.STOR_LOC,
                WORK_CENT: ele.WORK_CENT,
                PLAN_PROC: ele.PLAN_PROC,
                PASSED_PROC: ele.PASSED_PROC,
                NO_OF_PASS: ele.NO_OF_PASS,
                FG_MATNR: ele.FG_MATNR,
                RM_MATNR: ele.RM_MATNR,
                SFG_MATNR: ele.SFG_MATNR,
                SCRP_MATNR: ele.SCRP_MATNR,
                TS_REC_CREATE: ele.TS_REC_CREATE,
                OPR_COMMENT: ele.OPR_COMMENT,
                EOM_CD_YRD: ele.EOM_CD_YRD
            }

            var results: any = await TTSM005.prototype.insertScrapDetails(Plant, binds, userId);
            var flag = results.outBinds.ls_out_flag;
            if (flag != "Y") {
                error = true;
                errorString += " Error for record " + ele.ID_BATCH + "";
            }
        }

        if (!error) {
            errorString = "Y"
        }
        return res.status(200).json({ errorString });
    } catch (error) {
        return res.status(400).json(error);
    }
};

// export const CONFIRM_Wires = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         let userId = req.body.userId;
//         const results: any = await TTSM005.prototype.CONFIRM_Wires(Plant, dt, userId);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getCoils_Wires = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let Process = req.body.Plant;
//         let Status = req.body.Plant;
//         let Order_ID = req.body.Plant;
//         let OrderItem = req.body.Plant;
//         let batch = req.body.Plant;
//         let Mbatch = req.body.Plant;
//         let ProdCd = req.body.Plant;
//         let QltyCd = req.body.Plant;
//         let Thick1 = req.body.Plant;
//         let Thick2 = req.body.Plant;
//         let Width1 = req.body.Plant;
//         let Width2 = req.body.Plant;
//         let TDC = req.body.Plant;
//         let SCO = req.body.Plant;
//         let OrderType = req.body.Plant;
//         let ProdDtFrom = req.body.Plant;
//         let ProdDtTo = req.body.Plant;
//         let Customer = req.body.Plant;

//         const results: any = await TTSM005.prototype.getCoils_Wires(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, Width1, Width2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer);
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];
//         const fullData: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         fullData.push(columns);
//         fullData.push(table);
//         return res.status(200).json(fullData);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const GetSCOList = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        const results: any = await TTSM005.prototype.GetSCOList(Plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

// export const checkRes = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.checkRes(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const getCoils = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let Status = req.body.Status.value;
        let Order_ID = req.body.Order_ID;
        let OrderItem = req.body.OrderItem;
        let batch = req.body.batch;
        let Mbatch = req.body.Mbatch;
        let ProdCd = req.body.ProdCd;
        let QltyCd = req.body.QltyCd;
        let Thick1 = req.body.Thick1;
        let Thick2 = req.body.Thick2;
        // let Width1 = req.body.Width1;
        // let Width2 = req.body.Width2;
        let TDC = req.body.TDC;
        let SCO = req.body.SCO;
        let OrderType = req.body.OrderType;
        let ProdDtFrom = req.body.ProdDtFrom;
        let ProdDtTo = req.body.ProdDtTo;
        let Customer = req.body.Customer;
        let Odia = req.body.Odia;
        let PkgDtFrom = req.body.PkgDtFrom;
        let PkgDtTo = req.body.PkgDtTo;
        let pname = req.body.PName;
        const results: any = await TTSM005.prototype.getCoils(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer, Odia, PkgDtFrom, PkgDtTo, pname);
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

export const getKbCoils = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Process = req.body.Process;
        let Status = req.body.Status.value;
        let Order_ID = req.body.Order_ID;
        let OrderItem = req.body.OrderItem;
        let batch = req.body.batch;
        let Mbatch = req.body.Mbatch;
        let ProdCd = req.body.ProdCd;
        let QltyCd = req.body.QltyCd;
        let Thick1 = req.body.Thick1;
        let Thick2 = req.body.Thick2;
        let TDC = req.body.TDC;
        let SCO = req.body.SCO;
        let OrderType = req.body.OrderType;
        let ProdDtFrom = req.body.ProdDtFrom;
        let ProdDtTo = req.body.ProdDtTo;
        let Customer = req.body.Customer;
        let Odia = req.body.Odia;
        let PkgDtFrom = req.body.PkgDtFrom;
        let PkgDtTo = req.body.PkgDtTo;
        let pname = req.body.PName;
        const results: any = await TTSM005.prototype.getKbCoils(Plant, Process, Status, Order_ID, OrderItem, batch, Mbatch, ProdCd, QltyCd, Thick1, Thick2, TDC, SCO, OrderType, ProdDtFrom, ProdDtTo, Customer, Odia, PkgDtFrom, PkgDtTo, pname);
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

// export const PrintResult = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.PrintResult(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };
export const PlantAddress = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        const results: any = await TTSM005.prototype.PlantAddress(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const SFGDetails = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let Batch = req.body.Batch;
        var results: any = [];
        var metaData: any = [];
        var results: any = []
        for (var i = 0; i < Batch.length; i++) {
            var resDt: any = await TTSM005.prototype.SFGDetails(Plant, Batch[i]);
            results.push(resDt.rows);
            metaData.push(resDt.metaData);
        }

        const table: any = [];
        const header: any = [];
        const columns: any = [];
        const fullData: any = [];

        var mdLength = metaData[0] ? metaData[0].length : 0;
        for (let i = 0; i < mdLength; i++) {
            header.push((metaData[0][i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < mdLength; i++) {
            var obj: any = {};
            obj.title = (metaData[0][i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.length; i++) {
            const arr = results[i][0];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }
        fullData.push(table);
        return res.status(200).json(table);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getSecRsns = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;

        const results: any = await TTSM005.prototype.getSecRsns(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetStsList = async (req: Request, res: Response) => {
    try {
        //let Plant = req.body.Plant;
        //let dt = req.body.dt;
        const results: any = await TTSM005.prototype.GetStsList();
        // const list: any = [];
        // //create json
        // results.rows.map(function (x: any) {
        //   list.push(x[0] + ":" + x[1]);
        // });
        return res.status(200).json(results.rows);
        //return results
        //return res.status(200).json(list);       
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const GetOdiaList = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await TTSM005.prototype.GetOdiaList(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const GetCustDesc = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.plant;
        const results: any = await TTSM005.prototype.GetCustDesc(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getSCO = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        const results: any = await TTSM005.prototype.getSCO(Plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPrvEpa = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        const results: any = await TTSM005.prototype.GetPrvEpa(Plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetSrcCoil = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        const results: any = await TTSM005.prototype.GetSrcCoil(Plant, dt);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const InsertLabel = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let BatchID = req.body.BatchID;
        let Sts = req.body.Sts;
        let UserID = req.body.UserID;

        const results: any = await TTSM005.prototype.InsertLabel(Plant, BatchID, Sts, UserID);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getScrapFlag = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let BatchID = req.body.dt[0].EOM_ID_BATCH;
        const results: any = await TTSM005.prototype.getScrapFlag(Plant, BatchID);
        for (let i = 0; i < results.length; i++) {
            if (results[i] == 0) {
                return res.status(200).json(10);
            }
        }
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

// export const CONFIRM_Attachment = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.CONFIRM_Attachment(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const CONFIRM_UpdateWflStatus = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.CONFIRM_UpdateWflStatus(Plant);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const CONFIRM_UpdateStatus = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.CONFIRM_UpdateStatus(Plant);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const CONFIRM_SendMail = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.CONFIRM_SendMail(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getRequestIdDetails = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.getRequestIdDetails(Plant);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const GetSecMaster = async (req: Request, res: Response) => {
//     try {

//         const results: any = await TTSM005.prototype.GetSecMaster();
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const SendToCentralHub = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.SendToCentralHub(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const AuthorityToSendToCentralHub = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.AuthorityToSendToCentralHub(Plant, dt);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getCompFrmPlant = async (req: Request, res: Response) => {
//     try {
//         let Plant = req.body.Plant;
//         let dt = req.body.dt;
//         const results: any = await TTSM005.prototype.getCompFrmPlant(Plant);
//         return res.status(200).json(results.rows);
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const getGroupPlant = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;

        const results: any = await TTSM005.prototype.getGroupPlant(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getBatchId = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let status = req.body.status;
        const results: any = await TTSM005.prototype.getBatchId(plant, status);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getIndTubesData = async (req: Request, res: Response) => {
    try {

        const results: any = await TTSM005.prototype.getIndTubesData(req);
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

export const GetPieceActl = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM005.prototype.GetPieceActl(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getProductName = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM005.prototype.getProductName(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const saveKbBatches = async (req: Request, res: Response) => {
    try {
        let Plant = req.body.Plant;
        let dt = req.body.dt;
        let sdt = req.body.scrapDt;
        let userId = req.body.userId;
        var res_y: any = [];
        var res_n: any = [];
        var checkPass = "";
        for (var i = 0; i < sdt.length; i++) {
            var ele = sdt[i];
            console.log(dt.REMARKS);
            console.log("In controller");
            let binds = {
                ID_FIRST_PAR: dt.EOM_ID_BATCH,
                ID_BATCH: ele.SCRAP_BATCH_ID,
                CD_PROCESS: dt.EOM_CD_CURR_PROC,
                BATCH_TYPE: ele.BATCH_TYPE,
                CD_CURR_PROC: ele.CD_CURR_PROC,
                CD_NEXT_PROC: ele.CD_NEXT_PROC,
                CD_QLTY: ele.CD_QLTY,
                CD_PROD: dt.EOM_CD_PROD,
                NO_TDC: dt.EOM_TDC_ACTL,
                MS_PIECE_ACTL: dt.EOM_MS_PIECE_ACTL,
                MS_GROSS_CAL: dt.EOM_MS_GROSS_ACTL,
                NO_PIECES: ele.NO_OF_SCRAP_TUBES,
                IDIA: ele.IDIA,
                ODIA: ele.ODIA,
                SEC1: ele.SEC1,
                SEC2: ele.SEC2,
                LENGTH: ele.LENGTH,
                ROLLING_LENGTH: dt.EOM_LENGTH,
                NO_CAST: dt.EOM_NO_CAST,
                DT_PRODN_TATA: dt.EOM_TS_CREATION,
                CD_SHIFT: dt.EOM_CD_SHIFT,
                ID_ORDER: dt.EOM_ID_ORDER_CUS,
                NO_ITEM: dt.EOM_ID_ORD_ITEM_CUS,
                ID_WRK_INST: "",
                ID_SCHEDULE: "",
                MS_INPUT:  ele.SCRAP_WT, //{Scrap}
                YIELD_PERC: 0,
                UOM: dt.EOM_UOM,
                PROD_STRT_TM: "",
                PROD_END_TM: "",
                STOR_LOC: "",
                WORK_CENT: ele.WORK_CENT,
                PLAN_PROC: dt.EOM_PLANNED_PROC,
                PASSED_PROC: dt.EOM_PASSED_PROC,
                NO_OF_PASS: "",
                FG_MATNR: ele.FG_MATNR,
                RM_MATNR: "",
                SFG_MATNR: "",
                SCRP_MATNR: ele.SCRP_MATNR, //{Scrap}
                TS_REC_CREATE: dt.EOM_TS_CREATION,
                OPR_COMMENT: dt.REMARKS,
                EOM_CD_YRD: dt.EOM_CD_YRD,
            }
            let insert_result = await TTSM005.prototype.insertScrapDetails(Plant, binds, userId);
            var outInsertBinds = insert_result.outBinds.ls_out_flag;
            console.log(outInsertBinds);
            if (outInsertBinds == 'Y') {
            }
            else {
                checkPass +=  ele.SCRAP_BATCH_ID + "--  " + outInsertBinds + " . ";
                console.log(checkPass);
                return res.status(200).json(checkPass);
            }
        }
        let results = await TTSM005.prototype.saveKbBatches(Plant, dt.EOM_ID_BATCH, userId);
        console.log(results);
        if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
            res_n.push(results.outBinds.LS_OUT_FLAG);
            console.log(res_y);
            return res.status(200).json(res_n);
          } else {
            res_y.push(results.outBinds.LS_OUT_FLAG);
            console.log(res_y);
            return res.status(200).json(res_y);
          }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

export const saveDefectBatches = async (req: Request, res: Response) => {
    try {
        const results: any = await TTSM005.prototype.saveDefectBatches(req);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const printFGLabel = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let fg_mat_no= req.body.fg_mat;
        let fg_mat_spec= req.body.fg_mat_spc;

        const applicatio_id: any = await TTSM005.prototype.get_applicatio_id(plant,fg_mat_no, fg_mat_spec);
        const hsn_code: any = await TTSM005.prototype.get_hsn_code(plant,fg_mat_no, fg_mat_spec);
        const grade: any = await TTSM005.prototype.get_grade(plant,fg_mat_no, fg_mat_spec);

        var dt = {
            res_application: applicatio_id,
            res_hsn: hsn_code,
            res_grade: grade
        }
        return res.status(200).json(dt);
    } catch (error) {
        return res.status(400).json(error);
    }
};
