import { Router } from "express";
import * as controller from '../controllers/AGSM012Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const AGSM012Route = Router()
AGSM012Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
AGSM012Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
AGSM012Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
AGSM012Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
AGSM012Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default AGSM012Route