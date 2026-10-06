import { Router } from "express";
import * as controller from "../controllers/LD02S002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD02S002Route = Router();

LD02S002Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD02S002Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD02S002Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);
LD02S002Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD02S002Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);
LD02S002Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD02S002Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
LD02S002Route.route("/getOrderDetails").post(
  authenticationMiddleware.bearer,
  controller.getOrderDetails
);

export default LD02S002Route;
