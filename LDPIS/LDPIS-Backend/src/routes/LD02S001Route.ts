import { Router } from "express";
import * as controller from "../controllers/LD02S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD02S001Route = Router();

LD02S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD02S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD02S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);
LD02S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD02S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);
LD02S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD02S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
LD02S001Route.route("/getOrderDetails").post(
  authenticationMiddleware.bearer,
  controller.getOrderDetails
);
LD02S001Route.route("/getHoldRsn").post(
  authenticationMiddleware.bearer,
  controller.getHoldRsn
);

export default LD02S001Route;
