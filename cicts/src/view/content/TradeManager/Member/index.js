import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin, Modal, message } from 'antd';
import moment from 'moment';

import TableAndSearch from '../../../component/table/TableAndSearch';
import WrappedForm from './modalContent';
import ImportMember from './importModal';

import API_PREFIX from '../../apiprefix';
import { getService,postService, arrayForCascade } from '../../myFetch';

// partyOrgState    "0",则默认只取出正在使用的公会组织
//                  "1" 则取出所有的公会组织
const partyOrgState = 0;

@connect(
  state => ({ powers: state.powers })
)

export default class Member extends Component {
  state = {
    modalType: 'create',
    modalVisible: false,
    organizations: [], //树状组织数据
    currentItem: {}, //给modal回显的数据
    importModalVisible: false,
    orgList: [],
    selectRowData: []
  }

  componentDidMount() {
    sessionStorage.setItem('tradeM',0);
    //请求树状组织结构数据
    getService(`${API_PREFIX}services/web/union/org/getUnionOrgList/${partyOrgState}`, (data) => {
      if (data.status === 1) {//success
        let orgs = data.root.object
        if (orgs) {
          let selectIds = this.getDpData(orgs)
          this.getDepartmentData(orgs, selectIds);
          this.setState({
            organizations: orgs,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      } else {
        message.error(data.errorMsg);
      }
    });
  }
  // 把可以操作的部门的父节点全部找出来
  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.state.orgList.push(item.treePath.split(','))
      }
      if (item.unionOrgList) {
        this.getDpData(item.unionOrgList);
      }
    });
    let List = this.state.orgList.join(',').split(',');
    return [...new Set(List)]
  }
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData, selectIds) {
    let orgIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false
    dpData.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.children = item.unionOrgList;
      item.disabled = !orgIds ? false : selectIds.toString().indexOf(item.id) > -1 ? false : true;
      if (item.unionOrgList) {//不为空，递归
        this.getDepartmentData(item.unionOrgList, selectIds);
      }
    });
  }
  delAuthUser = (rowDatas) => {
    console.log('她她她她她她她她她她她她她她她她她她涛涛涛涛涛涛涛涛涛涛他', this.state.selectRowData)
    let body = []
    this.state.selectRowData.forEach(item => {
      let name = item.fullName
      if(item.fullName && item.fullName.indexOf('>') > -1) {
          let arr = item.fullName.split('>')
          name = arr[arr.length - 1]
      }
      body.push({type: 5, id: item.unionId, userId: item.userId, name,})
    })
    postService(API_PREFIX + `services/web/auth/authunion/batchDelAuthUser`, body, res => {
      if(res.status !== 1) {
        message.error(res.errorMsg)
      }
    })
  }
  render() {
    console.log('00000000000000000000000000000', this.state.organizations);
    const { powers = {} } = this.props;
    const showCreate = powers['20007.21705.001'];//新建
    const showImport = powers['20007.21705.201'];//导入
    const showExport = powers['20007.21705.202'];//导出
    const showRemove = powers['20007.21705.004'];//删除
    const updatePowers=powers['20007.21705.002'];//修改
    const { modalType, organizations, modalVisible, currentItem, importModalVisible } = this.state;
    const modalTitle = `${modalType === 'create' ? '新增' : '编辑'}会员信息`;
    const search = [
      {
        key: 'lastname',
        label: '姓名',
        qFilter: 'Q=name',
        type: 'input',
      },
      {
        key: 'number',
        label: '员工号',
        qFilter: 'Q=userNo',
        type: 'input',
      },
      {
        key: 'categoryId',
        label: '所属工会',
        qFilter: 'Q=unionId',
        type: 'cascader',
        option: organizations,
      },
    ];
    const edit = (item) => {
      //console.log(item);
      //操作一波数据 让edit modal 回显
      const treePath = item.postTreePath;
      if (treePath) {
        const tempArray = treePath.split(' | ');//后台在字符串里面加入了空格 所以用' | 'split
        //console.log('treepath array', tempArray);
        const postIds = item.postId.split(' | ');
        const cascaderArray = tempArray.map((current, index) => {
          return {
            org: current.split(','),//再次split
            duty: `${postIds[index]}`,
          };
        });
        //console.log('-cascader array-', cascaderArray);
        item.editDuties = cascaderArray;
      } else {
        item.editDuties = [];
      }

      this.setState({
        currentItem: { ...item },//deep clone
        modalVisible: true,
        modalType: 'edit',
      });
    };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 50,
      },
      {
        title: '员工号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 150,
      },
      {
        title: '所属工会',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '职务',
        dataIndex: 'postName',
        key: 'postName',
        width: 150,
      },
      {
        title: '入会时间',
        dataIndex: 'joinDate',
        key: 'joinDate',
        width: 100,
        render: (text) => (
          <span>{moment(text).format('YYYY-MM-DD')}</span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 50,
        render(text, record) {
          if(updatePowers){
            return (
              <a onClick={() => edit(record)}>编辑</a>
            );
          }
        },
      },
    ];
    const addBtnProps = {
      order: 1,
      OnEvent: () => {
        //console.log('show create Modal');
        this.setState({
          modalVisible: true,
          modalType: 'create',
          currentItem: {},
        });
      },
    };
    const closeModal = () => {
      this.setState({ modalVisible: false });
    };
    const closeImportModal = () => {

      setTimeout(function(){
        sessionStorage.setItem('tradeM',0);
      },1500);

      this.setState({ importModalVisible: false });
    };
    const importBtnProps = {
      order: 2,
      label: '导入',
      // url: 'services/web/union/user/importUnionUser',
      onClick: () => {
        this.setState({
          importModalVisible: true,
        });
      },
    };
    const exportBtnProps = {
      order: 3,
      url: 'services/web/union/user/export',
      type: '会员管理',
    };
    const deleteBtnProps = {
      order: 4,
      url: 'services/web/union/user/delete',
      delAuthUser: this.delAuthUser
    };
    const changeDutySource = (array) => {
      currentItem.editDuties = array;
      this.setState({ currentItem: { ...currentItem } });
    };
    const refreshScreen = () => {
      sessionStorage.setItem('tradeM',1);
      //console.log('refresh')
      this.ts.getData(`${this.ts.props.url}/1/10?${this.ts.state.query}`);
      closeImportModal();
    };
    return (
      <Spin spinning={false}>
        <div>
          <TableAndSearch
            tsRef={(e) => { this.ts = e; }}
            search={search}
            url={'services/web/union/user/getList'}
            columns={columns}
            addBtn={showCreate ? addBtnProps : null}
            customBtn={showImport ? importBtnProps : null}
            exportBtn={showExport ? exportBtnProps : null}
            deleteBtn={showRemove ? deleteBtnProps : null}
            rowkey={'id'}
            getSelectRow={(selectRowData => {this.setState({selectRowData})})}
          />
          <Modal
            title={modalTitle}
            visible={modalVisible}
            width="50%"
            footer={null}
            onCancel={closeModal}
            destroyOnClose
          >
            <WrappedForm
              onClose={closeModal}
              organizations={organizations}
              currentItem={currentItem}
              changeDutySource={changeDutySource}
              refreshScreen={refreshScreen}
            />
          </Modal>
          <Modal
            title="会员导入"
            visible={importModalVisible}
            onCancel={closeImportModal}
            footer={null}
            destroyOnClose
          >
            <ImportMember
              importUrl="services/web/union/user/importUnionUser"
              downlodUrl={API_PREFIX + 'services/web/union/user/exportTemplate'}
              listurl={'services/web/union/user/getList'}
              pageData={this.props.pageData}
              getData={this.getData}
              fileName='会员信息模板'
              refreshScreen={refreshScreen}
            />
          </Modal>
        </div>
      </Spin>
    );
  }
}
