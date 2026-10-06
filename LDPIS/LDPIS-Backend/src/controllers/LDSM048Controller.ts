import { Request, Response } from "express";
import moment from 'moment'
import LDSM048 from '../models/LDSM048Model';
import { Post } from "../typed/typed";


export const getScrapData = async (req: Request, res: Response) => {
    try {
        var {
            batch,
            castNo,
            decFrmDt,
            decToDt,
            matNo,
            mbatch,
            plant,
            procFrmDt,
            procToDt,
            process,
            prodCd,
            prodType,
            qltyCd,
            scrpWt,
            status,
            tdc,
            thickFrm,
            thickTo,
            tonnage,
            widthFrm,
            widthTo,
        } = req.body;
        //   let mBatch=req.body.mBatch;
        const results: any = await LDSM048.prototype.getScrapData(
            batch,
            castNo,
            decFrmDt,
            decToDt,
            // matNo,
            mbatch,
            plant,
            // procFrmDt,
            // procToDt,
            process,
            prodCd,
            // prodType,
            qltyCd,
            scrpWt,
            status,
            // tdc,
            thickFrm,
            thickTo,
            tonnage,
            widthFrm,
            widthTo,
        )
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


export const getProcessDesc = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        // return res.status(200).json(results.rows);


        //execute query
        const results: any = await LDSM048.prototype.getProcessDesc(plant);
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

export const getMaterialData = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        //   let mBatch=req.body.mBatch;
        const results: any = await LDSM048.prototype.getMaterialData(plant)
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


export const getMergingData = async (req: Request, res: Response) => {
    try {
        let {
            plant,
            statusMerging,
            castNo,
            matNo
        } = req.body;
        //   let mBatch=req.body.mBatch;
        const results: any = await LDSM048.prototype.getMergingData(
            plant,
            statusMerging,
            castNo,
            matNo
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
        return res.status(400).json(error);
    }
};


export const saveMergingData = async (req: Request, res: Response) => {
    try {

        var {
            plant,
            selectedData,
            mergedQnty,
            mergedPcs,
            totalActualQnty,
            totalActualPcs,
            createdBy
        } = req.body;

        var rowsAffected: any = 0;
        var ls_max;

        const result_count: any = await LDSM048.prototype.getMaxBatchIDCount(plant);
        if (result_count.rows[0][0] <= 9) {
            ls_max = '0' + result_count.rows[0][0];
        } else {
            ls_max = result_count.rows[0][0];
        }

        const result_merge_id: any = await LDSM048.prototype.getMergeID(ls_max);

        const merge_id = result_merge_id.rows[0][0];
        var checkPass = "Y";
        let newMergeFlag = "";
        var batch_count = selectedData.length;
        var failedBatches = [];
        for (var i in selectedData) {
            //get data from request
            var rowCount = parseInt(i) + 1;
            var {
                ACTUAL_PCS,
                ACTUAL_QTY,
                BATCH1,
                LOM_NO_CAST,
                LOM_NO_MATNR,
                LOM_CD_STATUS,
                STATUS,
                CAST_NO,
                ACTUAL_PCS,
                ACTUAL_PCS
            } = selectedData[i];

            //execute query to update staus
            // const results: any = await LDSM048.prototype.saveMergingData(
            //     plant,
            //     mergedQnty,
            //     mergedPcs,
            //     totalActualQnty,
            //     totalActualPcs,
            //     createdBy,
            //     ACTUAL_PCS,
            //     ACTUAL_QTY,
            //     BATCH1,
            //     LOM_NO_CAST,
            //     LOM_NO_MATNR,
            //     LOM_CD_STATUS,
            //     merge_id,
            //     batch_count,
            //     rowCount
            // );
            // if (results.outBinds.toString().startsWith("N-")) {
            //     checkPass = "N";
            //     failedBatches.push(BATCH1);
            // }

            // execute temp sp
            const resultsTemp: any = await LDSM048.prototype.saveMergingDataTemp(
                plant,
                BATCH1,
                merge_id,
                createdBy
            );
            if (resultsTemp.outBinds.toString().startsWith("N-")) {
                checkPass = "N";
                failedBatches.push(BATCH1);
            }
        }
        if(checkPass == "Y") {
            const results048: any = await LDSM048.prototype.TTSB048mergeNew(
                plant,
                BATCH1,
                merge_id,
                createdBy
            );
            newMergeFlag = results048.outBinds;
            
        }
        

        var res_data = {
            checkPass: checkPass,
            failedBatches: failedBatches,
            merge_id: merge_id,
            merge_new: newMergeFlag
        }

        return res.status(200).json(res_data);


    } catch (error) {
        return res.status(400).json(error);
    }
};

export const saveMergingDataTemp = async (req: Request, res: Response) => {
    try {
        //execute query
        //const results: any = await LDSM048.prototype.saveMergingDataTemp(req);
        //return res.status(200).json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
};



export const getMaterialNo = async (req: Request, res: Response) => {
    try {

        //data retreival
        var { plant } = req.body;

        //execute query
        const results: any = await LDSM048.prototype.getMaterialNo(plant);
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

export const getCastNo = async (req: Request, res: Response) => {
    try {

        //data retreival
        var { plant } = req.body;

        //execute query
        const results: any = await LDSM048.prototype.getCastNo(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMoMData = async (req: Request, res: Response) => {
    try {
        let {
            plant,
            widthOdia,
            // matNo,
            // status
            // materialNo
            batch_id
        } = req.body;
        const results: any = await LDSM048.prototype.getMoMData(
            plant,
            batch_id,
            widthOdia
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
        return res.status(400).json(error);
    }
};

export const getSplitData = async (req: Request, res: Response) => {
    try {
        let {
            // batch,
            // pcs,
            // plant,
            // qty 
            plant,
            batch_id,
            mother_batch
        } = req.body;


        // const results : any = await LDSM048.prototype.getSplitData(

        // );

        const results: any = await LDSM048.prototype.getSplitData(
            plant,
            batch_id,
            mother_batch
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
        return res.status(400).json(error);
    }
};



export const getScrapRsn = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            rsnCat
        } = req.body;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        // return res.status(200).json(results.rows);


        //execute query
        const results: any = await LDSM048.prototype.getScrapRsn(plant, rsnCat);
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

export const getScrapMatNo = async (req: Request, res: Response) => {
    try {
        var {
            plant
        } = req.body;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        // return res.status(200).json(results.rows);


        //execute query
        const results: any = await LDSM048.prototype.getScrapMatNo(plant);
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



export const saveMaintainReason = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            batch,
            totalScrapQty,
            actualScrapQty,
            process,
            selectedData
        } = req.body;

        var checkPass = "Y";

        for (var i in selectedData) {
            //get data from request
            var {
                rsnCat,
                rsnCd,
                scrpMatNo,
                scrapQty,
            } = selectedData[i];

            //execute query to update staus
            const results: any = await LDSM048.prototype.saveMaintainReason(
                plant,
                rsnCat,
                rsnCd,
                scrpMatNo,
                batch,
                scrapQty,
                totalScrapQty,
                actualScrapQty,
                process
            );

            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
                checkPass = "N";
            }


        }
        return res.status(200).json(checkPass);

    } catch (error) {
        return res.status(400).json(error);
    }
};


export const postScrap = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            // batch  ,
            // scrapQty  ,
            // grossCal ,
            // motherBatch ,
            // parentBatch ,
            // pieces ,
            // prod ,
            // matNo ,
            // currentProcess,
            selectedData
        } = req.body;

        var error = false;
        var errorString = "";

        for (var i in selectedData) {
            //get data from request
            var {
                LOM_ID_BATCH, //batch
                LOM_CD_STATUS, //status
                SCRP_MATNR, //scrap material no
                LOM_MS_PIECE_ACTL, //weight
                LOM_ID_PAR_COIL_NO, //parent batch
                LOM_ID_FIRST_PAR, //mother batch
                LOM_CD_PROD, //product code
                LOM_NO_PIECES, //no of pieces
                LOM_NO_MATNR, //material no
                CURR_PROC, //process
                LOM_MS_SCRAP
            } = selectedData[i];


            //execute query to update staus
            const results: any = await LDSM048.prototype.postScrap(
                plant,
                LOM_ID_BATCH,
                LOM_CD_STATUS,
                SCRP_MATNR,
                LOM_MS_PIECE_ACTL,
                LOM_ID_PAR_COIL_NO,
                LOM_ID_FIRST_PAR,
                LOM_CD_PROD,
                LOM_NO_PIECES,
                LOM_NO_MATNR,
                CURR_PROC,
                LOM_MS_SCRAP
            );

            var flag = results.outBinds.LS_OUT_FLAG;



            if (flag.toString().startsWith("N-")) {
                error = true;
                errorString += " Error for batch " + selectedData[i].LOM_ID_BATCH + " -- " + flag.toString().replace("N-", "");
            }

        }

        if (!error) {
            errorString = "Data successfully modified !"
        }
        return res.status(200).json({ errorString });

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getReasonCategory = async (req: Request, res: Response) => {
    try {


        const results: any = await LDSM048.prototype.getReasonCategory();
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + ":" + x[1]);
        });

        //return results
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const getSplitBatch = async (req: Request, res: Response) => {
    try {
        var new_btch = "";
        var { plant, batchId, splitNo } = req.body;
        splitNo = parseInt(splitNo);

        const list: any = [];
        for (let i = 0; i < splitNo; i++) {
            const results: any = await LDSM048.prototype.getSplitBatch(plant);
            new_btch = results.rows[0][0];
            // if (i == 1) {
            //     new_btch = chk_btch + ln_max_no.toString().padStart(3, '0');
            // } else {
            //     new_btch = chk_btch + (ln_max_no + (i - 1)).toString().padStart(3, '0');
            // }
            list.push(new_btch);
        }
        //return results
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getsplitbatchRM = async (req: Request, res: Response) => {
    try {
        var new_btch = "";
        var { plant, batchId, splitNo } = req.body;
        splitNo = parseInt(splitNo);

        const list: any = [];
        for (let i = 0; i < splitNo; i++) {
            const results: any = await LDSM048.prototype.getSplitBatchRM(plant, batchId, i + 1);
            new_btch = results.rows[0][0];
            list.push(new_btch);
        }
        //return results
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getsplitbatchActal = async (req: Request, res: Response) => {
    try {
        var new_btch = "";
        var { plant, batchId, splitNo } = req.body;
        splitNo = parseInt(splitNo);

        const list: any = [];
        for (let i = 0; i < splitNo; i++) {
            const results: any = await LDSM048.prototype.getsplitbatchActal(plant, batchId, i + 1);
            new_btch = results.rows[0][0];
            list.push(new_btch);
        }
        
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};


export const saveSplitBatch = async (req: Request, res: Response) => {
    try {

        var {
            splitdata,
            plant,
            mainBatch,
            mainBatchQty,
            mainBatchPcs,
            bUnit,
            splitNo,
            splitQty,
            splitPcs
        } = req.body;


        var res_y: any = [];
        var res_n: any = [];

        for (var i in splitdata) {
            //get data from request
            var {
                BATCH_ID,
                PCS,
                QTY,
                DelinkOrderFlag,
                LENGTH
            } = splitdata[i];

            //execute query to update staus
            const results: any = await LDSM048.prototype.saveSplitBatch(
                BATCH_ID,
                PCS,
                QTY,
                DelinkOrderFlag,
                plant,
                mainBatch,
                mainBatchQty,
                mainBatchPcs,
                bUnit,
                splitNo,
                LENGTH
            );

            if (results.outBinds.LS_OUT_FLAG.toString().startsWith("Y-")) {

                res_y.push(BATCH_ID);
            } else {
                res_n.push(BATCH_ID + ": " + results.outBinds.LS_OUT_FLAG.toString() + ', ');
            }

        }


        const upd_res: any = await LDSM048.prototype.updateSplit(
            plant,
            mainBatch,
            mainBatchQty,
            mainBatchPcs,
            splitQty,
            splitPcs);

        var fin_res = {
            res_n: res_n,
            res_y: res_y
        }
        return res.status(200).json(fin_res);
    } catch (error) {
        return res.status(400).json(error);
    }
};



export const getSplitBatchDetails = async (req: Request, res: Response) => {
    try {
        let
            {
                plant,
                splitted_batch
            } = req.body;
        //   let mBatch=req.body.mBatch;
        const results: any = await LDSM048.prototype.getSplitBatchDetails(plant, splitted_batch);
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


export const getBatchDetails = async (req: Request, res: Response) => {
    try {
        // let plant = req.body.plant;
        let { plant, batch, status } = req.body;
        //   let mBatch=req.body.mBatch;
        const results: any = await LDSM048.prototype.getBatchDetails(plant, batch, status)
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


export const getMoMTargetMaterialNo = async (req: Request, res: Response) => {
    try {
        var {
            plant
        } = req.body;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        // return res.status(200).json(results.rows);



        //execute query
        const results: any = await LDSM048.prototype.getMoMTargetMaterialNo(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0] + "-" + x[1]);
        });

        //response
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json(error);
    }
};




export const saveMoMData = async (req: Request, res: Response) => {
    try {

        var {
            plant,
            selectedData,
            personalNo,
            targetMatNo
        } = req.body;

        var rowsAffected: any = 0;


        var checkPass = "Y";
        var batch_count = selectedData.length;
        var failedBatches = [];
        for (var i in selectedData) {
            //get data from request
            var {
                PLANT,
                BATCH_ID,
                MATNO
            } = selectedData[i];

            //execute query to update staus
            const results: any = await LDSM048.prototype.saveMoMData(
                PLANT,
                BATCH_ID,
                MATNO,
                personalNo,
                targetMatNo
            );
            if (results.outBinds.toString().startsWith("N-")) {
                // checkPass = "N";
                failedBatches.push(BATCH_ID);
            }


        }

        var res_data = {
            // checkPass : checkPass,
            failedBatches: failedBatches,
            // merge_id : merge_id
        }
        return res.status(200).json(res_data);


    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMoMWidthOdia = async (req: Request, res: Response) => {
    try {
        var {
            plant
        } = req.body;
        // const results: any = await LDSM048.prototype.getProcessDesc(Plant);
        // return res.status(200).json(results.rows);



        //execute query
        const results: any = await LDSM048.prototype.getMoMWidthOdia(plant);
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


export const getAuth = async (req: Request, res: Response) => {
    try {
        var {
            pno
        } = req.body;

        const results: any = await LDSM048.prototype.getAuth(pno);

        //response
        return res.status(200).json(results.rows[0][0]);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const GetSplitStatus = async (req: Request, res: Response) => {
    try {
        //data retreival
        var { plant } = req.body;
        //execute query
        const results: any = await LDSM048.prototype.GetSplitStatus(plant);
        //response
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
export const GetMergingStatus = async (req: Request, res: Response) => {
    try {
        //data retreival
        var { plant } = req.body;
        //execute query
        const results: any = await LDSM048.prototype.GetMergingStatus(plant);
        //response
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPieceActl = async (req: Request, res: Response) => {
    try {
        const results: any = await LDSM048.prototype.GetPieceActl(req);
        //response
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};
