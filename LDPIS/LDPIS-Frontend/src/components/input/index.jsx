import React from "react";
import {
  FormLabel,
  InputAdornment,
  FormControl,
  Typography,
  MenuItem,
  TextField,
  FormControlLabel,
  Radio,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  SelectField,
  OutlinedInputField,
  RadioField,
  InputLabelField,
} from "./style";
import { Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export const Input = (props) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <FormControl fullWidth>
      <Grid container spacing={2}>
        {props?.sideLabel ? (
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>{props.sideLabel}</Typography>
          </Grid>
        ) : null}
        <Grid item xs={props?.sideLabel ? 6 : 12}>
          {props?.label ? (
            <InputLabelField>{props.label}</InputLabelField>
          ) : null}
          <OutlinedInputField
            style={{ width: "100%" }}
            label={props.label}
            id={props.id}
            type={
              props.type
                ? props.type === "password" || props.type === "passcode"
                  ? !passwordVisible
                    ? "password"
                    : "text"
                  : props.type
                : "text"
            }
            startAdornment={
              props?.sIcon && (
                <InputAdornment position="start">{props.sIcon}</InputAdornment>
              )
            }
            endAdornment={
              (props?.eIcon || props.type === "password") && (
                <InputAdornment position="end">
                  {props?.eIcon ? (
                    props.eIcon
                  ) : props.type === "password" && !passwordVisible ? (
                    <Visibility
                      style={{ cursor: "pointer" }}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    />
                  ) : (
                    <VisibilityOffIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    />
                  )}
                </InputAdornment>
              )
            }
            onChange={(
              e
            ) => props.onChange(e.target.value)}
            size={"small"}
            readOnly={props?.readOnly ? props?.readOnly : false}
            disabled={props?.disabled ? props?.disabled : false}
            value={props.value || ""}
            onKeyDown={props.onKeyDown}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export const SelectInput = (props) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <SelectField
        style={{ width: "100%" }}
        renderOption={(props, option) => {
          return (
            option?.label && (
              <li {...props} key={option?.id} data-val={option?.value}>
                {option?.label}
              </li>
            )
          );
        }}
        renderInput={(params) => <TextField {...params} label={props?.label} />}
        id={props?.id}
        size={"small"}
        isOptionEqualToValue={(option, value) => {
          return (
            option?.label ===
            props?.data?.filter((x) => {
              return x?.value === props?.value;
            })[0]?.label
          );
        }}
        options={props?.data}
        onChange={(e) => props.onChange(e.target.getAttribute("data-val"))}
        readOnly={props?.readOnly ? props?.readOnly : false}
        disabled={props?.disabled ? props?.disabled : false}
        value={
          props.value?.length > 0
            ? props.data?.filter((x) => {
                return x.value === props.value;
              })[0]?.label
            : null
        }
      />
    </FormControl>
  );
};

export const RadioInput = (props) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <FormLabel id={props?.id}>{props?.label}</FormLabel>
      <RadioField
        row={props?.row}
        style={{ width: "100%" }}
        id={props.id}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      >
        {props.data?.map((x, i) => (
          <FormControlLabel
            value={x?.value}
            key={i}
            control={<Radio />}
            label={x?.label}
          />
        ))}
      </RadioField>
    </FormControl>
  );
};

const setDateFnc = (e) => {
  let date = new Date(e);
  let cDate = new Date();
  if (
    Number(date.getHours()) === 0 &&
    Number(date.getMinutes()) === 0 &&
    Number(date.getSeconds()) === 0
  ) {
    date.setHours(cDate.getHours());
    date.setMinutes(cDate.getMinutes());
    date.setSeconds(cDate.getSeconds());
  }
  return date?.toString();
};

export const DatePickerInput = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {props.time ? (
        <DateTimePicker
          sx={{ width: "100%" }}
          {...props}
          value={props?.value ? dayjs(new Date(props?.value)) : null}
          onChange={(e) => props.onChange(setDateFnc(e))}
          format="DD-MMM-YYYY HH:mm:ss"
          views={["year", "month", "day", "hours", "minutes", "seconds"]}
          slotProps={{ textField: { size: "small" } }}
        />
      ) : (
        <DatePicker
          sx={{ width: "100%" }}
          {...props}
          slotProps={{ textField: { size: "small" } }}
        />
      )}
    </LocalizationProvider>
  );
};
