import * as repository from "../repository/LDCR004Query";
import { Post } from "../typed/typed";
import Error from "./errors";
export default class LDCR004 {

  GetreportTyp(plant: any) {
    return repository.GetreportTyp(plant);
  }

  getinternaldata(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getinternaldata(
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
  getpanelTest(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getpanelTest(
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

  getporositytest(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getporositytest(
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

  getsgtest(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getsgtest(
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

  getmixpaint(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getmixpaint(
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

  getpulltest(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.getpulltest(
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

  gettaber(
    plant: any,
    orderNo: any,
    item: any,
    matno: any,
    crdate: any,
    heatno: any,
    pipeno: any
    //   ,rmno: any
  ) {
    return repository.gettaber(
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
