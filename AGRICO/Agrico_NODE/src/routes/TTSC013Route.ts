import { Router } from "express";
import * as controller from "../controllers/TTS013Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSC013Route = Router();
// TTSC013Route.route("/getPlant").post(authenticationMiddleware.bearer, controller.getPlant);
TTSC013Route.route("/getFgProdData").post(authenticationMiddleware.bearer, controller.getFgProdData);
TTSC013Route.route("/updateRemarks").post(authenticationMiddleware.bearer, controller.updateRemarks);

export default TTSC013Route;