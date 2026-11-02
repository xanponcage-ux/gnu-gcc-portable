import { Router } from "express";
import * as controller from '../controllers/TTSM012Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM012Route = Router()
TTSM012Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
TTSM012Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
TTSM012Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
TTSM012Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
TTSM012Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default TTSM012Route