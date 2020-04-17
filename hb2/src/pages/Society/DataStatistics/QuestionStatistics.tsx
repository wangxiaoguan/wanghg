//问题类型统计
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { connect } from 'dva';
import HCascader from '@/components/Antd/HCascader';
import { splitTimes, filterOb } from '@/utils/utils';

import styles from './index.less';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['questionStatistics/remove']),
}))
class QuestionStatistics extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
    }
  }

  componentDidMount() {
    this.props.dispatch(
      {
        type: 'questionStatistics/searchTableHead',
        callBack: (res) => {
          const columns = this.transTableHead(res.data)
          console.log('columns', columns)
          this.setState({ columns })
        }
      }
    );
  }

  transTableHead = (res = []) => {
    if (res.length === 0) {
      return []
    }
    const columns = res.map(item => {
      return {
        title: item.name,
        dataIndex: `A${item.code}`,
        children: item.childs.map(_ => {

          if (_.name === '其他') {
            return {
              title: _.name,
              dataIndex: `OTHER${_.code}`,
            }
          } else {
            return {
              title: _.name,
              dataIndex: `A${_.code}`,
            }
          }


        })
      }
    })
    columns.unshift({
      title: '地区',
      dataIndex: 'DIVIDE',
      children: null
    }, {
        title: '总计',
        dataIndex: 'TOTAL',
        children: null
      })
    return columns
  }

  transData(response) {
    return {
      data: response.data,
      total: response.data.length,
    };
  }


  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'questionStatistics/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
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
      ...others, ...times, type: '14'
    })
    return {
      method: 'post',
      url: `/services/code/dataStatistics/problemStatistics`,
      data
    }
  }

  render() {
    return (
      <Card title='问题类型统计' className={styles.dataTotal}>
        {this.state.columns.length > 0 ? <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.state.columns}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
          tableProps={{ bordered: true }}
          pageSize={10000}
          transData={this.transData}
        /> : null}
      </Card>
    );
  }
}

@connect(({ loading }) => ({

}))
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
        type: 'questionStatistics/searchRegDic',
        payLoad: { type: '1', code: '420000' },
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

export default QuestionStatistics;