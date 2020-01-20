/*
 * @Desc: 日志管理
 * @Author: harry
 * @Date: 2018-11-27 14:27:42
 * @Last Modified by: harry
 * @Last Modified time: 2018-11-27 14:37:44
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Table } from 'antd';
import styles from './index.less';

@connect(({ logmanager, loading }) => ({
  logmanager,
  loading,
}))
@Form.create()
class LogManager extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      logmanager: {
        data: { pagination },
      },
    } = this.props;
    dispatch({
      type: 'logmanager/fetch',
      payload: pagination,
    });
  }

  handleSimpleTableChange = pagination => {
    const { dispatch } = this.props;
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'logmanager/fetch',
      payload: params,
    });
  };

  render() {
    const {
      loading,
      logmanager: { data },
    } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render(val, record, index) {
          const { current = 1, pageSize = 10 } = data.pagination;
          return <span>{(current - 1) * pageSize + (index + 1)}</span>;
        },
      },
      {
        title: '姓名',
        dataIndex: 'createUserName',
      },
      {
        title: '操作描述',
        dataIndex: 'operDesc',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
    ];

    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <Table
                rowKey={item => item.id}
                loading={loading.effects['logmanager/fecth']}
                dataSource={data.list}
                pagination={data.pagination}
                columns={columns}
                onChange={this.handleSimpleTableChange}
              />
            </div>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default LogManager;
