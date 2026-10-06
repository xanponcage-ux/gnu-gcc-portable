import { Router } from "express";
import * as controller from "../controllers/LD01S005Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S005Route = Router();

LD01S005Route.route("/getList").post(
  authenticationMiddleware.bearer,
  controller.getList
);
LD01S005Route.route("/getMatNoList").post(
  authenticationMiddleware.bearer,
  controller.getMatNoList
);
LD01S005Route.route("/getFittingOrder").post(
  authenticationMiddleware.bearer,
  controller.getFittingOrder
);
export default LD01S005Route;
