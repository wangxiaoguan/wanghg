import { Button, Card, Modal, Switch, Spin } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import SearchTable from '@/components/SearchTable';
import AdvertEnum from '@/Enums/AdvertEnum';
import { renderAttatch } from '@/utils/AntdUtil';

const { confirm } = Modal;

@connect(({ loading, advert }) => ({
  advert,
  loadingIsShow: loading.effects['verifyAdvert/update'],
  loadingDelete: loading.effects['verifyAdvert/remove'],
}))
class AdvertList extends Component {
  constructor(props) {
    super(props);
    this.searchTable = null;
    this.TABLE_COLUMNS = [
      {
        title: '图片',
        dataIndex: 'imgId',
        render: (text) => {
          return renderAttatch(text);
        }
      },
      {
        title: '关联类型',
        dataIndex: 'associateType',
        render: (_, record) => {
          return AdvertEnum.toString(record.associateType);
        }
      },
      {
        title: '资讯标题',
        dataIndex: 'name',
        render: (_, record) => {
          return record.title || record.skipUrl;
        }
      },
      {
        title: '顺序',
        dataIndex: 'priority',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '是否启用',
        render: (text, record) => {
          return (
            <Switch
              loading={this.props.loadingIsShow}
              checkedChildren='启用'
              unCheckedChildren='禁用'
              checked={record.isShow === 1}
              onChange={(enable) => {
                this.updateIsShow(record.id, enable ? 1 : 0);
              }}
            />
          );
        }
      },
      {
        title: '操作',
        width: 120,
        render: (text, record) => {
          return (
            <span className='controlsContainer'>
              <a href={`#/CerInformationPublish/AdvertList/AdvertEdit/${record.id}`}>编辑</a>
              <Spin spinning={!!this.props.loadingDelete}>
                <a onClick={() => {
                  confirm(
                    {
                      title: '操作不可恢复',
                      content: '是否确认删除轮播图',
                      okText: '确定',
                      cancelText: '取消',
                      onOk: () => {
                        this.deleteAdvert(record.id);
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

  searchCreater(formValues, pageSize, current) {
    return `/services/indexManage/image/list/${current}/${pageSize}?Q=module_EQ=exam`;
  }

  transData(response) {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  updateIsShow(id, isShow) {
    this.props.dispatch(
      {
        type: 'verifyAdvert/update',
        payLoad: {
          id,
          isShow,
        },
        callBack: () => {
          this.searchTable.refresh();
        },
      }
    );
  }

  deleteAdvert(id) {
    this.props.dispatch(
      {
        type: 'verifyAdvert/remove',
        payLoad: id,
        callBack: () => {
          this.searchTable.refresh();
        },
      }
    );
  }



  render() {
    return (
      <Card title='轮播图管理'>
        <SearchTable
          getInstance={(target) => { this.searchTable = target }}
          formItems={SearchForm}
          columns={this.TABLE_COLUMNS}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
      </Card>
    );
  }
}

class SearchForm extends Component {
  render() {
    return (
      <div className="divAreaContainer">
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            window.location.hash = '/CerInformationPublish/AdvertList/AdvertEdit';
          }}
        >
          新建
        </Button>
      </div>
    )
  }
}

export default AdvertList;