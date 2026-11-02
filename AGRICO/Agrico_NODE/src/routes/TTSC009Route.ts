import { Router } from "express";
import {displayRouteMapping,updateRouteData, deleteRouteData,dataExistsCheck,insertData,maintainProcedure} from "../controllers/TTSC009Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

//"/api/TTSC009/getRouteData"
//"api/TTSC009/updateRouteData"
//"api/TTSC009/deleteRouteData"
//"api/TTSC009/previewUpdatedData"


const TTSC009Route = Router();

TTSC009Route.route('/getRouteData').post(authenticationMiddleware.bearer,displayRouteMapping);
TTSC009Route.route('/updateRouteData').post(authenticationMiddleware.bearer,updateRouteData);
TTSC009Route.route('/deleteRouteData').post(authenticationMiddleware.bearer, deleteRouteData);
//TTSC009Route.route('/perviewUpdateData').post(authenticationMiddleware.bearer, previewUpdatedRouteData);
TTSC009Route.route('/dataexistscheck').post(authenticationMiddleware.bearer,dataExistsCheck);
TTSC009Route.route('/insertData').post(authenticationMiddleware.bearer,insertData);
TTSC009Route.route('/maintainProcedure').post(authenticationMiddleware.bearer,maintainProcedure);

export default TTSC009Route;
