import {
  LD50S001Api,
  LD50S001SaveLDS003,
  getRawMaterialData

} from "../controllers/LD50S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import { Router } from "express";

const LD50S001Route = Router();
LD50S001Route.route("/LD50S001ConfirmApi").post(
  authenticationMiddleware.bearer,
  LD50S001Api
);

LD50S001Route.route("/LD50S001SaveLDS003").post(
  authenticationMiddleware.bearer,
  LD50S001SaveLDS003
);

LD50S001Route.route("/getRawMaterialData").post(
  authenticationMiddleware.bearer,
  getRawMaterialData
);



export default LD50S001Route;
