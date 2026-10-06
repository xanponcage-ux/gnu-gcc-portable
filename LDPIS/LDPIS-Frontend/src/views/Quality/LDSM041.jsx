import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { GetAuthorization } from "utils";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function LDSM041() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [batchId, setBatchId] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = React.useState([]);
  const [selectedBatchStatus, setSelectedBatchStatus] = React.useState("HOLD");

  const [gridData, setGridData] = useState([]);
  const [btchData, setBtchData] = useState([]);
  const [rsnData, setRsnData] = useState([]);
  const [indexFind, setClickIndexModal] = useState(null);
  const [btchTableRef, setBtchTableRef] = useState(null);
  const [tableRef, setTableRef] = useState(null);
  const [gridTableRef, setGridTableRef] = useState(null);

  const [open, setOpen] = React.useState(false);

  const gridCol = [
    { title: "Batch", field: "BATCHID", width: "100" },
    // {
    //     title: "Net Wt", field: "LOM_MS_PIECE_ACTL", width: "100",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "Batch Wt",
      field: "LOM_MS_GROSS_CAL",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Batch Wt UOM", field: "LOM_UOM", width: "150" },
    { title: "Material No", field: "MATERIAL_NO", width: "170" },
    { title: "Material Desc", field: "MATERIAL_DESC", width: "200" },
    { title: "Status", field: "LOM_CD_STATUS", width: "80" },
    { title: "Status Desc", field: "CD_DESC", width: "200" },
    {
      title: "Thick",
      field: "LOM_SEC1",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia/Width",
      field: "LOM_SEC2",
      width: "120",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LOM_LENGTH",
      width: "80",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Customer Name", field: "ENC_CUST_NAME", width: "200" },
    { title: "Order", field: "LOM_ID_ORDER_CUS", width: "150" },
    { title: "Item", field: "LOM_ID_ORD_ITEM_CUS", width: "100" },
    { title: "Curr Proc", field: "LOM_CD_CURR_PROC", width: "100" },
    { title: "Next Proc", field: "LOM_CD_NEXT_PROC", width: "100" },
    { title: "TDC / Grade", field: "LOM_TDC_ACTL", width: "120" },
    { title: "Prod Code", field: "LOM_CD_PROD", width: "110" },
    { title: "Quality", field: "LOM_CD_QLTY_ACTL", width: "100" },
  ];
  const gridColHold = [
    { title: "Batch", field: "BATCHID", width: "100" },
    // {
    //     title: "Net Wt", field: "LOM_MS_PIECE_ACTL", width: "100",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "Batch Wt",
      field: "LOM_MS_GROSS_CAL",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Batch Wt UOM", field: "LOM_UOM", width: "150" },
    { title: "Material No", field: "MATERIAL_NO", width: "170" },
    { title: "Material Desc", field: "MATERIAL_DESC", width: "200" },
    { title: "Status", field: "LOM_CD_STATUS", width: "80" },
    { title: "Status Desc", field: "CD_DESC", width: "200" },
    {
      title: "Thick",
      field: "LOM_SEC1",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia/Width",
      field: "LOM_SEC2",
      width: "120",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LOM_LENGTH",
      width: "80",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Customer Name", field: "ENC_CUST_NAME", width: "200" },
    { title: "Order", field: "LOM_ID_ORDER_CUS", width: "150" },
    { title: "Item", field: "LOM_ID_ORD_ITEM_CUS", width: "100" },
    { title: "Curr Proc", field: "LOM_CD_CURR_PROC", width: "100" },
    { title: "Next Proc", field: "LOM_CD_NEXT_PROC", width: "100" },
    { title: "TDC / Grade", field: "LOM_TDC_ACTL", width: "120" },
    { title: "Hold Rsn", field: "HOLD_RSN", width: "100" },
    { title: "Hold Desc", field: "HOLD_DESC", width: "100" },
    { title: "Operation Remarks", field: "OP_REMARKS", width: "170" },
    { title: "Hold By", field: "HOLD_BY", width: "100" },
    {
      title: "Hold Dt",
      field: "HOLD_DT",
      width: "170",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          const d = new Date(value);
          // return date.toLocaleDateString('en-GB', {
          //     day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
          // }).replace(/ /g, '-');

          return (
            ("0" + d.getDate()).slice(-2) +
            "-" +
            d.toString().substr(4, 3) +
            "-" +
            d.getFullYear() +
            " " +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2) +
            ":" +
            ("0" + d.getSeconds()).slice(-2)
          );
        }

        return value;
      },
    },
    { title: "Prod Code", field: "LOM_CD_PROD", width: "110" },
    { title: "Quality", field: "LOM_CD_QLTY_ACTL", width: "100" },
  ];

  const btchCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      width: 50,
    },
    {
      title: "Batch",
      field: "BatchId",
      width: "200",
      cellClick: function (e, cell) {
        {
          copyTable(cell);
        }
      },
    },
    {
      title: "Hold Rsn",
      field: "HoldRsn",
    },
    {
      formatter: () => {
        return "<i class='fa-solid fa-square' style='color:#49a3f1'></i>";
      },
      width: 40,
      cellClick: function (e, cell) {
        handleClickOpen(cell);
      },
    },
    { title: "Description", field: "Desc", width: "200" },
    {
      title: "Operation Remarks",
      field: "OP_REMARKS",
      editor: "input",
      editor: "input",
      width: "200",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        var value = cell.getValue();
        if (value) {
          return value;
        }
        return value;
      },
    },
    { title: "Hold Date-Time", field: "holdDateTime", width: "200" },
    { title: "Hold By", field: "userId" },
    { title: "Previous", field: "PREV" },
    { title: "Released By", field: "RLSBY" },
    { title: "Released Remarks", field: "RLSRMK" },
    { title: "Released Date-Time", field: "RLSTIME" },
  ];

  const rsnCol = [
    {
      title: "Reason Code",
      field: "CD_DESC",
      cellClick: function (e, cell) {
        {
          copyTableModal(cell);
        }
      },
    },
    {
      title: "Reason",
      field: "CD_HOLD",
      cellClick: function (e, cell) {
        {
          copyTableModal(cell);
        }
      },
    },
  ];

  useEffect(() => {
    if (
      selectedBatchStatus === "HOLD" &&
      btchTableRef === null &&
      btchData?.length > 0
    ) {
      setBtchTableRef(
        new Tabulator("#btchTable", {
          data: btchData,
          columns: btchCol,
          layout: "fitColumns",
        })
      );
    } else if (btchData?.length === 0) {
      setBtchTableRef(null);
    }
    if (open && tableRef === null && rsnData?.length > 0) {
      setTableRef(
        new Tabulator("#modalTable", {
          height: 400,
          pagination: "local",
          paginationSize: 200,
          data: rsnData,
          columns: rsnCol,
        })
      );
    } else if (rsnData?.length === 0) {
      setTableRef(null);
    }
    if (gridTableRef === null && gridData?.length > 0) {
      setGridTableRef(
        new Tabulator("#gridTable", {
          data: gridData,
          columns:
            selectedBatchStatus === "UPDATE REMARKS" ? gridColHold : gridCol,
          layout: "fitColumns",
        })
      );
    } else if (gridData?.length === 0) {
      setGridTableRef(null);
    }
  }, [btchTableRef, gridTableRef, tableRef, gridData, rsnData, btchData]);

  const handleClickOpen = (cell) => {
    setClickIndexModal(cell._cell?.row?.position);
    getSecRsns();
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);

  const copyTable = (cell) => {
    if (cell) {
      alertify.error("Batch can be hold against single hold reason");
      return;
    }
    const d = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB', {
    //     day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
    // }).replace(/ /g, '-');

    var formattedDate =
      ("0" + d.getDate()).slice(-2) +
      "-" +
      d.toString().substr(4, 3) +
      "-" +
      d.getFullYear() +
      " " +
      ("0" + d.getHours()).slice(-2) +
      ":" +
      ("0" + d.getMinutes()).slice(-2) +
      ":" +
      ("0" + d.getSeconds()).slice(-2);

    var array = btchData;
    var index = array.findIndex(({ id }) => id === cell._cell.row.data.id);
    if (cell._cell.row.data.id) {
      array[index] = {
        BatchId: selectedBatchId?.value,
        Desc: btchData[0].Desc,
        Holdrsn: btchData[0].Holdrsn,
        holdDateTime: formattedDate,
        id: cell._cell.row.position - 1,
        userId: serverDetails.PersonalNo,
      };
    }
    var table = cell._cell.row.table;
    table.replaceData(array);
    setBtchTableRef(null);
    setBtchData(array);
  };

  const handleClose = (cell = false) => {
    if (cell) {
      setOpen(false);
      var arrayUpdate = btchData;
      var selectedRows = indexFind - 1;
      if (selectedRows.length == 0) {
        alertify.error("No rows selected");
        return;
      }

      var index = arrayUpdate.findIndex(({ id }) => id === selectedRows);
      if (index != null) {
        arrayUpdate[index] = {
          BatchId: selectedBatchId?.value,
          Desc: cell._cell?.row.data.CD_DESC,
          HoldRsn: cell._cell?.row.data.CD_HOLD,
          holdDateTime: btchData[index].holdDateTime,
          id: btchData[index].id,
          UserId: serverDetails.PersonalNo,
        };
      }
      const varBatchId = [];
      if (btchTableRef?.getSelectedRows()?.length > 0) {
        btchTableRef.getSelectedRows().map((x) => {
          varBatchId.push(x.getIndex());
        });
      }
      btchTableRef.replaceData(arrayUpdate);
      if (varBatchId?.length > 0) {
        varBatchId.map((x) => {
          btchTableRef.selectRow(x);
        });
      }
    } else {
      setOpen(false);
    }
  };

  const copyTableModal = (cell) => {
    handleClose(cell);
  };

  const validateUser = async (token) => {
    try {
      var plant = "";
      var userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );
      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LDSM041";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
        // }
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch {
      setRestricted(true);
      setAdmin(false);
      if (serverDetails.devMode == false) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode == true) {
        //(userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response?.statusText != "" && response?.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response?.data;
          var authDetails = jwt.verify(
            encryptUserInfo,
            serverDetails.SCREEN_AUTH_KEY
          );
          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = [];
            response?.data?.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
            });
            setPlant(items);
            setSelectedPlant(items[0]);
            Promise.all([getBatch(items[0], accessToken)]).finally(() => {
              resolve();
            });
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  useEffect(() => {
    setBatchId([]);
    setSelectedBatchId([]);
    if (selectedPlant?.value?.length > 0) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([getBatch(selectedPlant, token.accessToken)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
  }, [selectedBatchStatus]);

  const getBatch = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      if (value?.value) {
        var url = "api/LDSM041/getBatchId";
        axiosAPI
          .post(
            url,
            { plant: value.value, status: selectedBatchStatus },
            defaultOptions
          )
          .then((response) => {
            if (response?.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              var items = [];
              response?.data?.map((row) => {
                var obj = new Object();
                obj.label = row[0];
                obj.value = row[0];
                items.push(obj);
              });
              setBatchId(items);
            }
          })
          .finally(() => {
            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  const getSecRsns = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM041/getSecRsn";
      axiosAPI
        .post(url, "", defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response?.data?.rsnData) {
              setOpen(true);
              setTableRef(null);
              setRsnData(response.data.rsnData);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
          setOpen(true);
        });
    });
  };

  const resetData = (status) => {
    setGridData([]);
    setRsnData([]);
    setBtchData([]);
    if (status) {
      setSelectedBatchId([]);
      setBatchId([]);
    }
  };

  const handlePlantChange = (value) => {
    resetData(true);
    setSelectedPlant(value);
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getBatch(value, token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleClearAll = () => {
    resetData(true);
    setSelectedPlant([]);
  };

  const handleBatchIdChange = (value) => {
    resetData(false);
    setSelectedBatchId(value);
  };

  const getSubmitData = () => {
    if (
      !selectedBatchId?.value?.length > 0 ||
      !selectedPlant?.value?.length > 0 ||
      selectedBatchStatus?.value?.length > 0
    ) {
      alertify.error("Please select all the mandatory fields!");
      return;
    }
    const d = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB', {
    //     day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
    // }).replace(/ /g, '-');

    var formattedDate =
      ("0" + d.getDate()).slice(-2) +
      "-" +
      d.toString().substr(4, 3) +
      "-" +
      d.getFullYear() +
      " " +
      ("0" + d.getHours()).slice(-2) +
      ":" +
      ("0" + d.getMinutes()).slice(-2) +
      ":" +
      ("0" + d.getSeconds()).slice(-2);

    setLoading(true);
    var url;

    var data = {
      BatchId: selectedBatchId?.value,
      plant: selectedPlant.value,
      status: selectedBatchStatus,
    };

    url = "api/LDSM041/getSubDetails";
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, { data }, defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // setSubmtDet(response);
            if (response?.data?.gridData[0]) {
              setGridData(response.data.gridData);
              setBtchData([
                {
                  BatchId: selectedBatchId?.value,
                  OP_REMARKS: response.data.gridData[0]["OP_REMARKS"],
                  Desc: "",
                  Holdrsn: "",
                  holdDateTime: formattedDate,
                  id: 0,
                  userId: serverDetails.PersonalNo,
                },
                // ...[...Array(9)].map((it, i) => ({ id: i + 1 }))
              ]);
            } else {
              alertify.error("No Data Found");
              setBtchData([]);
              setGridData([]);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const submitHold = async () => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    var selectedRows = btchTableRef?.getSelectedRows();
    if (selectedRows === undefined || selectedRows?.length == 0) {
      alertify.error("No rows selected");
      return;
    }
    if (selectedRows[0]?._row.data?.HoldRsn === undefined) {
      alertify.error("Please select the hold rsn!");
      return;
    }
    var url = "api/LDSM041/getBtnHold";
    var data = {
      pUser: serverDetails.PersonalNo,
      plant: selectedPlant.value ? selectedPlant.value : "",
      pUser: serverDetails.PersonalNo,
      batch: selectedRows[0]?._row.data?.BatchId,
      holdRsn: selectedRows[0]?._row.data?.HoldRsn,
      remarks: selectedRows[0]?._row.data?.OP_REMARKS,
      currProc: gridData[0]?.LOM_CD_CURR_PROC,
      nextProc: gridData[0]?.LOM_CD_NEXT_PROC,
      netWt: gridData[0]?.LOM_MS_PIECE_ACTL,
      flag: selectedBatchStatus,
      status: gridData[0]?.LOM_CD_STATUS,
    };
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
          } else {
            setSelectedBatchId([]);
            if (response?.data?.substr(0, 2) === "Y-") {
              alertify.success(response?.data);
            } else if (response?.data?.substr(0, 2) === "N-") {
              alertify.error(response?.data);
            } else {
              alertify.success(response?.data);
            }
            setBtchData([]);
            setGridData([]);
            resetData(true);
            if (selectedPlant.value) {
              setBatchId([]);
              Promise.all([getBatch(selectedPlant, token.accessToken)]).finally(
                () => {
                  setLoading(false);
                }
              );
            } else {
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const btnUpdate = async (token) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };
    var selectedRows = btchTableRef?.getSelectedRows();
    if (selectedRows === undefined || selectedRows?.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    setLoading(true);
    var url = "api/LDSM041/updateOprRemark";

    var data = {
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Batch_id: selectedBatchId?.value,
      OprRemaks: selectedRows[0]._row.data.OP_REMARKS,
      userid: serverDetails.PersonalNo,
      PrevOprRemaks: "",
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response?.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response?.data?.rowsAffected == 0) {
            alertify.error("Error Update Operator Remarks!");
          } else {
            alertify.success("Successfully Updated Operator Remarks");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Hold & Release Batch"
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading && <Preloader />}
      </Grid>
      {isRestricted && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Select Reason
        </BootstrapDialogTitle>
        <DialogContent>
          {rsnData?.length ? <div id="modalTable" /> : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={1}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Filters
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll()}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={2.5} style={{ zIndex: "5" }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Plant *{" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          onChange={handlePlantChange}
                          value={selectedPlant}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: "5" }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Batch Id *
                        </MDTypography>
                        <ReactSelect
                          id="batchId"
                          options={batchId}
                          value={selectedBatchId}
                          onChange={handleBatchIdChange}
                        />
                      </Grid>

                      <Grid item xs={0.75}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getSubmitData()}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>
                      </Grid>

                      <Grid item xs={2} style={{ zIndex: "5" }}>
                        <FormControl
                          style={{
                            minWidth: "400px",
                            marginTop: "17px",
                          }}
                        >
                          <RadioGroup
                            style={{
                              flexWrap: "nowrap",
                            }}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={selectedBatchStatus}
                            onChange={(e) => {
                              resetData(false);
                              setSelectedBatchStatus(e.target.value);
                            }}
                          >
                            <FormControlLabel
                              value="HOLD"
                              control={<Radio />}
                              label="Display Unhold Batch"
                            />
                            <FormControlLabel
                              value="UPDATE REMARKS"
                              control={<Radio />}
                              label="Display Hold Batch"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox px={3} py={3}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {gridData?.length ? <div id="gridTable" /> : null}
                        <br />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              {selectedBatchStatus === "HOLD" ? (
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={0.25}
                      px={1}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={11}>
                          <MDTypography variant="h6" color="white">
                            QA Hold on Batch
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Hold / Update Remarks" arrow>
                            <span>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => submitHold()}
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={2}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                      ></Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {btchData.length > 0 ? <div id="btchTable" /> : null}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              ) : null}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
