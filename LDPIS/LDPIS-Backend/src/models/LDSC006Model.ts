import * as repository from "../repository/LDSC006Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LDSC006 {

    displanyLengthMaster(plant: any) {
        return repository.displanyLengthMaster(plant);
    }

    updateLengthData(adid: any, dt: any) {
        return repository.updateLengthData(adid, dt);
    }

    deleteLengthData(adid: any, dt: any) {
        return repository.deleteLengthData(adid, dt);
    }

    perviewUpdateData(adid: any, dt: any, plant: any) {
        return repository.perviewUpdateData(adid, dt, plant);
    }
}
