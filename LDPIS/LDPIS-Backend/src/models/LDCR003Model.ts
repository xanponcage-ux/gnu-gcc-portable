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
    //   ,rmno: any
  ) {
    return repository.get24or48HrsCDtest(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.get28or30DaysCDTestReport(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getCROSSSECTIONINTERFACEPOROSITY(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getdegreeofcure(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getelongationrep(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getFLEXIBILITYTEST3LPE(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getFLEXIBILITYTESTREPORTFBE(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getHARDNESSTEST(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getHOTWATERADHESIONTEST24HRS(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getproductstablilty(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }

    getINDENTATIONTEST(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getINDENTATIONTEST(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.getHOTWATERIMMERSION48(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
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
    //   ,rmno: any
  ) {
    return repository.gettensile(
      plant,
      orderNo,
      item,
      matno,
      crdate,
      heatno,
      pipeno
      // ,rmno
    );
  }
}
