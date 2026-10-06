import { Router } from "express";
import * as controller from "../controllers/LD13S002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD13S002Route = Router();

LD13S002Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD13S002Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LD13S002Route;
