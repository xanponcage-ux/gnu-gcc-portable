import { Router } from "express";
import * as controller from '../controllers/LDSM013Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM013Route = Router()

LDSM013Route.route('/getdefectdata').post(authenticationMiddleware.bearer,controller.getDefectData);
LDSM013Route.route('/getProcDesc').post(authenticationMiddleware.bearer,controller.GetProcDesc);

export default LDSM013Route