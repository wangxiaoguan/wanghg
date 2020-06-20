import React, { Component } from "react";
import { Modal } from "antd";
import "./index.less";

class GlobalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  show = () => {
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false });
  };

  renderContent = () => {
    return <div>CONTENT</div>;
  };

  render() {
    const { title = "标题", width = 600 } = this.props;
    return (
      <Modal
        visible={this.state.visible}
        footer={null}
        title={title}
        width={width}
        onCancel={this.close}
        className="modal"
        destroyOnClose={true}
        afterClose={()=>this.close()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default GlobalModal;
