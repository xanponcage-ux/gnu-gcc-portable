import { Router } from "express";
import * as controller from "../controllers/LDSC006Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC006Route = Router();
LDSC006Route.route('/getLengthMasterData').post(authenticationMiddleware.bearer, controller.displanyLengthMaster);
LDSC006Route.route('/updateLengthData').post(authenticationMiddleware.bearer, controller.updateLengthData);
LDSC006Route.route('/deleteLengthData').post(authenticationMiddleware.bearer, controller.deleteLengthData);
LDSC006Route.route('/perviewUpdateData').post(authenticationMiddleware.bearer, controller.perviewUpdateData);




export default LDSC006Route;
