import { Router } from "express";
import * as controller from '../controllers/LDSC001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'



const LDSC001Route = Router()
LDSC001Route.route('/getProdInqData').post(authenticationMiddleware.bearer,controller.getProdInqData);
export default LDSC001Route