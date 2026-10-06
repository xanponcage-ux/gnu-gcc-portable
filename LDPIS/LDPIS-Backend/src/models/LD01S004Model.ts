import * as repository from "../repository/LD01S004Query";
import { Post } from "../typed/typed";
import Error from "./errors";

export default class LD01S004 {
  getGroupPlant(id: any) {
    return repository.getGroupPlant(id);
  }

  getCoils(req: any) {
    return repository.getCoils(req);
  }

  confirm(req: any) {
    return repository.confirm(req);
  }
  transferSchedule(req: any) {
    return repository.transferSchedule(req);
  }

  generateScheduleId(req: any) {
    return repository.generateScheduleId(req);
  }

  getSchedules(req: any) {
    return repository.getSchedules(req);
  }
  updateSchedule(req: any) {
    return repository.updateSchedule(req);
  }
  deleteCoil(req: any) {
    return repository.deleteCoil(req);
  }
}
