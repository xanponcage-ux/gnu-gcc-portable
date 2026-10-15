import { Router } from "express";
import * as controller from "../controllers/LDLTS011Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS011Route = Router();

LDLTS011Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LDLTS011Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LDLTS011Route;
