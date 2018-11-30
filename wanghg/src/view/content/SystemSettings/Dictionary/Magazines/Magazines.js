import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
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

  componentDidMount() {}
  showModal = record => {
    console.log('showModal', record);
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
    let createPowers = powers && powers['20001.21501.001'];
    let updatePowers = powers && powers['20001.21501.002'];
    let deletePowers = powers && powers['20001.21501.004'];
    const { record, isEdit } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
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
      },
      {
        title: '操作',
        key: 'x',
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
        qFilter: 'Q=fieldName_S_LK',
        type: 'input',
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          url={'services/system/dictionary/magazineSeries/getList'}
          search={search}
          addBtn={createPowers?{ order: 1, OnEvent: this.showModal }:null}
          deleteBtn={deletePowers?{
            order: 2,
            url: 'services/system/dictionary/magazineSeries/delete',
            field: 'idList',
          }:null}
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
