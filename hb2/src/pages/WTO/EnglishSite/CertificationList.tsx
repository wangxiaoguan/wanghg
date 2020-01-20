import React, { Component } from 'react';
import { Card, Form, Spin, Button, message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import EditButton from '@/components/EditButton';
import { connect } from 'dva';
import { confirmDelete, htmlToText, createSelectOptions } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';

const TITLE = 'Certification';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/EnglishSite/CertificationList/CertificationEdit';

/**
 * 
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['certification/remove']),
  }
))
class CertificationList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '认证名称',
      dataIndex: 'cName',
    },
    {
      title: '认证内容',
      dataIndex: 'cContent',
      render: (text) => {
        return htmlToText(text);
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createDate',
    },
    {
      title: '发布状态',
      dataIndex: 'publishStatus',
      render: (_, record) => {
        return PublishStatusEnum.toString(record.publishStatus);
      }
    },
    {
      title: '点击量',
      dataIndex: 'clickCount',
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'certification/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtocertification/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['certification/remove']),
    loadingCheckStatus: Boolean(loading.effects['certification/updateCheckStatus']),
  }
))
class SearchForm extends Component<any>  {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'certification/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  updateCheckStatus(idList: string[], isCheck: boolean) {
    if (isEmptyArray(idList)) {
      message.error("请至少选中一项");
      return;
    }
    let params = [];
    const publishStatus = isCheck ? PublishStatusEnum.PUBLISHED : PublishStatusEnum.UNPUBLISH;
    idList.forEach((item) => {
      params.push(
        {
          id: item,
          publishStatus
        }
      )
    });

    this.props.dispatch(
      {
        type: 'certification/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '认证名称',
        content: getFieldDecorator('cName')(<HInput />),
      },
      {
        label: '发布状态',
        content: getFieldDecorator('publishStatus')(
          <HSelect>
            {
              createSelectOptions(PublishStatusEnum.ALL_LIST, PublishStatusEnum.toString)
            }
          </HSelect>
        ),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label}  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
          <Button loading={this.props.loadingCheckStatus} type="primary" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            this.updateCheckStatus(this.props.selectedRowKeys, true);
          }}>指量上线</Button>
          <Button loading={this.props.loadingCheckStatus} type="primary" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            this.updateCheckStatus(this.props.selectedRowKeys, false);
          }}>批量下线</Button>
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys.join(','));
            });
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default CertificationList;