import { Router } from "express";
import * as controller from '../controllers/TTSM022Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM022Route = Router()

TTSM022Route.route('/getFGData').post(authenticationMiddleware.bearer,controller.getFGData);
TTSM022Route.route('/updateFGData').post(authenticationMiddleware.bearer, controller.updateFGData);
TTSM022Route.route('/getUploadType').post(authenticationMiddleware.bearer, controller.getUploadType);


export default TTSM022Route

