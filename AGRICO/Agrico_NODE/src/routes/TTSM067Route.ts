import { Router } from "express";
import * as controller from '../controllers/TTSM067Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM067Route = Router()

TTSM067Route.route('/getprocess').post(authenticationMiddleware.bearer , controller.getProcessDesc);
TTSM067Route.route('/getcoils').post(authenticationMiddleware.bearer , controller.getCoils);
TTSM067Route.route('/getholdrsn').post(
    authenticationMiddleware.bearer ,
    controller.getHoldRsn);
TTSM067Route.route('/saveunloaddata').post(authenticationMiddleware.bearer ,controller.saveUnloadData);

TTSM067Route.route('/getstatus').post(authenticationMiddleware.bearer ,controller.getStatus);
TTSM067Route.route('/getScrapMatNo').post(authenticationMiddleware.bearer , controller.getScrapMatNo);


export default TTSM067Route
