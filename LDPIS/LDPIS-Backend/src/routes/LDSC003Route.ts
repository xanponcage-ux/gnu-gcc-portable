import { Router } from "express";
import * as controller from "../controllers/LDSC003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC003Route = Router();
LDSC003Route.route("/getbomData").post(authenticationMiddleware.bearer,
  controller.getBOMData
);


export default LDSC003Route;
