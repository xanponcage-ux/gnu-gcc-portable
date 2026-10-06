import { Router } from "express";
import * as controller from "../controllers/LD16S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD16S001Route = Router();

LD16S001Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD16S001Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);
LD16S001Route.route("/getFieldTestList").post(
  authenticationMiddleware.bearer,
  controller.getFieldTestList
);
LD16S001Route.route("/getLabTestList").post(
  authenticationMiddleware.bearer,
  controller.getLabTestList
);
LD16S001Route.route("/insertTempData").post(
  authenticationMiddleware.bearer,
  controller.insertTempData
);
LD16S001Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);
LD16S001Route.route("/getTataDate").post(
  authenticationMiddleware.bearer,
  controller.getTataDate
);
LD16S001Route.route("/getCoatWt").post(
  authenticationMiddleware.bearer,
  controller.getCoatWt
);

export default LD16S001Route;
