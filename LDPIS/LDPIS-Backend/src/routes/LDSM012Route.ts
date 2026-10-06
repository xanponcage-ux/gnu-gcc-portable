import { Router } from "express";
import * as controller from '../controllers/LDSM012Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM012Route = Router()
LDSM012Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
LDSM012Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
LDSM012Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
LDSM012Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
LDSM012Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default LDSM012Route