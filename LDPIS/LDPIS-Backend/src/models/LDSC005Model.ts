import * as repository from "../repository/LDSC005Query";
import { Post } from "../typed/typed";
import Error from "./errors";


export default class LDSC005 {

    getCodetyp(req: any) {
        return repository.getCodetyp(req);
    }

    getCodeval(req: any) {
        return repository.getCodeval(req);
    }

    getRecords(req: any) {
        return repository.getRecords(req);
    }

    insertRecords(req: any) {
        return repository.insertRecords(req);
    }

    updateRecords(req: any) {
        return repository.updateRecords(req);
    }

    deleteRecords(req: any) {
        return repository.deleteRecords(req);
    }

    getGroupPlant(id: any) {
        return repository.getGroupPlant(id);
    }

    getBatchId(plant: any, status: any) {
        return repository.GetBatchId(plant, status);
    }

    getIndTubesData(req: any) {
        return repository.getIndTubesData(req);
    }

}
