import { Router } from "express";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import * as controller from "../controllers/LDSM017Controller";

const postsRoute = Router();

postsRoute
  .route("/getAssignedPlantList")
  .post(authenticationMiddleware.bearer, controller.getAssignedPlantList);
postsRoute
  .route("/getDownloadSCODetails")
  .post(authenticationMiddleware.bearer, controller.getDownloadSCODetails);
postsRoute
  .route("/getBatchTrigger")
  .post(authenticationMiddleware.bearer, controller.getBatchTrigger);  
postsRoute
  .route("/getDownloadCustomerOrder")
  .post(authenticationMiddleware.bearer, controller.getDownloadCustomerOrder);
postsRoute
  .route("/getDownloadRMDetails")
  .post(authenticationMiddleware.bearer, controller.getDownloadRMDetails);
postsRoute
  .route("/getUpdateWBStock")
  .post(authenticationMiddleware.bearer, controller.getUpdateWBStock);
postsRoute
  .route("/getUpdateWOStock")
  .post(authenticationMiddleware.bearer, controller.getUpdateWOStock);
postsRoute
  .route("/getDownloadQualityResults")
  .post(authenticationMiddleware.bearer, controller.getDownloadQualityResults);
postsRoute
  .route("/getSyncMotherBatchQuantity")
  .post(authenticationMiddleware.bearer, controller.getSyncMotherBatchQuantity);
export default postsRoute;
