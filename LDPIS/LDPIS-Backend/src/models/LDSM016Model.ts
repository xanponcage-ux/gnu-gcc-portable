import * as repository from '../repository/LDSM016Query'
import { Post } from '../typed/typed';
import Error from './errors'
export default class LDSM016 {

    getTablesForEdit() {
        return repository.getTablesForEdit();
    }

    getColumnList(table:any) {
        return repository.getColumnList(table);
    }

    getData(tableName:any,dt:any)
    {
        return  repository.getData(tableName,dt);
    }
    editableColumns(table:any) {
        return repository.editableColumns(table);
    }
    primaryColumns(table:any) {
        return repository.primaryColumns(table);
    }
    updateRecord(table: any ,updatedRecord: any,editableColumns:any,primaryData:any) {
        return repository.updateRecord(table,updatedRecord,editableColumns,primaryData);
    }
    getQualityResultData(
        plant : any,
        batch_id : any,
        frmDt : any,
        toDt : any
    ) {
        return repository.getQualityResultData(
            plant,
            batch_id,
            frmDt,
            toDt
        )
    }
    getStripChartData(
        data: any
    ) {
        return repository.getStripChartData(
            data
        )
    }

    

    
}