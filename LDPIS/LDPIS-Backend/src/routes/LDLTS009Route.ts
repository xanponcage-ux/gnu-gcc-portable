import { Router } from "express";
import * as controller from "../controllers/LDLTS009Controller"; // New controller
import authenticationMiddleware from "../middlewares/authenticationMiddleware"; // Assuming this path

const LDLTS009Route = Router();

LDLTS009Route.route("/getOrderid").post(
  authenticationMiddleware.bearer,
  controller.getOrderid
);

LDLTS009Route.route("/getDetails").post(
  authenticationMiddleware.bearer,
  controller.getDetails
);

LDLTS009Route.route("/insertUpdateDetails").post(
  authenticationMiddleware.bearer,
  controller.insertUpdateDetails
);

export default LDLTS009Route;
