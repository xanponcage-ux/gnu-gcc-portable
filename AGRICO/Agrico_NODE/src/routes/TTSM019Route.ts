import { Router } from "express";
import * as controller from "../controllers/TTSM019Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM019Route = Router();

TTSM019Route.route("/getMatData").post(
  authenticationMiddleware.bearer,
  controller.getMatData
);
TTSM019Route.route("/getProcDesc").post(
  authenticationMiddleware.bearer,
  controller.GetProcDesc
);
TTSM019Route.route("/getFGMAT").post(
  authenticationMiddleware.bearer,
  controller.getFGMAT
);
export default TTSM019Route;
