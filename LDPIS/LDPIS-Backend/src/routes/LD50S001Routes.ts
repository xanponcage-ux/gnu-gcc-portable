import { Router } from "express";
import { LD50S001SaveLDS003 } from "../controllers/LD50S001Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD50S001Routes = Router();

LD50S001Routes.route("/LD50S001SaveLDS003").post(
  authenticationMiddleware.bearer,
  LD50S001SaveLDS003
);

export default LD50S001Routes;
