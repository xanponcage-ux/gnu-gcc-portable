import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Checkbox, ListItemText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, val, theme) {
  return {
    fontWeight:
      val?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    borderRadius: "0px",
    backgroundColor: val?.indexOf(name) === -1 ? "none" : "lightskyblue",
  };
}

export default function MultipleSelect(props) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.setValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl sx={{ height: "45px", width: "100%" }}>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        displayEmpty
        value={props.value ? props.value : []}
        onChange={handleChange}
        input={<OutlinedInput />}
        sx={{ height: "45px", width: "100%" }}
        renderValue={(selected) => {
          if (selected?.length === 0) {
            return <em>{props.placeholder}</em>;
          }

          return selected?.join(", ");
        }}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem disabled value="">
          <em>Data</em>
        </MenuItem>
        {props.data?.map((x, i) => (
          <MenuItem key={i} value={x} style={getStyles(x, props.value, theme)}>
            <Checkbox
              key={i}
              checked={props.value?.indexOf(x) > -1}
              sx={{
                // color: "#1A73E8",
                "&.Mui-checked": {
                  color: "#1A73E8",
                },
                padding: '2px 5px',
                paddingLeft: 0
              }}
            />
            <ListItemText primary={x} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
