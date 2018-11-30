import React, { Component } from 'react';
import { Popconfirm} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';

export default class Field extends Component {
  render() {
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '字段类型',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '是否必填',
        dataIndex: 'age2',
        key: 'age2',
      },
      {
        title: '创建时间',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>
            <a onClick={() => (location.hash = `/SystemSettings/Dictionary/Apply/detail?isEdit=true&id=${record.id}`)}>编辑</a>
          </div>;

        },
      },
    ];
    const search = [
      { key: 'test1',
        label: '题库名称',
        qFilter: 'Q=test2_S_LK',
        type: 'input',
      },
      {
        key: 'test',
        label: '状态',
        qFilter: 'Q=test_S_EQ',
        type: 'select',
        option: option1,
      },
    ];
    const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];
    return(
      <TableAndSearch columns={columns} url={'/test1'} search={search} addBtn={{ order: 2, url: '/SystemSettings/Dictionary/Magazines', OnEvent: this.add }} deleteBtn={{ order: 5 }}  />
    );
  }
}
