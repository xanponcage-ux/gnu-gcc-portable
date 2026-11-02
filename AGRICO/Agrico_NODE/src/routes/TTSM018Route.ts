import { Router } from "express";
import * as controller from '../controllers/TTSM018Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM018Route = Router()

TTSM018Route.route('/getholddata').post(authenticationMiddleware.bearer,controller.getHoldData);
TTSM018Route.route('/getProcDesc').post(authenticationMiddleware.bearer,controller.GetProcDesc);

export default TTSM018Route