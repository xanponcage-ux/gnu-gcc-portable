import { Router } from "express";
import * as controller from "../controllers/LDLTS001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS001Route = Router();

LDLTS001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LDLTS001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LDLTS001Route.route("/getHeatData").post(
  authenticationMiddleware.bearer,
  controller.getHeatData
);

LDLTS001Route.route("/getHeatList").post(
  authenticationMiddleware.bearer,
  controller.getHeatList
);

LDLTS001Route.route("/getTestResults").post(
  authenticationMiddleware.bearer,
  controller.getTestResults
);

LDLTS001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LDLTS001Route.route("/inserttestdetails").post(
  authenticationMiddleware.bearer,
  controller.inserttestdetails
);

export default LDLTS001Route;
