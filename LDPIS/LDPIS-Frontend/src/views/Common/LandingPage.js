import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import FlashOn from "@material-ui/icons/FlashOn";
// import Save from "@material-ui/icons/Save";

// import CloudDownload from "@material-ui/icons/CloudDownload";
// import Print from "@material-ui/icons/Print";
// import ClearAll from "@material-ui/icons/ClearAll";
// import Home from "@material-ui/icons/HomeOutlined";
// import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
// // core components
// import Grid from "@material-ui/core/Grid";
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import Slide from "@material-ui/core/Slide";
// import IconButton from "@material-ui/core/IconButton";
// import Close from "@material-ui/icons/Close";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import OnlyLogOut from "components/Header/OnlyLogOut";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Small from "components/Typography/Small.js";
import Danger from "components/Typography/Danger.js";
import Warning from "components/Typography/Warning.js";
import Success from "components/Typography/Success.js";
import Info from "components/Typography/Info.js";
import Primary from "components/Typography/Primary.js";
import Muted from "components/Typography/Muted.js";

import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

import Preloader from "components/Preloader/Preloader";
import SingleSelectDDL from "components/Select/ReactSelect";
import MultiSelectDDL from "components/Select/ReactMultiSelect";

import alertify from "alertifyjs";
import "../alertifyjs.css";
import "moment/locale/en-gb.js";
//import { DatePicker, DatePickerInput } from "rc-datepicker";
import "rc-datepicker/lib/style.css";

import axios from "axios";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import jwt from "jsonwebtoken";

import DatePicker from "components/DateTime/DatePicker";
import DateTimePicker from "components/DateTime/DateTimePicker";
import CurrentWeek from "views/Common/CurrentWeek";
import CurrentDate from "views/Common/CurrentDate";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import ListItem from "@material-ui/core/ListItem";
// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
// @material-ui/icons
import { Apps, PowerSettingsNew } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      if (initialLoad == false) {
        //const response = await getAuthorization();
        //validateUser("", false);
        setInitialLoad(true);
      }
    }
    fetchData();
  }, []);


  const classes = useStyles();
  const { ...rest } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  return (
    <div>
      <Header
        color="primary"
        brand="TSK CRM MES"
        rightLinks={<OnlyLogOut />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        {...rest}
      />

      <div
        className={classNames(classes.main, classes.mainRaised)}
        style={{ marginTop: "5rem" }}
      >
        <GridContainer justify="space-between" style={{ marginRight: "1rem" }}>
          <GridContainer style={{ marginLeft: "2rem", marginTop: "1rem" }}>
            <Breadcrumbs aria-label="breadcrumb">
              {/* <Link color="inherit" href="/" >
        <Home/>
      </Link> */}
              <Link color="inherit">TSK CRM MES</Link>
              <Typography color="textPrimary">Landing Page</Typography>
            </Breadcrumbs>
          </GridContainer>
        </GridContainer>
        <GridContainer justify="center" style={{ margin: "1rem" }}>
          {loading && <Preloader />}
        </GridContainer>
        {isRestricted && (
          <GridContainer justify="center">
            <h4 style={{ color: "red" }}>
              You are not authorized to view this page !
            </h4>
          </GridContainer>
        )}
        {isRestricted == false && (
          <>
            <GridContainer
              style={{
                marginLeft: "2rem",
                marginTop: "1rem",
                marginRight: "1rem",
              }}
            >
              <GridItem xs={3}>
                <Card>
                  <CardHeader
                    color="primary"
                    className={classes.cardHeader}
                    style={{ padding: "0.1rem 10px" }}
                  >
                    <Button
                      aria-controls="simple-menu1"
                      aria-haspopup="true"
                      onClick={handleClick}
                      simple
                      color="white"
                      endIcon={<Icon>send</Icon>}
                    >
                      Planning & Scheduling
                    </Button>
                    <Menu
                      id="simple-menu1"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs001"
                        className={classes.dropdownLink}
                        keepMounted
                      >
                        Coil Linking
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs002"
                        className={classes.dropdownLink}
                      >
                        Coil De-Linking
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs003"
                        className={classes.dropdownLink}
                      >
                        Coil Switching
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs005"
                        className={classes.dropdownLink}
                      >
                        Audit For Link/Delink/Switch
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs006"
                        className={classes.dropdownLink}
                      >
                        Order Progress
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs007"
                        className={classes.dropdownLink}
                      >
                        Order Summary for Material design/Redesign/Audit
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs008"
                        className={classes.dropdownLink}
                      >
                        Material Design Result
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs009"
                        className={classes.dropdownLink}
                      >
                        Inventory Report
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs010"
                        className={classes.dropdownLink}
                      >
                        Wasteful Inventory
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs011"
                        className={classes.dropdownLink}
                      >
                        TCM Monthly/Daily Rolling plan
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cvs013"
                        className={classes.dropdownLink}
                      >
                        Daily Diversion And linking report
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cps001"
                        className={classes.dropdownLink}
                      >
                        PLTCM Scheudling
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1css004"
                        className={classes.dropdownLink}
                      >
                        Scheduling Rules
                      </MenuItem>
                    </Menu>
                  </CardHeader>
                  <CardBody></CardBody>
                </Card>
              </GridItem>
              <GridItem xs={3}>
                <Card>
                  <CardHeader
                    color="success"
                    className={classes.cardHeader}
                    style={{ padding: "0.1rem 10px" }}
                  >
                    <Button
                      aria-controls="simple-menu2"
                      aria-haspopup="true"
                      onClick={handleClick2}
                      simple
                      color="white"
                      endIcon={<Icon>send</Icon>}
                    >
                      Operations
                    </Button>
                    <Menu
                      id="simple-menu2"
                      anchorEl={anchorEl2}
                      open={Boolean(anchorEl2)}
                      onClose={handleClose2}
                      keepMounted
                    >
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps001"
                        className={classes.dropdownLink}
                      >
                        Input Coil Management
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps002"
                        className={classes.dropdownLink}
                      >
                        Input Coil Receive
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps003"
                        className={classes.dropdownLink}
                      >
                        Schedule Confirmation
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps004"
                        className={classes.dropdownLink}
                      >
                        PDI Rearrangement
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps005"
                        className={classes.dropdownLink}
                      >
                        Coil Tracking
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps007"
                        className={classes.dropdownLink}
                      >
                        Process Result Enquiry
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps008"
                        className={classes.dropdownLink}
                      >
                        Delay Management
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps009"
                        className={classes.dropdownLink}
                      >
                        DTPOH VS TPOH
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps010"
                        className={classes.dropdownLink}
                      >
                        Purchase Coil Handling
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps011"
                        className={classes.dropdownLink}
                      >
                        Back Up screens
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps012"
                        className={classes.dropdownLink}
                      >
                        Production Report
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps013"
                        className={classes.dropdownLink}
                      >
                        FCHR Defect Logging
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1fps031"
                        className={classes.dropdownLink}
                      >
                        Cold Coil Enquiry
                      </MenuItem>
                    </Menu>
                  </CardHeader>
                  <CardBody></CardBody>
                </Card>
              </GridItem>
              <GridItem xs={3}>
                <Card>
                  <CardHeader
                    color="danger"
                    className={classes.cardHeader}
                    style={{ padding: "0.1rem 10px" }}
                  >
                    <Button
                      aria-controls="simple-menu3"
                      aria-haspopup="true"
                      onClick={handleClick3}
                      simple
                      color="white"
                      endIcon={<Icon>send</Icon>}
                    >
                      Quality
                    </Button>
                    <Menu
                      id="simple-menu3"
                      anchorEl={anchorEl3}
                      open={Boolean(anchorEl3)}
                      onClose={handleClose3}
                      keepMounted
                    >
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls001"
                        className={classes.dropdownLink}
                      >
                        Sample and test result management
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls002"
                        className={classes.dropdownLink}
                      >
                        Quality decision
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls003"
                        className={classes.dropdownLink}
                      >
                        Coil hold management
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls004"
                        className={classes.dropdownLink}
                      >
                        Hold and coil processing
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls005"
                        className={classes.dropdownLink}
                      >
                        Lab KPI Report
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls006"
                        className={classes.dropdownLink}
                      >
                        Batch Defect Management
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls007"
                        className={classes.dropdownLink}
                      >
                        Coil lab analysis
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls008"
                        className={classes.dropdownLink}
                      >
                        Enquiry life cycle
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls009"
                        className={classes.dropdownLink}
                      >
                        Quality summary screen
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls011"
                        className={classes.dropdownLink}
                      >
                        Detail Investigation
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls013"
                        className={classes.dropdownLink}
                      >
                        LAB audit
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls014"
                        className={classes.dropdownLink}
                      >
                        TDC Master Table
                      </MenuItem>
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1gls017"
                        className={classes.dropdownLink}
                      >
                        Enquiry seconds downgrade
                      </MenuItem>
                    </Menu>
                  </CardHeader>
                  <CardBody></CardBody>
                </Card>
              </GridItem>
              <GridItem xs={3}>
                <Card>
                  <CardHeader
                    color="warning"
                    className={classes.cardHeader}
                    style={{ padding: "0.1rem 10px" }}
                  >
                    <Button
                      aria-controls="simple-menu4"
                      aria-haspopup="true"
                      onClick={handleClick4}
                      simple
                      color="white"
                      endIcon={<Icon>send</Icon>}
                    >
                      MIS
                    </Button>
                    <Menu
                      id="simple-menu4"
                      anchorEl={anchorEl4}
                      open={Boolean(anchorEl4)}
                      onClose={handleClose4}
                      keepMounted
                    >
                      <MenuItem
                        component="a"
                        href="/tskcrmmes/#/c1cgl001"
                        className={classes.dropdownLink}
                      >
                        Sample and test result management
                      </MenuItem>
                    </Menu>
                  </CardHeader>
                  <CardBody></CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </>
        )}
      </div>
    </div>
  );
}
