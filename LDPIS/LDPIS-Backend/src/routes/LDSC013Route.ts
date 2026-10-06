import { Router } from "express";
import * as controller from "../controllers/LDSC013Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC013Route = Router();

LDSC013Route.route("/speclist").post(
  authenticationMiddleware.bearer,
  controller.getSpecList
);

LDSC013Route.route("/parameters").post(
  authenticationMiddleware.bearer,
  controller.getParameters
);

LDSC013Route.route("/writeAccess").post(
  authenticationMiddleware.bearer,
  controller.writeAccess
);

LDSC013Route.route("/getData").post(
  authenticationMiddleware.bearer,
  controller.getData
);

LDSC013Route.route("/upsert").post(
  authenticationMiddleware.bearer,
  controller.upsert
);

LDSC013Route.route("/deleteRow").post(
  authenticationMiddleware.bearer,
  controller.deleteRow
);

export default LDSC013Route;
