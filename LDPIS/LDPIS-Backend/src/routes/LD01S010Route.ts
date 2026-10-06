import { Router } from "express";
import * as controller from "../controllers/LD01S010Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S010Route = Router();

LD01S010Route.route("/getList").post(
  authenticationMiddleware.bearer,
  controller.getList
);
LD01S010Route.route("/getRM").post(
  authenticationMiddleware.bearer,
  controller.getRM
);
LD01S010Route.route("/populateForecast").post(
authenticationMiddleware.bearer,
controller.populateForecast
);
export default LD01S010Route;
