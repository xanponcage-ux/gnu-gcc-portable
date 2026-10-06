import { Router } from "express";
import * as controller from "../controllers/LDLTS007Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
const LDLTS006Route = Router();

LDLTS006Route.route("/getTab1Data").post(
  authenticationMiddleware.bearer,
  controller.getTab1Data
);
LDLTS006Route.route("/fetchTagData").post(
  authenticationMiddleware.bearer,
  controller.fetchTagData
);
LDLTS006Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LDLTS006Route;
