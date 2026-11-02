// C. controller (controllers/TTSC015Controller.js)
import { Request, Response } from "express";
import moment from "moment";
import TTSC015 from "../models/TTSC015Model";
import { Post } from "../typed/typed";
import { uploadBase64Image, downloadFileFromSftp, getRemoteDir } from "../utils/sftp"; // Import downloadFileFromSftp and getRemoteDir
import multer from "multer";

export const GetSpecList = async (req: Request, res: Response) => {
  try {
    const results: any = await TTSC015.prototype.GetSpecList();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    if (!plant) {
      return res.status(400).json({ message: "Plant parameter is required." });
    }
    const results: any = await TTSC015.prototype.getStatus(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error in getStatus controller:", error);
    return res.status(400).json(error);
  }
};

export const getBatchID = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let status = req.body.status;
    let flag = req.body.flag;
    if (!plant || !status) {
      return res
        .status(400)
        .json({ message: "Plant and Status parameters are required." });
    }
    const results: any = await TTSC015.prototype.getBatchID(plant, status, flag);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error in getBatchID controller:", error);
    return res.status(400).json(error);
  }
};

export const getsize = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let Batch = req.body.Batch;
    if (!plant || !Batch) {
      return res
        .status(400)
        .json({ message: "Plant and Batch parameters are required." });
    }
    const results: any = await TTSC015.prototype.getsize(plant, Batch);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error in getsize controller:", error);
    return res.status(400).json(error);
  }
};

export const insertTubecount = async (req: Request, res: Response) => {
  try {
    let { dt } = req.body;
    let results = await TTSC015.prototype.insertTubecount(dt);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetGradeInfo = async (req: Request, res: Response) => {
  try {
    let spec = req.body.spec;
    let status = req.body.status;

    const results: any = await TTSC015.prototype.GetGradeInfo(spec, status);
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
    return res.status(400).json(error);
  }
};

export const GetreportTubecnt = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let status = req.body.status;
    let Batchid = req.body.Batchid;

    const results: any = await TTSC015.prototype.GetreportTubecnt(
      plant,
      status,
      Batchid
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
    return res.status(400).json(error);
  }
};

export const uploadAndInsertTubeCount = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      imageBase64,
      plant,
      batchId,
      status,
      qty,
      matnr,
      no_pcs_SQ,
      no_pcs_CR,
      confi,
      SIZE1,
      SHIFT
    } = req.body;

    if (!imageBase64 || !plant || !batchId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Step 1: Get existing count
    const countRes: any = await TTSC015.prototype.getBatchCount(
      plant,
      batchId
    );

    const existingCount = countRes.rows[0][0] || 0;

    // Step 2: Generate filename
    const fileName = `${plant}_${batchId}_${existingCount + 1}.jpg`;

    // ✅ Default fallback
    let filePath = "no URL PATH FOUND";

    // Step 3: Try uploading image (but don't block DB insert)
    try {
      const uploadResult = await uploadBase64Image(imageBase64, fileName);

      if (uploadResult && uploadResult.path) {
        filePath = uploadResult.path;
      }
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      // keep filePath as default
    }

    // Step 4: Insert DB record (ALWAYS runs)
    const payload = [
      {
        PLANT: plant,
        BATCHID: batchId,
        STATUS: status,
        QTY: qty,
        MATNR: matnr,
        LINK1: filePath,
        NO_PCS_CR: no_pcs_CR,
        NO_PCS_SQ: no_pcs_SQ,
        CONFI: confi,
        SIZE1: SIZE1,
        SHIFT: SHIFT,
      },
    ];

    await TTSC015.prototype.insertTubecount(payload);

    return res.status(200).json({
      message: "Data saved successfully (upload may or may not have worked)",
      fileName,
      filePath,
    });

  } catch (error) {
    console.error("Upload API error:", error);
    return res.status(500).json({
      message: "Error in upload API",
      error,
    });
  }
};

export const serveImageFromSftp = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.query; // Expect filePath as a query parameter

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ message: "File path is required." });
    }

    // Basic security check: ensure the path is within the allowed remote directory
    const remoteDir = getRemoteDir();
    if (!filePath.startsWith(remoteDir)) {
      return res.status(403).json({ message: "Access denied to this path." });
    }

    const imageBuffer = await downloadFileFromSftp(filePath);

    // Determine content type based on file extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream"; // Default
    if (ext === "jpg" || ext === "jpeg") {
      contentType = "image/jpeg";
    } else if (ext === "png") {
      contentType = "image/png";
    } else if (ext === "gif") {
      contentType = "image/gif";
    }

    res.setHeader("Content-Type", contentType);
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error serving image from SFTP:", error);
    if (error) {
      return res.status(404).json({ message: "Image not found." });
    }
    return res.status(500).json({ message: "Failed to serve image." });
  }
};

export const getTxtdownloadflag = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    if (!plant) {
      return res.status(400).json({ message: "Plant parameter is required." });
    }
    const results: any = await TTSC015.prototype.getTxtdownloadflag(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(400).json(error);
  }
};

export const getTxtdownloadsize = async (req: Request, res: Response) => {
  try {
    let flag = req.body.flag;
    if (!flag) {
      return res.status(400).json({ message: "parameter is required." });
    }
    const results: any = await TTSC015.prototype.getTxtdownloadsize(flag);
    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(400).json(error);
  }
};

export const tubecountapi = async (req: any, res: Response) => {
  try {
    // console.log('Controller',req.file)
    let { file } = req;
    let results = await TTSC015.prototype.tubecountapi(file);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};