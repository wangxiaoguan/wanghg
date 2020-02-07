import React, { Component } from 'react';
import { Spin} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService,GetQueryString } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action/table/table';

@connect(
  state => ({
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

export default class Field extends Component {
  constructor(props){
    super(props);
    this.state={
      activeKey:  GetQueryString(location.hash, ["activeKey"]).activeKey || "", 
      activityId: GetQueryString(location.hash, ['id']).id || '',
      tenantId : window.sessionStorage.getItem("tenantId") || "",
    };
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22002.001'];//新建
    let updatePowers = powers && powers['20002.22002.002'];//修改
    let deletePowers = powers && powers['20002.22002.004'];//删除
    let {activeKey,activityId,tenantId}=this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'sNum',
        key: 'sNum',
      },
      {
        title: '字段名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title: '字段类型',
        dataIndex: 'titleType',
        key: 'titleType',
        render: (text, record, index) => {
          if (record.titleType === 1) {
            return '选项';
          } else if (record.titleType === 2) {
            return '多选';
          } else if (record.titleType === 3) {
            return '字符串';
          }else if(record.titleType===4){
            return '数字';
          }
        },
      },
      {
        title: '是否必填',
        dataIndex: 'isRequired',
        key: 'isRequired',
        render: (text, record, index) => {
          if (record.isRequired === true) {
            return '是';
          } else if (record.isRequired === false) {
            return '否';
          }
        },
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
          return <div>
            {
              updatePowers?(
                <a onClick={() => (location.hash = `/EventManagement/Apply/FieldEdit?isEdit=true&id=${record.id}`)}>编辑</a>
              ):null
            }
          </div>;

        },
      },
    ];
    const isRequired = [
      {
        key: "1", value: '是',
      }, {
        key: "0", value: '否',
      }];
    const titleType =[
      {
        key: '1', value: '选项',
      }, {
        key: '3', value: '字符串',
      },{
        key: '4', value: '数字',
      }];
    const search = [
      { key: 'test1',
        label: '字段名称',
        qFilter: 'Q=titleName',
        type: 'input',
      },
      {
        key: 'test',
        label: '字段类型',
        qFilter: 'Q=titleType',
        type: 'select',
        option: titleType,
      },
      { key: 'test2',
      label: '是否必填',
      qFilter: 'Q=isRequired',
      type: 'select',
      option:  isRequired,
    },
    ];
    return(
          <TableAndSearch columns={columns} search={search} type="ApplyField"
            url={`services/web/activity/enrolmenttitle/getEnrolmentLabel`}
            addBtn={createPowers?{ order: 2, url: '/EventManagement/Apply/FieldAdd', OnEvent: this.add }:null}
            deleteBtn={deletePowers?{order: 5, url:'services/web/activity/enrolmenttitle/batchDeleteTitleInfo' }:null}
            goBackBtn={activityId? { order: 1,label:'返回',url:`/EventManagement/Apply/ApplyFields?id=${this.state.activityId}&back=1&activeKey=${this.state.activeKey}` }:null}
           urlfilter={`Q=tenantId=${tenantId}`}  
          />
    );
  }
}



