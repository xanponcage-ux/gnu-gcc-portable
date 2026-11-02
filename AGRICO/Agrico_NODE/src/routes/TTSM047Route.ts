import { Router } from "express";
import * as controller from "../controllers/TTSM047Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM047Route = Router();
TTSM047Route.route("/getFinalcampaignData").post(authenticationMiddleware.bearer, controller.getFinalcampaignData);
TTSM047Route.route("/runModel").get(authenticationMiddleware.bearer, controller.runModel);

export default TTSM047Route;
