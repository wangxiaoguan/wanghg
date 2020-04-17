import React, { Component } from 'react';
import { Card, Form, Col, Button, Upload, message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSelect from '@/components/Antd/HSelect';
import { DOWNLOAD_API } from '@/services/api';
import { createSelectOptions } from '@/utils/AntdUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { createSearchString, exportFileFromBlob, createExportParams } from '@/utils/SystemUtil';
import { filterOb } from '@/utils/utils'

import SampleTypeEnum from '@/Enums/SampleTypeEnum';
import SamplingResultEnum from '@/Enums/SamplingResultEnum';
import RiskLevelEnum from '@/Enums/RiskLevelEnum';
import ProductCheckStatusEnum from '@/Enums/ProductCheckStatusEnum';

const TITLE = '购检产品管理';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/SampleProductList/SampleProductEdit';
const DETAIL_HASH = '#/SampleProductList/SampleProductDetail/1';
/**
 * 购检产品管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['sampleProduct/remove']),
}))
class SampleProductList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '样品名称',
      dataIndex: 'sampleName',
    },
    {
      title: '商标',
      dataIndex: 'trademark',
    },
    {
      title: '样品类型',
      dataIndex: 'sampleType',
      render: (_, record) => {
        return SampleTypeEnum.toString(record.sampleType);
      }
    },
    {
      title: '标称生产企业名称',
      dataIndex: 'nominalEnterpriseName',
      // render: (_, record) => {
      //   return SamplingTypeEnum.toString(record.samplingType);
      // }
    },
    {
      title: '产区(省份)',
      dataIndex: 'province',
    },
    {
      title: '检测结果',
      dataIndex: 'samplingResult',
      render: (_, record) => {
        return SamplingResultEnum.toString(record.samplingResult);
      }
    },
    {
      title: '风险评估级别',
      dataIndex: 'riskAssessment',
      render: (_, record) => {
        return RiskLevelEnum.toString(record.riskAssessment);
      }
    },
    {
      title: '处理结果',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return ProductCheckStatusEnum.toString(record.checkStatus);
      }
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${DETAIL_HASH}/${record.id}`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'sampleProduct/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  private table: SearchTableClass;


  searchCreater = (values: any, pageSize: number, current: number) => {
    const params = { deleteStatus: '1', ...values }
    return `/services/dpac/defectpurchaseinspection/list/${current}/${pageSize}${createSearchString(params)}`;
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
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingUpdate: Boolean(loading.effects['Judge/updateCheckStatus']),
}))
class SearchForm extends Component<IFormAndDvaInterface, any>  {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };
  }
  exportExcel() {
    const filedValues: any = this.props.form.getFieldsValue();
    // const params: any = filterOb({
    //   flag: 3,
    //   ...filedValues
    // });
    this.props.dispatch(
      {
        type: 'sampleProduct/exportExcel',
        payLoad: createExportParams(filedValues),
        callBack: (res) => {
          exportFileFromBlob(res, '构检产品管理模板.xlsx');
        }
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '样品名称',
        content: getFieldDecorator('sampleName')(<HInput />),
      },
      {
        label: '样品类型',
        content: getFieldDecorator('sampleType')(<HSelect>
          {
            createSelectOptions(SampleTypeEnum.ALL_LIST, SampleTypeEnum.toString)
          }
        </HSelect>),
      },
      // {
      //   label: '抽样类型',
      //   content: getFieldDecorator('samplingType')(<HSelect>
      //     {
      //       createSelectOptions(SamplingTypeEnum.ALL_LIST, SamplingTypeEnum.toString)
      //     }
      //   </HSelect>),
      // },
      {
        label: '检测结果',
        content: getFieldDecorator('samplingResult')(<HSelect>
          {
            createSelectOptions(SamplingResultEnum.ALL_LIST, SamplingResultEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '风险评估级别',
        content: getFieldDecorator('riskAssessment')(<HSelect>
          {
            createSelectOptions(RiskLevelEnum.ALL_LIST, RiskLevelEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '处理结果',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(ProductCheckStatusEnum.ALL_LIST, ProductCheckStatusEnum.toString)
          }
        </HSelect>),
      },
      // {
      //   label: '购检任务来源',
      //   content: getFieldDecorator('taskSource')(<HSelect>
      //     {
      //       createSelectOptions(ProductTaskEnum.ALL_LIST, ProductTaskEnum.toString)
      //     }
      //   </HSelect>),
      // },
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
          <EditButton hash={EDIT_HASH} />
          <Upload action='/services/dpac/file/upload/uploadExcel' showUploadList={false} onChange={(arg) => {
            const { file } = arg;
            console.log(file.status);
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
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
          <a href={DOWNLOAD_API(1923)} target="_blank">下载模板</a>
        </div>
      </div>
    );
  }
}

export default SampleProductList;