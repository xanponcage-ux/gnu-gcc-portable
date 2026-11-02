import { Router } from "express";
import * as controller from "../controllers/TTSM054Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSM054Route = Router();
TTSM054Route.route("/getDispatchData").post(authenticationMiddleware.bearer, controller.getDispatchData);
TTSM054Route.route("/getPlanningData").post(authenticationMiddleware.bearer, controller.getPlanningData);
TTSM054Route.route("/getFGMAT").post( authenticationMiddleware.bearer,controller.getFGMAT);
export default TTSM054Route;