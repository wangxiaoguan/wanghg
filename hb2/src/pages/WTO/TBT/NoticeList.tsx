import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Button, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import { confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import EditButton from '@/components/EditButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import { createSearchString, hsCodeSearchStr, icsCodeSearchStr, countryCodeSearchStr } from '@/utils/SystemUtil';
import ICSCodeWindow from '@/components/SelectedWindows/ICSCodeWindow';
import DeleteLink from '@/components/DeleteLink';
import WTONoticeTypeEnum from '@/Enums/WTONoticeTypeEnum';
import WTONoticeStatusEnum from '@/Enums/WTONoticeStatusEnum';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/tbt/notice/NoticeEdit';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['notice/remove']),
}))
class NoticeList extends Component<any, any> {
  private COLUMNS = [
    {
      title: '通报号',
      dataIndex: 'bulletinCode',
    },
    {
      title: '通报标题',
      dataIndex: 'bulletinTitle',
    },
    {
      title: '产品',
      dataIndex: 'productTag',
    },
    {
      title: '产品出口额（美元）',
      dataIndex: 'count',
    }, {
      title: '通报时间',
      dataIndex: 'bulletinTime',
    },
    {
      title: '通报类型',
      dataIndex: 'bulletinType',
      render: (_, record) => {
        return WTONoticeTypeEnum.toString(record.bulletinType);
      }
    },
    {
      title: '上线状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        // return record.checkStatus === '1' ? '上线' : '下线'
        return PublishStatusEnum.toString(record.checkStatus);
      }
    },
    {
      title: '操作',
      width: 380,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink record={record} target={this} />
            <a>添加补遗</a>
            <a>查看补遗</a>
            <a href={`#/tbt/notice/CommonCheckList/${record.id}`}>查看评议</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'notice/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtobulletin/list/${current}/${pageSize}${createSearchString(values, (params, key) => {
      switch (key) {
        case 'hsCode':
          return hsCodeSearchStr(params.hsCode);
        case 'icsCode':
          return icsCodeSearchStr(params.icsCode);
        case 'bulletinMember':
          return countryCodeSearchStr(params.bulletinMember, 'bulletinMember')
        default:
          return null;
      }
    })}`;
  }

  render() {
    return (
      <Card title='通报管理'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['notice/remove']),
  loadingCheckStatus: Boolean(loading.effects['notice/updateCheckStatus']),
}))
class SearchForm extends Component<any, any> {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'notice/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  updateCheckStatus(idList: string[], isCheck: boolean) {
    let params = [];
    const checkStatus = isCheck ? 1 : 0
    idList.forEach((item) => {
      params.push(
        {
          id: item,
          checkStatus
        }
      )
    });

    this.props.dispatch(
      {
        type: 'notice/updateCheckStatus',
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
        label: '通报号',
        content: getFieldDecorator('bulletinCode')(<HInput />),
      },
      {
        label: '通报成员',
        content: getFieldDecorator('bulletinMember')(<CountryWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
      },
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode')(<ICSCodeWindow />),
      },
      {
        label: '起止时间',
        content: getFieldDecorator('bulletinTime')(<HRangePicker />),
      },
      {
        label: '通报类型',
        content: getFieldDecorator('bulletinType')(
          <HSelect>
            {
              createSelectOptions(WTONoticeTypeEnum.ALL_LIST)
            }
          </HSelect>
        ),
      },
      {
        label: '公告类型',
        content: getFieldDecorator('noticeType')(
          <HSelect>
            {
              createSelectOptions(WTONoticeStatusEnum.ALL_LIST, WTONoticeStatusEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '发布状态',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(PublishStatusEnum.ALL_LIST, PublishStatusEnum.toString)
          }
        </HSelect>),
      },
    ];

    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>

              );
            })
          }
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
          <Button
            loading={this.props.loadingCheckStatus}
            type="primary"
            disabled={!this.props.selectedRowKeys || !this.props.selectedRowKeys.length}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, true);
            }}
          >
            批量上线
          </Button>
          <Button
            loading={this.props.loadingCheckStatus}
            type="primary"
            disabled={!this.props.selectedRowKeys || !this.props.selectedRowKeys.length}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, false);
            }}
          >
            批量下线
          </Button>
          <Button
            loading={this.props.loadingDelete}
            onClick={() => {
              console.log(this.props);
              confirmDelete(() => {
                this.remove(this.props.selectedRowKeys.join(','));
              });
            }}
            type="danger"
            disabled={!this.props.selectedRowKeys || !this.props.selectedRowKeys.length}
          >
            批量删除
          </Button>
        </div>
      </div>
    );
  }
}

export default NoticeList;