import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import { exportFileFromBlob } from '@/utils/SystemUtil';

import HCascader from '@/components/Antd/HCascader';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EDIT_HASH = '#/dataQuery/inquiryCodeBase/inquiryCodeBaseInfo';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['inquiryCodeBase/remove']),
}))
class InquiryCodeBase extends Component<any, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private COLUMNS = [
    {
      title: '组织机构代码',
      dataIndex: 'jgdm',
    },
    {
      title: '机构名称',
      dataIndex: 'jgmc',
    },
    {
      title: '办证机构代码',
      dataIndex: 'bzjgdm',
    },
    {
      title: '办证日期',
      dataIndex: 'bzrq',
    }, {
      title: '最新更新日期',
      dataIndex: 'lastdate',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>详情</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'inquiryCodeBase/remove',
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
    if (data.jjhy && data.jjhy.length > 0) {
      data.jjhy = data.jjhy[data.jjhy.length - 1]
    }
    this.setState({searchData:data})
    return `/services/code/staticinfo/list/${current}/${pageSize}${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title='原组织机构代码存量库'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
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
      indOptions: [],//经济行业
    }
  }

  componentDidMount() {
    //经济行业
    this.props.dispatch(
      {
        type: 'inquiryCodeBase/searchRegDic',
        payLoad: { type: '12', code: '0' },
        callBack: (res) => {
          if (!res.data) { return }
          const indOptions = res.data.map(item => (
            {
              value: item.code,
              label: item.name,
              isLeaf: false,
            }
          ))
          this.setState({ indOptions })
        }
      }
    );
  }

  exportExcel = () => {
    console.log('exportExcel')
    this.props.dispatch(
      {
        type: 'inquiryCodeBase/exportFieldDownLoad',
        payLoad: {
          exportParams:this.props.searchData
        },
        callBack: (res) => {
          exportFileFromBlob(res, `inquiryCodeBase.xls`);
        }
      }
    );
  }

  loadData = (selectedOptions) => {
    console.log('selectedOptions', selectedOptions)
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;
    this.props.dispatch(
      {
        type: 'inquiryCodeBase/searchRegDic',
        payLoad: { type: '12', code: targetOption.value },
        callBack: (res) => {
          // targetOption.loading = false;
          if (!res.data || res.data.length === 0) { return }
          targetOption.children = res.data.map(item => (
            {
              value: item.code,
              label: item.name,
              isLeaf: false,
            }
          ))
          this.setState({
            indOptions: [...this.state.indOptions],
          });
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { indOptions } = this.state
    const FORM_ITEMS = [
      {
        label: '组织机构代码',
        content: getFieldDecorator('jgdm')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('jgmc')(<HInput />),
      },
      {
        label: '机构类型',
        content: getFieldDecorator('jglx')(<HInput />),
      },
      {
        label: '法定代表人',
        content: getFieldDecorator('fddbr')(<HInput />),
      },
      {
        label: '经营范围',
        content: getFieldDecorator('jyfw')(<HInput />),
      },
      {
        label: '经济行业',
        content: getFieldDecorator('jjhy')(
          <HCascader
            options={indOptions}
            changeOnSelect
            loadData={this.loadData}
          />
        ),
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

export default InquiryCodeBase;