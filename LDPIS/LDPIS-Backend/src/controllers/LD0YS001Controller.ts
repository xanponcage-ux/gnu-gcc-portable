import { Request, Response } from "express";
import moment from "moment";
import LD0YS001 from "../models/LD0YS001Model";
import { Post } from "../typed/typed";
import { ResponceData } from "./LDSM016Controller";

export const getRmList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    const results: any = await LD0YS001.prototype.getRmList(status);
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
    const results: any = await LD0YS001.prototype.getPipeWeight(data);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeNoList = async (req: Request, res: Response) => {
  try {
    let status = req.body.status;
    let rmBatch = req.body.rmBatch;

    const results: any = await LD0YS001.prototype.getPipeNoList(
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
    const results: any = await LD0YS001.prototype.getPipeId(req.body);
    console.log(results);
    return res.status(200).json(await ResponceData(results));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getPipeInfo = async (req: Request, res: Response) => {
  try {
    const results: any = await LD0YS001.prototype.getPipeInfo(req.body);
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
    const results: any = await LD0YS001.prototype.getFillData(
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

    // Collect per-pipe results to return after insertPipeDetails
    const perPipeResults: Array<{
      pipeId: string;
      status: string;
      message: string;
    }> = [];

    // 1) For each row: tempInsert -> Abort immediately on any failure.
    for (let i = 0; i < newReworkData.length; i++) {
      const row = newReworkData[i];
      const pipeId = row?.pipeId ?? row?.PIPEID ?? "";

      // tempInsert
      let tempRes: any;
      try {
        tempRes = await LD0YS001.prototype.tempInsert(row);
      } catch (err: any) {
        console.log(`Temp insert exception for ${pipeId}:`, err);
        return res.status(200).json({
          error: true,
          message: `Temp insert exception for ${pipeId}: ${
            err?.message ?? err
          }`,
          perPipeResults,
        });
      }

      const tempFlag = (
        tempRes?.outBinds?.ls_out_flag ??
        tempRes?.outBinds?.LS_OUT_FLAG ??
        ""
      ).toString();
      if (tempFlag.startsWith("N-")) {
        const message = tempFlag.replace(/^N-/, "");
        return res.status(200).json({
          error: true,
          message: `Temp insert failed for ${pipeId}: ${message}`,
          perPipeResults,
        });
      }

      // Track that temp succeeded for this pipe - final status will come from insertPipeDetails
      perPipeResults.push({
        pipeId,
        status: "PENDING",
        message: "Temp insert succeeded",
      });
    }

    // 2) All per-row temp succeeded => call insertPipeDetails
    let ins_khapoli: any;
    try {
      ins_khapoli = await LD0YS001.prototype.insertPipeDetails(newReworkData);
    } catch (err: any) {
      console.log("insertPipeDetails exception:", err);
      return res.status(200).json({
        error: true,
        message: `insertPipeDetails exception: ${err?.message ?? err}`,
        perPipeResults,
      });
    }

    const outFlag = (
      ins_khapoli?.outBinds?.LS_OUT_FLAG ??
      ins_khapoli?.outBinds?.ls_out_flag ??
      ""
    ).toString();

    // Parse out per-pipe outcomes from outFlag. The format can vary; attempt to split by semicolon/newline and map messages to pipeIds when possible.
    const messages = outFlag
      .split(/;|\n/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
    const finalResults: Array<{
      pipeId: string;
      status: string;
      message: string;
    }> = [];

    if (messages.length === 0) {
      // No detailed messages -> return overall flag
      return res
        .status(200)
        .json({ error: false, overallFlag: outFlag, perPipeResults });
    }

    // Attempt to associate messages to pipeIds. If messages include pipe identifiers, extract them; otherwise return messages as-is.
    for (const msg of messages) {
      // Common message patterns: "Y-<pipeId>-..." or "N-<pipeId>-..." or "Y <pipeId> ...". Try regex to extract leading status and pipe id.
      const m = msg.match(/^(Y|N)[-:\s]?([^\s:-]+)[:\s-]?(.*)$/i);
      if (m) {
        const status = m[1].toUpperCase();
        const pid = m[2];
        const rest = (m[3] || "").trim();
        finalResults.push({ pipeId: pid, status, message: rest || msg });
      } else {
        // No pipe id parsed - push as anonymous
        finalResults.push({
          pipeId: "",
          status: msg.startsWith("Y")
            ? "Y"
            : msg.startsWith("N")
            ? "N"
            : "UNKNOWN",
          message: msg,
        });
      }
    }

    // If some pipes from perPipeResults did not appear in finalResults, include them with overallFlag status heuristic
    const knownPipeIds = new Set(
      finalResults.map((p) => p.pipeId).filter((p) => p)
    );
    for (const p of perPipeResults) {
      if (!knownPipeIds.has(p.pipeId)) {
        // derive status from overall flag
        const status = outFlag.startsWith("Y")
          ? "Y"
          : outFlag.startsWith("N")
          ? "N"
          : "UNKNOWN";
        finalResults.push({ pipeId: p.pipeId, status, message: outFlag });
      }
    }

    return res.status(200).json({
      error: false,
      overallFlag: outFlag,
      perPipeResults: finalResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
