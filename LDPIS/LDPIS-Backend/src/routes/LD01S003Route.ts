import { Router } from "express";
import * as controller from "../controllers/LD01S003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S003Route = Router();

LD01S003Route.route("/getRmList").post(
  authenticationMiddleware.bearer,
  controller.getRmList
);
LD01S003Route.route("/getPipeNoList").post(
  authenticationMiddleware.bearer,
  controller.getPipeNoList
);

LD01S003Route.route("/getFillData").post(
  authenticationMiddleware.bearer,
  controller.getFillData
);

LD01S003Route.route("/confirm").post(
  authenticationMiddleware.bearer,
  controller.confirm
);

export default LD01S003Route;
