import React from "react";
import chroma from "chroma-js";

import Select from "react-select";



class CustomDropdown extends React.Component {
  state = {
    selectedOption: "",
  };

  handleChange = (value) => {
    this.setState({ selectedOption: value });
  };

  render() {
    const { selectedOption } = this.state;

    const dot = (color = "transparent") => ({
      alignItems: "center",
      display: "flex",

      ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
      },
    });

    const colourStyles = {
      control: (styles) => ({ ...styles, backgroundColor: "white" }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color ?? "black");
        return {
          ...styles,
          backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : undefined,
          color: isDisabled
            ? "#ccc"
            : isSelected
            ? chroma.contrast(color, "white") > 2
              ? "white"
              : "black"
            : data.color,
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            backgroundColor: !isDisabled
              ? isSelected
                ? data.color
                : color.alpha(0.3).css()
              : undefined,
          },
        };
      },
      input: (styles) => ({ ...styles, ...dot() }),
      placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
      singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    };

    return (
      <Select
        options={this.props.options}
        id={this.props.id}
        onChange={this.props.onChange}
        placeholder="--Select--"
        isDisabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        isOptionDisabled={(option) => option.disabled === "yes"}
        styles={colourStyles}
        isClearable={true}
      />
    );
  }
}

export default CustomDropdown;