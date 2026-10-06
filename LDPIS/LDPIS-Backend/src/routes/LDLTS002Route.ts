import { Router } from "express";
import * as controller from "../controllers/LDLTS002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS002Route = Router();

LDLTS002Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LDLTS002Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);
LDLTS002Route.route("/getDownMatl").post(
  authenticationMiddleware.bearer,
  controller.getDownMatl
);
LDLTS002Route.route("/getScrapMatl").post(
  authenticationMiddleware.bearer,
  controller.getScrapMatl
);

export default LDLTS002Route;
