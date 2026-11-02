import { Request, Response } from "express";
import axios from "axios";
import TTSM047 from "../models/TTSM047Model";

export const getFinalcampaignData = async (req: Request, res: Response) => {
  try {
    const Plant = req.body.Plant;

    const results = await TTSM047.getFinalcampaignData(Plant);
    const rows = results.rows ?? [];
    const columnname = results.metaData ?? [];

    const colNames: string[] = columnname.map((m: any) => m.name);

    // Map raw rows into objects keyed by column names
    const data = rows.map((row: any[]) =>
      Object.fromEntries(row.map((val: any, idx: number) => [colNames[idx], val]))
    );

    const toDateOnly = (iso?: string | null): string | null => {
      if (!iso) return null;
      const d = new Date(iso);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    console.log('data->',data);
    
    const getNextDateISO = (days: number): string => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    const campaignMap: Record<string, any> = {};
    const tubeMillSet = new Set<string>();


    for (const d of data) {
      const tubeMill = String(d.TFC_TUBE_MILL || "").trim();
      if (!tubeMill) continue;

      tubeMillSet.add(tubeMill);

      const campaignNo = Number(d.TFC_CAMPAIGN);
      const campaignId = `campaign-${campaignNo}`;
      const date = getNextDateISO(campaignNo-1);; //toDateOnly(d.TFC_SCHED_ST_DATE);
      if (!date) continue;

      const campKey = `${campaignId}`; //__${date}

      if (!campaignMap[campKey]) {
        campaignMap[campKey] = {
          campaignId,
          campaignNo,
          date,
          columns: [
            "Campaign Plan",
            "Rolling (OD)",
            "RM Avl. (0788)",
            "Uncovered RM (0788)",
            "CRM FG+CRS",
            "RM required from CRM (MT)"
          ],
          mills: {}
        };
      }

      campaignMap[campKey].mills[tubeMill] = {
        "Campaign Plan": d.TFC_OD_TOTAL_QTY ?? 0,
        "Rolling (OD)": d.TFC_OD_GROUP ?? 0,
        "RM Avl. (0788)": d.TFC_RM_AVL ?? 0,
        "Uncovered RM (0788)": d.TFC_UNCOVERED_RM ?? 0,
        "CRM FG+CRS": d.TFC_FG_CRS ?? 0,
        "RM required from CRM (MT)": d.TFC_RM_REQ_CRM ?? 0
      };
    }

    const campaigns = Object.values(campaignMap).sort(
      (a: any, b: any) =>
        a.date.localeCompare(b.date) ||
        a.campaignNo - b.campaignNo
    );

    return res.status(200).json({ campaigns, tubeMills: Array.from(tubeMillSet).sort() });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal Server Error" });
  }
};

export const runModel = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://mmwddev.corp.tatasteel.com:8408/Tubes_camp_final");
    res.status(200).json({
      message: "API called successfully",
      data: response.data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error calling API",
    });
  }
};





