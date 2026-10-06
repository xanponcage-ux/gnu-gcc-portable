// import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MDInput from "components/MDInput";
import React, { useEffect, useState, } from "react";
import alertify from "alertifyjs";
import "../../../alertify.css";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function AlertDialog(props) {
  //   const [open, setOpen] = React.useState(props.open);
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const [isDisabled, setIsDisabled] = useState(true);
  const [valueRadio, setValueRadio] = React.useState("A");

  const handleChange = (e) => {
    //   if(e.target.value <= 1 || e.target.value >20){
    //       // alertify.error("Split must be > 1");
    //       alertify.error("Split must be in between 2 and 20");
    //       setIsDisabled(true);
    //   }else{
    //       setIsDisabled(false);
    //       props.splitNo(e.target.value);

    //   }
    // };

    // if(e.target.value <= 1 || e.target.value >9){
    if (e.target.value <= 1) {
      alertify.error("Split must be greater than 1");
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
      props.splitNo(e.target.value);
      props.splitType(valueRadio);
    }
  };

  const handleClose = () => {
    props.close(false);
  };

  const handleYesClick = () => {
    props.close(false);
    props.openSplit(true);
    //   props.scrapData(props.confirmData);
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Number of Splits "}
        </DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <FormControl>
              {/* <FormLabel id="demo-row-radio-buttons-group-label">
                Schedule Type
              </FormLabel> */}
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={valueRadio}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="A"
                  control={<Radio />}
                  label="Actual Split"
                />
                <FormControlLabel
                  value="L"
                  control={<Radio />}
                  label="Logical Split"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <DialogContentText id="alert-dialog-description">
            Enter number of splits you want to create?
          </DialogContentText>
          <MDInput
            onChange={(e) => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleYesClick} disabled={isDisabled}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
