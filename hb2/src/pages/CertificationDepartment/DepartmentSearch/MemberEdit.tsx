import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Input, Upload, Radio,Select } from 'antd';
import { connect } from 'dva';
import { createFormRules, orgId } from '@/utils/SystemUtil';
import { createSelectOptions} from '@/utils/AntdUtil'
import GlobalEnum from '@/Enums/GlobalEnum';
import { getPropsParams } from '@/utils/SystemUtil';
import ProfessionalTitleEnum from '@/Enums/ProfessionalTitleEnum'
import EducationDegreeEnum from '@/Enums/EducationDegreeEnum'

@connect(({ loading }) => ({
  loading
}))
class MemberEdit extends DefaultEditView {
  constructor(props) {
    super(props, "MemberDetail", '人员信息', {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
    this.setState({
      detail:true
    })
  }

  transFormValue(formValues) {
    // const { attachInfo } = formValues
    // const file = attachInfo ? attachInfo[0].response.entity[0] : {}
    return { ...formValues, orgId: getPropsParams(this.props).id }
  }

  createFormItemList() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const {
      name, sex, age, title, degree, major,majorAge,station,stationAge,remark
    } = this.state.orgData || {}

    return [
      {
        label: '姓名',
        content: getFieldDecorator('name', { initialValue: name, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '性别',
        content: getFieldDecorator('sex', { initialValue: sex, rules: createFormRules(true, null) })(
          <Radio.Group options={[{ label: '男', value: '1' }, { label: '女', value: '2' }]}  disabled allowClear={false}/>
        ),
      },
      {
        label: '年龄',
        content: getFieldDecorator('age', { initialValue: age, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '职称',
        content: getFieldDecorator('title', { initialValue: title, rules: createFormRules(true, null) })(
          <Select disabled allowClear={false}>{createSelectOptions(ProfessionalTitleEnum.ALL_LIST, ProfessionalTitleEnum.toString)}</Select>
        ),
      },
      {
        label: '文化程度',
        content: getFieldDecorator('degree', { initialValue: degree, rules: createFormRules(true, null) })(
          <Select disabled allowClear={false}>{createSelectOptions(EducationDegreeEnum.ALL_LIST, EducationDegreeEnum.toString)}</Select>
        ),
      },
      {
        label: '所学专业',
        content: getFieldDecorator('major', { initialValue: major, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '从事技术领域年限',
        content: getFieldDecorator('majorAge', { initialValue: majorAge, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '现在部门岗位',
        content: getFieldDecorator('station', { initialValue: station, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '本岗位年限',
        content: getFieldDecorator('stationAge', { initialValue: stationAge, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '备注',
        content: getFieldDecorator('remark', { initialValue: remark, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
    ];
  }
}

export default Form.create()(MemberEdit);