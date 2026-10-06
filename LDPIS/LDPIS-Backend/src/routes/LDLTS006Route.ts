import { Router } from "express";
import * as controller from "../controllers/LDLTS006Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS006Route = Router();

LDLTS006Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LDLTS006Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);
LDLTS006Route.route("/getDownMatl").post(
  authenticationMiddleware.bearer,
  controller.getDownMatl
);
LDLTS006Route.route("/getScrapMatl").post(
  authenticationMiddleware.bearer,
  controller.getScrapMatl
);

export default LDLTS006Route;
