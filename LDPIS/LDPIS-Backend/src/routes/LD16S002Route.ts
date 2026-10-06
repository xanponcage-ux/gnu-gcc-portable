import { Router } from "express";
import * as controller from "../controllers/LD16S002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD16S002Route = Router();

LD16S002Route.route("/getcoils").post(
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD16S002Route.route("/saveData").post(
  authenticationMiddleware.bearer,
  controller.saveData
);

export default LD16S002Route;
