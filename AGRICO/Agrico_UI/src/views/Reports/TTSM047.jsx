import React, { useEffect, useState, useMemo } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import  ExcelJS  from "exceljs";

export default function TTSM047() {
  const [loading, setLoading] = useState(true);
  const [isRestricted, setRestricted] = useState(true);
  const [isModelAcces, setModelAcces] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [finalcampignsdata, setfinalcampignsdata] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  // const [tubeMills, setTubeMills] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);



  const [campaigns, setCampaigns] = useState([]);
  const [tubeMills, setTubeMills] = useState([]);



  /** ---------------- Inline css ---------------- **/
  const styles = {
    header: {
      backgroundColor: "#2c3e50",
      color: "#fff",
      padding: "10px",
      marginTop: "1rem",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "0.95rem",
      opacity: 0.9,
    },
    scheduleWrapper: {
      display: "grid",
      gap: "16px",
      color: "#111",
      background: "#fff",
      padding: "7px 10px",
      margin: "10px auto",
      boxShadow: "1px -1px 9px 1px #d1c6c6",
      overflowX: "scroll",
    },
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      border: "1px solid #2e2e2e",
      borderRadius: "8px",
    },
    campaignTable: {
      borderCollapse: "collapse",
      fontSize: "14px",
      width: "100%",
    },
    cellBase: {
      border: "1px solid #2e2e2e",
      padding: "6px 8px",
      textAlign: "center",
      verticalAlign: "middle",
      backgroundColor: "transparent",
    },


    // Group/headers
    groupTitle: {
      fontWeight: 700,
      fontSize: "14px",
    },
    groupLeft: {
      background: "#f5f5f5",
    },

    // Subheader/date rows
    subCol: {
      fontWeight: 600,
      fontSize: "12px",
    },
    dateSpan: {
      background: "#f7f7f7",
      fontWeight: 600,
    },
    // Sticky left (Tube Mill, Daily Target, etc.)
    stickyLeft: {
      position: "sticky",
      left: 0,
      background: "#fafafa",
      zIndex: 2,
    },
    tmCell: { fontWeight: 600 },



    targetCell: {
      fontWeight: 700,
      background: "#f9fafb",
    },
    pagination: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "center",
      margin: "12px 0",
    },
    pageBtn: (disabled = false, active = false) => ({
      padding: "6px 10px",
      borderRadius: "4px",
      border: "1px solid #d0d7de",
      background: active ? "#0d6efd" : "#fff",
      color: active ? "#fff" : "#111",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      borderColor: active ? "#0d6efd" : "#d0d7de",
    }),
  };


  /** --------------- Authintication logic --------------- **/
  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";
      if (serverDetails.devMode == true) {
        // (userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };
      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response.data;
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

  const validateUser = async (token) => {
    try {
      var plant = "";
      {
        var userDetails = jwt.verify(
          token.refreshToken,
          serverDetails.REFRESH_KEY
        );
        plant = userDetails.payload.plant;
        serverDetails.PersonalNo = userDetails.payload.id;
        serverDetails.Plant = userDetails.payload.plant;
        serverDetails.Company = userDetails.payload.company;
      }
      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo == ``
      ) {
        window.location.href = "#/signin";
      }
      var userId = serverDetails.PersonalNo;
      var pageName = "TTSM047";
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
            setModelAcces(true);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
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
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
            });
            setPlant(items);
            setSelectedPlant(items[0]);
            // Promise.all([ getMatGrp(items[0], accessToken) ]).finally(() => {
            //     resolve();
            //   });
            resolve();
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {

      });
      setLoading(false);
    });
  }

  // page load
  useEffect(() => {
    fetchData();
  }, []);

  const getFinalcampaignData = async () => {
    try {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        var data = { Plant: selectedPlant?.value };
        axiosAPI.post("/api/TTSM047/getFinalcampaignData", data, defaultOptions).then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(null);
            alertify.error('No Data found.')
          } else {
            // setfinalcampignsdata(response.data);
            if (response.data.campaigns.length > 0){
            setCampaigns(response.data.campaigns || []);
            setTubeMills(response.data.tubeMills || []);
            }else{
              alertify.error('No data found');
            }
          }
        });
      });
    } catch (error) {
      // console.error("Error in getFinalcampaignData:", error);
      alertify.error("Error in getFinalcampaignData:", error);
    }
  };

  const getRunModel = async () => {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
      setLoading(true);
      var url = "/api/TTSM047/runModel";
      axiosAPI.get(url,defaultOptions).then((response) => {
        if (response.status ==200) {
          alertify.success('Model executed Succesfully.');
        } else {
         // reject(response.status);
          alertify.error('Model not executed Succesfully. Please try again.');
        }
      }).catch((err) => {
        alertify.error('Model not executed Succesfully. Please try again. ' + err);
      }).finally(() => {
        setLoading(false);
        setCampaigns([]);
        setTubeMills([]);
      });
      });
  }

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
      setCampaigns([]);
      setTubeMills([]);
    
    }
  };

  const handleClearAll =()=>{
    setSelectedPlant(null);
    setCampaigns([]);
    setTubeMills([]);
  }

  const groupColors = ['#ffbb91', '#419ad4', '#f38c78', '#9dceb3'];


  /* -------------------- Pagination -------------------- */

  const pageSize = 3; // change if needed
  const pageCount = Math.max(1, Math.ceil(campaigns.length / pageSize));

  const visibleCampaigns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return campaigns.slice(start, start + pageSize);
  }, [campaigns, currentPage]);

  const goToPage = (p) => {
    if (p < 1 || p > pageCount) return;
    setCurrentPage(p);
  };
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  /* -------------------- Daily Target -------------------- */
  const getDailyTarget = (campaign) =>
    Object.values(campaign.mills || {})
      .flatMap((m) => Object.values(m))
      .reduce((sum, v) => sum + Number(v || 0), 0)
      .toFixed(3);


/*-------------------------------------------------------------*/

  const exportAllPagesExcel = async () => {
    if (!campaigns.length || !tubeMills.length) {
      alertify.error("No data available to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tube Mill Plan");

    /* ================= HEADER ROWS ================= */

    const headerRow1 = ["Tube Mill"];
    const headerRow2 = [""];
    const headerRow3 = [""];

    campaigns.forEach((c) => {
      headerRow1.push(...Array(c.columns.length).fill(c.campaignId));
      headerRow2.push(...c.columns);
      headerRow3.push(...Array(c.columns.length).fill(c.date));
    });

    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);
    worksheet.addRow(headerRow3);

    /* ================= MERGES (HEADERS) ================= */

    worksheet.mergeCells(1, 1, 3, 1); // Tube Mill rowspan

    let colIndex = 2;

    campaigns.forEach((c) => {
      const span = c.columns.length;

      worksheet.mergeCells(1, colIndex, 1, colIndex + span - 1); // Campaign
      worksheet.mergeCells(3, colIndex, 3, colIndex + span - 1); // Date

      colIndex += span;
    });

    /* ================= DATA ROWS ================= */

    tubeMills.forEach((tm) => {
      const row = [tm];
      campaigns.forEach((c) => {
        c.columns.forEach((col) => {
          row.push(typeof c.mills?.[tm]?.[col] === "number" ? Math.round(c.mills[tm][col]):c.mills?.[tm]?.[col] ?? 0);
        });
      });
      worksheet.addRow(row);
    });

    /* ================= DAILY TARGET (BLANK & MERGED) ================= */

    const targetRowNumber = worksheet.rowCount + 1;
    worksheet.addRow(["Daily Target"]);

    colIndex = 2;
    campaigns.forEach((c) => {
      const span = c.columns.length;
      worksheet.mergeCells(targetRowNumber, colIndex, targetRowNumber, colIndex + span - 1);
      colIndex += span;
    });

    /* ================= STYLING ================= */

    // Header border + alignment
    [1, 2, 3].forEach((rowNum) => {
      worksheet.getRow(rowNum).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Tube Mill column style
    worksheet.getColumn(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    /* ================= CAMPAIGN COLORS ================= */

    colIndex = 2;
    campaigns.forEach((c, idx) => {
      const span = c.columns.length;
      const hex = groupColors[idx % groupColors.length].replace("#", "");

      const color = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${hex.toUpperCase()}` },
      };

      // Apply color to campaign header row
      for (let cIdx = colIndex; cIdx < colIndex + span; cIdx++) {
        worksheet.getRow(1).getCell(cIdx).fill = color;
      }

      colIndex += span;
    });

    /* ================= COLUMN WIDTHS ================= */

    worksheet.columns = [
      { width: 18 },
      ...Array(colIndex).fill({ width: 14 }),
    ];

    /* ================= FREEZE PANES ================= */

    worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];

    /* ================= DOWNLOAD ================= */

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Tube_Mill_Rolling_Plan_${new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "_")}.xlsx`;

    a.click();
    URL.revokeObjectURL(url);
  };


  /* -------------------- Render -------------------- */

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Tube Mill Rolling Plan" />
      <Grid container direction="row" justifyContent="center" alignItems="center">
        {loading && <Preloader />}
      </Grid>

      {isRestricted && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}

      {isRestricted == false && (
        <>
          <Grid item xs={12} pt={10}>
            <Card >
              <MDBox
                mx={2}
                mt={-3}
                py={0.25}
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
                  <Grid item xs={8}></Grid>
                  <Grid item xs={1}>
                    <Tooltip title="Clear All">
                      <IconButton
                        color="white"
                        onClick={() => handleClearAll(true)}
                      >
                        <ClearAllIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={1}>
                    <Tooltip title="Download">
                      <IconButton
                        color="white"
                        onClick={exportAllPagesExcel }
                      >
                        <DownloadForOfflineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox px={3} py={1.5}>
                <Grid container spacing={1}>
                  <Grid item xs={2.5} style={{ zIndex: 5 }}>
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Plant *
                    </MDTypography>
                    <ReactSelect
                      style={{
                        zIndex: 5,
                      }}
                      id="plant"
                      options={plant}
                      value={selectedPlant}
                      onChange={handlePlantChange}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <MDButton
                      style={{ marginTop: "1.5rem" }}
                      size="small"
                      color="info"
                      onClick={() => getFinalcampaignData()}
                    >
                      Submit
                    </MDButton>
                  </Grid>
                  <Grid item xs={1}>
                    <MDButton
                      style={{ marginTop: "1.5rem" }}
                      size="small"
                      color="info"
                      disabled={!isModelAcces}
                      onClick={() => getRunModel()}
                    >
                      Run Model
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
          {/* Header */}
          <div style={styles.header}>
            <h3>Tube Mill Rolling Plan</h3>
            <div style={styles.subtitle}>
              Planning Date: {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}{" "}
            </div>
          </div>

          {/* Wrapper */}
          <div style={styles.scheduleWrapper}>
            {/* Table */}
            <div style={styles.tableContainer}>
              <table style={styles.campaignTable}>
                <thead>
                  {/* ================= GROUP HEADER ================= */}
                  <tr>
                    <th
                      rowSpan={3}
                      style={{
                        ...styles.cellBase,
                        ...styles.stickyLeft,
                        ...styles.groupLeft,
                      }}
                    >
                      Tube Mill
                    </th>

                    {visibleCampaigns.map((c, idx) => (
                      <th
                        key={`${c.campaignId}-${c.date}`}
                        colSpan={c.columns.length}
                        style={{
                          ...styles.cellBase,
                          ...styles.groupTitle,
                          backgroundColor: groupColors[idx % groupColors.length],
                        }}
                      >
                        {c.campaignId}
                      </th>
                    ))}
                  </tr>

                  {/* ================= COLUMN LABELS ================= */}
                  <tr>
                    {visibleCampaigns.map((c) =>
                      c.columns.map((col) => (
                        <th
                          key={`${c.campaignId}-${col}`}
                          style={{ ...styles.cellBase, ...styles.subCol }}
                        >
                          {col}
                        </th>
                      ))
                    )}
                  </tr>

                  {/* ================= DATE ROW ================= */}
                  <tr>
                    {visibleCampaigns.map((c) => (
                      <th
                        key={`${c.campaignId}-date`}
                        colSpan={c.columns.length}
                        style={{ ...styles.cellBase, ...styles.dateSpan }}
                      >
                        {c.date}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* ================= MILL ROWS ================= */}
                  {tubeMills.map((tm) => (
                    <tr key={tm}>
                      <th
                        style={{
                          ...styles.cellBase,
                          ...styles.stickyLeft,
                          ...styles.tmCell,
                        }}
                      >
                        {tm}
                      </th>

                      {visibleCampaigns.map((c) =>
                        c.columns.map((col) => (
                          <td
                            key={`${tm}-${c.campaignId}-${col}`}
                            style={styles.cellBase}
                          >
                            {
                              typeof c.mills?.[tm]?.[col] === "number"
                                ? Math.round(c.mills[tm][col])
                                : c.mills?.[tm]?.[col] ?? 0
                            }

                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  {/* ================= DAILY TARGET ================= */}
                  <tr>
                    <th
                      style={{
                        ...styles.cellBase,
                        ...styles.stickyLeft,
                        ...styles.targetCell,
                      }}
                    >
                      Daily Target
                    </th>

                    {visibleCampaigns.map((c) => (
                      <td
                        key={`${c.campaignId}-target`}
                        colSpan={c.columns.length}
                        style={{ ...styles.cellBase, ...styles.targetCell }}
                      >
                        {/* {Object.values(c.mills)
                          .flatMap(m => Object.values(m))
                          .reduce((sum, v) => sum + Number(v || 0), 0)
                          .toFixed(3)} */}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>

            </div>

            {/* Simple pagination (optional UI) */}
            <div style={styles.pagination}>
              <button
                onClick={prevPage}
                disabled={currentPage == 1}
                style={styles.pageBtn(currentPage == 1)}
              >
                Prev
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  style={styles.pageBtn(false, currentPage == p)}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage == pageCount}
                style={styles.pageBtn(currentPage == pageCount)}
              >
                Next
              </button>
            </div>

          </div>
        </>
      )}
    </DashboardLayout>
  );
}
