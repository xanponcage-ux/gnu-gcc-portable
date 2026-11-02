import { Router } from "express";
import * as controller from "../controllers/TTSM013Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM013Route = Router();

TTSM013Route.route("/getDefectData").post(
  authenticationMiddleware.bearer,
  controller.getDefectData
);
TTSM013Route.route("/getProcDesc").post(
  authenticationMiddleware.bearer,
  controller.GetProcDesc
);

export default TTSM013Route;
