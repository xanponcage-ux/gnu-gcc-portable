import { Router } from "express";
import * as controller from "../controllers/LD01S007Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S007Route = Router();

LD01S007Route.route("/getList").post(
  authenticationMiddleware.bearer,
  controller.getList
);
LD01S007Route.route("/getMatNoList").post(
  authenticationMiddleware.bearer,
  controller.getMatNoList
);
LD01S007Route.route("/getWipOrders").post(
  authenticationMiddleware.bearer,
  controller.getWipOrders
);
export default LD01S007Route;
