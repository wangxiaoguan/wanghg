import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { connect } from 'dva';
import { splitTimes, filterOb } from '@/utils/utils';

import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['receiveStatistics/remove']),
}))
class ReceiveStatistics extends Component<any, any> {


  private COLUMNS = [
    {
      title: '行政区划',
      dataIndex: 'divide',
    },
    {
      title: '工商库存',
      dataIndex: 'gs',
    },
    {
      title: '民政库存',
      dataIndex: 'mz',
    },
    {
      title: '机构编制库存',
      dataIndex: 'jgbz',
    },
    {
      title: '工会库存',
      dataIndex: 'gh',
    },
    {
      title: '外交库存',
      dataIndex: 'wj',
    },
    {
      title: '中央军委',
      dataIndex: 'zy',
    },
    {
      title: '宗教库存',
      dataIndex: 'zj',
    },
    {
      title: '旅游库存',
      dataIndex: 'ly',
    },
    {
      title: '文化库存',
      dataIndex: 'wh',
    },
    {
      title: '司法行政',
      dataIndex: 'sfxz',
    },
    {
      title: '其他库存',
      dataIndex: 'other',
    },
    {
      title: '合计',
      dataIndex: 'total',
      render: (text,record) => {
        // return (record.divide + record.gs + record.mz + record.jgbz + record.gh + record.wj + record.zy + record.zj + record.ly + record.wh + record.sfxz + record.other )
        let total = 0;
        Object.keys(record).forEach(item => {
          total += record[item] ? record[item] * 1 : 0;
        })
        return <span>{total}</span>
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'receiveStatistics/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  transData(response) {
    const {data} = response;
    const obj = {
      gh:0,
      gs:0,
      jgbz: 0,
      ly: 0,
      mz: 0,
      ny: 0,
      other: 0,
      sfxz: 0,
      wh: 0,
      wj: 0,
      zj: 0,
      zy: 0,
      divide: data.length,
    };
    data.forEach(item => {
      obj.gh += item.gh;
      obj.gs += item.gs;
      obj.jgbz += item.jgbz;
      obj.ly += item.ly;
      obj.mz += item.mz;
      obj.ny += item.ny;
      obj.other += item.other;
      obj.sfxz += item.sfxz;
      obj.wh += item.wh;
      obj.wj += item.wj;
      obj.zj += item.zj;
      obj.zy += item.zy;
    });
    data.push(obj);
    return {
      data: response.data,
      total: response.data.length,
    };
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('search', values)
    const { dataTime, ...others } = values
    // tslint:disable-next-line: prefer-conditional-expression
    if (others.divide && others.divide.length > 0) {
      others.divide = others.divide[others.divide.length - 1]
    } else {
      others.divide = ''
    }
    const times = splitTimes(dataTime, 'beginTime', 'endTime')
    others.beginTime = ''
    others.endTime = ''
    const data = filterOb({
      ...others, ...times
    })
    return {
      method: 'post',
      url: `/services/code/dataStatistics/receiveStatistics`,
      data
    }
  }

  render() {
    return (
      <Card title='接收统计'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
          transData={this.transData}
          pageSize={10000}
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

  componentDidMount() {
    //登记机关
    this.props.dispatch(
      {
        type: 'receiveStatistics/searchRegDic',
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
        label: '登记机关',
        content: getFieldDecorator('divide')(<HCascader changeOnSelect options={regOptions} fieldNames={{ label: 'name', value: 'code', children: 'childs' }} />),
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
      </div>
    );
  }
}

export default ReceiveStatistics;