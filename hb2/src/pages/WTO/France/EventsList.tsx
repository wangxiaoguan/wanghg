import React, { Component } from 'react';
import { Card, Form, Button, Col } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import { confirmDelete, createYearOption, createSelectOptions } from '@/utils/AntdUtil';
import { connect } from 'dva';
import DeleteLink from '@/components/DeleteLink';
import EditButton from '@/components/EditButton';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';

const TITLE = '中法大事记';
const FormItem = Form.Item;
const { Option } = HSelect;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/france/EventsList/EventsEdit';

/**
 * 中法大事记
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['FranceEvents/remove']),
}))
class EventsList extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'auditTime',
    },
    {
      title: '所属年度',
      dataIndex: 'year',
    },
    // {
    //   title: '审核状态',
    //   dataIndex: 'checkStatus',
    //   render: (_, record) => {
    //     return CheckStatusEnum.toString(record.checkStatus);
    //   }
    // },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink record={record} target={this} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'FranceEvents/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/chinafrenchevent/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'horizontal' }}
          selectedAble
        />
      </Card>
    );
  }
}


@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['FranceEvents/remove']),
}))
class SearchForm extends Component<any>  {
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
        type: 'FranceEvents/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'FranceEvents/remove',
        payLoad: id,
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
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '所属年度',
        content: getFieldDecorator('year')(<HSelect>
          {
            createYearOption().map((item) => {
              return <Option key={item.toString()} value={item}>{item}</Option>
            })
          }
        </HSelect>),
      },
      {
        label: '起止时间',
        content: getFieldDecorator('auditTime')(<HRangePicker />),
      },
      // {
      //   label: '审核状态',
      //   content: getFieldDecorator('checkStatus')(
      //     <HSelect>
      //       {
      //         createSelectOptions(CheckStatusEnum.ALL_LIST, CheckStatusEnum.toString)
      //       }
      //     </HSelect>
      //   ),
      // },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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
            disabled={isEmptyArray(this.props.selectedRowKeys)}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, true);
            }}
          >
            批量上线
          </Button>
          <Button
            loading={this.props.loadingCheckStatus}
            type="primary"
            disabled={isEmptyArray(this.props.selectedRowKeys)}
            onClick={() => {
              this.updateCheckStatus(this.props.selectedRowKeys, false);
            }}
          >
            批量下线
          </Button>
          <Button
            loading={this.props.loadingDelete}
            onClick={() => {
              confirmDelete(() => {
                this.remove(this.props.selectedRowKeys.join(','));
              });
            }}
            type="danger"
            disabled={isEmptyArray(this.props.selectedRowKeys)}
          >
            批量删除
          </Button>
        </div>
      </div>
    );
  }
}

export default EventsList;