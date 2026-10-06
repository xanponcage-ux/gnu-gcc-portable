import { Router } from "express";
import * as controller from "../controllers/LDLTS08DController";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const postsRoute = Router();


// postsRoute.route('/get-Trouble-Type').post(authenticationMiddleware.bearer, controller.getTrouble);
postsRoute
  .route("/getData")
  .post(
    authenticationMiddleware.bearer,
    controller.getData
  );

  postsRoute
  .route("/getDatanotification")
  .post(
    authenticationMiddleware.bearer,
    controller.getDatanotification
  );

postsRoute
  .route("/brkReasondata")
  .post(
    authenticationMiddleware.bearer,
    controller.getBreakReasonData
  );
postsRoute
  .route("/save-modal-data")
  .post(
    authenticationMiddleware.bearer,
    controller.getSaveTableDetails
  );
postsRoute
  .route("/insert-modal-data")
  .post(
    authenticationMiddleware.bearer,
    controller.insertModalDetails
  );
postsRoute
  .route("/deleteData")
  .post(
    authenticationMiddleware.bearer,
    controller.deleteDetails
  );
postsRoute
  .route("/updateData")
  .post(
    authenticationMiddleware.bearer,
    controller.updateDetails
  );
postsRoute
  .route("/equipData")
  .post(
    authenticationMiddleware.bearer,
    controller.equipData
  );
postsRoute
  .route("/addReasonData")
  .post(
    authenticationMiddleware.bearer,
    controller.addReasonData
  );
postsRoute
  .route("/insertDelayData")
  .post(
    authenticationMiddleware.bearer,
    controller.insertDelayData
  );
postsRoute
  .route("/delayAgentData")
  .post(
    authenticationMiddleware.bearer,
    controller.delayAgent
  );
postsRoute
  .route("/delayAgency")
  .post(
    authenticationMiddleware.bearer,
    controller.delayAgency
  );
postsRoute
  .route("/delayCodeData")
  .post(
    authenticationMiddleware.bearer,
    controller.delayCode
  );

  postsRoute
  .route("/delayCodeft")
  .post(
    authenticationMiddleware.bearer,
    controller.delayCodeft
  );

  postsRoute
  .route("/delayCodedisplay")
  .post(
    authenticationMiddleware.bearer,
    controller.delayCodedisplay
  );

postsRoute
  .route("/processLine")
  .post(
    authenticationMiddleware.bearer,
    controller.processLine
  );
postsRoute
  .route("/plantList")
  .post(
    authenticationMiddleware.bearer,
    controller.plantList
  );
postsRoute
  .route("/resourceData")
  .post(
    authenticationMiddleware.bearer,
    controller.resourceData
  );

  postsRoute
  .route("/resourceDataall")
  .post(
    authenticationMiddleware.bearer,
    controller.resourceDataall
  );

  postsRoute
  .route("/subequipmentData")
  .post(
    authenticationMiddleware.bearer,
    controller.subequipmentData
  );

  postsRoute
  .route("/subequipmentdisplay")
  .post(
    authenticationMiddleware.bearer,
    controller.subequipmentdisplay
  );

  postsRoute
  .route("/descEditID")
  .post(
    authenticationMiddleware.bearer,
    controller.descEditID
  );

  postsRoute
  .route("/notification")
  .post(
    authenticationMiddleware.bearer,
    controller.notification
  );

  postsRoute
  .route("/getRunnHrs")
  .post(
    authenticationMiddleware.bearer,
    controller.getRunnHrs
  );

  postsRoute
  .route("/getMasterID")
  .post(
    authenticationMiddleware.bearer,
    controller.getMasterID
  );

postsRoute
  .route("/RmInventory")
  .post(
    authenticationMiddleware.bearer,
    controller.resourceData
  );
export default postsRoute;
