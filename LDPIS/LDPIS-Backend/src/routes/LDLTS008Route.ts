import { Router } from "express";
import * as controller from "../controllers/LDLTS008Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS008Route = Router();

// Exact copy endpoints (LDLTS003 -> LDLTS008)
LDLTS008Route.route("/getOrderid").post(
  authenticationMiddleware.bearer,
  controller.getOrderid
);

LDLTS008Route.route("/getItemNo").post(
  authenticationMiddleware.bearer,
  controller.getItemNo
);

LDLTS008Route.route("/getProcessSheetData").post(
  authenticationMiddleware.bearer,
  controller.getProcessSheetData
);

// Exact copy of DeleteProcesssheet
LDLTS008Route.route("/DeleteProcesssheet").post(
  authenticationMiddleware.bearer,
  controller.DeleteProcesssheet
);

export default LDLTS008Route;
