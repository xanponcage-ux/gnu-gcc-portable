import { Router } from "express";
import * as controller from "../controllers/LD01S006Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
const LD01S006Route = Router();

LD01S006Route.route("/getPalletData").post(
  authenticationMiddleware.bearer,
  controller.getPalletData
);
LD01S006Route.route("/savePalletUnmerge").post(
  authenticationMiddleware.bearer,
  controller.savePalletUnmerge
);
LD01S006Route.route("/savePalletData").post(
  authenticationMiddleware.bearer,
  controller.savePalletData
);
LD01S006Route.route("/getPalletInvData").post(
  authenticationMiddleware.bearer,
  controller.getPalletInvData
);

LD01S006Route.route("/getcheckMergebatch").post(
  authenticationMiddleware.bearer,
  controller.getcheckMergebatch
);

LD01S006Route.route("/getMergingStatus").post(
  authenticationMiddleware.bearer,
  controller.getMergingStatus
);

LD01S006Route.route("/getInitialpalletID").post(
  authenticationMiddleware.bearer,
  controller.getInitialpalletID
);

export default LD01S006Route;
