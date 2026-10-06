import { Router } from "express";
import * as controller from "../controllers/LD50S005Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD50S005Route = Router();

LD50S005Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD50S005Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LD50S005Route;
