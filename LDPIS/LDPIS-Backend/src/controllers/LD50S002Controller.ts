import { Request, Response } from "express";
import LD50S002Modal from "../models/LD50S002Model";
import { ResponceData } from "../utils/response";

export const LD50S002Api = async (req: any, res: any) => {
  try {
    console.log(req.body);
    if (req.body.route === "LD50S002GetData") {
      let results = await ResponceData(
        await LD50S002Modal.prototype.LD50S002GetData(req.body)
      );
      return res.status(200).json(results);
    } else if (req.body.route === "LD50S002GetPlantID") {
      let results = await ResponceData(
        await LD50S002Modal.prototype.LD50S002GetPlantID(req.body)
      );
      return res.status(200).json(results);
    } else if (req.body.route === "LD50S002GetTestParaData") {
      // console.log(req.body);
      let batchId: any = req.body?.INPUTDATA?.Batchid;
      let castNo: any = req.body?.INPUTDATA?.CastNo;
      let PLANT: any = req.body?.INPUTDATA?.PLANT;
      //   let results1 = await ResponceData(await LD50S002GetTestBatchData(req.body));
      let results2 = await ResponceData(
        await LD50S002Modal.prototype.LD50S002GetTestCastData(req.body)
      );
      //   results1 = [...results1, ...results2];
      results2.map((row: any) => {
        row["BatchId"] = batchId;
        row["PARA_CHG_VAL"] = row?.PARA_VAL;
        row["CastNo"] = castNo;
      });
      let resultsDim = await ResponceData(
        await LD50S002Modal.prototype.LD50S002GetDimData(req.body)
      );
      // Check if resultsDim is empty, and if so, create a dummy row
      if (resultsDim.length === 0) {
        let dummyRow = {
          INP_CD_EPA: PLANT,
          INP_ID_BATCH: batchId,
          INP_SEQ_NO: 0,
          INP_CD_STATUS: "SA",
          INP_WIDTH_TOP: 0,
          INP_WIDTH_MIDDLE: 0,
          INP_WIDTH_BOTTOM: 0,
          INP_THICK_TOP: 0,
          INP_THICK_MIDDLE: 0,
          INP_THICK_BOTTOM: 0,
        };
        resultsDim.push(dummyRow);
      }
      let finalResult = {
        results2: results2,
        resultsDim: resultsDim,
      };
      return res.status(200).json(finalResult);
    } else if (req.body.route === "LD50S002UpdateParaData") {
      // let seqNo = await ResponceData(await generateSeqNo(req.body));
      let seqNo = 0;
      var rowsAffected: number = 0;
      console.log();
      for (var r in req.body?.INPUTDATA) {
        if (
          req.body?.INPUTDATA?.[r]?.TEST_PARA_VAL_COIL !== null &&
          req.body?.INPUTDATA?.[r]?.TEST_PARA_VAL_COIL !== ""
        ) {
          console.log("inside query");

          let results = await ResponceData(
            await LD50S002Modal.prototype.LD50S002UpdateCastData(
              req.body?.INPUTDATA?.[r],
              req?.body?.USER,
              seqNo
            )
          );
          console.log("42", results);
          rowsAffected += 1;
        }
      }
      return res.status(200).json(rowsAffected);
    } else if (req.body.route === "LD50S002UpdateDimData") {
      // let seqNo = await ResponceData(await generateSeqNo(req.body));
      let seqNo = 0;
      var rowsAffected: number = 0;
      console.log();
      for (var r in req.body?.INPUTDATA) {
        let results = await ResponceData(
          await LD50S002Modal.prototype.LD50S002UpdateDimData(
            req.body?.INPUTDATA?.[r],
            req?.body?.USER,
            seqNo
          )
        );
        console.log("42", results);
        rowsAffected += 1;
      }
      return res.status(200).json(rowsAffected);
    } else if (req.body.route === "LD50S002getTdcListData") {
      let results = await ResponceData(
        await LD50S002Modal.prototype.LD50S002getTdcList(req.body)
      );
      return res.status(200).json(results);
    } else if (req.body.route === "LD50S002getHoldrsnData") {
      let results = await ResponceData(
        await LD50S002Modal.prototype.LD50S002getHoldrsn(req.body)
      );
      return res.status(200).json(results);
    }
  } catch (error: any) {
    console.log("50", error);
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};

export const passBatch = async (req: Request, res: Response) => {
  try {
    var results: any = {};
    var batch: any = {};
    let result: any = await LD50S002Modal.prototype.LDS001passLDB004(req.body);
    let outBinds = result.outBinds.LS_OUT_FLAG;
    results = outBinds;
    console.log(result, results, outBinds);
    return res.status(200).json(await results);
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};
