import { Router } from "express";
import * as controller from "../controllers/LD08S003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD08S003Route = Router();
LD08S003Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD08S003Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD08S003Route.route("/execQueryScreenAccess").post(authenticationMiddleware.bearer, controller.execQueryScreenAccess);

LD08S003Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);

LD08S003Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

LD08S003Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD08S003Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);

LD08S003Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);

LD08S003Route.route("/getnxtproc").post(
  authenticationMiddleware.bearer,
  controller.getnxtproc
);

LD08S003Route.route("/validateDataMill80").post(
  authenticationMiddleware.bearer,
  controller.validateDataMill80
);

export default LD08S003Route;
