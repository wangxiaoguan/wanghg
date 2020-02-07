import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {pageJummps} from '../../PageJumps';
import Detail from './detail';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
@connect(state => ({
  powers: state.powers,
}))
export default class Magazines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      record: {},
    };
  }
  showModal = record => {
    if (record) {
      this.setState({ visible: true, record, isEdit: true });
    } else {
      this.setState({ visible: true, record: {}, isEdit: false });
    }
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20001.21606.001'];//新建
    let updatePowers = powers && powers['20001.21606.002'];//修改
    let deletePowers = powers && powers['20001.21606.004'];//删除
    const { record, isEdit } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width:'50px',
      },
      {
        title: '字段名称',
        dataIndex: 'fieldName',
        key: 'fieldName',
      },
      {
        title: '描述',
        dataIndex: 'desp',
        key: 'desp',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:'160px',
      },
      {
        title: '操作',
        key: 'x',
        width:'50px',
        render: (text, record, index) => {
          return (
            <a className="operation" onClick={() => this.showModal(record)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}>
              编辑
            </a>
          );
        },
      },
    ];
    const search = [
      {
        key: 'fieldName',
        label: '字段名称',
        qFilter: 'Q=fieldName',
        type: 'input',
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          url={pageJummps.MagaSeriesList}
          search={search}
          addBtn={createPowers?{ order: 1, OnEvent: this.showModal }:null}
          deleteBtn={deletePowers?{order: 2,url: pageJummps.MagaSeriesDelete,txt:'可能关联杂志目录和杂志文章，您确定删除吗？'}:null}
        />
        <Modal
          className="modal"
          title={`${!isEdit?'新建':'编辑'}杂志系列`}
          maskClosable={false}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          key={'magazineModal'}
          destroyOnClose={true}
        >
          <Detail
            handleCancel={this.handleCancel}
            record={record}
            isEdit={isEdit}
          />
        </Modal>
      </div>
    );
  }
}
