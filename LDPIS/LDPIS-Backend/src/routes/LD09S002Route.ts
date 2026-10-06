import { Router } from "express";
import * as controller from "../controllers/LD09S002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD09S002Route = Router();

LD09S002Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD09S002Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LD09S002Route;
