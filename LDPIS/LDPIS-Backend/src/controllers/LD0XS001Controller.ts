import { Request, Response } from "express";
import moment from "moment";
import LD0XS001 from "../models/LD0XS001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD0XS001.prototype.getRmList(status);
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeWeight = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const results: any = await LD0XS001.prototype.getPipeWeight(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LD0XS001.prototype.getPipeNoList(
      rmBatch,
      status
    );
    console.log(results);
    console.log(await ResponceData(results));
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeId = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0XS001.prototype.getPipeId(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0XS001.prototype.getPipeInfo(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getFillData = async (req: Request, res: Response) => {
  try {
    let status = req?.body?.status;
    let rmBatch = req?.body?.RM_BATCH;
    let pipeid = req?.body?.PIPE_NO;
    const results: any = await LD0XS001.prototype.getFillData(
      rmBatch,
      status,
      pipeid
    );
    const table: any = [];
    const header: any = [];
    const columns: any = [];
    const fullData: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    fullData.push(columns);
    fullData.push(table);
    return res.status(200).json(fullData);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const insertpipedetails = async (req: Request, res: Response) => {
  try {
    const { newReworkData } = req.body;

    const perPipeResults: Array<{
      pipeId: string;
      status: string;
      message: string;
    }> = [];

    for (let i = 0; i < newReworkData.length; i++) {
      const row = newReworkData[i];
      const pipeId = row?.pipeId ?? row?.PIPEID ?? "";

      try {
        // =========================
        // 1. TEMP INSERT
        // =========================
        const tempRes: any = await LD0XS001.prototype.tempInsert(row);

        const tempFlag = (
          tempRes?.outBinds?.ls_out_flag ??
          tempRes?.outBinds?.LS_OUT_FLAG ??
          ""
        ).toString();

        if (tempFlag.startsWith("N")) {
          return res.status(200).json({
            error: true,
            message: `Temp insert failed for ${pipeId}: ${tempFlag}`,
            perPipeResults,
          });
        }

        // =========================
        // 2. SCRAP INSERT
        // =========================
        const oldWt =
          row?.OLD_WEIGHT !== undefined ? Number(row.OLD_WEIGHT) : 0;

        const pipeWt =
          row?.PIPE_WEIGHT !== undefined ? Number(row.PIPE_WEIGHT) : 0;

        if (!isNaN(oldWt) && !isNaN(pipeWt) && oldWt > pipeWt) {
          const scrapData = {
            rmBatch: row?.rmBatch ?? row?.RM_BATCH ?? "",
            pipeId: pipeId,
            OLD_WEIGHT: oldWt,
            PIPE_WEIGHT: pipeWt,
            prodDate: moment().format("YYYY-MM-DD HH:mm"),
            startDt: moment().format("DD/MM/YYYY HH:mm"),
            endDt: moment().format("DD/MM/YYYY HH:mm"),
            remark: row?.remark ?? row?.REMARK ?? "",
            inspector: row?.inspector ?? row?.INSPECTOR ?? "",
            nextStation: row?.nextStation ?? row?.NEXT_STATION ?? "",
          };

          const scrapRes: any = await LD0XS001.prototype.insertScrapTempData(
            scrapData
          );

          const rowsAffected =
            scrapRes?.result?.rowsAffected ?? scrapRes?.rowsAffected ?? null;

          if (
            !scrapRes ||
            scrapRes.inserted === false ||
            (typeof rowsAffected === "number" && rowsAffected <= 0)
          ) {
            return res.status(200).json({
              error: true,
              message: `Scrap insert failed for ${pipeId}: ${
                scrapRes?.message ?? "No rows inserted"
              }`,
              perPipeResults,
            });
          }
        }

        // =========================
        // 3. MAIN PROCEDURE
        // =========================
        const procData = {
          pipeId: pipeId,
        };

        const procRes: any = await LD0XS001.prototype.insertPipeDetails(
          procData
        );

        const outFlag = (
          procRes?.outBinds?.LS_OUT_FLAG ??
          procRes?.outBinds?.ls_out_flag ??
          ""
        ).toString();

        if (outFlag.startsWith("N")) {
          return res.status(200).json({
            error: true,
            message: `Main procedure failed for ${pipeId}: ${outFlag}`,
            perPipeResults,
          });
        }

        perPipeResults.push({
          pipeId,
          status: "Y",
          message: outFlag || "Successfully processed",
        });
      } catch (err: any) {
        console.log(`Error for ${pipeId}:`, err);

        return res.status(200).json({
          error: true,
          message: `Error for ${pipeId}: ${err?.message ?? err}`,
          perPipeResults,
        });
      }
    }

    return res.status(200).json({
      error: false,
      perPipeResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
