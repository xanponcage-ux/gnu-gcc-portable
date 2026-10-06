import { Request, Response } from "express";
import moment from "moment";
import LD01S005 from "../models/LD01S005Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getList = async (req: Request, res: Response) => {
  try {
    let props = req.body;
    let errorString = "";
    if (
      props?.param.includes("Update") &&
      (props?.type === "DELINK" || props?.type === "LINK")
    ) {
      for (var i = 0; i < props.delinkCoils.length; i++) {
        props.selectedBatch = props.delinkCoils[i];
        var results: any = await LD01S005.prototype.getList(props);
        var flag = results.outBinds.LS_OUT_FLAG;
        // console.log('11123results',results);
        // console.log('11123flag',flag);
        if (flag.toString().startsWith("N-")) {
          errorString +=
            " errCoil: " +
            props.selectedBatch +
            " -- " +
            flag.toString().replace("N-", "");
          return res.status(200).json(errorString);
        }
      }
      return res.status(200).json(flag);
    } else {
      const results: any = await LD01S005.prototype.getList(props);
      if (props?.param.includes("Update")) {
        var flag = results.outBinds.LS_OUT_FLAG;
        // console.log('123flag',flag);
        return res.status(200).json(flag);
      } else {
        // console.log('123results',results);
        return res.status(200).json(await ResponceData(results));
      }
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getMatNoList = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S005.prototype.getMatNoList(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFittingOrder = async (req: Request, res: Response) => {
  try {
    const results: any = await ResponceData(
      await LD01S005.prototype.getFittingOrder(req.body)
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};
