import React, { Component } from 'react';
import { Button } from 'antd';

interface IEditButtonProps {
  hash: string,
}

class EditButton extends Component<IEditButtonProps> {
  render() {
    return (
      <Button
        type="primary"
        onClick={() => {
          window.location.hash = this.props.hash;
        }}
      >
        新增
      </Button>
    );
  }
}

export default EditButton;