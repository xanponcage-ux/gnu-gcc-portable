import { Router } from "express";

import * as controller from "../controllers/LD05S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD05S001Route = Router();
LD05S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD05S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD05S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);

LD05S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

LD05S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD05S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);

LD05S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);

export default LD05S001Route;
