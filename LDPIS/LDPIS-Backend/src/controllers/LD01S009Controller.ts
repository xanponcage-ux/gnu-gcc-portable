import { Request, Response } from "express";
import moment from "moment";
import LD01S009 from "../models/LD01S009Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getList = async (req: Request, res: Response) => {
  try {
    let props = req.body;
    let errorString = "";
    // console.log(props);

    // Changed on 05.01.26, To allow multi select for WIP linking
    if (props?.param.includes("Update")) {
      // && props?.type === "DELINK") {
      for (var i = 0; i < props?.newDataDelink.length; i++) {
        //props.selectedBatch = props.delinkCoils[i];
        props.DelinkRow = props?.newDataDelink[i];
        var results: any = await LD01S009.prototype.getList(props);
        var flag = results.outBinds.LS_OUT_FLAG;
        // console.log(results);
        errorString = flag;
        if (flag.toString().startsWith("N-")) {
          errorString +=
            " errCoil: " +
            props.DelinkRow.BATCH1 +
            " -- " +
            flag.toString().replace("N-", "");
        }
      }
      return res.status(200).json(errorString);
    } else {
      const results: any = await LD01S009.prototype.getList(props);
      return res.status(200).json(await ResponceData(results));
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const getMatNoList = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S009.prototype.getMatNoList(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getWipOrders = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S009.prototype.getWipOrders(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
