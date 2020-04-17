import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Input, Upload, Radio, Select } from 'antd';
import { connect } from 'dva';
import { createFormRules, getPropsParams } from '@/utils/SystemUtil';
// import GlobalEnum from '@/Enums/GlobalEnum';
// import { createSelectOptions } from '@/utils/AntdUtil';
// import CerTypeEnum from '@/Enums/CerTypeEnum';


//该页面有两块数据需要分别去获取

@connect(({ loading }) => ({ loading }))
class CerAndCapabilityExtension extends DefaultEditView {
  constructor(props) {
    super(props, "Certificate", '录入', {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
    this.state = {
      cerData: {},
      capabilityData: {}
    }
  }

  //重写父类方法
  //分别获取相关信息
  componentDidMount() {
    this.getCerData()
    this.getCapabilityData()
  }


  getCerData() {

    const cerId = this.certificateId()
    if (cerId !== undefined) {
      this.props.dispatch({
        type: `${this._nameSpace}/search`,
        payLoad: cerId,
        callBack: (res) => {
          this.setState({ cerData: res.data });
          this.props.form.resetFields();
        }
      });
    }
  }

  getCapabilityData() {

    const capId = this.capabilityId()
    if (capId !== undefined) {
      this.props.dispatch({
        type: `DepartCheckAbilityList/search`,
        payLoad: capId,
        callBack: (res) => {
          this.setState({ capabilityData: res.data });
          this.props.form.resetFields();
        }
      });
    }
  }

  certificateId() {
    let param = getPropsParams(this.props);
    const ids = param.id.split('+')
    console.log('ids', ids)
    return ids[0]
  }

  capabilityId() {
    let param = getPropsParams(this.props);
    const ids = param.id.split('+')
    return ids[1]
  }

  //重写save方法 
  //原因是constructor里面的namespace不一样 
  //分证书和能力表两个model

  transFormValue(formValues) {
    return { ...formValues, certifId: this.certificateId() }
  }

  save() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        
        if (this.capabilityId()) {//update
          this.props.dispatch({
            type: 'DepartCheckAbilityList/update',
            payLoad: { ...this.transFormValue(values), id: this.capabilityId() },
            callBack: () => {
              window.history.back();
            }
          })
        } else {//add
          this.props.dispatch({
            type: 'DepartCheckAbilityList/add',
            payLoad: this.transFormValue(values),
            callBack: () => {
              window.history.back();
            }
          });
        }
      }
    });
  }

  createFormItemList() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const {
      certificateClass, certificateType, certificateFlag, certificateNumberOrigin,
      certificateNumber, certificateName, productCount, parameterCount, issueTime,
      endTimes, certificateStatus, certificateAccessory,
      orgName
    } = this.state.cerData

    const { checkType, isParamType, proNum, preName, proType, parNum, parName, standardName, standardNum, bound, sycc } = this.state.capabilityData
    return [
      {
        label: '所属检测机构名称',
        content: getFieldDecorator('orgName', { initialValue: orgName, rules: createFormRules(true, null) })(
          <Input disabled />
        ),
      },
      {
        label: '所属证书名称',
        content: getFieldDecorator('certificateName', { initialValue: certificateName, rules: createFormRules(true, null) })(
          <Input disabled />
        ),
      },
      {
        label: '所属证书编号',
        content: getFieldDecorator('certificateNumber', { initialValue: certificateNumber, rules: createFormRules(true, null) })(
          <Input disabled />
        ),
      },
      {
        label: '能力检测类型',
        content: getFieldDecorator('checkType', { initialValue: checkType, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '产品', value: '1' }, { label: '参数', value: '2' }]} />
        ),
      },
      {
        label: '是否全部参数',
        content: getFieldDecorator('isParamType', { initialValue: isParamType, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '全部参数', value: '1' }, { label: '部分参数', value: '2' }]} />
        ),
      },

      {
        label: '检测产品序号',
        content: getFieldDecorator('proNum', { initialValue: proNum, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测产品/项目',
        content: getFieldDecorator('preName', { initialValue: preName, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测产品/项目类别',
        content: getFieldDecorator('proType', { initialValue: proType, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测参数序号',
        content: getFieldDecorator('parNum', { initialValue: parNum, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测参数名称',
        content: getFieldDecorator('parName', { initialValue: parName, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测标准名称',
        content: getFieldDecorator('standardName', { initialValue: standardName, rules: createFormRules(true, null) })(<Input />),
      },
      {
        label: '检测标准编号',
        content: getFieldDecorator('standardNum', { initialValue: standardNum, rules: createFormRules(true, null) })(
          <Input />
        ),
      },
      {
        label: '限制范围说明',
        content: getFieldDecorator('bound', { initialValue: bound, rules: createFormRules(true, null) })(
          <Input />
        ),
      },
      {
        label: '所属场景',
        content: getFieldDecorator('sycc', { initialValue: sycc, rules: createFormRules(true, null) })(
          <Input />
        ),
      },
    ];
  }
}

export default Form.create()(CerAndCapabilityExtension);