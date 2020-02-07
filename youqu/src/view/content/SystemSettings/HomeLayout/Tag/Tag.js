import React, { Component} from 'react';
import {Button,Modal,Form,Input,Radio} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {postService,getService} from '../../../myFetch';
import { connect } from 'react-redux';
import ServiceApi from '../../../apiprefix';

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledOption : [],
    };
  }

  componentDidMount(){
    // getService(ServiceApi + 'services/lookup/init/enrollFieldType', data => {
    //   console.log('loockup', data);
    // });

    this.setState({
      isEnabledOption : [{
        key: '', value: '全部',
      },{
        key: 'true', value: '是',
      }, {
        key: 'false', value: '否',
      }],
    });
  }

  render() {
    const { isEnabledOption} = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20001.21401.001'];
    let updatePowers = powers && powers['20001.21401.002'];
    let readPowers = powers && powers['20001.21401.003'];
    let deletePowers = powers && powers['20001.21401.004'];

    const columns = [
      {
        title: '标签名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '关联栏目',
        dataIndex: 'categoryViewName',
        key: 'categoryViewName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render: (text, record) => {
          if(record.isEnabled == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <a className="operation" onClick={() => {
            const list = JSON.stringify(record);
            window.sessionStorage.setItem('tag', list);
            location.hash = '/SystemSettings/HomeLayout/EditTag?isEdit=true';
          }} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑</a>;
        },
      },
    ];

    const search = [
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled_Z_EQ', type: 'select', option: isEnabledOption },
      { key: 'name', label: '标签名称',qFilter:'Q=name_S_LK',type:'input'},
    ];
    return <div>
      <TableAndSearch columns={columns} url={'services/system/homepageTag/list'} search={search}
        addBtn={createPowers ? {order:1, url:'/SystemSettings/HomeLayout/NewTag?isEdit=false'} : null}
        deleteBtn={deletePowers ? {order:2, url:'services/system/homepageTag/delete',field:'ids'} : null} />
    </div>;
  }
}
