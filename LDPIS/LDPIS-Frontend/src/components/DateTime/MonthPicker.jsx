import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function ResponsiveDatePickers(props) {
  const [value, setValue] = React.useState();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year", "month"]}
        inputFormat={"MMM-yyyy"}
        label={props.label}
        value={value ?? null}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} id={props.id} />
        )}
      />
    </LocalizationProvider>
  );
}

