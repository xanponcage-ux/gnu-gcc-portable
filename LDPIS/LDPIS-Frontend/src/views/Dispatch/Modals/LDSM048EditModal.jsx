import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
//   const [open, setOpen] = React.useState(props.open);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

  const handleClose = () => {
    props.close(false);
  };

  const handleYesClick = () => {
      props.close(false);
      props.openScrap(true);
      props.scrapData(props.editData);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Reason"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Already Scrap Reason is given for batch id {props.idBatch} . Do you want to edit the reason code?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleYesClick}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
