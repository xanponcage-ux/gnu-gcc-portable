import { Router } from "express";
import * as controller from '../controllers/LDSM022Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM022Route = Router()

LDSM022Route.route('/getFGData').post(authenticationMiddleware.bearer,controller.getFGData);
LDSM022Route.route('/updateFGData').post(authenticationMiddleware.bearer, controller.updateFGData);
LDSM022Route.route('/getUploadType').post(authenticationMiddleware.bearer, controller.getUploadType);


export default LDSM022Route

