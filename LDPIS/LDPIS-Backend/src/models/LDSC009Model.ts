import * as repository from "../repository/LDSC009Query";

// export default class LDSC009 {

//     displayRouteMapping(plant:any){
//         return repository.displayRouteMapping(plant);
//     }

// }


export default class LDSC009 {

    displayRouteMapping(plant: any) {
        return repository.displayRouteMapping(plant);
    }

    updateRouteData(adid: any, dt: any) {
        return repository.updateRouteData(adid, dt);
    }

    deleteRouteData(adid: any, dt: any) {
        return repository.deleteRouteData(adid, dt);
    }

    previewUpdatedRouteData(adid: any, dt: any, plant: any) {
        return repository.previewUpdatedRouteData(adid, dt, plant);
    }

    dataExistsCheck(dt:any){
        return repository.dataExistsCheck(dt);
    }
    insertData (adid:any,dt:any){
        return repository.insertData(adid,dt);
    }
    maintainProcedure(adid:any,dt:any){
        return repository.maintainProcedure(adid,dt);
    }

}
