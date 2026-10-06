import { ResponceData } from "../utils/response";
import {
  LD50S001GetData,
  LD50S001GetTestBatchData,
  LD50S001GetTestCastData,
  LD50S001UpdateCastData,
  LD50S001UpdateCoilData,
  LD50S001GetPlantID,
} from "../repository/LD50S001Query";

export const LD50S001Modal = async (req: any, res: any) => {
  try {
    if (req.body.route === "LD50S001GetData") {
      let results = await ResponceData(await LD50S001GetData(req.body));
      return res.status(200).json(results);
    } else if (req.body.route === "LD50S001GetPlantID") {
      let results = await ResponceData(await LD50S001GetPlantID(req.body));
      return res.status(200).json(results);
    } else if (req.body.route === "LD50S001GetTestParaData") {
      console.log(req.body);
      let batchId: any = req.body?.INPUTDATA?.Batchid;
      let castNo: any = req.body?.INPUTDATA?.CastNo;
      let results1 = await ResponceData(
        await LD50S001GetTestBatchData(req.body)
      );
      let results2 = await ResponceData(
        await LD50S001GetTestCastData(req.body)
      );
      results1 = [...results1, ...results2];
      results1.map((row: any) => {
        row["BatchId"] = batchId;
        row["PARA_CHG_VAL"] = row?.PARA_VAL;
        row["CastNo"] = castNo;
      });
      console.log(results1);
      return res.status(200).json(results1);
    } else if (req.body.route === "LD50S001UpdateParaData") {
      console.log(req.body);
      if (req.body?.INPUTDATA?.PROP === "M") {
        let results = await ResponceData(
          await LD50S001UpdateCoilData(req.body)
        );
        console.log(results);
        return res.status(200).json(results);
      } else if (req.body?.INPUTDATA?.PROP === "C") {
        let results = await ResponceData(
          await LD50S001UpdateCastData(req.body)
        );
        console.log(results);
        return res.status(200).json(results);
      }
    }
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ error: error?.message ? error?.message?.toString() : "Error" });
  }
};

export default LD50S001Modal;
