import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import { Button, Modal} from 'antd';

export default class Hellos extends Component {
  constructor(props) {
    super(props);
    this.dataSource = [
      { key: 0, name: '我是1', age: '11', gender: '11', identityCardNo: '11' }, { key: 1, name: '我是2', age: '22', gender: '22', identityCardNo: '22' }, { key: 2, name: '我是3', age: '22', gender: '22', identityCardNo: '22' }, { key: 3, name: '我是4', age: '22', gender: '22', identityCardNo: '22' }, { key: 4, name: '我是5', age: '22', gender: '22', identityCardNo: '22' }, { key: 5, name: '我是6', age: '22', gender: '22', identityCardNo: '22' }, { key: 6, name: '我是7', age: '22', gender: '22', identityCardNo: '22' }, { key: 7, name: '我是8', age: '22', gender: '22', identityCardNo: '22' }, { key: 8, name: '我是9', age: '22', gender: '22', identityCardNo: '22' }, { key: 9, name: '我是10', age: '22', gender: '22', identityCardNo: '22' }, { key: 10, name: '我是11', age: '22', gender: '22', identityCardNo: '22' }, { key: 11, name: '我是12', age: '22', gender: '22', identityCardNo: '22' }, { key: 12, name: '我是13', age: '22', gender: '22', identityCardNo: '22' }, { key: 13, name: '我是14', age: '22', gender: '22', identityCardNo: '22' }];
    this.state = { visible: false };
  }
  add=()=>{
    this.setState({visible:true});
    
  }
  
  
  render() {
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        render: (text, record, index) => {
          return index;
        },
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: '年龄',
        dataIndex: 'age2',
        key: 'age2',
      },
      {
        title: '年龄',
        dataIndex: 'age3',
        key: 'age3',
      }, {
        title: '年龄',
        dataIndex: 'age4',
        key: 'age4',
      }, {
        title: '年龄',
        dataIndex: 'age5',
        key: 'age5',
      }, {
        title: '年龄',
        dataIndex: 'age6',
        key: 'age6',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: '身份证号',
        dataIndex: 'identityCardNo',
        key: 'identityCardNo',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>{record.identityCardNo}</div>;
        },
      },
    ];
    const search = [
      { key: 'test', label: '测试1', qFilter: 'Q=test_S_EQ',type:'select',option: option1},
      { key: 'test4', label: '测试4', qFilter: 'Q=test_S_LK', type: 'select', option: option1 },
      { key: 'test1', label: '测试2',qFilter:'Q=test2_S_LK',type:'input'},
      { key: 'test2', label: '测试3', type: 'rangePicker' },
    ];
    return <div>
      <TableAndSearch columns={columns} url={'/test'} search={search} addBtn={{ order: 2, url:'/SystemSettings/Dictionary/Magazines',OnEvent:this.add}} optionalBtn={{ label: '上线', url: '/www',order:3 }} updateBtn={{order:1}} importBtn={{order:4}} exportBtn={{order:6}} deleteBtn={{order:5}}>
        {/* <span>test</span> */}
      </TableAndSearch>
      <Modal
        visible={this.state.visible}
      >aaa</Modal>
    </div>;
  }
}
const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];