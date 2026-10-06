import { Router } from "express";
import {displayRouteMapping,updateRouteData, deleteRouteData,dataExistsCheck,insertData,maintainProcedure} from "../controllers/LDSC009Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

//"/api/LDSC009/getRouteData"
//"api/LDSC009/updateRouteData"
//"api/LDSC009/deleteRouteData"
//"api/LDSC009/previewUpdatedData"


const LDSC009Route = Router();

LDSC009Route.route('/getRouteData').post(authenticationMiddleware.bearer,displayRouteMapping);
LDSC009Route.route('/updateRouteData').post(authenticationMiddleware.bearer,updateRouteData);
LDSC009Route.route('/deleteRouteData').post(authenticationMiddleware.bearer, deleteRouteData);
//LDSC009Route.route('/perviewUpdateData').post(authenticationMiddleware.bearer, previewUpdatedRouteData);
LDSC009Route.route('/dataexistscheck').post(authenticationMiddleware.bearer,dataExistsCheck);
LDSC009Route.route('/insertData').post(authenticationMiddleware.bearer,insertData);
LDSC009Route.route('/maintainProcedure').post(authenticationMiddleware.bearer,maintainProcedure);

export default LDSC009Route;
