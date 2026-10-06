import { Router } from "express";
import * as controller from '../controllers/LDSM015Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM015Route = Router()

LDSM015Route.route('/getODdata').post(authenticationMiddleware.bearer,controller.getODdata);
LDSM015Route.route('/getSectionData').post(authenticationMiddleware.bearer,controller.getSectionData);

export default LDSM015Route