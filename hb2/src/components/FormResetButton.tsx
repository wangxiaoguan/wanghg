import React, { Component } from 'react';
import { Button } from 'antd';
import { Context } from './SearchTable';

class FormResetButton extends Component<any>  {
  static contextType = Context;
  render() {
    return (
      <Button onClick={() => {
        if (this.context.reset) {
          this.context.reset();
        }
        //临时清楚url里的初始值
        if (this.props.clear) {
          this.props.clear()
        }
      }}
      >
        重置
      </Button>
    );
  }
}

export default FormResetButton;