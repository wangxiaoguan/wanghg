import React, { Component } from 'react';
import { Card, Form, Button, Upload, message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';

const TITLE = '我省产品出口金额信息';
const FormItem = Form.Item;

/**
 * 表格页面的模板
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['ProductExportDataOfOutProvince/remove']),
}))
class ProductExportDataOfOutProvince extends Component<IFormAndDvaInterface, any> {
  private table: SearchTableClass;

  public state = {
    sortType: 'age',
  };

  private COLUMNS: any[] = [
    {
      title: '产品名称',
      dataIndex: 'hsName',
    },
    {
      title: 'HS码',
      dataIndex: 'hsCode',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '出口国家',
      dataIndex: 'exportCountry',
    },
    {
      title: '出口年份',
      dataIndex: 'exportYear',
    },
    {
      dataIndex: 'exportAmount',
      key: 'exportAmount',
      title: '出口金额',
      sorter: (a, b) => {
        return a.exportAmount - b.exportAmount;
      },
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  constructor(props) {
    super(props);
  }

  remove(id) {
    this.props.dispatch(
      {
        type: 'ProductExportDataOfOutProvince/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh()
        },
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtohbexportinfo/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['ProductExportDataOfOutProvince/remove']),
}))
class SearchForm extends Component<any, any>  {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };
  }

  remove(id) {
    this.props.dispatch(
      {
        type: 'ProductExportDataOfOutProvince/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh()
        },
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '产品名称',
        content: getFieldDecorator('hsName')(<HInput />),
      },
      {
        label: 'HS编码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
      },
      {
        label: '所属国家',
        content: getFieldDecorator('exportCountry')(<HInput />),
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
          <Upload action='/services/wto/file/upload/hbexportinfoupload' showUploadList={false} onChange={(arg) => {
            const { file } = arg;
            if (file.status === 'done') {
              this.setState({ uploading: false });
              if (file.response.sucess) {
                message.success('导入成功');
                this.props.refresh();
              }
              else {
                message.error(file.response.entity);
              }
            }
            else if (file.status === 'error') {
              this.setState({ uploading: false });
              if (file.response && file.response.entity) {
                message.error(file.response.entity);
              }
              else {
                message.error('未知错误');
              }
            }
            else {
              this.setState({ uploading: true });
            }
          }}><Button type="primary" loading={this.state.uploading}>导入</Button></Upload>
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              confirmDelete(() => {
                this.remove(this.props.selectedRowKeys);
              })
            }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default ProductExportDataOfOutProvince;