import React, { Component } from 'react';
import { Card, Form, Col ,Button} from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { getPropsParams } from '@/utils/SystemUtil';

const TITLE = '操作类型详情';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

/**
 * 操作类型统计列表
 */
class OperationTypeStatisticsList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '关键字',
      dataIndex: 'pageName',
      render: (_, record) => {
        const param = getPropsParams(this.props);
        if (!param.id) {
          return <a href={`#/Statistics/OperationTypeStatistics/OperationTypeStatisticsList/${record.pageCode}`}>{record.pageName}</a>
        }
        else {
          return record.operateDesc;
        }
      }
    },
    {
      title: '点击量',
      dataIndex: 'count',
    },
  ];

  private table: SearchTableClass;


  searchCreater = (values: any, pageSize: number, current: number) => {
    const param = getPropsParams(this.props);
    const url = param.id ? `/services/wto/fhwtoaccessoperate/list/detail/${current}/${pageSize}` : `/services/wto/fhwtoaccessoperate/list/${current}/${pageSize}`;
    return {
      method: 'POST',
      url,
      data: {
        pageCode: param.id
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const param = getPropsParams(this.props);
    const preParam = getPropsParams(prevProps);
    if (param.id !== preParam.id) {
      this.table.resetForm();
    }
  }

  transData = (response: any) => {
    return {
      data: response.data.data.data,
      total: response.data.data.length,
    }
  }

  render() {
    return (
      <Card title={TITLE} extra={<Button type='primary' onClick={()=>window.location.hash='#/Statistics/OperationTypeStatistics'}>返回</Button>}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          // formItems={SearchForm}
          searchCreater={this.searchCreater}
          // transData={this.transData}
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
        label: '－－－',
        content: getFieldDecorator('title')(<HInput />),
      },
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
      </div>
    );
  }
}

export default OperationTypeStatisticsList;