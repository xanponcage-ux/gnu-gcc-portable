import { Router } from "express";
import * as controller from "../controllers/LD01S008Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
const LD01S008Route = Router();

LD01S008Route.route("/getBatchDetails").post(
  authenticationMiddleware.bearer,
  controller.getBatchDetails
);
LD01S008Route.route("/updateStatusBtn").post(
  authenticationMiddleware.bearer,
  controller.updateStatusBtn
);
export default LD01S008Route;
