import { Router } from "express";
import * as controller from "../controllers/LD08S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD08S001Route = Router();
LD08S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD08S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD08S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);

LD08S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

LD08S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD08S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);

LD08S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);

LD08S001Route.route("/getnxtproc").post(
  authenticationMiddleware.bearer,
  controller.getnxtproc
);

LD08S001Route.route("/validateDataMill80").post(
  authenticationMiddleware.bearer,
  controller.validateDataMill80
);

export default LD08S001Route;
