import * as repository from '../repository/SMCS001Query';
import Error from './errors'


export default class SMCS001 {

    // GetProcess(Plant: any) {
    //     return repository.GetProcess(Plant);
    // }
  getProcessChartList(Plant: any,Action: any) {
    return repository.getProcessChartList(Plant,Action);
    }
    // insert proc data
  InsertProcChartData(
    Plant: any,
    Action: any,
    ProcessChart: any,
    Version: any,
    Prod_Version: any,
    QualityCode: any,
    TDCNo: any,
    ProductGroup: any,
    GradeDesc: any,
    ProductApplication: any,
    ProductCategory: any,
    Remarks: any,) {                
    return repository.InsertProcChartData(Plant,Action,ProcessChart, Version,Prod_Version,QualityCode,
      TDCNo,ProductGroup,GradeDesc,ProductApplication,ProductCategory,Remarks);
        } 

    getProcessChartData(params:{
    Plant: any , 
    ProcessChart: any,
    Version: any,
    ProductGroup: any,
    ProductGroupDesc: any,
    QualityCode: any,
    ProductCategory: any,
    TDCNo: any,
    ProductApplication: any,
    GradeDesc: any
    Action: any
  }) {
    console.log("In model page")
    console.log(params)
    return repository.getProcessChartData(params);
  }

  getProcessChartSpec(params: {
    Plant:any,
    ProcessChart: any,
    Version: any
  }){
    console.log("In model page")
    console.log(params)
    return repository.getProcessChartSpec(params);
  }

}