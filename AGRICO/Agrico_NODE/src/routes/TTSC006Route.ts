import { Router } from "express";
import * as controller from "../controllers/TTSC006Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const TTSC006Route = Router();
TTSC006Route.route('/getLengthMasterData').post(authenticationMiddleware.bearer, controller.displanyLengthMaster);
TTSC006Route.route('/updateLengthData').post(authenticationMiddleware.bearer, controller.updateLengthData);
TTSC006Route.route('/deleteLengthData').post(authenticationMiddleware.bearer, controller.deleteLengthData);
TTSC006Route.route('/perviewUpdateData').post(authenticationMiddleware.bearer, controller.perviewUpdateData);




export default TTSC006Route;
