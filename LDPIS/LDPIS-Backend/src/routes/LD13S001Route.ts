import { Router } from "express";
import * as controller from "../controllers/LD13S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD13S001Route = Router();

LD13S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD13S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD13S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD13S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD13S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

export default LD13S001Route;
