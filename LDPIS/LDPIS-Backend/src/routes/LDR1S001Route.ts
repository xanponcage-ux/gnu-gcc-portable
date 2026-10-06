import { Router } from "express";

import * as controller from "../controllers/LDR1S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDR1S001Route = Router();
LDR1S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LDR1S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LDR1S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);
LDR1S001Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);
LDR1S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LDR1S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);
LDR1S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LDR1S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
export default LDR1S001Route;
