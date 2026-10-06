import { Router } from "express";
import * as controller from "../controllers/LD0RS001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD0RS001Route = Router();

LD0RS001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);

LD0RS001Route.route("/getMatList").post(
  authenticationMiddleware.bearer,
  controller.getMatList
);

LD0RS001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

// LD0RS001Route.route("/getPipeId").post(
//   authenticationMiddleware.bearer,
//   controller.getPipeId
// );

LD0RS001Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);

// LD0RS001Route.route("/getFillData").post(
//   authenticationMiddleware.bearer,
//   controller.getFillData
// );

// LD0RS001Route.route("/getFillData").post(
//   authenticationMiddleware.bearer,
//   controller.getFillData
// );

LD0RS001Route.route("/insertpipedetails").post(
  authenticationMiddleware.bearer,
  controller.insertpipedetails
);
LD0RS001Route.route("/getMaterialNo").post(
  authenticationMiddleware.bearer,
  controller.getMaterialNo
);
LD0RS001Route.route("/getPipeWeight").post(
  authenticationMiddleware.bearer,
  controller.getPipeWeight
);
LD0RS001Route.route("/getGeometry").post(
  authenticationMiddleware.bearer,
  controller.getGeometry
);

export default LD0RS001Route;
