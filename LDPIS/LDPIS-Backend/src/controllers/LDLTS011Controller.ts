import { Request, Response } from "express";
import LDLTS011 from "../models/LDLTS011Model";

export const getCoils = async (req: Request, res: Response) => {
  try {
    let data = req.body;

    const results: any = await LDLTS011.prototype.getCoils(data);

    const table: any = [];
    const header: any = [];
    const columns: any = [];

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

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveData = async (req: Request, res: Response) => {
  const selectedData = req.body?.selectedData;
  if (!Array.isArray(selectedData) || selectedData.length === 0 ||
      selectedData.some((row: any) => typeof row?.batchId !== "string" || !row.batchId.trim())) {
    return res.status(400).json("N-Select at least one valid batch.");
  }
  const batches = Array.from(new Set<string>(selectedData.map((row: any) => row.batchId.trim())));
  const saved: string[] = [];
  const failed: string[] = [];
  // The shared database helper auto-commits each update. Report partial success explicitly.
  for (const batchId of batches) {
    try {
      const result: any = await LDLTS011.prototype.saveData({ batchId });
      if (result.rowsAffected === 1) saved.push(batchId);
      else failed.push(`${batchId} (not eligible or not found)`);
    } catch (error) {
      console.error("LDLTS011 save failed", batchId, error);
      failed.push(`${batchId} (database error)`);
    }
  }
  return res.status(200).json(
    `${failed.length ? "N" : "Y"}-Moved to rework: ${saved.length}/${batches.length}.` +
    (saved.length ? ` Saved: ${saved.join(", ")}.` : "") +
    (failed.length ? ` Failed: ${failed.join(", ")}. Refresh before retrying.` : "")
  );
};
