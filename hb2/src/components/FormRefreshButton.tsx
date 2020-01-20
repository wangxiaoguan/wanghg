import React, { Component } from 'react';
import { Button } from 'antd';
import { Context } from './SearchTable';

class FormRefreshButton extends Component<any>  {
  static contextType = Context;
  render() {
    return (
      <Button
        type="primary"
        onClick={() => {
          if (this.context.refresh) {
            this.context.refresh();
          }
        }}
      >
        查询
      </Button>
    );
  }
}

export default FormRefreshButton;