import { Router } from "express";
import * as controller from "../controllers/LD12S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD12S001Route = Router();

LD12S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD12S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD12S001Route.route("/getFieldTestList").post(
  authenticationMiddleware.bearer,
  controller.getFieldTestList
);
LD12S001Route.route("/getLabTestList").post(
  authenticationMiddleware.bearer,
  controller.getLabTestList
);
LD12S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD12S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD12S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
LD12S001Route.route("/getCoatWt").post(
  authenticationMiddleware.bearer,
  controller.getCoatWt
);

export default LD12S001Route;
