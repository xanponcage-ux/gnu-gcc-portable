import { Router } from "express";
import * as controller from "../controllers/TTS012Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSC012Route = Router();
TTSC012Route.route("/getPlant").post(authenticationMiddleware.bearer, controller.getPlant);
TTSC012Route.route("/getPlanData").post(authenticationMiddleware.bearer, controller.getPlanData);
TTSC012Route.route("/savePlanData").post(authenticationMiddleware.bearer, controller.savePlanData);

export default TTSC012Route;
