import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { connect } from 'react-redux';
@connect(state => ({
  powers: state.powers,
}))
export default class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FieldTypeOption: [],
      FieldRequriedOption: [],
    };
  }

  componentDidMount() {
    this.setState({
      FieldTypeOption: [
        {
          key: 'FT1',
          value: '选项',
        },
        {
          key: 'FT2',
          value: '字符串',
        },
        {
          key: 'FT3',
          value: '数字',
        },
      ],
      FieldRequriedOption: [
        {
          key: '1',
          value: '是',
        },
        {
          key: '0',
          value: '否',
        },
      ],
    });
  }

  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20001.21502.001'];
    let updatePowers = powers && powers['20001.21502.002'];
    let deletePowers = powers && powers['20001.21502.004'];
    console.log('权限码',powers);
    const { FieldTypeOption, FieldRequriedOption } = this.state;
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
        title: '字段类型',
        dataIndex: 'fieldType',
        key: 'fieldType',
      },
      {
        title: '是否必填',
        dataIndex: 'required',
        key: 'required',
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
            <a
              className="operation"
              onClick={() =>
                (location.hash = `/SystemSettings/Dictionary/ApplyDetail?isEdit=true&id=${
                  record.id
                }`)
              }
              style={{ display: updatePowers ? 'inline-block' : 'none' }}
            >
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
      {
        key: 'fieldType',
        label: '字段类型',
        qFilter: 'Q=fieldType_S_EQ',
        type: 'select',
        option: FieldTypeOption,
      },
      {
        key: 'required',
        label: '是否必填',
        qFilter: 'Q=required_S_LK',
        type: 'select',
        option: FieldRequriedOption,
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          url={'services/system/dictionary/enrollField/getList'}
          search={search}
          addBtn={createPowers?{
            order: 1,
            url: '/SystemSettings/Dictionary/AddApply?isEdit=false',
          }:null}
          deleteBtn={deletePowers?{
            order: 2,
            url: 'services/system/dictionary/enrollField/delete',
            field: 'idList',
          }:null}
        />
      </div>
    );
  }
}
