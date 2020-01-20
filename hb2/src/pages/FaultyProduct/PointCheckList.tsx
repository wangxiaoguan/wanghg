import React, { Component } from 'react';
import { Card, Form, Col, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HRangePicker from '@/components/Antd/HRangePicker';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';

const TITLE = '你点我检管理';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/PointCheckList/PointCheckEdit';
const DETAIL_HAST = '#/PointCheckList/PointCheckDetail'
/**
 * 企业备案管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['pointCheck/remove']),
}))
class PointCheckList extends Component<IDispatchInterface, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private COLUMNS: any[] = [
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品型号',
      dataIndex: 'productModel',
    },
    {
      title: '产品品牌',
      dataIndex: 'brand',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactsName',
    },
    {
      title: '联系方式',
      dataIndex: 'contactsTelephone',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${DETAIL_HAST}/${record.id}`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`} >编辑</a>
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
        type: 'pointCheck/remove',
        payLoad: [{ id }],
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    this.setState({searchData:values})
    return `/services/dpac/defectcheckinforegistry/list/${current}/${pageSize}${createSearchString({ deleteStatus: 1, ...values })}`;
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
          formItemsProps={{searchData:this.state.searchData}}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class SearchForm extends Component<any>  {
  exportExcel() {
    const filedValues: any = this.props.form.getFieldsValue();
    const params: any = {
      flag: 6,
    };
    if (filedValues.name) {
      params.name = filedValues.name;
    }
    if (filedValues.createDate && filedValues.createDate.length >= 2) {
      params.startDate = filedValues.createDate[0].format('YYYY-MM-DD');
      params.endDate = filedValues.createDate[1].format('YYYY-MM-DD');
    }
    if (filedValues.status) {
      params.status = filedValues.status;
    }
    this.props.dispatch(
      {
        type: 'pointCheck/exportExcel',
        payLoad: this.props.searchData,
        callBack: (res) => {
          exportFileFromBlob(res, '你点我检.xlsx');
        }
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '产品名称',
        content: getFieldDecorator('productName')(<HInput />),
      },
      {
        label: '品牌',
        content: getFieldDecorator('brand')(<HInput />),
      },
      {
        label: '姓名',
        content: getFieldDecorator('contactsName')(<HInput />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('contactsTelephone')(<HInput />),
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
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default PointCheckList;