import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { exportFileFromBlob } from '@/utils/SystemUtil';


const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['verificationDatabase/remove']),
}))
class VerificationDatabase extends Component<any, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private COLUMNS = [
    {
      title: '办证机构代码',
      dataIndex: 'bzjgdm',
    },
    {
      title: '存量数',
      dataIndex: 'total',
    },
    {
      title: '赋码数',
      dataIndex: 'transformed',
    },
    {
      title: '存量转化率',
      dataIndex: 'percentage',
      render: (_, record) => {
        if (record.percentage) {
          let percentage = record.percentage.length > 5 ?
            record.percentage.substr(0, 5) : record.percentage
          return `${(parseFloat(percentage) * 100).toFixed(2)}%`;
        } else {
          return '0%'
        }
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'verificationDatabase/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  protected transData(response) {
    return {
      data: response.data,
      total: response.data.length,
    };
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    if (!values.bzjgdm) {
      values.bzjgdm = ''
    }
    this.setState({searchData:values})
    return {
      method: 'post',
      url: `/services/code/dataStatistics/stockStatistics`,
      data: values
    }
  }


  render() {
    return (
      <Card title='存量数据转化率'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          transData={this.transData}
          formProps={{ layout: 'horizontal' }}
          formItemsProps={{searchData:this.state.searchData}}
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
    }
  }

  exportExcel = () => {
    console.log('exportExcel')
    this.props.dispatch(
      {
        type: 'verificationDatabase/exportFieldDownLoad',
        payLoad: {
          exportParams:this.props.searchData
        },
        callBack: (res) => {
          exportFileFromBlob(res, `verificationDatabase.xls`);
        }
      }
    );
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '办证机构代码',
        content: getFieldDecorator('bzjgdm')(<HInput />),
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
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default VerificationDatabase;