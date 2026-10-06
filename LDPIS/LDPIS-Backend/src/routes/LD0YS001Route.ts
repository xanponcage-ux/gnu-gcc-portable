import { Router } from "express";
import * as controller from "../controllers/LD0YS001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD0YS001Route = Router();

LD0YS001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);

LD0YS001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD0YS001Route.route("/getPipeWeight").post(
  authenticationMiddleware.bearer,
  controller.getPipeWeight
);

LD0YS001Route.route("/getPipeId").post(
  authenticationMiddleware.bearer,
  controller.getPipeId
);

LD0YS001Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);

LD0YS001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD0YS001Route.route("/insertpipedetails").post(
  authenticationMiddleware.bearer,
  controller.insertpipedetails
);

export default LD0YS001Route;
