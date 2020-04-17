import { Input, Cascader } from 'antd';
import React from 'react'
import {CityAndDistrict} from '../Society/Cascader'

/**
 * 地址控件
 */
class AddressEntry extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      cAndD: value.cAndD,
      street: value.street || '',
    };
  }

  handleCascaderChange = value => {

    if (!('value' in this.props)) {
      this.setState({ cAndD: value });
    }
    this.triggerChange({ cAndD: value });
  };

  handleStreetChange = e => {
    if (!('value' in this.props)) {
      this.setState({ street: e.target.value });
    }
    this.triggerChange({ street: e.target.value });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { street, cAndD } = this.state
    const { disabled } = this.props
    return (
      <span>

        <Cascader
          placeholder="请选择"
          options={CityAndDistrict}
          style={{ width: '32%', marginRight: '3%' }}
          value={cAndD}
          onChange={this.handleCascaderChange}
          disabled={disabled}
        />

        <Input
          style={{ width: '65%' }}
          value={street}
          onChange={this.handleStreetChange}
          disabled={disabled}
        />
      </span>
    );
  }
}

export default AddressEntry
