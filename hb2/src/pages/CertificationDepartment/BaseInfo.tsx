import React, { Component } from 'react';
import { Button, Form, Card, Input, Radio, InputNumber, message } from 'antd';
const FormItem = Form.Item;
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { connect } from 'dva';
import { createFormRules, getPropsParams } from '@/utils/SystemUtil';
import OrgRankEnum from '@/Enums/OrgRankEnum';
import HSelect from '@/components/Antd/HSelect';
import { createSelectOptions } from '@/utils/AntdUtil';
import LegalPersonEnum from '@/Enums/LegalLabEnum';
import FacilityEnum from '@/Enums/FacilityEnums';
import IndustryModal from './IndustryModal'
import AddressEntry from './AddressEntry'

interface IUserInfoState {
  readOnly: boolean;
  orgData: any;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const LabLable = [
  '',
  '社团法人',
  '事业法人',
  '企业法人',
  '其他',
]

@connect(({ loading }) => ({
  loading,
  loadingAdd: Boolean(loading.effects['UserBackStage_BaseInfo/add']),
}))
class BaseInfo extends Component<IFormAndDvaInterface, IUserInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      orgData: {},
      visibel: false
    };
  }

  componentDidMount() {
    this.requestData();
  }

  valueVerify = (values) => {
    // console.log(values)
    if (!(values.total > values.manager)) {
      message.error('总人数需大于管理人数')
      return false
    } else if (!(values.total === values.advanced + values.intermediate + values.primaryCount + values.other)) {
      message.error('总人数需等于高中初级及其他人员之和')
      return false
    } else if (!(values.total === values.graduateStudent + values.regularCollegeCourse + values.juniorCollege)) {
      message.error('总人数需等于所有教育程度人员之和')
      return false
    } else if (!(values.equipmentSum > values.entranceNum)) {
      message.error('设备总数需大于进口设备数')
      return false
    } else if (!(values.totalArea > values.examRoomArea)) {
      message.error('检测机构面积需大于检测室面积')
      return false
    }
    return true
  }

  requestData() {
    this.props.dispatch({
      type: 'Department/search',
      payLoad: getPropsParams(this.props).id,
      callBack: res => {
        this.setState({ orgData: res.data || {} });
        this.props.form.resetFields();
      },
    });
  }

  industryModal: IndustryModal

  render() {
    const { readOnly, visible } = this.state;
    const {
      orgName,
      orgAddr,
      orgCode,
      orgDivide,
      postCode,
      fax,
      email,
      principal,
      principalDuty,
      principalTel,
      principalPhone,
      contactDuty,
      contact,
      contactTel,
      contactPhone,
      industry,
      rank,
      unitName,
      unitAddr,
      unitDivide,
      unitPostcode,
      unitFax,
      unitEmail,
      unitPrincipal,
      unitPrincipalDuty,
      unitPrincipalPhone,
      departmentName,
      departmentAddr,
      departmentDivide,
      departmentPostcode,
      departmentFax,
      departmentEmail,
      departmentPrincipal,
      departmentPrincipalDuty,
      departmentPrincipalPhone,
      labFeature,
      legalLab,
      labBelongTo,
      total,
      manager,
      advanced,
      advancedPercent,
      intermediate,
      intermediatePercent,
      primaryCount,
      primaryPercent,
      other,
      otherPercent,
      graduateStudent,
      regularCollegeCourse,
      juniorCollege,
      fixedAssets,
      equipmentSum,
      entranceNum,
      assetCondition,
      assetConditionPercent,
      totalArea,
      examRoomArea,
      thermostatRoom,
      outExamFloorSpace,
      reportCount,
      applyForTime,
      endTime,
      status,
      checkStatus,
      reason,
      technologyPerson
    } = this.state.orgData;
    const getFieldDecorator = this.props.form.getFieldDecorator;

    const addressInitialValue = {
      cAndD: orgAddr && orgAddr.split('>>').slice(0, 2),
      street: orgAddr && orgAddr.split('>>').slice(-1)
    }

    const unitAddrInitialValue = {
      cAndD: unitAddr && unitAddr.split('>>').slice(0, 2),
      street: unitAddr && unitAddr.split('>>').slice(-1)
    }

    const departmentAddrInitialValue = {
      cAndD: departmentAddr && departmentAddr.split('>>').slice(0, 2),
      street: departmentAddr && departmentAddr.split('>>').slice(-1)
    }

    const FORM_ITEMS_BASE = [
      {
        label: '检测机构名称',
        content: getFieldDecorator('orgName', { initialValue: orgName, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '检测机构地址',
        content: getFieldDecorator('orgAddr', { initialValue: addressInitialValue, rules: createFormRules(true, null) })(
          <AddressEntry disabled={readOnly} />
        ),
      },
      {
        label: '机构代码',
        content: getFieldDecorator('orgCode', { initialValue: orgCode, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '所属行政区域',
        content: getFieldDecorator('orgDivide', { initialValue: orgDivide, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '邮编',
        content: getFieldDecorator('postCode', { initialValue: postCode })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '传真',
        content: getFieldDecorator('fax', { initialValue: fax })(<Input disabled={readOnly} />),
      },
      {
        label: 'EMail',
        content: getFieldDecorator('email', { initialValue: email })(<Input disabled={readOnly} />),
      },
      {
        label: '负责人',
        content: getFieldDecorator('principal', { initialValue: principal, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人职务',
        content: getFieldDecorator('principalDuty', { initialValue: principalDuty })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人电话',
        content: getFieldDecorator('principalTel', { initialValue: principalTel, rules: createFormRules(false, null, /0\d{2,3}-\d{7,8}/, '请输入正确的电话格式') })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人手机',
        content: getFieldDecorator('principalPhone', { initialValue: principalPhone, rules: createFormRules(true, null, /^1[0-9]{10}$/, '请输入正确的电话格式') })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '联络人',
        content: getFieldDecorator('contact', { initialValue: contact, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '联络人职务',
        content: getFieldDecorator('contactDuty', { initialValue: contactDuty })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '联络人电话',
        content: getFieldDecorator('contactTel', { initialValue: contactTel, rules: createFormRules(true, null, /0\d{2,3}-\d{7,8}/, '请输入正确的电话格式') })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '联络人手机',
        content: getFieldDecorator('contactPhone', { initialValue: contactPhone, rules: createFormRules(false, null, /^1[0-9]{10}$/, '请输入正确的电话格式') })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '所属行业',
        content: (
          <div>
            {getFieldDecorator('industry', { initialValue: industry })(<Input style={{ width: '87%' }} disabled={readOnly} />)}
            <Button style={{ float: 'right', marginTop: 4 }} type="primary" disabled={readOnly} onClick={() => { this.setState({ visible: !visible }) }}>选择</Button>
          </div>
        ),
      },
      {
        label: '机构级别',
        content: getFieldDecorator('rank', { initialValue: rank })(
          <HSelect disabled={readOnly}>
            {createSelectOptions(OrgRankEnum.ALL_LIST, OrgRankEnum.toString)}
          </HSelect>
        ),
      },
    ];
    const FORM_ITEMS_LEGAL_ENTITY = [
      {
        label: '单位名称',
        content: getFieldDecorator('unitName', { initialValue: unitName, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '单位地址',
        content: getFieldDecorator('unitAddr', { initialValue: unitAddrInitialValue, rules: createFormRules(true, null) })(
          <AddressEntry disabled={readOnly} />
        ),
      },

      {
        label: '所属行政区域',
        content: getFieldDecorator('unitDivide', { initialValue: unitDivide, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '单位邮编',
        content: getFieldDecorator('unitPostcode', { initialValue: unitPostcode, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '单位传真',
        content: getFieldDecorator('unitFax', { initialValue: unitFax, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '单位EMail',
        content: getFieldDecorator('unitEmail', { initialValue: unitEmail, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '单位负责人',
        content: getFieldDecorator('unitPrincipal', { initialValue: unitPrincipal, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人职务',
        content: getFieldDecorator('unitPrincipalDuty', { initialValue: unitPrincipalDuty, rules: createFormRules(true, null) })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人电话',
        content: getFieldDecorator('unitPrincipalPhone', { initialValue: unitPrincipalPhone, rules: createFormRules(true, null, /0\d{2,3}-\d{7,8}/, '请输入正确的电话格式') })(
          <Input disabled={readOnly} />
        ),
      },
    ];

    const FORM_ITEMS_COMPETENT_DEPARTMENT = [
      {
        label: '部门名称',
        content: getFieldDecorator('departmentName', { initialValue: departmentName })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '部门地址',
        content: getFieldDecorator('departmentAddr', { initialValue: departmentAddrInitialValue })(
          <AddressEntry disabled={readOnly} />
        ),
      },

      {
        label: '所属行政区域',
        content: getFieldDecorator('departmentDivide', { initialValue: departmentDivide })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '部门邮编',
        content: getFieldDecorator('departmentPostcode', { initialValue: departmentPostcode })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '部门传真',
        content: getFieldDecorator('departmentFax', { initialValue: departmentFax })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '部门EMail',
        content: getFieldDecorator('departmentEmail', { initialValue: departmentEmail })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '部门负责人',
        content: getFieldDecorator('departmentPrincipal', { initialValue: departmentPrincipal })(
          <Input disabled={readOnly} />
        ),
      },
      {
        label: '负责人职务',
        content: getFieldDecorator('departmentPrincipalDuty', {
          initialValue: departmentPrincipalDuty,
        })(<Input disabled={readOnly} />),
      },
      {
        label: '负责人电话',
        content: getFieldDecorator('departmentPrincipalPhone', {
          initialValue: departmentPrincipalPhone, rules: createFormRules(false, null, /0\d{2,3}-\d{7,8}/, '请输入正确的电话格式')
        })(<Input disabled={readOnly} />),
      },
    ];
    const categoryAndSpecialty = [
      {
        label: '检测机构设施特点',
        content: getFieldDecorator('labFeature', { initialValue: labFeature })(
          <HSelect disabled={readOnly}>
            {createSelectOptions(FacilityEnum.ALL_LIST, FacilityEnum.toString)}
          </HSelect>
        ),
      },
      {
        label: '检测机构独立法人',
        content: getFieldDecorator('legalLab', { initialValue: LabLable[parseInt(legalLab)] })(
          <HSelect disabled={readOnly}>
            {createSelectOptions(LegalPersonEnum.ALL_LIST, LegalPersonEnum.toString)}
          </HSelect>
        ),
      },
      {
        label: '检测机构所属法人',
        content: getFieldDecorator('labBelongTo', { initialValue: LabLable[parseInt(labBelongTo)] })(
          <HSelect disabled={readOnly}>
            {createSelectOptions(LegalPersonEnum.ALL_LIST, LegalPersonEnum.toString)}
          </HSelect>
        ),
      },
    ];

    /**
     * 检测机构资源信息
     */
    const orgSourceInfo = [
      {
        label: '总人数',
        content: getFieldDecorator('total', { initialValue: total, rules: createFormRules(true, null) })(
          <InputNumber disabled={readOnly} precision={0} parser={(v) => Math.round(Number(v) || 0)} />
        ),
      },
      {
        label: '管理人员',
        content: getFieldDecorator('manager', { initialValue: manager, rules: createFormRules(true, null) })(
          <InputNumber disabled={readOnly} precision={0} parser={(v) => Math.round(Number(v) || 0)} />
        ),
      },
      {
        label: '技术检测人员',
        content: getFieldDecorator('technologyPerson', { initialValue: technologyPerson, rules: createFormRules(true, null) })(
          <InputNumber disabled={readOnly} precision={0} parser={(v) => Math.round(Number(v) || 0)} />
        ),
      },
      {
        label: '高级专业技术职称人数',
        content: getFieldDecorator('advanced', { initialValue: advanced, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '高级专业技术职称占比(%)',
        content: getFieldDecorator('advancedPercent', {
          initialValue: advancedPercent,
          rules: [{ message: '请输入正确的占比', pattern: /^\d+(?:\.\d{0,2})?/ }],
        })(<InputNumber disabled={readOnly} parser={(c) => parseFloat(c).toFixed(2) || 0} min={0} max={100} step={0.01} />),
      },
      {
        label: '中级专业技术职称人数',
        content: getFieldDecorator('intermediate', { initialValue: intermediate, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />

        ),
      },
      {
        label: '中级专业技术职称占比(%)',
        content: getFieldDecorator('intermediatePercent', {
          initialValue: intermediatePercent,
          // rules: [{ message: '请输入数字', pattern: /^[0-9]*$/ }],
        })(<InputNumber disabled={readOnly} parser={(c) => parseFloat(c).toFixed(2) || 0} min={0} max={100} step={0.01} />),
      },
      {
        label: '初级专业技术职称人数',
        content: getFieldDecorator('primaryCount', { initialValue: primaryCount, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '初级专业技术职称占比(%)',
        content: getFieldDecorator('primaryPercent', {
          initialValue: primaryPercent,
          // rules: [{ message: '请输入数字', pattern: /^[0-9]*$/ }],
        })(<InputNumber disabled={readOnly} parser={(c) => parseFloat(c).toFixed(2) || 0} min={0} max={100} step={0.01} />),
      },
      {
        label: '其他人员人数',
        content: getFieldDecorator('other', { initialValue: other, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />

        ),
      },
      {
        label: '其他人员占比(%)',
        content: getFieldDecorator('otherPercent', {
          initialValue: otherPercent,
          // rules: [{ message: '请输入数字', pattern: /^[0-9]*$/ }],
        })(<InputNumber disabled={readOnly} parser={(c) => parseFloat(c).toFixed(2) || 0} min={0} max={100} step={0.01} />),
      },
      {
        label: '研究生以上学历',
        content: getFieldDecorator('graduateStudent', { initialValue: graduateStudent, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '大学本科',
        content: getFieldDecorator('regularCollegeCourse', { initialValue: regularCollegeCourse, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '专科及以下学历',
        content: getFieldDecorator('juniorCollege', { initialValue: juniorCollege, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '固定资产原有值',
        content: getFieldDecorator('fixedAssets', { initialValue: fixedAssets, rules: createFormRules(true, null) })(
          <InputNumber precision={0} disabled={readOnly} />
        ),
      },
      {
        label: '仪器设备总数',
        content: getFieldDecorator('equipmentSum', { initialValue: equipmentSum, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '进口仪器设备',
        content: getFieldDecorator('entranceNum', { initialValue: entranceNum, rules: createFormRules(true, null) })(
          <InputNumber precision={0} disabled={readOnly} />
        ),
      },
      {
        label: '产权状况',
        content: getFieldDecorator('assetCondition', { initialValue: assetCondition })(
          <Radio.Group
            disabled={readOnly}
            options={[
              { label: '自有', value: 1 },
              { label: '租用', value: 2 },
              { label: '合资', value: 3 },
            ]}
          />
        ),
      },
      {
        label: '产权状况占有比例',
        content: getFieldDecorator('assetConditionPercent', {
          initialValue: assetConditionPercent,
          // rules: [{ required: true, message: '请输入数字', pattern: /^[0-9]*$/ }],
        })(<InputNumber precision={0} disabled={readOnly} parser={(c) => parseFloat(c).toFixed(2) || 0} min={0} max={100} step={0.01} />),
      },
    ];
    const otherInfo = [
      {
        label: '检测机构总面积',
        content: getFieldDecorator('totalArea', { initialValue: totalArea, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '检测室面积',
        content: getFieldDecorator('examRoomArea', { initialValue: examRoomArea, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '温恒面积',
        content: getFieldDecorator('thermostatRoom', { initialValue: thermostatRoom, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '户外检验场地面积',
        content: getFieldDecorator('outExamFloorSpace', { initialValue: outExamFloorSpace, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
      {
        label: '报告数量',
        content: getFieldDecorator('reportCount', { initialValue: reportCount, rules: createFormRules(true, null) })(
          <InputNumber precision={0} parser={(v) => Math.round(Number(v) || 0)} disabled={readOnly} />
        ),
      },
    ];

    const submit = () => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          const handleAddress = ({ cAndD, street }) => {
            if (cAndD === undefined && street === undefined) {
              return undefined
            }
            if (cAndD === undefined && street !== undefined) {
              return street
            }
            if (cAndD !== undefined && street === undefined) {
              return `${cAndD.join('>>')}`
            }
            return `${cAndD.join('>>')}>>${street}`
          }

          if (this.valueVerify(values)) {
            this.props.dispatch({
              type: 'Department/update',
              payLoad: {
                ...values,
                id: getPropsParams(this.props).id,
                orgAddr: handleAddress(values.orgAddr),
                unitAddr: handleAddress(values.unitAddr),
                departmentAddr: handleAddress(values.departmentAddr),
              },
              callBack: () => {
                history.back()
              },
            });
          }
        }
      });
    };

    const industrySelect = (value) => {
      this.props.form.setFieldsValue({
        industry: value
      })
      this.setState({ visible: false })
    }

    return (
      <Card title="检测机构基本信息">

        <Form>
          <Card title="检测机构基本信息">
            {FORM_ITEMS_BASE.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
          </Card>
          <Card title="所属法人单位信息">
            {FORM_ITEMS_LEGAL_ENTITY.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
          </Card>
          <Card title="主管部门信息">
            {FORM_ITEMS_COMPETENT_DEPARTMENT.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
          </Card>
          <Card title="类别及特点">
            {categoryAndSpecialty.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
          </Card>
          <Card title="检测机构资源信息">
            {orgSourceInfo.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
          </Card>
          <Card title="其他信息">
            {otherInfo.map(item => {
              return (
                <FormItem {...formLayout} key={item.label} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
            {
              <FormItem wrapperCol={{ offset: 7 }}>
                <div className="controlsContainer">
                  <Button
                    type="primary"
                    loading={this.props.loadingAdd}
                    onClick={() => {
                      submit();
                    }}
                  >
                    保存
                  </Button>
                </div>
              </FormItem>
            }
          </Card>
        </Form>

        <IndustryModal
          visible={visible}
          close={() => { this.setState({ visible: false }) }}
          industryInput={industrySelect}
        />
      </Card>
    );
  }
}

export default Form.create()(BaseInfo);
