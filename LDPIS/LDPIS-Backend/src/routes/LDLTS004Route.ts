import { Router } from "express";
import * as controller from "../controllers/LDLTS004Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS004Route = Router();

LDLTS004Route.route("/getOrderid").post(
  authenticationMiddleware.bearer,
  controller.getOrderid
);
LDLTS004Route.route("/getItemNo").post(
  authenticationMiddleware.bearer,
  controller.getItemNo
);
LDLTS004Route.route("/getOrdDetailLD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailLD
);
LDLTS004Route.route("/getOrdDetailID").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailID
);
LDLTS004Route.route("/getOrdDetailMD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailMD
);
LDLTS004Route.route("/getOrdDetailSD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailSD
);
LDLTS004Route.route("/getOrdDetailGD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailGD
);

export default LDLTS004Route;
