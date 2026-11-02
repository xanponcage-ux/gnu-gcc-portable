import { Router } from "express";
import * as controller from "../controllers/TTSC002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSC002Route = Router();
TTSC002Route.route('/getTdc').post(authenticationMiddleware.bearer, controller.getTDC);
TTSC002Route.route('/getParam').post(authenticationMiddleware.bearer, controller.getParam);

TTSC002Route.route('/getcastno').post(authenticationMiddleware.bearer, controller.getCastNo);
TTSC002Route.route('/getbatchno').post(authenticationMiddleware.bearer, controller.getBatchNo);
TTSC002Route.route('/getcustnobybatch').post(authenticationMiddleware.bearer, controller.getCustNoByBatch);
TTSC002Route.route('/getip').post(authenticationMiddleware.bearer, controller.getIP);
TTSC002Route.route('/getspecbyip').post(authenticationMiddleware.bearer, controller.getSpecByIp);

TTSC002Route.route("/getinspplan").post(
  authenticationMiddleware.bearer,
  controller.getInspPlan
);

TTSC002Route.route("/getspeclimit").post(
  authenticationMiddleware.bearer,
  controller.getSpecLimit
);

TTSC002Route.route("/getcasttest").post(
  authenticationMiddleware.bearer,
  controller.getCastTest
);

TTSC002Route.route("/getcoiltest").post(
  authenticationMiddleware.bearer,
  controller.getCoilTest
);

export default TTSC002Route;
