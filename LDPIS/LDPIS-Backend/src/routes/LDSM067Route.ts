import { Router } from "express";
import * as controller from '../controllers/LDSM067Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM067Route = Router()

LDSM067Route.route('/getprocess').post(authenticationMiddleware.bearer , controller.getProcessDesc);
LDSM067Route.route('/getcoils').post(authenticationMiddleware.bearer , controller.getCoils);
LDSM067Route.route('/getholdrsn').post(
    authenticationMiddleware.bearer ,
    controller.getHoldRsn);
LDSM067Route.route('/saveunloaddata').post(authenticationMiddleware.bearer ,controller.saveUnloadData);

LDSM067Route.route('/getstatus').post(authenticationMiddleware.bearer ,controller.getStatus);
LDSM067Route.route('/getScrapMatNo').post(authenticationMiddleware.bearer , controller.getScrapMatNo);


export default LDSM067Route
