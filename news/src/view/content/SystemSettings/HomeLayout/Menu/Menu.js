import React, { Component } from 'react';
import { Button ,Divider} from 'antd';
import { connect } from 'react-redux';
import TableAndSearch from '../../../../component/table/TableAndSearch';

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class Menu extends Component {
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
      isEnabledOption : [
        {
          key: '', value: '全部',
        },
        {
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
    let createPowers = powers && powers['20001.21403.001'];
    let updatePowers = powers && powers['20001.21403.002'];
    let readPowers = powers && powers['20001.21403.003'];
    let deletePowers = powers && powers['20001.21403.004'];

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        key: 'icon',
      },
      {
        title: '父级菜单',
        dataIndex: 'parentName',
        key: 'parentName',
      },
      {
        title: '菜单类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
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
              location.hash = '/SystemSettings/HomeLayout/EditMenu?isEdit=true';
            }} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑</a>
            <Divider type="vertical" />
            <span>
              {record.isEnabled == true?<a className="operation">禁用</a>:<a className="operation">启用</a>}
            </span>
          </div>
        },
      },
    ];

    const search = [
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled_Z_EQ', type: 'select', option: isEnabledOption},
      { key: 'name', label: '菜单名称',qFilter:'Q=name_S_LK',type:'input'},
    ];
    return <div>
      <TableAndSearch columns={columns} url={'services/system/homepageMenu/list'} search={search}
        addBtn={createPowers ? {order:1, url: '/SystemSettings/HomeLayout/NewMenu?isEdit=false' } : null}
        deleteBtn={deletePowers ? {order:2, url:'services/system/homepageMenu/delete',field:'ids'} : null} />
    </div>;
  }
}

