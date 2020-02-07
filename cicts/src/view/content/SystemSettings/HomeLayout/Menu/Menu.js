import React, { Component } from 'react';
import { Button ,Divider,message} from 'antd';
import { connect } from 'react-redux';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {postService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {BEGIN} from '../../../../../redux-root/action/table/table';
@connect(
  state => ({
    powers: state.powers,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledOption : [],
    };
  }

  componentDidMount(){
    this.setState({
      isEnabledOption : [
        {
          key: '', value: '全部',
        },
        {
          key: '1', value: '是',
        }, {
          key: '0', value: '否',
        }],
    });
  }

  forbidden(record){
    console.log(record);
    let values={
      id: record.id,
      isEnabled: !(record.isEnabled) ? 1 : 0,
    };
    console.log(values);
    postService(API_PREFIX + 'services/web/config/homepageMenu/enable',values, data => {
      if (data.status == 1) {
        message.success('修改成功');
        this.props.getData(API_PREFIX+`services/web/config/homepageMenu/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}`);
      }else{
        message.success(data.errorMsg);
      }
    });
  }

  render() {
    const { isEnabledOption,menuList} = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.21403.001'];//新建
    let updatePowers = powers && powers['20003.21403.002'];//修改
    let deletePowers = powers && powers['20003.21403.004'];//删除

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: '菜单图标',
        dataIndex: 'menuIcon',
        key: 'menuIcon',
      },
      {
        title: '父级菜单',
        dataIndex: 'parentName',
        key: 'parentName',
      },
      // {
      //   title: '菜单类型',
      //   dataIndex: 'typeName',
      //   key: 'typeName',
      // },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render: (text, record) => {
          if(record.isEnabled == true){
            return <span>启用</span>;
          }else {
            return <span>禁用</span>;
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
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('menu', list);
              location.hash = `/InterfaceManagement/HomeLayout/EditMenu?isEdit=true&id=${record.id}`;
            }} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑</a>
            <Divider type="vertical" />
            <span>
              {record.isEnabled == true?<a className="operation" onClick={() =>this.forbidden(record)} style={{ display: updatePowers ? 'inline-block' : 'none' }}>禁用</a>:
              <a className="operation" onClick={() =>this.forbidden(record)} style={{ display: updatePowers ? 'inline-block' : 'none' }}>启用</a>}
            </span>
          </div>;
        },
      },
    ];

    const search = [
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled', type: 'select', option: isEnabledOption},
      { key: 'menuName', label: '菜单名称',qFilter:'Q=menuName',type:'input'},
    ];
    return <div>
      <TableAndSearch columns={columns} url={'services/web/config/homepageMenu/getList'} search={search}
        addBtn={createPowers ? {order:1, url: '/InterfaceManagement/HomeLayout/NewMenu?isEdit=false' } : null}
        deleteBtn={deletePowers ? {order:2, url:'services/web/config/homepageMenu/delete'} : null} />
    </div>;
  }
}

