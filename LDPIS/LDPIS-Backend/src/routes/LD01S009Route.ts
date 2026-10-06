import { Router } from "express";
import * as controller from "../controllers/LD01S009Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S009Route = Router();

LD01S009Route.route("/getList").post(
  authenticationMiddleware.bearer,
  controller.getList
);
LD01S009Route.route("/getMatNoList").post(
  authenticationMiddleware.bearer,
  controller.getMatNoList
);
LD01S009Route.route("/getWipOrders").post(
  authenticationMiddleware.bearer,
  controller.getWipOrders
);
export default LD01S009Route;
