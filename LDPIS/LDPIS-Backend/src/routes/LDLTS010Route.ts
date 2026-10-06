import { Router } from "express";
import * as controller from "../controllers/LDLTS010Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS010Route = Router();

LDLTS010Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LDLTS010Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);
LDLTS010Route.route("/getDownMatl").post(
  authenticationMiddleware.bearer,
  controller.getDownMatl
);
LDLTS010Route.route("/getScrapMatl").post(
  authenticationMiddleware.bearer,
  controller.getScrapMatl
);

export default LDLTS010Route;
