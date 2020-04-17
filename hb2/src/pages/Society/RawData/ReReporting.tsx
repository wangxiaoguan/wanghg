import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import DecBusinessTypeEnum from '@/Enums/DecBusinessTypeEnum';

import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EDIT_HASH = '#/rawData/reReporting/reReportingInfo';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['reReporting/remove']),
}))
class ReReporting extends Component<any, any> {


  private COLUMNS = [
    {
      title: '统一社会信用代码',
      dataIndex: 'tyshxydm',
    },
    {
      title: '机构名称',
      dataIndex: 'jgmc',
    },
    {
      title: '核准日期',
      dataIndex: 'hzrq',
    },
    {
      title: '业务类型',
      dataIndex: 'ywlx',
      render: (_, record) => {
        return DecBusinessTypeEnum.toString(record.ywlx);
      }
    },
    {
      title: '登记机关',
      dataIndex: 'memo10',
    },
    {
      title: '负责人',
      dataIndex: 'fddbr',
    },
    {
      title: '接收时间',
      dataIndex: 'dataTime',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => {
              this.update(record.id)
            }}>上报</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  update = (id) => {
    this.props.dispatch(
      {
        type: 'reReporting/update',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  remove = (id) => {
    this.props.dispatch(
      {
        type: 'reReporting/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const data = { ...values }
    if (data.memo10 && data.memo10.length > 0) {
      data.memo10 = data.memo10[data.memo10.length - 1]
    }

    return `/services/code/dataStatistics/reportList/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title='数据重新上报'>
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

@connect(({ loading }) => ({}))
class SearchForm extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      regOptions: [],//登记机关
    }
  }

  allUpdate = () => {
    this.props.dispatch(
      {
        type: 'reReporting/updateAllStatus',
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'reReporting/searchRegDic',
        payLoad: { type: '3', code: '420000' },
        callBack: (res) => {
          this.setState({ regOptions: res.data })
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { regOptions } = this.state
    const FORM_ITEMS = [
      {
        label: '统一社会信用代码',
        content: getFieldDecorator('tyshxydm')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('jgmc')(<HInput />),
      },
      {
        label: '登记机关',
        content: getFieldDecorator('memo10')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
      },
      {
        label: '接收时间',
        content: getFieldDecorator('dataTime')(<HRangePicker />),
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
          <Button type="primary" onClick={() => this.allUpdate()}>全部上报</Button>
        </div>
      </div>
    );
  }
}

export default ReReporting;