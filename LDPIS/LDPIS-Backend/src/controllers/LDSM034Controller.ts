import { Request, Response } from "express";
import C1CES34W from "../models/LDSM034Model";


export const getStatusList = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await C1CES34W.prototype.getStatusList(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getOrderList = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    let statusList = req.body.statusList;
    const results: any = await C1CES34W.prototype.getOrderList(
      plant,
      statusList
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getMBatchData = async (req: Request, res: Response) => {
  try {
    let orderList = req.body.orderList;

    const results: any = await C1CES34W.prototype.getMBatchData(orderList);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getDisplayData = async (req: Request, res: Response) => {
  try {
    var { batch, item, mBatch, order, plant, status, tdc } = req.body;

    const results: any = await C1CES34W.prototype.getDisplayData(
      batch,
      item,
      mBatch,
      order,
      plant,
      status,
      tdc
    );

    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }


    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getQualityResultData = async (req: Request, res: Response) => {
  try {
    var { plant, status,selectedData } = req.body;
    const table: any = [];
    var i = 0;
    // for (var i in selectedData) {
    let ORDERID = selectedData[i].ORDERID;
    let ITEM = selectedData[i].ITEM;
    let MATERIAL = selectedData[i].MATERIAL;
    let MOTHER_BATCH = selectedData[i].MOTHER_BATCH;
    let LOM_NO_CAST = selectedData[i].LOM_NO_CAST;
    let BATCH_ID = selectedData[i].BATCH_ID;
    let FG_MAT =selectedData[i].FG_MAT;

    const results: any = await C1CES34W.prototype.getQualityResultData(
      plant,
      ORDERID,
      ITEM,
      MATERIAL,
      MOTHER_BATCH,
      LOM_NO_CAST,
      BATCH_ID
    );

    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    // }

    const CATEGORY_RESULT = await C1CES34W.prototype.getCATEGORY(FG_MAT);
    const Hydra_dt = await C1CES34W.prototype.getHydraDt(plant,BATCH_ID);
console.log(Hydra_dt);
// Extract CATEGORY from the result
const CATEGORY = CATEGORY_RESULT.rows && CATEGORY_RESULT.rows[0] && CATEGORY_RESULT.rows[0][0];
const hydra_Date = Hydra_dt.rows && Hydra_dt.rows[0] && Hydra_dt.rows[0][0];
console.log(hydra_Date);
    // Check if CATEGORY is BOT and add a new row if it is
    if (CATEGORY === "BOT") {
      const lastRow = table[table.length - 1];

      const newRow = { ...lastRow };
      newRow.TC_ELEMENT = "HYDRA_DT";
      newRow.CODE_DESC = "Hydra_Dt";
      newRow.TQP_SEQ=newRow.TQP_SEQ+10;
      newRow.INT_MIN_SPEC_VAL = 0;
      newRow.INT_MAX_SPEC_VAL = 99999;
      newRow.CODE_SUB_DESC = "DT";
      newRow.DROP_CHK = 2;
      newRow.FLAG = "Required";
      newRow.ACTUAL_RECORD_VAL= hydra_Date ;
      table.push(newRow);
    }
    

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertQualityTestData = async (req: Request, res: Response) => {
  try {
    var { plant, selectedFirstTableData, selectedSecondTableData, personalNo,wire_dt } =
      req.body;
    console.log(wire_dt,"hello boy");
    //initialize variable
    var rowsAffected: number = 0;

    for (var i in selectedFirstTableData) {
      for (var r in selectedSecondTableData) {
        let MOTHER_BATCH = selectedFirstTableData[i].MOTHER_BATCH;
        let BATCH_ID = selectedFirstTableData[i].BATCH_ID;
        let LOM_NO_CAST = selectedFirstTableData[i].LOM_NO_CAST;

        let TEST_CODE = selectedSecondTableData[r].TEST_CODE;
        let TEST_PARAMETER = selectedSecondTableData[r].TEST_PARAMETER;
        let TEST_REMARK = selectedSecondTableData[r].TEST_REMARK;
        let TEST_VALUE = selectedSecondTableData[r].TEST_VALUE;
        let TCO_TEST_PARA_REM = selectedSecondTableData[r].TCO_TEST_PARA_REM;
        let TCO_TEST_PARA_VAL = selectedSecondTableData[r].TCO_TEST_PARA_VAL;
        let CHECK_RANGE = selectedSecondTableData[r].CHECK_RANGE;
        let up_res_tag = 'N';
        if (TEST_VALUE == 'FAILED' || TEST_VALUE == 'NOT OK' || TEST_VALUE == 'NOT SATISFACTORY' || TEST_VALUE > CHECK_RANGE.INT_MAX_SPEC_VAL ||
          TEST_VALUE < CHECK_RANGE.INT_MIN_SPEC_VAL) {
          up_res_tag = 'F';
        } else {
          up_res_tag = 'N';
        }
        if(TEST_VALUE == 'OPTIONAL')
          up_res_tag='N';

        const res_count: any = await C1CES34W.prototype.countQualityTestData(
          plant,
          MOTHER_BATCH,
          BATCH_ID,
          TEST_CODE,
          TEST_PARAMETER,
          TEST_REMARK,
          TEST_VALUE,
          personalNo,
          LOM_NO_CAST
        );

        let results: any = [];
        console.log(res_count.rows[0][0]);
        if (res_count.rows[0][0] == 0) {
          results = await C1CES34W.prototype.insertQualityTestData(
            plant,
            MOTHER_BATCH,
            BATCH_ID,
            TEST_CODE,
            TEST_PARAMETER,
            TEST_REMARK,
            TEST_VALUE,
            personalNo,
            LOM_NO_CAST,
            up_res_tag,
            TCO_TEST_PARA_REM,
            TCO_TEST_PARA_VAL,
            wire_dt
          );
          console.log(results);
        } else {
          console.log("inside controller",wire_dt);
          results = await C1CES34W.prototype.updateQualityTestData(
            plant,
            MOTHER_BATCH,
            BATCH_ID,
            TEST_CODE,
            TEST_PARAMETER,
            TEST_REMARK,
            TEST_VALUE,
            personalNo,
            LOM_NO_CAST,
            up_res_tag,
            TCO_TEST_PARA_REM,
            TCO_TEST_PARA_VAL,
            wire_dt
          );
          console.log(results);
        }

        console.log(wire_dt);
        rowsAffected += Number(results.rowsAffected);
      }
    }
    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const changeQualityTestData = async (req: Request, res: Response) => {
  try {
    var { plant, selectedFirstTableData, selectedSecondTableData, personalNo } =
      req.body;

    //initialize variable
    var rowsAffected: number = 0;

    for (var i in selectedFirstTableData) {
      for (var r in selectedSecondTableData) {
        let TEST_VALUE = selectedSecondTableData[r].TEST_VALUE;

        let CHECK_RANGE = selectedSecondTableData[r].CHECK_RANGE;
        let up_res_tag = 'N';
        if (TEST_VALUE == 'FAILED' || TEST_VALUE == 'NOT OK' || TEST_VALUE == 'NOT SATISFACTORY' || TEST_VALUE > CHECK_RANGE.INT_MAX_SPEC_VAL ||
          TEST_VALUE < CHECK_RANGE.INT_MIN_SPEC_VAL) {
          up_res_tag = 'F';
        } else {
          up_res_tag = 'N';
        }
        if(TEST_VALUE == 'OPTIONAL')
          up_res_tag='N';
        let results = await C1CES34W.prototype.changeQualityTestData(
          plant, selectedFirstTableData[i], selectedSecondTableData[r], personalNo, up_res_tag
        );

        rowsAffected += Number(results.rowsAffected);
      }
    }
    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getDefectRecording = async (req: Request, res: Response) => {
  try {
    // var { plant } = req.body;

    var { plant, selectedData } = req.body;


    // const table: any = [];
    var i = 0;
    let MOTHER_BATCH = selectedData[i].MOTHER_BATCH;
    let CURRENT_PROCESS = selectedData[i].PROCESS;
    let BATCH_ID = selectedData[i].BATCH_ID;




    let results: any = await C1CES34W.prototype.getDefectRecording(plant, MOTHER_BATCH, CURRENT_PROCESS, BATCH_ID, selectedData.length);

    if (results.rows.length == 0 && selectedData.length == 1) {
      results = await C1CES34W.prototype.getDefectRecording(plant, MOTHER_BATCH, CURRENT_PROCESS, BATCH_ID, 2);
    }

    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const insertDefectRecording = async (req: Request, res: Response) => {
  try {
    var { personalNo, selectedData, selectedDisplayData, plant } = req.body;
    var rowsAffected: any = 0;

    for (var i in selectedDisplayData) {
      var { MOTHER_BATCH, BATCH_ID, CURRENT_PROCESS } = selectedDisplayData[i];

      for (var i in selectedData) {
        var { ESR_RSN_CD, TBD_DEFECT_NO_PCS, TBD_DEFECT_WT } = selectedData[i];

        const results_count: any =
          await C1CES34W.prototype.getDefectRecordingCount(
            ESR_RSN_CD,
            plant,
            MOTHER_BATCH,
            BATCH_ID,
            CURRENT_PROCESS
          );

        var results: any;
        if (results_count.rows[0][0] > 0) {
          results = await C1CES34W.prototype.updateDefectRecording(
            ESR_RSN_CD,
            TBD_DEFECT_NO_PCS,
            TBD_DEFECT_WT,
            personalNo,
            MOTHER_BATCH,
            BATCH_ID,
            CURRENT_PROCESS,
            plant
          );
        } else {
          results = await C1CES34W.prototype.insertDefectRecording(
            ESR_RSN_CD,
            TBD_DEFECT_NO_PCS,
            TBD_DEFECT_WT,
            personalNo,
            MOTHER_BATCH,
            BATCH_ID,
            CURRENT_PROCESS,
            plant
          );
        }

        rowsAffected += Number(results.rowsAffected);
      }
    }

    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    //data retreival
    var { plant, orderId } = req.body;

    //execute querygetItem
    const results: any = await C1CES34W.prototype.getItem(plant, orderId);
    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[0]);
    });
    //response
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getDataDeci = async (req: Request, res: Response) => {
  try {
    var { plant, batch, status, coil } = req.body;

    const results: any = await C1CES34W.prototype.getDataDeci(
      plant,
      batch,
      status,
      coil
    );
    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveQADeci = async (req: Request, res: Response) => {
  try {
    var { plant, personalNo, selectedData } = req.body;

    var rowsAffected: number = 0;
    var P_RADIO_VALUE, ls_flag;
    let results: any;
    var res_y: any = [];
    var res_n: any = [];

    for (var i in selectedData) {
      var {
        MAT_NO,
        ADDL_PROC,
        DECISION,
        ENC_CUST_NAME,
        LOM_CD_CURR_PROC,
        LOM_CD_EPA,
        LOM_CD_NEXT_PROC,
        LOM_CD_PROD,
        LOM_CD_QLTY_ACTL,
        LOM_CD_QLTY_AIM,
        LOM_CD_STATUS,
        LOM_CD_ST_ACTL,
        LOM_ID_BATCH,
        LOM_ID_FIRST_PAR,
        LOM_ID_ORDER_CUS,
        LOM_ID_ORD_ITEM_CUS,
        LOM_LENGTH,
        LOM_MS_GROSS_ACTL,
        LOM_MS_GROSS_CAL,
        LOM_MS_PIECE_ACTL,
        LOM_PROD_HOLD,
        LOM_SEC1,
        LOM_SEC2,
        LOM_TDC_ACTL,
        LOM_TDC_AIM,
        LOM_WFL_STATUS,
        QLTY,
        REMARKS,
        TDC,
      } = selectedData[i];

      if (LOM_CD_NEXT_PROC == ' ') {
        LOM_CD_NEXT_PROC = null;
      }

      if (DECISION == "Pass") {
        P_RADIO_VALUE = "1";
        ls_flag = "Y";
        if (LOM_CD_STATUS == "WD" && LOM_CD_NEXT_PROC == "") {
          LOM_CD_NEXT_PROC = LOM_CD_CURR_PROC;
        }
        results = await C1CES34W.prototype.saveQADeci(
          LOM_CD_EPA,
          LOM_ID_BATCH,
          LOM_CD_STATUS,
          LOM_CD_CURR_PROC,
          LOM_CD_NEXT_PROC,
          P_RADIO_VALUE,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          LOM_ID_ORDER_CUS,
          LOM_ID_ORD_ITEM_CUS,
          "",
          "",
          "",
          "",
          "",
          LOM_MS_GROSS_ACTL,
          "",
          "",
          "",
          "",
          REMARKS
        );

      } else if (DECISION == "Downgrade") {
        P_RADIO_VALUE = "3";
        results = await C1CES34W.prototype.saveQADeci(
          LOM_CD_EPA,
          LOM_ID_BATCH,
          LOM_CD_STATUS,
          LOM_CD_CURR_PROC,
          LOM_CD_NEXT_PROC,
          P_RADIO_VALUE,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          LOM_ID_ORDER_CUS,
          LOM_ID_ORD_ITEM_CUS,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          "",
          "",
          MAT_NO,
          LOM_MS_GROSS_ACTL,
          "",
          "",
          "",
          "",
          REMARKS
        );

      } else if (DECISION == "Addl Process") {
        P_RADIO_VALUE = "5";
        results = await C1CES34W.prototype.saveQADeci(
          LOM_CD_EPA,
          LOM_ID_BATCH,
          LOM_CD_STATUS,
          LOM_CD_CURR_PROC,
          LOM_CD_NEXT_PROC,
          P_RADIO_VALUE,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          LOM_ID_ORDER_CUS,
          LOM_ID_ORD_ITEM_CUS,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          ADDL_PROC,
          "",
          "",
          LOM_MS_GROSS_ACTL,
          "",
          "",
          "",
          "",
          REMARKS
        );
      } else if (DECISION == "Diverted") {
        P_RADIO_VALUE = "8";
        results = await C1CES34W.prototype.saveQADeci(
          LOM_CD_EPA,
          LOM_ID_BATCH,
          LOM_CD_STATUS,
          LOM_CD_CURR_PROC,
          LOM_CD_NEXT_PROC,
          P_RADIO_VALUE,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          LOM_ID_ORDER_CUS,
          LOM_ID_ORD_ITEM_CUS,
          LOM_CD_QLTY_ACTL,
          LOM_TDC_ACTL,
          "",
          "",
          MAT_NO,
          LOM_MS_GROSS_ACTL,
          "",
          "",
          "",
          "",
          REMARKS
        );

      }

      if (results.outBinds.LS_OUT_FLAG.toString().startsWith("N-")) {
        res_n.push(results.outBinds.LS_OUT_FLAG);
      } else {
        res_y.push(results.outBinds.LS_OUT_FLAG);
      }
      // const results: any = await C1CES34W.prototype.saveQADeci();

    }

    var fin_res = {
      res_n: res_n,
      res_y: res_y
    }

    return res.status(200).json(fin_res);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getQlty = async (req: Request, res: Response) => {
  try {
    const results: any = await C1CES34W.prototype.getQlty();

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTdc = async (req: Request, res: Response) => {
  try {
    const results: any = await C1CES34W.prototype.getTdc();

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAddlProcess = async (req: Request, res: Response) => {
  try {
    let {
      plant,
      curr_proc
    } = req.body;
    const results: any = await C1CES34W.prototype.getAddlProcess(plant, curr_proc);

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getMatNo = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await C1CES34W.prototype.getMatNo(plant);

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getmatnoDiverted = async (req: Request, res: Response) => {
  try {
    let {
      plant
    } = req.body;
    const results: any = await C1CES34W.prototype.getmatnoDiverted(plant);

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveUD = async (req: Request, res: Response) => {
  try {
    var { plant, personalNo, flag, ACTION, selectedData } = req.body;
    var res_y: any = [];
    var res_n: any = [];
    var res_n_msg: any = [];

    // Start Check duplicate batch entry.

    for (var i in selectedData) {

      let res_chk_duplicate_batch: any = await C1CES34W.prototype.chkDuplicateBatch(plant, selectedData[i].BATCH_ID);
      if (res_chk_duplicate_batch.rows[0][0] != 0) {
        return res.status(200).json(7);
      }

      // Ended Check duplicate batch entry.
      let results_cnt_coil_test: any = await C1CES34W.prototype.getCntCoilTest(selectedData[i].MOTHER_BATCH, selectedData[i].LOM_NO_CAST);

      // const res_cnt_def_rec : any = await
      if (results_cnt_coil_test.rows[0][0] > 0) {
        let res_upd_daughter_batch: any = await C1CES34W.prototype.updateDaughterBatch(selectedData[i].MOTHER_BATCH, selectedData[i].LOM_NO_CAST, plant, selectedData[i].BATCH_ID);
      }

      // get failed result recording count
      let results_tag: any = await C1CES34W.prototype.getCntResTag(selectedData[i].MOTHER_BATCH, selectedData[i].LOM_NO_CAST);

      //get saved result recording count
      let results_tag_success: any = await C1CES34W.prototype.getCntResTagSuccess(selectedData[i].MOTHER_BATCH, selectedData[i].LOM_NO_CAST);

      //get total quality result recording count 
      let res_quality_res_cnt = await C1CES34W.prototype.getQualityResultCount(plant, selectedData[i].ORDERID, selectedData[i].LOM_NO_CAST, selectedData[i].ITEM, selectedData[i].MOTHER_BATCH, selectedData[i].MATERIAL);

      //check MQ status
      let res_chk_mq_STATUS: any = await C1CES34W.prototype.chkMqStatus(plant, selectedData[i].STATUS);

      //get defect recording count
      let res_cnt_def_rec: any = await C1CES34W.prototype.getCntDefectRec(plant, selectedData[i].BATCH_ID, selectedData[i].MOTHER_BATCH);


      if ((results_tag.rows[0][0] == 0 && results_tag_success.rows[0][0] > 0 && res_cnt_def_rec.rows[0][0] > 0 && res_quality_res_cnt.rows[0][0] == results_tag_success.rows[0][0]) || ACTION == "RejectUD" || res_chk_mq_STATUS.rows[0][0] == 0) {

        var {
          BATCH_ID,
          LOM_IDIA,
          LOM_NO_CAST,
          LOM_NO_PIECES,
          LOM_ODIA,
          LOM_PASSED_PROC,
          LOM_SEC2,
          ITEM,
          MATERIAL,
          MOTHER_BATCH,
          NET_WT,
          ORDERID,
          PROD_END_TM,
          PROD_STRT_TM,
          THICKNESS,
          CURRENT_PROCESS,
          // ACTION,
          STATUS,
          LOM_CD_NEXT_PROC,
          LOM_WORK_CENTER,
          REMARKS,
          CRT_DT
        } = selectedData[i];

        let sch_id = "", sfg_matnr = "";
        let res_sch_id: any = await C1CES34W.prototype.getScheduleID(plant, BATCH_ID, CURRENT_PROCESS);

        if (res_sch_id.rows.length != 0) {
          if (ACTION == "ConfirmUD") {
            sch_id = res_sch_id.rows[0][0];
            // sfg_matnr = res_sch_id.rows[0][1];
            MATERIAL = res_sch_id.rows[0][1];
            //this procedure will populate quality result for daughter batches
            // if result recording is success then
          } else {
            sch_id = res_sch_id.rows[0][0];
          }

          let res_stor: any = await C1CES34W.prototype.getSTOR(plant, BATCH_ID);
          if (res_stor.rows.length != 0) {
            let stor = res_stor.rows[0][0];
            var dt;
            if (CRT_DT) {
              var t = CRT_DT.split(" ");
              dt = t[0];
            } else {
              dt = ''
            }

            let checkPdate = await C1CES34W.prototype.checkPdate(plant, BATCH_ID, dt);
            if (checkPdate.outBinds.LS_OUT_FLAG.toString().startsWith("Y-")) {
              let results: any = await C1CES34W.prototype.saveUD(
                plant,
                BATCH_ID,
                LOM_IDIA,
                LOM_NO_CAST,
                LOM_NO_PIECES,
                LOM_ODIA,
                LOM_PASSED_PROC,
                LOM_SEC2,
                ITEM,
                MATERIAL,
                MOTHER_BATCH,
                NET_WT,
                ORDERID,
                PROD_END_TM,
                PROD_STRT_TM,
                stor,
                personalNo,
                flag,
                sch_id,
                THICKNESS,
                LOM_WORK_CENTER
              );

              if (results.outBinds.LS_OUT_FLAG == "Y") {
                //updating v_LDP_PRODN with batch status '%B'

                if (STATUS != "KB" && STATUS != "KD") {
                  let res_upd: any = await C1CES34W.prototype.updateUD(
                    plant,
                    ORDERID,
                    ITEM,
                    BATCH_ID,
                    MOTHER_BATCH,
                    CURRENT_PROCESS,
                    LOM_CD_NEXT_PROC,
                    personalNo,
                    ACTION,
                    MATERIAL,
                    REMARKS
                  );


                  if (res_upd.outBinds.LS_OUT_FLAG == 'Y') {
                    let res_crt_wip: any;
                    if (ACTION == "ConfirmUD") {
                      //creating schedule for WIP
                      res_crt_wip = await C1CES34W.prototype.crtWIP(plant, BATCH_ID, LOM_CD_NEXT_PROC);
                    }
                    if (ACTION == "RejectUD" || (res_crt_wip && res_crt_wip.outBinds.LS_OUT_FLAG.toString().startsWith("Y-"))) {
                      res_y.push(BATCH_ID);
                    } else {
                      res_n_msg.push(BATCH_ID + " - " + res_crt_wip.outBinds.LS_OUT_FLAG);
                      res_n.push(BATCH_ID);
                    }
                  }
                } else if (STATUS != "KB" && STATUS != "KD" && results.outBinds.LS_OUT_FLAG == "Y") {
                  res_y.push(BATCH_ID);
                }
              } else {
                res_n_msg.push(BATCH_ID + " - " + results.outBinds.LS_OUT_FLAG);
                res_n.push(BATCH_ID);
              }
            } else {
              res_n_msg.push(BATCH_ID + " - " + checkPdate.outBinds.LS_OUT_FLAG);
              res_n.push(BATCH_ID);
            }
          } else {
            res_n_msg.push(BATCH_ID + " - " + "Unable to get STOR.");
            res_n.push(BATCH_ID);
          }
        } else {
          res_n_msg.push(BATCH_ID + " - " + "Unable to get Schedule ID.");
          res_n.push(BATCH_ID);
        }
      } else {
        if (results_tag_success.rows[0][0] == 0 && res_cnt_def_rec.rows[0][0] == 0) {
          return res.status(200).json(4);
        } else if (results_tag.rows[0][0] > 0 && res_cnt_def_rec.rows[0][0] == 0) {
          return res.status(200).json(3);
        }
        else if (results_tag.rows[0][0] > 0) {
          return res.status(200).json(1);
        } else if (res_cnt_def_rec.rows[0][0] == 0) {
          return res.status(200).json(2);
        } else if (results_tag_success.rows[0][0] == 0) {
          return res.status(200).json(5);
        }
        else if (res_quality_res_cnt.rows[0][0] != results_tag_success.rows[0][0]) {
          return res.status(200).json(6);
        }
      }
    }

    var fin_res = {
      res_n: res_n,
      res_y: res_y,
      res_n_msg: res_n_msg
    }
    
    return res.status(200).json(fin_res);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const saveudReturn = async (req: Request, res: Response) => {
  try {
    var { plant, personalNo, flag, ACTION, selectedData } = req.body;
    var res_y: any = [];
    var res_n: any = [];
    var res_n_msg: any = [];

    if (ACTION == "ReturnToProd") {
      for (var i in selectedData) {

        var {
          BATCH_ID,
          ITEM,
          MATERIAL,
          MOTHER_BATCH,
          NET_WT,
          ORDERID,
          CURRENT_PROCESS,
          LOM_CD_NEXT_PROC,
          REMARKS
        } = selectedData[i];

        const res_upd: any = await C1CES34W.prototype.saveudReturn(
          plant,
          ORDERID,
          ITEM,
          BATCH_ID,
          MOTHER_BATCH,
          CURRENT_PROCESS,
          LOM_CD_NEXT_PROC,
          personalNo,
          ACTION,
          MATERIAL,
          REMARKS
        );

        if (res_upd.outBinds.LS_OUT_FLAG.toString().startsWith("Y-")) {
          res_y.push(BATCH_ID);
        } else {
          res_n_msg.push(BATCH_ID + " - " + res_upd.outBinds.LS_OUT_FLAG);
          res_n.push(BATCH_ID);
        }

      }

      var fin_res = {
        res_n: res_n,
        res_y: res_y,
        res_n_msg: res_n_msg
      }

      return res.status(200).json(fin_res);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const rejectUD = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await C1CES34W.prototype.rejectUD();

    const list: any = [];
    //create json
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getCastDetails = async (req: Request, res: Response) => {
  try {
    let castNo = req.body.castNo;
    const results: any = await C1CES34W.prototype.getCastDetails(castNo);

    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);

  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getQRRFlg = async (req: Request, res: Response) => {
  try {
    let { plant, status } = req.body;
    const results: any = await C1CES34W.prototype.getQRRFlg(plant, status);

    return res.status(200).json(results.rows[0][0]);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getCntResTag = async (req: Request, res: Response) => {
  try {
    let { mother_batch, cast_no } = req.body;
    const results: any = await C1CES34W.prototype.getCntResTag(mother_batch, cast_no);

    return res.status(200).json(results.rows[0][0]);
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getProdTypeTitle = async (req: Request, res: Response) => {
  try {
    let { plant, status } = req.body;
    const results: any = await C1CES34W.prototype.getProdTypeTitle(plant, status);

    return res.status(200).json(results.rows[0][0]);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getChangeResult = async (req: Request, res: Response) => {
  try {
    var { batch_id, LOM_no_cast, plant, orderid, orderitem } = req.body;

    const results: any = await C1CES34W.prototype.getChangeResult(
      batch_id, LOM_no_cast, plant, orderid, orderitem
    );
    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getChangeResultDetails = async (req: Request, res: Response) => {
  try {
    var { batch, testpra } = req.body;

    const results: any = await C1CES34W.prototype.getChangeResultDetails(
      batch,
      testpra
    );
    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTestResBatch = async (req: Request, res: Response) => {
  try {
    let plant = req.body.plant;
    const results: any = await C1CES34W.prototype.getChangeResultBatch(plant);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getChangeResultMBatch = async (req: Request, res: Response) => {
  try {
    const results: any = await C1CES34W.prototype.getChangeResultMBatch();
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetScrapWt = async (req: Request, res: Response) => {
  try {
    var { plant, selectedData } = req.body;

    let MOTHER_BATCH = selectedData[0].MOTHER_BATCH;
    let CUR_PROCESS = selectedData[0].PROCESS;

    const results: any = await C1CES34W.prototype.GetScrapWt(
      plant,
      MOTHER_BATCH,
      CUR_PROCESS
    );

    const table: any = [];
    const header: any = [];
    const columns: any = [];

    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }

    for (let i = 0; i < results.metaData.length; i++) {
      var obj: any = {};
      obj.title = results.metaData[i].name as string;
      obj.field = header[i];
      columns.push(obj);
    }

    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const GetPieceActl = async (req: Request, res: Response) => {
  try {
    const results: any = await C1CES34W.prototype.GetPieceActl(req);
    //response
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getProductName = async (req: Request, res: Response) => {
  try {
    const results: any = await C1CES34W.prototype.getProductName(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};