import React, { Component } from 'react';
import { Spin } from 'antd';
import { confirmDelete } from '@/utils/AntdUtil';

interface IDeleteLinkProps {
  target: {
    remove: (id) => void,
    [propsName: string]: any
  };
  record: { id: any, any };
}
/**
 * target--包含this.props.loadingDelete和this.remove(id)的对象
 * record--包含id的对象
 */
class DeleteLink extends Component<IDeleteLinkProps, any> {
  render() {
    const target = this.props.target;
    return (
      <Spin spinning={target.props.loadingDelete}>
        <a onClick={() => {
          confirmDelete(() => target.remove(this.props.record.id));
        }}>删除</a>
      </Spin>
    );
  }
}

export default DeleteLink;