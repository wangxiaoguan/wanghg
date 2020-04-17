import React, { Component } from 'react';
import { Card, Form, Button, Spin, } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import ExportBusinessEdit, { ExportBusinessEditClass } from './ExportBusinessEdit';
import HInput from '@/components/Antd/HInput';
import LimitUpload from '@/components/LimitUpload';

const TITLE = '出口企业名录';
const FormItem = Form.Item;

/**
 * 出口企业名录
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['exportBusiness/remove']),
  }
))
class ExportBusinessDirectory extends Component<any, any> {
  private table: SearchTableClass;
  private editView: ExportBusinessEditClass;

  public state = {
    editRecord: null,
  };

  private COLUMNS: any[] = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '主营行业',
      dataIndex: 'companyIndustry',
    },
    {
      title: '主营产品或服务',
      dataIndex: 'companyProduct',
    }, {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => {
              this.setState({ editRecord: record }, () => this.editView.show());
            }}>查看</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span >
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'exportBusiness/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/company/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
        <ExportBusinessEdit
          getInstance={(target) => this.editView = target}
          orgData={this.state.editRecord}
          successHandler={() => {
            this.table.refresh();
          }}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  private editView: ExportBusinessEditClass;

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '公司名称',
        content: getFieldDecorator('companyName')(<HInput />),
      },
      {
        label: '主营产品或服务',
        content: getFieldDecorator('companyProduct')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => this.editView.show()}>新增</Button>
          <LimitUpload uploadElement='导入企业' max={0} uploadProps={{ showUploadList: false }} action='/services/wto/file/upload/uploadExportCompany' />
          <a href='/services/wto/download/exportCompany' target="_blank">下载导入模板</a>
        </div>
        <ExportBusinessEdit
          getInstance={(target) => this.editView = target}
          successHandler={() => {
            this.props.refresh();
          }}
        />
      </div>
    );
  }
}

export default ExportBusinessDirectory;