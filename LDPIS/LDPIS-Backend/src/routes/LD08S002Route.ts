import { Router } from "express";
import * as controller from "../controllers/LD08S002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD08S002Route = Router();

LD08S002Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);

LD08S002Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

// LD08S002Route.route("/getPipeId").post(
//   authenticationMiddleware.bearer,
//   controller.getPipeId
// );

LD08S002Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);

// LD08S002Route.route("/getFillData").post(
//   authenticationMiddleware.bearer,
//   controller.getFillData
// );

// LD08S002Route.route("/getFillData").post(
//   authenticationMiddleware.bearer,
//   controller.getFillData
// );

LD08S002Route.route("/insertpipedetails").post(
  authenticationMiddleware.bearer,
  controller.insertpipedetails
);
LD08S002Route.route("/getMaterialNo").post(
  authenticationMiddleware.bearer,
  controller.getMaterialNo
);

export default LD08S002Route;
