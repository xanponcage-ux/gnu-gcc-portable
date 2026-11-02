import { Router } from "express";
import * as controller from "../controllers/TTSM049Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM049Route = Router();
TTSM049Route.route("/getCampaignDashBoardData").post(authenticationMiddleware.bearer, controller.getCampaignDashBoardData);

export default TTSM049Route;
