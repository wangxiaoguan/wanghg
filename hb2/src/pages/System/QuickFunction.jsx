import React, {Component} from 'react';
import SearchTable from '@/components/SearchTable';
import {Button, Card, Switch, Modal, Spin} from 'antd';
import {connect} from 'dva';
import QuickFunctionEdit from './QuickFunctionEdit';
import {renderAttatch} from '@/utils/AntdUtil';


const {confirm} = Modal;

@connect(({loading, quickFunction}) => ({
  loading,
  quickFunction,
  loadingUpdate: loading.effects['quickFunction/update'] === true,
  loadingRemove: loading.effects['quickFunction/remove'] === true,
}))
class QuickFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: null,
    };
    this.TABLE_COLUMNS = [
      {
        title: '快捷入口名称',
        dataIndex: 'name',
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
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '是否启用',
        render: (_, record) => {
          return <Switch loading={this.props.loadingUpdate} checkedChildren='启用' unCheckedChildren='禁用' checked={record.visible === 1} onChange={(enbale) => this.updateEnable(record.id, enbale)} />
        },
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <span className='controlsContainer'>
              <a onClick={() => {
                this.editView.show();
                this.setState({editingData: record});
              }}
              >
                编辑
              </a>
              <Spin spinning={this.props.loadingRemove}>
                <a onClick={() => {
                  confirm(
                    {
                      title: '操作不可恢复',
                      content: '是否确认删除快捷入口',
                      okText: '确定',
                      cancelText: '取消',
                      onOk: () => {
                        this.remove(record.id);
                      }
                    }
                  );
                }}
                >
                  删除
                </a>
              </Spin>
            </span>
          );
        },
      },
    ];
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'quickFunction/remove',
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
        type: 'quickFunction/update',
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
    return `/services/indexManage/menu/list/${current}/${pageSize}?Q=type_EQ=enter&&Q=module_EQ=index`;
  }

  transData(response) {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    return (
      <Card title='快捷入口管理'>
        <SearchTable
          getInstance={(target) => {this.table = target}}
          formItems={SearchForm}
          columns={this.TABLE_COLUMNS}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
        <QuickFunctionEdit
          getInstance={(target) => {this.editView = target}}
          orgData={this.state.editingData}
          successHandler={() => {this.table.refresh()}}
        />
      </Card>
    );
  }
}

class SearchForm extends Component {
  render() {
    return (
      <div className='divAreaContainer'>
        <Button type="primary" onClick={() => this.editView.show()}>新增</Button>
        <QuickFunctionEdit getInstance={(target) => {this.editView = target}} successHandler={() => {this.props.refresh()}} />
      </div>
    );
  }
}

export default QuickFunction;