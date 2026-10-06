import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import { Router } from "express";
import * as controller from "../controllers/LD50S002Controller";

const LD50S002Route = Router();
LD50S002Route.route("/LD50S002ConfirmApi").post(
  authenticationMiddleware.bearer,
  controller.LD50S002Api
);
LD50S002Route.route("/passBatch").post(
  authenticationMiddleware.bearer,
  controller.passBatch
);

export default LD50S002Route;
