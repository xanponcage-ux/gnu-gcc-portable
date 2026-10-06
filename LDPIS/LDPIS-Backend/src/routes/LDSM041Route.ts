import { Router } from "express";
import * as controller from "../controllers/LDSM041Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSM041Route = Router();

// C1CES007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant);
LDSM041Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
LDSM041Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
LDSM041Route.route("/getSubDetails").post(authenticationMiddleware.bearer, controller.submitDetails);
LDSM041Route.route("/getSecRsn").post(authenticationMiddleware.bearer, controller.getSecRsnsDetails);
LDSM041Route.route("/getBtnHold").post(authenticationMiddleware.bearer, controller.getBtnHoldDetails);
LDSM041Route.route("/updateOprRemark").post(authenticationMiddleware.bearer, controller.updateOprRemark);


export default LDSM041Route;
