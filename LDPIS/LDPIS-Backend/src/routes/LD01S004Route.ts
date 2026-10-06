import { Router } from "express";
import * as controller from "../controllers/LD01S004Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S004Route = Router();

LD01S004Route.route("/getGroupPlant").post(
  authenticationMiddleware.bearer,
  controller.getGroupPlant
);

LD01S004Route.route("/getSchedules").post(
  authenticationMiddleware.bearer,
  controller.getSchedules
);

LD01S004Route.route("/deleteCoil").post(
  authenticationMiddleware.bearer,
  controller.deleteCoil
);

LD01S004Route.route("/transferSchedule").post(
  authenticationMiddleware.bearer,
  controller.transferSchedule
);
LD01S004Route.route("/generateScheduleId").post(
  authenticationMiddleware.bearer,
  controller.generateScheduleId
);

LD01S004Route.route("/getCoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD01S004Route.route("/confirm").post(
  authenticationMiddleware.bearer,
  controller.confirm
);

export default LD01S004Route;
