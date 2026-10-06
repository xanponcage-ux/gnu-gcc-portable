import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ReactSelect from "components/Select/ReactSelect";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Preloader from "components/Preloader/Preloader";
import alertify from "alertifyjs";
import axiosAPI from "../../axiosAPI";
import { GetAuthorization } from "utils";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import routes from "routes";
import jwt from "jsonwebtoken";
import DeleteIcon from "@mui/icons-material/Delete";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

export default function LDSC013() {

  const [loading, setLoading] = useState(false);
  const [isRestricted, setRestricted] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = useState(true);

  const [specList, setSpecList] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const [parameterList, setParameterList] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [hasWriteAccess, setHasWriteAccess] = useState(false);

  const tableRef = useRef(null);

  // ================= INIT =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    GetAuthorization().then((token) => {
      validateUser(token);

      Promise.all([
        getSpecList(token.accessToken),
        getParameterList(token.accessToken),
        getWriteAccess(token.accessToken),
      ]).finally(() => setLoading(false));
    });
  };

  // ================= VALIDATION =================
  const validateUser = async (token) => {
    try {
      const userDetails = jwt.verify(token.refreshToken, serverDetails.REFRESH_KEY);

      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;

      if (!serverDetails.PersonalNo) {
        window.location.href = "#/signin";
      }

      const authDetails = await getScreenAuth(
        userDetails.payload.plant,
        serverDetails.PersonalNo,
        "LDSC013",
        token.accessToken
      );

      if (authDetails) {
        setRestricted(false);

        if (authDetails.payload.PS_AUTH_DML === "Z") {
          setRestricted(true);
        } else if (authDetails.payload.PS_AUTH_DML === "Y") {
          setAdmin(true);

          if (authDetails.payload.LS_READ_WRITE_FLAG === "RL_RW") {
            setReadWriteAccess(false);
            alertify.success("You can modify data");
          } else {
            setReadWriteAccess(true);
            alertify.error("Read-only access");
          }
        }
      }
    } catch {
      setRestricted(true);
    }
  };

  const getScreenAuth = (plant, userId, page, token) =>
    axiosAPI.post(
      "api/users/screenAuth",
      { plantCd: plant, user: userId, page },
      { headers: { Authorization: "Bearer " + token } }
    ).then(res =>
      jwt.verify(res.data, serverDetails.SCREEN_AUTH_KEY)
    );

  // ================= API =================
  const getSpecList = (token) =>
    axiosAPI.post("api/LDSC013/speclist", {}, {
      headers: { Authorization: "Bearer " + token },
    }).then(res => {
      if (res.statusText === "OK") {
        setSpecList(res.data.map(x => ({
          label: x.SPEC,
          value: x.SPEC
        })));
      }
    });
    const getWriteAccess = (token) =>
  axiosAPI.post(
    "api/LDSC013/writeAccess",
    {},
    {
      headers: { Authorization: "Bearer " + token },
    }
  ).then(res => {
    if (res.statusText === "OK") {
      console.log(res.data);
      setHasWriteAccess(Number(res.data?.[0]?.COUNT || 0) > 0);
    }
  });
  const getParameterList = (token) =>
    axiosAPI.post("api/LDSC013/parameters", {}, {
      headers: { Authorization: "Bearer " + token },
    }).then(res => {
      if (res.statusText === "OK") {
        setParameterList(res.data.map(x => ({
          label: x.PARA,
          value: x.PARA,
          UOM: x.UOM
        })));
      }
    });

  const handleDelete = () => {

  if (!hasWriteAccess)
    return alertify.error("Delete access not available");

  if (isReadWriteAccess)
    return alertify.error("No delete permission");


  const selectedRows = tableRef.current.getSelectedData();

  if (selectedRows.length === 0)
    return alertify.error("Please select rows");

  setLoading(true);

  GetAuthorization().then((token) => {

    const deletePayload = [];

    selectedRows.forEach((item) => {
      deletePayload.push({
        USL_SPEC: item.USL_SPEC,
        USL_TEST_PARA: item.USL_TEST_PARA,
        USL_CD_TEST: item.USL_CD_TEST,
        USL_PARA_SEQ_NO: item.USL_PARA_SEQ_NO
      });
    });

    axiosAPI.post(
      "api/LDSC013/deleteRow",
      { data: deletePayload },
      {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      }
    )
    .then((response) => {

      if (
        response.statusText !== "" &&
        response.statusText !== "OK"
      ) {
        alertify.error("Delete failed");
      } else {

        alertify.success(
          response?.data?.message || "Records deleted successfully"
        );

        // Refresh from DB
        getSpecData();

        // OR remove locally
        /*
        const remainingRows = tableData.filter(
          row =>
            !selectedRows.some(
              sel =>
                sel.USL_SPEC === row.USL_SPEC &&
                sel.USL_TEST_PARA === row.USL_TEST_PARA &&
                sel.USL_CD_TEST === row.USL_CD_TEST
            )
        );

        setTableData(remainingRows);
        */
      }
    })
    .catch(() => {
      alertify.error("Error during delete");
    })
    .finally(() => {
      setLoading(false);
    });

  });
};

  const getSpecData = () => {
    if (!selectedSpec) return alertify.error("Select Spec");

    setLoading(true);

    GetAuthorization().then(token => {
      axiosAPI.post(
        "api/LDSC013/getData",
        { SPEC: selectedSpec.value },
        { headers: { Authorization: "Bearer " + token.accessToken } }
      ).then(res => {
        if (res.statusText === "OK") {
          setTableData(res.data || []);
        }
      }).finally(() => setLoading(false));
    });
  };

  // ================= ADD =================
  const handleAddRows = () => {
    if (!selectedSpec || selectedParameters.length === 0) {
      return alertify.error("Select Spec & Parameter");
    }

    const existingParams = new Set(tableData.map(r => r.USL_TEST_PARA));

    const newRows = selectedParameters
      .map(p => {
        const [code, para] = p.value.split("-");
        return {
          USL_SPEC: selectedSpec.value,
          USL_TEST_PARA: para,
          USL_CD_TEST: code,
          USL_PARA_MIN: "",
          USL_PARA_MAX: "",
          USL_PARA_UNIT: p.UOM,
          USL_PARA_SEQ_NO: 1
        };
      })
      .filter(row => !existingParams.has(row.USL_TEST_PARA));

    setTableData([...tableData, ...newRows]);
  };

  // ================= VALIDATION =================
  const validateMinMax = (row) => {
    const min = row.USL_PARA_MIN;
    const max = row.USL_PARA_MAX;

    if (
      min !== null && min !== "" &&
      max !== null && max !== ""
    ) {
      return Number(min) <= Number(max);
    }
    return true;
  };

  // ================= SAVE =================
 const handleSave = () => {

  if (!hasWriteAccess)
    return alertify.error("Save access not available");

  if (isReadWriteAccess)
    return alertify.error("No write permission");


    if (tableData.length === 0)
      return alertify.error("No data");

    for (let row of tableData) {
      if (!validateMinMax(row)) {
        return alertify.error(
          `Min cannot be greater than Max for parameter: ${row.USL_TEST_PARA}`
        );
      }
    }

    GetAuthorization().then(token => {
      axiosAPI.post(
        "api/LDSC013/upsert",
        { data: tableData },
        { headers: { Authorization: "Bearer " + token.accessToken } }
      ).then(res => {
        alertify.success(res?.data?.message || "Saved Successfully");
      }).catch(() =>
        alertify.error("Error during save")
      );
    });
  };

  // ================= TABLE =================
  useEffect(() => {
    if (tableData.length > 0) {

      tableRef.current = new Tabulator("#specTable", {
      data: tableData,
      layout: "fitDataFill",
      height: 400,

      selectableRows: true, // enable row selection

      columns: [
        {
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          hozAlign: "center",
          headerSort: false,
          width: 50
        },
        { title: "Spec", field: "USL_SPEC" },
        { title: "Parameter", field: "USL_TEST_PARA" },
        { title: "Test Code", field: "USL_CD_TEST" },
        { title: "Min", field: "USL_PARA_MIN", editor: "number" },
        { title: "Max", field: "USL_PARA_MAX", editor: "number" },
        { title: "Unit", field: "USL_PARA_UNIT" },
      ],

      rowSelectionChanged: function (data) {
        setSelectedRows(data);
      },

      cellEdited: (cell) => {
        const row = cell.getRow().getData();

        if (!validateMinMax(row)) {
          alertify.error("Min cannot be greater than Max");
          cell.setValue("");
        }

        setTableData(tableRef.current.getData());
      },
    });
    }
  }, [tableData]);

  // ================= DOWNLOAD =================
  const downloadExcel = () => {
    if (!tableRef.current) return alertify.error("No data");
    tableRef.current.download("xlsx", "SpecData.xlsx");
  };

  return (
  <DashboardLayout>
    <DefaultNavbar
      routes={routes}
      module="Common"
      page="SPEC Maintenance"
    />

    {/* LOADER */}
    <Grid container justifyContent="center" alignItems="center">
      {loading && <Preloader />}
    </Grid>

    {/* RESTRICTED */}
    {isRestricted && (
      <Grid container justifyContent="center" alignItems="center">
        <h4 style={{ color: "red", margin: "5rem" }}>
          You are not authorized to view this page !
        </h4>
      </Grid>
    )}

    {/* MAIN */}
    {!isRestricted && (
      <>
        <MDBox pt={6} pb={3} py={10}>
          <Grid container spacing={1}>

            {/* ================= FILTER ================= */}
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
                  <Grid container justifyContent="space-between">
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Filters
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox px={3} py={3}>
                  <Grid container spacing={1}>

                    <Grid item xs={2.5} style={{ zIndex: 5 }}>
                      <MDTypography variant="h6">
                        Spec*
                      </MDTypography>
                      <ReactSelect
                        options={specList}
                        onChange={setSelectedSpec}
                        value={selectedSpec}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <MDButton
                        size="small"
                        color="info"
                        style={{ marginTop: "1.5rem" }}
                        onClick={getSpecData}
                      >
                        Submit
                      </MDButton>
                    </Grid>

                    <Grid item xs={3}>
                      <MDTypography variant="h6">
                        Parameters
                      </MDTypography>
                      <ReactSelect
                        isMulti
                        options={parameterList}
                        value={selectedParameters}
                        onChange={setSelectedParameters}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <MDButton
                        size="small"
                        color="success"
                        style={{ marginTop: "1.5rem" }}
                        onClick={handleAddRows}
                      >
                        Add
                      </MDButton>
                    </Grid>

                  </Grid>
                </MDBox>
              </Card>
            </Grid>

            {/* ================= TABLE HEADER ================= */}
            <Grid item xs={12}>
              <Card style={{ marginTop: "2rem" }}>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={0.5}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <Grid container justifyContent="space-between">
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        SPEC Table
                      </MDTypography>
                    </Grid>

                    <Grid item xs={2}>
                      <Tooltip title="Save">
                        <span>
                          <IconButton
                            color="white"
                            onClick={handleSave}
                            disabled={!hasWriteAccess}
                          >
                            <MDTypography color="white">💾</MDTypography>
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete Selected">
                        <span>
                          <IconButton
                            color="white"
                            onClick={handleDelete}
                            disabled={!hasWriteAccess}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="white" onClick={downloadExcel}>
                          <DownloadForOfflineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* ================= TABLE ================= */}
              <Card style={{ marginTop: "2rem" }}>
                <MDBox px={3} py={2}>
                  <Grid container>
                    <Grid item xs={12}>

                      <div id="specTable" ref={tableRef} />

                      <br />
                      <p
                        style={{
                          color: "black",
                          paddingLeft: "1rem",
                          marginTop: "-1rem",
                        }}
                      >
                        Showing 1 to {tableData.length} of {tableData.length} entries
                      </p>

                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </Grid>

          </Grid>
        </MDBox>
      </>
    )}
  </DashboardLayout>
);
}