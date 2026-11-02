// B.routes (routes.js)
import { Router } from "express";
import * as controller from "../controllers/TTSC015Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import multer from "multer";

const TTSC015Route = Router();

TTSC015Route.route("/getGradeInfo").post(
  authenticationMiddleware.bearer,
  controller.GetGradeInfo
);
TTSC015Route.route("/getSpecList").post(
  authenticationMiddleware.bearer,
  controller.GetSpecList
);

TTSC015Route.route("/getsize").post(
  authenticationMiddleware.bearer,
  controller.getsize
);
TTSC015Route.route("/getStatus").post(
  authenticationMiddleware.bearer,
  controller.getStatus
);
TTSC015Route.route("/getBatchID").post(
  authenticationMiddleware.bearer,
  controller.getBatchID
);

TTSC015Route.route("/GetreportTubecnt").post(
  authenticationMiddleware.bearer,
  controller.GetreportTubecnt
);
TTSC015Route.route("/insertTubecount").post(
  authenticationMiddleware.bearer,
  controller.insertTubecount
);

TTSC015Route.route('/uploadTubeImage')
  .post(authenticationMiddleware.bearer, controller.uploadAndInsertTubeCount);

// New route to serve images from SFTP
TTSC015Route.route("/image").get(
  authenticationMiddleware.bearer, // Apply authentication if needed//
  controller.serveImageFromSftp
);

TTSC015Route.route("/getTxtdownloadflag").post(
  authenticationMiddleware.bearer,
  controller.getTxtdownloadflag
);

TTSC015Route.route("/getTxtdownloadsize").post(
  authenticationMiddleware.bearer,
  controller.getTxtdownloadsize
);

TTSC015Route.route("/tubecountapi").post(
  [authenticationMiddleware.bearer, multer().single('file')],
  controller.tubecountapi
);

export default TTSC015Route;
