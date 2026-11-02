import { Router } from "express";
import * as controller from '../controllers/TTSM021Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';
const TTSM021Route = Router()

TTSM021Route.route('/getRMData').post(authenticationMiddleware.bearer,controller.getRMData);
TTSM021Route.route('/updateRMData').post(authenticationMiddleware.bearer, controller.updateRMData);

export default TTSM021Route