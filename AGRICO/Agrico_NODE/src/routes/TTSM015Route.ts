import { Router } from "express";
import * as controller from '../controllers/TTSM015Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM015Route = Router()

TTSM015Route.route('/getODdata').post(authenticationMiddleware.bearer,controller.getODdata);
TTSM015Route.route('/getSectionData').post(authenticationMiddleware.bearer,controller.getSectionData);

export default TTSM015Route