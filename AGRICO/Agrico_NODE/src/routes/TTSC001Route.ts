import { Router } from "express";
// import * as controller from '../controllers/TTSM006Controller'
import * as controller from '../controllers/TTSC001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

// const TTSM006Route = Router()
// TTSM006Route.route('/getProdInqData').post(authenticationMiddleware.bearer,controller.getProdInqData);
// export default TTSM006Route

const TTSC001Route = Router()
TTSC001Route.route('/getProdInqData').post(authenticationMiddleware.bearer,controller.getProdInqData);
export default TTSC001Route