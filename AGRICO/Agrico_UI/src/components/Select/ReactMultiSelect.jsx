import React from "react";
import Select from "react-select";

// const options = [
//   { value: '1yrCharterRates', label: '1 yr Charter Rates' },
//   {value: ' 5yrCharterRates', label: '5 yr Charter Rates' },
//   { value: 'Avg 5TC_BCI', label: 'Avg 5TC_BCI' },
//   { value: 'BunkerPrice', label: 'Bunker Price' },
//   { value: 'DryBulkFreight', label: 'Dry Bulk Freight' },
//   { value: 'PMIChina', label: 'PMI China' },
//   { value: 'PortCongestion', label: 'Port Congestion' },
//   { value: 'SAMundra', label: 'SA Mundra' },
//   { value: 'ThermalCoalPrice', label: 'Thermal Coal Price' }
// ];

class CustomDropdown extends React.Component {
  state = {
    selectedOption: "",
  };

  handleChange = (value) => {
    this.setState({ selectedOption: value });
  };
  render() {
    const { selectedOption } = this.state;

    const groupStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    };
    const groupBadgeStyles = {
      backgroundColor: "#EBECF0",
      borderRadius: "2em",
      color: "#172B4D",
      display: "inline-block",
      fontSize: 12,
      fontWeight: "normal",
      lineHeight: "1",
      minWidth: 1,
      padding: "0.16666666666667em 0.5em",
      textAlign: "center",
    };

    const formatGroupLabel = (data) => (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );

    return (
      <Select
        isMulti
        onChange={this.props.onChange}
        options={this.props.options}
        id={this.props.id}
        placeholder="--Select--"
        className="basic-multi-select"
        classNamePrefix="select"
        formatGroupLabel={formatGroupLabel}
        defaultValue={this.props.defaultValue}
        isClearable={true}
      />
    );
  }
}

export default CustomDropdown;
