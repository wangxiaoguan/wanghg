import React, { Component } from 'react';
import { Divider, Popconfirm, message } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService } from '../../../myFetch';
import { connect } from 'react-redux';
import API_PREFIX from '../../../apiprefix';
import {BEGIN} from '../../../../../redux-root/action/table/table';
@connect(
  state => ({
    powers: state.powers,
    pageData: state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledOption: [],
    };
  }

  componentDidMount() {
    this.setState({
      isEnabledOption: [{
        key: '', value: '全部',
      }, {
        key: '1', value: '是',
      }, {
        key: '0', value: '否',
      }],
    });
  }
  deleteTag = (record) => {
    let pageData = this.props.pageData
    postService(API_PREFIX + `services/web/config/homepageTag/delete`, [record.id], res => {
      if (res.status === 1) {
        message.success('删除成功')
        this.props.getData(API_PREFIX + `services/web/config/homepageTag/getList/${pageData.currentPage}/${pageData.pageSize}?${pageData.query}`)
      } else {
        message.error(res.errorMsg)
      }
    })
  }

  render() {
    const { isEnabledOption } = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20003.21401.001'];//新建
    let updatePowers = powers && powers['20003.21401.002'];//修改
    let deletePowers = powers && powers['20003.21401.004'];//删除

    const columns = [
      {
        title: '标签名称',
        dataIndex: 'tagName',
        key: 'tagName',
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
          if (record.isEnabled == true) {
            return <span>是</span>;
          } else {
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
          return <div>
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('tag', list);
              location.hash = '/InterfaceManagement/HomeLayout/EditTag?isEdit=true';
            }} style={{ display: updatePowers ? 'inline-block' : 'none' }} >编辑</a>
            {deletePowers ? <Divider type="vertical" /> : null}
            {deletePowers ? <Popconfirm title="确定删除该标签吗?" onConfirm={() => this.deleteTag(record)}>
              <a className="operation">删除</a>
            </Popconfirm> : null}
          </div>
        },
      },
    ];

    const search = [
      { key: 'isEnabled', label: '是否启用', qFilter: 'Q=isEnabled', type: 'select', option: isEnabledOption },
      { key: 'tagName', label: '标签名称', qFilter: 'Q=tagName', type: 'input' },
    ];
    return <div>
      <TableAndSearch type="HomeLayoutTag" columns={columns} url={'services/web/config/homepageTag/getList'} search={search}
        addBtn={createPowers ? { order: 1, url: '/InterfaceManagement/HomeLayout/NewTag?isEdit=false' } : null}
      // deleteBtn={deletePowers ? {order:2, url:'services/web/config/homepageTag/delete',field:'ids'} : null} 
      />
    </div>;
  }
}
