import { Router } from "express";
import * as controller from "../controllers/LD01S011Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD01S011Route = Router();

LD01S011Route.route("/batches").post(authenticationMiddleware.bearer, controller.getBatches);
LD01S011Route.route("/order").post(authenticationMiddleware.bearer, controller.getOrder);
LD01S011Route.route("/swap").post(authenticationMiddleware.bearer, controller.swap);

export default LD01S011Route;
