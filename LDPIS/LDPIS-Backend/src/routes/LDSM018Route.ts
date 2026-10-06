import { Router } from "express";
import * as controller from '../controllers/LDSM018Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM018Route = Router()

LDSM018Route.route('/getholddata').post(authenticationMiddleware.bearer,controller.getHoldData);
LDSM018Route.route('/getProcDesc').post(authenticationMiddleware.bearer,controller.GetProcDesc);

export default LDSM018Route