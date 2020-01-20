import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, DatePicker } from 'antd';
import { connect } from 'dva';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import { createSelectOptions } from '@/utils/AntdUtil';

import SampleTypeEnum from '@/Enums/SampleTypeEnum';
import SamplingTypeEnum from '@/Enums/SamplingTypeEnum';
import SamplingResultEnum from '@/Enums/SamplingResultEnum';
import ProductTaskEnum from '@/Enums/ProductTaskEnum';
import RiskLevelEnum from '@/Enums/RiskLevelEnum';
import ProductCheckStatusEnum from '@/Enums/ProductCheckStatusEnum';
import { getPropsParams } from '@/utils/SystemUtil';

import moment from 'moment';

@connect(({ loading }) => ({
  loading
}))
class SampleProductEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'sampleProduct', '购检产品编辑');
  }

  componentDidUpdate(prevProps) {
    let prevParam = getPropsParams(prevProps);
    let param = getPropsParams(this.props);
    const {detail} = this.state
    if (param.type && !detail) {
      // this.getOrgData();
      this.setState({
        detail:true
      })
    }
  }



  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const {detail} = this.state
    return [
      // {
      //   label: '购检任务来源',
      //   content: getFieldDecorator('taskSource', { initialValue: orgData.taskSource })(<HSelect disabled={detail} allowClear={!detail}>
      //     {
      //       createSelectOptions(ProductTaskEnum.ALL_LIST, ProductTaskEnum.toString)
      //     }
      //   </HSelect>),
      // },
      {
        label: '检测报告编号',
        content: getFieldDecorator('reportCode', { initialValue: orgData.reportCode })(<HInput  disabled={detail} allowClear={!detail}/>),
      },
      {
        label: '检测单位',
        content: getFieldDecorator('inspectionStation', { initialValue: orgData.inspectionStation })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '标称生产企业名称',
        content: getFieldDecorator('nominalEnterpriseName', { initialValue: orgData.nominalEnterpriseName })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '标称生产企业地址',
        content: getFieldDecorator('nominalEnterpriseAddress', { initialValue: orgData.nominalEnterpriseAddress })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('contact', { initialValue: orgData.contact })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '产区（省份)',
        content: getFieldDecorator('province', { initialValue: orgData.province })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '购样日期',
        content: getFieldDecorator('sampleDate', { initialValue: moment(orgData.sampleDate) })(<DatePicker disabled={detail} allowClear={!detail} />),
      },
      {
        label: '流通单位名称',
        content: getFieldDecorator('circulationEnterpriseName', { initialValue: orgData.circulationEnterpriseName })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '流通单位地址',
        content: getFieldDecorator('circulationEnterpriseAddress', { initialValue: orgData.circulationEnterpriseAddress })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '样品类型',
        content: getFieldDecorator('sampleType', { initialValue: orgData.sampleType })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(SampleTypeEnum.ALL_LIST, SampleTypeEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '样品名称',
        content: getFieldDecorator('sampleName', { initialValue: orgData.sampleName })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '商标',
        content: getFieldDecorator('trademark', { initialValue: orgData.trademark })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '规格型号',
        content: getFieldDecorator('specification', { initialValue: orgData.specification })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '生产日/批号',
        content: getFieldDecorator('batchNumber', { initialValue: moment(orgData.batchNumber) })(<DatePicker disabled={detail} allowClear={!detail} />),
      },
      {
        label: '抽样数量',
        content: getFieldDecorator('count', { initialValue: orgData.count })(<HInput disabled={detail} allowClear={!detail} />),
      },
      // {
      //   label: '抽样类型',
      //   content: getFieldDecorator('samplingType', { initialValue: orgData.samplingType })(<HSelect disabled={detail} allowClear={!detail}>
      //     {
      //       createSelectOptions(SamplingTypeEnum.ALL_LIST, SamplingTypeEnum.toString)
      //     }
      //   </HSelect>),
      // },
      {
        label: '不合格项目',
        content: getFieldDecorator('unqualifiedItem', { initialValue: orgData.unqualifiedItem })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '检测结果',
        content: getFieldDecorator('samplingResult', { initialValue: orgData.samplingResult })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(SamplingResultEnum.ALL_LIST, SamplingResultEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '风险评估级别',
        content: getFieldDecorator('riskAssessment', { initialValue: orgData.riskAssessment })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(RiskLevelEnum.ALL_LIST, RiskLevelEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '处理结果',
        content: getFieldDecorator('checkStatus', { initialValue: orgData.checkStatus })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(ProductCheckStatusEnum.ALL_LIST, ProductCheckStatusEnum.toString)
          }
        </HSelect>),
      },
    ];
  }

}

export default Form.create()(SampleProductEdit);