import { Router } from "express";
import * as controller from "../controllers/TTSM041Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM041Route = Router();

// C1CES007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant);
TTSM041Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
TTSM041Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
TTSM041Route.route("/getSubDetails").post(authenticationMiddleware.bearer, controller.submitDetails);
TTSM041Route.route("/getSecRsn").post(authenticationMiddleware.bearer, controller.getSecRsnsDetails);
TTSM041Route.route("/getBtnHold").post(authenticationMiddleware.bearer, controller.getBtnHoldDetails);
TTSM041Route.route("/updateOprRemark").post(authenticationMiddleware.bearer, controller.updateOprRemark);


export default TTSM041Route;
