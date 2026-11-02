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

class ReactSelectCustom extends React.Component {
  state = {
    selectedOption: "",
  };

  handleChange = (value) => {
    this.setState({ selectedOption: value });
  };
  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        options={this.props.options}
        id={this.props.id}
        onChange={this.props.onChange}
        placeholder="--Select--"
        isDisabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        isOptionDisabled={(option) => option.disabled === "yes"}
        isClearable={true}
        {...this.props}
      />
    );
  }
}

export default ReactSelectCustom;
