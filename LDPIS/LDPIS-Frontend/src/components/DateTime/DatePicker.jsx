import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

export default function ResponsiveDatePickers(props) {
  const [value, setValue] = React.useState();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        label={props.label}
        inputFormat={props.type == "MM" ? "dd-MM-yyyy" : "dd-MMM-yyyy"}
        value={props?.value ?? null}
        onChange={props?.onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            id={props.id}
            sx={{
              '& .MuiInputBase-input': {
                height: 8, // adjust the height of the input field
              },
            }}
          />
        )}
        sx={{
          '& .MuiDatePicker-root': {
            height: 40, // adjust the height of the date picker container
          },
        }}
        closeOnSelect
      />
    </LocalizationProvider>
  );
}