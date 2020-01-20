import React, {Component} from 'react';
import {Button} from 'antd';

class BackButton extends Component {
  render() {
    return (
      <Button
        type={this.props.type || "default"}
        style={this.props.style}
        onClick={() => {
          window.history.back();
        }}
      >
        返回
      </Button>
    );
  }
}

export default BackButton;