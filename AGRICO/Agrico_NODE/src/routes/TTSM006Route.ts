import { Router } from "express";
import * as controller from '../controllers/TTSM006Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM006Route = Router()

TTSM006Route.route('/getProcess').post(authenticationMiddleware.bearer, controller.GetProcess);
TTSM006Route.route('/getMatGrp').post(authenticationMiddleware.bearer, controller.getMatGrp);
TTSM006Route.route('/getProdInqData').post(authenticationMiddleware.bearer, controller.getProdInqData);

export default TTSM006Route