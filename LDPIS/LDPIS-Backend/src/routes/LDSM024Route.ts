import { Router } from "express";
import * as controller from '../controllers/LDSM024Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM024Route = Router()
LDSM024Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
// LDSM024Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
// LDSM024Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
// LDSM024Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
// LDSM024Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default LDSM024Route