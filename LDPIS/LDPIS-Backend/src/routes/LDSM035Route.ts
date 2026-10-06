import { Router } from "express";
import * as controller from '../controllers/LDSM035Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM035Route = Router()

LDSM035Route.route('/getfgbatchrev').post(authenticationMiddleware.bearer,controller.getFGBatchRev);
LDSM035Route.route('/savefgbatchrev').post(authenticationMiddleware.bearer,controller.saveFGBatchRev);
LDSM035Route.route('/getTdcList').post(authenticationMiddleware.bearer,controller.getTdcList);
LDSM035Route.route('/getUserIdsEditableMass').post(authenticationMiddleware.bearer,controller.getUserIdsEditableMass);

export default LDSM035Route