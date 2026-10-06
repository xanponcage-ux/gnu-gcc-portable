import { Router } from "express";
import * as controller from "../controllers/LD0XS001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD0XS001Route = Router();

LD0XS001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);

LD0XS001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD0XS001Route.route("/getPipeWeight").post(
  authenticationMiddleware.bearer,
  controller.getPipeWeight
);

LD0XS001Route.route("/getPipeId").post(
  authenticationMiddleware.bearer,
  controller.getPipeId
);

LD0XS001Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);

LD0XS001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD0XS001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD0XS001Route.route("/insertpipedetails").post(
  authenticationMiddleware.bearer,
  controller.insertpipedetails
);

export default LD0XS001Route;
