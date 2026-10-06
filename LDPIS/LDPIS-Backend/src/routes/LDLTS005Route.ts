import { Router } from "express";
import * as controller from "../controllers/LDLTS005Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDLTS005Route = Router();

LDLTS005Route.route("/getOrderid").post(
  authenticationMiddleware.bearer,
  controller.getOrderid
);
LDLTS005Route.route("/getItemNo").post(
  authenticationMiddleware.bearer,
  controller.getItemNo
);
LDLTS005Route.route("/getdateandshift").post(
  authenticationMiddleware.bearer,
  controller.getdateandshift
);

LDLTS005Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);

LDLTS005Route.route("/getOrdDetailLD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailLD
);
LDLTS005Route.route("/getOrdDetailID").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailID
);
LDLTS005Route.route("/getcountcheck").post(
  authenticationMiddleware.bearer,
  controller.getcountcheck
);
LDLTS005Route.route("/getOrdDetailMD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailMD
);
LDLTS005Route.route("/getOrdDetailSD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailSD
);
LDLTS005Route.route("/getOrdDetailGD").post(
  authenticationMiddleware.bearer,
  controller.getOrdDetailGD
);

LDLTS005Route.route("/getCommonTests").post(
  authenticationMiddleware.bearer,
  controller.getCommonTests
);

export default LDLTS005Route;
