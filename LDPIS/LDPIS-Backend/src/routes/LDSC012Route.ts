import { Router } from "express";
import * as controller from "../controllers/LDSC012Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC012Route = Router();
LDSC012Route.route("/getTabDisplayData").post(
  authenticationMiddleware.bearer,
  controller.getTabDisplayData
);
LDSC012Route.route("/InsertData").post(
  authenticationMiddleware.bearer,
  controller.InsertData
);
LDSC012Route.route("/DeleteData").post(
  authenticationMiddleware.bearer,
  controller.DeleteData
);
export default LDSC012Route;
