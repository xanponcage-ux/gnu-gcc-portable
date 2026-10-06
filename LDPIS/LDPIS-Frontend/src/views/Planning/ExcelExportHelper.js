import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import TslLogo from "../../assets/Logo/ts_logo.png"
import serverDetails from "../../variables/serverDetails";
import alertify from "alertifyjs";
import "../../alertify.css";
import { format } from 'date-fns';

export const exportExcelFile = async (data) => {
  if (data === null || data.length < 1) {
    alertify.error("No Data exists for Downloading");
    return;
  }
  const toDataURL = (url) => {
    const promise = new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
          resolve({ base64Url: reader.result });
        };
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });

    return promise;
  };

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet 1", {
    pageSetup: { paperSize: 9, orientation: 'landscape' }
  });

  //sheet.properties.defaultRowHeight = 80;

  const result = await toDataURL(TslLogo);
  const splitted = TslLogo?.split(".");
  const extName = splitted[splitted.length - 1];

  const imageId2 = workbook.addImage({
    base64: result.base64Url,
    extension: extName,
  });

  sheet.addImage(imageId2, {
    tl: { col: 0, row: 0 },
    ext: { width: 100, height: 100 },
  });

  const tdyDate = new Date()
  const dateString = tdyDate ? tdyDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).replace(/\//g, ".") : "";
  const excelTitle = ["TATA STEEL LIMITED (TUBE PLANT)", "Format Name- Production Planning", `Format No-IMS/S/TUBE/PPC/F-001               Rev No- 02                                                                                                                                                                                                    Effective Date- ${dateString}`];

  for (let title of excelTitle) {
    sheet.addRow([title]);
    const currentRowIdx = sheet.rowCount;
    sheet.mergeCells(currentRowIdx, 1, currentRowIdx, 18);

    sheet.getRow(currentRowIdx).getCell(1).font = {
      bold: true,
    };
  }
  sheet.getRow(1).getCell(1).font = {
    bold: true,
    size: 22,
  };

  sheet.getRow(1).getCell(1).alignment = {
    horizontal: "center",
    vertical: "middle"
  };
  const headerRow = sheet.getRow(1);
  headerRow.height = 120;

  sheet.getRow(2).getCell(1).alignment = {
    horizontal: "left",
  };
  sheet.getRow(3).getCell(1).alignment = {
    horizontal: "left",
  };

  sheet.addRow([]);


  const newData = data?.map((item) => ({
    "Cust. Name": item?.CUST_NAME,
    "Work Center": item?.WORK_CENT,
    "SFG Material No": item?.SFG_MATERIAL_NO,
    "SFG Material Description": item?.SFG_MATERIAL_DESC,
    "MILL Length": item?.MILL_LENGTH,
    "FC/NFC": item?.END_FINISH,
    //"GI Material": item?.GI_MATERIAL,
    "GI Material Desc.": item?.GI_MATERIAL_DESC,
    "Cast No": item?.CAST_NO,
    // "Heat No.": item?.RM_HEAT_NO,
    "GI Batch No.": item?.GI_BATCH,
    "Grade": item?.GRADE,
    "RM Batch Qty(KG)": item?.GI_QNTY,
    "Qty. Nos.": item?.ORDR_QTY_NUM,
    "FG Material Desc.": item?.FG_MATNR_DESC,
    // "OD": item?.CUST_OD,
    // "ID": item?.IDIA,
    // "Thick.": item?.CUST_THK,
    // "Length": item?.CUST_LENGTH,
    "Sales Order No.": item?.ENC_ID_ORDER,

    // "PTY": item?.PRIORITY,
    // "Mtr": item?.ORDR_QTY_METER,
    // "Kg": item?.ORD_QTY,
    // "Type": item?.TUBE_TYPE,
    // "RM Width": item?.WIDTH,
    // "RM Thick.": item?.THICK,
    // "RM Phy. Loc.": item?.RM_PHY_LOC,
    // "Special Instruction": item?.PLANNING_REMARKS,
    // "Sales Item No.": item?.ENC_NO_ITEM,
    // "RM TDC": item?.TDC,
    // "Rolling Plan Date": item?.CREATION_DT,
    // "Process Path": item?.PLANNED_PROC,
    // "Created By": item?.USERID,
    // "Geometry": item?.GEOMETRY,
    // "RM Surface Finish": item?.SUR_FINISH,
    // "Multiple Length": item?.MULTIPLE_LEN,

  }));
  const tblHead = Object.keys(newData[0]);
  sheet.addRow(tblHead);
  const tblHeadRow = sheet.rowCount;

  // for (let i in tblHead) {
  debugger;
  for (const [i, [key, value]] of Object.entries(Object.entries(newData[0]))) {
    let index = parseInt(i) + 1;
    sheet.getRow(tblHeadRow).getCell(index).font = {
      bold: true,
      size: 10,
      height: 30,
      color: { 'argb': 'FFFF6600' }
    };


    sheet.getRow(tblHeadRow).getCell(index).alignment = {
      horizontal: "center",
    };

    //sheet.getColumn(index).width = tblHead[i].split("").length + 2;

    var d = "";
    if (value) {
      if (Number(value)) {
        var len = value.toString().length;
        d = len >= 22 ? 17 : len + 2;
        console.log(len, { value: d }, tblHead[i], "Number")
      } else {
        let trim = value.replaceAll(" ", "");
        var f = trim.length >= 30 ? 24 : trim.length;
        if (tblHead[i] == "FC/NFC") {
          d = tblHead[i].split("").length;
        } else {
          if (f == 1) {
            d = tblHead[i].split("").length + 1;
          } else {
            d = value.length + 1;
          }
        }

        console.log(value.length, { value: d }, tblHead[i], "String")
      }
    } else {
      if (value.toString().length == 1) {
        d = tblHead[i].split("").length - 2;
      } else {
        d = tblHead[i].split("").length + 2;
      }
      console.log(tblHead[i], { value: d }, "else")
    };
    sheet.getColumn(index).width = d;

    sheet.getRow(tblHeadRow).getCell(index).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }

  for (let i in newData) {
    const row = Object.values(newData[i]);
    sheet.addRow(row);
    const currentRowIdx = sheet.rowCount;
    for (let i in row) {
      let index = parseInt(i) + 1;
      sheet.getRow(currentRowIdx).getCell(index).alignment = {
        horizontal: "center",
        height: 150,
      };
      sheet.getRow(currentRowIdx).getCell(index).font = {
        bold: true,
        size: 10,
        height: 30,
      };

      let row = sheet.getRow(currentRowIdx);
      row.height = 30;

      sheet.getRow(currentRowIdx).getCell(index).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }

  let summ = "SUM";
  sheet.addRow(summ);


  workbook.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    //var date = new Date();
    var date = format(new Date(), 'dd-MMM-yyyy kk:mm:ss')
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "LDSM040_print " + date.toString() + ".xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};