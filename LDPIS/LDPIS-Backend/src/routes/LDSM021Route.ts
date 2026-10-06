import { Router } from "express";
import * as controller from '../controllers/LDSM021Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';
const LDSM021Route = Router()

LDSM021Route.route('/getRMData').post(authenticationMiddleware.bearer,controller.getRMData);
LDSM021Route.route('/updateRMData').post(authenticationMiddleware.bearer, controller.updateRMData);

export default LDSM021Route