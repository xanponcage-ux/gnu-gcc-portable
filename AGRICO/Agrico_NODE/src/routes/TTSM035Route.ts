import { Router } from "express";
import * as controller from '../controllers/TTSM035Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM035Route = Router()

TTSM035Route.route('/getfgbatchrev').post(authenticationMiddleware.bearer,controller.getFGBatchRev);
TTSM035Route.route('/savefgbatchrev').post(authenticationMiddleware.bearer,controller.saveFGBatchRev);
TTSM035Route.route('/getTdcList').post(authenticationMiddleware.bearer,controller.getTdcList);
TTSM035Route.route('/getUserIdsEditableMass').post(authenticationMiddleware.bearer,controller.getUserIdsEditableMass);

export default TTSM035Route