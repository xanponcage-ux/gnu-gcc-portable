import { Router } from "express";
import * as controller from "../controllers/LDCR004Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDCR004Route = Router();

LDCR004Route.route("/GetreportTyp").post(
  authenticationMiddleware.bearer,
  controller.GetreportTyp
);

LDCR004Route.route("/getinternaldata").post(
  authenticationMiddleware.bearer,
  controller.getinternaldata
);
LDCR004Route.route("/getpanelTest").post(
  authenticationMiddleware.bearer,
  controller.getpanelTest
);
LDCR004Route.route("/getporositytest").post(
  authenticationMiddleware.bearer,
  controller.getporositytest
);
LDCR004Route.route("/getsgtest").post(
  authenticationMiddleware.bearer,
  controller.getsgtest
);
LDCR004Route.route("/getmixpaint").post(
  authenticationMiddleware.bearer,
  controller.getmixpaint
);
LDCR004Route.route("/getpulltest").post(
  authenticationMiddleware.bearer,
  controller.getpulltest
);
LDCR004Route.route("/gettaber").post(
  authenticationMiddleware.bearer,
  controller.gettaber 
);
export default LDCR004Route;
