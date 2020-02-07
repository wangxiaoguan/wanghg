import React, { Component } from 'react';
import { Cascader, Input, Select } from 'antd';
import './index.less';


class DutyItem extends Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      ...value,
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState(value);
    }
  }
  handleOrgChange = (e) => {
    //console.log(e);
    const org = e;
    if (!('value' in this.props)) {
      this.setState({ org });
    }
    this.triggerChange({ org });
  }
  handleDutyChange = (e) => {
    if (!('value' in this.props)) {
      this.setState({ duty: e });
    }
    this.triggerChange({ duty: e });
  }

  handleOtherDutyChange = (e) => {
    if (!('value' in this.props)) {
      this.setState({ otherDuty: e.target.value });
    }
    this.triggerChange({ otherDuty: e.target.value });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const { options, dutyTypes, isFirst, onRemove, onAdd, which } = this.props;
    const { state } = this;
    const onClickAdd = () => {
        onAdd();
    };
    const onClickRemove = () => {
        onRemove(which);
    };
    return (
      <div className="dutyItem">
        <Cascader
          value={state.org}
          onChange={this.handleOrgChange}
          placeholder="请选择关键字"
          style={{ width: '60%' }}
          options={options}
          changeOnSelect
        />
        <Select
          value={state.duty}
          style={{ width: '30%' }}
          onChange={this.handleDutyChange}
        >
          {dutyTypes.map(current => (
            <Select.Option key={current.id + ''} value={current.id + ''}>{current.desp}</Select.Option>
          ))}
        </Select>
        {state.duty === 'custom' && (
          <Input
            value={state.otherDuty}
            style={{ width: '20%' }}
            onChange={this.handleOtherDutyChange}
          />
        )}
        <div className="virtual">

          {/* <div className="fakeContainer" onClick={onClickAdd}>
            <span className="fake" >
              {'+'}
            </span>
          </div>&nbsp;&nbsp;&nbsp; */}
          <div className="fakeContainer" onClick={onClickRemove}>
            <span className="fake" >
              {'-'}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default DutyItem;
