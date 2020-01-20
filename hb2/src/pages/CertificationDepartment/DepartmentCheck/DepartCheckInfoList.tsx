import React, { Component } from 'react';
import { Card, Form, Button, List, Col } from 'antd';
// import FormItem from 'antd/lib/form/FormItem';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import BusinessTypeEnum2 from '@/Enums/BusinessTypeEnum2';

import { createSelectOptions } from '@/utils/AntdUtil';

const EDIT_HASH = '#/DepartmentCheck/DepartCheckInfoList/DepartCheckInfo';
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const FormItem = Form.Item;
@connect(({ loading }) => ({
  // loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartCheckInfoList extends Component<any, any>{

  constructor(props) {
    super(props)
    this.state = {
      // 当前页码，从1开始
      current: 1,
      pageSize: 5,
      // 是否网络请求中
      dataSource: [],
      // 数据总条数
      total: 0,
      values: {}
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    const { current, pageSize, values } = this.state
    const params = `/${current}/${pageSize}${createSearchString(values)}`
    this.props.dispatch(
      {
        type: 'Department/formSearch',
        payLoad: params,
        callBack: (res) => {
          console.log('requestData', res)
          this.setState({
            dataSource: res.data.data,
            total: res.data.length,
          });
        }
      }
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values', values)
      if (err) { return }
      this.setState({
        values
      }, this.requestData)
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      values: {}
    }, this.requestData)
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '检测机构名称',
        content: getFieldDecorator('orgName')(<HInput />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(ExamingStatusEnum.ALL_LIST, ExamingStatusEnum.toString)
          }
        </HSelect>),
      },
    ];
    return (
      <Card title="机构基本信息">
        <div className="divAreaContainer">
          <Form layout="inline">
            {
              FORM_ITEMS.map((item) => {
                return <FormItem key={item.label} label={item.label}>{item.content}</FormItem>;
              })
            }
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit}>查询</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Form>
        </div>

        <List rowKey="id" dataSource={this.state.dataSource} pagination={
          Object.assign(
            {
              pageSize: this.state.pageSize,
              current: this.state.current,
              total: this.state.total,
              showQuickJumper: true,
              showTotal: (total, range) => {
                return `共${this.state.total}条记录`;
              },
              onChange: (page) => {
                this.setState({ current: page }, this.requestData);
              },
            },
          )
        } renderItem={(item) => {
          return (
            <table className="InfoTable">
              <thead>
                <tr>
                  <th colSpan={5}>{`检测机构名称: ${item.orgName || ''}`}</th>
                  <th><a href={`${EDIT_HASH}/${item.id}`}>详情</a></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    [
                      createTdItem('行政区划', `${item.orgDivide || ''}`),
                      createTdItem('负责人', `${item.principal || ''}`),
                      createTdItem('联络人', `${item.contact || ''}`),
                    ]
                  }
                </tr>
                <tr>
                  {
                    [
                      createTdItem('所属行业', `${item.industry || ''}`),
                      createTdItem('固定资产（万元', `${item.fixedAssets || ''}`),
                      createTdItem('最后更新时间', `${item.endTime || ''}`),
                    ]
                  }
                </tr>
                <tr>
                  {
                    [

                      createTdItem('检测机构状态', `${DepartStatusEnum.toString(item.status)}`),
                      createTdItem('审核状态', `${ExamingStatusEnum.toString(item.checkStatus)}`),
                      createTdItem('操作状态', `${BusinessTypeEnum2.toString(item.operationType)}`),
                    ]
                  }
                </tr>
                <tr>
                  {
                    [
                      createTdItem('统一社会信用代码是否重复', `${item.repeat === true ? '重复' : '不重复'}`),
                      createTdItem('', ''),
                      createTdItem('', ''),
                    ]
                  }
                </tr>
              </tbody>
            </table>
          );
        }} />
      </Card>
    );
  }
}

const Wrapper = Form.create({ name: 'DepartCheckInfoList' })(DepartCheckInfoList);

export default Wrapper;