import React, { Component } from 'react';
import { Card, Form, Col } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import EditButton from '@/components/EditButton';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { createSearchString, countryCodeSearchStr, hsCodeSearchStr } from '@/utils/SystemUtil';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import WarnInfoLevelEnum from '@/Enums/WarnInfoLevelEnum';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';

const TITLE = '预警信息';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/earlyWarning/WarnInfoList/WarnInfoEdit'
/**
 * 预警信息
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['WarnInfo/remove']),
}))
class WarnInfoList extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'warnTitle',
    },
    {
      title: '发布时间',
      dataIndex: 'warnPublishTime',
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
      width: 160,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;


  remove = (id) => {
    this.props.dispatch(
      {
        type: 'WarnInfo/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    

    console.log('warn', values)

    return `/services/wto/warninfo/list/${current}/${pageSize}${createSearchString(values, (params, key) => {
      switch (key) {
        case 'warnCountry':
          return countryCodeSearchStr(params.warnCountry, 'warnCountry');
        case 'hsCode':
          return hsCodeSearchStr(params.hsCode);
        default:
          return null;
      }
    })}`;
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
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '标题',
        content: getFieldDecorator('warnTitle')(<HInput />),
      },
      {
        label: '发布人',
        content: getFieldDecorator('publishPerson')(<HInput />),
      },
      {
        label: '通报国',
        content: getFieldDecorator('warnCountry')(<CountryWindow />),
      },
      {
        label: '起止时间',
        content: getFieldDecorator('warnPublishTime')(<HRangePicker />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
      },
      {
        label: '预警等级',
        content: getFieldDecorator('warnLevel')(<HSelect>
          {
            createSelectOptions(WarnInfoLevelEnum.ALL_LIST, WarnInfoLevelEnum.toString)
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
                  <FormItem key={item.label} {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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
        </div>
      </div>
    );
  }
}

export default WarnInfoList;