import { Router } from "express";
import * as controller from "../controllers/LDLTS003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS003Route = Router();

LDLTS003Route.route("/getOrderid").post(
  authenticationMiddleware.bearer,
  controller.getOrderid
);
LDLTS003Route.route("/getItemNo").post(
  authenticationMiddleware.bearer,
  controller.getItemNo
);
LDLTS003Route.route("/getOrdDetailLD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailLD
);
LDLTS003Route.route("/getOrdDetailID").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailID
);
LDLTS003Route.route("/getOrdDetailMD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailMD
);
LDLTS003Route.route("/getOrdDetailSD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailSD
);
LDLTS003Route.route("/getOrdDetailGD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailGD
);
LDLTS003Route.route("/updateData").post(
  authenticationMiddleware.bearer,
  controller.updateData
);

LDLTS003Route.route("/DeleteProcesssheet").post(
  authenticationMiddleware.bearer,
  controller.DeleteProcesssheet
);

export default LDLTS003Route;
