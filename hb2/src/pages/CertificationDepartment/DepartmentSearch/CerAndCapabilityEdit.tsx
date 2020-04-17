import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Input, Upload, Radio, Select } from 'antd';
import { connect } from 'dva';
import { createFormRules, orgId } from '@/utils/SystemUtil';
import GlobalEnum from '@/Enums/GlobalEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';
import CerTypeEnum from '@/Enums/CerTypeEnum';
import LimitUpload from '@/components/LimitUpload'


@connect(({ loading }) => ({
  loading
}))
class CerAndCapabilityEdit extends DefaultEditView {
  constructor(props) {
    super(props, "CertificateDetail", '证书信息', {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
    this.state = {
      certs: []
    }
    this.setState({
      detail:true
    })
  }

  componentDidMount() {
    super.componentDidMount()
    this.getAllCert()
  }

  getAllCert() {
    this.props.dispatch({
      type: 'CertificateDetail/getAllCert',
      payLoad: getPropsParams(this.props).id,//orgId(),
      callBack: (res) => {
        this.setState({ certs: res.data })
      }
    })
  }

  transFormValue(formValues) {
    const { certificateAccessory } = formValues
    const file = (certificateAccessory && certificateAccessory[0]) ? certificateAccessory[0].response.entity[0] : {}
    return { ...formValues, certificateAccessory: [{ id: file.id, name: file.name }], orgId: getPropsParams(this.props).id }
  }

  createFormItemList() {
    const getFieldDecorator = this.props.form.getFieldDecorator;

    const {
      certificateClass, certificateType, certificateFlag, certificateNumberOrigin,
      certificateNumber, certificateName, productCount, parameterCount, issueTime,
      endTimes, certificateStatus, certificateAccessory
    } = this.state.orgData || {}

    console.log(this.state.certs)
    
    return [
      {
        label: '证书类型',
        content: getFieldDecorator('certificateClass', { initialValue: certificateClass, rules: createFormRules(true, null) })(
          <Select disabled allowClear={false}>{createSelectOptions(CerTypeEnum.ALL_LIST, CerTypeEnum.toString)}</Select>
        ),
      },
      {
        label: '单双证',
        content: getFieldDecorator('certificateType', { initialValue: certificateType, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '单证', value: '1' }, { label: '双证', value: '2' }]}  disabled allowClear={false}/>
        ),
      },
      {
        label: '证书状况',
        content: getFieldDecorator('certificateFlag', { initialValue: certificateFlag, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '首次', value: '1' }, { label: '扩项', value: '2' }, { label: '复查', value: '3' }]} disabled allowClear={false} />
        ),
      },
      {
        label: '替换证书编号',
        content: getFieldDecorator('certificateNumberOrigin', { initialValue: certificateNumber, rules: createFormRules(false, null) })(
          <Select disabled allowClear={false}>
            {this.state.certs.map(e => <Select.Option key={e.id} value={e.id}>{e.certificateNumber}</Select.Option>)}
          </Select>
        ),
      },
      {
        label: '证书编号',
        content: getFieldDecorator('certificateNumber', { initialValue: certificateNumber, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '证书名称',
        content: getFieldDecorator('certificateName', { initialValue: certificateName, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '产品数量',
        content: getFieldDecorator('productCount', { initialValue: productCount, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '参数数量',
        content: getFieldDecorator('parameterCount', { initialValue: parameterCount, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '证书颁发时间',
        content: getFieldDecorator('issueTime', { initialValue: issueTime, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '有效截止日期',
        content: getFieldDecorator('endTimes', { initialValue: endTimes, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '证书状态',
        content: getFieldDecorator('certificateStatus', { initialValue: certificateStatus, rules: createFormRules(true, null) })(
          <Radio.Group disabled allowClear={false} options={[{ label: '正常', value: '0' }, { label: '注销', value: '1' }]} />
        ),
      },
      // {
      //   label: '证书电子档案',
      //   content: getFieldDecorator('certificateAccessory', { initialValue: certificateAccessory, rules: createFormRules(false, null) })(
      //     <LimitUpload  disabled allowClear={false}/>
      //   ),
      // },
    ];
  }
}

export default Form.create()(CerAndCapabilityEdit);