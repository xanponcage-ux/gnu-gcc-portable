import { Router } from "express";
import * as controller from "../controllers/LD0RS002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD0RS002Route = Router();

LD0RS002Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);

LD0RS002Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD0RS002Route.route("/getPipeInfo").post(
  authenticationMiddleware.bearer,
  controller.getPipeInfo
);

LD0RS002Route.route("/insertpipedetails").post(
  authenticationMiddleware.bearer,
  controller.insertpipedetails
);
LD0RS002Route.route("/getMaterialNo").post(
  authenticationMiddleware.bearer,
  controller.getMaterialNo
);

LD0RS002Route.route("/getPipeWeight").post(
  authenticationMiddleware.bearer,
  controller.getPipeWeight
);
LD0RS002Route.route("/getGeometry").post(
  authenticationMiddleware.bearer,
  controller.getGeometry
);

//Update Mat Tab APIs
LD0RS002Route.route("/getMatTabData").post(
  authenticationMiddleware.bearer,
  controller.getMatTabData
);
LD0RS002Route.route("/validateData").post(
  authenticationMiddleware.bearer,
  controller.validateData
);
LD0RS002Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);
LD0RS002Route.route("/getUserAccess").post(
  authenticationMiddleware.bearer,
  controller.getUserAccess
);
LD0RS002Route.route("/getDropdown").post(
  authenticationMiddleware.bearer,
  controller.getDropdown
);

export default LD0RS002Route;
