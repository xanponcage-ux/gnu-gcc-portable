import * as repository from "../repository/LD50S002Query";

export default class LD50S002Modal {
  LD50S002GetData(data: any) {
    return repository.LD50S002GetData(data);
  }
  LD50S002GetPlantID(data: any) {
    return repository.LD50S002GetPlantID(data);
  }

  LD50S002GetTestCastData(data: any) {
    return repository.LD50S002GetTestCastData(data);
  }
  LD50S002UpdateCastData(data: any, USER: any, seqNo: any) {
    return repository.LD50S002UpdateCastData(data, USER, seqNo);
  }

  LD50S002UpdateDimData(data: any, USER: any, seqNo: any) {
    return repository.LD50S002UpdateDimData(data, USER, seqNo);
  }

  LDS001passLDB004(data: any) {
    return repository.LDS001passLDB004(data);
  }
  LD50S002GetDimData(data: any) {
    return repository.LD50S002GetDimData(data);
  }

  LD50S002getTdcList(data: any) {
    return repository.LD50S002getTdcList(data);
  }
  LD50S002getHoldrsn(data: any) {
    return repository.LD50S002getHoldrsn(data);
  }
}
// export default class LDS001Model {
//   LDS001SaveLDS003(data: any) {
//   return LDS001Query.LDS001SaveLDS003(data);

// }
// }

// export default LD50S002Modal;
