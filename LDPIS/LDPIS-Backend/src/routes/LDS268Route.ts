import { Router } from "express";
import * as controller from '../controllers/LDS268Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDS268Route = Router()


// LDS268Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
LDS268Route.route('/update').post(authenticationMiddleware.bearer, controller.updateDetails);

export default LDS268Route
