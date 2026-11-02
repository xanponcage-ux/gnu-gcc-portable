import { Router } from "express";
import * as controller from "../controllers/TTSM050Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM050Route = Router();
TTSM050Route.route("/getCampaignData").post(authenticationMiddleware.bearer, controller.getCampaignData);
TTSM050Route.route("/getCampaignDataByPOD").post(authenticationMiddleware.bearer, controller.getCampaignDataByPOD);
TTSM050Route.route("/getCampaignDataByOD").post(authenticationMiddleware.bearer, controller.getCampaignDataByOD);
TTSM050Route.route("/runModel").get(authenticationMiddleware.bearer, controller.runModel);

export default TTSM050Route;
