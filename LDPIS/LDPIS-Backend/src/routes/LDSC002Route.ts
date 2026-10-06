import { Router } from "express";
import * as controller from "../controllers/LDSC002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC002Route = Router();
LDSC002Route.route("/getTdc").post(
  authenticationMiddleware.bearer,
  controller.getTDC
);
LDSC002Route.route("/getParam").post(
  authenticationMiddleware.bearer,
  controller.getParam
);

LDSC002Route.route("/getcastno").post(
  authenticationMiddleware.bearer,
  controller.getCastNo
);
LDSC002Route.route("/getbatchno").post(
  authenticationMiddleware.bearer,
  controller.getBatchNo
);
LDSC002Route.route("/getcustnobybatch").post(
  authenticationMiddleware.bearer,
  controller.getCustNoByBatch
);
LDSC002Route.route("/getip").post(
  authenticationMiddleware.bearer,
  controller.getIP
);
LDSC002Route.route("/getspecbyip").post(
  authenticationMiddleware.bearer,
  controller.getSpecByIp
);
LDSC002Route.route("/getBatchTest").post(
  authenticationMiddleware.bearer,
  controller.getBatchTest
);

LDSC002Route.route("/getinspplan").post(
  authenticationMiddleware.bearer,
  controller.getInspPlan
);

LDSC002Route.route("/getspeclimit").post(
  authenticationMiddleware.bearer,
  controller.getSpecLimit
);

LDSC002Route.route("/getcasttest").post(
  authenticationMiddleware.bearer,
  controller.getCastTest
);

LDSC002Route.route("/getcoiltest").post(
  authenticationMiddleware.bearer,
  controller.getCoilTest
);

export default LDSC002Route;
