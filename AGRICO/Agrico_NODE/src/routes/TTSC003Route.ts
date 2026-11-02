import { Router } from "express";
import * as controller from "../controllers/TTSC003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSC003Route = Router();
TTSC003Route.route("/getbomData").post(authenticationMiddleware.bearer,
  controller.getBOMData
);
TTSC003Route.route("/getRouteMasterData").post(authenticationMiddleware.bearer,
  controller.getRouteMasterData
);

export default TTSC003Route;
