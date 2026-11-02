import { Router } from "express";
import * as controller from '../controllers/AGSM006Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const AGSM006Route = Router()

AGSM006Route.route('/getProcess').post(authenticationMiddleware.bearer, controller.GetProcess);
AGSM006Route.route('/getMatGrp').post(authenticationMiddleware.bearer, controller.getMatGrp);
AGSM006Route.route('/getProdInqData').post(authenticationMiddleware.bearer, controller.getProdInqData);

export default AGSM006Route