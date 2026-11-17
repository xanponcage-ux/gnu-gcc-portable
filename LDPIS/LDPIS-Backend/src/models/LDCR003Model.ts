import * as repository from "../repository/LDCR003Query";
import { Post } from "../typed/typed";
import Error from "./errors";
export default class LDCR003 {

  GetreportTyp(plant: any) {
    return repository.GetreportTyp(plant);
  }

  get24or48HrsCDtest(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.get24or48HrsCDtest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }
  get28or30DaysCDTestReport(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.get28or30DaysCDTestReport(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getCROSSSECTIONINTERFACEPOROSITY(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.getCROSSSECTIONINTERFACEPOROSITY(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getdegreeofcure(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.getdegreeofcure(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getelongationrep(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.getelongationrep(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getFLEXIBILITYTEST3LPE(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.getFLEXIBILITYTEST3LPE(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getFLEXIBILITYTESTREPORTFBE(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
      ,shift: any
  ) {
    return repository.getFLEXIBILITYTESTREPORTFBE(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      ,shift
    );
  }

  getHARDNESSTEST(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.getHARDNESSTEST(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }

  getHOTWATERADHESIONTEST24HRS(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.getHOTWATERADHESIONTEST24HRS(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }

  getproductstablilty(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.getproductstablilty(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }

    getINDENTATIONTEST(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    shift: any
  ) {
    return repository.getINDENTATIONTEST(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      shift
    );
  }

    getHOTWATERIMMERSION48(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.getHOTWATERIMMERSION48(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }

    gettensile(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
       ,shift: any
  ) {
    return repository.gettensile(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno,
     shift
    );
  }
}
