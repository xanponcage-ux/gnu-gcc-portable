import { Router } from "express";
import * as controller from '../controllers/CommonController'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const CommonRoute = Router()

CommonRoute.route('/getGroupPlant').post(authenticationMiddleware.bearer, controller.getGroupPlant);


export default CommonRoute