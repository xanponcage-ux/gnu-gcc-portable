import { Router } from "express";
import * as controller from "../controllers/LD14S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD14S001Route = Router();

LD14S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD14S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD14S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD14S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD14S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

export default LD14S001Route;
