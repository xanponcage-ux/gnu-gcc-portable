import { Router } from "express";
import * as controller from '../controllers/LDSM006Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM006Route = Router()


LDSM006Route.route('/getProdInqData').post(authenticationMiddleware.bearer, controller.getProdInqData);

export default LDSM006Route