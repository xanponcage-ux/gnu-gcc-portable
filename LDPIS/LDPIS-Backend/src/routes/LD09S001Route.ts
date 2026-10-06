import { Router } from "express";
import * as controller from "../controllers/LD09S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD09S001Route = Router();
LD09S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD09S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD09S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);

LD09S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);

LD09S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD09S001Route.route("/getPono").post(
  authenticationMiddleware.bearer,
  controller.getPono
);

LD09S001Route.route("/getMatNo").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);

LD09S001Route.route('/getnxtproc').post(authenticationMiddleware.bearer, controller.getnxtproc);
LD09S001Route.route("/getOrderDetails").post(authenticationMiddleware.bearer,controller.getOrderDetails);


export default LD09S001Route;
