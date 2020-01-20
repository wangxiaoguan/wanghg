import React from 'react';
import RefModal from '@/components/RefModal';
import { Input } from 'antd';
import { connect } from 'dva';

@connect(({ loading }) => (
  loading
))
class OnlineCustomOrderEdit extends RefModal {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.source && (!prevState.id || (nextProps.source.id !== prevState.id))) {
      return {
        replyContent: nextProps.source.replyContent,
        id: nextProps.source.id,
      }
    }
    return {};
  }

  constructor(props) {
    super(props, {
      title: '回复',
      onOk: () => this.save(),
    });
  }

  save() {
    this.props.dispatch(
      {
        type: 'OnlineCustomOrder/update',
        payLoad: {
          id: this.props.source.id,
          replyContent: this.state.replyContent,
        },
        callBack: () => {
          this.close();
        }
      }
    );
  }

  renderChildren() {
    console.log(this.state);
    return (
      <div>
        <Input.TextArea
          disabled={this.props.disabled}
          value={this.state.replyContent}
          onChange={(event) => {
            this.setState({ replyContent: event.target.value });
          }}
          placeholder="请输入回复内容"
        />
      </div>
    );
  }
}

export default OnlineCustomOrderEdit;