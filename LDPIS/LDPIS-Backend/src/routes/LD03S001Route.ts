import { Router } from "express";

import * as controller from "../controllers/LD03S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD03S001Route = Router();
LD03S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD03S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);
LD03S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD03S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);
LD03S001Route.route("/getnxtproc").post(
  authenticationMiddleware.bearer,
  controller.getnxtproc
);
LD03S001Route.route("/getHoldRsn").post(
  authenticationMiddleware.bearer,
  controller.getHoldRsn
);
export default LD03S001Route;
