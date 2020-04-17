import {Button, Switch, Card} from 'antd';
import React, {Component} from 'react';

import FriendLinkEdit from './FriendLinkEdit';
import {renderAttatch} from '@/utils/AntdUtil';
import SearchTable from '@/components/SearchTable';
import {connect} from 'dva';
import DeleteLink from '@/components/DeleteLink';

@connect(({loading}) => ({
  loading,
  loadingUpdate: loading.effects['friendLink/update'] === true,
  loadingDelete: loading.effects['friendLink/remove'] === true,
}))
class FriendLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: null,
    };
    this.TABLE_COLUMNS = [
      {
        title: '链接名称',
        dataIndex: 'name',
      },
      {
        title: '链接地址',
        dataIndex: 'skipUrl',
      },
      {
        title: '图片',
        render: (_, record) => {
          return renderAttatch(record.imgUrl);
        }
      },
      {
        title: '显示顺序',
        dataIndex: 'priority',
      },
      {
        title: '是否启用',
        render: (_, record) => {
          return <Switch loading={this.props.loadingUpdate} checkedChildren='启用' unCheckedChildren='禁用' checked={record.visible === 1} onChange={(enbale) => this.updateEnable(record.id, enbale)} />
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span className='controlsContainer'>
              <a onClick={() => {
                this.editView.show();
                this.setState({editingData: record});
              }}
              >
                修改
              </a>
              {/* <a>删除</a> */}
              <DeleteLink target={this} record={record} />
            </span>
          );
        }
      },
    ];
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'friendLink/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  updateEnable = (id, enable) => {
    this.props.dispatch(
      {
        type: 'friendLink/update',
        payLoad: {
          id,
          visible: enable ? 1 : 0
        },
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  searchCreater(formValues, pageSize, current) {
    return `/services/indexManage/menu/list/${current}/${pageSize}?Q=type_EQ=friendLink&&Q=module_EQ=index`;
  }


  render() {
    return (
      <Card title="友情链接">
        <div className='divAreaContainer'>
          <SearchTable
            getInstance={(target) => {this.table = target}}
            formItems={SearchForm}
            columns={this.TABLE_COLUMNS}
            searchCreater={this.searchCreater}
          />
          <FriendLinkEdit
            orgData={this.state.editingData}
            getInstance={(instance) => {this.editView = instance;}}
            successHandler={() => {this.table.refresh()}}
          />
        </div>
      </Card>
    );
  }
}

class SearchForm extends Component {
  render() {
    return (
      <div className='divAreaContainer'>
        <Button type="primary" onClick={() => this.editView.show()}>新增</Button>
        <FriendLinkEdit getInstance={(target) => {this.editView = target}} successHandler={() => {this.props.refresh()}} />
      </div>
    );
  }
}

export default FriendLink;