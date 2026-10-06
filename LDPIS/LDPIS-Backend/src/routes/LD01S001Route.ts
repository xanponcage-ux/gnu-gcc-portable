import { Router } from "express";
import * as controller from "../controllers/LD01S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S001Route = Router();

LD01S001Route.route("/getorderwiseProdData").post(
  authenticationMiddleware.bearer,
  controller.getorderwiseProdData
);
LD01S001Route.route("/getScrapProductionTable").post(
  authenticationMiddleware.bearer,
  controller.getScrapProductionTable
);
LD01S001Route.route("/getSchedules").post(
  authenticationMiddleware.bearer,
  controller.getSchedules
);
LD01S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
LD01S001Route.route("/getPipeId").post(
  authenticationMiddleware.bearer,
  controller.getPipeId
);
LD01S001Route.route("/getPipeWeight").post(
  authenticationMiddleware.bearer,
  controller.getPipeWeight
);
LD01S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD01S001Route.route("/insertCoilDetails").post(
  authenticationMiddleware.bearer,
  controller.insertCoilDetails
);
LD01S001Route.route("/validateData").post(
  authenticationMiddleware.bearer,
  controller.validateData
);

export default LD01S001Route;
